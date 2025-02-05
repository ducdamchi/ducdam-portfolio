import { useState } from 'react'
import './App.css'

export default function App() {

  function NavSection() {
    return (
      <>
          {/* Logo section */}
          <div className="flex justify-center items-center p-2 m-2">
            {/* <span className="homeButton-ghost"></span> */}
            <a href="index.html" target="_blank" rel="noopener noreferrer" className="bg-red-200 p-2 m-1">Logo</a>
            {/* <span class="home-button-real">Home</span> */}
          </div>

          {/* Navigation bar */}
          <nav className="flex justify-center items-center">
            <ul>
              <li className="inline-block p-2 m-1 bg-neutral-300">Photography</li>
              <li className="inline-block p-2 m-1 bg-neutral-300">Film</li>
              <li className="inline-block p-2 m-1 bg-neutral-300">Woodworking</li>
              <li className="inline-block p-2 m-1 bg-neutral-300">About</li>
            </ul>
          </nav>

          {/* Title of page currently browsed */}
          <h1 className="flex justify-center items-center p-2 m-2 text-2xl">Photography</h1>
      </>
    )
  }

  function HighlightSection () {

    /* Highlight section will always have 9 thumbnails, split into 3 slides.
    Need a variable to keep track of which slide we're on so can navigate left/right.
    2 is the max number of slides right now.
    TODO: What about non-laptop devices? Responsive design solution?
    */
    const [carouselIndex, setCarouselIndex] = useState(0)
    console.log("Current carousel index: " + carouselIndex);

    function nextSlide () {
      setCarouselIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        /* Loop back to first slide if at last slide */
        return newIndex > 2 ? 0 : newIndex;
      });

    }

    function prevSlide () {
      setCarouselIndex((prevIndex) => {
        const newIndex = prevIndex - 1;
        /* Loop back to last slide if at first slide */
        return newIndex < 0 ? 2 : newIndex;
      });
    }

    return (
      <>

        {/* Section title */}
        <h2 className="flex items-center p-2 m-2 text-lg">Highlights</h2>

        {/* Making infinite loop carousel */}
        <div className="flex justify-center items-center overflow-hidden">

          {/* Left side button */}
          <button 
            id="arrowLeft" 
            className="text-4xl justify-center items-center bg-neutral-300 z-1"
            onClick={prevSlide}>
            &#8249;
          </button>

          {/* ALL THUMBNAILS
          TODO: How to automatically detect folders and render thumbnails?
          Hard coding images for now */}
          <div className="carousel-images">
            <div className="thumbnail">
              <img className="thumbnail-img p-1 m-1" src="./photography/ex1/img5.jpg"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img p-1 m-1" src="./photography/ex2/img9.jpg"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img p-1 m-1" src="./photography/ex3/img1.JPG"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img p-1 m-1" src="./photography/ex4/img1.jpg"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img p-1 m-1" src="./photography/ex5/img1.png"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img p-1 m-1" src="./photography/ex6/img1.jpg"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img p-1 m-1" src="./photography/ex7/img1.jpg"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img p-1 m-1" src="./photography/ex8/img1.JPG"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img p-1 m-1" src="./photography/ex9/img1.jpg"/>
            </div>
          </div>

          {/* Right side button */}
          <button 
            id="arrowRight" 
            className="text-4xl justify-center items-center bg-neutral-300 z-1"
            onClick={nextSlide}>
            &#8250;
          </button>

        </div>
      </>
    )
  }

  function AllProjectsSection() {
    return (
      <div className="allProjects">
        <h2 className="flex items-center p-2 m-2 text-lg">All Projects</h2>
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