# CAREER.AI Project Rules & Architecture Guidelines

Welcome to the **Smart CV Analyzer & Career Intelligence Platform (CAREER.AI)** codebase. All agents operating in this repository must follow these engineering principles.

---

## 1. Core Technology Stack

- **Frontend:** React 19 (`react`, `react-dom`), Vite 6 (`@vitejs/plugin-react`), TypeScript 5.8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) - *No tailwind.config.js; use CSS imports in `src/index.css`*
- **Motion & UI:** `motion` (Motion 12), `lucide-react`, `canvas-confetti`
- **Backend:** Node.js 18+, Express 4.21, `tsx` for dev, `esbuild` for production bundling
- **AI SDK:** `@google/genai` (SDK v2.4+) with `gemini-2.5-flash` / `gemini-3.7-flash`
- **File Ingestion:** `pdf-parse`, `mammoth` (DOCX), UTF-8 text decoder

---

## 2. Fundamental Architectural Rules

### Rule 1: Zero-Failure Dual-Engine Resilience
Never assume `process.env.GEMINI_API_KEY` is present, valid, or free from rate limits.
- **Always** maintain deterministic fallback functions (`dynamicHeuristicParse`, `heuristicScore`, `heuristicJobMatch`).
- If a call to `getAI().models.generateContent()` fails or throws an exception, catch it gracefully and fallback to heuristic computation.
- The user interface must never crash or display an unhandled error state.

### Rule 2: First-Class Bilingual Support (Arabic RTL & English LTR)
- CAREER.AI supports both Arabic and English.
- Arabic is the default language. Ensure `dir="rtl"` layout correctness.
- Use logical CSS properties (`ms-*`, `me-*`, `ps-*`, `pe-*`) instead of directional hardcoded margins (`ml-*`, `mr-*`).
- Rotate directional icons (such as `ChevronRight` and arrows) when rendering in RTL.

### Rule 3: ATS & Google X-Y-Z Scoring Standards
- ATS scoring must always reflect the 6 core dimensions:
  1. ATS Parseability (20%)
  2. Content Quality (20%)
  3. Skill Density (20%)
  4. Experience Impact (20%)
  5. Layout & Formatting (10%)
  6. Projects & Portfolio (10%)
- Bullet point rewrites must strictly adhere to Google's X-Y-Z formula:
  *"Accomplished [X], as measured by [Y], by doing [Z]"*.

### Rule 4: Code Quality & Type Safety
- Always ensure TypeScript compiles cleanly: `npm run lint` (`tsc --noEmit`).
- Do not introduce `any` types unless interfacing with dynamic third-party buffer parsers.
- Retain existing code comments, docstrings, and bilingual mock profiles.

---

## 3. Dedicated Skills Installed in `.agents/skills/`

When working on specific domains of this project, consult the following workspace skills:
- `gemini-cv-pipeline`: Google GenAI SDK usage, JSON schemas, prompt templates, and rate limit handling.
- `ats-scoring-engine`: 6-dimension scoring math, Google X-Y-Z bullet rewrites, and Job-Fit What-If simulator.
- `cv-file-ingestion`: Binary PDF/DOCX parsing, buffer sanitization, Base64 decoders, and regex NLP fallback.
- `career-intelligence`: Job matching, skill gap prioritization, milestone roadmaps, and STAR interview questions.
- `react19-tailwind4-frontend`: React 19 UI patterns, Tailwind CSS v4, Motion animations, and RTL styling.
- `motion-animations-interactions`: Advanced Motion 12 spring physics, SVG radial gauges, staggered entry, and confetti presets.
- `modern-frontend-ui-ux`: Dark-mode glassmorphism tokens, accessible drag & drop zones, ARIA tabs, and simulator controls.
- `data-viz-career-charts`: Pure SVG Radar/Spider charts, animated comparative benchmarks, and milestone timelines.
- `career-platform-ops`: Dev workflow, build scripts (`npm run build`), TypeScript checks, and server debugging.

