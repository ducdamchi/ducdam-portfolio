import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function NavSection() {
  return (
    <div className='relative top-10'>

        {/* Logo section */}
        <div className="relative flex justify-center items-center p-1 m-1 text-xl">
          <Link to="/">Logo</Link>
        </div>

        {/* Navigation bar */}
        <nav className="relative flex justify-center items-center p-2 m-2 font-medium gap-2">
            <div className="navbar-item inline-block p-1 m-1">
              <Link to="/photography">
                Photography
              </Link>
            </div>

            <div className="navbar-item inline-block p-1 m-1">
              <Link to="/film">
                Film
              </Link>
            </div>            
            
            <div className="navbar-item inline-block p-1 m-1">
              <Link to="/woodworking">
                Woodworking
              </Link>
            </div>            
            
            <div className="navbar-item inline-block p-1 m-1">
              <Link to="/about">
                About
              </Link>
            </div>
        </nav>
    </div>
  )
}