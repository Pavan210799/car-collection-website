import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { formatNumber } from '../../lib/format'

const performanceRows = (car) => [
  ['Maximum power', `${formatNumber(car.specs.power)} hp`],
  ['Maximum torque', `${formatNumber(car.specs.torque)} Nm`],
  ['0–100 km/h', `${car.specs.acceleration} s`],
  ['Top speed', `${car.specs.topSpeed} km/h`],
  ['Power-to-weight', `${Math.round((car.specs.power / car.specs.weight) * 1000)} hp / tonne`],
  [car.powertrain === 'Electric' ? 'Range (WLTP)' : 'Fuel economy', car.specs.efficiency],
]

const drivetrainRows = (car) => [
  ['Engine', car.engine],
  ['Powertrain', car.powertrain],
  ['Transmission', car.transmission],
  ['Drivetrain', car.drivetrain === 'AWD' ? 'All-wheel drive' : 'Rear-wheel drive'],
  ['Kerb weight', `${formatNumber(car.specs.weight)} kg`],
  ['Seats', car.specs.seats],
]

const dimensionRows = (car) => [
  ['Length', `${formatNumber(car.specs.length)} mm`],
  ['Width', `${formatNumber(car.specs.width)} mm`],
  ['Height', `${formatNumber(car.specs.height)} mm`],
  ['Wheelbase', `${formatNumber(car.specs.wheelbase)} mm`],
  ['Luggage capacity', `${car.specs.luggage} L`],
  ['Body style', car.body],
]

function Bar({ label, value, max, unit, invert = false }) {
  const ratio = invert ? Math.max(0.08, 1 - (value - 2) / 4) : Math.min(1, value / max)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-mist">{label}</span>
        <span className="font-display font-bold text-bone">
          {formatNumber(value)} <span className="text-xs text-gold-400">{unit}</span>
        </span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-300"
          initial={{ width: 0 }}
          whileInView={{ width: `${ratio * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

function Rows({ rows }) {
  return (
    <dl className="grid gap-x-10 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-4">
          <dt className="text-sm text-mist">{label}</dt>
          <dd className="text-right text-sm font-semibold text-bone">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function SpecTabs({ car }) {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <p className="text-base leading-relaxed text-pretty text-mist sm:text-lg">{car.description}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {car.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-ink-900 p-4 text-sm text-bone">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-400">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex min-w-0 flex-col gap-6 rounded-[1.5rem] border border-white/[0.07] bg-ink-900 p-6 sm:p-8">
            <p className="eyebrow">Performance profile</p>
            <Bar label="Power" value={car.specs.power} max={1100} unit="hp" />
            <Bar label="Torque" value={car.specs.torque} max={1600} unit="Nm" />
            <Bar label="Top speed" value={car.specs.topSpeed} max={420} unit="km/h" />
            <Bar label="0–100 km/h" value={car.specs.acceleration} unit="s" invert />
          </div>
        </div>
      ),
    },
    { id: 'performance', label: 'Performance', content: <Rows rows={performanceRows(car)} /> },
    { id: 'drivetrain', label: 'Engine & drivetrain', content: <Rows rows={drivetrainRows(car)} /> },
    { id: 'dimensions', label: 'Dimensions', content: <Rows rows={dimensionRows(car)} /> },
    {
      id: 'features',
      label: 'Features',
      content: (
        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(car.features).map(([group, items]) => (
            <div key={group} className="rounded-[1.5rem] border border-white/[0.07] bg-ink-900 p-6">
              <p className="eyebrow">{group}</p>
              <ul className="mt-5 flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-mist">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ),
    },
  ]
  const [active, setActive] = useState(tabs[0].id)
  const current = tabs.find((tab) => tab.id === active)

  return (
    <div>
      <div className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="Specifications" className="flex w-max min-w-full gap-1 border-b border-white/[0.07]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={active === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`relative px-4 py-4 text-sm font-semibold whitespace-nowrap transition-colors sm:px-5 ${
                active === tab.id ? 'text-bone' : 'text-smoke hover:text-mist'
              }`}
            >
              {tab.label}
              {active === tab.id && <motion.span layoutId="spec-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-400" />}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          id={`panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${current.id}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8"
        >
          {current.content}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
