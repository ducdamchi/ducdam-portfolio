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
    //justifyContent: should not be center because that would mess with slides order.

    // check App.css root for --slider-padding
    // TODO: dynamically change width between devices
    position: 'relative',
    top: '0%',
    width: 'calc(100% - 2 * var(--slider-padding))',
    // height: '30vh',

    /* If EdgeTransition flag is set, transform from clone slide to real 
    slide without any effects. If flag not set, use transform transition.*/
    '--slider-index': carouselIndex, // to be modified with useState()
    transform: 'translateX(calc(var(--slider-index) * -100%))',
    transition: isEdgeTransition? 'none' : 'transform 750ms ease-in-out',

    // backgroundColor: 'yellow',
  }

  const THUMBNAIL_FLEX_ITEM = {
    position: 'relative',

    //fits all items into flex container space 
    // but don't allow them to shrink
    flex: 'none', 
    maxWidth: imageWidthPercent, 
    textAlign: 'center', //to center img element

    backgroundColor: 'yellow',
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

  // useEffect(() => {
  //   console.log(clonesLeft);
  //   console.log(clonesRight);
  // },[clonesLeft, clonesRight])


  return (
    <div ref={thumbnails} className="thumbnail-flex-container" style={THUMBNAIL_FLEX_CONTAINER}>
      
      {/* Clones on left side */}
      {clonesLeft.map((src, index) => (
        <div 
            key={`cloneLeft-${index}`} 
            className="thumbnail-box" 
            style={THUMBNAIL_FLEX_ITEM}>

              <img className="thumbnail-img-clone" src={src}/>

              <div
                className="thumbnail-description absolute -bottom-10 bg-blue">
                This is a short description that should only show up 
                when the user hovers over the thumbnail image.
              </div>    

              <div
                className="thumbnail-title absolute bottom-15 left-6 text-2xl text-white font-extrabold">EXAMPLE PROJECT TITLE
              </div>

              <div
                className="thumbnail-year absolute bottom-8 left-6 text-lg text-white font-bold">2020-PRESENT
              </div>

        </div>
      ))}
      
      {/* Iterate through each album and present thumbnails on slides */}
      {albumsData
        .filter((album) => album.isHighlight === true)
        .map((album) => (
        <div 
          className="thumbnail-box" 
          key={album.id} 
          style={THUMBNAIL_FLEX_ITEM}>
      
            <img 
              className="thumbnail-img" 
              src={album.thumbnail.src} 
              onClick={() => {
              setOpenModalId(album.id);}}/>
              
            <div
              className="thumbnail-description absolute -bottom-15 text-left">
              This is a short description that should only show up 
              when the user hovers over the thumbnail image.
            </div>    

            <div
              className="thumbnail-title absolute bottom-15 left-6 text-2xl text-white font-extrabold">EXAMPLE PROJECT TITLE
            </div>

            <div
              className="thumbnail-year absolute bottom-8 left-6 text-lg text-white font-bold">2020-PRESENT
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
          className="thumbnail-box" 
          style={THUMBNAIL_FLEX_ITEM}>

            <img className="thumbnail-img-clone" src={src}/>

            <div
              className="thumbnail-description absolute -bottom-10 bg-blue">
              This is a short description that should only show up 
              when the user hovers over the thumbnail image.
            </div>    

            <div
              className="thumbnail-title absolute bottom-15 left-6 text-2xl text-white font-extrabold">EXAMPLE PROJECT TITLE
            </div>

            <div
              className="thumbnail-year absolute bottom-8 left-6 text-lg text-white font-bold">2020-PRESENT
            </div>
        </div>
      ))}

    </div>
  )
}
