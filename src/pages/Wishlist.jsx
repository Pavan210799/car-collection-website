import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Heart, Scale, Trash2 } from 'lucide-react'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { CarCard } from '../components/cars/CarCard'
import { useGarage, useToast } from '../context/contexts'
import { MAX_COMPARE } from '../context/GarageProvider'
import { cars, carsById } from '../data/cars'
import { formatPrice, pluralize } from '../lib/format'

export default function Wishlist() {
  const { wishlist, clearWishlist, setCompare } = useGarage()
  const { notify } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const saved = wishlist.map((id) => carsById.get(id)).filter(Boolean)
  const total = saved.reduce((sum, car) => sum + car.price, 0)
  const suggestions = cars.filter((car) => car.featured && !wishlist.includes(car.id)).slice(0, 3)

  const compareSaved = () => {
    setCompare(wishlist.slice(0, MAX_COMPARE))
    notify({
      title: 'Comparison ready',
      description: wishlist.length > MAX_COMPARE ? `Your first ${MAX_COMPARE} saved cars were added.` : 'Your saved cars are lined up side by side.',
      action: { label: 'Open comparison', to: '/compare' },
    })
  }

  return (
    <>
      <PageHeader
        compact
        eyebrow="Your wishlist"
        title="Saved for later"
        description="Keep track of the cars that caught your eye. Your wishlist is saved on this device."
      />

      <Container className="pb-24">
        {saved.length > 0 ? (
          <>
            <div className="mb-8 flex flex-col gap-5 rounded-[1.75rem] border border-ink-700/60 bg-ink-900 p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex flex-wrap gap-x-10 gap-y-3">
                <div>
                  <p className="text-[0.65rem] tracking-[0.2em] text-smoke uppercase">Saved</p>
                  <p className="font-display text-2xl font-bold text-bone">{pluralize(saved.length, 'car')}</p>
                </div>
                <div>
                  <p className="text-[0.65rem] tracking-[0.2em] text-smoke uppercase">Collection value</p>
                  <p className="font-display text-2xl font-bold text-gradient-gold">{formatPrice(total)}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 xs:flex-row">
                <Button onClick={compareSaved} variant="outline" disabled={saved.length < 2}>
                  <Scale className="size-4" /> Compare saved
                </Button>
                <Button onClick={() => setConfirmOpen(true)} variant="ghost">
                  <Trash2 className="size-4" /> Clear all
                </Button>
              </div>
            </div>

            <motion.div layout className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {saved.map((car) => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="min-w-0"
                  >
                    <CarCard car={car} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center rounded-[1.75rem] border border-dashed border-ink-700/45 px-6 py-16 text-center"
            >
              <motion.span
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="grid size-16 place-items-center rounded-full bg-ember/10 text-ember"
              >
                <Heart className="size-7" />
              </motion.span>
              <h2 className="mt-6 font-display text-2xl font-bold text-bone">Your wishlist is empty</h2>
              <p className="mt-2 max-w-md text-sm text-mist">Tap the heart on any car to save it here and come back to it whenever you like.</p>
              <Button to="/collection" className="mt-8">
                Explore the collection <ArrowRight className="size-4" />
              </Button>
            </motion.div>

            {suggestions.length > 0 && (
              <div className="mt-16">
                <p className="eyebrow">Popular right now</p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                  {suggestions.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Container>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Clear your wishlist?" description={`This removes all ${pluralize(saved.length, 'saved car')}.`} className="sm:max-w-md">
        <div className="flex flex-col-reverse gap-3 px-5 py-6 xs:flex-row xs:justify-end sm:px-7">
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            Keep them
          </Button>
          <Button
            onClick={() => {
              clearWishlist()
              setConfirmOpen(false)
              notify({ title: 'Wishlist cleared', tone: 'info' })
            }}
            variant="danger"
          >
            Clear wishlist
          </Button>
        </div>
      </Dialog>
    </>
  )
}
