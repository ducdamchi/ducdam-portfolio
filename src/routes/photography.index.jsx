import { createFileRoute } from '@tanstack/react-router'
import Gallery from '../components/gallery/gallery'
import { photographyConfig } from '../components/gallery/configs'

export const Route = createFileRoute('/photography/')({
  validateSearch: (search) => ({
    returnTo:
      search.returnTo !== undefined ? Number(search.returnTo) : undefined,
  }),
  component: () => <Gallery config={photographyConfig} />,
})
