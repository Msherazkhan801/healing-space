"use client";

import React from "react";
import Image from "next/image";
import {
  Heart,
  Phone,
  MessageCircle,
  Mail,
  ShieldAlert,
  Lock,
  Sparkles,
  Database,
  Globe,
} from "lucide-react";

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenBooking, onOpenAdmin }: FooterProps) {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#558d6e]/50">
                <Image
                  src="/images/logo.jpg"
                  alt="The Healing Space Emblem"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-serif-luxury font-bold text-xl text-white tracking-tight">
                  The Healing Space
                </div>
                <div className="text-[11px] font-medium tracking-wider uppercase text-[#b89bc9]">
                  Dr. Maheen • Clinical Psychologist
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              An evidence-based, compassionate psychological practice devoted to mental health awareness, emotional resilience, and personalized clinical healing.
            </p>

            <div className="text-xs text-stone-400 space-y-1 pt-1">
              <div>🌿 <em>Learn, Heal and Grow</em></div>
              <div>💙 <em>Evidence-based support</em></div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-luxury font-bold text-sm text-white uppercase tracking-wider">
              Sanctuary Exploration
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">
                  Meet Dr. Maheen
                </a>
              </li>
              <li>
                <a href="/courses" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Video Courses (Google Drive Stream)
                </a>
              </li>
              <li>
                <a href="/#services" className="hover:text-emerald-400 transition-colors">
                  Therapy Services & Specializations
                </a>
              </li>
              <li>
                <a href="#sanctuary" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Interactive Guided Breathing & Sound
                </a>
              </li>
              <li>
                <a href="#screener" className="hover:text-emerald-400 transition-colors">
                  Mental Wellness Self-Check Screener
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  FAQ & Confidentiality Ethics
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Booking Column */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="font-serif-luxury font-bold text-sm text-white uppercase tracking-wider">
              Direct Contact & Booking
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href="https://wa.me/923149341597"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-stone-300 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp / DM: <strong>03149341597</strong></span>
              </a>

              <a
                href="tel:03149341597"
                className="flex items-center gap-2 text-stone-300 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#558d6e]" />
                <span>Direct Hotline: <strong>03149341597</strong></span>
              </a>

              <a
                href="https://instagram.com/healingspace.psychology"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-stone-300 hover:text-purple-400 transition-colors"
              >
                <svg className="w-4 h-4 text-[#815b94]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram: <strong>@healingspace.psychology</strong></span>
              </a>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <a
                href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/maheenmanzoor43/30min?back=1&month=2026-09"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-xs font-bold bg-[#558d6e] hover:bg-[#427256] text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Book with Calendly</span>
              </a>
              <button
                onClick={onOpenBooking}
                className="px-3.5 py-2 rounded-full text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-all cursor-pointer"
              >
                Direct Intake Form
              </button>
              <button
                onClick={onOpenAdmin}
                className="px-3.5 py-2 rounded-full text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Crisis Alert Disclaimer */}
        <div className="mt-8 p-4 rounded-2xl bg-stone-800/80 border border-stone-700/80 text-[11px] text-stone-400 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-stone-200">Emergency & Crisis Note:</strong> The Healing Space is an outpatient psychology practice. If you or someone you know is in immediate danger, having suicidal thoughts, or experiencing a medical crisis, please contact your local emergency hospital helpline or crisis center immediately.
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} The Healing Space (Dr. Maheen). All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#558d6e]" /> Ethical Confidentiality
            </span>
            <span>Support • Understand • Heal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
