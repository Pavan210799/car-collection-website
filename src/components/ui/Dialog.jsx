import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'

const panelVariants = {
  center: {
    wrapper: 'items-end justify-center sm:items-center p-0 sm:p-6',
    panel: 'w-full max-w-2xl max-h-[92dvh] rounded-t-3xl sm:rounded-3xl',
    motion: {
      initial: { opacity: 0, y: 60, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 40, scale: 0.98 },
    },
  },
  right: {
    wrapper: 'justify-end',
    panel: 'h-dvh w-full max-w-md rounded-none sm:rounded-l-3xl',
    motion: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
  },
  left: {
    wrapper: 'justify-start',
    panel: 'h-dvh w-[min(24rem,90vw)] rounded-r-3xl',
    motion: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
  },
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

export function Dialog({ open, onClose, title, description, side = 'center', className = '', children, footer }) {
  const titleId = useId()
  const panelRef = useRef(null)
  const config = panelVariants[side]
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return undefined
    const previouslyFocused = document.activeElement
    const focusTimer = setTimeout(() => {
      const first = panelRef.current?.querySelector(FOCUSABLE)
      ;(first ?? panelRef.current)?.focus({ preventScroll: true })
    }, 60)

    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !panelRef.current) return
      const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)]
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={`fixed inset-0 z-[70] flex ${config.wrapper}`}>
          <motion.div
            className="absolute inset-0 bg-bone/35 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            {...config.motion}
            transition={{ type: 'spring', stiffness: 300, damping: 34 }}
            className={`relative flex flex-col overflow-hidden border border-ink-700/60 bg-ink-900 shadow-lift outline-none ${config.panel} ${className}`}
          >
            {title && (
              <div className="flex items-start justify-between gap-4 border-b border-ink-700/40 px-5 py-4 sm:px-7 sm:py-5">
                <div className="min-w-0">
                  <h2 id={titleId} className="font-display text-lg font-bold text-bone sm:text-xl">
                    {title}
                  </h2>
                  {description && <p className="mt-1 text-sm text-mist">{description}</p>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-ink-700/45 text-mist transition hover:rotate-90 hover:border-ink-700/60 hover:text-bone"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer && <div className="border-t border-ink-700/40 px-5 py-4 sm:px-7">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
