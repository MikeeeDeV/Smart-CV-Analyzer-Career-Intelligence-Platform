---
name: ats-scoring-engine
description: >-
  Use this skill when modifying, diagnosing, or extending the ATS scoring algorithms,
  the 6-dimensional evaluation breakdown, keyword density checks, Google X-Y-Z formula
  bullet point rewrites, and the interactive Job-Fit What-If simulator.
---

# ATS Scoring & Diagnostics Engine

This skill covers the methodology, mathematics, and heuristics used in CAREER.AI to compute Applicant Tracking System (ATS) scores and optimize resume content.

## The 6 Dimensions of ATS Evaluation

The total overall score (0–100) is calculated as a weighted synthesis of 6 critical dimensions:

| Dimension | Weight | Target Aspects |
| :--- | :---: | :--- |
| **ATS Parseability** (`atsScore`) | **20%** | Standard section headings, single-column layout friendliness, no non-parseable tables or images, clean contact info. |
| **Content Quality** (`contentQuality`) | **20%** | Active voice verbs, action-oriented bullet points, professional summary presence, absence of buzzword fluff. |
| **Skill Density & Matching** (`skillsScore`) | **20%** | Ratio of recognized hard skills, tools, and frameworks matched against target industry standards. |
| **Experience & Impact** (`experienceScore`) | **20%** | Quantified results (numbers, %, $, hours saved), Google's X-Y-Z formula adherence, chronological clarity. |
| **Layout & Formatting** (`formattingScore`) | **10%** | Consistent date formats, bullet point balance (3-5 per role), clean typography, proper length (1-2 pages). |
| **Projects & Portfolio** (`projectsScore`) | **10%** | Live URLs (GitHub, demo links), explicit tech stacks mentioned per project, clear problem-solution context. |

```
Overall Score = (atsScore * 0.20) + (contentQuality * 0.20) + (skillsScore * 0.20)
              + (experienceScore * 0.20) + (formattingScore * 0.10) + (projectsScore * 0.10)
```

---

## Google X-Y-Z Formula for Bullet Points

The engine enforces Google's gold-standard formula:
> **"Accomplished [X], as measured by [Y], by doing [Z]"**
> *(أنجزت [س]، كما تم قياسه بـ [ص]، من خلال فعل [ع])*

### Transformation Pattern

* **Weak Bullet (Before):**
  > *"Responsible for maintaining company databases and running weekly reports."*
* **X-Y-Z Optimized (After):**
  > *"Optimized PostgreSQL query latency by 42% across 15 production microservices by redesigning indexing strategies and query execution plans (Accomplished [X: latency drop], Measured [Y: 42%], Doing [Z: indexing])."*

* **Arabic Weak Bullet (Before):**
  > *"مسؤول عن تطوير الواجهات الأمامية للتطبيق."*
* **Arabic X-Y-Z Optimized (After):**
  > *"طوّرت 8 شاشات تفاعلية باستخدام React 19 مما خفّض زمن تحميل الصفحات بنسبة 35% وزاد معدل تفاعل المستخدمين اليومي بنسبة 20% عبر تطبيق تقنيات تقسيم الكود (Code Splitting)."*

Endpoint in `server.ts`: `/api/cv/improve-bullet`
Request payload: `{ bullet: string, role?: string, lang?: 'ar' | 'en' }`

---

## Interactive "What-If" Fit Simulator Logic

Located in `src/components/JobFitSimulator.tsx` and computed against `src/types.ts:ScoreBreakdown`.

### Simulation Mechanics

1. **Adding a High-Priority Missing Skill:**
   - Boosts `skillsMatch` by `+5%` to `+8%` (capped at 98%).
   - Recalculates `overallMatch`.
2. **Quantifying Bullet Points (Metrics Boost):**
   - Boosts `experienceMatch` and `contentQuality` by `+4%` to `+6%`.
3. **Adding a Project Tech Stack:**
   - Boosts `projectsScore` by `+5%`.
4. **Triggering Confetti:**
   - When overall score surpasses 80 or improves by >= 15 points, invoke `canvas-confetti`:
     ```typescript
     import confetti from 'canvas-confetti';
     confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
     ```

---

## Heuristic Scoring Rules (`heuristicScore`)

When Gemini API is offline, `server.ts` uses rule-based scoring:
- **Contact Check:** Email found (+10), Phone found (+10), LinkedIn/GitHub (+10).
- **Quantification Detection:** Counts regex patterns for metrics: `/\d+%|\$[\d,]+|\b\d+\s*(users|clients|projects|ms|sec|hours|مستخدم|مشروع|عميل)/gi`. If count >= 4, score receives full 20/20 impact points.
- **Action Verbs Check:** Checks for strong verbs (`built`, `engineered`, `spearheaded`, `designed`, `طوّر`, `أنشأ`, `قاد`).
