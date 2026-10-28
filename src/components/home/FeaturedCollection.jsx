import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'
import { CarCard } from '../cars/CarCard'
import { cars } from '../../data/cars'
import { categories } from '../../data/categories'
import { sortCars } from '../../lib/carQuery'

const tabs = [{ slug: 'all', short: 'All' }, ...categories]

export function FeaturedCollection() {
  const [active, setActive] = useState('all')

  const visible = useMemo(() => {
    const pool = active === 'all' ? cars.filter((car) => car.featured) : cars.filter((car) => car.category === active)
    return sortCars(pool, 'featured').slice(0, 6)
  }, [active])

  return (
    <section className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Featured collection"
          title={
            <>
              Icons of <span className="text-gradient-gold">speed &amp; style</span>
            </>
          }
          description="A rotating edit of the most coveted cars in our collection — hand-picked by our specialists this month."
          action={
            <Button to="/collection" variant="outline">
              View all {cars.length} cars <ArrowRight className="size-4" />
            </Button>
          }
        />

        <div className="no-scrollbar -mx-5 mt-10 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <div role="tablist" aria-label="Filter featured cars" className="flex w-max gap-2 rounded-full border border-white/[0.07] bg-ink-900/60 p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={active === tab.slug}
                onClick={() => setActive(tab.slug)}
                className={`relative rounded-full px-4 py-2 text-xs font-semibold tracking-wide whitespace-nowrap transition-colors duration-300 sm:px-5 sm:text-sm ${
                  active === tab.slug ? 'text-ink-950' : 'text-mist hover:text-bone'
                }`}
              >
                {active === tab.slug && (
                  <motion.span layoutId="featured-tab" className="absolute inset-0 rounded-full bg-gold-400" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">{tab.short}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((car, index) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
                transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  )
}
