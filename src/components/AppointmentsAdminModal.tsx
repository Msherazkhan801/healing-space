"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  Database,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Video,
  MapPin,
  Lock,
} from "lucide-react";
import { fetchAppointments, Appointment } from "@/lib/appointments";

interface AppointmentsAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppointmentsAdminModal({
  isOpen,
  onClose,
}: AppointmentsAdminModalProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = appointments.filter(
    (a) =>
      a.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[var(--bg-surface)] dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/70 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#e5efe8] dark:bg-[#2c4939] text-[#558d6e]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#222c26] dark:text-[#edf4ef]">
                Appointments Dashboard (Firestore)
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Manage upcoming consultations and client booking records for The Healing Space.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-full border border-stone-200 dark:border-stone-700 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
              title="Refresh records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-stone-200 dark:border-stone-700 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="py-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client name, phone number, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs focus:outline-none focus:border-[#558d6e]"
            />
          </div>
        </div>

        {/* Appointments List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="text-center py-12 text-xs text-[var(--text-muted)]">
              Loading appointment records from Firestore...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-xs text-[var(--text-muted)] space-y-2">
              <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
              <p>No appointments match your search.</p>
            </div>
          ) : (
            filtered.map((apt, idx) => (
              <div
                key={apt.id || idx}
                className="p-4 rounded-2xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/70 dark:border-stone-700/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#222c26] dark:text-[#edf4ef]">
                      {apt.clientName}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        apt.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {apt.status}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-[var(--text-muted)] flex items-center gap-1">
                      {apt.format === "online" ? (
                        <>
                          <Video className="w-3 h-3 text-[#558d6e]" /> Online
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3 text-[#815b94]" /> In-Clinic
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-[#558d6e] dark:text-[#a5c6af]">
                    {apt.serviceType}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#558d6e]" /> {apt.preferredDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#815b94]" /> {apt.preferredTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" /> {apt.phone}
                    </span>
                  </div>

                  {apt.primaryConcern && (
                    <div className="text-[11px] text-[var(--text-muted)] italic pt-1 border-t border-stone-100 dark:border-stone-700/50">
                      “{apt.primaryConcern}”
                    </div>
                  )}
                </div>

                {/* Quick WhatsApp Action Button */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <a
                    href={`https://wa.me/${apt.phone.replace(/^0/, "92")}?text=${encodeURIComponent(
                      `Assalam-o-Alaikum ${apt.clientName}! This is Dr. Maheen from The Healing Space regarding your consultation request for ${apt.preferredDate} at ${apt.preferredTime}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Client</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-stone-200/70 dark:border-stone-800 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#558d6e]" /> Data secured via Firebase Firestore
          </span>
          <span>Practice Hotline: 03149341597</span>
        </div>
      </div>
    </div>
  );
}
