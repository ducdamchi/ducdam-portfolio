import { useState, useRef, useEffect } from 'react'

import NavSection from '../NavSection'
import Footer from '../Footer'
import '../../App.css'

export default function About() {
  return (
    <>
      <NavSection />

      <div className="relative top-10 flex w-[100vw] items-center justify-center border-2 border-yellow-500 p-5">
        <h1 className="m-1 flex items-center justify-center p-1 font-semibold">
          ABOUT
        </h1>
      </div>

      <div className="about-text mb-[4rem] flex items-center justify-center">
        <div className="relative top-20 flex h-[90vh] w-[35%] max-w-[800px] min-w-[320px] flex-col gap-2 p-2">
          <img src="about/about.jpg" alt="" />
          <div className="border-1 border-green-500 p-2">
            Duc Dam is a Vietnamese filmmaker and photographer based in Hanoi
            and Philadelphia. He developed an interest for web design in college
            and coded this site in his free time.
          </div>
          <div className="border-1 border-green-500 p-2">
            <div>
              EDUCATION: <br />
            </div>
            <div className="ml-5">
              Swarthmore College, B.A. Computer Science and Chinese <br />
              Mahindra United World College in India, International
              Baccalaureate
            </div>
          </div>
          <div className="border-1 border-green-500 p-2">
            <div>
              EVENTS: <br />
            </div>
            <div className="ml-5">
              A Short Film About Loving (2021) screenings: <br />
            </div>
            <div className="ml-8">
              &#x2022; OKIA Outdoor Cinema, Hanoi, Vietnam <br />
              &#x2022; Fulbright University, HCMC, Vietnam <br />
              &#x2022; Mahindra United World College, Pune, India <br />
              &#x2022; 2020 Indie Shorts Awards, Cannes, France
            </div>
          </div>
        </div>
      </div>

      <div className="relative bottom-0 z-0 h-[20rem] border-1 border-blue-500"></div>

      <Footer />
    </>
  )
}
