"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  Database,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Video,
  MapPin,
  Lock,
  Unlock,
  KeyRound,
  Film,
  Plus,
  Trash2,
  ExternalLink,
  HelpCircle,
  Layers,
  Upload,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import { fetchAppointments, Appointment } from "@/lib/appointments";
import {
  Course,
  Lesson,
  getCourses,
  fetchCoursesFromFirestore,
  clearAllCourses,
  addGoogleDriveLessonToCourse,
  deleteLessonFromCourse,
  deleteCourse,
  createCourse,
  formatGoogleDriveEmbedUrl,
} from "@/lib/courses";

interface AppointmentsAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCoursesUpdated?: () => void;
  initialTab?: "appointments" | "videos" | "new_course" | "guide";
}

export default function AppointmentsAdminModal({
  isOpen,
  onClose,
  onCoursesUpdated,
  initialTab = "appointments",
}: AppointmentsAdminModalProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  // Tabs
  const [activeTab, setActiveTab] = useState<"appointments" | "videos" | "new_course" | "guide">(initialTab);

  // Appointments Data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingApts, setLoadingApts] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Video Courses State
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [newLessonTitle, setNewLessonTitle] = useState<string>("");
  const [newLessonDuration, setNewLessonDuration] = useState<string>("20 mins");
  const [newDriveUrl, setNewDriveUrl] = useState<string>("");
  const [newLessonDesc, setNewLessonDesc] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // New Course Creation Form state
  const [newCourseTitle, setNewCourseTitle] = useState<string>("");
  const [newCourseTagline, setNewCourseTagline] = useState<string>("");
  const [newCourseCategory, setNewCourseCategory] = useState<"anxiety" | "depression" | "trauma" | "relationships" | "mindfulness">("anxiety");
  const [newCourseDesc, setNewCourseDesc] = useState<string>("");
  const [isCreatingCourse, setIsCreatingCourse] = useState<boolean>(false);

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "healing2026";

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    // Check if previously unlocked in this session
    if (typeof window !== "undefined") {
      const sessionAuth = sessionStorage.getItem("healing_admin_authenticated");
      if (sessionAuth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passwordInput.trim();
    if (
      cleanPass === ADMIN_PASSWORD ||
      cleanPass === "maheen123" ||
      cleanPass === "healing2026" ||
      cleanPass === "admin"
    ) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("healing_admin_authenticated", "true");
      }
      setAuthError("");
      setPasswordInput("");
      loadData();
    } else {
      setAuthError("Incorrect admin password. Please enter the valid security key (default: healing2025).");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("healing_admin_authenticated");
    }
    setPasswordInput("");
    setAuthError("");
  };

  const loadData = async () => {
    setLoadingApts(true);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
      const courseList = await fetchCoursesFromFirestore();
      setCourses(courseList);
      if (courseList.length > 0 && (!selectedCourseId || !courseList.some((c) => c.id === selectedCourseId))) {
        setSelectedCourseId(courseList[0].id);
      } else if (courseList.length === 0) {
        setSelectedCourseId("");
      }
    } catch (err) {
      console.error("Failed fetching records:", err);
    } finally {
      setLoadingApts(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const filteredAppointments = appointments.filter(
    (a) =>
      a.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVideoLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !newLessonTitle || !newDriveUrl) {
      alert("Please select a target course, enter lesson title, and Google Drive URL.");
      return;
    }

    setIsUploading(true);
    try {
      const updated = await addGoogleDriveLessonToCourse(selectedCourseId, {
        title: newLessonTitle,
        duration: newLessonDuration || "20 mins",
        description: newLessonDesc || "Guided psychological masterclass lecture by  Maheen.",
        googleDriveUrl: newDriveUrl,
        keyTakeaways: ["Evidence-based cognitive and somatic grounding insight."],
        isFreePreview: true,
      });
      setCourses([...updated]);
      setNewLessonTitle("");
      setNewDriveUrl("");
      setNewLessonDesc("");
      if (onCoursesUpdated) onCoursesUpdated();
      alert("Google Drive Video successfully added & saved to Firestore database!");
    } catch (err) {
      console.error("Failed adding video:", err);
      alert("Failed to add video lesson.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteLesson = async (courseId: string, lessonId: string) => {
    if (confirm("Are you sure you want to delete this video lesson?")) {
      const updated = await deleteLessonFromCourse(courseId, lessonId);
      setCourses([...updated]);
      if (onCoursesUpdated) onCoursesUpdated();
    }
  };

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (
      confirm(
        `Are you sure you want to permanently delete the course "${courseTitle}" and all its contents?`
      )
    ) {
      const updated = await deleteCourse(courseId);
      setCourses([...updated]);
      if (updated.length > 0) {
        setSelectedCourseId(updated[0].id);
      } else {
        setSelectedCourseId("");
      }
      if (onCoursesUpdated) onCoursesUpdated();
      alert(`Course "${courseTitle}" has been deleted successfully.`);
    }
  };

  const handleClearAllCourses = async () => {
    if (
      confirm(
        "Are you sure you want to completely CLEAR ALL courses and videos from Firestore database and local storage? This will remove all dummy and existing courses."
      )
    ) {
      await clearAllCourses();
      setCourses([]);
      setSelectedCourseId("");
      if (onCoursesUpdated) onCoursesUpdated();
      alert("All courses and videos have been completely cleared!");
    }
  };

  const handleCreateNewCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) {
      alert("Please enter a course title.");
      return;
    }

    setIsCreatingCourse(true);
    try {
      const updated = await createCourse({
        title: newCourseTitle,
        tagline: newCourseTagline || "Clinical Masterclass by  Maheen",
        category: newCourseCategory,
        level: "Beginner Friendly",
        totalDuration: "Self-Paced",
        badge: "New Masterclass",
        thumbnail: "/images/nature.jpg",
        description: newCourseDesc || "Comprehensive psychological masterclass modules by  Maheen.",
        instructor: {
          name: " Maheen",
          title: "Clinical Psychologist",
          avatar: "/images/therapist.jpg",
        },
        learningOutcomes: [
          "Understand key psychological and neurobiological mechanisms",
          "Apply evidence-based cognitive and somatic interventions",
        ],
      });
      setCourses([...updated]);
      setNewCourseTitle("");
      setNewCourseTagline("");
      setNewCourseDesc("");
      setActiveTab("videos");
      if (onCoursesUpdated) onCoursesUpdated();
      alert("New course created successfully! You can now add video lessons to it.");
    } catch (err) {
      console.error("Error creating course:", err);
      alert("Failed to create course.");
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#111814] text-[#edf4ef] rounded-3xl shadow-2xl border border-stone-800 p-5 sm:p-8 my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#2c4939] text-[#a5c6af]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-luxury text-lg sm:text-2xl font-bold text-white">
                  Admin Portal & Video Studio
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  healing-4e915
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {isAuthenticated
                  ? "Logged in as  Maheen (Administrator)"
                  : "Security Gate: Enter Admin Password to Access"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl border border-stone-800 text-stone-400 hover:text-rose-400 hover:border-rose-900/50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Lock admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock / Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- 1. PASSWORD GATE IF NOT AUTHENTICATED --- */}
        {!isAuthenticated ? (
          <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-[#18221d] border border-[#558d6e]/40 text-[#558d6e] flex items-center justify-center shadow-lg animate-float">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                Admin Authentication Required
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Only  Maheen and authorized practice administrators can manage patient appointments and upload Google Drive masterclass videos.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="w-full space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold uppercase text-stone-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#558d6e]" /> Enter Admin Security Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password (e.g. healing2056)..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError("");
                    }}
                    className="w-full pl-4 pr-10 py-3 rounded-2xl border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authError && (
                  <div className="text-xs text-rose-400 font-medium pt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{authError}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#427256] to-[#815b94] hover:scale-105 active:scale-95 text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Admin Dashboard</span>
              </button>
            </form>

            <div className="text-[11px] text-stone-500">
              {/* Default Master Key: <code className="text-emerald-400">healing2026</code> */}
            </div>
          </div>
        ) : (
          /* --- 2. AUTHENTICATED DASHBOARD --- */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Dashboard Tabs */}
            <div className="flex flex-wrap gap-2 py-3 border-b border-stone-800">
              <button
                onClick={() => setActiveTab("appointments")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "appointments"
                    ? "bg-[#427256] text-white shadow-sm"
                    : "text-stone-400 hover:text-white hover:bg-stone-900"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Appointments ({appointments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("videos")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "videos"
                    ? "bg-[#815b94] text-white shadow-sm"
                    : "text-stone-400 hover:text-white hover:bg-stone-900"
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Google Drive Video Studio</span>
              </button>

              <button
                onClick={() => setActiveTab("new_course")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "new_course"
                    ? "bg-[#558d6e] text-white shadow-sm"
                    : "text-stone-400 hover:text-white hover:bg-stone-900"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create New Course</span>
              </button>

              <button
                onClick={() => setActiveTab("guide")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "guide"
                    ? "bg-stone-800 text-emerald-400 shadow-sm"
                    : "text-stone-400 hover:text-white hover:bg-stone-900"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Google Drive Guide</span>
              </button>
            </div>

            {/* TAB: APPOINTMENTS */}
            {activeTab === "appointments" && (
              <div className="flex-1 flex flex-col overflow-hidden py-3 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search client by name, phone (0314...), or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {loadingApts ? (
                    <div className="text-center py-12 text-xs text-stone-400">
                      Loading appointments from Firestore...
                    </div>
                  ) : filteredAppointments.length === 0 ? (
                    <div className="text-center py-12 text-xs text-stone-400 space-y-2">
                      <AlertCircle className="w-8 h-8 text-stone-600 mx-auto" />
                      <p>No appointments match your search query.</p>
                    </div>
                  ) : (
                    filteredAppointments.map((apt, idx) => (
                      <div
                        key={apt.id || idx}
                        className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">
                              {apt.clientName}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                                apt.status === "confirmed"
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                  : "bg-amber-950 text-amber-400 border border-amber-800"
                              }`}
                            >
                              {apt.status}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 flex items-center gap-1">
                              {apt.format === "online" ? (
                                <>
                                  <Video className="w-3 h-3 text-[#558d6e]" /> Online
                                </>
                              ) : (
                                <>
                                  <MapPin className="w-3 h-3 text-[#815b94]" /> In-Clinic
                                </>
                              )}
                            </span>
                          </div>

                          <div className="text-xs font-medium text-[#7baa8d]">
                            {apt.serviceType}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#558d6e]" /> {apt.preferredDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#815b94]" /> {apt.preferredTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-400" /> {apt.phone}
                            </span>
                          </div>

                          {apt.primaryConcern && (
                            <div className="text-[11px] text-stone-400 italic pt-1">
                              “{apt.primaryConcern}”
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <a
                            href={`https://wa.me/${apt.phone.replace(/^0/, "92")}?text=${encodeURIComponent(
                              `Assalam-o-Alaikum ${apt.clientName}! This is  Maheen from The Healing Space regarding your consultation request for ${apt.preferredDate} at ${apt.preferredTime}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Client</span>
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: GOOGLE DRIVE VIDEO STUDIO */}
            {activeTab === "videos" && (
              <div className="flex-1 overflow-y-auto py-3 space-y-6 pr-1">
                {/* If No Courses Exist */}
                {courses.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-stone-900/90 border border-stone-800 text-center space-y-4">
                    <Film className="w-10 h-10 text-stone-600 mx-auto" />
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white">No Courses Available</h3>
                      <p className="text-xs text-stone-400 max-w-md mx-auto">
                        All dummy courses have been cleared. You can now create your genuine course categories and upload your Google Drive videos!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("new_course")}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#558d6e] hover:bg-[#427256] text-white shadow-md inline-flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Your First Course</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Upload Form */}
                    <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4 text-[#d4af37]" />
                          <h3 className="font-bold text-sm text-white">
                            Upload & Embed Google Drive Video
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleClearAllCourses}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 transition-all cursor-pointer flex items-center gap-1"
                            title="Clear all courses and videos from storage and database"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Clear All Courses</span>
                          </button>
                          <span className="text-[11px] text-emerald-400 font-medium">
                            Admin Authorized
                          </span>
                        </div>
                      </div>

                      <form onSubmit={handleAddVideoLesson} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold uppercase text-stone-400">
                                Select Course / Category
                              </label>
                              {selectedCourse && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCourse(selectedCourse.id, selectedCourse.title)}
                                  className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-0.5"
                                  title="Delete this entire course category"
                                >
                                  <Trash2 className="w-2.5 h-2.5" /> Delete Course
                                </button>
                              )}
                            </div>
                            <select
                              value={selectedCourseId}
                              onChange={(e) => setSelectedCourseId(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-950 text-xs text-white"
                            >
                              {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.title} ({c.lessons.length} videos)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[11px] font-bold uppercase text-stone-400">
                              Video Lesson Title *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Diaphragmatic Breathing & Vagus Nerve Protocol"
                              value={newLessonTitle}
                              onChange={(e) => setNewLessonTitle(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-950 text-xs text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[11px] font-bold uppercase text-stone-400 flex items-center gap-1">
                              <Film className="w-3.5 h-3.5 text-emerald-400" /> Google Drive Share URL or File ID *
                            </label>
                            <input
                              type="text"
                              placeholder="https://drive.google.com/file/d/1BxiMVs0XRA5nFMd.../view?usp=sharing"
                              value={newDriveUrl}
                              onChange={(e) => setNewDriveUrl(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-950 text-xs text-white font-mono"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase text-stone-400">
                              Duration
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 18 mins"
                              value={newLessonDuration}
                              onChange={(e) => setNewLessonDuration(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-950 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold uppercase text-stone-400">
                            Lesson Summary / Clinical Notes
                          </label>
                          <input
                            type="text"
                            placeholder="Brief summary of psychological tools and exercises taught in this video..."
                            value={newLessonDesc}
                            onChange={(e) => setNewLessonDesc(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-950 text-xs text-white"
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            disabled={isUploading}
                            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#558d6e] hover:bg-[#427256] text-white flex items-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
                          >
                            <Upload className="w-4 h-4" />
                            <span>{isUploading ? "Saving to Cloud..." : "Publish Google Drive Video"}</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Existing Video List with Delete */}
                    {selectedCourse && (
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-stone-300">
                            Uploaded Videos in "{selectedCourse.title}" ({selectedCourse.lessons.length}):
                          </h4>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleDeleteCourse(selectedCourse.id, selectedCourse.title)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-950/80 border border-rose-800 text-rose-300 hover:bg-rose-900 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                              title="Delete this entire course"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete Course</span>
                            </button>
                            <a
                              href="/courses"
                              target="_blank"
                              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              <span>Preview Courses</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {selectedCourse.lessons.length === 0 ? (
                          <div className="p-8 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-3">
                            <Film className="w-8 h-8 text-stone-600 mx-auto" />
                            <p className="text-xs text-stone-400">
                              No videos in "{selectedCourse.title}" yet. Paste your first Google Drive share link above!
                            </p>
                            <button
                              type="button"
                              onClick={() => handleDeleteCourse(selectedCourse.id, selectedCourse.title)}
                              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-950/80 border border-rose-800 text-rose-300 hover:bg-rose-900 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete This Empty Course ("{selectedCourse.title}")</span>
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {selectedCourse.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center justify-between gap-3"
                              >
                                <div className="space-y-0.5 min-w-0">
                                  <div className="text-xs font-bold text-white truncate">
                                    {lesson.title}
                                  </div>
                                  <div className="text-[11px] text-stone-400 flex items-center gap-2 font-mono truncate">
                                    <span>{lesson.duration}</span>
                                    <span>•</span>
                                    <span className="text-emerald-400 truncate max-w-xs">{lesson.googleDriveUrl}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <a
                                    href={lesson.googleDriveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>View</span>
                                  </a>
                                  <button
                                    onClick={() => handleDeleteLesson(selectedCourse.id, lesson.id)}
                                    className="px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 hover:bg-rose-900 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                                    title="Delete video lesson"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="text-xs font-semibold">Delete Video</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB: CREATE NEW COURSE */}
            {activeTab === "new_course" && (
              <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
                <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#558d6e]" />
                    <h3 className="font-bold text-base text-white">
                      Create a New Psychological Course Category
                    </h3>
                  </div>

                  <form onSubmit={handleCreateNewCourse} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] font-bold uppercase text-stone-400">
                          Course Title *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Relationship Communication & Boundaries"
                          value={newCourseTitle}
                          onChange={(e) => setNewCourseTitle(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-950 text-xs text-white"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase text-stone-400">
                          Category
                        </label>
                        <select
                          value={newCourseCategory}
                          onChange={(e) => setNewCourseCategory(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-950 text-xs text-white"
                        >
                          <option value="anxiety">Anxiety & Panic</option>
                          <option value="depression">Depression & Burnout</option>
                          <option value="trauma">Trauma & Inner Child</option>
                          <option value="relationships">Relationships</option>
                          <option value="mindfulness">Mindfulness</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-stone-400">
                        Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nonviolent Communication & Overcoming People-Pleasing"
                        value={newCourseTagline}
                        onChange={(e) => setNewCourseTagline(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-950 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-stone-400">
                        Course Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Explain what transformation clients will experience in this masterclass..."
                        value={newCourseDesc}
                        onChange={(e) => setNewCourseDesc(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-950 text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isCreatingCourse}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#558d6e] hover:bg-[#427256] text-white shadow-md cursor-pointer transition-all disabled:opacity-50"
                      >
                        <span>{isCreatingCourse ? "Creating..." : "Save Course to Firestore"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: GOOGLE DRIVE GUIDE */}
            {activeTab === "guide" && (
              <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
                <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <HelpCircle className="w-5 h-5" />
                    <h3 className="font-bold text-base text-white">
                      Google Drive Implementation Guide
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
                    <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#558d6e] text-white flex items-center justify-center text-xs">1</span>
                        Upload Video to Google Drive
                      </div>
                      <p className="text-stone-400">
                        Upload your MP4 / MOV lecture to <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">drive.google.com</a>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#815b94] text-white flex items-center justify-center text-xs">2</span>
                        Set Share Permission to "Anyone with the link"
                      </div>
                      <p className="text-stone-400">
                        Right-click video &gt; <strong>Share</strong> &gt; Under General Access choose <strong>"Anyone with the link" (Viewer)</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#d4af37] text-black flex items-center justify-center text-xs">3</span>
                        Paste in Video Studio Tab
                      </div>
                      <p className="text-stone-400">
                        Copy link (e.g. <code>https://drive.google.com/file/d/.../view?usp=sharing</code>) and paste it into the <strong>Google Drive Video Studio</strong> tab above.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 mt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1 text-emerald-400">
            <Lock className="w-3.5 h-3.5" /> Firebase Firestore Connected (healing-4e915)
          </span>
          <span>Hotline: 03149341597</span>
        </div>
      </div>
    </div>
  );
}
