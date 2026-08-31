import { useState, useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import Gallery_Skeleton from './gallery-skeleton'
import { useDominantColor, adjustColor } from '../../hooks/useDominantColor'

export default function Gallery_Card({
  album,
  config,
  cardWidth,
  currentIndex,
  isClone,
  isMobile = false,
}) {
  const [thumbnailState, setThumbnailState] = useState('image')
  const [isHovering, setIsHovering] = useState(false)
  const [titleSize, setTitleSize] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const imgRef = useRef(null)
  const titleRef = useRef(null)

  const titleClass = `font-[1000] leading-[0.9] text-left ${config.titleTransform === 'uppercase' ? 'uppercase' : ''}`

  const colorData = useDominantColor(imgRef, {
    deps: [isClone, album.id],
    enabled: !isClone,
  })
  const dynamicColor = colorData
    ? adjustColor(colorData.color, colorData.brightness)
    : '#6d6d6d'

  // Video preview delay
  useEffect(() => {
    if (!album.preview) return
    let timer1, timer2
    if (isHovering) {
      timer1 = setTimeout(() => setThumbnailState('transition'), 2000)
      timer2 = setTimeout(() => setThumbnailState('video'), 2000)
    } else {
      setThumbnailState('image')
    }
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [isHovering, album.preview])

  // Responsive title sizing
  useEffect(() => {
    const target = titleRef.current
    if (!target) return
    const observer = new ResizeObserver((entries) => {
      setTitleSize(entries[0].contentRect.width)
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`group/card relative transition-all duration-200 hover:z-[200] ${isMobile ? '' : 'hover:scale-105 hover:shadow-lg'}`}
      style={{ width: cardWidth }}
      onMouseEnter={() => !isClone && !isMobile && setIsHovering(true)}
      onMouseLeave={() => !isClone && !isMobile && setIsHovering(false)}
    >
      {/* Image + gradient + title */}
      <div className="relative aspect-3/2 w-full overflow-hidden">
        {!isClone && (
          <Link
            to={`/${config.sectionName}/$${config.urlParam}`}
            params={{ [config.urlParam]: album.url }}
            search={{ from: currentIndex }}
            className="absolute inset-0 z-20"
          />
        )}

        {!imageLoaded && <Gallery_Skeleton cardWidth={cardWidth} />}

        <div className={`relative h-full w-full ${!imageLoaded ? 'invisible' : ''}`}>
          <img
            ref={imgRef}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
            src={`${import.meta.env.BASE_URL}${config.cardImage ? config.cardImage(album) : album.thumbnail.src}`}
            alt={album.title}
            onLoad={() => setImageLoaded(true)}
            style={
              album.preview
                ? {
                    filter:
                      thumbnailState === 'transition' && isHovering
                        ? 'brightness(0)'
                        : 'brightness(1)',
                    opacity:
                      thumbnailState === 'video' && isHovering ? '0' : '1',
                    transition: 'filter 200ms ease-in-out, opacity 200ms ease-in-out',
                  }
                : undefined
            }
          />
          {album.preview &&
            thumbnailState === 'video' &&
            isHovering && (
              <video
                src={album.preview}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                className="absolute top-0 left-0 z-10 h-full w-full object-cover"
                onEnded={() => setThumbnailState('image')}
              />
            )}
        </div>

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Title + year */}
        <div
          ref={titleRef}
          className="gallery-card-title absolute bottom-0 left-0 z-10 flex w-4/5 flex-col justify-end"
          style={{ padding: `${Math.max(titleSize * 0.07, 12)}px` }}
        >
          <div
            className={titleClass}
            style={{ fontSize: `${titleSize * 0.055}px`, color: 'rgb(250, 250, 250)' }}
          >
            {album.title}
            <br />
            <span
              className="font-light normal-case"
              style={{ fontSize: `${titleSize * 0.045}px` }}
            >
              {config.cardSubtitle ? config.cardSubtitle(album) : album.year}
            </span>
          </div>
        </div>
      </div>

      {/* Info overlay — in-flow on mobile, absolute + hover on desktop */}
      {!isClone && (
        <div
          className={
            isMobile
              ? ''
              : 'pointer-events-none absolute top-full right-0 left-0 z-50 opacity-0 transition-opacity duration-200 group-hover/card:pointer-events-auto group-hover/card:opacity-100'
          }
          style={{ backgroundColor: dynamicColor }}
        >
          <div className="gallery-card-description text-sm font-thin text-zinc-50" style={{ padding: `${Math.max(titleSize * 0.07, 12)}px` }}>
            {`${album.description[0].substring(0, 300)} [...]`}
          </div>
        </div>
      )}
    </div>
  )
}
