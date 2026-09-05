import { useState, useEffect } from 'react'

const DURATION = 400 // ms

export default function SiteTransition() {
  const [phase, setPhase] = useState('idle') // 'covering' | 'revealing' | 'idle'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has('transition')) return

    // Start fully covered, then reveal (slide down)
    setPhase('covering')
    // Small delay to ensure the overlay renders before animating
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase('revealing')
      })
    })

    const timer = setTimeout(() => {
      setPhase('idle')
      // Clean up the query param
      window.history.replaceState({}, '', window.location.pathname)
    }, DURATION + 50)

    return () => clearTimeout(timer)
  }, [])

  if (phase === 'idle') return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'white',
        transform: phase === 'covering' ? 'translateY(0)' : 'translateY(100%)',
        transition:
          phase === 'revealing'
            ? `transform ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
            : 'none',
        pointerEvents: 'none',
      }}
    />
  )
}
