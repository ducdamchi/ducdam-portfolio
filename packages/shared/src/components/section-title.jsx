export default function SectionTitle({ children }) {
  return (
    <div className="z-20 flex w-full items-center justify-center overflow-hidden p-5">
      <h1 className="m-1 flex w-auto items-center justify-center overflow-hidden border-0 bg-zinc-50 p-4 font-black">
        {children}
      </h1>
    </div>
  )
}
