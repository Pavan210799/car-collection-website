import { Link } from 'react-router-dom'
import { ArrowUpRight, Gauge, Timer, Zap } from 'lucide-react'
import { Img } from '../ui/Img'
import { CompareButton, WishlistButton } from './GarageButtons'
import { formatPrice } from '../../lib/format'

export function CarBadge({ children, tone = 'gold' }) {
  const tones = {
    gold: 'bg-gold-400 text-ink-950',
    dark: 'bg-black/55 text-bone border border-white/15 backdrop-blur-md',
    volt: 'bg-volt text-ink-950',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-[0.14em] uppercase ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function SpecStat({ icon: Icon, value, unit, label, compact = false }) {
  return (
    <div className="min-w-0">
      <div className={`flex items-baseline gap-1 font-display font-bold text-bone ${compact ? 'text-base' : 'text-lg'}`}>
        {Icon && <Icon className="size-3.5 shrink-0 self-center text-gold-400" />}
        <span className="truncate">{value}</span>
        {unit && <span className="text-[0.65rem] font-semibold text-mist">{unit}</span>}
      </div>
      <p className="mt-0.5 truncate text-[0.65rem] tracking-[0.14em] text-smoke uppercase">{label}</p>
    </div>
  )
}

export function CarCard({ car, priority = false, sizes = '(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw' }) {
  const cover = car.images[0]
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-ink-900 transition duration-500 ease-premium hover:-translate-y-1.5 hover:border-gold-400/30 hover:shadow-[0_30px_80px_-30px_rgba(217,183,126,0.35)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Img
          src={cover.src}
          alt={cover.alt}
          sizes={sizes}
          priority={priority}
          className="size-full"
          imgClassName="transition-transform duration-[1.4s] ease-premium group-hover:scale-[1.07]"
          position={cover.position}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/10 to-black/30" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 pr-28">
          {car.badge && <CarBadge>{car.badge}</CarBadge>}
          {car.condition !== 'New' && <CarBadge tone="dark">Pre-owned</CarBadge>}
        </div>
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <CompareButton carId={car.id} />
          <WishlistButton carId={car.id} />
        </div>
        <span className="absolute bottom-4 left-5 text-[0.65rem] font-semibold tracking-[0.3em] text-bone/70 uppercase">
          {car.year} · {car.categoryName}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.24em] text-gold-400 uppercase">{car.make}</p>
          <h3 className="mt-1.5 font-display text-xl leading-tight font-bold text-bone sm:text-[1.4rem]">
            <Link to={`/cars/${car.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
              {car.model}
            </Link>
          </h3>
          <p className="mt-1.5 line-clamp-1 text-sm text-mist">{car.tagline}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 border-y border-white/[0.07] py-4">
          <SpecStat icon={Zap} value={car.specs.power} unit="hp" label="Power" compact />
          <SpecStat icon={Timer} value={car.specs.acceleration} unit="s" label="0–100" compact />
          <SpecStat icon={Gauge} value={car.specs.topSpeed} unit="km/h" label="Top speed" compact />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.65rem] tracking-[0.2em] text-smoke uppercase">
              {car.condition === 'New' ? 'From' : `${car.mileage.toLocaleString('en-US')} km`}
            </p>
            <p className="truncate font-display text-lg font-bold text-bone sm:text-xl">{formatPrice(car.price)}</p>
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 text-bone transition duration-500 ease-premium group-hover:rotate-45 group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-ink-950">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  )
}

export function CarListItem({ car }) {
  const cover = car.images[0]
  return (
    <article className="group relative grid overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-ink-900 transition duration-500 ease-premium hover:border-gold-400/30 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-64">
        <Img
          src={cover.src}
          alt={cover.alt}
          sizes="(min-width: 640px) 40vw, 92vw"
          className="size-full sm:absolute sm:inset-0"
          imgClassName="transition-transform duration-[1.4s] ease-premium group-hover:scale-[1.06]"
          position={cover.position}
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {car.badge && <CarBadge>{car.badge}</CarBadge>}
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-5 p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.24em] text-gold-400 uppercase">
              {car.make} · {car.year}
            </p>
            <h3 className="mt-1.5 font-display text-xl leading-tight font-bold text-bone sm:text-2xl">
              <Link to={`/cars/${car.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
                {car.model}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist">{car.description}</p>
          </div>
          <div className="relative z-10 flex shrink-0 gap-2">
            <CompareButton carId={car.id} />
            <WishlistButton carId={car.id} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-y border-white/[0.07] py-4 xs:grid-cols-4">
          <SpecStat value={car.specs.power} unit="hp" label="Power" compact />
          <SpecStat value={car.specs.acceleration} unit="s" label="0–100" compact />
          <SpecStat value={car.specs.topSpeed} unit="km/h" label="Top speed" compact />
          <SpecStat value={car.powertrain} label={car.drivetrain} compact />
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-xl font-bold text-bone">{formatPrice(car.price)}</p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold-400">
            View details
            <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </div>
      </div>
    </article>
  )
}
