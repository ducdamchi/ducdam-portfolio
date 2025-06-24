                {/* <div className='relative top-5' style={INFO_GRID}>

                  <div className="font-bold">Director: </div>
                  <div>{film.director}</div>

                  <div className="font-bold">Runtime: </div>
                  <div>{film.runtime}</div>
       
                  <div className="font-bold">Language: </div>
                  <div>{film.language}</div>

                  <div className="font-bold">Synopsis: </div>
                  <div>{film.synopsis}</div>

                  {(film.recognition != '') && 
                      <div className="font-bold">Recognition: </div>}
                  {(film.recognition != '') && 
                      <div>{film.recognition}</div>}

                  {(film.screenings != '') && 
                    <div className="font-bold">Screenings: </div>}
                  {(film.screenings != '') && 
                    <div>{film.screenings}</div>}

                </div> */}
  const INFO_GRID = {
    display: 'grid',
    gridTemplateColumns: '1fr 4fr',
    gridAutoRows: 'minmax(25px, auto)',
    gridColumnGap: '5px',
    gridRowGap: '5px'
  }


              <div className='info-slide flex-[1] flex flex-col border-2 border-red-500 p-2 m-2'>
  
                  <div className="relative top-3 font-bold text-2xl">
                    {film.title} ({film.year})
                  </div>
  
  
                  <div className='relative top-5'>
  
                    <div><span className='font-bold'>Director: </span>{film.director}</div>
  
                    <div><span className='font-bold'>Runtime: </span>{film.runtime}</div>
  
                    <div><span className='font-bold'>Language: </span>{film.language}</div>
  
                    <div><span className='font-bold'>Synopsis: </span>{film.synopsis}</div>
  
                    {(film.recognition != '') && 
                      <div><span className='font-bold'>Festivals: </span>{film.recognition}</div>}
      
                    {(film.screenings != '') && 
                      <div><span className='font-bold'>Screenings: </span>{film.screenings}</div>}
  
  
                  </div>
              </div>



       {/* MODAL - NAV WINDOW */}

       <div className="modal-topRightNav flex h-full flex-col items-center justify-center gap-10 border-2 border-rose-500">
       {/* Button for closing modal, shared */}
       <button
         className="text-md sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl"
         onClick={closeModal}
       >
         ×
       </button>

       <div className="sm:text-md text-sm font-bold md:text-lg lg:text-xl xl:text-3xl">
         {`${slideIndex + 1}/${album.numImages}`}
       </div>

       {/* Button for switching between Slides View and Gallery View, shared */}
       <button
         className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-6xl"
         onClick={toggleView}
       >
         {isGalleryView ? <TbSlideshow /> : <PiGridNineBold />}
       </button>

       {/* Button for switching modal background colors (black, grey, white), shared*/}
       <button
         className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-6xl"
         onClick={toggleBackground}
       >
         <TbBackground />
       </button>
     </div>


<div className="w-inherit absolute top-0 h-[45%] border-2 border-violet-500"></div>

        {/* <div className="landing-footer-wrapper flex justify-center">
          <div className="landing-footer">
            <div className="landing-footer-left flex gap-2 text-center">
              <div className="landing-footer-gmail flex items-center text-3xl">
                <a
                  href={`mailto:ducdamchi@gmail.com?
                  &subject=Just viewed your album '${matchedAlbum.title}'
                  &body=I would appreciate any thoughts that you have! --Duc`}
                >
                  <BiLogoGmail />
                </a>
              </div>
              <div className="landing-footer-insta flex items-center text-4xl">
                <a href="https://www.instagram.com/ducdamchi" target="_blank">
                  <BiLogoInstagram />
                </a>
              </div>
              {/* <div className='landing-footer-facebook'>Facebook</div> */}
              <div className="landing-footer-git flex items-center text-4xl">
                <a href="https://github.com/ducdamchi" target="_blank">
                  <BiLogoGithub />
                </a>
              </div>
            </div>

            <div className="landing-footer-right">
              <div className="landing-footer-copyright flex items-center text-base">
                <BiCopyright />
                <span>Duc Dam 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      /* .landing-footer {
  display: flex;
  position: absolute;
  /* left: 10rem; */
  bottom: 5rem;
  justify-content: space-between;
  align-items: center;
  z-index: 2;

  /* border-width: 2px;
  border-color: blue; */
  width: 80%;

  color: white;
} */