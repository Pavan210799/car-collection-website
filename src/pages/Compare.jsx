import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Crown, Plus, Scale, Trash2, X } from 'lucide-react'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Img } from '../components/ui/Img'
import { CarPicker } from '../components/cars/CarPicker'
import { useGarage } from '../context/contexts'
import { MAX_COMPARE } from '../context/GarageProvider'
import { carsById } from '../data/cars'
import { formatNumber, formatPrice } from '../lib/format'

const SPEC_GROUPS = [
  {
    title: 'Performance',
    rows: [
      { label: 'Power', get: (car) => car.specs.power, format: (value) => `${formatNumber(value)} hp`, best: 'max' },
      { label: 'Torque', get: (car) => car.specs.torque, format: (value) => `${formatNumber(value)} Nm`, best: 'max' },
      { label: '0–100 km/h', get: (car) => car.specs.acceleration, format: (value) => `${value} s`, best: 'min' },
      { label: 'Top speed', get: (car) => car.specs.topSpeed, format: (value) => `${value} km/h`, best: 'max' },
      {
        label: 'Power-to-weight',
        get: (car) => Math.round((car.specs.power / car.specs.weight) * 1000),
        format: (value) => `${value} hp/t`,
        best: 'max',
      },
    ],
  },
  {
    title: 'Price & ownership',
    rows: [
      { label: 'Price', get: (car) => car.price, format: formatPrice, best: 'min' },
      { label: 'Condition', get: (car) => car.condition },
      { label: 'Availability', get: (car) => car.status },
      { label: 'Efficiency', get: (car) => car.specs.efficiency },
    ],
  },
  {
    title: 'Engine & drivetrain',
    rows: [
      { label: 'Engine', get: (car) => car.engine },
      { label: 'Powertrain', get: (car) => car.powertrain },
      { label: 'Transmission', get: (car) => car.transmission },
      { label: 'Drivetrain', get: (car) => car.drivetrain },
    ],
  },
  {
    title: 'Dimensions & practicality',
    rows: [
      { label: 'Kerb weight', get: (car) => car.specs.weight, format: (value) => `${formatNumber(value)} kg`, best: 'min' },
      { label: 'Length', get: (car) => car.specs.length, format: (value) => `${formatNumber(value)} mm` },
      { label: 'Width', get: (car) => car.specs.width, format: (value) => `${formatNumber(value)} mm` },
      { label: 'Height', get: (car) => car.specs.height, format: (value) => `${formatNumber(value)} mm` },
      { label: 'Seats', get: (car) => car.specs.seats, best: 'max' },
      { label: 'Luggage', get: (car) => car.specs.luggage, format: (value) => `${value} L`, best: 'max' },
    ],
  },
]

const bestIndex = (values, best) => {
  if (!best || values.length < 2) return -1
  const target = best === 'max' ? Math.max(...values) : Math.min(...values)
  const winners = values.filter((value) => value === target)
  return winners.length === values.length ? -1 : values.indexOf(target)
}

export default function Compare() {
  const { compare, removeFromCompare, addToCompare, clearCompare } = useGarage()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [diffOnly, setDiffOnly] = useState(false)
  const selected = compare.map((id) => carsById.get(id)).filter(Boolean)
  const slots = Array.from({ length: MAX_COMPARE }, (_, index) => selected[index] ?? null)
  const columns = 'grid-cols-[repeat(3,minmax(0,1fr))]'

  return (
    <>
      <PageHeader
        compact
        eyebrow="Compare"
        title="Side by side"
        description="Line up to three cars and see exactly how they stack up — the strongest figure in every row is highlighted."
      />

      <Container className="pb-24">
        {selected.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hover-dashed mb-10 flex flex-col items-center rounded-[1.75rem] border border-dashed border-ink-700/45 px-6 py-14 text-center"
          >
            <span className="grid size-16 place-items-center rounded-full bg-gold-400/10 text-gold-400">
              <Scale className="size-7" />
            </span>
            <h2 className="mt-6 font-display text-2xl font-bold text-bone">Start your comparison</h2>
            <p className="mt-2 max-w-md text-sm text-mist">Add cars from the collection with the compare button, or pick them right here.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button onClick={() => setPickerOpen(true)}>
                <Plus className="size-4" /> Add a car
              </Button>
              <Button to="/collection" variant="outline">
                Browse the collection
              </Button>
            </div>
          </motion.div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-mist">
            <span className="font-semibold text-bone">{selected.length}</span> of {MAX_COMPARE} selected
          </p>
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-mist select-none">
              <span>Differences only</span>
              <button
                type="button"
                role="switch"
                aria-checked={diffOnly}
                onClick={() => setDiffOnly((value) => !value)}
                className={`relative h-6 w-11 rounded-full transition duration-300 hover:ring-4 hover:ring-gold-400/15 ${diffOnly ? 'bg-gold-400' : 'bg-ink-700'}`}
              >
                <motion.span layout className={`absolute top-1 size-4 rounded-full bg-white shadow ${diffOnly ? 'right-1' : 'left-1'}`} />
              </button>
            </label>
            {selected.length > 0 && (
              <button type="button" onClick={clearCompare} className="inline-flex items-center gap-1.5 text-sm font-semibold text-mist transition hover:text-ember">
                <Trash2 className="size-4" /> Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-4">
          <div className="hidden lg:block" />
          <div className={`grid ${columns} gap-2 sm:gap-4`}>
            {slots.map((car, index) => (
              <AnimatePresence key={car?.id ?? `slot-${index}`} mode="popLayout">
                {car ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="spotlight group relative min-w-0 overflow-hidden rounded-2xl border border-ink-700/60 bg-ink-900 shadow-soft transition-shadow duration-500 hover:shadow-lift sm:rounded-[1.5rem]"
                  >
                    <Link to={`/cars/${car.slug}`} className="block">
                      <Img src={car.images[0].src} alt={car.images[0].alt} sizes="(min-width: 1024px) 25vw, 33vw" position={car.images[0].position} className="aspect-[4/3]" imgClassName="transition-transform duration-1000 group-hover:scale-105" />
                      <div className="p-2.5 sm:p-5">
                        <p className="truncate text-[0.55rem] font-semibold tracking-[0.2em] text-gold-400 uppercase sm:text-[0.65rem]">{car.make}</p>
                        <p className="mt-1 line-clamp-2 font-display text-xs leading-tight font-bold text-bone sm:text-lg">{car.model}</p>
                        <p className="mt-1 hidden text-sm text-mist sm:block">{formatPrice(car.price)}</p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromCompare(car.id)}
                      aria-label={`Remove ${car.name}`}
                      className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-white/90 text-bone shadow-soft backdrop-blur transition hover:bg-ember hover:text-on-accent sm:top-3 sm:right-3 sm:size-9"
                    >
                      <X className="size-3.5 sm:size-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setPickerOpen(true)}
                    className="group flex min-h-40 min-w-0 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-700/50 p-3 text-center text-mist transition hover:border-gold-400/60 hover:text-gold-500 sm:min-h-64 sm:rounded-[1.5rem]"
                  >
                    <span className="grid size-10 place-items-center rounded-full border border-current transition-transform duration-500 group-hover:rotate-90 sm:size-14">
                      <Plus className="size-4 sm:size-5" />
                    </span>
                    <span className="text-xs font-semibold sm:text-sm">Add car</span>
                  </motion.button>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>

        {selected.length > 0 && (
          <div className="mt-10 flex flex-col gap-10">
            {SPEC_GROUPS.map((group) => {
              const rows = group.rows.filter((row) => {
                if (!diffOnly || selected.length < 2) return true
                const values = selected.map(row.get)
                return new Set(values.map(String)).size > 1
              })
              if (!rows.length) return null
              return (
                <section key={group.title}>
                  <h2 className="eyebrow mb-3">{group.title}</h2>
                  <div className="hover-panel overflow-hidden rounded-[1.5rem] border border-ink-700/60 bg-ink-900 shadow-soft">
                    {rows.map((row) => {
                      const values = slots.map((car) => (car ? row.get(car) : null))
                      const numeric = values.filter((value) => typeof value === 'number')
                      const winner = bestIndex(numeric, row.best)
                      const winnerValue = winner >= 0 ? numeric[winner] : null
                      return (
                        <div key={row.label} className="border-b border-ink-700/40 last:border-b-0 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-4">
                          <div className="px-4 pt-3 text-[0.65rem] font-semibold tracking-[0.18em] text-smoke uppercase lg:flex lg:items-center lg:py-4 lg:pl-6 lg:text-xs">
                            {row.label}
                          </div>
                          <div className={`grid ${columns} gap-2 px-4 pt-1.5 pb-3 sm:gap-4 lg:px-0 lg:py-4 lg:pr-6`}>
                            {values.map((value, index) => {
                              const isBest = value !== null && winnerValue !== null && value === winnerValue
                              return (
                                <div key={index} className={`flex min-w-0 items-center gap-1.5 text-xs break-words sm:text-sm ${isBest ? 'font-bold text-gold-500' : 'text-bone'}`}>
                                  {value === null ? <span className="text-smoke">—</span> : row.format ? row.format(value) : value}
                                  {isBest && <Crown className="size-3.5 shrink-0 text-gold-400" />}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}

            <div className={`grid ${columns} gap-2 sm:gap-4 lg:ml-[14rem]`}>
              {slots.map((car, index) =>
                car ? (
                  <Button key={car.id} to={`/test-drive?car=${car.slug}`} size="sm" variant={index === 0 ? 'primary' : 'outline'} className="w-full px-2">
                    <span className="sm:hidden">Drive</span>
                    <span className="hidden sm:inline">Book test drive</span>
                  </Button>
                ) : (
                  <span key={`empty-${index}`} />
                ),
              )}
            </div>
          </div>
        )}
      </Container>

      <CarPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(id) => addToCompare(id, { silent: true })} selected={compare} title="Add a car to compare" />
    </>
  )
}
