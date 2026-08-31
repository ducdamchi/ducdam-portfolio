import {
  createRootRoute,
  createRoute,
  createRouter,
  createHashHistory,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import './App.css'
import Gallery from './Components/Gallery/Gallery'
import Gallery_Landing from './Components/Gallery/Gallery_Landing'
import {
  photographyConfig,
  woodworkingConfig,
  filmConfig,
} from './Components/Gallery/configs'
import Film_Landing from './Components/Film/Film_Landing'
import About from './Components/About/About'
import Contact from './Components/Contact/Contact'

const rootRoute = createRootRoute({
  component: () => (
    <div className="bg-zinc-50">
      <div className="routes-container">
        <Outlet />
      </div>
    </div>
  ),
})

const validateGallerySearch = (search) => ({
  returnTo:
    search.returnTo !== undefined ? Number(search.returnTo) : undefined,
})

const validateLandingSearch = (search) => ({
  from: search.from !== undefined ? Number(search.from) : undefined,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/photography' })
  },
})

const photographyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/photography',
  validateSearch: validateGallerySearch,
  component: () => <Gallery config={photographyConfig} />,
})

const photographyLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/photography/$photoURL',
  validateSearch: validateLandingSearch,
  component: () => <Gallery_Landing config={photographyConfig} />,
})

const filmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/film',
  validateSearch: validateGallerySearch,
  component: () => <Gallery config={filmConfig} />,
})

const filmLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/film/$filmURL',
  validateSearch: validateLandingSearch,
  component: () => <Film_Landing />,
})

const woodworkingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/woodworking',
  validateSearch: validateGallerySearch,
  component: () => <Gallery config={woodworkingConfig} />,
})

const woodworkingLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/woodworking/$woodURL',
  validateSearch: validateLandingSearch,
  component: () => <Gallery_Landing config={woodworkingConfig} />,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
})

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  photographyRoute,
  photographyLandingRoute,
  filmRoute,
  filmLandingRoute,
  woodworkingRoute,
  woodworkingLandingRoute,
  aboutRoute,
  contactRoute,
])

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
})
