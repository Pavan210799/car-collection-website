const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^\+?[\d\s()-]{7,20}$/

export const rules = {
  name: (value) => (value.trim().length < 2 ? 'Please enter your full name' : ''),
  email: (value) => (!value.trim() ? 'Email is required' : EMAIL.test(value.trim()) ? '' : 'Enter a valid email address'),
  phone: (value) => {
    if (!value.trim()) return 'Phone number is required'
    const digits = value.replace(/\D/g, '')
    return PHONE.test(value.trim()) && digits.length >= 7 && digits.length <= 15 ? '' : 'Enter a valid phone number'
  },
  required: (label) => (value) => (value ? '' : `Please select ${label}`),
  message: (value) => (value.trim().length < 10 ? 'Tell us a little more (at least 10 characters)' : ''),
  checked: (message) => (value) => (value ? '' : message),
}

export function validate(values, schema) {
  return Object.fromEntries(
    Object.entries(schema)
      .map(([key, rule]) => [key, rule(values[key] ?? '')])
      .filter(([, message]) => message),
  )
}

export const bookingReference = (prefix = 'VLC') =>
  `${prefix}-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`
