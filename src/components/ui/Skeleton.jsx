import { motion } from 'framer-motion'
import { Container } from './Container'

export function Bone({ className = '' }) {
  return <div aria-hidden="true" className={`skeleton rounded-xl ${className}`} />
}

export const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password']

export function skeletonVariant(pathname) {
  if (AUTH_PATHS.includes(pathname)) return 'auth'
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/cars/')) return 'detail'
  if (pathname === '/collection' || pathname === '/wishlist') return 'grid'
  if (pathname === '/brands') return 'brands'
  if (pathname === '/compare') return 'compare'
  if (pathname === '/test-drive' || pathname === '/contact') return 'form'
  if (pathname === '/about') return 'about'
  if (pathname === '/faq') return 'faq'
  return 'article'
}

export function RouteProgress() {
  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-[3px] overflow-hidden bg-gold-400/15">
      <motion.div
        className="h-full w-2/5 rounded-full bg-gradient-to-r from-transparent via-gold-400 to-volt"
        initial={{ x: '-100%' }}
        animate={{ x: '260%' }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], repeat: Infinity }}
      />
    </div>
  )
}

function HeaderBones({ image = false }) {
  return (
    <div className={`grid gap-10 ${image ? 'lg:grid-cols-2 lg:items-center lg:gap-14' : ''}`}>
      <div className="min-w-0 space-y-5">
        <Bone className="h-3 w-32 rounded-full" />
        <div className="space-y-3">
          <Bone className="h-10 w-[88%] max-w-xl sm:h-14 lg:h-16" />
          <Bone className="h-10 w-[62%] max-w-md sm:h-14 lg:h-16" />
        </div>
        <div className="space-y-2.5 pt-1">
          <Bone className="h-4 w-full max-w-2xl rounded-full" />
          <Bone className="h-4 w-[78%] max-w-lg rounded-full" />
        </div>
      </div>
      {image && <Bone className="aspect-[16/10] w-full rounded-[2rem] lg:aspect-[5/4]" />}
    </div>
  )
}

function CardBone() {
  return (
    <div className="min-w-0 rounded-[1.75rem] border border-ink-700/50 bg-ink-900 p-2 shadow-soft">
      <Bone className="aspect-[16/10] w-full rounded-[1.35rem]" />
      <div className="space-y-4 px-2 pt-4 pb-2 sm:px-3">
        <div className="space-y-2">
          <Bone className="h-2.5 w-20 rounded-full" />
          <Bone className="h-6 w-3/4" />
          <Bone className="h-3.5 w-full rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Bone className="h-12" />
          <Bone className="h-12" />
          <Bone className="h-12" />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-ink-700/50 pt-4">
          <Bone className="h-6 w-28" />
          <Bone className="size-10 shrink-0 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function CardGrid({ count = 6 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={index >= 4 ? 'hidden xl:block' : index >= 2 ? 'hidden sm:block' : ''}>
          <CardBone />
        </div>
      ))}
    </div>
  )
}

function HomeBones() {
  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
        <div className="min-w-0 space-y-6">
          <Bone className="h-9 w-56 max-w-full rounded-full" />
          <div className="space-y-3">
            <Bone className="h-12 w-[80%] sm:h-16 lg:h-20" />
            <Bone className="h-12 w-[60%] sm:h-16 lg:h-20" />
          </div>
          <div className="space-y-2.5">
            <Bone className="h-4 w-full max-w-lg rounded-full" />
            <Bone className="h-4 w-[70%] max-w-sm rounded-full" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Bone className="h-13 w-44 rounded-full" />
            <Bone className="h-13 w-36 rounded-full" />
          </div>
        </div>
        <div className="min-w-0 space-y-4">
          <Bone className="aspect-[4/3] w-full rounded-[2.25rem]" />
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((item) => (
              <Bone key={item} className="h-1.5 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-14 grid grid-cols-2 gap-6 border-t border-ink-700/50 pt-10 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="space-y-3">
            <Bone className="h-10 w-24" />
            <Bone className="h-3 w-[80%] rounded-full" />
          </div>
        ))}
      </div>
    </>
  )
}

function DetailBones() {
  return (
    <>
      <Bone className="mb-8 h-3 w-56 max-w-full rounded-full" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
        <div className="min-w-0 space-y-3">
          <Bone className="aspect-[16/10] w-full rounded-[2rem]" />
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((item) => (
              <Bone key={item} className="aspect-[4/3] rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="min-w-0 space-y-5">
          <Bone className="h-3 w-24 rounded-full" />
          <Bone className="h-12 w-[85%]" />
          <Bone className="h-4 w-full rounded-full" />
          <Bone className="h-9 w-40" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((item) => (
              <Bone key={item} className="h-20 rounded-2xl" />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Bone className="h-13 w-full rounded-full xs:w-44" />
            <Bone className="h-13 w-full rounded-full xs:w-36" />
          </div>
        </div>
      </div>
    </>
  )
}

function RowBones() {
  return (
    <div className="space-y-6">
      {[0, 1].map((item) => (
        <div key={item} className="grid gap-6 rounded-[2rem] border border-ink-700/50 bg-ink-900 p-3 shadow-soft lg:grid-cols-2 lg:p-4">
          <Bone className="aspect-[16/10] w-full rounded-[1.5rem]" />
          <div className="min-w-0 space-y-4 p-2 lg:p-6">
            <Bone className="h-3 w-28 rounded-full" />
            <Bone className="h-10 w-2/3" />
            <Bone className="h-4 w-full rounded-full" />
            <Bone className="h-4 w-4/5 rounded-full" />
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[0, 1, 2].map((stat) => (
                <Bone key={stat} className="h-16 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CompareBones() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[0, 1, 2].map((item) => (
          <div key={item} className="min-w-0 space-y-3 rounded-2xl border border-ink-700/50 bg-ink-900 p-2 sm:rounded-[1.5rem]">
            <Bone className="aspect-[4/3] w-full rounded-xl" />
            <Bone className="mx-1 h-4 w-3/4" />
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-[1.5rem] border border-ink-700/50 bg-ink-900">
        {[0, 1, 2, 3, 4].map((item) => (
          <div key={item} className="grid grid-cols-3 gap-4 border-b border-ink-700/40 p-4 last:border-0">
            <Bone className="h-4 rounded-full" />
            <Bone className="h-4 rounded-full" />
            <Bone className="h-4 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function FormBones() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <div className="min-w-0 space-y-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl border border-ink-700/50 bg-ink-900 p-4">
            <Bone className="size-9 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Bone className="h-4 w-1/2" />
              <Bone className="h-3 w-4/5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="min-w-0 rounded-[1.75rem] border border-ink-700/50 bg-ink-900 p-5 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <Bone className="h-3 w-24 rounded-full" />
              <Bone className="h-12 rounded-2xl" />
            </div>
          ))}
        </div>
        <Bone className="mt-5 h-28 rounded-2xl" />
        <Bone className="mt-6 h-13 w-full rounded-full sm:w-48" />
      </div>
    </div>
  )
}

function FaqBones() {
  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {[0, 1, 2, 3, 4].map((item) => (
          <Bone key={item} className="h-10 w-24 rounded-full" />
        ))}
      </div>
      <div className="rounded-[1.75rem] border border-ink-700/50 bg-ink-900 px-5 sm:px-8">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex items-center justify-between gap-4 border-b border-ink-700/40 py-6 last:border-0">
            <Bone className="h-5 w-[70%] rounded-full" />
            <Bone className="size-8 shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    </>
  )
}

function ArticleBones() {
  return (
    <div className="max-w-3xl space-y-8">
      {[0, 1, 2].map((item) => (
        <div key={item} className="space-y-3">
          <Bone className="h-6 w-1/2" />
          <Bone className="h-4 w-full rounded-full" />
          <Bone className="h-4 w-[92%] rounded-full" />
          <Bone className="h-4 w-[70%] rounded-full" />
        </div>
      ))}
    </div>
  )
}

function AboutBones() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className={`space-y-4 rounded-[1.5rem] border border-ink-700/50 bg-ink-900 p-6 ${item > 1 ? 'max-sm:hidden' : ''}`}>
          <Bone className="size-12 rounded-2xl" />
          <Bone className="h-5 w-3/4" />
          <Bone className="h-3.5 w-full rounded-full" />
          <Bone className="h-3.5 w-4/5 rounded-full" />
        </div>
      ))}
    </div>
  )
}

const bodies = {
  grid: () => (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Bone className="h-12 w-full rounded-full sm:w-72" />
        <Bone className="h-10 w-28 rounded-full" />
        <Bone className="h-10 w-24 rounded-full" />
        <Bone className="h-10 w-24 rounded-full max-xs:hidden" />
      </div>
      <CardGrid />
    </>
  ),
  brands: RowBones,
  compare: CompareBones,
  form: FormBones,
  faq: FaqBones,
  article: ArticleBones,
  about: AboutBones,
}

export function PageSkeleton({ pathname }) {
  const variant = skeletonVariant(pathname)
  const Body = bodies[variant]
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="min-h-dvh overflow-hidden pt-28 pb-20 sm:pt-32">
      <span className="sr-only">Loading page…</span>
      <Container>
        {variant === 'home' && <HomeBones />}
        {variant === 'detail' && <DetailBones />}
        {Body && (
          <>
            <HeaderBones image={variant === 'form' || variant === 'about'} />
            <div className="mt-12">
              <Body />
            </div>
          </>
        )}
      </Container>
    </div>
  )
}

export function AuthFormSkeleton() {
  return (
    <div role="status" aria-busy="true" className="w-full space-y-6">
      <span className="sr-only">Loading…</span>
      <div className="space-y-3">
        <Bone className="h-3 w-28 rounded-full" />
        <Bone className="h-10 w-3/4" />
        <Bone className="h-4 w-full rounded-full" />
      </div>
      {[0, 1].map((item) => (
        <div key={item} className="space-y-2">
          <Bone className="h-3 w-20 rounded-full" />
          <Bone className="h-13 w-full rounded-2xl" />
        </div>
      ))}
      <Bone className="h-13 w-full rounded-full" />
      <Bone className="mx-auto h-3.5 w-1/2 rounded-full" />
    </div>
  )
}

export function AuthSkeleton() {
  return (
    <div className="min-h-dvh overflow-hidden bg-ink-950 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <div className="p-3 sm:p-4 lg:h-dvh">
        <Bone className="h-48 w-full rounded-[1.75rem] sm:h-60 lg:h-full lg:rounded-[2rem]" />
      </div>
      <div className="flex justify-center px-5 py-10 sm:px-8 lg:items-center">
        <div className="w-full max-w-md space-y-8">
          <Bone className="h-12 w-full rounded-full" />
          <AuthFormSkeleton />
        </div>
      </div>
    </div>
  )
}

function NavbarSkeleton() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-ink-700/50 bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[96rem] items-center justify-between gap-3 px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <Bone className="size-9 rounded-xl" />
          <Bone className="h-4 w-24 rounded-full" />
        </div>
        <Bone className="hidden h-11 w-[28rem] max-w-[45vw] rounded-full lg:block" />
        <div className="flex items-center gap-2">
          <Bone className="size-10 rounded-full" />
          <Bone className="size-10 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function AppSkeleton() {
  const pathname = typeof window === 'undefined' ? '/' : window.location.pathname
  return (
    <>
      <RouteProgress />
      {skeletonVariant(pathname) === 'auth' ? (
        <AuthSkeleton />
      ) : (
        <>
          <NavbarSkeleton />
          <PageSkeleton pathname={pathname} />
        </>
      )}
    </>
  )
}
