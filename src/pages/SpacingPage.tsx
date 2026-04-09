/*
 * SPACING PAGE — FIBO VALUES USED
 *
 * Baseline grid: 8px (F1 of base ruler)
 * Gutter: 24px (3 × 8)
 * Spacing scale: 8, 16, 24, 32, 40, 48, 64, 80, 96, 128px
 *
 * Gestalt proximity — hierarchy:
 *   line-height (8–24px) < internal padding (16–32px) < item gap (24–48px) < section gap (96px)
 *
 * Density levers:
 *   Component size: step down in type scale (16px→13px)
 *   Spacing: reduce gaps (48px→24px group gaps)
 */

const spacingScale = [8, 16, 24, 32, 40, 48, 64, 80, 96, 128]

interface DensityExample {
  label: string
  textSize: number
  lineHeight: number
  verticalPad: number
  hPad: number
  gap: number
}

const densityExamples: DensityExample[] = [
  { label: 'Spacious',  textSize: 16, lineHeight: 24, verticalPad: 24, hPad: 32, gap: 48 },
  { label: 'Comfortable', textSize: 16, lineHeight: 24, verticalPad: 16, hPad: 24, gap: 24 },
  { label: 'Compact',   textSize: 13, lineHeight: 24, verticalPad: 8,  hPad: 16, gap: 16 },
]

export default function SpacingPage() {
  return (
    <div>
      {/* ── PAGE HEADER ── */}
      <header style={styles.pageHeader}>
        <div className="content">
          <span className="label" style={{ display: 'block', marginBottom: 'var(--sp16)' }}>
            Spacing
          </span>
          <h1 style={styles.pageTitle}>Baseline grid.</h1>
          <p style={styles.pageSubtitle}>
            8px grid. Multiples of 8. Gestalt proximity governs every gap.
          </p>
        </div>
      </header>

      {/* ── BASELINE GRID ── */}
      <section style={styles.section}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Baseline grid</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>8px. F1 of the base ruler.</h2>
              <p style={styles.body}>
                The base ruler sets F1 = 8px. Every line height and every vertical spacing
                value is a multiple of 8. This is the grid beneath everything.
              </p>

              {/* Spacing scale bars */}
              <div style={styles.scaleGrid}>
                {spacingScale.map((val) => (
                  <div key={val} style={styles.scaleRow}>
                    <div style={styles.scaleLabel}>
                      <span className="mono chip">{val}px</span>
                      <span className="mono" style={{ fontSize: 'var(--t10)', color: 'var(--c-muted)' }}>
                        {val / 8}×
                      </span>
                    </div>
                    <div style={styles.scaleTrack}>
                      <div
                        style={{
                          height: '8px',    /* Thin bar, same height as baseline */
                          width: Math.min(val * 2, 600), /* Scale for visibility */
                          background: val <= 24
                            ? 'var(--c-f3)'
                            : val <= 48
                            ? 'var(--c-f4)'
                            : 'var(--c-f5)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GESTALT PROXIMITY ── */}
      <section style={styles.section}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Gestalt proximity</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>Internal &lt; external. Always.</h2>
              <p style={styles.body}>
                At every level of the hierarchy, internal spacing must be less than external
                spacing. Elements that belong together get tighter gaps; separate elements
                get larger gaps. This rule applies recursively — inside a card, between
                cards, and between sections.
              </p>

              {/* Proximity hierarchy diagram */}
              <div style={styles.proximityDiagram}>
                {[
                  { label: 'Line height (within text)',       value: '16–24px', level: 0, color: 'var(--c-f1)' },
                  { label: 'Internal padding (within element)', value: '16–32px', level: 1, color: 'var(--c-f2)' },
                  { label: 'Item-to-item gap (within group)', value: '24–48px', level: 2, color: 'var(--c-f3)' },
                  { label: 'Group-to-group gap (within section)', value: '48–64px', level: 3, color: 'var(--c-f4)' },
                  { label: 'Section-to-section gap',          value: '96px',    level: 4, color: 'var(--c-f5)' },
                ].map((row) => (
                  <div key={row.label} style={{
                    ...styles.proximityRow,
                    paddingLeft: `calc(${row.level} * var(--sp24) + var(--sp24))`,
                    borderLeft: `3px solid ${row.color}`,
                  }}>
                    <span style={styles.proximityLabel}>{row.label}</span>
                    <span className="mono chip">{row.value}</span>
                  </div>
                ))}
                <p style={{ ...styles.note, padding: 'var(--sp16)' }}>
                  The hierarchy is fractal — the same internal-less-than-external rule
                  applies within each level.
                </p>
              </div>

              {/* Live proximity demo */}
              <div>
                <span className="label" style={{ display: 'block', marginBottom: 'var(--sp16)' }}>
                  Live example — correct proximity
                </span>
                <div className="grid-3">
                  {[
                    { title: 'Signal 1', body: 'Has this value already been established?' },
                    { title: 'Signal 2', body: 'Does a hard constraint exist?' },
                    { title: 'Signal 3', body: 'Is the content dynamic or static?' },
                  ].map((item) => (
                    <div key={item.title} style={styles.proximityCard}>
                      {/* Internal gap: 8px between heading and body */}
                      <div style={styles.proximityCardTitle}>{item.title}</div>
                      <div style={styles.proximityCardBody}>{item.body}</div>
                    </div>
                  ))}
                </div>
                <div style={styles.proximityAnnotation}>
                  <div style={styles.annotRow}>
                    <span className="mono" style={{ fontSize: 'var(--t10)', color: 'var(--c-accent)' }}>Internal (title→body)</span>
                    <span className="chip">8px</span>
                  </div>
                  <div style={styles.annotRow}>
                    <span className="mono" style={{ fontSize: 'var(--t10)', color: 'var(--c-accent)' }}>Card padding</span>
                    <span className="chip">24px</span>
                  </div>
                  <div style={styles.annotRow}>
                    <span className="mono" style={{ fontSize: 'var(--t10)', color: 'var(--c-accent)' }}>Card-to-card gap</span>
                    <span className="chip">24px*</span>
                  </div>
                </div>
                <p style={styles.note}>
                  * Card gap equals card padding here — the gutter rule requires gutters to be
                  larger than adjacent element padding. This is a borderline case. Increasing
                  the gap to 32px would be a safer FIBO choice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GUTTERS ── */}
      <section style={styles.section}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Gutters</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>Fixed. Subtract first. Then divide.</h2>
              <p style={styles.body}>
                Gutters are fixed multiples of 8px — 8, 16, 24, or 32px. Established once
                per design system. The rule: gutters must be larger than the internal padding
                of adjacent elements, otherwise elements merge visually.
              </p>
              <p style={styles.body}>
                <strong>Mechanic:</strong> subtract total gutter space from the parent width
                before applying the FIBO ruler — not after. Example for this site's two-column
                layout: 1294px content area − 24px gutter = 1270px available for columns.
                Then F4 of 1270px = 330px sidebar, remainder = 940px main column.
                Total: 330 + 24 + 940 = 1294px ✓
              </p>

              {/* Gutter options */}
              <div className="grid-4">
                {[8, 16, 24, 32].map((g) => (
                  <div
                    key={g}
                    style={{
                      ...styles.gutterCard,
                      borderColor: g === 24 ? 'var(--c-accent)' : 'var(--c-border)',
                      background: g === 24 ? 'var(--c-accent-bg)' : 'transparent',
                    }}
                  >
                    <span className="mono chip" style={g === 24 ? { background: 'var(--c-accent)', color: 'var(--c-bg)' } : {}}>
                      {g}px
                    </span>
                    <span style={styles.gutterUsage}>
                      {g === 8 && 'Tight / dense UI'}
                      {g === 16 && 'Compact layouts'}
                      {g === 24 && 'Standard — this site ✓'}
                      {g === 32 && 'Spacious / editorial'}
                    </span>
                  </div>
                ))}
              </div>
              <p style={styles.note}>
                This site uses 24px gutters. Card internal padding is 24–32px — right at the
                edge of the gutter rule. A 32px gutter would create cleaner Gestalt separation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DENSITY LEVERS ── */}
      <section style={{ ...styles.section, borderBottom: 'none' }}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Density levers</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>Two independent controls.</h2>
              <p style={styles.body}>
                Density has two levers: component size (step down in the type scale) and
                spacing (reduce gaps). Use them independently or together. Both produce
                valid FIBO results.
              </p>

              <div className="grid-3">
                {densityExamples.map((ex) => (
                  <div key={ex.label} style={styles.densityExample}>
                    <span className="label" style={{ display: 'block', marginBottom: 'var(--sp16)' }}>
                      {ex.label}
                    </span>

                    {/* Simulated list items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: ex.gap }}>
                      {['Dashboard', 'Analytics', 'Settings', 'Help'].map((item) => (
                        <div
                          key={item}
                          style={{
                            padding: `${ex.verticalPad}px ${ex.hPad}px`,
                            border: '1px solid var(--c-border)',
                            fontSize: ex.textSize,
                            lineHeight: `${ex.lineHeight}px`,
                            fontWeight: 500,
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                    {/* Specs */}
                    <div style={styles.densitySpecs}>
                      <div style={styles.specRow}>
                        <span className="mono" style={{ fontSize: 'var(--t10)', color: 'var(--c-muted)' }}>text</span>
                        <span className="chip">{ex.textSize}px</span>
                      </div>
                      <div style={styles.specRow}>
                        <span className="mono" style={{ fontSize: 'var(--t10)', color: 'var(--c-muted)' }}>v-pad</span>
                        <span className="chip">{ex.verticalPad}px</span>
                      </div>
                      <div style={styles.specRow}>
                        <span className="mono" style={{ fontSize: 'var(--t10)', color: 'var(--c-muted)' }}>gap</span>
                        <span className="chip">{ex.gap}px</span>
                      </div>
                      <div style={styles.specRow}>
                        <span className="mono" style={{ fontSize: 'var(--t10)', color: 'var(--c-muted)' }}>height</span>
                        <span className="chip">{ex.lineHeight + ex.verticalPad * 2}px</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.densityNote}>
                <span className="label" style={{ display: 'block', marginBottom: 'var(--sp8)' }}>
                  Lever 1 — Component size
                </span>
                <p style={styles.noteBody}>
                  Step down in the type scale. Spacious→Compact: 16px body becomes 13px.
                  The component shrinks because the text is smaller.
                </p>
                <div style={{ height: 'var(--sp24)' }} />
                <span className="label" style={{ display: 'block', marginBottom: 'var(--sp8)' }}>
                  Lever 2 — Spacing
                </span>
                <p style={styles.noteBody}>
                  Reduce gaps between elements. 48px group gap → 16px. Components
                  stay the same size; only the space between them changes.
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
  noteBody: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    color: 'var(--c-muted)',
  },

  scaleGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp8)',
  },
  scaleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp16)',
  },
  scaleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp8)',
    width: '120px',
    flexShrink: 0,
  },
  scaleTrack: {
    flex: 1,
    height: '8px',
    background: 'var(--c-surface)',
    display: 'flex',
    alignItems: 'center',
  },

  proximityDiagram: {
    border: '1px solid var(--c-border)',
    overflow: 'hidden',
  },
  proximityRow: {
    padding: 'var(--sp16) var(--sp24)',
    borderBottom: '1px solid var(--c-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--sp16)',
  },
  proximityLabel: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    color: 'var(--c-text)',
  },
  proximityDemo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--sp24)',
  },
  proximityCard: {
    padding: 'var(--sp24)',
    border: '1px solid var(--c-border)',
  },
  proximityCardTitle: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    fontWeight: 600,
    marginBottom: 'var(--sp8)',     /* 8px internal — LESS than card padding (24px) ✓ */
  },
  proximityCardBody: {
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    color: 'var(--c-muted)',
  },
  proximityAnnotation: {
    display: 'flex',
    gap: 'var(--sp24)',
    padding: 'var(--sp16)',
    background: 'var(--c-surface)',
    borderLeft: '3px solid var(--c-accent)',
    marginTop: 'var(--sp8)',
  },
  annotRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp8)',
  },

  gutterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'var(--sp16)',
  },
  gutterCard: {
    padding: 'var(--sp24)',
    border: '1px solid var(--c-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp8)',
    alignItems: 'flex-start',
  },
  gutterUsage: {
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    color: 'var(--c-muted)',
  },

  densityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--gutter)',
    alignItems: 'start',
  },
  densityExample: {
    border: '1px solid var(--c-border)',
    padding: 'var(--sp24)',
  },
  densitySpecs: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp8)',
    marginTop: 'var(--sp24)',
    paddingTop: 'var(--sp24)',
    borderTop: '1px solid var(--c-border)',
  },
  specRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  densityNote: {
    padding: 'var(--sp32)',
    background: 'var(--c-surface)',
    border: '1px solid var(--c-border)',
  },
}
