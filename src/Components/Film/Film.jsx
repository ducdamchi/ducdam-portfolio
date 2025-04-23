import { useState, useRef, useEffect } from 'react'
import filmsData from './films.json'
import Carousel from './Film_Carousel'

export default function Film() {
  
  const [numSlidesIndex, setNumSlidesIndex] = useState(null);

  useEffect(() => {
    setNumSlidesIndex(filmsData.length + 2 - 1);
  }, [filmsData])
  
  return (
    <>
      <h1 className="relative flex justify-center items-center p-1 m-1 font-semibold border-2 border-yellow-500">
        FILM
      </h1>

      <div className="relative flex justify-center items-center">
        <Carousel 
          filmsData={filmsData}
          numSlidesIndex={numSlidesIndex}/>
      </div>
    </>

  )
}