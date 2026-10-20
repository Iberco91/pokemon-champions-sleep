import { useMemo, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth.js'
import { useSleepBox } from '../../../hooks/useSleepBox.js'
import { natureOptions } from '../../../data/sleepData.js'
import { evaluateSleepPokemon } from '../../../lib/sleepScoring.js'

const TIER_BADGE_CLASS = {
  S: 'bg-emerald-100 text-emerald-800',
  A: 'bg-lime-100 text-lime-800',
  B: 'bg-amber-100 text-amber-800',
  C: 'bg-red-100 text-red-800',
}

const selectClass = 'px-[0.7rem] py-[0.6rem] rounded-[0.65rem] border border-amber-200 bg-[#fffef9]'
const labelClass = 'flex flex-col gap-[0.35rem] font-semibold text-[0.95rem] text-gray-600'

// Evaluación de compatibilidad (Fase 4 — CLAUDE.md sección 1.2), aplicada
// sobre los Pokémon ya registrados en el box del usuario, usando el motor de
// src/lib/sleepScoring.js.
export default function AnalyticsPanel() {
  const { user } = useAuth()
  const { box, loading, error } = useSleepBox(user?.id)
  const [selectedId, setSelectedId] = useState('')

  const selectedEntry = useMemo(
    () => box.find((entry) => String(entry.id) === String(selectedId)) ?? null,
    [box, selectedId],
  )

  const evaluation = useMemo(() => {
    if (!selectedEntry?.species) return null
    const nature = natureOptions.find((option) => option.name === selectedEntry.nature) ?? null
    return evaluateSleepPokemon({ entry: selectedEntry, species: selectedEntry.species, nature })
  }, [selectedEntry])

  return (
    <article className="p-4 rounded-[0.9rem] bg-[#fffdf8] border border-amber-200">
      <h3 className="mb-[0.6rem] text-lg font-bold text-gray-900">Evaluación de calidad</h3>

      {!user && <p className="text-gray-600 text-sm">Inicia sesión para evaluar tu box.</p>}
      {user && loading && <p className="text-gray-600">Cargando tu box...</p>}
      {user && error && <p className="text-red-600">{error}</p>}
      {user && !loading && !error && box.length === 0 && (
        <p className="text-gray-600 text-sm">Registra un Pokémon en el Box para evaluarlo aquí.</p>
      )}

      {user && !loading && !error && box.length > 0 && (
        <div className="flex flex-col gap-[0.7rem]">
          <label className={labelClass}>
            Pokémon del box
            <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className={selectClass}>
              <option value="">Selecciona un Pokémon</option>
              {box.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.nickname || entry.species?.name} ({entry.species?.name})
                </option>
              ))}
            </select>
          </label>

          {evaluation && (
            <div className="mt-[0.3rem] p-[0.8rem] rounded-xl bg-orange-50 border border-orange-200 flex flex-col gap-[0.4rem]">
              <div className="flex items-center gap-2">
                <strong className="text-gray-700">Compatibilidad:</strong>
                <span className="text-gray-900 font-bold">{evaluation.score}%</span>
                <span className={`px-2 py-[0.1rem] rounded-full text-xs font-bold ${TIER_BADGE_CLASS[evaluation.tier]}`}>
                  Tier {evaluation.tier}
                </span>
              </div>
              {evaluation.rpEfficiency != null && (
                <p className="my-[0.1rem] text-gray-600 text-sm">
                  <strong>Cálculo:</strong> 50% build ({evaluation.buildScore}%) + 50% eficiencia de RP (
                  {evaluation.rpEfficiency}%: {evaluation.actualRp} RP real de un techo estimado de {evaluation.idealRp}{' '}
                  para este nivel/Ribbon/Main Skill)
                </p>
              )}
              <p className="my-[0.1rem] text-gray-600 text-sm">
                <strong>Especialidad:</strong> {evaluation.specialty}
              </p>
              {evaluation.specialty === 'Berries' && !evaluation.mandatoryMet && (
                <p className="text-red-600 text-sm font-semibold">
                  Falta Berry Finding S: obligatoria para especialistas en Berries (score fijado en 0%).
                </p>
              )}
              {evaluation.specialty === 'Ingredients' && (
                <p className="my-[0.1rem] text-gray-600 text-sm">
                  <strong>Combinación de ingredientes:</strong>{' '}
                  {evaluation.ingredientCombo === 'incomplete' ? 'incompleta' : evaluation.ingredientCombo}
                </p>
              )}
              <p className="my-[0.1rem] text-gray-600 text-sm">
                <strong>Sub-skills deseadas presentes:</strong> {evaluation.matchedDesiredSubskills.length} de{' '}
                {evaluation.desiredSubskills.length}
                {evaluation.matchedDesiredSubskills.length > 0 && ` (${evaluation.matchedDesiredSubskills.join(', ')})`}
              </p>
              <p className="my-[0.1rem] text-gray-600 text-sm">
                <strong>Naturaleza óptima:</strong> {evaluation.natureOptimal ? 'Sí' : 'No'}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
