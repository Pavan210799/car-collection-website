import { useEffect, useState } from 'react'
import { useLocation, useNavigation, useNavigationType } from 'react-router-dom'

/**
 * Shows a skeleton while a lazy route loads and for a short minimum time on every new page or reload.
 * Back/forward jumps skip it so the browser can restore the previous scroll position.
 */
export function usePageSkeleton(minMs = 650) {
  const location = useLocation()
  const navigation = useNavigation()
  const navigationType = useNavigationType()
  const [initialKey] = useState(location.key)
  const [readyPath, setReadyPath] = useState(null)
  const historyJump = navigationType === 'POP' && location.key !== initialKey

  useEffect(() => {
    if (historyJump) return undefined
    const timer = setTimeout(() => setReadyPath(location.pathname), minMs)
    return () => clearTimeout(timer)
  }, [location.pathname, historyJump, minMs])

  const target = navigation.state === 'loading' ? navigation.location?.pathname : null
  const pending = target && target !== location.pathname ? target : null
  const showSkeleton = Boolean(pending) || (!historyJump && readyPath !== location.pathname)

  return { showSkeleton, skeletonPath: pending ?? location.pathname, pathname: location.pathname }
}
