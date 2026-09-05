import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar, Footer } from '@ducdam/shared'
import '../app.css'

const NAV_LINKS = [{ to: '/', label: 'Home' }]

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-zinc-50">
      <Navbar currentSite="SCULPT" navLinks={NAV_LINKS} />
      <div className="pt-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  ),
})
