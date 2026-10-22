import { useState } from 'react'
import { computeCarryLimit, computeFrequencySeconds, formatFrequency } from '../../../lib/sleepStats.js'
import { computeRp } from '../../../lib/sleepRp.js'
import { evaluateSleepPokemon } from '../../../lib/sleepScoring.js'
import { natureOptions, sleepLevels, subskillLevels, subskillOptions } from '../../../data/sleepData.js'
import { getIngredientQuantity, getIngredientSlotOptions } from '../../../data/sleepIngredientSlots.js'
import { getMainSkillMaxLevel } from '../../../data/sleepRpTables.js'
import EvaluationBadges from '../EvaluationBadges.jsx'

const detailLabelClass = 'text-xs font-bold uppercase tracking-wide text-amber-700'
const detailValueClass = 'text-sm text-gray-800'
const selectClass = 'px-[0.7rem] py-[0.6rem] rounded-[0.65rem] border border-amber-200 bg-[#fffef9]'
const labelClass = 'flex flex-col gap-[0.35rem] font-semibold text-[0.95rem] text-gray-600'

const RIBBON_HOURS = { 1: 200, 2: 500, 3: 1000, 4: 2000 }
const ribbonOptions = [0, 1, 2, 3, 4]

// Reconstruye el form de edición a partir de una entry del box (misma forma
// que usa el form de alta en BoxPanel).
function buildEditForm(entry) {
  return {
    nickname: entry.nickname ?? '',
    ingredient_a: entry.ingredient_a ?? '',
    ingredient_b: entry.ingredient_b ?? '',
    ingredient_c: entry.ingredient_c ?? '',
    subskill_10: entry.subskill_10 ?? '',
    subskill_25: entry.subskill_25 ?? '',
    subskill_50: entry.subskill_50 ?? '',
    subskill_70: entry.subskill_70 ?? '',
    subskill_80: entry.subskill_80 ?? '',
    nature: entry.nature ?? '',
    ribbon_level: entry.ribbon_level ?? 0,
    skill_level: entry.skill_level ?? 1,
    rpOverride: false,
    current_rp: entry.current_rp ?? '',
  }
}

export default function PokemonDetailModal({ entry, onClose, onLevelChange, onSave, levelUpdating }) {
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [saving, setSaving] = useState(false)

  if (!entry) return null

  const species = entry.species
  const nature = natureOptions.find((option) => option.name === entry.nature) ?? null
  const ingredientQtyA = getIngredientQuantity(species?.name, 'a', entry.ingredient_a)
  const ingredientQtyB = getIngredientQuantity(species?.name, 'b', entry.ingredient_b)
  const ingredientQtyC = getIngredientQuantity(species?.name, 'c', entry.ingredient_c)
  const carryLimit = computeCarryLimit(entry, species)
  const frequency = computeFrequencySeconds(entry, species, nature)
  const evaluation = species ? evaluateSleepPokemon({ entry, species, nature }) : null

  const skillLevelMax = species ? getMainSkillMaxLevel(species.main_skill) : 6
  const ingredientOptionsA = getIngredientSlotOptions(species?.name, 'a')
  const ingredientOptionsB = getIngredientSlotOptions(species?.name, 'b')
  const ingredientOptionsC = getIngredientSlotOptions(species?.name, 'c')

  const editNature = editForm ? natureOptions.find((option) => option.name === editForm.nature) ?? null : null
  const editPreviewRp = editForm ? computeRp({ ...entry, ...editForm }, species, editNature) : null

  function handleClose() {
    setEditing(false)
    setEditForm(null)
    onClose()
  }

  function startEditing() {
    setEditForm(buildEditForm(entry))
    setEditing(true)
  }

  function handleEditChange(event) {
    const { name, value, type, checked } = event.target
    setEditForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleEditSave() {
    setSaving(true)
    await onSave(entry, editForm)
    setSaving(false)
    setEditing(false)
    setEditForm(null)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl bg-[#fffdf8] border border-amber-300 p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-3 mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 m-0">{entry.nickname || species?.name}</h3>
            {entry.nickname && <p className="text-sm text-gray-500 m-0">{species?.name}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!editing && (
              <button
                type="button"
                onClick={startEditing}
                className="px-3 py-1 rounded-full border border-amber-300 bg-white text-xs font-bold text-gray-700"
              >
                Editar
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full border border-amber-300 bg-white font-bold text-gray-700"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>

        {evaluation && (
          <div className="mb-4">
            <EvaluationBadges evaluation={evaluation} />
          </div>
        )}

        {editing ? (
          <div className="flex flex-col gap-[0.7rem] mb-4">
            <label className={labelClass}>
              Mote (opcional)
              <input name="nickname" value={editForm.nickname} onChange={handleEditChange} className={selectClass} />
            </label>

            <div className="grid grid-cols-3 gap-2">
              <label className={labelClass}>
                Ingrediente A
                <select name="ingredient_a" value={editForm.ingredient_a} onChange={handleEditChange} className={selectClass}>
                  <option value="">—</option>
                  {ingredientOptionsA.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.name} (x{opt.quantity})
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Ingrediente B
                <select name="ingredient_b" value={editForm.ingredient_b} onChange={handleEditChange} className={selectClass}>
                  <option value="">—</option>
                  {ingredientOptionsB.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.name} (x{opt.quantity})
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Ingrediente C
                <select name="ingredient_c" value={editForm.ingredient_c} onChange={handleEditChange} className={selectClass}>
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
                  value={editForm[`subskill_${level}`]}
                  onChange={handleEditChange}
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
              <select name="nature" value={editForm.nature} onChange={handleEditChange} className={selectClass}>
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
                <select name="ribbon_level" value={editForm.ribbon_level} onChange={handleEditChange} className={selectClass}>
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
                <select name="skill_level" value={editForm.skill_level} onChange={handleEditChange} className={selectClass}>
                  {Array.from({ length: skillLevelMax }, (_, index) => index + 1).map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
              <input type="checkbox" name="rpOverride" checked={editForm.rpOverride} onChange={handleEditChange} />
              Sobrescribir RP manualmente
            </label>

            {editForm.rpOverride ? (
              <label className={labelClass}>
                RP manual
                <input
                  name="current_rp"
                  type="number"
                  min="0"
                  value={editForm.current_rp}
                  onChange={handleEditChange}
                  className={selectClass}
                />
              </label>
            ) : (
              <p className="text-sm text-gray-600">
                RP estimado automático: <strong>{editPreviewRp ?? '—'}</strong>
              </p>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEditSave}
                disabled={saving}
                className="px-4 py-[0.6rem] rounded-[0.65rem] bg-pikachu text-gray-900 font-bold disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setEditForm(null)
                }}
                disabled={saving}
                className="px-4 py-[0.6rem] rounded-[0.65rem] border border-amber-300 bg-white font-bold text-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
              <div>
                <p className={detailLabelClass}>Especialidad</p>
                <p className={detailValueClass}>{species?.specialty ?? '—'}</p>
              </div>
              <div>
                <p className={detailLabelClass}>Berry asignada</p>
                <p className={detailValueClass}>{species?.berry_type ?? '—'}</p>
              </div>
              <div>
                <p className={detailLabelClass}>Main Skill</p>
                <p className={detailValueClass}>{species?.main_skill ?? '—'}</p>
              </div>
              <div>
                <p className={detailLabelClass}>Nivel de Main Skill</p>
                <p className={detailValueClass}>{entry.skill_level ?? '—'}</p>
              </div>
              <div>
                <p className={detailLabelClass}>Naturaleza</p>
                <p className={detailValueClass}>
                  {entry.nature || '—'}
                  {nature?.positive ? ` (+${nature.positive} / -${nature.negative})` : ''}
                </p>
              </div>
              <div>
                <p className={detailLabelClass}>Nivel de Ribbon</p>
                <p className={detailValueClass}>{entry.ribbon_level ?? 0}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className={detailLabelClass}>Nivel</p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onLevelChange(entry, -1)}
                    disabled={levelUpdating || entry.level <= sleepLevels.min}
                    className="w-7 h-7 rounded-md border border-amber-300 bg-white font-bold text-gray-700 disabled:opacity-40"
                    aria-label="Bajar nivel"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-gray-700 w-14 text-center">Nv. {entry.level}</span>
                  <button
                    type="button"
                    onClick={() => onLevelChange(entry, 1)}
                    disabled={levelUpdating || entry.level >= sleepLevels.max}
                    className="w-7 h-7 rounded-md border border-amber-300 bg-white font-bold text-gray-700 disabled:opacity-40"
                    aria-label="Subir nivel"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="my-[0.2rem] text-gray-700">
                <strong>RP:</strong> {entry.current_rp ?? '—'}
                {evaluation?.rpEfficiency != null && (
                  <span className="text-gray-500">
                    {' '}
                    ({evaluation.rpEfficiency}% de su techo estimado de {evaluation.idealRp} en este nivel/Ribbon/Main
                    Skill)
                  </span>
                )}
              </p>
              <p className="my-[0.2rem] text-gray-700">
                <strong>Carry limit:</strong> {carryLimit ?? '—'}
              </p>
              <p className="my-[0.2rem] text-gray-700">
                <strong>Frecuencia:</strong> {formatFrequency(frequency)}
              </p>
            </div>

            <div className="mb-4">
              <p className={`${detailLabelClass} mb-1`}>Ingredientes</p>
              <p className={detailValueClass}>
                A: {entry.ingredient_a ? `${entry.ingredient_a} (x${ingredientQtyA ?? '?'})` : '—'}
                <br />
                B: {entry.ingredient_b ? `${entry.ingredient_b} (x${ingredientQtyB ?? '?'})` : '—'}
                <br />
                C: {entry.ingredient_c ? `${entry.ingredient_c} (x${ingredientQtyC ?? '?'})` : '—'}
              </p>
            </div>

            <div>
              <p className={`${detailLabelClass} mb-1`}>Sub-skills</p>
              <ul className="m-0 pl-4 text-sm text-gray-800 list-disc">
                {subskillLevels.map((level) => (
                  <li key={level}>
                    Nivel {level}: {entry[`subskill_${level}`] || '—'}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
