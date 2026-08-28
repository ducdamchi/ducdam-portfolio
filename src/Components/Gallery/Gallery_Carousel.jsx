import { useState, useRef, useEffect } from 'react'

import '../../App.css'
import './Gallery.css'
import Gallery_Items from './Gallery_Items'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

export default function Gallery_Carousel({
  config,
  albumsData,
  numSlidesIndex,
  albumsPerSlide,
  oddAlbums,
  screenWidth,
}) {
  const CAROUSEL_WHOLE = {
    height: `calc((100% - 2 * var(--slider-padding)) / ${albumsPerSlide} * 0.666)`,
  }
  const CAROUSEL_BTN_STYLE = {
    position: 'absolute',
    top: '0%',
    height: '100%',
    width: 'var(--slider-padding)',
    zIndex: '3',
    opacity: '1',
  }

  const [carouselIndex, setCarouselIndex] = useState(1)
  const [isEdgeTransition, setEdgeTransition] = useState(false)
  const [rightDisabled, setRightDisabled] = useState(false)
  const [leftDisabled, setLeftDisabled] = useState(false)
  const [slidesOffset, setSlidesOffset] = useState(0)
  const carouselBtnLeft = useRef(null)
  const carouselBtnRight = useRef(null)

  function disableClickTemp(time_ms) {
    setRightDisabled(true)
    setLeftDisabled(true)
    setTimeout(() => {
      setRightDisabled(false)
      setLeftDisabled(false)
    }, time_ms)
  }

  function handleEdgeCase(newIndex) {
    if (newIndex === numSlidesIndex) {
      if (oddAlbums != 0) {
        if (oddAlbums != 0 && slidesOffset === 0) {
          setSlidesOffset(oddAlbums / albumsPerSlide)
          setCarouselIndex(newIndex - 1)
        } else if (oddAlbums != 0 && slidesOffset != 0) {
          setTimeout(() => {
            setSlidesOffset(0)
            setEdgeTransition(true)
            setCarouselIndex(1)
          }, 700)
        }
      } else {
        setTimeout(() => {
          setEdgeTransition(true)
          setCarouselIndex(1)
        }, 700)
      }
    } else if (newIndex === 0) {
      if (oddAlbums != 0) {
        if (slidesOffset === 0) {
          setTimeout(() => {
            setSlidesOffset(oddAlbums / albumsPerSlide)
            setEdgeTransition(true)
            setCarouselIndex(numSlidesIndex - 1)
          }, 700)
        } else {
          setSlidesOffset(0)
          setCarouselIndex(newIndex + 1)
        }
      } else {
        setTimeout(() => {
          setEdgeTransition(true)
          setCarouselIndex(numSlidesIndex - 1)
        }, 700)
      }
    }
  }

  function nextSlide() {
    if (!rightDisabled) {
      disableClickTemp(1000)
      setCarouselIndex((prevIndex) => {
        const newIndex = prevIndex + 1
        handleEdgeCase(newIndex)
        return newIndex
      })
    }
  }

  function prevSlide() {
    if (!leftDisabled) {
      disableClickTemp(1000)
      setCarouselIndex((prevIndex) => {
        const newIndex = prevIndex - 1
        handleEdgeCase(newIndex)
        return newIndex
      })
    }
  }

  useEffect(() => {
    if (isEdgeTransition) {
      setTimeout(() => {
        setEdgeTransition(false)
      }, 300)
    }
  }, [isEdgeTransition, carouselIndex])

  return (
    <div className="carousel-whole" style={CAROUSEL_WHOLE}>
      <div>
        <div className="carousel-btn-bg btn-bg-left"></div>
        <button
          ref={carouselBtnLeft}
          style={CAROUSEL_BTN_STYLE}
          className="carousel-btn carousel-btn-left flex items-center justify-center"
          onClick={prevSlide}
          disabled={leftDisabled}
        >
          <BiChevronLeft />
        </button>
      </div>

      <Gallery_Items
        config={config}
        albumsData={albumsData}
        carouselIndex={carouselIndex}
        setCarouselIndex={setCarouselIndex}
        slidesOffset={slidesOffset}
        setSlidesOffset={setSlidesOffset}
        isEdgeTransition={isEdgeTransition}
        albumsPerSlide={albumsPerSlide}
        carouselBtnLeft={carouselBtnLeft}
        carouselBtnRight={carouselBtnRight}
        screenWidth={screenWidth}
      />

      <div>
        <div className="carousel-btn-bg btn-bg-right"></div>
        <button
          ref={carouselBtnRight}
          style={CAROUSEL_BTN_STYLE}
          className="carousel-btn carousel-btn-right flex items-center justify-center"
          onClick={nextSlide}
          disabled={rightDisabled}
        >
          <BiChevronRight />
        </button>
      </div>
    </div>
  )
}
