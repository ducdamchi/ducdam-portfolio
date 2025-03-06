import React from 'react'
import { useState, useRef, useEffect } from 'react'
import './App.css'
import albumsData from './albums.json'
import ModalViewer from './ModalViewer';

export default function HighlightsThumbnails( {carouselIndex, isEdgeTransition, imageWidthPercent, imagesPerSlide}) {

  /*************** STATES AND VARS **************/
  const [openModalId, setOpenModalId] = useState(null);
  const [clonesLeft, setClonesLeft] = useState([]);    /* slide shows up when slide left on first page. */
  const [clonesRight, setClonesRight] = useState([]);   /* slide shows up when slide right on last page. */

  /*************** CSS **************/
  const CAROUSEL_STYLE = {
    '--slider-index': carouselIndex, // to be modified with useState()
    display: 'flex',
    width: 'calc(100% - 2 * var(--slider-padding))', // check App.css root for --slider-padding
    transform: 'translateX(calc(var(--slider-index) * -100%))',

    /* If EdgeTransition flag is set, transform from clone slide to real 
    slide without any effects. If flag not set, use transform transition.*/
    transition: isEdgeTransition? 'none' : 'transform 750ms ease-in-out',
  }

  const THUMBNAIL_DIV_STYLE = {
    flex: 'none',
    display: 'flex',
    maxWidth: imageWidthPercent, 
    alignContent: 'center',
    justifyContent: 'center',
  }

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
    <div ref={thumbnails} style={CAROUSEL_STYLE}>

      {clonesLeft.map((src, index) => (
        <div key={`cloneLeft-${index}`} className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
          <img className="thumbnail-img-clone" src={src}/>
        </div>
      ))}

      {albumsData
        .filter((album) => album.isHighlight === true)
        .map((album) => (
        <div 
          className="thumbnail-div" 
          key={album.id} 
          style={THUMBNAIL_DIV_STYLE}
        >
        
          <img 
            className="thumbnail-img" 
            src={album.thumbnail.src}
            onClick={() => {
              setOpenModalId(album.id);
              console.log("opened modal", album.id);}}
          />

          {(album.id === openModalId) && 
            <ModalViewer
              album={album} 
              openModalId={openModalId} 
              closeModal={() => {
                setOpenModalId(null);
                console.log('closing modal');}} 
            />
          }

        </div>
      ))}

      {clonesRight.map((src, index) => (
        <div key={`cloneRight-${index}`} className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
          <img className="thumbnail-img-clone" src={src}/>
        </div>
      ))}

    </div>
  )
}
