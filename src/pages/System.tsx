/*
 * SYSTEM PAGE — FIBO VALUES USED
 *
 * Page layout:
 *   - Page header: 96px top padding
 *   - Sections separated by: 96px gaps + full-width border
 *   - Two-column structure where applicable:
 *     Left (label col): F4 of 1270px (post-gutter) = 330px
 *     Gutter: 24px
 *     Right (content): 940px (1270 − 330)
 *
 * Typography on this page:
 *   - Page title: 34px / 40px lh
 *   - Section heading: 21px / 32px lh
 *   - Body: 16px / 24px lh
 *   - Labels: 11px uppercase
 *   - Values/code: 13px mono
 *
 * Ratio visualization bars:
 *   - Height: 48px (3× baseline of 16px) = 48px ✓
 *   - Width: proportional to FIBO section (pixel values from content area)
 */

const sections = [
  { name: 'F1', fib: 3,  pct: '6%',  px: 78,  color: 'var(--c-f1)', textColor: 'var(--c-accent)' },
  { name: 'F2', fib: 5,  pct: '10%', px: 129, color: 'var(--c-f2)', textColor: 'var(--c-accent)' },
  { name: 'F3', fib: 8,  pct: '16%', px: 207, color: 'var(--c-f3)', textColor: 'var(--c-bg)'     },
  { name: 'F4', fib: 13, pct: '26%', px: 336, color: 'var(--c-f4)', textColor: 'var(--c-bg)'     },
  { name: 'F5', fib: 21, pct: '42%', px: 543, color: 'var(--c-f5)', textColor: 'var(--c-bg)'     },
]

const tools = [
  { name: 'Sammy Square',    shape: '■', desc: 'Square proportions — width equals height. Use for icons, avatars, thumbnails.' },
  { name: 'Bob Boxes',       shape: '▬', desc: 'Rectangular containers. Every screen layout example uses Bob Boxes.' },
  { name: 'Paul the Pyramid',shape: '▲', desc: 'Triangular and angular elements. Proportions applied to angled sides.' },
  { name: 'Cesar Circles',   shape: '●', desc: 'Circular elements. Concentric rings or radial divisions follow FIBO ratios.' },
  { name: 'Leo the Ladder',  shape: '≡', desc: 'Vertical stacking. Baseline grid and section gaps live here.' },
]

import { useHashNav } from '../hooks/useHashNav'

export default function System() {
  useHashNav()
  return (
    <div>
      {/* ── PAGE HEADER ── */}
      <header style={styles.pageHeader}>
        <div className="content">
          <span className="label" style={{ display: 'block', marginBottom: 'var(--sp16)' }}>
            The System
          </span>
          <h1 style={styles.pageTitle}>Core structure.</h1>
          <p style={styles.pageSubtitle}>
            Five ratios. Two layers. Two modes. One signal flow.
          </p>
        </div>
      </header>

      {/* ── CORE RATIOS ── */}
      <section id="core-ratios" style={styles.section}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Core Ratios</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>The sequence 3, 5, 8, 13, 21</h2>
              <p style={styles.body}>
                Five consecutive Fibonacci numbers whose sum is 50. Each section is a
                percentage of the total. Apply to any canvas to get five harmonious zones.
              </p>

              {/* Proportional bars */}
              <div style={styles.ratioBar}>
                {sections.map((s) => (
                  <div
                    key={s.name}
                    style={{
                      ...styles.ratioSection,
                      width: s.pct,
                      background: s.color,
                      color: s.textColor,
                    }}
                  >
                    <span className="mono" style={styles.ratioName}>{s.name}</span>
                    <span className="mono" style={styles.ratioPct}>{s.pct}</span>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Section', 'Fibonacci', 'Percentage', 'px (1294px canvas)'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sections.map((s) => (
                    <tr key={s.name}>
                      <td style={styles.td}>
                        <span className="mono" style={{ fontWeight: 600 }}>{s.name}</span>
                      </td>
                      <td style={styles.td}>
                        <span className="mono">{s.fib}</span>
                      </td>
                      <td style={styles.td}>
                        <span className="mono">{s.pct}</span>
                      </td>
                      <td style={styles.td}>
                        <span className="chip">{s.px}px</span>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--c-surface)' }}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>Total</td>
                    <td style={styles.td}><span className="mono">50</span></td>
                    <td style={styles.td}><span className="mono">100%</span></td>
                    <td style={styles.td}><span className="chip">1293px*</span></td>
                  </tr>
                </tbody>
              </table>
              </div>
              <p style={styles.note}>
                * 1px rounding loss across 5 values (78+129+207+336+543 = 1293 not 1294).
                This is Layer 2 — pixel rendering — rounding is expected and correct.
              </p>

              <div style={{ marginTop: 'var(--sp32)' }}>
                <h3 style={styles.subTitle}>Extending the sequence</h3>
                <p style={styles.body}>
                  When 5 sections are insufficient — panoramic canvases, fine typography —
                  continue: <span className="mono chip">34</span>&nbsp;
                  <span className="mono chip">55</span>&nbsp;
                  <span className="mono chip">89</span>&nbsp;
                  <span className="mono chip">144</span>&nbsp;
                  <span className="mono chip">233</span>.
                  All percentages recalculate against the new total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TWO LAYERS ── */}
      <section id="two-layers" style={styles.section}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Two Layers</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>Core and screen.</h2>
              <p style={styles.body}>
                FIBO operates at two levels simultaneously. Layer 1 is the philosophical truth.
                Layer 2 is the practical reality.
              </p>

              <div className="grid-2">
                <div style={styles.layerCard}>
                  <div style={styles.layerTag}>Layer 1</div>
                  <h3 style={styles.layerTitle}>FIBO Core</h3>
                  <p style={styles.layerDesc}>Resolution-independent. Pure ratios and percentages. Mathematically exact, no rounding. Used directly in print (mm, inches, points).</p>
                  <div style={styles.layerExample}>
                    <span className="mono" style={styles.exampleValue}>1294 × 42% = 543.48</span>
                    <span style={styles.exampleArrow}>→</span>
                    <span className="mono" style={{ color: 'var(--c-muted)' }}>exact</span>
                  </div>
                </div>
                <div style={{ ...styles.layerCard, background: 'var(--c-text)', color: 'var(--c-bg)' }}>
                  <div style={{ ...styles.layerTag, background: 'var(--c-accent)', color: 'var(--c-bg)' }}>Layer 2</div>
                  <h3 style={{ ...styles.layerTitle, color: 'var(--c-bg)' }}>Screen Implementation</h3>
                  <p style={{ ...styles.layerDesc, color: 'rgba(255,255,255,0.7)' }}>Translates Layer 1 for screens. Round to nearest integer. At exactly .5, round up.</p>
                  <div style={styles.layerExample}>
                    <span className="mono" style={{ ...styles.exampleValue, color: 'var(--c-bg)' }}>543.48</span>
                    <span style={{ ...styles.exampleArrow, color: 'var(--c-bg)' }}>→</span>
                    <span className="chip" style={{ background: 'var(--c-accent-bg)', color: 'var(--c-accent)' }}>543px</span>
                  </div>
                </div>
              </div>

              <div style={styles.roundingNote}>
                <span className="label">Rounding rule</span>
                <div style={{ marginTop: 'var(--sp16)', display: 'flex', gap: 'var(--sp24)', flexWrap: 'wrap' }}>
                  {[
                    ['86.4', '86px'],
                    ['22.5', '23px'],
                    ['153.7','154px'],
                    ['543.48','543px'],
                  ].map(([from, to]) => (
                    <div key={from} style={styles.roundingExample}>
                      <span className="mono" style={{ fontSize: 'var(--t13)', color: 'var(--c-muted)' }}>{from}</span>
                      <span style={{ color: 'var(--c-faint)' }}>→</span>
                      <span className="chip">{to}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TWO MODES ── */}
      <section id="two-modes" style={styles.section}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Two Modes</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>Inside-Out and Outside-In.</h2>
              <p style={styles.body}>
                Every FIBO measurement is either derived from content outward,
                or from the container inward. The five signals tell you which.
              </p>

              <div className="grid-2">
                <div style={styles.modeCard}>
                  <div style={styles.modeArrow}>↙</div>
                  <h3 style={styles.modeTitle}>Outside-In</h3>
                  <p style={styles.modeDesc}>
                    Container is known first. Content is placed within it using FIBO ratios.
                  </p>
                  <div style={styles.modeExample}>
                    <span className="label" style={{ marginBottom: 'var(--sp8)', display: 'block' }}>Example</span>
                    <p style={{ fontSize: 'var(--t13)', lineHeight: 'var(--lh13)', color: 'var(--c-muted)' }}>
                      Dividing the 1294px content area into F1–F5 columns.
                      The canvas is known; the columns are derived.
                    </p>
                  </div>
                </div>
                <div style={{ ...styles.modeCard, borderColor: 'var(--c-accent)', background: 'var(--c-accent-bg)' }}>
                  <div style={{ ...styles.modeArrow, color: 'var(--c-accent)' }}>↗</div>
                  <h3 style={{ ...styles.modeTitle, color: 'var(--c-accent)' }}>Inside-Out</h3>
                  <p style={styles.modeDesc}>
                    Content is known first. Container is derived from the content.
                  </p>
                  <div style={styles.modeExample}>
                    <span className="label" style={{ marginBottom: 'var(--sp8)', display: 'block' }}>Example</span>
                    <p style={{ fontSize: 'var(--t13)', lineHeight: 'var(--lh13)', color: 'var(--c-muted)' }}>
                      Button height derived from text size + padding.
                      Text is known; the button container follows.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FIVE TOOLS ── */}
      <section id="five-tools" style={{ ...styles.section, borderBottom: 'none' }}>
        <div className="content">
          <div className="two-col">
            <div style={styles.colLabel}>
              <span className="label">Five Tools</span>
            </div>
            <div style={styles.colContent}>
              <h2 style={styles.sectionTitle}>Same ratios, different shapes.</h2>
              <p style={styles.body}>
                Five elastic rulers — Sammy, Bob, Paul, Cesar, Leo — apply the same FIBO
                percentages to different geometries. The shape is just the container the
                ruler sits on.
              </p>
              <div style={styles.toolsGrid}>
                {tools.map((t) => (
                  <div key={t.name} style={styles.toolCard}>
                    <div style={styles.toolShape}>{t.shape}</div>
                    <div>
                      <div style={styles.toolName}>{t.name}</div>
                      <div style={styles.toolDesc}>{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ ...styles.note, marginTop: 'var(--sp24)' }}>
                All five share the same percentages, signals, and rules.
              </p>
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
    gridTemplateColumns: 'var(--col-sidebar) 1fr',  /* 330px label + 940px content */
    gap: 'var(--gutter)',                   /* 24px */
    alignItems: 'start',
  },
  colLabel: {
    paddingTop: 'var(--sp8)',              /* optical alignment with text cap */
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
  subTitle: {
    fontSize: 'var(--t18)',
    lineHeight: 'var(--lh18)',
    fontWeight: 600,
    marginBottom: 'var(--sp16)',
  },
  body: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    color: 'var(--c-muted)',
    maxWidth: 'var(--f4f5)',              /* 879px reading width */
  },
  note: {
    fontSize: 'var(--t11)',
    lineHeight: 'var(--lh11)',
    color: 'var(--c-faint)',
    fontStyle: 'italic',
  },

  /* Ratio bars */
  ratioBar: {
    display: 'flex',
    height: '48px',
    overflow: 'hidden',
    border: '1px solid var(--c-border)',
  },
  ratioSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 var(--sp8)',
    flexShrink: 0,
  },
  ratioName: {
    fontSize: 'var(--t10)',
    lineHeight: 'var(--lh10)',
    fontWeight: 700,
  },
  ratioPct: {
    fontSize: 'var(--t9)',
    lineHeight: 'var(--lh9)',
    opacity: 0.8,
  },

  /* Table */
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
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
  },

  /* Layers */
  layerGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--gutter)',
  },
  layerCard: {
    padding: 'var(--sp32)',
    border: '1px solid var(--c-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp16)',
  },
  layerTag: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '24px',
    padding: '0 var(--sp8)',
    fontSize: 'var(--t10)',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: 'var(--c-surface)',
    color: 'var(--c-muted)',
    alignSelf: 'flex-start',
  },
  layerTitle: {
    fontSize: 'var(--t18)',
    lineHeight: 'var(--lh18)',
    fontWeight: 600,
  },
  layerDesc: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    color: 'var(--c-muted)',
    flex: 1,
  },
  layerExample: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp8)',
  },
  exampleValue: {
    fontSize: 'var(--t13)',
    fontWeight: 500,
  },
  exampleArrow: {
    color: 'var(--c-muted)',
  },
  roundingNote: {
    padding: 'var(--sp24)',
    background: 'var(--c-surface)',
    border: '1px solid var(--c-border)',
  },
  roundingExample: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp8)',
  },

  /* Modes */
  modesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--gutter)',
  },
  modeCard: {
    padding: 'var(--sp32)',
    border: '1px solid var(--c-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp16)',
  },
  modeArrow: {
    fontSize: 'var(--t34)',
    lineHeight: 1,
    color: 'var(--c-muted)',
  },
  modeTitle: {
    fontSize: 'var(--t21)',
    lineHeight: 'var(--lh21)',
    fontWeight: 700,
  },
  modeDesc: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    color: 'var(--c-muted)',
    flex: 1,
  },
  modeExample: {
    padding: 'var(--sp16)',
    background: 'var(--c-surface)',
  },

  /* Tools */
  toolsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    border: '1px solid var(--c-border)',
  },
  toolCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--sp24)',
    padding: 'var(--sp24)',
    borderBottom: '1px solid var(--c-border)',
  },
  toolShape: {
    fontSize: 'var(--t34)',
    lineHeight: 1,
    width: '48px',
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    color: 'var(--c-accent)',
  },
  toolName: {
    fontSize: 'var(--t16)',
    lineHeight: 'var(--lh16)',
    fontWeight: 600,
    marginBottom: 'var(--sp8)',
  },
  toolDesc: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    color: 'var(--c-muted)',
  },
}
