import ReactDom from 'react-dom'
import { useState, useRef, useEffect, useCallback } from 'react'
import './gallery.css'
import Gallery_Thumbstrip from './gallery-thumbstrip'
import Gallery_Immersion from './gallery-immersion'
import { CgLayoutGridSmall } from 'react-icons/cg'
import { TfiLayoutSlider } from 'react-icons/tfi'
import { BiChevronRight, BiLeftArrowAlt, BiChevronLeft } from 'react-icons/bi'
import ViewToggle from '../view-toggle'

// Fixed height for the bottom panel (description + gap + thumbstrip + bottom padding)
const BOTTOM_H = '11rem'

export default function Gallery_Modal({
  config,
  album,
  openModalId,
  closeModal,
  screenHeight,
  screenWidth,
  isMobileMode,
  initialIndex,
}) {
  const [slideIndex, setSlideIndex] = useState(initialIndex ?? 0)
  const [isGalleryView, setGalleryView] = useState(false)
  const [isImmersionOpen, setIsImmersionOpen] = useState(false)

  const touchStart = useRef({ x: 0 })

  const prevSlide = useCallback(() => {
    setSlideIndex((prev) => (prev <= 0 ? album.numImages - 1 : prev - 1))
  }, [album.numImages])

  const nextSlide = useCallback(() => {
    setSlideIndex((prev) => (prev >= album.numImages - 1 ? 0 : prev + 1))
  }, [album.numImages])

  function toggleView() {
    setGalleryView((v) => !v)
  }

  function handleGalleryClick(imgIndex) {
    setSlideIndex(imgIndex)
    setGalleryView(false)
  }

  // Keyboard navigation
  useEffect(() => {
    if (isImmersionOpen) return

    const handleKey = (e) => {
      if (e.key === 'Escape') closeModal()
      else if (e.key === 'ArrowLeft') prevSlide()
      else if (e.key === 'ArrowRight') nextSlide()
      else if (e.key === 'g' || e.key === 'G') toggleView()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isImmersionOpen, closeModal, prevSlide, nextSlide])

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Touch handlers for swipe navigation (mobile)
  const handleTouchStart = (e) => {
    touchStart.current.x = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    if (Math.abs(dx) > 50) {
      if (dx > 0) prevSlide()
      else nextSlide()
    }
  }

  if (openModalId === null) return null

  return ReactDom.createPortal(
    <div className="fixed inset-0 z-30 flex flex-col bg-zinc-50">
      {/* NAVBAR */}
      <div className="flex w-full shrink-0 justify-center pt-4">
        <div className="flex w-[90%] max-w-[2400px] items-center justify-between p-1 font-thin">
          <button
            className="modal-navbar-back flex items-center gap-1"
            onClick={closeModal}
          >
            <BiLeftArrowAlt className="text-xl" />
            <div className="text-sm md:text-base">BACK</div>
          </button>

          <div className="flex items-center gap-2">
            {!isGalleryView && (
              <div className="text-xs font-thin md:text-sm">
                {`${slideIndex + 1}/${album.numImages}`}
              </div>
            )}
            <ViewToggle
              isAlt={isGalleryView}
              onToggle={toggleView}
              label=""
              altLabel=""
              Icon={CgLayoutGridSmall}
              AltIcon={TfiLayoutSlider}
              iconSize="text-3xl"
              altIconSize="text-lg"
            />
          </div>
        </div>
      </div>

      {/* TITLE */}
      <div className="flex w-full shrink-0 justify-center p-1 pb-2 font-thin">
        <div className={`modal-title ${config.titleTransform}`}>
          {album.title}
        </div>
      </div>

      {/* SLIDES VIEW */}
      {!isGalleryView && (
        <div className="relative min-h-0 flex-1">
          {/* Image area — absolute so it never reflows from bottom content */}
          <div
            className="absolute inset-x-0 top-0 flex justify-center"
            style={{ bottom: BOTTOM_H }}
            onTouchStart={isMobileMode ? handleTouchStart : undefined}
            onTouchEnd={isMobileMode ? handleTouchEnd : undefined}
          >
            {/* Left arrow — hidden on mobile */}
            {!isMobileMode && (
              <div className="flex w-[8%] max-w-[8rem] items-center justify-center">
                <button
                  className="font-thin duration-200 ease-out hover:scale-[1.1] sm:text-lg md:text-2xl lg:text-3xl xl:text-5xl"
                  onClick={prevSlide}
                >
                  <BiChevronLeft />
                </button>
              </div>
            )}

            {/* Image container */}
            <div className="relative flex h-full w-[84%] max-w-[2400px] items-center justify-center">
              {album.imgList.map((slide, i) => (
                <img
                  key={slide.id}
                  className="absolute max-h-[90%] max-w-full cursor-zoom-in object-contain transition-opacity duration-200 ease-in-out"
                  style={{
                    opacity: i === slideIndex ? 1 : 0,
                    pointerEvents: i === slideIndex ? 'auto' : 'none',
                  }}
                  src={`${import.meta.env.BASE_URL}${slide.src}`}
                  alt=""
                  onClick={() => setIsImmersionOpen(true)}
                />
              ))}
            </div>

            {/* Right arrow — hidden on mobile */}
            {!isMobileMode && (
              <div className="flex w-[8%] max-w-[8rem] items-center justify-center">
                <button
                  className="font-thin duration-200 ease-out hover:scale-[1.1] sm:text-lg md:text-2xl lg:text-3xl xl:text-5xl"
                  onClick={nextSlide}
                >
                  <BiChevronRight />
                </button>
              </div>
            )}

            {/* Mobile swipe hint */}
            {isMobileMode && (
              <div className="absolute bottom-2 left-0 flex w-full items-center justify-center gap-2 text-xs tracking-widest text-zinc-400">
                <span>‹</span>
                <span>·</span>
                <span>›</span>
              </div>
            )}
          </div>

          {/* Bottom panel — absolute, fixed height */}
          <div
            className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-3"
            style={{ height: BOTTOM_H }}
          >
            {/* Description — tall, narrow, scrollable */}
            <div
              className="modal-description desc-scroll w-[100%] max-w-[800px] overflow-y-auto px-4 leading-relaxed"
              style={{ height: '3.5rem' }}
            >
              {album.imgList[slideIndex]?.description}
            </div>

            {/* Thumbnail strip */}
            <div className="w-full">
              <Gallery_Thumbstrip
                imgList={album.imgList}
                currentIndex={slideIndex}
                onSelect={setSlideIndex}
              />
            </div>
          </div>
        </div>
      )}

      {/* GALLERY VIEW */}
      {isGalleryView && (
        <div className="flex-1 overflow-y-auto">
          <div className="gallery-all">
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
      )}

      {/* IMMERSION VIEW */}
      {isImmersionOpen && (
        <Gallery_Immersion
          imgList={album.imgList}
          currentIndex={slideIndex}
          onClose={() => setIsImmersionOpen(false)}
          onNavigate={setSlideIndex}
        />
      )}
    </div>,
    document.getElementById('portal'),
  )
}
