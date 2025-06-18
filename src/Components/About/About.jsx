import { useState, useRef, useEffect } from 'react'

import NavSection from '../NavSection'
import Footer from '../Footer'

export default function About() {
  return (
    <>
      <NavSection />

      <div className="relative top-10 flex w-[100vw] items-center justify-center border-2 border-yellow-500 p-5">
        <h1 className="m-1 flex items-center justify-center p-1 font-semibold">
          ABOUT
        </h1>
      </div>

      <div className="mb-[4rem] flex items-center justify-center">
        <div className="border-blue-505 relative top-20 flex h-[90vh] w-[35%] max-w-[800px] min-w-[320px] flex-col gap-2 border-1 p-2">
          <img src="about/about.jpg" alt="" />
          <div className="border-1 border-green-500 p-2">
            Duc Dam is a Vietnamese filmmaker and photographer based in Hanoi
            and Philadelphia. He coded this website in his free time.
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
              SCREENINGS: <br />
            </div>
            <div className="ml-5">
              A Short Film About Loving (2021): <br />
            </div>
            <div className="ml-5">
              OKIA Outdoor Cinema, Hanoi, Vietnam <br />
              Fulbright University, HCMC, Vietnam <br />
              Mahindra United World College, Pune, India <br />
              2020 Indie Shorts Awards, Cannes, France
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
