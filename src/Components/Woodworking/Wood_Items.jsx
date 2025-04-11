import React from 'react'
import { useState, useRef, useEffect } from 'react'
import Modal from './Wood_Modal.jsx'
import './Woodworking.css'

export default function Carousel_Items( {woodData, carouselIndex, isEdgeTransition, carouselBtnLeft, carouselBtnRight}) {
  /*************** CSS **************/
  const FLEX_CONTAINER = {
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

  /* Pick background color for wood box that matches the poster dominant color */
  // useEffect(() => {
  //   if (carouselIndex != null) {
  //     const poster = document.getElementById(`poster-${carouselIndex}`);
  //     const film_object = document.getElementById(`wood-object-${carouselIndex}`);
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
    <div className="wood-container h-[100%] w-[100%] flex items-center text-black" style={FLEX_CONTAINER}>

      {/* Clones Left */}
      {woodData.map((wood) => (
        (wood.id === woodData.length) &&
      <div 
        className="wood-object flex flex-col justify-center items-center shrink-[0] w-[100%] h-[100%] border-2 border-teal-600 p-4" 
        key={wood.id}
        id={`wood-object-${wood.id}`}>

            <div className="poster flex-[3] w-[100%] h-auto border-2 border-red-500">
              <img
                id={`wood_thumbnail-${wood.id}`}
                className='w-full h-full object-cover aspect-[3/2]'
                src={wood.thumbnail}
                onClick={() => {
                  setOpenModalId(wood.id);
                  console.log(`clicked poster ${wood.id}`);
                  }}/>
            </div>

            <div className='flex-[1] flex flex-col border-2 border-red-500 w-[100%] p-2'>

                <div className="relative font-bold text-2xl">
                  {wood.title}
                </div>

                <div className='p-2'>
                  <div className='italic'>{wood.description}</div>
                  <div><span className='font-bold'>{wood.year}.</span> {wood.dimensions}. {wood.materials}.</div>
                </div>
            </div>
        </div>
      ))}

      {/* Real slides */}
      {woodData.map((wood) => (
        <div 
        className="wood-object flex flex-col justify-center items-center shrink-[0] w-[100%] h-[100%] border-2 border-teal-600 p-4" 
        key={wood.id}
        id={`wood-object-${wood.id}`}>

            <div className="poster flex-[3] w-[100%] h-auto border-2 border-red-500">
              <img
                id={`wood_thumbnail-${wood.id}`}
                className='w-full h-full object-cover aspect-[3/2]'
                src={wood.thumbnail}
                onClick={() => {
                  setOpenModalId(wood.id);
                  console.log(`clicked poster ${wood.id}`);
                  }}/>
            </div>

            <div className='flex-[1] flex flex-col border-2 border-red-500 w-[100%] p-2'>

                <div className="relative font-bold text-2xl">
                  {wood.title}
                </div>

                <div className='p-2'>
                  <div className='italic'>{wood.description}</div>
                  <div><span className='font-bold'>{wood.year}.</span> {wood.dimensions}. {wood.materials}.</div>
                </div>
            </div>

            {/* Modal Viewer, hidden until poster is clicked on */}
            {(wood.id == openModalId) && 
              <Modal
                wood={wood}
                openModalId={openModalId}
                closeModal={() => {
                  setOpenModalId(null);
                }}/>
            }

        </div>
      ))}

      {/* Clones Right */}
      {woodData.map((wood) => (
        (wood.id === 1) &&
        <div 
        className="wood-object flex flex-col justify-center items-center shrink-[0] w-[100%] h-[100%] border-2 border-teal-600 p-4" 
        key={wood.id}
        id={`wood-object-${wood.id}`}>

            <div className="poster flex-[3] w-[100%] h-auto border-2 border-red-500">
              <img
                id={`wood_thumbnail-${wood.id}`}
                className='w-full h-full object-cover aspect-[3/2]'
                src={wood.thumbnail}
                onClick={() => {
                  setOpenModalId(wood.id);
                  console.log(`clicked poster ${wood.id}`);
                  }}/>
            </div>

            <div className='flex-[1] flex flex-col border-2 border-red-500 w-[100%] p-2'>

                <div className="relative font-bold text-2xl">
                  {wood.title}
                </div>

                <div className='p-2'>
                  <div className='italic'>{wood.description}</div>
                  <div><span className='font-bold'>{wood.year}.</span> {wood.dimensions}. {wood.materials}.</div>
                </div>
            </div>
        </div>
      ))}

    </div>
  )
}