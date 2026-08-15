import { isSupabaseConfigured } from '../services/supabase.js'
import { useAuth } from './useAuth.js'

export function useAppState() {
  const auth = useAuth()

  if (!isSupabaseConfigured) {
    return { status: 'error', message: 'Faltan las variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en .env.local.', auth }
  }

  if (auth.loading) {
    return { status: 'loading', message: 'Conectando con Supabase...', auth }
  }

  return { status: 'ready', message: 'Conexión lista.', auth }
}
