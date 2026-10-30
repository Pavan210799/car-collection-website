import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { Img } from '../ui/Img'
import { experienceSteps } from '../../data/site'
import { siteImage } from '../../data/cars'

const EASE = [0.22, 1, 0.36, 1]

export function TestDriveCta() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const image = siteImage('road-1')

  return (
    <section ref={ref} className="pb-20 sm:pb-28">
      <Container>
        <div className="spotlight hover-zoom relative isolate overflow-hidden rounded-[2.5rem] border border-ink-700/60 bg-ink-900 shadow-lift">
          {image && (
            <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0 -z-10">
              <Img src={image.src} alt="" sizes="100vw" position={image.position} className="absolute inset-0" />
            </motion.div>
          )}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950 from-25% via-ink-950/85 via-50% to-ink-950/15 lg:bg-gradient-to-r lg:from-0% lg:via-50% lg:from-ink-950 lg:via-ink-950/90 lg:to-ink-950/10" />

          <div className="grid gap-10 p-6 py-12 sm:p-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:p-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="min-w-0"
            >
              <p className="eyebrow flex items-center gap-3">
                <span className="h-px w-8 bg-gold-400" /> Private test drives
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] leading-[1] font-bold tracking-tight text-balance text-bone">
                Feel it before <span className="text-gradient-gold">you own it.</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-mist sm:text-lg">
                Book an unhurried drive on open roads, a closed circuit, or right from your driveway. No pressure — just you and the machine.
              </p>
              <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
                <Button to="/test-drive" size="lg">
                  Book a test drive <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
                <Button to="/test-drive?type=enquiry" variant="light" size="lg">
                  Ask a specialist
                </Button>
              </div>
            </motion.div>

            <ol className="flex min-w-0 flex-col gap-3 self-end">
              {experienceSteps.map((step, index) => (
                <motion.li
                  key={step.step}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
                  className="glass flex gap-5 rounded-2xl p-5"
                >
                  <span className="font-display text-2xl font-bold text-gold-400">{step.step}</span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-bone">{step.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-mist">{step.description}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}
