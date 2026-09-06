import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { SiteTransition } from '@ducdam/shared'

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <h1>Page not found</h1>
    </div>
  ),
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteTransition />
    <RouterProvider router={router} />
  </StrictMode>,
)
