import { useState } from 'react'
import { Link } from 'react-router-dom'

/*
 * PULSE — Project Management Interface
 * Route: /#/test/tracker
 *
 * ─── COLOR SYSTEM ─────────────────────────────────────────────────────
 * Primary hue: Indigo (HSL 235°) — professional, systematic, modern PM tool
 * FIBO shade steps applied (lightness %): 6, 26, 42, 58, 74, 90, 94
 *
 * Color proportion (FIBO 42/26/16/10/6):
 *   Dominant  42%: #FFFFFF           — main content bg
 *   Secondary 26%: hsl(235,10%,94%)  — sidebar, secondary surfaces  L=94
 *   Structural 16%: hsl(235,16%,90%) — borders, dividers             L=90
 *   Primary   10%: hsl(235,84%,42%)  — brand, buttons, active        L=42
 *   Accent     6%: hsl(235,74%,58%)  — hover, focus, highlights      L=58
 *
 * Priority colors — all at FIBO L=42 (fill), L=90 (bg), L=26 (text):
 *   Critical: hsl(0,84%,42%)  High: hsl(28,84%,42%)
 *   Medium:   hsl(42,84%,42%) Low:  hsl(235,10%,58%) [L=58 muted]
 *
 * Opacity steps (FIBO): 84%, 42%, 16%, 10%, 6%
 *
 * ─── CANVAS & LAYOUT ──────────────────────────────────────────────────
 * Canvas: 1470 × 956 (MacBook Air M4)
 * Full-viewport app — height:100vh, no outer scroll, 3-panel flex layout
 *
 * Sidebar:      1470 × 16% = 235.2 → 235px  (F3 of canvas, layout.md)
 * Remaining:    1470 − 235 = 1235px
 * Task section: 1235 × 68% = 839.8 → 840px  (F4+F5 of 1235px)
 * Detail panel: 1235 × 32% = 395.2 → 395px  (F1+F2+F3 of 1235px)
 * Check:        235 + 840 + 395 = 1470px ✓
 *
 * ─── COMPONENT HEIGHTS (Inside-Out, Signal 5) ─────────────────────────
 * App/toolbar bar:   13px / 24px lh + 12px × 2 = 48px ✓
 * Workspace row:     13px / 16px lh (alt) × 2 lines + 8px × 2 = 48px ✓
 * Section header:    10px / 16px lh + 8px × 2  = 32px ✓
 * Nav / task row:    13px / 24px lh + 4px × 2  = 32px ✓
 * Toolbar button:    13px / 24px lh + 4px × 2  = 32px ✓
 * Detail meta row:   13px / 24px lh + 8px × 2  = 40px ✓
 * Priority pill:     10px / 16px lh + 4px × 2  = 24px ✓
 * Label tag:         10px / 16px lh + 4px × 2  = 24px ✓
 * Status badge:      10px / 16px lh + 4px × 2  = 24px ✓
 * Avatar:            24px × 24px (consistent — Signal 1)
 * Checkbox:          16px × 16px
 * Subtask row:       13px / 24px lh + 4px × 2  = 32px ✓
 *
 * ─── TYPOGRAPHY ───────────────────────────────────────────────────────
 * App name:           13px / 24px lh, 700, mono
 * Sidebar section:    10px / 16px lh, 600, uppercase
 * Nav item:           13px / 24px lh, 400
 * Workspace name:     13px / 16px lh (alt — 2-line compact)
 * Member count:       10px / 16px lh
 * Breadcrumb:         13px / 24px lh
 * Group status label: 10px / 16px lh, 700, uppercase
 * Task title:         13px / 24px lh
 * Priority/badge:     10px / 16px lh, 600
 * Due date:           11px / 16px lh
 * Avatar initials:    10px / 16px lh, 700
 * Detail title:       18px / 32px lh (alt — display heading in panel)
 * Detail meta label:  11px / 16px lh, 500
 * Detail meta value:  13px / 24px lh
 * Description body:   13px / 24px lh
 * Activity name:      13px / 24px lh, 500
 * Timestamp:          11px / 16px lh
 */

// ─── TYPES ─────────────────────────────────────────────────────────────
type Priority  = 'Critical' | 'High' | 'Medium' | 'Low'
type Status    = 'To Do' | 'In Progress' | 'In Review' | 'Done'
type SubStatus = 'done' | 'progress' | 'todo'

interface Task {
  id:           number
  title:        string
  status:       Status
  priority?:    Priority
  assignee?:    string
  assigneeName?: string
  label?:       string
  due?:         string
  overdue?:     boolean
  doneDate?:    string
}

// ─── COLOR TOKENS ──────────────────────────────────────────────────────
const C = {
  // Indigo (HSL 235°) — FIBO shade steps
  bg:          '#FFFFFF',
  surface:     'hsl(235, 10%, 94%)',    // L=94 sidebar / secondary surface
  border:      'hsl(235, 16%, 90%)',    // L=90 borders / dividers
  brand:       'hsl(235, 84%, 42%)',    // L=42 brand primary
  brandHov:    'hsl(235, 74%, 58%)',    // L=58 hover / focus
  brandPale:   'hsl(235, 84%, 90%)',    // L=90 brand hue — badge bg / sidebar active
  rowActive:   'hsl(235, 42%, 94%)',    // L=94 + 42% sat — active row (subtle)
  text:        'hsl(235, 20%,  6%)',    // L=6  primary text
  textMid:     'hsl(235, 16%, 26%)',    // L=26 secondary text
  textMuted:   'hsl(235, 10%, 58%)',    // L=58 muted
  textFaint:   'hsl(235, 10%, 74%)',    // L=74 placeholder / disabled
  // Priority (filled L=42, bg L=90, text L=26 — four hues)
  critical:    'hsl(0,   84%, 42%)',
  critBg:      'hsl(0,   84%, 90%)',
  critTxt:     'hsl(0,   84%, 26%)',
  high:        'hsl(28,  84%, 42%)',
  highBg:      'hsl(28,  84%, 90%)',
  highTxt:     'hsl(28,  84%, 26%)',
  medium:      'hsl(42,  84%, 42%)',
  medBg:       'hsl(42,  84%, 90%)',
  medTxt:      'hsl(42,  84%, 26%)',
  low:         'hsl(235, 10%, 58%)',
  lowBg:       'hsl(235, 10%, 94%)',
  lowTxt:      'hsl(235, 16%, 26%)',
  // Status badge colors
  inProgColor: 'hsl(235, 84%, 42%)',
  inProgBg:    'hsl(235, 84%, 90%)',
  reviewColor: 'hsl(270, 60%, 42%)',
  reviewBg:    'hsl(270, 60%, 90%)',
  doneColor:   'hsl(160, 60%, 42%)',
  doneBg:      'hsl(160, 60%, 90%)',
  overdue:     'hsl(0, 84%, 42%)',
  // Project dots (4 hues, all at L=42)
  dot1: 'hsl(235, 84%, 42%)',
  dot2: 'hsl(160, 60%, 42%)',
  dot3: 'hsl(28,  84%, 42%)',
  dot4: 'hsl(315, 70%, 42%)',
} as const

const AVATAR_CLR: Record<string, { bg: string; fg: string }> = {
  'AC': { bg: 'hsl(235, 84%, 42%)', fg: '#fff' },
  'SK': { bg: 'hsl(315, 70%, 42%)', fg: '#fff' },
  'JL': { bg: 'hsl(160, 60%, 42%)', fg: '#fff' },
  'MP': { bg: 'hsl(28,  84%, 42%)', fg: '#fff' },
  '--': { bg: 'hsl(235, 10%, 84%)', fg: 'hsl(235, 10%, 42%)' },
}

const LABEL_CLR: Record<string, { bg: string; fg: string }> = {
  'Backend':       { bg: 'hsl(235, 84%, 90%)', fg: 'hsl(235, 84%, 26%)' },
  'Frontend':      { bg: 'hsl(160, 60%, 90%)', fg: 'hsl(160, 60%, 26%)' },
  'Design':        { bg: 'hsl(315, 70%, 90%)', fg: 'hsl(315, 70%, 26%)' },
  'Content':       { bg: 'hsl(28,  84%, 90%)', fg: 'hsl(28,  84%, 26%)' },
  'Research':      { bg: 'hsl(270, 60%, 90%)', fg: 'hsl(270, 60%, 26%)' },
  'Design System': { bg: 'hsl(315, 70%, 90%)', fg: 'hsl(315, 70%, 26%)' },
}

// ─── DATA ──────────────────────────────────────────────────────────────
const TASKS: Task[] = [
  { id:1,  status:'To Do',       title:'Set up CI/CD pipeline for staging environment',   priority:'High',     assignee:'AC', assigneeName:'Alex Chen',  label:'Backend',  due:'Apr 12' },
  { id:2,  status:'To Do',       title:'Write copy for the about page',                   priority:'Medium',   assignee:'SK', assigneeName:'Sarah Kim',  label:'Content',  due:'Apr 14' },
  { id:3,  status:'To Do',       title:'Design mobile navigation pattern',                priority:'High',     assignee:'JL', assigneeName:'James Liu',  label:'Design',   due:'Apr 10' },
  { id:4,  status:'To Do',       title:'Implement dark mode toggle',                      priority:'Low',      assignee:'--', assigneeName:'Unassigned', label:'Frontend' },
  { id:5,  status:'To Do',       title:'Create API documentation for v2 endpoints',       priority:'Medium',   assignee:'AC', assigneeName:'Alex Chen',  label:'Backend',  due:'Apr 18' },
  { id:6,  status:'To Do',       title:'Source and optimise hero photography',            priority:'Medium',   assignee:'SK', assigneeName:'Sarah Kim',  label:'Design',   due:'Apr 15' },
  { id:7,  status:'In Progress', title:'Build responsive grid component',                 priority:'High',     assignee:'JL', assigneeName:'James Liu',  label:'Frontend', due:'Apr 8',  overdue:true },
  { id:8,  status:'In Progress', title:'User research interviews round 2',                priority:'High',     assignee:'MP', assigneeName:'Maya Patel', label:'Research', due:'Apr 11' },
  { id:9,  status:'In Progress', title:'Migrate authentication to OAuth 2.0',             priority:'Critical', assignee:'AC', assigneeName:'Alex Chen',  label:'Backend',  due:'Apr 9',  overdue:true },
  { id:10, status:'In Progress', title:'Accessibility audit of current site',             priority:'Medium',   assignee:'MP', assigneeName:'Maya Patel', label:'Design',   due:'Apr 13' },
  { id:11, status:'In Review',   title:'Homepage hero section redesign',                  priority:'High',     assignee:'JL', assigneeName:'James Liu',  label:'Design',   due:'Apr 7' },
  { id:12, status:'In Review',   title:'Performance optimisation for image loading',      priority:'Medium',   assignee:'AC', assigneeName:'Alex Chen',  label:'Frontend', due:'Apr 8' },
  { id:13, status:'In Review',   title:'Content strategy document',                       priority:'Low',      assignee:'SK', assigneeName:'Sarah Kim',  label:'Content',  due:'Apr 9' },
  { id:14, status:'Done', title:'Set up Figma design system library',   doneDate:'Apr 3' },
  { id:15, status:'Done', title:'Define colour palette and typography',  doneDate:'Apr 2' },
  { id:16, status:'Done', title:'Stakeholder kickoff presentation',      doneDate:'Mar 28' },
  { id:17, status:'Done', title:'Competitive analysis document',         doneDate:'Mar 25' },
  { id:18, status:'Done', title:'Project brief and timeline',            doneDate:'Mar 22' },
]

const ACTIVE_ID = 7

// ─── MICRO COMPONENTS ──────────────────────────────────────────────────

function Av({ initials, size = 24 }: { initials: string; size?: number }) {
  const { bg, fg } = AVATAR_CLR[initials] ?? AVATAR_CLR['--']
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: fg, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '10px', lineHeight: '16px', fontWeight: 700,
    }}>
      {initials === '--' ? '?' : initials}
    </div>
  )
}

function PriorityPill({ p }: { p: Priority }) {
  const map: Record<Priority, { dot: string; bg: string; fg: string; label: string }> = {
    Critical: { dot: C.critical, bg: C.critBg, fg: C.critTxt, label: 'Critical' },
    High:     { dot: C.high,     bg: C.highBg, fg: C.highTxt, label: 'High'     },
    Medium:   { dot: C.medium,   bg: C.medBg,  fg: C.medTxt,  label: 'Medium'   },
    Low:      { dot: C.low,      bg: C.lowBg,  fg: C.lowTxt,  label: 'Low'      },
  }
  const { dot, bg, fg, label } = map[p]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
      width: '64px', boxSizing: 'border-box',   /* Inside-Out: "Critical"+dot+8px×2 = 62px → 64px */
      height: '24px', padding: '0 8px',   /* 10px/16lh + 4px×2 = 24px ✓ */
      background: bg, borderRadius: '4px',
      fontSize: '10px', lineHeight: '16px',
      fontWeight: 600, color: fg, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
      {label}
    </span>
  )
}

function LabelTag({ label }: { label: string }) {
  const { bg, fg } = LABEL_CLR[label] ?? { bg: C.surface, fg: C.textMuted }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '88px', boxSizing: 'border-box',   /* Inside-Out: "Design System"+8px×2 = 83px → 88px */
      height: '24px', padding: '0 8px',   /* 10px/16lh + 4px×2 = 24px ✓ */
      background: bg, borderRadius: '4px',
      fontSize: '10px', lineHeight: '16px',
      fontWeight: 500, color: fg, whiteSpace: 'nowrap',
      overflow: 'hidden', textOverflow: 'ellipsis',
    }}>
      {label}
    </span>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { bg: string; fg: string }> = {
    'To Do':       { bg: C.surface,    fg: C.textMuted      },
    'In Progress': { bg: C.inProgBg,   fg: C.inProgColor    },
    'In Review':   { bg: C.reviewBg,   fg: C.reviewColor    },
    'Done':        { bg: C.doneBg,     fg: C.doneColor      },
  }
  const { bg, fg } = map[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: '24px', padding: '0 8px',   /* 10px/16lh + 4px×2 = 24px ✓ */
      background: bg, borderRadius: '4px',
      fontSize: '10px', lineHeight: '16px',
      fontWeight: 600, color: fg, whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}

// ─── SIDEBAR ───────────────────────────────────────────────────────────

function SidebarSection({
  label, open, onToggle, children,
}: {
  label: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <>
      <div onClick={onToggle} style={{
        height: '32px', padding: '8px 16px',  /* 10px/16lh + 8px×2 = 32px ✓ */
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer', flexShrink: 0,
        userSelect: 'none',
      }}>
        <span style={{ fontSize: '10px', lineHeight: '16px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: C.textMuted }}>
          {label}
        </span>
        <span style={{ fontSize: '16px', lineHeight: '24px', color: C.textMuted, display: 'inline-block', transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform 0.15s' }}>
          ▾
        </span>
      </div>
      {open && <>{children}</>}
      <div style={{ height: '1px', background: C.border, margin: '4px 0', flexShrink: 0 }} />
    </>
  )
}

function NavItem({ label, active = false, indent = false }: { label: string; active?: boolean; indent?: boolean }) {
  return (
    <div style={{
      height: '32px', padding: `4px 16px 4px ${indent ? 28 : 16}px`,  /* 13px/24lh + 4px×2 = 32px ✓ */
      display: 'flex', alignItems: 'center',
      background: active ? C.brandPale : 'transparent',
      cursor: 'pointer',
      fontSize: '13px', lineHeight: '24px',
      fontWeight: active ? 500 : 400,
      color: active ? C.brand : C.textMid,
    }}>
      {label}
    </div>
  )
}

function ProjectItem({ name, count, dot, active = false }: { name: string; count: number; dot: string; active?: boolean }) {
  return (
    <div style={{
      height: '32px', padding: '4px 16px 4px 28px',   /* 32px ✓ */
      display: 'flex', alignItems: 'center', gap: '8px',
      background: active ? C.brandPale : 'transparent',
      cursor: 'pointer',
    }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0, fontSize: '13px', lineHeight: '24px', fontWeight: active ? 500 : 400, color: active ? C.brand : C.textMid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {name}
      </span>
      <span style={{ fontSize: '11px', lineHeight: '16px', color: C.textMuted, flexShrink: 0 }}>{count}</span>
    </div>
  )
}

function Sidebar() {
  const [collapsed, setCollapsed] = useState(new Set<string>())
  const toggle = (s: string) => setCollapsed(prev => {
    const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n
  })
  const open = (s: string) => !collapsed.has(s)

  return (
    <div style={{
      width: '235px', flexShrink: 0,        /* F3 of 1470px canvas = 235px ✓ */
      height: '100vh',
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto', overflowX: 'hidden',
    }}>

      {/* App header — 48px (13px/24lh + 12px×2) */}
      <div style={{
        height: '48px', flexShrink: 0,
        padding: '0 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px',
            background: C.brand, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', lineHeight: '24px', fontWeight: 700, color: '#fff',
          }}>P</div>
          <span style={{
            fontSize: '13px', lineHeight: '24px', fontWeight: 700, color: C.text,
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em',
          }}>Pulse</span>
        </div>
        <Link to="/" style={{ fontSize: '11px', lineHeight: '16px', color: C.textFaint, textDecoration: 'none' }}>
          ← FIBO
        </Link>
      </div>

      {/* Workspace — 48px (8px×2 + 2×16px content lines) */}
      <div style={{
        height: '48px', flexShrink: 0,
        padding: '8px 16px',
        display: 'flex', alignItems: 'center', gap: '8px',
        borderBottom: `1px solid ${C.border}`,
        cursor: 'pointer',
      }}>
        <div style={{
          width: '24px', height: '24px', borderRadius: '4px',
          background: C.textMid, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', lineHeight: '16px', fontWeight: 700, color: '#fff',
        }}>A</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 13px / 16px lh — alt lh for 2-line compact context ✓ */}
          <div style={{ fontSize: '13px', lineHeight: '16px', fontWeight: 500, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Acme Corp
          </div>
          <div style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted }}>
            3 members
          </div>
        </div>
        <span style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted }}>▾</span>
      </div>

      {/* Search — 32px input, 48px section (8px pad + 32px + 8px pad) */}
      <div style={{ padding: '8px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{
          height: '32px', padding: '4px 8px',  /* 13px/24lh + 4px×2 = 32px ✓ */
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: '4px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ fontSize: '13px', lineHeight: '24px', color: C.textFaint }}>⌕</span>
          <span style={{ fontSize: '13px', lineHeight: '24px', color: C.textFaint }}>Search tasks…</span>
        </div>
      </div>

      {/* MY WORK */}
      <SidebarSection label="My Work"  open={open('mywork')} onToggle={() => toggle('mywork')}>
        <NavItem label="My tasks" indent />
        <NavItem label="Assigned to me" indent />
        <NavItem label="Created by me" indent />
      </SidebarSection>

      {/* PROJECTS */}
      <SidebarSection label="Projects" open={open('projects')} onToggle={() => toggle('projects')}>
        <ProjectItem name="Website Redesign" count={23} dot={C.dot1} active />
        <ProjectItem name="Mobile App v2"    count={12} dot={C.dot2} />
        <ProjectItem name="API Migration"    count={8}  dot={C.dot3} />
        <ProjectItem name="Design System"    count={31} dot={C.dot4} />
      </SidebarSection>

      {/* VIEWS */}
      <SidebarSection label="Views" open={open('views')} onToggle={() => toggle('views')}>
        <NavItem label="All tasks" indent />
        <NavItem label="Board" indent />
        <NavItem label="Calendar" indent />
      </SidebarSection>

      {/* TEAMS */}
      <SidebarSection label="Teams" open={open('teams')} onToggle={() => toggle('teams')}>
        <NavItem label="Engineering" indent />
        <NavItem label="Design" indent />
        <NavItem label="Product" indent />
      </SidebarSection>
    </div>
  )
}

// ─── TOOLBAR ───────────────────────────────────────────────────────────

function Toolbar({ view, setView }: { view: string; setView: (v: string) => void }) {
  return (
    <div style={{
      height: '48px', flexShrink: 0,      /* 13px/24lh + 12px×2 = 48px ✓ */
      padding: '0 24px',
      borderBottom: `1px solid ${C.border}`,
      background: C.bg,
      display: 'flex', alignItems: 'center', gap: '8px',
    }}>

      {/* Breadcrumb */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '13px', lineHeight: '24px', color: C.textMuted, flexShrink: 0 }}>Acme Corp</span>
        <span style={{ fontSize: '13px', lineHeight: '24px', color: C.textFaint, flexShrink: 0 }}>/</span>
        <span title="Website Redesign" style={{ fontSize: '13px', lineHeight: '24px', fontWeight: 500, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>Website Redesign</span>
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', border: `1px solid ${C.border}`, borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
        {(['List', 'Board', 'Table'] as const).map((v, i) => (
          <button key={v} onClick={() => setView(v)} style={{
            height: '32px', padding: '4px 12px',   /* 13px/24lh + 4px×2 = 32px ✓ */
            background: view === v ? C.brand : 'transparent',
            border: 'none',
            borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
            fontSize: '13px', lineHeight: '24px',
            fontWeight: view === v ? 500 : 400,
            color: view === v ? '#fff' : C.textMid,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{v}</button>
        ))}
      </div>

      {/* Filters */}
      {(['Status', 'Priority', 'Assignee', 'Label'] as const).map(f => (
        <button key={f} style={{
          height: '32px', padding: '4px 10px',       /* 32px ✓ */
          background: 'transparent',
          border: `1px solid ${C.border}`, borderRadius: '4px',
          fontSize: '13px', lineHeight: '24px', color: C.textMid,
          cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
        }}>{f}</button>
      ))}

      {/* Sort */}
      <button style={{
        height: '32px', padding: '4px 10px',
        background: 'transparent',
        border: `1px solid ${C.border}`, borderRadius: '4px',
        display: 'flex', alignItems: 'center', gap: '4px',
        fontSize: '13px', lineHeight: '24px', color: C.textMid,
        cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
      }}>Sort ▾</button>

      {/* New task */}
      <button style={{
        height: '32px', padding: '4px 12px',
        background: C.brand, border: 'none', borderRadius: '4px',
        fontSize: '13px', lineHeight: '24px',
        fontWeight: 500, color: '#fff',
        cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
      }}>+ New task</button>
    </div>
  )
}

// ─── TASK ROW ──────────────────────────────────────────────────────────

function TaskRow({ task, active, onClick }: { task: Task; active: boolean; onClick: () => void }) {
  const isDone = task.status === 'Done'
  return (
    <div onClick={onClick} style={{
      height: '32px', padding: '4px 24px',  /* 13px/24lh + 4px×2 = 32px ✓ */
      display: 'flex', alignItems: 'center', gap: '8px',
      background: active ? C.rowActive : 'transparent',
      borderBottom: `1px solid ${C.border}`,
      cursor: 'pointer',
      boxSizing: 'border-box',
    }}>

      {/* Checkbox — 16×16px visual, 32×32 tap target */}
      <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '-8px', cursor: 'pointer' }}>
        <div style={{
          width: '16px', height: '16px', borderRadius: '3px',
          background: isDone ? C.doneColor : 'transparent',
          border: isDone ? 'none' : `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isDone && <span style={{ fontSize: '8px', lineHeight: '16px', color: '#fff', fontWeight: 900 }}>✓</span>}
        </div>
      </div>

      {isDone ? (
        <>
          <span style={{ flex: 1, minWidth: 0, fontSize: '13px', lineHeight: '24px', color: C.textMuted, textDecoration: 'line-through', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {task.title}
          </span>
          <span style={{ fontSize: '11px', lineHeight: '16px', color: C.textFaint, whiteSpace: 'nowrap', flexShrink: 0 }}>
            Completed {task.doneDate}
          </span>
        </>
      ) : (
        <>
          {/* Priority — 80px column */}
          <div style={{ width: '80px', flexShrink: 0 }}>
            {task.priority && <PriorityPill p={task.priority} />}
          </div>

          {/* Title — fills remaining space */}
          <span style={{ flex: 1, minWidth: 0, fontSize: '13px', lineHeight: '24px', color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {task.title}
          </span>

          {/* Assignee avatar — 24px */}
          <Av initials={task.assignee ?? '--'} size={24} />

          {/* Label — 88px column */}
          <div style={{ width: '88px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            {task.label && <LabelTag label={task.label} />}
          </div>

          {/* Due date — 64px column */}
          <div style={{ width: '64px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '3px' }}>
            {task.due && (
              <>
                {task.overdue && (
                  <span style={{ fontSize: '13px', lineHeight: '16px', color: C.overdue, flexShrink: 0 }}>⚠</span>
                )}
                <span style={{ fontSize: '11px', lineHeight: '16px', color: task.overdue ? C.overdue : C.textMuted, fontWeight: task.overdue ? 600 : 400 }}>
                  {task.due}
                </span>
              </>
            )}
          </div>

          {/* Arrow — 16px glyph, 32px tap target */}
          <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '-4px' }}>
            <span style={{ fontSize: '16px', lineHeight: '24px', color: C.textFaint }}>›</span>
          </div>
        </>
      )}
    </div>
  )
}

// ─── TASK GROUP ────────────────────────────────────────────────────────

function TaskGroup({ status, tasks, activeId, onSelect }: {
  status: Status; tasks: Task[]; activeId: number; onSelect: (id: number) => void
}) {
  const [open, setOpen] = useState(true)
  const statusFg: Record<Status, string> = {
    'To Do':       C.textMuted,
    'In Progress': C.inProgColor,
    'In Review':   C.reviewColor,
    'Done':        C.doneColor,
  }
  return (
    <div>
      {/* Group header — 32px (10px/16lh + 8px×2) */}
      <div onClick={() => setOpen(v => !v)} style={{
        height: '32px', padding: '8px 24px',
        display: 'flex', alignItems: 'center', gap: '8px',
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        cursor: 'pointer',
        position: 'sticky', top: 0, zIndex: 1,
        userSelect: 'none',
      }}>
        <span style={{ fontSize: '16px', lineHeight: '24px', color: C.textMuted, display: 'inline-block', transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform 0.15s' }}>▾</span>
        <span style={{ fontSize: '10px', lineHeight: '16px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: statusFg[status] }}>
          {status}
        </span>
        <span style={{ fontSize: '10px', lineHeight: '16px', color: C.textMuted }}>{tasks.length}</span>
      </div>
      {open && tasks.map(t => (
        <TaskRow key={t.id} task={t} active={t.id === activeId} onClick={() => onSelect(t.id)} />
      ))}
    </div>
  )
}

// ─── TASK LIST ─────────────────────────────────────────────────────────

function TaskList({ activeId, onSelect }: { activeId: number; onSelect: (id: number) => void }) {
  const statuses: Status[] = ['To Do', 'In Progress', 'In Review', 'Done']
  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg }}>
      {statuses.map(s => (
        <TaskGroup
          key={s}
          status={s}
          tasks={TASKS.filter(t => t.status === s)}
          activeId={activeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

// ─── DETAIL PANEL ──────────────────────────────────────────────────────

function DetailPanel({ task }: { task: Task | undefined }) {
  if (!task) return (
    <div style={{ width: '395px', flexShrink: 0, borderLeft: `1px solid ${C.border}`, background: C.bg }} />
  )

  const subtasks: { label: string; s: SubStatus }[] = [
    { label: 'Mobile breakpoint behaviour', s: 'done'     },
    { label: 'Tablet breakpoint behaviour', s: 'progress' },
    { label: 'Write unit tests',            s: 'todo'     },
  ]

  const activity = [
    { av: 'JL', name: 'James Liu',  time: '2h ago',    text: 'Just pushed the initial grid implementation. Looking for feedback on the column gap mechanics.' },
    { av: 'MP', name: 'Maya Patel', time: 'Yesterday', text: 'The mobile breakpoints need revisiting — checked against FIBO ratios and the 375px canvas values are off.' },
    { av: 'AC', name: 'Alex Chen',  time: '2d ago',    text: 'Moving this to high priority after the sprint review. We need the grid done before the card components.' },
  ]

  const meta: { label: string; content: React.ReactNode }[] = [
    { label: 'Status',
      content: <StatusBadge status={task.status} /> },
    { label: 'Assignee',
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Av initials={task.assignee ?? '--'} size={24} />
          <span style={{ fontSize: '13px', lineHeight: '24px', color: C.text }}>{task.assigneeName}</span>
        </div>
      )},
    { label: 'Priority',
      content: task.priority ? <PriorityPill p={task.priority} /> : null },
    { label: 'Due date',
      content: (
        <span style={{ fontSize: '13px', lineHeight: '24px', color: task.overdue ? C.overdue : C.text, fontWeight: task.overdue ? 600 : 400 }}>
          {task.overdue && '⚠ '}{task.due}
        </span>
      )},
    { label: 'Labels',
      content: (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' as const }}>
          <LabelTag label="Frontend" />
          <LabelTag label="Design System" />
        </div>
      )},
  ]

  const sectionLabel = (text: string, mb: number = 8) => (
    <div style={{ fontSize: '11px', lineHeight: '16px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: C.textMuted, marginBottom: mb }}>
      {text}
    </div>
  )

  return (
    <div style={{
      width: '395px', flexShrink: 0,     /* F1+F2+F3 of 1235px = 395px ✓ */
      height: '100vh',
      background: C.bg,
      borderLeft: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Panel header — 48px */}
      <div style={{
        height: '48px', flexShrink: 0,
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontSize: '11px', lineHeight: '16px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: C.textMuted }}>
          Task Detail
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '4px' }}>
            <span style={{ fontSize: '16px', lineHeight: '24px', color: C.textMuted }}>⋯</span>
          </div>
          <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '4px' }}>
            <span style={{ fontSize: '18px', lineHeight: '24px', color: C.textMuted }}>×</span>
          </div>
        </div>
      </div>

      {/* Scrollable body — padding: 24px (395 × 6% = 23.7 → 24px ✓) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Task title — 18px / 32px lh (alt lh — display heading in panel) */}
        <h2 style={{ fontSize: '18px', lineHeight: '32px', fontWeight: 600, color: C.text, margin: 0 }}>
          {task.title}
        </h2>

        {/* Metadata grid */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: '6px', overflow: 'hidden' }}>
          {meta.map(({ label, content }, i) => (
            <div key={label} style={{
              padding: '8px 16px',
              minHeight: '40px',             /* 13px/24lh + 8px×2 = 40px ✓ */
              display: 'flex', alignItems: 'center',
              borderBottom: i < meta.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <span style={{ width: '72px', flexShrink: 0, fontSize: '11px', lineHeight: '24px', fontWeight: 500, color: C.textMuted }}>
                {label}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>{content}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div>
          {sectionLabel('Description')}
          <p style={{ fontSize: '13px', lineHeight: '24px', color: C.textMid, margin: 0 }}>
            Create a responsive grid component that follows our FIBO-based layout system. Should support 2, 3, and 5 column layouts with proper gutter mechanics.
          </p>
        </div>

        {/* Subtasks */}
        <div>
          {sectionLabel('Subtasks (3)')}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: '6px', overflow: 'hidden' }}>
            {subtasks.map((st, i) => (
              <div key={st.label} style={{
                height: '32px', padding: '4px 12px',  /* 13px/24lh + 4px×2 = 32px ✓ */
                display: 'flex', alignItems: 'center', gap: '8px',
                borderBottom: i < subtasks.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{
                  width: '16px', height: '16px', borderRadius: '3px', flexShrink: 0,
                  background: st.s === 'done' ? C.doneColor : st.s === 'progress' ? C.brand : 'transparent',
                  border: st.s === 'todo' ? `1px solid ${C.border}` : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {st.s === 'done'     && <span style={{ fontSize: '8px', lineHeight: '16px', color: '#fff', fontWeight: 900 }}>✓</span>}
                  {st.s === 'progress' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', display: 'block' }} />}
                </div>
                <span style={{ flex: 1, fontSize: '13px', lineHeight: '24px', color: st.s === 'done' ? C.textMuted : C.text, textDecoration: st.s === 'done' ? 'line-through' : 'none' }}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div>
          {sectionLabel('Activity', 16)}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px' }}>
                <Av initials={a.av} size={24} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', lineHeight: '24px', fontWeight: 500, color: C.text }}>{a.name}</span>
                    <span style={{ fontSize: '11px', lineHeight: '16px', color: C.textMuted, flexShrink: 0, marginLeft: '8px' }}>{a.time}</span>
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: '24px', color: C.textMid, margin: 0 }}>{a.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── ROOT ──────────────────────────────────────────────────────────────
export default function TrackerPage() {
  const [view, setView]     = useState<'List' | 'Board' | 'Table'>('List')
  const handleSetView = (v: string) => setView(v as 'List' | 'Board' | 'Table')
  const [activeId, setActiveId] = useState<number>(ACTIVE_ID)
  const activeTask = TASKS.find(t => t.id === activeId)

  return (
    <div style={{
      display: 'flex',
      width: '100vw', height: '100vh',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: C.bg,
    }}>
      {/* Sidebar — 235px (F3 of 1470) */}
      <Sidebar />

      {/* Main — 1235px (flex:1) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Task section — 840px (F4+F5 of 1235, flex:1 after 395px detail) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Toolbar view={view} setView={handleSetView} />
          <TaskList activeId={activeId} onSelect={setActiveId} />
        </div>

        {/* Detail panel — 395px (F1+F2+F3 of 1235) */}
        <DetailPanel task={activeTask} />
      </div>
    </div>
  )
}
