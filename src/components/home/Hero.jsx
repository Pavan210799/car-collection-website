import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Gauge, Timer, Zap } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { CountUp } from '../ui/CountUp'
import { srcFor, srcSetFor } from '../ui/Img'
import { HeroIntro, shouldPlayIntro } from './HeroIntro'
import { heroSlides } from '../../data/site'
import { carsById } from '../../data/cars'

const SLIDE_DURATION = 7000
const EASE = [0.22, 1, 0.36, 1]
const CINEMATIC = [0.76, 0, 0.24, 1]

const slides = heroSlides.map((slide) => {
  const car = carsById.get(slide.car)
  return { ...slide, car, image: car.heroImage ?? car.images[0] }
})

function LightTrails() {
  const trails = [
    { top: '22%', duration: 6.5, delay: 0.4, width: '38%' },
    { top: '58%', duration: 8, delay: 2.2, width: '28%' },
    { top: '74%', duration: 5.5, delay: 3.6, width: '46%' },
  ]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {trails.map((trail) => (
        <motion.span
          key={trail.top}
          className="absolute left-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent"
          style={{ top: trail.top, width: trail.width }}
          initial={{ x: '-120%', opacity: 0 }}
          animate={{ x: ['-120%', '320%'], opacity: [0, 1, 0] }}
          transition={{ duration: trail.duration, delay: trail.delay, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function MaskedLine({ children, delay }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: '110%', rotate: 3 }}
        animate={{ y: '0%', rotate: 0 }}
        exit={{ y: '-110%', transition: { duration: 0.5, ease: CINEMATIC } }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function Hero() {
  const sectionRef = useRef(null)
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const [introPlays] = useState(shouldPlayIntro)
  const [introDone, setIntroDone] = useState(!introPlays)
  const base = introPlays ? 1.7 : 0.15
  const enter = (offset) => (introDone ? 0.2 + offset : base + offset)
  const slide = slides[index]

  const goTo = useCallback((next, dir) => {
    setDirection(dir ?? 1)
    setIndex((next + slides.length) % slides.length)
  }, [])
  const next = useCallback(() => goTo(index + 1, 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index])

  useEffect(() => {
    if (paused || !introDone) return undefined
    const timer = setTimeout(next, SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [index, paused, introDone, next])

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const upcoming = slides[(index + 1) % slides.length].image
    const img = new Image()
    img.sizes = '100vw'
    img.srcset = srcSetFor(upcoming.src)
  }, [index])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  const wordX = useTransform(springX, (value) => value * -2.2)

  const onPointerMove = (event) => {
    if (reduce || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set(((event.clientX - rect.left) / rect.width - 0.5) * 24)
    mouseY.set(((event.clientY - rect.top) / rect.height - 0.5) * 16)
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') next()
    if (event.key === 'ArrowLeft') prev()
  }

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured cars"
      onPointerMove={onPointerMove}
      onKeyDown={onKeyDown}
      className="grain relative isolate h-[100svh] min-h-[44rem] overflow-hidden bg-ink-950"
    >
      <HeroIntro play={introPlays} onComplete={() => setIntroDone(true)} />

      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 -z-10">
        <motion.div style={{ x: springX, y: springY }} className="absolute -inset-8">
          <AnimatePresence custom={direction}>
            <motion.div
              key={slide.car.id}
              custom={direction}
              className="absolute inset-0"
              initial={{ clipPath: direction > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0%)' }}
              exit={{ opacity: 0.4, transition: { duration: 1.2, ease: CINEMATIC } }}
              transition={{ duration: 1.3, ease: CINEMATIC }}
            >
              <motion.img
                src={srcFor(slide.image.src, 'lg')}
                srcSet={srcSetFor(slide.image.src)}
                sizes="100vw"
                alt={slide.image.alt}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
                draggable="false"
                style={{ objectPosition: slide.image.position ?? 'center' }}
                className="size-full object-cover"
                initial={{ scale: 1.22 }}
                animate={{ scale: 1.04 }}
                transition={{ duration: SLIDE_DURATION / 1000 + 1.5, ease: 'linear' }}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/55 to-ink-950/5" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950/80 to-transparent" />
        <div className="absolute inset-0 shadow-[inset_0_0_200px_60px_rgba(0,0,0,0.65)]" />
      </div>

      <motion.div
        aria-hidden="true"
        style={{ x: wordX }}
        className="pointer-events-none absolute inset-x-0 top-[9%] -z-10 hidden overflow-hidden md:block [@media(max-height:46rem)]:hidden"
      >
        <AnimatePresence mode="popLayout">
          <motion.p
            key={slide.car.make}
            initial={{ opacity: 0, x: direction > 0 ? 160 : -160 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -160 : 160 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="text-outline pr-[3vw] text-right font-display text-[11vw] leading-none font-extrabold tracking-tighter whitespace-nowrap uppercase opacity-45"
          >
            {slide.car.make}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      <LightTrails />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative h-full">
        <Container className="flex h-full flex-col justify-end pt-28 pb-6 sm:pb-8">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
            <div className="@container min-w-0 max-w-4xl">
              <AnimatePresence mode="wait">
                <motion.div key={slide.car.id} exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.1 } }}>
                  <motion.p
                    className="eyebrow flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: enter(0), ease: EASE }}
                  >
                    <motion.span
                      className="h-px bg-gold-400"
                      initial={{ width: 0 }}
                      animate={{ width: 40 }}
                      transition={{ duration: 0.9, delay: enter(0), ease: EASE }}
                    />
                    {slide.kicker}
                  </motion.p>

                  <h1 className="mt-5 font-display text-[clamp(1.5rem,8.4cqw,6rem)] leading-[0.95] font-extrabold tracking-[-0.025em] text-bone uppercase">
                    <MaskedLine delay={enter(0.1)}>{slide.title[0]}</MaskedLine>
                    <MaskedLine delay={enter(0.22)}>
                      <span className="text-gradient-gold">{slide.title[1]}</span>
                    </MaskedLine>
                  </h1>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: enter(0.35), ease: EASE }}
                    className="mt-6 max-w-xl"
                  >
                    <p className="text-sm font-semibold tracking-[0.18em] text-bone/90 uppercase">
                      {slide.car.year} {slide.car.name}
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-mist sm:text-lg">{slide.blurb}</p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: base + 0.5, ease: EASE }}
                className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap"
              >
                <Button to="/collection" size="lg">
                  Explore the collection
                  <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
                <Button to={`/cars/${slide.car.slug}`} variant="outline" size="lg" className="backdrop-blur-md">
                  Discover the {slide.car.model.split(' ')[0]}
                </Button>
              </motion.div>
            </div>

            <motion.dl
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: base + 0.6, ease: EASE }}
              className="glass grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-ink-950/40 p-4 sm:p-5 lg:w-72 lg:grid-cols-1 lg:divide-x-0 lg:divide-y lg:p-6"
            >
              {[
                { icon: Zap, label: 'Power', value: slide.car.specs.power, unit: 'hp' },
                { icon: Timer, label: '0–100 km/h', value: slide.car.specs.acceleration, unit: 's', decimals: 1 },
                { icon: Gauge, label: 'Top speed', value: slide.car.specs.topSpeed, unit: 'km/h' },
              ].map((stat) => (
                <div key={stat.label} className="min-w-0 px-2 first:pl-0 last:pr-0 lg:px-0 lg:py-4 lg:first:pt-0 lg:last:pb-0">
                  <dt className="flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.18em] text-mist uppercase sm:text-[0.65rem]">
                    <stat.icon className="hidden size-3.5 text-gold-400 xs:block" />
                    <span className="truncate">{stat.label}</span>
                  </dt>
                  <dd className="mt-1.5 flex items-baseline gap-1 font-display text-xl font-bold text-bone sm:text-3xl">
                    <CountUp key={`${slide.car.id}-${stat.label}`} value={stat.value} decimals={stat.decimals ?? 0} startOnView={false} delay={enter(0.6)} />
                    <span className="text-[0.65rem] font-semibold text-gold-400 sm:text-xs">{stat.unit}</span>
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: base + 0.8 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="mt-8 flex items-center gap-4 border-t border-white/10 pt-5 sm:gap-6"
          >
            <p className="shrink-0 font-display text-sm font-bold text-bone tabular-nums">
              {String(index + 1).padStart(2, '0')}
              <span className="text-smoke"> / {String(slides.length).padStart(2, '0')}</span>
            </p>

            <div className="flex min-w-0 flex-1 gap-2 sm:gap-3" role="tablist" aria-label="Choose featured car">
              {slides.map((item, itemIndex) => (
                <button
                  key={item.car.id}
                  type="button"
                  role="tab"
                  aria-selected={itemIndex === index}
                  aria-label={`Show ${item.car.name}`}
                  onClick={() => goTo(itemIndex, itemIndex > index ? 1 : -1)}
                  className="group min-w-0 flex-1 py-2 text-left"
                >
                  <span className="relative block h-[2px] overflow-hidden rounded-full bg-white/15">
                    {itemIndex < index && <span className="absolute inset-0 bg-bone/60" />}
                    {itemIndex === index && (
                      <motion.span
                        key={`${index}-${paused}`}
                        className="absolute inset-0 origin-left bg-gold-400"
                        initial={{ scaleX: paused ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: paused || !introDone ? 0 : SLIDE_DURATION / 1000, ease: 'linear' }}
                      />
                    )}
                  </span>
                  <span
                    className={`mt-3 hidden truncate text-xs font-semibold tracking-wide transition-colors md:block ${
                      itemIndex === index ? 'text-bone' : 'text-smoke group-hover:text-mist'
                    }`}
                  >
                    {item.car.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous car"
                className="grid size-10 place-items-center rounded-full border border-white/15 text-bone transition hover:border-gold-400 hover:bg-gold-400 hover:text-ink-950 sm:size-11"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next car"
                className="grid size-10 place-items-center rounded-full border border-white/15 text-bone transition hover:border-gold-400 hover:bg-gold-400 hover:text-ink-950 sm:size-11"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </motion.div>
        </Container>
      </motion.div>

      <Link
        to="/collection"
        className="absolute top-1/2 right-5 hidden -translate-y-1/2 rotate-90 items-center gap-3 text-[0.6rem] font-semibold tracking-[0.4em] text-mist uppercase transition-colors hover:text-gold-300 2xl:flex"
      >
        Scroll to explore
        <span className="relative h-px w-12 overflow-hidden bg-white/20">
          <motion.span
            className="absolute inset-y-0 left-0 w-1/2 bg-gold-400"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </Link>
    </section>
  )
}
