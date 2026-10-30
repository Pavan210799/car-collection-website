import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'
import { CarCard } from '../cars/CarCard'
import { cars } from '../../data/cars'
import { categories } from '../../data/categories'
import { sortCars } from '../../lib/carQuery'
import { useScrollEdges } from '../../hooks/useScrollEdges'

const tabs = [{ slug: 'all', short: 'Featured' }, ...categories]

const fadeMask = ({ start, end }) =>
  `linear-gradient(90deg, ${start ? 'transparent, black 2.5rem' : 'black'}, ${end ? 'black calc(100% - 2.5rem), transparent' : 'black'})`

export function FeaturedCollection() {
  const [active, setActive] = useState('all')
  const tabsRef = useRef(null)
  const edges = useScrollEdges(tabsRef)

  const visible = useMemo(() => {
    const pool = active === 'all' ? cars.filter((car) => car.featured) : cars.filter((car) => car.category === active)
    return sortCars(pool, 'featured').slice(0, 6)
  }, [active])

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The collection"
          title="Machines worth the detour"
          description="Hand-selected, inspected and photographed in-house. Filter by discipline to see what’s on the floor today."
          action={
            <Button to="/collection" variant="dark">
              View all {cars.length} cars <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          }
        />

        <div className="relative mt-10 w-fit max-w-full overflow-hidden rounded-full border border-ink-700/60 bg-ink-900 p-1 shadow-soft">
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Filter featured cars"
            className="no-scrollbar flex gap-1 overflow-x-auto overscroll-x-contain rounded-full transition-[mask-image] duration-300"
            style={{ maskImage: fadeMask(edges), WebkitMaskImage: fadeMask(edges) }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={active === tab.slug}
                onClick={(event) => {
                  setActive(tab.slug)
                  event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
                }}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-300 ${
                  active === tab.slug ? 'text-on-accent' : 'text-mist hover:text-bone'
                }`}
              >
                {active === tab.slug && (
                  <motion.span layoutId="featured-tab" className="absolute inset-0 rounded-full bg-bone" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">{tab.short}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} animated />
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  )
}
