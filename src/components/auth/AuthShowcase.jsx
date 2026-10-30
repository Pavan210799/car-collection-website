import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Gauge, ShieldCheck, Timer, Zap } from 'lucide-react'
import { Img } from '../ui/Img'
import { heroSlides } from '../../data/site'
import { carsById } from '../../data/cars'
import { formatNumber } from '../../lib/format'
import { EASE } from './authUi'

const SLIDE_MS = 6000

const slides = heroSlides
  .map((slide) => {
    const car = carsById.get(slide.car)
    return car ? { ...slide, car, image: car.heroImage ?? car.images[0] } : null
  })
  .filter(Boolean)

const speedLines = [
  { top: '22%', width: '38%', duration: 2.6, delay: 0 },
  { top: '41%', width: '24%', duration: 3.2, delay: 1.1 },
  { top: '58%', width: '46%', duration: 2.2, delay: 0.5 },
  { top: '73%', width: '30%', duration: 3.6, delay: 1.8 },
]

function useSlideIndex() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => setIndex((current) => (current + 1) % slides.length), SLIDE_MS)
    return () => clearTimeout(timer)
  }, [index])
  return [index, setIndex]
}

function Backdrop({ slide, priority }) {
  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.car.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.14 }}
          animate={{ opacity: 1, scale: 1, transition: { opacity: { duration: 1.1, ease: EASE }, scale: { duration: SLIDE_MS / 1000 + 1.2, ease: 'linear' } } }}
          exit={{ opacity: 0, transition: { duration: 1.1 } }}
        >
          <Img src={slide.image.src} alt="" priority={priority} sizes="(min-width: 1024px) 55vw, 100vw" position={slide.image.position} className="absolute inset-0" />
        </motion.div>
      </AnimatePresence>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {speedLines.map((line) => (
          <motion.span
            key={line.top}
            className="absolute left-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
            style={{ top: line.top, width: line.width }}
            initial={{ x: '-110%' }}
            animate={{ x: '320%' }}
            transition={{ duration: line.duration, delay: line.delay, repeat: Infinity, repeatDelay: 1.4, ease: [0.45, 0, 0.2, 1] }}
          />
        ))}
      </div>
    </>
  )
}

function Progress({ index, onSelect }) {
  return (
    <div className="flex gap-2" role="tablist" aria-label="Featured cars">
      {slides.map((slide, itemIndex) => (
        <button
          key={slide.car.id}
          type="button"
          role="tab"
          aria-selected={itemIndex === index}
          aria-label={slide.car.name}
          onClick={() => onSelect(itemIndex)}
          className="group/bar relative h-6 min-w-0 flex-1"
        >
          <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25 transition-colors group-hover/bar:bg-white/40">
            {itemIndex === index && (
              <motion.span
                key={index}
                className="block h-full origin-left rounded-full bg-white"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
              />
            )}
            {itemIndex < index && <span className="block h-full rounded-full bg-white/70" />}
          </span>
        </button>
      ))}
    </div>
  )
}

export function AuthShowcase() {
  const [index, setIndex] = useSlideIndex()
  const slide = slides[index]
  const specs = [
    { icon: Zap, label: 'Power', value: `${formatNumber(slide.car.specs.power)} hp` },
    { icon: Timer, label: '0–100', value: `${slide.car.specs.acceleration} s` },
    { icon: Gauge, label: 'Top speed', value: `${slide.car.specs.topSpeed} km/h` },
  ]

  return (
    <aside className="relative hidden p-4 lg:sticky lg:top-0 lg:block lg:h-dvh">
      <motion.div
        initial={{ clipPath: 'inset(6% 6% 6% 6% round 2rem)', opacity: 0 }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)', opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="relative flex size-full flex-col overflow-hidden rounded-[2rem] bg-night p-8 text-white shadow-lift xl:p-10"
      >
        <Backdrop slide={slide} priority />

        <div className="relative flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            Private members’ garage
          </span>
          <span className="font-mono text-xs tracking-[0.2em] text-white/70">
            {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div>

        <div className="relative mt-auto">
          <AnimatePresence mode="wait">
            <motion.div key={slide.car.id} initial="hidden" animate="show" exit="exit">
              <motion.ul
                variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } } }}
                className="mb-8 flex flex-wrap gap-2.5"
              >
                {specs.map((spec, specIndex) => (
                  <motion.li
                    key={spec.label}
                    variants={{
                      hidden: { opacity: 0, y: 16, scale: 0.95 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
                      exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
                    }}
                  >
                    <motion.span
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4 + specIndex, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/20"
                    >
                      <spec.icon className="size-4 shrink-0 text-gold-300" />
                      <span className="leading-tight">
                        <span className="block text-[0.6rem] font-semibold tracking-[0.18em] text-white/60 uppercase">{spec.label}</span>
                        <span className="block font-display text-sm font-bold">{spec.value}</span>
                      </span>
                    </motion.span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.p
                variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } }, exit: { opacity: 0 } }}
                className="text-xs font-semibold tracking-[0.28em] text-gold-300 uppercase"
              >
                {slide.kicker}
              </motion.p>
              <h2 className="mt-3 font-display text-[clamp(2.4rem,4.2vw,4.25rem)] leading-[0.98] font-extrabold tracking-tight">
                {slide.title.map((line, lineIndex) => (
                  <span key={line} className="block overflow-hidden pb-[0.06em]">
                    <motion.span
                      className="block"
                      variants={{
                        hidden: { y: '105%' },
                        show: { y: 0, transition: { duration: 0.85, delay: 0.1 + lineIndex * 0.1, ease: EASE } },
                        exit: { y: '-105%', transition: { duration: 0.35, ease: [0.55, 0, 0.75, 0.2] } },
                      }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h2>
              <motion.p
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.35, ease: EASE } }, exit: { opacity: 0 } }}
                className="mt-4 max-w-md text-sm leading-relaxed text-white/75"
              >
                <span className="font-semibold text-white">{slide.car.name}.</span> {slide.blurb}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center gap-6">
            <div className="min-w-0 flex-1">
              <Progress index={index} onSelect={setIndex} />
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 text-xs text-white/70 xl:inline-flex">
              <ShieldCheck className="size-3.5" /> Inspected &amp; certified
            </span>
          </div>
        </div>
      </motion.div>
    </aside>
  )
}

export function AuthShowcaseCompact() {
  const [index, setIndex] = useSlideIndex()
  const slide = slides[index]
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative flex h-48 flex-col justify-end overflow-hidden rounded-[1.75rem] bg-night p-5 text-white shadow-lift sm:h-56 sm:p-6 lg:hidden"
    >
      <Backdrop slide={slide} priority />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
      <div className="relative min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.car.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
          >
            <p className="truncate text-[0.65rem] font-semibold tracking-[0.24em] text-gold-300 uppercase">{slide.kicker}</p>
            <p className="mt-1 truncate font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{slide.title.join(' ')}</p>
            <p className="truncate text-xs text-white/75">{slide.car.name}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-3">
          <Progress index={index} onSelect={setIndex} />
        </div>
      </div>
    </motion.div>
  )
}
