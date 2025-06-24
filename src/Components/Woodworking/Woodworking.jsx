import { useState, useRef, useEffect } from 'react'
import woodData from './wood.json'
import Carousel from './Wood_carousel'
import NavSection from '../NavSection'
import Footer from '../Footer'
import '../../App.css'

export default function Woodworking() {
  const [numSlidesIndex, setNumSlidesIndex] = useState(null)

  useEffect(() => {
    setNumSlidesIndex(woodData.length + 2 - 1)
  }, [woodData])

  return (
    <>
      <NavSection />

      <div className="relative top-10 flex w-[100vw] items-center justify-center border-2 border-yellow-500 p-5">
        <h1 className="m-1 flex w-[100vw] items-center justify-center overflow-hidden p-1 font-semibold">
          WOODWORKING
        </h1>
      </div>

      <div className="wood-text relative top-50 flex items-center justify-center p-5">
        Oops... (wood)Working on it! <br />
        Please visit other sections for now :)
        {/* <Carousel woodData={woodData} numSlidesIndex={numSlidesIndex} /> */}
      </div>

      <Footer />
    </>
  )
}
