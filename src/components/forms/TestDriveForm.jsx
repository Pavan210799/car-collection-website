import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CalendarPlus, Check, CheckCircle2, Clock, Loader2, MapPin, Search, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { Img } from '../ui/Img'
import { Checkbox, Field } from './fields'
import { cars, carsById } from '../../data/cars'
import { driveExperiences, showrooms, timeSlots } from '../../data/bookings'
import { matchesSearch } from '../../lib/carQuery'
import { formatDate, formatPrice } from '../../lib/format'
import { bookingReference, rules, validate } from '../../lib/validation'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const STEPS = ['Car', 'Schedule', 'Details', 'Confirm']
const EMPTY_LIST = []

const upcomingDays = (count = 14) => {
  const days = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1)
    if (cursor.getDay() !== 0) days.push(new Date(cursor))
  }
  return days
}

const isoDay = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

/** Deterministic pseudo-availability so the same day always shows the same booked slots. */
const isSlotTaken = (day, slot, showroom) => {
  const seed = [...`${day}${slot}${showroom}`].reduce((total, char) => total + char.charCodeAt(0), 0)
  return seed % 5 === 0
}

const stepSchemas = [
  { car: rules.required('a car') },
  {
    experience: rules.required('an experience'),
    showroom: rules.required('a showroom'),
    date: rules.required('a date'),
    time: rules.required('a time slot'),
  },
  {
    name: rules.name,
    email: rules.email,
    phone: rules.phone,
    licence: rules.checked('A valid driving licence is required'),
  },
]

function downloadIcs(booking, car, showroom) {
  const [hours, minutes] = booking.time.split(':').map(Number)
  const start = new Date(`${booking.date}T00:00:00`)
  start.setHours(hours, minutes)
  const end = new Date(start.getTime() + 90 * 60 * 1000)
  const stamp = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aurion//Test Drive//EN',
    'BEGIN:VEVENT',
    `UID:${booking.reference}@aurion.motor`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:Aurion test drive — ${car.name}`,
    `LOCATION:${showroom.name}, ${showroom.address}`,
    `DESCRIPTION:Booking reference ${booking.reference}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `aurion-test-drive-${booking.reference}.ics`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function OptionCard({ selected, onClick, children, disabled, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`relative w-full rounded-2xl border p-4 text-left transition duration-300 disabled:cursor-not-allowed disabled:opacity-35 ${
        selected ? 'border-gold-400 bg-gold-400/[0.08] shadow-[0_0_0_4px_rgba(217,183,126,0.08)]' : 'border-ink-700/45 hover:border-ink-700/55 hover:bg-ink-850'
      } ${className}`}
    >
      {children}
      <span
        className={`absolute top-3 right-3 grid size-5 place-items-center rounded-full border transition ${
          selected ? 'border-gold-400 bg-gold-400 text-on-accent' : 'border-ink-700/55'
        }`}
      >
        <Check className={`size-3 transition-transform ${selected ? 'scale-100' : 'scale-0'}`} strokeWidth={3} />
      </span>
    </button>
  )
}

function StepError({ message }) {
  return message ? <p className="mt-2 text-xs font-medium text-ember">{message}</p> : null
}

export function TestDriveForm({ initialCar }) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [query, setQuery] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [booking, setBooking] = useState(null)
  const [, setBookings] = useLocalStorage('aurion:bookings', EMPTY_LIST)
  const [values, setValues] = useState({
    car: carsById.has(initialCar) ? initialCar : '',
    experience: driveExperiences[0].id,
    showroom: showrooms[0].id,
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
    licence: false,
  })

  const days = useMemo(() => upcomingDays(), [])
  const carOptions = useMemo(() => cars.filter((car) => matchesSearch(car, query)), [query])
  const car = carsById.get(values.car)
  const showroom = showrooms.find((item) => item.id === values.showroom)
  const experience = driveExperiences.find((item) => item.id === values.experience)

  const set = (key, value) => {
    setValues((current) => {
      const next = { ...current, [key]: value }
      if ((key === 'date' || key === 'showroom') && next.time && isSlotTaken(next.date, next.time, next.showroom)) next.time = ''
      return next
    })
    if (errors[key]) setErrors((current) => ({ ...current, [key]: '' }))
  }

  const goTo = (target) => {
    setDirection(target > step ? 1 : -1)
    setStep(target)
    setErrors({})
  }

  const nextStep = () => {
    const nextErrors = validate(values, stepSchemas[step] ?? {})
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    goTo(step + 1)
  }

  const confirm = () => {
    setStatus('submitting')
    setTimeout(() => {
      const record = { ...values, reference: bookingReference('AUR'), createdAt: new Date().toISOString() }
      setBookings((list) => [...list, record])
      setBooking(record)
      setStatus('success')
    }, 1300)
  }

  const restart = () => {
    setValues((current) => ({ ...current, car: '', date: '', time: '', notes: '' }))
    setBooking(null)
    setStatus('idle')
    goTo(0)
  }

  if (status === 'success' && booking) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[1.75rem] border border-ink-700/40 bg-ink-900">
        <div className="relative aspect-[21/9]">
          <Img src={car.images[0].src} alt={car.images[0].alt} sizes="(min-width: 1024px) 60vw, 100vw" position={car.images[0].position} className="size-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
        </div>
        <div className="flex flex-col items-center px-6 pb-10 text-center sm:px-10">
          <motion.span
            initial={{ scale: 0, rotate: -60 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.2 }}
            className="relative z-10 -mt-10 grid size-20 place-items-center rounded-full border-4 border-ink-900 bg-gold-400 text-on-accent"
          >
            <CheckCircle2 className="size-9" strokeWidth={1.75} />
          </motion.span>
          <h2 className="mt-5 font-display text-3xl font-bold text-bone">You’re booked in, {booking.name.split(' ')[0]}!</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist">
            Your {experience.name.toLowerCase()} in the {car.name} is confirmed for {formatDate(`${booking.date}T00:00:00`, { weekday: 'long', day: 'numeric', month: 'long' })} at {booking.time}, {showroom.name}. A confirmation has been sent to {booking.email}.
          </p>
          <p className="mt-5 rounded-full border border-ink-700/45 px-4 py-2 font-mono text-xs tracking-wider text-gold-500">Reference {booking.reference}</p>
          <div className="mt-8 flex flex-col gap-3 xs:flex-row">
            <Button onClick={() => downloadIcs(booking, car, showroom)}>
              <CalendarPlus className="size-4" /> Add to calendar
            </Button>
            <Button variant="outline" onClick={restart}>
              Book another drive
            </Button>
          </div>
          <Link to={`/cars/${car.slug}`} className="mt-6 text-sm font-semibold text-gold-400 underline-offset-4 hover:underline">
            Back to the {car.model}
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="min-w-0 rounded-[1.75rem] border border-ink-700/40 bg-ink-900/60 p-5 sm:p-8">
        <ol className="grid grid-cols-4 gap-2" aria-label="Booking progress">
          {STEPS.map((label, index) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => index < step && goTo(index)}
                disabled={index > step}
                aria-current={index === step ? 'step' : undefined}
                className="group w-full text-left disabled:cursor-default"
              >
                <span className="relative block h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.span
                    className="absolute inset-0 origin-left bg-gold-400"
                    initial={false}
                    animate={{ scaleX: index <= step ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className={`mt-2.5 flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.14em] uppercase sm:text-xs ${index <= step ? 'text-bone' : 'text-smoke'}`}>
                  <span className="hidden sm:inline">{String(index + 1).padStart(2, '0')}</span>
                  <span className="truncate">{label}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="relative mt-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-bone">Which car would you like to drive?</h2>
                  <label className="relative mt-5 block">
                    <span className="sr-only">Search cars</span>
                    <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-mist" />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search make or model…"
                      className="h-11 w-full rounded-full border border-ink-700/45 bg-ink-850 pr-4 pl-11 text-sm text-bone outline-none placeholder:text-smoke focus:border-gold-400"
                    />
                  </label>
                  <StepError message={errors.car} />
                  <div className="mt-5 grid max-h-[28rem] grid-cols-1 gap-3 overflow-y-auto overscroll-contain p-1 sm:grid-cols-2">
                    {carOptions.map((item) => (
                      <OptionCard key={item.id} selected={values.car === item.id} onClick={() => set('car', item.id)} className="flex min-w-0 items-center gap-3 !py-2.5 !pr-10 !pl-2.5">
                        <Img src={item.images[0].src} alt="" sizes="112px" position={item.images[0].position} className="h-16 w-24 shrink-0 rounded-xl" />
                        <span className="min-w-0">
                          <span className="block truncate text-[0.6rem] font-semibold tracking-[0.2em] text-gold-400 uppercase">{item.make}</span>
                          <span className="block truncate text-sm font-semibold text-bone">{item.model}</span>
                          <span className="block text-xs text-mist">{item.specs.power} hp · {item.status}</span>
                        </span>
                      </OptionCard>
                    ))}
                    {carOptions.length === 0 && <p className="col-span-full py-10 text-center text-sm text-mist">No cars match “{query}”.</p>}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-bone">Choose your experience</h2>
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {driveExperiences.map((item) => (
                        <OptionCard key={item.id} selected={values.experience === item.id} onClick={() => set('experience', item.id)}>
                          <span className="block pr-7 font-semibold text-bone">{item.name}</span>
                          <span className="mt-1 flex items-center gap-3 text-xs text-gold-500">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="size-3.5" /> {item.duration}
                            </span>
                            <span>{item.price ? formatPrice(item.price) : 'Complimentary'}</span>
                          </span>
                          <span className="mt-2 block text-xs leading-relaxed text-mist">{item.description}</span>
                        </OptionCard>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-mist uppercase">Showroom</p>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {showrooms.map((item) => (
                        <OptionCard key={item.id} selected={values.showroom === item.id} onClick={() => set('showroom', item.id)}>
                          <span className="block pr-7 font-semibold text-bone">{item.city}</span>
                          <span className="mt-1 flex items-start gap-1.5 text-xs text-mist">
                            <MapPin className="mt-0.5 size-3.5 shrink-0 text-gold-400" /> {item.name}
                          </span>
                        </OptionCard>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-mist uppercase">Date</p>
                    <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8">
                      {days.map((day) => {
                        const value = isoDay(day)
                        const selected = values.date === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => set('date', value)}
                            aria-pressed={selected}
                            aria-label={formatDate(day, { weekday: 'long', day: 'numeric', month: 'long' })}
                            className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border py-3 transition ${
                              selected ? 'border-gold-400 bg-gold-400 text-on-accent' : 'border-ink-700/45 text-bone hover:border-ink-700/60'
                            }`}
                          >
                            <span className={`text-[0.6rem] font-semibold tracking-[0.18em] uppercase ${selected ? 'text-on-accent/70' : 'text-smoke'}`}>
                              {formatDate(day, { weekday: 'short' })}
                            </span>
                            <span className="mt-1 font-display text-xl font-bold">{day.getDate()}</span>
                            <span className={`text-[0.6rem] font-semibold uppercase ${selected ? 'text-on-accent/70' : 'text-mist'}`}>{formatDate(day, { month: 'short' })}</span>
                          </button>
                        )
                      })}
                    </div>
                    <StepError message={errors.date} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-mist uppercase">Time</p>
                    {values.date ? (
                      <div className="mt-3 grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-7">
                        {timeSlots.map((slot) => {
                          const taken = isSlotTaken(values.date, slot, values.showroom)
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={taken}
                              onClick={() => set('time', slot)}
                              aria-pressed={values.time === slot}
                              title={taken ? 'Already booked' : undefined}
                              className={`min-h-11 rounded-xl border text-sm font-semibold transition disabled:cursor-not-allowed disabled:line-through disabled:opacity-30 ${
                                values.time === slot ? 'border-gold-400 bg-gold-400 text-on-accent' : 'border-ink-700/45 text-bone hover:border-ink-700/60'
                              }`}
                            >
                              {slot}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="mt-3 rounded-xl border border-dashed border-ink-700/45 px-4 py-3 text-sm text-smoke">Pick a date to see available times.</p>
                    )}
                    <StepError message={errors.time} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-bone">Your details</h2>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" required autoComplete="name" placeholder="Alex Morgan" value={values.name} onChange={(event) => set('name', event.target.value)} error={errors.name} />
                    <Field label="Email" required type="email" autoComplete="email" placeholder="alex@example.com" value={values.email} onChange={(event) => set('email', event.target.value)} error={errors.email} />
                    <Field label="Phone" required type="tel" autoComplete="tel" placeholder="+44 7700 900123" value={values.phone} onChange={(event) => set('phone', event.target.value)} error={errors.phone} className="sm:col-span-2" />
                    <Field
                      label="Notes for your specialist"
                      as="textarea"
                      rows={3}
                      hint="Optional"
                      placeholder="Preferred route, accessibility needs, part-exchange…"
                      value={values.notes}
                      onChange={(event) => set('notes', event.target.value)}
                      className="sm:col-span-2"
                    />
                  </div>
                  <div className="mt-6">
                    <Checkbox checked={values.licence} onChange={(event) => set('licence', event.target.checked)} error={errors.licence}>
                      I hold a full, valid driving licence (3+ years) and will bring it with a second photo ID.
                    </Checkbox>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-bone">Review &amp; confirm</h2>
                  <dl className="mt-6 divide-y divide-white/[0.07] rounded-2xl border border-ink-700/40">
                    {[
                      ['Car', car?.name, 0],
                      ['Experience', `${experience.name} · ${experience.duration}`, 1],
                      ['Showroom', `${showroom.name}, ${showroom.city}`, 1],
                      ['Date & time', `${formatDate(`${values.date}T00:00:00`, { weekday: 'long', day: 'numeric', month: 'long' })} at ${values.time}`, 1],
                      ['Driver', `${values.name} · ${values.email} · ${values.phone}`, 2],
                    ].map(([label, value, target]) => (
                      <div key={label} className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-5">
                        <dt className="w-28 shrink-0 text-xs font-semibold tracking-[0.12em] text-smoke uppercase">{label}</dt>
                        <dd className="min-w-0 flex-1 text-sm break-words text-bone">{value}</dd>
                        <button type="button" onClick={() => goTo(target)} className="self-start text-xs font-semibold text-gold-400 hover:text-gold-500 sm:self-center">
                          Edit
                        </button>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-mist">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-gold-400" />
                    {experience.price ? `${formatPrice(experience.price)} is payable at the showroom and fully refunded if you reserve the car.` : 'This experience is complimentary.'} Free cancellation up to 24 hours before.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink-700/40 pt-6">
          <Button variant="ghost" onClick={() => goTo(step - 1)} disabled={step === 0} className={step === 0 ? 'invisible' : ''}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={nextStep}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={confirm} disabled={status === 'submitting'}>
              {status === 'submitting' ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Confirming…
                </>
              ) : (
                <>
                  Confirm booking <Check className="size-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <aside className="min-w-0">
        <div className="overflow-hidden rounded-[1.75rem] border border-ink-700/40 bg-ink-900 lg:sticky lg:top-24">
          <div className="relative aspect-[16/10]">
            <AnimatePresence mode="popLayout" initial={false}>
              {car ? (
                <motion.div key={car.id} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                  <Img src={car.images[0].src} alt={car.images[0].alt} sizes="(min-width: 1024px) 24rem, 100vw" position={car.images[0].position} className="size-full" />
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center bg-ink-850 text-sm text-smoke">
                  Select a car to begin
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
          </div>
          <div className="p-6">
            <p className="eyebrow">Your booking</p>
            <p className="mt-2 font-display text-xl font-bold text-bone">{car?.name ?? 'No car selected'}</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li className="flex justify-between gap-4">
                <span className="text-mist">Experience</span>
                <span className="text-right font-semibold text-bone">{experience.name}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-mist">Showroom</span>
                <span className="text-right font-semibold text-bone">{showroom.city}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-mist">When</span>
                <span className="text-right font-semibold text-bone">
                  {values.date ? `${formatDate(`${values.date}T00:00:00`)}${values.time ? ` · ${values.time}` : ''}` : '—'}
                </span>
              </li>
              <li className="flex justify-between gap-4 border-t border-ink-700/40 pt-3">
                <span className="text-mist">Cost</span>
                <span className="text-right font-semibold text-gold-500">{experience.price ? formatPrice(experience.price) : 'Complimentary'}</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  )
}
