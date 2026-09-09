"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Sparkle,
  ShieldCheck,
  Calendar,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

interface FAQSectionProps {
  onOpenBooking: () => void;
}

export default function FAQSection({ onOpenBooking }: FAQSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What should I expect during my first therapy session?",
      a: "The initial discovery session is a gentle, pressure-free conversation. Dr. Maheen will listen to what brought you to therapy, explore your current struggles, and answer any questions you have. Together, you will outline initial goals and discuss the therapeutic approach best suited for your healing.",
    },
    {
      q: "Is my personal information and conversation strictly confidential?",
      a: "Yes, 100%. Clinical confidentiality is a core ethical pillar of psychological practice. Everything shared during sessions, assessment forms, and notes is strictly protected and never disclosed to third parties.",
    },
    {
      q: "How do online video sessions work?",
      a: "Online sessions take place over encrypted, secure video links (Zoom or Google Meet). You can join from the privacy of your home on your phone, tablet, or laptop. Online therapy is clinically proven to be just as effective as in-person counselling.",
    },
    {
      q: "How do I book and pay for my consultation?",
      a: "You can book directly using the online appointment form on this website, or send a quick WhatsApp message to 03149341597. Session fee details and simple payment options (bank transfer, online payments) will be shared upon booking confirmation.",
    },
    {
      q: "How many sessions will I need?",
      a: "Every individual is unique. Some clients find clarity and actionable coping strategies within 4 to 6 sessions, while others benefit from ongoing medium-term support (8 to 15+ sessions) for deep trauma or chronic anxiety. You always maintain full autonomy over your session frequency.",
    },
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#f3ecf7] dark:bg-[#4c3755] text-[#815b94] dark:text-[#d4bfdf]">
            <Sparkle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Answers & Guidance</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#222c26] dark:text-[#edf4ef]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            Everything you need to know about starting your counselling journey with Dr. Maheen.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-stone-200/70 dark:border-stone-800 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full p-5 sm:p-6 text-left font-serif-luxury text-base sm:text-lg font-bold text-[#222c26] dark:text-[#edf4ef] flex items-center justify-between gap-4 cursor-pointer hover:text-[#558d6e] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--text-muted)] shrink-0 transition-transform duration-300 ${
                    openIdx === idx ? "rotate-180 text-[#558d6e]" : ""
                  }`}
                />
              </button>

              {openIdx === idx && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed border-t border-stone-100 dark:border-stone-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Booking Callout */}
        <div className="mt-12 glass-card p-6 sm:p-8 rounded-3xl border border-[#558d6e]/30 text-center space-y-4 bg-gradient-to-r from-[#e5efe8]/40 via-white/40 to-[#f3ecf7]/40 dark:from-[#2c4939]/30 dark:via-stone-900/40 dark:to-[#4c3755]/30">
          <h3 className="font-serif-luxury text-xl font-bold text-[#222c26] dark:text-[#edf4ef]">
            Have a question that is not listed here?
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto">
            Feel free to send a private message to Dr. Maheen on WhatsApp or request a consultation callback.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <button
              onClick={onOpenBooking}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#558d6e] hover:bg-[#427256] text-white shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
            <a
              href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/maheenmanzoor43/30min?back=1&month=2026-09"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#815b94] hover:bg-[#6c487f] text-white shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule with Calendly</span>
            </a>
            <a
              href="https://wa.me/923149341597?text=Hello%20Dr.%20Maheen!%20I%20have%20a%20question%20regarding%20The%20Healing%20Space."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask on WhatsApp (03149341597)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
