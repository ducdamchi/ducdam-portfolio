import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import '../../App.css'
import './Photography.css'
import Modal from './Photo_Modal';
import albumsData from './albums.json'

export default function Landing () {

  const [openModalId, setOpenModalId] = useState(null)

  const {photoURL} = useParams()

  const matchedAlbum = albumsData.find(album => album.url === photoURL)

  if (!matchedAlbum) {
    return <div>Page not found</div>
  }

  return (
    <div className="w-screen h-screen">
      {/* <h1>Welcome to album "{matchedAlbum.url}"</h1>
      <h1>Thumbnail source = "{matchedAlbum.thumbnail.src}"</h1> */}
      <div className='relative'>
        <img 
          className='w-screen h-auto absolute z-1 top-0 left-0'
          src={`/${matchedAlbum.thumbnail.src}`}
          id={`thumbnail-img-${matchedAlbum.id}`} 
          alt=""
          onClick={() => {
            setOpenModalId(matchedAlbum.id)}}/>
        <div className='z-2 absolute top-160 text-white left-30'>{matchedAlbum.title}</div>
        <div className='z-2 absolute top-170 text-white left-30'>{matchedAlbum.year}</div>
        <div className='z-2 absolute top-180 right-30 left-30 text-white'>{matchedAlbum.description}</div>
      </div>


    {/* Modal Viewer, hidden until thumbnail is clicked on, 
    then rendered on portal different from root */}
    {(matchedAlbum.id === openModalId) && 
      <Modal
        album={matchedAlbum} 
        openModalId={openModalId} 
        closeModal={() => {
          setOpenModalId(null)
          console.log('closing modal')
        }}/>}  
      
    </div>
  )
}