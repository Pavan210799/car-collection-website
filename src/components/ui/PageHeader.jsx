import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Container } from './Container'
import { Img } from './Img'

const EASE = [0.22, 1, 0.36, 1]

export function PageHeader({ eyebrow, title, description, image, children, compact = false }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  return (
    <header ref={ref} className={`relative isolate overflow-hidden ${compact ? 'pt-28 pb-10 sm:pt-32 sm:pb-12' : 'pt-28 pb-12 sm:pt-36 sm:pb-16'}`}>
      <div aria-hidden="true" className="mesh-glow absolute inset-0 -z-10" />
      <div aria-hidden="true" className="dot-grid absolute inset-x-0 top-0 -z-10 h-full [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      <Container>
        <div className={`grid gap-10 ${image ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14' : ''}`}>
          <div className="min-w-0">
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
              className="eyebrow flex items-center gap-3"
            >
              <span className="h-px w-8 bg-gold-400" />
              {eyebrow}
            </motion.p>
            <h1 className="mt-5 overflow-hidden pb-1 font-display text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.02] font-extrabold tracking-tight text-balance break-words text-bone">
              <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: EASE }}>
                {title}
              </motion.span>
            </h1>
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
                className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-mist sm:text-lg"
              >
                {description}
              </motion.p>
            )}
            {children && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: EASE }}>
                {children}
              </motion.div>
            )}
          </div>

          {image && (
            <motion.div
              initial={{ clipPath: 'inset(12% 12% 12% 12% round 2rem)', opacity: 0 }}
              animate={{ clipPath: 'inset(-8% -6% -12% -6% round 2rem)', opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
              className={`relative min-w-0 overflow-hidden rounded-[2rem] bg-ink-800 shadow-lift ${compact ? 'aspect-[16/9] lg:aspect-[4/3]' : 'aspect-[16/10] lg:aspect-[5/4]'}`}
            >
              <motion.div style={{ scale: imageScale }} className="absolute inset-0">
                <Img src={image.src} alt={image.alt ?? ''} sizes="(min-width: 1024px) 45vw, 100vw" priority position={image.position} className="absolute inset-0" />
              </motion.div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-black/5" />
            </motion.div>
          )}
        </div>
      </Container>
    </header>
  )
}
