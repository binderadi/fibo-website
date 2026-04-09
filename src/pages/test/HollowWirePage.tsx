/*
 * THE HOLLOW WIRE — Peter Saville mode
 * Canvas: 1470×956 (MacBook Air M4)
 *
 * Design approach: typography-first, graphic, post-punk editorial.
 * Inspired by Peter Saville's work for Factory Records.
 * No hero photograph — text texture IS the background.
 *
 * ─── EXTENDED TYPE SCALE ─────────────────────────────────────────
 * FIBO sequence extended: 8, 13, 21, 34, 55, 89 (total 220)
 * 89px used for hero title + tour day numerals (decorative)
 * LH for 89px: nearest 8px multiple = 96px ✓
 *
 * ─── CANVAS & LAYOUT ─────────────────────────────────────────────
 * Margin:         1470 × 6% = 88.2 → 88px
 * Content area:   1470 − (2×88) = 1294px
 *
 * ─── ACCENT STRIPE ───────────────────────────────────────────────
 * 8px solid bar, full viewport width, ice blue (#4D94FF)
 * Sits between every major section. The only colour on the page.
 *
 * ─── TOUR — oversized day numerals ───────────────────────────────
 * Day numeral:  89px / 96px lh, opacity 16% — decorative, layout col 120px
 * Venue:        21px / 32px lh, weight 600
 * Date + city:  11px / 16px lh, uppercase, muted
 * Row padding:  16px top + bottom (internal) → Gestalt < 48px section gap
 *
 * ─── DISCOGRAPHY — staircase ─────────────────────────────────────
 * 3 equal cols × ~415px (repeat(3,1fr) gap 24px)
 * Card offsets: 0px / 80px / 160px marginTop
 * Album art: 415×415px (Sammy Square — 100% ratio)
 *
 * ─── ABOUT — photo dominant ──────────────────────────────────────
 * Photo:  847px (68% post-gutter), full-bleed tall
 * Text:   399px (32% post-gutter), narrow editorial column
 * Gutter: 48px
 * Photo height: 847 × 74% = 626.8 → 627px (tall landscape)
 *
 * ─── MERCH — price as hero ───────────────────────────────────────
 * 4 equal cols × ~306px (repeat(4,1fr) gap 24px)
 * Price: 34px / 40px lh — the dominant typographic element
 * Name:  11px / 16px lh, uppercase, muted
 *
 * ─── COMPONENT HEIGHTS ───────────────────────────────────────────
 * Nav:             13px / 24px lh + 12px v-pad × 2 = 48px ✓
 * Ticket button:   13px / 24px lh + 8px v-pad × 2 = 40px ✓
 * Accent stripe:   8px ✓ (8px grid)
 * Copyright bar:   11px / 16px lh + 16px v-pad × 2 = 48px ✓
 */

import React from 'react'

// ─── COLORS ────────────────────────────────────────────────────────
const C = {
  bg:        '#0A0C10',
  surface:   '#10141C',
  border:    '#1E2433',
  text:      '#E0E4EC',
  muted:     '#636978',
  faint:     '#2A2F3E',
  accent:    '#4D94FF',
  accentDim: 'rgba(77,148,255,0.12)',
}

// ─── DATA ────────────────────────────────────────────────────────────
const tourDates = [
  { dayNum: '18', date: 'Apr 18 · Fri', venue: 'Troxy', city: 'London, UK', soldOut: false },
  { dayNum: '22', date: 'Apr 22 · Tue', venue: 'Paradiso', city: 'Amsterdam, NL', soldOut: false },
  { dayNum: '25', date: 'Apr 25 · Fri', venue: 'Lido', city: 'Berlin, DE', soldOut: true },
  { dayNum: '29', date: 'Apr 29 · Tue', venue: 'Le Bataclan', city: 'Paris, FR', soldOut: false },
  { dayNum: '03', date: 'May 03 · Sat', venue: 'Primavera Sound — Stage 2', city: 'Barcelona, ES', soldOut: false },
  { dayNum: '10', date: 'May 10 · Sat', venue: 'Music Hall of Williamsburg', city: 'New York, US', soldOut: false },
  { dayNum: '14', date: 'May 14 · Wed', venue: 'The Metro', city: 'Chicago, US', soldOut: false },
  { dayNum: '17', date: 'May 17 · Sat', venue: 'The Fillmore', city: 'San Francisco, US', soldOut: false },
]

const albums = [
  {
    title: 'The Hollow Wire',
    year: '2019',
    tracks: 10,
    label: 'Sacred Bones',
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=415&h=415&fit=crop',
  },
  {
    title: 'Static Bloom',
    year: '2021',
    tracks: 9,
    label: 'Sacred Bones',
    image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=415&h=415&fit=crop',
  },
  {
    title: 'Cold Frame',
    year: '2023',
    tracks: 11,
    label: 'Sacred Bones',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=415&h=415&fit=crop',
  },
]

const merch = [
  { name: 'Cold Frame Tour Tee', price: '£35', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=306&h=306&fit=crop' },
  { name: 'Hollow Wire Hoodie', price: '£65', image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=306&h=306&fit=crop' },
  { name: 'Static Bloom LP',    price: '£28', image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=306&h=306&fit=crop' },
  { name: 'Wire Tote Bag',      price: '£20', image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=306&h=306&fit=crop' },
]

// Text texture — repeated press quotes fill the hero background
const TEXTURE = Array(30).fill(
  'The Hollow Wire · Static Bloom · Cold Frame · Sacred Bones · Glasgow · ' +
  '"A band that sounds like the end of something." — The Wire · ' +
  '"Post-punk at its most uncompromising." — NME · ' +
  'Cold Frame World Tour 2026 · '
).join('')

// ─── ACCENT STRIPE ───────────────────────────────────────────────────
function Stripe() {
  return <div style={s.stripe} />
}

// ─── COMPONENT ───────────────────────────────────────────────────────
export default function HollowWirePage() {
  return (
    <div style={s.page}>

      {/* ── NAV ── */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <span style={s.navLogo}>THE HOLLOW WIRE</span>
          <div style={s.navLinks}>
            {['Tour', 'Music', 'About', 'Merch'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={s.navLink}>{l}</a>
            ))}
            <a href="#" style={s.navCta} onClick={e => e.preventDefault()}>Listen Now</a>
          </div>
        </div>
      </nav>

      {/* ── HERO — text texture + massive type ── */}
      {/* No photo. Dense 9px text fills viewport. Band name at 89px overlaid. */}
      <section style={s.hero}>
        {/* Text texture layer — press quotes at 9px / 16px lh, opacity 10% */}
        <div style={s.heroTexture} aria-hidden="true">
          {TEXTURE}
        </div>
        {/* Gradient fade at bottom so content area reads clearly */}
        <div style={s.heroFade} />
        {/* Hero content */}
        <div style={s.heroContent}>
          {/* Eyebrow — 11px / 16px lh, uppercase, accent */}
          <p style={s.heroEyebrow}>Cold Frame World Tour 2026</p>
          {/* Band name — 89px / 96px lh (extended FIBO scale), weight 800 */}
          <h1 style={s.heroTitle}>The Hollow<br />Wire</h1>
          {/* Tagline — 21px / 32px lh */}
          <p style={s.heroTagline}>Noise from the dark end of the dial.</p>
          <div style={s.heroActions}>
            <a href="#tour" style={s.heroBtnPrimary}>Buy Tickets</a>
            <a href="#music" style={s.heroBtnGhost} onClick={e => e.preventDefault()}>Stream Cold Frame</a>
          </div>
        </div>
      </section>

      <Stripe />

      {/* ── TOUR — oversized day numerals ── */}
      <section id="tour" style={s.section}>
        <div style={s.contentArea}>
          {/* Section label — 11px / 16px lh, uppercase */}
          <p style={s.sectionEyebrow}>Tour Dates</p>
          <div style={s.tourList}>
            {tourDates.map((show, i) => (
              <div key={i} style={s.tourRow}>
                {/* Oversized day numeral — 89px / 96px lh, muted 16% opacity, decorative */}
                <span style={s.tourDayNum} aria-hidden="true">{show.dayNum}</span>
                {/* Show details */}
                <div style={s.tourDetails}>
                  <p style={s.tourDateStr}>{show.date}</p>
                  <p style={s.tourVenue}>{show.venue}</p>
                  <p style={s.tourCity}>{show.city}</p>
                </div>
                {/* Ticket CTA — 40px height ✓ */}
                <div style={s.tourTickets}>
                  {show.soldOut
                    ? <span style={s.soldOut}>Sold Out</span>
                    : <a href="#" style={s.ticketBtn} onClick={e => e.preventDefault()}>Buy Tickets</a>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Stripe />

      {/* ── DISCOGRAPHY — staircase grid ── */}
      {/* Each album card drops 80px lower than the previous */}
      <section id="music" style={s.section}>
        <div style={s.contentArea}>
          <p style={s.sectionEyebrow}>Discography</p>
          <div style={s.albumGrid}>
            {albums.map((album, i) => (
              <article
                key={i}
                style={{ ...s.albumCard, marginTop: `${i * 80}px` }}
              >
                {/* Album art — 100% ratio (Sammy Square) */}
                <div style={s.albumArtWrap}>
                  <img src={album.image} alt={album.title} style={s.albumArt} />
                  <div style={s.albumIndex}>{String(i + 1).padStart(2, '0')}</div>
                </div>
                <div style={s.albumMeta}>
                  {/* Year — 11px / 16px, muted */}
                  <p style={s.albumYear}>{album.year} · {album.tracks} tracks · {album.label}</p>
                  {/* Title — 21px / 32px lh */}
                  <h3 style={s.albumTitle}>{album.title}</h3>
                  <a href="#" style={s.albumStream} onClick={e => e.preventDefault()}>Stream →</a>
                </div>
              </article>
            ))}
          </div>
          {/* Spacer to account for staircase offset (160px) so section doesn't clip */}
          <div style={{ height: '160px' }} />
        </div>
      </section>

      <Stripe />

      {/* ── ABOUT — photo dominant + narrow editorial column ── */}
      {/* Photo: 847px (68%). Text: 399px narrow column. */}
      <section id="about" style={s.section}>
        <div style={s.contentArea}>
          <div style={s.aboutGrid}>
            {/* Photo — 847px × 627px (74% ratio — tall landscape) */}
            <div style={s.aboutPhotoWrap}>
              <img
                src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=847&h=627&fit=crop"
                alt="The Hollow Wire live"
                style={s.aboutPhoto}
              />
              {/* Photo caption — 11px / 16px lh */}
              <p style={s.photoCaption}>Live at Primavera Sound, 2025 · Photo: Elin Svensson</p>
            </div>
            {/* Narrow editorial text column — 399px */}
            <div style={s.aboutText}>
              <p style={s.sectionEyebrow}>About</p>
              <p style={s.bioP}>
                The Hollow Wire formed in Glasgow in 2017, built from the wreckage of two failed
                bands and a shared obsession with the space between post-punk and industrial music.
              </p>
              <p style={s.bioP}>
                Their self-titled debut arrived in 2019 on Sacred Bones Records — ten tracks of
                slow compression and controlled feedback that drew comparisons to early Interpol
                and latter-day Nick Cave.
              </p>
              <p style={s.bioP}>
                <em>Cold Frame</em>, their third album, was recorded in a decommissioned radio
                tower outside Oslo across two winters. It arrives April 2026.
              </p>
              {/* Pull quote — 21px / 32px lh, accent */}
              <blockquote style={s.pullQuote}>
                "A band that sounds like the end of something."
                <cite style={s.pullCite}>— The Wire</cite>
              </blockquote>
              <div style={s.aboutLinks}>
                {['Spotify', 'Apple Music', 'Bandcamp', 'Instagram'].map(p => (
                  <a key={p} href="#" style={s.aboutLink} onClick={e => e.preventDefault()}>{p}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Stripe />

      {/* ── MERCH — price as typographic hero ── */}
      {/* Price at 34px dominates each card. Name at 11px, small. */}
      <section id="merch" style={{ ...s.section, background: C.surface }}>
        <div style={s.contentArea}>
          <div style={s.merchHeader}>
            <p style={s.sectionEyebrow}>Merch</p>
            <a href="#" style={s.viewAll} onClick={e => e.preventDefault()}>View all →</a>
          </div>
          <div style={s.merchGrid}>
            {merch.map((item, i) => (
              <div key={i} style={s.merchCard}>
                <div style={s.merchImgWrap}>
                  <img src={item.image} alt={item.name} style={s.merchImg} />
                </div>
                {/* Name — 11px / 16px, uppercase, muted */}
                <p style={s.merchName}>{item.name}</p>
                {/* Price — 34px / 40px lh — the hero element */}
                <p style={s.merchPrice}>{item.price}</p>
                <button style={s.addToCart}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.contentArea}>
          <div style={s.footerGrid}>
            <div style={s.footerBrand}>
              <p style={s.footerLogo}>THE HOLLOW WIRE</p>
              <p style={s.footerTagline}>Noise from the dark end of the dial.</p>
              <p style={s.footerLabel}>Sacred Bones Records · Glasgow</p>
            </div>
            {[
              { head: 'Navigation', links: ['Tour', 'Music', 'About', 'Merch'] },
              { head: 'Listen', links: ['Spotify', 'Apple Music', 'Bandcamp', 'YouTube'] },
              { head: 'Follow', links: ['Instagram', 'X / Twitter', 'Facebook', 'TikTok'] },
            ].map(col => (
              <div key={col.head} style={s.footerCol}>
                <p style={s.footerColHead}>{col.head}</p>
                {col.links.map(l => (
                  <a key={l} href="#" style={s.footerLink} onClick={e => e.preventDefault()}>{l}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Copyright bar — 11px / 16px + 16px v-pad × 2 = 48px ✓ */}
        <div style={s.copyrightBar}>
          <div style={s.contentArea}>
            <span style={s.copyrightText}>© 2026 The Hollow Wire. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  )
}

// ─── STYLES ──────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {

  page: {
    background: C.bg,
    color: C.text,
    fontFamily: "'Inter', -apple-system, sans-serif",
    minHeight: '100vh',
  },

  /* ── Content Area ── */
  contentArea: {
    maxWidth: '1470px',
    margin: '0 auto',
    padding: '0 88px',
  },

  /* ── Accent stripe — 8px, full viewport width ── */
  stripe: {
    height: '8px',
    background: C.accent,
    width: '100%',
  },

  /* ── Nav — 48px ✓ ── */
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '48px',
    background: 'rgba(10,12,16,0.9)',
    backdropFilter: 'blur(16px)',
    borderBottom: `1px solid ${C.border}`,
    zIndex: 100,
  },
  navInner: {
    maxWidth: '1470px',
    margin: '0 auto',
    padding: '12px 88px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navLogo: {
    fontSize: '13px',
    lineHeight: '24px',
    fontWeight: 700,
    letterSpacing: '0.16em',
    color: C.text,
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    fontSize: '13px',
    lineHeight: '24px',
    fontWeight: 500,
    color: C.muted,
    textDecoration: 'none',
    letterSpacing: '0.04em',
  },
  navCta: {
    fontSize: '13px',
    lineHeight: '24px',
    fontWeight: 600,
    color: C.accent,
    textDecoration: 'none',
  },

  /* ── Hero ── */
  hero: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    minHeight: '700px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-end',
  },
  heroTexture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: '9px',              /* 9px / 16px lh — FIBO type scale ✓ */
    lineHeight: '16px',
    color: C.text,
    opacity: 0.10,                /* 10% — FIBO opacity step ✓ */
    padding: '80px 88px 0',
    wordBreak: 'break-all',
    overflowWrap: 'anywhere',
    letterSpacing: '0.08em',
    userSelect: 'none',
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: 'linear-gradient(to top, rgba(10,12,16,1) 0%, rgba(10,12,16,0) 100%)',
  },
  heroContent: {
    position: 'relative',
    maxWidth: '1470px',
    width: '100%',
    margin: '0 auto',
    padding: '0 88px 80px',
  },
  heroEyebrow: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: C.accent,
    marginBottom: '24px',
  },
  heroTitle: {
    fontSize: '89px',             /* 89px / 96px lh — extended FIBO scale ✓ */
    lineHeight: '96px',
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontWeight: 300,              /* Light weight — extreme thin/thick contrast at large size */
    fontStyle: 'italic',
    letterSpacing: '0.01em',
    textTransform: 'uppercase',
    color: C.text,
    marginBottom: '24px',
  },
  heroTagline: {
    fontSize: '21px',             /* 21px / 32px lh */
    lineHeight: '32px',
    fontStyle: 'italic',
    color: C.muted,
    marginBottom: '40px',
  },
  heroActions: {
    display: 'flex',
    gap: '16px',
  },
  heroBtnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '40px',               /* 40px ✓ */
    padding: '0 24px',
    background: C.accent,
    color: '#0A0C10',
    fontSize: '13px',
    lineHeight: '24px',
    fontWeight: 600,
    textDecoration: 'none',
    letterSpacing: '0.04em',
    borderRadius: '2px',
  },
  heroBtnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '40px',               /* 40px ✓ */
    padding: '0 24px',
    background: 'transparent',
    border: `1px solid ${C.border}`,
    color: C.text,
    fontSize: '13px',
    lineHeight: '24px',
    fontWeight: 500,
    textDecoration: 'none',
    borderRadius: '2px',
  },

  /* ── Section wrapper ── */
  section: {
    paddingTop: '96px',
    paddingBottom: '96px',
  },
  sectionEyebrow: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: C.accent,
    marginBottom: '48px',
  },

  /* ── Tour ── */
  tourList: {
    display: 'flex',
    flexDirection: 'column',
  },
  tourRow: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr 160px',
    alignItems: 'center',
    gap: '48px',
    borderBottom: `1px solid ${C.border}`,
    padding: '16px 0',            /* 16px v-pad — internal, Gestalt < 96px section gap ✓ */
    overflow: 'visible',
  },
  tourDayNum: {
    fontSize: '89px',             /* 89px / 96px lh — decorative, oversized numeral */
    lineHeight: '96px',
    fontWeight: 800,
    color: C.text,
    opacity: 0.10,                /* 10% — FIBO opacity step ✓ — ghost numeral */
    letterSpacing: '-0.04em',
    userSelect: 'none',
    display: 'block',
  },
  tourDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  tourDateStr: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: C.muted,
  },
  tourVenue: {
    fontSize: '21px',             /* 21px / 32px lh */
    lineHeight: '32px',
    fontWeight: 600,
    color: C.text,
  },
  tourCity: {
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    color: C.muted,
  },
  tourTickets: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ticketBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '40px',               /* 40px ✓ */
    padding: '0 20px',
    background: C.accentDim,
    color: C.accent,
    fontSize: '13px',
    lineHeight: '24px',
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: '2px',
    border: `1px solid rgba(77,148,255,0.26)`,
  },
  soldOut: {
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    color: C.muted,
    fontWeight: 500,
  },

  /* ── Discography — staircase ── */
  albumGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    alignItems: 'start',
  },
  albumCard: {
    display: 'flex',
    flexDirection: 'column',
    /* marginTop set inline: 0 / 80px / 160px */
  },
  albumArtWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',         /* Sammy Square ✓ */
    overflow: 'hidden',
    borderRadius: '2px',
  },
  albumArt: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  albumIndex: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.58)',
  },
  albumMeta: {
    padding: '24px 0 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  albumYear: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    color: C.muted,
  },
  albumTitle: {
    fontSize: '21px',             /* 21px / 32px lh */
    lineHeight: '32px',
    fontWeight: 600,
    color: C.text,
  },
  albumStream: {
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    color: C.accent,
    fontWeight: 500,
    textDecoration: 'none',
  },

  /* ── About ── */
  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: '847px 399px', /* 68% / 32% post-gutter */
    gap: '48px',
    alignItems: 'start',
  },
  aboutPhotoWrap: {
    position: 'relative',
  },
  aboutPhoto: {
    width: '100%',
    height: '627px',              /* 847 × 74% = 626.8 → 627px (tall landscape) */
    objectFit: 'cover',
    display: 'block',
    borderRadius: '2px',
  },
  photoCaption: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    color: C.muted,
    marginTop: '8px',
  },
  aboutText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingTop: '8px',
  },
  bioP: {
    fontSize: '16px',             /* 16px / 24px lh */
    lineHeight: '24px',
    color: C.text,
    opacity: 0.84,
  },
  pullQuote: {
    fontSize: '21px',             /* 21px / 32px lh */
    lineHeight: '32px',
    fontStyle: 'italic',
    color: C.accent,
    borderLeft: `2px solid ${C.accent}`,
    paddingLeft: '16px',
    margin: '8px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  pullCite: {
    fontSize: '11px',             /* 11px / 16px lh */
    lineHeight: '16px',
    fontStyle: 'normal',
    color: C.muted,
    fontWeight: 500,
    letterSpacing: '0.06em',
  },
  aboutLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
  },
  aboutLink: {
    fontSize: '13px',             /* 13px / 24px lh */
    lineHeight: '24px',
    color: C.accent,
    fontWeight: 500,
    textDecoration: 'none',
  },

  /* ── Merch ── */
  merchHeader: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: '48px',
  },
  viewAll: {
    fontSize: '13px',
    lineHeight: '24px',
    color: C.accent,
    textDecoration: 'none',
  },
  merchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  merchCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  merchImgWrap: {
    width: '100%',
    aspectRatio: '1 / 1',
    overflow: 'hidden',
    borderRadius: '2px',
    background: C.faint,
    marginBottom: '16px',
  },
  merchImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  merchName: {
    fontSize: '11px',             /* 11px / 16px lh — small label */
    lineHeight: '16px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: C.muted,
    marginBottom: '4px',
  },
  merchPrice: {
    fontSize: '34px',             /* 34px / 40px lh — price is the hero element */
    lineHeight: '40px',
    fontWeight: 700,
    color: C.text,
    marginBottom: '16px',
  },
  addToCart: {
    height: '40px',               /* 40px ✓ */
    padding: '0 20px',
    background: 'transparent',
    border: `1px solid ${C.border}`,
    color: C.text,
    fontSize: '13px',
    lineHeight: '24px',
    fontWeight: 500,
    borderRadius: '2px',
    cursor: 'pointer',
    width: '100%',
  },

  /* ── Footer ── */
  footer: {
    background: '#080A0E',
    borderTop: `1px solid ${C.border}`,
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    paddingTop: '64px',
    paddingBottom: '64px',
  },
  footerBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  footerLogo: {
    fontSize: '13px',
    lineHeight: '24px',
    fontWeight: 700,
    letterSpacing: '0.16em',
    color: C.text,
  },
  footerTagline: {
    fontSize: '13px',
    lineHeight: '24px',
    color: C.muted,
    fontStyle: 'italic',
  },
  footerLabel: {
    fontSize: '11px',
    lineHeight: '16px',
    color: C.faint,
    marginTop: '8px',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  footerColHead: {
    fontSize: '11px',
    lineHeight: '16px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: C.muted,
    marginBottom: '8px',
  },
  footerLink: {
    fontSize: '13px',
    lineHeight: '24px',
    color: C.muted,
    textDecoration: 'none',
  },
  copyrightBar: {
    borderTop: `1px solid ${C.border}`,
  },
  copyrightText: {
    display: 'block',
    fontSize: '11px',             /* 11px / 16px + 16px v-pad × 2 = 48px ✓ */
    lineHeight: '16px',
    color: C.faint,
    padding: '16px 0',
  },
}
