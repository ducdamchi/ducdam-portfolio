import { useRef } from 'react'
import NavSection from '../NavSection'
import Footer from '../Footer'
import aboutData from '../../../public/about.json'
import { useDominantColor } from '../../hooks/useDominantColor'
import '../../App.css'
import './About.css'

export default function About() {
  const imgRef = useRef(null)

  const colorData = useDominantColor(imgRef, { deps: [] })
  const bgColor = colorData
    ? (() => {
        const [c0, c1, c2] = colorData.color
        const r = Math.round(240 + (c0 - 240) * 0.12)
        const g = Math.round(240 + (c1 - 240) * 0.12)
        const b = Math.round(240 + (c2 - 240) * 0.12)
        return `rgb(${r}, ${g}, ${b})`
      })()
    : 'rgb(250, 250, 250)'

  return (
    <div className="flex min-h-screen flex-col">
      <NavSection />

      <div className="mt-25 flex w-[100vw] items-center justify-center p-5">
        <h1 className="m-1 flex w-auto items-center justify-center overflow-hidden rounded-none border-0 bg-zinc-50 p-4 font-black">
          ABOUT
        </h1>
      </div>

      <div className="about-text mt-5 flex flex-grow items-center justify-center pb-10">
        <div className="relative flex h-auto w-[50%] max-w-[540px] min-w-[320px] flex-col gap-4 p-2">
          <img
            ref={imgRef}
            crossOrigin="anonymous"
            src={aboutData.image}
            alt=""
            className="rounded-none border-1"
          />
          <div
            className="rounded-none border-1 p-4 text-zinc-900"
            style={{ backgroundColor: bgColor }}
          >
            {aboutData.bio.map((paragraph, i) => (
              <span key={i}>
                {i > 0 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
                {paragraph}
              </span>
            ))}
          </div>
          <div
            className="rounded-none border-1 p-4 text-zinc-900"
            style={{ backgroundColor: bgColor }}
          >
            <div>
              EDUCATION: <br />
            </div>
            <div className="ml-5">
              {aboutData.education.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
