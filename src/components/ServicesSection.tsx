"use client";

import React, { useState } from "react";
import {
  THERAPY_SERVICES,
  TherapyService,
} from "@/lib/appointments";
import {
  HeartHandshake,
  ShieldAlert,
  SunMedium,
  Sparkles,
  Users,
  GraduationCap,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkle,
} from "lucide-react";

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Specializations" },
    { id: "individual", label: "Individual Psychotherapy" },
    { id: "mood", label: "Anxiety & Depression" },
    { id: "growth", label: "Trauma & Personal Growth" },
    { id: "relationships", label: "Relationships & Family" },
  ];

  const filteredServices =
    activeCategory === "all"
      ? THERAPY_SERVICES
      : THERAPY_SERVICES.filter((s) => s.category === activeCategory);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "HeartHandshake":
        return <HeartHandshake className="w-6 h-6 text-[#558d6e]" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-6 h-6 text-[#815b94]" />;
      case "SunMedium":
        return <SunMedium className="w-6 h-6 text-[#d4af37]" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6 text-[#558d6e]" />;
      case "Users":
        return <Users className="w-6 h-6 text-[#815b94]" />;
      case "GraduationCap":
        return <GraduationCap className="w-6 h-6 text-[#427256]" />;
      default:
        return <HeartHandshake className="w-6 h-6 text-[#558d6e]" />;
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 relative bg-[#f4f8f5]/40 dark:bg-[#18221d]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#cbdfd1]/60 dark:bg-[#2c4939] text-[#2c4939] dark:text-[#cbdfd1]">
            <Sparkle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Evidence-Based Specializations</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#222c26] dark:text-[#edf4ef]">
            Therapeutic Services Tailored to You
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            Every individual walks a unique life journey. Discover structured, compassionate psychological interventions crafted for your specific emotional needs.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#427256] text-white shadow-md scale-105"
                  : "bg-white/80 dark:bg-stone-800/80 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white dark:hover:bg-stone-700 border border-stone-200/60 dark:border-stone-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="glass-card rounded-3xl p-6 sm:p-7 border border-stone-200/70 dark:border-stone-800 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Top Badge & Duration */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-[#e5efe8] dark:bg-[#2c4939]/80 shadow-xs group-hover:scale-110 transition-transform">
                    {getServiceIcon(service.icon)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#faf6fc] dark:bg-[#4c3755] text-[#815b94] dark:text-[#d4bfdf] border border-[#d4bfdf]/40">
                      {service.badge}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {service.duration}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-serif-luxury font-bold text-xl text-[#222c26] dark:text-[#edf4ef] group-hover:text-[#427256] dark:group-hover:text-[#a5c6af] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                    {service.summary}
                  </p>
                </div>

                {/* Modalities Chips */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#815b94] dark:text-[#b89bc9]">
                    Methods Used:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {service.modalities.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white/80 dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700 text-[var(--text-muted)] font-medium"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Benefits List */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#558d6e] dark:text-[#a5c6af]">
                    Core Outgrowths:
                  </div>
                  <ul className="space-y-1">
                    {service.benefits.map((b, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-[var(--text-primary)] flex items-start gap-2"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-[#558d6e] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-stone-200/50 dark:border-stone-800">
                <button
                  onClick={() => onSelectService(service.title)}
                  className="w-full py-3 rounded-2xl text-xs font-bold bg-white dark:bg-stone-800 border border-[#558d6e]/40 hover:bg-[#558d6e] hover:text-white dark:hover:bg-[#558d6e] text-[#2c4939] dark:text-[#cbdfd1] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer group/btn"
                >
                  <span>Book This Session</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
