import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../../App.css'
import './Photography.css'
import Modal from './Photo_Modal'
import albumsData from './albums.json'
import { HiArrowLeft } from 'react-icons/hi2'

export default function Landing() {
  const [openModalId, setOpenModalId] = useState(null)

  const { photoURL } = useParams()

  const matchedAlbum = albumsData.find((album) => album.url === photoURL)

  if (!matchedAlbum) {
    return <div>Page not found</div>
  }

  return (
    <div className="">
      {/* <h1>Welcome to album "{matchedAlbum.url}"</h1>
      <h1>Thumbnail source = "{matchedAlbum.thumbnail.src}"</h1> */}
      <div className="landing-whole absolute top-0 left-0 h-screen w-screen overflow-hidden border-2 border-blue-500">
        <img
          className="landing-background"
          src={`/${matchedAlbum.thumbnail.src}`}
          id={`thumbnail-img-${matchedAlbum.id}`}
          alt=""
        />

        <div className="landing-backArrow-wrapper-2 flex justify-center">
          <div className="landing-backArrow-wrapper-1 flex">
            <div className="landing-backArrow text-3xl">
              <Link
                to={`../photography`}
                className="landing-backArrow-link border-2 border-green-500"
              />
              <HiArrowLeft />
            </div>
            {/* <div className="landing-backArrow-empty"></div> */}
          </div>
        </div>

        <div className="landing-viewButton-wrapper flex justify-center">
          <div
            className="landing-viewButton"
            onClick={() => {
              setOpenModalId(matchedAlbum.id)
            }}
          >
            VIEW
          </div>
        </div>

        <div className="landing-info-wrapper flex justify-center">
          <div className="landing-info-all">
            <div className="landing-info">
              <div className="landing-info-title">{matchedAlbum.title}</div>
              <div className="landing-info-year">{matchedAlbum.year}</div>
              <div className="landing-info-description">
                {matchedAlbum.description}
              </div>
            </div>

            <div className="landing-info-empty"></div>
          </div>
        </div>

        <div className="landing-footer-wrapper flex justify-center">
          <div className="landing-footer">
            <div className="landing-footer-gmail">
              <a
                href={`mailto:ducdamchi@gmail.com?
                &subject=Just viewed your album '${matchedAlbum.title}'
                &body=I would appreciate any thoughts that you have! --Duc`}
              >
                Gmail
              </a>
            </div>
            <div className="landing-footer-insta">
              <a href="https://www.instagram.com/ducdamchi" target="_blank">
                Instagram
              </a>
            </div>
            {/* <div className='landing-footer-facebook'>Facebook</div> */}
            <div className="landing-footer-git">
              <a href="https://github.com/ducdamchi" target="_blank">
                Github
              </a>
            </div>
            <div className="landing-footer-empty"></div>
            <div className="landing-footer-copyright">
              Copyright Duc Dam, 2025
            </div>
          </div>
        </div>
      </div>

      {/* Modal Viewer, hidden until thumbnail is clicked on, 
    then rendered on portal different from root */}
      {matchedAlbum.id === openModalId && (
        <Modal
          album={matchedAlbum}
          openModalId={openModalId}
          closeModal={() => {
            setOpenModalId(null)
            console.log('closing modal')
          }}
        />
      )}
    </div>
  )
}
