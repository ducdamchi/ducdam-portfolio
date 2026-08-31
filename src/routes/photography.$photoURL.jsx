import { createFileRoute } from '@tanstack/react-router'
import GalleryLanding from '../components/gallery/gallery-landing'
import { photographyConfig } from '../components/gallery/configs'

export const Route = createFileRoute('/photography/$photoURL')({
  validateSearch: (search) => ({
    from: search.from !== undefined ? Number(search.from) : undefined,
  }),
  component: () => <GalleryLanding config={photographyConfig} />,
})
