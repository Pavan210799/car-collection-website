import { useLocation, useOutlet, ScrollRestoration } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Navbar } from './Navbar'
import { CompareTray } from './CompareTray'
import { SiteEnd } from './SiteEnd'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-500"
    />
  )
}

export function RootLayout() {
  const location = useLocation()
  const outlet = useOutlet()

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-dvh"
      >
        {outlet}
      </motion.main>
      <SiteEnd />
      <CompareTray />
      <ScrollRestoration />
    </>
  )
}
