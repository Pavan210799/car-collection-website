export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'power-desc', label: 'Most Powerful' },
  { value: 'acceleration-asc', label: 'Quickest 0–100' },
  { value: 'speed-desc', label: 'Highest Top Speed' },
  { value: 'year-desc', label: 'Newest First' },
  { value: 'name-asc', label: 'Name: A to Z' },
]

export const MULTI_KEYS = ['brand', 'category', 'body', 'powertrain', 'drivetrain', 'condition']

export const EMPTY_FILTERS = {
  q: '',
  brand: [],
  category: [],
  body: [],
  powertrain: [],
  drivetrain: [],
  condition: [],
  minPrice: null,
  maxPrice: null,
  minPower: null,
  sort: 'featured',
}

const toNumber = (value) => {
  if (value === null || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export function filtersFromParams(params) {
  const filters = { ...EMPTY_FILTERS }
  filters.q = params.get('q') ?? ''
  MULTI_KEYS.forEach((key) => {
    const raw = params.get(key)
    filters[key] = raw ? raw.split(',').filter(Boolean) : []
  })
  filters.minPrice = toNumber(params.get('minPrice'))
  filters.maxPrice = toNumber(params.get('maxPrice'))
  filters.minPower = toNumber(params.get('minPower'))
  const sort = params.get('sort')
  filters.sort = SORT_OPTIONS.some((option) => option.value === sort) ? sort : 'featured'
  return filters
}

export function paramsFromFilters(filters) {
  const params = new URLSearchParams()
  if (filters.q.trim()) params.set('q', filters.q.trim())
  MULTI_KEYS.forEach((key) => {
    if (filters[key].length) params.set(key, filters[key].join(','))
  })
  ;['minPrice', 'maxPrice', 'minPower'].forEach((key) => {
    if (filters[key] !== null) params.set(key, String(filters[key]))
  })
  if (filters.sort !== 'featured') params.set('sort', filters.sort)
  return params
}

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const searchableText = (car) =>
  normalize([car.name, car.make, car.model, car.tagline, car.category, car.body, car.powertrain, car.engine].join(' '))

export function matchesSearch(car, query) {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return true
  const haystack = searchableText(car)
  return terms.every((term) => haystack.includes(term))
}

export function applyFilters(cars, filters) {
  return cars.filter((car) => {
    if (!matchesSearch(car, filters.q)) return false
    if (filters.brand.length && !filters.brand.includes(car.brand)) return false
    if (filters.category.length && !filters.category.includes(car.category)) return false
    if (filters.body.length && !filters.body.includes(car.body)) return false
    if (filters.powertrain.length && !filters.powertrain.includes(car.powertrain)) return false
    if (filters.drivetrain.length && !filters.drivetrain.includes(car.drivetrain)) return false
    if (filters.condition.length && !filters.condition.includes(car.condition)) return false
    if (filters.minPrice !== null && car.price < filters.minPrice) return false
    if (filters.maxPrice !== null && car.price > filters.maxPrice) return false
    if (filters.minPower !== null && car.specs.power < filters.minPower) return false
    return true
  })
}

const sorters = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating || b.price - a.price,
  'price-desc': (a, b) => b.price - a.price,
  'price-asc': (a, b) => a.price - b.price,
  'power-desc': (a, b) => b.specs.power - a.specs.power,
  'acceleration-asc': (a, b) => a.specs.acceleration - b.specs.acceleration,
  'speed-desc': (a, b) => b.specs.topSpeed - a.specs.topSpeed,
  'year-desc': (a, b) => b.year - a.year || b.price - a.price,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
}

export const sortCars = (cars, sort) => cars.toSorted(sorters[sort] ?? sorters.featured)

export function countActiveFilters(filters) {
  return (
    MULTI_KEYS.reduce((total, key) => total + filters[key].length, 0) +
    (filters.q.trim() ? 1 : 0) +
    (filters.minPrice !== null ? 1 : 0) +
    (filters.maxPrice !== null ? 1 : 0) +
    (filters.minPower !== null ? 1 : 0)
  )
}

export function facetCounts(cars, key) {
  return cars.reduce((counts, car) => {
    counts[car[key]] = (counts[car[key]] ?? 0) + 1
    return counts
  }, {})
}
