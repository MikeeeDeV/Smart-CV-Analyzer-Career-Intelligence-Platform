---
name: gemini-cv-pipeline
description: >-
  Use this skill when developing, modifying, or debugging Google Gemini AI integrations
  in CAREER.AI, including Gemini 3.7 Flash structured JSON schemas, prompt engineering
  for CV parsing, bullet rewriting, roadmap generation, interview simulations, and dual-engine fallback.
---

# Google Gemini CV Intelligence Pipeline

This skill guides you through implementing and debugging Gemini API features in the Smart CV Analyzer & Career Intelligence Platform.

## Architecture Overview

CAREER.AI uses `@google/genai` (SDK v2.4+) with `gemini-2.5-flash` / `gemini-3.7-flash` models. All AI tasks prioritize **Strict Structured JSON Schema** output (`responseMimeType: 'application/json'` and `responseSchema`), paired with a robust local heuristic fallback if the API key is missing, invalid, or rate-limited.

```
Incoming Request
       │
       ▼
Gemini API Available? ───No───► Dynamic Heuristic NLP Parser
       │
      Yes
       │
       ▼
Gemini Structured JSON (Strict Schema)
       │
       ├──► Validation Passed ──► Return Parsed Result
       │
       └──► Schema/Parse Error ─► Fallback to Heuristics
```

---

## 1. Initializing GoogleGenAI Client

The client is configured in `server.ts`:

```typescript
import { GoogleGenAI, Type } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export function getAI(): GoogleGenAI | null {
  if (!aiInstance && process.env.GEMINI_API_KEY) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}
```

> [!IMPORTANT]
> Never throw an unhandled 500 error if `GEMINI_API_KEY` is not present. Always seamlessly fall back to local heuristic functions (`dynamicHeuristicParse`, `heuristicScore`, `heuristicJobMatch`).

---

## 2. Structured JSON Schema Patterns

When requesting structured data from Gemini, always provide a schema definition using `Type` from `@google/genai`.

### Example: CV Parsing Schema (`/api/cv/parse`)

```typescript
const cvSchema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        title: { type: Type.STRING },
        location: { type: Type.STRING },
        summary: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        github: { type: Type.STRING },
      },
      required: ['name', 'email', 'title', 'summary'],
    },
    skills: {
      type: Type.OBJECT,
      properties: {
        technical: { type: Type.ARRAY, items: { type: Type.STRING } },
        frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
        tools: { type: Type.ARRAY, items: { type: Type.STRING } },
        softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['technical', 'frameworks', 'tools', 'softSkills'],
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          role: { type: Type.STRING },
          company: { type: Type.STRING },
          period: { type: Type.STRING },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['role', 'company', 'bullets'],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          degree: { type: Type.STRING },
          major: { type: Type.STRING },
          institution: { type: Type.STRING },
          year: { type: Type.STRING },
          grade: { type: Type.STRING },
        },
        required: ['degree', 'institution'],
      },
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING },
        },
        required: ['name', 'description'],
      },
    },
    certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
    languages: { type: Type.ARRAY, items: { type: Type.STRING } },
    achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['personalInfo', 'skills', 'experience', 'education', 'projects'],
};
```

---

## 3. Bilingual Prompting Guidelines (Arabic & English)

1. **System Instructions:** Explicitly tell Gemini to detect language automatically. If the resume is in Arabic, preserve Arabic terms or provide culturally natural Arabic translations for missing headings.
2. **Clean Output:** Instruct the model not to wrap JSON in Markdown code fences if `responseMimeType: 'application/json'` is set.
3. **Safe Parsing:** Always sanitize output with `JSON.parse(response.text || '{}')` wrapped in a `try...catch` block.

```typescript
const prompt = `You are a world-class ATS recruitment expert and career intelligence analyst.
Analyze the following resume text and extract all details according to the schema.
Detect language (Arabic or English) and provide feedback in the candidate's preferred language.

Resume Content:
"""
${extractedText.slice(0, 30000)}
"""`;

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
  config: {
    responseMimeType: 'application/json',
    responseSchema: cvSchema,
    temperature: 0.1, // low temperature for precise factual extraction
  },
});
```

---

## 4. Troubleshooting & Common Pitfalls

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| `API_KEY_INVALID` or 403 | Missing/wrong `.env` key | Check `.env` contains valid `GEMINI_API_KEY`. Verify `dotenv.config()` is loaded before `getAI()`. |
| Rate Limit (429) | Exceeded free-tier RPM/RPD | Fall back gracefully to `dynamicHeuristicParse`. Never let frontend crash. |
| Model not found | Using deprecated model string | Use `gemini-2.5-flash` or `gemini-3.7-flash`. |
| Truncated JSON | Exceeded max output tokens | Ensure input text is sliced (`extractedText.slice(0, 30000)`) and schemas do not request endless nested arrays. |
