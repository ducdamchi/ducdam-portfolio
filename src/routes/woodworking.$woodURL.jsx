import { createFileRoute, notFound } from '@tanstack/react-router'
import GalleryLanding from '../components/gallery/gallery-landing'
import { woodworkingConfig } from '../components/gallery/configs'

export const Route = createFileRoute('/woodworking/$woodURL')({
  validateSearch: (search) => ({
    from: search.from !== undefined ? Number(search.from) : undefined,
  }),
  beforeLoad: ({ params }) => {
    const exists = woodworkingConfig.data.some(
      (item) => item.url === params.woodURL,
    )
    if (!exists) throw notFound()
  },
  component: () => <GalleryLanding config={woodworkingConfig} />,
})
