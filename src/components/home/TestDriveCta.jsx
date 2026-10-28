import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { Img } from '../ui/Img'
import { experienceSteps } from '../../data/site'
import { siteImage } from '../../data/cars'

export function TestDriveCta() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const image = siteImage('road-1')

  return (
    <section ref={ref} className="relative py-20 sm:py-28">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/[0.07]">
          <motion.div style={{ y }} className="absolute -inset-y-[14%] inset-x-0 -z-10">
            <Img src={image.src} alt={image.alt} sizes="100vw" position={image.position} className="size-full" />
          </motion.div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/30" />

          <div className="grid gap-12 p-6 py-14 sm:p-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:p-16">
            <div className="min-w-0">
              <p className="eyebrow">Private test drives</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] leading-[1] font-bold tracking-tight text-balance text-bone">
                Feel it before <span className="text-gradient-gold">you own it.</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-mist sm:text-lg">
                Book an unhurried drive on open roads, a closed circuit, or right from your driveway. No pressure — just you and the machine.
              </p>
              <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
                <Button to="/test-drive" size="lg">
                  Book a test drive <ArrowRight className="size-4" />
                </Button>
                <Button to="/test-drive?type=enquiry" variant="outline" size="lg" className="backdrop-blur-md">
                  Ask a specialist
                </Button>
              </div>
            </div>

            <ol className="flex min-w-0 flex-col gap-3 self-end">
              {experienceSteps.map((step, index) => (
                <motion.li
                  key={step.step}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="glass flex gap-5 rounded-2xl bg-ink-950/50 p-5"
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
