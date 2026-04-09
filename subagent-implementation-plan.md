# FIBO Subagent System — Implementation Plan

## Overview

Replace the current single-prompt workflow with a four-subagent pipeline that separates design decisions, architecture, implementation, and quality assurance. Each subagent runs in its own context window with focused skills and clear inputs/outputs.

---

## Phase 1: Prerequisites (Do First)

### 1.1 Finalize the Design System Architecture Skill

The architecture skill spec exists (`design-system-architecture.md`) but hasn't been converted to a SKILL.md yet.

**Tasks:**
- [ ] Create `~/.claude/skills/design-system-architecture/SKILL.md` from the spec document
- [ ] Add reference files: `references/tokens.md`, `references/components.md`, `references/themes.md`
- [ ] Test it independently — tell Claude Code to "set up a design system for a simple blog" and verify it creates the token hierarchy correctly
- [ ] Install in both claude.ai and Claude Code

**Why first:** The architect subagent depends on this skill existing.

### 1.2 Create Design Spec Output Format

The designer subagent needs a standard output format that the architect and builder can consume. Define a JSON schema:

```json
{
  "project": "Jazz Club Landing Page",
  "canvas": { "width": 1470, "height": 956, "margin": 88, "contentArea": 1294 },
  "color": {
    "primaryHue": 30,
    "saturation": 45,
    "companions": [52, 88, 124, 181],
    "neutralTint": 40,
    "shades": [0, 6, 10, 16, 26, 42, 58, 74, 84, 90, 94, 100],
    "proportion": { "dominant": 42, "secondary": 26, "structural": 16, "primary": 10, "accent": 6 },
    "roles": {
      "background": "hsl(40, 25%, 94%)",
      "surface": "hsl(40, 20%, 90%)",
      "text-primary": "hsl(40, 15%, 10%)",
      "text-secondary": "hsl(40, 12%, 42%)",
      "accent": "hsl(85, 40%, 32%)"
    }
  },
  "typography": {
    "hero": { "size": 55, "lineHeight": 64, "weight": 700 },
    "heading": { "size": 34, "lineHeight": 40, "weight": 700 },
    "section": { "size": 21, "lineHeight": 32, "weight": 600 },
    "subheading": { "size": 18, "lineHeight": 24, "weight": 600 },
    "body": { "size": 16, "lineHeight": 24, "weight": 400 },
    "bodySmall": { "size": 13, "lineHeight": 24, "weight": 400 },
    "label": { "size": 11, "lineHeight": 16, "weight": 500 },
    "caption": { "size": 10, "lineHeight": 16, "weight": 400 }
  },
  "spacing": {
    "gutter": 24,
    "sectionGap": 64,
    "cardPadding": 24,
    "componentGap": 16
  },
  "layout": {
    "sections": [
      {
        "name": "hero",
        "type": "full-width",
        "theme": "dark",
        "columns": "single",
        "imageRatio": "42%"
      },
      {
        "name": "menu",
        "type": "content-area",
        "theme": "light",
        "columns": "F4+F5 / F1+F2+F3",
        "gutter": 24
      }
    ]
  },
  "components": {
    "button-primary": { "height": 40, "fontSize": 13, "radius": 0 },
    "button-secondary": { "height": 32, "fontSize": 11, "radius": 0 },
    "card": { "padding": 24, "radius": 8, "borderWidth": 1 },
    "input": { "height": 40, "fontSize": 13 },
    "nav": { "height": 48, "fontSize": 13 },
    "tag": { "height": 24, "fontSize": 10 }
  }
}
```

**Tasks:**
- [ ] Define the complete JSON schema for design specs
- [ ] Save as `~/.claude/skills/fibo-design-system/references/spec-format.md`
- [ ] Update the FIBO skill to reference this format as the expected output

**Why first:** All subagents need to agree on this contract.

---

## Phase 2: Build the Subagents

### 2.1 `fibo-designer` — The Design Decision Maker

**Purpose:** Takes a design brief, runs the full FIBO signal flow, outputs a complete design specification. Writes zero code.

**File:** `~/.claude/agents/fibo-designer.md`

```yaml
---
name: fibo-designer
description: Makes all FIBO design decisions for a project. Runs signal flow, chooses values, outputs a design spec. Does not write code.
skills:
  - fibo-design-system
tools:
  - read_file
  - write_file
permission_mode: default
---

# FIBO Designer

You are a design system specialist. Your job is to make every measurement, proportion, and color decision for a project using the FIBO design system.

## Process

1. Read the design brief
2. Identify the canvas context
3. For every section of the page, run the signal flow for:
   - Layout (which FIBO sections, columns, gutters)
   - Typography (which sizes from the scale, which line heights)
   - Color (primary hue, saturation, companions via FIBO angles, shade assignments)
   - Spacing (section gaps, card padding, component gaps)
   - Component sizing (button heights, input heights, nav height)
   - Media ratios (which FIBO percentage for each image)
4. Verify every decision:
   - Does the content fit? Calculate the longest text at the chosen size vs the container width.
   - Is every value traceable to FIBO?
   - Does Gestalt hold? Internal < external at every level.
5. Output the complete design spec as JSON (see spec-format reference)
6. Save the spec to the project directory as `design-spec.json`

## Rules

- You do NOT write CSS, HTML, React, or any code
- You do NOT reference any existing codebase
- Every value must be calculated, not guessed
- If you're unsure about a value, say so — don't approximate
- The spec must be complete enough that a builder with no design knowledge can implement it
```

**Tasks:**
- [ ] Write the full subagent markdown file
- [ ] Test with the observatory brief — does it produce a complete spec?
- [ ] Iterate until the spec covers every value a builder needs

### 2.2 `fibo-architect` — The System Builder

**Purpose:** Takes the design spec, creates the token hierarchy and component scaffolding. Sets up the engineering foundation.

**File:** `~/.claude/agents/fibo-architect.md`

```yaml
---
name: fibo-architect
description: Creates the token file hierarchy and component library scaffold from a FIBO design spec. Sets up the engineering foundation before pages are built.
skills:
  - design-system-architecture
tools:
  - read_file
  - write_file
  - list_directory
permission_mode: default
---

# FIBO Architect

You build the engineering foundation for a FIBO design system implementation.

## Process

1. Read the design spec (design-spec.json)
2. Create the token files:
   - primitives.css — raw FIBO values from the spec
   - semantic.css — role-based tokens mapped to primitives
   - components.css — component-specific tokens
3. Scaffold the component library:
   - One folder per component (Button, Card, Input, Nav, TopBar, etc.)
   - Each with component file + CSS module
   - All styles reference tokens only — zero hardcoded values
4. Create layout components:
   - AppShell, MarketingPage, ContentPage as needed
   - Layout tokens for canvas, margin, content width, sidebar, gutter
5. Set up theme structure:
   - Light/dark mode via semantic token overrides
   - Data-attribute switching ([data-theme="dark"])
6. Verify:
   - Every component CSS references a token
   - Token hierarchy is maintained (no primitives in components)
   - All interactive elements have hover, focus-visible, disabled states

## Rules

- You do NOT make design decisions — all values come from the spec
- If a value is missing from the spec, stop and report what's missing
- Every CSS value must trace to a token
- Components must be generic and reusable — no page-specific logic
```

**Tasks:**
- [ ] Write the full subagent markdown file
- [ ] Test by feeding it the designer's spec — does it produce a valid token hierarchy?
- [ ] Verify the components reference only tokens

### 2.3 `fibo-builder` — The Page Implementer

**Purpose:** Takes the design spec + the architecture (tokens + components), builds the actual pages.

**File:** `~/.claude/agents/fibo-builder.md`

```yaml
---
name: fibo-builder
description: Builds pages by composing components from the architecture, using values from the design spec. Does not invent values or create new tokens.
tools:
  - read_file
  - write_file
  - list_directory
  - bash
permission_mode: default
---

# FIBO Builder

You build pages using the established design system.

## Process

1. Read the design spec (design-spec.json)
2. Read the existing token files and component library
3. For each page/section in the brief:
   - Compose existing components
   - Reference the spec for all layout decisions (which sections, which columns)
   - Use only existing tokens and components
4. If you need a value not in the spec or a component not in the library:
   - STOP and report what's missing
   - Do NOT invent a value or create an ad-hoc component
5. After building, run the content fit check:
   - Does every headline fit its column?
   - Do all data values fit their cards?
   - Are all images at the correct FIBO ratio?

## Rules

- You do NOT make design decisions
- You do NOT create new tokens
- You do NOT hardcode any CSS values
- If a component doesn't exist, request it from the architect — don't build a one-off
- Every page is a composition of shared components
```

**Tasks:**
- [ ] Write the full subagent markdown file
- [ ] Test by giving it the architect's output — does it build pages using only tokens and components?

### 2.4 `fibo-auditor` — The Quality Gate

**Purpose:** Reviews the built pages against the design spec and FIBO rules.

**File:** `~/.claude/agents/fibo-auditor.md`

```yaml
---
name: fibo-auditor
description: Audits built pages for FIBO compliance. Checks every value against the spec and FIBO rules. Produces a violation report.
skills:
  - fibo-auditor
tools:
  - read_file
  - bash
  - javascript_tool
permission_mode: default
---

# FIBO Auditor

You review built pages for FIBO compliance.

## Process

1. Read the design spec (design-spec.json)
2. Read the token files
3. For each page:
   - Run the DOM audit (font sizes, line heights, component heights)
   - Check architecture (hardcoded values, unpaired font/lh, missing tokens)
   - Check interactive element sizes (32px tap target, 13px icon minimum)
   - Check content fit (overflow, truncation)
   - Check Gestalt proximity (internal < external)
4. Compare every measured value against the design spec
5. Produce a violation report:
   - List of violations with current value, expected value, and fix
   - Generate a fix prompt for the builder
6. If zero violations: approve with "PASS"

## Rules

- Flag ALL issues, no matter how minor
- Include the fix for every violation
- Don't fix things yourself — produce the report for the builder
```

**Tasks:**
- [ ] Write the full subagent markdown file
- [ ] Test by auditing the tracker page — does it catch the tiny icons?

---

## Phase 3: Create the Orchestrator

### 3.1 Main Orchestration Command

Create a slash command that triggers the full pipeline.

**File:** `~/.claude/commands/fibo-build.md`

```markdown
# /fibo-build

Build a complete FIBO design from a brief.

## Steps

1. Delegate to `fibo-designer` with the user's brief → receives design-spec.json
2. Show the spec to the user for approval → wait for confirmation
3. Delegate to `fibo-architect` with the spec → receives tokens + components
4. Delegate to `fibo-builder` with the spec + architecture → receives built pages
5. Delegate to `fibo-auditor` with the built pages → receives audit report
6. If violations found:
   a. Send fix list to `fibo-builder`
   b. Re-run `fibo-auditor`
   c. Repeat until PASS or 3 iterations
7. Report final status to user
```

**Tasks:**
- [ ] Write the orchestration command
- [ ] Test the full pipeline end-to-end with the observatory brief

---

## Phase 4: Testing and Iteration

### 4.1 Test Each Subagent Independently

Before orchestrating, test each subagent alone:

| Subagent | Test | Pass criteria |
|----------|------|--------------|
| Designer | "Design a news site" | Complete spec with every value calculated |
| Architect | Feed it the news spec | Token files + components, zero hardcoded values |
| Builder | Feed it tokens + components | Pages using only tokens, no invented values |
| Auditor | Point it at the tracker page | Catches tiny icons, truncated breadcrumb |

### 4.2 Test the Full Pipeline

Run the complete pipeline on three different briefs:

1. **Simple** — a single-page landing page (tests basic flow)
2. **Medium** — the SaaS pricing page (tests variable content, cards)
3. **Complex** — the observatory (tests dark/light alternation, data tables, gallery)

### 4.3 Measure Improvements

Compare before/after on:
- Number of FIBO violations in first build
- Number of fix cycles needed
- Context usage (should be lower with subagents)
- Time to complete
- Design consistency (do all values trace to FIBO?)

---

## Phase 5: Refinement

### 5.1 Feedback Loop

After each build, update the subagents:
- If the designer missed a value → add it to the spec format
- If the architect created a wrong token → improve its rules
- If the builder hardcoded something → tighten its constraints
- If the auditor missed a violation → add the check

### 5.2 Integrate with Backlog

Add a `/fibo-audit-and-fix` command that:
1. Runs the auditor on any URL
2. Produces the fix list
3. Optionally delegates to the builder to apply fixes
4. Re-audits to confirm

### 5.3 Design Spec Library

Save every approved design spec to a library folder. Future projects can reference past specs for consistency. The designer subagent can look at past specs for similar projects.

---

## Implementation Order

| Step | What | Depends on | Effort |
|------|------|-----------|--------|
| 1 | Create design spec JSON format | Nothing | Small |
| 2 | Create architecture skill (SKILL.md) | Spec document exists ✅ | Medium |
| 3 | Write fibo-designer subagent | Spec format (#1) | Medium |
| 4 | Test designer independently | #3 | Small |
| 5 | Write fibo-architect subagent | Architecture skill (#2) | Medium |
| 6 | Test architect independently | #5 | Small |
| 7 | Write fibo-builder subagent | #3, #5 tested | Medium |
| 8 | Test builder independently | #7 | Small |
| 9 | Write fibo-auditor subagent | Auditor skill exists ✅ | Small |
| 10 | Test auditor independently | #9 | Small |
| 11 | Write orchestration command | All subagents tested | Medium |
| 12 | End-to-end test: simple brief | #11 | Small |
| 13 | End-to-end test: medium brief | #12 passes | Small |
| 14 | End-to-end test: complex brief | #13 passes | Medium |
| 15 | Iterate and refine | #14 complete | Ongoing |

**Total estimated steps:** 15
**Can start immediately:** Steps 1-3 (no dependencies)
**First full pipeline test:** After step 11

---

## Files Created

```
~/.claude/
├── skills/
│   ├── fibo-design-system/          ← Exists ✅
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── values.md
│   │       ├── spacing.md
│   │       ├── layout.md
│   │       ├── color.md
│   │       ├── implementation.md
│   │       ├── edge-cases.md
│   │       └── spec-format.md       ← NEW: design spec JSON schema
│   ├── fibo-auditor/                ← Exists ✅
│   │   └── SKILL.md
│   └── design-system-architecture/  ← NEW: architecture skill
│       ├── SKILL.md
│       └── references/
│           ├── tokens.md
│           ├── components.md
│           └── themes.md
├── agents/
│   ├── fibo-designer.md             ← NEW
│   ├── fibo-architect.md            ← NEW
│   ├── fibo-builder.md              ← NEW
│   └── fibo-auditor.md              ← NEW
└── commands/
    └── fibo-build.md                ← NEW: orchestration command
```
