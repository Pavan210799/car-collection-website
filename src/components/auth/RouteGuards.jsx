import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/contexts'
import { safeRedirect } from '../../lib/auth'

export function RequireAuth() {
  const { user, signedOut } = useAuth()
  const location = useLocation()
  if (user) return <Outlet />
  const target = `${location.pathname}${location.search}`
  const search = signedOut || target === '/' ? '' : `?redirect=${encodeURIComponent(target)}`
  return <Navigate to={`/login${search}`} replace />
}

export function GuestOnly() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  if (user) return <Navigate to={safeRedirect(params.get('redirect'))} replace />
  return <Outlet />
}
