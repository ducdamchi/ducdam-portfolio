# Woodworking Site Migration Plan

## Goal

Extract the Woodworking section from `sites/art/` into its own standalone site at `sites/wood/`, served at `wood.ducdam.com` (dev: `localhost:5176`).

---

## Current State

Woodworking lives entirely inside the art site:

| What | Location |
|---|---|
| Layout route | `sites/art/src/routes/woodworking.jsx` |
| Index route | `sites/art/src/routes/woodworking.index.jsx` |
| Landing route | `sites/art/src/routes/woodworking.$woodURL.jsx` |
| Config | `sites/art/src/components/gallery/configs.jsx` (`woodworkingConfig`) |
| Data | `sites/art/src/data/wood.json` |
| Static assets | `sites/art/public/woodworking/` (14 project folders, ~70 images) |
| Gallery components | `sites/art/src/components/gallery/` (shared with Photography & Film) |
| CSS | `sites/art/src/app.css` (`.wood-text` class), `gallery.css` |
| Navbar link | `sites/art/src/components/navbar.jsx` line 6: `{ to: '/woodworking', label: 'Woodworking' }` |

The gallery system (`gallery.jsx`, `gallery-landing.jsx`, `gallery-carousel.jsx`, `gallery-modal.jsx`, `gallery-card.jsx`, `gallery-thumbstrip.jsx`, `gallery-immersion.jsx`, `gallery-skeleton.jsx`, `gallery.css`) is config-driven and shared across Photography, Film, and Woodworking via a `config` prop.

---

## Key Decision: Gallery Components

The gallery system is currently art-site-specific but used by all three sections (Photography, Film, Woodworking). Once Woodworking moves out, the gallery must be accessible from both `sites/art/` and `sites/wood/`.

**Option A: Move gallery to `packages/shared/`**
- Pro: Single source of truth, both sites import from `@ducdam/shared`
- Con: Gallery is complex and tightly coupled to art-site patterns (app.css, react-icons, hooks). Increases shared package surface area significantly.

**Option B: Copy gallery into `sites/wood/`**
- Pro: Simple, no shared package changes, wood site is fully independent
- Con: Duplicate code. Divergence over time.

**Recommendation: Option A** — Move the gallery system to `packages/shared/`. It's already config-driven and parameterized, making it a natural shared component. The hooks it depends on (`useWindowSize`, `useDominantColor`) are already in shared. This also future-proofs for any other gallery-based sites.

---

## Step-by-Step Plan

### Step 1: Move gallery components to `packages/shared/`

**1a. Move files:**

```
sites/art/src/components/gallery/*  -->  packages/shared/src/components/gallery/*
```

Files to move:
- `gallery.jsx`
- `gallery-landing.jsx`
- `gallery-carousel.jsx`
- `gallery-modal.jsx`
- `gallery-card.jsx`
- `gallery-thumbstrip.jsx`
- `gallery-immersion.jsx`
- `gallery-skeleton.jsx`
- `gallery.css`

Do NOT move `configs.jsx` — configs are site-specific (each site defines its own).

**1b. Update gallery imports:**

The gallery components currently import from relative art-site paths. Update these:

| Current import | New import |
|---|---|
| `'../navbar'` | Remove — gallery shouldn't import Navbar (it's passed via page layout, not gallery internals) |
| `'../footer'` | Remove — same as above |
| `'../../app.css'` | Remove — gallery.css should be self-contained; site-level CSS imported at route level |
| `'@ducdam/shared'` (hooks) | `'../hooks/useWindowSize'` etc. (now local to shared package) |
| `'react-icons/bi'` | Keep as-is (add `react-icons` to shared's peerDependencies) |

**1c. Refactor `gallery.jsx` to not import Navbar/Footer:**

Currently `gallery.jsx` imports and renders `<Navbar />` and `<Footer />`. Instead, make it render only the gallery content. Each site's route wraps it with its own Navbar/Footer:

```jsx
// packages/shared/src/components/gallery/gallery.jsx
export default function Gallery({ config }) {
  const filteredData = config.filterFn
    ? config.data.filter(config.filterFn)
    : config.data

  return (
    <>
      <div className="mt-25 z-20 flex w-full items-center justify-center overflow-hidden p-5">
        <h1 className="...">{config.title}</h1>
      </div>
      <div className="mt-10 flex flex-grow justify-center">
        <Gallery_Carousel config={config} items={filteredData} />
      </div>
    </>
  )
}
```

Each site's route then does:
```jsx
<Navbar />
<Gallery config={woodworkingConfig} />
<Footer />
```

**1d. Export from shared barrel:**

Add to `packages/shared/src/index.js`:
```js
export { default as Gallery } from './components/gallery/gallery'
export { default as GalleryLanding } from './components/gallery/gallery-landing'
```

**1e. Update `packages/shared/package.json` peerDependencies:**

Add `react-icons` if gallery components use it (they do — `gallery-landing.jsx` imports from `react-icons/bi`).

### Step 2: Update art site to use shared gallery

**2a. Delete `sites/art/src/components/gallery/` (all files except `configs.jsx`).**

**2b. Move `configs.jsx` up** to `sites/art/src/components/gallery-configs.jsx` (or keep in a `gallery/` dir — just `configs.jsx` remains).

**2c. Update art route imports:**

```jsx
// sites/art/src/routes/woodworking.index.jsx (before removal in Step 4)
import { Gallery } from '@ducdam/shared'
import { woodworkingConfig } from '../components/gallery/configs'
```

Same pattern for `photography.index.jsx`, `film.index.jsx`, and all `$param` routes.

**2d. Update art route components to wrap Gallery with Navbar/Footer:**

Since Gallery no longer renders Navbar/Footer internally, each route must provide them:

```jsx
export const Route = createFileRoute('/photography/')({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Gallery config={photographyConfig} />
      <Footer />
    </div>
  ),
})
```

**2e. Verify art site works** — `pnpm dev:art`, test Photography, Film, and Woodworking pages.

### Step 3: Scaffold `sites/wood/`

Follow the same pattern as `sites/events/` (existing placeholder site).

**3a. Create directory structure:**

```
sites/wood/
  index.html
  package.json
  vite.config.js
  public/
    CNAME                    # wood.ducdam.com
    woodworking/             # moved from sites/art/public/woodworking/
  src/
    main.jsx
    index.css
    app.css
    components/
      navbar.jsx             # thin wrapper passing wood-specific navLinks
      footer.jsx             # re-export from shared
      not-found.jsx
      gallery-configs.jsx    # woodworkingConfig only
    data/
      wood.json              # moved from sites/art/src/data/wood.json
    routes/
      __root.jsx
      index.jsx              # gallery index (was woodworking.index.jsx)
      $woodURL.jsx           # gallery landing (was woodworking.$woodURL.jsx)
```

**3b. `package.json`:**

```json
{
  "name": "@ducdam/wood",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@ducdam/shared": "workspace:*",
    "@tailwindcss/vite": "^4.0.3",
    "@tanstack/react-router": "^1.170.32",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-icons": "^4.12.0",
    "tailwindcss": "^4.0.3"
  },
  "devDependencies": {
    "@tanstack/router-plugin": "^1.168.35",
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.5"
  }
}
```

**3c. `vite.config.js`:**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', routesDirectory: './src/routes' }),
    react(),
    tailwindcss(),
  ],
  base: '/',
  server: { port: 5176, strictPort: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ducdam/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
})
```

**3d. Routes:**

The wood site's routes are simpler — no `/woodworking` prefix needed since the whole site IS woodworking:

| Art site route | Wood site route | Path |
|---|---|---|
| `/woodworking/` | `/` | `routes/index.jsx` |
| `/woodworking/$woodURL` | `/$woodURL` | `routes/$woodURL.jsx` |

```jsx
// sites/wood/src/routes/index.jsx
import { createFileRoute } from '@tanstack/react-router'
import { Gallery } from '@ducdam/shared'
import { woodworkingConfig } from '../components/gallery-configs'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Gallery config={woodworkingConfig} />
      <Footer />
    </div>
  ),
})
```

```jsx
// sites/wood/src/routes/$woodURL.jsx
import { createFileRoute, notFound } from '@tanstack/react-router'
import { GalleryLanding } from '@ducdam/shared'
import { woodworkingConfig } from '../components/gallery-configs'

export const Route = createFileRoute('/$woodURL')({
  beforeLoad: ({ params }) => {
    const exists = woodworkingConfig.data.some(
      (item) => item.url === params.woodURL,
    )
    if (!exists) throw notFound()
  },
  component: () => <GalleryLanding config={woodworkingConfig} />,
})
```

**3e. `gallery-configs.jsx`:**

```jsx
import woodData from '../data/wood.json'

export const woodworkingConfig = {
  sectionName: '',          // root path now, not '/woodworking'
  title: 'WOODWORKING',
  urlParam: 'woodURL',
  filterFn: null,
  titleTransform: 'uppercase',
  metaFields: [
    { key: 'dimensions' },
    { key: 'materials' },
  ],
  data: woodData,
}
```

Note: `sectionName` changes from `'woodworking'` to `''` (or `'/'`) since projects are at the root path on the wood site. The "BACK" link in `gallery-landing.jsx` uses `/${config.sectionName}` — verify this resolves to `/` correctly.

**3f. Navbar wrapper:**

```jsx
// sites/wood/src/components/navbar.jsx
import { Navbar } from '@ducdam/shared'

const NAV_LINKS = [
  { to: '/', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function WoodNavbar() {
  return <Navbar currentSite="WOOD" navLinks={NAV_LINKS} />
}
```

**3g. `wood.json` asset paths:**

Currently `wood.json` references images as `"woodworking/01-oak-bench/img1.jpg"`. Since we're moving the assets to `sites/wood/public/woodworking/`, these paths stay valid as-is. Alternatively, flatten to `sites/wood/public/projects/01-oak-bench/img1.jpg` and update `wood.json` — but this is optional cleanup, not required.

### Step 4: Remove woodworking from art site

**4a. Delete route files:**
- `sites/art/src/routes/woodworking.jsx`
- `sites/art/src/routes/woodworking.index.jsx`
- `sites/art/src/routes/woodworking.$woodURL.jsx`

**4b. Remove from art navbar:**

```jsx
// sites/art/src/components/navbar.jsx — remove this line:
{ to: '/woodworking', label: 'Woodworking' },
```

**4c. Remove woodworking config from art's `configs.jsx`:**

Delete the `woodworkingConfig` export and the `import woodData` line.

**4d. Delete `sites/art/src/data/wood.json`.**

**4e. Move `sites/art/public/woodworking/` to `sites/wood/public/woodworking/`.**

**4f. Clean up `sites/art/src/app.css`** — remove `.wood-text` class if no longer used.

### Step 5: Update root workspace config

**5a. Add scripts to root `package.json`:**

```json
"dev:wood": "pnpm --filter @ducdam/wood dev",
"build:wood": "pnpm --filter @ducdam/wood build",
"deploy:wood": "pnpm build:wood && gh-pages -d sites/wood/dist --repo https://github.com/ducdamchi/wood-deploy.git"
```

Update `dev:all` to include `@ducdam/wood`.

**5b. Update `packages/shared/src/sites.js`:**

Already has WOOD entry at port 5176 and `wood.ducdam.com`. No change needed.

**5c. Run `pnpm install`** to register the new workspace.

### Step 6: Deploy setup

**6a. Create `ducdamchi/wood-deploy` repo on GitHub** (empty, for GitHub Pages).

**6b. DNS:** Add CNAME record `wood.ducdam.com` -> `ducdamchi.github.io`.

**6c. GitHub Pages settings** in `wood-deploy` repo: set custom domain to `wood.ducdam.com`.

**6d. Add `public/CNAME`** file with content `wood.ducdam.com`.

### Step 7: Verify

- [ ] `pnpm install` resolves all workspaces
- [ ] `pnpm dev:art` — Photography and Film work, no Woodworking link in navbar
- [ ] `pnpm dev:wood` — Gallery renders at `/`, landing pages at `/$woodURL`
- [ ] Subdomain picker navigates between art and wood sites
- [ ] `pnpm build:art` and `pnpm build:wood` both produce clean builds
- [ ] All images load correctly on the wood site
- [ ] "BACK" button on landing pages links to `/` (not `/woodworking`)
- [ ] 404 page works for invalid `$woodURL` values

---

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Gallery CSS conflicts when moved to shared | Gallery already uses `gallery.css` with specific class names. Import it from the shared package alongside the component. |
| `sectionName` change breaks "BACK" link | Test that `/${config.sectionName}` produces `/` (not `//`). May need to handle empty string case in `gallery-landing.jsx`. |
| `react-icons` resolution in shared package | Add to shared's `peerDependencies`. Each site already has it as a dependency. |
| SEO / existing links to `ducdam.com/woodworking` | Add a redirect from art site's `/woodworking` to `wood.ducdam.com` (optional, can be a simple redirect route). |
| Gallery refactor (removing Navbar/Footer) breaks art routes | Do Step 2 (update art routes) immediately after Step 1 and verify before proceeding. |

---

## Execution Order

```
Step 1  -->  Move gallery to shared package        (most impactful, do first)
Step 2  -->  Update art site imports                (must follow Step 1 immediately)
Step 3  -->  Scaffold wood site                     (independent after Step 2)
Step 4  -->  Remove woodworking from art site       (after Step 3 verified working)
Step 5  -->  Root config updates                    (quick, parallel with Step 3-4)
Step 6  -->  Deploy setup                           (independent, can do anytime)
Step 7  -->  End-to-end verification
```

Steps 1-2 are the core risk. Get those working before touching anything else.
