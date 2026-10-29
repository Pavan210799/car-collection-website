import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { ToastProvider } from './context/ToastProvider'
import { GarageProvider } from './context/GarageProvider'
import { RootLayout } from './components/layout/RootLayout'
import Home from './pages/Home'

const page = (load) => async () => ({ Component: (await load()).default })

const router = createBrowserRouter([
  {
    element: (
      <ToastProvider>
        <GarageProvider>
          <RootLayout />
        </GarageProvider>
      </ToastProvider>
    ),
    HydrateFallback: () => <div className="min-h-dvh bg-ink-950" />,
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
      { path: '/privacy', lazy: page(() => import('./pages/Legal')) },
      { path: '/terms', lazy: page(() => import('./pages/Legal')) },
      { path: '/cookies', lazy: page(() => import('./pages/Legal')) },
      { path: '*', lazy: page(() => import('./pages/NotFound')) },
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
