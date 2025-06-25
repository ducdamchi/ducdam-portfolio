import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { PiDotsThreeOutlineVertical } from 'react-icons/pi'
import { BiMenu } from 'react-icons/bi'
import { BiArrowBack } from 'react-icons/bi'
import { MdClose } from 'react-icons/md'
// import NavModal from './NavModal'

export default function NavSection() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [isHamburger, setIsHamburger] = useState(true)
  const [menuOpened, setMenuOpened] = useState(false)
  const navModalRef = useRef(null)

  /* Dynamically obtain window size */
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  /* Set hamburger menu if screenwidth smaller than 640px */
  useEffect(() => {
    screenWidth < 768 ? setIsHamburger(true) : setIsHamburger(false)
    // console.log(`Hamburger menu: ${isHamburger}`)
  }, [screenWidth])

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

  return (
    <>
      {!isHamburger && (
        <div className="navbar-all static top-0 flex h-[20%] w-full items-center justify-start p-5">
          {/* Logo section */}
          <div className="navbar-name m-1 flex h-full items-center justify-center border-4 border-black p-3 text-xl font-medium">
            {/* <Link to="/">DUC DAM</Link> */}
            DUC <br />
            DAM
          </div>

          {/* Navigation bar */}
          <nav className="m-2 flex max-w-[80%] items-center justify-center gap-2 p-2 font-medium">
            <div className="navbar-item m-1 inline-block p-1">
              <Link to="/photography">Photography</Link>
            </div>

            <div className="navbar-item m-1 inline-block p-1">
              <Link to="/film">Film</Link>
            </div>

            <div className="navbar-item m-1 inline-block p-1">
              <Link to="/woodworking">Woodworking</Link>
            </div>

            <div className="navbar-item m-1 inline-block p-1">
              <Link to="/about">About</Link>
            </div>
          </nav>
        </div>
      )}

      {isHamburger && (
        <>
          <div className="relative top-0 z-80 flex h-[20%] max-h-[5rem] w-full items-center justify-start bg-zinc-50">
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
              {/* <Link to="/">DUC DAM</Link> */}
              DUC DAM
            </div>
          </div>

          <div className="navModal" ref={navModalRef}>
            <nav className="relative flex w-full flex-col">
              <div className="navbar-item inline-block w-full border-zinc-200 p-2 pl-5">
                <Link to="/photography">Photography</Link>
              </div>

              <div className="navbar-item inline-block w-full border-t-1 border-zinc-200 p-2 pl-5">
                <Link to="/film">Film</Link>
              </div>

              <div className="navbar-item inline-block w-full border-t-1 border-zinc-200 p-2 pl-5">
                <Link to="/woodworking">Woodworking</Link>
              </div>

              <div className="navbar-item inline-block w-full border-t-1 border-zinc-200 p-2 pl-5">
                <Link to="/about">About</Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  )
}
