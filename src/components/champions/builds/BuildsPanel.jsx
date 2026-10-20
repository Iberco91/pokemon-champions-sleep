import { useMemo, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth.js'
import { useChampionsBox } from '../../../hooks/useChampionsBox.js'
import ConfirmDeleteButton from '../../shared/ConfirmDeleteButton.jsx'
import {
  abilities,
  battleStats,
  championsFormats,
  championsNatures,
  championsPool,
  heldItems,
  maxEvPerStat,
  maxEvTotal,
  maxIvPerStat,
  moves,
  teraTypes,
} from '../../../data/championsData.js'

const selectClass = 'px-[0.7rem] py-[0.6rem] rounded-[0.65rem] border border-amber-200 bg-[#fffef9]'
const labelClass = 'flex flex-col gap-[0.35rem] font-semibold text-[0.95rem] text-gray-600'

const emptyEvs = Object.fromEntries(battleStats.map((stat) => [stat, 0]))
const emptyIvs = Object.fromEntries(battleStats.map((stat) => [stat, maxIvPerStat]))

const emptyForm = {
  species: championsPool[0].name,
  format: championsFormats[0],
  nickname: '',
  nature: championsNatures[0].name,
  ability: abilities[0],
  held_item: heldItems[0],
  tera_type: teraTypes[0],
  move_1: moves[0],
  move_2: moves[1] ?? '',
  move_3: moves[2] ?? '',
  move_4: moves[3] ?? '',
  evs: emptyEvs,
  ivs: emptyIvs,
}

// Registro de Pokémon Entrenados (Fase 7 — CLAUDE.md sección 2.1): guarda
// builds listos para combate en user_champions_box (Especie, Formato, Mote,
// EVs/IVs, Naturaleza, Habilidad, Objeto, Teratipo y Moveset de 4 ataques).
export default function BuildsPanel() {
  const { user } = useAuth()
  const { box, loading, error, addPokemon, removePokemon } = useChampionsBox(user?.id)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  const totalEvs = useMemo(() => Object.values(form.evs).reduce((sum, value) => sum + (Number(value) || 0), 0), [form.evs])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleEvChange(stat, value) {
    const clamped = Math.max(0, Math.min(maxEvPerStat, Number(value) || 0))
    setForm((current) => ({ ...current, evs: { ...current.evs, [stat]: clamped } }))
  }

  function handleIvChange(stat, value) {
    const clamped = Math.max(0, Math.min(maxIvPerStat, Number(value) || 0))
    setForm((current) => ({ ...current, ivs: { ...current.ivs, [stat]: clamped } }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!user) {
      setFormError('Debes iniciar sesión.')
      return
    }
    if (totalEvs > maxEvTotal) {
      setFormError(`Los EVs no pueden superar ${maxEvTotal} en total (llevas ${totalEvs}).`)
      return
    }
    setSaving(true)
    setFormError(null)
    const { error: submitError } = await addPokemon({
      species: form.species,
      format: form.format,
      nickname: form.nickname || null,
      nature: form.nature,
      ability: form.ability,
      held_item: form.held_item,
      tera_type: form.tera_type,
      move_1: form.move_1 || null,
      move_2: form.move_2 || null,
      move_3: form.move_3 || null,
      move_4: form.move_4 || null,
      ev_spread: form.evs,
      iv_spread: form.ivs,
    })
    setSaving(false)
    if (submitError) {
      setFormError(submitError.message)
      return
    }
    setForm(emptyForm)
  }

  return (
    <article className="p-4 rounded-[0.9rem] bg-[#fffdf8] border border-amber-200">
      <h3 className="mb-[0.6rem] text-lg font-bold text-gray-900">Builds guardados</h3>

      <form className="flex flex-col gap-[0.7rem]" onSubmit={handleSubmit}>
        <label className={labelClass}>
          Pokémon
          <select name="species" value={form.species} onChange={handleChange} className={selectClass}>
            {championsPool.map((entry) => (
              <option key={entry.name} value={entry.name}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Formato
          <select name="format" value={form.format} onChange={handleChange} className={selectClass}>
            {championsFormats.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Mote (opcional)
          <input name="nickname" value={form.nickname} onChange={handleChange} className={selectClass} />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className={labelClass}>
            Naturaleza
            <select name="nature" value={form.nature} onChange={handleChange} className={selectClass}>
              {championsNatures.map((entry) => (
                <option key={entry.name} value={entry.name}>
                  {entry.name}
                  {entry.plus ? ` (+${entry.plus}/-${entry.minus})` : ' (neutra)'}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Habilidad
            <select name="ability" value={form.ability} onChange={handleChange} className={selectClass}>
              {abilities.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Objeto equipado
            <select name="held_item" value={form.held_item} onChange={handleChange} className={selectClass}>
              {heldItems.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Teratipo
            <select name="tera_type" value={form.tera_type} onChange={handleChange} className={selectClass}>
              {teraTypes.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {['move_1', 'move_2', 'move_3', 'move_4'].map((slot, index) => (
            <label key={slot} className={labelClass}>
              Ataque {index + 1}
              <select name={slot} value={form[slot]} onChange={handleChange} className={selectClass}>
                <option value="">—</option>
                {moves.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold text-gray-600">
            EVs ({totalEvs}/{maxEvTotal})
          </p>
          <div className="grid grid-cols-3 gap-2">
            {battleStats.map((stat) => (
              <label key={stat} className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
                {stat}
                <input
                  type="number"
                  min="0"
                  max={maxEvPerStat}
                  value={form.evs[stat]}
                  onChange={(event) => handleEvChange(stat, event.target.value)}
                  className={selectClass}
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold text-gray-600">IVs</p>
          <div className="grid grid-cols-3 gap-2">
            {battleStats.map((stat) => (
              <label key={stat} className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
                {stat}
                <input
                  type="number"
                  min="0"
                  max={maxIvPerStat}
                  value={form.ivs[stat]}
                  onChange={(event) => handleIvChange(stat, event.target.value)}
                  className={selectClass}
                />
              </label>
            ))}
          </div>
        </div>

        {formError && <p className="text-red-600 text-sm">{formError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-[0.6rem] rounded-[0.65rem] bg-pikachu text-gray-900 font-bold disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Guardar build'}
        </button>
      </form>

      <div className="mt-4">
        <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-amber-700">Tu box ({box.length})</h4>
        {loading && <p className="text-gray-600">Cargando...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && box.length === 0 && (
          <p className="text-gray-600 text-sm">Todavía no tienes builds guardados.</p>
        )}
        <ul className="flex flex-col gap-2">
          {box.map((entry) => (
            <li
              key={entry.id}
              className="p-[0.6rem] rounded-lg bg-white border border-amber-200 flex justify-between items-center gap-2"
            >
              <div className="text-sm text-gray-700">
                <strong>{entry.nickname || entry.species}</strong> — {entry.species} · {entry.format} ·{' '}
                {entry.nature} · Tera {entry.tera_type}
              </div>
              <ConfirmDeleteButton
                label={entry.nickname || entry.species}
                onConfirm={() => removePokemon(entry.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
