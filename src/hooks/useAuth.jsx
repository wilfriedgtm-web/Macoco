import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession]   = useState(null)
  const [salon, setSalon]       = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) loadSalon(data.session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
      if (session) loadSalon(session.user.id)
      else { setSalon(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadSalon(userId) {
    const { data } = await supabase
      .from('salons').select('*').eq('owner_id', userId).single()
    setSalon(data || null)
    setLoading(false)
  }

  async function signUp(email, password) {
    return supabase.auth.signUp({ email, password })
  }

  async function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSalon(null)
  }

  return (
    <AuthCtx.Provider value={{ session, salon, setSalon, loading, signUp, signIn, signOut }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}
