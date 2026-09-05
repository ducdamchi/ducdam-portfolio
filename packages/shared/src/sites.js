const DEV_SITES = [
  { label: 'HOME', url: 'http://localhost:5173' },
  { label: 'EVENTS', url: 'http://localhost:5174' },
  { label: 'DEV', url: 'http://localhost:5175' },
  { label: 'WOOD', url: 'http://localhost:5176' },
  // { label: 'SCULPT', url: 'http://localhost:5177' },
  // { label: 'INK', url: 'http://localhost:5178' },
]

const PROD_SITES = [
  { label: 'HOME', url: 'https://home.ducdam.com' },
  { label: 'EVENTS', url: 'https://events.ducdam.com' },
  { label: 'DEV', url: 'https://dev.ducdam.com' },
  { label: 'WOOD', url: 'https://wood.ducdam.com' },
  // { label: 'SCULPT', url: 'https://sculpt.ducdam.com' },
  // { label: 'INK', url: 'https://ink.ducdam.com' },
]

export const SITES =
  typeof import.meta !== 'undefined' && import.meta.env?.DEV
    ? DEV_SITES
    : PROD_SITES
