import { useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'
import { Dialog } from '../ui/Dialog'
import { Img } from '../ui/Img'
import { cars } from '../../data/cars'
import { matchesSearch } from '../../lib/carQuery'
import { formatPrice } from '../../lib/format'

export function CarPicker({ open, onClose, onSelect, selected = [], title = 'Choose a car' }) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => cars.filter((car) => matchesSearch(car, query)), [query])

  const close = () => {
    setQuery('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={close} title={title} description={`${cars.length} cars available`}>
      <div className="sticky top-0 z-10 border-b border-white/[0.07] bg-ink-900 px-5 py-4 sm:px-7">
        <label className="relative block">
          <span className="sr-only">Search cars</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-mist" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search make or model…"
            className="h-11 w-full rounded-full border border-white/10 bg-ink-850 pr-4 pl-11 text-sm text-bone outline-none placeholder:text-smoke focus:border-gold-400"
          />
        </label>
      </div>
      <ul className="grid gap-2 p-3 sm:grid-cols-2 sm:p-4">
        {results.map((car) => {
          const isSelected = selected.includes(car.id)
          return (
            <li key={car.id}>
              <button
                type="button"
                disabled={isSelected}
                onClick={() => {
                  onSelect(car.id)
                  close()
                }}
                className="group flex w-full items-center gap-3 rounded-2xl border border-transparent p-2 text-left transition hover:border-white/10 hover:bg-white/[0.04] disabled:opacity-40"
              >
                <Img src={car.images[0].src} alt="" sizes="96px" position={car.images[0].position} className="h-14 w-20 shrink-0 rounded-xl" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.65rem] font-semibold tracking-[0.2em] text-gold-400 uppercase">{car.make}</span>
                  <span className="block truncate text-sm font-semibold text-bone">{car.model}</span>
                  <span className="block text-xs text-mist">{formatPrice(car.price)}</span>
                </span>
                {isSelected && <Check className="size-4 shrink-0 text-gold-400" />}
              </button>
            </li>
          )
        })}
        {results.length === 0 && <li className="col-span-full py-12 text-center text-sm text-mist">No cars match “{query}”.</li>}
      </ul>
    </Dialog>
  )
}
