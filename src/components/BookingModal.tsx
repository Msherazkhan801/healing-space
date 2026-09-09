"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Video,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Lock,
  Loader2,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  THERAPY_SERVICES,
  TIME_SLOTS,
  bookAppointment,
  generateWhatsAppBookingLink,
} from "@/lib/appointments";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  prefilledScreener?: { score: number; level: string } | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  preselectedService,
  prefilledScreener,
}: BookingModalProps) {
  const [activeTab, setActiveTab] = useState<"calendly" | "custom">("calendly");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [serviceType, setServiceType] = useState<string>(
    preselectedService || THERAPY_SERVICES[0].title
  );
  const [format, setFormat] = useState<"online" | "in-person">("online");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [primaryConcern, setPrimaryConcern] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingResult, setBookingResult] = useState<{
    success: boolean;
    id: string;
    isFirestore: boolean;
    message: string;
  } | null>(null);

  // Calendly URL (customizable via env or defaults to Dr. Maheen's Calendly profile)
  const calendlyUrl =
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    "https://calendly.com/healingspace-psychology/therapy-session";

  // Update service when preselected changes
  useEffect(() => {
    if (preselectedService) {
      setServiceType(preselectedService);
    }
  }, [preselectedService]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  if (!isOpen) return null;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone || !selectedDate || !selectedTime) {
      alert("Please fill in your name, contact phone, and preferred date/time slot.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await bookAppointment({
        clientName,
        phone,
        email,
        serviceType,
        format,
        preferredDate: selectedDate,
        preferredTime: selectedTime,
        primaryConcern:
          primaryConcern ||
          (prefilledScreener
            ? `Wellness Screener: ${prefilledScreener.level}`
            : undefined),
        notes,
        screenerScore: prefilledScreener?.score ?? null,
      });

      setBookingResult(res);
      setStep(4);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#558d6e", "#815b94", "#d4af37", "#a5c6af"],
        });
      } catch {
        // ignore confetti errors
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      alert(
        "An error occurred. Please message Dr. Maheen directly on WhatsApp at 03149341597."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappLink = generateWhatsAppBookingLink({
    clientName,
    serviceType,
    format,
    preferredDate: selectedDate,
    preferredTime: selectedTime,
    primaryConcern,
    screenerScore: prefilledScreener?.score,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#131b17] text-[#edf4ef] rounded-3xl shadow-2xl border border-stone-800 p-6 sm:p-8 my-8 transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#2c4939] text-[#a5c6af] border border-[#558d6e]/30">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            <span>Dr. Maheen • The Healing Space</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
            Book Your Session with Dr. Maheen
          </h2>
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#558d6e]" /> 100% Confidential • Calendly & WhatsApp Integration
          </p>
        </div>

        {/* Booking Method Selector Tabs */}
        <div className="flex gap-2 p-1 bg-stone-900/80 rounded-2xl border border-stone-800 mb-6">
          <button
            onClick={() => setActiveTab("calendly")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "calendly"
                ? "bg-[#427256] text-white shadow-md"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Calendar className="w-4 h-4 text-[#d4af37]" />
            <span>Calendly Live Booking</span>
          </button>

          <button
            onClick={() => setActiveTab("custom")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "custom"
                ? "bg-[#815b94] text-white shadow-md"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Clock className="w-4 h-4 text-[#a5c6af]" />
            <span>Direct Custom Form</span>
          </button>
        </div>

        {/* --- TAB 1: CALENDLY EMBED / DIRECT LAUNCH --- */}
        {activeTab === "calendly" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-white">
                    Schedule via Calendly
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Pick your preferred day and exact time slot directly on Dr. Maheen's official calendar.
                  </p>
                </div>

                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#558d6e] hover:bg-[#427256] text-white shadow-md flex items-center gap-2 transition-all shrink-0 cursor-pointer"
                >
                  <span>Open Calendly in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Calendly Inline Frame Simulation / Embed */}
              <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-stone-800 bg-[#0e1411]">
                <iframe
                  src={`${calendlyUrl}?embed_domain=${encodeURIComponent(
                    typeof window !== "undefined" ? window.location.hostname : "localhost"
                  )}&embed_type=Inline&background_color=131b17&text_color=edf4ef&primary_color=558d6e`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Select a Date & Time - Calendly"
                  className="w-full h-full"
                />
              </div>

              {/* Instant WhatsApp Alternative */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-stone-800">
                <span className="text-[var(--text-muted)]">
                  Prefer direct assistance? Message Dr. Maheen directly:
                </span>
                <a
                  href="https://wa.me/923149341597?text=Hello%20Dr.%20Maheen!%20I%20would%20like%20to%20schedule%20a%20therapy%20session%20at%20The%20Healing%20Space."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp: 03149341597</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: DIRECT CUSTOM FORM (WITH FIRESTORE PERSISTENCE) --- */}
        {activeTab === "custom" && (
          <div>
            {step < 4 && (
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
                {[
                  { num: 1, label: "Service & Mode" },
                  { num: 2, label: "Date & Time" },
                  { num: 3, label: "Your Details" },
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step === s.num
                          ? "bg-[#558d6e] text-white ring-4 ring-[#558d6e]/20"
                          : step > s.num
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-800 text-[var(--text-muted)]"
                      }`}
                    >
                      {step > s.num ? "✓" : s.num}
                    </div>
                    <span className="text-xs font-semibold hidden sm:inline text-stone-300">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Session Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormat("online")}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        format === "online"
                          ? "border-[#558d6e] bg-[#2c4939]/40 text-[#a5c6af]"
                          : "border-stone-800 hover:bg-stone-800/60"
                      }`}
                    >
                      <Video className="w-5 h-5 text-[#558d6e] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold">Online Video Session</div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                          Zoom / Google Meet encrypted video
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormat("in-person")}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        format === "in-person"
                          ? "border-[#815b94] bg-[#4c3755]/40 text-[#d4bfdf]"
                          : "border-stone-800 hover:bg-stone-800/60"
                      }`}
                    >
                      <MapPin className="w-5 h-5 text-[#815b94] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold">In-Clinic Sanctuary</div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                          Private clinic room with Dr. Maheen
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Select Specialization
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {THERAPY_SERVICES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setServiceType(s.title)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          serviceType === s.title
                            ? "border-[#558d6e] bg-[#18221d]"
                            : "border-stone-800 hover:bg-stone-800/50"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{s.title}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">
                            {s.duration} • {s.modalities.join(", ")}
                          </div>
                        </div>
                        {serviceType === s.title && (
                          <CheckCircle2 className="w-4 h-4 text-[#558d6e] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#558d6e] hover:bg-[#427256] text-white flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>Continue to Date & Time</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#558d6e]" />
                      <span>Preferred Date</span>
                    </label>
                    <input
                      type="date"
                      min={minDateStr}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-stone-800 bg-stone-900 text-xs font-semibold focus:outline-none focus:border-[#558d6e] text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#815b94]" />
                      <span>Available Consultation Slot</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            selectedTime === slot
                              ? "bg-[#815b94] text-white border-[#815b94]"
                              : "bg-stone-900 border-stone-800 hover:border-[#815b94]"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedDate || !selectedTime) {
                        alert("Please select both a date and an available time slot.");
                        return;
                      }
                      setStep(3);
                    }}
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#558d6e] hover:bg-[#427256] text-white flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>Continue to Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#558d6e]" /> Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ayesha Malik"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 03149341597"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#815b94]" /> Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ayesha@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#d4af37]" /> What would you like to focus on in therapy?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Briefly describe what you are going through (e.g. anxiety, burnout, relationship changes)..."
                      value={primaryConcern}
                      onChange={(e) => setPrimaryConcern(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-800 bg-stone-900 text-xs focus:outline-none focus:border-[#558d6e] text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 rounded-full text-xs font-bold bg-gradient-to-r from-[#427256] via-[#558d6e] to-[#815b94] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving to Firebase Firestore...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Book Appointment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4 */}
            {step === 4 && bookingResult && (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif-luxury text-2xl font-bold text-white">
                    Session Request Received!
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {bookingResult.message}
                  </p>
                  <div className="text-[11px] font-mono text-[#a5c6af] font-bold">
                    Booking Reference ID: #{bookingResult.id.substring(0, 8).toUpperCase()}
                  </div>
                </div>

                {/* Direct WhatsApp Call to Action */}
                <div className="space-y-3 pt-2">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-md mx-auto py-3.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send 1-Click Confirmation to WhatsApp (03149341597)</span>
                  </a>

                  <div>
                    <button
                      onClick={onClose}
                      className="text-xs font-semibold text-stone-400 hover:text-white cursor-pointer"
                    >
                      Close & Return to Sanctuary
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
