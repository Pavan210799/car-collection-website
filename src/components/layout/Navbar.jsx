import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Heart, Menu, Scale } from 'lucide-react'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { Button } from '../ui/Button'
import { navigation } from '../../data/site'
import { useGarage } from '../../context/contexts'

export const visibleNav = navigation.filter((item) => item.ready)

function CountBadge({ count }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 20 }}
          className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[0.65rem] leading-5 font-bold text-ink-950"
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
          isActive ? 'border-gold-400/60 text-gold-300' : 'border-white/10 text-bone hover:border-white/30 hover:bg-white/[0.05]'
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
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(latest > 24)
    setHidden(latest > 420 && latest > previous + 4)
    if (latest < previous - 4) setHidden(false)
  })

  useEffect(() => {
    setMenuOpen(false)
    setHidden(false)
  }, [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden && !menuOpen ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
            scrolled ? 'border-b border-white/[0.07] bg-ink-950/75 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
          }`}
        >
          <nav className="mx-auto flex h-[4.5rem] w-full max-w-[96rem] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12 3xl:max-w-[110rem]">
            <Logo />

            <ul className="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-black/20 p-1 backdrop-blur-md lg:flex">
              {visibleNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `relative block rounded-full px-4 py-2 text-[0.8rem] font-semibold tracking-wide transition-colors duration-300 ${
                        isActive ? 'text-ink-950' : 'text-bone/80 hover:text-bone'
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

            <div className="flex items-center gap-2">
              <GarageLink to="/compare" label="Compare" count={compare.length} icon={Scale} className="hidden xs:grid" />
              <GarageLink to="/wishlist" label="Wishlist" count={wishlist.length} icon={Heart} />
              <Button to="/test-drive" size="sm" className="ml-1 max-md:hidden">
                Book a drive
              </Button>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="grid size-10 place-items-center rounded-full border border-white/10 text-bone transition hover:border-white/30 lg:hidden"
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
