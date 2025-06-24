import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../../App.css'
import './Film.css'
import Modal from './Film_Modal'
import filmsData from './films.json'
import { BiLogoGmail } from 'react-icons/bi'
import { BiLogoInstagramAlt } from 'react-icons/bi'
import { BiLogoGithub } from 'react-icons/bi'
import { BiArrowBack } from 'react-icons/bi'
import { BiPlay } from 'react-icons/bi'

export default function Landing() {
  const [openModalId, setOpenModalId] = useState(null)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [isMobileMode, setIsMobileMode] = useState(false)
  const [modalOpened, setModalOpened] = useState(false)

  const { filmURL } = useParams()

  const matchedFilm = filmsData.find((film) => film.url === filmURL)

  /* Dynamically obtain window size */
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  /* Flag mobile mode if screenwidth smaller than 768px */
  useEffect(() => {
    screenWidth < 768 ? setIsMobileMode(true) : setIsMobileMode(false)
    console.log(`Mobile mode: ${isMobileMode}`)
  }, [screenWidth])

  if (!matchedFilm) {
    return <div>Page not found</div>
  }

  return (
    <div>
      <div>
        <div className="landing-whole relative top-0 left-0 h-screen w-screen overflow-hidden border-2 border-blue-500">
          <img
            className="landing-background"
            src={`/${matchedFilm.thumbnail}`}
            id={`thumbnail-film-${matchedFilm.id}`}
            alt=""
          />

          <div className="landing-backArrow-wrapper-2 flex justify-center">
            <div className="landing-backArrow-wrapper-1 flex">
              <div
                className="landing-backArrow md:3xl text-xl"
                id="landing-backArrow"
              >
                <Link to={`../film`} className="landing-backArrow-link" />
                <BiArrowBack />
              </div>
            </div>
          </div>

          <div className="landing-viewButton-wrapper flex justify-center">
            <div
              className="landing-viewButton md:5xl text-3xl"
              onClick={() => {
                setOpenModalId(matchedFilm.id)
                setModalOpened(true)
              }}
            >
              <BiPlay />
            </div>
          </div>

          <div className="landing-info-wrapper flex justify-center">
            <div className="landing-info-all">
              <div className="landing-info">
                <div className="landing-info-title">{matchedFilm.title}</div>
                <div className="landing-info-year">{matchedFilm.year}</div>
                {!isMobileMode && (
                  <div className="landing-info-description">
                    {matchedFilm.synopsis}
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isMobileMode && (
            <div className="landing-footer absolute bottom-0 z-100 flex w-[100%] items-center justify-between border-2 border-yellow-500 p-3">
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
                {/* <div className='landing-footer-facebook'>Facebook</div> */}
                <div className="text-2xl">
                  <a href="https://github.com/ducdamchi" target="_blank">
                    <BiLogoGithub />
                  </a>
                </div>
              </div>

              <div className="">
                <div className="flex items-center gap-1 text-[0.6rem] font-thin">
                  <span className="footer-text text-white">
                    ALL IMAGES &#169; DUC DAM 2025
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {isMobileMode && !modalOpened && (
          <div className="relative">
            <div className="landing-mobileBottom relative bg-zinc-50">
              <div className="landing-info-mobile flex flex-col justify-center gap-2 p-6">
                <div>
                  SYNOPSIS
                  <br />
                </div>
                <div>{matchedFilm.synopsis}</div>
              </div>
            </div>

            <div className="landing-mobileFooter relative bottom-0 z-100 flex w-[100%] items-center justify-between p-3">
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
                {/* <div className='landing-footer-facebook'>Facebook</div> */}
                <div className="text-2xl">
                  <a href="https://github.com/ducdamchi" target="_blank">
                    <BiLogoGithub />
                  </a>
                </div>
              </div>

              <div className="">
                <div className="flex items-center gap-1 text-[0.6rem] font-thin">
                  <span className="footer-text text-black">
                    ALL IMAGES &#169; DUC DAM 2025
                  </span>
                </div>
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
    </div>
  )
}
