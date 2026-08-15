import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../services/supabase.js'

// Meta Tracker de Champions (Fase 9 — CLAUDE.md 2.2): lee el snapshot cacheado
// en champions_meta_cache y expone refreshMeta() para disparar la Edge
// Function update-champions-meta bajo demanda (mecanismo manual, sin cron).
export function useChampionsMeta() {
  const [meta, setMeta] = useState([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(isSupabaseConfigured ? null : 'Supabase no está configurado.')
  const [refreshing, setRefreshing] = useState(false)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    supabase
      .from('champions_meta_cache')
      .select('*')
      .order('rank_position', { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return
        if (fetchError) {
          setError(fetchError.message)
        } else {
          setMeta(data ?? [])
          setError(null)
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [refreshToken])

  const refreshMeta = useCallback(async () => {
    setRefreshing(true)
    const { data, error: invokeError } = await supabase.functions.invoke('update-champions-meta')
    setRefreshing(false)
    if (invokeError) return { error: invokeError }
    if (data && data.ok === false) return { error: new Error(data.message) }
    setRefreshToken((token) => token + 1)
    return { error: null, matchedCount: data?.matchedCount }
  }, [])

  return { meta, loading, error, refreshing, refreshMeta }
}
