import { Navbar } from '@ducdam/shared'

const NAV_LINKS = [
  { to: '/', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function CelebNavbar() {
  return <Navbar currentSite="CELEBRATIONS" navLinks={NAV_LINKS} />
}
