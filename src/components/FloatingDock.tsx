"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Phone,
  Wind,
  Calendar,
  Volume2,
  VolumeX,
} from "lucide-react";
import { sounds } from "@/lib/sounds";

interface FloatingDockProps {
  onOpenBooking: () => void;
  onOpenBreathing: () => void;
}

export default function FloatingDock({
  onOpenBooking,
  onOpenBreathing,
}: FloatingDockProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleQuickRain = () => {
    if (isPlayingAudio) {
      sounds.stop();
      setIsPlayingAudio(false);
    } else {
      sounds.playRain();
      setIsPlayingAudio(true);
    }
  };

  return (
    <aside aria-label="Quick Actions" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-fit px-2">
      <div className="glass-card px-3 py-2 rounded-full border border-stone-200/80 dark:border-stone-700/80 shadow-2xl flex items-center gap-1.5 sm:gap-2">
        {/* WhatsApp Direct */}
        <a
          href="https://wa.me/923149341597?text=Hello%20Dr.%20Maheen!%20I%20would%20like%20to%20book%20a%20therapy%20session%20at%20The%20Healing%20Space."
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          title="WhatsApp 03149341597"
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        {/* Calendly Direct */}
        <a
          href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/maheenmanzoor43/30min?back=1&month=2026-09"}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-[#558d6e] hover:bg-[#427256] text-white shadow-md hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          title="Book Consultation with Calendly"
        >
          <Calendar className="w-4 h-4" />
        </a>

        {/* Direct Call */}
        <a
          href="tel:03149341597"
          className="p-2.5 rounded-full bg-white dark:bg-stone-800 text-[#2c4939] dark:text-[#cbdfd1] border border-stone-200 dark:border-stone-700 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          title="Call 03149341597"
        >
          <Phone className="w-4 h-4" />
        </a>

        {/* Quick Breathwork */}
        <button
          onClick={onOpenBreathing}
          className="p-2.5 rounded-full bg-[#f4f8f5] dark:bg-[#2c4939] text-[#558d6e] dark:text-[#cbdfd1] border border-[#558d6e]/30 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          title="Guided Breathing Tool"
        >
          <Wind className="w-4 h-4" />
        </button>

        {/* Quick Calming Rain Sound */}
        <button
          onClick={toggleQuickRain}
          className={`p-2.5 rounded-full border transition-all flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 ${
            isPlayingAudio
              ? "bg-[#815b94] text-white border-[#815b94]"
              : "bg-white dark:bg-stone-800 text-[var(--text-muted)] border-stone-200 dark:border-stone-700"
          }`}
          title={isPlayingAudio ? "Stop rain audio" : "Play calming rain sound"}
        >
          {isPlayingAudio ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        <div className="h-6 w-px bg-stone-200 dark:bg-stone-700 mx-1 hidden sm:block" />

        {/* Main Book Button */}
        <button
          onClick={onOpenBooking}
          className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#427256] to-[#815b94] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Session</span>
        </button>
      </div>
    </aside>
  );
}
