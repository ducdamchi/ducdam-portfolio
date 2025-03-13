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

      /* Select all thumbnail imgs, extract first three and last three */
      const images = thumbnails.current.querySelectorAll('.thumbnail-img');
      const titles = thumbnails.current.querySelectorAll('.thumbnail-title');
      const years = thumbnails.current.querySelectorAll('.thumbnail-year')

      const firstImgs = [...images].slice(0, imagesPerSlide);
      const lastImgs = [...images].slice(-imagesPerSlide);
      const firstTitles = [...titles].slice(0, imagesPerSlide);
      const lastTitles = [...titles].slice(-imagesPerSlide);
      const firstYears = [...years].slice(0, imagesPerSlide);
      const lastYears = [...years].slice(-imagesPerSlide);

      /* Make clones of those two 'slides' to reference in HTML */
      let clonesLeftLst = [];
      for (let i=0; i < imagesPerSlide; i++) {
        let clone_info = [];        
        clone_info.push(lastImgs[i].src);
        clone_info.push(lastTitles[i].innerHTML);
        clone_info.push(lastYears[i].innerHTML);
        clonesLeftLst.push(clone_info)
      }

      let clonesRightLst = [];
      for (let i=0; i < imagesPerSlide; i++) {
        let clone_info = [];        
        clone_info.push(firstImgs[i].src);
        clone_info.push(firstTitles[i].innerHTML);
        clone_info.push(firstYears[i].innerHTML);
        clonesRightLst.push(clone_info)
      }
    
      // console.log("clones Left:", clonesLeftLst);
      // console.log("clones Right:", clonesRightLst);

      setClonesLeft(clonesLeftLst);
      setClonesRight(clonesRightLst);
    }
  }, []);

  useEffect(() => {
    console.log(clonesLeft);
  },[])

  return (
    <div ref={thumbnails} style={THUMBNAIL_FLEX_CONTAINER}>
      
      {/* Clones on left side */}
      {clonesLeft.map((cloneInfo, index) => (
        <div 
            key={`cloneLeft-${index}`} 
            className="thumbnail-flex-item" 
            style={THUMBNAIL_FLEX_ITEM}>

            <div className="thumbnail-box border-4 border-orange-500">
              <div className="thumbnail-info-container-clone relative border-3 border-green-500">
                <img 
                  className="thumbnail-img-clone" 
                  src={cloneInfo[0]}/>

                <div
                  className="thumbnail-title absolute bottom-15 left-6 text-2xl text-white font-extrabold">{cloneInfo[1]}
                </div>

                <div
                  className="thumbnail-year absolute bottom-8 left-6 text-lg text-white font-bold">{cloneInfo[2]}
                </div> 
              </div>
            </div>
        </div>
      ))}
      
      {/* Real slides: Iterate through each album and present its info */}
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

              <div className="thumbnail-info-container relative border-3 border-green-500">
                <img 
                  className="thumbnail-img" 
                  src={album.thumbnail.src} 
                  onClick={() => {
                  setOpenModalId(album.id);}}/>

                <div
                  className="thumbnail-title absolute bottom-15 left-6 text-2xl text-white font-extrabold">{album.title}
                </div>

                <div
                  className="thumbnail-year absolute bottom-8 left-6 text-lg text-white font-bold">{album.year}
                </div> 
              </div>
          
                
              {(album.id === hoverId) && <div
                className="thumbnail-description">
                {album.description}
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
      {clonesRight.map((cloneInfo, index) => (
        <div 
          key={`cloneRight-${index}`} 
          className="thumbnail-flex-item" 
          style={THUMBNAIL_FLEX_ITEM}>

            <div className="thumbnail-box border-4 border-orange-500">
              <div className="thumbnail-info-container-clone relative border-3 border-green-500">
                <img 
                  className="thumbnail-img-clone" 
                  src={cloneInfo[0]}/>

                <div
                  className="thumbnail-title absolute bottom-15 left-6 text-2xl text-white font-extrabold">{cloneInfo[1]}
                </div>

                <div
                  className="thumbnail-year absolute bottom-8 left-6 text-lg text-white font-bold">{cloneInfo[2]}
                </div> 
              </div>
            </div>
        </div>
      ))}

    </div>
  )
}