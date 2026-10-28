import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { Button } from '../ui/Button'
import { Checkbox, ChoiceGroup, Field } from './fields'
import { cars, carsById } from '../../data/cars'
import { contactMethods, enquiryTopics, purchaseTimeframes } from '../../data/bookings'
import { bookingReference, rules, validate } from '../../lib/validation'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const EMPTY_LIST = []

const initialValues = (carId) => ({
  name: '',
  email: '',
  phone: '',
  car: carId ?? '',
  topic: enquiryTopics[0],
  timeframe: purchaseTimeframes[1],
  method: contactMethods[0],
  message: '',
  consent: false,
})

const schema = {
  name: rules.name,
  email: rules.email,
  phone: rules.phone,
  topic: rules.required('a topic'),
  message: rules.message,
  consent: rules.checked('Please accept to be contacted'),
}

export function EnquiryForm({ carId, onDone, compact = false }) {
  const [values, setValues] = useState(() => initialValues(carId))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [reference, setReference] = useState('')
  const [, setEnquiries] = useLocalStorage('veloce:enquiries', EMPTY_LIST)

  const set = (key) => (event) => {
    const value = event?.target ? (event.target.type === 'checkbox' ? event.target.checked : event.target.value) : event
    setValues((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: schema[key] ? schema[key](value) : '' }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate(values, schema)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      event.currentTarget.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    setStatus('submitting')
    setTimeout(() => {
      const ref = bookingReference('ENQ')
      setReference(ref)
      setEnquiries((list) => [...list, { ...values, reference: ref, createdAt: new Date().toISOString() }])
      setStatus('success')
    }, 1100)
  }

  const reset = () => {
    setValues(initialValues(carId))
    setErrors({})
    setStatus('idle')
  }

  const car = carsById.get(values.car)

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center px-2 py-10 text-center"
        >
          <motion.span
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
            className="grid size-20 place-items-center rounded-full bg-gold-400/15 text-gold-400"
          >
            <CheckCircle2 className="size-10" strokeWidth={1.5} />
          </motion.span>
          <h3 className="mt-6 font-display text-2xl font-bold text-bone">Thank you, {values.name.split(' ')[0]}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist">
            Your enquiry{car ? ` about the ${car.name}` : ''} has been received. A specialist will reach you by {values.method.toLowerCase()} within two business hours.
          </p>
          <p className="mt-5 rounded-full border border-white/10 px-4 py-2 font-mono text-xs tracking-wider text-gold-200">Reference {reference}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={reset}>
              Send another
            </Button>
            {onDone && <Button onClick={onDone}>Done</Button>}
          </div>
        </motion.div>
      ) : (
        <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, y: -10 }} className="grid gap-5">
          <div className={`grid gap-5 ${compact ? '' : 'sm:grid-cols-2'}`}>
            <Field label="Full name" required name="name" autoComplete="name" placeholder="Alex Morgan" value={values.name} onChange={set('name')} error={errors.name} />
            <Field label="Email" required type="email" name="email" autoComplete="email" placeholder="alex@example.com" value={values.email} onChange={set('email')} error={errors.email} />
            <Field label="Phone" required type="tel" name="phone" autoComplete="tel" placeholder="+44 7700 900123" value={values.phone} onChange={set('phone')} error={errors.phone} />
            <Field label="Car of interest" as="select" name="car" value={values.car} onChange={set('car')} hint="Optional">
              <option value="">Not sure yet — advise me</option>
              {cars.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Field>
            <Field label="Topic" as="select" required name="topic" value={values.topic} onChange={set('topic')} error={errors.topic}>
              {enquiryTopics.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </Field>
            <Field label="Timeframe" as="select" name="timeframe" value={values.timeframe} onChange={set('timeframe')}>
              {purchaseTimeframes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Field>
          </div>
          <ChoiceGroup label="Preferred contact" options={contactMethods} value={values.method} onChange={set('method')} />
          <Field
            label="Message"
            as="textarea"
            required
            name="message"
            placeholder="Tell us what you’re looking for — specification, budget, part-exchange…"
            value={values.message}
            onChange={set('message')}
            error={errors.message}
            hint={`${values.message.length}/600`}
            maxLength={600}
          />
          <Checkbox checked={values.consent} onChange={set('consent')} error={errors.consent} name="consent">
            I agree to be contacted by a Veloce specialist about this enquiry. We never share your details.
          </Checkbox>
          <Button type="submit" size="lg" disabled={status === 'submitting'} className="w-full sm:w-auto sm:justify-self-start">
            {status === 'submitting' ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                Send enquiry <Send className="size-4" />
              </>
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
