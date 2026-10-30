import { useEffect } from 'react'
import { Link, useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '../layout/Logo'
import { AuthFormSkeleton, RouteProgress } from '../ui/Skeleton'
import { AuthShowcase, AuthShowcaseCompact } from './AuthShowcase'
import { EASE } from './authUi'
import { siteMeta } from '../../data/site'
import { usePageSkeleton } from '../../hooks/usePageSkeleton'

const titles = {
  '/login': 'Sign in',
  '/signup': 'Create account',
  '/forgot-password': 'Forgot password',
  '/reset-password': 'Reset password',
}

function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="mesh-glow absolute inset-0" />
      <motion.div
        className="absolute -top-24 right-[-10%] size-[26rem] rounded-full bg-gold-400/15 blur-3xl"
        animate={{ x: [0, -40, 20, 0], y: [0, 30, -20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-8rem] left-[30%] size-[24rem] rounded-full bg-volt/12 blur-3xl"
        animate={{ x: [0, 50, -30, 0], y: [0, -30, 10, 0], scale: [1, 0.92, 1.08, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function ModeSwitch({ mode, search }) {
  const tabs = [
    { id: 'login', to: '/login', label: 'Sign in' },
    { id: 'signup', to: '/signup', label: 'Create account' },
  ]
  return (
    <nav aria-label="Account" className="relative grid grid-cols-2 rounded-full border border-ink-700/60 bg-ink-850/80 p-1 shadow-soft backdrop-blur">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          to={`${tab.to}${search}`}
          aria-current={mode === tab.id ? 'page' : undefined}
          className={`relative rounded-full px-2 py-2.5 text-center text-sm font-semibold transition-colors duration-300 ${mode === tab.id ? 'text-bone' : 'text-mist hover:text-bone'}`}
        >
          {mode === tab.id && (
            <motion.span layoutId="auth-mode" className="absolute inset-0 rounded-full bg-ink-900 shadow-soft" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
          )}
          <span className="relative">{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export function AuthLayout() {
  const outlet = useOutlet()
  const { search } = useLocation()
  const { showSkeleton, pathname } = usePageSkeleton(500)
  const mode = pathname === '/login' ? 'login' : pathname === '/signup' ? 'signup' : null
  const carry = new URLSearchParams(search).get('redirect')
  const switchSearch = carry ? `?redirect=${encodeURIComponent(carry)}` : ''

  useEffect(() => {
    document.title = `${titles[pathname] ?? 'Account'} — ${siteMeta.name}`
  }, [pathname])

  return (
    <div className="relative isolate min-h-dvh overflow-x-clip bg-ink-950 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {showSkeleton && <RouteProgress />}
      <Backdrop />
      <AuthShowcase />

      <main className="flex min-h-dvh min-w-0 flex-col px-5 pt-5 pb-8 sm:px-8 sm:pt-7 lg:px-12 lg:py-8 xl:px-20">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col sm:max-w-lg lg:max-w-md">
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center"
          >
            <Logo />
          </motion.header>

          <div className="mt-8 lg:hidden">
            <AuthShowcaseCompact />
          </div>

          <div className="mt-10 sm:mt-12 lg:mt-auto lg:pt-14">
            <AnimatePresence mode="wait" initial={false}>
              {mode ? (
                <motion.div key="switch" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <ModeSwitch mode={mode} search={switchSearch} />
                </motion.div>
              ) : (
                <motion.div key="back" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.3 }}>
                  <Link to="/login" className="group inline-flex items-center gap-2 text-sm font-semibold text-mist transition hover:text-bone">
                    <span className="grid size-8 place-items-center rounded-full border border-ink-700/70 bg-ink-900 transition group-hover:-translate-x-0.5 group-hover:border-bone">
                      <ArrowLeft className="size-4" />
                    </span>
                    Back to sign in
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="py-8 lg:mb-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={showSkeleton ? 'skeleton' : pathname}
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {showSkeleton ? <AuthFormSkeleton /> : outlet}
              </motion.div>
            </AnimatePresence>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-ink-700/50 pt-5 text-xs text-smoke">
            <span>
              © {new Date().getFullYear()} {siteMeta.legalName}
            </span>
            <span className="flex gap-4">
              <Link to="/privacy" className="link-underline hover:text-bone">
                Privacy
              </Link>
              <Link to="/terms" className="link-underline hover:text-bone">
                Terms
              </Link>
            </span>
          </footer>
        </div>
      </main>
    </div>
  )
}
