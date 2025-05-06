import React from 'react'
import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { Link } from "react-router-dom"
import '../../App.css'
import './Photography.css'
import Modal from './Photo_Modal';
import useResizeObserver from '@react-hook/resize-observer';

export default function Carousel_Items( {albumsData, carouselIndex, slidesOffset, isEdgeTransition, albumsPerSlide, carouselBtnLeft, carouselBtnRight, screenWidth}) {
  /*************** STATES AND VARS **************/
  /* store which album was clicked on */
  const [openModalId, setOpenModalId] = useState(null)
  /* store which thumbnail is being hovered on */
  const [hoverId, setHoverId] = useState(null)
  /* store clone slides */
  const [clonesLeft, setClonesLeft] = useState([])
  const [clonesRight, setClonesRight] = useState([])
  const [titleSize, setTitleSize] = useState([])
  const thumbnails = useRef(null)
  const titleRef = useRef(null)

  
  /*************** CSS **************/
  const THUMBNAIL_FLEX_CONTAINER = {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    top: '0%',
    width: 'calc(100% - 2 * var(--slider-padding))',
    transform: `translateX(calc((${carouselIndex} + ${slidesOffset}) * -100%))`,
    transition: isEdgeTransition? 'none' : 'transform 750ms ease-in-out',
  }

  const THUMBNAIL_FLEX_ITEM = {
    width: `${100 / albumsPerSlide}%`, 
    // borderWidth: '3px',
    // borderStyle: 'solid',
    // borderColor: 'red'
  }

  /*************** HOOKS & FUNCTIONS **************/
  /* Identify which thumbnail is being hovered on, dim button background */
  function handleThumbnailInteraction(albumId, isMouseEnter) {
    if (isMouseEnter) {
      setHoverId(albumId);
      carouselBtnLeft.current.style.opacity = '0';
      carouselBtnRight.current.style.opacity = '0';
    } else {
      setHoverId(null);
      carouselBtnLeft.current.style.opacity = '1';
      carouselBtnRight.current.style.opacity = '1';
    }
  }
  
  /* Pick background color for thumbnail description that matches the image dominant color */
  useEffect(() => {
    if (hoverId != null) {
      const img = document.getElementById(`thumbnail-img-${hoverId}`);
      const thumbnail_description = document.getElementById(`thumbnail-description-${hoverId}`);
      const colorThief = new ColorThief();
      const domColor = colorThief.getColor(img);

      /* Check brightness of dominant color to ensure readability 
      Formula: https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx */
      const brightness = Math.round(Math.sqrt(domColor[0]*domColor[0]*0.241 + domColor[1]*domColor[1]*0.691 + domColor[2]*domColor[2]*0.068))
      // console.log(brightness);

      /* If bg dark enough, font can be white */
      if (brightness < 130) {
        thumbnail_description.style.backgroundColor = `rgb(${domColor[0]}, ${domColor[1]}, ${domColor[2]})`;
      /* If bg a little light, reduce each rgb value by 25% */
      } else if (130 <= brightness < 194){
        thumbnail_description.style.backgroundColor = `rgb(${domColor[0]*0.75}, ${domColor[1]*0.75}, ${domColor[2]*0.75})`;
      /* If bg too light, reduce each rgb value by 50% */
      } else {
        thumbnail_description.style.backgroundColor = `rgb(${domColor[0]*0.5}, ${domColor[1]*0.5}, ${domColor[2]*0.5})`;
      }

    }
  }, [hoverId])
 
  /* Use ResizeObserver to observe size of thumbnail, and adjust size of title accordingly.  */
  useEffect(() => {
    const target = titleRef.current
    if (!target) return
    
    const resizeObserver = new ResizeObserver((entries) => {
      const titleElement = entries[0]
      const titleWidth = titleElement.contentRect.width
      setTitleSize(titleWidth)
    })

    resizeObserver.observe(target)

    return () => resizeObserver.disconnect()
  }, [])

  // const size = useSize(box)
  return (
    <div ref={thumbnails} style={THUMBNAIL_FLEX_CONTAINER}>
      
      {/* Clones on left side */}
      {albumsData
        .filter((album) => album.isHighlight === true)
        .slice(albumsData.length-albumsPerSlide-2)
        .map((album) => (
        <div 
          key={`cloneLeft-${album.id}`} 
          className="thumbnail-flex-item"
          style={THUMBNAIL_FLEX_ITEM}>
            
          <div className="thumbnail-box">

            <div className="thumbnail-info-container-clone relative">

              <img 
                className="thumbnail-img-clone"
                src={album.thumbnail.src}/>

              <div 
                className='thumbnail-title-year'>
                <div 
                className='thumbnail-title' 
                style={{fontSize: `${titleSize * 0.055}px` }}>

                  {album.title} <br/> 

                  <span 
                  className="thumbnail-year" 
                  style={{fontSize: `${titleSize * 0.045}px` }}>
                    {album.year}
                  </span>
                </div>
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
              className="thumbnail-box"
              onMouseEnter={() => handleThumbnailInteraction(album.id, true)}
              onMouseLeave={() => handleThumbnailInteraction(album.id, false)}>

              <div className="thumbnail-info-container relative">
                <Link 
                  to={`../photography/${album.id}`}
                  className="absolute w-full h-full border-2 border-green-500"/>

                <img 
                  className="thumbnail-img"
                  id={`thumbnail-img-${album.id}`} 
                  src={album.thumbnail.src} 
                  onClick={() => {
                    setOpenModalId(album.id)}}/>

                <div 
                  ref={album.id === 1 ? titleRef : null}
                  className='thumbnail-title-year'>

                    <div 
                    className='thumbnail-title' 
                    style={{fontSize: `${titleSize * 0.055}px` }}>

                      {album.title} <br/>

                      <span 
                      className="thumbnail-year" 
                      style={{fontSize: `${titleSize * 0.045}px` }}>
                        {album.year}
                      </span>
                
                    </div>
                </div>
              </div>
          
                
              {(album.id === hoverId) && 
              <div
                id={`thumbnail-description-${album.id}`}
                className="thumbnail-description text-lg font-thin">
                {album.description}
              </div>}
            </div>   


            {/* Modal Viewer, hidden until thumbnail is clicked on, 
            then rendered on portal different from root */}
            {(album.id === openModalId) && 
              <Modal
                album={album} 
                openModalId={openModalId} 
                closeModal={() => {
                  setOpenModalId(null)
                  console.log('closing modal')
                }}/>}

        </div>
      ))}

      {/* Clones on right side */}
      {albumsData
        .filter((album) => album.isHighlight === true)
        .slice(0, albumsPerSlide+1)
        .map((album) => (
        <div 
          key={`cloneRight-${album.id}`} 
          className="thumbnail-flex-item"
          style={THUMBNAIL_FLEX_ITEM}>
            
          <div className="thumbnail-box">

            <div className="thumbnail-info-container-clone relative">

              <img 
                className="thumbnail-img-clone"
                src={album.thumbnail.src}/>

              <div 
                className='thumbnail-title-year'>
                <div 
                className='thumbnail-title' 
                style={{fontSize: `${titleSize * 0.055}px` }}>

                  {album.title} <br/> 

                  <span 
                  className="thumbnail-year" 
                  style={{fontSize: `${titleSize * 0.045}px` }}>
                    {album.year}
                  </span>
                </div>
              </div>
            </div>
          </div>   
        </div>
      ))}
    </div>
  )
}