import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Container } from '../components/ui/Container'
import { EnquiryForm } from '../components/forms/EnquiryForm'
import { Img } from '../components/ui/Img'
import { contactInfo } from '../data/support'
import { showrooms } from '../data/bookings'
import { siteImage } from '../data/cars'

export default function Contact() {
  const headerImage = siteImage(contactInfo.image)

  return (
    <>
      <PageHeader eyebrow="Contact" title={contactInfo.headline} description={contactInfo.intro} image={headerImage} compact />

      <Container className="pb-24">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] xl:gap-14">
          <aside className="min-w-0 space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {[
                { icon: Phone, label: 'Phone', value: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/\s/g, '')}` },
                { icon: MessageCircle, label: 'WhatsApp', value: contactInfo.whatsapp, href: `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}` },
                { icon: Mail, label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
                { icon: Mail, label: 'Press', value: contactInfo.pressEmail, href: `mailto:${contactInfo.pressEmail}` },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="spotlight hover-lift glass flex items-start gap-3 rounded-2xl p-4 hover:border-volt/40"
                >
                  <item.icon className="mt-0.5 size-4 shrink-0 text-volt" />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold tracking-wide text-smoke uppercase">{item.label}</span>
                    <span className="block truncate text-sm font-semibold text-bone">{item.value}</span>
                  </span>
                </a>
              ))}
            </div>
            <p className="text-sm text-mist">{contactInfo.hours}</p>

            <div>
              <h2 className="font-display text-xl font-bold text-bone">Showrooms</h2>
              <ul className="mt-4 space-y-4">
                {showrooms.map((room) => {
                  const image = siteImage(room.image)
                  return (
                    <li key={room.id} className="spotlight group overflow-hidden rounded-[1.5rem] border border-ink-700/60 bg-ink-900 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift">
                      <div className="relative m-2 h-40 overflow-hidden rounded-[1.1rem] bg-ink-800">
                        {image && <Img src={image.src} alt={image.alt ?? ''} sizes="400px" position={image.position} className="absolute inset-0" imgClassName="transition-transform duration-[1.4s] ease-premium group-hover:scale-105" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                        <p className="absolute bottom-3 left-4 font-display text-lg font-bold text-white">{room.name}</p>
                      </div>
                      <div className="space-y-2 p-4 text-sm text-mist">
                        <p className="flex items-start gap-2">
                          <MapPin className="mt-0.5 size-3.5 shrink-0 text-gold-400" />
                          {room.address}
                        </p>
                        <p>{room.hours}</p>
                        <a href={`tel:${room.phone.replace(/\s/g, '')}`} className="font-semibold text-bone hover:text-volt">
                          {room.phone}
                        </a>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>

          <div className="spotlight hover-panel min-w-0 rounded-[1.75rem] border border-ink-700/40 bg-ink-900 p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-bone">Send a message</h2>
            <p className="mt-2 text-sm text-mist">A specialist will respond within two business hours.</p>
            <div className="mt-8">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
