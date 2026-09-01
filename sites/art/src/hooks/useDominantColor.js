import { useState, useEffect } from 'react'

export function computeBrightness(color) {
  return Math.round(
    Math.sqrt(
      color[0] * color[0] * 0.241 +
        color[1] * color[1] * 0.691 +
        color[2] * color[2] * 0.068,
    ),
  )
}

export function adjustColor(color, brightness, alpha = 0.85) {
  let scale = 1
  if (brightness >= 194) scale = 0.33
  else if (brightness >= 130) scale = 0.66
  return `rgba(${color[0] * scale}, ${color[1] * scale}, ${color[2] * scale}, ${alpha})`
}

export function useDominantColor(imgRef, { deps = [], enabled = true } = {}) {
  const [colorData, setColorData] = useState(null)

  useEffect(() => {
    if (!enabled) {
      setColorData(null)
      return
    }
    const img = imgRef.current
    if (!img) return

    const extract = () => {
      try {
        const colorThief = new window.ColorThief()
        const color = colorThief.getColor(img)
        const brightness = computeBrightness(color)
        setColorData({ color, brightness })
      } catch (err) {
        console.warn('ColorThief error:', err)
      }
    }

    if (img.complete && img.naturalHeight !== 0) {
      extract()
    } else {
      img.addEventListener('load', extract)
      return () => img.removeEventListener('load', extract)
    }
  }, deps)

  return colorData
}
