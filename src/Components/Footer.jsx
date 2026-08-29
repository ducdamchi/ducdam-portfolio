import { BiLogoGithub } from 'react-icons/bi'
import '../App.css'

export default function Footer() {
  return (
    <div className="flex w-full items-center justify-center gap-1.5 bg-zinc-50 p-3 pt-15 footer-text text-xs">
      <span className="font-thin text-black">DEVELOPED BY</span>
      <a
        href="https://github.com/ducdamchi"
        target="_blank"
        className="text-2xl text-black"
      >
        <BiLogoGithub />
      </a>
      <span className="font-thin text-black">
      DUC DAM
      </span>
    </div>
  )
}
