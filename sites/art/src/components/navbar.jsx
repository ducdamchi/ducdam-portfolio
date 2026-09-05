import { Navbar } from '@ducdam/shared'

const NAV_LINKS = [
  { to: '/film', label: 'Film' },
  { to: '/photography', label: 'Photography' },
  { to: '/woodworking', label: 'Woodworking' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function ArtNavbar() {
  return <Navbar currentSite="HOME" navLinks={NAV_LINKS} />
}
