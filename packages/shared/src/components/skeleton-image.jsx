import { useState, forwardRef } from 'react'

const SkeletonImage = forwardRef(function SkeletonImage(
  { className, style, onLoad, ...props },
  ref,
) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-zinc-200 [animation-duration:1s]" />
      )}
      <img
        ref={ref}
        className={className}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 300ms ease-in-out',
        }}
        onLoad={(e) => {
          setLoaded(true)
          onLoad?.(e)
        }}
        {...props}
      />
    </>
  )
})

export default SkeletonImage
