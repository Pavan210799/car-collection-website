import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { faqCategories, faqs } from '../data/support'

function FaqItem({ item, open, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-ink-700/40 last:border-0"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        <span className={`font-semibold transition-all duration-300 group-hover:translate-x-1 ${open ? 'text-gold-500' : 'text-bone group-hover:text-gold-500'}`}>
          {item.question}
        </span>
        <span
          className={`grid size-8 shrink-0 place-items-center rounded-full border transition duration-300 ${
            open ? 'border-gold-400 bg-gold-400 text-on-accent' : 'border-ink-700/60 text-volt group-hover:border-gold-400 group-hover:text-gold-500'
          }`}
        >
          <ChevronDown className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-mist">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState(faqCategories[0])
  const [openId, setOpenId] = useState(faqs[0]?.question ?? '')

  const filtered = faqs.filter((item) => item.category === activeCategory)

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Answers, upfront"
        description="Everything you need to know about buying, test drives, finance, delivery and ownership."
      />

      <Container className="pb-24">
        <div className="flex flex-wrap gap-2">
          {faqCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category)
                setOpenId('')
              }}
              className={`relative rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition hover:-translate-y-0.5 ${
                activeCategory === category ? 'border-volt bg-volt-soft/40 text-teal-800' : 'border-ink-700/45 text-mist hover:border-ink-600 hover:text-bone'
              }`}
            >
              {activeCategory === category && (
                <motion.span layoutId="faq-category" className="absolute inset-0 rounded-full bg-volt/10" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
              )}
              <span className="relative">{category}</span>
            </button>
          ))}
        </div>

        <div key={activeCategory} className="hover-panel mt-10 rounded-[1.75rem] border border-ink-700/40 bg-ink-900 px-5 shadow-soft sm:px-8">
          {filtered.map((item, index) => (
            <FaqItem
              key={item.question}
              index={index}
              item={item}
              open={openId === item.question}
              onToggle={() => setOpenId((current) => (current === item.question ? '' : item.question))}
            />
          ))}
        </div>

        <div className="spotlight mt-12 flex flex-col items-start gap-4 rounded-[1.5rem] border border-ink-700/40 bg-gradient-to-r from-volt/10 to-gold-400/10 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-bone">Still have a question?</h2>
            <p className="mt-1 text-sm text-mist">Our concierge team is available seven days a week.</p>
          </div>
          <Button to="/contact">Contact us</Button>
        </div>
      </Container>
    </>
  )
}
