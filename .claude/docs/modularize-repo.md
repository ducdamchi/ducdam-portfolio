# Modularization Plan

This document outlines the steps to deduplicate and modularize the codebase before (or during) the monorepo restructure into `packages/shared/` + `sites/{main,celebs,cs}/`.

---

## 1. Extract shared Gallery components

**Problem**: Photography and Woodworking are near-identical copies (~1,500 duplicated lines across 5 component files + 1 CSS file).

**Differences between Photography and Woodworking**:

| Aspect | Photography | Woodworking |
|---|---|---|
| Item count | `albumsData.filter(a => a.isHighlight).length` | `albumsData.length` |
| URL param | `photoURL` | `woodURL` |
| Back link | `/photography` | `/woodworking` |
| Link path in Items | `../photography/${album.url}` | `../woodworking/${album.url}` |
| Landing meta fields | `year`, `viewTime` | `year`, `dimensions`, `materials` |
| Title style | default | `uppercase` |
| Items filter | `.filter(a => a.isHighlight)` | no filter (all items shown) |
| CSS file | identical copy | identical copy |

**Plan**:

Create a generic gallery component set that accepts a config object:

```
src/Components/Gallery/
  Gallery.jsx          # Section page (replaces Photography.jsx + Woodworking.jsx)
  Gallery_Carousel.jsx # Carousel controller (replaces both Photo_Carousel.jsx)
  Gallery_Items.jsx    # Carousel renderer (replaces both Photo_Items.jsx)
  Gallery_Landing.jsx  # Individual item view (replaces both Photo_Landing.jsx)
  Gallery_Modal.jsx    # Fullscreen image modal (replaces both Photo_Modal.jsx)
  Gallery.css          # Single shared CSS file (replaces both Photography.css)
```

Config interface:

```js
const photographyConfig = {
  sectionName: 'photography',       // used in routes, links
  title: 'PHOTOGRAPHY',             // page heading
  urlParam: 'photoURL',             // route param name
  filterFn: (item) => item.isHighlight,  // optional item filter
  titleTransform: 'none',           // CSS text transform on titles
  metaFields: [                     // fields shown on landing page
    { key: 'year' },
    { key: 'viewTime', format: (v) => `${v} mins`, icon: 'BiTimeFive' },
  ],
}

const woodworkingConfig = {
  sectionName: 'woodworking',
  title: 'WOODWORKING',
  urlParam: 'woodURL',
  filterFn: null,                   // show all items
  titleTransform: 'uppercase',
  metaFields: [
    { key: 'year' },
    { key: 'dimensions' },
    { key: 'materials' },
  ],
}

const filmConfig = {
  sectionName: 'film',
  title: 'FILM',
  urlParam: 'filmURL',
  filterFn: null,
  titleTransform: 'none',
  layout: 'poster',                 // large single-item display (vs 'thumbnail' grid)
  albumsPerSlide: 1,                // always 1, no responsive breakpoints
  metaFields: [
    { key: 'year' },
    { key: 'country' },
    { key: 'runtime', format: (v) => `${v} min` },
  ],
  extras: {                         // Film-specific features
    pressGallery: true,             // enables Film_Modal_Press
    videoEmbed: true,               // enables trailer/preview embed
  },
}
```

Usage in App.jsx:

```jsx
<Route path="/photography" element={<Gallery config={photographyConfig} data={albumsData} />} />
<Route path="/woodworking" element={<Gallery config={woodworkingConfig} data={woodData} />} />
<Route path="/film" element={<Gallery config={filmConfig} data={filmsData} />} />
```

**Steps**:
1. Create `Gallery.css` by copying Photography.css (they are identical) and deleting the duplicate Tailwind imports at the top (already imported globally).
2. Create `Gallery.jsx` parameterized by `config` + `data` props.
3. Create `Gallery_Carousel.jsx` — identical logic, no config needed (already receives all data via props).
4. Create `Gallery_Items.jsx` — parameterize `sectionName` (for link path) and `filterFn` (for isHighlight filtering).
5. Create `Gallery_Landing.jsx` — parameterize `urlParam`, `sectionName` (for back link), `metaFields`, and `titleTransform`.
6. Create `Gallery_Modal.jsx` — parameterize `titleTransform` only.
7. Update `App.jsx` routes to use the new Gallery components.
8. Integrate Film into Gallery: add `layout` switch in `Gallery_Items.jsx` — `'poster'` renders the Film-style large single item, `'thumbnail'` renders the photo grid. Film-specific extras (press gallery modal, video embed) are conditionally rendered based on `config.extras`.
9. Delete `Photography/`, `Woodworking/`, and `Film/` component folders (keep JSON data files, move them to `src/data/`). Keep `Film_Modal_Press.jsx` as a standalone component referenced by the Gallery when `config.extras.pressGallery` is true.
10. Verify dev server runs, all routes work.

**Note**: Film is also unified into the shared Gallery components. Its carousel is just the `albumsPerSlide = 1` case (which the Photography carousel already handles — when `albumsPerSlide === 1`, `oddAlbums === 0`, so the simpler Film edge-case logic is a subset). The only real difference is the Items renderer UI (poster layout vs thumbnail grid), handled via a `layout: 'poster' | 'thumbnail'` config flag or a `renderItem` prop. Film-specific features (press gallery modal, video embeds) are passed as additional config or composed alongside the shared Gallery.

---

## 2. Extract `useCarousel` hook

**Problem**: The carousel state machine (index tracking, edge transitions, click debouncing) is duplicated in 3 files: `Photo_Carousel.jsx` (Photography), `Photo_Carousel.jsx` (Woodworking), and `Film_Carousel.jsx`.

**Shared logic** (~120 lines each):
- `carouselIndex`, `isEdgeTransition`, `rightDisabled`, `leftDisabled` state
- `disableClickTemp(time_ms)` — debounce button clicks
- `handleEdgeCase(newIndex)` — wrap-around transitions with optional `oddAlbums` handling
- `nextSlide()` / `prevSlide()` — increment/decrement with edge case delegation
- `useEffect` for edge transition reset

**Key insight**: Photography/Woodworking carousel handles `oddAlbums` + `slidesOffset` for multi-item slides. Film always has `albumsPerSlide = 1`, which means `oddAlbums = 0` and the `slidesOffset` branches never fire. Film's simpler `handleEdgeCase` is already a subset of the Photography version. So one hook handles all three.

**Plan**:

```
src/hooks/useCarousel.js
```

```js
export function useCarousel({ numSlidesIndex, oddAlbums = 0, albumsPerSlide = 1 }) {
  // Returns:
  // { carouselIndex, slidesOffset, isEdgeTransition,
  //   nextSlide, prevSlide, setCarouselIndex, setSlidesOffset }
}
```

**Steps**:
1. Create `src/hooks/useCarousel.js` with the shared state machine.
2. Refactor `Gallery_Carousel.jsx` to use `useCarousel(...)` instead of inline state.
3. Film uses the same `Gallery_Carousel.jsx` with `albumsPerSlide: 1` — no separate Film_Carousel needed.
4. Delete all duplicated carousel logic.

---

## 3. Extract `useWindowSize` hook

**Problem**: The resize listener pattern is copy-pasted in 5+ components:
- `Photography.jsx` / `Woodworking.jsx`
- `Photo_Landing.jsx` (Photography + Woodworking)
- `NavSection.jsx`

**Plan**:

```
src/hooks/useWindowSize.js
```

```js
export function useWindowSize() {
  // Returns: { width, height }
  // Single resize listener, cleaned up on unmount
}
```

**Steps**:
1. Create `src/hooks/useWindowSize.js`.
2. Replace all `useState(window.innerWidth)` + resize `useEffect` patterns with `const { width, height } = useWindowSize()`.
3. Consider removing `@react-hook/resize-observer` from dependencies if unused after this (it's currently installed but never imported).

---

## 4. Extract ColorThief utility

**Problem**: The brightness calculation + color adjustment logic is duplicated in 4 places:
- `Photo_Items.jsx` (Photography) lines 73-111
- `Photo_Items.jsx` (Woodworking) lines 73-111
- `Photo_Landing.jsx` (Photography) lines 88-128
- `Photo_Landing.jsx` (Woodworking) lines 91-131

**Plan**:

```
src/utils/colorThief.js
```

```js
/**
 * Get the dominant color from an image element, adjusted for readability.
 * Uses brightness-based scaling to ensure light colors are darkened.
 * @param {HTMLImageElement} img
 * @returns {{ color: number[], brightness: number, bgColor: string }}
 */
export function getDominantColor(img) { ... }

/**
 * Apply dominant-color-based background to a target element.
 * @param {HTMLImageElement} img
 * @param {HTMLElement} target
 * @param {'backgroundColor' | 'color'} property
 */
export function applyDominantColor(img, target, property = 'backgroundColor') { ... }
```

**Steps**:
1. Create `src/utils/colorThief.js` with shared brightness formula and color adjustment.
2. Replace inline ColorThief logic in `Gallery_Items.jsx` and `Gallery_Landing.jsx`.
3. Bug fix while extracting: the brightness check in Items uses `130 <= brightness < 194` which in JS always evaluates to `true` (chained comparison doesn't work like Python). Fix to `brightness >= 130 && brightness < 194`.

---

## 5. Deduplicate CSS

**Problem**:
- `Photography/Photography.css` and `Woodworking/Photography.css` are byte-for-byte identical (451 lines each).
- Both files redundantly import Tailwind (`@import 'tailwindcss'` + layer imports), which is already done in `App.css` / `index.css`.
- Film has its own `Film.css` which is genuinely different.

**Plan**:

```
src/Components/Gallery/Gallery.css   # Shared carousel + landing + modal styles
src/Components/Film/Film.css         # Film-specific styles (keep as-is)
```

**Steps**:
1. Remove the Tailwind re-imports from the top of the gallery CSS (lines 1-7).
2. Move the single CSS file into `Gallery/Gallery.css`.
3. Delete both `Photography/Photography.css` and `Woodworking/Photography.css`.
4. Audit for any class name conflicts with Film.css.

---

## 6. Adopt TanStack Router

**Problem**:
- Navigating back from a landing page to the gallery remounts the component, resetting carousel state.
- Current workaround: pass `carouselIndex` + `slidesOffset` via `location.state`, which is fragile (lost on browser back/forward, page refresh).
- No route-level data loading — components flash while setting up state.

**Benefits of TanStack Router**:
- Route caching: revisiting a route reuses the previous component instance.
- Search params: carousel position stored in URL (`?slide=3`) instead of ephemeral `location.state`.
- Loaders: data resolved before render, no flash.
- Type-safe routes: good for multi-site monorepo.

**Plan**:

**Steps**:
1. Install `@tanstack/react-router` and `@tanstack/router-devtools` (dev).
2. Define route tree matching current routes (see CLAUDE.md routes table).
3. Move carousel position from `location.state` to search params (`?index=3&offset=0`).
4. Add `staleTime` to gallery routes so revisiting doesn't remount.
5. Remove `HashRouter` from `main.jsx`, replace with TanStack `RouterProvider`.
6. Note: GitHub Pages requires hash-based routing OR a 404.html redirect trick. TanStack Router supports hash mode via `createHashHistory()`.
7. If/when content moves to a CMS, add `@tanstack/react-query` for data fetching with cache.

**Timing**: This can happen before or after the monorepo split. If before, the router setup carries over. If after, each site gets its own router instance from the start.

---

## 7. Clean up imperative DOM patterns

**Problem**: Modal components use `useEffect` + `querySelectorAll` + `.style.display = 'none'` to toggle between slides view and gallery view. This is anti-React and fragile.

**Current pattern** (in Photo_Modal.jsx):
```js
useEffect(() => {
  const allSlides = slidesRef.current.querySelectorAll('.slides-each')
  for (let i = 0; i < allSlides.length; i++) {
    allSlides[i].style.display = i === slideIndex ? 'inline-block' : 'none'
  }
}, [slideIndex])
```

**Better pattern**:
```jsx
{album.imgList.map((slide, i) => (
  <img
    className="slides-each ..."
    style={{ display: i === slideIndex ? 'inline-block' : 'none' }}
    key={slide.id}
    src={...}
  />
))}
```

**Steps**:
1. In `Gallery_Modal.jsx`, replace the slideIndex `useEffect` with inline conditional `style` or `className`.
2. Replace the gallery/slides view toggle `useEffect` with conditional rendering (`{isGalleryView ? <GalleryView /> : <SlidesView />}`).
3. Remove `slidesRef`, `galleryRef`, `modal_slides_btnLeft`, `modal_slides_btnRight` refs that were only used for imperative display toggling.

---

## Execution order

Recommended sequence (each step is independently committable):

```
Step 1: useWindowSize hook          (small, zero risk, immediate cleanup)
Step 2: ColorThief utility          (small, includes bug fix)
Step 3: useCarousel hook            (medium, shared across 3 components)
Step 4: Gallery component extraction (large, main deduplication)
Step 5: CSS deduplication           (done as part of step 4)
Step 6: Modal imperative cleanup    (medium, done after step 4)
Step 7: TanStack Router adoption    (large, can be done independently)
```

Steps 1-3 are preparatory extractions that make step 4 cleaner. Step 7 is independent and can happen at any point.

---

## Other cleanup (do alongside the above)

- Remove unused state: `clonesLeft`/`clonesRight` in Photo_Items (both sections)
- Remove unused imports: `FlickeringGrid`, `Link`/`useLocation` in carousels
- Remove stray `console.log` calls in Woodworking components
- Remove `@react-hook/resize-observer` from dependencies if confirmed unused after useWindowSize extraction
- Move JSON data files from component folders to `src/data/` (e.g., `src/data/albums.json`, `src/data/wood.json`, `src/data/films.json`)
