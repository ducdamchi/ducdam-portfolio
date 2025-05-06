import { useState, useRef, useEffect } from 'react'
import woodData from './wood.json'
import Carousel from './Wood_carousel'

export default function Woodworking() {
  
  const [numSlidesIndex, setNumSlidesIndex] = useState(null);

  useEffect(() => {
    setNumSlidesIndex(woodData.length + 2 - 1);
  }, [woodData])
  
  return (
    <>
      <NavSection />

      <div className="w-[100vw] border-2 border-yellow-500 flex justify-center items-center">
        <h1 className="flex justify-center items-center p-1 m-1 font-semibold">
            WOODWORKING
        </h1>
      </div>

      <div className="flex justify-center items-center">
        <Carousel 
          woodData={woodData}
          numSlidesIndex={numSlidesIndex}/>
      </div>
    </>

  )
}