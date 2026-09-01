# ducdam-portfolio (monorepo)

Multi-site portfolio for Duc Dam. Art portfolio at ducdam.com, with planned sites at celebs.ducdam.com and cs.ducdam.com.

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
  tsconfig.json             # Shared TypeScript config
  packages/
    shared/                 # @ducdam/shared — shared components & hooks
      src/
        components/
          navbar.jsx        # Parameterized navbar (currentSite, navLinks props)
          footer.jsx        # Footer with GitHub link
        hooks/
          useWindowSize.js
          useDominantColor.js
        styles/
          shared.css        # Shared font stacks, nav modal styles
        index.js            # Barrel export
  sites/
    art/                    # @ducdam/art — ducdam.com (main art portfolio)
      vite.config.js
      src/
        main.jsx
        routes/             # TanStack file-based routes
        components/
          navbar.jsx        # Thin wrapper: passes art-specific navLinks to shared Navbar
          footer.jsx        # Re-export from shared
          gallery/          # Gallery system (carousel, modal, cards, configs)
          film/             # Film-specific components
        data/               # photo.json, film.json, wood.json
      public/               # Static assets (photography/, film/)
    celebs/                 # @ducdam/celebs — celebs.ducdam.com (placeholder)
    cs/                     # @ducdam/cs — cs.ducdam.com (placeholder)
```

## Key Patterns

- **Carousel**: Clone-based infinite loop carousel shared across Photography, Film, and Woodworking. See `docs/carousel-architecture.md`.
- **Three-layer component pattern**: Parent (layout metrics) -> Controller (navigation state) -> Renderer (items + transforms).
- **Shared navbar**: `packages/shared` Navbar accepts `currentSite` and `navLinks` props. Each site wraps it with site-specific config.
- **Content data**: Album/film/wood metadata in `sites/art/src/data/`.
- **Portals**: Modals render via React portals (`#portal` div in index.html).

## Routes (art site)

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

- `pnpm dev:art` - Start art site dev server
- `pnpm dev:celebs` - Start celebs site dev server
- `pnpm dev:cs` - Start CS site dev server
- `pnpm build:art` - Build art site for production
- `pnpm build:celebs` - Build celebs site
- `pnpm build:cs` - Build CS site
- `pnpm -r lint` - Lint all workspaces

## Conventions

- Single quotes, no semicolons (Prettier config)
- JSX files use `.jsx` extension
- Path alias: `@` maps to `./src` (per site), `@ducdam/shared` maps to shared package
- Component filenames use lowercase kebab-case (e.g., `gallery-landing.jsx`)
- CSS is a mix of Tailwind utility classes and component-scoped CSS files
