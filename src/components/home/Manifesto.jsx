import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { siteMeta } from '../../data/site'

const EASE = [0.22, 1, 0.36, 1]

const statement = 'We don’t sell cars. We curate machines that quicken the pulse — each one hand-selected, inspected and ready to become part of your story.'
const highlight = new Set(['curate', 'machines', 'pulse'])

const pillars = [
  { index: '01', title: 'Curated', text: 'Fewer than one in twenty cars we evaluate earns a place in the collection.' },
  { index: '02', title: 'Inspected', text: 'A 240-point check by marque-certified technicians on every pre-owned car.' },
  { index: '03', title: 'Delivered', text: 'Enclosed, insured transport with white-glove handover in 40+ countries.' },
]

export function Manifesto() {
  const words = statement.split(' ')
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
          <div className="min-w-0">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gold-400" /> The {siteMeta.name} way
            </p>
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
              className="mt-6 font-display text-[clamp(1.6rem,3.6vw,3rem)] leading-[1.18] font-semibold tracking-tight text-pretty text-bone"
            >
              {words.map((word, index) => {
                const clean = word.replace(/[^a-z]/gi, '').toLowerCase()
                return (
                  <motion.span
                    key={`${word}-${index}`}
                    variants={{ hidden: { opacity: 0.5, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
                    className={`inline-block ${highlight.has(clean) ? 'text-gradient-gold' : ''}`}
                  >
                    {word}&nbsp;
                  </motion.span>
                )
              })}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button to="/about" variant="dark">
                Our story
              </Button>
              <Button to="/brands" variant="outline">
                Meet the marques
              </Button>
            </motion.div>
          </div>

          <ol className="min-w-0 space-y-3 self-end">
            {pillars.map((pillar, index) => (
              <motion.li
                key={pillar.index}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
                className="spotlight group flex gap-5 rounded-[1.5rem] border border-ink-700/60 bg-ink-900 p-5 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="font-display text-2xl font-bold text-gold-400 transition-transform duration-500 group-hover:scale-110">{pillar.index}</span>
                <span className="min-w-0">
                  <span className="block font-display text-lg font-bold text-bone">{pillar.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-mist">{pillar.text}</span>
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
