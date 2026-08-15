// Optimizer de equipo ideal para Snorlax/mapas (Fase 6 — CLAUDE.md sección
// 1.4). Objetivo real de esta herramienta: MAXIMIZAR LAS CALORÍAS/STRENGTH
// SEMANALES que recibe Snorlax, eligiendo el equipo de 5 solo entre los
// Pokémon que el usuario ya tiene guardados en su Box (nunca candidatos
// nuevos — esa es la herramienta de la sección 1.2). Restricción obligatoria:
// el equipo SIEMPRE incluye 1 Pokémon support con Main Skill "Energy for
// Everyone"; los otros 4 slots se eligen del box rankeando cada candidato por
// su Strength semanal individual (berries + aporte real a la receta objetivo
// del tipo de plato de la semana) — mismo enfoque de scoring por candidato
// que antes, ahora con números reales en vez de "puntos" inventados.

import { recipes, computeRecipeValue } from '../data/sleepRecipes.js'
import {
  computeIngredientWeeklyCounts,
  computeIngredientContributionValue,
  computeWeeklyBerryStrength,
  scoreRecipeForBox,
} from './sleepStrength.js'

const SUPPORT_MAIN_SKILL = 'Energy for Everyone S'

export function findSupportCandidates(box) {
  return box.filter((entry) => entry.species?.main_skill === SUPPORT_MAIN_SKILL)
}

// Elige, entre las recetas del tipo de plato de la semana, la que el box
// puede realmente cocinar con más valor semanal (no la de mayor valor "en el
// papel" si nadie produce sus ingredientes).
export function getBestRecipeForType(dishType, box, recipeLevel) {
  const candidates = recipes.filter((recipe) => recipe.type === dishType)
  if (candidates.length === 0) return null
  return candidates.reduce((best, recipe) => {
    const score = scoreRecipeForBox(recipe, box, recipeLevel)
    const bestScore = scoreRecipeForBox(best, box, recipeLevel)
    return score > bestScore ? recipe : best
  })
}

// Strength semanal real de un candidato: berries entregadas (x2 si es
// favorita de la semana) + valor real que sus ingredientes producidos
// aportarían a la receta objetivo.
export function scoreCandidate(entry, { favoriteBerries, areaBonus = 0, recipe, recipeLevel }) {
  const species = entry.species
  if (!species) return { berryStrength: 0, dishStrength: 0, total: 0 }

  const isFavorite = favoriteBerries.includes(species.berry_type)
  const berryStrength = computeWeeklyBerryStrength(entry, species, { areaBonus, isFavorite })

  let dishStrength = 0
  if (recipe) {
    const weeklyCounts = computeIngredientWeeklyCounts(entry, species)
    dishStrength = Math.round(
      Object.entries(weeklyCounts).reduce(
        (sum, [ingredientName, weeklyCount]) =>
          sum + computeIngredientContributionValue(ingredientName, weeklyCount, recipe, recipeLevel),
        0,
      ),
    )
  }

  return { berryStrength, dishStrength, total: berryStrength + dishStrength }
}

// Arma el equipo óptimo de 5: 1 support obligatorio (el de mayor Strength
// semanal entre los disponibles) + los 4 miembros del box con más Strength.
export function buildOptimalTeam(box, { favoriteBerries, dishType, areaBonus = 0, recipeLevels = {} }) {
  const recipeLevel = recipeLevels[dishType] ?? 1
  const recipe = getBestRecipeForType(dishType, box, recipeLevel)
  const recipeValue = recipe ? computeRecipeValue(recipe, recipeLevel) : 0

  const supportCandidates = findSupportCandidates(box)
  if (supportCandidates.length === 0) {
    return { recipe, recipeValue, support: null, members: [], totalStrength: 0, missingSupport: true }
  }

  const scoreOptions = { favoriteBerries, areaBonus, recipe, recipeLevel }
  const rankedSupports = [...supportCandidates].sort(
    (a, b) => scoreCandidate(b, scoreOptions).total - scoreCandidate(a, scoreOptions).total,
  )
  const support = rankedSupports[0]

  const remainingCandidates = box.filter((entry) => entry.id !== support.id)
  const rankedMembers = remainingCandidates
    .map((entry) => ({ entry, score: scoreCandidate(entry, scoreOptions) }))
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 4)

  const supportScore = scoreCandidate(support, scoreOptions)
  const totalStrength = supportScore.total + rankedMembers.reduce((sum, member) => sum + member.score.total, 0)

  return {
    recipe,
    recipeValue,
    support: { entry: support, score: supportScore },
    members: rankedMembers,
    totalStrength,
    missingSupport: false,
  }
}
