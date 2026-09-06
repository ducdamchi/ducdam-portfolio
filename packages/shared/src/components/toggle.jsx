import { useState, useEffect } from 'react'

/**
 * Generic sliding-tab toggle.
 * options: [{ value, label }]
 * Slider width = 100% / options.length, translates by index * 100%.
 */
export default function Toggle({ options, value, onChange, label }) {
  const urlIndex = options.findIndex((opt) => opt.value === value)
  const [pendingIndex, setPendingIndex] = useState(null)

  useEffect(() => {
    if (pendingIndex !== null && pendingIndex === urlIndex)
      setPendingIndex(null)
  }, [urlIndex, pendingIndex])

  const activeIndex = pendingIndex ?? urlIndex

  const sliderWidth = `${100 / options.length}%`
  const sliderTranslate =
    activeIndex >= 0 ? `translateX(${activeIndex * 100}%)` : 'translateX(0)'

  return (
    <div className="flex w-full flex-col items-center gap-2 p-2 md:flex-row md:justify-center md:gap-5">
      {label && (
        <div className="self-center text-xs uppercase tracking-wide md:w-28 md:text-end">
          {label}
        </div>
      )}
      <div
        className="relative h-10 w-80 rounded-none bg-zinc-200 text-sm"
        style={{ boxShadow: 'inset 0 1px 2px rgba(120,120,120,0.3)' }}
      >
        <div className="relative flex h-full w-full">
          {/* Slider background */}
          <div
            className="absolute h-full rounded-none bg-zinc-900 shadow-md"
            style={{
              width: sliderWidth,
              transform: sliderTranslate,
              transition: 'transform 400ms ease-in-out',
            }}
          />
          {/* Option buttons */}
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPendingIndex(idx)
                onChange(opt.value)
              }}
              className="z-10 flex flex-1 items-center justify-center rounded-none py-2 text-center"
              style={{
                color:
                  activeIndex === idx
                    ? 'rgb(250,250,250)'
                    : 'rgb(160,160,160)',
                fontWeight: activeIndex === idx ? 600 : 400,
                transition: 'color 100ms ease-in',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
