import { Link, useMatchRoute, useRouter } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { BiMenu } from 'react-icons/bi'
import { MdClose } from 'react-icons/md'
import '../app.css'

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

const NAV_LINKS = [
  { to: '/film', label: 'Film' },
  { to: '/photography', label: 'Photography' },
  { to: '/woodworking', label: 'Woodworking' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
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
      <div className="navbar-all absolute top-0 z-100 hidden h-auto w-full items-center justify-between p-5 md:flex ">
        <div className='flex items-center gap-0 h-[2rem] text-xl font-medium'>
          <div className='navbar-name border-0 bg-black text-white h-full p-2 flex items-center justify-center'>
            ART.
          </div>
        <div className="navbar-name h-full flex items-center justify-center rounded-none border-2 border-black p-2 ">
          DUC DAM
        </div>
        </div>


        <nav className="m-2 flex h-[4rem] max-w-[80%] items-center justify-center gap-2 rounded-none border-0 bg-zinc-50 p-2 font-medium">
          {NAV_LINKS.map(({ to, label }) => (
            <div
              key={to}
              className="navbar-item m-1 inline-block p-1 duration-200 ease-out hover:scale-[1.05]"
            >
              <CustomLink to={to}>{label}</CustomLink>
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile navbar */}
      <div className="absolute top-0 z-100 flex h-auto max-h-[5rem] w-full items-center justify-start bg-zinc-50 md:hidden">
        <button className="p-1 pl-4" onClick={() => setMenuOpened((o) => !o)}>
          {menuOpened ? (
            <MdClose className="text-2xl" />
          ) : (
            <BiMenu className="text-2xl" />
          )}
        </button>

        <div className="logo-hamburger z-80 flex h-full items-center justify-center p-3 text-center text-base font-medium">
          DUC DAM
        </div>
      </div>

      {/* Mobile menu backdrop */}
      {menuOpened && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile slide-down menu */}
      <div
        className={`navModal md:hidden ${menuOpened ? 'open' : ''}`}
      >
        <nav className="relative flex w-full flex-col">
          {NAV_LINKS.map(({ to, label }) => (
            <div
              key={to}
              className="navbar-item inline-block w-full border-t-1 border-zinc-200 p-2 pl-5"
            >
              <CustomLink to={to}>{label}</CustomLink>
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}
