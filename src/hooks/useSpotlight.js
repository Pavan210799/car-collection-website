import { useEffect } from 'react'

/** Feeds the pointer position into `.spotlight` cards as `--mx` / `--my` for the hover glow. */
export function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return undefined
    let frame = 0
    let last = null

    const update = () => {
      frame = 0
      const card = last?.target instanceof Element ? last.target.closest('.spotlight') : null
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${last.clientX - rect.left}px`)
      card.style.setProperty('--my', `${last.clientY - rect.top}px`)
    }

    const onMove = (event) => {
      last = event
      if (!frame) frame = requestAnimationFrame(update)
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])
}
