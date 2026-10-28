import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Globe2, KeyRound, Scale, ShieldCheck } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { services } from '../../data/site'

const icons = { KeyRound, Scale, ShieldCheck, Globe2 }

export function Services() {
  return (
    <section className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="The Veloce experience"
          title="Ownership, elevated"
          description="Every detail of finding, testing and owning your next car — handled with the same precision that built it."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = icons[service.icon]
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={service.to}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-ink-900 p-7 transition duration-500 ease-premium hover:-translate-y-1 hover:border-gold-400/30"
                >
                  <span className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-gold-400/0 blur-3xl transition-colors duration-700 group-hover:bg-gold-400/20" />
                  <span className="relative grid size-14 place-items-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-300 transition-transform duration-500 ease-premium group-hover:scale-110 group-hover:-rotate-6">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="relative mt-8 font-display text-xl font-bold text-bone">{service.title}</h3>
                  <p className="relative mt-3 flex-1 text-sm leading-relaxed text-mist">{service.description}</p>
                  <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold-400">
                    {service.cta}
                    <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
