import { Navbar } from '@ducdam/shared'

const NAV_LINKS = [
  { to: '/', label: 'Gallery' },
]

export default function WoodNavbar() {
  return <Navbar currentSite="WOOD" navLinks={NAV_LINKS} />
}
