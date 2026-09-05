import { useState, useEffect, useCallback } from 'react'
import { SITES } from '../sites.js'

const EXIT_DURATION = 400 // ms, matches site-transition.jsx

export default function SubdomainPicker({ currentSite }) {
  const [isOpen, setIsOpen] = useState(false)
  const [exiting, setExiting] = useState(false)

  const otherSites = SITES.filter((s) => s.label !== currentSite)

  const close = useCallback(() => setIsOpen(false), [])

  const navigate = (site) => {
    setExiting(true)
    // Wait for the wipe to fully cover the screen, then redirect
    setTimeout(() => {
      const url = new URL(site.url)
      url.searchParams.set('transition', currentSite.toLowerCase())
      window.location.href = url.toString()
    }, EXIT_DURATION)
  }

  // Close on escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, close])

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={close}
      >
        {/* Current site label (always visible) */}
        <div
          className="navbar-name flex cursor-pointer select-none items-center justify-center bg-black text-white"
          style={{ height: 32, padding: '0 0.5rem'}}
          onClick={() => setIsOpen((o) => !o)}
        >
          {currentSite}
        </div>

        {/* Slide-in list */}
        <div
          className="absolute left-0 top-full z-50"
          style={{
            minWidth: '100%',
            width: 'max-content',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            paddingTop: 3,
          }}
        >
          {otherSites.map((site, i) => (
            <div
              key={site.label}
              className="navbar-name flex cursor-pointer items-center justify-start whitespace-nowrap bg-black text-white hover:bg-zinc-700"
              style={{
                height: 32,
                padding: '0 0.5rem',
                transform: isOpen ? 'translateX(0)' : 'translateX(-120%)',
                opacity: isOpen ? 1 : 0,
                transition: isOpen
                  ? `transform 380ms cubic-bezier(0.25, 2, 0.55, 1) ${i * 70}ms, opacity 380ms ease ${i * 70}ms`
                  : `transform 200ms cubic-bezier(0.55, 0, 1, 0.45) ${(otherSites.length - 1 - i) * 40}ms, opacity 200ms ease ${(otherSites.length - 1 - i) * 40}ms`,
              }}
              onClick={() => navigate(site)}
            >
              {site.label}
            </div>
          ))}
        </div>
      </div>

      {/* Exit wipe: slides up from bottom */}
      {exiting && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'white',
            animation: `wipeUp ${EXIT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          }}
        />
      )}
    </>
  )
}
