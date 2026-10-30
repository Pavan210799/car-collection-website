import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { ConciergeMenu } from './ConciergeMenu'
import { AccountMenu } from './AccountMenu'
import { Button } from '../ui/Button'
import { navigation } from '../../data/site'

export const visibleNav = navigation.filter((item) => item.ready && !item.footerOnly)

export function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openPopover, setOpenPopover] = useState(null)
  const [routePath, setRoutePath] = useState(pathname)

  if (routePath !== pathname) {
    setRoutePath(pathname)
    setMenuOpen(false)
    setOpenPopover(null)
  }

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 border-b border-ink-700/50 bg-ink-950/85 shadow-soft backdrop-blur-xl"
      >
        <nav className="mx-auto flex h-[4.5rem] w-full max-w-[96rem] items-center justify-between gap-3 px-5 sm:px-8 lg:px-12 3xl:max-w-[110rem]">
          <Logo />

          <ul className="hidden items-center gap-0.5 rounded-full border border-ink-700/60 bg-ink-900/70 p-1 shadow-soft backdrop-blur-md xl:flex">
            {visibleNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `relative block rounded-full px-4 py-2 text-[0.8rem] font-semibold tracking-wide whitespace-nowrap transition-colors duration-300 2xl:px-5 ${
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
            <ConciergeMenu openId={openPopover} setOpenId={setOpenPopover} className="hidden xl:block" />
            <AccountMenu openId={openPopover} setOpenId={setOpenPopover} className="hidden xl:flex" />
            <Button to="/test-drive" size="sm" className="ml-1 max-md:hidden">
              Book a drive
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="grid size-10 place-items-center rounded-full bg-bone text-on-accent transition hover:bg-night xl:hidden"
            >
              <Menu className="size-[1.1rem]" />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
