import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { SiteTransition } from '@ducdam/shared'

import NotFound from './components/not-found'

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteTransition />
    <RouterProvider router={router} />
  </StrictMode>,
)
