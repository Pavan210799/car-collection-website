import { ArrowUp } from 'lucide-react'
import { Container } from '../ui/Container'
import { Logo } from './Logo'
import { siteMeta } from '../../data/site'

/** Slim closing bar. The full footer (with About, Contact and FAQ) ships with the next milestone. */
export function SiteEnd() {
  return (
    <div className="border-t border-white/[0.07] bg-ink-950 pb-24 sm:pb-0">
      <Container className="flex flex-col items-center justify-between gap-5 py-8 sm:flex-row">
        <Logo />
        <p className="text-center text-xs text-smoke">
          © {new Date().getFullYear()} {siteMeta.legalName} Photography courtesy of Unsplash creators.
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-mist transition hover:border-gold-400/50 hover:text-bone"
        >
          Back to top
          <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </Container>
    </div>
  )
}
