import { useState, useRef, useEffect } from 'react'
import './App.css'
import { CarouselPhoto } from './CarouselPhoto';

export default function App() {

  function NavSection() {
    return (
      <>
          {/* Logo section */}
          <div className="flex justify-center items-center p-1 m-1">
            {/* <span className="homeButton-ghost"></span> */}
            <a href="index.html" target="_blank" rel="noopener noreferrer" className="bg-red-200 p-1 m-1">Logo</a>
            {/* <span class="home-button-real">Home</span> */}
          </div>

          {/* Navigation bar */}
          <nav className="flex justify-center items-center">
            <ul>
              <li className="inline-block p-1 m-1 bg-neutral-300">Photography</li>
              <li className="inline-block p-1 m-1 bg-neutral-300">Film</li>
              <li className="inline-block p-1 m-1 bg-neutral-300">Woodworking</li>
              <li className="inline-block p-1 m-1 bg-neutral-300">About</li>
            </ul>
          </nav>

          {/* Title of page currently browsed */}
          <h1 className="flex justify-center items-center p-1 m-1 text-2xl">Photography</h1>
      </>
    )
  }

  function HighlightSection () {

    /* Highlight section will always have 9 thumbnails, split into 3 p-1 slides.
    Need a variable to keep track of which slide we're on so can navigate left/right.
    2 is the max number of slides right now.
    TODO: What about non-laptop devices? Responsive design solution?
    */

    /* TO BE CHANGED FOR RESPONSIVE DESIGN */
    /* From user's POV there are 3 slides with idx 0-2, 
    but logically there are 5 slides with idx 0-4. */
    const maxIndex = 4;
    const imagesPerPage = 3;
    const widthPercent = `${100 / imagesPerPage}%`;

    return (
      <>
        <h2 className="flex items-center p-1 m-1 text-lg">Highlights</h2>
        <CarouselPhoto maxIndex={maxIndex} imagesPerPage={imagesPerPage} widthPercent={widthPercent}/>
      </>
    )
  }

  function AllProjectsSection() {
    return (
      <div className="allProjects">
        <h2 className="flex items-center p-1 m-1 text-lg">All Projects</h2>
      </div>
    )
  }

  return (
    <>
      <NavSection/>
      <HighlightSection/>
      <AllProjectsSection/>
    </>
  )
}