import React from 'react'
import ReactDom from 'react-dom'
// import { useState, useRef, useEffect } from 'react'

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
    top: '5%', // = (100-height)/2
    left: '5%', // = (100-width)/2
    color: 'white',
  }

  /*************** STATES AND VARS **************/
  if (openModalId === null) {
    return null
  } else {
    return ReactDom.createPortal(
      <>
        <div className="modal-background" style={MODAL_BG} />
        <div
          className="modal-content flex items-center justify-center"
          style={MODAL_CONTENT}
        >
          <div className="flex h-[500px] w-[888px] flex-col items-center justify-center">
            <div
              className="flex w-full justify-end text-3xl font-bold"
              onClick={closeModal}
            >
              ×
            </div>

            <div className="h-full w-full">
              <iframe
                width="100%"
                height="100%"
                src={film.youtube}
                title="YouTube video player"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </>,
      document.getElementById('portal'),
    )
  }
}
