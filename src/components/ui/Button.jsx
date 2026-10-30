import { Link } from 'react-router-dom'

const base =
  'group/btn relative isolate inline-flex min-h-11 max-w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold tracking-wide whitespace-nowrap transition duration-300 ease-premium select-none disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:scale-110'

const variants = {
  primary: 'bg-gold-400 text-on-accent shadow-glow hover:-translate-y-0.5 hover:bg-gold-500 hover:shadow-[0_18px_40px_-12px_rgb(226_68_92/0.65)]',
  light: 'border border-ink-700/60 bg-ink-900 text-bone shadow-soft hover:-translate-y-0.5 hover:border-gold-400/40 hover:text-gold-500 hover:shadow-lift',
  outline: 'border border-bone/15 bg-ink-900/60 text-bone backdrop-blur-sm hover:-translate-y-0.5 hover:border-gold-400/50 hover:bg-ink-900 hover:shadow-soft',
  ghost: 'text-bone hover:-translate-y-0.5 hover:bg-ink-800/70 hover:text-gold-500',
  dark: 'bg-bone text-on-accent shadow-soft hover:-translate-y-0.5 hover:bg-night hover:shadow-[0_18px_40px_-14px_rgb(20_20_22/0.55)]',
  danger: 'bg-ember text-on-accent hover:-translate-y-0.5 hover:bg-ember/90 hover:shadow-[0_16px_36px_-12px_rgb(190_40_40/0.55)]',
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
  shine = true,
  ...rest
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <>
      {shine && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/3 -translate-x-[150%] bg-gradient-to-r from-transparent to-transparent group-hover/btn:animate-sweep ${
            variant === 'light' || variant === 'outline' || variant === 'ghost' ? 'via-gold-400/15' : 'via-white/45'
          }`}
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
