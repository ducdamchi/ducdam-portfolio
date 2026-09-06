import { createFileRoute } from '@tanstack/react-router'
import { Contact } from '@ducdam/shared'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

export const Route = createFileRoute('/contact')({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Contact />
      <Footer />
    </div>
  ),
})
