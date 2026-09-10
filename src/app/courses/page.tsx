"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Film,
  Plus,
  Clock,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Search,
  ArrowLeft,
  Calendar,
  Lock,
  ExternalLink,
  ShieldCheck,
  Video,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import BookingModal from "@/components/BookingModal";
import AppointmentsAdminModal from "@/components/AppointmentsAdminModal";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import { Course, Lesson, getCourses, fetchCoursesFromFirestore } from "@/lib/courses";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminInitialTab, setAdminInitialTab] = useState<"appointments" | "videos" | "new_course" | "guide">("videos");
  const [activeWatchCourse, setActiveWatchCourse] = useState<Course | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | undefined>(undefined);

  const refreshCourses = async () => {
    // Read local cache immediately
    const cached = getCourses();
    setCourses(cached);
    // Then sync with Firestore
    const live = await fetchCoursesFromFirestore();
    if (live && live.length > 0) {
      setCourses(live);
    }
  };

  useEffect(() => {
    refreshCourses();

    const handleCoursesUpdated = () => {
      refreshCourses();
    };

    window.addEventListener("courses_updated", handleCoursesUpdated);
    window.addEventListener("storage", handleCoursesUpdated);

    return () => {
      window.removeEventListener("courses_updated", handleCoursesUpdated);
      window.removeEventListener("storage", handleCoursesUpdated);
    };
  }, []);

  const categories = [
    { id: "all", label: "All Masterclasses" },
    { id: "anxiety", label: "Anxiety & Panic" },
    { id: "depression", label: "Depression & Burnout" },
    { id: "trauma", label: "Inner Child & Trauma" },
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCat = selectedCategory === "all" || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleWatchLesson = (course: Course, lessonId?: string) => {
    if (course.lessons.length === 0) {
      alert("No video lessons have been added to this course yet.  Maheen will be uploading them shortly!");
      return;
    }
    setActiveWatchCourse(course);
    setActiveLessonId(lessonId || course.lessons[0]?.id);
  };

  const handleOpenAdminStudio = () => {
    setAdminInitialTab("videos");
    setIsAdminOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-[#0e1411] text-[#edf4ef] selection:bg-[#2c4939] selection:text-[#cbdfd1]">
      {/* Navigation Header */}
      <Navbar
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenAdmin={() => {
          setAdminInitialTab("appointments");
          setIsAdminOpen(true);
        }}
      />

      {/* Hero Banner */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden border-b border-stone-800/80 bg-gradient-to-b from-[#131b17] via-[#0e1411] to-[#0e1411]">
        {/* Glow auroras */}
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-[#558d6e]/10 blur-3xl pointer-events-none animate-aura" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-[#815b94]/10 blur-3xl pointer-events-none animate-aura" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sanctuary Home</span>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#2c4939] text-[#a5c6af] border border-[#558d6e]/30">
                <Film className="w-3.5 h-3.5 text-[#d4af37]" />
                <span> Maheen's Clinical Video Masterclasses</span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Psychological Masterclasses & Courses
              </h1>
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                Empowering self-paced clinical video modules streamed securely from Google Drive. Master evidence-based coping protocols, understand psychological triggers, and heal at your own rhythm.
              </p>
            </div>

            {/* Admin Video Studio Lock Gateway (Password Protected) */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={handleOpenAdminStudio}
                className="px-4 py-2.5 rounded-full text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 hover:border-emerald-600 flex items-center gap-2 transition-all cursor-pointer shadow-md"
                title="Only  Maheen with Admin password can upload videos"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Video Studio</span>
              </button>

              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#558d6e] hover:bg-[#427256] text-white shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book 1-on-1 Session</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Category Filter Bar */}
      <section className="py-8 border-b border-stone-800 bg-[#111814]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#427256] text-white shadow-sm"
                    : "bg-stone-900 border border-stone-800 text-stone-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search masterclasses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
            />
          </div>
        </div>
      </section>

      {/* Masterclasses Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {filteredCourses.map((course) => {
            const hasLessons = Array.isArray(course.lessons) && course.lessons.length > 0;

            return (
              <div
                key={course.id}
                className="glass-card rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-xl space-y-8"
              >
                {/* Course Top Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#815b94]/20 text-[#d4bfdf] border border-[#815b94]/30">
                        {course.badge}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#558d6e]" />
                        {course.totalDuration} • {course.lessons.length} {course.lessons.length === 1 ? "Video Lesson" : "Video Lessons"}
                      </span>
                      <span className="text-xs text-[#a5c6af] font-medium hidden sm:inline">
                        • {course.level}
                      </span>
                    </div>

                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                      {course.title}
                    </h2>
                    <div className="text-xs font-semibold text-[#815b94] uppercase tracking-wider">
                      {course.tagline}
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                      {course.description}
                    </p>

                    {/* Learning Outcomes */}
                    <div className="pt-2 space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#558d6e]">
                        Core Takeaways:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {course.learningOutcomes.map((outcome, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-stone-300 flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#558d6e] shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Course Spotlight Card */}
                  <div className="lg:col-span-4 flex flex-col items-center">
                    <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 text-center w-full max-w-sm space-y-4">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-stone-700 bg-stone-950">
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          sizes="320px"
                          className="object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <button
                            onClick={() => handleWatchLesson(course)}
                            className="w-12 h-12 rounded-full bg-[#558d6e] hover:bg-[#427256] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            title={hasLessons ? "Play Masterclass" : "No videos added yet"}
                          >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleWatchLesson(course)}
                        className={`w-full py-3 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          hasLessons
                            ? "bg-gradient-to-r from-[#427256] to-[#815b94] hover:scale-105 active:scale-95 text-white"
                            : "bg-stone-800 text-stone-400 hover:text-white"
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>{hasLessons ? "Watch Video Lectures" : "Video Modules Uploading"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lesson Playlist Grid */}
                <div className="space-y-3 pt-4 border-t border-stone-800">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Video Lessons Streamed from Google Drive:
                    </div>
                    {!hasLessons && (
                      <button
                        onClick={handleOpenAdminStudio}
                        className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Admin: Upload Google Drive Video</span>
                      </button>
                    )}
                  </div>

                  {hasLessons ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {course.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          onClick={() => handleWatchLesson(course, lesson.id)}
                          className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-[#558d6e] hover:bg-stone-900 transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2c4939] text-[#a5c6af]">
                                {lesson.duration}
                              </span>
                              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                                <Film className="w-3 h-3" /> Drive Video
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-white group-hover:text-[#a5c6af] transition-colors leading-snug">
                              {lesson.title}
                            </h4>

                            <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">
                              {lesson.description}
                            </p>
                          </div>

                          <div className="pt-3 mt-2 border-t border-stone-800/60 flex items-center justify-between text-xs text-[#558d6e] font-semibold">
                            <span>Stream Lesson</span>
                            <Play className="w-3.5 h-3.5 fill-current group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-stone-950/60 border border-stone-800/80 text-center space-y-2">
                      <Film className="w-7 h-7 text-stone-600 mx-auto" />
                      <div className="text-xs text-stone-300 font-semibold">
                        No videos uploaded in this category yet.
                      </div>
                      <p className="text-[11px] text-stone-500 max-w-md mx-auto">
                         Maheen uploads clinical masterclass video lectures directly via the password-protected Admin Studio.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <Footer
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenAdmin={() => {
          setAdminInitialTab("appointments");
          setIsAdminOpen(true);
        }}
      />

      {/* Floating Action Dock */}
      <FloatingDock
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenBreathing={() => {}}
      />

      {/* Video Player Modal (Plays Google Drive video) */}
      <VideoPlayerModal
        isOpen={!!activeWatchCourse}
        onClose={() => setActiveWatchCourse(null)}
        course={activeWatchCourse}
        initialLessonId={activeLessonId}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Admin Modal */}
      <AppointmentsAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        initialTab={adminInitialTab}
        onCoursesUpdated={refreshCourses}
      />
    </main>
  );
}

