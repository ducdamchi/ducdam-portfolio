import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react'
import { useSearch } from '@tanstack/react-router'

import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import Gallery_Card from './Gallery_Card'

const CARD_WIDTH = 576
const NAV_WIDTH = 56
const GAP = 36
const MOBILE_BREAKPOINT = CARD_WIDTH + 2 * NAV_WIDTH

function getSlidesPerPage(containerPx) {
  if (containerPx < 1300) return 1
  if (containerPx < 1912) return 2
  if (containerPx < 2524) return 3
  return 4
}

function NavButton({ direction, show, onClick, width }) {
  const isLeft = direction === 'left'
  return (
    <div
      onClick={show ? onClick : undefined}
      className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-0 z-20 flex h-full items-center justify-center transition-opacity duration-200 ${show ? 'cursor-pointer opacity-100' : 'cursor-default opacity-0'}`}
      style={{ width }}
    >
      {/* Edge blur gradient */}
      <div
        className={`pointer-events-none absolute ${isLeft ? 'left-0' : 'right-0'} top-0 z-10 h-full ${isLeft ? 'bg-linear-to-r' : 'bg-linear-to-l'} from-zinc-50 to-transparent`}
        style={{ width }}
      />
      {/* Solid background — hides on carousel hover */}
      <div className="absolute inset-0 bg-zinc-50 transition-all duration-200 ease-out group-hover/carousel:opacity-0" />
      <button className="z-10 flex items-center justify-center rounded-full border-0 p-2 backdrop-blur-sm transition-all duration-200 ease-out group-hover/carousel:backdrop-brightness-70 hover:backdrop-brightness-50">
        {isLeft ? (
          <BiChevronLeft className="text-3xl text-zinc-800 transition-color duration-200 group-hover/carousel:text-white" />
        ) : (
          <BiChevronRight className="text-3xl text-zinc-800 transition-color duration-200 group-hover/carousel:text-white" />
        )}
      </button>
    </div>
  )
}

export default function Gallery_Carousel({ config, items }) {
  const { returnTo } = useSearch({ strict: false })
  const [outerEl, setOuterEl] = useState(null)
  const outerRef = useCallback((node) => setOuterEl(node), [])
  const trackRef = useRef(null)
  const restoredRef = useRef(false)

  const [slidesPerPage, setSlidesPerPage] = useState(0)
  const [layoutReady, setLayoutReady] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const pendingInitialIndex = useRef(null)

  const isMobile = containerWidth > 0 && containerWidth < MOBILE_BREAKPOINT
  const wasMobileRef = useRef(isMobile)
  const realCount = items.length
  const showArrows = realCount > slidesPerPage

  const carouselWidth =
    slidesPerPage * CARD_WIDTH +
    (slidesPerPage - 1) * GAP +
    2 * NAV_WIDTH

  const applyTransform = useCallback((index, durationMs = 300) => {
    if (!trackRef.current) return
    const tx = index * (CARD_WIDTH + GAP)
    trackRef.current.style.transition =
      durationMs === 0 ? 'none' : `transform ${durationMs}ms ease-in-out`
    trackRef.current.style.transform = `translateX(-${tx}px)`
  }, [])

  // Resize observer on parent element
  const updateLayout = useCallback(() => {
    const parent = outerEl?.parentElement
    if (!parent) return
    const containerPx = parent.offsetWidth
    setContainerWidth(containerPx)
    const next = getSlidesPerPage(containerPx)
    setSlidesPerPage((prev) => {
      if (prev === next) {
        setLayoutReady(true)
        return prev
      }
      const startIndex = realCount > next ? next : 0
      setCurrentIndex(startIndex)
      if (trackRef.current) {
        trackRef.current.style.transition = 'none'
        trackRef.current.style.transform = `translateX(-${startIndex * (CARD_WIDTH + GAP)}px)`
      } else {
        pendingInitialIndex.current = startIndex
      }
      setLayoutReady(true)
      return next
    })
  }, [outerEl, realCount])

  useEffect(() => {
    const parent = outerEl?.parentElement
    if (!parent) return
    const observer = new ResizeObserver(updateLayout)
    observer.observe(parent)
    updateLayout()
    return () => observer.disconnect()
  }, [outerEl, updateLayout])

  // Handle showArrows toggling
  const prevShowArrowsRef = useRef(showArrows)
  useEffect(() => {
    const wasShowing = prevShowArrowsRef.current
    prevShowArrowsRef.current = showArrows
    if (!wasShowing && showArrows) {
      setCurrentIndex(slidesPerPage)
      applyTransform(slidesPerPage, 0)
    } else if (wasShowing && !showArrows) {
      setCurrentIndex(0)
      applyTransform(0, 0)
    }
  }, [showArrows, slidesPerPage, applyTransform])

  // Apply pending initial transform before first paint
  useLayoutEffect(() => {
    if (!layoutReady || pendingInitialIndex.current === null) return
    applyTransform(pendingInitialIndex.current, 0)
    pendingInitialIndex.current = null
  }, [layoutReady, applyTransform])

  // Restore carousel position from router state (returning from landing page)
  useEffect(() => {
    if (restoredRef.current || !layoutReady) return
    if (returnTo !== undefined) {
      restoredRef.current = true
      setCurrentIndex(returnTo)
      applyTransform(returnTo, 0)
    }
  }, [layoutReady, returnTo, applyTransform])

  // Reset position when switching from mobile back to carousel
  useEffect(() => {
    if (wasMobileRef.current && !isMobile && layoutReady) {
      const startIndex = realCount > slidesPerPage ? slidesPerPage : 0
      setCurrentIndex(startIndex)
      applyTransform(startIndex, 0)
    }
    wasMobileRef.current = isMobile
  }, [isMobile, layoutReady, realCount, slidesPerPage, applyTransform])

  // Clone slices
  const prepend = showArrows ? items.slice(-slidesPerPage) : []
  const append = showArrows ? items.slice(0, slidesPerPage) : []
  const allSlides = showArrows ? [...prepend, ...items, ...append] : items

  const handleNext = useCallback(() => {
    if (isTransitioning || realCount === 0) return
    setIsTransitioning(true)

    const remainder = realCount % slidesPerPage
    const step =
      remainder !== 0 &&
      currentIndex < realCount &&
      currentIndex + slidesPerPage > realCount
        ? remainder
        : slidesPerPage

    const next = currentIndex + step

    if (next >= realCount + slidesPerPage) {
      applyTransform(next, 300)
      setTimeout(() => {
        applyTransform(next - realCount, 0)
        setCurrentIndex(next - realCount)
        setIsTransitioning(false)
      }, 300)
    } else {
      applyTransform(next, 300)
      setCurrentIndex(next)
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }, [isTransitioning, realCount, currentIndex, slidesPerPage, applyTransform])

  const handlePrev = useCallback(() => {
    if (isTransitioning || realCount === 0) return
    setIsTransitioning(true)

    const remainder = realCount % slidesPerPage
    const step =
      remainder !== 0 && currentIndex === slidesPerPage + remainder
        ? remainder
        : slidesPerPage

    const prev = currentIndex - step

    if (prev < slidesPerPage) {
      applyTransform(prev, 300)
      setTimeout(() => {
        applyTransform(prev + realCount, 0)
        setCurrentIndex(prev + realCount)
        setIsTransitioning(false)
      }, 300)
    } else {
      applyTransform(prev, 300)
      setCurrentIndex(prev)
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }, [isTransitioning, realCount, currentIndex, slidesPerPage, applyTransform])

  if (isMobile) {
    return (
      <div ref={outerRef} className="flex w-full flex-col gap-6 px-4">
        {items.map((album) => (
          <Gallery_Card
            key={album.id}
            album={album}
            config={config}
            cardWidth="100%"
            currentIndex={0}
            isClone={false}
            isMobile
          />
        ))}
      </div>
    )
  }

  return (
    <div
      ref={outerRef}
      style={{ width: layoutReady ? carouselWidth : 0 }}
      className={`relative flex flex-col group/carousel hover:z-[50]`}
    >
      {layoutReady && (
        <div className="relative">
          <NavButton
            direction="left"
            show={showArrows}
            onClick={handlePrev}
            width={NAV_WIDTH}
          />

          <div
            style={{
              overflowX: 'clip',
              overflowY: 'visible',
              paddingLeft: NAV_WIDTH,
              paddingRight: NAV_WIDTH,
              position: 'relative',
            }}
          >
            <div ref={trackRef} className="flex" style={{ gap: GAP }}>
              {allSlides.map((album, idx) => (
                <div key={`${album.id}-${idx}`} style={{ flexShrink: 0 }}>
                  <Gallery_Card
                    album={album}
                    config={config}
                    cardWidth={CARD_WIDTH}
                    currentIndex={currentIndex}
                    isClone={idx < prepend.length || idx >= prepend.length + realCount}
                  />
                </div>
              ))}
            </div>
          </div>

          <NavButton
            direction="right"
            show={showArrows}
            onClick={handleNext}
            width={NAV_WIDTH}
          />
        </div>
      )}
    </div>
  )
}
