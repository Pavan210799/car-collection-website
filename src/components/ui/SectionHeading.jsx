import { motion } from 'framer-motion'

export function SectionHeading({ eyebrow, title, description, align = 'left', action, className = '' }) {
  const centered = align === 'center'
  return (
    <div
      className={`flex flex-col gap-6 ${centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'} ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`min-w-0 ${centered ? 'max-w-3xl' : 'max-w-2xl'}`}
      >
        {eyebrow && (
          <p className={`eyebrow flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
            <span className="h-px w-8 bg-gold-400/70" />
            {eyebrow}
          </p>
        )}
        <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-bold tracking-tight text-balance text-bone">
          {title}
        </h2>
        {description && (
          <p className={`mt-5 text-base leading-relaxed text-pretty text-mist sm:text-lg ${centered ? 'mx-auto max-w-2xl' : ''}`}>
            {description}
          </p>
        )}
      </motion.div>
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      )}
    </div>
  )
}
