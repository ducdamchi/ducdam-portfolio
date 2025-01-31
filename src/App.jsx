import { useState } from 'react'
import './App.css'

export default function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <div className="navSection">
        <span className="homeButton-ghost"></span>
        <a href="index.html" target="_blank" rel="noopener noreferrer">Logo</a>
        {/* <span class="home-button-real">Home</span> */}
      </div>

      <nav className="navBar">
        <ul class="navBar-list">
          <li>Photography</li>
          <li>Film</li>
          <li>Woodworking</li>
          <li>About</li>
        </ul>
      </nav>

      <h1 className="pageTitle">Photography</h1>

      <div className="highlights">
        <h2 className="sectionTitle">Highlights</h2>

        {/* Making infinite loop carousel */}
        <div className="carousel">
          <button id="arrowLeft" className="arrow">
            &#8249;
          </button>

          {/* TODO: How to automatically detect folders and render thumbnails? */}

          <button id="arrowRight" className="arrow">
            &#8250;
          </button>
        </div>
      </div>


      <div className="allProjects">
        <h2 className="sectionTitle">All Projects</h2>
      </div>


    </>
  )
}