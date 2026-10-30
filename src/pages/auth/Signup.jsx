import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, useAnimate } from 'framer-motion'
import { LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { AuthField, AuthHeading, AuthSubmit, PasswordMeter, rise, stagger } from '../../components/auth/authUi'
import { Checkbox } from '../../components/forms/fields'
import { useAuth, useToast } from '../../context/contexts'
import { passwordRule, register } from '../../lib/auth'
import { rules, validate } from '../../lib/validation'

const schema = {
  name: rules.name,
  email: rules.email,
  password: passwordRule,
  terms: rules.checked('Please accept the terms to continue'),
}

export default function Signup() {
  const { signIn } = useAuth()
  const { notify } = useToast()
  const [params] = useSearchParams()
  const [scope, animate] = useAnimate()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '', terms: false })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const fullSchema = { ...schema, confirm: (value) => (!value ? 'Please confirm your password' : value !== values.password ? 'Passwords don’t match' : '') }

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setValues((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: fullSchema[key]?.(value) ?? '' }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const nextErrors = validate(values, fullSchema)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      animate(scope.current, { x: [0, -10, 10, -6, 6, -2, 0] }, { duration: 0.45 })
      form.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    setStatus('loading')
    try {
      const user = await register(values)
      setStatus('success')
      setTimeout(() => {
        signIn(user, true)
        notify({ title: `Welcome to Aurion, ${user.name.split(' ')[0]}`, description: 'Your account is ready. Start exploring the collection.' })
      }, 700)
    } catch (error) {
      setStatus('idle')
      setErrors({ [error.field ?? 'email']: error.message })
      animate(scope.current, { x: [0, -10, 10, -6, 6, -2, 0] }, { duration: 0.45 })
    }
  }

  const redirect = params.get('redirect')

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <AuthHeading eyebrow="Join the club" title="Create your" accent="account">
        Save favourites, compare up to three cars side by side and book private test drives in seconds.
      </AuthHeading>

      <div ref={scope}>
        <form noValidate onSubmit={onSubmit} className="mt-7 grid gap-5">
          <AuthField label="Full name" icon={UserRound} name="name" autoComplete="name" placeholder="Alex Morgan" value={values.name} onChange={set('name')} error={errors.name} />
          <AuthField
            label="Email"
            icon={Mail}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={set('email')}
            error={errors.email}
          />
          <AuthField
            label="Password"
            icon={LockKeyhole}
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={values.password}
            onChange={set('password')}
            error={errors.password}
          />
          <PasswordMeter value={values.password} />
          <AuthField
            label="Confirm password"
            icon={ShieldCheck}
            type="password"
            name="confirm"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={values.confirm}
            onChange={set('confirm')}
            error={errors.confirm}
          />
          <motion.div variants={rise}>
            <Checkbox name="terms" checked={values.terms} onChange={set('terms')} error={errors.terms}>
              I agree to the{' '}
              <Link to="/terms" target="_blank" rel="noreferrer" className="link-underline font-semibold whitespace-nowrap text-bone">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" target="_blank" rel="noreferrer" className="link-underline font-semibold whitespace-nowrap text-bone">
                Privacy Policy
              </Link>
              .
            </Checkbox>
          </motion.div>
          <AuthSubmit status={status} loadingLabel="Creating account…" successLabel="Account created">
            Create account
          </AuthSubmit>
        </form>
      </div>

      <motion.p variants={rise} className="mt-6 text-center text-sm text-mist">
        Already a member?{' '}
        <Link to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="link-underline font-semibold text-bone">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  )
}
