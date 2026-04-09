# FIBO Design System — Claude Code Project File

Read this file at the start of every session before doing any work.

## Project Overview

FIBO is Adi Binder's design measurement system based on Fibonacci ratios. This project contains:
- The FIBO documentation website (React + Vite, localhost dev server)
- Test designs built with FIBO (News, Tracker, Jazz Club, Thornfield Manor)
- A 4-agent subagent pipeline for automated design → build → audit workflows

## Key Locations

### Skills (read-only references)
- FIBO Design System: `~/.claude/skills/fibo-design-system/SKILL.md`
- Design System Architecture: `~/.claude/skills/design-system-architecture/SKILL.md`
- FIBO Auditor: `~/.claude/skills/fibo-auditor/SKILL.md`

### Agents
- `~/.claude/agents/fibo-designer.md` — Design decisions → JSON spec
- `~/.claude/agents/fibo-architect.md` — Spec → token hierarchy + component scaffolds
- `~/.claude/agents/fibo-builder.md` — Components → assembled pages
- `~/.claude/agents/fibo-auditor.md` — Audit pages → violation report

### Project Files
- Backlog (source of truth): `fibo-backlog.md` in this directory
- Thornfield Manor test: `~/thornfield-manor/`
- Thornfield learnings: `thornfield-learnings.md` in this directory
- Design spec format: `~/.claude/skills/fibo-design-system/references/spec-format.md`
- Subagent backup copies: `subagents/` in this directory

## FIBO Design System — Locked Rules

These are decided and must not be changed without Adi's explicit approval:

- **Core ratios:** 3, 5, 8, 13, 21 (total 50) = 6%, 10%, 16%, 26%, 42%
- **Two layers:** Layer 1 (vector, exact), Layer 2 (pixel, round to nearest integer, .5 rounds up)
- **Two modes:** Outside-In (known container), Inside-Out (content drives container)
- **Signal flow:** 5 signals with canvas context gate (see SKILL.md)
- **Typography:** Base ruler F1=8 → 8, 13, 21, 34, 55. Gap-fill rule. Full palette: 8, 9, 10, 11/12, 13, 16, 18, 21, 34, 55
- **Spacing:** 8px baseline grid. All line heights and spacing multiples of 8. Gestalt: internal < external.
- **Shade steps:** 0, 6, 10, 16, 26, 42, 58, 74, 84, 90, 94, 100 — no other values allowed
- **Color proportion:** 42% dominant, 26% secondary, 16% structural, 10% primary, 6% accent
- **Reference canvas:** MacBook Air M4 at 1470×956, margin 88px (6%), content area 1294px

## Subagent Pipeline — How It Works

1. `@fibo-designer` — Takes a brief, runs signal flow, outputs `design-spec.json` + human-readable summary. Writes zero code.
2. **[CHECKPOINT]** — Orchestrator presents the designer's summary + runs `@fibo-auditor` in spec-only mode (Phase 0 only). User reviews spec quality and approves before proceeding. Do not run the architect until the user confirms.
3. `@fibo-architect` — Reads spec, creates `primitives.css` → `semantic.css` → `components.css` + component stubs
4. `@fibo-builder` — Assembles pages from components and spec. No invented values.
5. `@fibo-auditor` — Full audit: greps for violations, compares against spec, outputs `audit-report.md`

**Checkpoint details:**
- After the designer saves `design-spec.json`, read the designer's summary output and present it to the user
- Run `@fibo-auditor` with the instruction: "Run Phase 0 spec quality audit on design-spec.json only. Stop after Phase 0 — do not audit any implementation files."
- Present Phase 0 results alongside the summary
- Ask the user: "Any changes before the architect runs?" and wait for explicit confirmation
- Only after approval: proceed to `@fibo-architect`

**Hard cap: 3 audit/fix cycles maximum.** After cycle 3, the auditor writes remaining violations as known issues and the pipeline stops. No more builder runs. The orchestrator (Claude Code) must enforce this cap — do not run a 4th cycle regardless of how many violations remain.

## Known Issues and Learnings from Thornfield Test (April 8, 2026)

### Agent fixes applied after Thornfield:
1. **Designer:** Added §8 shade step self-validation — must verify every HSL lightness value against valid steps before saving spec.
2. **Designer:** Added §10 human-readable summary output — produced after saving spec, for the orchestrator to present at checkpoint.
3. **Builder:** Expanded self-check — now also greps component stubs (not just index.html), checks for missing disabled states, checks for shade step violations in primitives.
4. **Auditor:** Check 11 scope explicitly limited — token name aliases with identical computed values are NOT violations; empty src="" in stubs is NOT a violation.
5. **Auditor:** Added Phase 0 spec quality audit — checks typography role appropriateness, shade/opacity step compliance, color proportion, layout math, component completeness. Runs against design-spec.json before any implementation audit.
6. **Pipeline:** 3-cycle cap is now a hard stop enforced by the orchestrator.
7. **Pipeline:** Checkpoint added after designer — orchestrator runs auditor Phase 0 + presents summary to user before architect runs.

### Remaining patterns to watch for:
- **Auditor is code-only** — Cannot catch visual issues (contrast, text size appropriateness, layout overflow)
- **Spec errors that pass Phase 0** — Phase 0 catches structural and mechanical errors. Subjective design judgment errors (wrong mood, wrong hierarchy) can only be caught by the user at the checkpoint.

### Thornfield final state (capped after 10 cycles — do not resume):
- 5 minor violations remain (V8-A through V8-D, V11-A) — all low visual impact
- Full audit history: `~/thornfield-manor/audit-report-v10.md`

## Working Agreements

- **Numerical precision:** Never estimate or approximate. Calculate precisely. Say "I'm not sure" rather than guessing.
- **One step at a time:** Adi validates or corrects reasoning before moving to the next step. Don't jump to final answers.
- **No "Actually...":** Don't write something and immediately self-correct. Think first, write once.
- **Confidence levels:** State "I'm confident" vs "I think this might work" vs "This is a guess."
- **Tradeoffs before committing:** Time cost, complexity, what could go wrong, what we lose by not doing it.
- **Known vs inferred:** Distinguish what you know from what you're inferring.
- **Never present exploration as proven systems.** First attempts are experiments, not validated workflows.
