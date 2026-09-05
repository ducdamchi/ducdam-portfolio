import { Navbar } from '@ducdam/shared'

const NAV_LINKS = [
  { to: '/film', label: 'Film' },
  { to: '/photography', label: 'Photography' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function ArtNavbar() {
  return <Navbar currentSite="FILM & PHOTO" navLinks={NAV_LINKS} />
}
