import { createFileRoute, notFound } from '@tanstack/react-router'
import FilmLanding from '../components/film/film-landing'
import { filmConfig } from '../components/gallery/configs'

export const Route = createFileRoute('/film/$filmURL')({
  validateSearch: (search) => ({
    from: search.from !== undefined ? Number(search.from) : undefined,
  }),
  beforeLoad: ({ params }) => {
    const exists = filmConfig.data.some(
      (item) => item.url === params.filmURL,
    )
    if (!exists) throw notFound()
  },
  component: () => <FilmLanding />,
})
