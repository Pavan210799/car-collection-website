/**
 * Client-side demo authentication. Accounts live in localStorage with SHA-256 password hashes;
 * there is no server, so this is a front-end experience rather than real security.
 */
const USERS_KEY = 'aurion:users'
const SESSION_KEY = 'aurion:session'
const RESET_KEY = 'aurion:password-reset'
const RESET_TTL_MS = 30 * 60 * 1000

export const DEMO_ACCOUNT = { name: 'Alex Morgan', email: 'demo@aurion.motor', password: 'Aurion@2026' }

const normalise = (email) => email.trim().toLowerCase()

function readJson(storage, key, fallback) {
  try {
    const raw = storage?.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(storage, key, value) {
  try {
    if (value === null) storage?.removeItem(key)
    else storage?.setItem(key, JSON.stringify(value))
  } catch {
    /* storage may be unavailable (private mode / quota) */
  }
}

const local = () => (typeof window === 'undefined' ? null : window.localStorage)
const session = () => (typeof window === 'undefined' ? null : window.sessionStorage)

async function hash(value) {
  const data = new TextEncoder().encode(`aurion::${value}`)
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', data)
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  }
  let h = 0x811c9dc5
  for (const byte of data) h = Math.imul(h ^ byte, 0x01000193)
  return `fnv-${(h >>> 0).toString(16)}`
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function readUsers() {
  const users = readJson(local(), USERS_KEY, [])
  if (users.some((user) => user.email === DEMO_ACCOUNT.email)) return users
  return [...users, { name: DEMO_ACCOUNT.name, email: DEMO_ACCOUNT.email, demo: true }]
}

const findUser = (email) => readUsers().find((user) => user.email === normalise(email))

async function passwordMatches(user, password) {
  if (user.demo) return password === DEMO_ACCOUNT.password
  return user.passwordHash === (await hash(password))
}

export class AuthError extends Error {
  constructor(message, field) {
    super(message)
    this.field = field
  }
}

export async function authenticate(email, password) {
  await wait(700)
  const user = findUser(email)
  if (!user) throw new AuthError('No account found with this email', 'email')
  if (!(await passwordMatches(user, password))) throw new AuthError('Incorrect password. Try again or reset it.', 'password')
  return { name: user.name, email: user.email }
}

export async function register({ name, email, password }) {
  await wait(900)
  if (findUser(email)) throw new AuthError('An account with this email already exists', 'email')
  const user = { name: name.trim(), email: normalise(email), passwordHash: await hash(password), createdAt: new Date().toISOString() }
  writeJson(local(), USERS_KEY, [...readJson(local(), USERS_KEY, []), user])
  return { name: user.name, email: user.email }
}

export async function requestPasswordReset(email) {
  await wait(900)
  const user = findUser(email)
  if (!user) return null
  const token = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('')
  writeJson(local(), RESET_KEY, { email: user.email, token, expiresAt: Date.now() + RESET_TTL_MS })
  return token
}

export function resetRequestFor(token) {
  const request = readJson(local(), RESET_KEY, null)
  if (!token || !request || request.token !== token || request.expiresAt < Date.now()) return null
  return request
}

export async function resetPassword(token, password) {
  await wait(900)
  const request = resetRequestFor(token)
  if (!request) throw new AuthError('This reset link is invalid or has expired')
  const passwordHash = await hash(password)
  const users = readUsers().map(({ demo, ...user }) => (user.email === request.email ? { ...user, passwordHash } : demo ? { ...user, demo } : user))
  writeJson(local(), USERS_KEY, users)
  writeJson(local(), RESET_KEY, null)
  return request.email
}

export function readSession() {
  return readJson(local(), SESSION_KEY, null) ?? readJson(session(), SESSION_KEY, null)
}

export function writeSession(user, remember) {
  writeJson(local(), SESSION_KEY, null)
  writeJson(session(), SESSION_KEY, null)
  if (user) writeJson(remember ? local() : session(), SESSION_KEY, { ...user, signedInAt: new Date().toISOString() })
}

export const passwordChecks = [
  { id: 'length', label: '8+ characters', test: (value) => value.length >= 8 },
  { id: 'case', label: 'Upper & lowercase', test: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { id: 'number', label: 'A number', test: (value) => /\d/.test(value) },
  { id: 'symbol', label: 'A symbol', test: (value) => /[^A-Za-z0-9]/.test(value) },
]

export function passwordStrength(value) {
  if (typeof value !== 'string' || !value) return 0
  const passed = passwordChecks.filter((check) => check.test(value)).length
  const score = passed + (value.length >= 12 ? 1 : 0) - (value.length < 8 ? 1 : 0)
  return Math.max(0, Math.min(4, score))
}

export const passwordRule = (value) => {
  if (!value) return 'Password is required'
  const missing = passwordChecks.slice(0, 3).find((check) => !check.test(value))
  return missing ? `Password needs ${missing.label.toLowerCase()}` : ''
}

export function safeRedirect(value) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /^\/(login|signup|forgot-password|reset-password)/.test(value)) return '/'
  return value
}
