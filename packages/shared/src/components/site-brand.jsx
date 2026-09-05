import { useState, useEffect, useCallback, useRef } from 'react'
import { SITES } from '../sites.js'

const EXIT_DURATION = 400 // ms, matches site-transition.jsx

export default function SiteBrand({ currentSite, compact = false }) {
  const [hovered, setHovered] = useState(false)
  const [locked, setLocked] = useState(false)
  const [exiting, setExiting] = useState(false)
  const rootRef = useRef(null)

  const otherSites = SITES.filter((s) => s.label !== currentSite)
  const isOpen = hovered || locked

  const navigate = (site) => {
    setLocked(false)
    setHovered(false)
    setExiting(true)
    setTimeout(() => {
      const url = new URL(site.url)
      url.searchParams.set('transition', currentSite.toLowerCase())
      window.location.href = url.toString()
    }, EXIT_DURATION)
  }

  // Close locked state on outside click
  useEffect(() => {
    if (!locked) return
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setLocked(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [locked])

  // Close on escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') setLocked(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

  return (
    <>
      <div
        ref={rootRef}
        className="relative flex items-center gap-0 h-[2rem]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Current site label */}
        <div
          className="navbar-name flex cursor-pointer select-none items-center justify-center bg-black text-white"
          style={{ height: 32, padding: '0 0.5rem' }}
          onClick={() => setLocked((l) => !l)}
        >
          {currentSite}
        </div>

        {/* DUC DAM label */}
        <div
          className={`navbar-name flex h-full items-center justify-center rounded-none border-2 border-black ${compact ? 'px-2 py-1' : 'p-2'}`}
        >
          DUC DAM
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
              className="navbar-name flex w-fit cursor-pointer items-center justify-start whitespace-nowrap bg-black text-white hover:bg-zinc-700"
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
