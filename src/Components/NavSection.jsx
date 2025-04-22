import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function NavSection() {
  return (
    <div className='static top-0 flex flex-col items-center justify-center w-full h-[20%] border-2 border-yellow-500'>

        {/* Logo section */}
        <div className="logo flex justify-center items-center p-1 m-1 text-xl border-2 border-blue-400">
          <Link to="/">DUC DAM</Link>
        </div>

        {/* Navigation bar */}
        <nav className="flex justify-center items-center p-2 m-2 font-medium gap-2 border-2 border-blue-400">
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