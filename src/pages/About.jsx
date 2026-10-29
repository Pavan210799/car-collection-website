import { motion } from 'framer-motion'
import { Gem, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Img } from '../components/ui/Img'
import { Button } from '../components/ui/Button'
import { about, milestones, values, team, awards } from '../data/company'
import { siteImage } from '../data/cars'

const valueIcons = { Gem, HeartHandshake, ShieldCheck, Sparkles }

export default function About() {
  const heroImage = siteImage(about.heroImage)
  const secondaryImage = siteImage(about.secondaryImage)

  return (
    <>
      <PageHeader eyebrow="About us" title={about.headline} description={about.intro} image={heroImage} />

      <Container as="section" className="pb-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0 space-y-5 text-base leading-relaxed text-mist">
            {about.story.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-72 overflow-hidden rounded-[2rem] bg-ink-800 shadow-lift lg:min-h-0"
          >
            <Img src={secondaryImage.src} alt={secondaryImage.alt} sizes="(min-width: 1024px) 45vw, 100vw" position={secondaryImage.position} className="absolute inset-0" imgClassName="transition-transform duration-[1.6s] ease-premium hover:scale-105" />
          </motion.div>
        </div>
      </Container>

      <section className="border-t border-ink-700/40 py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Timeline" title="Milestones" description="Two decades of curating the world’s most desirable performance cars." />
          <ol className="relative mt-14 space-y-0 border-l border-ink-700/45 pl-8 sm:pl-10">
            {milestones.map((item, index) => (
              <motion.li
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="relative pb-10 last:pb-0"
              >
                <span className="absolute -left-[2.05rem] top-1 grid size-4 place-items-center rounded-full border-2 border-gold-400 bg-ink-900 sm:-left-[2.35rem]" />
                <p className="font-display text-2xl font-bold text-gold-400">{item.year}</p>
                <h3 className="mt-1 font-display text-xl font-bold text-bone">{item.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist">{item.description}</p>
              </motion.li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="mesh-glow border-t border-ink-700/40 py-20 sm:py-28">
        <Container>
          <SectionHeading align="center" eyebrow="Values" title="What we stand for" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, index) => {
              const Icon = valueIcons[item.icon]
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="glass rounded-[1.5rem] p-6"
                >
                  {Icon && (
                    <span className="grid size-12 place-items-center rounded-2xl border border-volt/30 bg-volt/10 text-volt">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>
                  )}
                  <h3 className="mt-5 font-display text-lg font-bold text-bone">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-ink-700/40 py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="People" title="Leadership team" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((person, index) => (
              <motion.article
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[1.5rem] border border-ink-700/40 bg-ink-900 p-6"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-volt/20 to-gold-400/15 font-display text-lg font-bold text-bone">
                  {person.initials}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-bone">{person.name}</h3>
                <p className="text-xs font-semibold tracking-wide text-gold-400 uppercase">{person.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-mist">{person.bio}</p>
              </motion.article>
            ))}
          </div>
        </Container>
      </section>

      <section id="careers" className="border-t border-ink-700/40 py-20 sm:pb-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <div>
              <SectionHeading eyebrow="Recognition" title="Awards" description="Independent recognition for curation and client experience." />
              <ul className="mt-8 space-y-4">
                {awards.map((item) => (
                  <li key={item.year + item.title} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-700/60 pb-4">
                    <div>
                      <p className="font-semibold text-bone">{item.title}</p>
                      <p className="text-sm text-mist">{item.issuer}</p>
                    </div>
                    <span className="font-display text-lg font-bold text-volt">{item.year}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-[1.75rem] p-8">
              <h3 className="font-display text-2xl font-bold text-bone">Join the atelier</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                We hire specialists, concierges and technicians who share our obsession with detail. Send your CV to careers@aurion.motor.
              </p>
              <Button to="/contact" className="mt-6">
                Get in touch
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
