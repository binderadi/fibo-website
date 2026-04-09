import { Link } from 'react-router-dom'

/*
 * ROAM — Travel Magazine
 * Canvas: 1470×956 (MacBook Air M4)
 *
 * ─── CANVAS & LAYOUT ─────────────────────────────────────────────
 * Margin:         1470 × 6% = 88.2 → 88px
 * Content area:   1470 − (2×88) = 1294px
 *
 * Hero image (Outside-In, full content width):
 *   Width:  1294px (width:100% inside padded container)
 *   Height: 1294 × 42% = 543.48 → 543px
 *
 * Two-column feature section (gutter mechanic: subtract first):
 *   Post-gutter:  1294 − 24 = 1270px
 *   Main (F4+F5): 1270 × 68% = 863.6 → 864px
 *   Sidebar:      1270 × 32% = 406.4 → 406px
 *   Check:        864 + 24 + 406 = 1294 ✓
 *
 * Feature article image (Outside-In from main col):
 *   Width:  864px
 *   Height: 864 × 42% = 362.88 → 363px
 *
 * 3-column destinations grid (equal-width):
 *   Post-gutter:  1294 − (2×24) = 1246px
 *   Each card:    1246 ÷ 3 = 415.3 → 415px (repeat(3,1fr) fills exactly)
 *   Card image h: 415 × 58% = 240.7 → 241px
 *
 * Editor's note (centered):
 *   Width: 1294 × 42% = 543.48 → 543px
 *
 * Footer columns (4-equal):
 *   Post-gutter:  1294 − (3×24) = 1222px
 *   Each col:     1222 ÷ 4 = 305.5 → 306px (repeat(4,1fr) fills exactly)
 *
 * ─── COMPONENT HEIGHTS (Inside-Out, Signal 5) ────────────────────
 * Top bar:        11px / 16px lh + 12px v-pad × 2   = 40px ✓
 * Masthead:       34px / 40px lh + 12px v-pad × 2   = 64px ✓
 * Category nav:   13px / 24px lh + 12px v-pad × 2   = 48px ✓
 * Category tag:   10px / 16px lh + 8px v-pad × 2    = 32px ✓
 *
 * ─── TYPOGRAPHY ──────────────────────────────────────────────────
 * Magazine name:          34px / 40px lh   Playfair Display 700
 * Category nav items:     13px / 24px lh
 * Section label:          10px / 16px lh   uppercase, tracked
 * Hero headline:          55px / 64px lh   Playfair Display 700
 * Hero subhead:           18px / 24px lh
 * Feature headline:       34px / 40px lh   Playfair Display 700
 * Feature excerpt:        16px / 24px lh
 * Sidebar headline:       18px / 24px lh   Playfair Display 600
 * Sidebar excerpt:        13px / 24px lh
 * Destination headline:   21px / 32px lh   Playfair Display 700
 * Destination desc:       13px / 24px lh
 * Editor quote:           21px / 32px lh   Playfair Display italic
 * Byline / caption:       11px / 16px lh
 * Category tag:           10px / 16px lh
 * Footer heading:         11px / 16px lh
 * Footer links:           13px / 24px lh
 *
 * ─── COLORS (HSL 18° terracotta, light-dominant) ─────────────────
 * Dominant  (42%): hsl(18, 12%, 94%)   warm cream background
 * Secondary (26%): hsl(18,  0%, 100%)  white for cards/masthead
 * Structural(16%): hsl(18, 15%, 84%)   borders
 * Text primary:    hsl(18, 20%, 10%)   L=10 near-black warm
 * Text muted:      hsl(18, 12%, 42%)   L=42
 * Text faint:      hsl(18,  8%, 58%)   L=58
 * Brand:           hsl(18, 65%, 42%)   L=42 terracotta
 * Accent:          hsl(18, 70%, 58%)   L=58 coral
 * Footer bg:       hsl(18, 20%, 10%)   L=10 dark warm
 */

// ─── FONTS ──────────────────────────────────────────────────────────
const FONT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
`

// ─── COLORS ──────────────────────────────────────────────────────────
const C = {
  bg:          'hsl(18, 12%, 94%)',
  white:       '#ffffff',
  border:      'hsl(18, 15%, 84%)',
  text:        'hsl(18, 20%, 10%)',
  muted:       'hsl(18, 12%, 42%)',
  faint:       'hsl(18,  8%, 58%)',
  brand:       'hsl(18, 65%, 42%)',
  accent:      'hsl(18, 70%, 58%)',
  footerBg:    'hsl(18, 20%, 10%)',
  footerText:  'hsl(18, 10%, 84%)',
  footerMuted: 'hsl(18,  8%, 58%)',
}

// ─── TYPE FAMILIES ───────────────────────────────────────────────────
const serif = "'Playfair Display', Georgia, serif"
const sans  = "system-ui, -apple-system, sans-serif"
const mono  = "'JetBrains Mono', monospace"

// ─── CONTENT DATA ────────────────────────────────────────────────────
const sidebarArticles = [
  {
    category: 'Culture',
    headline: "Inside Oaxaca's Culinary Renaissance: Where Ancient Technique Meets Radical Experiment",
    excerpt: "A new generation of chefs is reinterpreting pre-colonial Zapotec ingredients for the international table — without losing the soul.",
    byline: 'By Lucia Ferreira · 8 min read',
  },
  {
    category: 'Hotels',
    headline: "The Rise of the Anti-Resort: Why Travellers Are Choosing Farms Over Five Stars",
    excerpt: "In Burgundy, Umbria, and the Alentejo, a quiet revolution in accommodation is rewarding guests who value harvests over swimming pools.",
    byline: 'By James Whitfield · 6 min read',
  },
  {
    category: 'Travel News',
    headline: "New Direct Routes Open Access to Bhutan's Hidden Valleys for the First Time",
    excerpt: "Drukair announces four new routes from Asian hubs, ending decades of isolation for the kingdom's eastern districts.",
    byline: 'By Roam Staff',
  },
]

const destinations = [
  {
    country:  'Greece',
    title:    'Santorini Beyond the Postcard',
    desc:     "Leave the cruise ships behind and discover the island's quieter south: wild beaches, barrel-vaulted cave houses, and the best sunsets nobody photographs.",
    bestTime: 'Best: May–June, Sept–Oct',
    image:    'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=415&h=241&fit=crop',
  },
  {
    country:  'Japan',
    title:    'Kyoto in Autumn: The Unofficial Guide',
    desc:     "Skip the famous temples at peak foliage. The moss gardens of Saihō-ji, the philosopher's path at dawn, the covered markets of Nishiki — all yours.",
    bestTime: 'Best: Late October–November',
    image:    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=415&h=241&fit=crop',
  },
  {
    country:  'Chile',
    title:    'Torres del Paine: The Long Way Round',
    desc:     'The W-trek is famous. The O-circuit is extraordinary. Seven days in the southern Andes with condors overhead and granite towers changing colour by the hour.',
    bestTime: 'Best: November–March',
    image:    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=415&h=241&fit=crop',
  },
]

const footerCols = [
  {
    head:  'Destinations',
    links: ['Europe', 'Asia Pacific', 'The Americas', 'Africa & Middle East', 'Oceania'],
  },
  {
    head:  'Magazine',
    links: ['Current Issue', 'Archive', 'Subscribe', 'Gift Subscriptions', 'Digital Edition'],
  },
  {
    head:  'Guides',
    links: ['City Guides', 'Hotel Reviews', 'Restaurant Directory', 'Flight Tracker', 'Visa Info'],
  },
  {
    head:  'About',
    links: ['Our Story', 'Contributors', 'Advertising', 'Careers', 'Contact Us'],
  },
]

// ─── COMPONENT ───────────────────────────────────────────────────────
export default function RoamPage() {
  return (
    <div style={s.page}>
      <style>{FONT_CSS}</style>

      {/* Top bar — 40px */}
      <div style={s.topBar}>
        <div style={s.topBarInner}>
          <Link to="/" style={s.backLink}>← FIBO</Link>
          <span style={s.topBarMeta}>Issue 14 · April 2026 · Travel &amp; Exploration</span>
          <span style={s.topBarDate}>Wednesday, 9 April 2026</span>
        </div>
      </div>

      {/* Masthead — 64px */}
      <div style={s.masthead}>
        <div style={s.mastheadInner}>
          <span style={s.mastheadSub}>Travel · Culture · Discovery</span>
          <span style={s.mastName}>ROAM</span>
          <span style={s.mastheadSub}>roammagazine.com</span>
        </div>
      </div>

      {/* Category nav — 48px */}
      <div style={s.catNav}>
        <div style={s.catNavInner}>
          {['Destinations', 'Culture', 'Adventure', 'Food & Drink', 'Hotels', 'Travel News', 'Guides'].map(cat => (
            <span key={cat} style={s.catLink}>{cat}</span>
          ))}
        </div>
      </div>

      {/* Hero — 1294×543px */}
      <div style={s.heroSection}>
        <div style={s.heroWrap}>
          <div style={s.hero}>
            <img
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1294&h=543&fit=crop"
              alt="Misty mountain valley at dawn"
              style={s.heroImg}
            />
            <div style={s.heroOverlay} />
            <div style={s.heroContent}>
              <span style={s.heroTag}>Featured Destination</span>
              <h1 style={s.heroHeadline}>The Last Wild<br />Places on Earth</h1>
              <p style={s.heroSubhead}>From the fjords of Patagonia to the highlands of Papua New Guinea — a journey into the world's final frontiers of untouched wilderness</p>
              <span style={s.heroByline}>By Elena Vasquez · Photography by Kai Brennan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div style={s.contentWrap}>

        {/* Feature section: 864px main + 24px gap + 406px sidebar */}
        <section style={s.featureSection}>

          {/* Main article — 864px */}
          <div style={s.featureMain}>
            <div style={s.featureImgWrap}>
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=864&h=363&fit=crop"
                alt="Turquoise waters of a remote coastline"
                style={s.featureImg}
              />
            </div>
            <span style={s.catTag}>Adventure</span>
            <h2 style={s.featureHeadline}>Sailing the Turquoise Coast: A 21-Day Passage from Bodrum to Antalya</h2>
            <p style={s.featureExcerpt}>The Aegean reveals itself slowly. It takes three sunsets at anchor in a sea cave, two nights becalmed between islands, and one morning where the only sound is water against hull before the pace of it finally loosens your shoulders. We chartered a 42-foot ketch from Bodrum's old harbour and pointed her south into the blue haze.</p>
            <div style={s.featureMetaRow}>
              <span style={s.byline}>By Marcus Oduya</span>
              <span style={s.dot}> · </span>
              <span style={s.byline}>12 min read</span>
              <span style={s.dot}> · </span>
              <span style={s.timestamp}>April 7, 2026</span>
            </div>
          </div>

          {/* Sidebar — 406px */}
          <div style={s.featureSidebar}>
            <div style={s.sidebarHeader}>Also This Issue</div>
            {sidebarArticles.map((a, i) => (
              <div
                key={i}
                style={{ ...s.sidebarItem, borderTop: i > 0 ? `1px solid ${C.border}` : 'none' }}
              >
                <span style={s.catTag}>{a.category}</span>
                <h3 style={s.sidebarHeadline}>{a.headline}</h3>
                <p style={s.sidebarExcerpt}>{a.excerpt}</p>
                <span style={s.byline}>{a.byline}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={s.divider} />

        {/* Destinations grid — 3 × 415px */}
        <section style={s.destSection}>
          <div style={s.sectionHeaderRow}>
            <span style={s.sectionLabel}>Where to Go</span>
            <span style={s.sectionSub}>Our editors' picks for April 2026</span>
          </div>
          <div style={s.destGrid}>
            {destinations.map((d, i) => (
              <div key={i} style={s.destCard}>
                <div style={s.destImgWrap}>
                  <img src={d.image} alt={d.title} style={s.destImg} />
                  <span style={s.destCountry}>{d.country}</span>
                </div>
                <div style={s.destBody}>
                  <h3 style={s.destTitle}>{d.title}</h3>
                  <p style={s.destDesc}>{d.desc}</p>
                  <div style={s.destMeta}>
                    <span style={s.destWhen}>{d.bestTime}</span>
                    <span style={s.destRead}>Read guide →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={s.divider} />

        {/* Editor's note — centered 543px column */}
        <section style={s.editorSection}>
          <div style={s.editorInner}>
            <span style={s.editorLabel}>From the Editor</span>
            <blockquote style={s.editorQuote}>
              "Travel is not an escape from life — it is life, compressed and clarified. In these pages, we try to honour that."
            </blockquote>
            <div style={s.editorSig}>
              <span style={s.editorName}>Amara Singh</span>
              <span style={s.editorTitle}>Editor-in-Chief, Roam</span>
            </div>
          </div>
        </section>

      </div>{/* /contentWrap */}

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerGrid}>
            {footerCols.map((col, i) => (
              <div key={i}>
                <div style={s.footerColHead}>{col.head}</div>
                {col.links.map(l => (
                  <div key={l} style={s.footerLink}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={s.footerBottom}>
            <span style={s.footerCopy}>© 2026 Roam Magazine. All rights reserved.</span>
            <span style={s.footerPowered}>Designed with FIBO</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── STYLES ──────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {

  page: {
    minHeight: '100vh',
    background: C.bg,
    fontFamily: sans,
    color: C.text,
  },

  /* ── Top bar — 40px ─────────────────────────────────────────── */
  topBar: {
    height: '40px',
    background: C.text,
    display: 'flex',
    alignItems: 'center',
  },
  topBarInner: {
    maxWidth: '1470px',
    width: '100%',
    margin: '0 auto',
    paddingLeft: '88px',
    paddingRight: '88px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backLink: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.footerMuted,
    textDecoration: 'none',
    letterSpacing: '0.05em',
    fontFamily: mono,
  },
  topBarMeta: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.footerMuted,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  topBarDate: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.footerMuted,
  },

  /* ── Masthead — 64px ────────────────────────────────────────── */
  masthead: {
    height: '64px',
    background: C.white,
    borderBottom: `1px solid ${C.border}`,
    display: 'flex',
    alignItems: 'center',
  },
  mastheadInner: {
    maxWidth: '1470px',
    width: '100%',
    margin: '0 auto',
    paddingLeft: '88px',
    paddingRight: '88px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mastheadSub: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.muted,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  mastName: {
    fontFamily: serif,
    fontSize: '34px',
    lineHeight: '40px',
    fontWeight: 700,
    color: C.text,
    letterSpacing: '0.2em',
  },

  /* ── Category nav — 48px ────────────────────────────────────── */
  catNav: {
    height: '48px',
    background: C.white,
    borderBottom: `1px solid ${C.border}`,
    display: 'flex',
    alignItems: 'center',
  },
  catNavInner: {
    maxWidth: '1470px',
    width: '100%',
    margin: '0 auto',
    paddingLeft: '88px',
    paddingRight: '88px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  catLink: {
    fontSize: '13px',
    lineHeight: '24px',
    color: C.muted,
    cursor: 'pointer',
    letterSpacing: '0.01em',
  },

  /* ── Hero — 1294×543px ──────────────────────────────────────── */
  heroSection: {
    background: C.white,
    paddingTop: '24px',
    paddingBottom: '24px',
  },
  heroWrap: {
    maxWidth: '1470px',
    width: '100%',
    margin: '0 auto',
    paddingLeft: '88px',
    paddingRight: '88px',
  },
  hero: {
    position: 'relative',
    width: '100%',          /* fills 1294px content area */
    height: '543px',        /* 1294 × 42% = 543px */
    overflow: 'hidden',
    borderRadius: '8px',
  },
  heroImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(10,5,2,0.84) 0%, rgba(10,5,2,0.42) 55%, rgba(10,5,2,0.06) 100%)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '48px',
  },
  heroTag: {
    display: 'block',
    fontSize: '10px',
    lineHeight: '16px',
    color: C.accent,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontWeight: 600,
    marginBottom: '16px',
  },
  heroHeadline: {
    fontFamily: serif,
    fontSize: '55px',
    lineHeight: '64px',
    fontWeight: 700,
    color: C.white,
    margin: '0 0 16px 0',
  },
  heroSubhead: {
    fontSize: '18px',
    lineHeight: '24px',
    color: 'rgba(255,255,255,0.84)',
    maxWidth: '616px',      /* canvas × 42% */
    margin: '0 0 16px 0',
  },
  heroByline: {
    display: 'block',
    fontSize: '11px',
    lineHeight: '16px',
    color: 'rgba(255,255,255,0.58)',
    letterSpacing: '0.05em',
  },

  /* ── Content wrap ───────────────────────────────────────────── */
  contentWrap: {
    maxWidth: '1470px',
    width: '100%',
    margin: '0 auto',
    paddingLeft: '88px',
    paddingRight: '88px',
  },

  /* ── Feature section ────────────────────────────────────────── */
  featureSection: {
    display: 'flex',
    gap: '24px',
    paddingTop: '96px',
    paddingBottom: '96px',
    alignItems: 'flex-start',
  },
  featureMain: {
    width: '864px',
    flexShrink: 0,
  },
  featureImgWrap: {
    width: '864px',
    height: '363px',        /* 864 × 42% = 363px */
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  featureImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  catTag: {
    display: 'inline-block',
    fontSize: '10px',
    lineHeight: '16px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: C.brand,
  },
  featureHeadline: {
    fontFamily: serif,
    fontSize: '34px',
    lineHeight: '40px',
    fontWeight: 700,
    color: C.text,
    margin: '12px 0 24px 0',
  },
  featureExcerpt: {
    fontSize: '16px',
    lineHeight: '24px',
    color: C.text,
    margin: '0 0 24px 0',
  },
  featureMetaRow: {
    display: 'flex',
    alignItems: 'center',
  },
  byline: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.muted,
  },
  dot: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.faint,
  },
  timestamp: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.faint,
  },

  featureSidebar: {
    width: '406px',
    flexShrink: 0,
  },
  sidebarHeader: {
    fontSize: '10px',
    lineHeight: '16px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: C.brand,
    paddingBottom: '16px',
    borderBottom: `2px solid ${C.brand}`,
  },
  sidebarItem: {
    paddingTop: '24px',
    paddingBottom: '24px',
  },
  sidebarHeadline: {
    fontFamily: serif,
    fontSize: '18px',
    lineHeight: '24px',
    fontWeight: 600,
    color: C.text,
    margin: '8px 0 8px 0',
  },
  sidebarExcerpt: {
    fontSize: '13px',
    lineHeight: '24px',
    color: C.muted,
    margin: '0 0 8px 0',
  },

  /* ── Divider ────────────────────────────────────────────────── */
  divider: {
    height: '1px',
    background: C.border,
  },

  /* ── Destinations grid — 3 × 415px ─────────────────────────── */
  destSection: {
    paddingTop: '96px',
    paddingBottom: '96px',
  },
  sectionHeaderRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '16px',
    marginBottom: '48px',
  },
  sectionLabel: {
    fontFamily: serif,
    fontSize: '34px',
    lineHeight: '40px',
    fontWeight: 700,
    color: C.text,
  },
  sectionSub: {
    fontSize: '13px',
    lineHeight: '24px',
    color: C.muted,
  },
  destGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  destCard: {
    background: C.white,
    borderRadius: '8px',
    overflow: 'hidden',
  },
  destImgWrap: {
    position: 'relative',
    height: '241px',        /* 415 × 58% = 241px */
    overflow: 'hidden',
  },
  destImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  destCountry: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    fontSize: '10px',
    lineHeight: '16px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: C.white,
    background: 'rgba(10,5,2,0.58)',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  destBody: {
    padding: '24px',
  },
  destTitle: {
    fontFamily: serif,
    fontSize: '21px',
    lineHeight: '32px',
    fontWeight: 700,
    color: C.text,
    margin: '0 0 8px 0',
  },
  destDesc: {
    fontSize: '13px',
    lineHeight: '24px',
    color: C.muted,
    margin: '0 0 16px 0',
  },
  destMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destWhen: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.faint,
  },
  destRead: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.brand,
    fontWeight: 700,
    cursor: 'pointer',
  },

  /* ── Editor's note — centered 543px ────────────────────────── */
  editorSection: {
    paddingTop: '96px',
    paddingBottom: '96px',
    display: 'flex',
    justifyContent: 'center',
  },
  editorInner: {
    width: '543px',         /* 1294 × 42% = 543px */
    textAlign: 'center',
  },
  editorLabel: {
    display: 'block',
    fontSize: '10px',
    lineHeight: '16px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: C.brand,
    marginBottom: '24px',
  },
  editorQuote: {
    fontFamily: serif,
    fontSize: '21px',
    lineHeight: '32px',
    fontStyle: 'italic',
    fontWeight: 400,
    color: C.text,
    margin: '0 0 32px 0',
  },
  editorSig: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  editorName: {
    fontFamily: serif,
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 600,
    color: C.text,
  },
  editorTitle: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.muted,
    letterSpacing: '0.05em',
  },

  /* ── Footer ─────────────────────────────────────────────────── */
  footer: {
    background: C.footerBg,
  },
  footerInner: {
    maxWidth: '1470px',
    width: '100%',
    margin: '0 auto',
    paddingLeft: '88px',
    paddingRight: '88px',
    paddingTop: '96px',
    paddingBottom: '48px',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '96px',
  },
  footerColHead: {
    fontSize: '11px',
    lineHeight: '16px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: C.footerText,
    marginBottom: '16px',
  },
  footerLink: {
    fontSize: '13px',
    lineHeight: '24px',
    color: C.footerMuted,
    marginBottom: '8px',
    cursor: 'pointer',
  },
  footerBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255,255,255,0.10)',
  },
  footerCopy: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.footerMuted,
  },
  footerPowered: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.footerMuted,
    fontFamily: mono,
    letterSpacing: '0.05em',
  },
}
