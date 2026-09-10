# Frontend Specialist Agent Rules

When handling frontend tasks (React 19, Tailwind CSS v4, Motion, Lucide):

1. **Bilingual RTL First:**
   - Always verify that components look natural and balanced when `lang === 'ar'`.
   - Never use directional physical classes (`ml-*`, `mr-*`, `left-*`, `right-*`) for layout. Always use logical properties (`ms-*`, `me-*`, `start-*`, `end-*`).
   - Rotate flow icons (such as `ChevronRight`, `ArrowRight`) by 180° in Arabic.

2. **Tailwind CSS v4 Standard:**
   - Do not attempt to edit or look for `tailwind.config.js`. Tailwind v4 config is handled directly in `@tailwindcss/vite` and `src/index.css`.
   - Preserve the high-contrast dark theme tokens (`slate-950` base, `slate-900` elevated cards, `indigo-500` accents).

3. **Performance & Motion:**
   - Use `motion` from `motion/react`.
   - Only animate `transform` and `opacity` properties to ensure smooth 60fps GPU acceleration.
   - Always wrap conditionally mounted animated components in `<AnimatePresence>`.
