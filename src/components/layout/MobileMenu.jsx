import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from '../ui/Button'
import { navigation } from '../../data/site'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useGarage } from '../../context/contexts'

const links = [
  ...navigation.filter((item) => item.ready),
  { label: 'Wishlist', to: '/wishlist', ready: true },
]

export function MobileMenu({ open, onClose }) {
  const { wishlist, compare } = useGarage()
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const countFor = (to) => (to === '/wishlist' ? wishlist.length : to === '/compare' ? compare.length : 0)

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.25rem)' }}
          animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.25rem)' }}
          exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.25rem)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="grain fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink-950 lg:hidden"
        >
          <div className="pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full bg-gold-500/15 blur-3xl" />
          <div className="relative flex h-[4.5rem] shrink-0 items-center justify-between px-5 sm:px-8">
            <Logo onClick={onClose} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid size-10 place-items-center rounded-full border border-white/15 text-bone transition hover:rotate-90"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="relative flex flex-1 flex-col justify-center px-5 py-8 sm:px-8">
            <ul className="flex flex-col">
              {links.map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-white/[0.07]"
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center justify-between gap-4 py-4 font-display text-[clamp(1.75rem,8vw,3rem)] font-bold tracking-tight transition-colors ${
                        isActive ? 'text-gold-400' : 'text-bone hover:text-gold-200'
                      }`
                    }
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-sans text-xs font-semibold tracking-[0.2em] text-smoke">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {item.label}
                      {countFor(item.to) > 0 && (
                        <span className="rounded-full bg-gold-400 px-2 py-0.5 font-sans text-xs text-ink-950">{countFor(item.to)}</span>
                      )}
                    </span>
                    <ArrowUpRight className="size-6 shrink-0 text-smoke transition-transform duration-500 group-hover:rotate-45 group-hover:text-gold-400" />
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="relative flex flex-col gap-3 px-5 pb-8 sm:flex-row sm:px-8"
          >
            <Button to="/test-drive" onClick={onClose} size="lg" className="w-full sm:w-auto">
              Book a test drive
            </Button>
            <Button to="/collection" onClick={onClose} variant="outline" size="lg" className="w-full sm:w-auto">
              Explore the collection
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
