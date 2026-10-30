import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, AtSign, Briefcase, Camera, Mail, Phone, Play } from 'lucide-react'
import { Container } from '../ui/Container'
import { Logo } from './Logo'
import { Button } from '../ui/Button'
import { siteMeta } from '../../data/site'
import { contactInfo, footerColumns, legalLinks, newsletter, socialLinks } from '../../data/support'
import { useToast } from '../../context/contexts'
import { rules } from '../../lib/validation'

const socialIcons = { Camera, Play, AtSign, Briefcase }

export function Footer() {
  const { notify } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const onNewsletter = (event) => {
    event.preventDefault()
    const message = rules.email(email)
    if (message) {
      setError(message)
      return
    }
    setError('')
    notify({ title: 'You’re on the list', description: 'We’ll email you when rare cars land in the collection.', tone: 'success' })
    setEmail('')
  }

  return (
    <footer className="relative isolate overflow-hidden border-t border-ink-700/60 bg-ink-900 pb-24 sm:pb-0">
      <div aria-hidden="true" className="mesh-glow absolute inset-0 -z-10 opacity-70" />
      <Container className="pt-16 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="spotlight hover-panel grid gap-8 rounded-[2rem] border border-ink-700/60 bg-ink-950 p-6 shadow-soft sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center"
        >
          <div className="min-w-0">
            <p className="eyebrow">Newsletter</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-bone sm:text-3xl">{newsletter.title}</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-mist">{newsletter.description}</p>
          </div>
          <form onSubmit={onNewsletter} noValidate className="min-w-0">
            <div className="flex w-full min-w-0 flex-col gap-2 xs:flex-row">
              <label className="sr-only" htmlFor="footer-email">
                Email
              </label>
              <input
                id="footer-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (error) setError('')
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'footer-email-error' : undefined}
                placeholder="you@example.com"
                className={`h-12 w-full min-w-0 shrink-0 rounded-full xs:w-auto xs:flex-1 border bg-ink-900 px-5 text-sm text-bone outline-none transition placeholder:text-smoke focus:border-gold-400 focus:shadow-soft ${error ? 'border-ember' : 'border-ink-700/70'}`}
              />
              <Button type="submit" size="lg" className="shrink-0">
                Subscribe
              </Button>
            </div>
            {error && (
              <p id="footer-email-error" className="mt-2 pl-5 text-xs font-medium text-ember">
                {error}
              </p>
            )}
          </form>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16">
          <div className="min-w-0">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist">{siteMeta.description}</p>
            <div className="mt-5 space-y-2 text-sm">
              <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-bone transition hover:text-gold-500">
                <Phone className="size-4 text-volt" /> {contactInfo.phone}
              </a>
              <a href={`mailto:${contactInfo.email}`} className="flex min-w-0 items-center gap-2 text-bone transition hover:text-gold-500">
                <Mail className="size-4 shrink-0 text-volt" /> <span className="truncate">{contactInfo.email}</span>
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map((item) => {
                const Icon = socialIcons[item.icon]
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="grid size-10 place-items-center rounded-full border border-ink-700/70 bg-ink-900 text-mist transition duration-300 hover:-translate-y-1 hover:border-bone hover:bg-bone hover:text-on-accent"
                    >
                      {Icon && <Icon className="size-4" />}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="grid gap-10 xs:grid-cols-2 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title} className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.2em] text-smoke uppercase">{column.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="group inline-flex items-center gap-1 text-sm font-medium text-bone transition hover:text-gold-500">
                        <span className="bg-gradient-to-r from-gold-400 to-gold-400 bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                          {link.label}
                        </span>
                        <ArrowUpRight className="size-3 opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-ink-700/60 py-8 sm:flex-row">
          <p className="text-center text-xs text-smoke">
            © {new Date().getFullYear()} {siteMeta.legalName} Photography courtesy of Unsplash creators.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="link-underline text-xs text-mist hover:text-bone">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div aria-hidden="true" className="pointer-events-none overflow-hidden select-none">
        <motion.p
          initial={{ y: '40%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-outline -mb-[0.18em] text-center font-display text-[clamp(4.5rem,21vw,20rem)] leading-[0.85] font-extrabold tracking-tight whitespace-nowrap"
        >
          {siteMeta.name.toUpperCase()}
        </motion.p>
      </div>
    </footer>
  )
}
