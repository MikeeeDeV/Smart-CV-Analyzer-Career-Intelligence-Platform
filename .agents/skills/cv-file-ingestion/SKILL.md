---
name: cv-file-ingestion
description: >-
  Use this skill when developing, debugging, or optimizing CV document ingestion,
  binary buffer parsing with pdf-parse and mammoth (DOCX), base64 decoders,
  Arabic/English UTF-8 sanitization, and regex-based NLP heuristic fallbacks.
---

# CV Document Ingestion & Text Extraction

This skill explains how CAREER.AI handles binary document parsing (PDF, DOCX, TXT), sanitizes raw buffers, and extracts structured entities using both Gemini and deterministic NLP heuristics.

## Ingestion Architecture

```
User File (Browser)
       │ (FileReader readAsDataURL)
       ▼
Base64 Payload + File Name ───► POST /api/cv/parse
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
        PDF (.pdf)                                     Word (.docx)
  Buffer.from(b64, 'base64')                    mammoth.extractRawText()
        pdfParse(buffer)                                     │
               │                                             │
               └──────────────────────┬──────────────────────┘
                                      ▼
                        Clean Extracted Text Buffer
                                      │
                        UTF-8 Non-Printable Filter
                                      │
                        Gemini or Heuristic NLP
```

---

## 1. Handling Binary Documents in Node.js

Inside `server.ts`:

```typescript
import * as pdfParseModule from 'pdf-parse';
import mammoth from 'mammoth';

const pdfParse = (pdfParseModule as any).default || pdfParseModule;

async function extractTextFromFileBuffer(fileBase64: string, fileName?: string): Promise<string> {
  try {
    const buffer = Buffer.from(fileBase64, 'base64');
    const lowerName = (fileName || '').toLowerCase();

    // 1. PDF Handling
    if (lowerName.endsWith('.pdf') || fileBase64.startsWith('JVBERi0')) {
      const pdfData = await (pdfParse as any)(buffer);
      if (pdfData && pdfData.text && pdfData.text.trim().length > 10) {
        return pdfData.text;
      }
    } 
    // 2. DOCX Handling
    else if (lowerName.endsWith('.docx')) {
      const docxData = await mammoth.extractRawText({ buffer });
      if (docxData && docxData.value && docxData.value.trim().length > 10) {
        return docxData.value;
      }
    }

    // 3. Fallback to Clean UTF-8
    const rawUtf8 = buffer.toString('utf-8');
    const cleanUtf8 = rawUtf8.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
    if (cleanUtf8.trim().length > 15) {
      return cleanUtf8;
    }
  } catch (err) {
    console.error('Error extracting text from file buffer:', err);
  }
  return '';
}
```

> [!TIP]
> Notice the check `fileBase64.startsWith('JVBERi0')`. `JVBERi0` is the standard Base64 representation of `%PDF-` header. This detects PDFs even if the user renames the file or drops the extension!

---

## 2. Text Sanitization & Arabic/RTL Support

Arabic and bidirectional text require special care during extraction:
1. **Remove Null Bytes & Terminal Escapes:** Stripped using `replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')`.
2. **Normalize Newlines:** Replace `\r\n` and `\r` with standard `\n`.
3. **Preserve Arabic Diacritics/Letters:** Do not use overly aggressive ASCII-only regexes (like `/[^\x00-\x7F]/g`), as they strip Arabic letters (`[\u0600-\u06FF]`).
4. **Phone Numbers with Arabic/Eastern Digits:** Convert Persian/Eastern Arabic digits (`٠١٢٣٤٥٦٧٨٩`) to standard digits (`0-9`) before phone regex matching if needed:
   ```typescript
   function normalizeArabicNumbers(str: string): string {
     return str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
   }
   ```

---

## 3. Heuristic Regex NLP Fallback (`dynamicHeuristicParse`)

If Gemini is unavailable or times out, the local NLP parser performs high-speed deterministic extraction:
- **Email:** `/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/`
- **Phone:** `/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/`
- **LinkedIn:** `/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i`
- **GitHub:** `/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i`
- **Candidate Name Filter:** Scans the first 6 lines, discarding reserved header keywords:
  `['curriculum', 'resume', 'cv', 'profile', 'experience', 'سيرة', 'ذاتية', 'الملف']`.
- **Skill Dictionary:** Matches against a curated list of 80+ categorized skills (`React`, `Node.js`, `TypeScript`, `Docker`, `Kubernetes`, `Tailwind CSS`, `GraphQL`, etc.).

---

## 4. Testing Uploads Locally

You can test the endpoint using `curl`:

```bash
curl -X POST http://localhost:3000/api/cv/parse \
  -H "Content-Type: application/json" \
  -d '{"cvText":"Mohamed Ayman\nFull Stack Engineer\nEmail: test@example.com\nSkills: React, TypeScript, Node.js, Express"}'
```
