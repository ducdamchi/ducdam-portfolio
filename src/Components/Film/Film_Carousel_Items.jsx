import React from 'react'
import { useState, useRef, useEffect } from 'react'

export default function Carousel_Items( {filmsData, carouselIndex, isEdgeTransition, carouselBtnLeft, carouselBtnRight}) {
  /*************** STATES AND VARS **************/
  /* store which album was clicked on */
  const [openModalId, setOpenModalId] = useState(null); 

  /* store clone slides */
  const [clonesLeft, setClonesLeft] = useState([]);    
  const [clonesRight, setClonesRight] = useState([]);
  
  /*************** HOOKS & FUNCTIONS **************/
  // function handleThumbnailInteraction(albumId, isMouseEnter) {
  //   if (isMouseEnter) {
  //     setHoverId(albumId);
  //     carouselBtnLeft.current.style.opacity = '0';
  //     carouselBtnRight.current.style.opacity = '0';
  //   } else {
  //     setHoverId(null);
  //     carouselBtnLeft.current.style.opacity = '1';
  //     carouselBtnRight.current.style.opacity = '1';
  //   }
  // }

  return (
    <>
      <div>
        {filmsData.map((film) => (
            <div className="poster w-[100%] max-w-[400px] h-auto border-2 border-red-500"
              key={film.id}>
                <img
                  className='w-full h-full object-contain'
                  src={film.poster}/>
            </div>
          ))}
      </div>
    </>
  )
}