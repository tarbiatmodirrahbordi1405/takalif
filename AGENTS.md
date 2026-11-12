# Project Instructions & Skill Setup: سامانه استعلام وضعیت ارسال تکلیف شماره یک

This project is an Iranian educational web portal for querying assignment submission statuses (دوره تربیت مدیر راهبردی آموزش و پرورش استان همدان).
Built with modern semantic HTML5 (RTL/Persian), clean modular CSS, vanilla JavaScript, and Google Apps Script integration.

---

## Active Workspace Skills for Antigravity IDE

The following 8 core skills are installed in `.agents/skills/` and active for this project:

| Skill | Path | Focus & Activation Triggers |
| :--- | :--- | :--- |
| **`/antislop`** | `.agents/skills/antislop/` | **Universal AI-slop filter.** Eliminates generic AI tropes, purple mesh gradients, filler copy, and noisy comments. |
| **`/hallmark`** | `.agents/skills/hallmark/` | **Anti-slop UI structure & craft.** Enforces structural variety, 6 design disciplines (P-H-E-S-R-V scoring), locked design tokens, and honest copy. Supports `hallmark audit`, `hallmark redesign`, `hallmark study`. |
| **`/impeccable`** | `.agents/skills/impeccable/` | **Design Director level polish & craft floor.** Surface modes (`operate`, `read`, `persuade`), micro-interactions, responsive typography, and bounded QA verification passes. |
| **`/design-taste-frontend`** | `.agents/skills/design-taste-frontend/` | **Landing page & frontend taste.** Brief inference ("Design Read"), 3-dial tuning (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`), anti-default discipline. |
| **`/ui-ux-pro-max`** | `.agents/skills/ui-ux-pro-max/` | **Design intelligence database.** 50+ styles, 97 color palettes, 57 font pairings, 99 UX rules, WCAG 2.2 AA accessibility, 44×44px touch targets. |
| **`/ux-ui-agent-skills`** | `.agents/skills/ux-ui-agent-skills/` | **Atomic design system architecture.** Tokens (colors, spacing, typography, shadows, borders), atoms/molecules/organisms, inclusive design. |
| **`/graphify`** | `.agents/skills/graphify/` | **Knowledge graph & codebase architecture.** Map dependencies, relationships, and AST/file graphs. Run `/graphify query "<question>"` or trace paths. |
| **`/caveman`** | `.agents/skills/caveman/` | **Token-efficient terse communication.** Cuts filler and fluff while preserving 100% technical substance (`/caveman lite`, `full`, `ultra`). |

---

## Skill Orchestration Protocol

When executing frontend, UI, or architectural tasks, follow this order of precedence:

1. **Filter (Always Active)**: Filter all generated code, copy, and layout through `antislop` to prevent stereotypical LLM defaults (e.g., center-aligned hero with purple gradient cards and generic fluff text).
2. **Context & Architecture**: Use `graphify` to understand file relationships (`index.html` ↔ `style.css` ↔ `app.js` ↔ `config.js`).
3. **Design Read & Structure**: Formulate a one-line "Design Read" via `design-taste-frontend` and establish structural rhythm via `hallmark` with explicit tokens.
4. **Token & Component Standards**: Apply `ux-ui-agent-skills` and `ui-ux-pro-max` for atomic component hierarchy, Persian typography (Vazirmatn), RTL spacing, and WCAG 2.2 AA contrast.
5. **Craft Execution & Verification**: Build with `impeccable` standards, pre-emit critique, and single-pass visual inspection.

---

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `.agents/skills/antislop/SKILL.md` (core) and then the skill for the task:
- UI / visual: `.agents/skills/antislop-ui/SKILL.md`
- Copy & text: `.agents/skills/antislop-copywriting/SKILL.md`
- People: `.agents/skills/antislop-human/SKILL.md`
- Mobile / responsive: `.agents/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `.agents/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: download `antislop.md` again, or run `npx antislop-ai --update` if it was installed as skill folders.
<!-- antislop:end -->
