# ducdam-portfolio (monorepo)

Multi-site portfolio for Duc Dam.

## Sites

| Label | Domain | Dev Port | Package |
|---|---|---|---|
| HOME | `ducdam.com` | 5173 | `@ducdam/art` |
| EVENTS | `events.ducdam.com` | 5174 | `@ducdam/events` |
| DEV | `dev.ducdam.com` | 5175 | `@ducdam/dev` |
| WOOD | `wood.ducdam.com` | 5176 | `@ducdam/wood` |

## Tech Stack

- **Package manager**: pnpm with workspaces
- **Framework**: React 18 with Vite 6
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin), custom CSS
- **Routing**: TanStack Router v1 (file-based routing)
- **Icons**: react-icons, lucide-react
- **UI**: shadcn/ui primitives, class-variance-authority
- **Formatting**: Prettier with tailwindcss + css-order plugins
- **Deploy**: GitHub Pages via gh-pages (separate deploy repos per site)

## Monorepo Structure

```
/
  package.json              # Root workspace orchestrator (pnpm)
  pnpm-workspace.yaml       # Workspace config
  .npmrc                    # pnpm settings (shamefully-hoist for now)
  eslint.config.js          # Shared ESLint config
  packages/
    shared/                 # @ducdam/shared — shared components & hooks
      src/
        components/
          navbar.jsx        # Parameterized navbar (currentSite, navLinks props)
          footer.jsx        # Footer with GitHub link
          site-brand.jsx    # Site name + DUC DAM branding
          subdomain-picker.jsx  # Scroll wheel site switcher
          site-transition.jsx   # Cross-site transition overlay
          gallery/          # Shared gallery system (carousel, modal, cards)
        hooks/
          useWindowSize.js
          useDominantColor.js
        styles/
          shared.css        # Shared font stacks, nav modal styles
        sites.js            # Dev/prod URL mappings for all sites
        index.js            # Barrel export
  sites/
    art/                    # @ducdam/art — ducdam.com (HOME)
      src/
        routes/             # TanStack file-based routes
        components/
          navbar.jsx        # Thin wrapper: passes HOME-specific navLinks
          footer.jsx        # Re-export from shared
          gallery/configs.jsx  # Photography, Film, Woodworking configs
          film/             # Film-specific components
        data/               # photo.json, film.json, wood.json
      public/               # Static assets (photography/, film/, woodworking/)
    wood/                   # @ducdam/wood — wood.ducdam.com
      src/
        routes/             # / (gallery), /$woodURL (landing)
        components/
          navbar.jsx        # WOOD navLinks
          gallery-configs.jsx  # Woodworking config
        data/wood.json
      public/woodworking/   # Woodworking images
    events/                 # @ducdam/events — events.ducdam.com (placeholder)
    dev/                    # @ducdam/dev — dev.ducdam.com (placeholder)
```

## Key Patterns

- **Gallery system**: Config-driven, lives in `packages/shared/src/components/gallery/`. Carousel, modal, cards, landing pages. Each site defines its own config (data, fields, URL params).
- **Carousel**: Clone-based infinite loop carousel. See `docs/carousel-architecture.md`.
- **Three-layer component pattern**: Parent (layout metrics) -> Controller (navigation state) -> Renderer (items + transforms).
- **Shared navbar**: `packages/shared` Navbar accepts `currentSite` and `navLinks` props. Each site wraps it with site-specific config.
- **Subdomain picker**: Scroll wheel in navbar for switching between sites. Uses URL query params for cross-site transition state.
- **Content data**: Album/film/wood metadata in each site's `src/data/`.
- **Portals**: Modals render via React portals (`#portal` div in index.html).

## Routes (art/HOME site)

| Path | Component |
|---|---|
| `/` | Redirect to /photography |
| `/photography` | Gallery (photographyConfig) |
| `/photography/:photoURL` | GalleryLanding |
| `/film` | Gallery (filmConfig) |
| `/film/:filmURL` | Film_Landing |
| `/woodworking` | Gallery (woodworkingConfig) |
| `/woodworking/:woodURL` | GalleryLanding |
| `/about` | About |
| `/contact` | Contact |

## Routes (wood site)

| Path | Component |
|---|---|
| `/` | Gallery (woodworkingConfig) |
| `/:woodURL` | GalleryLanding |

## Commands

- `pnpm dev:art` - Start HOME site dev server (port 5173)
- `pnpm dev:wood` - Start WOOD site dev server (port 5176)
- `pnpm dev:events` - Start EVENTS site dev server (port 5174)
- `pnpm dev:dev` - Start DEV site dev server (port 5175)
- `pnpm dev:all` - Start all sites simultaneously
- `pnpm build:art` / `build:wood` / `build:events` / `build:dev` - Build sites
- `pnpm -r lint` - Lint all workspaces

## Conventions

- Single quotes, no semicolons (Prettier config)
- JSX files use `.jsx` extension
- Path alias: `@` maps to `./src` (per site), `@ducdam/shared` maps to shared package
- Component filenames use lowercase kebab-case (e.g., `gallery-landing.jsx`)
- CSS is a mix of Tailwind utility classes and component-scoped CSS files
