import { Link } from 'react-router-dom'

const base =
  'group/btn relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold tracking-wide whitespace-nowrap transition duration-300 ease-premium select-none disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97]'

const variants = {
  primary:
    'bg-gold-400 text-ink-950 shadow-[0_10px_40px_-12px_rgba(217,183,126,0.7)] hover:bg-gold-300 hover:shadow-[0_14px_50px_-10px_rgba(217,183,126,0.85)]',
  light: 'bg-bone text-ink-950 hover:bg-white',
  outline: 'border border-white/20 text-bone hover:border-gold-400/70 hover:text-gold-200 hover:bg-white/[0.03]',
  ghost: 'text-bone hover:bg-white/[0.06]',
  dark: 'bg-ink-800 text-bone border border-white/10 hover:border-white/25 hover:bg-ink-700',
  danger: 'bg-ember text-bone hover:bg-ember/85',
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
  shine = variant === 'primary',
  ...rest
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <>
      {shine && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-opacity group-hover/btn:animate-sweep group-hover/btn:opacity-100"
        />
      )}
      <span className="relative inline-flex items-center gap-2">{children}</span>
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
