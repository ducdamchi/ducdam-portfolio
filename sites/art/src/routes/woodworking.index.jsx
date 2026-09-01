import { createFileRoute } from '@tanstack/react-router'
import Gallery from '../components/gallery/gallery'
import { woodworkingConfig } from '../components/gallery/configs'

export const Route = createFileRoute('/woodworking/')({
  validateSearch: (search) => ({
    returnTo:
      search.returnTo !== undefined ? Number(search.returnTo) : undefined,
  }),
  component: () => <Gallery config={woodworkingConfig} />,
})
