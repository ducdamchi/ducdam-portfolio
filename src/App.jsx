import { useState, useRef, useEffect } from 'react'
import './App.css'
import HighlightsCarousel from './HighlightsCarousel';

export default function App() {
  // const numSlidesIndex
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

    /* TO BE CHANGED FOR RESPONSIVE DESIGN */

    /* Ex: If user's POV has 3 slides with idx 0-2, 
    then logically there are 5 slides with idx 0-4, to accomodate for 2 clone slides. */
    const numSlidesIndex = 4;

    /* Number of images to display per slide */
    const imagesPerSlide = 3;

    /* How much of the screen's width would an image take up, stored as a str */
    const imageWidthPercent = `${100 / imagesPerSlide}%`;

    return (
      <>
        <h2 className="flex items-center p-1 m-1 text-lg">Highlights</h2>
        <HighlightsCarousel numSlidesIndex={numSlidesIndex} imagesPerSlide={imagesPerSlide} imageWidthPercent={imageWidthPercent}/>
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
      {/* <AllProjectsSection/> */}
    </>
  )
}