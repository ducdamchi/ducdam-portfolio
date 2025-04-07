import React from 'react'
import ReactDom from 'react-dom'
import { useState, useRef, useEffect } from 'react'
import '../../App.css'
import { PiGridNineBold } from "react-icons/pi";
import { TbSlideshow } from "react-icons/tb";
import { TbBackground } from "react-icons/tb";

export default function ModalViewer({ film, openModalId, closeModal }) {

  /*************** CSS **************/
  const MODAL_BG = {
    zIndex: '4',
    position: 'fixed',
    top: '0%',
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.9)',
  }
  
  const MODAL_CONTENT = {
    zIndex: '5',
    position: 'absolute',
    textAlign: 'center',
    width: '90%',
    height: '90%', 
    top: '5%',// = (100-height)/2
    left: '5%', // = (100-width)/2
    color: 'white',
    borderWidth: '2px',
    borderColor: 'red'
  }
  
  /*************** STATES AND VARS **************/
  if (openModalId === null) {
    return null;
  } else {
    return ReactDom.createPortal (
      <>
        <div className="modal-background" style={MODAL_BG}/>
        <div className="modal-content flex justify-center items-center" style={MODAL_CONTENT}>
          <div className="flex flex-col w-[50%] h-[50%] justify-center items-center">

            <div className="flex w-full justify-end border-2 border-blue-500 font-bold text-3xl" onClick={closeModal}>
            ×
            </div>

            <div className="w-full h-full border-2 border-blue-500">
              <iframe width="100%" height="100%" src={film.youtube} title="YouTube video player" allowFullScreen></iframe>
            </div>

          </div>

        </div>
      </>,
      document.getElementById('portal')
    );
  }
}

        {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/ly36kn0ug4k?si=Lkw0yPdtRxfxjb_E" title="YouTube video player" allowFullScreen></iframe> */}