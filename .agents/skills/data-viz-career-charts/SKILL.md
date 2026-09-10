---
name: data-viz-career-charts
description: >-
  Use this skill when developing, styling, or animating career data visualizations in CAREER.AI,
  including pure SVG Radar/Spider charts for 6-dimension ATS scores, comparative progress bars,
  milestone timeline roadmaps, and animated metric counters without heavy external dependencies.
---

# Career Data Visualization & Charts Guide

This skill provides zero-dependency, lightweight, high-performance SVG visualization components tailored for CAREER.AI's ATS scores, skill matrices, and career timelines.

---

## 1. Zero-Dependency Pure SVG Radar / Spider Chart

Visualizes the 6 core ATS dimensions simultaneously:
1. ATS Parseability (`atsScore`)
2. Content Quality (`contentQuality`)
3. Skill Match (`skillsScore`)
4. Experience Impact (`experienceScore`)
5. Layout & Formatting (`formattingScore`)
6. Projects & Portfolio (`projectsScore`)

### React Component Implementation

```tsx
import React from 'react';
import { motion } from 'motion/react';
import { ScoreBreakdown, Language } from '../types';

interface ATSRadarChartProps {
  score: ScoreBreakdown;
  lang: Language;
  size?: number; // default: 320
}

export const ATSRadarChart: React.FC<ATSRadarChartProps> = ({ score, lang, size = 320 }) => {
  const isAr = lang === 'ar';
  const center = size / 2;
  const radius = center - 45; // margin for labels

  const axes = [
    { key: 'atsScore', label: isAr ? 'توافق ATS' : 'ATS Compatibility', value: score.atsScore },
    { key: 'contentQuality', label: isAr ? 'جودة المحتوى' : 'Content Quality', value: score.contentQuality },
    { key: 'skillsScore', label: isAr ? 'المهارات' : 'Skills', value: score.skillsScore },
    { key: 'experienceScore', label: isAr ? 'الخبرة العملية' : 'Experience', value: score.experienceScore },
    { key: 'formattingScore', label: isAr ? 'التنسيق' : 'Formatting', value: score.formattingScore },
    { key: 'projectsScore', label: isAr ? 'المشاريع' : 'Projects', value: score.projectsScore },
  ];

  const totalAxes = axes.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Compute coordinate points (0-100 normalized)
  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build SVG polygon points
  const points = axes.map((axis, i) => {
    const { x, y } = getCoordinates(axis.value, i);
    return `${x},${y}`;
  }).join(' ');

  // Grid levels (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background concentric web polygons */}
        {levels.map((lvl) => {
          const levelPoints = axes.map((_, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            const r = lvl * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');
          return (
            <polygon
              key={lvl}
              points={levelPoints}
              fill="none"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray={lvl === 1 ? 'none' : '3,3'}
              opacity="0.6"
            />
          );
        })}

        {/* Radial Axis Spokes */}
        {axes.map((_, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="#334155"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {/* Animated Filled Score Area */}
        <motion.polygon
          points={points}
          fill="rgba(99, 102, 241, 0.25)"
          stroke="#6366f1"
          strokeWidth="2.5"
          initial={{ opacity: 0, scale: 0.5, transformOrigin: `${center}px ${center}px` }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Axis Labels and Points */}
        {axes.map((axis, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const { x, y } = getCoordinates(axis.value, i);
          const labelX = center + (radius + 20) * Math.cos(angle);
          const labelY = center + (radius + 16) * Math.sin(angle);

          return (
            <g key={axis.key}>
              <circle cx={x} cy={y} r="4" fill="#818cf8" stroke="#0f172a" strokeWidth="2" />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[11px] font-medium fill-slate-300"
              >
                {axis.label} ({axis.value}%)
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
```

---

## 2. Animated Comparative Benchmark Progress Bar

Displays candidate score vs market standard (e.g. 75% for top 10% applicants):

```tsx
export const ComparativeBar: React.FC<{ label: string; candidateScore: number; benchmark?: number }> = ({
  label,
  candidateScore,
  benchmark = 75,
}) => (
  <div className="space-y-1.5 w-full">
    <div className="flex justify-between text-xs text-slate-300">
      <span className="font-medium">{label}</span>
      <span className="font-mono font-bold text-indigo-400">{candidateScore}%</span>
    </div>
    <div className="relative h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
      {/* Target benchmark line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
        style={{ left: `${benchmark}%` }}
        title={`Market Benchmark: ${benchmark}%`}
      />
      {/* Animated candidate fill */}
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
        initial={{ width: 0 }}
        animate={{ width: `${candidateScore}%` }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  </div>
);
```

---

## 3. Interactive Milestone Timeline Nodes

Used in `src/components/CareerRoadmapSection.tsx`:

```tsx
export const TimelineMilestoneNode: React.FC<{
  status: 'completed' | 'current' | 'upcoming';
  level: string;
  skill: string;
  isLast?: boolean;
}> = ({ status, level, skill, isLast }) => {
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  return (
    <div className="flex items-start gap-4">
      {/* Node column */}
      <div className="flex flex-col items-center">
        <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
          isCompleted
            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
            : isCurrent
            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
            : 'bg-slate-800 border-slate-700 text-slate-500'
        }`}>
          {isCurrent && (
            <span className="absolute -inset-1 rounded-full bg-indigo-500/30 animate-ping" />
          )}
          <span className="text-xs font-bold font-mono">{isCompleted ? '✓' : '•'}</span>
        </div>
        {!isLast && <div className="w-0.5 h-12 bg-slate-800 my-1" />}
      </div>
      {/* Content */}
      <div>
        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
          {level}
        </span>
        <h4 className="text-sm font-semibold text-white mt-1">{skill}</h4>
      </div>
    </div>
  );
};
```
