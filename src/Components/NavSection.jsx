import { Link, useMatch, useResolvedPath } from 'react-router-dom'

export default function NavSection() {
  return (
    <div className="static top-0 flex h-[20%] w-full items-center justify-start border-2 border-yellow-500 p-5">
      {/* Logo section */}
      <div className="logo m-1 flex h-full items-center justify-center border-2 border-blue-400 p-1 text-xl font-bold">
        {/* <Link to="/">DUC DAM</Link> */}
        DUC <br />
        DAM
      </div>

      {/* Navigation bar */}
      <nav className="m-2 flex max-w-[80%] items-center justify-center gap-2 border-2 border-blue-400 p-2 font-medium">
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
  )
}
