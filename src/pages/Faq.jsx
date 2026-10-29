import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { faqCategories, faqs } from '../data/support'

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="border-b border-ink-700/40 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-semibold text-bone">{item.question}</span>
        <ChevronDown className={`mt-0.5 size-4 shrink-0 text-volt transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
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
    </div>
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
              className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition ${
                activeCategory === category
                  ? 'border-volt bg-volt/10 text-volt'
                  : 'border-ink-700/45 text-mist hover:border-ink-700/55 hover:text-bone'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-ink-700/40 bg-ink-900 px-5 sm:px-8">
          {filtered.map((item) => (
            <FaqItem
              key={item.question}
              item={item}
              open={openId === item.question}
              onToggle={() => setOpenId((current) => (current === item.question ? '' : item.question))}
            />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-[1.5rem] border border-ink-700/40 bg-gradient-to-r from-volt/10 to-gold-400/10 p-6 sm:flex-row sm:items-center sm:justify-between">
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
