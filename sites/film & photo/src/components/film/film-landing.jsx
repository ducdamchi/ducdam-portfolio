import { useState, useRef, useEffect } from 'react'
import { useParams, useSearch, Link } from '@tanstack/react-router'
import '../../app.css'
import './film.css'
import Modal from './film-modal'
import { GalleryModal as Gallery_Modal } from '@ducdam/shared'
import { filmConfig } from '../gallery/configs'
import filmsData from '../../data/film.json'
import { useWindowSize, useDominantColor, adjustColor, SkeletonImage } from '@ducdam/shared'
import {
  BiLeftArrowAlt,
  BiLogoGmail,
  BiLogoInstagramAlt,
  BiPlay,
  BiNews,
} from 'react-icons/bi'

export default function Landing() {
  const [openModalId, setOpenModalId] = useState(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [openPressId, setOpenPressId] = useState(null)
  const [pressOpened, setPressOpened] = useState(false)
  const { filmURL } = useParams({ strict: false })
  const playBtnRef = useRef(null)
  const imgRef = useRef(null)

  const { width: screenWidth, height: screenHeight } = useWindowSize()
  const isMobileMode = screenWidth <= 820 || screenHeight <= 768

  const matchedFilm = filmsData.find((film) => film.url === filmURL)

  const colorData = useDominantColor(imgRef, {
    deps: [matchedFilm?.id, modalOpened, pressOpened],
    enabled: !!matchedFilm && !modalOpened && !pressOpened,
  })
  const backdropColor = colorData
    ? adjustColor(colorData.color, colorData.brightness)
    : ''

  const { from: currentIndex } = useSearch({ strict: false })

  if (!matchedFilm) {
    return <div>Page not found</div>
  }

  return (
    <div>
      <div>
        <div className="film-landing-whole relative top-0 left-0 h-screen w-screen overflow-hidden">
          <img
            ref={imgRef}
            className="film-landing-background hidden"
            src={`${import.meta.env.BASE_URL}${matchedFilm.thumbnail.src}`}
            id={`thumbnail-film-${matchedFilm.id}`}
            alt=""
          />
          {(!matchedFilm?.previewLanding || isMobileMode) && (
            <SkeletonImage
              className="film-landing-background"
              src={`${import.meta.env.BASE_URL}${matchedFilm.thumbnail.src}`}
              id={`thumbnail-film-${matchedFilm.id}`}
              alt=""
            />
          )}
          {matchedFilm?.previewLanding && !isMobileMode && (
            <div>
              <video
                className="film-landing-background"
                src={`${import.meta.env.BASE_URL}${matchedFilm.previewLanding}`}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
              ></video>
            </div>
          )}
          <div className="film-landing-overlay"></div>

          <div className="film-landing-backArrow-wrapper-2 z-20 flex justify-center">
            <div className="film-landing-backArrow-wrapper-1 z-20 flex p-6">
              <div
                className="film-landing-backArrow z-20"
                id="film-landing-backArrow"
              >
                <Link
                  to="/film"
                  className="z-20 flex items-center gap-1 font-bold"
                  search={{ returnTo: currentIndex }}
                >
                  <BiLeftArrowAlt className="text-xl" />
                  <div className="text-lg">BACK</div>
                </Link>
              </div>
            </div>
          </div>

          {matchedFilm?.logo && (
            <div className="flex w-full justify-end">
              <div className="film-landing-logo-wrapper max absolute top-[7.5%] right-[5%] right-[10%] z-2 flex w-[10%] max-w-[15rem] min-w-[10rem] justify-end md:top-[15%] md:right-[15%]">
                <div className="film-landing-logo">
                  <img src={`${import.meta.env.BASE_URL}${matchedFilm.logo}`} alt="" />
                </div>
              </div>
            </div>
          )}

          <div className="film-landing-viewButton-wrapper flex justify-center">
            <div
              ref={playBtnRef}
              className="film-landing-viewButton flex items-center justify-center gap-1 rounded-full bg-white p-2 font-bold text-[var(--backdropColor)] drop-shadow-xl transition-all duration-300 ease-out hover:bg-[var(--backdropColor)] hover:text-white"
              style={{
                '--backdropColor': `${backdropColor}`,
              }}
              onClick={() => {
                if (matchedFilm.youtube !== '') {
                  setOpenModalId(matchedFilm.id)
                  setModalOpened(true)
                }
              }}
            >
              <BiPlay className="film-landing-viewButton-icon pl-1 text-4xl" />
              {/* <div className="text-lg">TRAILER</div> */}
            </div>
          </div>

          <div className="film-landing-info-wrapper flex justify-center">
            <div className="film-landing-info-all flex items-start gap-8 p-6">
              <div className="film-landing-info">
                <div className="film-landing-info-title">
                  {matchedFilm.title}
                </div>
                <div className="film-landing-director">{`Directed by ${matchedFilm.director}`}</div>
                <div className="flex gap-1">
                  <div className="film-landing-country flex items-center justify-center gap-1">
                    {`${matchedFilm.year} | ${matchedFilm.country} | ${matchedFilm.runtime} mins`}
                  </div>
                  {/* <div className="film-landing-country flex items-center justify-center gap-1">
                    <span className="">{matchedFilm.year} | </span>
                    <span className="">{matchedFilm.country} |</span>
                    <span className="flex items-center gap-1">
                      <BiTimeFive />
                      {`${matchedFilm.runtime} mins`}
                    </span>
                  </div> */}
                  {/* <div className="film-landing-runtime mb-5 flex items-center gap-1"></div> */}
                </div>
              </div>
              {!isMobileMode && (
                <div className="film-landing-synopsis-press">
                  <div className="film-landing-synopsis">
                    <div className="font-bold">SYNOPSIS</div>
                    <div>{matchedFilm.synopsis}</div>
                  </div>
                </div>
              )}
              {!isMobileMode && (
                <div className="film-landing-third-column">
                  <div className="film-landing-availability">
                    <div className="font-bold">AVAILABILITY</div>
                    <div>{matchedFilm.availability}</div>
                  </div>
                  {matchedFilm?.pressGallery && (
                    <div
                      className="film-landing-press ml-1 flex items-center gap-1 rounded-none border-1 bg-transparent p-2 text-white transition-all duration-300 ease-out hover:bg-white hover:text-[var(--backdropColor)]"
                      style={{
                        '--backdropColor': `${backdropColor}`,
                      }}
                      onClick={() => {
                        setOpenPressId(matchedFilm.id)
                        setPressOpened(true)
                      }}
                    >
                      <div>
                        <BiNews />
                      </div>
                      <div className="font-bold">PRESS GALLERY</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {!isMobileMode && (
            <div className="film-landing-footer absolute bottom-0 z-100 flex w-[100%] items-center justify-between p-3">
              <div className="">
                <div className="flex items-center gap-1 text-[0.6rem] font-thin">
                  <span className="footer-text text-white">
                    ALL IMAGES &#169; DUC DAM 2025
                  </span>
                </div>
              </div>
              <div className="flex gap-2 text-center text-white">
                <div className="flex items-center text-2xl">
                  <a
                    href={`mailto:ducdamchi@gmail.com?
                              &subject=Just visited your website`}
                  >
                    <BiLogoGmail />
                  </a>
                </div>
                <div className="text-2xl">
                  <a href="https://www.instagram.com/ducdamchi" target="_blank">
                    <BiLogoInstagramAlt />
                  </a>
                </div>
                {/* <div className="text-2xl">
                  <a href="https://github.com/ducdamchi" target="_blank">
                    <BiLogoGithub />
                  </a>
                </div> */}
              </div>
            </div>
          )}
        </div>

        {/* MOBILE MODE */}
        {isMobileMode && !modalOpened && !pressOpened && (
          <div className="relative">
            <div className="film-landing-mobileBottom relative bg-zinc-50">
              <div className="film-landing-mobile-info flex flex-col justify-center gap-2 p-6">
                <div className="font-bold">
                  SYNOPSIS
                  <br />
                </div>
                <div>{matchedFilm.synopsis}</div>
                <div className="film-landing-availability-mobile mt-3">
                  <div className="font-bold">AVAILABILITY</div>
                  <div>{matchedFilm.availability}</div>
                </div>
                {matchedFilm?.pressGallery && (
                  <div className="film-landing-press-mobile mt-3">
                    <div className="flex max-w-[10rem] min-w-[8rem] items-center gap-1 rounded-none border-1 p-1 pl-2.5">
                      <div>
                        <BiNews />
                      </div>
                      <div
                        className=""
                        onClick={() => {
                          setOpenPressId(matchedFilm.id)
                          setPressOpened(true)
                        }}
                      >
                        PRESS GALLERY
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="film-landing-mobileFooter relative bottom-0 z-100 flex w-[100%] items-center justify-between p-3">
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
                  <a href="https://www.instagram.com/ducdamchi" target="_blank">
                    <BiLogoInstagramAlt />
                  </a>
                </div>
                {/* <div className="text-2xl">
                  <a href="https://github.com/ducdamchi" target="_blank">
                    <BiLogoGithub />
                  </a>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Viewer, hidden until thumbnail is clicked on, 
    then rendered on portal different from root */}
      {matchedFilm.id === openModalId && (
        <Modal
          film={matchedFilm}
          openModalId={openModalId}
          closeModal={() => {
            setOpenModalId(null)
            setModalOpened(false)
            // console.log('closing modal')
          }}
        />
      )}

      {matchedFilm.id === openPressId && (
        <Gallery_Modal
          config={filmConfig}
          album={{
            ...matchedFilm,
            title: matchedFilm.pressGallery.title,
            imgList: matchedFilm.pressGallery.imgList,
            numImages: matchedFilm.pressGallery.numImages,
          }}
          openModalId={openPressId}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          isMobileMode={isMobileMode}
          closeModal={() => {
            setOpenPressId(null)
            setPressOpened(false)
          }}
        />
      )}
    </div>
  )
}
