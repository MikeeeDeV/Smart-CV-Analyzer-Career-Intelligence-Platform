---
name: motion-animations-interactions
description: >-
  Use this skill when implementing, refining, or debugging animations, micro-interactions,
  transitions, and physics-based gestures using Motion (framer-motion v12) in React 19,
  including staggered lists, animated SVG radial gauges, tab transitions, modal dialogs,
  spring physics, and celebratory confetti effects.
---

# Motion Animations & Micro-Interactions Guide (Motion 12 & React 19)

This skill provides production patterns for animations, transitions, and micro-interactions in CAREER.AI using `motion` (Motion 12) and `canvas-confetti`.

---

## 1. Core Principles for Career Intelligence UX

1. **Purposeful Motion:** Animations should guide the user's attention (e.g., drawing attention to a score increase, highlighting an ATS weakness, or celebrating a completed roadmap milestone).
2. **Spring Physics Over Easing Curves:** Use springs (`stiffness`, `damping`) for a snappy, tactile feel rather than static linear transitions.
3. **GPU-Accelerated Properties:** Only animate `transform` (`scale`, `x`, `y`, `rotate`) and `opacity`. Never animate `width`, `height`, `margin`, or `left` directly as they trigger layout recalculations.
4. **RTL-Aware Motion:** When translating elements (`x: 20` vs `x: -20`), adapt direction based on the current language (`lang === 'ar'`).

---

## 2. Staggered List Animations (Skill Badges, Bullets & Roadmaps)

Used when rendering lists of skills, experience bullets, or roadmap milestones so items reveal smoothly one after another:

```tsx
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 25,
    },
  },
};

export const SkillList: React.FC<{ skills: string[] }> = ({ skills }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="flex flex-wrap gap-2"
  >
    {skills.map((skill) => (
      <motion.span
        key={skill}
        variants={itemVariants}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="px-3 py-1 text-sm rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-slate-200 transition-colors cursor-pointer"
      >
        {skill}
      </motion.span>
    ))}
  </motion.div>
);
```

---

## 3. Animated Circular SVG Score Gauge (ATS Radial Ring)

Animates the SVG stroke from 0% to the target score percentage smoothly on mount:

```tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ScoreGaugeProps {
  score: number; // 0 - 100
  size?: number; // default 140
  strokeWidth?: number; // default 10
}

export const AnimatedScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Animated number counter hook
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const increment = score / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const getColor = (s: number) => {
    if (s >= 80) return '#10b981'; // emerald
    if (s >= 65) return '#f59e0b'; // amber
    return '#f43f5e'; // rose
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated fill stroke */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      {/* Central Counter Display */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold tracking-tight text-white">{displayScore}</span>
        <span className="text-xs font-medium text-slate-400">/ 100</span>
      </div>
    </div>
  );
};
```

---

## 4. Modal Dialogs & Drawer Transitions with `AnimatePresence`

Ensure seamless entering and exiting when opening explanations, score breakdowns, or chat sidebars:

```tsx
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const AnimatedModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-xl p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-10"
        >
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
```

---

## 5. Tactile Micro-Interactions & Hover Effects

Add lively responsive feedback to buttons, upload cards, and tabs:

```tsx
// Interactive Tab Button with Animated Active Indicator
<button
  onClick={() => setActiveTab(tab.id)}
  className="relative px-4 py-2 text-sm font-medium transition-colors"
>
  {activeTab === tab.id && (
    <motion.div
      layoutId="active-tab-indicator"
      className="absolute inset-0 bg-indigo-500/20 border-b-2 border-indigo-500 rounded-t-lg"
      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
    />
  )}
  <span className="relative z-10">{tab.label}</span>
</button>
```

---

## 6. Celebratory Confetti Presets (`canvas-confetti`)

Trigger distinct visual celebrations based on user achievements:

```typescript
import confetti from 'canvas-confetti';

// 1. High Score / ATS Acceptance Explosion (> 85%)
export function triggerATSSuccessConfetti() {
  confetti({
    particleCount: 90,
    spread: 75,
    origin: { y: 0.65 },
    colors: ['#10b981', '#3b82f6', '#6366f1', '#f59e0b'],
  });
}

// 2. Dual Fireworks for Milestone / Roadmap Completion
export function triggerMilestoneCelebration() {
  const end = Date.now() + 1000;
  const interval: any = setInterval(() => {
    if (Date.now() > end) return clearInterval(interval);
    confetti({ startVelocity: 30, spread: 360, ticks: 60, origin: { x: Math.random(), y: Math.random() - 0.2 } });
  }, 200);
}
```
