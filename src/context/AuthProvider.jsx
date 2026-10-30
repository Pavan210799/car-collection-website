import { useCallback, useEffect, useMemo, useState } from 'react'
import { readSession, writeSession } from '../lib/auth'
import { AuthContext } from './contexts'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)
  const [signedOut, setSignedOut] = useState(false)

  useEffect(() => {
    const onStorage = (event) => event.key === 'aurion:session' && setUser(readSession())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const signIn = useCallback((nextUser, remember = true) => {
    writeSession(nextUser, remember)
    setSignedOut(false)
    setUser(readSession())
  }, [])

  const signOut = useCallback(() => {
    writeSession(null)
    setSignedOut(true)
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, signedOut, signIn, signOut }), [user, signedOut, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
