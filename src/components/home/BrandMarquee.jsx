import { Link } from 'react-router-dom'
import { brands } from '../../data/brands'

function Row({ items, reverse = false }) {
  const row = [...items, ...items]
  return (
    <div className="group flex overflow-hidden">
      <ul className={`flex shrink-0 items-center ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} group-hover:[animation-play-state:paused]`}>
        {row.map((brand, index) => (
          <li key={`${brand.slug}-${index}`} aria-hidden={index >= items.length} className="flex items-center">
            <Link
              to={`/collection?brand=${brand.slug}`}
              tabIndex={index >= items.length ? -1 : 0}
              className={`px-5 font-display text-2xl font-extrabold tracking-tight whitespace-nowrap uppercase transition-colors duration-300 sm:px-8 sm:text-4xl ${
                index % 2 ? 'text-outline hover:text-gold-400' : 'text-bone/80 hover:text-gold-500'
              }`}
            >
              {brand.name}
            </Link>
            <span className="size-2 rotate-45 rounded-[2px] bg-gold-400" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function BrandMarquee() {
  const half = Math.ceil(brands.length / 2)
  return (
    <section aria-label="Marques in the collection" className="relative space-y-3 border-y border-ink-700/60 bg-ink-900 py-6 sm:space-y-4 sm:py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-ink-900 to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-ink-900 to-transparent sm:w-32" />
      <Row items={brands.slice(0, half)} />
      <Row items={brands.slice(half)} reverse />
    </section>
  )
}
