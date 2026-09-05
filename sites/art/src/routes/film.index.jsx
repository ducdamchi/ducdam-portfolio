import { createFileRoute } from '@tanstack/react-router'
import { Gallery } from '@ducdam/shared'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { filmConfig } from '../components/gallery/configs'

export const Route = createFileRoute('/film/')({
  validateSearch: (search) => ({
    returnTo:
      search.returnTo !== undefined ? Number(search.returnTo) : undefined,
  }),
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Gallery config={filmConfig} />
      <Footer />
    </div>
  ),
})
