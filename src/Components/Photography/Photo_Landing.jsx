import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import '../../App.css'
import './Photography.css'
import albumsData from './albums.json'

export default function Landing () {
  const { photoURL} = useParams()
  console.log(photoURL)
  
  /* Check if url is valid */
  const all_urls = []
  albumsData.forEach(album =>
    all_urls.push(album.url)
  )
  const urls_str = all_urls.map(String)

  if (!urls_str.includes(photoURL)) {
    return <div>Page not found</div>
  }

  return (
    <div className="w-screen h-screen">
      <h1>Welcome to album "{photoURL}"</h1>
    </div>
  )
}