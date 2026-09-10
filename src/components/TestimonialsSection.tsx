"use client";

import React, { useState } from "react";
import {
  Star,
  Quote,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkle,
  Heart,
} from "lucide-react";

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const testimonials = [
    {
      name: "S. K.",
      concern: "Severe Generalized Anxiety & Panic",
      sessions: "12 Sessions",
      quote:
        "When I first walked into  Maheen's care, I couldn't leave my room without heart palpitations and spiraling thoughts. Through CBT and grounding exercises, she helped me understand that I was safe. Today, I am back at work with genuine confidence.",
      rating: 5,
    },
    {
      name: "Zainab R.",
      concern: "Depression & Severe Burnout",
      sessions: "8 Sessions",
      quote:
        "The Healing Space lives up to its name in every sense.  Maheen's empathy is so authentic and non-judgmental. She never treated me like a disorder to be fixed; she gave me my voice and energy back.",
      rating: 5,
    },
    {
      name: "Bilal & Maryam",
      concern: "Marital & Communication Difficulties",
      sessions: "10 Sessions",
      quote:
        "Couples therapy with  Maheen saved our marriage from constant resentment. She taught us how to listen without defensiveness and express our emotional needs safely. We are endlessly grateful.",
      rating: 5,
    },
    {
      name: "Farhan M.",
      concern: "Trauma & Low Self-Esteem",
      sessions: "15 Sessions",
      quote:
        "I had carried childhood guilt for almost twenty years.  Maheen's inner child work was transformative. For the first time in my life, I feel at peace in my own skin.",
      rating: 5,
    },
  ];

  const nextReview = () => {
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  };

  const prevReview = () => {
    setActiveIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 md:py-28 relative bg-[#f4f8f5]/50 dark:bg-[#18221d]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#cbdfd1]/60 dark:bg-[#2c4939] text-[#2c4939] dark:text-[#cbdfd1]">
            <Sparkle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Stories of Renewal</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#222c26] dark:text-[#edf4ef]">
            Voices from The Healing Space
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            Real experiences from clients who found clarity, self-compassion, and emotional freedom with  Maheen.
          </p>
          <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#558d6e]" />
            <span>Names abbreviated to strictly protect client confidentiality & ethics</span>
          </div>
        </div>

        {/* Testimonials Carousel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-card p-6 sm:p-8 rounded-3xl border border-stone-200/70 dark:border-stone-800 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative group"
            >
              <Quote className="w-8 h-8 text-[#558d6e]/15 absolute top-6 right-6" />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="font-serif-luxury text-sm sm:text-base italic text-[#2c4939] dark:text-[#edf4ef] leading-relaxed">
                  “{t.quote}”
                </p>
              </div>

              {/* Client Info */}
              <div className="pt-6 mt-4 border-t border-stone-200/50 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#222c26] dark:text-[#edf4ef] flex items-center gap-2">
                    <span>{t.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
                      Verified Client
                    </span>
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {t.concern}
                  </div>
                </div>

                <div className="text-right text-[11px] font-semibold text-[#815b94] dark:text-[#b89bc9]">
                  {t.sessions}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
