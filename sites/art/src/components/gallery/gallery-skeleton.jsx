export default function Gallery_Skeleton({ cardWidth }) {
  return (
    <div style={{ width: cardWidth }}>
      <div className="relative aspect-3/2 w-full animate-pulse [animation-duration:1s] bg-zinc-200">
        {/* <div className="absolute bottom-0 left-0 flex w-4/5 flex-col gap-2 p-3">
          <div className="h-4 w-3/4 rounded bg-zinc-300" />
          <div className="h-3 w-1/3 rounded bg-zinc-300" />
        </div> */}
      </div>
    </div>
  )
}
