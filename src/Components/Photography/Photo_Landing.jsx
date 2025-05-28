import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import '../../App.css'
import './Photography.css'
import albumsData from './albums.json'

export default function Landing () {
  const {photoURL} = useParams()
  console.log(photoURL)
  
  /* Check if url is valid */
  // const all_urls = []
  let curr_album 
  let flag = 0
  albumsData.forEach(album => {
    console.log(album.id)
    console.log(album.url)
    if (album.url.toString() === photoURL) {
      flag = 1
      curr_album = album
    }
  }
)
  // const urls_str = all_urls.map(String)

  if (!flag) {
    return <div>Page not found</div>
  }

  return (
    <div className="w-screen h-screen">
      <h1>Welcome to album "{photoURL}"</h1>
      <div></div>
    </div>
  )
}