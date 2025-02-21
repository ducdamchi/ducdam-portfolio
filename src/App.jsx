import { useState, useRef, useEffect } from 'react'
import './App.css'

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
    const ImagesPerPage = 3;
    let widthPercent = (100 / ImagesPerPage).toString() + "%";



    /* STATES & VARS  */
    const [carouselIndex, setCarouselIndex] = useState(1);  /* slide index we're on */
    const [clonesLeft, setClonesLeft] = useState([]);    /* page shows up when slide left on first page. */
    const [clonesRight, setClonesRight] = useState([]);   /* page shows up when slide right on last page. */
    const [isEdgeTransition, setEdgeTransition] = useState(false);
    const [rightDisabled, setRightDisabled] = useState(false);
    const [leftDisabled, setLeftDisabled] = useState(false);

    /* Use 'style' attribute for thumbnails div for
    ease of dynamically modifying 'carouselIndex'
    Check App.css root for --slider-padding */
    const carousel_style = {
      '--slider-index': carouselIndex,
      display: 'flex',
      width: 'calc(100% - 2 * var(--slider-padding))',
      transform: 'translateX(calc(var(--slider-index) * -100%))',
      // alignItems: 'stretch',

      /* If EdgeTransition flag is set, transform from clone slide to real 
      slide without any effects. If flag not set, use transform transition.*/
      transition: isEdgeTransition? 'none' : 'transform 800ms ease-in-out',
    }

    const thumbnail_div_style = {
      flex: 'none',
      display: 'flex',
      maxWidth: widthPercent,
      alignContent: 'center',
      justifyContent: 'center',

      // width: '100vh'
    }

        /* Add ref tag to div that contains all thumbnails.
    Make clones of first and last page of carousel */
    const thumbnails = useRef(null);
    useEffect(() => {

      /* Make sure thumbnails useRef object not null */
      if (thumbnails.current) {

        /* Select all thumbnail imgs, extract first three and last three */
        const allThumbnails = thumbnails.current.querySelectorAll('.thumbnail-img');
        const firstPage = [...allThumbnails].slice(0, ImagesPerPage);
        const lastPage = [...allThumbnails].slice(-ImagesPerPage);

        /* Make clones of those two 'slides', will call clonesLeft/Right in HTML */
        setClonesLeft(lastPage.map((thumbnail) => thumbnail.src));
        setClonesRight(firstPage.map((thumbnail) => thumbnail.src));

        // console.log("Using Effect")
      }
    }, []);

    /* Disable a button for time_ms miliseconds */
    function disableClickTemp (time_ms) {
      // Disable clicking until carousel fully loads
      setRightDisabled(true);
      setLeftDisabled(true);
      console.log("Click disabled");

      // Enable clicking again
      setTimeout(() => {
        setRightDisabled(false);
        setLeftDisabled(false);
        console.log("Click enabled");
      }, time_ms)
    };

    function nextSlide () {
      if (!rightDisabled) {
        disableClickTemp(1000);
        setCarouselIndex((prevIndex) => {
          const newIndex = prevIndex + 1;

          // If index reach beyond last slide, loop back to first
          if (newIndex > maxIndex) {
            
            /* Transition to fake slide takes 800ms, so wait 900ms total 
            to transition 'none' from fake slide to real slide. */
            setTimeout(() => {
              setEdgeTransition(true)
            }, 900)
            return 0
          } 

          // Otherwise update index
          else {
            return newIndex
          }
        });
      }
    }

    function prevSlide () {
      if (!leftDisabled) {
        disableClickTemp(1000);
        setCarouselIndex((prevIndex) => {
          const newIndex = prevIndex - 1;

          // If index reach below first slide, loop back to last
          if (newIndex < 0) {
            
            /* Transition to fake slide takes 800ms, so wait 900ms total 
            to transition 'none' from fake slide to real slide. */
            setTimeout(() => {
              setEdgeTransition(true)
            }, 900)
            return maxIndex
          } 

          // Otherwise update index
          else {
            return newIndex
          }
        });
      }
    }

    /* Update function for whenever carousel index changes */
    useEffect(() => {

      setTimeout(() => {
        setEdgeTransition(false);
      }, 800)

    }, [carouselIndex])





    return (
      <>

        {/* Section title */}
        <h2 className="flex items-center p-1 m-1 text-lg">Highlights</h2>

        {/* Div for the entire infinite loop carousel */}
        <div className="carousel-whole">

          {/* Left side button */}
          <button 
            id="arrowLeft" 
            className='carousel-btn'
            onClick={prevSlide}
            disabled={leftDisabled}>
            <div className='arrowLeft'>&#8249;</div>
          </button>

          {/* ALL THUMBNAILS
          TODO: How to automatically detect folders and render thumbnails?
          Hard coding images for now */}
          <div ref={thumbnails} style={carousel_style}>

            {clonesLeft.map((src, index) => (
              <div key={`cloneLeft-${index}`} className="thumbnail-div" style={thumbnail_div_style}>
                <img className="thumbnail-img" src={src}/>
              </div>
            ))}

            <div className="thumbnail-div" style={thumbnail_div_style}>
              <img className="thumbnail-img" src="./photography/ex1/img5.jpg"/>
            </div>
            <div className="thumbnail-div" style={thumbnail_div_style}>
              <img className="thumbnail-img" src="./photography/ex2/img9.jpg"/>
            </div>
            <div className="thumbnail-div" style={thumbnail_div_style}>
              <img className="thumbnail-img" src="./photography/ex3/img1.JPG"/>
            </div>
            <div className="thumbnail-div" style={thumbnail_div_style}>
              <img className="thumbnail-img" src="./photography/ex4/img1.jpg"/>
            </div>
            <div className="thumbnail-div" style={thumbnail_div_style}>
              <img className="thumbnail-img" src="./photography/ex5/img1.png"/>
            </div>
            <div className="thumbnail-div" style={thumbnail_div_style}>
              <img className="thumbnail-img" src="./photography/ex6/img1.jpg"/>
            </div>
            <div className="thumbnail-div" style={thumbnail_div_style}>
              <img className="thumbnail-img" src="./photography/ex7/img1.jpg"/>
            </div>
            <div className="thumbnail-div" style={thumbnail_div_style}>
              <img className="thumbnail-img" src="./photography/ex8/img1.JPG"/>
            </div>
            <div className="thumbnail-div" style={thumbnail_div_style}>
              <img className="thumbnail-img" src="./photography/ex9/img1.jpg"/>
            </div>

            {clonesRight.map((src, index) => (
              <div key={`cloneRight-${index}`} className="thumbnail-div" style={thumbnail_div_style}>
                <img className="thumbnail-img" src={src}/>
              </div>
            ))}

          </div>

          {/* Right side button */}
          <button 
            id="arrowRight" 
            className="carousel-btn"
            onClick={nextSlide}
            disabled={rightDisabled}>
            <div className='arrowRight'>&#8250;</div>
          </button>
        </div>
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