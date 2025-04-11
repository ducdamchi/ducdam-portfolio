import React from 'react'
import { useState, useRef, useEffect } from 'react'
// import '../../App.css'
// import './Photography.css'
import Carousel_Items from './Wood_Items'

export default function Carousel( {woodData, numSlidesIndex} ) {

  /*************** CSS **************/
  const CAROUSEL_WHOLE = {
    height: '750px',
    width: '850px',
    borderWidth: '2px',
    borderColor: 'blue'
  }
  const CAROUSEL_BTN_STYLE = {
    // display: 'block',
    // position: 'absolute',
    // top: '0%',
    // height: '100%',
    // // width: 'var(--slider-padding)',
    // zIndex: '3',
    // opacity: '1',
    // borderWidth: '2px',
    // borderColor: 'red'
  }

  /*************** STATES AND VARS **************/
  const [carouselIndex, setCarouselIndex] = useState(1);  /* slide index we're on */
  const [isEdgeTransition, setEdgeTransition] = useState(false); /* handling Edge case transition */
  const [rightDisabled, setRightDisabled] = useState(false); /* disabling next button */
  const [leftDisabled, setLeftDisabled] = useState(false); /* disabling previous button */
  // const [slidesOffset, setSlidesOffset] = useState(0);
  const carouselBtnLeft = useRef(null);
  const carouselBtnRight = useRef(null);

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

    /* Sliding right near the last slides */
    if (newIndex === numSlidesIndex) {
      setTimeout(() => {
        setEdgeTransition(true);
        setCarouselIndex(1);
      }, 700);
    }
    
    /* Sliding left near the first slides */
    else if (newIndex === 0) {
      setTimeout(() => {
        setEdgeTransition(true);
        setCarouselIndex(numSlidesIndex-1);
      }, 700);
    }
  }

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
    // console.log("Carousel index: " + carouselIndex);

  }, [isEdgeTransition, carouselIndex])
  
  useEffect(() => {
    console.log("Carousel index:", carouselIndex);
  }, [carouselIndex])

  /*************** HTML **************/
  return (
      
      <div className="carousel-whole flex items-center justify-center" style={CAROUSEL_WHOLE}>

        {/* Left side button */}
        <div className='w-[10%] h-full flex flex-1 items-center justify-center border-2 border-red-500 z-[3] bg-[rgb(250,250,250)]'>
          <button 
            ref={carouselBtnLeft}
            style={CAROUSEL_BTN_STYLE}
            className='carousel-btn carousel-btn-left text-md sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl'
            onClick={prevSlide}
            disabled={leftDisabled}>
            <div>&#8249;</div>
          </button>
        </div>

        <div className="w-[80%] h-full flex-10 border-2 border-green-500 z-[2]">
          <Carousel_Items
            woodData={woodData}
            carouselIndex={carouselIndex}
            isEdgeTransition={isEdgeTransition} 
            carouselBtnLeft={carouselBtnLeft}
            carouselBtnRight={carouselBtnRight}/>
        </div>

        {/* Right side button */}
        <div className='w-[10%] h-full flex flex-1 items-center justify-center border-2 border-red-500 z-[3] bg-[rgb(250,250,250)]'>
          <button
            ref={carouselBtnRight}
            style={CAROUSEL_BTN_STYLE}
            className="carousel-btn carousel-btn-right text-md sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl"
            onClick={nextSlide}
            disabled={rightDisabled}>
            <div>&#8250;</div>
          </button>
        </div>

      </div>
  )
}
