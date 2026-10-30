import { AnimatePresence, motion } from 'framer-motion'
import { Check, Heart, Scale } from 'lucide-react'
import { useGarage } from '../../context/contexts'

const iconButton =
  'relative z-[2] grid size-9 place-items-center rounded-full border shadow-soft backdrop-blur-md transition duration-300 ease-premium hover:scale-110 active:scale-90 sm:size-10'

function HeartIcon({ active }) {
  return (
    <span className="relative grid place-items-center">
      <motion.span
        key={active ? 'on' : 'off'}
        initial={{ scale: active ? 0.4 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 14 }}
        className="grid place-items-center"
      >
        <Heart className={`size-4 transition-colors ${active ? 'fill-gold-400 text-gold-400' : 'text-bone'}`} />
      </motion.span>
      <AnimatePresence>
        {active && (
          <motion.span
            key="burst"
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 2.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="pointer-events-none absolute size-4 rounded-full border border-gold-400"
          />
        )}
      </AnimatePresence>
    </span>
  )
}

export function WishlistButton({ carId, className = '', withLabel = false }) {
  const { isWishlisted, toggleWishlist } = useGarage()
  const active = isWishlisted(carId)

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={() => toggleWishlist(carId)}
        aria-pressed={active}
        className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition duration-300 active:scale-[0.97] ${
          active ? 'border-gold-400/50 bg-gold-200/60 text-gold-500 hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-soft' : 'border-ink-700/70 bg-ink-900 text-bone hover:-translate-y-0.5 hover:border-bone/40 hover:shadow-soft'
        } ${className}`}
      >
        <HeartIcon active={active} />
        {active ? 'Saved' : 'Save'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleWishlist(carId)
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Save to wishlist'}
      title={active ? 'Remove from wishlist' : 'Save to wishlist'}
      className={`${iconButton} ${active ? 'border-gold-400/40 bg-white' : 'border-white/70 bg-white/85 hover:bg-white'} ${className}`}
    >
      <HeartIcon active={active} />
    </button>
  )
}

export function CompareButton({ carId, className = '', withLabel = false }) {
  const { isCompared, toggleCompare } = useGarage()
  const active = isCompared(carId)
  const Icon = active ? Check : Scale

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={() => toggleCompare(carId)}
        aria-pressed={active}
        className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition duration-300 active:scale-[0.97] ${
          active ? 'border-bone bg-bone text-on-accent hover:-translate-y-0.5 hover:bg-night hover:shadow-soft' : 'border-ink-700/70 bg-ink-900 text-bone hover:-translate-y-0.5 hover:border-bone/40 hover:shadow-soft'
        } ${className}`}
      >
        <Icon className="size-4" />
        {active ? 'Comparing' : 'Compare'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleCompare(carId)
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from comparison' : 'Add to comparison'}
      title={active ? 'Remove from comparison' : 'Add to comparison'}
      className={`${iconButton} ${active ? 'border-bone bg-bone text-on-accent' : 'border-white/70 bg-white/85 text-bone hover:bg-white'} ${className}`}
    >
      <Icon className="size-4" />
    </button>
  )
}
