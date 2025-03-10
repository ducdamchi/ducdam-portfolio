import React from 'react'
import { useState, useRef, useEffect } from 'react'
import './App.css'
import albumsData from './albums.json'
import ModalViewer from './ModalViewer';

export default function HighlightsThumbnails( {carouselIndex, isEdgeTransition, imageWidthPercent, imagesPerSlide}) {


  /*************** CSS **************/
  const CAROUSEL = {
    '--slider-index': carouselIndex, // to be modified with useState()
    display: 'flex',
    width: 'calc(100% - 2 * var(--slider-padding))', // check App.css root for --slider-padding
    transform: 'translateX(calc(var(--slider-index) * -100%))',

    /* If EdgeTransition flag is set, transform from clone slide to real 
    slide without any effects. If flag not set, use transform transition.*/
    transition: isEdgeTransition? 'none' : 'transform 750ms ease-in-out',
  }

  const THUMBNAIL_WINDOW = {
    flex: 'none',
    display: 'flex',
    maxWidth: imageWidthPercent, 
    alignContent: 'center',
    justifyContent: 'center',
  }

  /*************** STATES AND VARS **************/
  const [openModalId, setOpenModalId] = useState(null); /* keep track which album was clicked on */
  const [clonesLeft, setClonesLeft] = useState([]);    /* slide shows up when slide left on first page. */
  const [clonesRight, setClonesRight] = useState([]);   /* slide shows up when slide right on last page. */

  /*************** HOOKS **************/
  /* Make clones of first and last page of carousel */
  const thumbnails = useRef(null);
  useEffect(() => {

    /* Make sure thumbnails useRef object not null */
    if (thumbnails.current) {

      /* Select all thumbnail imgs, extract first three and last three */
      const allThumbnails = thumbnails.current.querySelectorAll('.thumbnail-img');
      const firstPage = [...allThumbnails].slice(0, imagesPerSlide);
      const lastPage = [...allThumbnails].slice(-imagesPerSlide);

      /* Make clones of those two 'slides', will call clonesLeft/Right in HTML */
      setClonesLeft(lastPage.map((thumbnail) => thumbnail.src));
      setClonesRight(firstPage.map((thumbnail) => thumbnail.src));
    }
  }, []);

  return (
    <div ref={thumbnails} style={CAROUSEL}>
      
      {/* Clones on left side */}
      {clonesLeft.map((src, index) => (
        <div key={`cloneLeft-${index}`} className="thumbnail-window" style={THUMBNAIL_WINDOW}>
          <img className="thumbnail-img-clone" src={src}/>
        </div>
      ))}
      
      {/* Iterate through each album and present thumbnails on slides */}
      {albumsData
        .filter((album) => album.isHighlight === true)
        .map((album) => (
        <div 
          className="thumbnail-window" 
          key={album.id} 
          style={THUMBNAIL_WINDOW}>
        
          {/* Thumbnail box, containing thumbnail image and a description box
          when thumbnail is hovered over. */}
          <div
            className="thumbnail-box">

            <img 
              className="thumbnail-img" 
              src={album.thumbnail.src}
              onClick={() => {
                setOpenModalId(album.id);}}/>

            <div
              className="thumbnail-description">
              This is a short description that should only show up 
              when the user hovers over the thumbnail image.
            </div>    
          
          </div>

          {/* Modal Viewer, hidden until thumbnail is clicked on, 
          then rendered on portal different from root */}
          {(album.id === openModalId) && 
            <ModalViewer
              album={album} 
              openModalId={openModalId} 
              closeModal={() => {
                setOpenModalId(null);
                console.log('closing modal');}}/>}

        </div>
      ))}

      {/* Clones on right side */}
      {clonesRight.map((src, index) => (
        <div key={`cloneRight-${index}`} className="thumbnail-window" style={THUMBNAIL_WINDOW}>
          <img className="thumbnail-img-clone" src={src}/>
        </div>
      ))}

    </div>
  )
}
