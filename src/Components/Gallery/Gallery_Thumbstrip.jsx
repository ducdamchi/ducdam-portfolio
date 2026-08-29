import { useRef, useEffect, useState, useCallback } from 'react'

export default function Gallery_Thumbstrip({ imgList, currentIndex, onSelect }) {
  const containerRef = useRef(null)
  const thumbRefs = useRef([])
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })

  const scrollToActive = useCallback(() => {
    const container = containerRef.current
    const activeThumb = thumbRefs.current[currentIndex]
    if (!container || !activeThumb) return

    const containerRect = container.getBoundingClientRect()
    const thumbRect = activeThumb.getBoundingClientRect()
    const offset =
      thumbRect.left -
      containerRect.left -
      containerRect.width / 2 +
      thumbRect.width / 2

    container.scrollBy({ left: offset, behavior: 'smooth' })
  }, [currentIndex])

  useEffect(() => {
    scrollToActive()
  }, [scrollToActive])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    dragStart.current = {
      x: e.clientX,
      scrollLeft: containerRef.current.scrollLeft,
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const dx = e.clientX - dragStart.current.x
    containerRef.current.scrollLeft = dragStart.current.scrollLeft - dx
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e) => {
    dragStart.current = {
      x: e.touches[0].clientX,
      scrollLeft: containerRef.current.scrollLeft,
    }
  }

  const handleTouchMove = (e) => {
    const dx = e.touches[0].clientX - dragStart.current.x
    containerRef.current.scrollLeft = dragStart.current.scrollLeft - dx
  }

  return (
    <div className="flex w-full justify-center px-4">
      <div
        ref={containerRef}
        className="thumbstrip-container flex max-w-[1600px] items-end gap-1 overflow-x-auto pb-2"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {imgList.map((img, i) => (
          <button
            key={img.id}
            ref={(el) => (thumbRefs.current[i] = el)}
            className="flex-none transition-opacity duration-200 ease-in-out"
            style={{
              opacity: i === currentIndex ? 1 : 0.4,
            }}
            onClick={(e) => {
              e.stopPropagation()
              if (!isDragging) onSelect(i)
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}${img.src}`}
              alt=""
              className="h-[36px] w-auto object-contain sm:h-[42px] md:h-[48px] lg:h-[54px] xl:h-[60px]"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
