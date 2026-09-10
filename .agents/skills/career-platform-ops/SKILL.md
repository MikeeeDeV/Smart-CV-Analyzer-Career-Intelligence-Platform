---
name: career-platform-ops
description: >-
  Use this skill when running, building, testing, linting, or deploying CAREER.AI,
  managing environment variables (.env), esbuild/Vite build pipelines, TypeScript checks,
  and debugging Express server errors.
---

# CAREER.AI Platform Operations & Dev Workflow

This skill outlines the commands, configurations, and verification routines for running, building, and testing the CAREER.AI platform.

## 1. Project Scripts Reference

| Command | Purpose | Underlying Action |
| :--- | :--- | :--- |
| `npm run dev` | **Local Development** | Runs `tsx server.ts` with instant TypeScript execution and integrated Vite HMR. |
| `npm run build` | **Production Build** | Runs `vite build` for the client and `esbuild server.ts --bundle --platform=node ... --outfile=dist/server.cjs`. |
| `npm run start` | **Production Server** | Executes `node dist/server.cjs` serving pre-built static assets. |
| `npm run lint` | **Type Checking** | Executes `tsc --noEmit` to validate all TypeScript types without outputting files. |
| `npm run clean` | **Clean Artifacts** | Cleans `dist/` directory and temporary build files. |

---

## 2. Server Architecture: Dev vs. Production

In `server.ts`:
- **Development Mode (`process.env.NODE_ENV !== 'production'`):**
  Spawns Vite dev server middleware via `createViteServer({ server: { middlewareMode: true }, appType: 'spa' })`.
  Changes to React components reflect instantly via Hot Module Replacement (HMR).
- **Production Mode (`process.env.NODE_ENV === 'production'`):**
  Serves compiled assets from `dist/` folder using `express.static(distPath)` and fallback SPA routing.

---

## 3. Environment Variables Configuration

The `.env` file at the root should contain:

```ini
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

### Health Check Endpoint
To verify server status and Gemini key presence without exposing the secret:
```bash
curl http://localhost:3000/api/health
# Expected: {"status":"ok","hasGeminiKey":true}
```

---

## 4. Verification & Testing Checklist

Before committing or concluding changes, always run:

1. **TypeScript Typecheck:**
   ```bash
   npm run lint
   ```
   *Expected result: Exits with 0 errors.*

2. **Production Bundle Verification:**
   ```bash
   npm run build
   ```
   *Checks both frontend Vite rollup and backend esbuild bundling.*

3. **API Smoke Test:**
   ```bash
   curl -s http://localhost:3000/api/health | grep '"status":"ok"'
   ```

---

## 5. Common Errors & Fixes

- **`Cannot find name 'pdfParse'` or import type errors:**
  Note that `pdf-parse` is loaded dynamically with `(pdfParseModule as any).default || pdfParseModule`.
- **EADDRINUSE (Port 3000 already in use):**
  Identify the process using `lsof -i :3000` or specify an alternate port: `PORT=3001 npm run dev`.
- **Tailwind v4 styles not updating:**
  Check `src/index.css` has `@import "tailwindcss";` and `vite.config.ts` includes `tailwindcss()`.
