import { useEffect, useId, useRef } from 'react'

/**
 * Hover/click popover for the navbar. `openId` is shared by all navbar popovers so only one is open at a time.
 * A click right after a hover-open keeps the menu open instead of toggling it shut.
 */
export function useNavPopover(id, openId, setOpenId) {
  const open = openId === id
  const rootRef = useRef(null)
  const closeTimer = useRef(null)
  const openedByHover = useRef(false)
  const panelId = useId()

  useEffect(() => {
    if (!open) {
      openedByHover.current = false
      return undefined
    }
    const onPointer = (event) => !rootRef.current?.contains(event.target) && setOpenId((current) => (current === id ? null : current))
    const onKey = (event) => event.key === 'Escape' && setOpenId((current) => (current === id ? null : current))
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, id, setOpenId])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const onPointerEnter = (event) => {
    if (event.pointerType !== 'mouse') return
    clearTimeout(closeTimer.current)
    if (!open) openedByHover.current = true
    setOpenId(id)
  }

  const onPointerLeave = (event) => {
    if (event.pointerType !== 'mouse') return
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenId((current) => (current === id ? null : current)), 160)
  }

  const onClick = () => {
    if (openedByHover.current) {
      openedByHover.current = false
      setOpenId(id)
      return
    }
    setOpenId((current) => (current === id ? null : id))
  }

  return {
    open,
    panelId,
    rootProps: { ref: rootRef, onPointerEnter, onPointerLeave },
    buttonProps: { onClick, 'aria-expanded': open, 'aria-controls': panelId },
  }
}
