export const siteMeta = {
  name: 'Veloce',
  legalName: 'Veloce Collection Ltd.',
  tagline: 'The Car Collection',
  description:
    'A curated collection of hypercars, supercars, grand tourers and luxury SUVs — hand-picked, meticulously inspected and ready for the road.',
}

/** Primary navigation. `ready: false` pages are planned for the next milestone and stay hidden until built. */
export const navigation = [
  { label: 'Home', to: '/', ready: true },
  { label: 'Collection', to: '/collection', ready: true },
  { label: 'Brands', to: '/brands', ready: true },
  { label: 'Compare', to: '/compare', ready: true },
  { label: 'Test Drive', to: '/test-drive', ready: true },
  { label: 'About', to: '/about', ready: false },
  { label: 'Contact', to: '/contact', ready: false },
  { label: 'FAQ', to: '/faq', ready: false },
]

export const heroSlides = [
  {
    car: 'lamborghini-huracan-sto',
    kicker: 'Track-bred. Road-legal.',
    title: ['Born', 'to race'],
    blurb: 'A naturally aspirated V10 howling to 8,500 rpm, wrapped in a one-piece carbon cofango.',
  },
  {
    car: 'lamborghini-urus-performante',
    kicker: 'Super sport utility',
    title: ['Unleash', 'the bull'],
    blurb: '666 hp, a carbon-fibre bonnet and a Rally mode — the SUV that conquered Pikes Peak.',
  },
  {
    car: 'porsche-911-gt3-rs',
    kicker: 'Motorsport DNA',
    title: ['Engineered', 'obsession'],
    blurb: 'Swan-neck wing, DRS and a 9,000 rpm flat-six. The most track-focused 911 ever made.',
  },
  {
    car: 'rolls-royce-cullinan',
    kicker: 'Effortless everywhere',
    title: ['Quiet', 'authority'],
    blurb: 'A magic-carpet ride over any terrain, carried by a whisper-smooth twin-turbo V12.',
  },
]

export const stats = [
  { value: 24, suffix: '', label: 'Hand-picked cars in the collection' },
  { value: 16, suffix: '', label: 'Iconic marques represented' },
  { value: 3200, suffix: '+', label: 'Private test drives delivered' },
  { value: 4.9, suffix: '/5', decimals: 1, label: 'Average client rating' },
]

export const services = [
  {
    icon: 'KeyRound',
    title: 'Private test drives',
    description: 'Experience any car on your schedule — at our showrooms, on a closed circuit or delivered to your door.',
    to: '/test-drive',
    cta: 'Book a drive',
  },
  {
    icon: 'Scale',
    title: 'Side-by-side comparison',
    description: 'Line up to three cars and compare power, pace, dimensions and price at a glance.',
    to: '/compare',
    cta: 'Compare cars',
  },
  {
    icon: 'ShieldCheck',
    title: '240-point inspection',
    description: 'Every pre-owned car is inspected by marque-certified technicians and backed by a two-year warranty.',
    to: '/collection?condition=Certified%20Pre-Owned',
    cta: 'View certified',
  },
  {
    icon: 'Globe2',
    title: 'Enclosed global delivery',
    description: 'White-glove, fully insured enclosed transport to over 40 countries, with live tracking.',
    to: '/test-drive?type=enquiry',
    cta: 'Make an enquiry',
  },
]

export const testimonials = [
  {
    name: 'Alexander Reinholt',
    role: 'Entrepreneur, Munich',
    car: 'porsche-911-gt3-rs',
    quote:
      'The test drive was arranged at the Nürburgring within a week. Flawless from enquiry to handover — this is how buying a car should feel.',
    rating: 5,
  },
  {
    name: 'Priya Venkataraman',
    role: 'Surgeon, Dubai',
    car: 'rolls-royce-cullinan',
    quote:
      'They understood exactly what I wanted before I did. The Cullinan arrived detailed to perfection with my monogram on the headrests.',
    rating: 5,
  },
  {
    name: 'Marcus Ellery',
    role: 'Film Producer, Los Angeles',
    car: 'ferrari-sf90-stradale',
    quote:
      'Comparing the SF90 against the 720S side by side made the decision easy. Honest advice, zero pressure, unbelievable cars.',
    rating: 5,
  },
  {
    name: 'Sofia Marchetti',
    role: 'Architect, Milan',
    car: 'bentley-continental-gt',
    quote:
      'An exceptional collection curated by people who genuinely love cars. Their concierge handled financing, insurance and delivery.',
    rating: 5,
  },
]

export const experienceSteps = [
  { step: '01', title: 'Choose your car', description: 'Pick any model in the collection — or let our specialists suggest a shortlist.' },
  { step: '02', title: 'Pick a time & place', description: 'Select a showroom, a circuit day or request a home delivery slot.' },
  { step: '03', title: 'Drive it your way', description: 'Enjoy a private, unhurried session with a product genius riding along.' },
]
