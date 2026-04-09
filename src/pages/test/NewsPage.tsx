import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/*
 * FIBO NEWS — CNN-style homepage
 * Canvas: 1470×956 (MacBook Air M4)
 *
 * ─── CANVAS & LAYOUT ─────────────────────────────────────────────
 * Margin:         1470 × 6% = 88.2 → 88px
 * Content area:   1470 − (2×88) = 1294px
 *
 * Two-column content grid (gutter mechanic: subtract first)
 *   Post-gutter:  1294 − 24 = 1270px
 *   Main (F4+F5): 1270 × 68% = 863.6 → 864px
 *   Sidebar:      1270 × 32% = 406.4 → 406px
 *   Check:        864 + 24 + 406 = 1294 ✓
 *
 * 3-column secondary stories (equal-width repeating)
 *   Post-gutter:  1294 − (2×24) = 1246px
 *   Each card:    1246 ÷ 3 = 415.3 → 415px
 *   Card image h: 415 × 42% = 174.3 → 174px   (media: 42% landscape)
 *
 * Hero image (Outside-In, Signal 5: adaptive)
 *   Width:  1294px (full content area)
 *   Height: 1294 × 42% = 543.5 → 543px
 *
 * Article list thumbnail (F4 of main col, Outside-In)
 *   Width:  864 × 26% = 224.6 → 225px
 *   Height: 225 × 42% = 94.5 → 95px
 *
 * Opinion columns (3-equal, same as secondary stories)
 *   Each: 415px
 *
 * Footer columns (4-equal)
 *   Post-gutter: 1294 − (3×24) = 1222px
 *   Each col:    1222 ÷ 4 = 305.5 → 306px
 *
 * ─── COMPONENT HEIGHTS (Inside-Out, Signal 5) ────────────────────
 * Top bar:        13px / 24px lh + 8px v-pad × 2   = 40px ✓
 * Categories nav: 13px / 24px lh + 12px v-pad × 2  = 48px ✓
 * Category tag:   10px / 16px lh + 8px v-pad × 2   = 32px ✓
 * Author photo:   48px × 48px (consistent, Signal 1 after first use)
 * Copyright bar:  11px / 16px lh + 16px v-pad × 2  = 48px ✓
 *
 * ─── TYPOGRAPHY ──────────────────────────────────────────────────
 * Site name:              21px / 32px lh
 * Nav categories:         13px / 24px lh
 * Hero headline:          34px / 40px lh
 * Hero excerpt:           16px / 24px lh
 * Secondary headline:     18px / 24px lh   (alt lh from values.md)
 * Article list headline:  18px / 24px lh
 * Body / excerpt:         13px / 24px lh
 * Byline / timestamp:     11px / 16px lh
 * Category tag:           10px / 16px lh
 * Section header:         11px / 16px lh
 * Trending number (deco):  34px / 40px lh
 * Footer heading:         11px / 16px lh
 * Footer links:           13px / 24px lh
 *
 * ─── PADDING (FIBO of parent width) ─────────────────────────────
 * Card padding:   F1 of card width (6%)
 *   415px card → 415 × 6% = 24.9 → 24px
 *   406px sidebar → 406 × 6% = 24.4 → 24px   (same — consistent ✓)
 * Section v-pad:  96px top + bottom (12×8, major section gap)
 *
 * ─── COLORS (outside FIBO scope — design intent) ─────────────────
 * Header bg: #0A0E1A (dark navy — authoritative)
 * Accent:    #C8102E (news red)
 * Body text: #1A1A1A
 * Muted:     #666666
 */

// ─── COLORS ────────────────────────────────────────────────────────
const C = {
  headerBg:   '#0A0E1A',
  headerText: '#FFFFFF',
  headerMuted:'rgba(255,255,255,0.6)',
  accent:     '#C8102E',
  accentBg:   '#FFF0F0',
  bg:         '#FFFFFF',
  surface:    '#F8F8F8',
  border:     '#E8E8E8',
  text:       '#1A1A1A',
  muted:      '#666666',
  faint:      '#999999',
  sidebarBg:  '#F4F4F4',
  opinionBg:  '#0A0E1A',
  footerBg:   '#111827',
  footerText: '#E5E7EB',
  footerMuted:'#9CA3AF',
}

const CAT_COLORS: Record<string, string> = {
  World:      '#1565C0',
  Politics:   '#C8102E',
  Business:   '#2E7D32',
  Tech:       '#6A1B9A',
  Science:    '#00838F',
  Health:     '#E65100',
  Opinion:    '#5D4037',
}

// ─── CONTENT DATA ──────────────────────────────────────────────────

const heroSlides = [
  {
    category: 'World',
    headline: 'EU and China Strike Landmark Carbon Trade Agreement in Brussels Summit',
    excerpt: 'After three years of negotiations, European and Chinese officials have signed a historic deal linking their carbon markets. The agreement marks the first major cross-continental carbon trading framework and could reshape climate policy worldwide.',
    author: 'Elena Marchetti',
    role: 'Senior Correspondent, Brussels',
    timestamp: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1294&h=543&fit=crop',
  },
  {
    category: 'Politics',
    headline: 'Senate Fractures Over Proposed AI Regulation Bill as Tech Lobby Intensifies',
    excerpt: 'A bipartisan proposal to establish federal oversight of artificial intelligence systems has encountered fierce resistance, with key committees deadlocked over provisions restricting training data access.',
    author: 'David Okafor',
    role: 'Washington Correspondent',
    timestamp: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1294&h=543&fit=crop',
  },
  {
    category: 'Science',
    headline: 'Scientists Detect Unusual Seismic Signals Beneath Antarctic Ice Sheet',
    excerpt: 'Geophysicists monitoring the Ross Ice Shelf have recorded a series of tremors inconsistent with known glacial dynamics, raising questions about subglacial volcanic activity beneath one of the world\'s most remote regions.',
    author: 'Dr. Yuna Takahashi',
    role: 'Science Editor',
    timestamp: '3 hours ago',
    image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1294&h=543&fit=crop',
  },
  {
    category: 'Tech',
    headline: 'OpenMind Unveils Autonomous Research Agent Capable of Running Multi-Year Experiments',
    excerpt: 'The San Francisco–based AI lab has demonstrated a fully autonomous system that can design, execute and interpret complex scientific studies without any human intervention during the research cycle.',
    author: 'Marcus Trent',
    role: 'Technology Correspondent',
    timestamp: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1294&h=543&fit=crop',
  },
]

const secondaryStories = [
  {
    category: 'Politics',
    headline: 'Senate Fractures Over Proposed AI Regulation Bill as Tech Lobby Intensifies',
    excerpt: 'A bipartisan proposal to establish federal oversight of artificial intelligence systems has encountered fierce resistance, with key committees deadlocked over provisions restricting training data access.',
    author: 'David Okafor',
    timestamp: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=415&h=174&fit=crop',
  },
  {
    category: 'Business',
    headline: 'Federal Reserve Signals Pause in Rate Cuts as Inflation Edges Higher',
    excerpt: 'The Fed will hold rates steady through the third quarter following unexpectedly strong consumer spending data, the chair announced Thursday, signalling a cautious approach to monetary easing.',
    author: 'Sarah Chen',
    timestamp: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=415&h=174&fit=crop',
  },
  {
    category: 'Tech',
    headline: 'OpenMind Unveils Autonomous Research Agent Capable of Running Multi-Year Experiments',
    excerpt: 'The San Francisco–based AI lab has demonstrated a fully autonomous system that can design, execute and interpret complex scientific studies without any human intervention during the research cycle.',
    author: 'Marcus Trent',
    timestamp: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=415&h=174&fit=crop',
  },
]

const articles = [
  {
    id: 1,
    category: 'Science',
    headline: 'Scientists Detect Unusual Seismic Signals Beneath Antarctic Ice Sheet',
    excerpt: 'Geophysicists monitoring the Ross Ice Shelf have recorded a series of tremors inconsistent with known glacial dynamics, raising questions about subglacial volcanic activity.',
    timestamp: '3 hours ago',
    image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=225&h=95&fit=crop',
  },
  {
    id: 2,
    category: 'Health',
    headline: 'New Study Links Long-Term Microplastic Exposure to Cardiovascular Disease in Under-40s',
    excerpt: 'A 12-year longitudinal study tracking 48,000 participants has found a statistically significant correlation between blood microplastic concentration and early-onset arterial inflammation.',
    timestamp: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=225&h=95&fit=crop',
  },
  {
    id: 3,
    category: 'Business',
    headline: 'OPEC+ Cuts Production as Gulf States Pivot Toward Renewable Export Strategy',
    excerpt: 'Saudi Arabia and the UAE announced coordinated reductions in crude output, citing a long-term strategic shift toward hydrogen and solar exports as global demand projections narrow.',
    timestamp: '7 hours ago',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=225&h=95&fit=crop',
  },
  {
    id: 4,
    category: 'World',
    headline: 'India Surpasses China as World\'s Largest Steel Producer for Third Consecutive Quarter',
    excerpt: 'India\'s steel output reached 38 million tonnes in Q2, outpacing China for the third straight quarter as infrastructure spending accelerates and Chinese domestic demand softens.',
    timestamp: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=225&h=95&fit=crop',
  },
  {
    id: 5,
    category: 'Politics',
    headline: 'Presidential Commission Releases 600-Page Report on Electoral System Vulnerabilities',
    excerpt: 'The bipartisan report, three years in the making, identifies critical gaps in voter registration infrastructure, ballot chain-of-custody protocols, and foreign interference detection.',
    timestamp: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=225&h=95&fit=crop',
  },
]

const tickerItems = [
  'Breaking: EU and China Sign Historic Carbon Trade Agreement in Brussels',
  'Senate AI Regulation Bill Advances to Committee Vote After Bipartisan Amendment',
  'Antarctic Ice Sheet Anomaly: Scientists Detect Unusual Seismic Pattern Beneath Glacier',
  'Federal Reserve Holds Rates Steady — Chair Signals Cautious Approach Through Year-End',
  'India Surpasses China as World\'s Largest Steel Producer for Third Consecutive Quarter',
  'OpenMind Autonomous Agent Passes Independent Peer Review — Study Published in Nature',
]
const tickerText = tickerItems.join('     ·     ')
const TICKER_CSS = `
@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes heroFade { from { opacity: 0; } to { opacity: 1; } }
`

const trending = [
  'EU-China Carbon Deal Could Unlock $400 Billion in Climate Finance',
  'Senate AI Bill Threatens to Split Both Parties Along Tech Lines',
  'Antarctic Ice Sheet Signals Puzzle Climate Scientists Worldwide',
  'Fed\'s Pause Decision Sends Conflicting Signals to Markets',
  'OpenMind\'s Autonomous Agent Passes Independent Peer Review',
]

const videos = [
  {
    title: 'Carbon Markets Explained: Why This Deal Is Different',
    duration: '4:32',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=200&h=112&fit=crop',
  },
  {
    title: 'Inside the Antarctic Research Station Detecting the Tremors',
    duration: '6:17',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=200&h=112&fit=crop',
  },
]

const opinions = [
  {
    author: 'Dr. Priya Sharma',
    role: 'Senior Fellow, Climate Policy Institute',
    title: 'The Carbon Deal We\'ve Been Waiting For — And Why It May Not Be Enough',
    excerpt: 'The EU-China framework is historic. But without binding enforcement mechanisms and a credible baseline methodology, it risks becoming another declaration with elegant architecture and hollow teeth.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face',
  },
  {
    author: 'James Whitfield',
    role: 'Former NSA Analyst, Technology Commentator',
    title: 'America\'s AI Governance Vacuum Is Now a National Security Issue',
    excerpt: 'While Congress argues about training data restrictions, China is deploying AI systems in defence contexts at a pace that should alarm anyone paying attention. The Senate deadlock isn\'t just a political failure.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face',
  },
  {
    author: 'Lena Goldberg',
    role: 'Chief Economist, Meridian Analytics',
    title: 'The Fed Is Playing a Dangerous Game With Inflation Psychology',
    excerpt: 'Pausing cuts while headline inflation ticks up even modestly risks anchoring inflation expectations in a way that forces far more aggressive action later. The cost of caution may be higher than it appears.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face',
  },
]

const footerSections = [
  {
    heading: 'News',
    links: ['World', 'Politics', 'Business', 'Technology', 'Science', 'Health', 'Entertainment'],
  },
  {
    heading: 'Opinion',
    links: ['Columnists', 'Letters', 'Analysis', 'Editorials'],
  },
  {
    heading: 'Company',
    links: ['About Us', 'Careers', 'Press Room', 'Advertise', 'Contact'],
  },
  {
    heading: 'Follow',
    links: ['X / Twitter', 'Instagram', 'Facebook', 'LinkedIn', 'Newsletters', 'Podcasts'],
  },
]

// ─── FIBO VALUES PANEL ─────────────────────────────────────────────
/*
 * Floating toggle shows all FIBO-derived values used on this page.
 * Position: fixed bottom-right — Inside-Out from content.
 * Button height: 40px (13px / 24lh + 8px v-pad × 2 = 40px ✓)
 */
function FiboPanel({ onClose }: { onClose: () => void }) {
  const entries = [
    { label: 'Canvas',              value: '1470 × 956px' },
    { label: 'Margin',              value: '88px  (6% of 1470)' },
    { label: 'Content area',        value: '1294px' },
    { label: '─ F1 (6%)',           value: '78px' },
    { label: '─ F2 (10%)',          value: '129px' },
    { label: '─ F3 (16%)',          value: '207px' },
    { label: '─ F4 (26%)',          value: '336px' },
    { label: '─ F5 (42%)',          value: '543px' },
    { label: '─────',               value: '' },
    { label: 'Gutter',              value: '24px  (3×8)' },
    { label: 'Post-gutter (2-col)', value: '1270px' },
    { label: 'Main column',         value: '864px  (F4+F5 of 1270)' },
    { label: 'Sidebar',             value: '406px  (F1+F2+F3 of 1270)' },
    { label: '─────',               value: '' },
    { label: 'Secondary card',      value: '415px  ((1294−48)÷3)' },
    { label: 'Card image height',   value: '174px  (415 × 42%)' },
    { label: 'Hero image height',   value: '543px  (1294 × 42%)' },
    { label: 'Article thumb w',     value: '225px  (864 × 26%)' },
    { label: 'Article thumb h',     value: '95px   (225 × 42%)' },
    { label: 'Footer col',          value: '306px  ((1294−72)÷4)' },
    { label: '─────',               value: '' },
    { label: 'Top bar height',      value: '40px   (24lh + 8+8 pad)' },
    { label: 'Nav height',          value: '48px   (24lh + 12+12 pad)' },
    { label: 'Category tag h',      value: '32px   (16lh + 8+8 pad)' },
    { label: 'Author photo',        value: '48×48px' },
    { label: 'Copyright bar',       value: '48px   (16lh + 16+16 pad)' },
    { label: '─────',               value: '' },
    { label: 'Hero headline',       value: '34px / 40px lh' },
    { label: 'Hero excerpt',        value: '16px / 24px lh' },
    { label: 'Story headline',      value: '18px / 24px lh' },
    { label: 'Body / excerpt',      value: '13px / 24px lh' },
    { label: 'Byline / timestamp',  value: '11px / 16px lh' },
    { label: 'Category tag',        value: '10px / 16px lh' },
    { label: 'Card padding',        value: '24px   (F1 of 415, 6%)' },
    { label: 'Section v-pad',       value: '96px   (12×8)' },
  ]

  return (
    <div style={panelStyles.overlay}>
      <div style={panelStyles.panel}>
        <div style={panelStyles.panelHeader}>
          <span style={panelStyles.panelTitle}>FIBO Values</span>
          <button onClick={onClose} style={panelStyles.closeBtn}>✕</button>
        </div>
        <div style={panelStyles.panelBody}>
          {entries.map((e, i) => (
            e.label === '─────'
              ? <div key={i} style={panelStyles.divider} />
              : (
                <div key={i} style={panelStyles.row}>
                  <span style={panelStyles.rowLabel}>{e.label}</span>
                  <span style={panelStyles.rowValue}>{e.value}</span>
                </div>
              )
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────
export default function NewsPage() {
  const [showFibo, setShowFibo] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % heroSlides.length), 3000)
    return () => clearInterval(t)
  }, [])

  const hero = heroSlides[heroIndex]

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>

      {/* ── HEADER ───────────────────────────────────────────────── */}
      {/* Top bar — 40px (Inside-Out: 13px/24lh + 8px v-pad × 2) */}
      <div style={s.topBar}>
        <div style={s.topBarInner}>
          <div style={s.topBarLeft}>
            <Link to="/" style={s.backLink}>← FIBO</Link>
            <span style={s.topBarSep} />
            <span style={s.topBarDate}>Sunday, April 6, 2026</span>
          </div>
          <span style={s.siteName}>FIBO News</span>
          <div style={s.topBarRight}>
<span style={s.searchIcon}>⌕</span>
          </div>
        </div>
      </div>

      {/* Categories nav — 48px (Inside-Out: 13px/24lh + 12px v-pad × 2) */}
      <nav style={s.catNav}>
        <div style={s.catNavInner}>
          {['World', 'Politics', 'Business', 'Technology', 'Science', 'Health', 'Entertainment'].map(cat => (
            <a key={cat} href="#" style={s.catLink} onClick={e => e.preventDefault()}>{cat}</a>
          ))}
        </div>
      </nav>

      {/* ── TICKER ───────────────────────────────────────────────── */}
      <style>{TICKER_CSS}</style>
      <div style={s.tickerBar}>
        <span style={s.tickerLabel}>BREAKING</span>
        <div style={s.tickerTrack}>
          <span style={{ whiteSpace: 'nowrap', animation: 'ticker 40s linear infinite' }}>
            {tickerText + '     ·     ' + tickerText}
          </span>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      {/* Width: 1294px (full content area). Height: 1294×42% = 543px */}
      <section style={s.heroSection}>
        <div style={s.heroWrap}>
          <div style={s.heroImg}>
            <img
              key={heroIndex}
              src={hero.image}
              alt={hero.headline}
              style={{ ...s.heroImgEl, animation: 'heroFade 0.6s ease' }}
            />
            <div style={s.heroGradient} />
            <div style={s.heroText}>
              {/* Category tag — 32px height (10px/16lh + 8px v-pad × 2) */}
              <span style={{ ...s.catTag, background: CAT_COLORS[hero.category] }}>
                {hero.category}
              </span>
              {/* Hero headline — 34px / 40px lh */}
              <h1 key={`headline-${heroIndex}`} style={{ ...s.heroHeadline, animation: 'heroFade 0.6s ease' }}>{hero.headline}</h1>
              {/* Hero excerpt — 16px / 24px lh */}
              <p style={s.heroExcerpt}>{hero.excerpt}</p>
              {/* Byline — 11px / 16px lh */}
              <div style={s.heroByline}>
                <span>By {hero.author}</span>
                <span style={s.heroDivider}>·</span>
                <span>{hero.role}</span>
                <span style={s.heroDivider}>·</span>
                <span>{hero.timestamp}</span>
              </div>
              {/* Slide dots */}
              <div style={s.heroDots}>
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    style={{ ...s.heroDot, ...(i === heroIndex ? s.heroDotActive : {}) }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECONDARY STORIES ────────────────────────────────────── */}
      {/* 3 equal cards: (1294−48)÷3 = 415px each. Image: 415×42% = 174px */}
      <section style={s.secondarySection}>
        <div style={s.contentArea}>
          <div style={s.secondaryGrid}>
            {secondaryStories.map((story, i) => (
              <article key={i} style={s.secondaryCard}>
                {/* Image — 415×174px (42% ratio) */}
                <div style={s.secondaryImgWrap}>
                  <img src={story.image} alt={story.headline} style={s.secondaryImg} />
                </div>
                <div style={s.secondaryBody}>
                  {/* Category tag — 32px height */}
                  <span style={{ ...s.catTagSmall, color: CAT_COLORS[story.category], borderColor: CAT_COLORS[story.category] }}>
                    {story.category}
                  </span>
                  {/* Headline — 18px / 24px lh */}
                  <h2 style={s.secondaryHeadline}>{story.headline}</h2>
                  {/* Excerpt — 13px / 24px lh */}
                  <p style={s.secondaryExcerpt}>{story.excerpt}</p>
                  {/* Byline — 11px / 16px lh */}
                  <div style={s.secondaryByline}>
                    <span>By {story.author}</span>
                    <span style={s.heroDivider}>·</span>
                    <span>{story.timestamp}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT GRID (main 864px + sidebar 406px) ───────────── */}
      <section style={s.gridSection}>
        <div style={s.contentArea}>
          <div style={s.contentGrid}>

            {/* MAIN COLUMN — 864px */}
            <div style={s.mainCol}>
              {/* Section header — 11px / 16px lh, uppercase */}
              <div style={s.sectionHeader}>
                <span style={s.sectionLabel}>Latest News</span>
                <div style={s.sectionLine} />
              </div>

              {/* Article list — thumbnail 225×95px (F4 of 864 = 225, 42% height) */}
              <div style={s.articleList}>
                {articles.map((article) => (
                  <article key={article.id} style={s.articleCard}>
                    <img
                      src={article.image}
                      alt={article.headline}
                      style={s.articleThumb}
                    />
                    <div style={s.articleBody}>
                      <span style={{ ...s.catTagSmall, color: CAT_COLORS[article.category], borderColor: CAT_COLORS[article.category] }}>
                        {article.category}
                      </span>
                      {/* Article headline — 18px / 24px lh */}
                      <h3 style={s.articleHeadline}>{article.headline}</h3>
                      {/* Excerpt — 13px / 24px lh */}
                      <p style={s.articleExcerpt}>{article.excerpt}</p>
                      {/* Timestamp — 11px / 16px lh */}
                      <span style={s.articleTimestamp}>{article.timestamp}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* SIDEBAR — 406px */}
            <aside style={s.sidebar}>

              {/* Trending Now */}
              <div style={s.sideWidget}>
                <div style={s.sectionHeader}>
                  <span style={s.sectionLabel}>Trending Now</span>
                  <div style={s.sectionLine} />
                </div>
                <ol style={s.trendingList}>
                  {trending.map((item, i) => (
                    <li key={i} style={s.trendingItem}>
                      {/* Trending number — 34px / 40px lh (decorative) */}
                      <span style={s.trendingNum}>{String(i + 1).padStart(2, '0')}</span>
                      {/* Headline — 13px / 24px lh */}
                      <span style={s.trendingText}>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Latest Videos */}
              <div style={s.sideWidget}>
                <div style={s.sectionHeader}>
                  <span style={s.sectionLabel}>Latest Videos</span>
                  <div style={s.sectionLine} />
                </div>
                <div style={s.videoList}>
                  {videos.map((v, i) => (
                    <div key={i} style={s.videoCard}>
                      <div style={s.videoThumbWrap}>
                        <img src={v.image} alt={v.title} style={s.videoThumb} />
                        <span style={s.videoDuration}>{v.duration}</span>
                        <div style={s.videoPlay}>▶</div>
                      </div>
                      {/* Video title — 13px / 24px lh */}
                      <p style={s.videoTitle}>{v.title}</p>
                    </div>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        </div>
      </section>

      {/* ── OPINION ──────────────────────────────────────────────── */}
      {/* 3 equal columns: (1294−48)÷3 = 415px each */}
      <section style={s.opinionSection}>
        <div style={s.contentArea}>
          <div style={s.sectionHeader}>
            <span style={{ ...s.sectionLabel, color: 'rgba(255,255,255,0.5)' }}>Opinion</span>
            <div style={{ ...s.sectionLine, background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <div style={s.opinionGrid}>
            {opinions.map((op, i) => (
              <article key={i} style={s.opinionCard}>
                {/* Author — 11px / 16px lh. Photo: 48×48px (Cesar Circles, Signal 1) */}
                <div style={s.opinionAuthorRow}>
                  <img src={op.image} alt={op.author} style={s.authorPhoto} />
                  <div style={s.authorMeta}>
                    <div style={s.authorName}>{op.author}</div>
                    <div style={s.authorRole}>{op.role}</div>
                  </div>
                </div>
                {/* Opinion title — 18px / 24px lh */}
                <h3 style={s.opinionTitle}>{op.title}</h3>
                {/* Excerpt — 13px / 24px lh */}
                <p style={s.opinionExcerpt}>{op.excerpt}</p>
                <a href="#" style={s.opinionReadMore} onClick={e => e.preventDefault()}>
                  Read more →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      {/* 4 equal columns: (1294−72)÷4 = 305.5 → 306px each */}
      <footer style={s.footer}>
        <div style={s.contentArea}>
          <div style={s.footerGrid}>
            {footerSections.map((section) => (
              <div key={section.heading} style={s.footerCol}>
                {/* Section heading — 11px / 16px lh */}
                <div style={s.footerHeading}>{section.heading}</div>
                <ul style={s.footerLinks}>
                  {section.links.map(link => (
                    <li key={link}>
                      {/* Footer link — 13px / 24px lh */}
                      <a href="#" style={s.footerLink} onClick={e => e.preventDefault()}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright bar — 48px (11px/16lh + 16px v-pad × 2 = 48px ✓) */}
        <div style={s.copyrightBar}>
          <div style={s.contentArea}>
            <div style={s.copyrightInner}>
              <span style={s.copyrightText}>© 2026 FIBO News Network. All rights reserved.</span>
              <div style={s.copyrightLinks}>
                {['Privacy Policy', 'Terms of Use', 'Cookie Settings', 'Accessibility'].map(l => (
                  <a key={l} href="#" style={s.copyrightLink} onClick={e => e.preventDefault()}>{l}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ── FIBO TOGGLE (fixed, bottom-right) ───────────────────── */}
      {/* Button height: 40px (13px/24lh + 8px v-pad × 2) */}
      <button
        onClick={() => setShowFibo(true)}
        style={s.fiboToggle}
        title="Show FIBO values"
      >
        FIBO Values
      </button>

      {showFibo && <FiboPanel onClose={() => setShowFibo(false)} />}

    </div>
  )
}

// ─── STYLES ────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {

  /* ── Header ── */
  topBar: {
    height: '40px',               /* Inside-Out: 24px lh + 8px + 8px = 40px ✓ */
    background: C.headerBg,
    display: 'flex',
    alignItems: 'center',
  },
  topBarInner: {
    width: '100%',                /* fill flex parent */
    maxWidth: '1470px',           /* cap at canvas width — padding 88px each side → 1294px ✓ */
    margin: '0 auto',
    padding: '0 88px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backLink: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    fontWeight: 600,
    color: C.headerMuted,
    textDecoration: 'none',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.08em',
    transition: 'color 0.15s',
  },
  topBarSep: {
    width: '1px',
    height: '16px',
    background: 'rgba(255,255,255,0.15)',
  },
  topBarDate: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    color: C.headerMuted,
  },
  siteName: {
    fontSize: '21px',             /* 21px / 32px lh — site name */
    lineHeight: '32px',
    fontWeight: 700,
    color: C.headerText,
    letterSpacing: '-0.01em',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  topBarItem: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    color: C.accentBg,
    background: C.accent,
    padding: '0 8px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: '18px',             /* 18px / 24px lh — icon, not body text */
    lineHeight: '24px',
    color: C.headerMuted,
    cursor: 'pointer',
  },
  catNav: {
    height: '48px',               /* Inside-Out: 24px lh + 12px + 12px = 48px ✓ */
    background: C.headerBg,
    borderBottom: `1px solid rgba(255,255,255,0.08)`,
    display: 'flex',
    alignItems: 'center',
  },
  catNavInner: {
    width: '100%',                /* fill flex parent */
    maxWidth: '1470px',           /* cap at canvas width — padding 88px each side → 1294px ✓ */
    margin: '0 auto',
    padding: '0 88px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  catLink: {
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    letterSpacing: '0.02em',
    transition: 'color 0.15s',
  },

  /* ── Hero ── */
  heroSection: {
    background: C.bg,
  },
  heroWrap: {
    maxWidth: '1470px',           /* canvas width — padding 88px each side → 1294px content ✓ */
    margin: '0 auto',
    padding: '32px 88px 0',       /* 32px top, 88px sides — collapsed shorthand, no conflict */
  },
  heroImg: {
    position: 'relative',
    width: '100%',
    height: '543px',              /* 1294 × 42% = 543px (landscape media ratio) */
    overflow: 'hidden',
    borderRadius: '8px',
  },
  heroImgEl: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  heroGradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
  },
  heroText: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '32px',              /* 32px — card internal padding (4×8) */
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',                  /* 16px between hero text elements (internal) */
  },
  heroHeadline: {
    fontSize: '34px',             /* 34px / 40px lh */
    lineHeight: '40px',
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: '-0.01em',
    maxWidth: '864px',            /* Main column width — constrains readability */
  },
  heroExcerpt: {
    fontSize: '16px',             /* 16px / 24px lh */
    lineHeight: '24px',
    color: 'rgba(255,255,255,0.85)',
    maxWidth: '543px',            /* F5 of content area (42%) — comfortable reading width */
  },
  heroByline: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',                   /* 8px — tight (belongs together) */
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    color: 'rgba(255,255,255,0.65)',
  },
  heroDivider: {
    color: 'rgba(255,255,255,0.3)',
  },

  /* Category tags */
  catTag: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '32px',               /* 32px — 16px lh + 8px + 8px = 32px ✓ */
    padding: '0 8px',
    fontSize: '10px',             /* 10px / 16px lh */
    lineHeight: '16px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  catTagSmall: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '24px',               /* Tighter: 10px/16lh + 4px + 4px = 24px. 4px is border-based spacing. ✓ */
    padding: '0 6px',
    fontSize: '10px',             /* 10px / 16px lh */
    lineHeight: '16px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: 'transparent',
    border: '1px solid',
    alignSelf: 'flex-start',
  },

  /* ── Secondary Stories ── */
  secondarySection: {
    paddingTop: '48px',           /* 48px — section gap (6×8) */
    paddingBottom: '48px',
    borderBottom: `1px solid ${C.border}`,
  },
  contentArea: {
    maxWidth: '1470px',           /* canvas width — padding 88px each side → 1294px content ✓ */
    margin: '0 auto',
    padding: '0 88px',
  },
  secondaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', /* 415px each: (1294−48)÷3 */
    gap: '24px',                           /* gutter */
  },
  secondaryCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    border: `1px solid ${C.border}`,
  },
  secondaryImgWrap: {
    width: '100%',
    height: '174px',              /* 415 × 42% = 174px (media ratio) */
    overflow: 'hidden',
    borderRadius: '8px 8px 0 0',
  },
  secondaryImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.3s',
  },
  secondaryBody: {
    padding: '24px',              /* 24px — F1 of 415px card (6% ≈ 24.9 → 24) */
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',                   /* 8px — tight internal (label, title, excerpt belong together) */
    flex: 1,
  },
  secondaryHeadline: {
    fontSize: '18px',             /* 18px / 24px lh (alt lh — denser news feel) */
    lineHeight: '24px',
    fontWeight: 600,
    color: C.text,
    letterSpacing: '-0.01em',
    marginTop: '8px',             /* 8px — between tag and headline */
  },
  secondaryExcerpt: {
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    color: C.muted,
    flex: 1,
  },
  secondaryByline: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    color: C.faint,
    marginTop: '8px',
  },

  /* ── Content Grid ── */
  gridSection: {
    paddingTop: '48px',
    paddingBottom: '96px',        /* 96px — major section end gap */
    borderBottom: `1px solid ${C.border}`,
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '864px 406px', /* main + sidebar, gutter via gap */
    gap: '24px',                         /* gutter */
    alignItems: 'start',
  },
  mainCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',         /* 24px — header to content (external > internal) */
  },
  sectionLabel: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: C.muted,
    whiteSpace: 'nowrap',
  },
  sectionLine: {
    flex: 1,
    height: '1px',
    background: C.border,
  },
  articleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  articleCard: {
    display: 'grid',
    gridTemplateColumns: '225px 1fr', /* thumbnail F4 of 864 = 225px, gap via column-gap */
    columnGap: '24px',               /* gutter between thumb and text */
    padding: '24px 0',               /* 24px v-pad */
    borderBottom: `1px solid ${C.border}`,
    alignItems: 'start',
  },
  articleThumb: {
    width: '225px',
    height: '95px',               /* 225 × 42% = 94.5 → 95px */
    objectFit: 'cover',
    display: 'block',
    borderRadius: '8px',
  },
  articleBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  articleHeadline: {
    fontSize: '18px',             /* 18px / 24px lh */
    lineHeight: '24px',
    fontWeight: 600,
    color: C.text,
    letterSpacing: '-0.01em',
  },
  articleExcerpt: {
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    color: C.muted,
  },
  articleTimestamp: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    color: C.faint,
  },

  /* ── Sidebar ── */
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',                  /* 48px — between sidebar widgets */
  },
  sideWidget: {
    display: 'flex',
    flexDirection: 'column',
  },
  trendingList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    padding: 0,
    margin: 0,
  },
  trendingItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px 0',            /* 16px v-pad (internal to list) */
    borderBottom: `1px solid ${C.border}`,
  },
  trendingNum: {
    fontSize: '34px',             /* 34px / 40px lh — large decorative numeral */
    lineHeight: '40px',
    fontWeight: 700,
    color: C.accent,
    fontFamily: "'JetBrains Mono', monospace",
    flexShrink: 0,
    width: '48px',                /* Fixed width for numeral column */
  },
  trendingText: {
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    color: C.text,
    fontWeight: 500,
    paddingTop: '8px',            /* optical: align to numeral cap-height */
  },

  videoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',                  /* 16px — between video items */
  },
  videoCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  videoThumbWrap: {
    position: 'relative',
    width: '100%',
    /* Sidebar 406px. Video thumbs: full width of sidebar.
     * Height: 406px × 42% = 170.5 → 171px. Using ~56% for video (16:9 aspect): 406 × 56% = 227px. Too tall.
     * Signal: media height = FIBO ratio of width. Use 42%: 406×42% = 170.5 → 171px. Rounded to 172 (×8 near). No — 171 is fine (image, not component).
     */
    height: '171px',
    overflow: 'hidden',
    borderRadius: '8px',
  },
  videoThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  videoDuration: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    fontSize: '10px',             /* 10px / 16px lh */
    lineHeight: '16px',
    fontWeight: 600,
    background: 'rgba(0,0,0,0.8)',
    color: '#FFFFFF',
    padding: '0 6px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  videoPlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '48px',               /* 48px circle — Signal 1 (consistent after author photo) */
    height: '48px',
    background: 'rgba(0,0,0,0.6)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',             /* 16px / 24px lh */
    lineHeight: '24px',
    color: '#FFFFFF',
    cursor: 'pointer',
  },
  videoTitle: {
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    color: C.text,
    fontWeight: 500,
    margin: 0,
  },

  /* ── Opinion ── */
  opinionSection: {
    background: C.opinionBg,
    paddingTop: '96px',           /* 96px — major section top gap */
    paddingBottom: '96px',
  },
  opinionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', /* 415px each */
    gap: '24px',
    marginTop: '24px',
  },
  opinionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',                  /* 16px — internal opinion card spacing */
    padding: '32px',              /* 32px — card internal padding (4×8) */
    border: '1px solid rgba(255,255,255,0.08)',
  },
  opinionAuthorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  authorPhoto: {
    width: '48px',                /* 48px × 48px (Cesar Circles, Signal 5 consistent) */
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  authorMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  authorName: {
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    fontWeight: 600,
    color: '#FFFFFF',
  },
  authorRole: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    color: 'rgba(255,255,255,0.45)',
  },
  opinionTitle: {
    fontSize: '18px',             /* 18px / 24px lh */
    lineHeight: '24px',
    fontWeight: 600,
    color: '#FFFFFF',
    letterSpacing: '-0.01em',
    margin: 0,
  },
  opinionExcerpt: {
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    color: 'rgba(255,255,255,0.55)',
    flex: 1,
    margin: 0,
  },
  opinionReadMore: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    fontWeight: 600,
    color: C.accent,
    textDecoration: 'none',
    marginTop: '8px',
  },

  /* ── Footer ── */
  footer: {
    background: C.footerBg,
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', /* 306px each: (1294−72)÷4 */
    gap: '24px',
    paddingTop: '64px',           /* 64px — generous top gap (8×8) */
    paddingBottom: '64px',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  footerHeading: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: C.footerText,
  },
  footerLinks: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',                   /* 8px — tight internal list */
  },
  footerLink: {
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    color: C.footerMuted,
    textDecoration: 'none',
  },

  /* Copyright bar — 48px (11px/16lh + 16px + 16px = 48px ✓) */
  copyrightBar: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  copyrightInner: {
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyrightText: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    color: C.footerMuted,
  },
  copyrightLinks: {
    display: 'flex',
    gap: '24px',
  },
  copyrightLink: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    color: C.footerMuted,
    textDecoration: 'none',
  },

  /* FIBO toggle — fixed bottom-right */
  fiboToggle: {
    position: 'fixed',
    bottom: '24px',               /* 24px — 3×8 */
    right: '24px',
    height: '40px',               /* Inside-Out: 13px/24lh + 8px + 8px = 40px ✓ */
    padding: '0 16px',
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
    background: '#1400FF',
    color: '#FFFFFF',
    border: 'none',
    cursor: 'pointer',
    zIndex: 500,
    letterSpacing: '0.05em',
  },

  /* ── Hero dots ── */
  heroDots: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  heroDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.4)',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  heroDotActive: {
    background: '#FFFFFF',
    width: '24px',
    borderRadius: '4px',
  },

  /* ── Ticker ── */
  tickerBar: {
    height: '40px',               /* Inside-Out: 13px/24lh + 8px×2 = 40px */
    background: C.accent,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tickerLabel: {
    flexShrink: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    background: 'rgba(0,0,0,0.25)',
    fontSize: '10px',
    lineHeight: '16px',
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: '0.1em',
    fontFamily: "'JetBrains Mono', monospace",
  },
  tickerTrack: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '24px',
    fontSize: '13px',
    lineHeight: '24px',
    color: '#FFFFFF',
  },
}

/* FIBO Panel styles */
const panelStyles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 600,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: '24px',
  },
  panel: {
    width: '360px',
    maxHeight: '80vh',
    background: '#111111',
    border: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  panelHeader: {
    height: '48px',               /* Consistent: 48px (Signal 1) */
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    borderBottom: '1px solid #333',
    flexShrink: 0,
  },
  panelTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    lineHeight: '24px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#1400FF',
  },
  closeBtn: {
    width: '24px',
    height: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#888888',
    fontSize: '13px',
    lineHeight: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelBody: {
    overflowY: 'auto',
    padding: '8px 0',
  },
  divider: {
    height: '1px',
    background: '#222',
    margin: '8px 0',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '4px 16px',
    gap: '16px',
  },
  rowLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    lineHeight: '16px',
    color: '#888888',
    flexShrink: 0,
  },
  rowValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    lineHeight: '16px',
    color: '#CCCCCC',
    textAlign: 'right',
  },
}
