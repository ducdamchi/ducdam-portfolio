import { createFileRoute } from '@tanstack/react-router'
import { Gallery } from '@ducdam/shared'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { photographyConfig } from '../components/gallery/configs'

export const Route = createFileRoute('/photography/')({
  validateSearch: (search) => ({
    returnTo:
      search.returnTo !== undefined ? Number(search.returnTo) : undefined,
  }),
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Gallery config={photographyConfig} />
      <Footer />
    </div>
  ),
})
