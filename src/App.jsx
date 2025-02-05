import { useState } from 'react'
import './App.css'

export default function App() {
  // const [count, setCount] = useState(0)

  return (
    <>

      {/* Entire page header */}
      <div className="navSection">

        {/* Logo section */}
        <div className="flex justify-center items-center p-2 m-2">
          {/* <span className="homeButton-ghost"></span> */}
          <a href="index.html" target="_blank" rel="noopener noreferrer" className="bg-red-200 p-2 m-1">Logo</a>
          {/* <span class="home-button-real">Home</span> */}
        </div>

        {/* Navigation bar */}
        <nav className="flex justify-center items-center">
          <ul>
            <li class="inline-block p-2 m-1 bg-neutral-300">Photography</li>
            <li class="inline-block p-2 m-1 bg-neutral-300">Film</li>
            <li class="inline-block p-2 m-1 bg-neutral-300">Woodworking</li>
            <li class="inline-block p-2 m-1 bg-neutral-300">About</li>
          </ul>
        </nav>
      </div>

      <h1 className="">Photography</h1>

      <div className="">
        <h2 className="">Highlights</h2>

        {/* Making infinite loop carousel */}
        <div className="carousel">
          <button 
            id="arrowLeft" 
            className="arrow"
            onClick="">
            &#8249;
          </button>

          {/* TODO: How to automatically detect folders and render thumbnails?
          Hard coding images for now */}
          <div className="carousel-images">
            <div className="thumbnail">
              <img className="thumbnail-img" src="./photography/ex1/img5.jpg"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img" src="./photography/ex2/img9.jpg"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img" src="./photography/ex3/img1.JPG"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img" src="./photography/ex4/img1.jpg"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img" src="./photography/ex5/img1.png"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img" src="./photography/ex6/img1.jpg"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img" src="./photography/ex7/img1.jpg"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img" src="./photography/ex8/img1.JPG"/>
            </div>
            <div className="thumbnail">
              <img className="thumbnail-img" src="./photography/ex9/img1.jpg"/>
            </div>
        </div>


          <button id="arrowRight" className="arrow">
            &#8250;
          </button>
        </div>
      </div>


      <div className="allProjects">
        <h2 className="sectionTitle">All Projects</h2>
      </div>


    </>
  )
}