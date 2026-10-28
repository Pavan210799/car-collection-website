import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

export default function NotFound({ title = 'Wrong turn' }) {
  return (
    <Container className="flex min-h-[80dvh] flex-col items-center justify-center py-32 text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="text-outline font-display text-[clamp(6rem,24vw,16rem)] leading-none font-extrabold"
      >
        404
      </motion.p>
      <h1 className="mt-4 font-display text-3xl font-bold text-bone sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-md text-mist">The page you’re looking for has driven off. Let’s get you back on the road.</p>
      <div className="mt-8 flex flex-col gap-3 xs:flex-row">
        <Button to="/collection">
          Explore the collection <ArrowRight className="size-4" />
        </Button>
        <Button to="/" variant="outline">
          Back home
        </Button>
      </div>
    </Container>
  )
}
