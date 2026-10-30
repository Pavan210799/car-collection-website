import { useEffect } from 'react'
import { useOutlet, ScrollRestoration } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { siteMeta } from '../../data/site'
import { Navbar } from './Navbar'
import { CompareTray } from './CompareTray'
import { Footer } from './Footer'
import { PageSkeleton, RouteProgress, skeletonVariant } from '../ui/Skeleton'
import { usePageSkeleton } from '../../hooks/usePageSkeleton'

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
  const outlet = useOutlet()
  const { showSkeleton, skeletonPath, pathname } = usePageSkeleton()
  const skeleton = showSkeleton && skeletonVariant(skeletonPath) !== 'auth'

  useEffect(() => {
    document.title = `${siteMeta.name} — ${siteMeta.tagline}`
  }, [pathname])

  return (
    <>
      <ScrollProgress />
      {skeleton && <RouteProgress />}
      <Navbar />
      <motion.main
        key={skeleton ? 'skeleton' : pathname}
        initial={{ opacity: 0, y: skeleton ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: skeleton ? 0.25 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-dvh"
      >
        {skeleton ? <PageSkeleton pathname={skeletonPath} /> : outlet}
      </motion.main>
      <Footer />
      <CompareTray />
      <ScrollRestoration />
    </>
  )
}
