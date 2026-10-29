import { Link } from 'react-router-dom'

const base =
  'group/btn relative isolate inline-flex min-h-11 max-w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold tracking-wide whitespace-nowrap transition duration-300 ease-premium select-none disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]'

const variants = {
  primary: 'bg-gold-400 text-on-accent shadow-glow hover:-translate-y-0.5 hover:bg-gold-500',
  light: 'border border-ink-700/60 bg-ink-900 text-bone shadow-soft hover:-translate-y-0.5 hover:shadow-lift',
  outline: 'border border-bone/15 bg-ink-900/60 text-bone backdrop-blur-sm hover:border-bone/40 hover:bg-ink-900',
  ghost: 'text-bone hover:bg-ink-800/70',
  dark: 'bg-bone text-on-accent shadow-soft hover:-translate-y-0.5 hover:bg-night',
  danger: 'bg-ember text-on-accent hover:bg-ember/90',
}

const sizes = {
  sm: 'min-h-9 px-4 text-xs',
  md: '',
  lg: 'min-h-13 px-8 text-[0.95rem]',
}

export function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  shine = variant === 'primary' || variant === 'dark',
  ...rest
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <>
      {shine && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/3 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/45 to-transparent group-hover/btn:animate-sweep"
        />
      )}
      <span className="inline-flex min-w-0 items-center gap-2">{children}</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  )
}
