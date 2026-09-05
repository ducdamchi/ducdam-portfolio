import { Link, useMatchRoute, useRouter } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { BiMenu } from 'react-icons/bi'
import { MdClose } from 'react-icons/md'
import SiteBrand from './site-brand.jsx'
import '../styles/shared.css'

function CustomLink({ to, onClick, children, ...props }) {
  const matchRoute = useMatchRoute()
  const isActive = !!matchRoute({ to })
  return (
    <div className={isActive ? 'active' : ''}>
      <Link to={to} onClick={onClick} {...props}>
        {children}
      </Link>
    </div>
  )
}

export default function Navbar({ currentSite = 'ART', navLinks = [] }) {
  const [menuOpened, setMenuOpened] = useState(false)
  const router = useRouter()

  const closeMenu = useCallback(() => setMenuOpened(false), [])

  // Close menu on route change
  useEffect(() => {
    return router.subscribe('onBeforeNavigate', closeMenu)
  }, [router, closeMenu])

  // Close menu on escape key
  useEffect(() => {
    if (!menuOpened) return
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [menuOpened, closeMenu])

  return (
    <>
      {/* Desktop navbar */}
      <div className="navbar-all absolute top-0 z-100 hidden h-auto w-full items-center justify-between p-5 md:flex">
        <div className="text-xl font-thin">
          <SiteBrand currentSite={currentSite} />
        </div>

        <nav className="m-2 flex h-[4rem] max-w-[80%] items-center justify-center gap-2 rounded-none border-0 bg-zinc-50 p-2 font-thin">
          {navLinks.map(({ to, label }) => (
            <div
              key={to}
              className="navbar-item m-1 inline-block p-1 duration-200 ease-out hover:scale-[1.05]"
            >
              <CustomLink to={to}>{label}</CustomLink>
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile navbar + menu */}
      <div className="absolute top-0 z-100 w-full md:hidden">
        <div className="relative z-10 flex h-auto max-h-[5rem] w-full items-center justify-between bg-zinc-50 p-4">
          <div className="text-base font-thin">
            <SiteBrand currentSite={currentSite} compact />
          </div>

          <button
            className="relative h-8 w-8 p-1"
            onClick={() => setMenuOpened((o) => !o)}
          >
            <BiMenu
              className="absolute inset-0 m-auto text-2xl"
              style={{
                opacity: menuOpened ? 0 : 1,
                transform: menuOpened ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'opacity 300ms ease, transform 300ms ease',
              }}
            />
            <MdClose
              className="absolute inset-0 m-auto text-2xl"
              style={{
                opacity: menuOpened ? 1 : 0,
                transform: menuOpened ? 'rotate(0deg)' : 'rotate(-180deg)',
                transition: 'opacity 300ms ease, transform 300ms ease',
              }}
            />
          </button>
        </div>

        <nav
          className="-z-10 flex w-full flex-col bg-zinc-50"
          style={{
            transform: menuOpened ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {navLinks.map(({ to, label }, i) => (
            <div
              key={to}
              className="navbar-item inline-block w-full border-t-1 border-zinc-200 p-2 pr-8 text-right"
              style={{
                opacity: menuOpened ? 1 : 0,
                transition: menuOpened
                  ? `opacity 300ms ease-out ${i * 60 + 180}ms`
                  : 'opacity 150ms ease-in',
              }}
            >
              <CustomLink to={to}>{label}</CustomLink>
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile menu backdrop */}
      {menuOpened && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={closeMenu} />
      )}
    </>
  )
}
