# Thornfield Manor Pipeline Test — Learnings

## Test Summary
- **Date:** April 8, 2026
- **Brief:** Luxury boutique hotel website, 11 sections, dark/light alternating
- **Total tokens:** ~420k across all agents
- **Total time:** ~47 minutes
- **Audit cycles:** 3 (27 → 14 → 9 violations)
- **Final status:** Capped at 9 remaining violations (3 cycles is the limit)

## What Each Agent Got Wrong

### Designer (5 errors)
1. Used stone-97 — not a FIBO shade step
2. Used 58% hero height — not a standard FIBO percentage
3. Assigned body-small (13px) to room/spa descriptions that are primary reading content
4. Nav text contrast too low on light bar at page load
5. Chose 16% margin (major departure from reference canvas) without flagging the tradeoff

### Architect (7 errors)
6. Built standalone project instead of test page (no project context)
7. Left --fw-label undefined but used in 9+ components
8. Created --primitive-space-12 (not on 8px grid)
9. Ghost token declared but never used
10. Wrong color reference (stone-42 vs spec's stone-58)
11. Five hardcoded pixel values in component tokens
12. Used HTML stubs instead of React/TSX

### Builder (9 errors)
13. Used --layout-canvas (1470px) instead of --layout-content-width (1000px) in 6 sections
14. Dropped data-theme="dark-deep" during assembly
15. Hardcoded non-FIBO opacity values (0.80, 0.85, 0.70)
16. Hardcoded letter-spacing in 5 places
17. Hardcoded rgba instead of using token
18. Wrong font-weight in 3 places
19. Wrong margin (64px vs spec's 96px)
20. Broke layout when applying content-width fix
21. One broken Unsplash image URL

### Auditor (6 errors — things it missed)
22. Nav text contrast issue (visual, not code)
23. 13px body-small misassignment (design judgment, not code)
24. stone-97 non-FIBO shade step
25. Broken image URL
26. Running text size contradicts design intent
27. No visual review capability at all

### Pipeline/Orchestration (5 errors)
28. No project context passed to agents
29. Wrong YAML frontmatter field name (allowed_tools vs tools)
30. Auditor didn't save report to disk
31. Designer saved spec to wrong location
32. No token cost estimate disclosed upfront

## Patterns

### Pattern 1: Stub-to-Assembly Drift
The builder fixes index.html but doesn't propagate changes back to component stubs. This caused 4 of the final 9 violations to persist across all 3 fix cycles. **Fix: Builder instructions must explicitly state "apply every fix to BOTH the component stub AND index.html."**

### Pattern 2: Hardcoded Values Survive
Despite explicit rules against hardcoding, the architect and builder both introduced hardcoded opacity, letter-spacing, and max-width values. The rules exist but aren't enforced strongly enough. **Fix: Add a self-check step to architect and builder — grep for raw values before declaring done.**

### Pattern 3: Auditor Is Code-Only
The auditor catches token hierarchy violations, hardcoded values, and spec deviations. It completely misses visual issues (nav contrast, text size appropriateness, broken images). **Fix: Add visual audit capability — either screenshot-based review or a checklist of visual patterns to verify programmatically.**

### Pattern 4: Designer Makes Creative Errors the Auditor Can't Catch
The designer assigned body-small to room descriptions. The auditor confirmed the implementation matched the spec. The spec was wrong. **Fix: Add a typography role validation step — the auditor should check if role assignments make sense for the content type, not just whether values match.**

### Pattern 5: Fix Cycles Get More Expensive
Audit v1 → Fix v1: 94k tokens, fixed 13/27
Audit v2 → Fix v2: 112k tokens, fixed 5/14
Each cycle costs more while fixing less. **Fix: The builder should do a self-audit before declaring done. Catch the easy stuff (grep for hardcoded values) without needing a separate auditor cycle.**

## Agent Updates Needed

### fibo-designer.md
- Add rule: "Only use values from the FIBO shade step list (0, 6, 10, 16, 26, 42, 58, 74, 84, 90, 94, 100). Never interpolate or invent shade values."
- Add rule: "When assigning typography roles, consider the content's purpose. Descriptions that users read to make decisions (room descriptions, treatment descriptions) should use body (16px), not body-small (13px)."
- Add rule: "Flag any major departure from the reference canvas (1470px, 6% margin, 1294px content area) explicitly to the user with the tradeoff explained."

### fibo-architect.md
- Add self-check step: "Before declaring done, run: grep -rn 'font-size:' src/components/ | grep -v 'var(' — if anything returns, fix it."
- Add rule: "Every semantic token referenced in component stubs must be defined in semantic.css. Grep all component stubs for var(--) references and verify each exists."

### fibo-builder.md
- Add rule: "Apply every fix to BOTH the component stub file AND index.html. Never fix one without the other."
- Add rule: "Before declaring done, run the hardcoded-value grep checks from the verification checklist."
- Add rule: "When changing max-width on content containers, always verify the centering pattern (margin: 0 auto) is also present."

### fibo-auditor.md
- Add check: "Verify every Unsplash image URL loads (HTTP 200). Broken images are violations."
- Add check: "Verify that fixes applied to index.html were also applied to the corresponding component stub files."
- Future: Add visual audit capability for contrast, text size appropriateness, and layout overflow.

---

## Forma Studio Pipeline Test — Learnings (April 9, 2026)

### Checkpoint Validation (first run of updated pipeline)

Phase 0 spec audit caught **5 violations** before the architect ran:

1. **S-01 — Off-grid spacing:** `copyright marginTop: 4px`. Designer used 4px, smallest valid unit is 8px. Fix: → 8px.
2. **S-02 — Footer centering math error:** Spec claimed "centered vertically" but calculated centering for single-row content while the footer had two rows (main text + copyright). With two rows (48px stack) in a 64px inner zone: 8px top + 48px + 8px bottom — this works but the spec had calculated it for one row. Fix: corrected heightCalc comment.
3. **I-01 — Nav tap target:** `itemPaddingH: 0` left the "Work" nav link at ~28–32px clickable width. Fix: → `itemPaddingH: 8`.
4. **CV-01 — Pull-quote line count:** Designer estimated 2 lines using 8px/char at 34px. Actual DM Sans advance at 34px is ~18.5px/char — produces 3 lines. The layout still fits; the spec claim was wrong. Fix: corrected to 3 lines / 120px.
5. **M-01 — Missing focus-visible on nav links:** Nav had hover/active states but no focus-visible. Fix: added `link-focus-visible` state.

### New Pattern Observed

**Pattern 6: Multi-row content centering errors in specs.**
When a designer calculates vertical centering for a container, they often calculate for the primary text row only and forget subordinate elements (copyright, captions, metadata). The footer is the most common place this happens — it typically has a main row plus a copyright line. The Phase 0 layout math check caught this; it should explicitly prompt the auditor to check every container claiming "centered vertically" against its full content stack.

**Fix already applied:** Phase 0 layout math check is in the auditor. This pattern is worth watching for in future runs.
