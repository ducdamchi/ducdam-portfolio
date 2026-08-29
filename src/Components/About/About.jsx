import { useState, useRef, useEffect } from 'react'
import NavSection from '../NavSection'
import Footer from '../Footer'
import aboutData from '../../../public/about.json'
import '../../App.css'
import './About.css'

export default function About() {
  const imgRef = useRef(null)
  const [bgColor, setBgColor] = useState('rgb(250, 250, 250)')

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const extractColor = () => {
      try {
        const colorThief = new ColorThief()
        const color = colorThief.getColor(img)
        const brightness = Math.round(
          Math.sqrt(
            color[0] * color[0] * 0.241 +
              color[1] * color[1] * 0.691 +
              color[2] * color[2] * 0.068,
          ),
        )
        const r = Math.round(240 + (color[0] - 240) * 0.12)
        const g = Math.round(240 + (color[1] - 240) * 0.12)
        const b = Math.round(240 + (color[2] - 240) * 0.12)
        setBgColor(`rgb(${r}, ${g}, ${b})`)
      } catch (err) {
        console.warn('ColorThief error:', err)
      }
    }

    if (img.complete && img.naturalHeight !== 0) {
      extractColor()
    } else {
      img.addEventListener('load', extractColor)
      return () => img.removeEventListener('load', extractColor)
    }
  }, [])

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
