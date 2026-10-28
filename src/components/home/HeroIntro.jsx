import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'

const STORAGE_KEY = 'veloce:intro-played'
const CINEMATIC = [0.76, 0, 0.24, 1]

export const shouldPlayIntro = () => {
  try {
    return !window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}

/** One-time-per-session cinematic curtain that reveals the hero. */
export function HeroIntro({ play, onComplete }) {
  const [visible, setVisible] = useState(play)
  useLockBodyScroll(visible)

  useEffect(() => {
    if (!play) {
      onComplete()
      return undefined
    }
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    const timer = setTimeout(() => setVisible(false), 1500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div key="intro" className="fixed inset-0 z-[90]" aria-hidden="true" exit={{ pointerEvents: 'none' }}>
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink-950"
            exit={{ y: '-100%', transition: { duration: 1, ease: CINEMATIC } }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-950"
            exit={{ y: '100%', transition: { duration: 1, ease: CINEMATIC } }}
          />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.45 } }}
          >
            <svg viewBox="0 0 64 64" className="size-14 text-gold-400">
              <motion.path
                d="M10 14h11l11 26 11-26h11L37 52h-10z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
              <motion.path
                d="M10 14h11l11 26 11-26h11L37 52h-10z"
                fill="currentColor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              />
            </svg>
            <div className="flex overflow-hidden">
              {'VELOCE'.split('').map((letter, index) => (
                <motion.span
                  key={letter + index}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.25 + index * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-2xl font-extrabold tracking-[0.5em] text-bone"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            <motion.span
              className="h-px w-48 origin-center bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
