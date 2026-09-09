import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Appointment {
  id?: string;
  clientName: string;
  phone: string;
  email?: string;
  serviceType: string;
  format: "online" | "in-person";
  preferredDate: string;
  preferredTime: string;
  primaryConcern?: string;
  notes?: string;
  screenerScore?: number | null;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  createdAt?: string | Date | Timestamp;
}

export interface TherapyService {
  id: string;
  title: string;
  category: "individual" | "mood" | "growth" | "relationships";
  duration: string;
  badge: string;
  icon: string;
  summary: string;
  description: string;
  modalities: string[];
  benefits: string[];
}

export const THERAPY_SERVICES: TherapyService[] = [
  {
    id: "individual-psychotherapy",
    title: "Individual Psychotherapy & Counselling",
    category: "individual",
    duration: "50-60 Mins",
    badge: "Most Popular",
    icon: "HeartHandshake",
    summary: "One-on-one tailored clinical counselling to explore your thoughts, feelings, and life challenges in a confidential sanctuary.",
    description: "A secure, non-judgmental space designed to help you process emotional pain, untangle complex thoughts, and develop sustainable coping mechanisms for everyday life.",
    modalities: ["Cognitive Behavioral Therapy (CBT)", "Person-Centered Therapy", "Acceptance & Commitment (ACT)"],
    benefits: ["Clarity on emotional patterns", "Healthy boundary setting", "Self-compassion & emotional regulation"],
  },
  {
    id: "anxiety-panic-management",
    title: "Anxiety, Stress & Panic Management",
    category: "mood",
    duration: "50 Mins",
    badge: "Evidence-Based",
    icon: "ShieldAlert",
    summary: "Targeted evidence-based protocols to conquer chronic worry, social anxiety, panic attacks, and somatic stress.",
    description: "Learn how the nervous system reacts to stress and master cognitive restructuring and somatic grounding tools to regain control over racing thoughts.",
    modalities: ["Exposure & Response Prevention", "Mindfulness-Based Stress Reduction", "Somatic Grounding"],
    benefits: ["Rapid panic de-escalation tools", "Reduction of catastrophic thinking", "Restored nervous system calm"],
  },
  {
    id: "depression-mood-restoration",
    title: "Depression & Mood Restoration",
    category: "mood",
    duration: "50 Mins",
    badge: "Compassionate",
    icon: "SunMedium",
    summary: "Gentle, structured support to lift the weight of depressive episodes, low motivation, burnout, and emotional fatigue.",
    description: "Rebuild vitality, rediscover meaning, and dismantle depressive rumination loops with compassionate behavioral activation and cognitive therapy.",
    modalities: ["Behavioral Activation", "Cognitive Restructuring", "Compassion-Focused Therapy"],
    benefits: ["Rebuilding daily rhythm & energy", "Overcoming hopelessness & self-criticism", "Finding joyful engagement in life"],
  },
  {
    id: "trauma-inner-child",
    title: "Trauma & Inner Child Healing",
    category: "growth",
    duration: "60 Mins",
    badge: "Deep Healing",
    icon: "Sparkles",
    summary: "Trauma-informed processing to heal past emotional wounds, adverse childhood experiences, and relational triggers.",
    description: "Honor your life story, gently process past traumatic imprints, and cultivate unconditional love and safety for your inner child.",
    modalities: ["Trauma-Informed CBT", "Inner Child Dialogue", "Attachment-Focused Therapy"],
    benefits: ["Releasing emotional heaviness", "Healing attachment insecurities", "Reclaiming your authentic self-worth"],
  },
  {
    id: "relationship-family-counselling",
    title: "Relationship & Interpersonal Growth",
    category: "relationships",
    duration: "60 Mins",
    badge: "Connection",
    icon: "Users",
    summary: "Navigate relationship roadblocks, communication breakdowns, boundary conflicts, and emotional detachment.",
    description: "Develop emotionally intelligent communication, break repetitive conflict cycles, and nurture fulfilling bonds with loved ones.",
    modalities: ["Emotionally Focused Therapy (EFT)", "Nonviolent Communication", "Systemic Family Concepts"],
    benefits: ["Clear, vulnerable communication", "Restoring emotional intimacy & trust", "Navigating family dynamics"],
  },
  {
    id: "young-adult-transitions",
    title: "Teen & Young Adult Life Transitions",
    category: "growth",
    duration: "50 Mins",
    badge: "Growth",
    icon: "GraduationCap",
    summary: "Specialized guidance for students and young adults navigating academic pressure, identity, career anxiety, and independence.",
    description: "Empowering young minds with emotional resilience, confidence, and self-direction during vital formative transitions.",
    modalities: ["ACT for Youth", "Solution-Focused Brief Therapy", "Confidence Building"],
    benefits: ["Reduced academic & career anxiety", "Strong sense of identity & purpose", "Decision-making confidence"],
  },
];

export const TIME_SLOTS = [
  "10:00 AM - 11:00 AM",
  "11:30 AM - 12:30 PM",
  "02:00 PM - 03:00 PM",
  "03:30 PM - 04:30 PM",
  "05:00 PM - 06:00 PM",
  "06:30 PM - 07:30 PM",
  "08:00 PM - 09:00 PM",
];

const LOCAL_STORAGE_KEY = "the_healing_space_appointments";

// Helper to get local demo appointments
export function getLocalAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      // Seed with sample initial records
      const initial: Appointment[] = [
        {
          id: "demo-1",
          clientName: "Ayesha Malik",
          phone: "03123456789",
          email: "ayesha@example.com",
          serviceType: "Individual Psychotherapy & Counselling",
          format: "online",
          preferredDate: "2026-09-12",
          preferredTime: "05:00 PM - 06:00 PM",
          primaryConcern: "Managing workplace stress and balancing family expectations.",
          status: "confirmed",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "demo-2",
          clientName: "Hamza Tariq",
          phone: "03009876543",
          email: "hamza@example.com",
          serviceType: "Anxiety, Stress & Panic Management",
          format: "in-person",
          preferredDate: "2026-09-14",
          preferredTime: "06:30 PM - 07:30 PM",
          primaryConcern: "Frequent panic sensations before public speaking.",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Local storage read error", err);
    return [];
  }
}

// Save an appointment to Firestore with fallback to LocalStorage
export async function bookAppointment(
  data: Omit<Appointment, "id" | "createdAt" | "status">
): Promise<{ success: boolean; id: string; isFirestore: boolean; message: string }> {
  const newAppointment: Appointment = {
    ...data,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  // Attempt saving to Firebase Firestore first
  if (db) {
    try {
      const docRef = await addDoc(collection(db, "appointments"), {
        ...newAppointment,
        createdAt: serverTimestamp(),
      });
      // Also update local storage for instant offline resilience
      saveToLocalCache({ ...newAppointment, id: docRef.id });
      return {
        success: true,
        id: docRef.id,
        isFirestore: true,
        message: "Your appointment has been securely recorded in Dr. Maheen's Firestore database!",
      };
    } catch (firestoreError) {
      console.warn("Firestore write fell back to local storage:", firestoreError);
    }
  }

  // Local storage fallback if Firestore is offline or credentials not yet active
  const fallbackId = "apt-" + Math.random().toString(36).substring(2, 9);
  const createdWithId = { ...newAppointment, id: fallbackId };
  saveToLocalCache(createdWithId);

  return {
    success: true,
    id: fallbackId,
    isFirestore: false,
    message: "Appointment saved locally & WhatsApp confirmation prepared!",
  };
}

function saveToLocalCache(appointment: Appointment) {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalAppointments();
    list.unshift(appointment);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Failed saving to local storage", err);
  }
}

// Fetch appointments (from Firestore or LocalStorage)
export async function fetchAppointments(): Promise<Appointment[]> {
  if (db) {
    try {
      const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"), limit(50));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const firestoreList: Appointment[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Appointment;
          firestoreList.push({
            ...data,
            id: doc.id,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
          });
        });
        return firestoreList;
      }
    } catch (err) {
      console.warn("Firestore read fallback to local cache:", err);
    }
  }
  return getLocalAppointments();
}

// Generate direct WhatsApp booking link with pre-filled professional message
export function generateWhatsAppBookingLink(data: Partial<Appointment>): string {
  const phone = "923149341597"; // 03149341597 internationalized for WhatsApp
  const textLines = [
    `Assalam-o-Alaikum / Hello Dr. Maheen! 🌿`,
    `I would like to book a psychology counselling session at The Healing Space.`,
    ``,
    `📋 *Booking Details:*`,
    `• *Name:* ${data.clientName || "Client"}`,
    `• *Service:* ${data.serviceType || "Individual Psychotherapy"}`,
    `• *Format:* ${data.format === "online" ? "Online Video Call" : "In-Person Clinic Session"}`,
    `• *Preferred Date:* ${data.preferredDate || "Earliest available"}`,
    `• *Preferred Time:* ${data.preferredTime || "Flexible"}`,
    data.primaryConcern ? `• *Primary Focus:* ${data.primaryConcern}` : null,
    data.screenerScore !== undefined && data.screenerScore !== null ? `• *Wellness Screener Score:* ${data.screenerScore}/12` : null,
    ``,
    `Please let me know the confirmation and payment/consultation details. Thank you! 💙`,
  ].filter(Boolean);

  const encodedText = encodeURIComponent(textLines.join("\n"));
  return `https://wa.me/${phone}?text=${encodedText}`;
}
