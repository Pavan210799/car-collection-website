import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Eye, EyeOff, Loader2 } from 'lucide-react'
import { ErrorText } from '../forms/fields'
import { passwordChecks, passwordStrength } from '../../lib/auth'

export const EASE = [0.22, 1, 0.36, 1]

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

export const rise = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } },
}

export function AuthHeading({ eyebrow, title, accent, children }) {
  return (
    <div className="min-w-0">
      <motion.p variants={rise} className="eyebrow flex items-center gap-3">
        <span className="h-px w-8 bg-gold-400" />
        {eyebrow}
      </motion.p>
      <h1 className="mt-4 overflow-hidden pb-1 font-display text-[clamp(1.9rem,4.2vw,2.6rem)] leading-[1.08] font-extrabold tracking-tight break-words text-bone">
        <motion.span className="block" variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.8, ease: EASE } } }}>
          {title} <span className="text-gradient-animated">{accent}</span>
        </motion.span>
      </h1>
      {children && (
        <motion.p variants={rise} className="mt-3 text-[0.95rem] leading-relaxed text-pretty text-mist">
          {children}
        </motion.p>
      )}
    </div>
  )
}

export function AuthField({ label, icon: Icon, error, type = 'text', aside, className = '', onKeyUp, ...props }) {
  const id = useId()
  const errorId = `${id}-error`
  const [visible, setVisible] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const isPassword = type === 'password'

  return (
    <motion.div variants={rise} className={`min-w-0 ${className}`}>
      <div className="mb-2 flex min-h-5 flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <label htmlFor={id} className="text-xs font-semibold tracking-[0.12em] text-mist uppercase">
          {label}
        </label>
        <AnimatePresence initial={false}>
          {isPassword && capsLock && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-full bg-gold-200 px-2 py-0.5 text-[0.65rem] font-semibold text-gold-600"
            >
              Caps Lock is on
            </motion.span>
          )}
        </AnimatePresence>
        {aside}
      </div>
      <div className="group/field relative">
        <Icon className="pointer-events-none absolute top-1/2 left-4 size-[1.05rem] -translate-y-1/2 text-smoke transition-colors duration-300 group-focus-within/field:text-gold-400" />
        <input
          id={id}
          type={isPassword && visible ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onKeyUp={(event) => {
            if (isPassword) setCapsLock(event.getModifierState?.('CapsLock') ?? false)
            onKeyUp?.(event)
          }}
          className={`h-13 w-full min-w-0 rounded-2xl border bg-ink-900 pl-11 text-[0.95rem] text-bone shadow-soft transition duration-300 outline-none placeholder:text-smoke/80 hover:border-ink-600 focus:border-gold-400 focus:shadow-[0_0_0_4px_rgb(226_68_92_/_0.12)] ${
            isPassword ? 'pr-12' : 'pr-4'
          } ${error ? 'border-ember/70' : 'border-ink-700/70'}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-smoke transition hover:bg-ink-850 hover:text-bone"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={visible ? 'hide' : 'show'}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                className="grid place-items-center"
              >
                {visible ? <EyeOff className="size-[1.05rem]" /> : <Eye className="size-[1.05rem]" />}
              </motion.span>
            </AnimatePresence>
          </button>
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 -bottom-px h-px scale-x-0 bg-gradient-to-r from-transparent via-gold-400 to-transparent transition-transform duration-500 ease-premium group-focus-within/field:scale-x-100"
        />
      </div>
      <ErrorText id={errorId} error={error} />
    </motion.div>
  )
}

const levels = [
  { label: 'Too short', bar: 'bg-ember', text: 'text-ember' },
  { label: 'Weak', bar: 'bg-ember', text: 'text-ember' },
  { label: 'Fair', bar: 'bg-amber-500', text: 'text-amber-600' },
  { label: 'Strong', bar: 'bg-volt', text: 'text-volt' },
  { label: 'Excellent', bar: 'bg-volt', text: 'text-volt' },
]

export function PasswordMeter({ value = '' }) {
  const score = passwordStrength(value)
  const level = levels[score] ?? levels[0]
  return (
    <motion.div variants={rise} className="-mt-2 min-w-0" aria-live="polite">
      <div className="grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((bar) => (
          <span key={bar} className="h-1.5 overflow-hidden rounded-full bg-ink-800">
            <motion.span
              className={`block h-full origin-left rounded-full ${level.bar}`}
              initial={false}
              animate={{ scaleX: bar < score ? 1 : 0 }}
              transition={{ duration: 0.45, delay: bar * 0.05, ease: EASE }}
            />
          </span>
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <ul className="flex min-w-0 flex-wrap gap-x-3 gap-y-1.5">
          {passwordChecks.map((check) => {
            const ok = check.test(value)
            return (
              <li key={check.id} className={`inline-flex items-center gap-1.5 text-[0.7rem] font-medium transition-colors duration-300 ${ok ? 'text-volt' : 'text-smoke'}`}>
                <motion.span
                  initial={false}
                  animate={{ scale: ok ? 1 : 0.85 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className={`grid size-3.5 place-items-center rounded-full transition-colors duration-300 ${ok ? 'bg-volt text-white' : 'bg-ink-800'}`}
                >
                  {ok && <Check className="size-2.5" strokeWidth={3.5} />}
                </motion.span>
                {check.label}
              </li>
            )
          })}
        </ul>
        {value && <span className={`shrink-0 text-[0.7rem] font-bold tracking-wide uppercase ${level.text}`}>{level.label}</span>}
      </div>
    </motion.div>
  )
}

export function AuthSubmit({ status, children, loadingLabel = 'Please wait…', successLabel = 'Done' }) {
  const busy = status !== 'idle'
  return (
    <motion.button
      variants={rise}
      type="submit"
      disabled={busy}
      whileTap={busy ? undefined : { scale: 0.98 }}
      className={`group/btn relative isolate flex h-13 w-full items-center justify-center overflow-hidden rounded-full text-[0.95rem] font-semibold text-on-accent shadow-lift transition-colors duration-500 disabled:cursor-wait ${
        status === 'success' ? 'bg-volt' : 'bg-bone'
      }`}
    >
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-gold-400 via-gold-500 to-volt opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100 group-disabled/btn:opacity-0" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:animate-sweep"
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
          className="inline-flex items-center gap-2"
        >
          {status === 'loading' && (
            <>
              <Loader2 className="size-4 animate-spin" /> {loadingLabel}
            </>
          )}
          {status === 'success' && (
            <>
              <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 16 }}>
                <Check className="size-4" strokeWidth={3} />
              </motion.span>
              {successLabel}
            </>
          )}
          {status === 'idle' && (
            <>
              {children}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

export function StatusIcon({ icon: Icon, tone = 'gold' }) {
  const tones = {
    gold: 'bg-gold-400/12 text-gold-500 ring-gold-400/25',
    volt: 'bg-volt/10 text-volt ring-volt/25',
    ember: 'bg-ember/10 text-ember ring-ember/25',
  }
  return (
    <motion.div variants={rise} className="relative grid size-20 place-items-center">
      {[0, 1].map((ring) => (
        <motion.span
          key={ring}
          aria-hidden="true"
          className={`absolute inset-0 rounded-full ring-2 ${tones[tone]}`}
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 2.2, delay: ring * 1.1, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      <motion.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
        className={`relative grid size-20 place-items-center rounded-full ring-1 ${tones[tone]}`}
      >
        <Icon className="size-9" strokeWidth={1.6} />
      </motion.span>
    </motion.div>
  )
}
