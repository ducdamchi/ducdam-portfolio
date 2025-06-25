import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Modal from './Film_Modal'
import './Film.css'

export default function Carousel_Items({
  filmsData,
  carouselIndex,
  isEdgeTransition,
  carouselBtnLeft,
  carouselBtnRight,
}) {
  /*************** CSS **************/
  const FILM_FLEX_CONTAINER = {
    transform: `translateX(calc(${carouselIndex} * -100%))`,
    transition: isEdgeTransition ? 'none' : 'transform 750ms ease-in-out',
  }

  /*************** STATES AND VARS **************/
  /* store which album was clicked on */
  const [openModalId, setOpenModalId] = useState(null)

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
    <div
      className="film-container flex h-[100%] w-auto items-center text-black"
      style={FILM_FLEX_CONTAINER}
    >
      {/* Clones Left */}
      {filmsData.map(
        (film) =>
          film.id === filmsData.length && (
            <div
              className="film-object cloneLeft flex h-full w-[100%] shrink-[0] items-center justify-center"
              key={film.id}
              id="film-object-0"
            >
              <div className="poster m-2 h-auto w-[100%] max-w-[400px] p-2">
                <img
                  id="poster-0"
                  className="h-full w-full object-contain"
                  src={film.poster}
                />
              </div>
            </div>
          ),
      )}

      {/* Real slides */}
      {filmsData.map((film) => (
        <div
          className="film-object flex h-full w-[100%] shrink-[0] items-center justify-center"
          key={film.id}
          id={`film-object-${film.id}`}
        >
          <div className="poster m-2 h-auto w-[100%] max-w-[400px] p-2">
            <Link
              to={`../film/${film.url}`}
              className="absolute h-full w-full"
            />
            <img
              id={`poster-${film.id}`}
              className="h-full w-full object-contain"
              src={film.poster}
            />
          </div>

          {/* Modal Viewer, hidden until poster is clicked on
          {film.id == openModalId && (
            <Modal
              film={film}
              openModalId={openModalId}
              closeModal={() => {
                setOpenModalId(null)
              }}
            />
          )} */}
        </div>
      ))}

      {/* Clones Right */}
      {filmsData.map(
        (film) =>
          film.id === 1 && (
            <div
              className="film-object cloneRight flex h-full w-[100%] shrink-[0] items-center justify-center"
              key={film.id}
              id={`film-object-${filmsData.length + 1}`}
            >
              <div className="poster m-2 h-auto w-[100%] max-w-[400px] p-2">
                <img
                  className="h-full w-full object-contain"
                  src={film.poster}
                  id={`poster-${filmsData.length + 1}`}
                />
              </div>
            </div>
          ),
      )}
    </div>
  )
}
