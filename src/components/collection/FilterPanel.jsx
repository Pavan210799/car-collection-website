import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { brands } from '../../data/brands'
import { bodyTypes, categories, conditions, drivetrains, powertrains } from '../../data/categories'
import { formatCompactPrice } from '../../lib/format'
import { PRICE_STEPS, POWER_STEPS } from './filterConfig'

function Group({ title, children, defaultOpen = true, count = 0 }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/[0.07] py-5 first:pt-0 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-bone uppercase">
          {title}
          {count > 0 && <span className="rounded-full bg-gold-400 px-1.5 text-[0.6rem] leading-4 text-ink-950">{count}</span>}
        </span>
        <ChevronDown className={`size-4 text-mist transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CheckOption({ label, checked, count, onChange }) {
  const disabled = count === 0 && !checked
  return (
    <label className={`group flex cursor-pointer items-center gap-3 rounded-lg py-1.5 ${disabled ? 'cursor-not-allowed opacity-35' : ''}`}>
      <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={onChange} />
      <span
        className={`grid size-5 shrink-0 place-items-center rounded-md border transition duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-gold-400 ${
          checked ? 'border-gold-400 bg-gold-400 text-ink-950' : 'border-white/20 group-hover:border-white/40'
        }`}
      >
        <Check className={`size-3.5 transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`} strokeWidth={3} />
      </span>
      <span className={`min-w-0 flex-1 truncate text-sm transition-colors ${checked ? 'text-bone' : 'text-mist group-hover:text-bone'}`}>{label}</span>
      <span className="text-xs text-smoke tabular-nums">{count}</span>
    </label>
  )
}

function ChipOption({ label, checked, onChange, count }) {
  const disabled = count === 0 && !checked
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      aria-pressed={checked}
      className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition duration-300 disabled:opacity-30 ${
        checked ? 'border-gold-400 bg-gold-400 text-ink-950' : 'border-white/12 text-mist hover:border-white/30 hover:text-bone'
      }`}
    >
      {label}
    </button>
  )
}

function StepSelect({ label, value, steps, onChange, format, placeholder }) {
  return (
    <label className="block min-w-0 flex-1">
      <span className="text-[0.65rem] tracking-[0.18em] text-smoke uppercase">{label}</span>
      <span className="relative mt-1.5 block">
        <select
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))}
          className="w-full appearance-none rounded-xl border border-white/10 bg-ink-800 py-2.5 pr-8 pl-3 text-sm text-bone transition outline-none hover:border-white/25 focus:border-gold-400"
        >
          <option value="">{placeholder}</option>
          {steps.map((step) => (
            <option key={step} value={step}>
              {format(step)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-mist" />
      </span>
    </label>
  )
}

export function FilterPanel({ filters, facets, onToggle, onChange }) {
  return (
    <div>
      <Group title="Category" count={filters.category.length}>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <ChipOption
              key={category.slug}
              label={category.short}
              checked={filters.category.includes(category.slug)}
              count={facets.category[category.slug] ?? 0}
              onChange={() => onToggle('category', category.slug)}
            />
          ))}
        </div>
      </Group>

      <Group title="Price" count={(filters.minPrice !== null) + (filters.maxPrice !== null)}>
        <div className="flex gap-3">
          <StepSelect label="Min" value={filters.minPrice} steps={PRICE_STEPS} onChange={(value) => onChange('minPrice', value)} format={formatCompactPrice} placeholder="No min" />
          <StepSelect label="Max" value={filters.maxPrice} steps={PRICE_STEPS} onChange={(value) => onChange('maxPrice', value)} format={formatCompactPrice} placeholder="No max" />
        </div>
      </Group>

      <Group title="Brand" count={filters.brand.length}>
        <div className="flex flex-col">
          {brands.map((brand) => (
            <CheckOption
              key={brand.slug}
              label={brand.name}
              checked={filters.brand.includes(brand.slug)}
              count={facets.brand[brand.slug] ?? 0}
              onChange={() => onToggle('brand', brand.slug)}
            />
          ))}
        </div>
      </Group>

      <Group title="Performance" count={filters.minPower !== null ? 1 : 0}>
        <div className="flex flex-wrap gap-2">
          {POWER_STEPS.map((step) => (
            <ChipOption
              key={step}
              label={`${step}+ hp`}
              checked={filters.minPower === step}
              onChange={() => onChange('minPower', filters.minPower === step ? null : step)}
            />
          ))}
        </div>
      </Group>

      <Group title="Powertrain" count={filters.powertrain.length}>
        <div className="flex flex-wrap gap-2">
          {powertrains.map((item) => (
            <ChipOption key={item} label={item} checked={filters.powertrain.includes(item)} count={facets.powertrain[item] ?? 0} onChange={() => onToggle('powertrain', item)} />
          ))}
        </div>
      </Group>

      <Group title="Body style" count={filters.body.length} defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {bodyTypes.map((item) => (
            <ChipOption key={item} label={item} checked={filters.body.includes(item)} count={facets.body[item] ?? 0} onChange={() => onToggle('body', item)} />
          ))}
        </div>
      </Group>

      <Group title="Drivetrain" count={filters.drivetrain.length} defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {drivetrains.map((item) => (
            <ChipOption key={item} label={item} checked={filters.drivetrain.includes(item)} count={facets.drivetrain[item] ?? 0} onChange={() => onToggle('drivetrain', item)} />
          ))}
        </div>
      </Group>

      <Group title="Condition" count={filters.condition.length} defaultOpen={false}>
        <div className="flex flex-col">
          {conditions.map((item) => (
            <CheckOption key={item} label={item} checked={filters.condition.includes(item)} count={facets.condition[item] ?? 0} onChange={() => onToggle('condition', item)} />
          ))}
        </div>
      </Group>
    </div>
  )
}
