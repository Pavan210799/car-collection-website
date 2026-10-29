import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, animate, motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Gauge, Play, Timer, Zap } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { Img } from '../ui/Img'
import { CountUp } from '../ui/CountUp'
import { heroSlides, stats } from '../../data/site'
import { carsById } from '../../data/cars'
import { formatNumber } from '../../lib/format'

const SLIDE_MS = 8000
const EASE = [0.22, 1, 0.36, 1]

const slides = heroSlides
  .map((slide) => {
    const car = carsById.get(slide.car)
    if (!car?.images?.length) return null
    return { ...slide, car, image: car.heroImage ?? car.images[0] }
  })
  .filter(Boolean)

const FADE_S = 0.9
const ZOOM_FROM = 1.12
const FADE_EASE = [0.45, 0, 0.55, 1]

const ZOOM_DRIFT = ((ZOOM_FROM - 1) * FADE_S * 1000) / SLIDE_MS

const layerVariants = {
  active: { opacity: 1, zIndex: 2, transition: { opacity: { duration: FADE_S, ease: FADE_EASE } } },
  previous: { opacity: 0, zIndex: 1, transition: { opacity: { duration: FADE_S, ease: FADE_EASE } } },
  idle: { opacity: 0, zIndex: 0, transition: { opacity: { duration: 0.3 } } },
}

function MaskedLine({ children, delay = 0 }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.9, delay: delay + 0.25, ease: EASE } }}
        exit={{ y: '-60%', opacity: 0, filter: 'blur(6px)', transition: { duration: 0.45, ease: [0.55, 0, 0.75, 0.2] } }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [previous, setPrevious] = useState(null)
  const [paused, setPaused] = useState(false)
  const slide = slides[index]

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 70, damping: 18 })
  const springY = useSpring(pointerY, { stiffness: 70, damping: 18 })
  const imageX = useTransform(springX, [-0.5, 0.5], [-14, 14])
  const imageY = useTransform(springY, [-0.5, 0.5], [-10, 10])
  const cardX = useTransform(springX, [-0.5, 0.5], [10, -10])
  const cardY = useTransform(springY, [-0.5, 0.5], [8, -8])

  const progress = useMotionValue(0)
  const elapsed = useRef(0)
  const activeScale = useTransform(progress, [0, 1], [ZOOM_FROM, 1])
  const previousScale = useMotionValue(1)

  const goTo = useCallback(
    (next) => {
      const target = (next + slides.length) % slides.length
      if (target === index) return
      const from = activeScale.get()
      previousScale.set(from)
      animate(previousScale, from - ZOOM_DRIFT, { duration: FADE_S, ease: 'linear' })
      elapsed.current = SLIDE_MS
      setPrevious(index)
      setIndex(target)
    },
    [index, activeScale, previousScale],
  )

  useLayoutEffect(() => {
    elapsed.current = 0
    progress.set(0)
  }, [index, progress])

  useAnimationFrame((_, delta) => {
    if (paused || slides.length < 2 || elapsed.current >= SLIDE_MS) return
    elapsed.current = Math.min(SLIDE_MS, elapsed.current + delta)
    progress.set(elapsed.current / SLIDE_MS)
    if (elapsed.current >= SLIDE_MS) goTo(index + 1)
  })

  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const onPointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
    setPaused(false)
  }

  if (!slide) return null

  const specs = [
    { icon: Zap, label: 'Power', value: `${formatNumber(slide.car.specs.power)} hp` },
    { icon: Timer, label: '0–100', value: `${slide.car.specs.acceleration} s` },
    { icon: Gauge, label: 'Top speed', value: `${slide.car.specs.topSpeed} km/h` },
  ]

  return (
    <section aria-label="Featured cars" className="relative isolate overflow-hidden pt-24 pb-14 sm:pt-28 lg:pt-32 lg:pb-20">
      <div aria-hidden="true" className="mesh-glow absolute inset-0 -z-10" />
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <motion.div
        aria-hidden="true"
        className="absolute -top-32 -right-32 -z-10 size-[28rem] rounded-full bg-gold-400/15 blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14 xl:gap-20">
          <div className="min-w-0 lg:py-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-ink-700/70 bg-ink-900/80 py-1.5 pr-4 pl-1.5 shadow-soft backdrop-blur"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-volt text-on-accent">
                <span className="size-1.5 animate-pulse-dot rounded-full bg-white" />
              </span>
              <span className="truncate text-xs font-semibold text-bone">{stats[0].value} hand-picked cars · available now</span>
            </motion.div>

            <div className="mt-6 grid min-h-[2.9em] text-[clamp(2.6rem,6.4vw,5.6rem)]" aria-live="polite">
              {slides.map((item) => (
                <div key={item.car.id} aria-hidden="true" className="invisible [grid-area:1/1]">
                  <p className="eyebrow">{item.kicker}</p>
                  <p className="mt-4 font-display text-[1em] leading-[0.95] font-extrabold tracking-tight break-words">
                    <span className="block pb-[0.08em]">{item.title[0]}</span>
                    <span className="block pb-[0.08em]">{item.title[1]}</span>
                  </p>
                </div>
              ))}
              <AnimatePresence initial={false}>
                <motion.div key={slide.car.id} exit={{ opacity: 1 }} transition={{ duration: 0.45 }} className="[grid-area:1/1]">
                  <motion.p
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="eyebrow flex items-center gap-3"
                  >
                    <span className="h-px w-8 bg-gold-400" />
                    {slide.kicker}
                  </motion.p>
                  <h1 className="mt-4 font-display text-[1em] leading-[0.95] font-extrabold tracking-tight break-words text-bone">
                    <MaskedLine delay={0.05}>{slide.title[0]}</MaskedLine>
                    <MaskedLine delay={0.14}>
                      <span className="text-gradient-gold">{slide.title[1]}</span>
                    </MaskedLine>
                  </h1>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 grid max-w-lg">
              {slides.map((item) => (
                <p key={item.car.id} aria-hidden="true" className="invisible text-base leading-relaxed [grid-area:1/1] sm:text-lg">
                  <span className="font-semibold">
                    {item.car.year} {item.car.name}.
                  </span>{' '}
                  {item.blurb}
                </p>
              ))}
              <AnimatePresence initial={false}>
                <motion.p
                  key={slide.car.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3, ease: EASE } }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.3 } }}
                  className="text-base leading-relaxed text-mist [grid-area:1/1] sm:text-lg"
                >
                  <span className="font-semibold text-bone">
                    {slide.car.year} {slide.car.name}.
                  </span>{' '}
                  {slide.blurb}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
              className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap"
            >
              <Button to="/collection" size="lg">
                Explore collection <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
              <Button to={`/cars/${slide.car.slug}`} variant="light" size="lg">
                <Play className="size-3.5 fill-current" /> View {slide.car.model.split(' ')[0]}
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(10% 6% 10% 6% round 2.25rem)' }}
            animate={{ opacity: 1, clipPath: 'inset(-12% -8% -20% -8% round 2.25rem)' }}
            transition={{ duration: 1.3, delay: 0.1, ease: EASE }}
            className="relative min-w-0"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.25rem] bg-ink-800 shadow-lift sm:aspect-[16/11] lg:aspect-[5/4] xl:aspect-[16/12]">
              <motion.div style={{ x: imageX, y: imageY }} className="absolute -inset-4">
                {slides.map((item, itemIndex) => {
                  const state = itemIndex === index ? 'active' : itemIndex === previous ? 'previous' : 'idle'
                  return (
                    <motion.div
                      key={item.car.id}
                      initial={{ opacity: itemIndex === index ? 1 : 0, zIndex: itemIndex === index ? 2 : 0 }}
                      animate={state}
                      variants={layerVariants}
                      style={{ scale: state === 'active' ? activeScale : state === 'previous' ? previousScale : ZOOM_FROM }}
                      className="absolute inset-0 will-change-[opacity,transform]"
                      aria-hidden={itemIndex !== index}
                    >
                      <Img
                        src={item.image.src}
                        alt={itemIndex === index ? item.image.alt : ''}
                        priority={itemIndex === 0}
                        loading="eager"
                        sizes="(min-width: 1024px) 55vw, 100vw"
                        position={item.image.position}
                        className="absolute inset-0"
                      />
                    </motion.div>
                  )
                })}
              </motion.div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              <div className="absolute top-4 right-4 z-[4] rounded-full bg-white/85 px-3 py-1.5 font-display text-xs font-bold text-bone tabular-nums shadow-soft backdrop-blur-md">
                {String(index + 1).padStart(2, '0')} <span className="text-smoke">/ {String(slides.length).padStart(2, '0')}</span>
              </div>

              <motion.div style={{ x: cardX, y: cardY }} className="absolute inset-x-3 bottom-3 z-[4] sm:inset-x-auto sm:bottom-5 sm:left-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.car.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
                    className="glass rounded-2xl p-3 sm:p-4"
                  >
                    <Link to={`/cars/${slide.car.slug}`} className="block min-w-0 truncate text-[0.65rem] font-semibold tracking-[0.2em] text-volt uppercase hover:text-gold-500">
                      {slide.car.make} · {slide.car.categoryName}
                    </Link>
                    <dl className="mt-2 grid grid-cols-3 gap-3 sm:gap-5">
                      {specs.map((spec) => (
                        <div key={spec.label} className="min-w-0">
                          <dt className="flex items-center gap-1 text-[0.6rem] tracking-wide text-smoke uppercase">
                            <spec.icon className="size-3 shrink-0 text-gold-400" />
                            <span className="truncate">{spec.label}</span>
                          </dt>
                          <dd className="mt-0.5 truncate font-display text-sm font-bold text-bone sm:text-base">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            <div
              className="mt-4 grid grid-cols-4 gap-2 sm:gap-3"
              role="tablist"
              aria-label="Featured cars"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {slides.map((item, itemIndex) => {
                const active = itemIndex === index
                return (
                  <button
                    key={item.car.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Show ${item.car.name}`}
                    onClick={() => goTo(itemIndex)}
                    className="group min-w-0 text-left"
                  >
                    <span className="relative block h-1 overflow-hidden rounded-full bg-ink-800">
                      {active && (
                        <motion.span
                          className="absolute inset-0 rounded-full bg-gold-400"
                          style={{ scaleX: progress, originX: 0 }}
                        />
                      )}
                      {!active && <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-bone/40 transition-transform duration-500 group-hover:scale-x-100" />}
                    </span>
                    <span className={`mt-2 hidden truncate text-xs font-semibold transition-colors sm:block ${active ? 'text-bone' : 'text-smoke group-hover:text-mist'}`}>
                      {item.car.model}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>

        <motion.dl
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.6 } } }}
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink-700/60 pt-8 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
              className="min-w-0"
            >
              <dd className="font-display text-3xl font-bold text-bone sm:text-4xl">
                <CountUp value={stat.value} decimals={stat.decimals ?? 0} startOnView={false} delay={0.6} />
                <span className="text-gold-400">{stat.suffix}</span>
              </dd>
              <dt className="mt-1 text-sm text-mist">{stat.label}</dt>
            </motion.div>
          ))}
        </motion.dl>
      </Container>
    </section>
  )
}
