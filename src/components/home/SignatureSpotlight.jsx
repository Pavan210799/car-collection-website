import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { Img } from '../ui/Img'
import { CountUp } from '../ui/CountUp'
import { carsById } from '../../data/cars'
import { formatPrice } from '../../lib/format'

const SPOTLIGHT = 'bugatti-chiron'
const EASE = [0.22, 1, 0.36, 1]

export function SignatureSpotlight() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.04, 1.1])
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  const car = carsById.get(SPOTLIGHT)
  if (!car) return null
  const image = car.heroImage ?? car.images[0]

  const stats = [
    { label: 'Power', value: car.specs.power, unit: 'hp', fill: car.specs.power / 1600 },
    { label: 'Top speed', value: car.specs.topSpeed, unit: 'km/h', fill: car.specs.topSpeed / 450 },
    { label: 'Torque', value: car.specs.torque, unit: 'Nm', fill: car.specs.torque / 1800 },
    { label: '0–100 km/h', value: car.specs.acceleration, unit: 's', decimals: 1, fill: 2.2 / car.specs.acceleration },
  ]

  return (
    <section ref={ref} className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="min-w-0 max-w-2xl"
          >
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gold-400" /> Signature of the month
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1] font-extrabold tracking-tight break-words text-bone">
              {car.make} <span className="text-gradient-gold">{car.model}</span>
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-mist sm:text-lg">{car.tagline}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-smoke uppercase">From</p>
              <p className="font-display text-2xl font-bold text-bone sm:text-3xl">{formatPrice(car.price)}</p>
            </div>
            <Button to={`/cars/${car.slug}`} variant="dark" size="lg">
              Discover the {car.model} <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="group relative mt-10 aspect-[4/3] overflow-hidden rounded-[2rem] bg-ink-800 shadow-lift sm:aspect-[16/9] lg:aspect-[21/9] lg:rounded-[2.5rem]"
        >
          <motion.div style={{ scale, y }} className="absolute inset-0">
            <Img src={image.src} alt={image.alt} sizes="100vw" position={image.position} className="absolute inset-0" />
          </motion.div>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2 sm:inset-x-6 sm:bottom-6">
            <span className="glass rounded-full px-3.5 py-1.5 text-xs font-semibold text-bone">{car.year}</span>
            <span className="glass rounded-full px-3.5 py-1.5 text-xs font-semibold text-bone">{car.categoryName}</span>
            <span className="glass rounded-full px-3.5 py-1.5 text-xs font-semibold text-bone">{car.location}</span>
          </div>
        </motion.div>

        <dl className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
              className="spotlight flex min-w-0 flex-col-reverse rounded-[1.5rem] border border-ink-700/60 bg-ink-900 p-4 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift sm:p-5"
            >
              <dt className="mt-3 text-[0.65rem] font-semibold tracking-[0.16em] text-smoke uppercase">{stat.label}</dt>
              <dd className="min-w-0">
                <span className="block truncate font-display text-2xl font-bold text-bone sm:text-3xl">
                  <CountUp value={stat.value} decimals={stat.decimals ?? 0} />
                  <span className="ml-1 text-sm font-semibold text-mist">{stat.unit}</span>
                </span>
                <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-ink-800">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: Math.min(stat.fill, 1) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.3 + index * 0.1, ease: EASE }}
                    className="block h-full origin-left rounded-full bg-gradient-to-r from-gold-400 to-volt"
                  />
                </span>
              </dd>
            </motion.div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
