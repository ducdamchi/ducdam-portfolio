import { createFileRoute } from '@tanstack/react-router'
import { About } from '@ducdam/shared'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

export const Route = createFileRoute('/about')({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <About />
      <Footer />
    </div>
  ),
})
