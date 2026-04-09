import { useState } from 'react'
import { Link } from 'react-router-dom'

/*
 * BLUE LANTERN — Jazz Club Landing Page
 * Route: /#/test/jazz
 *
 * ─── COLOR SYSTEM ────────────────────────────────────────────────────
 * Primary hue: Amber (HSL 38°) — lit lantern, cognac, polished brass
 * FIBO shade steps applied (lightness %): 6, 10, 16, 26, 42, 58, 84
 *
 * Color proportion (FIBO 42/26/16/10/6):
 *   Dominant  42%: hsl(38, 15%,  6%) — deep warm near-black bg
 *   Secondary 26%: hsl(38, 15%, 10%) — section surfaces
 *   Structural 16%: hsl(38, 16%, 16%) — card backgrounds
 *   Primary   10%: hsl(38, 84%, 42%) — amber gold (the lantern)
 *   Accent     6%: hsl(38, 84%, 58%) — bright gold, CTAs
 *
 * Opacity steps (FIBO): 84%, 42%, 16%, 10%, 6%
 *   84%: hero dark overlay
 *   42%: glass card in hero
 *   16%: gold border tints
 *   10%: subtle gold bg wash
 *    6%: genre tag bg tint
 *
 * ─── CANVAS & LAYOUT ──────────────────────────────────────────────────
 * Canvas:       1470 × 956 (MacBook Air M4)
 * Margin:       1470 × 6% = 88.2 → 88px
 * Content area: 1470 − (2 × 88) = 1294px
 * Pattern:      maxWidth: 1470px + padding: 0 88px → 1294px usable ✓
 *
 * HERO
 *   min-height: 1470 × 42% = 617.4 → 616px (mult of 8: 77×8=616 ✓)
 *
 * LINEUP GRID (6 cards, 3 cols, equal-width repeating)
 *   Post-gutter (2×24px): 1294 − 48 = 1246px
 *   Card:       1246 ÷ 3 = 415.3 → repeat(3, 1fr) ≈ 415px each ✓
 *   Card pad:   415 × 6% = 24.9 → 24px (F1 of card width) ✓
 *   Usable:     415 − 48 = 367px
 *   Longest name "Nina Blackwood & The Standards" ≈ 300px < 367px ✓
 *
 * THE SPACE (split section)
 *   Post-gutter (1×24px): 1294 − 24 = 1270px
 *   Text col:   1270 × 42% = 533.4 → 533px (F5 of post-gutter)
 *   Image col:  1270 − 533 = 737px (remainder)
 *   Image height: 737 × 58% = 427.46 → 427px (58% = balanced, spacing.md)
 *
 * MENU / QUOTES (3 equal cols)
 *   Post-gutter (2×24px): 1294 − 48 = 1246px
 *   Each: 1246 ÷ 3 = 415.3 → repeat(3, 1fr) ≈ 415px ✓
 *
 * FOOTER (4 equal cols)
 *   Post-gutter (3×24px): 1294 − 72 = 1222px
 *   Each: 1222 ÷ 4 = 305.5 → repeat(4, 1fr) ≈ 306px ✓
 *
 * ─── COMPONENT HEIGHTS (Inside-Out, Signal 5) ─────────────────────────
 * Primary CTA:    16px / 24px lh + 16px vpad × 2 = 56px ✓
 * Book button:    13px / 24px lh +  8px vpad × 2 = 40px ✓
 * Genre tag:      10px / 16px lh +  8px vpad × 2 = 32px ✓
 * Nav back link:  13px / 24px lh + 12px vpad × 2 = 48px ✓
 * Email input:    16px / 24px lh + 16px vpad × 2 = 56px ✓
 *
 * ─── TYPOGRAPHY ───────────────────────────────────────────────────────
 * Club name hero:         55px / 64px lh  (default)
 * Hero tagline:           21px / 32px lh  (default)
 * Tonight artist:         34px / 40px lh  (default)
 * Section headings:       34px / 40px lh  (default)
 * Show artist name:       18px / 32px lh  (alt lh — display context)
 * Body text:              16px / 24px lh  (default)
 * Meta / time / price:    13px / 24px lh  (default)
 * Genre tag / eyebrow:    10px / 16px lh  (default)
 * Fine print / credits:   11px / 16px lh  (default)
 * Menu item heading:      21px / 32px lh  (default)
 * Cocktail name:          16px / 24px lh  (default)
 * Quote text:             16px / 24px lh  (default, italic)
 * Star rating:            21px / 32px lh  (decorative)
 */

// ─── COLOR TOKENS ─────────────────────────────────────────────────────
const C = {
  // Amber hue — FIBO shade steps (lightness: 6, 10, 16, 26, 42, 58, 84)
  bg:          'hsl(38, 15%,  6%)',  // L=6  dominant (42% of visual area)
  surface:     'hsl(38, 15%, 10%)',  // L=10 secondary (26%)
  card:        'hsl(38, 16%, 16%)',  // L=16 structural (16%)
  border:      'hsl(38, 20%, 26%)',  // L=26 warm borders
  gold:        'hsl(38, 84%, 42%)',  // L=42 brand amber — 10% of area
  goldLight:   'hsl(38, 84%, 58%)',  // L=58 bright gold — accent (6%)
  text:        'hsl(38, 10%, 84%)',  // L=84 warm off-white body text
  textMuted:   'hsl(38, 10%, 58%)',  // L=58 low-sat warm gray
  footerBg:    'hsl(38, 15%,  4%)',  // L=4  deepest dark for footer
  // Opacity (FIBO steps: 6, 10, 16, 42, 84)
  overlay84:   'rgba(12,  8,  4, 0.84)',  // 84% dark overlay for hero image
  glass42:     'rgba(26, 20, 14, 0.84)',  // card glass in hero
  goldBorder:  'rgba(199, 127, 28, 0.16)', // gold at 16% opacity — borders
  goldBg10:    'rgba(199, 127, 28, 0.10)', // gold at 10% — subtle wash
  goldBg06:    'rgba(199, 127, 28, 0.06)', // gold at  6% — genre tag bg
} as const

// ─── DATA ─────────────────────────────────────────────────────────────
const SHOWS = [
  { day: 'Monday',    date: 'Apr 7',  artist: 'The Marcus Cole Quartet',        genre: 'Bebop',      doors: '7pm',   show: '8pm',    price: '£25',  free: false },
  { day: 'Tuesday',   date: 'Apr 8',  artist: 'Elena Voss Trio',                genre: 'Vocal Jazz', doors: '7pm',   show: '8:30pm', price: '£20',  free: false },
  { day: 'Wednesday', date: 'Apr 9',  artist: 'Dexter Obi Solo Piano',          genre: 'Solo Piano', doors: '7pm',   show: '9pm',    price: '£15',  free: false },
  { day: 'Thursday',  date: 'Apr 10', artist: 'São Paulo Connection',           genre: 'Latin Jazz', doors: '6:30pm', show: '8pm',   price: '£30',  free: false },
  { day: 'Friday',    date: 'Apr 11', artist: 'Nina Blackwood & The Standards', genre: 'Standards',  doors: '7pm',   show: '8pm',    price: '£35',  free: false },
  { day: 'Saturday',  date: 'Apr 12', artist: 'Late Night Jam Session',         genre: 'Open Jam',   doors: '10pm',  show: '10:30pm', price: 'Free', free: true  },
]

const COCKTAILS = [
  { name: 'The Blue Lantern',  desc: 'Cognac, honey, lemon, lavender bitters',              price: '£16' },
  { name: 'Midnight in Soho', desc: 'Mezcal, blackberry, lime, agave, smoked salt',         price: '£18' },
  { name: 'Standard Time',    desc: 'Bourbon, sweet vermouth, Angostura, orange peel',      price: '£14' },
]

const QUOTES = [
  {
    text: 'The most soulful room in London. A Steinway, candlelight, and the best bebop this side of New York.',
    stars: 5, reviewer: 'Emma C.', source: 'Time Out',
  },
  {
    text: 'Blue Lantern is a proper jazz club — dark, intimate, and absolutely alive. Don\'t miss it.',
    stars: 5, reviewer: 'James H.', source: 'Evening Standard',
  },
  {
    text: 'Came for one show, stayed for three. The table service is seamless and the sound is extraordinary.',
    stars: 5, reviewer: 'Sophie R.', source: 'Google',
  },
]

// ─── HELPERS ──────────────────────────────────────────────────────────
const Eyebrow = ({ children }: { children: string }) => (
  <div style={{
    fontSize: '10px', lineHeight: '16px',
    fontWeight: 600, letterSpacing: '0.2em',
    textTransform: 'uppercase' as const, color: C.gold,
    marginBottom: '8px',
  }}>
    {children}
  </div>
)

// ─── PAGE ─────────────────────────────────────────────────────────────
export default function JazzPage() {
  const [email, setEmail]         = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── HERO ─────────────────────────────────────────────────────
       * Full-bleed image + overlay. Flex column, space-between.
       * min-height: 616px (1470 × 42% = 617.4 → 616px, 77×8 ✓)
       */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: '616px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundImage: 'url(https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1400&h=800)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}>
        {/* Dark overlay — 84% opacity (FIBO step) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: C.overlay84,
          zIndex: 0,
        }} />

        {/* ── Top: club identity ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: '1470px', margin: '0 auto',
          padding: '0 88px', width: '100%',
        }}>
          {/* Nav back — height: 48px (13px/24px lh + 12px×2 = 48px ✓) */}
          <div style={{ display: 'flex', alignItems: 'center', height: '48px' }}>
            <Link to="/" style={{
              fontSize: '13px', lineHeight: '24px',
              color: C.textMuted, textDecoration: 'none',
              letterSpacing: '0.08em', fontWeight: 500,
            }}>
              ← FIBO
            </Link>
          </div>

          <div style={{ paddingTop: '48px' }}>
            <Eyebrow>Live Jazz · London · Est. 1962</Eyebrow>

            {/* Club name — 55px / 64px lh (default) */}
            <h1 style={{
              fontSize: '55px', lineHeight: '64px',
              fontWeight: 700, color: C.text,
              letterSpacing: '-0.02em', marginBottom: '16px',
              margin: '0 0 16px',
            }}>
              Blue Lantern
            </h1>

            {/* Tagline — 21px / 32px lh (default) */}
            <p style={{
              fontSize: '21px', lineHeight: '32px',
              fontWeight: 400, color: C.textMuted,
              maxWidth: '543px', /* F5 of 1294px content area */
              margin: 0,
            }}>
              Live jazz in the heart of Soho since 1962
            </p>
          </div>
        </div>

        {/* ── Bottom: Tonight card ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: '1470px', margin: '0 auto',
          padding: '0 88px 64px', width: '100%',
        }}>
          {/* Glass card — gold at 10% bg, 16% border */}
          <div style={{
            background: C.glass42,
            border: `1px solid ${C.goldBorder}`,
            padding: '32px',
            maxWidth: '543px', /* F5 of 1294px */
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}>
            <Eyebrow>Tonight</Eyebrow>

            {/* Artist name — 34px / 40px lh (default) */}
            <h2 style={{
              fontSize: '34px', lineHeight: '40px',
              fontWeight: 700, color: C.text,
              margin: '0 0 8px',
            }}>
              The Marcus Cole Quartet
            </h2>

            {/* Time — 13px / 24px lh (default) */}
            <p style={{
              fontSize: '13px', lineHeight: '24px',
              color: C.textMuted, margin: '0 0 24px',
            }}>
              Doors 7pm · Show starts 8pm · Bebop · £25
            </p>

            {/* CTA — height: 56px (16px/24px lh + 16px×2 = 56px ✓) */}
            <a href="#lineup" style={{
              display: 'inline-flex', alignItems: 'center',
              height: '56px', padding: '0 32px',
              background: C.gold,
              color: 'hsl(38, 15%, 6%)', /* max contrast on amber */
              fontSize: '16px', lineHeight: '24px',
              fontWeight: 600, textDecoration: 'none',
              letterSpacing: '0.02em',
            }}>
              Reserve a table
            </a>
          </div>
        </div>
      </section>

      {/* ── THIS WEEK'S LINEUP ───────────────────────────────────────
       * 3-col equal grid. Card: ≈415px. Gap: 24px.
       * Card pad: 415 × 6% = 24.9 → 24px ✓
       */}
      <section id="lineup" style={{ background: C.surface, padding: '96px 0' }}>
        <div style={{
          maxWidth: '1470px', margin: '0 auto', padding: '0 88px',
        }}>
          <div style={{ marginBottom: '48px' }}>
            <Eyebrow>Live music</Eyebrow>
            {/* 34px / 40px lh */}
            <h2 style={{
              fontSize: '34px', lineHeight: '40px',
              fontWeight: 700, color: C.text, margin: 0,
            }}>
              This week's lineup
            </h2>
          </div>

          {/* Grid — 3 cols, 24px gap */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', /* ≈415px each ✓ */
            gap: '24px',
          }}>
            {SHOWS.map((show, i) => (
              <div key={i} style={{
                background: C.card,
                border: `1px solid ${C.goldBorder}`,
                padding: '24px', /* 415 × 6% = 24.9 → 24px ✓ */
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Genre tag — height: 32px (10px/16px lh + 8px×2 = 32px ✓) */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  alignSelf: 'flex-start',
                  height: '32px', padding: '0 8px',
                  background: C.goldBg06,
                  border: `1px solid ${C.goldBorder}`,
                  fontSize: '10px', lineHeight: '16px',
                  fontWeight: 600, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: C.gold,
                  marginBottom: '16px',
                }}>
                  {show.genre}
                </span>

                {/* Artist name — 18px / 32px lh (alt lh — display) */}
                <h3 style={{
                  fontSize: '18px', lineHeight: '32px',
                  fontWeight: 600, color: C.text, margin: '0 0 4px',
                }}>
                  {show.artist}
                </h3>

                {/* Day / date — 13px / 24px lh */}
                <p style={{
                  fontSize: '13px', lineHeight: '24px',
                  color: C.textMuted, margin: 0,
                }}>
                  {show.day}, {show.date}
                </p>

                {/* Times — 13px / 24px lh */}
                <p style={{
                  fontSize: '13px', lineHeight: '24px',
                  color: C.textMuted, margin: '0 0 24px',
                }}>
                  Doors {show.doors} · Show {show.show}
                </p>

                {/* Price + Book — mt: auto pushes to bottom */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginTop: 'auto',
                }}>
                  <span style={{
                    fontSize: '16px', lineHeight: '24px',
                    fontWeight: 700,
                    color: show.free ? C.gold : C.text,
                  }}>
                    {show.price}
                  </span>

                  {/* Book button — height: 40px (13px/24px lh + 8px×2 = 40px ✓) */}
                  <button style={{
                    display: 'inline-flex', alignItems: 'center',
                    height: '40px', padding: '0 16px',
                    background: 'transparent',
                    border: `1px solid ${C.gold}`,
                    color: C.gold,
                    fontSize: '13px', lineHeight: '24px',
                    fontWeight: 500, cursor: 'pointer',
                    letterSpacing: '0.05em', fontFamily: 'inherit',
                  }}>
                    {show.free ? 'Register' : 'Book'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SPACE ────────────────────────────────────────────────
       * Split: text 533px | image 737px, gap 24px
       * Post-gutter: 1294 − 24 = 1270px
       * Text: 1270 × 42% = 533.4 → 533px (F5 of post-gutter)
       * Image height: 737 × 58% = 427.46 → 427px (balanced, spacing.md)
       */}
      <section style={{ background: C.bg, padding: '96px 0' }}>
        <div style={{
          maxWidth: '1470px', margin: '0 auto', padding: '0 88px',
        }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>

            {/* Text — 533px (42% of 1270px post-gutter) */}
            <div style={{ width: '533px', flexShrink: 0 }}>
              <Eyebrow>The venue</Eyebrow>
              <h2 style={{
                fontSize: '34px', lineHeight: '40px',
                fontWeight: 700, color: C.text, margin: '0 0 24px',
              }}>
                The Space
              </h2>
              <p style={{
                fontSize: '16px', lineHeight: '24px',
                color: C.textMuted, margin: '0 0 32px',
              }}>
                An intimate 80-seat room with a Steinway grand, exposed brick,
                and the best sound system in Soho. Table service throughout
                every show.
              </p>

              {/* Feature list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['80 seats', 'Steinway concert grand', 'Full table service throughout', 'Private hire available'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontSize: '10px', lineHeight: '16px',
                      color: C.gold, fontWeight: 700,
                    }}>◆</span>
                    <span style={{
                      fontSize: '16px', lineHeight: '24px', color: C.text,
                    }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image — 737px wide (remainder), 427px tall (737 × 58%) */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&h=600"
                alt="Blue Lantern interior — Steinway grand and exposed brick"
                style={{
                  width: '100%',
                  height: '427px', /* 737 × 58% = 427.46 → 427px */
                  objectFit: 'cover', display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── MENU PREVIEW ─────────────────────────────────────────────
       * 3 equal cols (≈415px), 24px gap
       */}
      <section style={{ background: C.surface, padding: '96px 0' }}>
        <div style={{
          maxWidth: '1470px', margin: '0 auto', padding: '0 88px',
        }}>
          <div style={{ marginBottom: '48px' }}>
            <Eyebrow>From the bar</Eyebrow>
            <h2 style={{
              fontSize: '34px', lineHeight: '40px',
              fontWeight: 700, color: C.text, margin: 0,
            }}>
              Menu preview
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', /* ≈415px each ✓ */
            gap: '24px',
          }}>
            {/* Cocktails */}
            <div>
              <h3 style={{
                fontSize: '21px', lineHeight: '32px',
                fontWeight: 600, color: C.text,
                margin: '0 0 16px', paddingBottom: '16px',
                borderBottom: `1px solid ${C.goldBorder}`,
              }}>
                Cocktails
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {COCKTAILS.map(c => (
                  <div key={c.name}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'baseline', marginBottom: '4px',
                    }}>
                      {/* Name — 16px / 24px lh */}
                      <span style={{
                        fontSize: '16px', lineHeight: '24px',
                        fontWeight: 600, color: C.text,
                      }}>{c.name}</span>
                      {/* Price — 13px / 24px lh */}
                      <span style={{
                        fontSize: '13px', lineHeight: '24px',
                        color: C.gold, fontWeight: 500,
                      }}>{c.price}</span>
                    </div>
                    {/* Desc — 13px / 24px lh */}
                    <p style={{
                      fontSize: '13px', lineHeight: '24px',
                      color: C.textMuted, margin: 0,
                    }}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wine */}
            <div>
              <h3 style={{
                fontSize: '21px', lineHeight: '32px',
                fontWeight: 600, color: C.text,
                margin: '0 0 16px', paddingBottom: '16px',
                borderBottom: `1px solid ${C.goldBorder}`,
              }}>
                Wine
              </h3>
              {/* 16px / 24px lh */}
              <p style={{
                fontSize: '16px', lineHeight: '24px',
                color: C.text, margin: '0 0 16px',
                fontWeight: 500,
              }}>
                Selected natural wines from £12/glass
              </p>
              {/* 13px / 24px lh */}
              <p style={{
                fontSize: '13px', lineHeight: '24px',
                color: C.textMuted, margin: 0,
              }}>
                Our sommelier curates a short, rotating list of biodynamic
                and natural producers. Ask your server for tonight's selection.
              </p>
            </div>

            {/* Non-alcoholic */}
            <div>
              <h3 style={{
                fontSize: '21px', lineHeight: '32px',
                fontWeight: 600, color: C.text,
                margin: '0 0 16px', paddingBottom: '16px',
                borderBottom: `1px solid ${C.goldBorder}`,
              }}>
                Non-alcoholic
              </h3>
              <p style={{
                fontSize: '16px', lineHeight: '24px',
                color: C.text, margin: '0 0 16px', fontWeight: 500,
              }}>
                House-made shrubs and sodas from £6
              </p>
              <p style={{
                fontSize: '13px', lineHeight: '24px',
                color: C.textMuted, margin: 0,
              }}>
                Seasonal preparations: ginger and cardamom, rhubarb and hibiscus,
                apple and thyme. Always changing, always interesting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT PEOPLE SAY ───────────────────────────────────────────
       * 3 equal cols (≈415px), card pad: 32px (4×8 ✓)
       */}
      <section style={{ background: C.bg, padding: '96px 0' }}>
        <div style={{
          maxWidth: '1470px', margin: '0 auto', padding: '0 88px',
        }}>
          <div style={{ marginBottom: '48px' }}>
            <Eyebrow>Reviews</Eyebrow>
            <h2 style={{
              fontSize: '34px', lineHeight: '40px',
              fontWeight: 700, color: C.text, margin: 0,
            }}>
              What people say
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', /* ≈415px each ✓ */
            gap: '24px',
          }}>
            {QUOTES.map((q, i) => (
              <div key={i} style={{
                background: C.card,
                border: `1px solid ${C.goldBorder}`,
                padding: '32px', /* 4×8 ✓ */
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Stars — 21px / 32px lh (decorative) */}
                <div style={{
                  fontSize: '21px', lineHeight: '32px',
                  color: C.gold, marginBottom: '16px',
                  letterSpacing: '2px',
                }}>
                  {'★'.repeat(q.stars)}
                </div>

                {/* Quote — 16px / 24px lh, italic */}
                <p style={{
                  fontSize: '16px', lineHeight: '24px',
                  color: C.text, fontStyle: 'italic',
                  margin: '0 0 24px', flex: 1,
                }}>
                  "{q.text}"
                </p>

                {/* Reviewer — 13px / 24px lh */}
                <div>
                  <span style={{
                    fontSize: '13px', lineHeight: '24px',
                    fontWeight: 600, color: C.text,
                  }}>
                    {q.reviewer}
                  </span>
                  {/* Source — 11px / 16px lh */}
                  <span style={{
                    fontSize: '11px', lineHeight: '16px',
                    color: C.textMuted, marginLeft: '8px',
                  }}>
                    via {q.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────
       * Centered content. Form max-width: F5 of 1294 = 543px.
       * Input height: 56px (16px/24px lh + 16px×2 = 56px ✓)
       * Button height: 56px (same — inline pairing) ✓
       */}
      <section style={{ background: C.surface, padding: '96px 0' }}>
        <div style={{
          maxWidth: '1470px', margin: '0 auto', padding: '0 88px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center',
        }}>
          <Eyebrow>Stay close</Eyebrow>

          <h2 style={{
            fontSize: '34px', lineHeight: '40px',
            fontWeight: 700, color: C.text,
            margin: '0 0 16px',
          }}>
            Join the Blue Lantern circle
          </h2>

          <p style={{
            fontSize: '16px', lineHeight: '24px',
            color: C.textMuted, maxWidth: '543px',
            margin: '0 0 40px',
          }}>
            Priority booking for members, advance notice of special events,
            and monthly notes from our team.
          </p>

          {subscribed ? (
            <div style={{
              fontSize: '16px', lineHeight: '24px',
              color: C.gold, fontWeight: 500,
            }}>
              You're on the list. We'll be in touch. ✦
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email.trim()) setSubscribed(true) }}
              style={{
                display: 'flex', gap: '0',
                width: '100%', maxWidth: '543px', /* F5 of 1294 */
              }}
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                style={{
                  flex: 1,
                  height: '56px', /* 16px/24px lh + 16px×2 = 56px ✓ */
                  padding: '0 24px',
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRight: 'none',
                  color: C.text,
                  fontSize: '16px', lineHeight: '24px',
                  outline: 'none', fontFamily: 'inherit',
                }}
              />
              <button type="submit" style={{
                height: '56px', /* matches input ✓ */
                padding: '0 32px',
                background: C.gold,
                border: 'none',
                color: 'hsl(38, 15%, 6%)',
                fontSize: '16px', lineHeight: '24px',
                fontWeight: 600, cursor: 'pointer',
                letterSpacing: '0.02em', fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}>
                Join the circle
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────
       * 4 equal cols — repeat(4, 1fr) ≈ 306px each
       * Post-gutter (3×24): 1294 − 72 = 1222px. Each: 1222÷4 = 305.5 → 306px ✓
       */}
      <footer style={{
        background: C.footerBg,
        padding: '64px 0 48px',
        borderTop: `1px solid ${C.goldBorder}`,
      }}>
        <div style={{
          maxWidth: '1470px', margin: '0 auto', padding: '0 88px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)', /* ≈306px each ✓ */
            gap: '24px',
            marginBottom: '48px',
          }}>

            {/* Col 1 — Identity */}
            <div>
              {/* 21px / 32px lh */}
              <div style={{
                fontSize: '21px', lineHeight: '32px',
                fontWeight: 700, color: C.text,
                marginBottom: '16px', letterSpacing: '-0.01em',
              }}>
                Blue Lantern
              </div>
              {/* 13px / 24px lh */}
              <p style={{
                fontSize: '13px', lineHeight: '24px',
                color: C.textMuted, margin: 0,
              }}>
                42 Frith Street<br />
                Soho, London W1D 4SB
              </p>
            </div>

            {/* Col 2 — Hours */}
            <div>
              {/* Section heading — 11px / 16px lh, uppercase */}
              <div style={{
                fontSize: '11px', lineHeight: '16px',
                fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: C.gold,
                marginBottom: '16px',
              }}>
                Hours
              </div>
              {/* 13px / 24px lh */}
              <p style={{
                fontSize: '13px', lineHeight: '24px',
                color: C.textMuted, margin: 0,
              }}>
                Tuesday – Saturday<br />
                Doors 7pm<br />
                Last entry 10:30pm
              </p>
            </div>

            {/* Col 3 — Contact */}
            <div>
              <div style={{
                fontSize: '11px', lineHeight: '16px',
                fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: C.gold,
                marginBottom: '16px',
              }}>
                Contact
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: 'tel:+442071234567',         label: '+44 20 7123 4567' },
                  { href: 'mailto:hello@bluelanternjazz.co.uk', label: 'hello@bluelanternjazz.co.uk' },
                  { href: '#instagram',                 label: '@bluelanternjazz' },
                ].map(({ href, label }) => (
                  <a key={label} href={href} style={{
                    fontSize: '13px', lineHeight: '24px',
                    color: C.textMuted, textDecoration: 'none',
                  }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 4 — Map placeholder */}
            <div>
              <div style={{
                fontSize: '11px', lineHeight: '16px',
                fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: C.gold,
                marginBottom: '16px',
              }}>
                Find us
              </div>
              {/* Map placeholder — height: 128px (16×8 ✓) */}
              <div style={{
                width: '100%', height: '128px',
                background: C.card,
                border: `1px solid ${C.goldBorder}`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '8px',
              }}>
                <span style={{
                  fontSize: '21px', lineHeight: '32px', color: C.gold,
                }}>◎</span>
                <span style={{
                  fontSize: '11px', lineHeight: '16px',
                  color: C.textMuted, letterSpacing: '0.06em',
                }}>
                  Frith Street, Soho W1
                </span>
              </div>
            </div>
          </div>

          {/* Footer bottom bar */}
          <div style={{
            paddingTop: '24px',
            borderTop: `1px solid ${C.goldBorder}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {/* 11px / 16px lh */}
            <span style={{ fontSize: '11px', lineHeight: '16px', color: C.textMuted }}>
              © 2024 Blue Lantern Jazz Club Ltd. All rights reserved.
            </span>
            <span style={{
              fontSize: '11px', lineHeight: '16px',
              color: C.textMuted,
              opacity: 0.42, /* FIBO opacity step */
            }}>
              FIBO test design
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
