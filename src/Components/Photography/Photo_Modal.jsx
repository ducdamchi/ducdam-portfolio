import React from 'react'
import ReactDom from 'react-dom'
import { useState, useRef, useEffect } from 'react'
import '../../App.css'
import './Photography.css'
import { PiGridNineBold } from 'react-icons/pi'
import { TbSlideshow } from 'react-icons/tb'
import { TbBackground } from 'react-icons/tb'
import { ImArrowLeft } from 'react-icons/im'
import { BiArrowBack } from 'react-icons/bi'
import { CgLayoutGridSmall } from 'react-icons/cg'
import { TfiLayoutSlider } from 'react-icons/tfi'
import { PiSelectionBackgroundThin } from 'react-icons/pi'

export default function Modal({ album, openModalId, closeModal }) {
  /*************** CSS **************/
  const MODAL_BG = {
    zIndex: '20',
    position: 'fixed',
    top: '0%',
    width: '100vw',
    height: '150vh',
    background: 'rgb(255, 255, 255)',
  }

  const MODAL_CONTENT = {
    zIndex: '30',
    // position: 'absolute',
    textAlign: 'center',
    width: '100%',
    height: '70%',
    // top: '12.5%', // = (100-height)/2
    // left: '0%', // = (100-width)/2
    // color: 'white',
  }

  /*************** STATES AND VARS **************/
  const [slideIndex, setSlideIndex] = useState(0)
  const [isGalleryView, setGalleryView] = useState(false)
  const [bgColor, setBgColor] = useState('white')
  const bgRef = useRef(null)
  const modalRef = useRef(null)
  const galleryRef = useRef(null)
  const slidesRef = useRef(null)
  const modal_slides_btnLeft = useRef(null)
  const modal_slides_btnRight = useRef(null)

  /*************** FUNCTIONS **************/
  function prevSlide() {
    setSlideIndex((prevIndex) => {
      let newIndex = prevIndex - 1
      if (newIndex < 0) {
        newIndex = album.numImages - 1
      }
      return newIndex
    })
  }

  function nextSlide() {
    setSlideIndex((prevIndex) => {
      let newIndex = prevIndex + 1
      if (newIndex > album.numImages - 1) {
        newIndex = 0
      }
      return newIndex
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
        return 'black'
      } else if (prevBg === 'grey') {
        return 'white'
      } else {
        return 'grey'
      }
    })
  }

  function handleGalleryClick(imgIndex) {
    setSlideIndex(imgIndex)
    setGalleryView(false)
  }

  /*************** HOOKS **************/
  /* Handle prev/next transition in Slides View Mode */
  useEffect(() => {
    // console.log(`slide index: ${slideIndex}`)
    if (slidesRef.current) {
      const allSlides = slidesRef.current.querySelectorAll('.slides-each')
      Array.from(allSlides)

      /* Only turn on block display for slide with current index */
      for (let i = 0; i < allSlides.length; i++) {
        if (i != slideIndex) {
          // allSlides[i].style.display = 'none'
          allSlides[i].classList.remove('visible')
          setTimeout(() => {
            allSlides[i].style.display = 'none'
          }, 300)
        } else {
          setTimeout(() => {
            allSlides[i].classList.add('visible')
          }, 300)
          allSlides[i].style.display = 'inline-block'
          // console.log(allSlides[i].style)
        }
      }
    }
  }, [slideIndex])

  /* Handle transition between Gallery View and Slides View  */
  useEffect(() => {
    if (slidesRef.current && galleryRef.current) {
      if (isGalleryView) {
        /* Disable display and features for Slides View */
        slidesRef.current.style.display = 'none'
        if (modal_slides_btnLeft.current && modal_slides_btnRight.current) {
          modal_slides_btnLeft.current.style.display = 'none'
          modal_slides_btnRight.current.style.display = 'none'
        }

        /* Enable display for Gallery View */
        galleryRef.current.style.display = 'grid'
      } else {
        /* Disable display for Gallery View */
        galleryRef.current.style.display = 'none'

        /* Enable display and features for Slides View */
        slidesRef.current.style.display = 'block'
        if (modal_slides_btnLeft.current && modal_slides_btnRight.current) {
          modal_slides_btnLeft.current.style.display = 'block'
          modal_slides_btnRight.current.style.display = 'block'
        }
      }
    }
  }, [isGalleryView])

  /* Handle transition between background colors */
  useEffect(() => {
    if (bgRef.current) {
      if (bgColor === 'black') {
        bgRef.current.style.background = 'rgb(0, 0, 0)'
        modalRef.current.style.color = 'rgb(250, 250, 250)'
      } else if (bgColor === 'grey') {
        bgRef.current.style.background = 'rgba(132, 132, 132, 1)'
        modalRef.current.style.color = 'rgb(255, 255, 255)'
      } else {
        bgRef.current.style.background = 'rgba(250, 250, 250, 1)'
        modalRef.current.style.color = 'rgb(0, 0, 0)'
      }
    }
  }, [bgColor])

  if (openModalId === null) {
    return null
  } else {
    return ReactDom.createPortal(
      <>
        <div ref={bgRef} className="modal-background" style={MODAL_BG} />

        <div
          ref={modalRef}
          className="relative z-30 flex h-[120vh] w-[100vw] flex-col items-center justify-start gap-0 border-2 border-amber-500"
        >
          {/* NAVBAR */}
          <div className="modal-navbar-wrapper z-30 mt-5 flex w-full justify-center border-2 border-blue-500">
            <div className="modal-navbar flex w-[85%] max-w-[2400px] items-center justify-between gap-10 border-2 border-green-500 p-2 font-thin">
              {/* Button for closing modal, shared */}
              <button
                className="modal-navbar-back text-md border-2 border-orange-300 sm:text-xl md:text-xl lg:text-2xl xl:text-3xl"
                onClick={closeModal}
              >
                <BiArrowBack />
              </button>

              <div className="flex items-center gap-5 border-2 border-red-500">
                <div className="sm:text-md xl:text- border-2 border-orange-300 text-xs font-thin md:text-base lg:text-lg">
                  {`${slideIndex + 1}/${album.numImages}`}
                </div>

                {/* Button for switching between Slides View and Gallery View, shared */}
                <button
                  className="border-2 border-orange-300 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                  onClick={toggleView}
                >
                  {isGalleryView ? <TfiLayoutSlider /> : <CgLayoutGridSmall />}
                </button>

                {/* Button for switching modal background colors (black, grey, white), shared*/}
                <button
                  className="text-md border-2 border-orange-300 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                  onClick={toggleBackground}
                >
                  <PiSelectionBackgroundThin />
                </button>
              </div>
            </div>
          </div>

          {/* TITLE */}
          <div className="modal-title z-30 mb-10 flex w-full justify-center border-2 border-blue-500 p-2 font-thin">
            <div className="capitalize normal-case">{album.title}</div>
          </div>

          {/* IMAGE DISPLAY WINDOW */}
          <div className="modal-content" style={MODAL_CONTENT}>
            {/* MODAL - VIEWING WINDOW */}
            <div className="modal-flexContainer flex h-full w-full justify-center border-3 border-blue-500">
              {/* MODAL - LEFT BUTTON*/}
              <div className="modal-left-flexItem flex h-full w-[5%] flex-auto items-center justify-center border-3 border-green-500">
                <button
                  ref={modal_slides_btnLeft}
                  className="text-md font-thin sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl"
                  onClick={prevSlide}
                >
                  &#8249;
                </button>
              </div>

              {/* MODAL - CENTER FRAME*/}
              <div className="modal-center-flexItem flex h-auto w-[100%] max-w-[2400px] flex-30 items-center justify-center border-3 border-red-500">
                {/* Slides View Mode */}
                <div ref={slidesRef} className="slides-all h-full w-full">
                  {album.imgList.map((slide) => (
                    <img
                      className="slides-each h-full w-full border-3 border-orange-500 object-contain"
                      key={slide.id}
                      src={`/${slide.src}`}
                    />
                  ))}
                </div>

                {/* Gallery View Mode */}
                <div ref={galleryRef} className="gallery-all">
                  {album.imgList.map((img) => (
                    <img
                      className="gallery-each"
                      key={img.id}
                      src={`/${img.src}`}
                      onClick={() => handleGalleryClick(img.index)}
                    />
                  ))}
                </div>
              </div>

              {/* MODAL - RIGHT BUTTON*/}
              <div className="modal-right-flexItem flex h-full w-[5%] flex-auto items-center justify-center border-3 border-green-500">
                <div className="flex h-full w-full items-center justify-center">
                  <button
                    ref={modal_slides_btnRight}
                    className="text-md font-thin sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl"
                    onClick={nextSlide}
                  >
                    &#8250;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PHOTO DESCRIPTION (ONLY IN SLIDES MODE)*/}
          {!isGalleryView && (
            <div className="modal-description z-30 flex w-full justify-center border-2 border-blue-500 font-thin">
              <div className="max-w-[2400px w-[80%] p-3 text-xs">
                {album.imgList[slideIndex].description}
              </div>
            </div>
          )}
        </div>
      </>,
      document.getElementById('portal'),
    )
  }
}
