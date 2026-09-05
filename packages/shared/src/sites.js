const DEV_SITES = [
  { label: 'FILM & PHOTO', url: 'http://localhost:5173' },
  { label: 'CELEBRATIONS', url: 'http://localhost:5174' },
  { label: 'SOFTWARE', url: 'http://localhost:5175' },
  { label: 'WOODWORKING', url: 'http://localhost:5176' },
]

const PROD_SITES = [
  { label: 'FILM & PHOTO', url: 'https://ducdam.com' },
  { label: 'CELEBRATIONS', url: 'https://celeb.ducdam.com' },
  { label: 'SOFTWARE', url: 'https://dev.ducdam.com' },
  { label: 'WOODWORKING', url: 'https://wood.ducdam.com' },
]

export const SITES =
  typeof import.meta !== 'undefined' && import.meta.env?.DEV
    ? DEV_SITES
    : PROD_SITES
