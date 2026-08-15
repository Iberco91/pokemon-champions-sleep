import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../services/supabase.js'

export function useSpeciesCatalog() {
  const [species, setSpecies] = useState([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(isSupabaseConfigured ? null : 'Supabase no está configurado.')

  useEffect(() => {
    if (!isSupabaseConfigured) return

    supabase
      .from('sleep_pokemon_species')
      .select('*')
      .order('name')
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message)
        } else {
          setSpecies(data ?? [])
          setError(null)
        }
        setLoading(false)
      })
  }, [])

  return { species, loading, error }
}
