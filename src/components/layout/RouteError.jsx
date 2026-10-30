import { useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RefreshCw, TriangleAlert } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from '../ui/Button'
import { siteMeta } from '../../data/site'

const STALE_CHUNK = /dynamically imported module|Importing a module script failed|error loading dynamically imported module/i

export function RouteError() {
  const error = useRouteError()
  const staleBuild = error instanceof Error && STALE_CHUNK.test(error.message)
  const notFound = isRouteErrorResponse(error) && error.status === 404

  useEffect(() => {
    document.title = `Something went wrong — ${siteMeta.name}`
  }, [])

  const title = notFound ? 'This page took a wrong turn' : staleBuild ? 'A fresh version is ready' : 'Something stalled on the way'
  const body = notFound
    ? 'The page you were looking for doesn’t exist or has moved.'
    : staleBuild
      ? 'We’ve updated the site since you opened it. Reload to continue with the latest version.'
      : 'An unexpected problem stopped this page from loading. Reloading usually fixes it — your garage and account are safe.'

  return (
    <div className="relative isolate grid min-h-dvh place-items-center overflow-hidden bg-ink-950 px-5 py-16">
      <div aria-hidden="true" className="mesh-glow absolute inset-0 -z-10" />
      <div className="absolute top-5 left-5 sm:top-7 sm:left-8">
        <Logo />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-[2rem] border border-ink-700/60 bg-ink-900/80 p-7 text-center shadow-lift backdrop-blur sm:p-10"
        role="alert"
      >
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold-400/12 text-gold-500 ring-1 ring-gold-400/25">
          <TriangleAlert className="size-7" strokeWidth={1.8} />
        </span>
        <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-bone sm:text-3xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">{body}</p>
        <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:justify-center">
          {!notFound && (
            <Button type="button" variant="dark" onClick={() => window.location.reload()}>
              <RefreshCw className="size-4" /> Reload page
            </Button>
          )}
          <Button href="/" variant="light">
            Back to home
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
