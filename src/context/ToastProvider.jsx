import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { ToastContext } from './contexts'

const icons = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
  }, [])

  const notify = useCallback(
    ({ title, description, tone = 'success', action, duration = 3600 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((current) => [...current.slice(-2), { id, title, description, tone, action }])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration),
      )
      return id
    },
    [dismiss],
  )

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-20 z-[80] flex flex-col items-center gap-2 px-4 sm:top-auto sm:right-6 sm:bottom-6 sm:left-auto sm:items-end"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const Icon = icons[toast.tone] ?? Info
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-ink-900/85 p-4 shadow-2xl shadow-black/50"
              >
                <Icon
                  className={`mt-0.5 size-5 shrink-0 ${toast.tone === 'warning' ? 'text-ember' : 'text-gold-400'}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-bone">{toast.title}</p>
                  {toast.description && <p className="mt-0.5 text-xs leading-relaxed text-mist">{toast.description}</p>}
                  {toast.action && (
                    <Link
                      to={toast.action.to}
                      onClick={() => dismiss(toast.id)}
                      className="mt-2 inline-block text-xs font-semibold tracking-wide text-gold-400 underline-offset-4 hover:underline"
                    >
                      {toast.action.label}
                    </Link>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="rounded-full p-1 text-mist transition hover:bg-white/10 hover:text-bone"
                >
                  <X className="size-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
