import { createFileRoute } from '@tanstack/react-router'
import Navbar from '../components/navbar'
import { Footer } from '@ducdam/shared'
import GridGallery from '../components/gallery/grid-gallery'
import { celebrationsConfig } from '../components/gallery/configs'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />
      <GridGallery
        config={celebrationsConfig}
        allAlbums={celebrationsConfig.data}
      />
      <Footer />
    </div>
  ),
})
