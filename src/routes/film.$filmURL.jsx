import { createFileRoute } from '@tanstack/react-router'
import FilmLanding from '../components/film/film-landing'

export const Route = createFileRoute('/film/$filmURL')({
  validateSearch: (search) => ({
    from: search.from !== undefined ? Number(search.from) : undefined,
  }),
  component: () => <FilmLanding />,
})
