import ReactDom from 'react-dom'
import { useState, useRef, useEffect } from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import '../App.css'

export default function NavModal() {
  return ReactDom.createPortal(
    <>
      <div className="navModal">
        <nav className="relative flex w-full flex-col">
          <div className="navbar-item inline-block w-full border-b-1 border-zinc-200 p-2 pl-8">
            <Link to="/photography">Photography</Link>
          </div>

          <div className="navbar-item inline-block w-full border-b-1 border-zinc-200 p-2 pl-8">
            <Link to="/film">Film</Link>
          </div>

          <div className="navbar-item inline-block w-full border-b-1 border-zinc-200 p-2 pl-8">
            <Link to="/woodworking">Woodworking</Link>
          </div>

          <div className="navbar-item inline-block w-full border-zinc-200 p-2 pl-8">
            <Link to="/about">About</Link>
          </div>
        </nav>
      </div>
    </>,
    document.getElementById('portal-navbar'),
  )
}
