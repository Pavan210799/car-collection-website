import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Img } from '../components/ui/Img'
import { brands } from '../data/brands'
import { categories } from '../data/categories'
import { cars, carsById } from '../data/cars'
import { formatCompactPrice, pluralize } from '../lib/format'

const brandCards = brands.map((brand) => {
  const lineup = cars.filter((car) => car.brand === brand.slug)
  return {
    ...brand,
    count: lineup.length,
    from: Math.min(...lineup.map((car) => car.price)),
    image: carsById.get(brand.signature).images[0],
  }
})

const categoryCards = categories.map((category) => ({
  ...category,
  count: cars.filter((car) => car.category === category.slug).length,
  image: carsById.get(category.cover).images[0],
}))

export default function Brands() {
  return (
    <>
      <PageHeader
        eyebrow="Brands & categories"
        title="Legendary marques"
        description={`${brands.length} of the world’s most storied manufacturers, from Maranello to Molsheim. Choose a marque or a category to explore its cars.`}
        image={carsById.get('lamborghini-aventador-svj').images[0]}
      />

      <Container as="section" className="pb-20">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {brandCards.map((brand, index) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0"
            >
              <Link
                to={`/collection?brand=${brand.slug}`}
                className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/[0.07] p-6 transition duration-500 hover:border-gold-400/40 sm:aspect-[3/4]"
              >
                <Img
                  src={brand.image.src}
                  alt={brand.image.alt}
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  position={brand.image.position}
                  className="absolute inset-0 -z-10"
                  imgClassName="scale-105 grayscale-[60%] transition duration-[1.2s] ease-premium group-hover:scale-100 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/80 via-ink-950/30 to-ink-950/95 transition-opacity duration-700 group-hover:opacity-80" />

                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.2em] text-mist uppercase backdrop-blur">
                    {brand.country}
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/20 text-bone transition duration-500 group-hover:rotate-45 group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-ink-950">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>

                <div>
                  <p className="text-[0.65rem] font-semibold tracking-[0.25em] text-gold-400 uppercase">Est. {brand.founded}</p>
                  <h2 className="mt-2 font-display text-[clamp(1.35rem,6.5vw,1.65rem)] leading-tight font-bold tracking-wide break-words text-bone uppercase">{brand.name}</h2>
                  <p className="mt-1 text-sm text-mist italic">“{brand.tagline}”</p>
                  <div className="mt-4 grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-premium group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                    <p className="overflow-hidden text-sm leading-relaxed text-mist">{brand.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4 text-xs">
                    <span className="font-semibold text-bone">{pluralize(brand.count, 'car')}</span>
                    <span className="text-mist">From {formatCompactPrice(brand.from)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>

      <section className="border-t border-white/[0.07] py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Categories" title="Choose your discipline" description="Every car in the collection belongs to a category built around how you want to drive." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryCards.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`min-w-0 ${index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}`}
              >
                <Link
                  to={`/collection?category=${category.slug}`}
                  className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-[1.75rem] border border-white/[0.07] p-6 transition hover:border-gold-400/40 sm:h-80 sm:p-8"
                >
                  <Img
                    src={category.image.src}
                    alt={category.image.alt}
                    sizes={index === 0 ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
                    position={category.image.position}
                    className="absolute inset-0 -z-10"
                    imgClassName="transition-transform duration-[1.4s] ease-premium group-hover:scale-110"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                  <p className="eyebrow">{pluralize(category.count, 'car')}</p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-bold text-bone sm:text-3xl">{category.name}</h3>
                      <p className="mt-1 text-sm text-mist">{category.tagline}</p>
                    </div>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 text-bone transition duration-500 group-hover:rotate-45 group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-ink-950">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
