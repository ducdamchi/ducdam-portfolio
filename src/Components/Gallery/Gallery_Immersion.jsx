import ReactDom from 'react-dom'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function Gallery_Immersion({
  imgList,
  currentIndex,
  onClose,
  onNavigate,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const touchStart = useRef({ x: 0, y: 0 })

  const totalImages = imgList.length

  const close = useCallback(() => {
    setIsVisible(false)
    setTimeout(onClose, 200)
  }, [onClose])

  const prev = useCallback(() => {
    const newIndex = currentIndex <= 0 ? totalImages - 1 : currentIndex - 1
    onNavigate(newIndex)
  }, [currentIndex, totalImages, onNavigate])

  const next = useCallback(() => {
    const newIndex = currentIndex >= totalImages - 1 ? 0 : currentIndex + 1
    onNavigate(newIndex)
  }, [currentIndex, totalImages, onNavigate])

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [close, prev, next])

  const handleTouchStart = (e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }

  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y

    if (Math.abs(dy) > 100 && Math.abs(dy) > Math.abs(dx)) {
      close()
    } else if (Math.abs(dx) > 50) {
      if (dx > 0) prev()
      else next()
    }
  }

  const currentImg = imgList[currentIndex]

  return ReactDom.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 200ms ease-in-out',
      }}
      onClick={close}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        className="absolute top-4 right-4 z-51 p-2 text-2xl font-thin text-white/60 transition-opacity hover:text-white/90"
        onClick={close}
      >
        &times;
      </button>

      <img
        src={`${import.meta.env.BASE_URL}${currentImg.src}`}
        alt=""
        className="max-h-screen max-w-screen object-contain"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
    </div>,
    document.getElementById('portal'),
  )
}
