import { createFileRoute } from '@tanstack/react-router'
import GalleryLanding from '../components/gallery/gallery-landing'
import { woodworkingConfig } from '../components/gallery/configs'

export const Route = createFileRoute('/woodworking/$woodURL')({
  validateSearch: (search) => ({
    from: search.from !== undefined ? Number(search.from) : undefined,
  }),
  component: () => <GalleryLanding config={woodworkingConfig} />,
})
