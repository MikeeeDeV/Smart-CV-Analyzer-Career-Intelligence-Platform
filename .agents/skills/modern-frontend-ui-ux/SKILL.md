---
name: modern-frontend-ui-ux
description: >-
  Use this skill when designing, building, or refactoring frontend UI/UX in CAREER.AI,
  covering React 19, Tailwind CSS v4 design tokens, dark-mode glassmorphism, bilingual RTL/LTR
  layouts, drag-and-drop file upload zones, accessible tabs, and interactive simulator controls.
---

# Modern Frontend UI/UX Architecture & Guidelines

This skill provides design system tokens, layout conventions, and component patterns tailored for the CAREER.AI platform.

---

## 1. Design System & Theme Tokens (Tailwind CSS v4)

CAREER.AI uses a high-contrast, cybersecurity/AI enterprise aesthetic:
- **Base Background:** `bg-slate-950` (#020617)
- **Elevated Surfaces / Cards:** `bg-slate-900/70` with `border border-slate-800/80 backdrop-blur-xl`
- **Secondary Surfaces:** `bg-slate-800/40`
- **Primary Accent / Brand:** `indigo-500` (#6366f1) and `violet-500` (#8b5cf6)
- **Status Accents:**
  - Success / High Fit (>= 80%): `emerald-500` (#10b981)
  - Warning / Medium Fit (65-79%): `amber-500` (#f59e0b)
  - Critical / Low Fit (< 65%): `rose-500` (#f43f5e)

### Glassmorphism Utility Classes
```html
<div class="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 border border-slate-800/80 shadow-2xl backdrop-blur-xl hover:border-indigo-500/40 transition-all duration-300">
  <!-- Subtle top glow -->
  <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
  <!-- Card Content -->
</div>
```

---

## 2. First-Class Bilingual Support (Arabic RTL & English LTR)

Arabic is the primary language of the application, while full English support is maintained simultaneously.

### The 4 Golden Rules for RTL Layouts

1. **Root Configuration:**
   Always manage direction at the wrapper level:
   ```tsx
   <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={lang === 'ar' ? 'font-sans' : 'font-sans'}>
   ```

2. **Logical CSS Properties Over Physical:**
   - ❌ `ml-4` / `mr-4` ➔ ✅ `ms-4` (margin-inline-start) / `me-4` (margin-inline-end)
   - ❌ `pl-3` / `pr-3` ➔ ✅ `ps-3` / `pe-3`
   - ❌ `left-0` / `right-0` ➔ ✅ `start-0` / `end-0`
   - ❌ `text-left` / `text-right` ➔ ✅ `text-start` / `text-end`

3. **Directional Icons Mirrored:**
   Icons implying flow or progression (e.g., arrows, chevron right, enter icons) must rotate 180° in Arabic:
   ```tsx
   <ArrowRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
   ```

4. **Arabic Typography & Line Heights:**
   Arabic typography requires slightly more vertical breathing room. Use `leading-relaxed` or `leading-loose` on body text.

---

## 3. Accessible Drag & Drop File Upload Zone

Used in `src/components/UploadSection.tsx`. Must support drag-and-drop, manual file picker, and direct text paste.

### UX Features
- Visual drag-over highlight (`border-indigo-500 bg-indigo-500/10`).
- File size checking (`max 10MB`).
- Validates mime-types (`application/pdf`, `.docx`, `.txt`).
- Direct Base64 conversion using `FileReader.readAsDataURL()`.
- Sample profile selector for instant 1-click test drive without uploading files.

```tsx
const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragging(false);
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    processFile(e.dataTransfer.files[0]);
  }
};
```

---

## 4. Interactive "What-If" Fit Simulator UI

Allows users to simulate acquiring missing skills or optimizing metrics, seeing real-time recalculation of their match percentage:

```tsx
interface SkillToggleProps {
  name: string;
  category: string;
  selected: boolean;
  onToggle: () => void;
  impactScore: number;
}

export const SimulatorSkillPill: React.FC<SkillToggleProps> = ({
  name,
  selected,
  onToggle,
  impactScore,
}) => (
  <button
    onClick={onToggle}
    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm border transition-all duration-200 ${
      selected
        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-500/20'
        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
    }`}
  >
    <span className="font-medium">{name}</span>
    <span className={`text-xs px-1.5 py-0.5 rounded-md ms-2 font-mono ${
      selected ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-400'
    }`}>
      +{impactScore}%
    </span>
  </button>
);
```

---

## 5. Keyboard-Navigable Tabs with ARIA

```tsx
<div role="tablist" className="flex p-1 space-x-1 rounded-xl bg-slate-900/80 border border-slate-800">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      role="tab"
      aria-selected={activeTab === tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        activeTab === tab.id
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>
```
