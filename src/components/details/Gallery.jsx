import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { Img, srcFor, srcSetFor } from '../ui/Img'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'

const swipeConfidence = 8000

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction >= 0 ? 120 : -120 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction >= 0 ? -120 : 120 }),
}

function Lightbox({ images, index, onClose, onNavigate }) {
  const [direction, setDirection] = useState(0)
  useLockBodyScroll(index !== null)

  const go = useCallback(
    (step) => {
      setDirection(step)
      onNavigate((index + step + images.length) % images.length)
    },
    [index, images.length, onNavigate],
  )

  useEffect(() => {
    if (index === null) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, go, onClose])

  return createPortal(
    <AnimatePresence>
      {index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[75] flex flex-col bg-ink-950/97 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between px-4 py-4 sm:px-8">
            <p className="font-display text-sm font-bold text-bone tabular-nums">
              {String(index + 1).padStart(2, '0')} <span className="text-smoke">/ {String(images.length).padStart(2, '0')}</span>
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close gallery"
              autoFocus
              className="grid size-11 place-items-center rounded-full bg-bone text-on-accent transition duration-300 hover:rotate-90"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={images[index].src}
                custom={direction}
                src={srcFor(images[index].src, 'lg')}
                srcSet={srcSetFor(images[index].src)}
                sizes="100vw"
                alt={images[index].alt}
                draggable="false"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x
                  if (swipe < -swipeConfidence || offset.x < -120) go(1)
                  else if (swipe > swipeConfidence || offset.x > 120) go(-1)
                }}
                className="absolute inset-0 m-auto size-full cursor-grab object-contain px-2 drop-shadow-2xl active:cursor-grabbing sm:px-20"
              />
            </AnimatePresence>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-ink-700/50 bg-ink-900/90 text-bone transition hover:border-gold-400 hover:bg-gold-400 hover:text-on-accent sm:grid"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-ink-700/50 bg-ink-900/90 text-bone transition hover:border-gold-400 hover:bg-gold-400 hover:text-on-accent sm:grid"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="no-scrollbar flex justify-start gap-2 overflow-x-auto px-4 py-4 sm:justify-center sm:px-8">
            {images.map((image, imageIndex) => (
              <button
                key={image.src}
                type="button"
                onClick={() => {
                  setDirection(imageIndex > index ? 1 : -1)
                  onNavigate(imageIndex)
                }}
                aria-label={`View image ${imageIndex + 1}`}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition sm:h-16 sm:w-24 ${
                  imageIndex === index ? 'ring-2 ring-gold-400' : 'opacity-50 hover:opacity-100'
                }`}
              >
                <Img src={image.src} alt="" sizes="96px" position={image.position} className="absolute inset-0" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function Gallery({ images, name }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const current = images[active]

  return (
    <div>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-ink-800 shadow-lift sm:aspect-[16/9]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={current.src}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Img src={current.src} alt={current.alt} priority={active === 0} sizes="(min-width: 1280px) 62vw, 100vw" position={current.position} className="absolute inset-0" />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <button
          type="button"
          onClick={() => setLightbox(active)}
          className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-bone shadow-soft backdrop-blur-md transition hover:bg-gold-400 hover:text-on-accent"
        >
          <Expand className="size-3.5" /> <span className="max-xs:hidden">View fullscreen</span>
        </button>
        <span className="absolute bottom-5 left-5 font-display text-sm font-bold text-white tabular-nums">
          {String(active + 1).padStart(2, '0')} <span className="text-white/60">/ {String(images.length).padStart(2, '0')}</span>
        </span>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActive((active - 1 + images.length) % images.length)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-ink-700/50 bg-ink-900/90 text-bone backdrop-blur-md transition hover:bg-gold-400 hover:text-on-accent sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setActive((active + 1) % images.length)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-ink-700/50 bg-ink-900/90 text-bone backdrop-blur-md transition hover:bg-gold-400 hover:text-on-accent sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show image ${index + 1} of ${name}`}
            aria-current={index === active}
            className={`relative aspect-[4/3] overflow-hidden rounded-xl border transition duration-300 sm:rounded-2xl ${
              index === active ? 'border-gold-400 shadow-soft' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Img src={image.src} alt="" sizes="(min-width: 1280px) 15vw, 25vw" position={image.position} className="absolute inset-0" />
            {index === active && <motion.span layoutId="thumb-indicator" className="absolute inset-x-0 bottom-0 h-0.5 bg-gold-400" />}
          </button>
        ))}
      </div>

      <Lightbox images={images} index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />
    </div>
  )
}
