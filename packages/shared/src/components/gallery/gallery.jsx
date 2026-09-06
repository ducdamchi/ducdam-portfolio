import Gallery_Carousel from './gallery-carousel'
import SectionTitle from '../section-title'

export default function Gallery({ config }) {
  const albumsData = config.data
  const filteredData = config.filterFn
    ? albumsData.filter(config.filterFn)
    : albumsData

  return (
    <>
      <div className="mt-25">
        <SectionTitle>{config.title}</SectionTitle>
      </div>
      <div className="mt-10 flex flex-grow justify-center">
        <Gallery_Carousel config={config} items={filteredData} />
      </div>
    </>
  )
}
