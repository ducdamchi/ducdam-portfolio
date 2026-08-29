# Modal Redesign Plan

Two features for `Gallery_Modal.jsx`: (1) thumbnail preview strip and (2) full-screen immersion view. Includes general modal UX improvements.

---

## Current State

`Gallery_Modal.jsx` (shared across Photography, Woodworking, Film) renders via React portal with:
- Navbar: BACK button, slide counter, gallery/slides toggle
- Title
- Image display: left arrow | image (object-contain) | right arrow
- Description text below image
- Two view modes: Slides (single image + arrows) and Gallery (3-column grid)
- Responsive height via `useEffect`: 90vh (mobile landscape), 30vh (mobile portrait), 75vh (desktop)
- Navigation: `prevSlide`/`nextSlide` wrapping via index math
- No touch/swipe support, no keyboard navigation

### Problems
- **Mobile portrait**: 30vh image area is very small — wastes most of the screen
- **No swipe**: arrows are tiny and awkward on touch devices
- **No keyboard nav**: can't use arrow keys
- **Arrow buttons take 10% width each**: reduces image display area on narrow screens
- **No transition animation** between slides (instant display toggle)
- **Gallery view positioning**: `top: -5%` / `top: 10rem` is fragile

---

## Feature 1: Thumbnail Preview Strip

### Design

A horizontal strip of miniature thumbnails anchored to the bottom of the modal, below the main image and description. The strip scrolls horizontally and highlights the current image.

### Layout

```
┌──────────────────────────────────────────────┐
│  BACK                          3/12  [grid]  │  navbar
│              Album Title                     │  title
│                                              │
│   <  ┌────────────────────────────┐  >       │  main image
│      │                            │          │
│      │      current image         │          │
│      │                            │          │
│      └────────────────────────────┘          │
│         Description text here                │  description
│                                              │
│  ┌──┬──┬──┬━━┬──┬──┬──┬──┬──┬──┬──┬──┐      │  thumbnail strip
│  │  │  │  ┃▓▓┃  │  │  │  │  │  │  │  │      │  (current = full color,
│  └──┴──┴──┴━━┴──┴──┴──┴──┴──┴──┴──┴──┘      │   others = faded)
└──────────────────────────────────────────────┘
```

### Thumbnail Sizing

| Breakpoint | Thumbnail Height | Aspect Ratio | Visible Count |
|---|---|---|---|
| Mobile portrait (<768px) | 48px | 3:2 (72×48px) | 5-6 |
| Mobile landscape | 56px | 3:2 (84×56px) | 8-10 |
| Tablet (768-1024px) | 64px | 3:2 (96×64px) | 8-10 |
| Desktop (>1024px) | 72px | 3:2 (108×72px) | 10-14 |
| Large desktop (>1440px) | 80px | 3:2 (120×80px) | 14-18 |

### Thumbnail Strip Behavior

- **Container**: full width of the modal (minus some padding), `overflow: hidden`, horizontally scrollable
- **Infinite carousel**: clone-based approach matching existing carousel pattern — clone first N and last N thumbnails to create seamless infinite scroll
- **Current image**: full opacity (1.0), 2px border highlight (subtle, e.g. white or accent color)
- **Other images**: reduced opacity (0.5), no border
- **Transition**: smooth opacity transition (200ms ease-in-out) when active thumbnail changes
- **Auto-scroll**: when the user navigates via arrows/swipe/keyboard, the strip scrolls to keep the current thumbnail centered
- **Click**: clicking a thumbnail jumps the main view to that image
- **Drag-to-scroll**: the strip itself is drag-scrollable on both desktop (mouse drag) and mobile (touch drag)
- **Gap**: 4px between thumbnails
- **Strip background**: slightly darker than modal bg (e.g. `bg-zinc-100` on white mode) to visually separate it

### Implementation

**New component**: `Gallery_Thumbstrip.jsx`

```
Props:
  - imgList: array of image objects
  - currentIndex: number
  - onSelect: (index) => void

State:
  - scrollPosition (controlled via ref for performance)
  - isDragging (for drag-to-scroll)

Refs:
  - stripContainerRef (the overflow container)
  - thumbRefs[] (array of refs for each thumbnail, for scroll-into-view)
```

**Key logic:**
1. Render all thumbnails in a horizontal flex row inside an overflow-hidden container
2. On `currentIndex` change, calculate offset to center the active thumbnail and smoothly scroll (`scrollTo` with `behavior: 'smooth'`)
3. For infinite wrapping: when scroll reaches a clone boundary, instantly reposition (same pattern as main carousel)
4. Mouse/touch drag: track `mousedown`/`touchstart` -> `mousemove`/`touchmove` -> `mouseup`/`touchend` to implement drag scrolling
5. Each thumbnail is an `<img>` with `object-fit: cover` and fixed dimensions

**Integration into Gallery_Modal:**
- Render `<Gallery_Thumbstrip>` below the description, only in Slides view mode (hide in Gallery view)
- Pass `slideIndex` as `currentIndex`, `setSlideIndex` wrapped in `onSelect`

---

## Feature 2: Full-Screen Immersion View

### Design

Clicking the main image in the modal opens a true full-screen overlay — the image fills the entire viewport (width or height, depending on orientation and aspect ratio), with a dark background. Minimal UI: just the image and a close mechanism.

### Layout

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│     ┌───────────────────┐       │
│     │                   │       │
│     │   image fills     │       │  dark background
│     │   max dimension   │       │  (rgba(0,0,0,0.95))
│     │                   │       │
│     └───────────────────┘       │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### Behavior

- **Entry**: click/tap the main image in the modal's Slides view
- **Image sizing**: `object-fit: contain` with `width: 100vw; height: 100vh` — the browser will fit the image to whichever dimension is constraining based on aspect ratio and orientation
- **Background**: near-black (`rgba(0,0,0,0.95)`) full-viewport overlay
- **Close**:
  - Click/tap anywhere outside the image
  - Press `Escape`
  - Swipe down on mobile (threshold: 100px vertical displacement)
  - Small `X` button in top-right corner (subtle, semi-transparent)
- **Navigation in immersion**:
  - Swipe left/right on mobile to go to next/prev image without leaving immersion
  - Arrow keys on desktop
  - No visible arrow buttons — keep it minimal
- **Zoom** (stretch goal, not in v1): pinch-to-zoom on mobile, scroll-to-zoom on desktop
- **Transition**: fade-in (200ms opacity) on open, fade-out on close
- **Z-index**: must be above the modal (modal is z-30, immersion should be z-40+)
- **Body scroll lock**: prevent background scrolling when immersion is open

### Implementation

**New component**: `Gallery_Immersion.jsx`

```
Props:
  - imgList: array of image objects
  - currentIndex: number
  - onClose: () => void
  - onNavigate: (newIndex) => void

State:
  - isClosing (for exit animation)
```

**Key logic:**
1. Render via React portal (same `#portal` div, higher z-index)
2. Image element: `<img>` with `w-screen h-screen object-contain`
3. Click handler on background div calls `onClose`; click on image itself uses `e.stopPropagation()` to prevent closing
4. Keyboard: `useEffect` with `keydown` listener for `Escape` (close), `ArrowLeft` (prev), `ArrowRight` (next)
5. Touch navigation: track touch start/end for horizontal swipe (>50px threshold = navigate) and vertical swipe down (>100px threshold = close)
6. On open, add `overflow: hidden` to `document.body`; on close/unmount, restore it

**Integration into Gallery_Modal:**
- Add `isImmersionOpen` state (boolean) and `immersionIndex` state
- On main image click: `setIsImmersionOpen(true)`, `setImmersionIndex(slideIndex)`
- Add cursor style to main image: `cursor: zoom-in` to hint at clickability
- Render `<Gallery_Immersion>` conditionally when `isImmersionOpen` is true
- When navigating in immersion, also update `slideIndex` so the modal stays in sync

---

## General Modal Improvements

These improvements should be done alongside or before the two features above.

### 1. Mobile Swipe Navigation (replaces arrows)

- **Detect mobile**: use existing `isMobileMode` flag
- **Hide arrow buttons** on mobile (they're too small to be useful)
- **Add touch handlers** to the main image area:
  - `onTouchStart`: record start X position
  - `onTouchEnd`: compare end X — if delta > 50px, navigate; direction based on sign
- **Implementation**: add touch event listeners to `modalContentRef` (the flex container holding the image)

### 2. Keyboard Navigation (all devices)

- `ArrowLeft` / `ArrowRight`: prev/next slide
- `Escape`: close modal
- `g`: toggle gallery view
- Add `useEffect` with `keydown` listener, clean up on unmount
- Only active when modal is open and immersion is NOT open

### 3. Image Size Improvements

Current responsive heights are suboptimal. Proposed changes:

| Context | Current | Proposed |
|---|---|---|
| Desktop | 75vh | 70vh (leaves room for thumbnail strip) |
| Mobile portrait | 30vh | 50vh (much more usable) |
| Mobile landscape | 90vh | 75vh (leaves room for strip + description) |

The thumbnail strip (~48-80px depending on breakpoint) plus description sits below, so the main image area should be reduced slightly to accommodate without scrolling.

### 4. Slide Transition Animation

Replace the instant `display: none/inline-block` toggle with a fade transition:
- Use opacity + CSS transition instead of display toggling
- Keep `position: absolute` on all slides so they stack
- Active slide: `opacity: 1`, others: `opacity: 0; pointer-events: none`
- Transition: `opacity 200ms ease-in-out`

### 5. Better Layout Structure

Restructure the modal to use a proper viewport-filling flex column layout instead of the current `h-[110vh]` + negative top offset approach:

```
<div className="fixed inset-0 z-30 flex flex-col">
  {/* Navbar */}
  {/* Title */}
  {/* Main image area (flex-1, fills remaining space) */}
  {/* Description */}
  {/* Thumbnail strip */}
</div>
```

This eliminates the `top-[-110vh]` hack and makes the layout naturally responsive.

---

## File Changes Summary

| File | Action |
|---|---|
| `Gallery_Thumbstrip.jsx` | **Create** — thumbnail strip component |
| `Gallery_Immersion.jsx` | **Create** — full-screen immersion component |
| `Gallery_Modal.jsx` | **Modify** — integrate both features, add swipe/keyboard, restructure layout |
| `Gallery.css` | **Modify** — add thumbnail strip styles, immersion styles, update modal layout |

---

## Implementation Order

1. **Restructure modal layout** — switch from `h-[110vh]` hack to `fixed inset-0 flex flex-col`
2. **Add keyboard navigation** — quick win, no visual changes
3. **Add mobile swipe** — replace arrows on mobile
4. **Add slide transition animation** — fade instead of instant toggle
5. **Adjust image sizing** — update responsive heights for new layout
6. **Build `Gallery_Thumbstrip`** — create component, integrate below description
7. **Build `Gallery_Immersion`** — create component, integrate on image click
8. **Test across breakpoints** — mobile portrait/landscape, tablet, desktop, large desktop

---

## Questions to Resolve Before Implementation

1. Should the thumbnail strip be visible on mobile portrait, or only on larger screens? (Recommendation: show it — it aids navigation, especially with arrows hidden) -- show it
2. Should immersion view support swiping between images, or just show a single image? (Plan above includes swipe navigation — confirm this is desired) -- include swipe
3. Should the old `Photo_Modal.jsx` and `Woodworking/Photo_Modal.jsx` be deleted since `Gallery_Modal.jsx` is the shared version? (They appear to be legacy duplicates) -- yes, use the shared design
