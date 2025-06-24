import { Link, useMatch, useResolvedPath } from 'react-router-dom'

import { BiLogoGmail } from 'react-icons/bi'
import { BiLogoInstagram } from 'react-icons/bi'
import { BiLogoInstagramAlt } from 'react-icons/bi'
import { BiLogoGithub } from 'react-icons/bi'
import { BiCopyright } from 'react-icons/bi'
import '../App.css'

export default function Footer() {
  return (
    <>
      <div className="fixed bottom-0 z-100 flex w-[100%] items-center justify-between bg-zinc-50 p-3">
        <div className="flex gap-2 text-center text-black">
          <div className="flex items-center text-2xl">
            <a
              href={`mailto:ducdamchi@gmail.com?
              &subject=Just visited your website`}
            >
              <BiLogoGmail />
            </a>
          </div>
          <div className="text-2xl">
            <a href="https://www.instagram.com/ducdamchi" target="_blank">
              <BiLogoInstagramAlt />
            </a>
          </div>
          {/* <div className='landing-footer-facebook'>Facebook</div> */}
          <div className="text-2xl">
            <a href="https://github.com/ducdamchi" target="_blank">
              <BiLogoGithub />
            </a>
          </div>
        </div>

        <div className="text-black">
          <div className="flex items-center gap-1 text-[0.6rem] font-thin">
            <span className="footer-text">ALL IMAGES &#169; DUC DAM 2025</span>
          </div>
        </div>
      </div>
    </>
  )
}
