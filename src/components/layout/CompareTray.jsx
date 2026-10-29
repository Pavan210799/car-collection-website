import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Plus, Scale, X } from 'lucide-react'
import { Img } from '../ui/Img'
import { Button } from '../ui/Button'
import { useGarage } from '../../context/contexts'
import { MAX_COMPARE } from '../../context/GarageProvider'
import { carsById } from '../../data/cars'

export function CompareTray() {
  const { pathname } = useLocation()
  const { compare, removeFromCompare, clearCompare } = useGarage()
  const { scrollY } = useScroll()
  const [pastHero, setPastHero] = useState(false)
  useMotionValueEvent(scrollY, 'change', (latest) => setPastHero(latest > window.innerHeight * 0.75))
  const show = compare.length > 0 && !['/compare', '/test-drive'].includes(pathname) && (pathname !== '/' || pastHero)
  const selected = compare.map((id) => carsById.get(id))

  return (
    <>
      {show && <div aria-hidden="true" className="h-20 sm:h-24" />}
      <AnimatePresence>
        {show && (
          <motion.aside
            aria-label="Comparison tray"
            initial={{ y: 140, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 140, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:left-1/2 sm:w-[min(40rem,calc(100vw-3rem))] lg:w-[min(54rem,calc(100vw-3rem))] sm:-translate-x-1/2"
          >
            <div className="glass flex items-center gap-3 rounded-[1.25rem] p-2.5 shadow-lift sm:gap-4 sm:p-3">
              <ul className="flex min-w-0 flex-1 gap-2">
                {Array.from({ length: MAX_COMPARE }, (_, index) => {
                  const car = selected[index]
                  return (
                    <li key={car?.id ?? `empty-${index}`} className="min-w-0 flex-1">
                      {car ? (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group relative flex h-12 items-center gap-2 overflow-hidden rounded-xl border border-ink-700/60 bg-ink-900 pr-1"
                        >
                          <Img src={car.images[0].src} alt="" sizes="96px" className="h-full w-12 shrink-0 sm:w-auto sm:flex-1 lg:w-16 lg:flex-none" />
                          <span className="hidden min-w-0 flex-1 truncate text-xs font-semibold text-bone lg:block">{car.model}</span>
                          <button
                            type="button"
                            onClick={() => removeFromCompare(car.id)}
                            aria-label={`Remove ${car.name} from comparison`}
                            className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-bone text-on-accent transition hover:bg-ember sm:static sm:size-6 sm:bg-transparent sm:text-smoke sm:hover:bg-ink-800 sm:hover:text-bone"
                          >
                            <X className="size-3" />
                          </button>
                        </motion.div>
                      ) : (
                        <div className="grid h-12 place-items-center rounded-xl border border-dashed border-ink-600/70 text-smoke">
                          <Plus className="size-4" />
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={clearCompare}
                  className="hidden rounded-full px-3 py-2 text-xs font-semibold text-mist transition hover:text-bone sm:block"
                >
                  Clear
                </button>
                <Button to="/compare" size="sm" className="px-4">
                  <Scale className="size-3.5" /> Compare <span className="tabular-nums">{compare.length}</span>
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
