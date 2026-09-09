"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Play,
  CheckCircle2,
  FileText,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Download,
  Lock,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Course, Lesson, formatGoogleDriveEmbedUrl } from "@/lib/courses";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  initialLessonId?: string;
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  course,
  initialLessonId,
}: VideoPlayerModalProps) {
  const [activeLessonId, setActiveLessonId] = useState<string>(
    initialLessonId || (course?.lessons[0]?.id ?? "")
  );

  React.useEffect(() => {
    if (initialLessonId) {
      setActiveLessonId(initialLessonId);
    } else if (course?.lessons && course.lessons.length > 0) {
      setActiveLessonId(course.lessons[0].id);
    }
  }, [initialLessonId, course]);

  if (!isOpen || !course) return null;

  const activeLesson =
    course.lessons.find((l) => l.id === activeLessonId) || course.lessons[0];

  const embedUrl = activeLesson ? formatGoogleDriveEmbedUrl(activeLesson.googleDriveUrl) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#111814] text-[#edf4ef] rounded-3xl shadow-2xl border border-stone-800 p-4 sm:p-6 my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2c4939] text-[#a5c6af] flex items-center justify-center font-bold">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#815b94]">
                {course.title}
              </div>
              <h2 className="font-serif-luxury text-base sm:text-xl font-bold text-white">
                {activeLesson?.title || "Masterclass Video Player"}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-all cursor-pointer"
            aria-label="Close video player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 flex-1 overflow-y-auto pr-1">
          {/* Main Video Frame & Notes Column */}
          <div className="lg:col-span-8 space-y-4">
            {/* Google Drive Video Embedded Frame */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-stone-800 bg-black shadow-2xl">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  title={activeLesson?.title || "Video Lesson"}
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2 text-stone-400">
                  <Play className="w-12 h-12 text-stone-600" />
                  <p className="text-xs">No video link specified for this lesson.</p>
                </div>
              )}
            </div>

            {/* Quick Stream Controls */}
            {activeLesson?.googleDriveUrl && (
              <div className="flex items-center justify-between text-xs text-stone-400 px-1">
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </span>
               
              </div>
            )}

            {/* Lesson Details & Key Takeaways */}
            {activeLesson && (
              <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#558d6e]">
                      Clinical Summary & Guidance
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      Duration: {activeLesson.duration}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                    {activeLesson.description}
                  </p>
                </div>

                {/* Key Takeaways */}
                {activeLesson.keyTakeaways?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-stone-800/80">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#815b94]">
                      Key Psychological Insights:
                    </div>
                    <ul className="space-y-1.5">
                      {activeLesson.keyTakeaways.map((takeaway, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-stone-300 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#558d6e] shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons: WhatsApp & Calendly */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800">
                  {activeLesson.worksheetTitle ? (
                    <div className="flex items-center gap-2 text-xs text-[#a5c6af]">
                      <FileText className="w-4 h-4 text-[#d4af37]" />
                      <span>Attached: <strong>{activeLesson.worksheetTitle}</strong></span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-stone-500">100% Confidential Clinical Care</span>
                  )}

                  <div className="flex items-center gap-2">
                    <a
                      href="https://wa.me/923149341597?text=Hello%20Dr.%20Maheen!%20I%20am%20watching%20your%20masterclass%20and%20would%20like%20to%20consult."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Dr. Maheen</span>
                    </a>

                    <a
                      href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/maheenmanzoor43/30min?back=1&month=2026-09"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#558d6e] hover:bg-[#427256] text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Session on Calendly</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Course Playlist & Lessons */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Course Modules ({course.lessons.length})
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2c4939] text-[#a5c6af]">
                  {course.level}
                </span>
              </div>

              {/* Lessons List */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {course.lessons.map((lesson, idx) => {
                  const isActive = lesson.id === activeLessonId;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        isActive
                          ? "bg-[#2c4939]/60 border-[#558d6e] text-white shadow-sm"
                          : "bg-stone-900/40 border-stone-800 hover:bg-stone-800/60 text-stone-300"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          isActive
                            ? "bg-[#558d6e] text-white"
                            : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">
                          {lesson.title}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                          <span>{lesson.duration}</span>
                          {lesson.isFreePreview && (
                            <span className="text-emerald-400 font-medium">Free Preview</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instructor Box */}
            <div className="p-4 rounded-2xl bg-[#18221d] border border-stone-800 flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#558d6e]/40 shrink-0">
                <Image
                  src="/images/therapist.png"
                  alt="Dr. Maheen"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Dr. Maheen</div>
                <div className="text-[11px] text-[#a5c6af]">Clinical Psychologist</div>
                <div className="text-[10px] text-[var(--text-muted)]">The Healing Space</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
