import { createRootRoute, Outlet } from '@tanstack/react-router'
import NotFound from '../components/not-found'
import '../app.css'

export const Route = createRootRoute({
  component: () => (
    <div className="bg-zinc-50">
      <div className="routes-container">
        <Outlet />
      </div>
    </div>
  ),
  notFoundComponent: NotFound,
})
