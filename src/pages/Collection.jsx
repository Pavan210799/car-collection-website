import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpDown, LayoutGrid, List, Search, SearchX, SlidersHorizontal, X } from 'lucide-react'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/PageHeader'
import { Dropdown } from '../components/ui/Dropdown'
import { Dialog } from '../components/ui/Dialog'
import { Button } from '../components/ui/Button'
import { CarCard, CarListItem } from '../components/cars/CarCard'
import { FilterPanel } from '../components/collection/FilterPanel'
import { cars } from '../data/cars'
import { brandsBySlug } from '../data/brands'
import { categoriesBySlug } from '../data/categories'
import {
  EMPTY_FILTERS,
  MULTI_KEYS,
  SORT_OPTIONS,
  applyFilters,
  countActiveFilters,
  facetCounts,
  filtersFromParams,
  paramsFromFilters,
  sortCars,
} from '../lib/carQuery'
import { formatCompactPrice, pluralize } from '../lib/format'
import { useLocalStorage } from '../hooks/useLocalStorage'

const chipLabel = (key, value) => {
  if (key === 'brand') return brandsBySlug.get(value)?.name ?? value
  if (key === 'category') return categoriesBySlug.get(value)?.short ?? value
  return value
}

export default function Collection() {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => filtersFromParams(params), [params])
  const [view, setView] = useLocalStorage('aurion:view', 'grid')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const update = useCallback(
    (next) => setParams(paramsFromFilters({ ...filters, ...next }), { replace: true, preventScrollReset: true }),
    [filters, setParams],
  )

  const toggle = useCallback(
    (key, value) => {
      const list = filters[key]
      update({ [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value] })
    },
    [filters, update],
  )

  const results = useMemo(() => sortCars(applyFilters(cars, filters), filters.sort), [filters])

  const facets = useMemo(() => {
    const entries = MULTI_KEYS.map((key) => [key, facetCounts(applyFilters(cars, { ...filters, [key]: [] }), key)])
    return Object.fromEntries(entries)
  }, [filters])

  const activeCount = countActiveFilters(filters)
  const chips = [
    ...MULTI_KEYS.flatMap((key) => filters[key].map((value) => ({ key, value, label: chipLabel(key, value) }))),
    ...(filters.minPrice !== null ? [{ key: 'minPrice', label: `From ${formatCompactPrice(filters.minPrice)}` }] : []),
    ...(filters.maxPrice !== null ? [{ key: 'maxPrice', label: `Up to ${formatCompactPrice(filters.maxPrice)}` }] : []),
    ...(filters.minPower !== null ? [{ key: 'minPower', label: `${filters.minPower}+ hp` }] : []),
  ]

  const removeChip = (chip) => (chip.value !== undefined ? toggle(chip.key, chip.value) : update({ [chip.key]: null }))
  const clearAll = () => update({ ...EMPTY_FILTERS, sort: filters.sort })

  return (
    <>
      <PageHeader
        compact
        eyebrow="The collection"
        title="Every car, hand-picked"
        description={`${cars.length} extraordinary automobiles from ${brandsBySlug.size} legendary marques. Search, filter and sort to find the one that speaks to you.`}
      />

      <Container className="pb-24">
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[18.5rem_minmax(0,1fr)] xl:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain rounded-[1.5rem] border border-ink-700/40 bg-ink-900/60 p-6 hover-panel">
              <div className="mb-5 flex items-center justify-between">
                <p className="flex items-center gap-2 font-display text-lg font-bold text-bone">
                  <SlidersHorizontal className="size-4 text-gold-400" /> Filters
                </p>
                {activeCount > 0 && (
                  <button type="button" onClick={clearAll} className="text-xs font-semibold text-gold-400 hover:text-gold-500">
                    Reset ({activeCount})
                  </button>
                )}
              </div>
              <FilterPanel filters={filters} facets={facets} onToggle={toggle} onChange={(key, value) => update({ [key]: value })} />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="group relative min-w-0 flex-1">
                <span className="sr-only">Search cars</span>
                <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-mist transition-colors group-focus-within:text-gold-400" />
                <input
                  type="search"
                  value={filters.q}
                  onChange={(event) => update({ q: event.target.value })}
                  placeholder="Search by make, model or style…"
                  className="h-11 w-full rounded-full border border-ink-700/45 bg-ink-900 pr-11 pl-11 text-sm text-bone transition outline-none placeholder:text-smoke hover:border-ink-700/55 focus:border-gold-400"
                />
                {filters.q && (
                  <button
                    type="button"
                    onClick={() => update({ q: '' })}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-mist transition hover:bg-ink-800 hover:text-bone"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </label>

              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="relative flex h-11 shrink-0 items-center gap-2 rounded-full border border-ink-700/45 bg-ink-900 px-4 text-sm font-semibold text-bone transition hover:border-ink-700/55 lg:hidden"
                >
                  <SlidersHorizontal className="size-4 text-gold-400" />
                  Filters
                  {activeCount > 0 && <span className="rounded-full bg-gold-400 px-1.5 text-xs leading-5 text-on-accent">{activeCount}</span>}
                </button>
                <Dropdown
                  label="Sort"
                  icon={ArrowUpDown}
                  value={filters.sort}
                  options={SORT_OPTIONS}
                  onChange={(sort) => update({ sort })}
                  className="min-w-0 flex-1 sm:w-64 sm:flex-none"
                />
                <div className="hidden h-11 shrink-0 items-center rounded-full border border-ink-700/45 bg-ink-900 p-1 sm:flex" role="group" aria-label="Layout">
                  {[
                    { id: 'grid', icon: LayoutGrid, label: 'Grid view' },
                    { id: 'list', icon: List, label: 'List view' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setView(option.id)}
                      aria-pressed={view === option.id}
                      aria-label={option.label}
                      className={`relative grid size-9 place-items-center rounded-full transition-colors ${view === option.id ? 'text-on-accent' : 'text-mist hover:text-bone'}`}
                    >
                      {view === option.id && <motion.span layoutId="view-toggle" className="absolute inset-0 rounded-full bg-bone" />}
                      <option.icon className="relative size-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex min-h-8 flex-wrap items-center gap-2">
              <p className="mr-2 text-sm text-mist" aria-live="polite">
                Showing <span className="font-semibold text-bone">{pluralize(results.length, 'car')}</span>
                {results.length !== cars.length && <> of {cars.length}</>}
              </p>
              <AnimatePresence initial={false}>
                {chips.map((chip) => (
                  <motion.button
                    key={`${chip.key}-${chip.value ?? ''}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={() => removeChip(chip)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 py-1 pr-2 pl-3 text-xs font-semibold text-gold-500 transition hover:border-gold-400/60"
                  >
                    {chip.label}
                    <X className="size-3.5 transition-transform group-hover:rotate-90" />
                  </motion.button>
                ))}
              </AnimatePresence>
              {chips.length > 1 && (
                <button type="button" onClick={clearAll} className="text-xs font-semibold text-mist underline-offset-4 hover:text-bone hover:underline">
                  Clear all
                </button>
              )}
            </div>

            <h2 className="sr-only">Results</h2>
            {results.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover-dashed mt-8 flex flex-col items-center rounded-[1.75rem] border border-dashed border-ink-700/45 px-6 py-20 text-center"
              >
                <span className="grid size-16 place-items-center rounded-full bg-gold-400/10 text-gold-400">
                  <SearchX className="size-7" />
                </span>
                <h2 className="mt-6 font-display text-2xl font-bold text-bone">No cars match those filters</h2>
                <p className="mt-2 max-w-md text-sm text-mist">Try widening your price range, removing a filter or searching for a different make or model.</p>
                <Button onClick={clearAll} className="mt-8">
                  Reset all filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={`mt-6 grid gap-5 sm:gap-6 ${view === 'grid' ? 'sm:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1'}`}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {results.map((car, index) =>
                    view === 'grid' ? (
                      <CarCard key={car.id} car={car} priority={index < 2} index={index} animated />
                    ) : (
                      <CarListItem key={car.id} car={car} index={index} animated />
                    ),
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </Container>

      <Dialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        title="Filters"
        description={pluralize(results.length, 'car') + ' match'}
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={clearAll} className="flex-1" disabled={activeCount === 0}>
              Reset
            </Button>
            <Button onClick={() => setDrawerOpen(false)} className="flex-1">
              Show {results.length}
            </Button>
          </div>
        }
      >
        <div className="px-5 py-6 sm:px-7">
          <FilterPanel filters={filters} facets={facets} onToggle={toggle} onChange={(key, value) => update({ [key]: value })} />
        </div>
      </Dialog>
    </>
  )
}
