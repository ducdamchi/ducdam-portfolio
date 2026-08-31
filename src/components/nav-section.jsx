import { Link, useMatchRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { BiMenu } from 'react-icons/bi'
import { MdClose } from 'react-icons/md'
import { useWindowSize } from '../hooks/useWindowSize'
import '../app.css'

export default function NavSection() {
  const { width: screenWidth } = useWindowSize()
  const isHamburger = screenWidth < 768
  const [menuOpened, setMenuOpened] = useState(false)
  const navModalRef = useRef(null)

  function openHamburger() {
    setMenuOpened(true)
    if (navModalRef.current) {
      navModalRef.current.classList.add('open')
    }
  }

  function closeHamburger() {
    setMenuOpened(false)
    if (navModalRef.current) {
      navModalRef.current.classList.remove('open')
    }
  }

  function CustomLink({ to, children, ...props }) {
    const matchRoute = useMatchRoute()
    const isActive = !!matchRoute({ to })
    return (
      <div className={isActive ? 'active' : ''}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </div>
    )
  }

  return (
    <>
      {!isHamburger && (
        <div className="navbar-all absolute top-0 z-100 flex h-auto w-full items-center justify-start p-5">
          {/* Logo section */}
          <div className="navbar-name m-1 flex aspect-square h-[4rem] items-center justify-center rounded-none border-2 border-black bg-zinc-50 p-2 text-xl font-medium">
            DUC <br />
            DAM
          </div>

          {/* Navigation bar */}
          <nav className="m-2 flex h-[4rem] max-w-[80%] items-center justify-center gap-2 rounded-none border-0 bg-zinc-50 p-2 font-medium">
            <div className="navbar-item m-1 inline-block p-1 duration-200 ease-out hover:scale-[1.05]">
              <CustomLink to="/film">Film</CustomLink>
            </div>

            <div className="navbar-item m-1 inline-block p-1 duration-200 ease-out hover:scale-[1.05]">
              <CustomLink to="/photography">Photography</CustomLink>
            </div>

            <div className="navbar-item m-1 inline-block p-1 duration-200 ease-out hover:scale-[1.05]">
              <CustomLink to="/woodworking">Woodworking</CustomLink>
            </div>

            <div className="navbar-item m-1 inline-block p-1 duration-200 ease-out hover:scale-[1.05]">
              <CustomLink to="/about">About</CustomLink>
            </div>

            <div className="navbar-item m-1 inline-block p-1 duration-200 ease-out hover:scale-[1.05]">
              <CustomLink to="/contact">Contact</CustomLink>
            </div>
          </nav>
        </div>
      )}

      {isHamburger && (
        <>
          <div className="absolute top-0 z-80 z-100 flex h-auto max-h-[5rem] w-full items-center justify-start bg-zinc-50">
            <button className="p-1 pl-4">
              {menuOpened ? (
                <MdClose
                  className="text-2xl"
                  onClick={() => closeHamburger()}
                />
              ) : (
                <BiMenu className="text-2xl" onClick={() => openHamburger()} />
              )}
            </button>

            {/* Logo section */}
            <div className="logo-hamburger z-80 flex h-full items-center justify-center p-3 text-center text-base font-medium">
              DUC DAM
            </div>
          </div>

          <div className="navModal" ref={navModalRef}>
            <nav className="relative flex w-full flex-col">
              <div className="navbar-item inline-block w-full border-t-1 border-zinc-200 p-2 pl-5">
                <CustomLink to="/film">Film</CustomLink>
              </div>

              <div className="navbar-item inline-block w-full border-t-1 border-zinc-200 p-2 pl-5">
                <CustomLink to="/photography">Photography</CustomLink>
              </div>

              <div className="navbar-item inline-block w-full border-t-1 border-zinc-200 p-2 pl-5">
                <CustomLink to="/woodworking">Woodworking</CustomLink>
              </div>

              <div className="navbar-item inline-block w-full border-t-1 border-zinc-200 p-2 pl-5">
                <CustomLink to="/about">About</CustomLink>
              </div>

              <div className="navbar-item inline-block w-full border-t-1 border-zinc-200 p-2 pl-5">
                <CustomLink to="/contact">Contact</CustomLink>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  )
}
