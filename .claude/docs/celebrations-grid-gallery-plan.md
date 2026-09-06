# Celebrations Site — Grid Gallery Plan

## Goal

Replace the carousel-based gallery page with a flat image grid that mixes photos from all celebration projects. Users scroll through a wall of images to get an immediate sense of the photographer's style (wedding photography convention). Clicking any image opens the existing Gallery_Modal for that image's project, starting at the clicked image.

## Current State

- `sites/celebrations/` has a placeholder "coming soon" index page
- Three project folders in `public/`: `01-matt-and-meredith` (12 imgs), `02-linh-and-chien` (24 imgs), `03-thanh-and-lien` (29 imgs)
- Each folder has a boilerplate `info.json` with title, year, description, and captions (to be filled in later) — same structure as film & photo's photography `info.json`
- No `src/data/` directory yet
- The existing Gallery_Modal (both shared and film-photo copies) expects an `album` object with: `{ id, title, numImages, imgList: [{ id, src, index, description }] }`
- The celebrations site already has `@ducdam/shared` as a dependency

## Design

### 1. Data Layer

**Create `sites/celebrations/src/data/celebrations.json`**

Each project follows the same Album shape used by the modal:

```json
[
  {
    "id": 1,
    "title": "Matt & Meredith",
    "year": "",
    "url": "matt-and-meredith",
    "description": [""],
    "numImages": 12,
    "thumbnail": { "id": "1.0", "src": "01-matt-and-meredith/DSCF7711.jpg", "index": 0, "description": "" },
    "imgList": [
      { "id": "1.1", "src": "01-matt-and-meredith/DSCF7711.jpg", "index": 0, "description": "" },
      { "id": "1.2", "src": "01-matt-and-meredith/DSCF7720.jpg", "index": 1, "description": "" }
    ]
  }
]
```

- `src` paths are relative to `public/` (matching existing convention)
- Metadata (title, year, description, captions) comes from `info.json` in each folder — same structure as film & photo photography projects
- Order images by filename (already chronological from camera numbering)

**Write a scan script** (`public/celebScan.js`) modeled on `photoScan.js` / `scan.js` to auto-generate the JSON from the folder structure. Key points:
- Reads `info.json` from each numbered project folder (same structure as film & photo's photography projects)
- Projects are flat in `public/` with numbered prefixes for ordering (`01-matt-and-meredith`, etc.)
- First image in each folder becomes the thumbnail (no separate thumb file needed)
- Outputs to `src/data/celebrations.json`

### 2. Config

**Create `sites/celebrations/src/components/gallery/configs.jsx`**

```jsx
import celebrationsData from '../../data/celebrations.json'

export const celebrationsConfig = {
  sectionName: 'celebrations',
  title: 'CELEBRATIONS',
  urlParam: 'celebURL',
  filterFn: null,
  titleTransform: 'capitalize normal-case',
  metaFields: [],
  data: celebrationsData,
}
```

### 3. Grid Gallery Component

**Create `sites/celebrations/src/components/gallery/grid-gallery.jsx`**

This is the new component that replaces the carousel. It is celebrations-specific (not shared).

**Props:** `{ config, allAlbums }`

**State:**
- `sortMode`: `'chronological'` | `'random'`
- `flatImages`: derived array of `{ img, albumId, albumIndex }` tuples
- `openAlbum` / `initialSlideIndex`: for modal control

**Behavior:**

1. **Build flat image list on mount:**
   - Chronological (default): iterate albums in order, concatenate all imgLists. This keeps project grouping but presents them seamlessly.
   - Random: shuffle all images from all projects together (seeded or Fisher-Yates on each toggle).

2. **Render a CSS grid:**
   - Responsive columns: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
   - Each cell is an `<img>` with `object-cover` and a fixed aspect ratio (3:2 to match photography site)
   - Lazy loading with `loading="lazy"` for performance (65 images total)
   - Optional: subtle fade-in on load via `opacity` transition

3. **Sort toggle UI:**
   - Small toggle/pill in the header area: "By Project" | "Shuffle"
   - Minimal — should not dominate the visual. Thin font, small, top-right or beside title.

4. **Click → Modal:**
   - On image click, determine which album the image belongs to (from the `albumId` stored in the flat list)
   - Find the album object from `allAlbums`
   - Set `openAlbum` to that album and `initialSlideIndex` to the image's `index` within that album
   - Render `Gallery_Modal` with that album, passing an `initialIndex` prop

### 4. Modal Integration

The existing Gallery_Modal needs one small change: accept an optional `initialIndex` prop to start at a specific slide instead of always starting at 0.

**In `Gallery_Modal`:** Change `useState(0)` to `useState(initialIndex ?? 0)` for `slideIndex`.

Decision: use the **film-photo site's local copy** of gallery-modal (at `sites/film & photo/src/components/gallery/gallery-modal.jsx`) rather than the shared one, since celebrations will be a peer site with its own copy. Copy the following files into `sites/celebrations/src/components/gallery/`:
- `gallery-modal.jsx` (with `initialIndex` addition)
- `gallery-thumbstrip.jsx`
- `gallery-immersion.jsx`
- `gallery.css`

Alternative: add `initialIndex` support to the shared Gallery_Modal and import from `@ducdam/shared`. This is cleaner but couples the change. **Preferred approach** — add it to shared, since both sites benefit.

### 5. Routes

**`sites/celebrations/src/routes/index.jsx`** — Main grid gallery page:

```jsx
import { createFileRoute } from '@tanstack/react-router'
import Navbar from '../components/navbar'
import { Footer } from '@ducdam/shared'
import GridGallery from '../components/gallery/grid-gallery'
import { celebrationsConfig } from '../components/gallery/configs'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <GridGallery config={celebrationsConfig} allAlbums={celebrationsConfig.data} />
      <Footer />
    </div>
  ),
})
```

No landing page routes needed — clicking goes directly to the modal (no `/$celebURL` route). This is intentionally different from film-photo, where each project has a landing page with description. For celebrations, the grid IS the discovery mechanism.

### 6. Navbar

**Create `sites/celebrations/src/components/navbar.jsx`**

Thin wrapper like other sites:

```jsx
import { Navbar } from '@ducdam/shared'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function CelebNavbar() {
  return <Navbar currentSite="CELEBRATIONS" navLinks={NAV_LINKS} />
}
```

### 7. File Structure (Final)

```
sites/celebrations/
  public/
    01-matt-and-meredith/   # 12 JPGs + info.json
    02-linh-and-chien/      # 24 JPGs + info.json
    03-thanh-and-lien/      # 29 JPGs + info.json
    about.jpg
    CNAME
    celebScan.js            # NEW — generates celebrations.json
  src/
    data/
      celebrations.json     # NEW — generated by scan script
    components/
      navbar.jsx            # NEW — thin wrapper
      gallery/
        configs.jsx         # NEW — celebrationsConfig
        grid-gallery.jsx    # NEW — main grid component
    routes/
      __root.jsx            # existing
      index.jsx             # MODIFIED — grid gallery
      about.jsx             # existing
      contact.jsx           # existing
    app.css                 # existing
    main.jsx                # existing
```

## Implementation Order

1. Write `celebScan.js` and generate `celebrations.json`
2. Add `initialIndex` prop to shared `Gallery_Modal`
3. Create `configs.jsx` and `navbar.jsx`
4. Build `grid-gallery.jsx`
5. Wire up `index.jsx` route
6. Style and test

## Visual Consistency Notes

- Same `bg-zinc-50` page background as film-photo
- Same font stack (inherited from shared CSS)
- Same Navbar and Footer from shared package
- Grid images use `object-cover` with 3:2 aspect ratio (matching gallery card proportions)
- Modal is identical — same slide viewer, thumbstrip, immersion, gallery view
- Sort toggle uses thin/light font weight to match site aesthetic

## Design Decisions

- **Captions:** Empty captions get replaced with "Image X" placeholder (X = 1-based order within the project)
- **Project dividers:** No dividers — seamless wall of images in both modes
- **Hover effect:** Slight zoom on hover (CSS `scale` transform)
- **Image sizing:** Keep full-size for now; manual resize later
