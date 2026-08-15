import { useMemo, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth.js'
import { useSpeciesCatalog } from '../../../hooks/useSpeciesCatalog.js'
import { useSleepBox } from '../../../hooks/useSleepBox.js'
import { ingredientOptions, natureOptions, sleepLevels, subskillLevels, subskillOptions } from '../../../data/sleepData.js'
import {
  computeCarryLimit,
  computeFrequencySeconds,
  estimateRp,
  formatFrequency,
} from '../../../lib/sleepStats.js'
import { evaluateSleepPokemon, getEntryIngredients, getEntrySubskills } from '../../../lib/sleepScoring.js'

const TIER_BADGE_CLASS = {
  S: 'bg-emerald-100 text-emerald-800',
  A: 'bg-lime-100 text-lime-800',
  B: 'bg-amber-100 text-amber-800',
  C: 'bg-red-100 text-red-800',
}

const selectClass = 'px-[0.7rem] py-[0.6rem] rounded-[0.65rem] border border-amber-200 bg-[#fffef9]'
const labelClass = 'flex flex-col gap-[0.35rem] font-semibold text-[0.95rem] text-gray-600'

const emptyForm = {
  species_id: '',
  nickname: '',
  level: 1,
  ingredient_a: '',
  ingredient_b: '',
  ingredient_c: '',
  subskill_10: '',
  subskill_25: '',
  subskill_50: '',
  subskill_70: '',
  subskill_80: '',
  nature: '',
  rpOverride: false,
  current_rp: '',
}

export default function BoxPanel() {
  const { user } = useAuth()
  const { species, loading: loadingSpecies, error: speciesError } = useSpeciesCatalog()
  const {
    box,
    loading: loadingBox,
    error: boxError,
    addPokemon,
    updatePokemon,
    removePokemon,
  } = useSleepBox(user?.id)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)
  const [levelUpdatingId, setLevelUpdatingId] = useState(null)

  const selectedSpecies = useMemo(
    () => species.find((entry) => String(entry.id) === String(form.species_id)) ?? null,
    [species, form.species_id],
  )
  const selectedNature = useMemo(
    () => natureOptions.find((entry) => entry.name === form.nature) ?? null,
    [form.nature],
  )

  const previewCarryLimit = computeCarryLimit(form, selectedSpecies)
  const previewFrequency = computeFrequencySeconds(form, selectedSpecies, selectedNature)
  const estimatedRp = estimateRp(Number(form.level) || 1)
  const previewEvaluation = useMemo(() => {
    if (!selectedSpecies) return null
    return evaluateSleepPokemon({
      specialty: selectedSpecies.specialty,
      subskills: getEntrySubskills(form),
      ingredients: getEntryIngredients(form),
      naturePositiveStat: selectedNature?.positive ?? null,
    })
  }, [selectedSpecies, selectedNature, form])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  // Sube/baja el nivel de un Pokémon ya guardado y recalcula su RP con la
  // misma fórmula de referencia que usa el alta (estimateRp), igual como
  // subir de nivel en el juego actualiza el RP de un ayudante existente.
  async function handleLevelChange(entry, delta) {
    const nextLevel = Math.min(sleepLevels.max, Math.max(sleepLevels.min, (entry.level ?? 1) + delta))
    if (nextLevel === entry.level) return
    setLevelUpdatingId(entry.id)
    await updatePokemon(entry.id, { level: nextLevel, current_rp: estimateRp(nextLevel) })
    setLevelUpdatingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!user) {
      setFormError('Debes iniciar sesión.')
      return
    }
    if (!form.species_id) {
      setFormError('Elige una especie.')
      return
    }
    setSaving(true)
    setFormError(null)
    const { error } = await addPokemon({
      species_id: Number(form.species_id),
      nickname: form.nickname || null,
      level: Number(form.level) || 1,
      current_rp: form.rpOverride ? Number(form.current_rp) || null : estimatedRp,
      ingredient_a: form.ingredient_a || null,
      ingredient_b: form.ingredient_b || null,
      ingredient_c: form.ingredient_c || null,
      subskill_10: form.subskill_10 || null,
      subskill_25: form.subskill_25 || null,
      subskill_50: form.subskill_50 || null,
      subskill_75: form.subskill_75 || null,
      subskill_100: form.subskill_100 || null,
      nature: form.nature || null,
      evaluation_score: previewEvaluation?.score ?? null,
    })
    setSaving(false)
    if (error) {
      setFormError(error.message)
      return
    }
    setForm(emptyForm)
  }

  return (
    <article className="p-4 rounded-[0.9rem] bg-[#fffdf8] border border-amber-200">
      <h3 className="mb-[0.6rem] text-lg font-bold text-gray-900">Box principal</h3>

      {loadingSpecies && <p className="text-gray-600">Cargando catálogo de especies...</p>}
      {speciesError && <p className="text-red-600">{speciesError}</p>}

      {!loadingSpecies && !speciesError && (
        <form className="flex flex-col gap-[0.7rem]" onSubmit={handleSubmit}>
          <label className={labelClass}>
            Especie
            <select name="species_id" value={form.species_id} onChange={handleChange} className={selectClass}>
              <option value="">Selecciona una especie</option>
              {species.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>

          {selectedSpecies && (
            <div className="p-[0.6rem] rounded-lg bg-amber-50 border border-amber-200 text-sm text-gray-600">
              <p>
                <strong>Especialidad:</strong> {selectedSpecies.specialty}
              </p>
              <p>
                <strong>Berry asignada:</strong> {selectedSpecies.berry_type}
              </p>
              <p>
                <strong>Main Skill:</strong> {selectedSpecies.main_skill}
              </p>
            </div>
          )}

          <label className={labelClass}>
            Mote (opcional)
            <input name="nickname" value={form.nickname} onChange={handleChange} className={selectClass} />
          </label>

          <label className={labelClass}>
            Nivel
            <input
              name="level"
              type="number"
              min="1"
              max="100"
              value={form.level}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <div className="grid grid-cols-3 gap-2">
            <label className={labelClass}>
              Ingrediente A
              <select name="ingredient_a" value={form.ingredient_a} onChange={handleChange} className={selectClass}>
                <option value="">—</option>
                {ingredientOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Ingrediente B
              <select name="ingredient_b" value={form.ingredient_b} onChange={handleChange} className={selectClass}>
                <option value="">—</option>
                {ingredientOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Ingrediente C
              <select name="ingredient_c" value={form.ingredient_c} onChange={handleChange} className={selectClass}>
                <option value="">—</option>
                {ingredientOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {subskillLevels.map((level) => (
            <label key={level} className={labelClass}>
              Sub-skill nivel {level}
              <select
                name={`subskill_${level}`}
                value={form[`subskill_${level}`]}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">—</option>
                {subskillOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          ))}

          <label className={labelClass}>
            Naturaleza
            <select name="nature" value={form.nature} onChange={handleChange} className={selectClass}>
              <option value="">—</option>
              {natureOptions.map((opt) => (
                <option key={opt.name} value={opt.name}>
                  {opt.name}
                  {opt.positive ? ` (+${opt.positive})` : ' (neutra)'}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
            <input type="checkbox" name="rpOverride" checked={form.rpOverride} onChange={handleChange} />
            Sobrescribir RP manualmente
          </label>

          {form.rpOverride ? (
            <label className={labelClass}>
              RP manual
              <input
                name="current_rp"
                type="number"
                min="0"
                value={form.current_rp}
                onChange={handleChange}
                className={selectClass}
              />
            </label>
          ) : (
            <p className="text-sm text-gray-600">
              RP estimado automático: <strong>{estimatedRp}</strong>
            </p>
          )}

          {formError && <p className="text-red-600 text-sm">{formError}</p>}

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-[0.6rem] rounded-[0.65rem] bg-pikachu text-gray-900 font-bold disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Agregar al box'}
          </button>
        </form>
      )}

      {selectedSpecies && (
        <div className="mt-[0.9rem] p-[0.8rem] rounded-xl bg-orange-50 border border-orange-200">
          <p className="my-[0.2rem] text-gray-600">
            <strong>Carry limit estimado:</strong> {previewCarryLimit}
          </p>
          <p className="my-[0.2rem] text-gray-600">
            <strong>Frecuencia estimada:</strong> {formatFrequency(previewFrequency)}
          </p>
          {previewEvaluation && (
            <p className="my-[0.2rem] text-gray-600 flex items-center gap-2">
              <strong>Compatibilidad:</strong> {previewEvaluation.score}%
              <span className={`px-2 py-[0.1rem] rounded-full text-xs font-bold ${TIER_BADGE_CLASS[previewEvaluation.tier]}`}>
                Tier {previewEvaluation.tier}
              </span>
              {!previewEvaluation.mandatoryMet && (
                <span className="text-red-600 text-xs font-semibold">Falta Berry Finding S (obligatorio)</span>
              )}
            </p>
          )}
        </div>
      )}

      <div className="mt-4">
        <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-amber-700">Tu box ({box.length})</h4>
        {loadingBox && <p className="text-gray-600">Cargando...</p>}
        {boxError && <p className="text-red-600">{boxError}</p>}
        {!loadingBox && box.length === 0 && (
          <p className="text-gray-600 text-sm">Todavía no tienes Pokémon registrados.</p>
        )}
        <ul className="flex flex-col gap-2">
          {box.map((entry) => {
            const entryNature = natureOptions.find((option) => option.name === entry.nature) ?? null
            const entryEvaluation = entry.species
              ? evaluateSleepPokemon({
                  specialty: entry.species.specialty,
                  subskills: getEntrySubskills(entry),
                  ingredients: getEntryIngredients(entry),
                  naturePositiveStat: entryNature?.positive ?? null,
                })
              : null
            return (
            <li
              key={entry.id}
              className="p-[0.6rem] rounded-lg bg-white border border-amber-200 flex justify-between items-center gap-2"
            >
              <div className="text-sm text-gray-700">
                <strong>{entry.nickname || entry.species?.name}</strong> — {entry.species?.name} ·{' '}
                {entry.nature || 'sin naturaleza'} · RP {entry.current_rp ?? '—'}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleLevelChange(entry, -1)}
                  disabled={levelUpdatingId === entry.id || entry.level <= sleepLevels.min}
                  className="w-6 h-6 rounded-md border border-amber-300 bg-white font-bold text-gray-700 disabled:opacity-40"
                  aria-label="Bajar nivel"
                >
                  −
                </button>
                <span className="text-sm font-semibold text-gray-700 w-16 text-center">Nv. {entry.level}</span>
                <button
                  type="button"
                  onClick={() => handleLevelChange(entry, 1)}
                  disabled={levelUpdatingId === entry.id || entry.level >= sleepLevels.max}
                  className="w-6 h-6 rounded-md border border-amber-300 bg-white font-bold text-gray-700 disabled:opacity-40"
                  aria-label="Subir nivel"
                >
                  +
                </button>
              </div>
              {entryEvaluation && (
                <span
                  className={`px-2 py-[0.2rem] rounded-full text-xs font-bold shrink-0 ${TIER_BADGE_CLASS[entryEvaluation.tier]}`}
                >
                  {entryEvaluation.score}% · Tier {entryEvaluation.tier}
                </span>
              )}
              <button
                type="button"
                onClick={() => removePokemon(entry.id)}
                className="text-xs font-semibold text-red-600 underline shrink-0"
              >
                Eliminar
              </button>
            </li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}
