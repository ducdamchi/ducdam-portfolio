import React from 'react'
import { useState, useRef, useEffect } from 'react'
import './App.css'
import albumsData from './albums.json'
import ModalViewer from './ModalViewer';

export default function HighlightsThumbnails( {carouselIndex, isEdgeTransition, imageWidthPercent, imagesPerSlide}) {


  /*************** CSS **************/
  // aka the flex container for all the thumbnails
  const THUMBNAIL_FLEX_CONTAINER = {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    top: '0%',
    width: 'calc(100% - 2 * var(--slider-padding))',
    '--slider-index': carouselIndex, // to be modified with useState()
    transform: 'translateX(calc(var(--slider-index) * -100%))',
    transition: isEdgeTransition? 'none' : 'transform 750ms ease-in-out',
  }

  const THUMBNAIL_FLEX_ITEM = {
    width: imageWidthPercent, 
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: 'red'
  }

  /*************** STATES AND VARS **************/
  /* store which album was clicked on */
  const [openModalId, setOpenModalId] = useState(null); 

  /* store which thumbnail is being hovered on */
  const [hoverId, setHoverId] = useState(null);

  /* store clone slides */
  const [clonesLeft, setClonesLeft] = useState([]);    
  const [clonesRight, setClonesRight] = useState([]);   


  /*************** HOOKS **************/
  /* Make clones of first and last page of carousel */
  const thumbnails = useRef(null);
  useEffect(() => {

    /* Make sure thumbnails useRef object not null */
    if (thumbnails.current) {

      //TODO: copy entire thumbnail box to clone, not just img

      /* Select all thumbnail imgs, extract first three and last three */
      const allThumbnails = thumbnails.current.querySelectorAll('.thumbnail-img');
      // console.log(allThumbnails);
      const firstPage = [...allThumbnails].slice(0, imagesPerSlide);
      const lastPage = [...allThumbnails].slice(-imagesPerSlide);

      /* Make clones of those two 'slides', will call clonesLeft/Right in HTML */
      setClonesLeft(lastPage.map((thumbnail) => thumbnail.src));
      setClonesRight(firstPage.map((thumbnai) => thumbnai.src));
    }
  }, []);

  useEffect(() => {

  }, [hoverId])

  return (
    <div ref={thumbnails} style={THUMBNAIL_FLEX_CONTAINER}>
      
      {/* Clones on left side */}
      {clonesLeft.map((src, index) => (
        <div 
            key={`cloneLeft-${index}`} 
            className="thumbnail-flex-item" 
            style={THUMBNAIL_FLEX_ITEM}>

              <div className="thumbnail-img-title-container relative border-3 border-green-500">
                <img 
                  className="thumbnail-img-clone" 
                  src={src}/>

                <div
                  className="thumbnail-title absolute bottom-15 left-6 text-2xl text-white font-extrabold">EXAMPLE PROJECT TITLE
                </div>

                <div
                  className="thumbnail-year absolute bottom-8 left-6 text-lg text-white font-bold">2020-PRESENT
                </div> 
              </div>

        </div>
      ))}
      
      {/* Iterate through each album and present thumbnails on slides */}
      {albumsData
        .filter((album) => album.isHighlight === true)
        .map((album) => (
        <div 
          className="thumbnail-flex-item" 
          key={album.id} 
          style={THUMBNAIL_FLEX_ITEM}>
            
            <div 
              className="thumbnail-box border-4 border-orange-500"
              onMouseEnter={() => setHoverId(album.id)}
              onMouseLeave={() => setHoverId(null)}>

              <div className="thumbnail-img-title-container relative border-3 border-green-500">
                <img 
                  className="thumbnail-img" 
                  src={album.thumbnail.src} 
                  onClick={() => {
                  setOpenModalId(album.id);}}/>

                <div
                  className="thumbnail-title absolute bottom-15 left-6 text-2xl text-white font-extrabold">EXAMPLE PROJECT TITLE
                </div>

                <div
                  className="thumbnail-year absolute bottom-8 left-6 text-lg text-white font-bold">2020-PRESENT
                </div> 
              </div>
          
                
              {(album.id === hoverId) && <div
                className="thumbnail-description">
                This is a short description that should only show up 
                when the user hovers over the thumbnail image.
              </div>}
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
        <div 
          key={`cloneRight-${index}`} 
          className="thumbnail-flex-item" 
          style={THUMBNAIL_FLEX_ITEM}>

            <div className="thumbnail-img-title-container relative border-3 border-green-500">
              <img 
                className="thumbnail-img-clone" 
                src={src}/>

              <div
                className="thumbnail-title absolute bottom-15 left-6 text-2xl text-white font-extrabold">EXAMPLE PROJECT TITLE
              </div>

              <div
                className="thumbnail-year absolute bottom-8 left-6 text-lg text-white font-bold">2020-PRESENT
              </div> 
            </div>

        </div>
      ))}

    </div>
  )
}