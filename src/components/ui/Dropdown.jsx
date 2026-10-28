import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'

export function Dropdown({ label, value, options, onChange, icon: Icon, align = 'right', className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const listId = useId()
  const current = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return undefined
    const onPointer = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false)
    }
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onListKey = (event) => {
    const buttons = [...event.currentTarget.querySelectorAll('button')]
    const position = buttons.indexOf(document.activeElement)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      buttons[(position + 1) % buttons.length]?.focus()
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      buttons[(position - 1 + buttons.length) % buttons.length]?.focus()
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className="flex h-11 w-full items-center gap-2 rounded-full border border-white/10 bg-ink-900 px-4 text-sm text-bone transition hover:border-white/25"
      >
        {Icon && <Icon className="size-4 shrink-0 text-gold-400" />}
        <span className="hidden shrink-0 text-mist sm:inline">{label}:</span>
        <span className="min-w-0 flex-1 truncate text-left font-semibold">{current.label}</span>
        <ChevronDown className={`size-4 shrink-0 text-mist transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            onKeyDown={onListKey}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-[calc(100%+0.5rem)] z-30 w-64 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-white/10 bg-ink-850 p-1.5 shadow-2xl shadow-black/60 ${
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
            }`}
          >
            {options.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  autoFocus={option.value === value}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition outline-none focus-visible:bg-white/[0.07] ${
                    option.value === value ? 'bg-gold-400/10 text-gold-200' : 'text-mist hover:bg-white/[0.05] hover:text-bone'
                  }`}
                >
                  {option.label}
                  {option.value === value && <Check className="size-4" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
