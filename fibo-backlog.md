# FIBO Project — Feature Backlog

## Design System

### Not Started
- Font weight guidance — Define weight hierarchy (400/500/700) or keep as creative decision
- Border radius rules — Define FIBO-derived radii or keep as creative decision
- Dark mode / theme inversion — How 42/26/16/10/6 proportion inverts for dark themes
- Animation / motion — Should durations or easing curves follow FIBO?
- Responsive breakpoints — How canvas contexts map to specific device widths
- Accessibility — Contrast ratios, focus states, screen reader considerations within FIBO

### Done
- Signal flow (5 signals) — All 5 locked with canvas context gate | Completed Apr 5
- Typography system — 10 sizes, gap-fill, default line-height mapping | Completed Apr 5
- Spacing system — 8px grid, Gestalt, gutters, component sizing | Completed Apr 5
- Layout composition — 6-step method, sidebar, combining, restructuring | Completed Apr 5
- Implementation architecture — Token-first, pairing rules, verification checklist | Completed Apr 6
- Minimum interactive sizes — 32px tap target, 13px icon minimum | Completed Apr 7
- Media sizing ratios — Full FIBO ratio set 6%-100% | Completed Apr 7
- Variable-width content — Max-width + truncation strategy | Completed Apr 6

---

## Color

### Not Started
- Hue relationships — Define FIBO angles for companion hue generation. Lock the rules.
- Saturation rules — Determine if saturation is FIBO-governed or creative decision
- Neutral tinting — Derive warm/cool neutrals from companion hues
- Enforce shade steps in skill — Strengthen skill language so Claude Code applies FIBO lightness values

### Done
- Shade steps — 0, 6, 10, 16, 26, 42, 58, 74, 84, 90, 94, 100 as lightness values | Completed Apr 6
- Color proportion — 42/26/16/10/6 for visual area distribution | Completed Apr 6
- Opacity steps — Same 12 values as shades | Completed Apr 7

---

## Design System Architecture (Separate Skill)

### Not Started
- Documentation template — Standard format for component docs

### Done
- Architecture specification document — Comprehensive doc covering all areas | Completed Apr 7
- Create the skill — SKILL.md with progressive disclosure structure | Completed Apr 8
- Token hierarchy spec — Primitive → semantic → component, naming conventions, full CSS examples | Completed Apr 8
- Component library template — File structure, API patterns, state variants, standard inventory | Completed Apr 8
- Theme system — Light/dark mode, brand themes, mixed sections, responsive patterns, layout shells | Completed Apr 8
- State variants spec — All 8 states with implementation patterns | Completed Apr 8
- Responsive patterns — Semantic tokens shift at breakpoints, layout restructuring rules | Completed Apr 8
- Propagation test protocol — 5 token changes to verify, grep commands for hardcoded values | Completed Apr 8

---

## Subagent Pipeline

### Not Started
- Optimize agent token usage — Measure tokens per agent, compare to direct prompting, identify where to reduce overhead (e.g., pre-loading skills, combining architect+builder for simple projects, caching spec reads)
- Add project context to orchestration — /fibo-build must pass project path and test page pattern to subagents when building within an existing project
- Improve designer shade step compliance — Designer used stone-97 which is not a FIBO shade step. Skill needs stricter enforcement.
- Add typography role validation to auditor — Check if typography role assignments match content type (e.g., room descriptions shouldn't be body-small)
- Add visual audit capability to auditor — Current auditor is code-only. Missed nav contrast issue and 13px body copy problem. Needs screenshot-based review.
- End-to-end test: simple brief — Single landing page through full pipeline | Phase 4
- End-to-end test: medium brief — SaaS pricing page through full pipeline | Phase 4
- End-to-end test: complex brief — Observatory through full pipeline | Phase 4
- Create /fibo-audit-and-fix command — Audit any URL + auto-fix cycle | Phase 5
- Build design spec library — Save approved specs for reference in future projects | Phase 5

### Done
- Implementation plan document — Full 5-phase plan with file structure and dependencies | Completed Apr 7
- Define design spec JSON format — Complete schema with 12 sections, saved to FIBO skill | Completed Apr 8
- Build fibo-designer subagent — Runs signal flow, outputs design spec, writes zero code | Completed Apr 8
- Build fibo-architect subagent — Creates token hierarchy + component scaffold from spec | Completed Apr 8
- Build fibo-builder subagent — Composes pages from components, no invented values | Completed Apr 8
- Build fibo-auditor subagent — Reviews pages against spec, produces violation report | Completed Apr 8
- Write /fibo-build orchestration command — Full pipeline: design → architect → build → audit → fix cycle | Completed Apr 8
- Install subagents to ~/.claude/agents/ — All 4 agents + command installed and visible | Completed Apr 8
- Test designer independently — Produced complete 12-section spec with verification | Completed Apr 8
- Install design-system-architecture skill — SKILL.md + 4 reference files to ~/.claude/skills/ | Completed Apr 8
- Test architect — Produced 3 token files (171 component tokens) + 11 component scaffolds | Completed Apr 8
- Test builder — Produced 2,602-line index.html with 687 token references, 11 sections | Completed Apr 8
- Test auditor — Found 27 violations with exact fixes, caught missing tokens, hardcoded values, hierarchy violations | Completed Apr 8
- Thornfield Manor end-to-end test — Full pipeline: designer → architect → builder → 3 audit/fix cycles (27→14→9). Capped at 9 remaining (stub-to-assembly drift pattern). ~420k tokens, ~47 min. Learnings captured, all 4 agents updated. | Completed Apr 8

---

## Documentation Website

### Not Started
- Add Color page — Explain shade steps, proportion, opacity with visualizations
- FIBO interactive calculator — Input canvas width, get all section widths and values
- Deploy to public URL — Currently localhost only
- Mobile responsive version — Documentation site responsive for mobile canvas
- FIBO values overlay toggle — Show measurements on test designs
- Sync backlog JSON with fibo-backlog.md — Backlog page shows stale data when markdown is updated; need automated sync

---

## Test Designs

### Not Started
- SaaS Pricing Page — Card grids, variable content, comparison tables, CTAs
- Dashboard — Stat cards, charts, tables, designed from scratch
- E-commerce Product Page — Product images, reviews, add-to-cart
- Form / Settings Page — Dense UI, many input types, validation states
- Portfolio / Gallery — Image-heavy, minimal text, masonry or grid
- Observatory — Deep space research institute, dark/light alternating, data viz, timeline, gallery

### In Progress
- Jazz Club — Dark theme landing page, tests FIBO color system

### Done
- News Site — CNN-style homepage | Completed Apr 6
- Project Tracker — Linear/Asana-style app UI | Completed Apr 7
- Thornfield Manor Hotel — Luxury boutique hotel, first full subagent pipeline test. 11 sections, dark/light alternating, editorial typography. Capped at 9 violations after 3 audit cycles. | Completed Apr 8
