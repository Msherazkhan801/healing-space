"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Award,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Calendar,
  MessageCircle,
  Quote,
  Clock,
  Sparkle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  BookOpen,
} from "lucide-react";

interface TherapistProfileProps {
  onOpenBooking: () => void;
}

interface PsychologistData {
  id: string;
  name: string;
  role: string;
  badge: string;
  avatarIcon: string;
  image: string;
  phone: string;
  calendlyUrl: string;
  whatsappUrl: string;
  tagline: string;
  intro: string;
  quote: string;
  quoteAuthor: string;
  qualifications: {
    title: string;
    desc: string;
  }[];
  values: {
    icon: string;
    title: string;
    desc: string;
  }[];
}

const PSYCHOLOGISTS: PsychologistData[] = [
  {
    id: "maheen",
    name: "Maheen",
    role: "Founder & Lead Clinical Psychologist",
    badge: "Lead Clinical Psychologist",
    avatarIcon: "Ψ",
    image: "/images/therapist.png",
    phone: "03149341597",
    calendlyUrl:
      process.env.NEXT_PUBLIC_CALENDLY_URL ||
      "https://calendly.com/maheenmanzoor43/30min?back=1&month=2026-09",
    whatsappUrl:
      "https://wa.me/923149341597?text=Hello%20Maheen!%20I%20would%20like%20to%20schedule%20a%20therapy%20session.",
    tagline: "Compassionate Guidance with Maheen",
    intro:
      "Dedicated to creating a safe, grounding space where you can unmask, heal deep emotional wounds, and build sustainable inner strength.",
    quote:
      "“Therapy is not about ‘fixing’ you, because you are not broken. It is a sacred, collaborative space to unburden what weighs on your soul, understand your thoughts without shame, and learn practical tools for lasting peace.”",
    quoteAuthor: "Maheen • Founder & Clinical Psychologist",
    qualifications: [
      {
        title: "BS in Clinical Psychology",
        desc: "Comprehensive diagnostic assessment, therapeutic formulation & psychological interventions.",
      },
      {
        title: "Certified Cognitive Behavioral Therapist (CBT)",
        desc: "Specialized in evidence-based cognitive restructuring for anxiety, depression, and OCD.",
      },
      {
        title: "Mindfulness & ACT Practitioner",
        desc: "Acceptance & Commitment Therapy, mindfulness somatic regulation, and stress reduction.",
      },
      {
        title: "Trauma-Informed & Inner Child Specialist",
        desc: "Safe, compassionate exploration of attachment wounds, grief, and relational patterns.",
      },
    ],
    values: [
      {
        icon: "shield",
        title: "Absolute Confidentiality",
        desc: "Your stories, feelings, and vulnerability remain strictly safeguarded in ethical clinical confidence.",
      },
      {
        icon: "heart",
        title: "Unconditional Empathy",
        desc: "A warm, judgment-free sanctuary where you are heard, understood, and deeply respected.",
      },
      {
        icon: "sparkles",
        title: "Collaborative Healing",
        desc: "You are the expert of your lived experience; together we formulate personalized coping pathways.",
      },
    ],
  },
  {
    id: "associate",
    name: "Maneeta Hussain",
    role: "Associate Clinical Psychologist & Family Specialist",
    badge: "Clinical Associate & Family Specialist",
    avatarIcon: "🧕",
    image: "/images/therapist_niqab.jpg",
    phone: "03149341597",
    calendlyUrl:
      process.env.NEXT_PUBLIC_CALENDLY_URL ||
      "https://calendly.com/maheenmanzoor43/30min?back=1&month=2026-09",
    whatsappUrl:
      "https://wa.me/923149341597?text=Hello!%20I%20would%20like%20to%20schedule%20a%20consultation%20with%20the%20Associate%20Psychologist.",
    tagline: "Empathetic Care & Faith-Sensitive Guidance",
    intro:
      "Providing a confidential, culturally sensitive, and trauma-informed clinical sanctuary to help you navigate emotional distress, family dynamics, and life transitions.",
    quote:
      "“Healing begins the moment you feel genuinely seen and understood. With empathy, modesty, and evidence-based psychotherapy, we cultivate tranquility, resilience, and clarity together.”",
    quoteAuthor: "Maneeta Hussain • Clinical Associate & Family Specialist",
    qualifications: [
      {
        title: "BS in Clinical Psychology",
        desc: "Clinical assessments, diagnostic formulation, psychometrics, and structured counseling.",
      },
      {
        title: "Islamic Psychology & Faith-Sensitive Counseling",
        desc: "Integrating evidence-based clinical therapy with holistic spiritual well-being and modesty.",
      },
      {
        title: "Adolescent, Youth & Family Therapy",
        desc: "Addressing anxiety, emotional regulation, academic burnout, and family relational harmony.",
      },
      {
        title: "Emotion-Focused & Somatic Grounding",
        desc: "Nervous system regulation, distress tolerance, and mindfulness-based stress management.",
      },
    ],
    values: [
      {
        icon: "shield",
        title: "Faith & Culturally Sensitive Haven",
        desc: "Gentle, respectful therapy honoring personal values, modesty, and emotional vulnerability.",
      },
      {
        icon: "heart",
        title: "Holistic Mind-Heart Balance",
        desc: "Combining somatic grounding, emotional self-compassion, and clinical frameworks.",
      },
      {
        icon: "sparkles",
        title: "Safe Family & Youth Support",
        desc: "Empowering young adults, women, and families to foster deep emotional connection and healing.",
      },
    ],
  },
];

export default function TherapistProfile({ onOpenBooking }: TherapistProfileProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const current = PSYCHOLOGISTS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PSYCHOLOGISTS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PSYCHOLOGISTS.length) % PSYCHOLOGISTS.length);
  };

  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#e5efe8] dark:bg-[#2c4939] text-[#2c4939] dark:text-[#a5c6af]">
            <Sparkle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Meet Our Clinical Team</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#222c26] dark:text-[#edf4ef] transition-all duration-300">
            {current.tagline}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            {current.intro}
          </p>

          {/* Interactive Profile Slider Switcher */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            {PSYCHOLOGISTS.map((psych, idx) => (
              <button
                key={psych.id}
                onClick={() => setCurrentIndex(idx)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-sm ${
                  currentIndex === idx
                    ? "bg-[#558d6e] text-white shadow-md scale-105"
                    : "bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-[#558d6e] hover:border-[#558d6e]/50"
                }`}
              >
                <span>{psych.avatarIcon}</span>
                <span>{psych.name}</span>
                <span className="text-[10px] opacity-75 font-normal hidden sm:inline">
                  ({psych.badge})
                </span>
              </button>
            ))}

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-[#558d6e] hover:text-white transition-all cursor-pointer shadow-xs"
                title="Previous Psychologist"
                aria-label="Previous Psychologist"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-[#558d6e] hover:text-white transition-all cursor-pointer shadow-xs"
                title="Next Psychologist"
                aria-label="Next Psychologist"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Portrait & Badges */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative mx-auto max-w-[380px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 group transition-all duration-500">
              <div className="relative aspect-[3/4] w-full bg-stone-900">
                <Image
                  key={current.image}
                  src={current.image}
                  alt={`${current.name} - ${current.role}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 animate-fadeIn"
                  priority
                />
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute bottom-4 left-4 right-4 glass-card p-4 rounded-2xl border border-white/70 dark:border-stone-700/70 shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#558d6e] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {current.avatarIcon}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#222c26] dark:text-[#edf4ef] flex items-center gap-1.5">
                        {current.name}
                        <CheckCircle2 className="w-4 h-4 text-[#558d6e]" />
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {current.role}
                      </div>
                    </div>
                  </div>

                  {/* Switch button overlay */}
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-xl bg-stone-800/80 hover:bg-[#558d6e] text-white text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    title="View other psychologist profile"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="glass-card p-5 rounded-2xl border border-stone-200/60 dark:border-stone-800 text-center space-y-3">
              <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center justify-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#558d6e]" />
                <span>Direct Appointment with {current.name}</span>
              </div>
              <div className="text-xl font-bold font-serif-luxury text-[#2c4939] dark:text-[#a5c6af]">
                {current.phone}
              </div>
              <div className="flex justify-center gap-3 pt-1">
                <a
                  href={current.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#558d6e] hover:bg-[#427256] text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Calendly</span>
                </a>
                <a
                  href={current.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${current.phone}`}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[var(--text-primary)] hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Call</span>
                </a>
              </div>
            </div>
          </div>

          {/* Philosophy & Credentials Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Quote Block */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#558d6e]/20 relative overflow-hidden bg-gradient-to-br from-white/80 via-white/50 to-[#e5efe8]/30 dark:from-stone-900/80 dark:via-stone-900/50 dark:to-[#2c4939]/20 transition-all duration-300">
              <Quote className="w-10 h-10 text-[#558d6e]/20 absolute top-4 right-4" />
              <p className="font-serif-luxury text-lg sm:text-xl md:text-2xl italic text-[#2c4939] dark:text-[#edf4ef] leading-relaxed">
                {current.quote}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-0.5 w-10 bg-[#815b94]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#815b94] dark:text-[#b89bc9]">
                  {current.quoteAuthor}
                </span>
              </div>
            </div>

            {/* Clinical Philosophy Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {current.values.map((val, idx) => (
                <div
                  key={idx}
                  className="glass-card p-4 rounded-2xl border border-stone-200/60 dark:border-stone-800 space-y-2 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-stone-800 flex items-center justify-center shadow-xs">
                    {val.icon === "shield" ? (
                      <ShieldCheck className="w-5 h-5 text-[#558d6e]" />
                    ) : val.icon === "heart" ? (
                      <HeartHandshake className="w-5 h-5 text-[#815b94]" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-[#d4af37]" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#222c26] dark:text-[#edf4ef]">
                    {val.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Academic & Professional Credentials */}
            <div className="space-y-3">
              <h3 className="font-serif-luxury font-bold text-xl text-[#222c26] dark:text-[#edf4ef] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#558d6e]" />
                <span>Clinical Background & Modalities</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.qualifications.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/80 space-y-1 transition-all duration-300"
                  >
                    <div className="text-xs font-bold text-[#2c4939] dark:text-[#a5c6af]">
                      {q.title}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      {q.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={current.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full text-xs font-bold bg-gradient-to-r from-[#427256] via-[#558d6e] to-[#815b94] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book 30-Min Session with {current.name}</span>
              </a>

              <a
                href="#screener"
                className="px-5 py-3 rounded-full text-xs font-bold bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-[var(--text-primary)] hover:bg-stone-100 dark:hover:bg-stone-700 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>Take Quick Wellness Self-Check</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
