import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

export function SectionHeading({ eyebrow, title, description, align = 'left', action, className = '' }) {
  const centered = align === 'center'
  return (
    <div
      className={`flex flex-col gap-6 ${centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'} ${className}`}
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className={`min-w-0 ${centered ? 'max-w-3xl' : 'max-w-2xl'}`}
      >
        {eyebrow && (
          <motion.p
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
            className={`eyebrow flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
          >
            <motion.span
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }}
              className="h-px w-8 origin-left bg-gold-400"
            />
            {eyebrow}
          </motion.p>
        )}
        <motion.h2
          variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
          className="mt-4 font-display text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.05] font-bold tracking-tight text-balance break-words text-bone"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
            className={`mt-4 text-base leading-relaxed text-pretty text-mist sm:text-lg ${centered ? 'mx-auto max-w-2xl' : ''}`}
          >
            {description}
          </motion.p>
        )}
      </motion.div>
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      )}
    </div>
  )
}
