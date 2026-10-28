import { useEffect } from 'react'

let locks = 0

export function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return undefined
    locks += 1
    const { body, documentElement } = document
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth
    if (locks === 1) {
      body.style.overflow = 'hidden'
      body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : ''
    }
    return () => {
      locks -= 1
      if (locks === 0) {
        body.style.overflow = ''
        body.style.paddingRight = ''
      }
    }
  }, [active])
}
