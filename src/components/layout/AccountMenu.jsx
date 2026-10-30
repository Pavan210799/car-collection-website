import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, Heart, LogOut, Scale } from 'lucide-react'
import { useAuth, useGarage, useToast } from '../../context/contexts'
import { useNavPopover } from '../../hooks/useNavPopover'

export const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'A'

export function Avatar({ name, className = 'size-10 text-sm' }) {
  return (
    <span aria-hidden="true" className={`relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-volt font-display font-bold text-on-accent ${className}`}>
      {initialsOf(name)}
    </span>
  )
}

export function useSignOut() {
  const { signOut } = useAuth()
  const { notify } = useToast()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return () => {
    signOut()
    if (['/privacy', '/terms', '/cookies'].includes(pathname)) navigate('/login', { replace: true })
    notify({ title: 'Signed out', description: 'See you on the road soon.', tone: 'info' })
  }
}

export function AccountMenu({ openId, setOpenId, className = '' }) {
  const { user } = useAuth()
  const { wishlist, compare } = useGarage()
  const signOut = useSignOut()
  const { open, panelId, rootProps, buttonProps } = useNavPopover('account', openId, setOpenId)
  const saved = wishlist.length + compare.length

  if (!user) {
    return (
      <Link
        to="/login"
        className={`h-10 items-center rounded-full border border-ink-700/70 bg-ink-900/70 px-4 text-xs font-semibold text-bone transition hover:-translate-y-0.5 hover:border-bone/30 hover:shadow-soft ${className}`}
      >
        Sign in
      </Link>
    )
  }

  const links = [
    { to: '/wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
    { to: '/compare', label: 'Comparison', icon: Scale, count: compare.length },
    { to: '/test-drive', label: 'Book a test drive', icon: CalendarCheck },
  ]

  return (
    <div {...rootProps} className={`relative ${className}`}>
      <button
        type="button"
        {...buttonProps}
        className={`relative grid size-10 place-items-center rounded-full p-0.5 transition duration-300 hover:-translate-y-0.5 hover:shadow-glow ${open ? 'ring-2 ring-gold-400/50' : ''}`}
      >
        <Avatar name={user.name} className="size-full text-xs" />
        <span className="sr-only">{`Account menu for ${user.name}${saved ? `, ${saved} saved` : ''}`}</span>
        <AnimatePresence>
          {saved > 0 && (
            <motion.span
              key={saved}
              aria-hidden="true"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 22 }}
              className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[0.65rem] leading-5 font-bold text-on-accent ring-2 ring-ink-900"
            >
              {saved}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full right-0 z-10 w-[17.5rem] origin-top-right pt-3"
          >
            <div className="overflow-hidden rounded-[1.5rem] border border-ink-700/60 bg-ink-900 shadow-lift">
              <div className="flex items-center gap-3 border-b border-ink-700/60 bg-gradient-to-r from-gold-200/40 to-volt-soft/40 p-4">
                <Avatar name={user.name} className="size-11 text-sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-bone">{user.name}</p>
                  <p className="truncate text-xs text-mist">{user.email}</p>
                </div>
              </div>
              <ul className="p-2">
                {links.map(({ to, label, icon: Icon, count }) => (
                  <li key={to}>
                    <Link to={to} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-mist transition hover:bg-ink-850 hover:text-bone">
                      <Icon className="size-4 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-gold-500" />
                      <span className="flex-1">{label}</span>
                      {count > 0 && <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[0.65rem] font-bold text-on-accent">{count}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-ink-700/60 p-2">
                <button
                  type="button"
                  onClick={signOut}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ember transition hover:bg-ember/8"
                >
                  <LogOut className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
