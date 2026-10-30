import { Link } from 'react-router-dom'
import { siteMeta } from '../../data/site'

export function Logo({ className = '', taglineClassName = 'xs:block', onClick }) {
  return (
    <Link to="/" onClick={onClick} className={`group inline-flex min-w-0 items-center gap-2.5 xs:gap-3 ${className}`}>
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-bone shadow-soft">
        <svg viewBox="0 0 64 64" className="size-5 transition-transform duration-700 ease-premium group-hover:rotate-[135deg]" aria-hidden="true">
          <path d="M32 6 L54 32 L32 58 L10 32 Z" fill="none" stroke="currentColor" strokeWidth="3" className="text-white" />
          <path d="M32 16 L44 32 L32 48 L20 32 Z" fill="currentColor" className="text-gold-400" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-display text-lg font-extrabold tracking-[0.18em] text-bone xs:tracking-[0.24em]">{siteMeta.name.toUpperCase()}</span>
        <span className={`mt-1 hidden text-[0.55rem] font-semibold tracking-[0.3em] whitespace-nowrap text-smoke uppercase ${taglineClassName}`}>{siteMeta.tagline}</span>
      </span>
      <span className="sr-only">home</span>
    </Link>
  )
}
