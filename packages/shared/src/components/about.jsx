import SkeletonImage from './skeleton-image'

const aboutData = {
  image: 'about.jpg',
  bio: [
    'DUC DAM is a Vietnamese filmmaker and photographer born in Hanoi and based Philadelphia. His work deals with themes of separation, exile, and curious encounters that defy national borders.',
    'His first documentary, A SHORT FILM ABOUT LOVING, told the stories of young international lovers facing separation during Covid, and was officially selected for Cannes Indie Shorts Award 2020. It was shot on a scenic campus in rural Maharashtra, India, where he studied Philosophy & Film.',
    'Following successful screenings of his first film in Hanoi, Ho Chi Minh City, Pune, and Cannes, Duc continued to travel internationally to work on photo essays in Asia and North/Central America in both digital and analogue formats.',
    'In 2025, he graduated from Swarthmore College, Pennsylvania, with a major in Computer Science and a minor in Chinese. He continues to pursue filmmaking, while working in software development and data visualization for non-profit organizations.',
  ],
  education: [
    'Swarthmore College | BA - Computer Science and Chinese',
    'Mahindra United World College in India | IB - Math, Philosophy, Film Studies',
  ],
}

export default function About() {
  return (
    <>
      <div className="mt-25 flex w-[100vw] items-center justify-center p-5">
        <h1 className="m-1 flex w-auto items-center justify-center overflow-hidden rounded-none border-0 bg-zinc-50 p-4 font-black">
          ABOUT
        </h1>
      </div>

      <div className="about-text mt-5 flex flex-grow items-center justify-center pb-10">
        <div className="relative flex h-auto w-[50%] max-w-[540px] min-w-[320px] flex-col gap-4 p-2">
          <div className="relative">
            <SkeletonImage
              src={`${import.meta.env.BASE_URL}${aboutData.image}`}
              alt=""
              className="w-full rounded-none border-1 border-[oklch(0.922_0_0)]"
            />
          </div>
          <div className="info-box-gradient rounded-none border-1 border-[oklch(0.922_0_0)] p-4 text-zinc-900">
            {aboutData.bio.map((paragraph, i) => (
              <span key={i}>
                {i > 0 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
                {paragraph}
              </span>
            ))}
          </div>
          <div className="info-box-gradient rounded-none border-1 border-[oklch(0.922_0_0)] p-4 text-zinc-900">
            <div>
              EDUCATION: <br />
            </div>
            <div className="ml-5">
              {aboutData.education.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
