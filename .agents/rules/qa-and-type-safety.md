# QA & Type Safety Agent Rules

When writing code or verifying functionality in CAREER.AI:

1. **Clean TypeScript Check:**
   - Always run `npm run lint` (`tsc --noEmit`) before concluding work.
   - Do not use `any` unless wrapping dynamic third-party binary buffer decoders (`pdf-parse`).
   - Keep `src/types.ts` in sync with server API payloads.

2. **Production Bundle Verification:**
   - Ensure `npm run build` succeeds without bundle or syntax errors.
