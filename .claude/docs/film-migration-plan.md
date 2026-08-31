# Film Migration Plan: Migrate Film to use the Gallery system

## Overview

Photography and Woodworking already use the shared `Gallery` component system (`Gallery.jsx`, `Gallery_Carousel.jsx`, `Gallery_Card.jsx`, `Gallery_Landing.jsx`, `Gallery_Modal.jsx`). Film still uses its own independent stack (`Film.jsx`, `Film_Carousel.jsx`, `Film_Items.jsx`, `Film_Landing.jsx`, `Film_Modal.jsx`, `Film_Modal_Press.jsx`). This plan migrates Film to the shared Gallery system while preserving Film's unique features.

---

## Key Differences Between Film and Photography/Woodworking

### 1. Data shape (`films.json` vs `albums.json` / `wood.json`)

| Field | Photography/Wood | Film |
|---|---|---|
| `thumbnail` | `{ src: "..." }` (object) | `"film/.../thumb.jpg"` (string) |
| `description` | `string[]` (paragraphs) | N/A — Film uses `synopsis` (single string) |
| Card subtitle | `year` only | `year \| country \| runtime mins` |
| `preview` | `album.preview` (single) | `film.previewThumbnail` (carousel) + `film.previewLanding` (landing page) |
| `imgList` / `numImages` | On album directly | Nested under `film.pressGallery` (optional) |
| `poster` | N/A | `film.poster` (used as carousel thumbnail) |
| `youtube` | N/A | YouTube embed URL for trailer |
| `director` | N/A | Director credit shown on landing |
| `synopsis` | N/A (uses `description[]`) | Single string |
| `recognition` | N/A | Festival selections |
| `screenings` | N/A | Screening venues |
| `availability` | N/A | Availability info |
| `logo` | N/A | Optional film logo overlay on landing |
| `pressGallery` | N/A | Optional press gallery with its own modal |

### 2. Carousel card display
- **Photography/Wood**: Card shows `title` + `year`. Hover reveals description excerpt.
- **Film**: Card shows `title` + `year | country | runtime mins` (with clock icon). Hover reveals synopsis excerpt.

### 3. Landing page (`Film_Landing` vs `Gallery_Landing`)
- **Gallery_Landing**: Background image, ColorThief accent color, info box with title/year/metaFields/description, "open" button -> `Gallery_Modal` (image slideshow).
- **Film_Landing**: Background video (or image fallback), play button -> `Film_Modal` (YouTube embed), bottom info bar with title/director/year|country|runtime, synopsis column, availability column, press gallery button -> `Film_Modal_Press`. Optional film logo overlay.

### 4. Modals
- **Gallery_Modal**: Image slideshow/grid viewer for album photos.
- **Film_Modal**: YouTube iframe embed for trailer.
- **Film_Modal_Press**: Image slideshow/grid viewer for press photos (nearly identical to `Gallery_Modal`).

---

## Migration Strategy

### Step 1: Normalize `films.json` data shape

Adapt `films.json` so each film item can be consumed by Gallery components. Add/rename fields to match the shared interface while keeping film-specific fields:

```json
{
  "id": 1,
  "title": "DISTANCE UNKNOWN",
  "year": "2026",
  "url": "distance-unknown-2026",
  "thumbnail": { "src": "film/01-distance-unknown/thumb.jpg" },
  "preview": "film/01-distance-unknown/preview-thumbnail.mp4",
  "description": ["50 years after the Vietnam War..."],

  "director": "Duc Dam, Quynh-Anh Cao-Le",
  "runtime": "90",
  "country": "USA, Vietnam",
  "language": "Vietnamese, English",
  "synopsis": "50 years after the Vietnam War...",
  "recognition": "",
  "screenings": "",
  "poster": "film/01-distance-unknown/poster.jpg",
  "youtube": "",
  "previewLanding": "",
  "availability": "...",
  "logo": null,
  "pressGallery": { ... },
  "imgList": [...],
  "numImages": 23
}
```

Key changes:
- `thumbnail`: wrap string in `{ src: "..." }` object to match Gallery_Card expectations
- `description`: add as `[synopsis]` array (Gallery_Card reads `description[0]`)
- `preview`: copy `previewThumbnail` value here (Gallery_Card reads `album.preview`)
- `imgList` / `numImages`: hoist from `pressGallery` to top level (Gallery_Modal reads `album.imgList`)
- Keep all film-specific fields (`director`, `runtime`, `country`, `youtube`, `pressGallery`, etc.) — they're ignored by Gallery components but used by the film-specific landing page

### Step 2: Create `filmConfig` in `configs.jsx`

Add a film config alongside the existing photography/woodworking configs:

```jsx
import { BiTimeFive } from 'react-icons/bi'
import { BiMapPin } from 'react-icons/bi'
import filmsData from '../Film/films.json'

export const filmConfig = {
  sectionName: 'film',
  title: 'FILM',
  urlParam: 'filmURL',
  filterFn: null,
  titleTransform: 'uppercase',
  metaFields: [
    { key: 'director', format: (v) => `Directed by ${v}` },
    { key: 'country' },
    { key: 'runtime', format: (v) => `${v} mins`, Icon: BiTimeFive },
  ],
  // Film-specific: custom subtitle renderer for carousel cards
  cardSubtitle: (item) => `${item.year} | ${item.country} | ${item.runtime} mins`,
  data: filmsData,
}
```

### Step 3: Extend `Gallery_Card` to support custom subtitle

Currently `Gallery_Card` hardcodes the subtitle as just `{album.year}`. Add config-driven subtitle support:

```jsx
// In Gallery_Card.jsx, the title/year section:
<span className="font-light" style={{ fontSize: `${titleSize * 0.045}px` }}>
  {config.cardSubtitle ? config.cardSubtitle(album) : album.year}
</span>
```

This is the only change needed in `Gallery_Card`. The rest (thumbnail, preview, ColorThief, description excerpt) already works with the normalized data shape.

### Step 4: Replace Film listing route with Gallery

In `App.jsx`, replace:
```jsx
<Route path="/film" element={<Film />} />
```
with:
```jsx
<Route path="/film" element={<Gallery key="film" config={filmConfig} />} />
```

At this point, the `/film` carousel page uses the shared Gallery system with film-appropriate subtitles.

### Step 5: Keep `Film_Landing` as a custom landing page

`Film_Landing` is fundamentally different from `Gallery_Landing` — it has video backgrounds, a YouTube play button, a three-column info layout, and a press gallery modal. It does NOT make sense to force it into `Gallery_Landing`.

Keep the route as-is:
```jsx
<Route path="/film/:filmURL" element={<Film_Landing />} />
```

Minor updates needed in `Film_Landing.jsx`:
- Update thumbnail reference from `matchedFilm.thumbnail` (string) to `matchedFilm.thumbnail.src` (object) to match new data shape
- Everything else stays the same

### Step 6: Retire `Film_Modal_Press` in favor of `Gallery_Modal`

`Film_Modal_Press` is nearly identical to `Gallery_Modal` — both are slideshow/grid viewers for image lists. Replace the press gallery modal usage in `Film_Landing`:

```jsx
// Before:
import PressGalleryModal from './Film_Modal_Press'
<PressGalleryModal film={matchedFilm} ... />

// After:
import Gallery_Modal from '../Gallery/Gallery_Modal'
<Gallery_Modal
  config={filmConfig}
  album={{
    ...matchedFilm,
    title: matchedFilm.pressGallery.title,
    imgList: matchedFilm.pressGallery.imgList,
    numImages: matchedFilm.pressGallery.numImages,
  }}
  ...
/>
```

### Step 7: Delete retired Film components

After migration, delete:
- `Film.jsx` (replaced by `Gallery` with `filmConfig`)
- `Film_Carousel.jsx` (replaced by `Gallery_Carousel`)
- `Film_Items.jsx` (replaced by `Gallery_Card`)
- `Film_Modal_Press.jsx` (replaced by `Gallery_Modal`)
- `Film.css` — audit which styles are still needed by `Film_Landing`, move those to `Gallery.css` or inline them, delete the rest

Keep:
- `Film_Landing.jsx` (unique layout, not replaceable by Gallery_Landing)
- `Film_Modal.jsx` (YouTube embed, unique to film)
- `films.json` (data source, updated shape)

---

## Summary of file changes

| File | Action |
|---|---|
| `films.json` | Reshape: wrap `thumbnail`, add `description[]`, hoist `imgList`/`numImages`, add `preview` |
| `configs.jsx` | Add `filmConfig` with `cardSubtitle` function |
| `Gallery_Card.jsx` | Add `config.cardSubtitle` support (1 line change in subtitle render) |
| `App.jsx` | Change `/film` route to use `<Gallery config={filmConfig} />`, import `filmConfig` |
| `Film_Landing.jsx` | Update `matchedFilm.thumbnail` -> `matchedFilm.thumbnail.src`, swap `Film_Modal_Press` for `Gallery_Modal` |
| `Film.jsx` | Delete |
| `Film_Carousel.jsx` | Delete |
| `Film_Items.jsx` | Delete |
| `Film_Modal_Press.jsx` | Delete |
| `Film.css` | Audit, move landing-specific styles, delete carousel styles |
| `Film_Modal.jsx` | Keep (YouTube embed is unique) |

## Risks and considerations

- **Film only has 3 items**: The carousel currently shows 1 film at a time with clone-based looping. With the new Gallery carousel (`slidesPerPage` based on container width), 3 items may show fewer arrows at wider screens or behave differently. The existing `showArrows = realCount > slidesPerPage` logic handles this — at 2+ slides per page with only 3 items, arrows still show; at 3+ slides per page, arrows hide and all films are visible at once. This is arguably correct behavior.
- **Poster vs thumbnail aspect ratio**: Film currently uses `poster` (portrait-ish, 3:2) as the carousel image. The new Gallery_Card uses `aspect-3/2` with `object-cover`. Verify film thumbnails look good at this ratio — if the existing `thumb.jpg` files are already 3:2 crops, no issue. If poster images are used instead, may need to ensure thumbnails are the right ratio.
- **Film_Landing video background**: This is preserved since we keep Film_Landing as-is. No impact.
- **Press gallery data**: Films without `pressGallery` (like "Last Days") need `imgList` and `numImages` set to empty/zero at the top level for Gallery_Modal compatibility. Gallery_Modal is only opened from Film_Landing (not from the carousel card), so this is fine — just ensure the "open" button in Gallery_Landing doesn't appear for films. Since Film uses its own Film_Landing, this isn't an issue.
