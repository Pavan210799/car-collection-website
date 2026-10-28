import { Link } from 'react-router-dom'

export function Logo({ className = '', onClick }) {
  return (
    <Link to="/" onClick={onClick} aria-label="Veloce — home" className={`group inline-flex min-w-0 items-center gap-2.5 xs:gap-3 ${className}`}>
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl border border-gold-400/40 bg-gradient-to-br from-gold-300/20 to-transparent">
        <svg viewBox="0 0 64 64" className="size-5 transition-transform duration-700 ease-premium group-hover:scale-110" aria-hidden="true">
          <path d="M10 14h11l11 26 11-26h11L37 52h-10z" fill="currentColor" className="text-gold-400" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold tracking-[0.18em] text-bone xs:tracking-[0.28em]">VELOCE</span>
        <span className="mt-1 text-[0.55rem] font-semibold tracking-[0.3em] whitespace-nowrap text-mist uppercase xs:tracking-[0.42em]">The Collection</span>
      </span>
    </Link>
  )
}
