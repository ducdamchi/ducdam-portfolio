import { useState, useRef, useEffect } from 'react'
import NavSection from '../NavSection';
import filmsData from './films.json'
import Carousel from './Film_Carousel'

export default function Film() {
  
  const [numSlidesIndex, setNumSlidesIndex] = useState(null);

  useEffect(() => {
    setNumSlidesIndex(filmsData.length + 2 - 1);
  }, [filmsData])
  
  return (
    <>
      <NavSection />
      
      <div className="w-[100vw] border-2 border-yellow-500 flex justify-center items-center">
        <h1 className="flex justify-center items-center p-1 m-1 font-semibold">
            FILM
        </h1>
      </div>

      <div className="relative flex justify-center items-center">
        <Carousel 
          filmsData={filmsData}
          numSlidesIndex={numSlidesIndex}/>
      </div>
    </>

  )
}