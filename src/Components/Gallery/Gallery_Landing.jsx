import { useState, useRef, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import '../../App.css'
import './Gallery.css'
import Gallery_Modal from './Gallery_Modal'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useDominantColor, adjustColor } from '../../hooks/useDominantColor'

import {
  BiLogoGmail,
  BiLogoInstagramAlt,
  BiFolderOpen,
  BiLeftArrowAlt,
} from 'react-icons/bi'

export default function Gallery_Landing({ config }) {
  const albumsData = config.data
  const [openModalId, setOpenModalId] = useState(null)
  const { width: screenWidth, height: screenHeight } = useWindowSize()
  const isMobileMode = screenWidth < 768 || screenHeight < 768
  const [modalOpened, setModalOpened] = useState(false)
  const [boxHeight, setBoxHeight] = useState(0)
  const landingRef = useRef(null)
  const imgRef = useRef(null)
  const infoBoxRef = useRef(null)

  const location = useLocation()
  const params = useParams()
  const urlValue = params[config.urlParam]
  const matchedAlbum = albumsData.find((album) => album.url === urlValue)

  const { currentIndex } = location.state || {}

  const colorData = useDominantColor(imgRef, {
    deps: [matchedAlbum?.id, modalOpened, isMobileMode],
    enabled: !!matchedAlbum && !modalOpened,
  })
  const accentColor = colorData
    ? adjustColor(colorData.color, colorData.brightness)
    : null

  const measureBoxHeight = () => {
    if (infoBoxRef.current) {
      const rect = infoBoxRef.current.getBoundingClientRect()
      setBoxHeight(rect.height)
    }
  }

  useEffect(() => {
    measureBoxHeight()
  }, [])

  useEffect(() => {
    if (
      !isMobileMode &&
      landingRef.current &&
      infoBoxRef.current &&
      boxHeight
    ) {
      const h = boxHeight * 1.333
      if (boxHeight < screenHeight) {
        const s = 100 - (boxHeight / screenHeight) * 100
        if (s < 25) {
          landingRef.current.style.height = `${h}px`
          infoBoxRef.current.style.top = `12.5%`
        } else {
          landingRef.current.style.height = `${screenHeight}px`
          infoBoxRef.current.style.top = `${s / 2}%`
        }
      } else {
        landingRef.current.style.height = `${h}px`
        infoBoxRef.current.style.top = `12.5%`
      }
    } else {
      if (landingRef.current) {
        landingRef.current.style.height = `100vh`
      }
    }
  }, [boxHeight, screenHeight, screenWidth, modalOpened, isMobileMode])

  const titleClass =
    config.titleTransform === 'uppercase' ? 'uppercase' : ''

  const renderMetaFields = (classPrefix) =>
    config.metaFields.map((field, i) => {
      const isLast = i === config.metaFields.length - 1
      return (
        <div
          key={field.key}
          className={`${classPrefix} flex items-center gap-1 ${isLast ? 'mb-8' : ''}`}
        >
          {field.Icon && <field.Icon />}
          {field.format
            ? field.format(matchedAlbum[field.key])
            : `${matchedAlbum[field.key]}`}
        </div>
      )
    })

  if (!matchedAlbum) {
    return <div>Page not found</div>
  }

  return (
    <div>
      <div>
        <div
          className="photo-landing-whole relative top-0 left-0 h-[100vh]"
          ref={landingRef}
        >
          <img
            ref={imgRef}
            className="photo-landing-background"
            src={`${import.meta.env.BASE_URL}${matchedAlbum.thumbnail.src}`}
            id={`photo-landing-bg-${matchedAlbum.id}`}
            alt=""
          />
          <div className="photo-landing-overlay"></div>

          {/* MOBILE MODE */}
          {isMobileMode && !modalOpened && (
            <>
              <div className="photo-landing-backArrow-wrapper-2 flex justify-center">
                <div className="photo-landing-backArrow-wrapper-1 flex p-6">
                  <div className="photo-landing-backArrow z-10">
                    <Link
                      to={`/${config.sectionName}`}
                      state={{
                        returnToIndex: currentIndex,
                      }}
                      className="flex items-center gap-1 text-base"
                    >
                      <BiLeftArrowAlt className="text-xl" />
                      BACK
                    </Link>
                  </div>
                </div>
              </div>

              <div className="photo-landing-viewButton-wrapper flex justify-center">
                <div
                  className="photo-landing-viewButton flex cursor-pointer items-center justify-center gap-1 rounded-none border-1 bg-white p-3 pt-2 pb-2 text-base font-bold uppercase"
                  style={accentColor ? { color: accentColor } : undefined}
                  onClick={() => {
                    setOpenModalId(matchedAlbum.id)
                    setModalOpened(true)
                  }}
                >
                  <BiFolderOpen className="text-2xl" />
                  open
                </div>
              </div>

              <div>
                <div className="photo-landing-mobile-title-year flex flex-col p-6">
                  <div className={`photo-landing-mobile-title ${titleClass}`}>
                    {matchedAlbum.title}
                  </div>
                  <div className="photo-landing-mobile-year">
                    {matchedAlbum.year}
                  </div>
                  {renderMetaFields('photo-landing-mobile-time')}
                </div>
              </div>
            </>
          )}

          {/* DESKTOP MODE */}
          {!isMobileMode && !modalOpened && (
            <>
              <div className="photo-landing-info-wrapper flex justify-center">
                <div
                  className="photo-landing-info-all flex flex-col rounded-none border-0"
                  id={`photo-landing-info-all-${matchedAlbum.id}`}
                  ref={infoBoxRef}
                >
                  <div
                    className="photo-landing-header rounded-t-none p-3 pl-6"
                    style={accentColor ? { backgroundColor: accentColor } : undefined}
                  >
                    <div className="photo-landing-button-back z-2 flex w-[15%] items-center justify-start text-white">
                      <Link
                        to={`/${config.sectionName}`}
                        state={{
                          returnToIndex: currentIndex,
                        }}
                        className="z-10 flex items-center justify-center"
                      >
                        <BiLeftArrowAlt className="text-xl" />
                        <div className="text-base">BACK</div>
                      </Link>
                    </div>
                  </div>
                  <div className="photo-landing-info flex flex-col p-6">
                    <div
                      className={`photo-landing-info-title ${titleClass}`}
                    >
                      {matchedAlbum.title}
                    </div>
                    <div className="photo-landing-info-year">
                      {matchedAlbum.year}
                    </div>
                    {renderMetaFields('photo-landing-info-time')}

                    <div className="photo-landing-info-description mb-20">
                      {matchedAlbum.description.map((paragraph, index) => (
                        <p key={index} className="mb-2">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="photo-landing-buttons absolute bottom-0 mb-5 flex w-full justify-center p-6">
                    <div
                      className="photo-landing-button-view z-10 flex cursor-pointer items-center justify-center gap-1 rounded-none p-3 font-bold text-zinc-50"
                      style={accentColor ? { backgroundColor: accentColor } : undefined}
                      onClick={() => {
                        setOpenModalId(matchedAlbum.id)
                        setModalOpened(true)
                      }}
                    >
                      <BiFolderOpen className="text-xl" />
                      <div className="text-base uppercase">open</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="photo-landing-footer absolute bottom-0 z-100 flex w-[100%] items-center justify-between p-3">
                <div className="">
                  <div className="flex items-center gap-1 text-[0.6rem] font-thin">
                    <span className="footer-text text-white">
                      ALL IMAGES &#169; DUC DAM 2025
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 text-center text-white"></div>
              </div>
            </>
          )}
        </div>

        {isMobileMode && !modalOpened && (
          <div className="relative">
            <div className="photo-landing-mobileBottom relative bg-zinc-50">
              <div className="photo-landing-mobile-info flex flex-col justify-center gap-2 p-6">
                <div className="font-bold">
                  INTRODUCTION
                  <br />
                </div>
                <div>
                  {matchedAlbum.description.map((paragraph, index) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="landing-mobileFooter relative bottom-0 z-100 flex w-[100%] items-center justify-between p-3">
              <div className="">
                <div className="flex items-center gap-1 text-[0.6rem] font-thin">
                  <span className="footer-text text-black">
                    ALL IMAGES &#169; DUC DAM 2025
                  </span>
                </div>
              </div>
              <div className="flex gap-2 text-center text-black">
                <div className="flex items-center text-2xl">
                  <a
                    href={`mailto:ducdamchi@gmail.com?
                    &subject=Just visited your website`}
                  >
                    <BiLogoGmail />
                  </a>
                </div>
                <div className="text-2xl">
                  <a
                    href="https://www.instagram.com/ducdamchi"
                    target="_blank"
                  >
                    <BiLogoInstagramAlt />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {matchedAlbum.id === openModalId && (
        <Gallery_Modal
          config={config}
          album={matchedAlbum}
          openModalId={openModalId}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          isMobileMode={isMobileMode}
          closeModal={() => {
            setOpenModalId(null)
            setModalOpened(false)
          }}
        />
      )}
    </div>
  )
}
