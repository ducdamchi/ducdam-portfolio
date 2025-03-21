import { useState, useEffect } from 'react'
import HighlightsCarousel from './HighlightsCarousel';
import albumsData from './albums.json'

export default function Photography() {

  function HighlightSection () {
  
    const numAlbums = albumsData.filter((album) => album.isHighlight === true).length;
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [numSlidesIndex, setNumSlidesIndex] = useState(null);
    const [albumsPerSlide, setAlbumsPerSlide] = useState(null); //keep track of this in .root in App.css as well
    const [oddAlbums, setOddAlbums] = useState(null); // number of odd slides (numAlbums not always divisible by albumsPerSlide)
  
    /* Dynamically obtain window size to resize carousel accordingly */
    useEffect(() => {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    /* Set number of thumbnail imgs per slide based on screen width */
    useEffect(() => {
      if (screenWidth <= 1024) {
        setAlbumsPerSlide(1);
      } else if (screenWidth > 1024 && screenWidth < 1536) {
        setAlbumsPerSlide(2);
      } else if (screenWidth >= 1800) {
        setAlbumsPerSlide(3);
      }
    }, [screenWidth]);
  
    /* 
    Set total number of indices for all slides, including clones 
    Set number of odd slides*/
    useEffect(() => {
      // number of slides + 2 fake slides - 1 to convert to indices
      setNumSlidesIndex(Math.floor(numAlbums / albumsPerSlide) + 2 - 1);
      setOddAlbums(numAlbums % albumsPerSlide);
    },[albumsPerSlide, numAlbums]) 
  
    // useEffect(() => {
    //   // console.log("num albums total:", numAlbums);
    //   console.log("albums per slide:", albumsPerSlide);
    //   // console.log("num odd albums:", oddAlbums);
    //   // console.log("number of slides index:", numSlidesIndex);
    // },[albumsPerSlide, numSlidesIndex])
  
    return (
      <div className='relative top-35'>
        {/* <h2 className="relative left-27 p-1 m-1 text-2xl">Projects</h2>s */}
        <HighlightsCarousel 
          numSlidesIndex={numSlidesIndex} 
          albumsPerSlide={albumsPerSlide}
          oddAlbums={oddAlbums}/>
      </div>
    )
  }

  return (
    <>
      <h1 className="relative top-10 flex justify-center items-center p-1 m-1 font-semibold">
        PHOTOGRAPHY
      </h1>
      <HighlightSection />
    </>
  )
}