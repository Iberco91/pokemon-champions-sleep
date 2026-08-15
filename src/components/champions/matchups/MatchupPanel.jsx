import { useMemo, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth.js'
import { useChampionsBox } from '../../../hooks/useChampionsBox.js'
import { championsPool, metaTop } from '../../../data/championsData.js'
import { buildVulnerabilityMessage, simulateTeamWinRate } from '../../../lib/championsMatchup.js'

const MAX_TEAM_SIZE = 6

// Análisis de Equipo vs. Meta (Fase 8 — CLAUDE.md sección 2.3): el usuario
// selecciona hasta 6 builds de su box y el sistema estima cobertura de tipos
// y win-rate frente al Top de Meta (championsData.js), con sugerencias de
// mejora frente a las amenazas más críticas.
export default function MatchupPanel() {
  const { user } = useAuth()
  const { box, loading, error } = useChampionsBox(user?.id)
  const [selectedIds, setSelectedIds] = useState([])

  function toggleMember(id) {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((entryId) => entryId !== id)
      if (current.length >= MAX_TEAM_SIZE) return current
      return [...current, id]
    })
  }

  const team = useMemo(() => {
    return box
      .filter((entry) => selectedIds.includes(entry.id))
      .map((entry) => {
        const speciesInfo = championsPool.find((option) => option.name === entry.species)
        return {
          id: entry.id,
          label: entry.nickname || entry.species,
          types: speciesInfo?.types ?? [],
          baseSpeed: speciesInfo?.baseSpeed ?? 0,
        }
      })
      .filter((member) => member.types.length > 0)
  }, [box, selectedIds])

  const simulation = useMemo(() => (team.length > 0 ? simulateTeamWinRate(team, metaTop) : null), [team])

  return (
    <article className="p-4 rounded-[0.9rem] bg-[#fffdf8] border border-amber-200">
      <h3 className="mb-[0.6rem] text-lg font-bold text-gray-900">Simulador de matchups</h3>

      {!user && <p className="text-gray-600 text-sm">Inicia sesión para simular tu equipo.</p>}
      {user && loading && <p className="text-gray-600">Cargando tu box...</p>}
      {user && error && <p className="text-red-600">{error}</p>}
      {user && !loading && !error && box.length === 0 && (
        <p className="text-gray-600 text-sm">Registra builds en tu box para armar un equipo.</p>
      )}

      {user && !loading && !error && box.length > 0 && (
        <div className="flex flex-col gap-[0.7rem]">
          <p className="text-sm font-semibold text-gray-600">
            Elige tu equipo ({selectedIds.length}/{MAX_TEAM_SIZE})
          </p>
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
            {box.map((entry) => (
              <label key={entry.id} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(entry.id)}
                  onChange={() => toggleMember(entry.id)}
                  disabled={!selectedIds.includes(entry.id) && selectedIds.length >= MAX_TEAM_SIZE}
                />
                {entry.nickname || entry.species} ({entry.species})
              </label>
            ))}
          </div>

          {team.length === 0 && (
            <p className="text-gray-600 text-sm">Selecciona al menos un Pokémon para simular.</p>
          )}

          {simulation && (
            <div className="mt-[0.3rem] p-[0.8rem] rounded-xl bg-orange-50 border border-orange-200 flex flex-col gap-[0.5rem]">
              <p className="my-[0.1rem] text-gray-600">
                <strong>Win-rate estimado vs. Top de Meta:</strong> {simulation.overallWinRate}%
              </p>

              <ul className="flex flex-col gap-1">
                {simulation.results.map((result) => (
                  <li
                    key={result.threat.name}
                    className="flex justify-between items-center gap-2 text-sm text-gray-700 p-[0.4rem] rounded-lg bg-white border border-amber-200"
                  >
                    <span>
                      #{result.threat.rank} {result.threat.name} ({result.threat.usagePercentage}% uso)
                    </span>
                    <span className="text-xs font-semibold text-amber-700">
                      {result.winRate}% · check: {result.bestResponder.label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-800">Vulnerabilidades críticas:</p>
                {simulation.worstMatchups.map((vulnerability) => (
                  <p key={vulnerability.threat.name} className="text-red-600 text-sm">
                    {buildVulnerabilityMessage(vulnerability)}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
