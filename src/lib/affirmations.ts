export interface MoodAffirmation {
  mood: string;
  emoji: string;
  color: string;
  theme: string;
  affirmation: string;
  therapeuticNote: string;
  microPractice: string;
}

export const MOOD_AFFIRMATIONS: MoodAffirmation[] = [
  {
    mood: "Anxious / Overthinking",
    emoji: "🌀",
    color: "from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300",
    theme: "Grounding & Safety",
    affirmation: "I am safe in this present moment. My thoughts are merely mental events, not absolute facts. I can pause and breathe.",
    therapeuticNote: "Anxiety is the brain's alarm system misfiring. Thank your mind for trying to protect you, then gently bring attention back to your physical senses.",
    microPractice: "Look around and name 3 blue objects, touch 2 distinct textures, and take 1 deep belly breath.",
  },
  {
    mood: "Overwhelmed / Exhausted",
    emoji: "🌧️",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-700 dark:text-blue-300",
    theme: "Rest & Self-Compassion",
    affirmation: "Rest is not a reward I earn after suffering; it is a fundamental requirement for healing. I give myself permission to slow down.",
    therapeuticNote: "When capacity is low, drop non-essential expectations. Prioritize gentle nourishment over productivity.",
    microPractice: "Drop your shoulders away from your ears, unclench your jaw, and let your stomach soften completely.",
  },
  {
    mood: "Sad / Grieving / Heavy",
    emoji: "💙",
    color: "from-sky-500/20 to-teal-500/20 text-teal-700 dark:text-teal-300",
    theme: "Emotional Validation",
    affirmation: "It is okay to feel sadness. My feelings do not define my entire life; they are passing clouds through the sky of my consciousness.",
    therapeuticNote: "Suppressing sorrow only prolongs it. Compassionate acceptance allows emotional energy to naturally metabolize.",
    microPractice: "Place both hands gently over your heart. Feel the warm pressure and whisper: 'May I be gentle with myself right now.'",
  },
  {
    mood: "Self-Critical / Insecure",
    emoji: "🌱",
    color: "from-emerald-500/20 to-green-500/20 text-emerald-700 dark:text-emerald-300",
    theme: "Inner Child & Self-Worth",
    affirmation: "I am worthy of love, respect, and kindness—especially from myself. I am learning and growing at my own beautiful pace.",
    therapeuticNote: "Notice if the critical voice inside sounds like someone else from your past. Respond with the kindness of a supportive mentor.",
    microPractice: "Ask yourself: 'What would I tell my dearest friend if they were feeling this way?' Speak those words to yourself.",
  },
  {
    mood: "Hopeful / Ready to Heal",
    emoji: "✨",
    color: "from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300",
    theme: "Growth & Transformation",
    affirmation: "I am actively creating a peaceful sanctuary within myself. Every small step of awareness is a victory on my healing path.",
    therapeuticNote: "Celebrate your readiness to invest in your mental health. Neuroplasticity proves your mind can rewire for peace.",
    microPractice: "Write down or mentally note one tiny moment today that brought you a sense of quiet gratitude.",
  },
];

export interface ScreenerQuestion {
  id: number;
  text: string;
  category: "anxiety" | "depression";
  options: { label: string; points: number }[];
}

// PHQ-4 Standard Ultra-Brief Screener
export const SCREENER_QUESTIONS: ScreenerQuestion[] = [
  {
    id: 1,
    text: "Over the last 2 weeks, how often have you felt nervous, anxious, or on edge?",
    category: "anxiety",
    options: [
      { label: "Not at all", points: 0 },
      { label: "Several days", points: 1 },
      { label: "More than half the days", points: 2 },
      { label: "Nearly every day", points: 3 },
    ],
  },
  {
    id: 2,
    text: "Over the last 2 weeks, how often have you not been able to stop or control worrying?",
    category: "anxiety",
    options: [
      { label: "Not at all", points: 0 },
      { label: "Several days", points: 1 },
      { label: "More than half the days", points: 2 },
      { label: "Nearly every day", points: 3 },
    ],
  },
  {
    id: 3,
    text: "Over the last 2 weeks, how often have you felt little interest or pleasure in doing things?",
    category: "depression",
    options: [
      { label: "Not at all", points: 0 },
      { label: "Several days", points: 1 },
      { label: "More than half the days", points: 2 },
      { label: "Nearly every day", points: 3 },
    ],
  },
  {
    id: 4,
    text: "Over the last 2 weeks, how often have you felt down, depressed, or hopeless?",
    category: "depression",
    options: [
      { label: "Not at all", points: 0 },
      { label: "Several days", points: 1 },
      { label: "More than half the days", points: 2 },
      { label: "Nearly every day", points: 3 },
    ],
  },
];

export function evaluateScreenerScore(score: number): {
  level: string;
  title: string;
  badgeColor: string;
  summary: string;
  recommendation: string;
} {
  if (score <= 2) {
    return {
      level: "Normal / Minimal Distress",
      title: "Gentle Resilience",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
      summary: "Your current responses suggest minimal symptoms of distress. Your emotional foundation appears balanced.",
      recommendation: "Focus on preventative self-care, mindfulness habits, and regular reflection to sustain your well-being.",
    };
  } else if (score <= 5) {
    return {
      level: "Mild Emotional Strain",
      title: "Mild Stress & Weariness",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      summary: "You are experiencing noticeable stress or mild anxiety/low mood that may be draining your cognitive energy.",
      recommendation: "Early therapeutic conversations can prevent mild burnout from escalating. Consider booking a 1-on-1 discovery session with  Maheen.",
    };
  } else if (score <= 8) {
    return {
      level: "Moderate Distress",
      title: "Moderate Anxiety / Mood Weight",
      badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
      summary: "Your scores indicate moderate anxiety or depressive fatigue impacting your daily peace, sleep, or concentration.",
      recommendation: "Structured evidence-based therapy (CBT/ACT) is highly beneficial at this stage. We strongly recommend scheduling a clinical consultation.",
    };
  } else {
    return {
      level: "Elevated / Severe Distress",
      title: "Significant Emotional Overload",
      badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
      summary: "You are carrying a heavy emotional burden that is significantly affecting your quality of life and energy.",
      recommendation: "Please know that you do not have to carry this alone.  Maheen offers compassionate, confidential clinical support to help you heal step by step.",
    };
  }
}
