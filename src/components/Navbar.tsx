"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Volume2,
  VolumeX,
  Calendar,
  MessageCircle,
  Menu,
  X,
  Sparkles,
  Wind,
  CloudRain,
  Music,
} from "lucide-react";
import { sounds } from "@/lib/sounds";

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ onOpenBooking, onOpenAdmin }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSoundToggle = (type: "rain" | "wind" | "bowl") => {
    if (activeSound === type) {
      sounds.stop();
      setActiveSound(null);
    } else {
      if (type === "rain") sounds.playRain();
      else if (type === "wind") sounds.playWind();
      else if (type === "bowl") sounds.playBowl();
      setActiveSound(type);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    sounds.setVolume(newVol);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-nav py-3 shadow-xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#558d6e]/50 shadow-md group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/logo.jpg"
              alt="The Healing Space Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="font-serif-luxury font-bold text-xl tracking-tight text-[#edf4ef] leading-tight group-hover:text-[#a5c6af] transition-colors">
              The Healing Space
            </div>
            <div className="text-[11px] font-medium tracking-wider uppercase text-[#b89bc9]">
               Maheen • Psychologist
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#edf4ef]/90">
          <a
            href="/#about"
            className="hover:text-[#a5c6af] transition-colors"
          >
            About 
          </a>
          <a
            href="/#services"
            className="hover:text-[#a5c6af] transition-colors"
          >
            Services
          </a>
          <Link
            href="/courses"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Video Courses</span>
          </Link>
          <a
            href="/#sanctuary"
            className="flex items-center gap-1 hover:text-[#b89bc9] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            Sanctuary
          </a>
          <a
            href="/#screener"
            className="hover:text-[#a5c6af] transition-colors"
          >
            Self-Check
          </a>
          <a
            href="/#faq"
            className="hover:text-[#a5c6af] transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Ambient Soundscape Controller */}
          <div className="relative">
            <button
              onClick={() => setAudioMenuOpen(!audioMenuOpen)}
              className={`p-2 rounded-full border transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                activeSound
                  ? "bg-[#2c4939] text-[#cbdfd1] border-[#558d6e]"
                  : "bg-stone-900/80 text-[var(--text-muted)] border-stone-800 hover:border-[#558d6e] hover:text-[#edf4ef]"
              }`}
              title="Calming Audio Sanctuary"
            >
              {activeSound ? (
                <Volume2 className="w-4 h-4 text-[#7baa8d] animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span>{activeSound ? activeSound.toUpperCase() : "Ambient Sound"}</span>
            </button>

            {/* Sound Selection Dropdown */}
            {audioMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-card p-4 rounded-2xl shadow-2xl z-50 border border-stone-800">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Ambient Calming Soundscapes
                </div>
                <div className="space-y-1.5 mb-3">
                  <button
                    onClick={() => handleSoundToggle("rain")}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      activeSound === "rain"
                        ? "bg-[#427256] text-white"
                        : "hover:bg-stone-800/80 text-stone-300"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CloudRain className="w-3.5 h-3.5 text-[#7baa8d]" /> Gentle Rain
                    </span>
                    {activeSound === "rain" && <span className="text-[10px] text-emerald-300">Playing</span>}
                  </button>

                  <button
                    onClick={() => handleSoundToggle("wind")}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      activeSound === "wind"
                        ? "bg-[#427256] text-white"
                        : "hover:bg-stone-800/80 text-stone-300"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Wind className="w-3.5 h-3.5 text-[#7baa8d]" /> Mountain Breeze
                    </span>
                    {activeSound === "wind" && <span className="text-[10px] text-emerald-300">Playing</span>}
                  </button>

                  <button
                    onClick={() => handleSoundToggle("bowl")}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      activeSound === "bowl"
                        ? "bg-[#815b94] text-white"
                        : "hover:bg-stone-800/80 text-stone-300"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Music className="w-3.5 h-3.5 text-[#b89bc9]" /> 432Hz Singing Bowl
                    </span>
                    {activeSound === "bowl" && <span className="text-[10px] text-purple-200">Playing</span>}
                  </button>
                </div>

                {activeSound && (
                  <div>
                    <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1">
                      <span>Volume</span>
                      <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#558d6e]"
                    />
                    <button
                      onClick={() => {
                        sounds.stop();
                        setActiveSound(null);
                      }}
                      className="mt-2 text-[11px] text-rose-400 hover:underline w-full text-center cursor-pointer"
                    >
                      Turn Off Sound
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* WhatsApp Direct DM */}
          <a
            href="https://wa.me/923149341597?text=Hello%20Dr.%20Maheen!%20I%20would%20like%20to%20inquire%20about%20booking%20a%20therapy%20session."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>03149341597</span>
          </a>

          {/* Main Book Session CTA - Calendly in New Tab */}
          <a
            href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/maheenmanzoor43/30min?back=1&month=2026-09"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-[#427256] via-[#558d6e] to-[#815b94] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book with Calendly</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#edf4ef] hover:bg-stone-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-nav border-t border-stone-800 px-6 py-5 space-y-4">
          <nav className="flex flex-col gap-3 font-medium text-sm">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#a5c6af]"
            >
              About  Maheen
            </a>
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 flex items-center gap-2 text-emerald-400 font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Video Courses & Masterclasses</span>
            </Link>
            <a
              href="#sanctuary"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 flex items-center gap-2 hover:text-[#b89bc9]"
            >
              <Sparkles className="w-4 h-4 text-[#d4af37]" /> Interactive Sanctuary (Breathing & Sounds)
            </a>
            <a
              href="#screener"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#a5c6af]"
            >
              Mental Wellness Self-Check
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#a5c6af]"
            >
              FAQ & Confidentiality Ethics
            </a>
          </nav>

          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2.5">
            <a
              href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/maheenmanzoor43/30min?back=1&month=2026-09"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-gradient-to-r from-[#427256] to-[#815b94] text-white shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book with Calendly ( Maheen)</span>
            </a>
            <a
              href="https://wa.me/923149341597?text=Hello%20Dr.%20Maheen!%20I%20would%20like%20to%20book%20a%20therapy%20session."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-emerald-600 text-white flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp: 03149341597
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
