import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { ToastProvider } from './context/ToastProvider'
import { AuthProvider } from './context/AuthProvider'
import { GarageProvider } from './context/GarageProvider'
import { RootLayout } from './components/layout/RootLayout'
import { AuthLayout } from './components/auth/AuthLayout'
import { GuestOnly, RequireAuth } from './components/auth/RouteGuards'
import { AppSkeleton } from './components/ui/Skeleton'
import { RouteError } from './components/layout/RouteError'
import { useSpotlight } from './hooks/useSpotlight'
import Home from './pages/Home'
import Login from './pages/auth/Login'

const page = (load) => async () => ({ Component: (await load()).default })

function AppShell() {
  useSpotlight()
  return (
    <ToastProvider>
      <AuthProvider>
        <GarageProvider>
          <Outlet />
        </GarageProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteError />,
    HydrateFallback: AppSkeleton,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            element: <GuestOnly />,
            children: [
              { path: '/login', element: <Login /> },
              { path: '/signup', lazy: page(() => import('./pages/auth/Signup')) },
              { path: '/forgot-password', lazy: page(() => import('./pages/auth/ForgotPassword')) },
            ],
          },
          { path: '/reset-password', lazy: page(() => import('./pages/auth/ResetPassword')) },
        ],
      },
      {
        element: <RootLayout />,
        children: [
          {
            element: <RequireAuth />,
            children: [
              { path: '/', element: <Home /> },
              { path: '/collection', lazy: page(() => import('./pages/Collection')) },
              { path: '/cars/:slug', lazy: page(() => import('./pages/CarDetails')) },
              { path: '/brands', lazy: page(() => import('./pages/Brands')) },
              { path: '/compare', lazy: page(() => import('./pages/Compare')) },
              { path: '/wishlist', lazy: page(() => import('./pages/Wishlist')) },
              { path: '/test-drive', lazy: page(() => import('./pages/TestDrive')) },
              { path: '/about', lazy: page(() => import('./pages/About')) },
              { path: '/contact', lazy: page(() => import('./pages/Contact')) },
              { path: '/faq', lazy: page(() => import('./pages/Faq')) },
              { path: '*', lazy: page(() => import('./pages/NotFound')) },
            ],
          },
          { path: '/privacy', lazy: page(() => import('./pages/Legal')) },
          { path: '/terms', lazy: page(() => import('./pages/Legal')) },
          { path: '/cookies', lazy: page(() => import('./pages/Legal')) },
        ],
      },
    ],
  },
])

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  )
}
