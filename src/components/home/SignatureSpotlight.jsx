import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { Img } from '../ui/Img'
import { carsById } from '../../data/cars'
import { formatNumber } from '../../lib/format'

const SPOTLIGHT = 'bugatti-chiron'

function Spec({ progress, range, value, unit, label }) {
  const opacity = useTransform(progress, range, [0, 1])
  const y = useTransform(progress, range, [30, 0])
  return (
    <motion.div style={{ opacity, y }} className="min-w-0 border-t border-white/20 pt-4">
      <p className="font-display text-[clamp(1.5rem,3.4vw,3rem)] leading-none font-bold text-bone">
        {value}
        <span className="ml-1 text-sm font-semibold text-gold-400 sm:text-base">{unit}</span>
      </p>
      <p className="mt-2 text-[0.65rem] tracking-[0.2em] text-mist uppercase sm:text-xs">{label}</p>
    </motion.div>
  )
}

export function SignatureSpotlight() {
  const ref = useRef(null)
  const car = carsById.get(SPOTLIGHT)
  const image = car.heroImage ?? car.images[0]
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const clip = useTransform(scrollYProgress, [0, 0.35], ['inset(12% 8% 12% 8% round 2rem)', 'inset(0% 0% 0% 0% round 0rem)'])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.25, 1.05, 1])
  const headingOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1])
  const headingY = useTransform(scrollYProgress, [0.2, 0.4], [60, 0])
  const introOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0])
  const introScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.85])

  return (
    <section ref={ref} aria-label={`${car.name} spotlight`} className="relative h-[260vh] bg-ink-950">
      <div className="sticky top-0 h-[100svh] min-h-[36rem] overflow-hidden">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <motion.div style={{ scale: imageScale }} className="absolute inset-0">
            <Img src={image.src} alt={image.alt} sizes="100vw" position={image.position} className="size-full" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-transparent" />
        </motion.div>

        <motion.div
          style={{ opacity: introOpacity, scale: introScale }}
          className="pointer-events-none absolute inset-0 grid place-items-center px-5 text-center"
        >
          <div>
            <p className="eyebrow">Signature of the month</p>
            <p className="mt-4 font-display text-[clamp(2.5rem,10vw,9rem)] leading-[0.9] font-extrabold tracking-tighter text-bone uppercase drop-shadow-2xl">
              {car.make}
            </p>
          </div>
        </motion.div>

        <Container className="relative flex h-full flex-col justify-end pb-12 sm:pb-16">
          <motion.div style={{ opacity: headingOpacity, y: headingY }} className="max-w-3xl">
            <p className="eyebrow">Signature of the month</p>
            <h2 className="mt-4 font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] font-extrabold tracking-tight text-bone uppercase">
              {car.model}
            </h2>
            <p className="mt-5 line-clamp-3 max-w-xl text-base leading-relaxed text-mist sm:line-clamp-none sm:text-lg">{car.description}</p>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:mt-10 sm:grid-cols-4 sm:gap-8">
            <Spec progress={scrollYProgress} range={[0.4, 0.52]} value={formatNumber(car.specs.power)} unit="hp" label="Peak output" />
            <Spec progress={scrollYProgress} range={[0.46, 0.58]} value={formatNumber(car.specs.torque)} unit="Nm" label="Torque" />
            <Spec progress={scrollYProgress} range={[0.52, 0.64]} value={car.specs.acceleration} unit="s" label="0–100 km/h" />
            <Spec progress={scrollYProgress} range={[0.58, 0.7]} value={car.specs.topSpeed} unit="km/h" label="Top speed" />
          </div>

          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.68, 0.8], [0, 1]) }}
            className="mt-8 flex gap-3 sm:mt-10"
          >
            <Button to={`/cars/${car.slug}`} size="lg">
              Explore the {car.model.split(' ')[0]} <ArrowRight className="size-4" />
            </Button>
            <Button to={`/test-drive?car=${car.slug}`} variant="outline" size="lg" className="max-sm:hidden">
              Request a private viewing
            </Button>
          </motion.div>
        </Container>
      </div>
    </section>
  )
}
