import React from 'react'
import ReactDom from 'react-dom'
import { useState, useRef, useEffect } from 'react'
import './App.css'
import { PiGridNineBold } from "react-icons/pi";
import { TbSlideshow } from "react-icons/tb";
import { TbBackground } from "react-icons/tb";

export default function ModalViewer({ album, openModalId, closeModal }) {

  /*************** CSS **************/
  const MODAL_BG = {
    zIndex: '20',
    position: 'fixed',
    top: '0%',
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.9)',
  }
  
  const MODAL_CONTENT = {
    zIndex: '30',
    position: 'absolute',
    textAlign: 'center',
    width: '90%',
    height: '90%', 
    top: '5%',// = (100-height)/2
    left: '5%', // = (100-width)/2
    color: 'white',
  }
  
  /*************** STATES AND VARS **************/
  const [slideIndex, setSlideIndex] = useState(0);
  const [isGalleryView, setGalleryView] = useState(false);
  const [bgColor, setBgColor] = useState('black');
  const bgRef = useRef(null);
  const modalRef = useRef(null);
  const galleryRef = useRef(null);
  const slidesRef = useRef(null);
  const modal_slides_btnLeft = useRef(null);
  const modal_slides_btnRight = useRef(null);
  
  /*************** FUNCTIONS **************/
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
  
  /*************** HOOKS **************/
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
          allSlides[i].style.display = "inline-block";
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
        if (modal_slides_btnLeft.current && modal_slides_btnRight.current) {
          modal_slides_btnLeft.current.style.display = 'none';
          modal_slides_btnRight.current.style.display = 'none';
        }

        /* Enable display for Gallery View */
        galleryRef.current.style.display = 'grid';

      } else {
        /* Disable display for Gallery View */
        galleryRef.current.style.display = 'none';

        /* Enable display and features for Slides View */
        slidesRef.current.style.display = 'block';
        if (modal_slides_btnLeft.current && modal_slides_btnRight.current) {
          modal_slides_btnLeft.current.style.display = 'block';
          modal_slides_btnRight.current.style.display = 'block';
        }
      }
    }
  }, [isGalleryView])

  /* Handle transition between background colors */
  useEffect(() => {
    if (bgRef.current) {
      if (bgColor === 'black') {
        bgRef.current.style.background = 'rgba(0, 0, 0, 0.95)';
        modalRef.current.style.color = 'rgb(250, 250, 250)';
      } else if (bgColor === 'grey') {
        bgRef.current.style.background = 'rgba(132, 132, 132, 0.95)';
        modalRef.current.style.color = 'rgb(250, 250, 250)';
      } else {
        bgRef.current.style.background = 'rgba(250, 250, 250, 0.95)';
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

          <div className='modal-flexContainer flex justify-center border-3 border-blue-500 w-full h-full'>

            <div className='modal-left-flexItem flex flex-auto w-[5%] h-full justify-center items-center border-3 border-green-500'>
              <button
                  ref={modal_slides_btnLeft}
                  className="text-md sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl" 
                  onClick={prevSlide}>&#8249;
              </button>
            </div>

            <div className='modal-center-flexItem flex justify-center items-center -w-[100%] max-w-[1800px] h-auto border-3 border-red-500'>
              {/* Slides View Mode */}
              <div 
                ref={slidesRef} 
                className="slides-all">

                {album.imgList.map((slide) => (
                  <div className='object-cover'>
                    <img 
                    className="slides-each border-3 border-orange-500"
                    key={slide.id}
                    src={slide.src}
                    />
                  </div>

                ))}
              </div>

              {/* Gallery View Mode */}
              <div 
                ref={galleryRef} 
                className="gallery-all">
                {album.imgList.map((img) => (
                  <img 
                    className="gallery-each" 
                    key={img.id}
                    src={img.src}
                    onClick={() => handleGalleryClick(img.index)}
                  />
                ))}
              </div>
          
            </div>

            <div className='modal-right-flexItem flex flex-auto w-[5%] h-full justify-center items-center border-3 border-green-500'>
              <div className='flex w-full h-full justify-center items-center'>
                <button
                  ref={modal_slides_btnRight}
                  className="text-md sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl" 
                  onClick={nextSlide}>&#8250;
                </button>  
              </div>

              <div className='absolute w-inherit h-[45%] top-0 border-2 border-violet-500'>
                <div className="modal-topRightNav flex flex-col gap-10 items-center justify-center h-full border-2 border-rose-500">

                  {/* Button for closing modal, shared */}
                  <button
                    className="text-md sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl"
                    onClick={closeModal}>×
                  </button>

                  <div
                  className="font-bold text-sm sm:text-md md:text-lg lg:text-xl xl:text-3xl">{`${slideIndex+1}/${album.numImages}`}
                  </div>

                  {/* Button for switching between Slides View and Gallery View, shared */}
                  <button
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-6xl"
                    onClick={toggleView}>
                      {isGalleryView ? <TbSlideshow /> : <PiGridNineBold />}
                  </button>
                  
                  {/* Button for switching modal background colors (black, grey, white), shared*/}
                  <button
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-6xl"
                    onClick={toggleBackground}><TbBackground/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>,
      document.getElementById('portal')
    )
  }
}

