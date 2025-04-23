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