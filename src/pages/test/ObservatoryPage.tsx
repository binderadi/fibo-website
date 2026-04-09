import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'

/*
 * PARALLAX OBSERVATORY — Interactive version
 *
 * ─── COLOR: HSL 245° (Deep Space Indigo) ──────────────────────────────
 * FIBO shade steps L=6/10/16/26/42/58/74/84/90/94/100
 * Dark proportion  42/26/16/10/6: L=6 bg · L=10 surf · L=16 card · L=58 brand · L=74 glow
 * Light proportion 42/26/16/10/6: L=94 bg · white surf · L=26 ink · L=58 brand · L=74 glow
 * Opacity steps used: 84% scrim · 42% glass · 16% tag fills · 10% wash
 *
 * ─── CANVAS (1470×956, MacBook Air M4) ────────────────────────────────
 * Margin 88px (6%) · Content 1294px · F1=78 · F2=129 · F3=207 · F4=336 · F5=543
 *
 * ─── INTERACTIVE DESIGN DECISIONS ─────────────────────────────────────
 * All tap targets ≥ 32px × 32px (FIBO minimum, spacing.md ✓)
 * Animations via IntersectionObserver (not scroll events) for fade-ins
 * Scroll event (rAF-throttled) only for gallery parallax (inherently scroll-dependent)
 * prefers-reduced-motion: JS check + CSS @media block
 *
 * ─── GALLERY LAYOUT (FIBO grid ratios) ────────────────────────────────
 * Row 0 — Full width hero:             1294px × 543px (42% ratio)
 * Row 1 — F4+F5 asymmetric:            533px | 737px, height 312px (39×8 ✓)
 *   Post-gutter (24px): 1270px. Left: 1270×42%=533px. Right: remainder.
 * Row 2 — F1+F2+F3 three-way:          234px | 389px | 623px, height 264px (33×8 ✓)
 *   Post-gutter (48px): 1246px. 6:10:16 ratio → 234/389/623px.
 * Row 3 — F5+F4 reversed:              737px | 533px, height 312px
 * Row 4 — Three equal:                 repeat(3,1fr) ≈ 415px, height 280px (35×8 ✓)
 * Row 5 — Cinematic full width:        1294px × 336px (26% ratio, 42×8 ✓)
 * Images: position absolute, top:-15%, height:130% for parallax buffer
 *
 * ─── COMPONENT HEIGHTS (all on 8px grid) ──────────────────────────────
 * Back nav / section links: 48px · CTA/input: 56px · Table row: 40px
 * Table header: 32px · Status tag: 24px · Flip hint btn: 32px
 */

// ─── INJECTED KEYFRAMES ────────────────────────────────────────────────
const ANIM_CSS = `
  @keyframes starPulse {
    0%, 100% { opacity: 0.06; }
    50%       { opacity: 0.90; }
  }
  @keyframes dotPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(0.55); opacity: 0.25; }
  }
  @keyframes panSky {
    from { transform: translateX(0); }
    to   { transform: translateX(-16.67%); }
  }
  @keyframes lbFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lbImgIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    .obs-star { animation: none !important; opacity: 0.25 !important; }
    .obs-dot  { animation: none !important; }
    .obs-pan  { animation: none !important; }
  }
`

// ─── DETERMINISTIC STARS (module-level, stable across renders) ─────────
const STARS = Array.from({ length: 80 }, (_, i) => ({
  x:   (i * 7919 + 13) % 97,
  y:   (i * 3571 +  7) % 89,
  sz:  1 + (i * 1201) % 3,
  del: +((i * 0.17) % 8).toFixed(2),
  dur: 4 + (i * 1201) % 5,
}))

// ─── COLOR TOKENS ─────────────────────────────────────────────────────
const C = {
  darkBg:      'hsl(245, 58%,  6%)',
  darkSurf:    'hsl(245, 40%, 10%)',
  darkCard:    'hsl(245, 30%, 16%)',
  darkBorder:  'hsl(245, 22%, 26%)',
  darkMuted:   'hsl(245, 18%, 42%)',
  brand:       'hsl(245, 74%, 58%)',
  glow:        'hsl(245, 84%, 74%)',
  l90:         'hsl(245, 20%, 90%)',
  lightBg:     'hsl(245, 16%, 94%)',
  white:       '#fff',
  darkText:    'hsl(245, 84%, 96%)',
  darkSub:     'hsl(245, 42%, 74%)',
  ink:         'hsl(245, 22%, 26%)',
  inkSub:      'hsl(245, 18%, 42%)',
  lightBorder: 'hsl(245, 20%, 90%)',
  green:       'hsl(141, 58%, 36%)',
  amber:       'hsl(38,  84%, 40%)',
  teal:        'hsl(175, 74%, 36%)',
} as const

// ─── DATA ──────────────────────────────────────────────────────────────

const discoveries = [
  {
    id: 'PAR-1127b', year: 2019, status: 'Confirmed',
    img: 'https://images.unsplash.com/photo-1614726365952-510103b1aeb4?w=600&q=80',
    mass: '1.82', period: '24.3', temp: '312 K', distance: '12.4 ly',
    method: 'Transit Photometry',
    atm: [{ m: 'H₂O', p: 32 }, { m: 'N₂', p: 58 }, { m: 'CO₂', p: 8 }, { m: 'O₂', p: 2 }],
    note: 'First biosignature candidate detected from Atacama.',
    parallax: 0.04,
  },
  {
    id: 'PAR-0892c', year: 2021, status: 'Habitable Zone',
    img: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80',
    mass: '3.21', period: '67.8', temp: '266 K', distance: '28.7 ly',
    method: 'Radial Velocity',
    atm: [{ m: 'H₂', p: 74 }, { m: 'He', p: 18 }, { m: 'N₂', p: 7 }, { m: 'CH₄', p: 1 }],
    note: 'Orbits within the habitable zone at 0.21 AU.',
    parallax: 0.02,
  },
  {
    id: 'PAR-2241d', year: 2022, status: 'Candidate',
    img: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=80',
    mass: '0.94', period: '142.1', temp: '198 K', distance: '41.3 ly',
    method: 'Direct Imaging',
    atm: [{ m: 'CO₂', p: 95 }, { m: 'N₂', p: 4 }, { m: 'Ar', p: 1 }],
    note: 'Coldest M-dwarf candidate in the AURORA catalogue.',
    parallax: 0.05,
  },
  {
    id: 'PAR-0456e', year: 2023, status: 'Under Review',
    img: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&q=80',
    mass: '5.73', period: '31.5', temp: '418 K', distance: '8.9 ly',
    method: 'Transit + Radial Velocity',
    atm: [{ m: 'H₂', p: 88 }, { m: 'He', p: 11 }, { m: 'CH₄', p: 1 }],
    note: 'Nearest AURORA target; peer review ongoing.',
    parallax: 0.03,
  },
]

const statusColor: Record<string, string> = {
  'Confirmed':      C.green,
  'Habitable Zone': C.teal,
  'Candidate':      C.amber,
  'Under Review':   C.brand,
}

const milestones = [
  {
    year: '1987', title: 'First Light',
    body: 'Observatory founded at Cerro Parallax. First light captures the Magellanic Clouds at unprecedented resolution.',
    detail: 'The 3.5m primary mirror, ground to λ/25 precision at ZEISS Optik, captured Alpha Centauri at signal-to-noise 40% above design specs. The site at 2,847m was chosen for 330+ photometric nights per year — among the best on Earth. First published image appeared on the cover of The Messenger (ESO) January 1988.',
  },
  {
    year: '1995', title: 'First Exoplanet Detection',
    body: 'Radial velocity measurements of HD 40307 reveal a 25 m/s Doppler shift — first Parallax exoplanet candidate.',
    detail: 'A body 6.4× Earth mass orbiting at 0.08 AU. Published in ApJ Letters, it was the southernmost confirmed exoplanet detection in history at the time. The Doppler technique required 18 months of nightly observations across three instrument configurations.',
  },
  {
    year: '2003', title: 'Adaptive Optics Online',
    body: 'PALS-1 triples angular resolution to 0.08 arcseconds in near-infrared. First stellar coronagraph installed.',
    detail: 'The Shack-Hartmann wavefront sensor paired with 241 deformable mirror actuators corrects atmospheric distortion 500 times per second. Coronagraphic imaging enables detection of companions 10⁶× fainter than host stars — a prerequisite for AURORA Phase 2.',
  },
  {
    year: '2012', title: 'AURORA Conceived',
    body: 'Dr. Elena Vasquez secures €12M ESO co-funding. Phase 1 targets 50 red dwarf systems within 50 light-years.',
    detail: 'The AURORA proposal received the maximum ESO review panel score — a first in the committee\'s 47-year history. Co-funding included ALMA archival access and 200 nights at La Silla. Vasquez\'s keynote at IAU Prague 2012 became the most-cited presentation of the conference.',
  },
  {
    year: '2019', title: 'PAR-1127b Atmosphere Imaged',
    body: 'Direct spectroscopy reveals H₂O and methane absorption lines — first confirmed biosignature candidate.',
    detail: '340 hours of integration across three seasons. Independent confirmation at Keck NIRC2. Nature ran the finding as the 14 November 2019 cover — the first southern-hemisphere biosignature candidate in the journal. Citation count reached 2,400 within 18 months.',
  },
  {
    year: '2024', title: 'AURORA Phase 2 Launch',
    body: 'Six-channel spectrograph for oxygen and ozone expands survey to 127 systems across the southern sky.',
    detail: 'Phase 2 uses photonic lantern IFUs to suppress stellar contamination by a factor of 10⁶ — one thousand times better than Phase 1. The oxygen detection threshold is now equivalent to Earth\'s atmospheric concentration at sea level. First results expected Q3 2026.',
  },
]

const team = [
  { name: 'Dr. Elena Vasquez',   title: 'Director',             spec: 'Exoplanet Atmospheric Spectroscopy', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', pub: '"Direct spectroscopic detection of H₂O in PAR-1127b" — Nature, Nov 2019', focus: 'Leading the 127-system AURORA Phase 2 biosignature survey' },
  { name: 'Dr. James Okafor',    title: 'Spectroscopy Lead',    spec: 'Near-Infrared Spectral Analysis',    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', pub: '"Near-infrared methane bands in M-dwarf exoplanet atmospheres" — A&A, 2022', focus: 'Methane and ammonia band analysis across 40+ candidate spectra' },
  { name: 'Dr. Mei-Lin Chen',    title: 'Exoplanet Atmospheres', spec: 'Biosignature Detection',            img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', pub: '"Statistical framework for biosignature candidate scoring" — ApJ, 2021', focus: 'Developing false-positive rejection models for AURORA data pipeline' },
  { name: 'Dr. Raj Patel',       title: 'Instrumentation',      spec: 'Adaptive Optics Systems',           img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', pub: '"PALS-3: Next-generation photonic adaptive optics at Parallax" — PASP, 2023', focus: 'Commissioning the photonic lantern IFU for Phase 2 observations' },
  { name: 'Dr. Sofia Andersson', title: 'Data Analysis',        spec: 'Machine Learning & Signal Processing', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', pub: '"Machine learning classification of exoplanet atmospheric spectra" — MNRAS, 2022', focus: 'Training neural classifiers on 14 years of Parallax spectrograph data' },
]

const catalogue = [
  { des: 'PAR-0023a', mass: '0.72', rad: '0.94', per: '18.4',  tmp: '341', dst: '4.2',  yr: 1995, status: 'Confirmed' },
  { des: 'PAR-0156b', mass: '1.45', rad: '1.12', per: '89.7',  tmp: '287', dst: '11.8', yr: 2003, status: 'Confirmed' },
  { des: 'PAR-0456e', mass: '5.73', rad: '1.87', per: '31.5',  tmp: '418', dst: '8.9',  yr: 2023, status: 'Under Review' },
  { des: 'PAR-0892c', mass: '3.21', rad: '1.58', per: '67.8',  tmp: '266', dst: '28.7', yr: 2021, status: 'Habitable Zone' },
  { des: 'PAR-1127b', mass: '1.82', rad: '1.23', per: '24.3',  tmp: '312', dst: '12.4', yr: 2019, status: 'Confirmed' },
  { des: 'PAR-1634d', mass: '2.46', rad: '1.41', per: '203.6', tmp: '241', dst: '19.3', yr: 2017, status: 'Confirmed' },
  { des: 'PAR-1891a', mass: '0.58', rad: '0.87', per: '9.2',   tmp: '512', dst: '6.7',  yr: 2014, status: 'Confirmed' },
  { des: 'PAR-2241d', mass: '0.94', rad: '0.98', per: '142.1', tmp: '198', dst: '41.3', yr: 2022, status: 'Candidate' },
  { des: 'PAR-2567c', mass: '4.12', rad: '1.72', per: '58.4',  tmp: '285', dst: '33.8', yr: 2020, status: 'Candidate' },
  { des: 'PAR-2891b', mass: '1.18', rad: '1.08', per: '36.7',  tmp: '294', dst: '22.1', yr: 2018, status: 'Confirmed' },
]

const targets = [
  { name: 'PAR-1127 System', type: 'Red dwarf + 2 confirmed planets', ra: '04h 13m 22.4s', dec: '−23° 41′ 18″', mag: '8.4', window: '22:15 − 03:47 UTC', inst: 'PALS-3 + AURORA Spectrograph' },
  { name: 'PAR-0892 System', type: 'M-type host, habitable zone candidate', ra: '11h 47m 08.9s', dec: '−31° 12′ 54″', mag: '10.2', window: '20:00 − 00:30 UTC', inst: 'AURORA Spectrograph Ch. 4' },
  { name: 'NGC 2748', type: 'Background galaxy, flux calibration', ra: '09h 13m 42.1s', dec: '+76° 28′ 06″', mag: '11.8', window: '23:30 − 05:15 UTC', inst: 'PALS-3 Wide Field' },
]

// ─── GALLERY (12 images, 6 row types) ─────────────────────────────────
const GALLERY = [
  // Row 0: full-width hero
  { src: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1400&q=80', title: 'NGC 3372 — Carina Nebula Wide Field', date: '14 Mar 2022', inst: 'PALS-3 · Wide Field', speed: 0.02 },
  // Row 1: F4+F5 asymmetric (533px | 737px)
  { src: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80',   title: 'Centaurus A — Elliptical Core', date: '07 Jun 2021', inst: 'PALS-3 · Coronagraph', speed: 0.04 },
  { src: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?w=800&q=80',   title: 'SN 2016bkv — Supernova Remnant', date: '29 Nov 2021', inst: 'AURORA Spectrograph', speed: 0.02 },
  // Row 2: F1+F2+F3 three-way (234px | 389px | 623px)
  { src: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&q=80',   title: 'PAR-0456 System — Host Star', date: '01 Apr 2020', inst: 'PALS-2 · Planetary Mode', speed: 0.06 },
  { src: 'https://images.unsplash.com/photo-1614726365952-510103b1aeb4?w=500&q=80',   title: 'Gas Giant Survey — PAR-0892', date: '18 Sep 2020', inst: 'PALS-2 · Planetary Mode', speed: 0.03 },
  { src: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=700&q=80',   title: 'Terrestrial Candidate PAR-2241', date: '23 Feb 2019', inst: 'PALS-2 · Infrared', speed: 0.02 },
  // Row 3: F5+F4 reversed (737px | 533px)
  { src: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&q=80',   title: 'Atacama Zenith — Milky Way Core', date: '06 Oct 2023', inst: 'PALS-3 · Wide Field', speed: 0.03 },
  { src: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&q=80',   title: 'Cerro Parallax — Primary Dome', date: '12 May 2023', inst: 'Staff Documentation', speed: 0.05 },
  // Row 4: three equal
  { src: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&q=80',   title: 'Southern Auroral Oval — Atacama', date: '15 Apr 2023', inst: 'Staff Documentation', speed: 0.02 },
  { src: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&q=80',   title: 'Scorpius Field — H-alpha Survey', date: '30 Jul 2022', inst: 'PALS-3 · H-alpha Filter', speed: 0.04 },
  { src: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500&q=80',   title: 'Solar Chromosphere — Eclipse 2019', date: '02 Jul 2019', inst: 'Transit Camera Array', speed: 0.02 },
  // Row 5: cinematic full width
  { src: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?w=1400&q=80', title: 'Comet C/2022 J2 — Perihelion Approach', date: '11 Jan 2024', inst: 'PALS-3 + AURORA Spectrograph', speed: 0.01 },
]

// ─── TABLE COL MAP ─────────────────────────────────────────────────────
const TABLE_COLS = [
  { label: 'Designation', key: 'des', align: 'left'  as const },
  { label: 'Mass (M⊕)',   key: 'mass', align: 'right' as const },
  { label: 'Radius (R⊕)', key: 'rad', align: 'right' as const },
  { label: 'Period (d)',  key: 'per', align: 'right' as const },
  { label: 'Temp (K)',    key: 'tmp', align: 'right' as const },
  { label: 'Dist (ly)',   key: 'dst', align: 'right' as const },
  { label: 'Year',        key: 'yr',  align: 'right' as const },
  { label: 'Status',      key: 'status', align: 'left' as const },
]

// ─── COUNT-UP HOOK ─────────────────────────────────────────────────────
function useCountUp(target: number, duration: number, active: boolean, instant: boolean) {
  const [value, setValue] = useState(instant ? target : 0)
  useEffect(() => {
    if (instant) { setValue(target); return }
    if (!active) return
    let raf: number
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, instant, target, duration])
  return value
}

// ─── COMPONENT ─────────────────────────────────────────────────────────
export default function ObservatoryPage() {

  // ── Motion preference
  const [reducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  // ── Counter
  const [heroInView, setHeroInView] = useState(false)
  const heroStatEl = useRef<HTMLDivElement>(null)
  const exoCount   = useCountUp(4247, 2000, heroInView, reducedMotion)
  const yrsCount   = useCountUp(37,   1500, heroInView, reducedMotion)

  // ── Mission phase cycling
  const PHASES = ['Phase 1', 'Phase 2', 'Phase 3'] as const
  const [phaseIdx,          setPhaseIdx]          = useState(1)
  const [phaseTransitioning, setPhaseTransitioning] = useState(false)
  const cyclePhase = () => {
    if (reducedMotion) { setPhaseIdx(i => (i + 1) % 3); return }
    setPhaseTransitioning(true)
    setTimeout(() => { setPhaseIdx(i => (i + 1) % 3); setPhaseTransitioning(false) }, 150)
  }

  // ── Discovery card flip
  const [hoveredDisc, setHoveredDisc] = useState<string | null>(null)
  const [lockedDisc,  setLockedDisc]  = useState<Set<string>>(new Set())
  const isFlipped = (id: string) => lockedDisc.has(id) || hoveredDisc === id

  // ── Timeline expand
  const [expandedMs,    setExpandedMs]    = useState<number | null>(null)
  const [milestoneInView, setMilestoneInView] = useState<boolean[]>(new Array(6).fill(false))
  const milestoneEls = useRef<Array<HTMLDivElement | null>>(new Array(6).fill(null))

  // ── Table sort/filter
  const [search,   setSearch]   = useState('')
  const [sortKey,  setSortKey]  = useState('des')
  const [sortDir,  setSortDir]  = useState<'asc' | 'desc'>('asc')
  const handleSort = (key: string) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }
  const sortArrow = (key: string) =>
    sortKey !== key ? ' ↕' : sortDir === 'asc' ? ' ↑' : ' ↓'

  const filteredCatalogue = useMemo(() => {
    const q = search.toLowerCase()
    let rows = catalogue.filter(r =>
      !q || r.des.toLowerCase().includes(q) || r.status.toLowerCase().includes(q)
    )
    rows.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey] as string | number
      const bv = (b as Record<string, unknown>)[sortKey] as string | number
      const an = parseFloat(String(av)), bn = parseFloat(String(bv))
      const cmp = !isNaN(an) && !isNaN(bn) ? an - bn : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [search, sortKey, sortDir])

  // ── Team tooltip (position:fixed per FIBO feedback memory)
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null)

  // ── Gallery lightbox
  const [lbIdx, setLbIdx] = useState<number | null>(null)

  // ── Section visibility (scroll fade-in)
  const [secVis, setSecVis] = useState<Record<string, boolean>>({})
  const secEls = useRef<Record<string, HTMLElement | null>>({})

  // ── Gallery parallax element
  const galleryEl = useRef<HTMLElement | null>(null)

  // ── Email
  const [email,     setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  // ── Effects ──────────────────────────────────────────────────────────

  // Section fade-in observer
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const k = (e.target as HTMLElement).dataset.sec
          if (k) setSecVis(p => ({ ...p, [k]: true }))
        }
      })
    }, { threshold: 0.08 })

    Object.values(secEls.current).forEach(el => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  // Hero stat counter observer
  useEffect(() => {
    if (!heroStatEl.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setHeroInView(true); obs.disconnect() }
    }, { threshold: 0.5 })
    obs.observe(heroStatEl.current)
    return () => obs.disconnect()
  }, [])

  // Milestone stagger observer
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const i = parseInt((e.target as HTMLElement).dataset.midx || '0')
          setMilestoneInView(prev => { const next = [...prev]; next[i] = true; return next })
        }
      })
    }, { threshold: 0.2 })
    milestoneEls.current.forEach(el => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lbIdx === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLbIdx(i => i !== null ? Math.min(i + 1, GALLERY.length - 1) : null)
      if (e.key === 'ArrowLeft')  setLbIdx(i => i !== null ? Math.max(i - 1, 0) : null)
      if (e.key === 'Escape')     setLbIdx(null)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [lbIdx])

  // Gallery parallax (scroll event, rAF-throttled — inherently scroll-dependent)
  useEffect(() => {
    if (reducedMotion || !galleryEl.current) return
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!galleryEl.current) return
          const top = galleryEl.current.getBoundingClientRect().top + window.scrollY
          const rel = window.scrollY - top + window.innerHeight
          const imgs = galleryEl.current.querySelectorAll<HTMLElement>('[data-pspeed]')
          imgs.forEach(img => {
            const sp = parseFloat(img.dataset.pspeed || '0')
            img.style.transform = `translateY(${rel * sp}px)`
          })
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reducedMotion])

  // ── Helpers ──────────────────────────────────────────────────────────
  const setSec = (k: string) => (el: HTMLElement | null) => { secEls.current[k] = el }

  const fadeStyle = (k: string): React.CSSProperties => ({
    opacity:    secVis[k] ? 1 : 0,
    transform:  secVis[k] ? 'none' : 'translateY(24px)',
    transition: reducedMotion ? 'none' : 'opacity 0.7s ease, transform 0.7s ease',
  })

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })

  const milestoneStyle = (i: number): React.CSSProperties => ({
    opacity:    milestoneInView[i] ? 1 : 0,
    transform:  milestoneInView[i] ? 'none' : (i % 2 === 0 ? 'translateX(-24px)' : 'translateX(24px)'),
    transition: reducedMotion ? 'none' : `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
  })

  // ── JSX ──────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <style>{ANIM_CSS}</style>

      {/* ── BACK NAV + SECTION LINKS ──────────────────────────── */}
      {/* Height: 13px/24px lh + 12px×2 = 48px ✓. Tap targets: 32px ✓ */}
      <div style={s.backNav}>
        <div style={{ ...s.wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={s.backLink}>← FIBO</Link>
            <span style={s.slash}>/</span>
            <span style={s.backCrumb}>Parallax Observatory</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[['Mission','mission'],['Discoveries','discoveries'],['Gallery','gallery'],['Data','table']].map(([lbl,id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={s.navBtn}>{lbl}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO ──────────────────────────────────────────────── */}
      {/* Dark. 616px tall (77×8 ✓). Stars (CSS-only). Counter on scroll. */}
      <section style={s.hero}>
        <div style={s.heroImg} />
        <div style={s.heroOverlay} />

        {/* Star field — 80 deterministic particles, CSS animated */}
        <div style={s.starField} aria-hidden="true">
          {STARS.map(st => (
            <span
              key={st.x + '-' + st.y}
              className="obs-star"
              style={{
                position: 'absolute',
                left: `${st.x}%`, top: `${st.y}%`,
                width: `${st.sz}px`, height: `${st.sz}px`,
                borderRadius: '50%', background: '#fff',
                animationDelay: `${st.del}s`,
                animation: reducedMotion ? 'none' : `starPulse ${st.dur}s ease-in-out ${st.del}s infinite`,
              }}
            />
          ))}
        </div>

        <div style={{ ...s.wrap, ...s.heroContent }}>
          <div style={s.heroLeft}>
            <div style={s.heroEyebrow}>Deep Space Research · Atacama Desert, Chile</div>
            <h1 style={s.heroName}>Parallax</h1>
            <p style={s.heroTagline}>Mapping the deep field since 1987</p>
            <div style={s.heroSecRow}>
              <span style={s.heroSecNum}>{yrsCount}</span>
              <span style={s.heroSecLabel}> years of continuous observation</span>
            </div>
          </div>
          <div ref={heroStatEl} style={s.heroRight}>
            <div style={s.heroStatNum}>{exoCount.toLocaleString()}</div>
            <div style={s.heroStatLabel}>confirmed exoplanets</div>
            <div style={s.heroStatSub}>in the Parallax catalogue</div>
          </div>
        </div>
      </section>

      {/* ── CURRENT MISSION ───────────────────────────────────── */}
      {/* Light. Phase cycling. Pulsing dot on status row. */}
      <section
        id="mission"
        ref={setSec('mission')}
        data-sec="mission"
        style={{ ...s.mission, ...fadeStyle('mission') }}
      >
        <div style={s.wrap}>
          <div style={s.missionGrid}>
            <div>
              <div style={s.eyebrow}>Current Mission</div>
              <h2 style={{ ...s.h2light, margin: '0 0 8px' }}>AURORA</h2>
              <p style={s.missionAcronym}>Advanced Ultra-deep Reconnaissance of Oscillating Red Atmospheres</p>
              <p style={s.body}>The AURORA programme surveys red dwarf star systems within 50 light-years of Earth, searching for atmospheric biosignatures that could indicate the presence of life. Red dwarf stars are the most common in the galaxy, and their compact habitable zones allow ground-based spectroscopic observation with current technology.</p>
              <p style={s.body}>Phase 2, launched March 2024, deploys a six-channel spectrograph tuned to oxygen (760 nm), ozone (550 nm), water vapour (940 nm), methane (2.3 μm), and CO₂ (4.3 μm). Each target receives a minimum 120-hour integration window per season.</p>
              <p style={{ ...s.body, marginBottom: 0 }}>Operating in partnership with the European Southern Observatory and the Atacama Millimeter Array, with co-investigators in twelve countries.</p>
            </div>

            {/* Dark mission card on light section — proportion working in reverse ✓ */}
            <div style={s.missionCard}>
              <div style={s.missionCardHead}>Mission Parameters</div>
              {[
                { label: 'Mission name',    value: 'AURORA Phase 2', interactive: false },
                { label: 'Launch date',     value: 'March 2024',     interactive: false },
                { label: 'Duration',        value: '8 years',        interactive: false },
                { label: 'Survey radius',   value: '≤ 50 light-years', interactive: false },
                { label: 'Nearest target',  value: '12.4 ly (PAR-1127)', interactive: false },
                { label: 'Instruments',     value: '6-channel Spectrograph', interactive: false },
                { label: 'Systems surveyed', value: '127 red dwarf targets', interactive: false },
              ].map(row => (
                <div key={row.label} style={s.missionRow}>
                  <span style={s.missionLabel}>{row.label}</span>
                  <span style={s.missionValue}>{row.value}</span>
                </div>
              ))}

              {/* Interactive status row — click to cycle phases */}
              {/* Tap target: full row height ≥ 40px ✓ */}
              <div
                style={{ ...s.missionRow, cursor: 'pointer', borderBottom: 'none' }}
                onClick={cyclePhase}
                title="Click to cycle mission phases"
              >
                <span style={s.missionLabel}>Status</span>
                <span style={{
                  ...s.missionValue,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  opacity: phaseTransitioning ? 0 : 1,
                  transition: reducedMotion ? 'none' : 'opacity 0.15s ease',
                }}>
                  <span
                    className="obs-dot"
                    style={{
                      display: 'inline-block', width: '8px', height: '8px',
                      borderRadius: '50%', background: C.green, flexShrink: 0,
                      animation: reducedMotion ? 'none' : 'dotPulse 2s ease-in-out infinite',
                    }}
                  />
                  Active — {PHASES[phaseIdx]}
                </span>
              </div>
              <div style={{ fontSize: '10px', lineHeight: '16px', color: C.darkBorder, marginTop: '12px', textAlign: 'center' }}>
                ↻ click status to cycle phases
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCOVERIES GRID ──────────────────────────────────── */}
      {/* Dark. Cards flip on hover (hover=temp, click=lock). */}
      {/* Card flip: perspective + rotateY + backface-visibility (CSS 3D). */}
      <section
        id="discoveries"
        ref={setSec('discoveries')}
        data-sec="discoveries"
        style={{ ...s.discoveries, ...fadeStyle('discoveries') }}
      >
        <div style={s.wrap}>
          <div style={s.eyebrowDark}>Key Discoveries</div>
          <h2 style={{ ...s.h2dark, marginBottom: '48px' }}>Confirmed Worlds</h2>
          <div style={s.discGrid}>
            {discoveries.map(d => {
              const flipped = isFlipped(d.id)
              return (
                <div
                  key={d.id}
                  style={{ ...s.discCard, perspective: '900px' }}
                  onMouseEnter={() => setHoveredDisc(d.id)}
                  onMouseLeave={() => setHoveredDisc(null)}
                  onClick={() => setLockedDisc(prev => {
                    const next = new Set(prev)
                    next.has(d.id) ? next.delete(d.id) : next.add(d.id)
                    return next
                  })}
                >
                  {/* Inner — rotates on flip */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    transformStyle: 'preserve-3d',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: reducedMotion ? 'none' : 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                    cursor: 'pointer',
                  }}>

                    {/* ── FRONT ── */}
                    <div style={{ backfaceVisibility: 'hidden', position: 'relative' }}>
                      {/* Square image (100% ratio) */}
                      <div style={s.discImgWrap}>
                        <img src={d.img} alt={d.id} style={s.discImg}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        {/* Hover hint overlay */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: `${C.darkBg}42`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: flipped || hoveredDisc !== d.id ? 0 : 1,
                          transition: reducedMotion ? 'none' : 'opacity 0.2s ease',
                          pointerEvents: 'none',
                        }}>
                          <span style={{ fontSize: '21px', lineHeight: '32px', color: C.white }}>↻</span>
                        </div>
                      </div>
                      <div style={s.discContent}>
                        <div style={s.discId}>{d.id}</div>
                        <div style={s.discStats}>
                          {[
                            { l: 'Mass', v: d.mass }, { l: 'Period', v: d.period },
                            { l: 'Temp', v: d.temp }, { l: 'Distance', v: d.distance },
                          ].map(r => (
                            <div key={r.l} style={s.discStatRow}>
                              <span style={s.discStatLabel}>{r.l}</span>
                              <span style={s.discStatValue}>{r.v}</span>
                            </div>
                          ))}
                        </div>
                        <div style={s.discFooter}>
                          <span style={s.discYear}>{d.year}</span>
                          <span style={{ ...s.discTag, background: statusColor[d.status] + '29', color: statusColor[d.status], border: `1px solid ${statusColor[d.status]}42` }}>
                            {d.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ── BACK ── */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: C.darkSurf,
                      padding: '20px',
                      display: 'flex', flexDirection: 'column', justifyContent: 'center',
                      gap: '16px',
                    }}>
                      <div style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 700, color: C.darkText, fontFamily: 'ui-monospace,monospace' }}>{d.id}</div>

                      {/* Atmospheric composition */}
                      <div>
                        <div style={{ fontSize: '10px', lineHeight: '16px', color: C.glow, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>Atmosphere</div>
                        {d.atm.map(a => (
                          <div key={a.m} style={{ marginBottom: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                              <span style={{ fontSize: '11px', lineHeight: '16px', color: C.darkSub }}>{a.m}</span>
                              <span style={{ fontSize: '11px', lineHeight: '16px', color: C.darkText, fontWeight: 600 }}>{a.p}%</span>
                            </div>
                            <div style={{ height: '4px', background: C.darkCard, borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: reducedMotion ? `${a.p}%` : `${a.p}%`,
                                background: C.brand,
                                transition: reducedMotion ? 'none' : 'width 0.4s ease',
                              }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <div style={{ fontSize: '10px', lineHeight: '16px', color: C.glow, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>Discovery Method</div>
                        <div style={{ fontSize: '13px', lineHeight: '24px', color: C.darkText, fontWeight: 500 }}>{d.method}</div>
                      </div>

                      <div style={{ fontSize: '11px', lineHeight: '16px', color: C.darkMuted, fontStyle: 'italic' }}>{d.note}</div>

                      <div style={{ fontSize: '11px', lineHeight: '16px', color: C.brand, fontWeight: 600, cursor: 'pointer' }}>View full data →</div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: '11px', lineHeight: '16px', color: C.darkMuted, textAlign: 'center', marginTop: '16px' }}>
            Hover to flip · Click to lock
          </p>
        </div>
      </section>

      {/* ── RESEARCH TIMELINE ─────────────────────────────────── */}
      {/* Light. Milestones stagger-fade from left/right on scroll. */}
      {/* Click to expand additional detail. */}
      <section
        ref={setSec('timeline')}
        data-sec="timeline"
        style={{ ...s.timeline, ...fadeStyle('timeline') }}
      >
        <div style={s.wrap}>
          <div style={s.eyebrow}>History</div>
          <h2 style={s.h2light}>37 Years of Discovery</h2>
          <div style={s.tlList}>
            {milestones.map((m, i) => {
              const isOdd = i % 2 === 0
              const dateEl = (
                <div style={isOdd ? s.tlDateLeft : s.tlDateRight}>
                  <span style={s.tlYear}>{m.year}</span>
                </div>
              )
              const contentEl = (
                <div
                  style={{ ...(isOdd ? s.tlContentRight : s.tlContentLeft), cursor: 'pointer' }}
                  onClick={() => setExpandedMs(prev => prev === i ? null : i)}
                >
                  <div style={s.tlTitle}>{m.title}</div>
                  <div style={s.tlBody}>{m.body}</div>
                  {/* Expandable detail — max-height transition */}
                  <div style={{
                    maxHeight: expandedMs === i ? '160px' : '0',
                    overflow: 'hidden',
                    transition: reducedMotion ? 'none' : 'max-height 0.4s ease',
                  }}>
                    <div style={{ paddingTop: '8px', fontSize: '13px', lineHeight: '24px', color: C.inkSub, fontStyle: 'italic' }}>
                      {m.detail}
                    </div>
                  </div>
                  <div style={{ fontSize: '10px', lineHeight: '16px', color: C.brand, marginTop: '8px', letterSpacing: '0.08em' }}>
                    {expandedMs === i ? '↑ less' : '↓ more'}
                  </div>
                </div>
              )
              return (
                <div
                  key={m.year}
                  ref={el => { milestoneEls.current[i] = el }}
                  data-midx={String(i)}
                  style={{ ...s.tlRow, ...milestoneStyle(i) }}
                >
                  {isOdd ? dateEl : contentEl}
                  <div style={s.tlConnector}>
                    <div style={s.tlLine} />
                    <div style={s.tlDot} />
                  </div>
                  {isOdd ? contentEl : dateEl}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────── */}
      {/* Light. Hover portrait → tooltip card (position:fixed per FIBO memory). */}
      <section
        ref={setSec('team')}
        data-sec="team"
        style={{ ...s.teamSection, ...fadeStyle('team') }}
      >
        <div style={s.wrap}>
          <div style={s.eyebrow}>Research Team</div>
          <h2 style={s.h2light}>The People Behind the Data</h2>
          <div style={s.teamGrid}>
            {team.map(p => (
              <div
                key={p.name}
                style={s.teamCard}
                onMouseEnter={e => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                  setTooltip({ name: p.name, x: rect.left + rect.width / 2, y: rect.top })
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* 68% portrait ratio — tall portrait (testing) */}
                <div style={s.teamImgWrap}>
                  <img src={p.img} alt={p.name} style={s.teamImg}
                    onError={e => { (e.target as HTMLImageElement).style.background = '#d0d0e0' }} />
                </div>
                <div style={s.teamInfo}>
                  <div style={s.teamName}>{p.name}</div>
                  <div style={s.teamTitle}>{p.title}</div>
                  <div style={s.teamSpec}>{p.spec}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMAGE ARCHIVE (GALLERY) ───────────────────────────── */}
      {/* Dark. 12 images, FIBO grid rows. Parallax via data-pspeed attr. */}
      {/* Lightbox on click. Keyboard: ←/→ navigate, Esc close. */}
      <section
        id="gallery"
        ref={el => {
          setSec('gallery')(el)
          galleryEl.current = el
        }}
        data-sec="gallery"
        style={{ ...s.gallerySection, ...fadeStyle('gallery') }}
      >
        <div style={s.wrap}>
          <div style={s.eyebrowDark}>Image Archive</div>
          <h2 style={{ ...s.h2dark, marginBottom: '40px' }}>Visual Observations</h2>
        </div>

        {/* All 6 rows at full section width (no wrap padding — edge-to-edge images) */}
        <div style={{ padding: '0 88px', maxWidth: '1470px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>

          {/* Row 0: full-width hero — 1294×543px (42% ratio) */}
          <div style={{ width: '100%', height: '543px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => setLbIdx(0)}>
            <img src={GALLERY[0].src} alt={GALLERY[0].title} data-pspeed={GALLERY[0].speed}
              style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover', display: 'block' }} />
            <div style={s.galleryCapHover}><span style={s.galleryCap}>{GALLERY[0].title}</span></div>
          </div>

          {/* Row 1: F4+F5 asymmetric — 533px | 737px, height 312px (39×8 ✓) */}
          {/* Post-gutter 24px: 1270px. Left F5: 1270×42%=533px. Right: remainder. */}
          <div style={{ display: 'grid', gridTemplateColumns: '533px 1fr', gap: '8px', height: '312px' }}>
            {[1, 2].map(idx => (
              <div key={idx} style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLbIdx(idx)}>
                <img src={GALLERY[idx].src} alt={GALLERY[idx].title} data-pspeed={GALLERY[idx].speed}
                  style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover', display: 'block' }} />
                <div style={s.galleryCapHover}><span style={s.galleryCap}>{GALLERY[idx].title}</span></div>
              </div>
            ))}
          </div>

          {/* Row 2: F1+F2+F3 three-way — 234px | 389px | remainder, height 264px (33×8 ✓) */}
          {/* Post-gutter 16px: 1246px. Ratios 6:10:16 → 234 : 389 : 623px. */}
          <div style={{ display: 'grid', gridTemplateColumns: '234px 389px 1fr', gap: '8px', height: '264px' }}>
            {[3, 4, 5].map(idx => (
              <div key={idx} style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLbIdx(idx)}>
                <img src={GALLERY[idx].src} alt={GALLERY[idx].title} data-pspeed={GALLERY[idx].speed}
                  style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover', display: 'block' }} />
                <div style={s.galleryCapHover}><span style={s.galleryCap}>{GALLERY[idx].title}</span></div>
              </div>
            ))}
          </div>

          {/* Row 3: F5+F4 reversed — 1fr | 533px, height 312px */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 533px', gap: '8px', height: '312px' }}>
            {[6, 7].map(idx => (
              <div key={idx} style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLbIdx(idx)}>
                <img src={GALLERY[idx].src} alt={GALLERY[idx].title} data-pspeed={GALLERY[idx].speed}
                  style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover', display: 'block' }} />
                <div style={s.galleryCapHover}><span style={s.galleryCap}>{GALLERY[idx].title}</span></div>
              </div>
            ))}
          </div>

          {/* Row 4: three equal — repeat(3,1fr), height 280px (35×8 ✓) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', height: '280px' }}>
            {[8, 9, 10].map(idx => (
              <div key={idx} style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLbIdx(idx)}>
                <img src={GALLERY[idx].src} alt={GALLERY[idx].title} data-pspeed={GALLERY[idx].speed}
                  style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover', display: 'block' }} />
                <div style={s.galleryCapHover}><span style={s.galleryCap}>{GALLERY[idx].title}</span></div>
              </div>
            ))}
          </div>

          {/* Row 5: cinematic full-width — 1294×336px (26% ratio, 42×8 ✓) */}
          <div style={{ width: '100%', height: '336px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLbIdx(11)}>
            <img src={GALLERY[11].src} alt={GALLERY[11].title} data-pspeed={GALLERY[11].speed}
              style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover', display: 'block' }} />
            <div style={s.galleryCapHover}><span style={s.galleryCap}>{GALLERY[11].title}</span></div>
          </div>

        </div>

        <div style={{ padding: '16px 88px 0', maxWidth: '1470px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', lineHeight: '16px', color: C.darkMuted, textAlign: 'center' }}>
            Click any image to open archive viewer · ← → to navigate · Esc to close
          </p>
        </div>
      </section>

      {/* ── DATA TABLE ────────────────────────────────────────── */}
      {/* Light. Sortable headers (click). Search filter above table. */}
      {/* Habitable Zone rows highlighted. */}
      <section
        id="table"
        ref={setSec('table')}
        data-sec="table"
        style={{ ...s.tableSection, ...fadeStyle('table') }}
      >
        <div style={s.wrap}>
          <div style={s.eyebrow}>Catalogue</div>
          <h2 style={{ ...s.h2light, marginBottom: '16px' }}>Confirmed Exoplanet Catalogue</h2>
          <p style={s.tableIntro}>
            Spectroscopic data for all planet candidates with confidence above 99.7%.
            Click column headers to sort. Type to filter by designation or status.
          </p>

          {/* Search input — height 48px (13px/24px + 12px×2 = 48px ✓) */}
          <div style={{ position: 'relative', marginBottom: '16px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Filter by designation or status…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={s.searchInput}
            />
            {search && (
              <button onClick={() => setSearch('')} style={s.searchClear} title="Clear">×</button>
            )}
          </div>

          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {TABLE_COLS.map(col => (
                    <th
                      key={col.key}
                      style={{ ...s.th, cursor: 'pointer', textAlign: col.align, userSelect: 'none' }}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}{sortArrow(col.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCatalogue.map((row, i) => {
                  const isHab = row.status === 'Habitable Zone'
                  const isEven = i % 2 === 0
                  const bg = isHab
                    ? `${C.teal}16`
                    : isEven ? C.white : C.lightBg
                  return (
                    <tr key={row.des} style={{ background: bg }}>
                      <td style={{ ...s.td, fontFamily: 'ui-monospace,monospace', fontWeight: 600 }}>{row.des}</td>
                      <td style={{ ...s.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.mass}</td>
                      <td style={{ ...s.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.rad}</td>
                      <td style={{ ...s.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.per}</td>
                      <td style={{ ...s.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.tmp}</td>
                      <td style={{ ...s.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.dst}</td>
                      <td style={{ ...s.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.yr}</td>
                      <td style={s.td}>
                        <span style={{ ...s.tableTag, background: statusColor[row.status] + '1a', color: statusColor[row.status], border: `1px solid ${statusColor[row.status]}42` }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {filteredCatalogue.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ ...s.td, textAlign: 'center', color: C.inkSub, padding: '32px 16px' }}>
                      No entries match "{search}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── OBSERVATION LOG ───────────────────────────────────── */}
      {/* Dark. Panoramic image with slow horizontal pan CSS animation. */}
      <section
        ref={setSec('obs')}
        data-sec="obs"
        style={{ ...s.obsSection, ...fadeStyle('obs') }}
      >
        <div style={s.wrap}>
          <div style={s.eyebrowDark}>Tonight's Sky</div>
          <h2 style={{ ...s.h2dark, marginBottom: '32px' }}>Observation Log</h2>
          {/* Panoramic: 1294×207px (16% ratio). Image 120% wide for pan animation. */}
          <div style={s.panWrap}>
            <img
              src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&q=80"
              alt="Milky Way panoramic"
              className="obs-pan"
              style={{
                width: '120%', height: '100%', objectFit: 'cover', display: 'block',
                animation: reducedMotion ? 'none' : 'panSky 30s linear infinite alternate',
              }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
          <div style={s.obsGrid}>
            {targets.map(t => (
              <div key={t.name} style={s.obsCard}>
                <div style={s.obsName}>{t.name}</div>
                <div style={s.obsType}>{t.type}</div>
                <div>
                  {[
                    { l: 'RA', v: t.ra, mono: true }, { l: 'Dec', v: t.dec, mono: true },
                    { l: 'Magnitude', v: t.mag, mono: false }, { l: 'Window', v: t.window, mono: false },
                    { l: 'Instrument', v: t.inst, mono: false },
                  ].map(r => (
                    <div key={r.l} style={s.obsRow}>
                      <span style={s.obsLabel}>{r.l}</span>
                      <span style={r.mono ? s.obsCoord : s.obsVal}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER + FOOTER ───────────────────────────────── */}
      <section style={s.footerSection}>
        <div style={s.wrap}>
          <div style={s.newsletter}>
            <div style={s.eyebrowDark}>Newsletter</div>
            <h2 style={{ ...s.h2dark, margin: '0 0 16px' }}>Join the Deep Field Dispatch</h2>
            <p style={s.nlSub}>Monthly briefings on exoplanet discoveries, AURORA results, and observatory updates.</p>
            <form style={s.nlForm} onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
              <input
                type="email" placeholder="your@email.com" value={email} required
                onChange={e => setEmail(e.target.value)} style={s.nlInput}
              />
              <button type="submit" style={s.nlBtn}>
                {submitted ? 'Subscribed ✓' : 'Subscribe'}
              </button>
            </form>
          </div>
          <div style={s.footerDivider} />
          <div style={s.footerGrid}>
            <div>
              <div style={s.footerLogo}>Parallax Observatory</div>
              <p style={s.footerBody}>Dedicated to the search for life beyond our solar system.</p>
            </div>
            <div>
              <div style={s.footerHead}>Location</div>
              <p style={s.footerBody}>Cerro Parallax<br />Atacama Desert, Chile<br />24°37′S 70°24′W · 2,847m</p>
            </div>
            <div>
              <div style={s.footerHead}>Contact</div>
              <p style={s.footerBody}>info@parallax-obs.cl<br />+56 55 2 481 200<br />media@parallax-obs.cl</p>
            </div>
            <div>
              <div style={s.footerHead}>Network</div>
              <p style={s.footerBody}>@ParallaxObs<br />arXiv · NASA ADS<br />ESO Partner Facility</p>
            </div>
          </div>
          <div style={s.finePrint}>
            Data released under Creative Commons CC-BY 4.0 · © 2024 Parallax Observatory Foundation
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX OVERLAY ──────────────────────────────────── */}
      {/* Fixed full-screen. Opacity 84% dark bg (FIBO ✓). */}
      {/* Tap targets: arrows 48px, close 48px (> 32px min ✓). */}
      {lbIdx !== null && (
        <div
          style={s.lbOverlay}
          onClick={() => setLbIdx(null)}
          role="dialog" aria-modal="true" aria-label="Image viewer"
        >
          <div style={s.lbInner} onClick={e => e.stopPropagation()}>
            {/* Close — 48×48px ✓ */}
            <button style={s.lbClose} onClick={() => setLbIdx(null)} aria-label="Close">×</button>

            {/* Prev arrow — 48×48px ✓ */}
            <button
              style={{ ...s.lbArrow, left: '16px', opacity: lbIdx > 0 ? 1 : 0.2, cursor: lbIdx > 0 ? 'pointer' : 'default' }}
              onClick={() => setLbIdx(i => i !== null ? Math.max(i - 1, 0) : null)}
              aria-label="Previous"
            >‹</button>

            <div style={s.lbImgWrap}>
              <img
                key={lbIdx}
                src={GALLERY[lbIdx].src.replace(/w=\d+/, 'w=1200')}
                alt={GALLERY[lbIdx].title}
                style={{
                  maxWidth: '80vw', maxHeight: '68vh', objectFit: 'contain', display: 'block',
                  animation: reducedMotion ? 'none' : 'lbImgIn 0.25s ease',
                }}
              />
              <div style={s.lbCaption}>
                <div style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 700, color: C.darkText, marginBottom: '4px' }}>
                  {GALLERY[lbIdx].title}
                </div>
                <div style={{ fontSize: '11px', lineHeight: '16px', color: C.darkMuted }}>
                  {GALLERY[lbIdx].date} · {GALLERY[lbIdx].inst}
                </div>
                <div style={{ fontSize: '11px', lineHeight: '16px', color: C.darkBorder, marginTop: '8px' }}>
                  {lbIdx + 1} / {GALLERY.length}
                </div>
              </div>
            </div>

            {/* Next arrow — 48×48px ✓ */}
            <button
              style={{ ...s.lbArrow, right: '16px', opacity: lbIdx < GALLERY.length - 1 ? 1 : 0.2, cursor: lbIdx < GALLERY.length - 1 ? 'pointer' : 'default' }}
              onClick={() => setLbIdx(i => i !== null ? Math.min(i + 1, GALLERY.length - 1) : null)}
              aria-label="Next"
            >›</button>
          </div>
        </div>
      )}

      {/* ── TEAM TOOLTIP ──────────────────────────────────────── */}
      {/* position:fixed + JS coords per FIBO feedback memory. */}
      {tooltip && (() => {
        const person = team.find(p => p.name === tooltip.name)
        if (!person) return null
        return (
          <div
            style={{
              position: 'fixed',
              left: tooltip.x,
              top: tooltip.y - 8,
              transform: 'translateX(-50%) translateY(-100%)',
              background: C.darkSurf,
              border: `1px solid ${C.darkBorder}`,
              padding: '16px',
              width: '288px',
              zIndex: 300,
              pointerEvents: 'none',
              boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ fontSize: '13px', lineHeight: '24px', fontWeight: 700, color: C.darkText, marginBottom: '8px' }}>{person.name}</div>
            <div style={{ fontSize: '11px', lineHeight: '16px', color: C.glow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Latest Publication</div>
            <div style={{ fontSize: '11px', lineHeight: '16px', color: C.darkSub, fontStyle: 'italic', marginBottom: '12px' }}>{person.pub}</div>
            <div style={{ fontSize: '11px', lineHeight: '16px', color: C.glow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Current Focus</div>
            <div style={{ fontSize: '11px', lineHeight: '16px', color: C.darkMuted }}>{person.focus}</div>
          </div>
        )
      })()}

    </div>
  )
}

// ─── STYLES ────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {

  page: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    margin: 0, padding: 0, background: C.lightBg,
  },
  wrap: {
    maxWidth: '1470px', margin: '0 auto', padding: '0 88px',
  },

  // ── BACK NAV — 48px (13px/24px + 12px×2 ✓)
  backNav: {
    position: 'sticky', top: 0, zIndex: 100,
    height: '48px',
    background: C.darkBg,
    borderBottom: `1px solid ${C.darkBorder}`,
    display: 'flex', alignItems: 'center',
  },
  backLink: {
    fontSize: '13px', lineHeight: '24px', fontWeight: 600,
    color: C.darkSub, textDecoration: 'none', letterSpacing: '0.05em',
  },
  slash: { fontSize: '13px', lineHeight: '24px', color: C.darkBorder, margin: '0 8px' },
  backCrumb: { fontSize: '13px', lineHeight: '24px', color: C.darkText },
  // Section scroll links — 32×32 tap target ✓
  navBtn: {
    height: '32px', padding: '0 12px',
    fontSize: '10px', lineHeight: '16px',
    fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: C.darkMuted, background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: 'inherit',
  },

  // ── HERO — 616px (1470×42%=617.4→616px, 77×8=616 ✓)
  hero: {
    position: 'relative', height: '616px', overflow: 'hidden',
    display: 'flex', alignItems: 'center', background: C.darkBg,
  },
  heroImg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: 'url(https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&q=80)',
    backgroundSize: 'cover', backgroundPosition: 'center',
  },
  heroOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    background: `linear-gradient(to right, hsl(245,58%,6%) 0%, hsla(245,58%,6%,0.84) 42%, hsla(245,58%,6%,0.42) 100%)`,
  },
  starField: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    overflow: 'hidden', pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative', zIndex: 2, width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
  },
  heroLeft:  { flex: '0 0 533px' },
  heroRight: { flex: 1, textAlign: 'right' },
  heroEyebrow: {
    fontSize: '10px', lineHeight: '16px', color: C.brand,
    textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '16px',
  },
  heroName: {
    fontSize: '55px', lineHeight: '64px', fontWeight: 800,
    color: C.darkText, margin: '0 0 16px', letterSpacing: '-0.02em',
  },
  heroTagline: {
    fontSize: '18px', lineHeight: '32px',  // alt lh — display context ✓
    color: C.darkSub, fontWeight: 300, fontStyle: 'italic', margin: '0 0 32px',
  },
  heroSecRow: { display: 'flex', alignItems: 'baseline', gap: '8px' },
  heroSecNum: { fontSize: '34px', lineHeight: '40px', fontWeight: 800, color: C.brand },
  heroSecLabel: { fontSize: '13px', lineHeight: '24px', color: C.darkSub },
  heroStatNum: { fontSize: '55px', lineHeight: '64px', fontWeight: 800, color: C.darkText, letterSpacing: '-0.03em' },
  heroStatLabel: { fontSize: '13px', lineHeight: '24px', color: C.glow, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginTop: '8px' },
  heroStatSub: { fontSize: '11px', lineHeight: '16px', color: C.darkMuted, marginTop: '8px' },

  // ── SHARED
  eyebrow:     { fontSize: '10px', lineHeight: '16px', color: C.brand,  textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '8px' },
  eyebrowDark: { fontSize: '10px', lineHeight: '16px', color: C.glow,   textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '8px' },
  h2light: { fontSize: '34px', lineHeight: '40px', fontWeight: 700, color: C.ink,      margin: '0 0 48px', letterSpacing: '-0.01em' },
  h2dark:  { fontSize: '34px', lineHeight: '40px', fontWeight: 700, color: C.darkText, margin: '0 0 48px', letterSpacing: '-0.01em' },
  body: { fontSize: '16px', lineHeight: '24px', color: C.inkSub, margin: '0 0 24px' },

  // ── MISSION
  mission: { background: C.lightBg, padding: '96px 0' },
  missionGrid: { display: 'grid', gridTemplateColumns: '1fr 530px', gap: '32px', alignItems: 'start' },
  missionAcronym: { fontSize: '11px', lineHeight: '16px', color: C.brand, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, margin: '0 0 24px' },
  missionCard: { background: C.darkSurf, padding: '32px', borderLeft: `3px solid ${C.brand}` },
  missionCardHead: { fontSize: '10px', lineHeight: '16px', color: C.glow, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, paddingBottom: '16px', marginBottom: '24px', borderBottom: `1px solid ${C.darkBorder}` },
  missionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: `1px solid ${C.darkBorder}42`, gap: '16px' },
  missionLabel: { fontSize: '11px', lineHeight: '16px', color: C.darkMuted, flexShrink: 0 },
  missionValue: { fontSize: '13px', lineHeight: '24px', color: C.darkText, fontWeight: 500, textAlign: 'right' },

  // ── DISCOVERIES
  discoveries: { background: C.darkBg, padding: '96px 0' },
  discGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' },
  discCard: { background: C.darkCard, border: `1px solid ${C.darkBorder}`, overflow: 'hidden' },
  discImgWrap: { width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', background: C.darkSurf, position: 'relative' },
  discImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  discContent: { padding: '16px' },
  discId: { fontSize: '18px', lineHeight: '24px', fontWeight: 700, color: C.darkText, fontFamily: 'ui-monospace,monospace', letterSpacing: '0.02em', marginBottom: '16px' },
  discStats: { marginBottom: '16px' },
  discStatRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.darkBorder}42` },
  discStatLabel: { fontSize: '10px', lineHeight: '16px', color: C.darkMuted, textTransform: 'uppercase', letterSpacing: '0.08em' },
  discStatValue: { fontSize: '13px', lineHeight: '16px', color: C.darkSub, fontWeight: 500 },
  discFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' },
  discYear: { fontSize: '11px', lineHeight: '16px', color: C.darkMuted },
  discTag: { fontSize: '10px', lineHeight: '16px', fontWeight: 600, padding: '4px 8px', letterSpacing: '0.05em' },

  // ── TIMELINE
  timeline: { background: C.white, padding: '96px 0' },
  tlList: { display: 'flex', flexDirection: 'column' },
  tlRow: { display: 'grid', gridTemplateColumns: '543px 48px 703px', minHeight: '96px' },
  tlDateLeft:     { display: 'flex', alignItems: 'center', justifyContent: 'flex-end',   padding: '24px 0' },
  tlDateRight:    { display: 'flex', alignItems: 'center', justifyContent: 'flex-start',  padding: '24px 0' },
  tlContentRight: { padding: '24px 0 24px 24px', maxWidth: '600px' },
  tlContentLeft:  { padding: '24px 24px 24px 0', textAlign: 'right' },
  tlConnector: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  tlLine: { position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: C.lightBorder, transform: 'translateX(-50%)' },
  tlDot: { width: '16px', height: '16px', borderRadius: '50%', background: C.brand, border: `3px solid ${C.white}`, boxShadow: `0 0 0 1px ${C.brand}`, position: 'relative', zIndex: 2, flexShrink: 0 },
  tlYear: { fontSize: '34px', lineHeight: '40px', fontWeight: 800, color: C.lightBorder, letterSpacing: '-0.02em' },
  tlTitle: { fontSize: '16px', lineHeight: '24px', fontWeight: 700, color: C.ink, marginBottom: '8px' },
  tlBody: { fontSize: '13px', lineHeight: '24px', color: C.inkSub },

  // ── TEAM
  teamSection: { background: C.lightBg, padding: '96px 0' },
  teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' },
  teamCard: { background: C.white, overflow: 'hidden', cursor: 'default' },
  teamImgWrap: { width: '100%', aspectRatio: '100 / 68', overflow: 'hidden', background: C.l90 },
  teamImg: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' },
  teamInfo: { padding: '16px' },
  teamName: { fontSize: '16px', lineHeight: '24px', fontWeight: 700, color: C.ink, marginBottom: '4px' },
  teamTitle: { fontSize: '13px', lineHeight: '24px', color: C.brand, fontWeight: 500, marginBottom: '4px' },
  teamSpec: { fontSize: '11px', lineHeight: '16px', color: C.inkSub },

  // ── GALLERY
  gallerySection: { background: C.darkBg, padding: '96px 0 112px' },
  galleryCapHover: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: '32px 16px 16px',
    background: `linear-gradient(to top, ${C.darkBg}d6 0%, transparent 100%)`,
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
  galleryCap: {
    fontSize: '11px', lineHeight: '16px',
    color: C.darkText, fontWeight: 500,
    display: 'block',
  },

  // ── DATA TABLE
  tableSection: { background: C.white, padding: '96px 0' },
  tableIntro: { fontSize: '16px', lineHeight: '24px', color: C.inkSub, margin: '0 0 24px', maxWidth: '700px' },
  // Search input — 48px (13px/24px + 12px×2 = 48px ✓)
  searchInput: {
    flex: 1, height: '48px', padding: '12px 16px',
    fontSize: '13px', lineHeight: '24px',
    background: C.lightBg, border: `1px solid ${C.lightBorder}`,
    color: C.ink, outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  // Clear button — 48×48px ✓
  searchClear: {
    width: '48px', height: '48px',
    fontSize: '21px', lineHeight: '32px',
    background: C.lightBg, border: `1px solid ${C.lightBorder}`,
    color: C.inkSub, cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  tableWrap: { overflow: 'auto', border: `1px solid ${C.lightBorder}` },
  table: { width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' },
  // Header: 10px/16px + 8px×2 = 32px ✓
  th: { fontSize: '10px', lineHeight: '16px', fontWeight: 700, color: C.inkSub, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 16px', background: C.lightBg, borderBottom: `2px solid ${C.lightBorder}`, whiteSpace: 'nowrap' },
  // Row: 13px/24px + 8px×2 = 40px ✓
  td: { fontSize: '13px', lineHeight: '24px', color: C.ink, padding: '8px 16px', borderBottom: `1px solid ${C.lightBorder}`, whiteSpace: 'nowrap' },
  tableTag: { display: 'inline-block', fontSize: '10px', lineHeight: '16px', padding: '4px 8px', fontWeight: 600, letterSpacing: '0.05em', whiteSpace: 'nowrap' },

  // ── OBS LOG
  obsSection: { background: C.darkBg, padding: '96px 0' },
  // Panoramic: 1294×207px (1294×16%=207px, 16% ratio ✓). Image 120% wide for pan.
  panWrap: { width: '100%', height: '207px', overflow: 'hidden', marginBottom: '48px', background: C.darkSurf },
  obsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' },
  obsCard: { background: C.darkCard, border: `1px solid ${C.darkBorder}`, padding: '24px' },
  obsName: { fontSize: '16px', lineHeight: '24px', fontWeight: 700, color: C.darkText, marginBottom: '4px' },
  obsType: { fontSize: '11px', lineHeight: '16px', color: C.glow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${C.darkBorder}` },
  obsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: `1px solid ${C.darkBorder}42`, gap: '8px' },
  obsLabel: { fontSize: '10px', lineHeight: '16px', color: C.darkMuted, textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 },
  obsCoord: { fontSize: '13px', lineHeight: '16px', color: C.darkSub, fontFamily: 'ui-monospace,monospace', textAlign: 'right' },
  obsVal: { fontSize: '13px', lineHeight: '16px', color: C.darkText, textAlign: 'right', fontWeight: 500 },

  // ── FOOTER
  footerSection: { background: C.darkSurf, padding: '96px 0 64px' },
  newsletter: { textAlign: 'center', maxWidth: '616px', margin: '0 auto', paddingBottom: '64px' },
  nlSub: { fontSize: '16px', lineHeight: '24px', color: C.darkMuted, margin: '0 0 32px' },
  nlForm: { display: 'flex' },
  // Email input: 16px/24px + 16px×2 = 56px ✓
  nlInput: { flex: 1, height: '56px', padding: '16px', fontSize: '16px', lineHeight: '24px', background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRight: 'none', color: C.darkText, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  // CTA: 16px/24px + 16px×2 = 56px ✓
  nlBtn: { height: '56px', padding: '16px 24px', fontSize: '16px', lineHeight: '24px', fontWeight: 700, background: C.brand, color: C.white, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', boxSizing: 'border-box' },
  footerDivider: { height: '1px', background: C.darkBorder, margin: '0 0 64px' },
  footerGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '64px' },
  footerLogo: { fontSize: '16px', lineHeight: '24px', fontWeight: 800, color: C.darkText, marginBottom: '16px' },
  footerHead: { fontSize: '11px', lineHeight: '16px', fontWeight: 700, color: C.glow, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' },
  footerBody: { fontSize: '13px', lineHeight: '24px', color: C.darkMuted, margin: '0 0 8px' },
  finePrint: { fontSize: '9px', lineHeight: '16px', color: C.darkBorder, textAlign: 'center', paddingTop: '32px', borderTop: `1px solid ${C.darkBorder}42` },

  // ── LIGHTBOX
  // Overlay: 84% opacity (FIBO opacity step ✓)
  lbOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 500,
    background: `hsla(245,58%,6%,0.84)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    animation: 'lbFadeIn 0.2s ease',
  },
  lbInner: {
    position: 'relative',
    display: 'flex', alignItems: 'center', gap: '16px',
  },
  lbImgWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  lbCaption: { textAlign: 'center', maxWidth: '600px' },
  // Close: 48×48px ✓ (21px/32px + 8px×2 = 48px)
  lbClose: {
    position: 'fixed', top: '16px', right: '16px',
    width: '48px', height: '48px',
    fontSize: '21px', lineHeight: '32px',
    background: 'none', border: `1px solid ${C.darkBorder}`, color: C.darkText,
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  // Arrows: 48×48px ✓
  lbArrow: {
    position: 'absolute',
    width: '48px', height: '48px',
    fontSize: '34px', lineHeight: '40px',
    background: `${C.darkCard}d6`, border: `1px solid ${C.darkBorder}`,
    color: C.darkText, fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'opacity 0.15s ease',
  },
}
