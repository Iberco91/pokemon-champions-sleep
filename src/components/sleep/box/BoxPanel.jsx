import { useMemo, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth.js'
import { useSpeciesCatalog } from '../../../hooks/useSpeciesCatalog.js'
import { useSleepBox } from '../../../hooks/useSleepBox.js'
import { natureOptions, sleepLevels, subskillLevels, subskillOptions } from '../../../data/sleepData.js'
import { getIngredientSlotOptions } from '../../../data/sleepIngredientSlots.js'
import {
  computeCarryLimit,
  computeFrequencySeconds,
  formatFrequency,
} from '../../../lib/sleepStats.js'
import { computeRp } from '../../../lib/sleepRp.js'
import { getMainSkillMaxLevel } from '../../../data/sleepRpTables.js'
import { evaluateSleepPokemon } from '../../../lib/sleepScoring.js'
import PokemonDetailModal from './PokemonDetailModal.jsx'
import ConfirmDeleteButton from '../../shared/ConfirmDeleteButton.jsx'

// Horas de sueño acumulado requeridas por nivel de Good-Night Ribbon
// (verificado 2026-09-03 contra Serebii/Game8): 200h, 500h, 1000h, 2000h.
const RIBBON_HOURS = { 1: 200, 2: 500, 3: 1000, 4: 2000 }
const ribbonOptions = [0, 1, 2, 3, 4]

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
  ribbon_level: 0,
  skill_level: 1,
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
  const [selectedEntryId, setSelectedEntryId] = useState(null)

  const selectedSpecies = useMemo(
    () => species.find((entry) => String(entry.id) === String(form.species_id)) ?? null,
    [species, form.species_id],
  )
  const selectedNature = useMemo(
    () => natureOptions.find((entry) => entry.name === form.nature) ?? null,
    [form.nature],
  )

  // Los <input>/<select> del formulario entregan siempre string (ej. level
  // "65"), y baseValue + level en berryStrengthForLevel concatena texto en
  // vez de sumar si no se normaliza antes — por eso se calcula acá, una sola
  // vez, en el borde entre el formulario y la lógica de negocio.
  const normalizedForm = useMemo(
    () => ({
      ...form,
      level: Number(form.level) || 1,
      ribbon_level: Number(form.ribbon_level) || 0,
      skill_level: Number(form.skill_level) || 1,
    }),
    [form],
  )

  const ingredientOptionsA = getIngredientSlotOptions(selectedSpecies?.name, 'a')
  const ingredientOptionsB = getIngredientSlotOptions(selectedSpecies?.name, 'b')
  const ingredientOptionsC = getIngredientSlotOptions(selectedSpecies?.name, 'c')

  const skillLevelMax = selectedSpecies ? getMainSkillMaxLevel(selectedSpecies.main_skill) : 6
  const previewCarryLimit = computeCarryLimit(normalizedForm, selectedSpecies)
  const previewFrequency = computeFrequencySeconds(normalizedForm, selectedSpecies, selectedNature)
  const estimatedRp = computeRp(normalizedForm, selectedSpecies, selectedNature)
  const previewEvaluation = useMemo(() => {
    if (!selectedSpecies) return null
    return evaluateSleepPokemon({ entry: normalizedForm, species: selectedSpecies, nature: selectedNature })
  }, [selectedSpecies, selectedNature, normalizedForm])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  // Cada especie solo puede tener 3 ingredientes fijos y específicos por
  // slot (ver src/data/sleepIngredientSlots.js) — al cambiar de especie, los
  // ingredientes elegidos para la anterior ya no son válidos.
  function handleSpeciesChange(event) {
    const { value } = event.target
    setForm((current) => ({ ...current, species_id: value, ingredient_a: '', ingredient_b: '', ingredient_c: '' }))
  }

  // Sube/baja el nivel de un Pokémon ya guardado y recalcula su RP con la
  // misma fórmula real que usa el alta (computeRp), igual como subir de
  // nivel en el juego actualiza el RP de un ayudante existente.
  async function handleLevelChange(entry, delta) {
    const nextLevel = Math.min(sleepLevels.max, Math.max(sleepLevels.min, (entry.level ?? 1) + delta))
    if (nextLevel === entry.level) return
    setLevelUpdatingId(entry.id)
    const entryNature = natureOptions.find((option) => option.name === entry.nature) ?? null
    const nextRp = computeRp({ ...entry, level: nextLevel }, entry.species, entryNature)
    await updatePokemon(entry.id, { level: nextLevel, current_rp: nextRp })
    setLevelUpdatingId(null)
  }

  // Guarda los cambios hechos en la ficha de detalle (mote, ingredientes,
  // sub-skills, naturaleza, Ribbon, nivel de Main Skill) de un Pokémon ya
  // existente en el box — recalcula RP y evaluación igual que en el alta.
  async function handleEditSave(entry, patch) {
    const editNature = natureOptions.find((option) => option.name === patch.nature) ?? null
    const mergedEntry = { ...entry, ...patch }
    const nextRp = patch.rpOverride ? Number(patch.current_rp) || null : computeRp(mergedEntry, entry.species, editNature)
    const evaluation = entry.species
      ? evaluateSleepPokemon({ entry: mergedEntry, species: entry.species, nature: editNature })
      : null
    await updatePokemon(entry.id, {
      nickname: patch.nickname || null,
      ingredient_a: patch.ingredient_a || null,
      ingredient_b: patch.ingredient_b || null,
      ingredient_c: patch.ingredient_c || null,
      subskill_10: patch.subskill_10 || null,
      subskill_25: patch.subskill_25 || null,
      subskill_50: patch.subskill_50 || null,
      subskill_70: patch.subskill_70 || null,
      subskill_80: patch.subskill_80 || null,
      nature: patch.nature || null,
      ribbon_level: Number(patch.ribbon_level) || 0,
      skill_level: Number(patch.skill_level) || 1,
      current_rp: nextRp,
      evaluation_score: evaluation?.score ?? null,
    })
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
      subskill_70: form.subskill_70 || null,
      subskill_80: form.subskill_80 || null,
      nature: form.nature || null,
      ribbon_level: Number(form.ribbon_level) || 0,
      skill_level: Number(form.skill_level) || 1,
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
            <select name="species_id" value={form.species_id} onChange={handleSpeciesChange} className={selectClass}>
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
              min={sleepLevels.min}
              max={sleepLevels.max}
              value={form.level}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <div className="grid grid-cols-3 gap-2">
            <label className={labelClass}>
              Ingrediente A (nivel 1)
              <select
                name="ingredient_a"
                value={form.ingredient_a}
                onChange={handleChange}
                className={selectClass}
                disabled={!selectedSpecies}
              >
                <option value="">—</option>
                {ingredientOptionsA.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name} (x{opt.quantity})
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Ingrediente B (nivel 30)
              <select
                name="ingredient_b"
                value={form.ingredient_b}
                onChange={handleChange}
                className={selectClass}
                disabled={!selectedSpecies}
              >
                <option value="">—</option>
                {ingredientOptionsB.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name} (x{opt.quantity})
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Ingrediente C (nivel 60)
              <select
                name="ingredient_c"
                value={form.ingredient_c}
                onChange={handleChange}
                className={selectClass}
                disabled={!selectedSpecies}
              >
                <option value="">—</option>
                {ingredientOptionsC.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name} (x{opt.quantity})
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
                  {opt.positive ? ` (+${opt.positive} / -${opt.negative})` : ' (neutra)'}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className={labelClass}>
              Nivel de Ribbon
              <select name="ribbon_level" value={form.ribbon_level} onChange={handleChange} className={selectClass}>
                {ribbonOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                    {RIBBON_HOURS[level] ? ` (${RIBBON_HOURS[level]} h de sueño acumulado)` : ''}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Nivel de Main Skill
              <select name="skill_level" value={form.skill_level} onChange={handleChange} className={selectClass}>
                {Array.from({ length: skillLevelMax }, (_, index) => index + 1).map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>

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
              RP estimado automático: <strong>{estimatedRp ?? '—'}</strong>
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
          {previewEvaluation?.rpEfficiency != null && (
            <p className="my-[0.2rem] text-gray-600 text-sm">
              <strong>Eficiencia de RP:</strong> {previewEvaluation.rpEfficiency}% (RP {previewEvaluation.actualRp} de
              un techo estimado de {previewEvaluation.idealRp} para este nivel/Ribbon/Main Skill)
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
          {box.map((entry) => (
            <li
              key={entry.id}
              className="p-[0.6rem] rounded-lg bg-white border border-amber-200 flex justify-between items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setSelectedEntryId(entry.id)}
                className="text-sm font-bold text-gray-800 underline text-left"
              >
                {entry.nickname || entry.species?.name}
              </button>
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
              <ConfirmDeleteButton
                label={entry.nickname || entry.species?.name}
                onConfirm={() => removePokemon(entry.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      <PokemonDetailModal
        entry={box.find((entry) => entry.id === selectedEntryId) ?? null}
        onClose={() => setSelectedEntryId(null)}
        onLevelChange={handleLevelChange}
        onSave={handleEditSave}
        levelUpdating={levelUpdatingId === selectedEntryId}
      />
    </article>
  )
}
