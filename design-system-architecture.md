# Design System Architecture Skill — Specification

## Purpose

This skill defines how to structure a codebase so that design decisions propagate correctly. It is separate from the FIBO Design System skill, which defines what values to use. This skill defines how those values flow through tokens, components, themes, and pages.

**FIBO answers:** "Use 16px/24px for body text, 32px button height, 42% image ratio."
**This skill answers:** "Put those values in tokens, build components that consume them, compose pages from components, so changing one token updates everything."

Both skills trigger together. FIBO provides the values. This skill provides the plumbing.

---

## 1. Token Hierarchy

Tokens are the single source of truth for every visual value. Three levels, each referencing the level above:

### Level 1 — Primitive Tokens

Raw values. These are the FIBO outputs — the actual numbers. They never appear in component code.

```css
/* Primitive tokens — raw FIBO values */
:root {
  /* Type scale */
  --primitive-fs-8: 8px;
  --primitive-fs-9: 9px;
  --primitive-fs-10: 10px;
  --primitive-fs-11: 11px;
  --primitive-fs-13: 13px;
  --primitive-fs-16: 16px;
  --primitive-fs-18: 18px;
  --primitive-fs-21: 21px;
  --primitive-fs-34: 34px;
  --primitive-fs-55: 55px;

  /* Line heights */
  --primitive-lh-16: 16px;
  --primitive-lh-24: 24px;
  --primitive-lh-32: 32px;
  --primitive-lh-40: 40px;
  --primitive-lh-48: 48px;
  --primitive-lh-56: 56px;
  --primitive-lh-64: 64px;

  /* Spacing */
  --primitive-space-8: 8px;
  --primitive-space-16: 16px;
  --primitive-space-24: 24px;
  --primitive-space-32: 32px;
  --primitive-space-40: 40px;
  --primitive-space-48: 48px;
  --primitive-space-64: 64px;

  /* Component heights */
  --primitive-h-24: 24px;
  --primitive-h-32: 32px;
  --primitive-h-40: 40px;
  --primitive-h-48: 48px;
  --primitive-h-56: 56px;

  /* Colors — FIBO shade steps per hue */
  --primitive-blue-0: hsl(210, 70%, 0%);
  --primitive-blue-6: hsl(210, 70%, 6%);
  --primitive-blue-10: hsl(210, 70%, 10%);
  --primitive-blue-16: hsl(210, 70%, 16%);
  --primitive-blue-26: hsl(210, 70%, 26%);
  --primitive-blue-42: hsl(210, 70%, 42%);
  --primitive-blue-58: hsl(210, 70%, 58%);
  --primitive-blue-74: hsl(210, 70%, 74%);
  --primitive-blue-84: hsl(210, 70%, 84%);
  --primitive-blue-90: hsl(210, 70%, 90%);
  --primitive-blue-94: hsl(210, 70%, 94%);
  --primitive-blue-100: hsl(210, 70%, 100%);
  /* Repeat for each hue in the palette */

  /* Opacity */
  --primitive-opacity-6: 0.06;
  --primitive-opacity-10: 0.10;
  --primitive-opacity-16: 0.16;
  --primitive-opacity-26: 0.26;
  --primitive-opacity-42: 0.42;
  --primitive-opacity-58: 0.58;
  --primitive-opacity-74: 0.74;
  --primitive-opacity-84: 0.84;
  --primitive-opacity-90: 0.90;
  --primitive-opacity-94: 0.94;

  /* Border radius */
  --primitive-radius-0: 0px;
  --primitive-radius-4: 4px;
  --primitive-radius-8: 8px;
  --primitive-radius-13: 13px;
  --primitive-radius-21: 21px;
  --primitive-radius-full: 9999px;
}
```

### Level 2 — Semantic Tokens

Purpose-driven names. These map primitives to roles. This is where design decisions live — "body text is 16px" is a semantic token assignment.

```css
/* Semantic tokens — role-based */
:root {
  /* Typography roles */
  --text-hero: var(--primitive-fs-55);
  --text-heading: var(--primitive-fs-34);
  --text-section: var(--primitive-fs-21);
  --text-subheading: var(--primitive-fs-18);
  --text-body: var(--primitive-fs-16);
  --text-body-small: var(--primitive-fs-13);
  --text-label: var(--primitive-fs-11);
  --text-caption: var(--primitive-fs-10);
  --text-micro: var(--primitive-fs-9);

  /* Line height roles (paired with text roles) */
  --lh-hero: var(--primitive-lh-64);
  --lh-heading: var(--primitive-lh-40);
  --lh-section: var(--primitive-lh-32);
  --lh-subheading: var(--primitive-lh-24);
  --lh-body: var(--primitive-lh-24);
  --lh-body-small: var(--primitive-lh-24);
  --lh-label: var(--primitive-lh-16);
  --lh-caption: var(--primitive-lh-16);
  --lh-micro: var(--primitive-lh-16);

  /* Spacing roles */
  --space-xs: var(--primitive-space-8);
  --space-sm: var(--primitive-space-16);
  --space-md: var(--primitive-space-24);
  --space-lg: var(--primitive-space-32);
  --space-xl: var(--primitive-space-48);
  --space-2xl: var(--primitive-space-64);

  /* Color roles */
  --color-bg-primary: var(--primitive-neutral-100);
  --color-bg-secondary: var(--primitive-neutral-94);
  --color-bg-tertiary: var(--primitive-neutral-90);
  --color-text-primary: var(--primitive-neutral-10);
  --color-text-secondary: var(--primitive-neutral-42);
  --color-text-tertiary: var(--primitive-neutral-58);
  --color-accent: var(--primitive-blue-42);
  --color-accent-light: var(--primitive-blue-90);
  --color-border: var(--primitive-neutral-84);
  --color-border-subtle: var(--primitive-neutral-90);

  /* Component size roles */
  --height-sm: var(--primitive-h-24);
  --height-md: var(--primitive-h-32);
  --height-lg: var(--primitive-h-40);
  --height-xl: var(--primitive-h-48);
}
```

### Level 3 — Component Tokens

Specific to a single component. Only created when a component needs to diverge from semantic defaults. Most components reference semantic tokens directly.

```css
/* Component tokens — only when needed */
:root {
  --button-height: var(--height-md);
  --button-font-size: var(--text-body-small);
  --button-line-height: var(--lh-body-small);
  --button-padding-h: var(--space-sm);
  --button-radius: var(--primitive-radius-8);

  --card-padding: var(--space-md);
  --card-radius: var(--primitive-radius-13);
  --card-border: var(--color-border-subtle);

  --input-height: var(--height-md);
  --input-font-size: var(--text-body-small);
  --input-padding-h: var(--space-sm);
}
```

### Token Rules

1. **Components never reference primitives.** A button says `var(--button-height)` or `var(--height-md)`, never `var(--primitive-h-32)` or `32px`.
2. **Pages never reference any tokens directly.** Pages compose components. If a page needs a unique value, it gets a new semantic token — not a hardcoded override.
3. **One file per level.** `primitives.css`, `semantic.css`, `components.css`. Imported in order. The token hierarchy is the file hierarchy.

---

## 2. Component Library Structure

### File Structure

```
src/
├── tokens/
│   ├── primitives.css      ← Raw FIBO values
│   ├── semantic.css         ← Role-based tokens
│   └── components.css       ← Component-specific overrides
├── components/
│   ├── Button/
│   │   ├── Button.tsx       ← Component logic
│   │   ├── Button.module.css ← Styles (tokens only)
│   │   └── Button.test.tsx  ← Tests
│   ├── Card/
│   ├── Input/
│   ├── Nav/
│   ├── Table/
│   ├── TopBar/
│   ├── Sidebar/
│   ├── Avatar/
│   ├── Badge/
│   ├── Tag/
│   └── Text/
├── layouts/
│   ├── AppShell.tsx         ← Sidebar + main + detail panel
│   ├── MarketingPage.tsx    ← Hero + content + footer
│   └── ContentPage.tsx      ← Sidebar + reading column
└── pages/
    ├── Home.tsx             ← Composes layouts + components
    └── ...
```

### Component API Pattern

Every component follows the same structure:

```tsx
// Button.tsx
interface ButtonProps {
  size?: 'sm' | 'md' | 'lg';      // Maps to height tokens
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ 
  size = 'md', 
  variant = 'primary', 
  children, 
  disabled,
  onClick 
}: ButtonProps) {
  return (
    <button 
      className={`${styles.button} ${styles[size]} ${styles[variant]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
/* Button.module.css — all values from tokens */
.button {
  font-size: var(--button-font-size);
  line-height: var(--button-line-height);
  padding: 0 var(--button-padding-h);
  border-radius: var(--button-radius);
  cursor: pointer;
  transition: background-color 0.15s, opacity 0.15s;
}

.sm { height: var(--height-sm); }
.md { height: var(--height-md); }
.lg { height: var(--height-lg); }

.primary {
  background: var(--color-accent);
  color: var(--color-bg-primary);
  border: none;
}

.secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
}

.button:hover:not(:disabled) { opacity: 0.85; }
.button:disabled { opacity: var(--primitive-opacity-42); cursor: not-allowed; }
.button:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
```

### Component Rules

1. **Zero hardcoded values.** Every font-size, line-height, height, padding, color, border-radius, and opacity in a component CSS file must reference a token. If you see `16px` or `#333` in a component file, it's a violation.
2. **Size variants map to height tokens.** `sm` = `--height-sm` (24px), `md` = `--height-md` (32px), `lg` = `--height-lg` (40px). No per-component size definitions.
3. **Font-size and line-height always paired.** Every component that renders text must set both in the same CSS rule.
4. **State variants are exhaustive.** Every interactive component must define: default, hover, focus-visible, active, disabled. No missing states.
5. **Minimum tap target.** Every interactive component has a minimum height of `--height-sm` (24px visible) with a 32px tap target area (via padding if needed).

---

## 3. Theme System

Themes swap semantic tokens. Primitives and component structure stay the same.

### Light / Dark Mode

```css
/* Light theme (default) */
:root {
  --color-bg-primary: var(--primitive-neutral-100);
  --color-bg-secondary: var(--primitive-neutral-94);
  --color-text-primary: var(--primitive-neutral-10);
  --color-text-secondary: var(--primitive-neutral-42);
  --color-accent: var(--primitive-blue-42);
}

/* Dark theme — override semantic tokens only */
[data-theme="dark"] {
  --color-bg-primary: var(--primitive-neutral-6);
  --color-bg-secondary: var(--primitive-neutral-10);
  --color-text-primary: var(--primitive-neutral-94);
  --color-text-secondary: var(--primitive-neutral-58);
  --color-accent: var(--primitive-blue-58);
}
```

### Brand Themes

Same structure. A brand theme overrides color semantics, never typography or spacing (those are structural, not brand).

```css
[data-theme="brand-jazz"] {
  --color-bg-primary: var(--primitive-amber-6);
  --color-bg-secondary: var(--primitive-amber-10);
  --color-text-primary: var(--primitive-amber-94);
  --color-accent: var(--primitive-amber-58);
}
```

### Theme Rules

1. **Themes only override semantic tokens.** Never override primitive or component tokens in a theme. If a component needs to look different in a theme, the semantic token it references should change, not the component itself.
2. **Color proportion inverts for dark themes.** The 42% dominant becomes the darkest shade. The 6% accent becomes the brightest.
3. **Typography and spacing don't change between themes.** Font sizes, line heights, and spacing are structural decisions — they're the same in light and dark mode.

---

## 4. Layout Patterns

### App Shell (three-panel)

```tsx
function AppShell({ sidebar, main, detail }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <main className={styles.main}>{main}</main>
      {detail && <aside className={styles.detail}>{detail}</aside>}
    </div>
  );
}
```

```css
.shell {
  display: grid;
  grid-template-columns: var(--layout-sidebar-width) 1fr var(--layout-detail-width, 0);
  height: 100vh;
}
.sidebar { background: var(--color-bg-secondary); }
.main { overflow-y: auto; }
.detail { border-left: 1px solid var(--color-border); overflow-y: auto; }
```

### Marketing Page

```tsx
function MarketingPage({ children }) {
  return (
    <div className={styles.page}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
```

```css
.page { width: 100%; }
.content {
  max-width: var(--layout-content-width);
  margin: 0 auto;
  padding: 0 var(--layout-margin);
}
```

### Layout Tokens

```css
:root {
  /* Derived from FIBO: canvas 1470, margin 6% = 88px, content = 1294px */
  --layout-canvas: 1470px;
  --layout-margin: 88px;
  --layout-content-width: 1294px;
  --layout-sidebar-width: 235px; /* F3 = 16% of canvas */
  --layout-gutter: 24px;
}
```

---

## 5. State Variants

Every interactive component must handle these states:

| State | Visual treatment | Token source |
|-------|-----------------|-------------|
| Default | Base appearance | Component tokens |
| Hover | Subtle background shift or opacity change | `opacity: 0.85` or bg shift |
| Focus-visible | 2px outline in accent color, 2px offset | `--color-accent` |
| Active | Scale or darken slightly | `transform: scale(0.98)` |
| Disabled | Reduced opacity, no pointer | `opacity: var(--primitive-opacity-42)` |
| Loading | Skeleton or spinner replacing content | Dedicated loading component |
| Error | Red border or background tint | `--color-error` semantic token |
| Selected | Accent background tint | `--color-accent-light` |

### State Rules

1. **Never hide state.** Every interactive element must visually respond to hover, focus, and disabled. If you can click it, you can see it change.
2. **Focus-visible, not focus.** Keyboard focus ring only — not on mouse click.
3. **Disabled means disabled.** `pointer-events: none` + reduced opacity + `cursor: not-allowed`. No half-disabled states.

---

## 6. Responsive Component Patterns

Components adapt to canvas context. The FIBO skill defines separate design systems per canvas. The architecture skill defines how components switch between them.

### Breakpoint Tokens

```css
:root {
  --breakpoint-mobile: 375px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1470px;
}

/* Each breakpoint can override semantic tokens */
@media (max-width: 768px) {
  :root {
    --text-body: var(--primitive-fs-13);
    --lh-body: var(--primitive-lh-24);
    --layout-margin: 16px;
    --layout-gutter: 16px;
  }
}
```

### Responsive Rules

1. **Semantic tokens change, components don't.** A button doesn't have mobile-specific CSS. The semantic tokens it references change at the breakpoint.
2. **Layout restructuring happens at the layout level, not the component level.** The AppShell switches from three-column to single-column. The Button inside it stays the same.

---

## 7. Documentation Requirements

Every component must be documented with:

1. **Props table** — all props, types, defaults
2. **Size variants** — visual of sm/md/lg
3. **State variants** — visual of all states (default, hover, focus, disabled, error)
4. **Token dependencies** — which tokens this component references
5. **Usage guidelines** — when to use this component vs alternatives
6. **Code example** — copy-paste ready

---

## 8. Verification Checklist

Before shipping any design system implementation:

### Token Audit
- [ ] Every visual value in a component CSS traces to a token (not hardcoded)
- [ ] Primitive → semantic → component hierarchy is maintained
- [ ] No primitives referenced directly from components
- [ ] Token file exists for each level (primitives, semantic, components)

### Component Audit
- [ ] Every component has all state variants (hover, focus-visible, disabled)
- [ ] Every text element has both font-size and line-height from tokens
- [ ] Every interactive element has minimum 32px tap target
- [ ] Size variants (sm/md/lg) map to standardised height tokens

### Theme Audit
- [ ] Dark mode works — swap theme, verify all text is readable
- [ ] Only semantic tokens change between themes
- [ ] Color proportion inverts correctly (42% dominant is now darkest)

### Propagation Test
- [ ] Change `--text-body` in semantic tokens → verify all body text updates across all pages
- [ ] Change `--color-accent` → verify all buttons, links, and accent elements update
- [ ] Change `--height-md` → verify all medium-sized components update
- [ ] If any element doesn't update, it's hardcoded — fix it

---

## How This Skill Relates to FIBO

| Decision | FIBO Skill | Architecture Skill |
|----------|-----------|-------------------|
| "What font size for body?" | 16px (from type scale) | Put it in `--text-body` token |
| "What line height?" | 24px (from default mapping) | Pair it in `--lh-body`, enforce pairing rule |
| "What button height?" | 32px (from 8px grid) | Map to `--height-md`, create size variants |
| "What color for accent?" | Choose hue, generate shades | Map to `--color-accent`, create theme overrides |
| "How to lay out the page?" | FIBO ratios (42/26/16) | Create AppShell component with grid tokens |
| "What if we change the body size?" | Choose new FIBO value | Change one token → all pages update |

FIBO is the creative system. This is the engineering system. Together they produce a design that's both harmonious and maintainable.
