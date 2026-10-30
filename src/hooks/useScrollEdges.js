import { useEffect, useState } from 'react'

/** Tracks whether a horizontal scroller has hidden content before/after the visible area. */
export function useScrollEdges(ref) {
  const [edges, setEdges] = useState({ start: false, end: false })

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const update = () => {
      const max = node.scrollWidth - node.clientWidth
      const next = { start: node.scrollLeft > 2, end: node.scrollLeft < max - 2 }
      setEdges((current) => (current.start === next.start && current.end === next.end ? current : next))
    }
    update()
    node.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(node)
    for (const child of node.children) observer.observe(child)
    return () => {
      node.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [ref])

  return edges
}
