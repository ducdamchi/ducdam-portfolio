// import Carousel from './Carousel'
export default function Film() {
  return (
    <>
      <h1 className="relative flex justify-center items-center p-1 m-1 font-semibold border-2 border-yellow-500">
      FILM
      </h1>

      {/* <Carousel /> */}

      <div className="film-container relative w-full h-full border-2 border-yellow-500">
        <div className="film-item flex items-center justify-center gap-10 w-full h-auto border-2 border-blue-400">

          <div className="poster w-[100%] max-w-[400px] h-auto border-2 border-red-500">
            <img 
            className="w-full h-full object-contain "
            src="/film/poster1.jpg"
            />
          </div>

          <div className="info flex flex-col justify-center gap-2 w-[100%] max-w-[600px] h-auto border-2 border-red-500">
            <div>Title: A Short Film About Loving</div>
            <div>Year: 2020</div>
            <div>Director: Duc Dam</div>
            <div>Duration: 42 minutes</div>
            <div>Language: French, English, Spanish, Malay</div>
            <div>Synopsis: Due to COVID-19, students from an utopian international high school in rural India were forced to return home. Grief-stricken from a recent break up, Tom wanders around and confronts lovers who were also experiencing separation. Through a series of confessions and flashbacks, he questions the meaning of love at a fragile moment in life.</div>
            <div>Cannes Indie Shorts 2020 Official Selection</div>
            <div>Past screenings: OKIA Outdoor Cinema (Hanoi, Vietnam), Fulbright University Vietnam (HCMC, Vietnam), Mahindra United World College (Pune, India), Olympia Cinema (Cannes, France)</div>

          </div>

        </div>
      </div>
    </>

  )
}