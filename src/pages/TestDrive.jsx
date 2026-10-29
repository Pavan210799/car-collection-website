import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarCheck, Clock, MessageSquare, Phone, ShieldCheck } from 'lucide-react'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/PageHeader'
import { TestDriveForm } from '../components/forms/TestDriveForm'
import { EnquiryForm } from '../components/forms/EnquiryForm'
import { contactInfo } from '../data/support'
import { siteImage } from '../data/cars'

const tabs = [
  { id: 'booking', label: 'Book a test drive', short: 'Test drive', icon: CalendarCheck },
  { id: 'enquiry', label: 'Make an enquiry', short: 'Enquiry', icon: MessageSquare },
]

const assurances = [
  { icon: Clock, title: 'Reply within 2 hours', text: 'Seven days a week, from a real specialist.' },
  { icon: ShieldCheck, title: 'No obligation', text: 'Unhurried, pressure-free experiences.' },
  { icon: Phone, title: contactInfo.phone, text: 'Prefer to talk? Call our concierge.' },
]

export default function TestDrive() {
  const [params, setParams] = useSearchParams()
  const active = params.get('type') === 'enquiry' ? 'enquiry' : 'booking'
  const carParam = params.get('car') ?? undefined

  const switchTab = (id) => {
    const next = new URLSearchParams(params)
    if (id === 'enquiry') next.set('type', 'enquiry')
    else next.delete('type')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageHeader
        eyebrow="Test drives & enquiries"
        title="Your drive, your way"
        description="Reserve a private test drive in under a minute, or ask our specialists anything — finance, part-exchange, bespoke specification or global delivery."
        image={siteImage('interior-1')}
      >
        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {assurances.map((item) => (
            <div key={item.title} className="glass flex min-w-0 items-start gap-3 rounded-2xl p-4">
              <item.icon className="mt-0.5 size-4 shrink-0 text-gold-400" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-bone">{item.title}</span>
                <span className="block text-xs text-mist">{item.text}</span>
              </span>
            </div>
          ))}
        </div>
      </PageHeader>

      <Container className="pb-24">
        <div role="tablist" aria-label="Request type" className="mb-8 inline-flex max-w-full rounded-full border border-ink-700/40 bg-ink-900 p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => switchTab(tab.id)}
              className={`relative flex min-w-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-6 ${
                active === tab.id ? 'text-on-accent' : 'text-mist hover:text-bone'
              }`}
            >
              {active === tab.id && <motion.span layoutId="request-tab" className="absolute inset-0 rounded-full bg-gold-400" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <tab.icon className="relative size-4 shrink-0" />
              <span className="relative truncate sm:hidden">{tab.short}</span>
              <span className="relative truncate max-sm:hidden">{tab.label}</span>
            </button>
          ))}
        </div>

        <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          {active === 'booking' ? (
            <TestDriveForm initialCar={carParam} />
          ) : (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
              <div className="min-w-0 rounded-[1.75rem] border border-ink-700/40 bg-ink-900/60 p-5 sm:p-8">
                <h2 className="font-display text-2xl font-bold text-bone">How can we help?</h2>
                <p className="mt-2 mb-8 text-sm text-mist">{contactInfo.intro}</p>
                <EnquiryForm carId={carParam} />
              </div>
              <aside className="flex min-w-0 flex-col gap-4">
                {[
                  { label: 'Concierge', value: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/\s/g, '')}` },
                  { label: 'WhatsApp', value: contactInfo.whatsapp, href: `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}` },
                  { label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="group rounded-[1.5rem] border border-ink-700/40 bg-ink-900 p-6 transition hover:border-gold-400/30"
                  >
                    <p className="eyebrow">{item.label}</p>
                    <p className="mt-2 font-display text-lg font-bold break-words text-bone transition group-hover:text-gold-500">{item.value}</p>
                  </a>
                ))}
                <p className="px-2 text-xs leading-relaxed text-smoke">{contactInfo.hours}</p>
              </aside>
            </div>
          )}
        </motion.div>
      </Container>
    </>
  )
}
