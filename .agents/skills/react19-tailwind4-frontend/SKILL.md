---
name: react19-tailwind4-frontend
description: >-
  Use this skill when developing, refactoring, or styling UI components in CAREER.AI,
  covering React 19, Tailwind CSS v4, Motion (framer-motion v12), Lucide React icons,
  bilingual Arabic RTL / English LTR layouts, and responsive dashboard design.
---

# React 19 & Tailwind CSS v4 Frontend Architecture

This skill provides guidelines and patterns for frontend development in the CAREER.AI application.

## Tech Stack Highlights

- **Framework:** React 19 (`react`, `react-dom` v19.0+)
- **Build Tool:** Vite 6 (`@vitejs/plugin-react` v5)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss` v4.1+)
- **Animation:** Motion (`motion` v12+)
- **Icons:** `lucide-react` (0.546+)
- **Celebrations:** `canvas-confetti`

---

## 1. Tailwind CSS v4 Setup & Best Practices

Tailwind v4 uses the new CSS-first configuration and Vite plugin instead of `tailwind.config.js`.

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### `src/index.css`
```css
@import "tailwindcss";

@layer base {
  body {
    @apply bg-slate-950 text-slate-100 antialiased;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }
}
```

> [!TIP]
> In Tailwind v4, use standard utility classes. Dynamic color scales (slate, emerald, indigo, violet, rose, amber) are available out of the box without manual config files.

---

## 2. Bilingual RTL & LTR Architecture

CAREER.AI natively supports both Arabic (`ar`) and English (`en`).

### State & Layout Switching in `src/App.tsx`
```typescript
const [lang, setLang] = useState<'ar' | 'en'>('ar');

// In JSX root:
<div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={lang === 'ar' ? 'font-sans' : 'font-sans'}>
```

### RTL Design Rules
1. **Directional Padding/Margin:** Prefer logical utilities or conditional classes:
   - Use `ms-*` (margin-inline-start) and `me-*` (margin-inline-end) instead of hardcoded `ml-*` / `mr-*`.
   - Use `ps-*` and `pe-*` for padding.
2. **Directional Icons:** When displaying arrows (e.g., `ChevronRight`, `ArrowLeft`), check direction:
   ```tsx
   <ChevronRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
   ```
3. **Typography:** Arabic fonts render best with slightly looser line-height (`leading-relaxed`).

---

## 3. Motion Animations (`motion/react`)

Use `motion` from `motion` (Motion 12):

```tsx
import { motion, AnimatePresence } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
  className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800"
>
  {/* Content */}
</motion.div>
```

---

## 4. Confetti Celebrations (`canvas-confetti`)

Used when a candidate achieves a score increase or milestone:

```typescript
import confetti from 'canvas-confetti';

export function fireCelebration() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
  });
}
```

---

## 5. UI Quality Standards

- **Dark Mode First:** Default to high-contrast, premium dark mode palette (`slate-950` base, `slate-900` cards, `slate-800` borders, `indigo-500` / `blue-500` accents).
- **Glassmorphism:** Use subtle backdrop blurs (`backdrop-blur-md bg-slate-900/60`).
- **Interactive Feedback:** Always add hover transitions (`hover:border-indigo-500/50 transition-all duration-200`) on clickable cards.
