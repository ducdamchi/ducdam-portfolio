import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import '../../App.css'
import './Photography.css'
import albumsData from './albums.json'

export default function Landing () {
  const { photoId } = useParams()
  
  /* Check if id is valid */
  const ids = []
  albumsData.forEach(album =>
    ids.push(album.id)
  )
  const ids_str = ids.map(String)

  if (!ids_str.includes(photoId)) {
    return <div>Page not found</div>
  }

  return (
    <div>
      <h1>Welcome to album number {photoId}</h1>
    </div>
  )
}