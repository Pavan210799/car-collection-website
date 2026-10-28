export const categories = [
  {
    slug: 'hypercar',
    name: 'Hypercars',
    short: 'Hypercar',
    tagline: 'The absolute limit',
    description: 'Four-figure horsepower, record-breaking top speeds and production runs measured in hundreds.',
    cover: 'bugatti-chiron',
  },
  {
    slug: 'supercar',
    name: 'Supercars',
    short: 'Supercar',
    tagline: 'Mid-engine theatre',
    description: 'Exotic Italian and British machines built for the racetrack and the grand entrance.',
    cover: 'lamborghini-aventador-svj',
  },
  {
    slug: 'sports',
    name: 'Sports Cars',
    short: 'Sports',
    tagline: 'Precision for every day',
    description: 'Driver-focused coupés with track-honed chassis and everyday usability.',
    cover: 'porsche-911-turbo-s',
  },
  {
    slug: 'grand-tourer',
    name: 'Grand Tourers',
    short: 'Grand Tourer',
    tagline: 'Continents, crossed in style',
    description: 'Effortless long-distance pace wrapped in handcrafted luxury and timeless design.',
    cover: 'bentley-continental-gt',
  },
  {
    slug: 'luxury',
    name: 'Luxury Saloons',
    short: 'Luxury',
    tagline: 'The art of arrival',
    description: 'Whisper-quiet cabins, bespoke craftsmanship and a ride that floats above the road.',
    cover: 'rolls-royce-ghost',
  },
  {
    slug: 'suv',
    name: 'Luxury SUVs',
    short: 'SUV',
    tagline: 'Command every road',
    description: 'Commanding presence, supercar pace and genuine all-terrain capability.',
    cover: 'lamborghini-urus-performante',
  },
  {
    slug: 'electric',
    name: 'Electric',
    short: 'Electric',
    tagline: 'Silent, savage speed',
    description: 'Instant torque, zero tailpipe emissions and acceleration that rewrites the rulebook.',
    cover: 'porsche-taycan-turbo-s',
  },
]

export const categoriesBySlug = new Map(categories.map((category) => [category.slug, category]))

export const bodyTypes = ['Coupé', 'Convertible', 'Saloon', 'SUV']
export const powertrains = ['Petrol', 'Hybrid', 'Electric']
export const drivetrains = ['RWD', 'AWD']
export const conditions = ['New', 'Certified Pre-Owned']
