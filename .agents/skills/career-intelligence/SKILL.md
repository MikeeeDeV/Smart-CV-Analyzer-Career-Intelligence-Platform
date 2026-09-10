---
name: career-intelligence
description: >-
  Use this skill when building or tweaking career intelligence features in CAREER.AI,
  including Job Match analysis, missing skills prioritization, milestone career roadmaps,
  STAR-method interview question simulation, and the AI Career Advisor chatbot.
---

# Career Intelligence & Progression Engine

This skill covers the logic and AI prompting patterns for CAREER.AI's career acceleration features.

## 1. Job Matching & Skill Gap Analysis (`/api/cv/match-job`)

Analyzes a parsed CV against a target Job Description or selected role.

### Data Structure (`JobMatchAnalysis`)
- `overallMatch` (0–100%)
- `skillsMatch` (0–100%)
- `experienceMatch` (0–100%)
- `matchedSkills`: string[] (skills present in both CV and Job Description)
- `missingSkills`: Array of:
  ```typescript
  {
    name: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    recommendedAction: string;
  }
  ```

### Prioritization Rules
- **High Priority:** Core stack requirements explicitly marked as mandatory or repeated multiple times in the JD.
- **Medium Priority:** Nice-to-have frameworks, secondary databases, or testing tools.
- **Low Priority:** General methodology buzzwords (e.g., "fast learner", "team player").

---

## 2. Milestone Roadmap Generation (`/api/cv/roadmap`)

Generates a concrete, project-driven learning pathway designed to close the identified skill gaps.

### Step Levels & Structure (`RoadmapStep`)
Each step contains:
- `id`: unique string identifier.
- `skill`: skill or concept to master.
- `status`: `'completed'` | `'current'` | `'upcoming'`.
- `level`: `'Beginner'` (Foundations) | `'Intermediate'` (Production Patterns) | `'Advanced'` (Architecture & Scale).
- `description`: Actionable explanation of what to learn.
- `estimatedHours`: Realistic time investment (e.g., 15 to 40 hours).
- `suggestedProject`: A hands-on, portfolio-worthy project rather than passive reading.
- `resources`: Curated free links, documentation, or video references.

### Best Practices for AI Roadmaps
1. Avoid generic advice like *"Study React"*. Instead: *"Build a full-stack e-commerce checkout flow with optimistic state updates and Stripe webhooks."*
2. Ensure realistic timeline progression from fundamentals to production hardening.
3. Align language with the user's selected interface locale (Arabic or English).

---

## 3. Interview Question Simulator (`/api/cv/interview-prep`)

Unlike generic interview prep tools, CAREER.AI specifically analyzes **the candidate's unique resume weaknesses and skill gaps** to craft challenging, targeted questions:

1. **Weak Bullet Probe:** If a project lacks quantifiable metrics, probe how the candidate measured success.
2. **Skill Gap Probe:** If the target role demands Kubernetes or TypeScript and the CV has only Docker or JavaScript, formulate an architectural scenario question.
3. **STAR Method Encouragement:**
   - **S**ituation (الموقف)
   - **T**ask (المهمة)
   - **A**ction (الإجراء المتخذ)
   - **R**esult (النتيجة الملموسة بالأرقام)

---

## 4. AI Career Advisor Chatbot (`/api/chat`)

The conversational advisor (`src/components/AIChatAssistant.tsx`) maintains session context including:
- Candidate's current CV data model.
- Target job specifications.
- ATS diagnostic report.

### System Prompt Directive
```
You are CAREER.AI Career Advisor, an elite tech recruiter and engineering career strategist.
You possess the user's complete CV analysis, ATS score, and target job gaps.
Respond concisely, with actionable, encouraging, and highly specific tactical advice.
Always support Arabic and English seamlessly based on the user's input language.
```
