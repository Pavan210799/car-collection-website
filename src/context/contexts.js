import { createContext, useContext } from 'react'

export const ToastContext = createContext(null)
export const GarageContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside <ToastProvider>')
  return context
}

export function useGarage() {
  const context = useContext(GarageContext)
  if (!context) throw new Error('useGarage must be used inside <GarageProvider>')
  return context
}
