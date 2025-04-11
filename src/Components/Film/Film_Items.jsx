import React from 'react'
import { useState, useRef, useEffect } from 'react'
import Modal from './Film_Modal'
import './Film.css'

export default function Carousel_Items( {filmsData, carouselIndex, isEdgeTransition, carouselBtnLeft, carouselBtnRight}) {
  /*************** CSS **************/
  const FILM_FLEX_CONTAINER = {
    transform: `translateX(calc(${carouselIndex} * -100%))`,
    transition: isEdgeTransition? 'none' : 'transform 750ms ease-in-out',
  }

  const INFO_GRID = {
    display: 'grid',
    gridTemplateColumns: '1fr 4fr',
    gridAutoRows: 'minmax(25px, auto)',
    gridColumnGap: '5px',
    gridRowGap: '5px'
  }

  /*************** STATES AND VARS **************/
  /* store which album was clicked on */
  const [openModalId, setOpenModalId] = useState(null); 

  
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

  /* Pick background color for film box that matches the poster dominant color */
  // useEffect(() => {
  //   if (carouselIndex != null) {
  //     const poster = document.getElementById(`poster-${carouselIndex}`);
  //     const film_object = document.getElementById(`film-object-${carouselIndex}`);
  //     const colorThief = new ColorThief();
  //     const domColor = colorThief.getColor(poster);

  //     /* Check brightness of dominant color to ensure readability 
  //     Formula: https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx */
  //     const brightness = Math.round(Math.sqrt(domColor[0]*domColor[0]*0.241 + domColor[1]*domColor[1]*0.691 + domColor[2]*domColor[2]*0.068))

  //     /* If bg dark enough, font can be white */
  //     if (brightness < 130) {
  //       film_object.style.backgroundColor = `rgb(${domColor[0]}, ${domColor[1]}, ${domColor[2]})`;
  //     /* If bg a little light, reduce each rgb value by 25% */
  //     } else if (130 <= brightness < 194){
  //       film_object.style.backgroundColor = `rgb(${domColor[0]*0.75}, ${domColor[1]*0.75}, ${domColor[2]*0.75})`;
  //     /* If bg too light, reduce each rgb value by 50% */
  //     } else {
  //       film_object.style.backgroundColor = `rgb(${domColor[0]*0.5}, ${domColor[1]*0.5}, ${domColor[2]*0.5})`;
  //     }
  //   }
  // }, [carouselIndex])

  return (
    <div className="film-container h-[100%] w-auto flex items-center text-black" style={FILM_FLEX_CONTAINER}>

      {/* Clones Left */}
      {filmsData.map((film) => (
        (film.id === filmsData.length) &&
        <div 
          className="film-object-cloneLeft flex shrink-[0] w-[100%] border-2 border-teal-600" 
          key={film.id}
          id='film-object-0'>

            <div className="flex-[1] w-[100%] h-auto max-w-[400px] border-2 border-red-500 p-2 m-2">
              <img
                id='poster-0'
                className='w-full h-full object-contain'
                src={film.poster}/>
            </div>

            <div className='flex-[1] flex flex-col border-2 border-red-500 p-2 m-2'>

                <div className="relative top-3 font-bold text-2xl">
                  {film.title} ({film.year})
                </div>

                <div className='relative top-5' style={INFO_GRID}>

                  <div className="font-bold">Director: </div>
                  <div>{film.director}</div>

                  <div className="font-bold">Runtime: </div>
                  <div>{film.runtime}</div>
       
                  <div className="font-bold">Language: </div>
                  <div>{film.language}</div>

                  <div className="font-bold">Synopsis: </div>
                  <div>{film.synopsis}</div>

                  {(film.recognition != '') && 
                      <div className="font-bold">Recognition: </div>}
                  {(film.recognition != '') && 
                      <div>{film.recognition}</div>}

                  {(film.screenings != '') && 
                    <div className="font-bold">Screenings: </div>}
                  {(film.screenings != '') && 
                    <div>{film.screenings}</div>}

                </div>
            </div>
        </div>
      ))}

      {/* Real slides */}
      {filmsData.map((film) => (
        <div 
        className="film-object flex shrink-[0] w-[100%] border-2 border-teal-600" 
        key={film.id}
        id={`film-object-${film.id}`}>

            <div className="poster flex-[1] w-[100%] h-auto max-w-[400px] border-2 border-red-500 p-2 m-2">
              <img
                id={`poster-${film.id}`}
                className='w-full h-full object-contain '
                src={film.poster}
                onClick={() => {
                  setOpenModalId(film.id);
                  console.log(`clicked poster ${film.id}`);
                  }}/>
            </div>

            <div className='flex-[1] flex flex-col border-2 border-red-500 p-2 m-2'>

                <div className="relative top-3 font-bold text-2xl">
                  {film.title} ({film.year})
                </div>

                <div className='relative top-5' style={INFO_GRID}>

                  <div className="font-bold">Director: </div>
                  <div>{film.director}</div>

                  <div className="font-bold">Runtime: </div>
                  <div>{film.runtime}</div>
       
                  <div className="font-bold">Language: </div>
                  <div>{film.language}</div>

                  <div className="font-bold">Synopsis: </div>
                  <div>{film.synopsis}</div>

                  {(film.recognition != '') && 
                      <div className="font-bold">Recognition: </div>}
                  {(film.recognition != '') && 
                      <div>{film.recognition}</div>}

                  {(film.screenings != '') && 
                    <div className="font-bold">Screenings: </div>}
                  {(film.screenings != '') && 
                    <div>{film.screenings}</div>}

                </div>
            </div>

            {/* Modal Viewer, hidden until poster is clicked on */}
            {(film.id == openModalId) && 
              <Modal
                film={film}
                openModalId={openModalId}
                closeModal={() => {
                  setOpenModalId(null);
                }}/>
            }

        </div>
      ))}

      {/* Clones Right */}
      {filmsData.map((film) => (
        (film.id === 1) &&
        <div 
        className="film-object-cloneRight flex shrink-[0] w-[100%] border-2 border-teal-600" 
        key={film.id}
        id={`film-object-${filmsData.length+1}`}>

            <div className="flex-[1] w-[100%] h-auto max-w-[400px] border-2 border-red-500 p-2 m-2">
              <img
                className='w-full h-full object-contain'
                src={film.poster}
                id={`poster-${filmsData.length+1}`}/>
                
            </div>

            <div className='flex-[1] flex flex-col border-2 border-red-500 p-2 m-2'>

                <div className="relative top-3 font-bold text-2xl">
                  {film.title} ({film.year})
                </div>

                <div className='relative top-5' style={INFO_GRID}>

                  <div className="font-bold">Director: </div>
                  <div>{film.director}</div>

                  <div className="font-bold">Runtime: </div>
                  <div>{film.runtime}</div>
       
                  <div className="font-bold">Language: </div>
                  <div>{film.language}</div>

                  <div className="font-bold">Synopsis: </div>
                  <div>{film.synopsis}</div>

                  {(film.recognition != '') && 
                      <div className="font-bold">Recognition: </div>}
                  {(film.recognition != '') && 
                      <div>{film.recognition}</div>}

                  {(film.screenings != '') && 
                    <div className="font-bold">Screenings: </div>}
                  {(film.screenings != '') && 
                    <div>{film.screenings}</div>}

                </div>
            </div>
        </div>
      ))}
    </div>
  )
}