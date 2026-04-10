import React from 'react'

const C = {
  padding: '#4285F4',
  border:  '#111111',
  margin:  '#FBBC04',
  gap:     '#34A853',
  content: '#F5F5F5',
}

// Renders a box with visible margin / border / padding / content layers
function ModelBox({ n, cols = 1, height = 160, dark = false, children }: {
  n: number
  cols?: number
  height?: number
  dark?: boolean
  children?: React.ReactNode
}) {
  return (
    <div style={{
      gridColumn: `span ${cols}`,
      height: `${height}px`,
      background: dark ? '#000' : C.margin,       // margin zone
      boxSizing: 'border-box',
      padding: '8px',
    }}>
      {/* Border layer */}
      <div style={{ width: '100%', height: '100%', border: `3px solid ${dark ? '#fff' : C.border}`, boxSizing: 'border-box' }}>
        {/* Padding layer */}
        <div style={{ width: '100%', height: '100%', background: dark ? '#1a3a6a' : C.padding, padding: '12px', boxSizing: 'border-box' }}>
          {/* Content layer */}
          <div style={{ width: '100%', height: '100%', background: dark ? '#111' : C.content, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--t13)', color: dark ? '#aaa' : 'var(--c-muted)' }}>
            {children ?? n}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TrainingPage() {
  const label = (text: string) => (
    <div style={{ gridColumn: 'span 5', fontSize: 'var(--t10)', color: 'var(--c-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, fontWeight: 600 }}>{text}</div>
  )

  return (
    <>
      {/* ── BOX MODEL VISUALISATION ── */}
      <div style={{ maxWidth: 'var(--canvas-w)', margin: '0 auto', padding: '96px var(--margin)' }}>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 'var(--sp32)', marginBottom: 'var(--sp64)' }}>
          {([['Margin', C.margin], ['Border', C.border], ['Padding', C.padding], ['Content', C.content], ['Gap / Spacing', C.gap]] as [string, string][]).map(([name, color]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp8)' }}>
              <div style={{ width: '16px', height: '16px', background: color, border: name === 'Content' ? '1px solid var(--c-border)' : 'none' }} />
              <span style={{ fontSize: 'var(--t13)', color: 'var(--c-text)' }}>{name}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 'var(--sp96)', alignItems: 'flex-start' }}>

          {/* Box model demo */}
          <div>
            <div style={{ fontSize: 'var(--t11)', color: 'var(--c-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 'var(--sp24)' }}>Box model</div>
            <div style={{ background: C.margin, padding: '32px', display: 'inline-block', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '8px', left: '10px', fontSize: '10px', fontWeight: 600, color: '#111' }}>margin</span>
              <div style={{ border: `6px solid ${C.border}`, position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-1px', left: '6px', fontSize: '10px', fontWeight: 600, color: 'white', background: C.border, padding: '0 4px' }}>border</span>
                <div style={{ background: C.padding, padding: '24px', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '4px', left: '8px', fontSize: '10px', fontWeight: 600, color: 'white' }}>padding</span>
                  <div style={{ width: '160px', height: '80px', background: C.content, border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--t13)', color: 'var(--c-muted)' }}>
                    content
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gap / spacing demo */}
          <div>
            <div style={{ fontSize: 'var(--t11)', color: 'var(--c-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 'var(--sp24)' }}>Gap / spacing</div>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <div style={{ width: '160px', height: '120px', background: C.content, border: '1px solid black' }} />
              <div style={{ width: '48px', background: C.gap, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'white', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>gap</span>
              </div>
              <div style={{ width: '160px', height: '120px', background: C.content, border: '1px solid black' }} />
            </div>
          </div>

        </div>
      </div>

      {/* ── GRID TRAINING ── */}
      <div style={{ paddingTop: '96px', paddingBottom: '96px', background: 'var(--c-surface)' }}>

        <div style={{
          maxWidth: 'var(--canvas-w)',
          margin: '0 auto',
          padding: '0 var(--margin)',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 220px)',
          alignItems: 'start',
          gap: 'var(--sp48)',
          background: 'var(--c-surface)',
        }}>
          {label('R1')}

          {/* Box 1 — content area holds 1.1 and 1.2 */}
          <ModelBox n={1} cols={3} height={320}>
            <div style={{ width: '100%', height: '100%', display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, background: C.margin, border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--t13)', color: 'var(--c-muted)' }}>1.2</div>
              <div style={{ flex: 1, background: C.margin, border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--t13)', color: 'var(--c-muted)' }}>1.1</div>
            </div>
          </ModelBox>
          <ModelBox n={2} cols={1} height={320} />
          <ModelBox n={3} cols={1} height={320} />

          {label('R2')}
          <div style={{ gridColumn: 'span 5', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--sp24)' }}>
            {[4, 5, 6, 7, 8].map(n => (
              <ModelBox key={n} n={n} />
            ))}
          </div>

          {label('R3')}
          <ModelBox n={9} cols={5} />

          {label('R4')}
          {/* 5 circles — box model layers in circular form */}
          {[10, 11, 12, 13, 14].map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '208px' }}>
              {/* Margin layer */}
              <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: C.margin, padding: '8px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Border layer */}
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: `3px solid ${C.border}`, boxSizing: 'border-box', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Padding layer */}
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: C.padding, padding: '12px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Content layer */}
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: C.content, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--t13)', color: 'var(--c-muted)' }}>
                      {n}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {label('R5')}
          {/* 5 triangles — layers scaled from centroid for uniform visual thickness */}
          {[15, 16, 17, 18, 19].map(n => {
            const tri = 'polygon(50% 0%, 0% 100%, 100% 100%)'
            const origin = '50% 66.67%'
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '208px' }}>
                <div style={{ width: '200px', height: '200px', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: C.margin,  clipPath: tri }} />
                  <div style={{ position: 'absolute', inset: 0, background: C.border,  clipPath: tri, transform: 'scale(0.87)', transformOrigin: origin }} />
                  <div style={{ position: 'absolute', inset: 0, background: C.padding, clipPath: tri, transform: 'scale(0.82)', transformOrigin: origin }} />
                  <div style={{ position: 'absolute', inset: 0, background: C.content, clipPath: tri, transform: 'scale(0.63)', transformOrigin: origin }} />
                  <div style={{ position: 'absolute', top: '66.67%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 'var(--t13)', color: 'var(--c-muted)', pointerEvents: 'none' }}>{n}</div>
                </div>
              </div>
            )
          })}
        </div>

      </div>

    </>
  )
}
