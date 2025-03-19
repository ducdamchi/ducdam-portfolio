import { useState, useRef, useEffect } from 'react'
import './App.css'
import albumsData from './albums.json'
import HighlightsCarousel from './HighlightsCarousel';

export default function App() {
  // const numSlidesIndex
  function NavSection() {
    return (
      <div className='relative top-10'>
          {/* Logo section */}
          <div className="relative flex justify-center items-center p-1 m-1 text-xl">
            {/* <span className="homeButton-ghost"></span> */}
            <a href="index.html" target="_blank" rel="noopener noreferrer" className="bg-red-200 p-1 m-1">Logo</a>
            {/* <span class="home-button-real">Home</span> */}
          </div>

          {/* Navigation bar */}
          <nav className="relative flex justify-center items-center p-2 m-2 font-medium gap-2">
              <div className="navbar-item inline-block p-1 m-1">Photography</div>
              <div className="navbar-item inline-block p-1 m-1">Film</div>
              <div className="navbar-item inline-block p-1 m-1">Woodworking</div>
              <div className="navbar-item inline-block p-1 m-1">About</div>
          </nav>

          {/* Title of page currently browsed */}
          <h1 className="relative top-10 flex justify-center items-center p-1 m-1 font-semibold">PHOTOGRAPHY</h1>
      </div>
    )
  }

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
        console.log("Screen < 1200");
      } else if (screenWidth > 1024 && screenWidth < 1536) {
        setAlbumsPerSlide(2);
        console.log("1200 < Screen < 1600");
      } else if (screenWidth >= 1800) {
        setAlbumsPerSlide(3);
        console.log("Screen > 1600");
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

    useEffect(() => {
      // console.log("num albums total:", numAlbums);
      console.log("albums per slide:", albumsPerSlide);
      // console.log("num odd albums:", oddAlbums);
      // console.log("number of slides index:", numSlidesIndex);
    },[albumsPerSlide, numSlidesIndex])

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

  function AllProjectsSection() {
    return (
      <div className="allProjects">
        <h2 className="flex items-center p-1 m-1 text-lg">All Projects</h2>
      </div>
    )
  }

  return (
    <>
      <div className='relative'>
        <NavSection/>
        <HighlightSection/>

      </div>
    </>
  )
}