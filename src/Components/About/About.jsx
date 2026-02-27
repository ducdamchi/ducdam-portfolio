import { useState, useRef, useEffect } from 'react'
import NavSection from '../NavSection'
import Footer from '../Footer'
import '../../App.css'
import './About.css'

export default function About() {
  return (
    <>
      <NavSection />

      <div className="relative top-25 flex w-[100vw] items-center justify-center p-5">
        <h1 className="m-1 flex w-auto items-center justify-center overflow-hidden rounded-none border-0 bg-zinc-50 p-4 font-black">
          ABOUT
        </h1>
      </div>

      <div className="about-text mt-30 flex h-auto items-center justify-center pb-30">
        <div className="relative flex h-auto w-[50%] max-w-[540px] min-w-[320px] flex-col gap-4 p-2">
          <img src="about/about.jpg" alt="" className="rounded-none border-1" />
          <div className="rounded-none border-1 bg-zinc-50 p-4">
            DUC DAM is a Vietnamese filmmaker and photographer born in Hanoi and
            based Philadelphia. His work deals with themes of separation, exile,
            and curious encounters that defy national borders. <br />
            <br /> His 2021 experimental documentary, A SHORT FILM ABOUT LOVING,
            was shot on an international campus in rural Maharashtra, India,
            where he studied Philosophy & Film. It told the stories of young
            lovers facing separation during Covid, and was officially selected
            for Cannes Indie Shorts Award.
            <br />
            <br />
            Following successful screenings of his first film in Hanoi, Ho Chi
            Minh City, Pune, and Cannes, Duc continued to travel internationally
            to work on photo essays in India, Japan, Mexico and the USA.
            <br />
            <br />
            Last year, he graduated from Swarthmore College, Pennsylvania, with
            a major in Computer Science and a minor in Chinese. He continues to
            work with visual productions, while working day time as a software
            engineer.
          </div>
          <div className="rounded-none border-1 bg-zinc-50 p-4">
            <div>
              EDUCATION: <br />
            </div>
            <div className="ml-5">
              Swarthmore College | BA - Computer Science and Chinese <br />
              Mahindra United World College in India | IB - Math, Philosophy,
              Film Studies
            </div>
          </div>
          {/* <div className="p-2">
            <div>
              EVENTS: <br />
            </div>
            <div className="ml-5">
              A Short Film About Loving (2021) past screenings: <br />
            </div>
            <div className="ml-8">
              &#x2022; 2020 Cannes Indie Shorts Awards, Cannes, France <br />
              &#x2022; OKIA Outdoor Cinema, Hanoi, Vietnam <br />
              &#x2022; Fulbright University, HCMC, Vietnam <br />
              &#x2022; Mahindra United World College, Pune, India
            </div>
          </div> */}
        </div>
      </div>

      {/* <div className="relative bottom-0 z-0 h-[20rem] border-blue-500"></div> */}

      <Footer />
    </>
  )
}
