import { Link, useMatch, useResolvedPath } from 'react-router-dom'

import { BiLogoGmail } from 'react-icons/bi'
import { BiLogoInstagram } from 'react-icons/bi'
import { BiLogoGithub } from 'react-icons/bi'
import { BiCopyright } from 'react-icons/bi'

export default function Footer() {
  return (
    <div className="fixed bottom-[0rem] flex w-[100%] items-center justify-between border-2 border-yellow-500 p-3">
      <div className="flex gap-2 text-center text-black">
        <div className="flex items-center text-3xl">
          <a
            href={`mailto:ducdamchi@gmail.com?
              &subject=Just visited your website
              &body=I would appreciate any thoughts that you have! --Duc`}
          >
            <BiLogoGmail />
          </a>
        </div>
        <div className="text-4xl">
          <a href="https://www.instagram.com/ducdamchi" target="_blank">
            <BiLogoInstagram />
          </a>
        </div>
        {/* <div className='landing-footer-facebook'>Facebook</div> */}
        <div className="text-4xl">
          <a href="https://github.com/ducdamchi" target="_blank">
            <BiLogoGithub />
          </a>
        </div>
      </div>

      <div className="text-black">
        <div className="flex items-center text-base">
          <BiCopyright className="text-xl" />
          <span>Duc Dam 2025</span>
        </div>
      </div>
    </div>
  )
}
