/*
 * LAYOUT PAGE — FIBO VALUES USED
 *
 * Six-step composition method demonstrated with a worked example.
 * The worked example uses this very site as the subject.
 *
 * Content area ruler:
 *   1294px total → F1=78, F2=129, F3=207, F4=336, F5=543
 *   Visualized as colored proportional bars
 *
 * Layout worked example steps:
 *   Step 1: Canvas 1470×956, margin 88px, content area 1294px
 *   Step 2: Nav — Inside-Out, 48px height
 *   Step 3: Content area divided — gutter subtracted first: 1294−24=1270px, F4 of 1270=330px sidebar, remainder 940px main
 *   Step 4: Type, spacing placed within columns
 *   Step 5: Gestalt check — internal < external ✓
 *   Step 6: Grid alignment — elements begin/end at column edges ✓
 */

const steps = [
  {
    n: '01',
    title: 'Establish canvas and content area',
    rule: 'Canvas margins = FIBO ratio of canvas width (6%, 10%, or 16%). Content area = canvas width − margins.',
    calc: '1470 × 6% = 88.2 → 88px margin. Content area = 1470 − (2×88) = 1294px',
  },
  {
    n: '02',
    title: 'Establish persistent components',
    rule: 'Nav, footer, sidebars — sized Inside-Out from their content. Signal 5: consistent property → Inside-Out.',
    calc: 'Nav: 13px text / 16px lh / 16px v-pad → 48px height. Spans full canvas width.',
  },
  {
    n: '03',
    title: 'Divide content area horizontally',
    rule: 'Columns = FIBO sections of content area width. Combine adjacent sections.',
    calc: 'Gutter first: 1294 − 24 = 1270px. F4 of 1270px = 1270 × 26% = 330.2 → 330px sidebar. Remainder: 940px main. Total: 330+24+940 = 1294px ✓',
  },
  {
    n: '04',
    title: 'Place content within columns',
    rule: 'Use established type scale, spacing, and element sizing. Apply Inside-Out for components.',
    calc: 'Body: 16px/24lh. Headings: 34px/40lh. Card pad: 32px. All multiples of 8.',
  },
  {
    n: '05',
    title: 'Check Gestalt proximity',
    rule: 'At every level: internal spacing < external spacing. Recursively at each level of nesting.',
    calc: 'lh 16–24px < internal pad 16–32px < item gap 24–48px < section gap 96px ✓',
  },
  {
    n: '06',
    title: 'Grid alignment',
    rule: 'All elements begin and end at column edges — not in the gutter.',
    calc: 'Text aligns to 0px (column edge). Gutter is empty — no content enters it.',
  },
]

const combinationRules = [
  { priority: 1, rule: 'Use a single FIBO section',          example: 'F5 alone (42%) for hero text block' },
  { priority: 2, rule: 'Combine adjacent sections',          example: 'F4+F5 (68%) for main content area' },
  { priority: 3, rule: 'Non-adjacent combination',            example: 'F1+F3 — last resort only' },
  { priority: 4, rule: 'Restructure layout entirely',         example: 'Switch to single column when columns can\'t fit content' },
]

export default function LayoutPage() {
  return (
    <div>
      {/* ── PAGE HEADER ── */}
      <header style={styles.pageHeader}>
        <div className="content">
          <span className="label" style={{ display: 'block', marginBottom: 'var(--sp16)' }}>
            Layout
          </span>
          <h1 style={styles.pageTitle}>Six-step composition.</h1>
          <p style={styles.pageSubtitle}>
            A repeatable method. Same signals, same tools, any canvas.
          </p>
        </div>
      </header>

      {/* ── CONTENT AREA RULER ── */}
      <section style={styles.section}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Canvas ruler</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>Dividing the canvas.</h2>
              <p style={styles.body}>
                Once the content area is established, apply the FIBO ruler to get five sections.
                These sections are the vocabulary of the layout. Every column, every proportion,
                derives from these five widths.
              </p>

              {/* Full-width ruler */}
              <div>
                <span className="label" style={{ display: 'block', marginBottom: 'var(--sp16)' }}>
                  Content area: 1294px
                </span>
                <div style={styles.rulerWrap}>
                  {[
                    { name: 'F1', pct: '6%', px: 78, bg: 'var(--c-f1)', tc: 'var(--c-accent)' },
                    { name: 'F2', pct: '10%', px: 129, bg: 'var(--c-f2)', tc: 'var(--c-accent)' },
                    { name: 'F3', pct: '16%', px: 207, bg: 'var(--c-f3)', tc: 'var(--c-bg)' },
                    { name: 'F4', pct: '26%', px: 336, bg: 'var(--c-f4)', tc: 'var(--c-bg)' },
                    { name: 'F5', pct: '42%', px: 543, bg: 'var(--c-f5)', tc: 'var(--c-bg)' },
                  ].map((s) => (
                    <div
                      key={s.name}
                      style={{
                        ...styles.rulerSec,
                        width: `${(s.px / 1294) * 100}%`,
                        background: s.bg,
                        color: s.tc,
                      }}
                    >
                      <span className="ruler-text mono" style={styles.rulerName}>{s.name}</span>
                      <span className="ruler-text mono" style={styles.rulerPct}>{s.pct}</span>
                      <span className="ruler-text mono" style={styles.rulerPx}>{s.px}px</span>
                    </div>
                  ))}
                </div>

                {/* Pixel ruler ticks */}
                <div style={styles.rulerTicks}>
                  {[0, 78, 207, 414, 750, 1293].map((tick) => (
                    <div
                      key={tick}
                      style={{
                        position: 'absolute',
                        left: `${(tick / 1294) * 100}%`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: tick === 0 ? 'flex-start' : tick === 1293 ? 'flex-end' : 'center',
                      }}
                    >
                      <div style={{ width: 1, height: 8, background: 'var(--c-border-2)' }} />
                      <span className="mono" style={{ fontSize: 'var(--t9)', color: 'var(--c-muted)' }}>
                        {tick}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout combinations */}
              <div>
                <span className="label" style={{ display: 'block', marginBottom: 'var(--sp16)' }}>
                  Common combinations used on this site
                </span>
                <div style={styles.combinationList}>
                  {[
                    { name: 'Label sidebar', combo: 'F4 of 1270px', px: '330px', rest: '+ 24px gutter + 940px main = 1294px', usage: 'Section labels, nav anchor' },
                    { name: 'Reading column', combo: 'F4+F5', px: '879px', rest: 'max-width for body text', usage: 'Long-form content, paragraphs' },
                    { name: 'Full width', combo: 'F1+F2+F3+F4+F5', px: '1294px', rest: '= content area', usage: 'Tables, rulers, hero sections' },
                    { name: 'Half-half', combo: 'F1+F2+F3 / F4+F5 of 1270px', px: '406px / 863px', rest: '+ 24px gutter = 1293px ✓', usage: 'Two-panel sections' },
                  ].map((c) => (
                    <div key={c.name} className="combination-row" style={styles.combinationRow}>
                      <div style={styles.combinationName}>{c.name}</div>
                      <div style={styles.combinationDetail}>
                        <span className="mono chip">{c.combo}</span>
                        <span className="mono chip">{c.px}</span>
                        <span style={{ fontSize: 'var(--t11)', color: 'var(--c-muted)' }}>{c.rest}</span>
                      </div>
                      <div style={styles.combinationUsage}>{c.usage}</div>
                    </div>
                  ))}
                </div>
                <p style={styles.note}>
                  * Gutter mechanic: subtract gutter from parent before dividing.
                  1294 − 24 = 1270px → apply FIBO ruler to 1270px, not 1294px.
                  F1+F2+F3 of 1270 = 406px; F4+F5 of 1270 = 863px; 406+24+863 = 1293px ✓ (1px rounding).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIX STEPS ── */}
      <section style={styles.section}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Six steps</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>The method.</h2>
              <p style={styles.body}>
                The same six steps apply to every layout, on any canvas. The signals and
                tools are the same. Only the numbers change.
              </p>
              <div style={styles.stepsList}>
                {steps.map((step, i) => (
                  <div
                    key={step.n}
                    style={{
                      ...styles.stepRow,
                      borderBottom: i < steps.length - 1 ? '1px solid var(--c-border)' : 'none',
                    }}
                  >
                    <div style={styles.stepNum}>
                      <span className="mono" style={{ fontSize: 'var(--t21)', lineHeight: 1, fontWeight: 700, color: 'var(--c-faint)' }}>
                        {step.n}
                      </span>
                    </div>
                    <div style={styles.stepContent}>
                      <div style={styles.stepTitle}>{step.title}</div>
                      <div style={styles.stepRule}>{step.rule}</div>
                      <div style={styles.stepCalc}>
                        <span className="mono" style={{ fontSize: 'var(--t10)', color: 'var(--c-accent)' }}>
                          This site: {step.calc}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMBINING SECTIONS ── */}
      <section style={styles.section}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Combining sections</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>Priority order.</h2>
              <p style={styles.body}>
                When you need a column that spans multiple FIBO sections, follow this priority
                order. Always prefer adjacent combinations before non-adjacent, and restructure
                before forcing awkward proportions.
              </p>
              <div style={styles.priorityList}>
                {combinationRules.map((r) => (
                  <div key={r.priority} style={styles.priorityRow}>
                    <div style={styles.priorityBadge}>
                      <span className="mono" style={{ fontSize: 'var(--t13)', fontWeight: 700 }}>
                        {r.priority}
                      </span>
                    </div>
                    <div>
                      <div style={styles.priorityRule}>{r.rule}</div>
                      <div style={styles.priorityExample}>{r.example}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESTRUCTURING RULE ── */}
      <section style={{ ...styles.section, borderBottom: 'none' }}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Restructuring rule</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>When columns don't fit.</h2>
              <p style={styles.body}>
                If Signal 2 fires (legibility constraint), do NOT squeeze the column ratio.
                Instead, follow this order:
              </p>
              <div style={styles.restructureSteps}>
                {[
                  { step: '1', action: 'Switch to single column', detail: 'Stack vertically. Legibility wins.' },
                  { step: '2', action: 'Reduce the margin',       detail: 'Step down: 16% → 10% → 6% margin.' },
                ].map((r) => (
                  <div key={r.step} style={styles.restructureRow}>
                    <div style={styles.restructureBadge}>{r.step}</div>
                    <div>
                      <div style={styles.restructureAction}>{r.action}</div>
                      <div style={styles.restructureDetail}>{r.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={styles.warningBox}>
                <span className="label" style={{ display: 'block', marginBottom: 'var(--sp8)' }}>
                  Never do this
                </span>
                <p style={{ fontSize: 'var(--t13)', lineHeight: 'var(--lh13)', color: 'var(--c-muted)' }}>
                  Do not force two columns by adjusting the column ratio. Non-FIBO proportions
                  create visual disharmony that defeats the entire system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 'var(--sp96)' }} />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  pageHeader: {
    paddingTop: 'var(--sp96)',
    paddingBottom: 'var(--sp96)',
    borderBottom: '1px solid var(--c-border)',
  },
  pageTitle: {
    fontSize: 'var(--t55)',
    lineHeight: 'var(--lh55)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    marginBottom: 'var(--sp16)',
  },
  pageSubtitle: {
    fontSize: 'var(--t21)',
    lineHeight: 'var(--lh21)',
    color: 'var(--c-muted)',
    maxWidth: 'var(--f4f5)',
  },
  section: {
    paddingTop: 'var(--sp96)',
    paddingBottom: 'var(--sp96)',
    borderBottom: '1px solid var(--c-border)',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'var(--col-sidebar) 1fr',
    gap: 'var(--gutter)',
    alignItems: 'start',
  },
  colLabel: { paddingTop: 'var(--sp8)' },
  colContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp24)',
  },
  sectionTitle: {
    fontSize: 'var(--t34)',
    lineHeight: 'var(--lh34)',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  body: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    color: 'var(--c-muted)',
    maxWidth: 'var(--f4f5)',
  },
  note: {
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    color: 'var(--c-faint)',
    fontStyle: 'italic',
  },

  /* Ruler */
  rulerWrap: {
    display: 'flex',
    height: '64px',
    width: '100%',
  },
  rulerSec: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 var(--sp8)',
    overflow: 'hidden',
  },
  rulerName: {
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    fontWeight: 700,
  },
  rulerPct: {
    fontSize: 'var(--t10)',
    lineHeight: 'var(--lh10)',
    opacity: 0.8,
  },
  rulerPx: {
    fontSize: 'var(--t9)',
    lineHeight: 'var(--lh9)',
    opacity: 0.7,
  },
  rulerTicks: {
    position: 'relative',
    height: '24px',
    marginTop: '4px',
  },

  combinationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    border: '1px solid var(--c-border)',
  },
  combinationRow: {
    display: 'grid',
    gridTemplateColumns: '160px 1fr 1fr',
    gap: 'var(--sp16)',
    padding: 'var(--sp16) var(--sp24)',
    borderBottom: '1px solid var(--c-border)',
    alignItems: 'center',
  },
  combinationName: {
    fontSize: 'var(--t13)',
    fontWeight: 600,
    lineHeight: 'var(--lh13)',
  },
  combinationDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp8)',
    flexWrap: 'wrap',
  },
  combinationUsage: {
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    color: 'var(--c-muted)',
  },

  /* Steps */
  stepsList: {
    border: '1px solid var(--c-border)',
  },
  stepRow: {
    display: 'grid',
    gridTemplateColumns: '64px 1fr',
    gap: 'var(--sp24)',
    padding: 'var(--sp24)',
    alignItems: 'start',
  },
  stepNum: {
    paddingTop: 'var(--sp4)',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp8)',
  },
  stepTitle: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    fontWeight: 600,
  },
  stepRule: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    color: 'var(--c-muted)',
  },
  stepCalc: {
    padding: 'var(--sp8) var(--sp12)',
    background: 'var(--c-accent-bg)',
    display: 'inline-flex',
  },

  /* Combining priority */
  priorityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp16)',
  },
  priorityRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--sp16)',
    padding: 'var(--sp16) var(--sp24)',
    border: '1px solid var(--c-border)',
  },
  priorityBadge: {
    width: '32px',
    height: '32px',
    background: 'var(--c-text)',
    color: 'var(--c-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  priorityRule: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    fontWeight: 600,
    marginBottom: 'var(--sp8)',
  },
  priorityExample: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    color: 'var(--c-muted)',
  },

  /* Restructuring */
  restructureSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp16)',
  },
  restructureRow: {
    display: 'flex',
    gap: 'var(--sp16)',
    padding: 'var(--sp16) var(--sp24)',
    border: '1px solid var(--c-border)',
    alignItems: 'center',
  },
  restructureBadge: {
    width: '32px',
    height: '32px',
    background: 'var(--c-surface)',
    border: '1px solid var(--c-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--t13)',
    fontWeight: 700,
    flexShrink: 0,
  },
  restructureAction: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    fontWeight: 600,
    marginBottom: 'var(--sp4)',
  },
  restructureDetail: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    color: 'var(--c-muted)',
  },
  warningBox: {
    padding: 'var(--sp24)',
    borderLeft: '3px solid var(--c-border-2)',
    background: 'var(--c-surface)',
  },
}
