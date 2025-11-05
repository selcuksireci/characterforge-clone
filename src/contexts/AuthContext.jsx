import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '@/lib/supabaseClient'

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true
})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let subscription

    async function fetchSession() {
      if (!supabaseConfigured) {
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }

    fetchSession()

    if (supabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession)
        setLoading(false)
      })
      subscription = data.subscription
    }

    return () => {
      subscription?.unsubscribe?.()
    }
  }, [])

  return <AuthContext.Provider value={{ session, user: session?.user ?? null, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
