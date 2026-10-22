import { useMemo, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth.js'
import { useSleepBox } from '../../../hooks/useSleepBox.js'
import { natureOptions, sleepLevels } from '../../../data/sleepData.js'
import { findEvolutionFamilyInBox, projectEntryAtLevel, rankProjections } from '../../../lib/sleepComparator.js'
import { formatFrequency } from '../../../lib/sleepStats.js'
import EvaluationBadges from '../EvaluationBadges.jsx'

const selectClass = 'px-[0.7rem] py-[0.6rem] rounded-[0.65rem] border border-amber-200 bg-[#fffef9]'
const labelClass = 'flex flex-col gap-[0.35rem] font-semibold text-[0.95rem] text-gray-600'
const TARGET_LEVEL_PRESETS = [30, 50]

// Comparador Head-to-Head entre Pokémon de la misma línea evolutiva ya
// registrados en el box (Fase 5 — CLAUDE.md sección 1.3).
export default function ComparatorPanel() {
  const { user } = useAuth()
  const { box, loading, error } = useSleepBox(user?.id)
  const [selectedId, setSelectedId] = useState('')
  const [targetLevel, setTargetLevel] = useState(30)

  // Por defecto se compara el Pokémon más reciente del box (useSleepBox lo
  // ordena por created_at descendente), como pide la sección 1.3 ("al
  // registrar un nuevo Pokémon"), hasta que el usuario elija otro.
  const effectiveSelectedId = selectedId || (box.length > 0 ? String(box[0].id) : '')

  const selectedEntry = useMemo(
    () => box.find((entry) => String(entry.id) === String(effectiveSelectedId)) ?? null,
    [box, effectiveSelectedId],
  )

  const familyMembers = useMemo(() => {
    if (!selectedEntry?.species) return []
    return findEvolutionFamilyInBox(box, selectedEntry.species.name)
  }, [box, selectedEntry])

  const rankedProjections = useMemo(() => {
    if (familyMembers.length < 2) return []
    const projections = familyMembers.map((entry) => {
      const nature = natureOptions.find((option) => option.name === entry.nature) ?? null
      return projectEntryAtLevel(entry, entry.species, nature, Number(targetLevel) || 1)
    })
    return rankProjections(projections)
  }, [familyMembers, targetLevel])

  return (
    <article className="p-4 rounded-[0.9rem] bg-[#fffdf8] border border-amber-200">
      <h3 className="mb-[0.6rem] text-lg font-bold text-gray-900">Comparador evolutivo</h3>

      {!user && <p className="text-gray-600 text-sm">Inicia sesión para comparar tu box.</p>}
      {user && loading && <p className="text-gray-600">Cargando tu box...</p>}
      {user && error && <p className="text-red-600">{error}</p>}
      {user && !loading && !error && box.length === 0 && (
        <p className="text-gray-600 text-sm">Registra Pokémon en el Box para comparar entre ellos.</p>
      )}

      {user && !loading && !error && box.length > 0 && (
        <div className="flex flex-col gap-[0.7rem]">
          <label className={labelClass}>
            Pokémon a evaluar
            <select
              value={effectiveSelectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className={selectClass}
            >
              {box.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.nickname || entry.species?.name} ({entry.species?.name})
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Nivel objetivo
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={sleepLevels.min}
                max={sleepLevels.max}
                value={targetLevel}
                onChange={(event) => setTargetLevel(event.target.value)}
                className={`${selectClass} w-24`}
              />
              {TARGET_LEVEL_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTargetLevel(preset)}
                  className="px-[0.6rem] py-[0.4rem] rounded-[0.5rem] bg-amber-100 text-amber-800 text-xs font-bold"
                >
                  Nv. {preset}
                </button>
              ))}
            </div>
          </label>

          {selectedEntry && familyMembers.length < 2 && (
            <p className="text-gray-600 text-sm">
              No hay otros ejemplares de la línea evolutiva de {selectedEntry.species?.name} en tu box para comparar.
            </p>
          )}

          {rankedProjections.length > 1 && (
            <div className="flex flex-col gap-[0.6rem]">
              {rankedProjections.map((projection) => (
                <div
                  key={projection.entry.id}
                  className={`p-[0.7rem] rounded-xl border ${
                    projection.isBest ? 'bg-emerald-50 border-emerald-300' : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <strong className="text-gray-900">
                      {projection.entry.nickname || projection.species?.name} — {projection.species?.name}
                    </strong>
                    {projection.isBest && (
                      <span className="px-2 py-[0.1rem] rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold">
                        Mejor proyección
                      </span>
                    )}
                  </div>
                  <p className="my-[0.15rem] text-gray-600 text-sm">
                    <strong>Carry limit a Nv. {projection.targetLevel}:</strong> {projection.carryLimit}
                  </p>
                  <p className="my-[0.15rem] text-gray-600 text-sm">
                    <strong>Frecuencia estimada:</strong> {formatFrequency(projection.frequencySeconds)}
                  </p>
                  <p className="my-[0.15rem] text-gray-600 text-sm">
                    <strong>Producción estimada:</strong> {projection.throughputPerHour} unidades/hora
                  </p>
                  {projection.evaluation && (
                    <div className="my-[0.3rem]">
                      <EvaluationBadges evaluation={projection.evaluation} />
                      {projection.evaluation.rpEfficiency != null && (
                        <p className="m-0 mt-1 text-gray-600 text-sm">
                          <strong>Eficiencia de RP:</strong> {projection.evaluation.rpEfficiency}%
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
