export const siteMeta = {
  name: 'Aurion',
  legalName: 'Aurion Motors Ltd.',
  tagline: 'Curated Performance',
  description:
    'A hand-selected fleet of hypercars, supercars, grand tourers and luxury SUVs — inspected, photographed and ready for the road.',
}

export const navigation = [
  { label: 'Home', to: '/', ready: true },
  { label: 'Collection', to: '/collection', ready: true },
  { label: 'Brands', to: '/brands', ready: true },
  { label: 'Compare', to: '/compare', ready: true },
  { label: 'Test Drive', to: '/test-drive', ready: true },
  { label: 'About', to: '/about', ready: true },
  { label: 'Contact', to: '/contact', ready: true, footerOnly: true },
  { label: 'FAQ', to: '/faq', ready: true, footerOnly: true },
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
    id: 'alex',
    quote:
      'The GT3 RS test drive on a closed circuit was unreal — no sales pressure, just a product genius who knows every millimetre of the car.',
    name: 'Alexander Reinholt',
    role: 'Collector · Munich',
    carSlug: 'porsche-911-gt3-rs',
    rating: 5,
    image: 'detail-1',
  },
  {
    id: 'priya',
    quote:
      'I compared three SUVs side by side before choosing the Cullinan. Aurion made a six-figure decision feel calm and informed.',
    name: 'Priya Venkataraman',
    role: 'CEO · Singapore',
    carSlug: 'rolls-royce-cullinan',
    rating: 5,
    image: 'detail-2',
  },
  {
    id: 'marcus',
    quote:
      'Enclosed delivery to Los Angeles was flawless — live tracking, white gloves, and the car arrived exactly as photographed.',
    name: 'Marcus Ellery',
    role: 'Film producer · Los Angeles',
    carSlug: 'mclaren-720s',
    rating: 5,
    image: 'road-2',
  },
  {
    id: 'sofia',
    quote:
      'From first enquiry to handover in Monaco, every touchpoint felt bespoke. This is how buying a dream car should feel.',
    name: 'Sofia Marchetti',
    role: 'Architect · Milan',
    carSlug: 'ferrari-roma',
    rating: 5,
    image: 'interior-2',
  },
]

export const experienceSteps = [
  { step: '01', title: 'Choose your car', description: 'Pick any model in the collection — or let our specialists suggest a shortlist.' },
  { step: '02', title: 'Pick a time & place', description: 'Select a showroom, a circuit day or request a home delivery slot.' },
  { step: '03', title: 'Drive it your way', description: 'Enjoy a private, unhurried session with a product genius riding along.' },
]
