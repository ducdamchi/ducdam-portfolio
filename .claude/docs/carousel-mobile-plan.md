# Carousel Mobile Responsive Plan

## Trigger

Mobile mode activates when the parent container width is less than `CARD_WIDTH + 2 * NAV_WIDTH` (currently 576 + 112 = **688px**). This is the minimum width needed to display one card with both nav buttons uncropped. Below this threshold, the carousel is replaced with a simple vertical list.

---

## Current State (what changes)

| Aspect | Desktop (>= 688px) | Mobile (< 688px) |
|---|---|---|
| Layout | Horizontal carousel with clones, transforms, infinite loop | Vertical stack, native scroll |
| Card width | Fixed `CARD_WIDTH` (576px) | 100% of container width |
| Nav buttons | Visible, absolutely positioned | None |
| Navigation | Click arrows | Native page scroll (vertical) |
| Info overlay | CSS hover (`group-hover/card`), absolute positioned | Always visible, in-flow below image |
| Clones | Prepend/append for infinite loop | None — all real items rendered once |
| Card scale on hover | `hover:scale-105 hover:shadow-lg` | Disabled (no hover on touch) |

---

## Implementation Plan

### 1. Add mobile mode detection in `Gallery_Carousel.jsx`

Store `containerWidth` from the existing `ResizeObserver` callback and derive `isMobile`:

```js
const MOBILE_BREAKPOINT = CARD_WIDTH + 2 * NAV_WIDTH  // 688px

const [containerWidth, setContainerWidth] = useState(0)
const isMobile = containerWidth < MOBILE_BREAKPOINT
```

The `ResizeObserver` callback already reads `parent.offsetWidth` — store it in state alongside the existing `setSlidesPerPage` call.

### 2. Render vertical list when mobile

When `isMobile` is true, skip the entire carousel DOM (outer container, overflow wrapper, track, clones, nav buttons) and render a simple vertical list instead:

```jsx
if (isMobile) {
  return (
    <div className="flex w-full flex-col gap-6 px-4">
      {items.map((album) => (
        <Gallery_Card
          key={album.id}
          album={album}
          config={config}
          cardWidth="100%"
          currentIndex={0}
          isClone={false}
          isMobile={true}
        />
      ))}
    </div>
  )
}

// ... existing carousel return for desktop
```

This means:
- No clones (no `prepend`/`append`) — each item rendered once
- No `trackRef`, no `applyTransform`, no `handleNext`/`handlePrev`
- No `NavButton` components
- No `overflowX: clip` container
- User scrolls the page naturally to see all cards
- Gap between cards via `gap-6` (24px vertical spacing)
- Horizontal padding via `px-4` (16px on each side)

### 3. Always show info overlay on mobile (`Gallery_Card.jsx`)

Accept `isMobile` prop. When mobile, the hover overlay switches from absolute-positioned + hover-triggered to in-flow + always visible:

```jsx
{!isClone && (
  <div
    className={
      isMobile
        ? ''  // in-flow, always visible
        : 'pointer-events-none absolute top-full right-0 left-0 z-50 opacity-0 transition-opacity duration-200 group-hover/card:pointer-events-auto group-hover/card:opacity-100'
    }
    style={{ backgroundColor: dynamicColor }}
  >
    <div className="gallery-card-description p-4 text-sm font-thin text-zinc-50">
      {`${album.description[0].substring(0, 250)} [...]`}
    </div>
  </div>
)}
```

### 4. Disable hover effects on mobile (`Gallery_Card.jsx`)

The card container conditionally applies hover classes:

```jsx
<div
  className={`group/card relative transition-all duration-200 hover:z-[200] ${
    isMobile ? '' : 'hover:scale-105 hover:shadow-lg'
  }`}
  style={{ width: isMobile ? '100%' : cardWidth }}
>
```

No `onMouseEnter`/`onMouseLeave` needed on mobile (video preview hover is desktop-only).

### 5. Card width on mobile

`cardWidth` prop becomes `"100%"` (string) on mobile. The card's `style={{ width: cardWidth }}` handles both cases — `576` (number, px) on desktop, `"100%"` (string) on mobile. The aspect-3/2 class on the image container ensures correct proportions at any width.

---

## File Changes Summary

| File | Changes |
|---|---|
| `Gallery_Carousel.jsx` | Add `containerWidth` state, `isMobile` derived flag, early return with vertical list when mobile |
| `Gallery_Card.jsx` | Accept `isMobile` prop, conditionally show overlay in-flow, disable hover scale/shadow, accept `"100%"` width |

No new files needed. No CSS changes needed.

---

## What we avoid by using vertical list

- No touch/swipe gesture handling (complex, error-prone, redundant with native scroll)
- No mobile-specific clone logic
- No mobile-specific transform calculations
- No custom scroll physics or snap points
- No arrow visibility/sizing concerns on small screens

---

## Edge Cases

1. **Orientation change**: `ResizeObserver` fires, `containerWidth` updates, `isMobile` recalculates — component switches between carousel and vertical list automatically
2. **Tablet portrait (e.g. 768px)**: Above 688px breakpoint, gets full desktop carousel with arrows
3. **Very narrow screens (< 375px)**: Cards are 100% width with `px-4` padding, scales naturally
4. **Router state persistence**: On mobile there is no carousel index to persist — navigating to a landing page and back just re-renders the vertical list (scroll position is handled by the browser)
