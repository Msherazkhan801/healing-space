"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Brain,
  Sprout,
  ShieldCheck,
  Mail,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Phone,
  MessageCircle,
  Clock,
  Lock,
} from "lucide-react";

interface HeroSliderProps {
  onOpenBooking: () => void;
  onSelectService?: (serviceId: string) => void;
}

interface SlideItem {
  id: number;
  badgeIcon: React.ReactNode;
  badgeText: string;
  title: string;
  tagline: string;
  description: string;
  gradient: string;
  accentBorder: string;
  keyStats: { label: string; value: string }[];
  primaryBtnText: string;
  secondaryBtnText: string;
  actionType: "booking" | "whatsapp" | "services" | "call";
}

export default function HeroSlider({ onOpenBooking }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const SLIDE_DURATION = 6500; // ms

  const slides: SlideItem[] = [
    {
      id: 0,
      badgeIcon: <Brain className="w-4 h-4 text-[#558d6e]" />,
      badgeText: "🧠 Mental Health Awareness & Counselling",
      title: "Safe Space for Your Mind & Heart",
      tagline: "Support • Understand • Heal",
      description:
        "Every emotion tells a story. Step into a confidential, compassionate psychological sanctuary designed by Dr. Maheen to help you unburden racing thoughts, reduce anxiety, and regain emotional balance.",
      gradient: "from-[#cbdfd1]/30 via-[#faf7f2]/50 to-[#e7daee]/30 dark:from-[#2c4939]/30 dark:via-[#121815]/50 dark:to-[#4c3755]/30",
      accentBorder: "border-[#558d6e]/40",
      keyStats: [
        { label: "Confidentiality", value: "100% Guaranteed" },
        { label: "Approach", value: "Person-Centered" },
        { label: "Setting", value: "Online & In-Clinic" },
      ],
      primaryBtnText: "Book Discovery Session",
      secondaryBtnText: "WhatsApp: 03149341597",
      actionType: "booking",
    },
    {
      id: 1,
      badgeIcon: <Sprout className="w-4 h-4 text-[#427256]" />,
      badgeText: "🌿 Learn, Heal and Grow",
      title: "Transforming Pain into Resilience",
      tagline: "Your Personal Healing Journey",
      description:
        "Healing is not linear, but you never have to walk it alone. We integrate cognitive restructuring and compassionate growth tools so you can overcome past burdens and cultivate lasting peace.",
      gradient: "from-[#a5c6af]/30 via-[#f4f8f5]/50 to-[#cbdfd1]/30 dark:from-[#355b46]/30 dark:via-[#18221d]/50 dark:to-[#2c4939]/30",
      accentBorder: "border-[#427256]/40",
      keyStats: [
        { label: "Modalities", value: "CBT & ACT" },
        { label: "Mindfulness", value: "Somatic Grounding" },
        { label: "Goal", value: "Sustainable Peace" },
      ],
      primaryBtnText: "Explore Therapeutic Care",
      secondaryBtnText: "WhatsApp Dr. Maheen",
      actionType: "services",
    },
    {
      id: 2,
      badgeIcon: <ShieldCheck className="w-4 h-4 text-[#815b94]" />,
      badgeText: "💙 Evidence Based Support",
      title: "Science-Backed Psychological Care",
      tagline: "Structured & Clinically Proven",
      description:
        "Utilizing Cognitive Behavioral Therapy (CBT), Acceptance & Commitment Therapy (ACT), and Mindfulness-Based interventions to create tangible, positive changes in mood, habits, and self-worth.",
      gradient: "from-[#e7daee]/30 via-[#faf7f2]/50 to-[#f2db9d]/20 dark:from-[#4c3755]/30 dark:via-[#121815]/50 dark:to-[#5a3f65]/30",
      accentBorder: "border-[#815b94]/40",
      keyStats: [
        { label: "Lead Clinical", value: "Dr. Maheen" },
        { label: "Practice", value: "Clinical Psychologist" },
        { label: "Methods", value: "Evidence-Based" },
      ],
      primaryBtnText: "Take Wellness Screener",
      secondaryBtnText: "Book Consultation",
      actionType: "booking",
    },
    {
      id: 3,
      badgeIcon: <Mail className="w-4 h-4 text-[#d4af37]" />,
      badgeText: "💌 DM to Book Your Session",
      title: "Take the First Gentle Step Today",
      tagline: "Direct Phone & WhatsApp Booking",
      description:
        "Ready to begin? Message or call directly at 03149341597. Flexible online video consultations and private clinic slots tailored around your schedule and comfort.",
      gradient: "from-[#f2db9d]/25 via-[#faf7f2]/50 to-[#d4bfdf]/30 dark:from-[#5a3f65]/30 dark:via-[#121815]/50 dark:to-[#253d30]/30",
      accentBorder: "border-[#d4af37]/40",
      keyStats: [
        { label: "Direct Phone", value: "03149341597" },
        { label: "Instagram DM", value: "@healingspace" },
        { label: "Response", value: "Within 2-4 Hours" },
      ],
      primaryBtnText: "1-Click WhatsApp Booking",
      secondaryBtnText: "Call 03149341597",
      actionType: "whatsapp",
    },
  ];

  // Auto slide advance
  useEffect(() => {
    if (isPaused) return;

    progressTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPaused, slides.length]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <section
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Card Container */}
        <div
          className={`glass-card rounded-3xl p-6 sm:p-10 md:p-12 border ${current.accentBorder} bg-gradient-to-br ${current.gradient} transition-all duration-700 shadow-2xl relative overflow-hidden`}
        >
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#558d6e]/10 dark:bg-[#558d6e]/5 blur-3xl pointer-events-none animate-aura" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#815b94]/10 dark:bg-[#815b94]/5 blur-3xl pointer-events-none animate-aura" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white/90 dark:bg-stone-900/90 text-[var(--text-primary)] border border-stone-200/80 dark:border-stone-700/80 shadow-sm animate-float">
                {current.badgeIcon}
                <span>{current.badgeText}</span>
              </div>

              {/* Headline & Tagline */}
              <div className="space-y-2">
                <div className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#815b94] dark:text-[#b89bc9]">
                  {current.tagline}
                </div>
                <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#222c26] dark:text-[#edf4ef] leading-[1.15]">
                  {current.title}
                </h1>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl font-normal">
                {current.description}
              </p>

              {/* Key Trust Stats Pill Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {current.keyStats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-white/60 dark:border-stone-800/80 shadow-xs"
                  >
                    <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium">
                      {stat.label}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#2c4939] dark:text-[#cbdfd1] mt-0.5 truncate">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={onOpenBooking}
                  className="px-7 py-3.5 rounded-full text-sm font-bold bg-gradient-to-r from-[#427256] via-[#558d6e] to-[#815b94] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>{current.primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="https://wa.me/923149341597?text=Hello%20Dr.%20Maheen!%20I%20would%20like%20to%20book%20a%20therapy%20session%20at%20The%20Healing%20Space."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full text-sm font-bold bg-white/90 dark:bg-stone-800/90 text-emerald-800 dark:text-emerald-300 border border-emerald-600/30 hover:bg-emerald-50 dark:hover:bg-stone-700 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{current.secondaryBtnText}</span>
                </a>
              </div>
            </div>

            {/* Right Visual Column (Logo & Doctor Badge Spotlight) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square rounded-3xl p-4 bg-gradient-to-tr from-white/90 via-white/50 to-white/90 dark:from-stone-900/90 dark:via-stone-900/50 dark:to-stone-900/90 border border-white dark:border-stone-800 shadow-2xl flex flex-col items-center justify-center text-center group">
                {/* Floating Ring Aura */}
                <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-[#558d6e]/30 dark:border-[#558d6e]/20 animate-pulse pointer-events-none" />

                {/* Central Emblem Image */}
                <div className="relative w-34 h-64 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-md mb-4 border border-[#558d6e]/30 group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/images/therapist.png"
                    alt="The Healing Space Emblem"
                    fill
                    sizes="200px"
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Psychologist Identity Plate */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#e5efe8] dark:bg-[#2c4939] text-[#2c4939] dark:text-[#e5efe8]">
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    <span>Dr. Maheen • Clinical Psychologist</span>
                  </div>
                  <div className="font-serif-luxury font-bold text-lg text-[#222c26] dark:text-[#edf4ef]">
                    The Healing Space
                  </div>
                  <div className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#558d6e]" /> 100% Confidential
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#815b94]" /> 50-Min Sessions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Pagination Controls & Progress Bars */}
          <div className="mt-8 pt-6 border-t border-stone-200/60 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* 4 Interactive Progress Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto flex-1 sm:max-w-2xl">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  className={`relative p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    currentSlide === idx
                      ? "bg-white dark:bg-stone-800 shadow-sm border border-[#558d6e]/40 font-semibold"
                      : "bg-white/40 dark:bg-stone-900/40 hover:bg-white/70 dark:hover:bg-stone-800/60"
                  }`}
                >
                  <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                    Pillar 0{idx + 1}
                  </div>
                  <div className="text-xs truncate font-medium text-[var(--text-primary)]">
                    {s.badgeText.replace(/^[^\s]+\s/, "")}
                  </div>

                  {/* Active Progress Bar */}
                  {currentSlide === idx && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#558d6e] to-[#815b94]"
                        style={{
                          animation: `progressFill ${SLIDE_DURATION}ms linear forwards`,
                        }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-full bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 shadow-sm transition-all"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4 text-[var(--text-primary)]" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2.5 rounded-full bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 shadow-sm transition-all"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4 text-[var(--text-primary)]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
