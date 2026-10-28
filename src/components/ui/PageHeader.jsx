import { motion } from 'framer-motion'
import { Container } from './Container'
import { Img } from './Img'

export function PageHeader({ eyebrow, title, description, image, children, compact = false }) {
  return (
    <header className={`relative isolate overflow-hidden ${compact ? 'pt-32 pb-10 sm:pt-36' : 'pt-36 pb-14 sm:pt-44 sm:pb-20'}`}>
      {image && (
        <>
          <motion.div
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 -z-20"
          >
            <Img src={image.src} alt="" sizes="100vw" priority position={image.position} className="size-full" />
          </motion.div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink-950 to-transparent" />
        </>
      )}
      {!image && <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[60rem] max-w-full -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />}
      <Container>
        <motion.p
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow flex items-center gap-3"
        >
          <span className="h-px w-8 bg-gold-400/70" />
          {eyebrow}
        </motion.p>
        <h1 className="mt-5 overflow-hidden font-display text-[clamp(2.4rem,6.5vw,5.5rem)] leading-[0.98] font-extrabold tracking-tight text-balance text-bone">
          <motion.span
            className="block"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.span>
        </h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-mist sm:text-lg"
          >
            {description}
          </motion.p>
        )}
        {children}
      </Container>
    </header>
  )
}
