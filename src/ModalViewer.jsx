import React from 'react'
import ReactDom from 'react-dom'
import { useState, useRef, useEffect } from 'react'
import './App.css'
import { PiGridNineBold } from "react-icons/pi";
import { TbSlideshow } from "react-icons/tb";
import { TbBackground } from "react-icons/tb";

export default function ModalViewer({ album, openModalId, closeModal }) {
  const MODAL_BG = {
    zIndex: '20',
    position: 'fixed',
    display: 'block',
  
    top: '0%',
    width: '100%',
    height: '100%',
  
    background: 'rgba(0, 0, 0, 0.9)',
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
  
    overflow: 'hidden',

    color: 'white',
    
  }
  
  const SLIDES_ALL = {
    display: 'block'
  }

  const SLIDES_EACH = {
    display: 'none',
    position: 'absolute',
  
    width: '70vw',
    top: '0%',
    left: '11%',
  }

  const GALLERY_ALL = {
    display: 'none',
    overflow: 'scroll',

    gridTemplateColumns: 'repeat(3, minmax(150px, 450px))',
    gridGap: '30px',
    justifyContent: 'center',
  }
  
  const [slideIndex, setSlideIndex] = useState(0);
  const [isGalleryView, setGalleryView] = useState(false);
  const [bgColor, setBgColor] = useState('black');
  const bgRef = useRef(null);
  const modalRef = useRef(null);
  const galleryRef = useRef(null);
  const slidesRef = useRef(null);
  
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

  function toggleBackground() {
    setBgColor((prevBg) => {
      if (prevBg === 'white') {
        return 'black';
      } else if (prevBg === 'grey') {
        return 'white';
      } else {
        return 'grey';
      }
    })
  }

  function handleGalleryClick (imgIndex) {
    setSlideIndex(imgIndex);
    setGalleryView(false);
  }
  
  /* Handle prev/next transition in Slides View Mode */
  useEffect(() => {
    console.log(`slide index: ${slideIndex}`);
    if (slidesRef.current) {

      const allSlides = slidesRef.current.querySelectorAll('.slides-each');
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

  /* Handle transition between Gallery View and Slides View  */
  useEffect(() => {
    if (slidesRef.current && galleryRef.current) {

      if (isGalleryView) {
        /* Disable display and features for Slides View */
        slidesRef.current.style.display = 'none';

        /* Enable display for Gallery View */
        galleryRef.current.style.display = 'grid';

      } else {
        /* Disable display for Gallery View */
        galleryRef.current.style.display = 'none';

        /* Enable display and features for Slides View */
        slidesRef.current.style.display = 'block';
      }
    }
  }, [isGalleryView])

  /* Handle transition between background colors */
  useEffect(() => {
    if (bgRef.current) {
      if (bgColor === 'black') {
        bgRef.current.style.background = 'rgba(0, 0, 0, 0.95)';
        modalRef.current.style.color = 'rgb(255, 255, 255)';
      } else if (bgColor === 'grey') {
        bgRef.current.style.background = 'rgba(127, 127, 127, 0.95)';
        modalRef.current.style.color = 'rgb(255, 255, 255)';
      } else {
        bgRef.current.style.background = 'rgba(255, 255, 255, 0.95)';
        modalRef.current.style.color = 'rgb(0, 0, 0)';
      }
    }
  },[bgColor])


  if (openModalId === null) {
    return null

  } else {
    return ReactDom.createPortal (
      <>
        <div ref={bgRef} className="modal-background" style={MODAL_BG}/>
        <div ref={modalRef} className="modal-content" style={MODAL_CONTENT}>

          {/* Slides View Mode */}
          <div 
            ref={slidesRef} 
            className="slides-all" 
            style={SLIDES_ALL}>

            <button
              className="slides-btn left" 
              onClick={prevSlide}>&#8249;</button>

            {album.imgList.map((slide) => (
              <img 
                className="slides-each"
                style = {SLIDES_EACH}
                key={slide.id}
                src={slide.src}
              />
            ))}

            <button
              className="slides-btn right" 
              onClick={nextSlide}>&#8250;</button>  

            <div
              className="slides-btn counter">{`${slideIndex+1}/${album.numImages}`}</div>

          </div>
          
          {/* Gallery View Mode */}
          <div 
            ref={galleryRef} 
            className="gallery-all" 
            style={GALLERY_ALL}>
            {album.imgList.map((img) => (
              <img 
                className="gallery-each" 
                key={img.id}
                src={img.src}
                onClick={() => handleGalleryClick(img.index)}
              />
            ))}
          </div>

          {/* Shared buttons / functionalities */}

          {/* Button for closing modal */}
          <button
            className="modal-btn close"
            onClick={closeModal}>×</button>

          {/* Button for switching between Slides View and Gallery View */}
          <button
            className="modal-btn view"
            onClick={toggleView}>
              {isGalleryView ? <TbSlideshow /> : <PiGridNineBold />}
          </button>
          
          {/* Button for switching modal background colors (black, grey, white)*/}
          <button
            className="modal-btn bg"
            onClick={toggleBackground}><TbBackground /></button>

        </div>
      </>,
      document.getElementById('portal')
    )
  }
}

