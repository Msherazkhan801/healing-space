"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroCanvas from "@/components/HeroCanvas";
import HeroSlider from "@/components/HeroSlider";
import TherapistProfile from "@/components/TherapistProfile";
import ServicesSection from "@/components/ServicesSection";
import InteractiveSanctuary from "@/components/InteractiveSanctuary";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import AppointmentsAdminModal from "@/components/AppointmentsAdminModal";
import FloatingDock from "@/components/FloatingDock";

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [screenerData, setScreenerData] = useState<{ score: number; level: string } | null>(null);

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    }
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithScreener = (score: number, level: string) => {
    setScreenerData({ score, level });
    setSelectedService("Individual Psychotherapy & Counselling");
    setIsBookingOpen(true);
  };

  const handleScrollToSanctuary = () => {
    const el = document.getElementById("sanctuary");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen selection:bg-[#cbdfd1] selection:text-[#2c4939] dark:selection:bg-[#4c3755] dark:selection:text-[#f3ecf7]">
      {/* Background Interactive Particle & Glow Canvas */}
      <HeroCanvas />

      {/* Navigation Header */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Hero Animated Pillar Showcase */}
      <HeroSlider onOpenBooking={() => handleOpenBooking()} />

      {/* About Dr. Maheen & Therapeutic Philosophy */}
      <TherapistProfile onOpenBooking={() => handleOpenBooking()} />

      {/* Psychological Services & Modalities Grid */}
      <ServicesSection onSelectService={(title) => handleOpenBooking(title)} />

      {/* Interactive Sanctuary (Breathing, Ambient Video & Sounds, Screener, Affirmations) */}
      <InteractiveSanctuary
        onOpenBookingWithScore={handleOpenBookingWithScreener}
      />

      {/* Verified Client Testimonials */}
      <TestimonialsSection />

      {/* FAQ & Confidentiality Breakdown */}
      <FAQSection onOpenBooking={() => handleOpenBooking()} />

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Action Dock */}
      <FloatingDock
        onOpenBooking={() => handleOpenBooking()}
        onOpenBreathing={handleScrollToSanctuary}
      />

      {/* Firebase Firestore Appointment Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setScreenerData(null);
        }}
        preselectedService={selectedService}
        prefilledScreener={screenerData}
      />

      {/* Appointments Admin / Live Records Dashboard Modal */}
      <AppointmentsAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </main>
  );
}
