# Subdomain Picker Plan

## Overview

The `{currentSite}.` div in the shared navbar becomes an interactive vertical scroll picker (iPhone timer wheel style) that lets users switch between subdomains.

The "DUC DAM" box remains static. Only the left box (site name) becomes the picker trigger.

`ducdam.com` redirects to `art.ducdam.com` (the main/default site).

---

## Sites

| Label | Subdomain | Dev Port |
|---|---|---|
| ART | `art.ducdam.com` (also `ducdam.com`) | 5173 |
| EVENTS | `events.ducdam.com` | 5174 |
| DEV | `dev.ducdam.com` | 5175 |
| POETRY | `poetry.ducdam.com` | 5176 |
| SCULPT | `sculpt.ducdam.com` | 5177 |
| INK | `ink.ducdam.com` | 5178 |

---

## Picker Component

### Trigger

- **Desktop:** Hover over the site-name box opens the picker; click also works as fallback
- **Mobile:** Tap to open
- Close on mouse leave (desktop), tap outside (mobile), or Escape key

### Wheel Mechanics

- Vertical scroll wheel with snap behavior
- Current selection is centered, adjacent items above/below are visible but scaled down and faded
- **Infinite loop:** Clone items so scrolling past top/bottom wraps around (same pattern as the gallery carousel — see `carousel-architecture.md`)
- Scroll via mouse wheel (desktop) or touch drag (mobile)
- Use `scroll-snap-type: y mandatory` with `scroll-snap-align: center` on each item for native snap, OR manual JS snap with `requestAnimationFrame` for finer control over the barrel effect

### Visual Treatment

Approach: **Flat translateY with scale/opacity** (not full 3D cylinder).

- Center item: `scale(1)`, `opacity(1)`, full size
- Adjacent items (1 away): `scale(0.75)`, `opacity(0.4)`
- Items 2+ away (clones for loop): `scale(0.5)`, `opacity(0.15)` or hidden
- Smooth interpolation between states based on scroll position
- The picker container clips overflow so only ~3 items are visible at once

### Item Height and Sizing

- Each item matches the height of the current site-name box (~2rem desktop, ~2rem mobile)
- Visible window: ~3 items tall (current + 1 above + 1 below)
- The picker expands downward (or centered) from the site-name box position

### Auto-Navigate

- After scroll stops and snaps to a new value, wait **800ms**, then trigger navigation
- If user scrolls again within the delay, cancel and restart the timer
- Visual indicator: subtle progress bar or border animation during the delay so user knows it's about to navigate
- Selecting the already-active site cancels (no navigation)

---

## Navigation and Site Transitions

### The Problem

Each subdomain is a separate React app. Switching subdomains requires `window.location.href` change — a full page reload. The goal is to make this feel like an in-app transition.

### Transition Flow

```
1. User selects new site in picker
2. 800ms auto-confirm delay (with visual indicator)
3. Exit transition plays on current site
4. window.location.href = newSiteUrl
5. New site loads, detects transition flag, plays entrance transition
6. Entrance transition completes, flag is cleared
```

### Exit Transition (Current Site)

- Full-screen overlay slides up from the bottom of the viewport, covering the page
- Color: white or matching the navbar background
- Duration: ~400ms ease-out
- After overlay fully covers the screen, trigger the `window.location.href` redirect

### Entrance Transition (New Site)

- On mount, check for transition flag (see below)
- If present: render a full-screen overlay already covering the viewport, then slide it down off the bottom of the screen (~400ms ease-in)
- Result: the new site is "revealed" from the top, creating a continuous swipe-up/swipe-down motion
- If no flag: no entrance animation (normal page load, e.g. direct URL visit)

### Transition State Passing

Use a **URL query parameter** to pass transition state between sites. This works across different origins (subdomains in production, different localhost ports in dev) unlike `sessionStorage` which is per-origin.

```js
// Before navigating (exit):
const url = new URL(targetSiteUrl)
url.searchParams.set('transition', currentSite.toLowerCase())
window.location.href = url.toString()
// e.g. https://celebs.ducdam.com/?transition=art

// On new site mount (entrance):
const params = new URLSearchParams(window.location.search)
const transitionFrom = params.get('transition')
if (transitionFrom) {
  // Play entrance animation, then clean up the URL
  window.history.replaceState({}, '', window.location.pathname)
}
```

`history.replaceState` removes the query param from the URL bar after the animation plays, so bookmarks and shared links stay clean.

### Simplification for V1

For the initial implementation, keep transitions simple:
- Exit: fade-to-white overlay (no directional slide), ~300ms
- Entrance: fade-from-white (or skip entirely)
- Upgrade to directional swipe once the basic flow works

---

## Component Architecture

### File Structure

```
packages/shared/src/
  components/
    subdomain-picker.jsx    # The scroll wheel picker component
    site-transition.jsx     # Exit/entrance overlay transition component
    navbar.jsx              # Updated to use SubdomainPicker instead of static div
```

### SubdomainPicker Props

```jsx
<SubdomainPicker
  currentSite="ART"           // Active site label
  sites={[
    { label: 'ART', url: 'https://art.ducdam.com' },
    { label: 'EVENTS', url: 'https://events.ducdam.com' },
    { label: 'DEV', url: 'https://dev.ducdam.com' },
    { label: 'POETRY', url: 'https://poetry.ducdam.com' },
    { label: 'SCULPT', url: 'https://sculpt.ducdam.com' },
    { label: 'INK', url: 'https://ink.ducdam.com' },
  ]}
/>
```

The `sites` array is defined in `@ducdam/shared` (single source of truth) and imported by each site's navbar wrapper. Each site only needs to pass its own `currentSite` label.

### SiteTransition

A component mounted at the app root (in `__root.jsx` or `main.jsx`) that:
- On mount, checks URL query param for a transition flag
- If found, renders a full-screen overlay and animates it away
- Otherwise renders nothing

```jsx
// In each site's __root.jsx or main.jsx:
<SiteTransition />
<RouterProvider router={router} />
```

### State Management (Picker)

```
isOpen          boolean     Whether the picker is visible
scrollOffset    number      Current scroll position (px or normalized)
snappedIndex    number      Which item is currently snapped to center
confirmTimer    timeout     The 800ms auto-navigate timer
```

No external state library needed — local `useState`/`useRef` in the picker component.

---

## Interaction Details

### Desktop

1. Hover over site-name box -> picker fades in / expands
2. Mouse wheel scrolls through items, snapping after momentum stops
3. 800ms after snap to a new site -> navigate
4. Mouse leaves picker area -> picker closes (cancel any pending navigation)
5. Click on site-name box also toggles picker (fallback)

### Mobile

1. Tap site-name box -> picker opens
2. Touch drag to scroll, snap on release
3. 800ms after snap to a new site -> navigate
4. Tap outside -> picker closes
5. Same visual treatment as desktop

### Edge Cases

- Selecting the current site: no navigation, picker closes
- Rapid scrolling: each new snap resets the 800ms timer
- Navigation in progress: disable further interaction (overlay is animating)
- Slow network: the exit overlay stays visible until the browser navigates away (no awkward flash)

---

## Visual Reference

```
Closed state:
  ┌──────────┐┌──────────────┐
  │   ART.   ││   DUC DAM   │
  └──────────┘└──────────────┘

Open state (ART selected):
          ↕ scrollable
  ┌──────────┐
  │   INK    │  ← faded, scaled down
  ├──────────┤
  │  ▸ ART  │  ← full size, highlighted
  ├──────────┤
  │  EVENTS  │  ← faded, scaled down
  └──────────┘
              ┌──────────────┐
              │   DUC DAM   │
              └──────────────┘
```

---

## Implementation Order

1. **SubdomainPicker component** — Build the scroll wheel with snap, loop, and auto-confirm timer. Test with console.log instead of actual navigation.
2. **Integrate into navbar** — Replace the static `{currentSite}.` div with the picker. Wire up hover/click triggers.
3. **SiteTransition component** — Build the exit overlay + entrance overlay with query param handoff.
4. **Wire up navigation** — Connect picker selection to exit transition -> redirect -> entrance transition.
5. **Polish** — Tune timing, easing, visual treatment. Test on mobile. Upgrade to directional swipe transitions.

---

## Dev/Local Testing

### Site URLs

During development, all sites run on `localhost` with different ports. The `sites` config in `@ducdam/shared` switches URLs based on environment:

```js
export const SITES = import.meta.env.DEV
  ? [
      { label: 'ART', url: 'http://localhost:5173' },
      { label: 'EVENTS', url: 'http://localhost:5174' },
      { label: 'DEV', url: 'http://localhost:5175' },
      { label: 'POETRY', url: 'http://localhost:5176' },
      { label: 'SCULPT', url: 'http://localhost:5177' },
      { label: 'INK', url: 'http://localhost:5178' },
    ]
  : [
      { label: 'ART', url: 'https://art.ducdam.com' },
      { label: 'EVENTS', url: 'https://events.ducdam.com' },
      { label: 'DEV', url: 'https://dev.ducdam.com' },
      { label: 'POETRY', url: 'https://poetry.ducdam.com' },
      { label: 'SCULPT', url: 'https://sculpt.ducdam.com' },
      { label: 'INK', url: 'https://ink.ducdam.com' },
    ]
```

### Testing Redirections Locally

To test cross-site navigation, run multiple dev servers simultaneously. Each site's Vite config pins its port with `strictPort: true` so URLs are stable:

| Site | Port |
|---|---|
| art | 5173 |
| events | 5174 |
| dev | 5175 |
| poetry | 5176 |
| sculpt | 5177 |
| ink | 5178 |

Use the root script to launch all sites in parallel:

```json
"scripts": {
  "dev:all": "pnpm --filter @ducdam/art dev & pnpm --filter @ducdam/events dev & pnpm --filter @ducdam/dev dev & pnpm --filter @ducdam/poetry dev & pnpm --filter @ducdam/sculpt dev & pnpm --filter @ducdam/ink dev"
}
```

### What works across localhost ports

- **URL query params** (`?transition=art`) — works across origins, which is why we use this for transition state
- **`window.location.href`** — normal cross-port navigation works fine
- **Shared UI** — all sites import from `@ducdam/shared`, so the navbar/picker looks identical across ports

### What doesn't work across localhost ports

- **`sessionStorage`** — per-origin, `localhost:5173` cannot read storage from `localhost:5174`
- **Cookies** — same restriction unless using a shared domain (not applicable on localhost)

Since we use query params for transition state, local cross-site testing works out of the box.
