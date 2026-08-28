import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../../App.css'
import './Gallery.css'

export default function Gallery_Items({
  config,
  albumsData,
  carouselIndex,
  setCarouselIndex,
  slidesOffset,
  setSlidesOffset,
  isEdgeTransition,
  albumsPerSlide,
  carouselBtnLeft,
  carouselBtnRight,
  screenWidth,
}) {
  const [hoverId, setHoverId] = useState(null)
  const [titleSize, setTitleSize] = useState([])
  const thumbnails = useRef(null)
  const titleRef = useRef(null)
  const location = useLocation()
  const [isHovering, setIsHovering] = useState(false)
  const [thumbnailState, setThumbnailState] = useState('image')

  const filteredData = config.filterFn
    ? albumsData.filter(config.filterFn)
    : albumsData

  const titleClass = `thumbnail-title ${config.titleTransform === 'uppercase' ? 'uppercase' : ''}`

  const THUMBNAIL_FLEX_CONTAINER = {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    top: '0%',
    width: 'calc(100% - 2 * var(--slider-padding))',
    transform: `translateX(calc((${carouselIndex} + ${slidesOffset}) * -100%))`,
    transition: isEdgeTransition ? 'none' : 'transform 750ms ease-in-out',
  }

  const THUMBNAIL_FLEX_ITEM = {
    width: `${100 / albumsPerSlide}%`,
  }

  function handleThumbnailInteraction(albumId, isMouseEnter) {
    if (isMouseEnter) {
      setHoverId(albumId)
      setIsHovering(true)
      carouselBtnLeft.current.style.opacity = '0'
      carouselBtnRight.current.style.opacity = '0'
    } else {
      setHoverId(null)
      setIsHovering(false)
      carouselBtnLeft.current.style.opacity = '1'
      carouselBtnRight.current.style.opacity = '1'
    }
  }

  useEffect(() => {
    if (hoverId != null) {
      const img = document.getElementById(`thumbnail-img-${hoverId}`)
      const thumbnail_description = document.getElementById(
        `thumbnail-description-${hoverId}`,
      )
      const colorThief = new ColorThief()
      let domColor
      let brightness

      try {
        domColor = colorThief.getColor(img)
        brightness = Math.round(
          Math.sqrt(
            domColor[0] * domColor[0] * 0.241 +
              domColor[1] * domColor[1] * 0.691 +
              domColor[2] * domColor[2] * 0.068,
          ),
        )
        if (brightness < 130) {
          thumbnail_description.style.backgroundColor = `rgba(${domColor[0]}, ${domColor[1]}, ${domColor[2]}, 0.85)`
        } else if (brightness >= 130 && brightness < 194) {
          thumbnail_description.style.backgroundColor = `rgba(${domColor[0] * 0.66}, ${domColor[1] * 0.66}, ${domColor[2] * 0.66}, 0.85)`
        } else {
          thumbnail_description.style.backgroundColor = `rgba(${domColor[0] * 0.33}, ${domColor[1] * 0.33}, ${domColor[2] * 0.33}, 0.85)`
        }
      } catch (err) {
        console.log(err)
      }
    }
  }, [hoverId])

  useEffect(() => {
    let timer1, timer2
    if (isHovering) {
      timer1 = setTimeout(() => {
        setThumbnailState('transition')
      }, 2000)
      timer2 = setTimeout(() => {
        setThumbnailState('video')
      }, 2000)
    } else {
      setThumbnailState('image')
    }

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [isHovering])

  useEffect(() => {
    const target = titleRef.current
    if (!target) return

    const resizeObserver = new ResizeObserver((entries) => {
      const titleElement = entries[0]
      const titleWidth = titleElement.contentRect.width
      setTitleSize(titleWidth)
    })

    resizeObserver.observe(target)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    const { returnToIndex, returnToOffset } = location.state || {}

    if (returnToIndex !== undefined && thumbnails.current) {
      thumbnails.current.style.transition = 'none'
      setCarouselIndex(returnToIndex)
      setSlidesOffset(returnToOffset)
      setTimeout(() => {
        thumbnails.current.style.transition = isEdgeTransition
          ? 'none'
          : 'transform 750ms ease-in-out'
      }, 100)
    }
  }, [location.state])

  return (
    <div ref={thumbnails} style={THUMBNAIL_FLEX_CONTAINER}>
      {/* Clones on left side */}
      {filteredData.slice(-albumsPerSlide).map((album) => (
        <div
          key={`cloneLeft-${album.id}`}
          className="thumbnail-flex-item"
          style={THUMBNAIL_FLEX_ITEM}
        >
          <div className="thumbnail-box">
            <div className="thumbnail-info-container-clone relative">
              <div>
                <img
                  className="thumbnail-img-clone"
                  src={`${import.meta.env.BASE_URL}${album.thumbnail.src}`}
                />
                <div className="thumbnail-img-overlay"></div>
              </div>

              <div className="thumbnail-title-year">
                <div
                  className={titleClass}
                  style={{ fontSize: `${titleSize * 0.055}px` }}
                >
                  {album.title} <br />
                  <span
                    className="thumbnail-year"
                    style={{ fontSize: `${titleSize * 0.035}px` }}
                  >
                    {album.year}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Real slides */}
      {filteredData.map((album) => (
        <div
          className="thumbnail-flex-item"
          key={album.id}
          style={THUMBNAIL_FLEX_ITEM}
        >
          <div
            className="thumbnail-box"
            onMouseEnter={() => handleThumbnailInteraction(album.id, true)}
            onMouseLeave={() => handleThumbnailInteraction(album.id, false)}
          >
            <div className="thumbnail-info-container relative">
              <Link
                to={`../${config.sectionName}/${album.url}`}
                state={{
                  currentIndex: carouselIndex,
                  currentOffset: slidesOffset,
                }}
                className="absolute top-0 left-0 z-20 h-full w-full"
              />

              <div className="relative h-full w-full">
                <img
                  className="thumbnail-img relative top-0 object-contain"
                  id={`thumbnail-img-${album.id}`}
                  src={`${import.meta.env.BASE_URL}${album.thumbnail.src}`}
                  style={
                    album.preview
                      ? {
                          filter:
                            thumbnailState === 'transition' &&
                            hoverId === album.id
                              ? 'brightness(0)'
                              : 'brightness(1)',
                          opacity:
                            thumbnailState === 'video' && hoverId === album.id
                              ? '0'
                              : '1',
                          transition: 'filter opacity 200ms ease-in-out',
                        }
                      : undefined
                  }
                />
                {album.preview &&
                  thumbnailState === 'video' &&
                  hoverId === album.id && (
                    <video
                      src={album.preview}
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      className="absolute top-0 z-10 h-full object-contain transition-opacity duration-200 ease-in-out"
                      onEnded={() => {
                        setThumbnailState('image')
                      }}
                    ></video>
                  )}
                <div className="thumbnail-img-overlay relative z-10"></div>
              </div>

              <div
                ref={album.id === filteredData[0]?.id ? titleRef : null}
                className="thumbnail-title-year relative z-10"
              >
                <div
                  className={titleClass}
                  style={{ fontSize: `${titleSize * 0.055}px` }}
                >
                  {album.title} <br />
                  <span
                    className="thumbnail-year"
                    style={{ fontSize: `${titleSize * 0.045}px` }}
                  >
                    {album.year}
                  </span>
                </div>
              </div>
            </div>

            {album.id === hoverId && (
              <div
                id={`thumbnail-description-${album.id}`}
                className="thumbnail-description mb-30 text-lg font-thin"
              >
                {`${album.description[0].substring(0, 250)} [...]`}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Clones on right side */}
      {filteredData.slice(0, albumsPerSlide).map((album) => (
        <div
          key={`cloneRight-${album.id}`}
          className="thumbnail-flex-item"
          style={THUMBNAIL_FLEX_ITEM}
        >
          <div className="thumbnail-box">
            <div className="thumbnail-info-container-clone relative">
              <div>
                <img
                  className="thumbnail-img-clone"
                  src={`${import.meta.env.BASE_URL}${album.thumbnail.src}`}
                />
                <div className="thumbnail-img-overlay"></div>
              </div>

              <div className="thumbnail-title-year">
                <div
                  className={titleClass}
                  style={{ fontSize: `${titleSize * 0.055}px` }}
                >
                  {album.title} <br />
                  <span
                    className="thumbnail-year"
                    style={{ fontSize: `${titleSize * 0.045}px` }}
                  >
                    {album.year}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
