import { subskillLevels } from '../data/sleepData.js'

// Bonos aproximados de sub-skills sobre Carry Limit y Frecuencia de ayuda.
// Son valores de referencia razonables, no una fuente oficial verificada —
// ajustar cuando se confirmen las magnitudes exactas de cada sub-skill.
const INVENTORY_UP_BONUS = { 'Inventory Up S': 6, 'Inventory Up M': 12, 'Inventory Up L': 18 }
const HELPING_SPEED_BONUS_SECONDS = { 'Helping Speed S': 300, 'Helping Speed M': 600, 'Helping Speed L': 900 }
const NATURE_HELPING_SPEED_FACTOR = 0.9

const MIN_FREQUENCY_SECONDS = 600

export function getActiveSubskills(entry) {
  return subskillLevels
    .filter((level) => (entry.level ?? 1) >= level)
    .map((level) => entry[`subskill_${level}`])
    .filter(Boolean)
}

export function computeCarryLimit(entry, species) {
  if (!species) return null
  const bonus = getActiveSubskills(entry).reduce(
    (sum, skill) => sum + (INVENTORY_UP_BONUS[skill] ?? 0),
    0,
  )
  return species.base_carry_limit + bonus
}

export function computeFrequencySeconds(entry, species, nature) {
  if (!species) return null
  const speedBonus = getActiveSubskills(entry).reduce(
    (sum, skill) => sum + (HELPING_SPEED_BONUS_SECONDS[skill] ?? 0),
    0,
  )
  let frequency = species.base_frequency_seconds - speedBonus
  if (nature?.positive === 'Helping Speed') {
    frequency = Math.round(frequency * NATURE_HELPING_SPEED_FACTOR)
  }
  return Math.max(frequency, MIN_FREQUENCY_SECONDS)
}

// Estimación simple de RP en función del nivel. Placeholder de referencia:
// el juego real usa una curva por especie/rareza que no está modelada aquí
// todavía — ajustar cuando se tenga la tabla oficial.
export function estimateRp(level) {
  return Math.max(1, Math.round(level * 15))
}

export function formatFrequency(seconds) {
  if (seconds == null) return '—'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours} h ${minutes} min`
  return `${minutes} min`
}
