import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Gauge, Timer, Zap } from 'lucide-react'
import { Img } from '../ui/Img'
import { CompareButton, WishlistButton } from './GarageButtons'
import { formatPrice } from '../../lib/format'

const EASE = [0.22, 1, 0.36, 1]

export function CarBadge({ children, tone = 'gold' }) {
  const tones = {
    gold: 'bg-gold-400 text-on-accent',
    dark: 'bg-white/90 text-bone backdrop-blur-md',
    volt: 'bg-volt text-on-accent',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.14em] whitespace-nowrap uppercase shadow-soft ${tones[tone]}`}>
      {children}
    </span>
  )
}

function SpecChip({ icon: Icon, value, unit, label }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 rounded-xl bg-ink-850 px-2.5 py-2 transition-colors duration-300 group-hover:bg-ink-950">
      <span className="truncate text-[0.55rem] font-semibold tracking-[0.14em] text-smoke uppercase">{label}</span>
      <span className="flex min-w-0 items-baseline gap-1 font-display text-sm font-bold text-bone">
        {Icon && <Icon className="size-3 shrink-0 self-center text-gold-400" />}
        <span className="truncate">{value}</span>
        {unit && <span className="shrink-0 text-[0.6rem] font-medium text-mist">{unit}</span>}
      </span>
    </div>
  )
}

function useCardMotion(animated, index) {
  if (animated) {
    return {
      layout: true,
      initial: { opacity: 0, y: 24, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
      transition: { duration: 0.55, ease: EASE, delay: Math.min(index, 8) * 0.04 },
    }
  }
  return {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.75, ease: EASE, delay: (index % 3) * 0.08 },
  }
}

export function CarCard({ car, priority = false, sizes = '(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw', index = 0, animated = false }) {
  const cover = car.images[0]
  const motionProps = useCardMotion(animated, index)

  return (
    <motion.article
      {...motionProps}
      className="spotlight group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-ink-700/60 bg-ink-900 shadow-soft transition-[box-shadow,border-color,translate] duration-500 ease-premium hover:-translate-y-1.5 hover:border-ink-700 hover:shadow-lift"
    >
      <div className="relative m-2 aspect-[16/10] overflow-hidden rounded-[1.35rem] bg-ink-800">
        <Img
          src={cover.src}
          alt={cover.alt}
          sizes={sizes}
          priority={priority}
          className="absolute inset-0"
          imgClassName="transition-transform duration-[1.4s] ease-premium group-hover:scale-[1.07]"
          position={cover.position}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

        <div className="absolute top-3 left-3 flex max-w-[calc(100%-6.5rem)] flex-wrap gap-1.5">
          {car.badge && <CarBadge>{car.badge}</CarBadge>}
          {car.condition !== 'New' && <CarBadge tone="dark">Pre-owned</CarBadge>}
        </div>
        <div className="absolute top-3 right-3 z-10 flex gap-1.5">
          <CompareButton carId={car.id} />
          <WishlistButton carId={car.id} />
        </div>
        <span className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.18em] text-bone uppercase backdrop-blur-md">
          {car.year} · {car.categoryName}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-4 pt-2 pb-4 sm:px-5 sm:pb-5">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold tracking-[0.26em] text-volt uppercase">{car.make}</p>
          <h3 className="mt-1 font-display text-[1.3rem] leading-tight font-extrabold tracking-tight break-words text-bone sm:text-[1.4rem]">
            <Link to={`/cars/${car.slug}`} className="outline-none after:absolute after:inset-0 after:z-[1] after:content-['']">
              {car.model}
            </Link>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-mist">{car.tagline}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <SpecChip icon={Zap} value={car.specs.power} unit="hp" label="Power" />
          <SpecChip icon={Timer} value={car.specs.acceleration} unit="s" label="0–100" />
          <SpecChip icon={Gauge} value={car.specs.topSpeed} unit="km/h" label="Top" />
        </div>

        <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-ink-700/60 pt-4">
          <span aria-hidden="true" className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-gold-400 transition-transform duration-700 ease-premium group-hover:scale-x-100" />
          <div className="min-w-0">
            <p className="text-[0.6rem] tracking-[0.18em] text-smoke uppercase">
              {car.condition === 'New' ? 'From' : `${car.mileage.toLocaleString('en-US')} km`}
            </p>
            <p className="truncate font-display text-lg font-bold text-bone">{formatPrice(car.price)}</p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-ink-700/70 text-bone transition duration-500 ease-premium group-hover:rotate-45 group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-on-accent">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

export function CarListItem({ car, index = 0, animated = false }) {
  const cover = car.images[0]
  const motionProps = useCardMotion(animated, index)

  return (
    <motion.article
      {...motionProps}
      className="spotlight group relative grid min-w-0 overflow-hidden rounded-[1.75rem] border border-ink-700/60 bg-ink-900 shadow-soft transition-[box-shadow,border-color] duration-500 hover:border-ink-700 hover:shadow-lift sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]"
    >
      <div className="relative m-2 aspect-[16/10] overflow-hidden rounded-[1.35rem] bg-ink-800 sm:aspect-auto sm:min-h-[12rem]">
        <Img
          src={cover.src}
          alt={cover.alt}
          sizes="(min-width: 640px) 260px, 92vw"
          className="absolute inset-0"
          imgClassName="transition-transform duration-[1.4s] ease-premium group-hover:scale-[1.06]"
          position={cover.position}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">{car.badge && <CarBadge>{car.badge}</CarBadge>}</div>
      </div>
      <div className="flex min-w-0 flex-col gap-4 p-4 sm:py-5 sm:pr-5 sm:pl-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-bold tracking-[0.24em] text-volt uppercase">
              {car.make} · {car.year}
            </p>
            <h3 className="mt-1 font-display text-xl font-extrabold break-words text-bone">
              <Link to={`/cars/${car.slug}`} className="outline-none after:absolute after:inset-0 after:z-[1] after:content-['']">
                {car.model}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-mist">{car.tagline}</p>
          </div>
          <div className="relative z-10 flex shrink-0 gap-1.5">
            <CompareButton carId={car.id} />
            <WishlistButton carId={car.id} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:max-w-md">
          <SpecChip icon={Zap} value={car.specs.power} unit="hp" label="Power" />
          <SpecChip icon={Timer} value={car.specs.acceleration} unit="s" label="0–100" />
          <SpecChip icon={Gauge} value={car.specs.topSpeed} unit="km/h" label="Top" />
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-ink-700/60 pt-3">
          <p className="font-display text-xl font-bold text-bone">{formatPrice(car.price)}</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-500">
            View details
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </motion.article>
  )
}
