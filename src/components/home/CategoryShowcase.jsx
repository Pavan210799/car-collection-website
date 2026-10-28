import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Img } from '../ui/Img'
import { categories } from '../../data/categories'
import { cars, carsById } from '../../data/cars'
import { pluralize } from '../../lib/format'

const withCounts = categories.map((category) => ({
  ...category,
  count: cars.filter((car) => car.category === category.slug).length,
  image: carsById.get(category.cover).images[0],
}))

export function CategoryShowcase() {
  const [active, setActive] = useState(0)

  return (
    <section className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Browse by category"
          title="Find your kind of thrill"
          description="From silent electric missiles to twelve-cylinder grand tourers — explore the collection by the way you love to drive."
        />

        {/* Desktop: expanding accordion */}
        <div className="mt-12 hidden h-[34rem] gap-3 lg:flex xl:h-[38rem]">
          {withCounts.map((category, index) => {
            const isActive = index === active
            return (
              <motion.div
                key={category.slug}
                layout
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                animate={{ flexGrow: isActive ? 5 : 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative min-w-0 basis-0 overflow-hidden rounded-[1.75rem] border border-white/[0.07]"
              >
                <Link to={`/collection?category=${category.slug}`} className="group absolute inset-0 block outline-none">
                  <Img
                    src={category.image.src}
                    alt={category.image.alt}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    position={category.image.position}
                    className="absolute inset-0"
                    imgClassName={`transition-transform duration-[1.6s] ease-premium ${isActive ? 'scale-100' : 'scale-125'}`}
                  />
                  <div
                    className={`absolute inset-0 transition-colors duration-700 ${isActive ? 'bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent' : 'bg-ink-950/65'}`}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <motion.div animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }} transition={{ duration: 0.6, delay: isActive ? 0.2 : 0 }} className={isActive ? '' : 'pointer-events-none'}>
                      <p className="eyebrow">{category.tagline}</p>
                      <h3 className="mt-3 font-display text-4xl font-bold text-bone">{category.name}</h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">{category.description}</p>
                      <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-sm font-semibold text-ink-950 transition group-hover:bg-gold-400">
                        Explore {pluralize(category.count, 'car')} <ArrowUpRight className="size-4" />
                      </span>
                    </motion.div>
                  </div>
                  <motion.p
                    animate={{ opacity: isActive ? 0 : 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 rotate-180 font-display text-lg font-bold tracking-[0.18em] whitespace-nowrap text-bone uppercase [writing-mode:vertical-rl]"
                  >
                    {category.short}
                  </motion.p>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Mobile & tablet: snap rail */}
        <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:hidden">
          {withCounts.map((category) => (
            <Link
              key={category.slug}
              to={`/collection?category=${category.slug}`}
              className="group relative aspect-[3/4] w-[78%] shrink-0 snap-start overflow-hidden rounded-[1.5rem] border border-white/[0.07] xs:w-[60%] sm:w-[42%] md:w-[34%]"
            >
              <Img src={category.image.src} alt={category.image.alt} sizes="(min-width: 640px) 42vw, 78vw" position={category.image.position} className="absolute inset-0" imgClassName="transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[0.6rem] font-semibold tracking-[0.25em] text-gold-400 uppercase">{pluralize(category.count, 'car')}</p>
                <h3 className="mt-1 font-display text-2xl font-bold text-bone">{category.name}</h3>
                <p className="mt-1 text-xs text-mist">{category.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
