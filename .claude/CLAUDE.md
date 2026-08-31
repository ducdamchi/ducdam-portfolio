# ducdam-portfolio

Art & creative portfolio website for Duc Dam, deployed at ducdam.com.

## Tech Stack

- **Framework**: React 18 with Vite 6
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin), custom CSS
- **Routing**: TanStack Router v1 with hash history
- **Icons**: react-icons, lucide-react
- **UI**: shadcn/ui primitives (button, flickering-grid), class-variance-authority
- **Formatting**: Prettier with tailwindcss + css-order plugins (config in package.json)
- **Deploy**: GitHub Pages via gh-pages

## Project Structure

```
src/
  router.jsx           # TanStack Router route tree + root layout
  App.css              # Global styles + Tailwind imports
  main.jsx             # Entry point (RouterProvider)
  index.css            # Base styles
  Components/
    NavSection.jsx     # Responsive navbar (desktop + hamburger mobile)
    Footer.jsx         # Fixed footer with social links
    Photography/       # Photo gallery section
      Photography.jsx  # Grid listing page
      Photo_Landing.jsx # Individual album view
      Photo_Carousel.jsx # Carousel controller
      Photo_Items.jsx  # Carousel renderer
      Photo_Modal.jsx  # Fullscreen image modal
      albums.json      # Album metadata
    Film/              # Film portfolio section
      Film.jsx         # Grid listing page
      Film_Landing.jsx # Individual film view
      Film_Carousel.jsx # Carousel controller
      Film_Items.jsx   # Carousel renderer
      Film_Modal.jsx   # Fullscreen image modal
      Film_Modal_Press.jsx # Press gallery modal
      films.json       # Film metadata
    Woodworking/       # Woodworking section (mirrors Photography structure)
    About/             # About page
    Contact/           # Contact page
    Home/              # Home page (currently unused)
    ui/                # shadcn/ui components
public/
  photography/         # Photo album images organized by collection
  film/                # Film assets (posters, press galleries, previews)
  CNAME                # Custom domain config (ducdam.com)
docs/
  carousel-architecture.md  # Detailed carousel implementation docs
```

## Key Patterns

- **Carousel**: Clone-based infinite loop carousel shared across Photography, Film, and Woodworking. See `docs/carousel-architecture.md` for full architecture.
- **Three-layer component pattern**: Parent (layout metrics) -> Controller (navigation state) -> Renderer (items + transforms). Used in all gallery sections.
- **Content data**: Album/film/wood metadata stored in `src/data/` (photo.json, film.json, wood.json).
- **Responsive**: Hamburger nav below 768px, variable items-per-slide in carousels.
- **Portals**: Modals render via React portals (`#portal` div in index.html).

## Routes

| Path | Component |
|---|---|
| `/` | Photography |
| `/photography` | Photography |
| `/photography/:photoURL` | Photo_Landing |
| `/film` | Film |
| `/film/:filmURL` | Film_Landing |
| `/woodworking` | Woodworking |
| `/woodworking/:woodURL` | Wood_Landing |
| `/about` | About |
| `/contact` | Contact |

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Run ESLint

## Conventions

- Single quotes, no semicolons (Prettier config)
- JSX files use `.jsx` extension, UI primitives use `.tsx`
- Path alias: `@` maps to `./src`
- Component filenames use PascalCase with underscores (e.g., `Photo_Landing.jsx`)
- CSS is a mix of Tailwind utility classes and component-scoped CSS files

## Future Plans

- Monorepo restructure: multiple sites under subdomains (ducdam.com, celebs.ducdam.com, cs.ducdam.com)
- Shared packages extracted to `packages/shared/` for reusable components
