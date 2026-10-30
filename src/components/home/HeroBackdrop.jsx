import { AnimatePresence, motion } from 'framer-motion'
import { srcFor } from '../ui/Img'
import { HeroFlow } from './HeroFlow'

export function HeroBackdrop({ image, slideKey, reduce, obstacleRef }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-ink-950 to-ink-950" />

      <AnimatePresence initial={false}>
        <motion.div
          key={slideKey}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-[-10%] right-[-15%] left-[5%]"
        >
          <div
            className="hero-wash absolute inset-0 opacity-30 lg:opacity-45"
            style={{ backgroundImage: `url(${srcFor(image.src, 'sm')})`, backgroundPosition: image.position ?? 'center' }}
          />
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="absolute -top-40 -left-32 size-[34rem] rounded-full bg-gold-400/18 blur-[90px]"
        animate={reduce ? undefined : { x: [0, 80, 20, 0], y: [0, 40, 90, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 size-[30rem] rounded-full bg-volt/14 blur-[90px]"
        animate={reduce ? undefined : { x: [0, -70, -20, 0], y: [0, -50, 30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />

      <HeroFlow
        obstacleRef={obstacleRef}
        pulseKey={slideKey}
        reduce={reduce}
        className="hero-flow-mask"
      />

      <div className="grain absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950 to-transparent" />
    </div>
  )
}
