/*
 * TYPOGRAPHY PAGE — FIBO VALUES USED
 *
 * Type scale: 8, 9, 10, 11, 13, 16, 18, 21, 34, 55px
 * Selected 11 over 12 for this design.
 *
 * Gap-filling derivation:
 *   Base ruler F1=8 → 8, 13, 21, 34, 55
 *   Gap 8→13: ruler F5=8 → F1=1, F2=2 → intermediate 9, 10
 *   Gap 10→13: ruler F5=10 → F1=2 → intermediate 11, 12 (chose 11)
 *   Gap 13→21: ruler F5=13 → F1=2, F2=3 → intermediates 15, 16
 *   Gap 16→21: ruler F5=16 → F1=3 → intermediate 18, (19→skip)
 *   Gap 21→34: ruler F5=21 → F1=4 → not used (skipped this gap)
 *   Result: 8, 9, 10, 11, 13, 16, 18, 21, 34, 55
 *
 * Page layout:
 *   - Two-column: F4 of 1270px (post-gutter) = 330px label col + 940px content
 *   - Waterfall entries: full width, stacked with 1px dividers
 */

interface TypeEntry {
  size: number
  lineHeight: number
  usage: string
  sampleShort: string
  weight: number
}

const typeScale: TypeEntry[] = [
  { size: 55, lineHeight: 64, usage: 'Hero headline',       sampleShort: 'Proportion through ratio.',        weight: 700 },
  { size: 34, lineHeight: 40, usage: 'Page heading',        sampleShort: 'Core structure.',                  weight: 700 },
  { size: 21, lineHeight: 32, usage: 'Section heading',     sampleShort: 'The sequence 3, 5, 8, 13, 21.',   weight: 600 },
  { size: 18, lineHeight: 32, usage: 'Lead / subheading',   sampleShort: 'Two layers. Two modes. One flow.', weight: 500 },
  { size: 16, lineHeight: 24, usage: 'Body text',           sampleShort: 'Every measurement derives from the Fibonacci sequence. Nothing is arbitrary or approximate.', weight: 400 },
  { size: 13, lineHeight: 24, usage: 'Small body / nav',    sampleShort: 'Signal 2 — Does a hard constraint exist? Content constraint (legibility floor, tap target minimum) → Inside-Out.', weight: 400 },
  { size: 11, lineHeight: 16, usage: 'Labels / captions',   sampleShort: 'FIBO SECTION · F5 · 42% · 543px',  weight: 600 },
  { size: 10, lineHeight: 16, usage: 'Micro labels',        sampleShort: 'Canvas: 1470 × 956 · Content: 1294px · Margin: 88px',  weight: 500 },
  { size: 9,  lineHeight: 16, usage: 'Axis labels / ordinals', sampleShort: 'F1  F2  F3  F4  F5  ·  6%  10%  16%  26%  42%', weight: 500 },
  { size: 8,  lineHeight: 16, usage: 'Footnotes / tooltips', sampleShort: '* 1px rounding loss across 5 values is expected Layer 2 behaviour.', weight: 400 },
]

interface GapEntry {
  gap: string
  rulerF5: number
  plus1: number
  plus2: number
  chosen: string
}

const gapFills: GapEntry[] = [
  { gap: '8 → 13',  rulerF5: 8,  plus1: 9,  plus2: 10, chosen: '9, 10'  },
  { gap: '10 → 13', rulerF5: 10, plus1: 11, plus2: 12, chosen: '11 ✓'   },
  { gap: '13 → 21', rulerF5: 13, plus1: 15, plus2: 16, chosen: '16 ✓'   },
  { gap: '16 → 21', rulerF5: 16, plus1: 18, plus2: 19, chosen: '18 ✓'   },
  { gap: '21 → 34', rulerF5: 21, plus1: 24, plus2: 26, chosen: '— (skipped)' },
  { gap: '34 → 55', rulerF5: 34, plus1: 39, plus2: 42, chosen: '— (skipped)' },
]

export default function Typography() {
  return (
    <div>
      {/* ── PAGE HEADER ── */}
      <header style={styles.pageHeader}>
        <div className="content">
          <span className="label" style={{ display: 'block', marginBottom: 'var(--sp16)' }}>
            Typography
          </span>
          <h1 style={styles.pageTitle}>The type scale.</h1>
          <p style={styles.pageSubtitle}>
            Ten sizes. One base ruler. Gap-filling applied at every step.
          </p>
        </div>
      </header>

      {/* ── GAP-FILLING EXPLANATION ── */}
      <section style={styles.section}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">How it's built</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>One ruler. Gap-filled.</h2>
              <p style={styles.body}>
                The base ruler sets F1 = 8px. This produces 8, 13, 21, 34, 55.
                The gaps between these values are too large for a usable type system,
                so the gap-filling rule adds intermediates.
              </p>
              <p style={styles.body}>
                For each gap: take the lower value, scale a ruler so F5 equals it,
                add F1 (+1 step) or F2 (+2 steps) to create intermediates.
              </p>

              {/* Gap-filling table */}
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Gap', 'Ruler F5=', '+F1', '+F2', 'Chosen for this design'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gapFills.map((g) => (
                    <tr key={g.gap}>
                      <td style={styles.td}><span className="mono">{g.gap}</span></td>
                      <td style={styles.td}><span className="mono chip">{g.rulerF5}</span></td>
                      <td style={styles.td}><span className="mono chip">{g.plus1}</span></td>
                      <td style={styles.td}><span className="mono chip">{g.plus2}</span></td>
                      <td style={{ ...styles.td, color: g.chosen.includes('skip') ? 'var(--c-faint)' : 'var(--c-accent)', fontWeight: 600 }}>
                        <span className="mono">{g.chosen}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={styles.note}>
                Chose 11 over 12. Either is valid — choice depends on typeface and design intent.
                This design uses Inter; 11px reads well at that weight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TYPE SCALE WATERFALL ── */}
      <section style={styles.section}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Live scale</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>All ten sizes.</h2>
              <p style={styles.body}>
                Shown at actual size. Each line sits on the baseline grid.
                Values shown: size / line-height / usage.
              </p>
            </div>
          </div>

          {/* Waterfall */}
          <div style={styles.waterfall}>
            {typeScale.map((entry, i) => (
              <div
                key={entry.size}
                className="two-col"
                style={{
                  ...styles.waterfallRow,
                  borderBottom: i < typeScale.length - 1 ? '1px solid var(--c-border)' : 'none',
                }}
              >
                {/* Meta column — F4 of 1270px = 330px */}
                <div style={styles.waterfallMeta}>
                  <div style={styles.metaValues}>
                    <span className="mono chip">{entry.size}px</span>
                    <span className="mono" style={{ fontSize: 'var(--t10)', color: 'var(--c-faint)' }}>
                      / {entry.lineHeight}px lh
                    </span>
                  </div>
                  <div style={styles.metaUsage}>{entry.usage}</div>
                </div>

                {/* Sample — fills remaining content area */}
                <div
                  style={{
                    ...styles.waterfallSample,
                    fontSize: entry.size,
                    lineHeight: `${entry.lineHeight}px`,
                    fontWeight: entry.weight,
                  }}
                >
                  {entry.sampleShort}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LINE HEIGHTS ── */}
      <section style={{ ...styles.section, borderBottom: 'none' }}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Line heights</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>Multiples of 8.</h2>
              <p style={styles.body}>
                Every line height is a multiple of the 8px baseline grid. Larger text gets
                tighter ratios; smaller text gets looser ratios. Both compact and spacious
                options are valid FIBO choices.
              </p>

              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Text size', 'Compact lh', 'Spacious lh', 'This design uses'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    [8,  16, 24, 16],
                    [9,  16, 24, 16],
                    [10, 16, 24, 16],
                    [11, 16, 24, 16],
                    [13, 16, 24, 24],
                    [16, 24, 32, 24],
                    [18, 24, 32, 32],
                    [21, 24, 32, 32],
                    [34, 40, 48, 40],
                    [55, 56, 64, 64],
                  ].map(([sz, c, sp, used]) => (
                    <tr key={sz}>
                      <td style={styles.td}><span className="mono chip">{sz}px</span></td>
                      <td style={styles.td}><span className="mono">{c}px</span></td>
                      <td style={styles.td}><span className="mono">{sp}px</span></td>
                      <td style={styles.td}>
                        <span className="chip">{used}px</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Visual baseline demo */}
              <div style={styles.baselineDemo}>
                <span className="label" style={{ display: 'block', marginBottom: 'var(--sp16)' }}>
                  8px baseline grid — text sits on grid lines
                </span>
                <div style={styles.baselineGrid}>
                  {/* Grid lines at every 8px */}
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        top: i * 8,
                        left: 0,
                        right: 0,
                        height: 1,
                        background: i === 0 ? 'var(--c-border-2)' : 'var(--c-border)',
                      }}
                    />
                  ))}
                  <div style={{ position: 'relative', paddingTop: 8 }}>
                    <span style={{
                      fontSize: 'var(--t16)',
                      lineHeight: 'var(--lh16)',  /* 24px = 3 × 8 ✓ */
                      fontWeight: 400,
                      display: 'block',
                    }}>
                      Body text · 16px / 24px lh · sits on 8px grid
                    </span>
                    <span style={{
                      fontSize: 'var(--t13)',
                      lineHeight: 'var(--lh13)',  /* 24px = 3 × 8 ✓ */
                      color: 'var(--c-muted)',
                      display: 'block',
                    }}>
                      Caption · 13px / 24px lh · also on grid
                    </span>
                  </div>
                </div>
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
  colLabel: {
    paddingTop: 'var(--sp8)',
  },
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    fontSize: 'var(--t10)',
    lineHeight: 'var(--lh10)',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--c-muted)',
    padding: 'var(--sp8) var(--sp16)',
    borderBottom: '2px solid var(--c-border)',
  },
  td: {
    padding: 'var(--sp8) var(--sp16)',
    borderBottom: '1px solid var(--c-border)',
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    verticalAlign: 'middle',
  },

  /* Waterfall */
  waterfall: {
    marginTop: 'var(--sp48)',
    border: '1px solid var(--c-border)',
  },
  waterfallRow: {
    padding: 'var(--sp24) 0',
    alignItems: 'center',  /* override two-col's align-items: start */
  },
  waterfallMeta: {
    padding: '0 var(--sp24)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp8)',
  },
  metaValues: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp8)',
  },
  metaUsage: {
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    color: 'var(--c-muted)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  waterfallSample: {
    padding: '0 var(--sp24)',
    color: 'var(--c-text)',
    wordBreak: 'break-word',
  },

  /* Baseline demo */
  baselineDemo: {
    padding: 'var(--sp24)',
    background: 'var(--c-surface)',
    border: '1px solid var(--c-border)',
  },
  baselineGrid: {
    position: 'relative',
    height: '96px',    /* 12 × 8px grid lines */
    overflow: 'hidden',
  },
}
