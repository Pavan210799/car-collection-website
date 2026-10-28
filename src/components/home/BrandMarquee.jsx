import { Link } from 'react-router-dom'
import { brands } from '../../data/brands'

export function BrandMarquee() {
  const row = [...brands, ...brands]
  return (
    <section aria-label="Marques in the collection" className="relative border-y border-white/[0.07] bg-ink-950 py-7 sm:py-9">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink-950 to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink-950 to-transparent sm:w-40" />
      <div className="group flex overflow-hidden">
        <ul className="flex shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]">
          {row.map((brand, index) => (
            <li key={`${brand.slug}-${index}`} aria-hidden={index >= brands.length} className="flex items-center">
              <Link
                to={`/collection?brand=${brand.slug}`}
                tabIndex={index >= brands.length ? -1 : 0}
                className="px-6 font-display text-xl font-bold tracking-[0.2em] whitespace-nowrap text-bone/35 uppercase transition-colors duration-300 hover:text-gold-300 sm:px-10 sm:text-2xl"
              >
                {brand.name}
              </Link>
              <span className="size-1.5 rotate-45 bg-gold-500/50" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
