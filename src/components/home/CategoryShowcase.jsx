import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Img } from '../ui/Img'
import { categories } from '../../data/categories'
import { cars, carsById } from '../../data/cars'
import { pluralize } from '../../lib/format'

const tiles = categories
  .map((category) => {
    const image = carsById.get(category.cover)?.images?.[0] ?? cars.find((car) => car.category === category.slug)?.images?.[0]
    return image ? { ...category, image, count: cars.filter((car) => car.category === category.slug).length } : null
  })
  .filter(Boolean)

const layout = [
  'md:col-span-2 lg:col-span-2 lg:row-span-2',
  '',
  '',
  '',
  '',
  'lg:col-span-2',
  'lg:col-span-2',
]

export function CategoryShowcase() {
  return (
    <section className="relative isolate overflow-hidden border-y border-ink-700/60 bg-ink-900 py-20 sm:py-28">
      <div aria-hidden="true" className="line-grid absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <Container>
        <SectionHeading
          eyebrow="Disciplines"
          title="Every way to go fast"
          description="From thousand-horsepower hypercars to silent electric rockets — pick the kind of thrill you’re after."
        />

        <div className="mt-12 grid auto-rows-[15rem] gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[14rem] xl:auto-rows-[16rem]">
          {tiles.map((category, index) => {
            const feature = index === 0
            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.75, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className={`min-w-0 ${layout[index] ?? ''}`}
              >
                <Link
                  to={`/collection?category=${category.slug}`}
                  className="spotlight group relative isolate flex size-full flex-col justify-end overflow-hidden rounded-[1.75rem] bg-ink-800 p-5 shadow-soft transition-shadow duration-500 hover:shadow-lift sm:p-6"
                >
                  <Img
                    src={category.image.src}
                    alt={category.image.alt}
                    sizes={feature ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw'}
                    position={category.image.position}
                    className="absolute inset-0 -z-10"
                    imgClassName="transition-transform duration-[1.6s] ease-premium group-hover:scale-110"
                  />
                  <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                  <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-bold tracking-[0.16em] text-bone uppercase backdrop-blur-md">
                    {pluralize(category.count, 'car')}
                  </span>
                  <span className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/90 text-bone backdrop-blur-md transition duration-500 ease-premium group-hover:rotate-45 group-hover:bg-gold-400 group-hover:text-on-accent">
                    <ArrowUpRight className="size-4" />
                  </span>

                  <div className="min-w-0 text-white">
                    <h3 className={`font-display leading-tight font-bold break-words ${feature ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{category.name}</h3>
                    <p className="mt-1 text-sm text-white/80">{category.tagline}</p>
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-premium group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                      <p className={`overflow-hidden text-sm leading-relaxed text-white/75 ${feature ? 'max-w-md' : 'line-clamp-3'}`}>
                        <span className="block pt-2">{category.description}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
