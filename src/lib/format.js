const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const numberFormatter = new Intl.NumberFormat('en-US')

export const formatPrice = (value) => currencyFormatter.format(value)

export const formatCompactPrice = (value) => compactCurrencyFormatter.format(value)

export const formatNumber = (value) => numberFormatter.format(value)

export const formatDate = (value, options = { weekday: 'short', day: 'numeric', month: 'short' }) =>
  new Intl.DateTimeFormat('en-US', options).format(typeof value === 'string' ? new Date(value) : value)

export const pluralize = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`
