import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import { CheckCircle2, LockKeyhole, ShieldAlert, ShieldCheck } from 'lucide-react'
import { AuthField, AuthHeading, AuthSubmit, PasswordMeter, StatusIcon, rise, stagger } from '../../components/auth/authUi'
import { Button } from '../../components/ui/Button'
import { passwordRule, resetPassword, resetRequestFor } from '../../lib/auth'

const maskEmail = (email) => {
  const [name, domain] = email.split('@')
  return `${name.slice(0, 2)}${'•'.repeat(Math.max(1, name.length - 2))}@${domain}`
}

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [request] = useState(() => resetRequestFor(token))
  const [scope, animate] = useAnimate()
  const [values, setValues] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [done, setDone] = useState(false)

  const schema = {
    password: passwordRule,
    confirm: (value) => (!value ? 'Please confirm your new password' : value !== values.password ? 'Passwords don’t match' : ''),
  }

  const set = (key) => (event) => {
    const { value } = event.target
    setValues((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: schema[key](value) }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const nextErrors = Object.fromEntries(Object.entries(schema).map(([key, rule]) => [key, rule(values[key])]).filter(([, message]) => message))
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      animate(scope.current, { x: [0, -10, 10, -6, 6, -2, 0] }, { duration: 0.45 })
      form.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    setStatus('loading')
    try {
      await resetPassword(token, values.password)
      setStatus('success')
      setTimeout(() => setDone(true), 600)
    } catch (error) {
      setStatus('idle')
      setErrors({ password: error.message })
    }
  }

  if (!request) {
    return (
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center text-center">
        <StatusIcon icon={ShieldAlert} tone="ember" />
        <motion.h1 variants={rise} className="mt-7 font-display text-[clamp(1.8rem,4vw,2.4rem)] leading-tight font-extrabold tracking-tight text-bone">
          Link expired or invalid
        </motion.h1>
        <motion.p variants={rise} className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-mist">
          Reset links work once and expire after 30 minutes. Request a fresh one and you’ll be back in no time.
        </motion.p>
        <motion.div variants={rise} className="mt-8 w-full xs:w-auto">
          <Button to="/forgot-password" variant="dark" size="lg" className="w-full xs:w-auto">
            Request a new link
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <motion.div key="done" variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center text-center">
          <StatusIcon icon={CheckCircle2} tone="volt" />
          <motion.h1 variants={rise} className="mt-7 font-display text-[clamp(1.8rem,4vw,2.4rem)] leading-tight font-extrabold tracking-tight text-bone">
            Password <span className="text-gradient-animated">updated</span>
          </motion.h1>
          <motion.p variants={rise} className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-mist">
            Your new password is set. Sign in with it to get back to your garage.
          </motion.p>
          <motion.div variants={rise} className="mt-8 w-full xs:w-auto">
            <Button to={`/login?email=${encodeURIComponent(request.email)}`} variant="dark" size="lg" className="w-full xs:w-auto">
              Continue to sign in
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div key="form" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }}>
          <AuthHeading eyebrow="Secure reset" title="Choose a new" accent="password">
            Make it at least 8 characters with upper and lowercase letters and a number.
          </AuthHeading>
          <motion.p
            variants={rise}
            className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-ink-700/60 bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-mist shadow-soft"
          >
            <ShieldCheck className="size-3.5 shrink-0 text-volt" />
            <span className="truncate">Resetting {maskEmail(request.email)}</span>
          </motion.p>
          <div ref={scope}>
            <form noValidate onSubmit={onSubmit} className="mt-6 grid gap-5">
              <AuthField
                label="New password"
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
                label="Confirm new password"
                icon={ShieldCheck}
                type="password"
                name="confirm"
                autoComplete="new-password"
                placeholder="Repeat your new password"
                value={values.confirm}
                onChange={set('confirm')}
                error={errors.confirm}
              />
              <AuthSubmit status={status} loadingLabel="Updating…" successLabel="Password updated">
                Update password
              </AuthSubmit>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
