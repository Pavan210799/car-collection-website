import { useLocation } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { siteMeta } from '../data/site'

const pages = {
  '/privacy': {
    title: 'Privacy policy',
    updated: 'October 2026',
    sections: [
      {
        heading: 'What we collect',
        body: 'When you enquire, book a test drive or subscribe to updates, we store the contact details you provide and a record of your request so our specialists can respond.',
      },
      {
        heading: 'How we use it',
        body: 'We use your information only to fulfil your request, improve our service and — if you opt in — send curated previews of new arrivals. We do not sell personal data to third parties.',
      },
      {
        heading: 'Retention',
        body: 'Enquiry and booking records are kept for as long as needed to support your purchase or ownership journey, then archived or deleted in line with our data retention schedule.',
      },
    ],
  },
  '/terms': {
    title: 'Terms of service',
    updated: 'October 2026',
    sections: [
      {
        heading: 'Using this website',
        body: 'This site presents cars available through Aurion Motors Ltd. Specifications, pricing and availability may change without notice. Images are representative of cars in our collection.',
      },
      {
        heading: 'Test drives & enquiries',
        body: 'Bookings are subject to licence verification, insurance requirements and showroom availability. We may refuse a test drive where safety or eligibility criteria are not met.',
      },
      {
        heading: 'Limitation',
        body: 'To the fullest extent permitted by law, Aurion is not liable for indirect losses arising from use of this website. Nothing in these terms limits your statutory consumer rights.',
      },
    ],
  },
  '/cookies': {
    title: 'Cookie settings',
    updated: 'October 2026',
    sections: [
      {
        heading: 'Essential storage',
        body: 'We use browser local storage for your wishlist, comparison list, view preferences and form drafts so the site works as you expect between visits.',
      },
      {
        heading: 'Analytics',
        body: 'This demo build does not load third-party analytics cookies. If analytics are enabled in production, we will update this notice and request consent where required.',
      },
      {
        heading: 'Managing cookies',
        body: 'You can clear site data through your browser settings at any time. Clearing storage will reset your saved cars and preferences on this device.',
      },
    ],
  },
}

export default function Legal() {
  const { pathname } = useLocation()
  const page = pages[pathname] ?? pages['/privacy']

  return (
    <>
      <Container className="pt-36 pb-24 sm:pt-44">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-bone sm:text-5xl">{page.title}</h1>
        <p className="mt-3 text-sm text-smoke">
          {siteMeta.legalName} · Last updated {page.updated}
        </p>
        <div className="mt-12 max-w-3xl space-y-10">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-bold text-bone">{section.heading}</h2>
              <p className="mt-3 text-base leading-relaxed text-mist">{section.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </>
  )
}
