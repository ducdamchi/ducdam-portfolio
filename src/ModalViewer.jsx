import React from 'react'
import ReactDom from 'react-dom'
import { useState, useRef, useEffect } from 'react'
import './App.css'

export default function ModalViewer({ album, openModalId, closeModal }) {
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
  
  const BTN_LEFT = {
    position: 'absolute',
    display: 'block',
    // zIndex: '30',
  
    top: '45%',
    left: '0%',
  
    fontSize: '3vw',
    color: 'white'
  }
  
  const BTN_RIGHT = {
    position: 'absolute',
    display: 'block',
  
    top: '45%',
    right: '0%',
  
    fontSize: '3vw',
    color: 'white'
  }
  
  const SLIDES_ALL = {
    display: 'block'
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

  const COUNTER = {
    position: 'absolute',
    display: 'block',
  
    top: '10%',
    right: '0%',
  
    fontSize: '1.5vw',
    color: 'white'
  }

  const BTN_VIEW = {
    position: 'absolute',
    display: 'block',
  
    top: '20%',
    right: '0%',
  
    fontSize: '1.5vw',
    color: 'white'
  }

  const GALLERY_ALL = {
    display: 'none',
    gridTemplateColumns: 'repeat(3, minmax(150px, 450px))',
    justifyContent: 'center',
    gridGap: '30px',
  }

  const GALLERY_EACH = {
    display: 'block',
    position: 'relative',
    width: '100%',
    margin: '0'
  }
  
  const [slideIndex, setSlideIndex] = useState(0);
  const [isGalleryView, setGalleryView] = useState(false);
  
  function prevSlide() {
    setSlideIndex((prevIndex) => {
      let newIndex = prevIndex - 1;
      if (newIndex < 0) {
        newIndex = album.numImages - 1;
      }
      return newIndex;
    })
  }
  
  function nextSlide() {
    setSlideIndex((prevIndex) => {
      let newIndex = prevIndex + 1;
      if (newIndex > album.numImages - 1) {
        newIndex = 0;
      }
      return newIndex;
    })
  }

  function toggleView() {
    setGalleryView((galleryView) => {
      return galleryView ? false : true
    })
  }

  useEffect(() => {
    const slideDiv = document.getElementsByClassName('slides-all');
    const galleryDiv = document.getElementsByClassName('gallery-all');

    if (isGalleryView) {
      slideDiv.style.display = 'none';
      galleryDiv.style.display = 'grid';
    } else {
      slideDiv.style.display = 'block';
      galleryDiv.style.display = 'none';
    }
  }, [isGalleryView])

  const slides = useRef(null);
  useEffect(() => {
    console.log(`slide index: ${slideIndex}`);
    if (slides.current) {

      const allSlides = slides.current.querySelectorAll('.slides-each');
      Array.from(allSlides);

      /* Only turn on block display for slide with current index */
      for (let i=0; i < allSlides.length; i++) {
        if (i != slideIndex) {
          allSlides[i].style.display = "none";
        } else {
          allSlides[i].style.display = "block";
        }
      }
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
            style={BTN_LEFT}
            onClick={prevSlide}>&#8249;</button>

          <div ref={slides} className="slides-all" style={SLIDES_ALL}>
            {album.imgList.map((slide) => (
              <img 
                className="slides-each"
                style = {SLIDES_EACH}
                key={slide.id}
                src={slide.src}
              />
            ))}
          </div>
          
          <div className="gallery-all" style={GALLERY_ALL}>
            {album.imgList.map((img) => (
              <img 
                className="gallery-each"  
                style = {GALLERY_EACH}
                key={img.id}
                src={img.src}
              />
            ))}
          </div>


          <button 
            className="modal-btn" 
            style={BTN_RIGHT}
            onClick={nextSlide}>&#8250;</button>

          <button 
            onClick={closeModal} 
            style={BTN_CLOSE}>×</button>
          
          <div
            style={COUNTER}>{`${slideIndex+1}/${album.numImages}`}</div>

          <button
            onClick={toggleView}
            style={BTN_VIEW}>Grid</button>
        </div>
      </>,
      document.getElementById('portal')
    )
  }
}

