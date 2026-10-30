import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, useAnimate } from 'framer-motion'
import { LockKeyhole, Mail } from 'lucide-react'
import { AuthField, AuthHeading, AuthSubmit, rise, stagger } from '../../components/auth/authUi'
import { Checkbox } from '../../components/forms/fields'
import { useAuth, useToast } from '../../context/contexts'
import { authenticate } from '../../lib/auth'
import { rules, validate } from '../../lib/validation'

const schema = {
  email: rules.email,
  password: (value) => (value ? '' : 'Password is required'),
}

export default function Login() {
  const { signIn } = useAuth()
  const { notify } = useToast()
  const [params] = useSearchParams()
  const [scope, animate] = useAnimate()
  const [values, setValues] = useState({ email: params.get('email') ?? '', password: '', remember: true })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const shake = () => animate(scope.current, { x: [0, -10, 10, -6, 6, -2, 0] }, { duration: 0.45 })

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setValues((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: schema[key]?.(value) ?? '' }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const nextErrors = validate(values, schema)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      shake()
      form.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    setStatus('loading')
    try {
      const user = await authenticate(values.email, values.password)
      setStatus('success')
      setTimeout(() => {
        signIn(user, values.remember)
        notify({ title: `Welcome back, ${user.name.split(' ')[0]}`, description: 'You’re signed in to your Aurion garage.' })
      }, 650)
    } catch (error) {
      setStatus('idle')
      setErrors({ [error.field ?? 'email']: error.message })
      shake()
    }
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <AuthHeading eyebrow="Welcome back" title="Sign in to your" accent="garage">
        Pick up where you left off — your wishlist, comparisons and test drives are waiting.
      </AuthHeading>

      <div ref={scope}>
        <form noValidate onSubmit={onSubmit} className="mt-7 grid gap-5">
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
            autoComplete="current-password"
            placeholder="Your password"
            value={values.password}
            onChange={set('password')}
            error={errors.password}
            aside={
              <Link to="/forgot-password" className="link-underline ml-auto text-xs font-semibold text-gold-500 hover:text-gold-600">
                Forgot password?
              </Link>
            }
          />
          <motion.div variants={rise}>
            <Checkbox name="remember" checked={values.remember} onChange={set('remember')}>
              Keep me signed in on this device
            </Checkbox>
          </motion.div>
          <AuthSubmit status={status} loadingLabel="Signing in…" successLabel="Welcome back">
            Sign in
          </AuthSubmit>
        </form>
      </div>

      <motion.p variants={rise} className="mt-6 text-center text-sm text-mist">
        New to Aurion?{' '}
        <Link to={`/signup${params.get('redirect') ? `?redirect=${encodeURIComponent(params.get('redirect'))}` : ''}`} className="link-underline font-semibold text-bone">
          Create an account
        </Link>
      </motion.p>
    </motion.div>
  )
}
