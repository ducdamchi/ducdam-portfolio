import { createFileRoute } from '@tanstack/react-router'
import Gallery from '../components/gallery/gallery'
import { filmConfig } from '../components/gallery/configs'

export const Route = createFileRoute('/film')({
  validateSearch: (search) => ({
    returnTo:
      search.returnTo !== undefined ? Number(search.returnTo) : undefined,
  }),
  component: () => <Gallery config={filmConfig} />,
})
