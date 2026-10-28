import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Container } from '../ui/Container'
import { Img } from '../ui/Img'
import { testimonials } from '../../data/site'
import { carsById } from '../../data/cars'

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const item = testimonials[index]
  const car = carsById.get(item.car)
  const go = (step) => setIndex((current) => (current + step + testimonials.length) % testimonials.length)

  useEffect(() => {
    if (paused) return undefined
    const timer = setTimeout(() => go(1), 6500)
    return () => clearTimeout(timer)
  }, [index, paused])

  return (
    <section className="relative py-20 sm:py-28" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Container>
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] border border-white/[0.07] bg-ink-900 lg:grid-cols-2 lg:gap-0">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[34rem]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={car.id}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Img src={car.images[0].src} alt={car.images[0].alt} sizes="(min-width: 1024px) 50vw, 100vw" position={car.images[0].position} className="size-full" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink-900" />
            <Link
              to={`/cars/${car.slug}`}
              className="glass absolute bottom-5 left-5 rounded-full bg-ink-950/50 px-4 py-2 text-xs font-semibold text-bone transition hover:border-gold-400/50"
            >
              Delivered: {car.name}
            </Link>
          </div>

          <div className="relative px-6 pb-8 sm:px-10 sm:pb-12 lg:p-14">
            <Quote className="size-12 text-gold-400/30" strokeWidth={1} />
            <p className="eyebrow mt-4">Client stories</p>
            <div className="relative mt-6 min-h-[16rem] sm:min-h-[13rem]">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={item.name}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex gap-1" aria-label={`${item.rating} out of 5 stars`}>
                    {Array.from({ length: item.rating }, (_, starIndex) => (
                      <Star key={starIndex} className="size-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <blockquote className="mt-5 font-display text-xl leading-snug font-semibold text-pretty text-bone sm:text-2xl">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-full bg-gold-400/15 font-display text-sm font-bold text-gold-300">
                      {item.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-bone">{item.name}</span>
                      <span className="block text-xs text-mist">{item.role}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                {testimonials.map((testimonial, dotIndex) => (
                  <button
                    key={testimonial.name}
                    type="button"
                    onClick={() => setIndex(dotIndex)}
                    aria-label={`Show testimonial from ${testimonial.name}`}
                    className="grid h-8 place-items-center"
                  >
                    <span className={`block h-1 rounded-full transition-all duration-500 ${dotIndex === index ? 'w-10 bg-gold-400' : 'w-4 bg-white/20 hover:bg-white/40'}`} />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="grid size-11 place-items-center rounded-full border border-white/15 text-bone transition hover:border-gold-400 hover:bg-gold-400 hover:text-ink-950">
                  <ChevronLeft className="size-4" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="grid size-11 place-items-center rounded-full border border-white/15 text-bone transition hover:border-gold-400 hover:bg-gold-400 hover:text-ink-950">
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
