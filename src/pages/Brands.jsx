import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Building2, CalendarDays, MapPin } from 'lucide-react'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Img } from '../components/ui/Img'
import { Button } from '../components/ui/Button'
import { brands } from '../data/brands'
import { categories } from '../data/categories'
import { cars, carsById } from '../data/cars'
import { formatCompactPrice, pluralize } from '../lib/format'
import { useScrollEdges } from '../hooks/useScrollEdges'

const EASE = [0.22, 1, 0.36, 1]

const marques = brands
  .map((brand) => {
    const lineup = cars.filter((car) => car.brand === brand.slug)
    const signature = carsById.get(brand.signature) ?? lineup[0]
    if (!signature) return null
    return {
      ...brand,
      lineup,
      count: lineup.length,
      from: lineup.length ? Math.min(...lineup.map((car) => car.price)) : signature.price,
      image: signature.heroImage ?? signature.images[0],
    }
  })
  .filter(Boolean)

const countries = ['All', ...new Set(marques.map((brand) => brand.country))]

const disciplines = categories
  .map((category) => {
    const image = carsById.get(category.cover)?.images?.[0]
    return image ? { ...category, image, count: cars.filter((car) => car.category === category.slug).length } : null
  })
  .filter(Boolean)

function AtlasPreview({ brand }) {
  return (
    <div className="spotlight hover-panel overflow-hidden rounded-[2rem] border border-ink-700/60 bg-ink-900 shadow-lift">
      <div className="hover-zoom relative aspect-[4/3] overflow-hidden bg-ink-800">
        <AnimatePresence initial={false}>
          <motion.div
            key={brand.slug}
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0, transition: { delay: 0.7, duration: 0.2 } }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0"
          >
            <motion.div initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: EASE }} className="absolute inset-0">
              <Img src={brand.image.src} alt={brand.image.alt} sizes="(min-width: 1024px) 40vw, 100vw" position={brand.image.position} className="absolute inset-0" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
          <AnimatePresence mode="wait">
            <motion.div key={brand.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="min-w-0">
              <p className="text-[0.65rem] font-semibold tracking-[0.3em] text-white/75 uppercase">{brand.tier}</p>
              <p className="mt-1 truncate font-display text-3xl font-extrabold">{brand.name}</p>
            </motion.div>
          </AnimatePresence>
          <span className="shrink-0 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-bone">{pluralize(brand.count, 'car')}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={brand.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="p-6">
          <p className="font-display text-lg font-semibold text-gold-500 italic">“{brand.tagline}”</p>
          <p className="mt-2 text-sm leading-relaxed text-mist">{brand.description}</p>
          <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-ink-700/60 py-4 text-xs">
            {[
              { icon: CalendarDays, label: 'Founded', value: brand.founded },
              { icon: Building2, label: 'Home', value: brand.headquarters },
              { icon: MapPin, label: 'From', value: formatCompactPrice(brand.from) },
            ].map((item) => (
              <div key={item.label} className="min-w-0">
                <dt className="flex items-center gap-1 text-smoke">
                  <item.icon className="size-3 shrink-0 text-volt" /> {item.label}
                </dt>
                <dd className="mt-1 truncate font-semibold text-bone">{item.value}</dd>
              </div>
            ))}
          </dl>
          {brand.lineup.length > 0 && (
            <ul className="mt-4 grid grid-cols-3 gap-2">
              {brand.lineup.slice(0, 3).map((car) => (
                <li key={car.id} className="min-w-0">
                  <Link to={`/cars/${car.slug}`} className="group block">
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-ink-800">
                      <Img src={car.images[0].src} alt={car.images[0].alt} sizes="140px" position={car.images[0].position} className="absolute inset-0" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                    </span>
                    <span className="mt-1.5 block truncate text-xs font-semibold text-bone group-hover:text-gold-500">{car.model}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Button to={`/collection?brand=${brand.slug}`} variant="dark" className="mt-5 w-full">
            Explore {brand.short || brand.name} <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function MarqueCard({ brand, index }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.55, delay: Math.min(index, 6) * 0.05, ease: EASE }}
      className="min-w-0"
    >
      <Link
        to={`/collection?brand=${brand.slug}`}
        className="spotlight group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink-700/60 bg-ink-900 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift"
      >
        <div className="relative m-2 aspect-[16/10] overflow-hidden rounded-[1.35rem] bg-ink-800">
          <Img src={brand.image.src} alt={brand.image.alt} sizes="(min-width: 640px) 50vw, 100vw" position={brand.image.position} className="absolute inset-0" imgClassName="transition-transform duration-[1.4s] ease-premium group-hover:scale-[1.07]" />
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[0.6rem] font-bold tracking-[0.18em] text-bone uppercase backdrop-blur">{brand.country}</span>
          <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 text-bone transition duration-500 group-hover:rotate-45 group-hover:bg-gold-400 group-hover:text-on-accent">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <div className="flex flex-1 flex-col px-5 pt-2 pb-5">
          <p className="text-[0.65rem] font-semibold tracking-[0.25em] text-volt uppercase">
            Est. {brand.founded} · {brand.tier}
          </p>
          <h2 className="mt-1.5 font-display text-2xl font-extrabold break-words text-bone">{brand.name}</h2>
          <p className="mt-1 text-sm text-gold-500 italic">“{brand.tagline}”</p>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mist">{brand.description}</p>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-700/60 pt-4 text-xs">
            <span className="font-semibold text-bone">{pluralize(brand.count, 'car')}</span>
            <span className="text-mist">From {formatCompactPrice(brand.from)}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function Brands() {
  const [country, setCountry] = useState('All')
  const [activeSlug, setActiveSlug] = useState(marques[0]?.slug)
  const railRef = useRef(null)
  const railEdges = useScrollEdges(railRef)

  const visible = useMemo(() => (country === 'All' ? marques : marques.filter((brand) => brand.country === country)), [country])
  const active = visible.find((brand) => brand.slug === activeSlug) ?? visible[0]

  const scrollRail = (direction) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.querySelector('[data-card]')
    rail.scrollBy({ left: direction * ((card?.offsetWidth ?? 300) + 16), behavior: 'smooth' })
  }

  return (
    <>
      <header className="relative isolate overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-14">
        <div aria-hidden="true" className="mesh-glow absolute inset-0 -z-10" />
        <div aria-hidden="true" className="line-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end">
            <div className="min-w-0">
              <motion.p initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: EASE }} className="eyebrow flex items-center gap-3">
                <span className="h-px w-8 bg-gold-400" /> Brands & categories
              </motion.p>
              <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] font-extrabold tracking-tight text-bone">
                <span className="block overflow-hidden pb-[0.06em]">
                  <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: EASE }}>
                    The marque
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-[0.06em]">
                  <motion.span className="text-gradient-gold block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}>
                    atlas.
                  </motion.span>
                </span>
              </h1>
            </div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: EASE }} className="min-w-0">
              <p className="text-base leading-relaxed text-mist sm:text-lg">
                {marques.length} storied manufacturers from {countries.length - 1} countries — from Maranello to Molsheim. <span className="lg:hidden">Tap a marque to explore its line-up.</span>
                <span className="hidden lg:inline">Hover a marque to preview its signature car.</span>
              </p>
              <dl className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'Marques', value: marques.length },
                  { label: 'Countries', value: countries.length - 1 },
                  { label: 'Cars', value: cars.length },
                ].map((stat) => (
                  <div key={stat.label} className="spotlight hover-lift flex min-w-0 flex-col-reverse rounded-2xl border border-ink-700/60 bg-ink-900 px-1.5 py-3 text-center shadow-soft sm:p-4">
                    <dt className="text-[0.6rem] font-semibold tracking-[0.08em] text-smoke uppercase xs:text-[0.65rem] xs:tracking-[0.18em]">{stat.label}</dt>
                    <dd className="font-display text-2xl font-bold text-bone sm:text-3xl">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>

          <LayoutGroup>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
              role="tablist"
              aria-label="Filter by country"
              className="mt-10 flex flex-wrap gap-2"
            >
              {countries.map((item) => {
                const selected = country === item
                const count = item === 'All' ? marques.length : marques.filter((brand) => brand.country === item).length
                return (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setCountry(item)}
                    className={`relative rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                      selected ? 'border-bone text-on-accent' : 'border-ink-700/70 bg-ink-900 text-mist hover:border-bone/40 hover:text-bone'
                    }`}
                  >
                    {selected && <motion.span layoutId="country-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    <span className="relative">
                      {item} <span className={selected ? 'text-white/60' : 'text-smoke'}>{count}</span>
                    </span>
                  </button>
                )
              })}
            </motion.div>
          </LayoutGroup>
        </Container>
      </header>

      <Container as="section" aria-label="Marques" className="pb-20 sm:pb-28">
        <div className="hidden gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] xl:gap-16">
          <ol className="min-w-0 border-t border-ink-700/60">
            <AnimatePresence initial={false}>
              {visible.map((brand, index) => {
                const isActive = active?.slug === brand.slug
                return (
                  <motion.li
                    key={brand.slug}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.45, delay: Math.min(index, 10) * 0.03, ease: EASE }}
                    className="border-b border-ink-700/60"
                  >
                    <Link
                      to={`/collection?brand=${brand.slug}`}
                      onMouseEnter={() => setActiveSlug(brand.slug)}
                      onFocus={() => setActiveSlug(brand.slug)}
                      className="group relative isolate flex items-center gap-5 py-5 outline-none"
                    >
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-y-0 -left-4 -right-4 -z-10 rounded-2xl bg-ink-900 shadow-soft"
                        initial={false}
                        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.98 }}
                        transition={{ duration: 0.35 }}
                      />
                      <span className={`w-8 shrink-0 font-display text-sm font-bold tabular-nums transition-colors ${isActive ? 'text-gold-400' : 'text-smoke'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate font-display text-[clamp(1.5rem,2.4vw,2.25rem)] leading-tight font-extrabold tracking-tight transition-all duration-500 ease-premium ${isActive ? 'translate-x-2 text-bone' : 'text-bone/55'}`}>
                          {brand.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-smoke">
                          {brand.country} · Est. {brand.founded} · {brand.tier}
                        </span>
                      </span>
                      <span className="hidden shrink-0 text-sm font-semibold text-mist xl:block">{pluralize(brand.count, 'car')}</span>
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full border transition duration-500 ease-premium ${
                          isActive ? 'rotate-45 border-gold-400 bg-gold-400 text-on-accent' : 'border-ink-700/70 text-bone'
                        }`}
                      >
                        <ArrowUpRight className="size-4" />
                      </span>
                    </Link>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ol>

          <div className="min-w-0">
            <div className="sticky top-24">{active && <AtlasPreview brand={active} />}</div>
          </div>
        </div>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((brand, index) => (
              <MarqueCard key={brand.slug} brand={brand} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>

      <section className="border-t border-ink-700/60 bg-ink-900 py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Categories"
            title="Choose your discipline"
            description="Every car in the collection belongs to a category built around how you want to drive."
            action={
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollRail(-1)}
                  disabled={!railEdges.start}
                  aria-label="Previous categories"
                  className="grid size-11 place-items-center rounded-full border border-ink-700/70 bg-ink-900 text-bone transition duration-300 hover:-translate-y-0.5 hover:border-bone hover:shadow-soft disabled:pointer-events-none disabled:opacity-35"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail(1)}
                  disabled={!railEdges.end}
                  aria-label="Next categories"
                  className="grid size-11 place-items-center rounded-full bg-bone text-on-accent transition duration-300 hover:-translate-y-0.5 hover:bg-night hover:shadow-soft disabled:pointer-events-none disabled:opacity-35"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            }
          />

          <motion.div
            ref={railRef}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="no-scrollbar -mx-5 mt-8 flex scroll-px-5 snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pt-2 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-12 lg:scroll-px-12 lg:px-12"
          >
            {disciplines.map((category, index) => (
              <motion.div
                key={category.slug}
                data-card
                variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                className="w-[82%] shrink-0 snap-start xs:w-[68%] sm:w-[calc((100%-2rem)/2.35)] lg:w-[calc((100%-3rem)/3.3)] xl:w-[calc((100%-4rem)/4.3)]"
              >
                <Link
                  to={`/collection?category=${category.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink-700/60 bg-ink-950 transition duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative m-2 aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-ink-800">
                    <Img src={category.image.src} alt={category.image.alt} sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 85vw" position={category.image.position} className="absolute inset-0" imgClassName="transition-transform duration-[1.6s] ease-premium group-hover:scale-110" />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <span className="absolute top-4 left-4 font-display text-sm font-bold text-white/90">{String(index + 1).padStart(2, '0')}</span>
                    <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[0.6rem] font-bold tracking-[0.16em] text-bone uppercase">{pluralize(category.count, 'car')}</span>
                    <div className="absolute inset-x-4 bottom-4 text-white">
                      <h3 className="font-display text-2xl font-bold break-words">{category.name}</h3>
                      <p className="mt-0.5 text-sm text-white/80">{category.tagline}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-3 px-5 pt-2 pb-5">
                    <p className="line-clamp-3 text-sm leading-relaxed text-mist">{category.description}</p>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-ink-700/70 text-bone transition duration-500 group-hover:rotate-45 group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-on-accent">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>
    </>
  )
}
