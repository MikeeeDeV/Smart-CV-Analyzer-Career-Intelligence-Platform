# AI & Gemini Specialist Agent Rules

When modifying or adding Gemini API interactions (`@google/genai`):

1. **Zero-Failure Dual-Engine Principle:**
   - Never assume `GEMINI_API_KEY` is present or available.
   - Always catch API errors, rate limits (HTTP 429), or quota exhaustion gracefully and invoke the local heuristic fallback functions (`dynamicHeuristicParse`, `heuristicScore`, `heuristicJobMatch`).
   - The Express server must never throw an unhandled 500 error to the client.

2. **Schema Integrity:**
   - Always define strict structured schemas using `Type.OBJECT`, `Type.ARRAY`, `Type.STRING`, etc.
   - Set `responseMimeType: 'application/json'` in the model call configuration.
   - Use low temperature (`0.1`–`0.2`) for factual parsing and extraction tasks.
