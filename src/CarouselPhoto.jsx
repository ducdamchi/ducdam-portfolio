import React from 'react'
import { useState, useRef, useEffect } from 'react'
import './App.css'

export function CarouselPhoto( {maxIndex, imagesPerPage, widthPercent} ) {

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
  const CAROUSEL_STYLE = {
    '--slider-index': carouselIndex,
    display: 'flex',
    width: 'calc(100% - 2 * var(--slider-padding))',
    transform: 'translateX(calc(var(--slider-index) * -100%))',
    // alignItems: 'stretch',

    /* If EdgeTransition flag is set, transform from clone slide to real 
    slide without any effects. If flag not set, use transform transition.*/
    transition: isEdgeTransition? 'none' : 'transform 750ms ease-in-out',
  }

  const THUMBNAIL_DIV_STYLE = {
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
      const firstPage = [...allThumbnails].slice(0, imagesPerPage);
      const lastPage = [...allThumbnails].slice(-imagesPerPage);

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
    // console.log("Click disabled");

    // Enable clicking again
    setTimeout(() => {
      setRightDisabled(false);
      setLeftDisabled(false);
      // console.log("Click enabled");
    }, time_ms)
  };

  function handleEdgeCase (newIndex) {

    // If reached beyond the last slide, wrap to the first real slide
    if (newIndex === maxIndex) {

      // wait for 750ms transition to be over, then use
      // 'none' transition from fake slide to real slide
      setTimeout(() => {
        setEdgeTransition(true);
        setCarouselIndex(1);
      }, 700);
    } 

    // If reached below the first slide, wrap to the last real slide
    else if (newIndex === 0) {

      // wait for 750ms transition to be over, then use
      // 'none' transition from fake slide to real slide
      setTimeout(() => {
        setEdgeTransition(true);
        setCarouselIndex(maxIndex-1);
      }, 700);
    } 
  };

  function nextSlide () {
    if (!rightDisabled) {

      // Disable click to prevent spam
      disableClickTemp(1000);
      setCarouselIndex((prevIndex) => {
        const newIndex = prevIndex + 1;

        // If meet edge case, pass to function to handle transition
        handleEdgeCase(newIndex);

        // return newIndex regardless
        return newIndex
      });
    }
  }

  function prevSlide () {
    if (!leftDisabled) {

      // Disable click to prevent spam
      disableClickTemp(1000);
      setCarouselIndex((prevIndex) => {
        const newIndex = prevIndex - 1;

        // If meet edge case, pass to function to handle transition
        handleEdgeCase(newIndex);

        // return newIndex regardless
        return newIndex;
      });
    }
  }


  /* Update function for whenever carousel index changes */
  useEffect(() => {

    if(isEdgeTransition) {
      setTimeout(() => {
        setEdgeTransition(false);
      }, 300)
    }
    // console.log("idx: " + carouselIndex);

  }, [isEdgeTransition, carouselIndex])

  return (
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
          <div ref={thumbnails} style={CAROUSEL_STYLE}>

            {clonesLeft.map((src, index) => (
              <div key={`cloneLeft-${index}`} className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
                <img className="thumbnail-img" src={src}/>
              </div>
            ))}

            <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
              <img className="thumbnail-img" src="./photography/ex1/img5.jpg"/>
            </div>
            <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
              <img className="thumbnail-img" src="./photography/ex2/img9.jpg"/>
            </div>
            <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
              <img className="thumbnail-img" src="./photography/ex3/img1.JPG"/>
            </div>
            <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
              <img className="thumbnail-img" src="./photography/ex4/img1.jpg"/>
            </div>
            <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
              <img className="thumbnail-img" src="./photography/ex5/img1.png"/>
            </div>
            <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
              <img className="thumbnail-img" src="./photography/ex6/img1.jpg"/>
            </div>
            <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
              <img className="thumbnail-img" src="./photography/ex7/img1.jpg"/>
            </div>
            <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
              <img className="thumbnail-img" src="./photography/ex8/img1.JPG"/>
            </div>
            <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
              <img className="thumbnail-img" src="./photography/ex9/img1.jpg"/>
            </div>

            {clonesRight.map((src, index) => (
              <div key={`cloneRight-${index}`} className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
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
  )
}
