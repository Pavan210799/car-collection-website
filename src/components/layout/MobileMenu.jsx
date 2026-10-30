import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, LogOut, X } from 'lucide-react'
import { Logo } from './Logo'
import { Avatar, useSignOut } from './AccountMenu'
import { Button } from '../ui/Button'
import { navigation } from '../../data/site'
import { contactInfo } from '../../data/support'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useAuth, useGarage } from '../../context/contexts'

const EASE = [0.22, 1, 0.36, 1]

const links = [...navigation.filter((item) => item.ready), { label: 'Wishlist', to: '/wishlist', ready: true }]

export function MobileMenu({ open, onClose }) {
  const { wishlist, compare } = useGarage()
  const { user } = useAuth()
  const signOut = useSignOut()
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
        <motion.div key="mobile-menu" className="fixed inset-0 z-[60] xl:hidden" initial="closed" animate="open" exit="closed">
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-bone/30 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            variants={{ closed: { x: '100%' }, open: { x: 0 } }}
            transition={{ duration: 0.55, ease: EASE }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-ink-950 shadow-lift"
          >
            <div aria-hidden="true" className="mesh-glow pointer-events-none absolute inset-0" />
            <div className="relative flex h-[4.5rem] shrink-0 items-center justify-between border-b border-ink-700/60 px-5 sm:px-8">
              <Logo onClick={onClose} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-full border border-ink-700/70 bg-ink-900 text-bone transition duration-300 hover:rotate-90"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="relative flex-1 px-5 py-6 sm:px-8">
              {user && (
                <motion.div
                  variants={{ closed: { opacity: 0, y: 12 }, open: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease: EASE } } }}
                  className="mb-4 flex items-center gap-3 rounded-2xl border border-ink-700/60 bg-ink-900 p-3 shadow-soft"
                >
                  <Avatar name={user.name} className="size-11 text-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-bone">{user.name}</p>
                    <p className="truncate text-xs text-mist">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      signOut()
                    }}
                    aria-label="Sign out"
                    className="grid size-10 shrink-0 place-items-center rounded-full border border-ink-700/70 text-ember transition hover:border-ember/40 hover:bg-ember/5"
                  >
                    <LogOut className="size-4" />
                  </button>
                </motion.div>
              )}
              <motion.ul variants={{ open: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } }, closed: {} }}>
                {links.map((item, index) => (
                  <motion.li
                    key={item.to}
                    variants={{ closed: { opacity: 0, x: 32 }, open: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } } }}
                    className="border-b border-ink-700/50"
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group flex items-center justify-between gap-4 py-4 font-display text-[clamp(1.5rem,7vw,2.25rem)] font-bold tracking-tight transition-colors ${
                          isActive ? 'text-gold-500' : 'text-bone hover:text-gold-500'
                        }`
                      }
                    >
                      <span className="flex min-w-0 items-baseline gap-3">
                        <span className="font-sans text-xs font-semibold tracking-[0.2em] text-smoke">{String(index + 1).padStart(2, '0')}</span>
                        <span className="truncate">{item.label}</span>
                        {countFor(item.to) > 0 && (
                          <span className="rounded-full bg-gold-400 px-2 py-0.5 font-sans text-xs text-on-accent">{countFor(item.to)}</span>
                        )}
                      </span>
                      <ArrowUpRight className="size-5 shrink-0 text-smoke transition-transform duration-500 group-hover:rotate-45 group-hover:text-gold-500" />
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <motion.div
              variants={{ closed: { opacity: 0, y: 16 }, open: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5 } } }}
              className="relative flex flex-col gap-3 border-t border-ink-700/60 px-5 py-6 sm:px-8"
            >
              <Button to="/test-drive" onClick={onClose} size="lg" className="w-full">
                Book a test drive
              </Button>
              <Button to="/collection" onClick={onClose} variant="outline" size="lg" className="w-full">
                Explore the collection
              </Button>
              {!user && (
                <Button to="/login" onClick={onClose} variant="light" size="lg" className="w-full">
                  Sign in
                </Button>
              )}
              <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="mt-1 text-center text-sm text-mist hover:text-bone">
                {contactInfo.phone}
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
