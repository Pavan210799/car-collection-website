import { useEffect, useRef } from 'react'

const PALETTE = [
  [226, 68, 92],
  [245, 158, 11],
  [15, 118, 110],
]

const mix = (from, to, t) => from.map((value, i) => Math.round(value + (to[i] - value) * t))
const colorAt = (t) => (t < 0.5 ? mix(PALETTE[0], PALETTE[1], t * 2) : mix(PALETTE[1], PALETTE[2], t * 2 - 1))
const rgba = ([r, g, b], alpha) => `rgba(${r},${g},${b},${alpha})`

/**
 * Wind-tunnel style streamlines drawn on canvas. Lines bend around `obstacleRef` (the car image),
 * dodge the mouse, and tracer particles run along them. `pulseKey` changes trigger a burst of speed.
 */
export function HeroFlow({ obstacleRef, pulseKey, reduce, className = '' }) {
  const canvasRef = useRef(null)
  const pulse = useRef(0)

  useEffect(() => {
    pulse.current = 1
  }, [pulseKey])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return undefined

    let width = 0
    let height = 0
    let lines = []
    let tracers = []
    let obstacle = null
    let frame = 0
    let running = false
    let inView = true
    let last = 0
    let time = 0
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, strength: 0, target: 0 }

    const yAt = (line, x) => {
      let y =
        line.base +
        Math.sin(x * 0.0042 + time * 0.6 + line.phase) * line.amp +
        Math.sin(x * 0.011 - time * 0.9 + line.phase * 1.7) * line.amp * 0.35
      if (obstacle) {
        const dy = line.base - obstacle.cy
        const ny = dy / (obstacle.ry * 1.15)
        const gx = (x - obstacle.cx) / (obstacle.rx * 1.3)
        y += Math.sign(dy || 1) * obstacle.ry * 0.9 * Math.exp(-gx * gx * 1.4) * Math.exp(-ny * ny)
      }
      if (pointer.strength > 0.01) {
        const dx = x - pointer.x
        const dyp = y - pointer.y
        const radius = 110
        y += Math.sign(dyp || 1) * radius * 0.5 * pointer.strength * Math.exp(-(dx * dx + dyp * dyp) / (2 * radius * radius))
      }
      return y
    }

    const spawn = (anywhere) => ({
      line: Math.floor(Math.random() * lines.length),
      x: anywhere ? Math.random() * width : -40 - Math.random() * width * 0.6,
      speed: 150 + Math.random() * 260,
      tail: 50 + Math.random() * 80,
    })

    const draw = (dt) => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (const line of lines) {
        ctx.beginPath()
        for (let x = -20; x <= width + 20; x += 14) {
          const y = yAt(line, x)
          if (x === -20) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        const gradient = ctx.createLinearGradient(0, 0, width, 0)
        gradient.addColorStop(0, rgba(line.color, 0))
        gradient.addColorStop(0.3, rgba(line.color, line.alpha))
        gradient.addColorStop(1, rgba(line.color, line.alpha * 0.8))
        ctx.strokeStyle = gradient
        ctx.lineWidth = line.width
        ctx.stroke()
      }

      if (reduce) return
      const boost = 1 + pulse.current * 3
      for (const tracer of tracers) {
        tracer.x += tracer.speed * boost * dt
        if (tracer.x - tracer.tail > width + 20) Object.assign(tracer, spawn(false))
        const line = lines[tracer.line]
        if (!line) continue
        const tail = tracer.tail * (1 + pulse.current * 1.5)
        const start = tracer.x - tail
        ctx.beginPath()
        for (let k = 0; k <= 6; k++) {
          const x = start + (tail * k) / 6
          const y = yAt(line, x)
          if (k === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        const gradient = ctx.createLinearGradient(start, 0, tracer.x, 0)
        gradient.addColorStop(0, rgba(line.color, 0))
        gradient.addColorStop(1, rgba(line.color, 0.9))
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.8
        ctx.stroke()

        const headY = yAt(line, tracer.x)
        ctx.fillStyle = rgba(line.color, 0.16)
        ctx.beginPath()
        ctx.arc(tracer.x, headY, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = rgba(line.color, 0.95)
        ctx.beginPath()
        ctx.arc(tracer.x, headY, 1.7, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const measure = () => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const box = obstacleRef?.current?.getBoundingClientRect()
      obstacle = box?.width
        ? { cx: box.left - rect.left + box.width / 2, cy: box.top - rect.top + box.height / 2, rx: box.width / 2, ry: box.height / 2 }
        : null

      const count = Math.round(Math.min(34, Math.max(16, height / 24)))
      lines = Array.from({ length: count }, (_, i) => ({
        base: ((i + 0.5) / count) * height,
        phase: i * 0.55,
        amp: 8 + (i % 5) * 3,
        color: colorAt(i / (count - 1)),
        alpha: 0.22 + ((i * 7) % 5) * 0.05,
        width: i % 4 === 0 ? 1.6 : 1.1,
      }))
      tracers = Array.from({ length: Math.round(Math.min(48, Math.max(14, width / 28))) }, () => spawn(true))
      draw(0)
    }

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      pulse.current *= Math.exp(-dt * 1.4)
      time += dt * (1 + pulse.current * 2)
      const ease = Math.min(1, dt * 7)
      pointer.x += (pointer.tx - pointer.x) * ease
      pointer.y += (pointer.ty - pointer.y) * ease
      pointer.strength += (pointer.target - pointer.strength) * Math.min(1, dt * 4)
      draw(dt)
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running || reduce || !inView || document.hidden) return
      running = true
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    let measureFrame = 0
    const scheduleMeasure = () => {
      cancelAnimationFrame(measureFrame)
      measureFrame = requestAnimationFrame(measure)
    }
    const resizeObserver = new ResizeObserver(scheduleMeasure)
    resizeObserver.observe(canvas)
    if (obstacleRef?.current) resizeObserver.observe(obstacleRef.current)

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) start()
      else stop()
    })
    intersection.observe(canvas)

    const onVisibility = () => (document.hidden ? stop() : start())
    const onPointerMove = (event) => {
      if (event.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      pointer.target = inside ? 1 : 0
      if (!inside) return
      if (pointer.strength < 0.02) {
        pointer.x = x
        pointer.y = y
      }
      pointer.tx = x
      pointer.ty = y
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    measure()
    start()

    return () => {
      stop()
      cancelAnimationFrame(measureFrame)
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [obstacleRef, reduce])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 size-full ${className}`} />
}
