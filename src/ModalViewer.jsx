import React from 'react'
import ReactDom from 'react-dom'

const MODAL_BG = {
  // --bg-color: 0;
  position: 'fixed',
  top: '0',
  height: '100vh',
  background: 'rgba(0, 0, 0, 0.9)',
  width: '100%',
  zIndex: '20',
  display: 'block',
  color: 'white'
}


export default function ModalViewer({album, openModalId, closeModal }) {
  if (openModalId === null) {
    return null

  } else {
    return ReactDom.createPortal (
      <>
        <div className="modal" style={MODAL_BG}>
          <button>Prev</button>

          <div className="slides-all">
            {album.imgList.map((slide) => (
              <img 
                className="slides-each" 
                key={slide.id}
                src={slide.src}
              />
            ))}
          </div>

          <button>Next</button>
          <button onClick={closeModal}>Close</button>
        </div>
      </>,
      document.getElementById('portal')
    )
  }
}


{/* <div id="gallery-single" class="gallery-single">
<button class="prev" onclick="prevSlide()">&#8249;</button>
<div class="slides">
  <img class="slide" data-src="photography/ex1/img1.jpg"/>
  <img class="slide" data-src="photography/ex1/img2.jpg"/>
  <img class="slide" data-src="photography/ex1/img3.jpg"/>
  <img class="slide" data-src="photography/ex1/img4.jpg"/>
  <img class="slide" data-src="photography/ex1/img5.jpg"/>
</div>
<button class="next" onclick="nextSlide()">&#8250;</button>
</div>

<div id="gallery-grid" class="gallery-grid">
<div class="posts">
  <img class="post" data-src="photography/ex1/img1.jpg"/>
  <img class="post" data-src="photography/ex1/img2.jpg"/>
  <img class="post" data-src="photography/ex1/img3.jpg"/>
  <img class="post" data-src="photography/ex1/img4.jpg"/>
  <img class="post" data-src="photography/ex1/img5.jpg"/>
</div>
</div> */}