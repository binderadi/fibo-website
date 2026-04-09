import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * useHashNav — section URL support
 *
 * 1. On mount: if URL has a hash (e.g. /#/system#two-layers), scroll to that section
 * 2. On scroll: updates URL hash to reflect which section is in the top of the viewport
 *
 * Usage: call useHashNav() at the top of any page component.
 * Requires <section id="section-name"> elements in the page.
 */
export function useHashNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const fromScroll = useRef(false)
  const mounted = useRef(false)
  const currentHash = useRef(location.hash)

  // Track current hash without causing re-renders
  useEffect(() => {
    currentHash.current = location.hash
  }, [location.hash])

  // Scroll to section when URL hash is set from external navigation (link click / direct URL)
  useEffect(() => {
    if (!location.hash || fromScroll.current) return
    const id = location.hash.slice(1)
    const el = document.getElementById(id)
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [location.hash])

  // Update URL hash as user scrolls — waits 400ms after mount to avoid firing on initial render
  useEffect(() => {
    const timer = setTimeout(() => { mounted.current = true }, 400)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section[id]')) as HTMLElement[]
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!mounted.current) return
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (!visible.length) return
        const id = visible[0].target.id
        if (`#${id}` === currentHash.current) return
        fromScroll.current = true
        navigate({ hash: `#${id}` }, { replace: true })
        setTimeout(() => { fromScroll.current = false }, 100)
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    )

    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [navigate])
}
