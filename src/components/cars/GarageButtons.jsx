import { AnimatePresence, motion } from 'framer-motion'
import { Check, Heart, Scale } from 'lucide-react'
import { useGarage } from '../../context/contexts'

const iconButton =
  'relative grid size-10 place-items-center rounded-full border backdrop-blur-md transition duration-300 ease-premium active:scale-90'

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
          active
            ? 'border-ember/50 bg-ember/10 text-bone'
            : 'border-white/15 text-bone hover:border-white/35 hover:bg-white/[0.04]'
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
      className={`${iconButton} ${
        active ? 'border-ember/40 bg-ember/15' : 'border-white/15 bg-black/35 hover:border-white/40 hover:bg-black/55'
      } ${className}`}
    >
      <HeartIcon active={active} />
    </button>
  )
}

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
        <Heart className={`size-4 transition-colors ${active ? 'fill-ember text-ember' : 'text-bone'}`} />
      </motion.span>
      <AnimatePresence>
        {active && (
          <motion.span
            key="burst"
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 2.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="pointer-events-none absolute size-4 rounded-full border border-ember"
          />
        )}
      </AnimatePresence>
    </span>
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
          active
            ? 'border-gold-400/60 bg-gold-400/10 text-gold-200'
            : 'border-white/15 text-bone hover:border-white/35 hover:bg-white/[0.04]'
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
      className={`${iconButton} ${
        active
          ? 'border-gold-400/60 bg-gold-400 text-ink-950'
          : 'border-white/15 bg-black/35 text-bone hover:border-white/40 hover:bg-black/55'
      } ${className}`}
    >
      <Icon className="size-4" />
    </button>
  )
}
