import { createFileRoute } from '@tanstack/react-router'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import aboutData from '../../public/about.json'
import '../app.css'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="mt-25 flex w-[100vw] items-center justify-center p-5">
        <h1 className="m-1 flex w-auto items-center justify-center overflow-hidden rounded-none border-0 bg-zinc-50 p-4 font-black">
          ABOUT
        </h1>
      </div>

      <div className="about-text mt-5 flex flex-grow items-center justify-center pb-10">
        <div className="relative flex h-auto w-[50%] max-w-[540px] min-w-[320px] flex-col gap-4 p-2">
          <img
            src={aboutData.image}
            alt=""
            className="rounded-none border-1"
          />
          <div className="info-box-gradient rounded-none border-1 p-4 text-zinc-900">
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
          <div className="info-box-gradient rounded-none border-1 p-4 text-zinc-900">
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
