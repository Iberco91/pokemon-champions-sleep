// Cálculo de Strength (calorías) semanal real para Snorlax — Fase 6
// (CLAUDE.md sección 1.4). Usa los datos confirmados en
// src/data/sleepBerries.js y src/data/sleepRecipes.js. La tasa de producción
// por hora reutiliza computeCarryLimit/computeFrequencySeconds de
// sleepStats.js (mismo enfoque que ya usaba sleepOptimizer.js).
//
// Aproximación explícita: el proyecto no modela ventanas de sueño activas
// (el juego solo produce durante la sesión de sueño, no 24/7), así que se
// asume producción continua durante toda la semana (168h). Esto no afecta el
// ranking relativo entre Pokémon del optimizer, solo la magnitud absoluta
// del número reportado — mismo nivel de fidelity que el resto de la app.

import { natureOptions } from '../data/sleepData.js'
import { computeCarryLimit, computeFrequencySeconds } from './sleepStats.js'
import { FAVORITE_BERRY_MULTIPLIER, berryStrengthForLevel, getBerryBaseValue } from '../data/sleepBerries.js'
import { AVERAGE_WEEKLY_CRIT_MULTIPLIER, ingredientValues, recipeLevelBonusTable } from '../data/sleepRecipes.js'

const WEEKLY_HOURS = 24 * 7
const SECONDS_PER_HOUR = 3600

function getNature(entry) {
  return natureOptions.find((option) => option.name === entry.nature) ?? null
}

export function getThroughputPerHour(entry, species) {
  const carryLimit = computeCarryLimit(entry, species)
  const frequencySeconds = computeFrequencySeconds(entry, species, getNature(entry))
  if (!carryLimit || !frequencySeconds) return 0
  return carryLimit * (SECONDS_PER_HOUR / frequencySeconds)
}

// Strength semanal de berries que aporta un Pokémon (todas las especies
// entregan su berry asignada además de su especialidad, según CLAUDE.md 1.1).
export function computeWeeklyBerryStrength(entry, species, { areaBonus = 0, isFavorite = false } = {}) {
  if (!species) return 0
  const baseValue = getBerryBaseValue(species.berry_type)
  if (!baseValue) return 0
  const weeklyCount = getThroughputPerHour(entry, species) * WEEKLY_HOURS
  const perBerry =
    berryStrengthForLevel(baseValue, entry.level ?? 1, areaBonus) * (isFavorite ? FAVORITE_BERRY_MULTIPLIER : 1)
  return Math.round(weeklyCount * perBerry)
}

// Unidades semanales producidas por cada uno de los 3 slots de ingrediente
// del Pokémon, repartidas en partes iguales del throughput total (misma
// lógica de reparto que ya usa computeCarryLimit para el inventario).
export function computeIngredientWeeklyCounts(entry, species) {
  const ownedIngredients = [entry.ingredient_a, entry.ingredient_b, entry.ingredient_c].filter(Boolean)
  if (ownedIngredients.length === 0) return {}
  const weeklyUnits = (getThroughputPerHour(entry, species) * WEEKLY_HOURS) / ownedIngredients.length
  const counts = {}
  for (const ingredient of ownedIngredients) {
    counts[ingredient] = (counts[ingredient] ?? 0) + weeklyUnits
  }
  return counts
}

// Valor real que aportarían `weeklyCount` unidades de un ingrediente si se
// cocinan en `recipe` a `recipeLevel`, incluyendo el bonus fijo de la receta
// y el promedio semanal de "Extra Tasty". 0 si el ingrediente no forma parte
// de la receta.
export function computeIngredientContributionValue(ingredientName, weeklyCount, recipe, recipeLevel) {
  const usesIngredient = recipe.ingredients.some((item) => item.name === ingredientName)
  if (!usesIngredient || !weeklyCount) return 0
  const level = Math.min(70, Math.max(1, Math.round(recipeLevel) || 1))
  const unitValue = (ingredientValues[ingredientName] ?? 0) * recipeLevelBonusTable[level] * (1 + recipe.bonus / 100)
  return weeklyCount * unitValue * AVERAGE_WEEKLY_CRIT_MULTIPLIER
}

// Suma, para toda la Box, cuánto valor semanal real podría aportarle su
// producción combinada de ingredientes a `recipe`. Sirve para elegir la
// receta objetivo real del tipo de plato de la semana (la que el box puede
// efectivamente cocinar), no la de mayor valor "en el papel".
export function scoreRecipeForBox(recipe, box, recipeLevel) {
  return box.reduce((total, entry) => {
    if (!entry.species) return total
    const weeklyCounts = computeIngredientWeeklyCounts(entry, entry.species)
    const entryValue = Object.entries(weeklyCounts).reduce(
      (sum, [ingredientName, weeklyCount]) =>
        sum + computeIngredientContributionValue(ingredientName, weeklyCount, recipe, recipeLevel),
      0,
    )
    return total + entryValue
  }, 0)
}
