# Carousel Rewrite Plan

Rewrite the Gallery carousel to match the Film Atlas `CollectionCarousel` architecture. The current carousel has a fundamental layout flaw: the parent container expands on hover because of in-flow overlay elements, percentage-based sizing, and a flat DOM structure that conflates sizing with overflow clipping. The Film Atlas carousel solves all of this with pixel-based sizing, a separated overflow container, and CSS-only absolute hover overlays.

---

## Reference: Film Atlas Architecture (gold standard)

### DOM Structure (three layers)

```
outer div (FIXED PIXEL WIDTH, flex-col, position: relative, hover:z-[50], NO overflow set)
  |
  +-- CarouselNavPanel left (position: absolute, left: 0, z-20, full height)
  |
  +-- overflow-container (overflowX: clip, overflowY: visible, paddingL/R: NAV_WIDTH)
  |     |
  |     +-- track div (display: flex, gap, ref for direct DOM manipulation)
  |           |
  |           +-- item wrappers (flexShrink: 0, fixed width)
  |                 +-- card component (position: relative, group/card, hover:z-[200])
  |                       +-- poster/image area
  |                       +-- hover overlay (position: absolute, top: 100%, CSS group-hover visibility)
  |
  +-- CarouselNavPanel right (position: absolute, right: 0, z-20, full height)
```

### Why this works

1. **Outer div has a fixed pixel width** computed from `slidesPerPage * CARD_WIDTH + (slidesPerPage - 1) * GAP + 2 * NAV_WIDTH`. It never expands regardless of content.
2. **Overflow container is a separate inner div** with `overflowX: clip` (clips the track horizontally) and `overflowY: visible` (allows hover overlays to overflow downward). This separation is critical -- the outer div has NO overflow set, so vertical overflow passes through freely.
3. **Nav buttons are absolutely positioned siblings** of the overflow container, not flex children competing for space.
4. **Hover overlay is absolutely positioned** (`top: 100%`) and visibility is toggled via CSS `group-hover` -- no conditional rendering, no layout impact.
5. **Z-index layering**: hovered card gets `z-[200]` (above siblings), carousel outer gets `hover:z-[50]` (above other page sections).

### Sizing & Transforms (pixel-based)

```js
const CARD_WIDTH = 352    // fixed card width in px
const NAV_WIDTH = 64      // nav button panel width in px
const GAP = 12            // gap between cards in px

// Outer container width
carouselWidth = slidesPerPage * CARD_WIDTH + (slidesPerPage - 1) * GAP + 2 * NAV_WIDTH

// Transform (applied directly to DOM via ref, no React re-render)
trackRef.current.style.transform = `translateX(-${index * (CARD_WIDTH + GAP)}px)`
trackRef.current.style.transition = durationMs === 0 ? 'none' : `transform ${durationMs}ms ease-in-out`
```

### Responsiveness

- Uses `ResizeObserver` on the **parent element** (not the carousel itself, to avoid feedback loops).
- `getSlidesPerPage(containerPx)` returns 1-4 based on breakpoints.
- On resize: recalculates `slidesPerPage`, resets index, applies transform instantly (duration 0).

### Navigation

- **Page-based stepping**: each click moves by `slidesPerPage` items.
- **Remainder handling**: when `realCount % slidesPerPage !== 0`, the second-to-last step is a partial step of `remainder` items, so the last page lands cleanly without overshooting into clones.
- **Debounce**: `isTransitioning` flag prevents clicks during animation.
- **Clone wrap**: animate into clone region -> `setTimeout(300ms)` -> instant snap to equivalent real position (transition: none).

### Clone Logic

```js
const showArrows = realCount > slidesPerPage
const prepend = showArrows ? items.slice(-slidesPerPage) : []
const append  = showArrows ? items.slice(0, slidesPerPage) : []
const allSlides = [...prepend, ...items, ...append]
// Starting index = slidesPerPage (skips prepended clones)
```

### Layout Ready Guard

- `layoutReady` state starts `false`. Set to `true` after first `ResizeObserver` callback.
- Track is only rendered when `layoutReady` is true.
- `useLayoutEffect` applies initial transform synchronously before first paint (no flash).

---

## Current Portfolio Architecture (to be replaced)

### Problems

| Issue | Root Cause |
|---|---|
| Parent container expands on hover | `.thumbnail-description` is in-flow (`position: relative`), conditionally rendered, pushes parent height; flat DOM conflates sizing and overflow clipping |
| Percentage-based sizing creates circular dependencies | Track width is `calc(100% - 2 * var(--slider-padding))` relative to parent, track's `min-width: auto` as flex child can expand parent |
| No separation of overflow concerns | `.carousel-whole` tries to be both the sized container and the overflow clipper |
| Hover overlay uses JS conditional rendering | `{hoverId === album.id && <div>...}` causes DOM insertion/removal, layout recalculation |
| `oddAlbums` / `slidesOffset` fractional offset system | Complex, hard to reason about, fragile at edge cases |

### Features to Preserve

- ColorThief dynamic background color on hover overlay
- Video preview on hover (after 2s delay)
- Album thumbnail with gradient overlay + title/year
- Link to album landing page (`/:section/:albumURL`)
- Router state persistence for carousel position (pass `currentIndex`/`currentOffset` via Link state, restore on mount)
- Responsive font sizing via ResizeObserver on first item
- Config-driven: `photographyConfig`, `woodworkingConfig` (filterFn, titleTransform, metaFields, sectionName)

---

## Rewrite Plan

### File Changes

| File | Action |
|---|---|
| `Gallery.jsx` (Parent) | Rewrite: remove manual resize/breakpoint logic, just render carousel with config + data |
| `Gallery_Carousel.jsx` (Controller) | Rewrite from scratch: adopt Film Atlas sizing, DOM structure, navigation, clone logic |
| `Gallery_Items.jsx` (Renderer) | Rewrite from scratch: adopt Film Atlas track/item structure, CSS-only hover overlay |
| `Gallery.css` | Rewrite: remove all carousel layout CSS, replace with minimal styles for the new structure |
| `configs.jsx` | No change |

### Step 1: Define Constants & Responsive Logic

```js
// Gallery_Carousel.jsx
const CARD_WIDTH = ???     // pick a fixed card width appropriate for portfolio thumbnails
const NAV_WIDTH = 48       // narrower than Film Atlas since portfolio has simpler nav
const GAP = 16             // gap between cards

function getSlidesPerPage(containerPx) {
  if (containerPx < 768)  return 1
  if (containerPx < 1280) return 2
  if (containerPx < 1920) return 3
  return 4
}
```

The `CARD_WIDTH` should be chosen based on the desired thumbnail aspect ratio. Current thumbnails use 3:2 aspect ratio. Pick a width that looks good at the portfolio's typical viewport (e.g., 400px for landscape photos).

### Step 2: Rewrite Gallery.jsx (Parent)

Simplify to just pass config and data. Remove all `screenWidth`, `numSlidesIndex`, `albumsPerSlide`, `oddAlbums` state -- the carousel handles its own layout now.

```jsx
export default function Gallery({ config }) {
  const albumsData = config.data
  const filteredData = config.filterFn ? albumsData.filter(config.filterFn) : albumsData

  return (
    <>
      <NavSection />
      <div className="...title styles...">
        <h1>{config.title}</h1>
      </div>
      <div className="relative top-35 flex justify-center">
        <Gallery_Carousel config={config} items={filteredData} />
      </div>
      <Footer />
    </>
  )
}
```

### Step 3: Rewrite Gallery_Carousel.jsx (Controller)

Adopt the Film Atlas pattern wholesale:

1. **Refs**: `outerRef` (callback ref for ResizeObserver), `trackRef` (for direct DOM transform manipulation)
2. **State**: `slidesPerPage`, `layoutReady`, `currentIndex`, `isTransitioning`
3. **Computed**: `carouselWidth`, `showArrows`, `prepend`/`append` clone arrays, `allSlides`
4. **ResizeObserver**: observe `outerRef.parentElement`, call `getSlidesPerPage`, update state
5. **applyTransform(index, durationMs)**: direct DOM manipulation on `trackRef.current.style`
6. **handleNext / handlePrev**: page-based stepping with remainder handling, clone wrap via setTimeout
7. **useLayoutEffect**: apply initial transform before first paint

DOM output:

```jsx
<div ref={outerRef} style={{ width: carouselWidth }} className="relative group/carousel hover:z-[50]">
  {layoutReady && (
    <div className="relative">
      {/* Left nav */}
      <NavButton direction="left" show={showArrows} onClick={handlePrev} width={NAV_WIDTH} />

      {/* Overflow container */}
      <div style={{ overflowX: 'clip', overflowY: 'visible', paddingLeft: NAV_WIDTH, paddingRight: NAV_WIDTH, position: 'relative' }}>
        <div ref={trackRef} className="flex" style={{ gap: GAP }}>
          {allSlides.map((album, idx) => (
            <div key={`${album.id}-${idx}`} style={{ flexShrink: 0 }}>
              <Gallery_Card album={album} config={config} cardWidth={CARD_WIDTH} ... />
            </div>
          ))}
        </div>
      </div>

      {/* Right nav */}
      <NavButton direction="right" show={showArrows} onClick={handleNext} width={NAV_WIDTH} />
    </div>
  )}
</div>
```

### Step 4: Rewrite Gallery_Items.jsx -> Gallery_Card.jsx (single card component)

Rename to `Gallery_Card.jsx` since it now renders a single card, not the whole track. Responsibilities:

1. **Thumbnail image** with 3:2 aspect ratio, `object-cover`, fixed width from `CARD_WIDTH`
2. **Gradient overlay** + title/year (always visible, anchored to bottom of image)
3. **Hover overlay** (description text, ColorThief background):
   - `position: absolute; top: 100%; left: 0; right: 0`
   - Visibility via CSS: `opacity-0 pointer-events-none group-hover/card:opacity-100 group-hover/card:pointer-events-auto`
   - NO conditional rendering -- always in DOM, hidden via CSS
   - ColorThief runs on mount (not on hover), stores color in state
4. **Video preview** (if `album.preview` exists): same delayed-hover logic as current, but inside the fixed-size card
5. **Link**: wraps the card or is an absolute overlay inside it
6. **Z-index**: card container gets `hover:z-[200]` so overlay renders above adjacent cards

```jsx
<div
  className="relative group/card hover:z-[200] transition-all duration-200 hover:scale-105 hover:shadow-lg"
  style={{ width: CARD_WIDTH }}
>
  {/* Image + gradient + title */}
  <div className="relative w-full aspect-3/2 overflow-hidden">
    <Link to={`../${config.sectionName}/${album.url}`} className="absolute inset-0 z-20" />
    <img ... className="w-full h-full object-cover" />
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-3">
      <div className="font-bold text-white">{album.title}</div>
      <div className="text-white/80 text-sm">{album.year}</div>
    </div>
  </div>

  {/* Hover overlay -- always in DOM, CSS-only visibility */}
  <div className="absolute top-full left-0 right-0 z-50 opacity-0 pointer-events-none group-hover/card:opacity-100 group-hover/card:pointer-events-auto transition-opacity duration-200"
       style={{ backgroundColor: dynamicColor }}>
    <div className="p-4 text-white text-sm">
      {album.description[0].substring(0, 250)} [...]
    </div>
  </div>
</div>
```

### Step 5: Nav Button Component

Extract a simple nav button (can be inline or a small component):

```jsx
function NavButton({ direction, show, onClick, width }) {
  const isLeft = direction === 'left'
  return (
    <div
      onClick={show ? onClick : undefined}
      className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-0 h-full z-20 flex items-center justify-center transition-opacity duration-200 ${show ? 'opacity-100 cursor-pointer' : 'opacity-0 cursor-default'}`}
      style={{ width }}
    >
      <div className="absolute inset-0 bg-zinc-50 group-hover/carousel:opacity-0 transition-opacity duration-200" />
      <button className="z-10">
        {isLeft ? <BiChevronLeft /> : <BiChevronRight />}
      </button>
    </div>
  )
}
```

### Step 6: Gallery.css Cleanup

Remove all old carousel layout rules. The new carousel is primarily Tailwind + inline styles. Keep only:

- Thumbnail image aspect ratio / object-fit (if not handled by Tailwind)
- Font family assignments
- Landing page styles (unchanged)
- Modal styles (unchanged)
- Gallery grid styles (unchanged)

### Step 7: Router State Persistence

Adapt the current pattern to the new index system:

- On Link to landing page: pass `state={{ currentIndex }}`
- On mount in `Gallery_Carousel`: read `location.state.currentIndex`, apply via `applyTransform(index, 0)` before `setLayoutReady(true)`
- Remove `slidesOffset` from persisted state (no longer exists)

### Step 8: Responsive Font Sizing

Keep the existing `ResizeObserver` pattern for title font scaling, but attach it to the card component's container instead of the flex track.

---

## Constants to Decide

| Constant | Film Atlas Value | Suggested Portfolio Value | Notes |
|---|---|---|---|
| `CARD_WIDTH` | 352px (22rem) | 400px (25rem) | Portfolio thumbnails are landscape 3:2, wider cards look better |
| `NAV_WIDTH` | 64px (4rem) | 48px (3rem) | Portfolio has simpler nav icons |
| `GAP` | 12px | 16px (1rem) | Slightly more breathing room |
| Breakpoints | 896/1280/1728 | 768/1280/1920 | Aligned with common viewport widths |
| Transition duration | 300ms | 300ms | Same |
| Card aspect ratio | 16:10 | 3:2 | Matches current thumbnail images |

These are starting suggestions -- tune based on visual testing.

---

## Migration Checklist

1. [ ] Define constants (`CARD_WIDTH`, `NAV_WIDTH`, `GAP`, breakpoints)
2. [ ] Rewrite `Gallery_Carousel.jsx` with Film Atlas DOM structure + logic
3. [ ] Create `Gallery_Card.jsx` (single card with CSS-only hover overlay)
4. [ ] Simplify `Gallery.jsx` (remove layout computation)
5. [ ] Clean up `Gallery.css` (remove old carousel rules)
6. [ ] Wire up ColorThief (run on mount, store color in card state)
7. [ ] Wire up video preview hover (keep existing timer logic inside card)
8. [ ] Wire up router state persistence (simplified -- just `currentIndex`)
9. [ ] Wire up responsive font sizing
10. [ ] Test: hover overlay does NOT expand parent container
11. [ ] Test: overflow-y visible works (overlay renders on top of surrounding content)
12. [ ] Test: all breakpoints (1/2/3/4 cards per page)
13. [ ] Test: infinite loop edge cases (forward wrap, backward wrap)
14. [ ] Test: navigation from carousel -> landing page -> back preserves position
15. [ ] Delete `Gallery_Items.jsx` (replaced by `Gallery_Card.jsx`)
