import { useState, useEffect } from 'react'
import NavSection from '../NavSection'
import Gallery_Carousel from './Gallery_Carousel'
import Footer from '../Footer'
import '../../App.css'

export default function Gallery({ config }) {
  const albumsData = config.data
  const filteredData = config.filterFn
    ? albumsData.filter(config.filterFn)
    : albumsData
  const numAlbums = filteredData.length
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [numSlidesIndex, setNumSlidesIndex] = useState(null)
  const [albumsPerSlide, setAlbumsPerSlide] = useState(null)
  const [oddAlbums, setOddAlbums] = useState(null)

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (screenWidth <= 1024) {
      setAlbumsPerSlide(1)
    } else if (screenWidth > 1024 && screenWidth < 1536) {
      setAlbumsPerSlide(2)
    } else if (screenWidth >= 1536) {
      setAlbumsPerSlide(3)
    }
  }, [screenWidth])

  useEffect(() => {
    setNumSlidesIndex(Math.floor(numAlbums / albumsPerSlide) + 2 - 1)
    setOddAlbums(numAlbums % albumsPerSlide)
  }, [albumsPerSlide, numAlbums])

  return (
    <>
      <NavSection />

      <div className="relative top-25 z-20 flex w-[100%] items-center justify-center overflow-hidden p-5">
        <h1 className="m-1 flex w-auto items-center justify-center overflow-hidden rounded-xl border-0 bg-zinc-50 p-4 font-black">
          {config.title}
        </h1>
      </div>
      <div className="relative top-35">
        <Gallery_Carousel
          config={config}
          albumsData={albumsData}
          numSlidesIndex={numSlidesIndex}
          albumsPerSlide={albumsPerSlide}
          oddAlbums={oddAlbums}
          screenWidth={screenWidth}
        />
      </div>

      <Footer />
    </>
  )
}
