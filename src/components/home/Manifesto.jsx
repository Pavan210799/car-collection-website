import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Container } from '../ui/Container'
import { CountUp } from '../ui/CountUp'
import { stats } from '../../data/site'

const statement =
  'We don’t sell cars. We curate machines that quicken the pulse — each one hand-selected, meticulously inspected and ready to become part of your story.'

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const y = useTransform(progress, range, [6, 0])
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  )
}

export function Manifesto() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = statement.split(' ')

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-[40rem] -translate-1/2 rounded-full bg-gold-500/[0.07] blur-3xl" />
      <Container className="relative">
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-8 bg-gold-400/70" />
          The Veloce philosophy
        </p>
        <p
          ref={ref}
          className="mt-8 max-w-6xl font-display text-[clamp(1.6rem,4.2vw,3.6rem)] leading-[1.15] font-semibold tracking-tight text-balance text-bone"
        >
          {words.map((word, index) => (
            <Word key={`${word}-${index}`} progress={scrollYProgress} range={[index / words.length, (index + 1) / words.length]}>
              {word}
            </Word>
          ))}
        </p>

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] sm:mt-24 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-ink-950 p-6 transition-colors duration-500 hover:bg-ink-900 sm:p-8 lg:p-10"
            >
              <dd className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-none font-bold text-bone">
                <CountUp value={stat.value} decimals={stat.decimals ?? 0} />
                <span className="text-gradient-gold">{stat.suffix}</span>
              </dd>
              <dt className="mt-4 max-w-[14rem] text-sm leading-relaxed text-mist">{stat.label}</dt>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gold-400 transition-all duration-700 ease-premium group-hover:w-full" />
            </motion.div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
