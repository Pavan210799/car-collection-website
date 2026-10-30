import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import { ArrowRight, Inbox, Mail, MailCheck } from 'lucide-react'
import { AuthField, AuthHeading, AuthSubmit, EASE, StatusIcon, rise, stagger } from '../../components/auth/authUi'
import { requestPasswordReset } from '../../lib/auth'
import { rules } from '../../lib/validation'

const RESEND_S = 30

export default function ForgotPassword() {
  const [scope, animate] = useAnimate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle')
  const [sent, setSent] = useState(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (!cooldown) return undefined
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const send = async () => {
    setStatus('loading')
    const token = await requestPasswordReset(email)
    setStatus('idle')
    setSent({ email: email.trim(), token })
    setCooldown(RESEND_S)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const message = rules.email(email)
    setError(message)
    if (message) {
      animate(scope.current, { x: [0, -10, 10, -6, 6, -2, 0] }, { duration: 0.45 })
      event.currentTarget.querySelector('input')?.focus()
      return
    }
    send()
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div key="sent" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center text-center">
          <StatusIcon icon={MailCheck} tone="volt" />
          <motion.h1 variants={rise} className="mt-7 font-display text-[clamp(1.8rem,4vw,2.4rem)] leading-tight font-extrabold tracking-tight text-bone">
            Check your <span className="text-gradient-animated">inbox</span>
          </motion.h1>
          <motion.p variants={rise} className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-mist">
            If an account exists for <span className="font-semibold break-all text-bone">{sent.email}</span>, a reset link is on its way. It expires in 30 minutes.
          </motion.p>

          <motion.div variants={rise} className="spotlight mt-7 w-full rounded-2xl border border-ink-700/60 bg-ink-900 p-4 text-left shadow-soft">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-volt/10 text-volt">
                <Inbox className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-bone">Demo inbox</p>
                <p className="mt-0.5 text-xs leading-relaxed text-mist">
                  {sent.token
                    ? 'This demo has no email server, so your reset link is delivered here instead.'
                    : 'No account matched that email. Try the demo account or create a new account.'}
                </p>
                {sent.token ? (
                  <Link
                    to={`/reset-password?token=${sent.token}`}
                    className="group relative z-10 mt-3 inline-flex items-center gap-2 rounded-full bg-bone px-4 py-2 text-xs font-semibold text-on-accent transition hover:bg-night"
                  >
                    Open reset link <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <Link to="/signup" className="link-underline relative z-10 mt-3 inline-block text-xs font-semibold text-gold-500">
                    Create an account
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={rise} className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <button
              type="button"
              disabled={cooldown > 0 || status === 'loading'}
              onClick={send}
              className="font-semibold text-bone transition hover:text-gold-500 disabled:cursor-not-allowed disabled:text-smoke"
            >
              {status === 'loading' ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend link'}
            </button>
            <span aria-hidden="true" className="text-ink-600">
              •
            </span>
            <button type="button" onClick={() => setSent(null)} className="link-underline font-semibold text-mist hover:text-bone">
              Use a different email
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div key="form" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -10, transition: { duration: 0.25, ease: EASE } }}>
          <AuthHeading eyebrow="Account recovery" title="Forgot your" accent="password?">
            No problem. Enter the email you signed up with and we’ll send you a secure link to choose a new one.
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
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (error) setError(rules.email(event.target.value))
                }}
                error={error}
              />
              <AuthSubmit status={status} loadingLabel="Sending link…">
                Send reset link
              </AuthSubmit>
            </form>
          </div>
          <motion.p variants={rise} className="mt-6 text-center text-sm text-mist">
            Remembered it?{' '}
            <Link to="/login" className="link-underline font-semibold text-bone">
              Back to sign in
            </Link>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
