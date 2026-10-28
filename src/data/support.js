/** Contact, FAQ and footer content — prepared for the next milestone. */
export const contactInfo = {
  headline: 'Let’s find your next extraordinary car',
  intro: 'Our specialists respond to every enquiry within two business hours, seven days a week.',
  phone: '+44 20 7946 0321',
  whatsapp: '+44 7700 900 321',
  email: 'concierge@veloce.cars',
  pressEmail: 'press@veloce.cars',
  hours: 'Concierge available 24/7 for existing clients',
  image: 'showroom-3',
}

export const socialLinks = [
  { label: 'Instagram', icon: 'Instagram', href: 'https://instagram.com' },
  { label: 'YouTube', icon: 'Youtube', href: 'https://youtube.com' },
  { label: 'X', icon: 'Twitter', href: 'https://x.com' },
  { label: 'LinkedIn', icon: 'Linkedin', href: 'https://linkedin.com' },
]

export const faqCategories = ['Buying', 'Test Drives', 'Finance', 'Delivery', 'Ownership']

export const faqs = [
  {
    category: 'Buying',
    question: 'Are all cars in the collection available to buy immediately?',
    answer:
      'Cars marked “Available” can be reserved today with a fully refundable holding deposit. “Arriving” cars are confirmed allocations due within 4–8 weeks, and “Reserved” cars are held for another client — you can join the waiting list.',
  },
  {
    category: 'Buying',
    question: 'Do you accept part-exchange?',
    answer:
      'Yes. We accept part-exchange on most premium and performance cars. Share your car’s details through the enquiry form and a specialist will provide a guaranteed valuation within 24 hours.',
  },
  {
    category: 'Buying',
    question: 'What does the 240-point inspection cover?',
    answer:
      'Mechanical, electrical, bodywork and interior checks performed by marque-certified technicians, plus a paint-depth audit, full service history verification and a 50 km road test.',
  },
  {
    category: 'Test Drives',
    question: 'How do I book a test drive?',
    answer:
      'Choose a car, pick a showroom, date and time slot, then confirm your details. You will receive confirmation instantly and a specialist will call to tailor the route.',
  },
  {
    category: 'Test Drives',
    question: 'What do I need to bring to my test drive?',
    answer:
      'A valid full driving licence held for at least three years and a second form of photo ID. Circuit sessions also require closed-toe shoes — helmets and race wear are provided.',
  },
  {
    category: 'Test Drives',
    question: 'Can the test drive come to me?',
    answer:
      'Absolutely. Our Home Delivery experience brings the car to your home or office within 50 km of any Veloce showroom.',
  },
  {
    category: 'Finance',
    question: 'Do you offer financing and leasing?',
    answer:
      'We work with specialist lenders to offer hire purchase, balloon financing and lease options on cars from $40,000, with flexible terms from 12 to 60 months.',
  },
  {
    category: 'Finance',
    question: 'How much deposit is required to reserve a car?',
    answer:
      'A fully refundable holding deposit of 2% secures any available car for 7 days while you arrange inspection, finance or delivery.',
  },
  {
    category: 'Delivery',
    question: 'Do you deliver internationally?',
    answer:
      'Yes — we deliver to more than 40 countries using enclosed, fully insured transport with live GPS tracking and white-glove handover.',
  },
  {
    category: 'Delivery',
    question: 'How long does delivery take?',
    answer:
      'Domestic deliveries typically take 3–5 business days. International deliveries take 2–6 weeks depending on destination and customs.',
  },
  {
    category: 'Ownership',
    question: 'Is there a warranty on pre-owned cars?',
    answer:
      'Every Certified Pre-Owned car includes a two-year comprehensive warranty, extendable up to five years, plus 24/7 roadside assistance.',
  },
  {
    category: 'Ownership',
    question: 'Can you store and maintain my car?',
    answer:
      'Our climate-controlled Veloce Vault offers secure storage, battery conditioning, detailing and scheduled servicing collected and returned to you.',
  },
]

export const footerColumns = [
  {
    title: 'Collection',
    links: [
      { label: 'All cars', to: '/collection' },
      { label: 'Hypercars', to: '/collection?category=hypercar' },
      { label: 'Supercars', to: '/collection?category=supercar' },
      { label: 'Luxury SUVs', to: '/collection?category=suv' },
      { label: 'Electric', to: '/collection?category=electric' },
    ],
  },
  {
    title: 'Experience',
    links: [
      { label: 'Book a test drive', to: '/test-drive' },
      { label: 'Make an enquiry', to: '/test-drive?type=enquiry' },
      { label: 'Compare cars', to: '/compare' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Brands', to: '/brands' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Careers', to: '/about#careers' },
    ],
  },
]

export const legalLinks = [
  { label: 'Privacy policy', to: '/privacy' },
  { label: 'Terms of service', to: '/terms' },
  { label: 'Cookie settings', to: '/cookies' },
]

export const newsletter = {
  title: 'First access to new arrivals',
  description: 'Private previews of rare cars before they reach the public collection. No spam — ever.',
}
