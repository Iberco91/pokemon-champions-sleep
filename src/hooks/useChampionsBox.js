import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../services/supabase.js'

export function useChampionsBox(userId) {
  const [box, setBox] = useState([])
  const [loading, setLoading] = useState(Boolean(isSupabaseConfigured && userId))
  const [error, setError] = useState(null)
  const [refreshToken, setRefreshToken] = useState(0)

  const refresh = useCallback(() => setRefreshToken((token) => token + 1), [])

  useEffect(() => {
    if (!isSupabaseConfigured || !userId) return undefined

    let cancelled = false

    supabase
      .from('user_champions_box')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return
        if (fetchError) {
          setError(fetchError.message)
        } else {
          setBox(data ?? [])
          setError(null)
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId, refreshToken])

  const addPokemon = useCallback(
    async (entry) => {
      const { error: insertError } = await supabase
        .from('user_champions_box')
        .insert({ ...entry, user_id: userId })
      if (insertError) return { error: insertError }
      refresh()
      return { error: null }
    },
    [userId, refresh],
  )

  const removePokemon = useCallback(
    async (id) => {
      const { error: deleteError } = await supabase
        .from('user_champions_box')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      if (deleteError) return { error: deleteError }
      refresh()
      return { error: null }
    },
    [userId, refresh],
  )

  return { box, loading, error, addPokemon, removePokemon, refresh }
}
