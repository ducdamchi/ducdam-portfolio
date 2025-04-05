import React from 'react'
import { useState, useRef, useEffect } from 'react'

export default function Carousel_Items( {filmsData, carouselIndex, isEdgeTransition, carouselBtnLeft, carouselBtnRight}) {
  /*************** CSS **************/
  const FILM_FLEX_CONTAINER = {
  transform: `translateX(calc(${carouselIndex} * -100%))`,
  }

  /*************** STATES AND VARS **************/
  /* store which album was clicked on */
  const [openModalId, setOpenModalId] = useState(null); 

  /* store clone slides */
  const [clonesLeft, setClonesLeft] = useState([]);    
  const [clonesRight, setClonesRight] = useState([]);

  // const [slideIndex, setSlideIndex] = useState(0);
  
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
    <div className="film-container h-[100%] w-auto flex items-center" style={FILM_FLEX_CONTAINER}>
      {filmsData.map((film) => (
        <div className="film-object flex shrink-[0] w-[100%] border-2 border-teal-600" key={film.id}>
            <div className="poster flex-3 w-[100%] h-auto max-w-[400px] border-2 border-red-500 p-1 m-1">
              <img
                className='w-full h-full object-contain'
                src={film.poster}/>
            </div>

            <div className='flex-2 flex flex-col border-2 border-red-500 p-1 m-1'>
                <div>Title: {film.title}</div>
                <div>Year: {film.year}</div>
                <div>Director: {film.director}</div>
                <div>Language: {film.language}</div>
                <div>Synopsis: {film.synopsis}</div>
                {(film.recognition != '') && <div>Recognition: {film.recognition}</div>}
                {(film.screenings != '') && <div>Screenings: {film.screenings}</div>}
            </div>
        </div>
      ))}
    </div>
  )
}