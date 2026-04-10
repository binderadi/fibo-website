/*
 * APEX TRADING TERMINAL — FIBO Design System
 * Canvas: 1470×956 (MacBook Air M4, full viewport)
 *
 * Layout (FIBO-derived):
 *   Top bar:      40px   — 13px/24lh + 8+8 v-pad (Signal 5: consistent)
 *   Upper body:   flex:1 — fills 956−40−160 = 756px
 *     Sidebar:    235px  — F3 of 1470 (16%)
 *     Chart:      flex:1 — fills remaining canvas
 *     Right col:  321px  — F4 of 1235 remainder (26%)
 *   Bottom panel: 160px  — 32 header + 32 thead + 3×32 rows
 *
 * Color — HSL lightness values from FIBO shade steps only:
 *   bg: L6 · surface: L10 · surface2: L16 · border: L16 · borderMid: L26
 *   text: L90 · textMid: L58 · textMuted: L42 · gain/loss/accent: L58
 *
 * Typography — all sizes from FIBO type scale, all LH multiples of 8:
 *   10px/16px — labels (uppercase, tracking)
 *   11px/16px — data values (monospace)
 *   13px/24px — nav items, section labels
 *   21px/32px — large price display
 */

import { useState, useEffect } from 'react'

// ─── TOKENS ──────────────────────────────────────────────────────────────────

const C = {
  bg:         'hsl(222,20%,6%)',     // L6  — dominant bg
  surface:    'hsl(222,18%,10%)',    // L10 — panel bg
  surface2:   'hsl(222,16%,16%)',    // L16 — elevated surface / hover
  border:     'hsl(222,14%,16%)',    // L16 — standard border
  borderMid:  'hsl(222,10%,26%)',    // L26 — stronger border
  text:       'hsl(222,10%,90%)',    // L90 — primary text
  textMid:    'hsl(222,8%,58%)',     // L58 — secondary text
  textMuted:  'hsl(222,6%,42%)',     // L42 — muted / labels
  gain:       'hsl(142,58%,58%)',    // L58 — green
  loss:       'hsl(0,74%,58%)',      // L58 — red
  gainBg:     'hsl(142,58%,10%)',    // L10 — green tint bg
  lossBg:     'hsl(0,74%,10%)',      // L10 — red tint bg
  accent:     'hsl(210,84%,58%)',    // L58 — blue accent
  accentDim:  'hsl(210,84%,16%)',    // L16 — blue tint bg
}

const mono = "'IBM Plex Mono', monospace"

// Component heights — multiples of 8 (Signal 5: consistent)
const H = {
  topBar:  48,   // 13px/24lh labels + 13px/24lh values = 40px content, centred in 48px
  panelHd: 32,   // 10px/16lh + 8+8 v-pad
  rowMd:   32,   // standard row: 11px/16lh + 8+8 v-pad
  rowSm:   24,   // compact row: 11px/16lh + 4+4 v-pad
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const WATCHLIST = [
  { sym: 'BTC/USD',  price: '43,521.50', chg: '+2.34', up: true  },
  { sym: 'ETH/USD',  price:  '2,347.82', chg: '+1.23', up: true  },
  { sym: 'SOL/USD',  price:    '95.32',  chg: '-3.18', up: false },
  { sym: 'BNB/USD',  price:   '312.45',  chg: '+0.87', up: true  },
  { sym: 'AAPL',     price:   '182.63',  chg: '+0.45', up: true  },
  { sym: 'NVDA',     price:   '498.21',  chg: '+3.21', up: true  },
  { sym: 'TSLA',     price:   '247.18',  chg: '-1.45', up: false },
  { sym: 'SPY',      price:   '459.82',  chg: '+0.32', up: true  },
  { sym: 'EUR/USD',  price:    '1.0842', chg: '-0.12', up: false },
  { sym: 'GBP/USD',  price:    '1.2634', chg: '+0.08', up: true  },
  { sym: 'GOLD',     price: '2,024.30',  chg: '+0.54', up: true  },
  { sym: 'OIL',      price:    '78.45',  chg: '-0.89', up: false },
  { sym: 'DOGE',     price:    '0.0823', chg: '+5.42', up: true  },
  { sym: 'ADA/USD',  price:    '0.6124', chg: '+1.87', up: true  },
  { sym: 'XRP/USD',  price:    '0.5412', chg: '-0.34', up: false },
  { sym: 'LINK/USD', price:    '15.34',  chg: '+2.10', up: true  },
  { sym: 'DOT/USD',  price:     '8.21',  chg: '-0.91', up: false },
  { sym: 'AVAX',     price:    '36.45',  chg: '+4.12', up: true  },
]

// 80 BTC price points (deterministic — same chart every render)
const PRICES = [
  43521, 43580, 43445, 43612, 43708, 43655, 43490, 43380, 43420, 43510,
  43635, 43720, 43680, 43595, 43510, 43445, 43380, 43290, 43210, 43150,
  43080, 43120, 43245, 43380, 43520, 43640, 43750, 43820, 43780, 43695,
  43640, 43580, 43520, 43490, 43440, 43380, 43310, 43240, 43180, 43120,
  43090, 43150, 43220, 43310, 43420, 43540, 43610, 43680, 43720, 43760,
  43800, 43750, 43690, 43620, 43560, 43510, 43480, 43440, 43400, 43360,
  43310, 43270, 43230, 43190, 43160, 43140, 43180, 43240, 43310, 43400,
  43490, 43560, 43620, 43680, 43720, 43750, 43780, 43800, 43820, 43521,
]

const ASKS = [
  { price: '43,538.50', size: '0.8420', total: '0.8420', depth: 12 },
  { price: '43,535.00', size: '1.2150', total: '2.0570', depth: 29 },
  { price: '43,532.00', size: '0.5380', total: '2.5950', depth: 37 },
  { price: '43,529.50', size: '2.1200', total: '4.7150', depth: 67 },
  { price: '43,527.00', size: '0.7640', total: '5.4790', depth: 78 },
  { price: '43,524.00', size: '1.4320', total: '6.9110', depth: 98 },
]

const BIDS = [
  { price: '43,521.50', size: '1.8900', total: '1.8900', depth: 19 },
  { price: '43,519.00', size: '0.6230', total: '2.5130', depth: 25 },
  { price: '43,516.50', size: '2.3450', total: '4.8580', depth: 49 },
  { price: '43,513.00', size: '0.9870', total: '5.8450', depth: 59 },
  { price: '43,510.50', size: '1.5640', total: '7.4090', depth: 75 },
  { price: '43,507.00', size: '0.8120', total: '8.2210', depth: 83 },
]

const TRADES = [
  { time: '14:23:07', price: '43,521.50', size: '0.4210', buy: true  },
  { time: '14:23:06', price: '43,522.00', size: '1.2840', buy: false },
  { time: '14:23:05', price: '43,519.50', size: '0.1820', buy: true  },
  { time: '14:23:04', price: '43,518.00', size: '2.1200', buy: false },
  { time: '14:23:03', price: '43,520.00', size: '0.3450', buy: true  },
  { time: '14:23:02', price: '43,521.50', size: '0.7840', buy: true  },
  { time: '14:23:01', price: '43,519.00', size: '0.2100', buy: false },
  { time: '14:23:00', price: '43,517.50', size: '1.0000', buy: false },
  { time: '14:22:59', price: '43,520.00', size: '0.5320', buy: true  },
  { time: '14:22:58', price: '43,522.50', size: '0.3910', buy: true  },
  { time: '14:22:57', price: '43,521.00', size: '0.8640', buy: false },
  { time: '14:22:56', price: '43,518.50', size: '0.4120', buy: true  },
  { time: '14:22:55', price: '43,516.00', size: '1.3210', buy: false },
  { time: '14:22:54', price: '43,519.50', size: '0.2840', buy: true  },
]

const POSITIONS = [
  { sym: 'BTC/USD',  side: 'LONG',  size:  '2.500', entry: '43,125.00', mark: '43,521.50', pnl: '+990.38',  pnlPct: '+2.30%', liq: '38,200.00' },
  { sym: 'ETH/USD',  side: 'SHORT', size: '15.000', entry:  '2,380.50', mark:  '2,347.82', pnl: '+490.20',  pnlPct: '+1.37%', liq:  '2,800.00' },
  { sym: 'SOL/USD',  side: 'LONG',  size: '100.000', entry:    '98.45', mark:     '95.32', pnl: '−313.00',  pnlPct: '−3.18%', liq:    '72.00' },
]

// ─── CHART ────────────────────────────────────────────────────────────────────

function PriceChart() {
  const W = 860   // SVG viewBox width (price axis: 60px on right)
  const H_SVG = 640 // SVG viewBox height (time axis: 24px on bottom)
  const PAD_R = 64
  const PAD_B = 24
  const chartW = W - PAD_R
  const chartH = H_SVG - PAD_B

  const prices = PRICES
  const minP = 42980
  const maxP = 43900
  const range = maxP - minP

  const toX = (i: number) => (i / (prices.length - 1)) * chartW
  const toY = (p: number) => chartH - ((p - minP) / range) * chartH

  const linePoints = prices.map((p, i) => `${toX(i).toFixed(1)},${toY(p).toFixed(1)}`).join(' ')
  const areaPoints = `0,${chartH} ${linePoints} ${chartW},${chartH}`

  const curY = toY(prices[prices.length - 1])

  // Price grid lines at every 200
  const gridPrices = [43000, 43200, 43400, 43600, 43800]

  // Time labels (every 10th point ≈ every 10 bars)
  const timeLabels = ['12:00', '12:20', '12:40', '13:00', '13:20', '13:40', '14:00', '14:20']

  return (
    <svg
      width="100%" height="100%"
      viewBox={`0 0 ${W} ${H_SVG}`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor="hsl(210,84%,58%)" stopOpacity="0.20" />
          <stop offset="100%" stopColor="hsl(210,84%,58%)" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Price grid lines */}
      {gridPrices.map(p => {
        const y = toY(p)
        return (
          <g key={p}>
            <line x1={0} y1={y} x2={chartW} y2={y}
              stroke="hsl(222,14%,16%)" strokeWidth="1" />
            <text x={chartW + 8} y={y + 4}
              fontSize="10" fill="hsl(222,6%,42%)"
              fontFamily={mono}>
              {p.toLocaleString()}
            </text>
          </g>
        )
      })}

      {/* Time axis labels */}
      {timeLabels.map((label, i) => {
        const x = (i / (timeLabels.length - 1)) * chartW
        return (
          <text key={label} x={x} y={H_SVG - 6}
            fontSize="10" fill="hsl(222,6%,42%)"
            fontFamily={mono} textAnchor="middle">
            {label}
          </text>
        )
      })}

      {/* Area fill */}
      <polygon points={areaPoints} fill="url(#areaGrad)" />

      {/* Price line */}
      <polyline
        points={linePoints}
        fill="none"
        stroke="hsl(210,84%,58%)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Current price line */}
      <line
        x1={0} y1={curY} x2={chartW} y2={curY}
        stroke="hsl(142,58%,58%)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />

      {/* Current price label */}
      <rect x={chartW + 2} y={curY - 10} width={60} height={20}
        fill="hsl(142,58%,58%)" rx="2" />
      <text x={chartW + 32} y={curY + 4}
        fontSize="10" fill="hsl(222,20%,6%)"
        fontFamily={mono} textAnchor="middle" fontWeight="600">
        43,521.5
      </text>
    </svg>
  )
}

// ─── PANEL HEADER ─────────────────────────────────────────────────────────────

function PanelHeader({ label, right }: { label: string; right?: React.ReactNode }) {
  return (
    <div style={{
      height: H.panelHd,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
      borderBottom: `1px solid ${C.border}`,
      flexShrink: 0,
    }}>
      <span style={{ fontSize: '10px', lineHeight: '16px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, fontFamily: mono }}>
        {label}
      </span>
      {right}
    </div>
  )
}

// ─── TIMEFRAME BUTTON ─────────────────────────────────────────────────────────

function TfBtn({ label, active }: { label: string; active?: boolean }) {
  return (
    <div style={{
      height: 24,   // 11px/16lh + 4+4 v-pad = 24px ✓
      padding: '4px 8px',
      fontSize: '11px', lineHeight: '16px',
      fontFamily: mono,
      color: active ? C.accent : C.textMuted,
      background: active ? C.accentDim : 'transparent',
      cursor: 'pointer',
      userSelect: 'none',
    }}>
      {label}
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function TradingPage() {
  const [time, setTime] = useState(() => {
    const d = new Date()
    return d.toTimeString().slice(0, 8)
  })

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toTimeString().slice(0, 8))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: C.bg,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      color: C.text,
      fontFamily: "'IBM Plex Mono', monospace",
    }}>

      {/* ── TOP BAR — 40px ──────────────────────────────────────────────────── */}
      {/* 13px/24lh + 8px v-pad × 2 = 40px ✓ */}
      <div style={{
        height: H.topBar, flexShrink: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 16px',
        borderBottom: `1px solid ${C.border}`,
        background: C.surface,
        gap: 24,
      }}>
        {/* Logo */}
        <div style={{ fontSize: '13px', lineHeight: '24px', fontWeight: 800, letterSpacing: '0.16em', fontFamily: mono, color: C.accent }}>
          APEX
        </div>

        <div style={{ width: 1, height: 16, background: C.border }} />

        {/* Active market */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '13px', lineHeight: '24px', fontWeight: 600, color: C.text }}>BTC/USD</span>
          <span style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted, fontFamily: mono, letterSpacing: '0.06em' }}>PERPETUAL</span>
        </div>

        <div style={{ width: 1, height: 16, background: C.border }} />

        {/* Bid / Ask / Spread */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted, letterSpacing: '0.08em', fontFamily: mono }}>BID</div>
            <div style={{ fontSize: '16px', lineHeight: '24px', color: C.gain, fontFamily: mono, fontWeight: 600 }}>43,521.50</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted, letterSpacing: '0.08em', fontFamily: mono }}>ASK</div>
            <div style={{ fontSize: '16px', lineHeight: '24px', color: C.loss, fontFamily: mono, fontWeight: 600 }}>43,523.00</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted, letterSpacing: '0.08em', fontFamily: mono }}>SPREAD</div>
            <div style={{ fontSize: '13px', lineHeight: '24px', color: C.textMid, fontFamily: mono }}>1.50</div>
          </div>
        </div>

        <div style={{ width: 1, height: 16, background: C.border }} />

        {/* 24h stats */}
        {[
          { label: '24H HIGH', val: '44,120.00', color: C.text },
          { label: '24H LOW',  val: '42,380.50', color: C.text },
          { label: '24H VOL',  val: '48,312 BTC', color: C.text },
        ].map(({ label, val, color }) => (
          <div key={label}>
            <div style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted, letterSpacing: '0.08em', fontFamily: mono }}>{label}</div>
            <div style={{ fontSize: '13px', lineHeight: '24px', color, fontFamily: mono }}>{val}</div>
          </div>
        ))}

        {/* Right side — account */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted, letterSpacing: '0.08em', fontFamily: mono }}>BALANCE</div>
            <div style={{ fontSize: '13px', lineHeight: '24px', color: C.text, fontFamily: mono }}>$124,583.21</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted, letterSpacing: '0.08em', fontFamily: mono }}>UNREALISED P&L</div>
            <div style={{ fontSize: '13px', lineHeight: '24px', color: C.gain, fontFamily: mono }}>+$1,167.58 (+0.94%)</div>
          </div>
          <div style={{ width: 1, height: 16, background: C.border }} />
          <div style={{ fontSize: '11px', lineHeight: '16px', color: C.textMid, fontFamily: mono }}>{time}</div>
          {/* Status dot */}
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.gain }} />
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

        {/* ── UPPER ROW ─────────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

          {/* ── SIDEBAR — 235px (F3 of 1470, 16%) ────────────────────────── */}
          <div style={{
            width: 235, flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            borderRight: `1px solid ${C.border}`,
          }}>
            <PanelHeader label="Watchlist" />

            {/* Column headers — 24px (10px/16lh + 4+4 v-pad) */}
            <div style={{
              height: H.rowSm, flexShrink: 0,
              display: 'grid', gridTemplateColumns: '1fr 84px 52px',
              padding: '4px 16px',
              borderBottom: `1px solid ${C.border}`,
            }}>
              {['SYMBOL', 'LAST', '24H%'].map(h => (
                <span key={h} style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted, fontFamily: mono, letterSpacing: '0.08em', textAlign: h !== 'SYMBOL' ? 'right' : 'left' }}>{h}</span>
              ))}
            </div>

            {/* Rows — 32px each (11px/16lh + 8+8 v-pad) */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {WATCHLIST.map((w, i) => (
                <div key={i} style={{
                  height: H.rowMd,
                  display: 'grid', gridTemplateColumns: '1fr 84px 52px',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderBottom: `1px solid ${C.border}`,
                  cursor: 'pointer',
                }}>
                  <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.text }}>{w.sym}</span>
                  <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.text, textAlign: 'right' }}>{w.price}</span>
                  <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: w.up ? C.gain : C.loss, textAlign: 'right' }}>{w.up ? '+' : ''}{w.chg}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── CHART PANEL — flex:1 ───────────────────────────────────────── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

            {/* Chart header — 56px (34px/40lh + 8+8 v-pad) */}
            <div style={{
              height: 56, flexShrink: 0,
              display: 'flex', alignItems: 'center',
              padding: '8px 16px',
              borderBottom: `1px solid ${C.border}`,
              gap: 16,
            }}>
              {/* Current price — 34px/40lh (Inside-Out, Signal 3: dynamic) — hero datum */}
              <span style={{ fontSize: '34px', lineHeight: '40px', fontFamily: mono, fontWeight: 600, color: C.text }}>43,521.50</span>
              <span style={{ fontSize: '16px', lineHeight: '24px', fontFamily: mono, color: C.gain }}>+2.34%</span>

              {/* Timeframe buttons — height 24px (11px/16lh + 4+4 v-pad) */}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                {['1m', '5m', '15m', '1h', '4h', '1D', '1W'].map((tf, i) => (
                  <TfBtn key={tf} label={tf} active={i === 3} />
                ))}
              </div>
            </div>

            {/* Chart SVG — fills remaining height */}
            <div style={{ flex: 1, padding: '16px 0 0 16px', minHeight: 0, overflow: 'hidden' }}>
              <PriceChart />
            </div>
          </div>

          {/* ── RIGHT COLUMN — 321px (F4 of 1235, 26%) ───────────────────── */}
          <div style={{
            width: 321, flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            borderLeft: `1px solid ${C.border}`,
          }}>

            {/* ORDER BOOK — flex:13 (FIBO 13:8 split with trades) */}
            <div style={{ flex: 13, display: 'flex', flexDirection: 'column', minHeight: 0, borderBottom: `1px solid ${C.border}` }}>
              <PanelHeader label="Order Book" />

              {/* Column headers */}
              <div style={{
                height: H.rowSm, flexShrink: 0,
                display: 'grid', gridTemplateColumns: '1fr 80px 80px',
                alignItems: 'center',
                padding: '4px 16px',
                borderBottom: `1px solid ${C.border}`,
              }}>
                {['PRICE', 'SIZE', 'TOTAL'].map(h => (
                  <span key={h} style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted, fontFamily: mono, letterSpacing: '0.08em', textAlign: h !== 'PRICE' ? 'right' : 'left' }}>{h}</span>
                ))}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                {/* Asks — top, reversed (highest ask at top) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 0, overflow: 'hidden' }}>
                  {[...ASKS].reverse().map((row, i) => (
                    <div key={i} style={{
                      height: H.rowSm, flexShrink: 0,
                      display: 'grid', gridTemplateColumns: '1fr 80px 80px',
                      alignItems: 'center',
                      padding: '4px 16px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      {/* Depth bar */}
                      <div style={{
                        position: 'absolute', top: 0, right: 0, bottom: 0,
                        width: `${row.depth}%`,
                        background: C.lossBg,
                        pointerEvents: 'none',
                      }} />
                      <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.loss, position: 'relative' }}>{row.price}</span>
                      <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.text, textAlign: 'right', position: 'relative' }}>{row.size}</span>
                      <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.textMid, textAlign: 'right', position: 'relative' }}>{row.total}</span>
                    </div>
                  ))}
                </div>

                {/* Spread row — 40px (21px/32lh + 4+4 v-pad) */}
                <div style={{
                  height: 40, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0 16px',
                  background: C.surface2,
                  borderTop: `1px solid ${C.borderMid}`,
                  borderBottom: `1px solid ${C.borderMid}`,
                }}>
                  <span style={{ fontSize: '21px', lineHeight: '32px', fontFamily: mono, fontWeight: 600, color: C.text }}>43,521.75</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted, fontFamily: mono, letterSpacing: '0.08em' }}>SPREAD</span>
                    <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.textMid }}>1.50</span>
                  </div>
                </div>

                {/* Bids */}
                <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                  {BIDS.map((row, i) => (
                    <div key={i} style={{
                      height: H.rowSm, flexShrink: 0,
                      display: 'grid', gridTemplateColumns: '1fr 80px 80px',
                      alignItems: 'center',
                      padding: '4px 16px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', top: 0, right: 0, bottom: 0,
                        width: `${row.depth}%`,
                        background: C.gainBg,
                        pointerEvents: 'none',
                      }} />
                      <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.gain, position: 'relative' }}>{row.price}</span>
                      <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.text, textAlign: 'right', position: 'relative' }}>{row.size}</span>
                      <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.textMid, textAlign: 'right', position: 'relative' }}>{row.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RECENT TRADES — flex:8 (FIBO 13:8 split with order book) */}
            <div style={{ flex: 8, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <PanelHeader label="Recent Trades" />

              {/* Column headers */}
              <div style={{
                height: H.rowSm, flexShrink: 0,
                display: 'grid', gridTemplateColumns: '64px 1fr 80px',
                alignItems: 'center',
                padding: '4px 16px',
                borderBottom: `1px solid ${C.border}`,
              }}>
                {['TIME', 'PRICE', 'SIZE'].map(h => (
                  <span key={h} style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted, fontFamily: mono, letterSpacing: '0.08em', textAlign: h === 'SIZE' ? 'right' : 'left' }}>{h}</span>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {TRADES.map((t, i) => (
                  <div key={i} style={{
                    height: H.rowSm,
                    display: 'grid', gridTemplateColumns: '64px 1fr 80px',
                    alignItems: 'center',
                    padding: '4px 16px',
                    borderBottom: `1px solid ${C.border}`,
                  }}>
                    <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.textMuted }}>{t.time}</span>
                    <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: t.buy ? C.gain : C.loss }}>{t.price}</span>
                    <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.text, textAlign: 'right' }}>{t.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM PANEL — 160px ──────────────────────────────────────────── */}
        {/* 32px panel header + 32px col headers + 3×32px rows = 160px ✓ */}
        <div style={{
          height: 160, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          borderTop: `1px solid ${C.borderMid}`,
          background: C.surface,
        }}>
          {/* Panel header — 32px */}
          <div style={{
            height: H.panelHd, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: '10px', lineHeight: '16px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, fontFamily: mono }}>
              Open Positions <span style={{ color: C.accent, marginLeft: 8 }}>3</span>
            </span>
            <button style={{
              height: 24,  // 11px/16lh + 4+4 v-pad = 24px ✓
              padding: '4px 12px',
              fontSize: '11px', lineHeight: '16px',
              fontFamily: mono,
              color: C.accent,
              background: C.accentDim,
              border: `1px solid ${C.accent}`,
              cursor: 'pointer',
            }}>
              + New Order
            </button>
          </div>

          {/* Table header — 32px */}
          <div style={{
            height: H.rowMd, flexShrink: 0,
            display: 'grid',
            gridTemplateColumns: '160px 80px 120px 160px 160px 160px 100px 160px 1fr',
            alignItems: 'center',
            padding: '8px 16px',
            borderBottom: `1px solid ${C.border}`,
          }}>
            {['SYMBOL', 'SIDE', 'SIZE', 'ENTRY PRICE', 'MARK PRICE', 'UNREALISED PNL', 'PNL %', 'LIQ PRICE', 'ACTIONS'].map(h => (
              <span key={h} style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted, fontFamily: mono, letterSpacing: '0.08em' }}>{h}</span>
            ))}
          </div>

          {/* Position rows — 32px each */}
          {POSITIONS.map((p, i) => {
            const profit = p.pnl.startsWith('+')
            return (
              <div key={i} style={{
                height: H.rowMd, flexShrink: 0,
                display: 'grid',
                gridTemplateColumns: '160px 80px 120px 160px 160px 160px 100px 160px 1fr',
                alignItems: 'center',
                padding: '8px 16px',
                borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: '13px', lineHeight: '24px', fontFamily: mono, color: C.text, fontWeight: 600 }}>{p.sym}</span>
                <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: p.side === 'LONG' ? C.gain : C.loss }}>{p.side}</span>
                <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.text }}>{p.size}</span>
                <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.text }}>{p.entry}</span>
                <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.text }}>{p.mark}</span>
                <span style={{ fontSize: '16px', lineHeight: '24px', fontFamily: mono, color: profit ? C.gain : C.loss, fontWeight: 700 }}>{p.pnl}</span>
                <span style={{ fontSize: '13px', lineHeight: '24px', fontFamily: mono, color: profit ? C.gain : C.loss, fontWeight: 600 }}>{p.pnlPct}</span>
                <span style={{ fontSize: '11px', lineHeight: '16px', fontFamily: mono, color: C.textMid }}>{p.liq}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Close', 'Edit', 'TP/SL'].map(action => (
                    <button key={action} style={{
                      height: 24, padding: '4px 8px',
                      fontSize: '10px', lineHeight: '16px',
                      fontFamily: mono,
                      color: action === 'Close' ? C.loss : C.textMid,
                      background: action === 'Close' ? C.lossBg : C.surface2,
                      border: `1px solid ${action === 'Close' ? C.loss : C.border}`,
                      cursor: 'pointer',
                      letterSpacing: '0.06em',
                    }}>{action}</button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
