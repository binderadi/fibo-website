import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'

/*
 * NAV — FIBO sizing
 *
 * Height — Inside-Out (Signal 5: consistent property)
 *   Text: 13px / 24px lh. Padding: 12px top + 12px bottom.
 *   Height: 24 + 12 + 12 = 48px ✓
 *
 * Width — Outside-In (adaptive, spans full canvas)
 *   Content aligns to 88px margins (6% of 1470px)
 *
 * Dropdown width — Outside-In from nav parent
 *   F3 of content area (1294px): 1294 × 16% = 207.04 → 207px
 *   Verified: longest item "Typography" at 13px ≈ 90px + 2×24px padding ≈ 138px < 207px ✓
 *
 * Dropdown link height — Inside-Out (Signal 5: consistent)
 *   Text: 13px / 24px lh. Padding: 8px top + 8px bottom.
 *   Height: 24 + 8 + 8 = 40px ✓
 */

const systemLinks = [
  { to: '/',           label: 'Home'       },
  { to: '/system',     label: 'System'     },
  { to: '/typography', label: 'Typography' },
  { to: '/spacing',    label: 'Spacing'    },
  { to: '/layout',     label: 'Layout'     },
  { to: '/signals',    label: 'Signals'    },
  { to: '/backlog',    label: 'Backlog'    },
  { to: '/skill',      label: 'FIBO Skill' },
]

const testLinks = [
  { to: '/test/news',         label: 'News Site'        },
  { to: '/test/jazz',         label: 'Jazz Club'         },
  { to: '/test/tracker',      label: 'Project Tracker'   },
  { to: '/test/observatory',  label: 'Observatory'       },
  { to: '/test/roam',         label: 'Roam'              },
  { to: '/test/hollow-wire',  label: 'The Hollow Wire'   },
]

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Close dropdown on route change
  useEffect(() => { setIsOpen(false) }, [location.pathname])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>

        {/* Logo + Dropdown trigger */}
        <div ref={dropdownRef} style={styles.logoWrap}>
          <button
            onClick={() => setIsOpen(v => !v)}
            style={styles.logoBtn}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            FIBO
            <span style={{ ...styles.caret, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▾
            </span>
          </button>

          {isOpen && (
            <div style={styles.dropdown}>
              {/* Section: System */}
              <div style={styles.dropSection}>
                <div style={styles.dropHeader}>System</div>
                {systemLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    style={styles.dropLink}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div style={styles.dropDivider} />

              {/* Section: Test Designs */}
              <div style={styles.dropSection}>
                <div style={styles.dropHeader}>Test Designs</div>
                {testLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    style={styles.dropLink}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Nav links */}
        <ul className="nav-links">
          {systemLinks.slice(1).map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                style={({ isActive }) => ({
                  ...styles.link,
                  color: isActive ? 'var(--c-accent)' : 'var(--c-text)',
                  fontWeight: isActive ? 600 : 400,
                })}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 'var(--nav-h)',
    background: 'var(--c-bg)',
    borderBottom: '1px solid var(--c-border)',
  },
  inner: {
    maxWidth: 'var(--content-w)',
    margin: '0 auto',
    padding: '0 var(--margin)',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /* Logo area */
  logoWrap: {
    position: 'relative',
  },
  logoBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp8)',              /* 8px between "FIBO" and caret */
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 'var(--t13)',         /* 13px */
    lineHeight: 'var(--lh13)',      /* 24px */
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: 'var(--c-text)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  caret: {
    fontSize: 'var(--t10)',         /* 10px */
    lineHeight: 'var(--lh10)',      /* 16px */
    color: 'var(--c-muted)',
    display: 'inline-block',
    transition: 'transform 0.15s',
  },

  /* Dropdown
   * Width: F3 of content area = 207px
   * Link height: 13px / 24px lh + 8px v-pad × 2 = 40px ✓
   */
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + var(--sp8))',  /* 8px below logo — tight: belongs to logo */
    left: 0,
    width: '207px',                 /* F3 of 1294px content area */
    background: 'var(--c-bg)',
    border: '1px solid var(--c-border)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    zIndex: 200,
  },
  dropSection: {
    padding: 'var(--sp8) 0',        /* 8px top/bottom per section */
  },
  dropHeader: {
    /* Section label: 10px / 16px lh. Padding: 8px top, 4px bottom. */
    fontSize: 'var(--t10)',         /* 10px */
    lineHeight: 'var(--lh10)',      /* 16px */
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--c-muted)',
    padding: 'var(--sp8) var(--sp16) var(--sp8)',  /* 8px 16px */
  },
  dropLink: {
    display: 'block',
    height: '40px',                 /* Inside-Out: 24px lh + 8px + 8px = 40px ✓ */
    padding: 'var(--sp8) var(--sp16)',  /* 8px 16px */
    fontSize: 'var(--t13)',         /* 13px */
    lineHeight: 'var(--lh13)',      /* 24px */
    fontWeight: 400,
    color: 'var(--c-text)',
    textDecoration: 'none',
    transition: 'background 0.1s',
  },
  dropDivider: {
    height: '1px',
    background: 'var(--c-border)',
    margin: '0',
  },

  /* Nav links */
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp32)',
    listStyle: 'none',
  },
  link: {
    fontSize: 'var(--t13)',
    lineHeight: 'var(--lh13)',
    textDecoration: 'none',
    letterSpacing: '0.01em',
    transition: 'color 0.15s',
  },
}
