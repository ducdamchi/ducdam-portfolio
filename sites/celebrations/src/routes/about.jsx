import { createFileRoute } from '@tanstack/react-router'
import { About, Navbar, Footer } from '@ducdam/shared'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export const Route = createFileRoute('/about')({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Navbar currentSite="CELEBRATIONS" navLinks={NAV_LINKS} />
      <About />
      <Footer />
    </div>
  ),
})
