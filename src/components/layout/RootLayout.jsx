import { useEffect } from 'react'
import { useLocation, useOutlet, ScrollRestoration } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { siteMeta } from '../../data/site'
import { Navbar } from './Navbar'
import { CompareTray } from './CompareTray'
import { Footer } from './Footer'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-gradient-to-r from-gold-400 via-gold-500 to-volt"
    />
  )
}

export function RootLayout() {
  const location = useLocation()
  const outlet = useOutlet()

  useEffect(() => {
    document.title = `${siteMeta.name} — ${siteMeta.tagline}`
  }, [location.pathname])

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-dvh"
      >
        {outlet}
      </motion.main>
      <Footer />
      <CompareTray />
      <ScrollRestoration />
    </>
  )
}
