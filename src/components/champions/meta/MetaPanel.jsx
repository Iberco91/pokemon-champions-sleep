import { useState } from 'react'
import { useChampionsMeta } from '../../../hooks/useChampionsMeta.js'

// Meta Tracker (Fase 9 — CLAUDE.md sección 2.2). Muestra el snapshot cacheado
// en champions_meta_cache y permite refrescarlo bajo demanda: el botón
// invoca la Edge Function update-champions-meta, que rastrea el Top de Meta
// real y reemplaza la tabla. No hay job automático bi-semanal todavía —
// eso requiere programar un cron aparte una vez desplegado el proyecto.
export default function MetaPanel() {
  const { meta, loading, error, refreshing, refreshMeta } = useChampionsMeta()
  const [refreshMessage, setRefreshMessage] = useState(null)

  async function handleRefresh() {
    setRefreshMessage(null)
    const { error: refreshError, matchedCount } = await refreshMeta()
    if (refreshError) {
      setRefreshMessage({ type: 'error', text: refreshError.message })
      return
    }
    setRefreshMessage({ type: 'success', text: `Meta actualizado: ${matchedCount} Pokémon.` })
  }

  return (
    <article className="p-4 rounded-[0.9rem] bg-[#fffdf8] border border-amber-200">
      <div className="flex justify-between items-center gap-2 mb-[0.6rem]">
        <h3 className="text-lg font-bold text-gray-900">Meta quincenal</h3>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-[0.7rem] py-[0.4rem] rounded-[0.5rem] bg-pikachu text-gray-900 text-xs font-bold disabled:opacity-60"
        >
          {refreshing ? 'Actualizando...' : 'Actualizar Meta ahora'}
        </button>
      </div>

      {refreshMessage && (
        <p className={`text-sm mb-2 ${refreshMessage.type === 'error' ? 'text-red-600' : 'text-emerald-700'}`}>
          {refreshMessage.text}
        </p>
      )}

      {loading && <p className="text-gray-600">Cargando meta cacheado...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && meta.length === 0 && (
        <p className="text-gray-600 text-sm">
          Todavía no hay meta cacheado. Presiona "Actualizar Meta ahora" para rastrear el Top actual.
        </p>
      )}

      {!loading && !error && meta.length > 0 && (
        <ul className="flex flex-col gap-1">
          {meta.map((entry) => (
            <li
              key={entry.id}
              className="flex justify-between items-center gap-2 text-sm text-gray-700 p-[0.4rem] rounded-lg bg-orange-50 border border-orange-200"
            >
              <span>
                #{entry.rank_position} {entry.pokemon_name}
                {entry.common_moves?.[0] && (
                  <span className="text-gray-500">
                    {' '}
                    · {entry.common_moves[0].move} ({entry.common_moves[0].usagePercentage}%)
                  </span>
                )}
                {entry.common_items?.[0] && <span className="text-gray-500"> · {entry.common_items[0].item}</span>}
              </span>
              <span className="text-xs font-semibold text-amber-700">{entry.usage_percentage}%</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
