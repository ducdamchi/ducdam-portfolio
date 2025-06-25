import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../../App.css'
import './Photography.css'
import Modal from './Photo_Modal'
import Footer from '../Footer'
import albumsData from './albums.json'
import { HiArrowLeft } from 'react-icons/hi2'
import { BiLogoGmail } from 'react-icons/bi'
import { BiLogoInstagramAlt } from 'react-icons/bi'
import { BiLogoGithub } from 'react-icons/bi'
import { BiCopyright } from 'react-icons/bi'
import { BiFolderOpen } from 'react-icons/bi'
import { BiArrowBack } from 'react-icons/bi'

export default function Landing() {
  const [openModalId, setOpenModalId] = useState(null)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [screenHeight, setScreenHeight] = useState(window.innerHeight)
  const [isMobileMode, setIsMobileMode] = useState(false)
  const [modalOpened, setModalOpened] = useState(false)

  const { photoURL } = useParams()

  const matchedAlbum = albumsData.find((album) => album.url === photoURL)

  /* Dynamically obtain window size */
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
      setScreenHeight(window.innerHeight)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  /* Flag mobile mode if screenwidth smaller than 768px */
  useEffect(() => {
    screenWidth < 768 || screenHeight < 768
      ? setIsMobileMode(true)
      : setIsMobileMode(false)
    // console.log(`Mobile mode: ${isMobileMode}`)
  }, [screenWidth])

  if (!matchedAlbum) {
    return <div>Page not found</div>
  }

  return (
    <div>
      <div>
        <div className="landing-whole relative top-0 left-0 h-screen w-screen">
          <img
            className="landing-background"
            src={`/${matchedAlbum.thumbnail.src}`}
            id={`thumbnail-img-${matchedAlbum.id}`}
            alt=""
          />

          <div className="landing-backArrow-wrapper-2 flex justify-center">
            <div className="landing-backArrow-wrapper-1 flex">
              <div className="landing-backArrow md:3xl text-xl">
                <Link
                  to={`../photography`}
                  className="landing-backArrow-link"
                />

                <BiArrowBack
                // stroke="rgba(31, 38, 135, 0.7)"
                // strokeWidth={0.2}
                />
              </div>
            </div>
          </div>

          <div className="landing-viewButton-wrapper flex justify-center">
            <div
              className="landing-viewButton md:5xl text-3xl"
              onClick={() => {
                setOpenModalId(matchedAlbum.id)
                setModalOpened(true)
              }}
            >
              <BiFolderOpen
              // stroke="rgba(31, 38, 135, 0.7)"
              // strokeWidth={0.2}
              />
            </div>
          </div>

          <div className="landing-info-wrapper flex justify-center">
            <div className="landing-info-all">
              <div className="landing-info">
                <div className="landing-info-title">{matchedAlbum.title}</div>
                <div className="landing-info-year">{matchedAlbum.year}</div>
                {!isMobileMode && (
                  <div className="landing-info-description">
                    {matchedAlbum.description}
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isMobileMode && !modalOpened && (
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
                  DESCRIPTION
                  <br />
                </div>
                <div>{matchedAlbum.description}</div>
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
      {matchedAlbum.id === openModalId && (
        <Modal
          album={matchedAlbum}
          openModalId={openModalId}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          isMobileMode={isMobileMode}
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
