"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Wind,
  CloudRain,
  Music,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ChevronRight,
  HelpCircle,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { sounds } from "@/lib/sounds";
import {
  MOOD_AFFIRMATIONS,
  MoodAffirmation,
  SCREENER_QUESTIONS,
  evaluateScreenerScore,
} from "@/lib/affirmations";

interface InteractiveSanctuaryProps {
  onOpenBookingWithScore?: (score: number, level: string) => void;
}

export default function InteractiveSanctuary({
  onOpenBookingWithScore,
}: InteractiveSanctuaryProps) {
  const [activeTab, setActiveTab] = useState<"breathing" | "ambient" | "affirmation" | "screener">("breathing");

  // --- 1. Breathing Bubble State ---
  const [breathingMode, setBreathingMode] = useState<"478" | "box" | "relax">("478");
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Rest">("Inhale");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [isAudioCueEnabled, setIsAudioCueEnabled] = useState<boolean>(true);

  // Breathing timings config
  const breathConfigs = {
    "478": { name: "4-7-8 Deep Calm", inhale: 4, hold1: 7, exhale: 8, hold2: 0, desc: "Activates parasympathetic nervous system for instant stress relief and sleep." },
    "box": { name: "Box Breathing (4-4-4-4)", inhale: 4, hold1: 4, exhale: 4, hold2: 4, desc: "Used by clinical psychologists & first responders to regulate sharp panic." },
    "relax": { name: "Relaxing Rhythm (4-2-6)", inhale: 4, hold1: 2, exhale: 6, hold2: 0, desc: "Gentle daily cadence to reset cognitive fatigue." },
  };

  useEffect(() => {
    if (!isBreathingActive) return;

    const config = breathConfigs[breathingMode];
    let timer: NodeJS.Timeout;

    if (secondsRemaining > 1) {
      timer = setTimeout(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else {
      // Transition to next phase
      if (breathPhase === "Inhale") {
        if (config.hold1 > 0) {
          setBreathPhase("Hold");
          setSecondsRemaining(config.hold1);
          if (isAudioCueEnabled) sounds.playBreathCue("hold");
        } else {
          setBreathPhase("Exhale");
          setSecondsRemaining(config.exhale);
          if (isAudioCueEnabled) sounds.playBreathCue("exhale");
        }
      } else if (breathPhase === "Hold" && config.hold2 > 0 && secondsRemaining === 1) {
        // Exhale after hold
        setBreathPhase("Exhale");
        setSecondsRemaining(config.exhale);
        if (isAudioCueEnabled) sounds.playBreathCue("exhale");
      } else if (breathPhase === "Hold") {
        setBreathPhase("Exhale");
        setSecondsRemaining(config.exhale);
        if (isAudioCueEnabled) sounds.playBreathCue("exhale");
      } else if (breathPhase === "Exhale") {
        if (config.hold2 > 0) {
          setBreathPhase("Rest");
          setSecondsRemaining(config.hold2);
          if (isAudioCueEnabled) sounds.playBreathCue("hold");
        } else {
          setBreathPhase("Inhale");
          setSecondsRemaining(config.inhale);
          setCyclesCompleted((c) => c + 1);
          if (isAudioCueEnabled) sounds.playBreathCue("inhale");
        }
      } else if (breathPhase === "Rest") {
        setBreathPhase("Inhale");
        setSecondsRemaining(config.inhale);
        setCyclesCompleted((c) => c + 1);
        if (isAudioCueEnabled) sounds.playBreathCue("inhale");
      }
    }

    return () => clearTimeout(timer);
  }, [isBreathingActive, secondsRemaining, breathPhase, breathingMode, isAudioCueEnabled]);

  const toggleBreathing = () => {
    if (isBreathingActive) {
      setIsBreathingActive(false);
      setBreathPhase("Inhale");
      setSecondsRemaining(breathConfigs[breathingMode].inhale);
    } else {
      setIsBreathingActive(true);
      setBreathPhase("Inhale");
      setSecondsRemaining(breathConfigs[breathingMode].inhale);
      if (isAudioCueEnabled) sounds.playBreathCue("inhale");
    }
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase("Inhale");
    setSecondsRemaining(breathConfigs[breathingMode].inhale);
    setCyclesCompleted(0);
  };

  // --- 2. Ambient Video & Soundscape State ---
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);

  const toggleSoundscape = (type: "rain" | "wind" | "bowl") => {
    if (ambientSound === type) {
      sounds.stop();
      setAmbientSound(null);
    } else {
      if (type === "rain") sounds.playRain();
      else if (type === "wind") sounds.playWind();
      else if (type === "bowl") sounds.playBowl();
      setAmbientSound(type);
    }
  };

  // --- 3. Mood Affirmation State ---
  const [selectedMoodIndex, setSelectedMoodIndex] = useState<number>(0);
  const [copiedAffirmation, setCopiedAffirmation] = useState<boolean>(false);

  const handleCopyAffirmation = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAffirmation(true);
    setTimeout(() => setCopiedAffirmation(false), 2000);
  };

  // --- 4. Clinical Wellness Screener State (PHQ-4) ---
  const [screenerAnswers, setScreenerAnswers] = useState<{ [qId: number]: number }>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [screenerCompleted, setScreenerCompleted] = useState<boolean>(false);

  const handleAnswerQuestion = (qId: number, points: number) => {
    const updated = { ...screenerAnswers, [qId]: points };
    setScreenerAnswers(updated);
    if (currentQuestionIdx < SCREENER_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setScreenerCompleted(true);
    }
  };

  const totalScreenerScore = Object.values(screenerAnswers).reduce((a, b) => a + b, 0);
  const screenerEvaluation = evaluateScreenerScore(totalScreenerScore);

  const resetScreener = () => {
    setScreenerAnswers({});
    setCurrentQuestionIdx(0);
    setScreenerCompleted(false);
  };

  return (
    <section id="sanctuary" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#f3ecf7] dark:bg-[#4c3755] text-[#815b94] dark:text-[#d4bfdf]">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Interactive Mental Health Suite</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#222c26] dark:text-[#edf4ef]">
            Your Digital Sanctuary for Calm
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            Take a moment to pause. Explore guided breathing, immerse in soothing nature video soundscapes, receive psychological affirmations, or take our brief wellness screener.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="glass-card p-1.5 rounded-full border border-stone-200/80 dark:border-stone-800 flex flex-wrap justify-center gap-1 shadow-sm">
            <button
              onClick={() => setActiveTab("breathing")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "breathing"
                  ? "bg-[#558d6e] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/50 dark:hover:bg-stone-800"
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>Breathing Bubble</span>
            </button>

            <button
              onClick={() => setActiveTab("ambient")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "ambient"
                  ? "bg-[#815b94] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/50 dark:hover:bg-stone-800"
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Ambient Sanctuary Video</span>
            </button>

            <button
              onClick={() => setActiveTab("affirmation")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "affirmation"
                  ? "bg-[#427256] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/50 dark:hover:bg-stone-800"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Mood Affirmations</span>
            </button>

            <button
              onClick={() => setActiveTab("screener")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "screener"
                  ? "bg-gradient-to-r from-[#427256] to-[#815b94] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/50 dark:hover:bg-stone-800"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Wellness Self-Check</span>
            </button>
          </div>
        </div>

        {/* --- TAB 1: GUIDED BREATHING BUBBLE --- */}
        {activeTab === "breathing" && (
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-stone-200/80 dark:border-stone-800 max-w-4xl mx-auto shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Breathing Bubble Visualizer */}
              <div className="md:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-b from-[#f4f8f5]/60 to-[#faf6fc]/60 dark:from-[#18221d]/60 dark:to-[#2c1d35]/60 rounded-3xl border border-stone-200/60 dark:border-stone-800 relative min-h-[340px]">
                {/* Visual Pulsing Breath Ring */}
                <div className="relative flex items-center justify-center">
                  {/* Outer Glow Halo */}
                  <div
                    className={`absolute rounded-full transition-all duration-1000 ${
                      breathPhase === "Inhale"
                        ? "w-64 h-64 bg-[#558d6e]/20 scale-125 blur-xl"
                        : breathPhase === "Hold"
                        ? "w-64 h-64 bg-[#815b94]/25 scale-125 blur-xl"
                        : "w-44 h-44 bg-[#cbdfd1]/20 scale-90 blur-md"
                    }`}
                  />

                  {/* Main Expanding Breathing Orb */}
                  <div
                    className={`w-44 h-44 rounded-full flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-1000 z-10 border-2 ${
                      breathPhase === "Inhale"
                        ? "bg-gradient-to-br from-[#558d6e] to-[#7baa8d] text-white border-white/60 scale-115 shadow-[#558d6e]/40"
                        : breathPhase === "Hold"
                        ? "bg-gradient-to-br from-[#815b94] to-[#b89bc9] text-white border-white/60 scale-115 shadow-[#815b94]/40"
                        : "bg-gradient-to-br from-[#e5efe8] to-[#cbdfd1] dark:from-[#2c4939] dark:to-[#18221d] text-[#2c4939] dark:text-[#cbdfd1] border-[#558d6e]/30 scale-95"
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-widest opacity-90">
                      {isBreathingActive ? breathPhase : "Ready"}
                    </span>
                    <span className="font-serif-luxury text-4xl font-extrabold my-1">
                      {isBreathingActive ? secondsRemaining : "4-7-8"}
                    </span>
                    <span className="text-[10px] opacity-80">
                      {isBreathingActive ? `Cycle #${cyclesCompleted + 1}` : "Tap Start to Begin"}
                    </span>
                  </div>
                </div>

                {/* Controls under bubble */}
                <div className="flex items-center gap-3 mt-6 z-10">
                  <button
                    onClick={toggleBreathing}
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#427256] hover:bg-[#355b46] text-white flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isBreathingActive ? "Pause Exercise" : "Start Breathing"}</span>
                  </button>
                  <button
                    onClick={resetBreathing}
                    className="p-2.5 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                    title="Reset timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Breathing Modes & Guidance */}
              <div className="md:col-span-6 space-y-5">
                <div className="space-y-1">
                  <h3 className="font-serif-luxury text-2xl font-bold text-[#222c26] dark:text-[#edf4ef]">
                    Calm Your Nervous System
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Slowing your exhalation directly activates the vagus nerve, reducing heart rate and soothing physiological anxiety within 90 seconds.
                  </p>
                </div>

                {/* Pattern Selector Pills */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Select Breathing Protocol:
                  </div>
                  {(["478", "box", "relax"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setBreathingMode(mode);
                        setIsBreathingActive(false);
                        setBreathPhase("Inhale");
                        setSecondsRemaining(breathConfigs[mode].inhale);
                      }}
                      className={`w-full p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                        breathingMode === mode
                          ? "bg-white dark:bg-stone-800 border-[#558d6e] shadow-sm"
                          : "bg-white/40 dark:bg-stone-900/40 border-stone-200/60 dark:border-stone-800 hover:bg-white/70 dark:hover:bg-stone-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#222c26] dark:text-[#edf4ef]">
                          {breathConfigs[mode].name}
                        </span>
                        {breathingMode === mode && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#558d6e]/10 text-[#558d6e] dark:text-[#a5c6af] font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">
                        {breathConfigs[mode].desc}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Audio Cue Toggle */}
                <div className="pt-2 flex items-center justify-between border-t border-stone-200/60 dark:border-stone-800">
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    Soft Audio Transition Chime
                  </span>
                  <button
                    onClick={() => setIsAudioCueEnabled(!isAudioCueEnabled)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isAudioCueEnabled
                        ? "bg-[#cbdfd1] text-[#2c4939] dark:bg-[#2c4939] dark:text-[#cbdfd1]"
                        : "bg-stone-100 text-stone-500 dark:bg-stone-800"
                    }`}
                  >
                    {isAudioCueEnabled ? "Sound ON" : "Muted"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: AMBIENT NATURE VIDEO & SOUND SANCTUARY --- */}
        {activeTab === "ambient" && (
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-stone-200/80 dark:border-stone-800 max-w-4xl mx-auto shadow-xl space-y-8">
            {/* Nature Visual Frame with Calming Animated Motion */}
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 dark:border-stone-700 group">
              <Image
                src="/images/nature.jpg"
                alt="Serene nature meditation sanctuary"
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className={`object-cover transition-transform duration-10000 ${
                  isVideoPlaying ? "scale-110" : "scale-100"
                }`}
              />

              {/* Ambient Mist & Light Rays Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

              {/* Video Overlay Info */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div className="space-y-1 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-white/20 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Tranquil Morning Lake Sanctuary</span>
                  </div>
                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold drop-shadow">
                    “In the quiet of nature, the mind finds its natural stillness.”
                  </h3>
                  <p className="text-xs text-stone-200">
                    Dr. Maheen • Clinical Mindfulness Reflection
                  </p>
                </div>

                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white/90 text-stone-900 backdrop-blur-md shadow-lg hover:bg-white flex items-center gap-1.5 transition-all"
                >
                  {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isVideoPlaying ? "Pause Visual Motion" : "Resume Visual"}</span>
                </button>
              </div>
            </div>

            {/* Ambient Soundscape Layer Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif-luxury font-bold text-lg text-[#222c26] dark:text-[#edf4ef]">
                    Layer Calming Ambient Soundscapes
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Synthesized in real-time using calming psychoacoustic frequencies.
                  </p>
                </div>
                {ambientSound && (
                  <button
                    onClick={() => {
                      sounds.stop();
                      setAmbientSound(null);
                    }}
                    className="text-xs text-rose-500 hover:underline font-semibold"
                  >
                    Silence All Audio
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => toggleSoundscape("rain")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                    ambientSound === "rain"
                      ? "bg-[#558d6e] text-white border-[#558d6e] shadow-md"
                      : "bg-white/60 dark:bg-stone-900/60 border-stone-200/60 dark:border-stone-800 hover:bg-white"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      ambientSound === "rain" ? "bg-white/20" : "bg-[#e5efe8] dark:bg-[#2c4939] text-[#558d6e]"
                    }`}
                  >
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Gentle Rainfall</div>
                    <div className="text-[10px] opacity-80">Pink noise for focus & sleep</div>
                  </div>
                </button>

                <button
                  onClick={() => toggleSoundscape("wind")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                    ambientSound === "wind"
                      ? "bg-[#427256] text-white border-[#427256] shadow-md"
                      : "bg-white/60 dark:bg-stone-900/60 border-stone-200/60 dark:border-stone-800 hover:bg-white"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      ambientSound === "wind" ? "bg-white/20" : "bg-[#cbdfd1] dark:bg-[#355b46] text-[#427256]"
                    }`}
                  >
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Mountain Breeze</div>
                    <div className="text-[10px] opacity-80">Soft grounding outdoor air</div>
                  </div>
                </button>

                <button
                  onClick={() => toggleSoundscape("bowl")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                    ambientSound === "bowl"
                      ? "bg-[#815b94] text-white border-[#815b94] shadow-md"
                      : "bg-white/60 dark:bg-stone-900/60 border-stone-200/60 dark:border-stone-800 hover:bg-white"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      ambientSound === "bowl" ? "bg-white/20" : "bg-[#f3ecf7] dark:bg-[#4c3755] text-[#815b94]"
                    }`}
                  >
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">432Hz Tibetan Bowl</div>
                    <div className="text-[10px] opacity-80">Harmonic restorative tone</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: DAILY MOOD AFFIRMATIONS --- */}
        {activeTab === "affirmation" && (
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-stone-200/80 dark:border-stone-800 max-w-4xl mx-auto shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#222c26] dark:text-[#edf4ef]">
                How is your heart feeling today?
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Select your current emotional state to unlock psychologist-curated grounding affirmations and micro-coping practices.
              </p>
            </div>

            {/* Mood Option Badges */}
            <div className="flex flex-wrap justify-center gap-2">
              {MOOD_AFFIRMATIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMoodIndex(idx)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedMoodIndex === idx
                      ? "bg-[#558d6e] text-white shadow-md scale-105"
                      : "bg-white/70 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700 text-[var(--text-primary)] hover:bg-white"
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.mood}</span>
                </button>
              ))}
            </div>

            {/* Displayed Affirmation Card */}
            {(() => {
              const currentAffirmation = MOOD_AFFIRMATIONS[selectedMoodIndex];
              return (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/90 via-white/60 to-[#f4f8f5] dark:from-stone-900/90 dark:via-stone-900/60 dark:to-[#18221d] border border-[#558d6e]/30 shadow-lg space-y-5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#815b94] dark:text-[#b89bc9]">
                      {currentAffirmation.theme}
                    </span>
                    <button
                      onClick={() => handleCopyAffirmation(currentAffirmation.affirmation)}
                      className="text-xs text-[var(--text-muted)] hover:text-[#558d6e] flex items-center gap-1.5 cursor-pointer"
                      title="Copy affirmation"
                    >
                      {copiedAffirmation ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAffirmation ? "Copied to Clipboard" : "Copy"}</span>
                    </button>
                  </div>

                  <blockquote className="font-serif-luxury text-xl sm:text-2xl italic font-bold text-[#2c4939] dark:text-[#edf4ef] leading-relaxed">
                    “{currentAffirmation.affirmation}”
                  </blockquote>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-200/60 dark:border-stone-800">
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#558d6e]">
                        Psychological Insight:
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        {currentAffirmation.therapeuticNote}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#815b94] dark:text-[#b89bc9]">
                        1-Minute Micro Practice:
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        {currentAffirmation.microPractice}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* --- TAB 4: CLINICAL WELLNESS SCREENER (PHQ-4) --- */}
        {activeTab === "screener" && (
          <div id="screener" className="glass-card rounded-3xl p-6 sm:p-10 border border-stone-200/80 dark:border-stone-800 max-w-4xl mx-auto shadow-xl space-y-6">
            {!screenerCompleted ? (
              <div className="space-y-6">
                {/* Progress Header */}
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Question {currentQuestionIdx + 1} of {SCREENER_QUESTIONS.length}
                  </div>
                  <div className="text-xs font-bold text-[#558d6e]">
                    PHQ-4 Standard Screener
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#558d6e] to-[#815b94] transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIdx + 1) / SCREENER_QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Question */}
                <div className="space-y-3 py-2">
                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#222c26] dark:text-[#edf4ef] leading-snug">
                    {SCREENER_QUESTIONS[currentQuestionIdx].text}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Think about how often you have been bothered by this over the past two weeks.
                  </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SCREENER_QUESTIONS[currentQuestionIdx].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        handleAnswerQuestion(
                          SCREENER_QUESTIONS[currentQuestionIdx].id,
                          option.points
                        )
                      }
                      className="p-4 rounded-2xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/70 dark:border-stone-700 hover:border-[#558d6e] hover:bg-white dark:hover:bg-stone-700 text-left transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <span className="text-sm font-semibold text-[#222c26] dark:text-[#edf4ef]">
                        {option.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 group-hover:text-[#558d6e] transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Completed Result State */
              <div className="space-y-6 text-center py-4">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#e5efe8] dark:bg-[#2c4939] text-[#558d6e] mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>

                <div className="space-y-2 max-w-xl mx-auto">
                  <div className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold">
                    Your Confidential Assessment Result
                  </div>
                  <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#222c26] dark:text-[#edf4ef]">
                    {screenerEvaluation.title}
                  </h3>
                  <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold my-2 shadow-xs">
                    <span className={screenerEvaluation.badgeColor + " px-3 py-1 rounded-full"}>
                      Score: {totalScreenerScore}/12 • {screenerEvaluation.level}
                    </span>
                  </div>
                </div>

                <div className="max-w-xl mx-auto p-5 rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 text-left space-y-3">
                  <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-medium">
                    {screenerEvaluation.summary}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    💡 <strong className="text-[var(--text-primary)]">Clinical Note:</strong> {screenerEvaluation.recommendation}
                  </p>
                </div>

                {/* Call to Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      if (onOpenBookingWithScore) {
                        onOpenBookingWithScore(totalScreenerScore, screenerEvaluation.level);
                      }
                    }}
                    className="px-6 py-3 rounded-full text-xs font-bold bg-gradient-to-r from-[#427256] via-[#558d6e] to-[#815b94] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Session With This Result</span>
                  </button>

                  <a
                    href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/healingspace-psychology/therapy-session"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full text-xs font-bold bg-[#815b94] hover:bg-[#6c487f] text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule on Calendly</span>
                  </a>

                  <a
                    href={`https://wa.me/923149341597?text=${encodeURIComponent(
                      `Hello Dr. Maheen! I took the mental wellness self-check screener on The Healing Space website. My score was ${totalScreenerScore}/12 (${screenerEvaluation.level}). I would like to schedule a consultation.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Score to WhatsApp</span>
                  </a>

                  <button
                    onClick={resetScreener}
                    className="px-4 py-3 rounded-full text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                  >
                    Retake Screener
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
