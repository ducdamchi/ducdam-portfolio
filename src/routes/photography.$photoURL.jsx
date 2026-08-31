import { createFileRoute, notFound } from '@tanstack/react-router'
import GalleryLanding from '../components/gallery/gallery-landing'
import { photographyConfig } from '../components/gallery/configs'

export const Route = createFileRoute('/photography/$photoURL')({
  validateSearch: (search) => ({
    from: search.from !== undefined ? Number(search.from) : undefined,
  }),
  beforeLoad: ({ params }) => {
    const exists = photographyConfig.data.some(
      (item) => item.url === params.photoURL,
    )
    if (!exists) throw notFound()
  },
  component: () => <GalleryLanding config={photographyConfig} />,
})
