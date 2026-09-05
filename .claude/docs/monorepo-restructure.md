# Monorepo Restructure Plan

## Goal

Convert the current single-app repo into a monorepo hosting multiple sites under subdomains, with shared components extracted into a common package.

**Sites:**
| Subdomain | Content | Label |
|---|---|---|
| `ducdam.com` (root) | Art portfolio (current app) | ART |
| `celebs.ducdam.com` | Weddings/events photography | WEDDINGS |
| `cs.ducdam.com` | CS portfolio / projects | CS |

---

## Current State

The repo is a single Vite + React app at the root:

```
/
  package.json
  vite.config.js
  public/            # static assets (photography/, film/, woodworking/)
  src/
    main.jsx         # entry point
    routeTree.gen.ts  # TanStack Router generated tree
    routes/          # file-based route definitions
    components/
      navbar.jsx
      footer.jsx
      not-found.jsx
      gallery/       # shared gallery system (carousel, modal, cards, configs)
      film/          # film-specific components
    hooks/           # useWindowSize, useDominantColor
    data/            # photo.json, film.json, wood.json
```

Key dependencies: React 18, Vite 6, TanStack Router v1, Tailwind CSS v4, shadcn/ui primitives, gh-pages.

Deploy: `npm run deploy` → `gh-pages -d dist` → GitHub Pages with custom domain `ducdam.com`.

---

## Target Structure

```
/
  package.json              # root workspace config (npm workspaces)
  packages/
    shared/
      package.json          # name: @ducdam/shared
      src/
        components/
          navbar.jsx        # shared navbar (with subdomain picker)
          footer.jsx
          not-found.jsx
          ui/               # shadcn primitives (button, flickering-grid)
        hooks/
          useWindowSize.js
          useDominantColor.js
        styles/
          shared.css        # shared font rules, nav styles, base variables
        index.js            # barrel export
  sites/
    art/
      package.json          # name: @ducdam/art, depends on @ducdam/shared
      vite.config.js
      public/               # photography/, film/, woodworking/ assets
      src/
        main.jsx
        routes/             # TanStack file-based routes (same as current)
        components/
          gallery/          # gallery system stays here (art-specific)
          film/             # film components stay here
        data/               # photo.json, film.json, wood.json
        app.css             # art-site-specific styles + imports shared.css
    celebs/
      package.json          # name: @ducdam/celebs, depends on @ducdam/shared
      vite.config.js
      public/
      src/
        main.jsx            # minimal placeholder
        routes/
        app.css
    cs/
      package.json          # name: @ducdam/cs, depends on @ducdam/shared
      vite.config.js
      public/
      src/
        main.jsx            # minimal placeholder
        routes/
        app.css
```

---

## Step-by-Step Plan

### Step 1: Migrate to pnpm and set up workspaces

**1a. Install pnpm and convert lockfile:**
```bash
npm install -g pnpm          # or: corepack enable && corepack prepare pnpm@latest --activate
pnpm import                  # converts package-lock.json → pnpm-lock.yaml
rm package-lock.json         # remove npm lockfile
rm -rf node_modules          # clean install from scratch
```

**1b. Create `pnpm-workspace.yaml` at repo root:**
```yaml
packages:
  - 'packages/*'
  - 'sites/*'
```

**1c. Update root `package.json`:**
- Remove `"workspaces"` field if present (pnpm uses `pnpm-workspace.yaml` instead)
- Move root-level dev tooling config (Prettier, ESLint) to root so all sites inherit it
- Root `package.json` keeps only workspace orchestration — no app dependencies
- Add `"packageManager": "pnpm@10"` field so corepack enforces pnpm for contributors

**1d. Add `.npmrc` at repo root:**
```ini
# Hoist peer dependencies so Vite/React resolve correctly across workspaces
shamefully-hoist=true
```
Note: `shamefully-hoist=true` relaxes pnpm's strict isolation to match npm behavior. Start with this for a smooth migration. Once everything works, try removing it and fixing any resolution errors to get pnpm's strict isolation benefits.

**1e. Install and verify:**
```bash
pnpm install                 # creates pnpm-lock.yaml + node_modules
pnpm dev                     # confirm dev server works before proceeding
pnpm build                   # confirm production build works
```

**1f. Update deploy and CI scripts:**
- Replace all `npm run` with `pnpm` in scripts, README, CI
- Workspace commands use `pnpm --filter`: e.g. `pnpm --filter @ducdam/art dev`
- Deploy scripts in root `package.json`:
  ```json
  "scripts": {
    "dev:art": "pnpm --filter @ducdam/art dev",
    "build:art": "pnpm --filter @ducdam/art build",
    "deploy:art": "pnpm build:art && gh-pages -d sites/art/dist --repo https://github.com/ducdamchi/art-deploy.git"
  }
  ```

**1g. Update `.gitignore`:**
- Already ignores `node_modules/` (no change needed)
- Remove `package-lock.json` if it was tracked
- Ensure `pnpm-lock.yaml` is committed

### Step 2: Create `packages/shared/`

Extract from the current app into `packages/shared/src/`:

| Current location | Shared package location | Notes |
|---|---|---|
| `src/components/navbar.jsx` | `components/navbar.jsx` | Will accept `currentSite` and `navLinks` as props |
| `src/components/footer.jsx` | `components/footer.jsx` | Already generic |
| `src/components/not-found.jsx` | `components/not-found.jsx` | Already generic |
| `src/components/ui/*` | `components/ui/*` | shadcn primitives |
| `src/hooks/useWindowSize.js` | `hooks/useWindowSize.js` | Already generic |
| `src/hooks/useDominantColor.js` | `hooks/useDominantColor.js` | Used by gallery, but generic enough |
| `src/app.css` (shared portions) | `styles/shared.css` | Font stacks, nav styles, base CSS variables |

**Navbar changes for shared use:**
- Accept props: `currentSite` (string like `'ART'`), `navLinks` (array), `sites` (list of subdomains for the picker)
- Each site passes its own nav links and identifies itself
- The subdomain picker component lives here (built in a later phase)

**shared/package.json:**
```json
{
  "name": "@ducdam/shared",
  "private": true,
  "type": "module",
  "main": "src/index.js",
  "peerDependencies": {
    "react": "^18",
    "react-dom": "^18"
  }
}
```

No build step for the shared package — Vite resolves workspace dependencies directly from source via the `@ducdam/shared` alias.

### Step 3: Move the current app into `sites/art/`

- Move everything under `src/` (minus the extracted shared pieces) into `sites/art/src/`
- Move `public/` into `sites/art/public/`
- Move `index.html` into `sites/art/`
- Create `sites/art/package.json` with current app dependencies + `"@ducdam/shared": "workspace:*"`
- Create `sites/art/vite.config.js` — same as current, with alias `@ducdam/shared` pointing to the shared package
- Update imports in all art-site files: `../../hooks/useWindowSize` → `@ducdam/shared/hooks/useWindowSize` (or barrel import)
- Update `__root.jsx` to import `Navbar` and `Footer` from `@ducdam/shared`
- Art-specific CSS stays in `sites/art/src/app.css`, imports `@ducdam/shared/styles/shared.css`

**Route structure stays identical** — TanStack file-based routing continues to work, just lives under `sites/art/src/routes/`.

### Step 4: Create placeholder sites (`sites/celebs/`, `sites/cs/`)

Each placeholder site is a minimal Vite + React app:
- `package.json` depending on `@ducdam/shared`
- `vite.config.js` (standard Vite + React + Tailwind + TanStack Router)
- `index.html`
- `src/main.jsx` — TanStack RouterProvider
- `src/routes/__root.jsx` — imports shared Navbar/Footer, renders Outlet
- `src/routes/index.jsx` — simple landing page ("coming soon ..." or similar)
- `public/CNAME` — `celebs.ducdam.com` or `cs.ducdam.com`

These are real runnable apps that demonstrate the shared navbar working across sites.

### Step 5: Update deploy scripts

Current: single `gh-pages -d dist` pushing to one GitHub Pages site.

**Approach: monorepo source → separate deploy-only repos**

GitHub Pages is one-site-per-repo, so each subdomain needs its own deploy target. The source code stays in the monorepo; deploy repos are empty shells that only hold a `gh-pages` branch of built files.

```
Source (where you develop):
  ducdamchi/ducdam-portfolio         ← this monorepo

Deploy targets (empty repos, no source code):
  ducdamchi/art-deploy               ← GitHub Pages, CNAME: ducdam.com
  ducdamchi/celebs-deploy            ← GitHub Pages, CNAME: celebs.ducdam.com
  ducdamchi/cs-deploy                ← GitHub Pages, CNAME: cs.ducdam.com
```

The `gh-pages` npm package's `--repo` flag pushes a `dist/` folder to a different repo's `gh-pages` branch.

Root scripts (already defined in Step 1f, repeated here for clarity):
```json
"scripts": {
  "dev:art": "pnpm --filter @ducdam/art dev",
  "dev:celebs": "pnpm --filter @ducdam/celebs dev",
  "dev:cs": "pnpm --filter @ducdam/cs dev",
  "build:art": "pnpm --filter @ducdam/art build",
  "build:celebs": "pnpm --filter @ducdam/celebs build",
  "build:cs": "pnpm --filter @ducdam/cs build",
  "deploy:art": "pnpm build:art && gh-pages -d sites/art/dist --repo https://github.com/ducdamchi/art-deploy.git",
  "deploy:celebs": "pnpm build:celebs && gh-pages -d sites/celebs/dist --repo https://github.com/ducdamchi/celebs-deploy.git",
  "deploy:cs": "pnpm build:cs && gh-pages -d sites/cs/dist --repo https://github.com/ducdamchi/cs-deploy.git"
}
```

**One-time DNS setup** (in domain registrar):
- `ducdam.com` → GitHub Pages IPs (already configured)
- `celebs.ducdam.com` → CNAME to `ducdamchi.github.io`
- `cs.ducdam.com` → CNAME to `ducdamchi.github.io`

Each deploy repo's GitHub Pages settings specifies its custom domain.

**Future option:** If you want PR previews or auto-deploy on push, migrate to Cloudflare Pages or Vercel — both support monorepo builds with different root directories per project. But GitHub Pages works fine to start.

### Step 6: Verify everything works

- `pnpm install` at root resolves all workspaces
- `pnpm dev:art` starts the art site with working shared imports
- `pnpm build:art` produces a working production build
- Placeholder sites start and render the shared navbar
- All existing routes, carousels, modals work as before

### Step 7: Remove `shamefully-hoist` and enforce strict dependencies

Step 1d added `shamefully-hoist=true` as a migration crutch. This step removes it so pnpm's strict isolation catches phantom dependencies.

**7a. Remove the escape hatch:**
```ini
# .npmrc — delete the shamefully-hoist line
shamefully-hoist=true   # ← remove this
```

**7b. Clean install and find breakages:**
```bash
rm -rf node_modules sites/*/node_modules packages/*/node_modules
pnpm install
pnpm build:art 2>&1 | head -50   # look for resolution errors
pnpm dev:art                       # test runtime too
```

**7c. Fix each resolution error** by declaring the missing dependency in the package that actually uses it. Common cases:

| Error | Fix |
|---|---|
| `Cannot find module 'react'` in `@ducdam/shared` | Add `react` to shared's `devDependencies` (it's already a `peerDependency`, but pnpm strict mode needs it installed locally for Vite to resolve during dev) |
| `Cannot find module 'tailwindcss'` in a site | Add `tailwindcss` to that site's `dependencies` — don't rely on root hoist |
| ESLint/Prettier plugin resolution fails | These tools walk `node_modules/` and expect flat layout. Use targeted hoisting in `.npmrc` instead of global hoist: |

```ini
# .npmrc — hoist only the tools that need it
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
```

`public-hoist-pattern` hoists matching packages to the root `node_modules/` so CLI tools can find their plugins, while keeping everything else strict.

**7d. Verify no phantom dependencies remain:**
```bash
pnpm build:art && pnpm build:celebs && pnpm build:cs
```

If all three build cleanly without `shamefully-hoist`, every package declares what it actually uses. Future additions of undeclared imports will fail fast instead of silently working.

---

## What Stays the Same

- Gallery system (`gallery/` components, configs, carousel) stays in `sites/art/` — it's art-specific
- Film components stay in `sites/art/`
- All data files stay in `sites/art/src/data/`
- All public assets stay in `sites/art/public/`
- TanStack file-based routing pattern — each site has its own route tree
- Tailwind v4 config approach — each site imports Tailwind + shared styles

## What Changes

- Navbar becomes a shared component accepting props instead of hardcoding nav links
- Footer becomes a shared component
- Shared hooks and UI primitives move to `packages/shared/`
- CSS is split: shared base styles vs site-specific styles
- Root `package.json` becomes a workspace orchestrator
- Deploy becomes per-site

---

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Tailwind class resolution across packages | Vite resolves workspace packages from source, so Tailwind's content scanning finds classes in `packages/shared/`. Add shared package path to Tailwind content config if needed. |
| TanStack Router plugin assumes single app | Each site has its own `vite.config.js` with its own TanStack Router plugin instance, scanning its own `routes/` dir. No conflict. |
| Shared package changes require restart | Vite's workspace dependency resolution handles HMR for linked packages. If issues arise, use `optimizeDeps.exclude` for the shared package. |
| GitHub Pages only serves one site per repo | Deploy repos: empty repos that only hold built files, one per subdomain. `gh-pages --repo` pushes to them from the monorepo. |

---

## Execution Order

```
Step 1  →  Root workspace setup                    (5 min)
Step 2  →  Extract packages/shared/                (30 min, most work)
Step 3  →  Move current app to sites/art/          (30 min, careful import rewiring)
Step 4  →  Create placeholder sites                (15 min)
Step 5  →  Update deploy config                    (15 min, depends on hosting decision)
Step 6  →  Verify                                  (15 min)
```

Steps 2 and 3 are the core work. Steps 1 and 4-6 are straightforward scaffolding.
