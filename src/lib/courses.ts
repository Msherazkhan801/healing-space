import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  googleDriveUrl: string;
  googleDriveFileId?: string;
  keyTakeaways: string[];
  worksheetTitle?: string;
  isFreePreview: boolean;
  createdAt?: string;
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  category: "anxiety" | "depression" | "trauma" | "relationships" | "mindfulness";
  level: "Beginner Friendly" | "Intermediate" | "Deep Transformational";
  totalDuration: string;
  badge: string;
  thumbnail: string;
  description: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  learningOutcomes: string[];
  lessons: Lesson[];
}

// Extract Google Drive File ID from any share URL, embed iframe, or direct string
export function extractGoogleDriveFileId(input: string): string {
  if (!input) return "";
  let str = input.trim();

  // If user pasted an entire iframe tag, e.g. <iframe src="https://drive.google.com/file/d/123/preview"...>
  const iframeSrcMatch = str.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    str = iframeSrcMatch[1];
  }

  // Match /file/d/FILE_ID/
  const fileDMatch = str.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Match open?id=FILE_ID or uc?id=FILE_ID
  const idParamMatch = str.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  // Match drive/folders/ if someone pastes folder (not a single file, but extract id)
  const folderMatch = str.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return folderMatch[1];
  }

  // If already pure alphanumeric ID (25+ characters typically)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(str)) {
    return str;
  }

  return "";
}

// Convert any Google Drive sharing link or file ID into a working embed URL
export function formatGoogleDriveEmbedUrl(urlOrId: string): string {
  if (!urlOrId) return "";

  const fileId = extractGoogleDriveFileId(urlOrId);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  const trimmed = urlOrId.trim();
  if (trimmed.includes("drive.google.com/file/d/") && trimmed.includes("/preview")) {
    return trimmed;
  }

  return trimmed;
}

// Clean Course Categories ready for Dr. Maheen's genuine Google Drive video uploads (NO dummy videos)
export const INITIAL_COURSES: Course[] = [
  {
    id: "mastering-anxiety-panic",
    title: "Mastering Anxiety & Panic Recovery",
    tagline: "Evidence-Based CBT & Somatic Grounding Masterclass",
    category: "anxiety",
    level: "Beginner Friendly",
    totalDuration: "Self-Paced",
    badge: "Specialization",
    thumbnail: "/images/nature.jpg",
    description:
      "Clinical psychological video modules by Dr. Maheen focusing on understanding the amygdala, stopping panic attacks rapidly, and challenging catastrophic thoughts.",
    instructor: {
      name: "Dr. Maheen",
      title: "Clinical Psychologist",
      avatar: "/images/therapist.jpg",
    },
    learningOutcomes: [
      "Understand the physiological neurobiology of panic & hyperventilation",
      "Master the 4-7-8 and physiological double-sigh vagal nerve techniques",
      "Learn CBT cognitive restructuring to defuse anxiety spirals",
      "Formulate a customized emergency anxiety grounding protocol",
    ],
    lessons: [],
  },
  {
    id: "overcoming-depression-burnout",
    title: "Overcoming Depressive Fatigue & Burnout",
    tagline: "Restoring Motivation, Daily Rhythms & Self-Compassion",
    category: "depression",
    level: "Deep Transformational",
    totalDuration: "Self-Paced",
    badge: "Evidence-Based",
    thumbnail: "/images/therapist.jpg",
    description:
      "Gentle, structured psychological video lectures to dismantle depressive rumination, overcome emotional exhaustion, and rebuild vitality step-by-step.",
    instructor: {
      name: "Dr. Maheen",
      title: "Clinical Psychologist",
      avatar: "/images/therapist.jpg",
    },
    learningOutcomes: [
      "Break depressive rumination loops without toxic positivity",
      "Implement behavioral activation micro-steps to rekindle energy",
      "Replace harsh self-criticism with restorative self-compassion",
    ],
    lessons: [],
  },
  {
    id: "inner-child-trauma-healing",
    title: "Inner Child Healing & Emotional Safety",
    tagline: "Healing Attachment Wounds & Reclaiming Self-Worth",
    category: "trauma",
    level: "Deep Transformational",
    totalDuration: "Self-Paced",
    badge: "Deep Healing",
    thumbnail: "/images/nature.jpg",
    description:
      "A compassionate clinical exploration of attachment styles, unmasking childhood triggers, releasing somatic guilt, and cultivating lasting inner security.",
    instructor: {
      name: "Dr. Maheen",
      title: "Clinical Psychologist",
      avatar: "/images/therapist.jpg",
    },
    learningOutcomes: [
      "Map present-day triggers to historical attachment wounds",
      "Practice gentle somatic reparenting dialogues with your inner child",
      "Cultivate a secure, loving relationship with your authentic self",
    ],
    lessons: [],
  },
];

// Cache key - v4 ensures any old dummy video cache is discarded
const LOCAL_STORAGE_COURSES_KEY = "the_healing_space_courses_v4";

// Retrieve courses (from local cache or initial clean state)
export function getCourses(): Course[] {
  if (typeof window === "undefined") return INITIAL_COURSES;
  try {
    // Clear any previous legacy cache keys with dummy videos
    localStorage.removeItem("the_healing_space_courses_v1");
    localStorage.removeItem("the_healing_space_courses_v2");
    localStorage.removeItem("the_healing_space_courses_v3");

    const raw = localStorage.getItem(LOCAL_STORAGE_COURSES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Filter out any lessons that don't have valid Google Drive URLs if any dummy remained
      const cleaned = parsed.map((course: Course) => ({
        ...course,
        lessons: Array.isArray(course.lessons)
          ? course.lessons.filter((l) => l.googleDriveUrl && l.googleDriveUrl.includes("drive.google.com"))
          : [],
      }));
      return cleaned;
    }
    return INITIAL_COURSES;
  } catch (err) {
    console.error("Failed to read courses from storage:", err);
    return INITIAL_COURSES;
  }
}

// Fetch live from Firestore
export async function fetchCoursesFromFirestore(): Promise<Course[]> {
  if (db) {
    try {
      const q = query(collection(db, "courses"));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const firestoreCourses: Course[] = [];
        querySnapshot.forEach((d) => {
          firestoreCourses.push({ ...d.data(), id: d.id } as Course);
        });
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(firestoreCourses));
        }
        return firestoreCourses;
      }
    } catch (err) {
      console.warn("Firestore courses fetch error, using local data:", err);
    }
  }
  return getCourses();
}

// Add a new video lesson to a course
export async function addGoogleDriveLessonToCourse(
  courseId: string,
  lesson: Omit<Lesson, "id">
): Promise<Course[]> {
  let list = getCourses();
  let target = list.find((c) => c.id === courseId);
  
  if (!target && INITIAL_COURSES.find((c) => c.id === courseId)) {
    list = [...INITIAL_COURSES];
    target = list.find((c) => c.id === courseId);
  }

  if (target) {
    const fileId = extractGoogleDriveFileId(lesson.googleDriveUrl);
    const embedUrl = formatGoogleDriveEmbedUrl(lesson.googleDriveUrl);

    const newLesson: Lesson = {
      ...lesson,
      id: "lesson-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      googleDriveUrl: embedUrl,
      googleDriveFileId: fileId,
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(target.lessons)) {
      target.lessons = [];
    }

    target.lessons.push(newLesson);

    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(list));
      // Dispatch custom storage event for instant multi-component reactivity
      window.dispatchEvent(new Event("courses_updated"));
    }

    if (db) {
      try {
        await setDoc(doc(db, "courses", target.id), {
          ...target,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Firestore lesson addition error:", err);
      }
    }
  }
  return list;
}

// Delete a video lesson from a course
export async function deleteLessonFromCourse(
  courseId: string,
  lessonId: string
): Promise<Course[]> {
  const list = getCourses();
  const target = list.find((c) => c.id === courseId);
  if (target) {
    target.lessons = target.lessons.filter((l) => l.id !== lessonId);

    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("courses_updated"));
    }

    if (db) {
      try {
        await setDoc(doc(db, "courses", target.id), {
          ...target,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Firestore lesson deletion error:", err);
      }
    }
  }
  return list;
}

// Create a new Course
export async function createCourse(
  courseData: Omit<Course, "id" | "lessons">
): Promise<Course[]> {
  const list = getCourses();
  const newCourse: Course = {
    ...courseData,
    id: "course-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    lessons: [],
  };
  list.push(newCourse);

  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("courses_updated"));
  }

  if (db) {
    try {
      await setDoc(doc(db, "courses", newCourse.id), {
        ...newCourse,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore course creation error:", err);
    }
  }

  return list;
}

