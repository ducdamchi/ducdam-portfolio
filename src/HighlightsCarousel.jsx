import React from 'react'
import { useState, useRef, useEffect } from 'react'
import './App.css'
import HighlightsThumbnails from './HighlightsThumbnails'

export default function HighlightsCarousel( {numSlidesIndex, imagesPerSlide, imageWidthPercent} ) {

  const CAROUSEL_WHOLE = {
    height: 'calc(((100% - 2 * var(--slider-padding)) / var(--images-per-slide) * 0.666)'
  }

  /*************** STATES AND VARS **************/
  const [carouselIndex, setCarouselIndex] = useState(1);  /* slide index we're on */
  const [isEdgeTransition, setEdgeTransition] = useState(false); /* handling Edge case transition? */
  const [rightDisabled, setRightDisabled] = useState(false); /* disabling next button */
  const [leftDisabled, setLeftDisabled] = useState(false); /* disabling previous button */

  /*************** FUNCTIONS **************/
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

  /* Handles edge case transitions */
  function handleEdgeCase (newIndex) {

    // If reached beyond the last slide, wrap to the first real slide
    if (newIndex === numSlidesIndex) {

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
        setCarouselIndex(numSlidesIndex-1);
      }, 700);
    } 
  };

  /* Handles user right button clicks */
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

  /* Handles user left button clicks */
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


  /*************** HOOKS **************/
  /* Update function for whenever carouselIndex changes, or edgeTransition flag is set */
  useEffect(() => {

    if(isEdgeTransition) {
      setTimeout(() => {
        setEdgeTransition(false);
      }, 300)
    }
    console.log("Carousel index: " + carouselIndex);

  }, [isEdgeTransition, carouselIndex])


  /*************** HTML **************/
  return (
    <div className="carousel-whole" style={CAROUSEL_WHOLE}>

          {/* Left side button */}
          <button 
            id="arrowLeft" 
            className='carousel-btn'
            onClick={prevSlide}
            disabled={leftDisabled}>
            <div className='arrowLeft'>&#8249;</div>
          </button>

          <HighlightsThumbnails 
            carouselIndex={carouselIndex} 
            isEdgeTransition={isEdgeTransition} 
            imageWidthPercent={imageWidthPercent} 
            imagesPerSlide={imagesPerSlide}/>

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
