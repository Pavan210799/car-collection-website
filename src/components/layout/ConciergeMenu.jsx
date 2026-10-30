import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, CircleHelp, Headset, Mail, MessageSquare, Phone } from 'lucide-react'
import { contactInfo } from '../../data/support'
import { useNavPopover } from '../../hooks/useNavPopover'

const links = [
  { to: '/contact', label: 'Contact us', text: 'Talk to a specialist today', icon: MessageSquare },
  { to: '/faq', label: 'FAQ', text: 'Buying, finance and delivery', icon: CircleHelp },
]

export function ConciergeMenu({ openId, setOpenId, className = '' }) {
  const { pathname } = useLocation()
  const { open, panelId, rootProps, buttonProps } = useNavPopover('concierge', openId, setOpenId)
  const active = links.some((link) => pathname.startsWith(link.to))

  return (
    <div {...rootProps} className={`relative ${className}`}>
      <button
        type="button"
        {...buttonProps}
        aria-label="Help and contact"
        className={`relative grid size-10 shrink-0 place-items-center rounded-full border transition duration-300 ${
          active || open
            ? 'border-gold-400/50 bg-gold-200/60 text-gold-500 hover:-translate-y-0.5 hover:shadow-soft'
            : 'border-ink-700/70 bg-ink-900/70 text-bone hover:-translate-y-0.5 hover:border-bone/30 hover:shadow-soft'
        }`}
      >
        <Headset className="size-[1.05rem]" />
        <span aria-hidden="true" className="absolute top-0.5 right-0.5 size-2 rounded-full bg-volt ring-2 ring-ink-900" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full right-0 z-10 w-[21rem] origin-top-right pt-3"
          >
            <div className="overflow-hidden rounded-[1.5rem] border border-ink-700/60 bg-ink-900 shadow-lift">
              <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
                <div>
                  <p className="eyebrow">Concierge</p>
                  <p className="mt-1 font-display text-lg font-bold text-bone">How can we help?</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-volt/10 px-2.5 py-1 text-[0.65rem] font-semibold text-volt">
                  <span className="size-1.5 animate-pulse rounded-full bg-volt" /> Online
                </span>
              </div>

              <ul className="px-2">
                {links.map(({ to, label, text, icon: Icon }) => {
                  const current = pathname.startsWith(to)
                  return (
                    <li key={to}>
                      <Link
                        to={to}
                        aria-current={current ? 'page' : undefined}
                        className={`group flex items-center gap-3 rounded-2xl p-3 transition ${current ? 'bg-ink-800' : 'hover:bg-ink-800/70'}`}
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-400/10 text-gold-500 transition group-hover:bg-gold-400 group-hover:text-on-accent">
                          <Icon className="size-[1.05rem]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-bone">{label}</span>
                          <span className="block text-xs leading-snug text-mist">{text}</span>
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 text-smoke transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone" />
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-2 grid grid-cols-2 gap-px border-t border-ink-700/60 bg-ink-700/60">
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-2 bg-ink-900 px-3 py-3.5 text-xs font-semibold text-mist transition hover:text-bone"
                >
                  <Phone className="size-3.5" /> Call us
                </a>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center justify-center gap-2 bg-ink-900 px-3 py-3.5 text-xs font-semibold text-mist transition hover:text-bone"
                >
                  <Mail className="size-3.5" /> Email us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
