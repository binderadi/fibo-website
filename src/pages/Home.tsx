import { Link } from 'react-router-dom'

/*
 * HOME PAGE — FIBO VALUES USED
 *
 * Hero section:
 *   - Vertical padding: 96px top + 96px bottom (12×8)
 *   - Headline: 55px / 64px lh — largest type, sets the canvas expectation
 *   - Tagline: 21px / 32px lh — one step below
 *   - Gap headline→tagline: 24px (item gap)
 *   - Body: 16px / 24px lh — reading text
 *   - Max-width of body text: 543px (F5) — comfortable line length
 *   - Gap tagline→body: 16px (tighter — belongs to same thought)
 *   - CTA gap: 32px
 *   - CTA button: 13px / 16px lh, 16px v-pad, 24px h-pad → 48px height ✓
 *
 * Feature cards:
 *   - Section gap from hero: 96px (major section boundary)
 *   - 3 cards: equal-width repeating grid (per FIBO spec §13)
 *     2 gutters × 24px = 48px. Available: 1294−48 = 1246px. Each card: 1246÷3 = 415px.
 *     CSS: repeat(3, 1fr) + gap:24px achieves this automatically.
 *   - Card padding: 32px (4×8)
 *   - Card title: 18px / 32px lh
 *   - Card body: 13px / 24px lh
 *   - Gap title→body: 16px
 *
 * Overview sections (2-column):
 *   - Left: F4 of 1270px (post-gutter) = 330px
 *   - Gutter: 24px. Right: 940px. Total: 330+24+940 = 1294px ✓
 *   - Gap: 96px between each 2-col block
 */

interface FeatureCard {
  number: string
  title: string
  body: string
  to: string
}

const features: FeatureCard[] = [
  {
    number: '01',
    title: 'Pure ratios',
    body: 'Every measurement derives from 3, 5, 8, 13, 21 — the Fibonacci sequence. Nothing is arbitrary.',
    to: '/system',
  },
  {
    number: '02',
    title: 'Signal-driven',
    body: 'Five signals tell you which mode to use. Design intent replaces guesswork.',
    to: '/signals',
  },
  {
    number: '03',
    title: 'Two layers',
    body: 'Layer 1 is the mathematical truth. Layer 2 adapts it to pixels. Both are FIBO.',
    to: '/system',
  },
  {
    number: '04',
    title: 'Type system',
    body: 'Ten sizes, gap-filled from a single base ruler. Every size earns its place.',
    to: '/typography',
  },
  {
    number: '05',
    title: 'Spacing system',
    body: 'Gestalt proximity governs every gap. Internal always less than external.',
    to: '/spacing',
  },
  {
    number: '06',
    title: 'Six-step layout',
    body: 'A repeatable composition method. Same signals, same tools, any canvas.',
    to: '/layout',
  },
]

export default function Home() {
  return (
    <div>
      {/* ── HERO ── */}
      <section style={styles.hero}>
        <div className="content" style={styles.heroInner}>
          <div style={styles.heroEyebrow}>
            <span className="label">Fibonacci Design System</span>
            <span className="label" style={{ color: 'var(--c-faint)' }}>by Adi Binder</span>
          </div>

          <h1 style={styles.headline}>
            Proportion<br />through ratio.
          </h1>

          <p style={styles.tagline}>
            FIBO constrains you to harmonious options.<br />
            Design intent chooses between them.
          </p>

          <p style={styles.body}>
            A measurement system derived from the Fibonacci sequence. Close to
            Josef Müller-Brockmann in philosophy — grid-based, systematic —
            but using pure FIBO ratios instead of traditional column grids.
          </p>

          <div style={styles.ctaRow}>
            <Link to="/system" style={styles.ctaPrimary}>
              Explore the system →
            </Link>
            <Link to="/signals" style={styles.ctaSecondary}>
              Try the signals
            </Link>
          </div>

          {/* FIBO ruler strip — visual demonstration of the 5 sections */}
          <div style={styles.ruler}>
            {[
              { label: 'F1 · 6%',  w: 78,  bg: 'var(--c-f1)', c: 'var(--c-accent)' },
              { label: 'F2 · 10%', w: 129, bg: 'var(--c-f2)', c: 'var(--c-accent)' },
              { label: 'F3 · 16%', w: 207, bg: 'var(--c-f3)', c: 'var(--c-bg)'     },
              { label: 'F4 · 26%', w: 336, bg: 'var(--c-f4)', c: 'var(--c-bg)'     },
              { label: 'F5 · 42%', w: 543, bg: 'var(--c-f5)', c: 'var(--c-bg)'     },
            ].map((s) => (
              <div key={s.label} style={{ ...styles.rulerSection, width: `${(s.w / 1293) * 100}%`, background: s.bg, color: s.c, overflow: 'hidden' }}>
                <span className="ruler-text" style={styles.rulerLabel}>{s.label}</span>
                <span className="ruler-text mono" style={{ ...styles.rulerPx, color: s.c }}>{s.w}px</span>
              </div>
            ))}
          </div>
          <p style={styles.rulerCaption} className="mono">
            Content area: 1294px · Canvas: 1470px · Margin: 88px (6%)
          </p>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section style={styles.featuresSection}>
        <div className="content">
          <div style={styles.featuresMeta}>
            <span className="label">What's in FIBO</span>
          </div>
          <div className="grid-3">
            {features.map((f) => (
              <Link key={f.number} to={f.to} style={styles.card}>
                <span className="mono" style={styles.cardNumber}>{f.number}</span>
                <h3 style={styles.cardTitle}>{f.title}</h3>
                <p style={styles.cardBody}>{f.body}</p>
                <span style={styles.cardLink}>Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY BLOCK ── */}
      <section style={styles.philosophySection}>
        <div className="content">
          <div className="two-col">
            <div style={styles.philosophyLeft}>
              <span className="label">Philosophy</span>
            </div>
            <div style={styles.philosophyRight}>
              <p style={styles.pullQuote}>
                "FIBO constrains you to harmonious options,<br />
                not a single answer."
              </p>
              <p style={styles.philosophyBody}>
                Traditional grid systems impose a rigid column count. FIBO gives you a
                mathematical vocabulary. The sequence 3, 5, 8, 13, 21 produces five sections
                whose proportions are always in harmony — because they come from the same
                generative rule. You choose which sections to use, combine, or nest.
                The constraint is the creativity.
              </p>
              <p style={styles.philosophyBody}>
                Two modes — Inside-Out and Outside-In — describe the direction of
                derivation. Five signals tell you which mode applies. Run the signals,
                get the answer. No subjective guessing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={styles.bottomCta}>
        <div className="content" style={styles.bottomCtaInner}>
          <h2 style={styles.bottomCtaHeadline}>Start with the system.</h2>
          <div style={styles.ctaRow}>
            <Link to="/system" style={styles.ctaPrimary}>Core ratios →</Link>
            <Link to="/typography" style={styles.ctaSecondary}>Type scale</Link>
            <Link to="/spacing" style={styles.ctaSecondary}>Spacing</Link>
            <Link to="/layout" style={styles.ctaSecondary}>Layout</Link>
          </div>
        </div>
      </section>

      {/* Footer spacer */}
      <div style={{ height: 'var(--sp96)' }} />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  /* ── Hero ── */
  hero: {
    borderBottom: '1px solid var(--c-border)',
    paddingTop: 'var(--sp96)',     /* 96px — major top margin */
    paddingBottom: 'var(--sp96)',  /* 96px */
  },
  heroInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  heroEyebrow: {
    display: 'flex',
    gap: 'var(--sp24)',
    marginBottom: 'var(--sp32)', /* 32px gap before headline */
  },
  headline: {
    fontSize: 'var(--t55)',      /* 55px — largest type */
    lineHeight: 'var(--lh55)',   /* 64px */
    fontWeight: 700,
    letterSpacing: '-0.02em',
    marginBottom: 'var(--sp24)', /* 24px — headline to tagline */
  },
  tagline: {
    fontSize: 'var(--t21)',      /* 21px */
    lineHeight: 'var(--lh21)',   /* 32px */
    fontWeight: 400,
    color: 'var(--c-text)',
    maxWidth: 'var(--f4f5)',     /* 879px — F4+F5 for wider read */
    marginBottom: 'var(--sp16)', /* 16px — tagline to body (tighter: same thought) */
  },
  body: {
    fontSize: 'var(--t16)',      /* 16px */
    lineHeight: 'var(--lh16)',   /* 24px */
    color: 'var(--c-muted)',
    maxWidth: 'var(--f5)',       /* 543px — F5 for comfortable line length */
    marginBottom: 'var(--sp32)', /* 32px — body to CTA */
  },
  ctaRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--sp16)',          /* 16px — between CTA options */
    marginBottom: 'var(--sp64)', /* 64px — CTA to ruler */
  },
  ctaPrimary: {
    /* Inside-Out: 13px text, 16px lh, 16px v-pad, 24px h-pad → 48px height */
    display: 'inline-flex',
    alignItems: 'center',
    height: 'var(--nav-h)',      /* 48px — matches nav height (consistent prop) */
    padding: '0 var(--sp24)',    /* 24px h-pad */
    fontSize: 'var(--t13)',      /* 13px */
    lineHeight: 'var(--lh13)',   /* 24px — but height is fixed at 48px */
    fontWeight: 600,
    background: 'var(--c-text)',
    color: 'var(--c-bg)',
    textDecoration: 'none',
    letterSpacing: '0.01em',
  },
  ctaSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    height: 'var(--nav-h)',      /* 48px — consistent */
    padding: '0 var(--sp24)',
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    fontWeight: 500,
    border: '1px solid var(--c-border)',
    color: 'var(--c-text)',
    textDecoration: 'none',
    letterSpacing: '0.01em',
  },

  /* ── FIBO Ruler ── */
  ruler: {
    display: 'flex',
    height: '48px',              /* 48px — same as nav/button height (consistency) */
    overflow: 'hidden',
  },
  rulerSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 var(--sp8)',     /* 8px h-pad inside ruler sections */
    flexShrink: 0,
  },
  rulerLabel: {
    fontSize: 'var(--t9)',       /* 9px — axis labels */
    lineHeight: 'var(--lh9)',    /* 16px */
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 500,
  },
  rulerPx: {
    fontSize: 'var(--t8)',       /* 8px — smallest type */
    lineHeight: 'var(--lh8)',    /* 16px */
    fontFamily: "'JetBrains Mono', monospace",
    opacity: 0.8,
  },
  rulerCaption: {
    fontSize: 'var(--t10)',      /* 10px */
    lineHeight: 'var(--lh10)',   /* 16px */
    color: 'var(--c-muted)',
    marginTop: 'var(--sp8)',     /* 8px — tight: ruler caption belongs to ruler */
  },

  /* ── Features ── */
  featuresSection: {
    paddingTop: 'var(--sp96)',   /* 96px — major section gap */
    paddingBottom: 'var(--sp96)',
    borderBottom: '1px solid var(--c-border)',
  },
  featuresMeta: {
    marginBottom: 'var(--sp48)', /* 48px — label to grid */
  },
  featuresGrid: {
    /* 3 equal cols — equal-width repeating grid per FIBO spec §13 */
    /* (1294 − 2×24) ÷ 3 = 415px per card. CSS repeat(3,1fr) achieves this. */
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--gutter)',        /* 24px gutter */
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: 'var(--sp32)',      /* 32px — card internal padding (4×8) */
    border: '1px solid var(--c-border)',
    textDecoration: 'none',
    color: 'var(--c-text)',
    transition: 'border-color 0.15s, background 0.15s',
  },
  cardNumber: {
    fontSize: 'var(--t9)',       /* 9px — small ordinal */
    lineHeight: 'var(--lh9)',    /* 16px */
    fontWeight: 500,
    color: 'var(--c-muted)',
    marginBottom: 'var(--sp16)', /* 16px — number to title */
  },
  cardTitle: {
    fontSize: 'var(--t18)',      /* 18px — card heading */
    lineHeight: 'var(--lh18)',   /* 32px */
    fontWeight: 600,
    marginBottom: 'var(--sp16)', /* 16px — title to body (internal) */
  },
  cardBody: {
    fontSize: 'var(--t13)',      /* 13px */
    lineHeight: 'var(--lh13)',   /* 24px */
    color: 'var(--c-muted)',
    flex: 1,
    marginBottom: 'var(--sp24)', /* 24px — body to link (external-ish) */
  },
  cardLink: {
    fontSize: 'var(--t11)',      /* 11px */
    lineHeight: 'var(--lh11)',   /* 16px */
    fontWeight: 600,
    color: 'var(--c-accent)',
  },

  /* ── Philosophy ── */
  philosophySection: {
    paddingTop: 'var(--sp96)',
    paddingBottom: 'var(--sp96)',
    borderBottom: '1px solid var(--c-border)',
  },
  philosophyGrid: {
    display: 'grid',
    /* F4 of post-gutter (1270px) = 330px sidebar, gutter 24px, 940px main */
    gridTemplateColumns: 'var(--col-sidebar) 1fr',
    gap: 'var(--gutter)',        /* 24px */
    alignItems: 'start',
  },
  philosophyLeft: {
    paddingTop: 'var(--sp8)',    /* align label with text cap-height */
  },
  philosophyRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp24)',          /* 24px between paragraphs */
  },
  pullQuote: {
    fontSize: 'var(--t21)',      /* 21px */
    lineHeight: 'var(--lh21)',   /* 32px */
    fontWeight: 400,
    fontStyle: 'italic',
    color: 'var(--c-text)',
    paddingLeft: 'var(--sp24)',  /* 24px — visual indent */
    borderLeft: '3px solid var(--c-accent)',
  },
  philosophyBody: {
    fontSize: 'var(--t16)',      /* 16px */
    lineHeight: 'var(--lh16)',   /* 24px */
    color: 'var(--c-muted)',
  },

  /* ── Bottom CTA ── */
  bottomCta: {
    paddingTop: 'var(--sp96)',
    paddingBottom: 'var(--sp96)',
  },
  bottomCtaInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp32)',
  },
  bottomCtaHeadline: {
    fontSize: 'var(--t34)',      /* 34px */
    lineHeight: 'var(--lh34)',   /* 40px */
    fontWeight: 700,
  },
}
