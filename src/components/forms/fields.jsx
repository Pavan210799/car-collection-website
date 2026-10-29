import { useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, ChevronDown } from 'lucide-react'

const control =
  'w-full rounded-2xl border bg-ink-850 px-4 text-sm text-bone transition duration-300 outline-none placeholder:text-smoke hover:border-ink-700/55 focus:border-gold-400 focus:bg-ink-800 focus:shadow-[0_0_0_4px_rgba(217,183,126,0.12)]'

function ErrorText({ id, error }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-1.5 overflow-hidden pt-1.5 text-xs font-medium text-ember"
        >
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

export function Field({ label, error, hint, required, as = 'input', className = '', children, ...props }) {
  const id = useId()
  const errorId = `${id}-error`
  const border = error ? 'border-ember/70' : 'border-ink-700/45'
  const shared = {
    id,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
    required,
    ...props,
  }

  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-xs font-semibold tracking-[0.12em] text-mist uppercase">
        <span>
          {label}
          {required && <span className="text-gold-400"> *</span>}
        </span>
        {hint && <span className="font-normal tracking-normal text-smoke normal-case">{hint}</span>}
      </label>
      {as === 'textarea' && <textarea {...shared} rows={props.rows ?? 4} className={`${control} ${border} resize-none py-3.5`} />}
      {as === 'select' && (
        <div className="relative">
          <select {...shared} className={`${control} ${border} h-12 appearance-none pr-10`}>
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-mist" />
        </div>
      )}
      {as === 'input' && <input {...shared} className={`${control} ${border} h-12`} />}
      <ErrorText id={errorId} error={error} />
    </div>
  )
}

export function Checkbox({ checked, onChange, error, children, name }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-3">
        <input id={id} name={name} type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span
          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition peer-focus-visible:ring-2 peer-focus-visible:ring-gold-400 ${
            checked ? 'border-gold-400 bg-gold-400 text-on-accent' : error ? 'border-ember/70' : 'border-ink-700/55 group-hover:border-ink-600'
          }`}
        >
          <Check className={`size-3.5 transition-transform ${checked ? 'scale-100' : 'scale-0'}`} strokeWidth={3} />
        </span>
        <span className="text-sm leading-relaxed text-mist">{children}</span>
      </label>
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  )
}

export function ChoiceGroup({ label, options, value, onChange, error, columns = 'grid-cols-3' }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-xs font-semibold tracking-[0.12em] text-mist uppercase">{label}</legend>
      <div className={`grid gap-2 ${columns}`}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`min-h-11 min-w-0 rounded-xl border px-1.5 text-xs font-semibold break-words transition xs:px-3 xs:text-sm ${
              value === option ? 'border-gold-400 bg-gold-400/10 text-gold-500' : 'border-ink-700/60 bg-ink-900 text-mist hover:border-ink-600 hover:text-bone'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <ErrorText error={error} />
    </fieldset>
  )
}
