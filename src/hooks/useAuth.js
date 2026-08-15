import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../services/supabase.js'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  const signInWithEmail = useCallback((email) => {
    return supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
  }, [])

  const signOut = useCallback(() => supabase.auth.signOut(), [])

  return { session, user: session?.user ?? null, loading, signInWithEmail, signOut }
}
