import { useState, useEffect } from 'react'
import { useHashNav } from '../hooks/useHashNav'
import initialData from '../data/backlog.json'

/*
 * BACKLOG PAGE — /#/backlog
 *
 * ─── CANVAS & LAYOUT ──────────────────────────────────────────────────
 * Canvas: 1470×956. Margin: 88px. Content area: 1294px.
 * 3-column kanban per category section.
 * Columns: 3 equal @ (1294 − 2×24) ÷ 3 = 415px each (CSS grid 1fr)
 * Column gap: 24px (--gutter)
 * Section gap: 64px
 *
 * ─── COMPONENT HEIGHTS (Inside-Out) ───────────────────────────────────
 * Page header padding-top: 64px
 * Section title:    21px / 32px lh   → display heading
 * Column header:    10px / 16px lh + 12px×2 = 40px
 * Card padding:     16px
 * Card title:       13px / 24px lh, 500
 * Card description: 13px / 24px lh, 400
 * Card meta:        11px / 16px lh
 * Add item row:     32px (13px/24lh + 4px×2)
 *
 * ─── STATUS COLORS ────────────────────────────────────────────────────
 * Not Started: surface bg, muted text
 * In Progress: accent-bg, accent text
 * Done:        hsl(160,50%,94%) bg, hsl(160,50%,26%) text
 */

// ─── TYPES ─────────────────────────────────────────────────────────────
type Status   = 'not_started' | 'in_progress' | 'done'
type Category = 'design_system' | 'color' | 'design_system_architecture' | 'subagent_pipeline' | 'docs_website' | 'test_designs'

interface BacklogItem {
  id:            string
  title:         string
  description:   string
  status:        Status
  category:      Category
  dateAdded:     string
  dateCompleted: string | null
}

// ─── CONSTANTS ─────────────────────────────────────────────────────────
const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'design_system',              label: 'Design System'                      },
  { id: 'color',                      label: 'Color'                              },
  { id: 'design_system_architecture', label: 'Design System Architecture'         },
  { id: 'subagent_pipeline',          label: 'Subagent Pipeline'                  },
  { id: 'docs_website',               label: 'Documentation Website'              },
  { id: 'test_designs',               label: 'Test Designs'                       },
]

const STATUSES: { id: Status; label: string }[] = [
  { id: 'not_started', label: 'Not Started' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done',        label: 'Done'        },
]

const STATUS_COLORS: Record<Status, { bg: string; fg: string; dot: string }> = {
  not_started: { bg: '#F5F5F5',          fg: '#888888',          dot: '#BBBBBB'          },
  in_progress: { bg: '#EEEEFF',          fg: '#1400FF',          dot: '#1400FF'          },
  done:        { bg: 'hsl(160,50%,94%)', fg: 'hsl(160,50%,26%)', dot: 'hsl(160,50%,42%)' },
}

const TODAY = new Date().toISOString().split('T')[0]

function fmtDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── LOAD / PERSIST ────────────────────────────────────────────────────
const LS_KEY = 'fibo_backlog_state'

function loadItems(): BacklogItem[] {
  try {
    const stored = localStorage.getItem(LS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return initialData.items as BacklogItem[]
}

// ─── CARD ──────────────────────────────────────────────────────────────
function Card({
  item, onMove,
}: {
  item: BacklogItem
  onMove: (id: string, status: Status) => void
}) {
  const [hovered, setHovered] = useState(false)

  const prevStatus: Record<Status, Status | null> = {
    not_started: null,
    in_progress: 'not_started',
    done:        'in_progress',
  }
  const nextStatus: Record<Status, Status | null> = {
    not_started: 'in_progress',
    in_progress: 'done',
    done:        null,
  }
  const nextLabel: Record<Status, string> = {
    not_started: '→ In Progress',
    in_progress: '→ Done',
    done:        '',
  }
  const prevLabel: Record<Status, string> = {
    not_started: '',
    in_progress: '← Not Started',
    done:        '← In Progress',
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   '#FFFFFF',
        border:       `1px solid ${hovered ? '#C8C8C8' : '#DCDCDC'}`,
        borderRadius: '8px',
        padding:      '16px',
        display:      'flex',
        flexDirection:'column',
        gap:          '8px',
        transition:   'border-color 0.1s, box-shadow 0.1s',
        boxShadow:    hovered ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      {/* Title */}
      <div style={{ fontSize: '13px', lineHeight: '24px', fontWeight: 500, color: '#111111' }}>
        {item.title}
      </div>

      {/* Description */}
      {item.description && (
        <div style={{ fontSize: '13px', lineHeight: '24px', color: '#888888' }}>
          {item.description}
        </div>
      )}

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {item.status === 'done' && item.dateCompleted && (
            <span style={{ fontSize: '11px', lineHeight: '16px', color: 'hsl(160,50%,42%)', fontWeight: 500 }}>
              ✓ {fmtDate(item.dateCompleted)}
            </span>
          )}
          {item.status !== 'done' && (
            <span style={{ fontSize: '11px', lineHeight: '16px', color: '#BBBBBB' }}>
              Added {fmtDate(item.dateAdded)}
            </span>
          )}
        </div>
      </div>

      {/* Move actions — visible on hover */}
      {hovered && (prevStatus[item.status] || nextStatus[item.status]) && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', borderTop: '1px solid #EBEBEB', paddingTop: '8px' }}>
          {prevStatus[item.status] && (
            <button
              onClick={() => onMove(item.id, prevStatus[item.status]!)}
              style={{
                height:      '24px',
                padding:     '0 8px',
                background:  'transparent',
                border:      '1px solid #DCDCDC',
                borderRadius:'4px',
                fontSize:    '11px',
                lineHeight:  '16px',
                color:       '#888888',
                cursor:      'pointer',
                fontFamily:  'inherit',
              }}
            >
              {prevLabel[item.status]}
            </button>
          )}
          {nextStatus[item.status] && (
            <button
              onClick={() => onMove(item.id, nextStatus[item.status]!)}
              style={{
                height:      '24px',
                padding:     '0 8px',
                background:  '#111111',
                border:      'none',
                borderRadius:'4px',
                fontSize:    '11px',
                lineHeight:  '16px',
                color:       '#FFFFFF',
                cursor:      'pointer',
                fontFamily:  'inherit',
              }}
            >
              {nextLabel[item.status]}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── ADD ITEM FORM ──────────────────────────────────────────────────────
function AddItemForm({
  category, status, onAdd, onCancel,
}: {
  category: Category
  status:   Status
  onAdd:    (item: BacklogItem) => void
  onCancel: () => void
}) {
  const [title, setTitle]   = useState('')
  const [desc,  setDesc]    = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      id:            `user-${Date.now()}`,
      title:         title.trim(),
      description:   desc.trim(),
      status,
      category,
      dateAdded:     TODAY,
      dateCompleted: status === 'done' ? TODAY : null,
    })
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Item title…"
        style={{
          height:      '32px',
          padding:     '0 8px',
          fontSize:    '13px',
          lineHeight:  '24px',
          border:      '1px solid #1400FF',
          borderRadius:'4px',
          outline:     'none',
          fontFamily:  'inherit',
          color:       '#111111',
          background:  '#FFFFFF',
          boxSizing:   'border-box',
          width:       '100%',
        }}
      />
      <textarea
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="Description (optional)…"
        rows={2}
        style={{
          padding:     '8px',
          fontSize:    '13px',
          lineHeight:  '24px',
          border:      '1px solid #DCDCDC',
          borderRadius:'4px',
          outline:     'none',
          fontFamily:  'inherit',
          color:       '#111111',
          background:  '#FFFFFF',
          resize:      'vertical',
          boxSizing:   'border-box',
          width:       '100%',
        }}
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="submit"
          style={{
            height:      '32px',
            padding:     '0 12px',
            background:  '#111111',
            border:      'none',
            borderRadius:'4px',
            fontSize:    '13px',
            lineHeight:  '24px',
            color:       '#FFFFFF',
            cursor:      'pointer',
            fontFamily:  'inherit',
            fontWeight:  500,
          }}
        >
          Add
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            height:      '32px',
            padding:     '0 12px',
            background:  'transparent',
            border:      '1px solid #DCDCDC',
            borderRadius:'4px',
            fontSize:    '13px',
            lineHeight:  '24px',
            color:       '#888888',
            cursor:      'pointer',
            fontFamily:  'inherit',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ─── COLUMN ─────────────────────────────────────────────────────────────
function Column({
  status, category, items, onMove, onAdd,
}: {
  status:   Status
  category: Category
  items:    BacklogItem[]
  onMove:   (id: string, status: Status) => void
  onAdd:    (item: BacklogItem) => void
}) {
  const [adding, setAdding] = useState(false)
  const { bg, fg, dot } = STATUS_COLORS[status]
  const label = STATUSES.find(s => s.id === status)!.label

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>

      {/* Column header — 40px (10px/16lh + 12px×2) */}
      <div style={{
        height:        '40px',
        padding:       '0 12px',
        background:    bg,
        borderRadius:  '6px 6px 0 0',
        border:        '1px solid #DCDCDC',
        borderBottom:  'none',
        display:       'flex',
        alignItems:    'center',
        gap:           '8px',
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
        <span style={{ fontSize: '10px', lineHeight: '16px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: fg }}>
          {label}
        </span>
        <span style={{
          height:      '16px',
          padding:     '0 6px',
          background:  '#FFFFFF',
          border:      '1px solid #DCDCDC',
          borderRadius:'8px',
          fontSize:    '10px',
          lineHeight:  '16px',
          color:       '#888888',
          fontWeight:  500,
        }}>
          {items.length}
        </span>
      </div>

      {/* Cards area */}
      <div style={{
        flex:          1,
        border:        '1px solid #DCDCDC',
        borderTop:     'none',
        borderRadius:  '0 0 6px 6px',
        background:    '#FAFAFA',
        padding:       '8px',
        display:       'flex',
        flexDirection: 'column',
        gap:           '8px',
        minHeight:     '80px',
      }}>
        {items.map(item => (
          <Card key={item.id} item={item} onMove={onMove} />
        ))}

        {adding ? (
          <AddItemForm
            category={category}
            status={status}
            onAdd={item => { onAdd(item); setAdding(false) }}
            onCancel={() => setAdding(false)}
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            style={{
              height:      '32px',
              padding:     '4px 8px',
              background:  'transparent',
              border:      '1px dashed #DCDCDC',
              borderRadius:'4px',
              fontSize:    '13px',
              lineHeight:  '24px',
              color:       '#BBBBBB',
              cursor:      'pointer',
              fontFamily:  'inherit',
              textAlign:   'left',
              transition:  'border-color 0.1s, color 0.1s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#888888'
              e.currentTarget.style.color = '#888888'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#DCDCDC'
              e.currentTarget.style.color = '#BBBBBB'
            }}
          >
            + Add item
          </button>
        )}
      </div>
    </div>
  )
}

// ─── CATEGORY SECTION ───────────────────────────────────────────────────
function CategorySection({
  category, items, onMove, onAdd,
}: {
  category: { id: Category; label: string }
  items:    BacklogItem[]
  onMove:   (id: string, status: Status) => void
  onAdd:    (item: BacklogItem) => void
}) {
  const sectionId = category.id.replace(/_/g, '-')
  const byStatus = (s: Status) => items.filter(i => i.status === s)
  const total    = items.length
  const done     = byStatus('done').length
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <section id={sectionId}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '21px', lineHeight: '32px', fontWeight: 600, color: '#111111', margin: 0 }}>
          {category.label}
        </h2>
        <span style={{ fontSize: '13px', lineHeight: '24px', color: '#888888' }}>
          {done}/{total} done
        </span>
        {/* Progress bar */}
        <div style={{ flex: 1, height: '4px', background: '#EBEBEB', borderRadius: '2px', maxWidth: '129px', alignSelf: 'center' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'hsl(160,50%,42%)', borderRadius: '2px', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* 3-column kanban grid */}
      <div className="kanban-scroll">
      <div style={{
        display:             'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap:                 '24px',
      }}>
        {STATUSES.map(s => (
          <Column
            key={s.id}
            status={s.id}
            category={category.id}
            items={byStatus(s.id)}
            onMove={onMove}
            onAdd={onAdd}
          />
        ))}
      </div>
      </div>
    </section>
  )
}

// ─── ROOT ───────────────────────────────────────────────────────────────
export default function BacklogPage() {
  useHashNav()
  const [items, setItems] = useState<BacklogItem[]>(loadItems)
  const [copied, setCopied] = useState(false)

  // Persist every change to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items))
  }, [items])

  function moveItem(id: string, newStatus: Status) {
    setItems(prev => prev.map(item =>
      item.id === id
        ? {
            ...item,
            status:        newStatus,
            dateCompleted: newStatus === 'done' ? TODAY : null,
          }
        : item
    ))
  }

  function addItem(item: BacklogItem) {
    setItems(prev => [...prev, item])
  }

  function copyJson() {
    const payload = JSON.stringify({ items }, null, 2)
    navigator.clipboard.writeText(payload).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function resetToJson() {
    if (confirm('Reset to the JSON file data? This will discard all session changes.')) {
      localStorage.removeItem(LS_KEY)
      setItems(initialData.items as BacklogItem[])
    }
  }

  const totalItems = items.length
  const doneItems  = items.filter(i => i.status === 'done').length

  return (
    <div style={{
      maxWidth:   'var(--content-w)',   /* 1294px */
      margin:     '0 auto',
      padding:    '64px var(--margin) 96px',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '64px' }}>
        <div>
          <h1 style={{ fontSize: '34px', lineHeight: '40px', fontWeight: 700, color: '#111111', margin: '0 0 8px' }}>
            Backlog
          </h1>
          <p style={{ fontSize: '13px', lineHeight: '24px', color: '#888888', margin: 0 }}>
            FIBO feature backlog — {doneItems} of {totalItems} items complete
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '8px' }}>
          <button
            onClick={resetToJson}
            style={{
              height:      '32px',
              padding:     '0 12px',
              background:  'transparent',
              border:      '1px solid #DCDCDC',
              borderRadius:'4px',
              fontSize:    '13px',
              lineHeight:  '24px',
              color:       '#888888',
              cursor:      'pointer',
              fontFamily:  'inherit',
            }}
          >
            Reset
          </button>
          <button
            onClick={copyJson}
            style={{
              height:      '32px',
              padding:     '0 12px',
              background:  copied ? 'hsl(160,50%,42%)' : '#111111',
              border:      'none',
              borderRadius:'4px',
              fontSize:    '13px',
              lineHeight:  '24px',
              fontWeight:  500,
              color:       '#FFFFFF',
              cursor:      'pointer',
              fontFamily:  'inherit',
              transition:  'background 0.2s',
            }}
          >
            {copied ? '✓ Copied' : 'Copy JSON'}
          </button>
        </div>
      </div>

      {/* Category sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
        {CATEGORIES.map(cat => (
          <CategorySection
            key={cat.id}
            category={cat}
            items={items.filter(i => i.category === cat.id)}
            onMove={moveItem}
            onAdd={addItem}
          />
        ))}
      </div>
    </div>
  )
}
