import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

export function CountUp({ value, decimals = 0, duration = 1.6, delay = 0, className = '', startOnView = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const format = (number) =>
    number.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (reduce) {
      node.textContent = format(value)
      return undefined
    }
    if (startOnView && !inView) return undefined
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inView, reduce, startOnView])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {format(0)}
    </span>
  )
}
