import React from 'react'
import ReactDom from 'react-dom'
import { useState, useRef, useEffect } from 'react'
import './App.css'

export default function ModalViewer({album, openModalId, closeModal }) {
  const MODAL_BG = {
    // --bg-color: 0;
    zIndex: '20',
    position: 'fixed',
    display: 'block',
  
    top: '0%',
    width: '100%',
    height: '100%',
  
    background: 'rgba(0, 0, 0, 0.9)',
    color: 'white'
  }
  
  const MODAL_CONTENT = {
    zIndex: '30',
    position: 'absolute',
    display: 'block',
    overflow: 'hidden',
    
    width: '90%',
    height: '90%', 
    top: '5%',// = (100-height)/2
    left: '5%', // = (100-width)/2
  
    overflow: 'hidden'
    
  }
  
  const SLIDES_BTN_LEFT = {
    position: 'absolute',
    display: 'block',
    // zIndex: '30',
  
    top: '45%',
    left: '0%',
  
    fontSize: '3vw',
    color: 'white'
  }
  
  const SLIDES_BTN_RIGHT = {
    position: 'absolute',
    display: 'block',
  
    top: '45%',
    right: '0%',
  
    fontSize: '3vw',
    color: 'white'
  }
  
  const SLIDES_EACH = {
    position: 'absolute',
    display: 'none',
  
    width: '70vw',
    top: '0%',
    left: '11%',
  
    // transform: 'translate(-50%, -50%)'
  }
  
  const BTN_CLOSE = {
    position: 'absolute',
    display: 'block',
  
    top: '0%',
    right: '0%',
  
    fontSize: '3vw',
    color: 'white'
  }
  
  const [currIndex, setCurrIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(null);
  
  function prevSlide() {
    setNextIndex((prevIndex) => {
      let newIndex = prevIndex - 1;
      if (newIndex < 0) {
        newIndex = album.numImages - 1;
      }
      return newIndex;
    })
  }
  
  function nextSlide() {
    setNextIndex((prevIndex) => {
      let newIndex = prevIndex + 1;
      if (newIndex > album.numImages - 1) {
        newIndex = 0;
      }
      return newIndex;
    })
  }

  const slides = useRef(null);
  useEffect(() => {
    setCurrIndex(
      
    );
    console.log(`slide index: ${slideIndex}`);
    if (slides.current) {

      const allSlides = slides.current.querySelectorAll('.slides-each');
      // Array.from(allSlides);
      // allSlides.forEach((slide) => {
      //   slide.style.display = "none";
      // })
      allSlides[currIndex].style.display = "none";
      allSlides[nextIndex].style.display = "block";
    }
  },[slideIndex])


  if (openModalId === null) {
    return null

  } else {
    return ReactDom.createPortal (
      <>
        <div className="modal-background" style={MODAL_BG}/>
        <div className="modal-content" style={MODAL_CONTENT}>

          <button 
            className="modal-btn" 
            style={SLIDES_BTN_LEFT}
            onClick={prevSlide}>&#8249;</button>

          <div ref={slides} className="slides-all">
            {album.imgList.map((slide) => (
              <img 
                className="slides-each"
                key={slide.id}
                src={slide.src}
              />
            ))}
          </div>

          <button 
            className="modal-btn" 
            style={SLIDES_BTN_RIGHT}
            onClick={nextSlide}>&#8250;</button>

          <button 
            onClick={closeModal} 
            style={BTN_CLOSE}>×</button>

        </div>
      </>,
      document.getElementById('portal')
    )
  }
}

