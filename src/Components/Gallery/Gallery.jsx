import NavSection from '../NavSection'
import Gallery_Carousel from './Gallery_Carousel'
import Footer from '../Footer'
import '../../App.css'

export default function Gallery({ config }) {
  const albumsData = config.data
  const filteredData = config.filterFn
    ? albumsData.filter(config.filterFn)
    : albumsData

  return (
    <div className="flex min-h-screen flex-col">
      <NavSection />

      <div className="mt-25 z-20 flex w-full items-center justify-center overflow-hidden p-5">
        <h1 className="m-1 flex w-auto items-center justify-center overflow-hidden rounded-xl border-0 bg-zinc-50 p-4 font-black">
          {config.title}
        </h1>
      </div>
      <div className="mt-10 flex flex-grow justify-center">
        <Gallery_Carousel config={config} items={filteredData} />
      </div>

      <Footer />
    </div>
  )
}
