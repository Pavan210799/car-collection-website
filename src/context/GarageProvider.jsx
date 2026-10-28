import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { carsById } from '../data/cars'
import { GarageContext, useToast } from './contexts'

export const MAX_COMPARE = 3
const EMPTY = []

const keepKnown = (ids) => ids.filter((id) => carsById.has(id))

export function GarageProvider({ children }) {
  const { notify } = useToast()
  const [storedWishlist, setWishlist] = useLocalStorage('veloce:wishlist', EMPTY)
  const [storedCompare, setCompare] = useLocalStorage('veloce:compare', EMPTY)

  const wishlist = useMemo(() => keepKnown(storedWishlist), [storedWishlist])
  const compare = useMemo(() => keepKnown(storedCompare).slice(0, MAX_COMPARE), [storedCompare])

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist])
  const isCompared = useCallback((id) => compare.includes(id), [compare])

  const toggleWishlist = useCallback(
    (id) => {
      const car = carsById.get(id)
      if (!car) return
      if (wishlist.includes(id)) {
        setWishlist(wishlist.filter((item) => item !== id))
        notify({ title: 'Removed from wishlist', description: car.name, tone: 'info' })
      } else {
        setWishlist([...wishlist, id])
        notify({
          title: 'Saved to wishlist',
          description: car.name,
          action: { label: 'View wishlist', to: '/wishlist' },
        })
      }
    },
    [wishlist, setWishlist, notify],
  )

  const addToCompare = useCallback(
    (id, { silent = false } = {}) => {
      const car = carsById.get(id)
      if (!car || compare.includes(id)) return true
      if (compare.length >= MAX_COMPARE) {
        notify({
          title: 'Comparison is full',
          description: `You can compare up to ${MAX_COMPARE} cars. Remove one to add ${car.name}.`,
          tone: 'warning',
          action: { label: 'Open comparison', to: '/compare' },
        })
        return false
      }
      setCompare([...compare, id])
      if (!silent) {
        notify({
          title: 'Added to comparison',
          description: car.name,
          action: { label: 'Compare now', to: '/compare' },
        })
      }
      return true
    },
    [compare, setCompare, notify],
  )

  const removeFromCompare = useCallback(
    (id) => setCompare(compare.filter((item) => item !== id)),
    [compare, setCompare],
  )

  const toggleCompare = useCallback(
    (id) => {
      if (compare.includes(id)) {
        removeFromCompare(id)
        notify({ title: 'Removed from comparison', description: carsById.get(id)?.name, tone: 'info' })
      } else {
        addToCompare(id)
      }
    },
    [compare, addToCompare, removeFromCompare, notify],
  )

  const value = useMemo(
    () => ({
      wishlist,
      compare,
      isWishlisted,
      isCompared,
      toggleWishlist,
      toggleCompare,
      addToCompare,
      removeFromCompare,
      setCompare: (ids) => setCompare(keepKnown(ids).slice(0, MAX_COMPARE)),
      clearWishlist: () => setWishlist(EMPTY),
      clearCompare: () => setCompare(EMPTY),
    }),
    [
      wishlist,
      compare,
      isWishlisted,
      isCompared,
      toggleWishlist,
      toggleCompare,
      addToCompare,
      removeFromCompare,
      setCompare,
      setWishlist,
    ],
  )

  return <GarageContext.Provider value={value}>{children}</GarageContext.Provider>
}
