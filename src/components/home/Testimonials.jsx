import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Container } from '../ui/Container'
import { Img, srcFor, srcSetFor } from '../ui/Img'
import { testimonials } from '../../data/site'
import { carsById, siteImage } from '../../data/cars'

const EASE = [0.22, 1, 0.36, 1]
const PHOTO_SIZES = '(min-width: 1024px) 45vw, 100vw'

const items = testimonials
  .map((item) => {
    const car = carsById.get(item.carSlug)
    const photo = car?.images?.[0] ?? siteImage(item.image)
    return photo ? { ...item, car, photo } : null
  })
  .filter(Boolean)

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const item = items[index]
  const go = useCallback((step) => setIndex((current) => (current + step + items.length) % items.length), [])

  useEffect(() => {
    if (paused || items.length < 2) return undefined
    const timer = setTimeout(() => go(1), 6500)
    return () => clearTimeout(timer)
  }, [index, paused, go])

  useEffect(() => {
    items.forEach(({ photo }) => {
      const preload = new Image()
      preload.sizes = PHOTO_SIZES
      preload.srcset = srcSetFor(photo.src)
      preload.src = srcFor(photo.src)
    })
  }, [])

  if (!item) return null

  return (
    <section className="py-20 sm:py-28" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="hover-zoom relative aspect-[4/3] min-w-0 overflow-hidden rounded-[2rem] bg-ink-800 shadow-lift lg:aspect-[4/5]">
            <AnimatePresence initial={false}>
              <motion.div
                key={item.id}
                initial={{ clipPath: 'inset(0% 0% 0% 100%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                exit={{ opacity: 0, transition: { delay: 0.9, duration: 0.2 } }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0"
              >
                <motion.div initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: EASE }} className="absolute inset-0">
                  <Img src={item.photo.src} alt={item.photo.alt} sizes={PHOTO_SIZES} priority position={item.photo.position} className="absolute inset-0" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {item.car && (
              <Link
                to={`/cars/${item.car.slug}`}
                className="glass absolute bottom-4 left-4 max-w-[calc(100%-2rem)] truncate rounded-full px-4 py-2 text-xs font-semibold text-bone transition hover:bg-white sm:bottom-5 sm:left-5"
              >
                Delivered · {item.car.name}
              </Link>
            )}
          </div>

          <div className="min-w-0">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gold-400" /> Client stories
            </p>
            <Quote className="mt-6 size-12 text-gold-400/30" strokeWidth={1} />
            <div className="relative mt-4 grid">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="[grid-area:1/1]"
                >
                  <div className="flex gap-1" role="img" aria-label={`${item.rating} out of 5 stars`}>
                    {Array.from({ length: item.rating ?? 5 }, (_, starIndex) => (
                      <motion.span key={starIndex} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + starIndex * 0.06 }}>
                        <Star className="size-4 fill-gold-400 text-gold-400" />
                      </motion.span>
                    ))}
                  </div>
                  <blockquote className="mt-5 font-display text-[clamp(1.35rem,2.6vw,2.1rem)] leading-snug font-semibold text-pretty text-bone">“{item.quote}”</blockquote>
                  <figcaption className="mt-7 flex items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-bone font-display text-sm font-bold text-on-accent">
                      {item.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-bone">{item.name}</span>
                      <span className="block truncate text-xs text-mist">{item.role}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-ink-700/60 pt-6">
              <div className="flex gap-1.5">
                {items.map((testimonial, dotIndex) => (
                  <button
                    key={testimonial.id}
                    type="button"
                    onClick={() => setIndex(dotIndex)}
                    aria-label={`Show testimonial from ${testimonial.name}`}
                    aria-current={dotIndex === index}
                    className="group grid h-8 place-items-center"
                  >
                    <span className={`block h-1 rounded-full transition-all duration-500 ${dotIndex === index ? 'w-10 bg-gold-400 group-hover:bg-gold-500' : 'w-4 bg-ink-700 group-hover:w-6 group-hover:bg-ink-600'}`} />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className="grid size-11 place-items-center rounded-full border border-ink-700/70 bg-ink-900 text-bone transition hover:-translate-x-0.5 hover:border-bone"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className="grid size-11 place-items-center rounded-full bg-bone text-on-accent transition hover:translate-x-0.5 hover:bg-night"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
