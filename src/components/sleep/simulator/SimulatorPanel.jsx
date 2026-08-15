import { useMemo, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth.js'
import { useSleepBox } from '../../../hooks/useSleepBox.js'
import { useSpeciesCatalog } from '../../../hooks/useSpeciesCatalog.js'
import { snorlaxMaps, dishTypes } from '../../../data/sleepData.js'
import { buildOptimalTeam } from '../../../lib/sleepOptimizer.js'

const selectClass = 'px-[0.7rem] py-[0.6rem] rounded-[0.65rem] border border-amber-200 bg-[#fffef9]'
const labelClass = 'flex flex-col gap-[0.35rem] font-semibold text-[0.95rem] text-gray-600'
const FAVORITE_SLOTS = ['favorite_1', 'favorite_2', 'favorite_3']

// Optimizer de equipo ideal para Snorlax/mapas (Fase 6 — CLAUDE.md sección
// 1.4), armado a partir de los Pokémon reales del box del usuario.
export default function SimulatorPanel() {
  const { user } = useAuth()
  const { box, loading, error } = useSleepBox(user?.id)
  const { species } = useSpeciesCatalog()
  const [map, setMap] = useState(snorlaxMaps[0])
  const [dishType, setDishType] = useState(dishTypes[0])
  const [favorites, setFavorites] = useState({ favorite_1: '', favorite_2: '', favorite_3: '' })
  const [areaBonus, setAreaBonus] = useState(0)
  const [recipeLevels, setRecipeLevels] = useState(() =>
    Object.fromEntries(dishTypes.map((type) => [type, 1])),
  )

  const berryTypeOptions = useMemo(
    () => [...new Set(species.map((entry) => entry.berry_type).filter(Boolean))],
    [species],
  )

  const favoriteBerries = useMemo(
    () => FAVORITE_SLOTS.map((slot) => favorites[slot]).filter(Boolean),
    [favorites],
  )

  const team = useMemo(
    () => buildOptimalTeam(box, { favoriteBerries, dishType, areaBonus, recipeLevels }),
    [box, favoriteBerries, dishType, areaBonus, recipeLevels],
  )

  function handleFavoriteChange(slot, value) {
    setFavorites((current) => ({ ...current, [slot]: value }))
  }

  function handleRecipeLevelChange(type, value) {
    const level = Math.min(70, Math.max(1, Number(value) || 1))
    setRecipeLevels((current) => ({ ...current, [type]: level }))
  }

  return (
    <article className="p-4 rounded-[0.9rem] bg-[#fffdf8] border border-amber-200">
      <h3 className="mb-[0.6rem] text-lg font-bold text-gray-900">Optimizer de equipo (Snorlax)</h3>

      {!user && <p className="text-gray-600 text-sm">Inicia sesión para optimizar tu equipo.</p>}
      {user && loading && <p className="text-gray-600">Cargando tu box...</p>}
      {user && error && <p className="text-red-600">{error}</p>}

      {user && !loading && !error && (
        <div className="flex flex-col gap-[0.7rem]">
          <label className={labelClass}>
            Mapa
            <select value={map} onChange={(event) => setMap(event.target.value)} className={selectClass}>
              {snorlaxMaps.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Tipo de plato de la semana
            <select value={dishType} onChange={(event) => setDishType(event.target.value)} className={selectClass}>
              {dishTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {FAVORITE_SLOTS.map((slot, index) => (
              <label key={slot} className={labelClass}>
                Berry favorita {index + 1}
                <select
                  value={favorites[slot]}
                  onChange={(event) => handleFavoriteChange(slot, event.target.value)}
                  className={selectClass}
                >
                  <option value="">—</option>
                  {berryTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className={labelClass}>
              Area Bonus de tu isla (%)
              <input
                type="number"
                min="0"
                max="85"
                value={areaBonus}
                onChange={(event) => setAreaBonus(Math.min(85, Math.max(0, Number(event.target.value) || 0)))}
                className={selectClass}
              />
            </label>
            <label className={labelClass}>
              Nivel de receta ({dishType})
              <input
                type="number"
                min="1"
                max="70"
                value={recipeLevels[dishType]}
                onChange={(event) => handleRecipeLevelChange(dishType, event.target.value)}
                className={selectClass}
              />
            </label>
          </div>

          {team.recipe && (
            <p className="text-sm text-gray-600">
              Plato objetivo: <strong>{team.recipe.name}</strong> (≈{team.recipeValue} Strength por porción, nivel de
              receta {recipeLevels[dishType]}) — requiere {team.recipe.ingredients.map((item) => item.name).join(', ')}
            </p>
          )}

          {team.missingSupport && (
            <p className="text-red-600 text-sm font-semibold">
              No tienes en tu box ningún Pokémon Support con Main Skill "Energy for Everyone" (ej. Wigglytuff,
              Sylveon, Pawmot). Es obligatorio para armar el equipo.
            </p>
          )}

          {!team.missingSupport && team.support && (
            <div className="mt-[0.3rem] p-[0.8rem] rounded-xl bg-orange-50 border border-orange-200 flex flex-col gap-[0.5rem]">
              <p className="my-[0.1rem] text-gray-600 text-sm">
                <strong>Calorías (Strength) semanales estimadas:</strong> {team.totalStrength}
              </p>
              <div className="flex justify-between items-center gap-2 p-[0.5rem] rounded-lg bg-emerald-50 border border-emerald-300">
                <span className="text-sm text-gray-800">
                  <strong>{team.support.entry.nickname || team.support.entry.species?.name}</strong> —{' '}
                  {team.support.entry.species?.name}
                </span>
                <span className="px-2 py-[0.1rem] rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold">
                  Support obligatorio · ≈{team.support.score.total} Strength/semana
                </span>
              </div>
              {team.members.map(({ entry, score }) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-center gap-2 p-[0.5rem] rounded-lg bg-white border border-amber-200"
                >
                  <span className="text-sm text-gray-700">
                    <strong>{entry.nickname || entry.species?.name}</strong> — {entry.species?.name}
                  </span>
                  <span className="text-xs font-semibold text-amber-700">≈{score.total} Strength/semana</span>
                </div>
              ))}
              {team.members.length < 4 && (
                <p className="text-xs text-gray-600">
                  Faltan {4 - team.members.length} Pokémon en tu box para completar el equipo de 5.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
