import { getNatureStatFactor, subskillLevels } from '../data/sleepData.js'
import { calculateRibbonCarryBonus, calculateRibbonFrequencyFactor } from '../data/sleepRpTables.js'

// Bono de Carry Limit en unidades de inventario por sub-skill (verificado
// 2026-08-29 contra nerolis-lab/nerolis-lab — coincide con lo que ya había).
const INVENTORY_UP_BONUS = { 'Inventory Up S': 6, 'Inventory Up M': 12, 'Inventory Up L': 18 }

// % de reducción de frecuencia por sub-skill de velocidad (Helping Speed S/M).
// No modela el bono de equipo de "Helping Bonus" (depende de cuántos
// compañeros de equipo también la tengan) porque esta vista es por Pokémon
// individual, no por equipo — mismo enfoque que el resto de la app.
const HELPING_SPEED_PERCENT = { 'Helping Speed S': 0.07, 'Helping Speed M': 0.14 }
const MIN_HELP_SPEED_FACTOR = 0.65

const MIN_FREQUENCY_SECONDS = 600

export function getActiveSubskills(entry) {
  return subskillLevels
    .filter((level) => (entry.level ?? 1) >= level)
    .map((level) => entry[`subskill_${level}`])
    .filter(Boolean)
}

// Carry Limit real = base de especie + 5 por cada evolución previa en la
// línea (Gengar ya trae 2 evoluciones detrás, por ejemplo) + bono de
// sub-skills de inventario + bono de Ribbon. Verificado 2026-08-29 contra un
// caso real (Gengar nv.65, Ribbon 3, Inventory Up M → 46, coincide exacto).
export function computeCarryLimit(entry, species) {
  if (!species) return null
  const evolutionBonus = 5 * (species.previous_evolutions ?? 0)
  const subskillBonus = getActiveSubskills(entry).reduce(
    (sum, skill) => sum + (INVENTORY_UP_BONUS[skill] ?? 0),
    0,
  )
  const ribbonBonus = calculateRibbonCarryBonus(entry.ribbon_level ?? 0)
  return species.base_carry_limit + evolutionBonus + subskillBonus + ribbonBonus
}

// Multiplicador combinado que se aplica a la frecuencia base de la especie:
// nivel (-0.2%/nivel), naturaleza, sub-skills de velocidad y Ribbon (solo
// afecta a Pokémon que aún no llegan a su evolución final). Se expone aparte
// porque sleepRp.js necesita el mismo multiplicador para el cálculo de RP.
export function computeFrequencyMultiplier(entry, species, nature) {
  const level = entry.level ?? 1
  const levelFactor = 1 - 0.002 * (level - 1)
  const natureFactor = getNatureStatFactor(nature, 'Helping Speed')
  const subskillFactor = Math.max(
    MIN_HELP_SPEED_FACTOR,
    1 - getActiveSubskills(entry).reduce((sum, skill) => sum + (HELPING_SPEED_PERCENT[skill] ?? 0), 0),
  )
  const ribbonFactor = calculateRibbonFrequencyFactor(species?.remaining_evolutions, entry.ribbon_level ?? 0)
  return Math.round(levelFactor * natureFactor * subskillFactor * ribbonFactor * 10000) / 10000
}

// Frecuencia real (segundos por ayuda) = frecuencia base de la especie ×
// multiplicador combinado. Verificado 2026-08-29 contra un caso real (Gengar
// nv.65, naturaleza Quiet, sub-skills activas hasta nv.65 → 1918 s = 32 min,
// coincide exacto).
export function computeFrequencySeconds(entry, species, nature) {
  if (!species) return null
  const multiplier = computeFrequencyMultiplier(entry, species, nature)
  const frequency = Math.floor(species.base_frequency_seconds * multiplier)
  return Math.max(frequency, MIN_FREQUENCY_SECONDS)
}

// Incluye segundos (igual que el juego, ej. "31 min 58 s") en vez de
// redondear a minuto — el efecto de nivel en la frecuencia es de solo
// segundos, así que redondear lo escondía por completo entre niveles.
export function formatFrequency(seconds) {
  if (seconds == null) return '—'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  if (hours > 0) return `${hours} h ${minutes} min ${secs} s`
  return `${minutes} min ${secs} s`
}
