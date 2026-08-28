import ReactDom from 'react-dom'
import { useState, useRef, useEffect } from 'react'
import '../../App.css'
import './Gallery.css'
import { CgLayoutGridSmall } from 'react-icons/cg'
import { TfiLayoutSlider } from 'react-icons/tfi'
import { BiChevronRight, BiLeftArrowAlt, BiChevronLeft } from 'react-icons/bi'

export default function Gallery_Modal({
  config,
  album,
  openModalId,
  closeModal,
  screenHeight,
  screenWidth,
  isMobileMode,
}) {
  const MODAL_BG = {
    transition: 'background 400ms ease-in-out',
  }

  const MODAL_REF = {
    transition: 'color 400ms ease-in-out',
  }

  const MODAL_DESC_REF = {
    transition: 'all 400ms ease-in-out',
  }

  const [slideIndex, setSlideIndex] = useState(0)
  const [isGalleryView, setGalleryView] = useState(false)
  const bgRef = useRef(null)
  const modalRef = useRef(null)
  const modalContentRef = useRef(null)
  const modalDescriptionRef = useRef(null)
  const galleryRef = useRef(null)
  const slidesRef = useRef(null)
  const modal_slides_btnLeft = useRef(null)
  const modal_slides_btnRight = useRef(null)

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

  function handleGalleryClick(imgIndex) {
    setSlideIndex(imgIndex)
    setGalleryView(false)
  }

  useEffect(() => {
    if (slidesRef.current) {
      const allSlides = slidesRef.current.querySelectorAll('.slides-each')
      Array.from(allSlides)

      for (let i = 0; i < allSlides.length; i++) {
        if (i != slideIndex) {
          allSlides[i].style.display = 'none'
        } else {
          allSlides[i].style.display = 'inline-block'
        }
      }
    }
  }, [slideIndex])

  useEffect(() => {
    if (slidesRef.current && galleryRef.current) {
      if (isGalleryView) {
        slidesRef.current.style.display = 'none'
        if (modal_slides_btnLeft.current && modal_slides_btnRight.current) {
          modal_slides_btnLeft.current.style.display = 'none'
          modal_slides_btnRight.current.style.display = 'none'
        }
        galleryRef.current.style.display = 'grid'
      } else {
        galleryRef.current.style.display = 'none'
        slidesRef.current.style.display = 'block'
        if (modal_slides_btnLeft.current && modal_slides_btnRight.current) {
          modal_slides_btnLeft.current.style.display = 'block'
          modal_slides_btnRight.current.style.display = 'block'
        }
      }
    }
  }, [isGalleryView])

  useEffect(() => {
    if (modalContentRef.current) {
      if (isMobileMode && screenHeight <= 640) {
        modalContentRef.current.style.height = '90vh'
      } else if (isMobileMode && screenHeight > 640) {
        modalContentRef.current.style.height = '30vh'
      } else {
        modalContentRef.current.style.height = '75vh'
      }
    }
  }, [screenHeight, screenWidth, isMobileMode])

  if (openModalId === null) {
    return null
  } else {
    return ReactDom.createPortal(
      <div className="absolute top-0 h-[110vh] w-[100vw]">
        <div
          ref={bgRef}
          className="modal-background relative z-20 h-full w-full bg-zinc-50"
          style={MODAL_BG}
        />

        <div
          ref={modalRef}
          style={MODAL_REF}
          className="relative top-[-110vh] z-30 flex h-auto w-[100vw] flex-col items-center justify-start gap-0"
        >
          {/* NAVBAR */}
          <div className="modal-navbar-wrapper z-30 mt-5 flex w-full justify-center">
            <div className="modal-navbar flex w-[85%] max-w-[2400px] items-center justify-between gap-10 p-2 font-thin">
              <button
                className="modal-navbar-back flex items-center gap-1"
                onClick={closeModal}
              >
                <BiLeftArrowAlt className="text-xl" />
                <div className="text-base">BACK</div>
              </button>

              <div className="flex items-center gap-2">
                <div className="text-xs font-thin md:text-sm xl:text-base">
                  {`${slideIndex + 1}/${album.numImages}`}
                </div>

                <button
                  className="text-md duration-200 ease-out hover:scale-[1.1] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                  onClick={toggleView}
                >
                  {isGalleryView ? (
                    <TfiLayoutSlider className="m-[5px] text-xl" />
                  ) : (
                    <CgLayoutGridSmall className="text-3xl" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* TITLE */}
          <div className="z-30 mb-10 flex w-full justify-center p-2 font-thin">
            <div className={`modal-title ${config.titleTransform}`}>
              {album.title}
            </div>
          </div>

          {/* IMAGE DISPLAY WINDOW */}
          <div className="modal-content relative h-full w-full">
            <div
              ref={modalContentRef}
              className="modal-flexContainer relative flex h-full w-full justify-center"
            >
              {/* LEFT BUTTON */}
              <div className="modal-left-flexItem flex h-full w-[10%] max-w-[11rem] items-center justify-center">
                <button
                  ref={modal_slides_btnLeft}
                  className="text-md font-thin duration-200 ease-out hover:scale-[1.1] sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl"
                  onClick={prevSlide}
                >
                  <BiChevronLeft />
                </button>
              </div>

              {/* CENTER FRAME */}
              <div className="modal-center-flexItem flex h-full w-[80%] max-w-[2400px] flex-30 items-center justify-center">
                {/* Slides View Mode */}
                <div ref={slidesRef} className="slides-all h-full w-full">
                  {album.imgList.map((slide) => (
                    <img
                      className="slides-each h-full w-full object-contain"
                      key={slide.id}
                      src={`${import.meta.env.BASE_URL}${slide.src}`}
                    />
                  ))}
                </div>

                {/* Gallery View Mode */}
                <div ref={galleryRef} className="gallery-all">
                  {album.imgList.map((img) => (
                    <img
                      className="gallery-each"
                      key={img.id}
                      src={`${import.meta.env.BASE_URL}${img.src}`}
                      onClick={() => handleGalleryClick(img.index)}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT BUTTON */}
              <div className="modal-right-flexItem flex h-full w-[10%] max-w-[11rem] items-center justify-center">
                <button
                  ref={modal_slides_btnRight}
                  className="text-md font-thin duration-200 ease-out hover:scale-[1.1] sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl"
                  onClick={nextSlide}
                >
                  <BiChevronRight />
                </button>
              </div>
            </div>
          </div>

          {/* PHOTO DESCRIPTION (ONLY IN SLIDES MODE) */}
          {!isGalleryView && (
            <div
              style={MODAL_DESC_REF}
              ref={modalDescriptionRef}
              className="relative z-30 mt-2 flex w-full items-center justify-center font-thin"
            >
              <div className="modal-description w-[80%] max-w-[1600px] p-3 text-xs">
                {album.imgList[slideIndex].description}
              </div>
            </div>
          )}
        </div>
      </div>,
      document.getElementById('portal'),
    )
  }
}
