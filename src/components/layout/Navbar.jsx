import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Scale } from 'lucide-react'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { ConciergeMenu } from './ConciergeMenu'
import { Button } from '../ui/Button'
import { navigation } from '../../data/site'
import { useGarage } from '../../context/contexts'

export const visibleNav = navigation.filter((item) => item.ready && !item.footerOnly)

function CountBadge({ count }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 22 }}
          className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[0.65rem] leading-5 font-bold text-on-accent ring-2 ring-ink-900"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function GarageLink({ to, label, count, icon: Icon, className = 'grid' }) {
  return (
    <NavLink
      to={to}
      aria-label={`${label}${count ? ` (${count})` : ''}`}
      title={label}
      className={({ isActive }) =>
        `relative size-10 shrink-0 place-items-center rounded-full border transition duration-300 ${className} ${
          isActive ? 'border-gold-400/50 bg-gold-200/60 text-gold-500' : 'border-ink-700/70 bg-ink-900/70 text-bone hover:-translate-y-0.5 hover:border-bone/30 hover:shadow-soft'
        }`
      }
    >
      <Icon className="size-[1.05rem]" />
      <CountBadge count={count} />
    </NavLink>
  )
}

export function Navbar() {
  const { pathname } = useLocation()
  const { wishlist, compare } = useGarage()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 border-b border-ink-700/50 bg-ink-950/85 shadow-soft backdrop-blur-xl"
      >
        <div>
          <nav className="mx-auto flex h-[4.5rem] w-full max-w-[96rem] items-center justify-between gap-3 px-5 sm:px-8 lg:px-12 3xl:max-w-[110rem]">
            <Logo taglineClassName="xs:block lg:hidden xl:block" />

            <ul className="hidden items-center gap-0.5 rounded-full border border-ink-700/60 bg-ink-900/70 p-1 shadow-soft backdrop-blur-md lg:flex">
              {visibleNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `relative block rounded-full px-4 py-2 text-[0.8rem] font-semibold tracking-wide transition-colors duration-300 xl:px-5 ${
                        isActive ? 'text-on-accent' : 'text-mist hover:text-bone'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-full bg-bone"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className="relative">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="flex shrink-0 items-center gap-2">
              <GarageLink to="/compare" label="Compare" count={compare.length} icon={Scale} className="hidden xs:grid" />
              <GarageLink to="/wishlist" label="Wishlist" count={wishlist.length} icon={Heart} />
              <ConciergeMenu className="hidden lg:block" />
              <Button to="/test-drive" size="sm" className="ml-1 max-md:hidden">
                Book a drive
              </Button>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="grid size-10 place-items-center rounded-full bg-bone text-on-accent transition hover:bg-night lg:hidden"
              >
                <Menu className="size-[1.1rem]" />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
