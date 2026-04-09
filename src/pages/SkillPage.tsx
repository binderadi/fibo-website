/*
 * FIBO SKILL PAGE
 *
 * Layout follows the established docs pattern:
 *   Two-column: label col 330px (F4 of post-gutter) + 24px gutter + content 940px
 *   Section vertical padding: 96px
 *   Page header top padding: 96px
 *   Sections separated by full-width 1px border
 *
 * Typography:
 *   Page title:      34px / 40px lh
 *   Section heading: 21px / 32px lh
 *   Body:            16px / 24px lh
 *   Small body:      13px / 24px lh
 *   Labels:          11px uppercase (className="label")
 *   Code/values:     13px mono (className="chip" or inline mono)
 */

// ─── DATA ─────────────────────────────────────────────────────────

const typeScale = [
  { size: '8px',  lh: '16px', notes: 'Minimum. Use for decorative micro-labels only.' },
  { size: '9px',  lh: '16px', notes: 'Gap-fill (F1 of 8-ruler). Captions in dense UIs.' },
  { size: '10px', lh: '16px', notes: 'Gap-fill (F2 of 8-ruler). Category tags, badges.' },
  { size: '11px', lh: '16px', notes: 'Gap-fill. Labels, timestamps, footnotes. Alt: 12px (choose one).' },
  { size: '13px', lh: '24px', notes: 'Core small text. Body in compact UIs, secondary info.' },
  { size: '16px', lh: '24px', notes: 'Primary body text. Default reading size.' },
  { size: '18px', lh: '24px', notes: 'Gap-fill. Subheadings, card headlines. Alt lh: 32px.' },
  { size: '21px', lh: '32px', notes: 'Section headings. Strong hierarchy step.' },
  { size: '34px', lh: '40px', notes: 'Page titles, hero subheads. Alt lh: 48px.' },
  { size: '55px', lh: '64px', notes: 'Hero headlines only. Alt lh: 56px.' },
]

const shadeSteps = [0, 6, 10, 16, 26, 42, 58, 74, 84, 90, 94, 100]

const colorRoles = [
  { role: 'Dominant',   pct: '42%', use: 'Background, white space. The surface everything sits on.' },
  { role: 'Secondary',  pct: '26%', use: 'Cards, panels, secondary backgrounds.' },
  { role: 'Structural', pct: '16%', use: 'Text, borders, dark elements. Gives the page its skeleton.' },
  { role: 'Primary',    pct: '10%', use: 'Brand color, interactive elements, key actions.' },
  { role: 'Accent',     pct:  '6%', use: 'CTAs, alerts, highlights. The rarest, highest-contrast tone.' },
]

const mediaRatios = [
  { ratio: '6%',  label: 'Thin strip', use: 'Decorative banner' },
  { ratio: '16%', label: 'Ultra-wide', use: 'Panoramic / cinematic' },
  { ratio: '26%', label: 'Cinematic',  use: 'Film-style headers' },
  { ratio: '42%', label: 'Landscape',  use: 'News images, thumbnails. Most common.' },
  { ratio: '58%', label: 'Balanced',   use: 'Between 16:9 and 3:2. Cards, features.' },
  { ratio: '68%', label: 'Natural',    use: 'Product images, portraits' },
  { ratio: '100%',label: 'Square',     use: 'Avatars, icons' },
]

const signals = [
  {
    num: 1,
    name: 'Has this value been established?',
    body: 'If yes, use it. Once body text is set to 16px, every body text element is 16px. This is how consistency builds — decision by decision, each one locked.',
  },
  {
    num: 2,
    name: 'Does a hard constraint exist?',
    body: 'Content constraint (legibility, minimum tap target) → Inside-Out. Container constraint (fixed physical size) → Outside-In. Tap targets must be at least 32×32px. This overrides all other signals.',
  },
  {
    num: 3,
    name: 'Is the content dynamic or static?',
    body: 'Dynamic content (user text, growing lists) → Inside-Out. Static content (logo, fixed headline, icon) → Outside-In is viable.',
  },
  {
    num: 4,
    name: 'Is there a known, stable parent?',
    body: 'Parent exists → Outside-In. No parent (isolated component) → Inside-Out.',
  },
  {
    num: 5,
    name: 'Adaptive or consistent property?',
    body: 'Adaptive property (nav bar width, card width — changes with context) → Outside-In. Consistent property (nav bar height, button padding — same everywhere) → Inside-Out.',
  },
]

const verificationChecks = [
  {
    num: 1,
    name: 'Font size audit',
    body: 'Every font-size must be on the type scale: 8, 9, 10, 11, 13, 16, 18, 21, 34, 55. No other values.',
  },
  {
    num: 2,
    name: 'Line height audit',
    body: 'Every line-height must be a pixel multiple of 8 (16, 24, 32, 40, 48, 56, 64). No ratios (1.4, 1.5, 1.6 are all violations). Must be paired with its font-size.',
  },
  {
    num: 3,
    name: 'Component height audit',
    body: 'Every button, input, table row, nav bar height must be a multiple of 8. 34px is a valid font size but NOT a valid component height.',
  },
  {
    num: 4,
    name: 'Content fit verification',
    body: 'For every container holding text: calculate usable width (container − padding × 2). Estimate widest content. Confirm it fits. If it doesn\'t, fix it.',
  },
  {
    num: 5,
    name: 'Interactive element size',
    body: 'Every clickable element: visible glyph ≥ 13px, tap target ≥ 32×32px. Unicode glyphs (›, ▾, ×, ⋯, ⚠) cannot be rendered at 8–10px.',
  },
  {
    num: 6,
    name: 'Gestalt proximity',
    body: 'Internal spacing < external spacing at every nesting level. Label-to-field gap < field-to-field gap. Card padding < card gutter.',
  },
  {
    num: 7,
    name: 'Text truncation',
    body: 'For every text element in a constrained container: does the longest realistic content fit? If truncation is intentional, is there a tooltip or overflow strategy?',
  },
  {
    num: 8,
    name: 'Visual review',
    body: 'After all numerical checks pass, look at the rendered design. Anything overflowing? Cards balanced? Hierarchy legible? Every interactive element visible and clickable?',
  },
]

const notDefined = [
  { name: 'Hue',         body: 'The primary color is a creative decision. FIBO governs shade steps, proportion, and opacity once a hue is chosen.' },
  { name: 'Typeface',    body: 'The type scale works with any font family. Typeface choice is yours.' },
  { name: 'Font weight', body: 'All weights are valid. Choose based on design intent.' },
  { name: 'Text-transform', body: 'Uppercase, lowercase, sentence case — all valid styling decisions.' },
  { name: 'Shadows',     body: 'Allowed. A styling decision outside FIBO scope. Apply consistently.' },
  { name: 'Border radius', body: 'Can be FIBO-derived (0, 8, 13, 21px) or any value. Apply consistently across components.' },
]

// ─── COMPONENT ────────────────────────────────────────────────────

import { useHashNav } from '../hooks/useHashNav'

export default function SkillPage() {
  useHashNav()
  return (
    <div>

      {/* ── PAGE HEADER ── */}
      <header style={st.pageHeader}>
        <div className="content">
          <span className="label" style={{ display: 'block', marginBottom: 'var(--sp16)' }}>
            Reference
          </span>
          <h1 style={st.pageTitle}>The FIBO Skill</h1>
          <p style={st.pageSubtitle}>
            Every rule, every value, every constraint — in full.
          </p>
        </div>
      </header>

      {/* ── WHAT IT IS ── */}
      <section id="overview" style={st.section}>
        <div className="content">
          <div className="two-col">
            <div style={st.colLabel}>
              <span className="label">Overview</span>
            </div>
            <div style={st.colContent}>
              <h2 style={st.sectionTitle}>A measurement system, not a style guide</h2>
              <p style={st.body}>
                FIBO is a proportional measurement system based on Fibonacci ratios. Created by Adi Binder.
                It constrains every sizing decision to harmonious options derived from five numbers —
                without dictating color, typeface, or visual style.
              </p>
              <p style={{ ...st.body, marginTop: 'var(--sp16)' }}>
                Philosophy close to Josef Müller-Brockmann: grid-based, systematic, mathematical.
                But where Müller-Brockmann used traditional column grids, FIBO uses the Fibonacci sequence.
              </p>
              <p style={{ ...st.body, marginTop: 'var(--sp16)' }}>
                FIBO constrains you to harmonious options — it does not give a single answer.
                Design intent chooses between valid options. There is always more than one correct FIBO value.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── THE SEQUENCE ── */}
      <section id="sequence" style={st.section}>
        <div className="content">
          <div className="two-col">
            <div style={st.colLabel}>
              <span className="label">The Sequence</span>
            </div>
            <div style={st.colContent}>
              <h2 style={st.sectionTitle}>3, 5, 8, 13, 21</h2>
              <p style={st.body}>
                Five consecutive Fibonacci numbers. Their sum is 50. Each number divided by 50
                gives a percentage. These five percentages divide any space into harmonious zones.
              </p>
              <div style={st.ratioRow}>
                {[
                  { fib: 3,  pct: '6%',  label: 'F1' },
                  { fib: 5,  pct: '10%', label: 'F2' },
                  { fib: 8,  pct: '16%', label: 'F3' },
                  { fib: 13, pct: '26%', label: 'F4' },
                  { fib: 21, pct: '42%', label: 'F5' },
                ].map(r => (
                  <div key={r.label} style={st.ratioCard}>
                    <span style={st.ratioLabel}>{r.label}</span>
                    <span style={st.ratioPct}>{r.pct}</span>
                    <span style={st.ratioFib}>{r.fib} of 50</span>
                  </div>
                ))}
              </div>
              <p style={{ ...st.bodySmall, marginTop: 'var(--sp16)', color: 'var(--c-muted)' }}>
                When five sections aren't fine enough, extend the sequence: 34, 55, 89, 144, 233.
                All percentages recalculate against the new total.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── TWO LAYERS ── */}
      <section id="two-layers" style={st.section}>
        <div className="content">
          <div className="two-col">
            <div style={st.colLabel}>
              <span className="label">Two Layers</span>
            </div>
            <div style={st.colContent}>
              <h2 style={st.sectionTitle}>Vector vs Pixel</h2>
              <div style={st.cardRow}>
                <div style={st.card}>
                  <div style={st.cardLabel}>Layer 1 — Vector</div>
                  <p style={st.bodySmall}>
                    Exact ratios. No rounding. Used in print (mm, inches, points).
                    The philosophical truth of the system.
                  </p>
                </div>
                <div style={st.card}>
                  <div style={st.cardLabel}>Layer 2 — Pixel</div>
                  <p style={st.bodySmall}>
                    Screen rendering. Round to nearest integer; .5 rounds up.
                    This is a rendering concern, not a design concern.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── TWO MODES ── */}
      <section id="two-modes" style={st.section}>
        <div className="content">
          <div className="two-col">
            <div style={st.colLabel}>
              <span className="label">Two Modes</span>
            </div>
            <div style={st.colContent}>
              <h2 style={st.sectionTitle}>Outside-In and Inside-Out</h2>
              <div style={st.cardRow}>
                <div style={st.card}>
                  <div style={st.cardLabel}>Outside-In</div>
                  <p style={st.bodySmall}>
                    Container is known. Apply FIBO ratios to divide it.
                    Used when the parent is fixed and stable.
                  </p>
                  <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)', color: 'var(--c-muted)' }}>
                    Example: canvas → content area → column widths
                  </p>
                </div>
                <div style={st.card}>
                  <div style={st.cardLabel}>Inside-Out</div>
                  <p style={st.bodySmall}>
                    Content is known. Container is derived from content size plus FIBO padding.
                    Used for consistent, content-driven components.
                  </p>
                  <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)', color: 'var(--c-muted)' }}>
                    Example: button height = text lh + (padding × 2)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── SIGNAL FLOW ── */}
      <section id="signal-flow" style={st.section}>
        <div className="content">
          <div className="two-col">
            <div style={st.colLabel}>
              <span className="label">Signal Flow</span>
            </div>
            <div style={st.colContent}>
              <h2 style={st.sectionTitle}>Five signals, run in order</h2>
              <p style={st.body}>
                Before setting any value, run through these signals. Stop at the first one that resolves.
                This is not a suggestion — it is how every single FIBO decision is made.
              </p>
              <div style={{ marginTop: 'var(--sp32)' }}>
                {signals.map((sig, i) => (
                  <div
                    key={sig.num}
                    style={{
                      ...st.signalItem,
                      borderTop: i > 0 ? '1px solid var(--c-border)' : 'none',
                    }}
                  >
                    <div style={st.signalNum}>{sig.num}</div>
                    <div style={st.signalBody}>
                      <div style={st.signalName}>{sig.name}</div>
                      <p style={st.bodySmall}>{sig.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ ...st.callout, marginTop: 'var(--sp32)' }}>
                <strong>After choosing a value:</strong> verify it. Does the content fit? Is it on the correct scale?
                Does Gestalt proximity hold? A value that passes the signal flow but fails verification must be changed.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── TYPOGRAPHY ── */}
      <section id="typography" style={st.section}>
        <div className="content">
          <div className="two-col">
            <div style={st.colLabel}>
              <span className="label">Typography</span>
            </div>
            <div style={st.colContent}>
              <h2 style={st.sectionTitle}>Type scale and line heights</h2>
              <p style={st.body}>
                Base ruler with F1 = 8 gives: 8, 13, 21, 34, 55. Gap-fill rule adds intermediates.
                Full palette is 10 sizes. Choose 11 or 12 for a given design — not both.
              </p>

              {/* Type scale table */}
              <div style={{ ...st.table, marginTop: 'var(--sp32)' }}>
                <div style={st.tableHead}>
                  <div style={{ ...st.tableCell, width: '80px' }}>Size</div>
                  <div style={{ ...st.tableCell, width: '80px' }}>Line-height</div>
                  <div style={st.tableCellFlex}>Notes</div>
                </div>
                {typeScale.map(row => (
                  <div key={row.size} style={st.tableRow}>
                    <div style={{ ...st.tableCell, width: '80px' }}>
                      <span className="chip">{row.size}</span>
                    </div>
                    <div style={{ ...st.tableCell, width: '80px' }}>
                      <span className="chip">{row.lh}</span>
                    </div>
                    <div style={{ ...st.tableCellFlex, ...st.bodySmall, color: 'var(--c-muted)' }}>
                      {row.notes}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pairing rule */}
              <div style={{ marginTop: 'var(--sp48)' }}>
                <div style={st.ruleTitle}>Critical: font-size and line-height are always paired</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  Every element that sets a <code style={st.code}>font-size</code> must also set
                  a <code style={st.code}>line-height</code> in the same rule.
                  An element with a font-size but no explicit line-height will inherit a browser default
                  that is not on the 8px grid. This is always a violation.
                </p>
              </div>

              {/* Two scales */}
              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Two different scales</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  Font sizes use the type scale (8–55). Component heights use the 8px grid (24, 32, 40…).
                  These overlap in some places but diverge in others.
                  <strong> 34px is a valid font size but NOT a valid component height.</strong>
                </p>
              </div>

              {/* Gap-fill */}
              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Gap-fill method</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  When a gap between consecutive FIBO values is too large for the design, fill it:
                  take the lower value, scale a ruler so F5 equals that value, then add F1 or F2
                  of that ruler. This works for typography, spacing, and element sizing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── SPACING ── */}
      <section id="spacing" style={st.section}>
        <div className="content">
          <div className="two-col">
            <div style={st.colLabel}>
              <span className="label">Spacing</span>
            </div>
            <div style={st.colContent}>
              <h2 style={st.sectionTitle}>Baseline grid and Gestalt proximity</h2>

              <div style={st.ruleTitle}>Baseline grid: 8px</div>
              <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                F1 of the base FIBO ruler. All line heights and all vertical spacing are multiples of 8.
                Valid spacing values: 8, 16, 24, 32, 40, 48, 56, 64, 80, 96px.
              </p>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Horizontal spacing</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  Derived as a FIBO ratio of the parent width. Both horizontal AND vertical padding
                  within a component use the parent's width as the reference — because height is often dynamic.
                </p>
              </div>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Gestalt proximity rule</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  <strong>Internal spacing must be smaller than external spacing at every nesting level.</strong>
                </p>
                <div style={{ ...st.callout, marginTop: 'var(--sp16)' }}>
                  Label-to-input gap (8px) &lt; gap between input groups (16–24px)<br />
                  Card internal padding (24px) &lt; gutter between cards<br />
                  Section internal gaps &lt; gap between sections
                </div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp16)' }}>
                  If gutter ≤ internal padding, elements merge visually and hierarchy breaks.
                  This is a structural issue — always check it.
                </p>
              </div>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Gutters</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  Fixed multiples of 8px (8, 16, 24, 32). Established once per design system.
                  <strong> Mechanic: subtract total gutter space from the parent before dividing with the FIBO ruler.</strong> Not after.
                </p>
              </div>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Component heights</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  Height = line height + top padding + bottom padding. Must land on 8px grid.
                  Valid heights: 24, 32, 40, 48, 56, 64, 72, 80px.
                </p>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  Minimum tap target: 32×32px. Every clickable element must meet this.
                  The 32px applies to the clickable area, not the visible icon.
                  This overrides all density decisions.
                </p>
              </div>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Media aspect ratios</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  Image height is a FIBO ratio of the image's own width — not a parent or container.
                  Pick 2–3 ratios per design and use them consistently.
                </p>
                <div style={{ ...st.table, marginTop: 'var(--sp16)' }}>
                  <div style={st.tableHead}>
                    <div style={{ ...st.tableCell, width: '64px' }}>Ratio</div>
                    <div style={{ ...st.tableCell, width: '140px' }}>Feel</div>
                    <div style={st.tableCellFlex}>Common use</div>
                  </div>
                  {mediaRatios.map(r => (
                    <div key={r.ratio} style={st.tableRow}>
                      <div style={{ ...st.tableCell, width: '64px' }}>
                        <span className="chip">{r.ratio}</span>
                      </div>
                      <div style={{ ...st.tableCell, width: '140px', ...st.bodySmall }}>{r.label}</div>
                      <div style={{ ...st.tableCellFlex, ...st.bodySmall, color: 'var(--c-muted)' }}>{r.use}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── LAYOUT ── */}
      <section id="layout" style={st.section}>
        <div className="content">
          <div className="two-col">
            <div style={st.colLabel}>
              <span className="label">Layout</span>
            </div>
            <div style={st.colContent}>
              <h2 style={st.sectionTitle}>Canvas, columns, and composition</h2>

              <div style={st.ruleTitle}>Step 1 — Canvas and content area</div>
              <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                Identify the canvas (1470×956 for MacBook Air M4). Set margins as a FIBO ratio of canvas width:
                6% (88px) for data-dense, 10% (147px) for standard, 16% (235px) for editorial/luxury.
                Content area = canvas − (2 × margin).
              </p>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Step 2 — Horizontal division</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  Apply the FIBO ruler to the content area: F1=6%, F2=10%, F3=16%, F4=26%, F5=42%.
                  Subtract gutters first. Then divide the remainder using FIBO ratios.
                </p>
              </div>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Combining sections</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  When a single FIBO section isn't wide enough, combine adjacent sections (F4+F5, F1+F2, F3+F4+F5).
                  Adjacent combinations preserve the natural proportional flow.
                  Non-adjacent combinations are a last resort.
                </p>
              </div>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Sidebar layout</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  A persistent sidebar is a structural division of the canvas, not the content area.
                  The sidebar takes a FIBO ratio of the canvas width (typically F3 = 16% = 235px on 1470px).
                  The remaining space becomes the content area for that context.
                </p>
              </div>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Equal-width repeating grids</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  For N identical items in a row (3 feature cards, 4 stat cards), equal-width columns are valid.
                  Column width = (available width − total gutters) ÷ N. This is the one case where
                  division is arithmetic rather than FIBO-ratio-based.
                  Card internals still follow FIBO rules.
                </p>
              </div>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Layout restructuring</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  When columns can't accommodate content: switch to single column, or reduce the margin.
                  Do not force two columns by adjusting the ratio. Squeezing a column to give the other more room
                  creates awkward proportions. Either the layout works at FIBO ratios, or it needs restructuring.
                </p>
              </div>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Canvas context rule</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  Each canvas size is its own design system. Desktop (1470×956), tablet (1024×768),
                  mobile (375×812) are separate contexts. Values don't carry across contexts.
                  Complete the entire process for each one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── COLOR ── */}
      <section id="color" style={st.section}>
        <div className="content">
          <div className="two-col">
            <div style={st.colLabel}>
              <span className="label">Color</span>
            </div>
            <div style={st.colContent}>
              <h2 style={st.sectionTitle}>Shade steps and proportion</h2>
              <p style={st.body}>
                FIBO does not choose your colors — it governs the structure of your palette.
                The designer chooses the primary hue. FIBO provides the shade steps, proportion rules,
                and opacity values.
              </p>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <div style={st.ruleTitle}>Shade steps (locked)</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)', marginBottom: 'var(--sp16)' }}>
                  Every hue gets the same 12 lightness values, applied as HSL lightness percentages.
                  No other values are permitted.
                </p>
                <div style={st.shadeRow}>
                  {shadeSteps.map(step => (
                    <div key={step} style={st.shadeChip}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          background: `hsl(220, 70%, ${step}%)`,
                          borderRadius: '2px',
                          border: '1px solid var(--c-border)',
                        }}
                      />
                      <span style={{ ...st.bodySmall, color: 'var(--c-muted)', marginTop: '4px' }}>{step}</span>
                    </div>
                  ))}
                </div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp16)', color: 'var(--c-muted)' }}>
                  Each pair from the edges sums to 100 (6+94, 10+90, 16+84, 26+74, 42+58).
                  Not all 12 need to be used — pick 5–6 for a simple site.
                </p>
              </div>

              <div style={{ marginTop: 'var(--sp48)' }}>
                <div style={st.ruleTitle}>Color proportion (locked)</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  Visual area distributes color at FIBO ratios. This replaces the traditional 60/30/10 rule.
                </p>
                <div style={{ ...st.table, marginTop: 'var(--sp16)' }}>
                  <div style={st.tableHead}>
                    <div style={{ ...st.tableCell, width: '110px' }}>Role</div>
                    <div style={{ ...st.tableCell, width: '60px' }}>%</div>
                    <div style={st.tableCellFlex}>Typical use</div>
                  </div>
                  {colorRoles.map(r => (
                    <div key={r.role} style={st.tableRow}>
                      <div style={{ ...st.tableCell, width: '110px', ...st.bodySmall, fontWeight: 500 }}>{r.role}</div>
                      <div style={{ ...st.tableCell, width: '60px' }}>
                        <span className="chip">{r.pct}</span>
                      </div>
                      <div style={{ ...st.tableCellFlex, ...st.bodySmall, color: 'var(--c-muted)' }}>{r.use}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 'var(--sp48)' }}>
                <div style={st.ruleTitle}>Opacity steps (locked)</div>
                <p style={{ ...st.bodySmall, marginTop: 'var(--sp8)' }}>
                  Transparency values use the same 12 FIBO values (0–100) as percentages.
                  Applied to overlays, shadows, disabled states, hover effects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── VERIFICATION ── */}
      <section id="verification" style={st.section}>
        <div className="content">
          <div className="two-col">
            <div style={st.colLabel}>
              <span className="label">Verification</span>
            </div>
            <div style={st.colContent}>
              <h2 style={st.sectionTitle}>8 checks before declaring done</h2>
              <p style={st.body}>
                This checklist is not optional. It is part of the design process.
                Run it before declaring any FIBO design complete.
              </p>
              <div style={{ marginTop: 'var(--sp32)' }}>
                {verificationChecks.map((check, i) => (
                  <div
                    key={check.num}
                    style={{
                      ...st.signalItem,
                      borderTop: i > 0 ? '1px solid var(--c-border)' : 'none',
                    }}
                  >
                    <div style={st.signalNum}>{check.num}</div>
                    <div style={st.signalBody}>
                      <div style={st.signalName}>{check.name}</div>
                      <p style={st.bodySmall}>{check.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── WHAT FIBO DOES NOT DEFINE ── */}
      <section id="out-of-scope" style={st.section}>
        <div className="content">
          <div className="two-col">
            <div style={st.colLabel}>
              <span className="label">Out of scope</span>
            </div>
            <div style={st.colContent}>
              <h2 style={st.sectionTitle}>What FIBO does not define</h2>
              <p style={st.body}>
                FIBO governs proportion and measurement. Everything below is a creative decision —
                valid at any value, as long as it's applied consistently.
              </p>
              <div style={{ marginTop: 'var(--sp32)' }}>
                {notDefined.map((item, i) => (
                  <div
                    key={item.name}
                    style={{
                      ...st.signalItem,
                      borderTop: i > 0 ? '1px solid var(--c-border)' : 'none',
                    }}
                  >
                    <div style={{ ...st.signalName, width: '160px', flexShrink: 0 }}>{item.name}</div>
                    <p style={st.bodySmall}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── CRITICAL RULES ── */}
      <section id="critical-rules" style={st.section}>
        <div className="content">
          <div className="two-col">
            <div style={st.colLabel}>
              <span className="label">Critical rules</span>
            </div>
            <div style={st.colContent}>
              <h2 style={st.sectionTitle}>Eight rules that cannot be broken</h2>
              <div style={{ marginTop: 'var(--sp24)' }}>
                {[
                  'Never estimate or approximate. Calculate precisely. If unsure, say so.',
                  'Every value must be traceable to a FIBO ratio, a multiple of 8, or the gap-fill rule.',
                  'Content must fit its container. If it doesn\'t, the value is wrong — not the content.',
                  'Font sizes and line heights are always paired. Every element with a font-size must also have an explicit line-height.',
                  'Two different scales exist. Font sizes use the type scale (8–55). Component heights use the 8px grid (24, 32, 40…). They are not interchangeable.',
                  'No decision is made in isolation. Every value depends on its parent, its content, and its siblings.',
                  'Design from scratch, always. Even when redesigning, take the content and design it fresh. Don\'t nudge existing values toward FIBO — that breaks relationships.',
                  'Variable-width content (currency, names, user text) must have a max-width and truncation strategy. Never assume content is short.',
                ].map((rule, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 'var(--sp16)',
                      paddingTop: 'var(--sp16)',
                      paddingBottom: 'var(--sp16)',
                      borderTop: i > 0 ? '1px solid var(--c-border)' : 'none',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ ...st.bodySmall, color: 'var(--c-accent)', fontWeight: 700, flexShrink: 0, width: '24px' }}>
                      {i + 1}
                    </span>
                    <p style={st.bodySmall}>{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

// ─── STYLES ──────────────────────────────────────────────────────

const st: Record<string, React.CSSProperties> = {

  pageHeader: {
    paddingTop: 'var(--sp96)',
    paddingBottom: 'var(--sp96)',
    borderBottom: '1px solid var(--c-border)',
  },
  pageTitle: {
    fontSize: 'var(--t34)',
    lineHeight: 'var(--lh34)',
    fontWeight: 700,
    color: 'var(--c-text)',
    marginBottom: 'var(--sp16)',
  },
  pageSubtitle: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    color: 'var(--c-muted)',
    maxWidth: '540px',
  },

  section: {
    paddingTop: 'var(--sp96)',
    paddingBottom: 'var(--sp96)',
  },

  twoCol: {},
  colLabel: {
    paddingTop: '6px',
  },
  colContent: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 'var(--t21)',
    lineHeight: 'var(--lh21)',
    fontWeight: 700,
    color: 'var(--c-text)',
    marginBottom: 'var(--sp16)',
  },

  body: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    color: 'var(--c-text)',
  },
  bodySmall: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    color: 'var(--c-text)',
  },

  ruleTitle: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    fontWeight: 700,
    color: 'var(--c-text)',
  },

  callout: {
    background: 'var(--c-surface)',
    borderLeft: '3px solid var(--c-accent)',
    padding: 'var(--sp16) var(--sp24)',
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    color: 'var(--c-text)',
  },

  code: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    background: 'var(--c-surface)',
    padding: '2px 6px',
    borderRadius: '2px',
  },

  /* Ratio cards */
  ratioRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--sp16)',
    marginTop: 'var(--sp32)',
  },
  ratioCard: {
    flex: 1,
    background: 'var(--c-surface)',
    padding: 'var(--sp16)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp8)',
    alignItems: 'flex-start',
  },
  ratioLabel: {
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--c-muted)',
  },
  ratioPct: {
    fontSize: 'var(--t21)',
    lineHeight: 'var(--lh21)',
    fontWeight: 700,
    color: 'var(--c-accent)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  ratioFib: {
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    color: 'var(--c-muted)',
    fontFamily: "'JetBrains Mono', monospace",
  },

  /* Two-card row */
  cardRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--sp16)',
    marginTop: 'var(--sp24)',
  },
  card: {
    flex: 1,
    background: 'var(--c-surface)',
    padding: 'var(--sp24)',
  },
  cardLabel: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    fontWeight: 700,
    color: 'var(--c-text)',
    marginBottom: 'var(--sp8)',
  },

  /* Signal / check list */
  signalItem: {
    display: 'flex',
    gap: 'var(--sp24)',
    paddingTop: 'var(--sp24)',
    paddingBottom: 'var(--sp24)',
    alignItems: 'flex-start',
  },
  signalNum: {
    width: '32px',
    height: '32px',
    flexShrink: 0,
    background: 'var(--c-accent)',
    color: 'var(--c-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
  },
  signalBody: {
    flex: 1,
  },
  signalName: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    fontWeight: 700,
    color: 'var(--c-text)',
    marginBottom: 'var(--sp8)',
  },

  /* Table */
  table: {
    border: '1px solid var(--c-border)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  tableHead: {
    display: 'flex',
    background: 'var(--c-surface)',
    borderBottom: '1px solid var(--c-border)',
    padding: '0 var(--sp16)',
  },
  tableRow: {
    display: 'flex',
    borderBottom: '1px solid var(--c-border)',
    padding: '0 var(--sp16)',
    alignItems: 'center',
  },
  tableCell: {
    padding: 'var(--sp8) var(--sp8) var(--sp8) 0',
    flexShrink: 0,
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    fontWeight: 600,
    color: 'var(--c-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  tableCellFlex: {
    flex: 1,
    padding: 'var(--sp8) 0',
  },

  /* Shade steps */
  shadeRow: {
    display: 'flex',
    gap: 'var(--sp8)',
    flexWrap: 'wrap',
    marginTop: 'var(--sp8)',
  },
  shadeChip: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
}
