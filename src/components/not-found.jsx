import { Link } from '@tanstack/react-router'
import NavSection from './nav-section'
import Footer from './footer'
import '../app.css'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavSection />

      <div className="mt-25 flex w-[100vw] items-center justify-center p-5">
        <h1 className="m-1 flex w-auto items-center justify-center overflow-hidden rounded-none border-0 bg-zinc-50 p-4 font-black">
          PAGE NOT FOUND
        </h1>
      </div>

      <div className="contact-all mt-5 flex flex-grow flex-col items-center justify-center gap-4 pb-10">
        <p>The page you're looking for doesn't exist.</p>
        <Link
          to="/photography"
          className="rounded-none border-1 bg-zinc-50 p-2 px-4 transition-colors duration-200 hover:bg-black hover:text-white"
        >
          Go Home
        </Link>
      </div>

      <Footer />
    </div>
  )
}
