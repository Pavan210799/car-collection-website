import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CalendarCheck, ChevronRight, Gauge, MapPin, MessageSquare, Share2, Star, Timer, Zap, Fuel } from 'lucide-react'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Gallery } from '../components/details/Gallery'
import { SpecTabs } from '../components/details/SpecTabs'
import { CarCard, CarBadge } from '../components/cars/CarCard'
import { CompareButton, WishlistButton } from '../components/cars/GarageButtons'
import { EnquiryForm } from '../components/forms/EnquiryForm'
import { cars, carsById } from '../data/cars'
import { brandsBySlug } from '../data/brands'
import { formatNumber, formatPrice } from '../lib/format'
import { useToast } from '../context/contexts'
import NotFound from './NotFound'

const statusStyles = {
  Available: 'bg-volt/15 text-volt',
  Reserved: 'bg-ember/15 text-ember',
  Arriving: 'bg-gold-400/15 text-gold-300',
}

export default function CarDetails() {
  const { slug } = useParams()
  const car = carsById.get(slug)
  const { notify } = useToast()
  const [colorIndex, setColorIndex] = useState(0)
  const [enquiryOpen, setEnquiryOpen] = useState(false)

  if (!car) return <NotFound title="This car has left the collection" />

  const brand = brandsBySlug.get(car.brand)
  const position = cars.indexOf(car)
  const previous = cars[(position - 1 + cars.length) % cars.length]
  const next = cars[(position + 1) % cars.length]
  const related = [
    ...cars.filter((item) => item.id !== car.id && item.category === car.category),
    ...cars.filter((item) => item.id !== car.id && item.category !== car.category && item.brand === car.brand),
  ].slice(0, 3)
  const color = car.colors[colorIndex] ?? car.colors[0]

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: car.name, text: car.tagline, url })
        return
      }
      await navigator.clipboard.writeText(url)
      notify({ title: 'Link copied', description: 'Share it with someone who would love this car.' })
    } catch (error) {
      if (error?.name !== 'AbortError') notify({ title: 'Could not share', description: url, tone: 'warning' })
    }
  }

  const keyStats = [
    { icon: Zap, label: 'Power', value: formatNumber(car.specs.power), unit: 'hp' },
    { icon: Timer, label: '0–100 km/h', value: car.specs.acceleration, unit: 's' },
    { icon: Gauge, label: 'Top speed', value: car.specs.topSpeed, unit: 'km/h' },
    { icon: Fuel, label: car.powertrain, value: car.drivetrain, unit: '' },
  ]

  return (
    <>
      <Container className="pt-28 sm:pt-32">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 overflow-hidden text-xs text-smoke">
          <Link to="/collection" className="shrink-0 transition hover:text-bone">
            Collection
          </Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <Link to={`/collection?brand=${car.brand}`} className="shrink-0 transition hover:text-bone">
            {brand.name}
          </Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <span className="truncate text-mist">{car.model}</span>
        </nav>

        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="min-w-0">
            <Gallery images={car.images} name={car.name} />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <div className="xl:sticky xl:top-24">
              <div className="flex flex-wrap items-center gap-2">
                {car.badge && <CarBadge>{car.badge}</CarBadge>}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-[0.14em] uppercase ${statusStyles[car.status]}`}>
                  <span className="size-1.5 rounded-full bg-current" /> {car.status}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-mist">
                  <Star className="size-3.5 fill-gold-400 text-gold-400" /> {car.rating.toFixed(1)}
                </span>
                <button
                  type="button"
                  onClick={share}
                  aria-label="Share this car"
                  title="Share"
                  className="ml-auto grid size-10 place-items-center rounded-full border border-white/15 text-bone transition hover:border-white/35 hover:bg-white/[0.04]"
                >
                  <Share2 className="size-4" />
                </button>
              </div>

              <p className="mt-5 text-xs font-semibold tracking-[0.3em] text-gold-400 uppercase">
                {car.year} · {car.make}
              </p>
              <h1 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1] font-extrabold tracking-tight text-bone">{car.model}</h1>
              <p className="mt-3 text-base text-mist">{car.tagline}</p>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-y border-white/[0.07] py-5">
                <div>
                  <p className="text-[0.65rem] tracking-[0.2em] text-smoke uppercase">
                    {car.condition === 'New' ? 'Price from' : `${car.condition} · ${formatNumber(car.mileage)} km`}
                  </p>
                  <p className="mt-1 font-display text-3xl font-bold text-bone sm:text-4xl">{formatPrice(car.price)}</p>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-mist">
                  <MapPin className="size-3.5 text-gold-400" /> {car.location}
                </p>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3">
                {keyStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/[0.07] bg-ink-900 p-4">
                    <dt className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.16em] text-smoke uppercase">
                      <stat.icon className="size-3.5 text-gold-400" /> {stat.label}
                    </dt>
                    <dd className="mt-1.5 font-display text-xl font-bold text-bone">
                      {stat.value} <span className="text-xs font-semibold text-mist">{stat.unit}</span>
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6">
                <p className="text-xs font-semibold tracking-[0.12em] text-mist uppercase">
                  Colour: <span className="text-bone normal-case">{color.name}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {car.colors.map((swatch, index) => (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => setColorIndex(index)}
                      aria-label={swatch.name}
                      aria-pressed={index === colorIndex}
                      title={swatch.name}
                      className={`relative size-9 rounded-full border-2 transition duration-300 ${index === colorIndex ? 'scale-110 border-gold-400' : 'border-white/15 hover:scale-105 hover:border-white/40'}`}
                    >
                      <span className="absolute inset-1 rounded-full shadow-inner" style={{ background: swatch.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 grid gap-3 xs:grid-cols-2">
                <Button to={`/test-drive?car=${car.slug}`} size="lg" className="w-full">
                  <CalendarCheck className="size-4" /> Book test drive
                </Button>
                <Button variant="outline" size="lg" onClick={() => setEnquiryOpen(true)} className="w-full">
                  <MessageSquare className="size-4" /> Enquire
                </Button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <WishlistButton carId={car.id} withLabel />
                <CompareButton carId={car.id} withLabel />
              </div>
            </div>
          </motion.aside>
        </div>
      </Container>

      <Container as="section" className="py-20 sm:py-24">
        <SpecTabs car={car} />
      </Container>

      {related.length > 0 && (
        <section className="border-t border-white/[0.07] py-20 sm:py-24">
          <Container>
            <SectionHeading
              eyebrow="You may also like"
              title="More from the collection"
              action={
                <Button to={`/collection?category=${car.category}`} variant="outline">
                  More {car.categoryName.toLowerCase()}s <ArrowRight className="size-4" />
                </Button>
              }
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
              {related.map((item) => (
                <CarCard key={item.id} car={item} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <Container className="pb-24">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { car: previous, label: 'Previous', icon: ArrowLeft },
            { car: next, label: 'Next', icon: ArrowRight },
          ].map(({ car: item, label, icon: Icon }) => (
            <Link
              key={label}
              to={`/cars/${item.slug}`}
              className={`group flex min-w-0 items-center gap-4 rounded-[1.5rem] border border-white/[0.07] bg-ink-900 p-4 transition hover:border-gold-400/30 ${label === 'Next' ? 'sm:flex-row-reverse sm:text-right' : ''}`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 transition group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-ink-950">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.65rem] tracking-[0.2em] text-smoke uppercase">{label} car</span>
                <span className="block truncate font-display font-bold text-bone">{item.name}</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>

      <Dialog open={enquiryOpen} onClose={() => setEnquiryOpen(false)} title={`Enquire about the ${car.model}`} description="A specialist will respond within two business hours.">
        <div className="px-5 py-6 sm:px-7">
          <EnquiryForm carId={car.id} onDone={() => setEnquiryOpen(false)} />
        </div>
      </Dialog>
    </>
  )
}
