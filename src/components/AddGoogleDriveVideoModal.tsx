"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  Link,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Film,
  Sparkles,
  Layers,
  Clock,
  BookOpen,
} from "lucide-react";
import { Course, getCourses, addGoogleDriveLessonToCourse, formatGoogleDriveEmbedUrl } from "@/lib/courses";

interface AddGoogleDriveVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddGoogleDriveVideoModal({
  isOpen,
  onClose,
  onSuccess,
}: AddGoogleDriveVideoModalProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [lessonTitle, setLessonTitle] = useState<string>("");
  const [duration, setDuration] = useState<string>("20 mins");
  const [googleDriveInput, setGoogleDriveInput] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [takeaway1, setTakeaway1] = useState<string>("");
  const [takeaway2, setTakeaway2] = useState<string>("");
  const [worksheetTitle, setWorksheetTitle] = useState<string>("");
  const [isFreePreview, setIsFreePreview] = useState<boolean>(true);
  const [showDriveGuide, setShowDriveGuide] = useState<boolean>(false);

  React.useEffect(() => {
    if (isOpen) {
      const list = getCourses();
      setCourses(list);
      if (list.length > 0) {
        setSelectedCourseId(list[0].id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const previewEmbedUrl = formatGoogleDriveEmbedUrl(googleDriveInput);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourseId || !lessonTitle || !googleDriveInput) {
      alert("Please fill in the course selection, lesson title, and Google Drive video link.");
      return;
    }

    const takeaways = [takeaway1, takeaway2].filter(Boolean);

    addGoogleDriveLessonToCourse(selectedCourseId, {
      title: lessonTitle,
      duration: duration || "15 mins",
      description: description || "Guided psychological masterclass lecture by  Maheen.",
      googleDriveUrl: previewEmbedUrl,
      keyTakeaways: takeaways.length > 0 ? takeaways : ["Clinical grounding technique explained in detail."],
      worksheetTitle: worksheetTitle || undefined,
      isFreePreview,
    });

    alert("Video successfully linked and added to your video library!");
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#131b17] text-[#edf4ef] rounded-3xl shadow-2xl border border-stone-800 p-6 sm:p-8 my-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#2c4939] text-[#a5c6af]">
            <Film className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Google Drive Video Cloud Integration</span>
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white">
            Add Video Lecture to Course Page
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Paste your Google Drive video link below to embed and retrieve it on your video course page.
          </p>
        </div>

        {/* Instructions Toggle */}
        <div className="mb-5 p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#558d6e] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>How to get your Google Drive Video Link:</span>
            </span>
            <button
              type="button"
              onClick={() => setShowDriveGuide(!showDriveGuide)}
              className="text-[11px] text-purple-400 hover:underline cursor-pointer"
            >
              {showDriveGuide ? "Hide Guide" : "Show Steps"}
            </button>
          </div>

          {showDriveGuide && (
            <ol className="list-decimal pl-5 space-y-1 text-stone-300 text-[11px] pt-2 border-t border-stone-800">
              <li>Upload your recorded video to <strong>Google Drive</strong>.</li>
              <li>Right-click the video file in Drive &gt; Click <strong>Share</strong> &gt; Set General Access to <strong>"Anyone with the link" (Viewer)</strong>.</li>
              <li>Click <strong>Copy Link</strong> and paste it directly into the input below!</li>
            </ol>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Course */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#558d6e]" /> Select Target Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-900 text-xs font-semibold focus:outline-none focus:border-[#558d6e] text-white"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.lessons.length} lessons)
                </option>
              ))}
            </select>
          </div>

          {/* Lesson Title & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Lesson / Lecture Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Somatic Grounding Techniques for Social Anxiety"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#815b94]" /> Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 25 mins"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
              />
            </div>
          </div>

          {/* Google Drive Link Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-emerald-400" /> Google Drive Share URL or File ID *
            </label>
            <input
              type="text"
              placeholder="https://drive.google.com/file/d/1BxiMVs0XRA5nFMd.../view?usp=sharing"
              value={googleDriveInput}
              onChange={(e) => setGoogleDriveInput(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
              required
            />
            {previewEmbedUrl && (
              <div className="text-[10px] text-emerald-400 font-mono pt-0.5">
                ✓ Converted to Embed Stream URL: {previewEmbedUrl.substring(0, 48)}...
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Lesson Summary / Psychological Focus
            </label>
            <textarea
              rows={2}
              placeholder="Key psychological concepts and actionable coping practices explained in this video..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
            />
          </div>

          {/* Takeaways & Worksheet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Key Takeaway 1
              </label>
              <input
                type="text"
                placeholder="e.g. Diaphragmatic pacing reduces acute palpitations"
                value={takeaway1}
                onChange={(e) => setTakeaway1(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Key Takeaway 2
              </label>
              <input
                type="text"
                placeholder="e.g. Notice thoughts without emotional fusion"
                value={takeaway2}
                onChange={(e) => setTakeaway2(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-stone-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#427256] to-[#815b94] hover:scale-105 active:scale-95 text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Publish & Retrieve Video</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
