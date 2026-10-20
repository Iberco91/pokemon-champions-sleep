// Cálculo real de RP (Fase 7 — CLAUDE.md 1.1). Puerto fiel de la fórmula de
// nerolis-lab/nerolis-lab (common/src/utils/rp-utils/rp.ts, Apache-2.0),
// verificado 2026-08-29 contra un caso real: Gengar nv.65, Ribbon 3, Skill
// Level 6, sub-skills Sleep EXP Bonus/Inventory Up M/Ingredient Finder M,
// naturaleza Quiet, ingredientes Fiery Herb/Tasty Mushroom/Pure Oil → RP 6539.
// Reemplaza el placeholder `estimateRp = nivel * 15`.

import { getNatureStatFactor, natureOptions, subskillLevels } from '../data/sleepData.js'
import { getActiveSubskills, computeFrequencyMultiplier } from './sleepStats.js'
import { getBerryBaseValue, berryStrengthForLevel } from '../data/sleepBerries.js'
import { ingredientValues } from '../data/sleepRecipes.js'
import { getIngredientSlotOptions, getIngredientQuantity } from '../data/sleepIngredientSlots.js'
import {
  mainSkillRpTable,
  getIngredientGrowthFactor,
  INGREDIENT_FINDER_AMOUNTS,
  SKILL_TRIGGER_AMOUNTS,
  MISC_RP_SUBSKILL_FACTORS,
  floorWithCorrection,
} from '../data/sleepRpTables.js'

function getIngredientChance(entry, species, nature) {
  const subskills = getActiveSubskills(entry)
  const finderMultiplier =
    Math.round(
      (1 +
        (subskills.includes('Ingredient Finder M') ? INGREDIENT_FINDER_AMOUNTS['Ingredient Finder M'] : 0) +
        (subskills.includes('Ingredient Finder S') ? INGREDIENT_FINDER_AMOUNTS['Ingredient Finder S'] : 0)) *
        100,
    ) / 100
  const natureFactor = getNatureStatFactor(nature, 'Ingredient Finding')
  return floorWithCorrection(((species.ingredient_percentage ?? 0) / 100) * natureFactor * finderMultiplier, 4)
}

function getSkillChance(entry, species, nature) {
  const subskills = getActiveSubskills(entry)
  const triggerMultiplier =
    Math.round(
      (1 +
        (subskills.includes('Skill Trigger M') ? SKILL_TRIGGER_AMOUNTS['Skill Trigger M'] : 0) +
        (subskills.includes('Skill Trigger S') ? SKILL_TRIGGER_AMOUNTS['Skill Trigger S'] : 0)) *
        100,
    ) / 100
  const natureFactor = getNatureStatFactor(nature, 'Main Skill Chance')
  return floorWithCorrection(((species.skill_percentage ?? 0) / 100) * natureFactor * triggerMultiplier, 4)
}

// helpFactor: representación de "ayudas por hora" propia de la fórmula de RP
// (distinta en su redondeo a computeFrequencySeconds, que sirve para mostrar
// la frecuencia — misma base, uso distinto, igual que en la fuente original).
function getHelpFactor(entry, species, nature) {
  const multiplier = computeFrequencyMultiplier(entry, species, nature)
  return 5 * floorWithCorrection(3600 / (species.base_frequency_seconds * multiplier), 2)
}

// ingredientsValue = promedio de (cantidad recolectada × valor del
// ingrediente) entre los slots ya desbloqueados al nivel actual. La cantidad
// por slot/ingrediente ya viene fija en speciesIngredientSlots.js (son los
// mismos números reales del juego, ya ajustados por especialidad — un
// Pokémon de tipo Ingredients trae el doble de cantidad en sus slots que uno
// de otra especialidad, sin que el código tenga que aplicar ningún factor
// aparte). CORREGIDO 2026-09-03: la versión anterior reconstruía "amount"
// a mano (baseStrength/dropValue con factores 1/2.25/3.6 inventados) en vez
// de usar la cantidad real — coincidía por casualidad en algunos casos
// (ej. Gengar) pero daba mal en otros (detectado con una Gardevoir real:
// RP del sistema 6099 vs RP del juego 6046). Fórmula real verificada contra
// nerolis-lab/nerolis-lab (common/src/utils/rp-utils/rp.ts, método
// `ingredientFactor`).
function getIngredientFactor(entry, species, helpFactor, ingredientChance) {
  const level = entry.level ?? 1
  const tiers = [
    { slot: 'a', unlockLevel: 1, ingredient: entry.ingredient_a },
    { slot: 'b', unlockLevel: 30, ingredient: entry.ingredient_b },
    { slot: 'c', unlockLevel: 60, ingredient: entry.ingredient_c },
  ].filter((tier) => tier.ingredient && level >= tier.unlockLevel)

  if (tiers.length === 0) return 0

  const total = tiers.reduce((sum, tier) => {
    const quantity = getIngredientQuantity(species.name, tier.slot, tier.ingredient) ?? 0
    const value = ingredientValues[tier.ingredient] ?? 0
    return sum + quantity * value
  }, 0)
  const ingredientsValue = Math.floor(total / tiers.length)
  const ingredientGrowth = getIngredientGrowthFactor(level)

  return floorWithCorrection(helpFactor * ingredientChance * ingredientsValue * ingredientGrowth, 2)
}

function getBerryFactor(entry, species, helpFactor, ingredientChance) {
  const level = entry.level ?? 1
  const berriesPerDrop = (species.specialty === 'Berries' ? 2 : 1) + (getActiveSubskills(entry).includes('Berry Finding S') ? 1 : 0)
  const baseValue = getBerryBaseValue(species.berry_type)
  const berryValue = berriesPerDrop * berryStrengthForLevel(baseValue, level)
  return floorWithCorrection(helpFactor * (1 - ingredientChance) * berryValue, 2)
}

function getSkillFactor(entry, species, helpFactor, skillChance) {
  const skillLevel = entry.skill_level ?? 1
  const skillValue = mainSkillRpTable[species.main_skill]?.[skillLevel - 1] ?? 0
  return floorWithCorrection(helpFactor * skillChance * skillValue, 2)
}

function getMiscFactor(entry, nature) {
  const energyFactor = getNatureStatFactor(nature, 'Energy Recovery')
  const convertedNatureEnergy = energyFactor < 1 ? 0.92 : energyFactor > 1 ? 1.08 : 1
  const subskillBonus = getActiveSubskills(entry).reduce(
    (sum, skill) => sum + (MISC_RP_SUBSKILL_FACTORS[skill] ?? 0),
    0,
  )
  return Math.round(convertedNatureEnergy * (1 + subskillBonus) * 100) / 100
}

// RP total del Pokémon a su nivel, sub-skills, naturaleza, ingredientes,
// Ribbon y nivel de Main Skill actuales. Devuelve null si falta la especie.
export function computeRp(entry, species, nature) {
  if (!species) return null

  const helpFactor = getHelpFactor(entry, species, nature)
  const ingredientChance = getIngredientChance(entry, species, nature)
  const skillChance = getSkillChance(entry, species, nature)

  const ingredientFactor = getIngredientFactor(entry, species, helpFactor, ingredientChance)
  const berryFactor = getBerryFactor(entry, species, helpFactor, ingredientChance)
  const skillFactor = getSkillFactor(entry, species, helpFactor, skillChance)
  const miscFactor = getMiscFactor(entry, nature)

  return Math.round(miscFactor * (ingredientFactor + berryFactor + skillFactor))
}

// --- RP ideal (techo teórico) ------------------------------------------
//
// En vez de juzgar el RP contra cortes fijos por nivel (ej. "6000 a nivel
// 60 es bueno"), se calcula cuál sería el RP máximo de ESTE MISMO Pokémon
// (misma especie, mismo nivel, mismo Ribbon y mismo nivel de Main Skill —
// es decir, la misma inversión ya hecha) si sus sub-skills, naturaleza e
// ingredientes fueran los ideales. El cociente RP real / RP ideal da un %
// de eficiencia comparable entre niveles y especies (mismo enfoque que usan
// calculadoras de IV de la comunidad, ej. nitoyon/pokesleep-tool), y es lo
// que sleepScoring.js combina con el score estructural existente.
//
// Se excluyen del pool de sub-skills candidatas "Inventory Up S/M/L" (su
// factor RP de 0.071/0.139/0.181 siempre pierde contra cualquiera de las 5
// sub-skills de 0.221 de MISC_RP_SUBSKILL_FACTORS) y "Skill Level Up S/M"
// (no tienen ningún término en la fórmula de RP — el nivel de Main Skill se
// toma directo de entry.skill_level). Mantenerlas fuera reduce el espacio de
// búsqueda sin cambiar el resultado óptimo.
const RP_SUBSKILL_CANDIDATES = [
  'Berry Finding S',
  'Helping Speed S',
  'Helping Speed M',
  'Ingredient Finder S',
  'Ingredient Finder M',
  'Skill Trigger S',
  'Skill Trigger M',
  'Helping Bonus',
  'Sleep EXP Bonus',
]

function* combinations(items, size) {
  if (size === 0) {
    yield []
    return
  }
  for (let i = 0; i <= items.length - size; i += 1) {
    for (const rest of combinations(items.slice(i + 1), size - 1)) {
      yield [items[i], ...rest]
    }
  }
}

// La elección de ingrediente por slot no depende de sub-skills/naturaleza:
// en getIngredientFactor, helpFactor e ingredientChance multiplican el
// resultado como un escalar común, así que buscar el combo que maximiza el
// factor con escalares fijos en 1 da el mismo orden que con los reales.
function findBestIngredientCombo(entry, species) {
  const level = entry.level ?? 1
  const slotUnlockLevels = { ingredient_a: 1, ingredient_b: 30, ingredient_c: 60 }
  const slotLetters = { ingredient_a: 'a', ingredient_b: 'b', ingredient_c: 'c' }

  const optionsByField = Object.keys(slotUnlockLevels).map((field) => {
    if (level < slotUnlockLevels[field]) return [entry[field] ?? null]
    const names = getIngredientSlotOptions(species.name, slotLetters[field]).map((opt) => opt.name)
    return names.length ? names : [entry[field] ?? null]
  })

  let best = null
  let bestValue = -Infinity
  for (const ingredient_a of optionsByField[0]) {
    for (const ingredient_b of optionsByField[1]) {
      for (const ingredient_c of optionsByField[2]) {
        const candidate = { ...entry, ingredient_a, ingredient_b, ingredient_c }
        const value = getIngredientFactor(candidate, species, 1, 1)
        if (value > bestValue) {
          bestValue = value
          best = { ingredient_a, ingredient_b, ingredient_c }
        }
      }
    }
  }
  return best ?? { ingredient_a: entry.ingredient_a ?? null, ingredient_b: entry.ingredient_b ?? null, ingredient_c: entry.ingredient_c ?? null }
}

// Sub-skills y naturaleza sí interactúan entre sí (afectan helpFactor,
// ingredientChance, skillChance y miscFactor a la vez), así que se prueban
// juntas por fuerza bruta contra la fórmula real de RP.
function findBestRpForSubskillsAndNature(baseEntry, species) {
  const level = baseEntry.level ?? 1
  const unlockedLevels = subskillLevels.filter((lvl) => level >= lvl)
  const slotCount = Math.min(unlockedLevels.length, RP_SUBSKILL_CANDIDATES.length)

  let bestRp = -Infinity
  const combosToTry = slotCount === 0 ? [[]] : combinations(RP_SUBSKILL_CANDIDATES, slotCount)
  for (const combo of combosToTry) {
    const candidateEntry = { ...baseEntry }
    unlockedLevels.forEach((lvl, index) => {
      candidateEntry[`subskill_${lvl}`] = combo[index] ?? null
    })
    for (const nature of natureOptions) {
      const rp = computeRp(candidateEntry, species, nature)
      if (rp != null && rp > bestRp) bestRp = rp
    }
  }
  return bestRp === -Infinity ? null : bestRp
}

const idealRpCache = new Map()

// RP máximo teórico alcanzable por este Pokémon a su nivel/Ribbon/nivel de
// Main Skill actuales (ver nota arriba). Devuelve null si falta la especie.
export function computeIdealRp(entry, species) {
  if (!species) return null
  const level = entry.level ?? 1
  const cacheKey = `${species.id}|${level}|${entry.ribbon_level ?? 0}|${entry.skill_level ?? 1}`
  if (idealRpCache.has(cacheKey)) return idealRpCache.get(cacheKey)

  const idealIngredients = findBestIngredientCombo(entry, species)
  const baseEntry = { ...entry, ...idealIngredients }
  const idealRp = findBestRpForSubskillsAndNature(baseEntry, species)

  idealRpCache.set(cacheKey, idealRp)
  return idealRp
}
