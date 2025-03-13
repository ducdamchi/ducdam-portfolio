import { useState, useRef, useEffect } from 'react'
import './App.css'
import HighlightsCarousel from './HighlightsCarousel';

export default function App() {
  // const numSlidesIndex
  function NavSection() {
    return (
      <div className='relative top-10'>
          {/* Logo section */}
          <div className="relative flex justify-center items-center p-1 m-1 text-xl">
            {/* <span className="homeButton-ghost"></span> */}
            <a href="index.html" target="_blank" rel="noopener noreferrer" className="bg-red-200 p-1 m-1">Logo</a>
            {/* <span class="home-button-real">Home</span> */}
          </div>

          {/* Navigation bar */}
          <nav className="relative flex justify-center items-center p-2 m-2 text-xl font-medium gap-2">
              <div className="navbar-item inline-block p-1 m-1">Photography</div>
              <div className="navbar-item inline-block p-1 m-1">Film</div>
              <div className="navbar-item inline-block p-1 m-1">Woodworking</div>
              <div className="navbar-item inline-block p-1 m-1">About</div>
          </nav>

          {/* Title of page currently browsed */}
          <h1 className="relative top-10 flex justify-center items-center p-1 m-1 text-3xl font-semibold">PHOTOGRAPHY</h1>
      </div>
    )
  }

  function HighlightSection () {

    /* TO BE CHANGED FOR RESPONSIVE DESIGN */

    /* Ex: If user's POV has 3 slides with idx 0-2, 
    then logically there are 5 slides with idx 0-4, to accomodate for 2 clone slides. */
    const numSlidesIndex = 4;

    /* Number of images to display per slide */
    // Note: keep track of this in .root in App.css as well
    const imagesPerSlide = 3;

    /* How much of the screen's width would an image take up, stored as a str */
    const imageWidthPercent = `${100 / imagesPerSlide}%`;

    return (
      <div className='relative top-35'>
        {/* <h2 className="relative left-27 p-1 m-1 text-2xl">Projects</h2>s */}
        <HighlightsCarousel 
          numSlidesIndex={numSlidesIndex} 
          imagesPerSlide={imagesPerSlide} 
          imageWidthPercent={imageWidthPercent}/>
      </div>
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
      <div className='relative'>
        <NavSection/>
        <HighlightSection/>

      </div>
    </>
  )
}