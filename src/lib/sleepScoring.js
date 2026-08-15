// Motor de scoring de Pokémon Sleep (Fase 4 — CLAUDE.md sección 1.2).
// Traduce la tabla de Especialidad -> Criterios/Sub-skills deseadas/Naturaleza
// óptima en un puntaje 0-100 y un tier S/A/B/C. Los pesos exactos (base, bonus
// por sub-skill, bonus de naturaleza) son valores de referencia razonables —
// no hay una fórmula oficial publicada — ajustar si se confirman magnitudes
// reales, igual que en sleepStats.js.

import { subskillLevels } from '../data/sleepData.js'

const DESIRED_SUBSKILLS_BY_SPECIALTY = {
  Berries: ['Helping Bonus', 'Helping Speed S', 'Helping Speed M', 'Helping Speed L'],
  Ingredients: [
    'Ingredient Finder S',
    'Ingredient Finder M',
    'Inventory Up S',
    'Inventory Up M',
    'Inventory Up L',
    'Helping Bonus',
  ],
  Skills: [
    'Skill Trigger S',
    'Skill Trigger M',
    'Skill Trigger L',
    'Helping Speed S',
    'Helping Speed M',
    'Helping Speed L',
    'Helping Bonus',
  ],
}

const OPTIMAL_NATURE_STAT_BY_SPECIALTY = {
  Berries: 'Helping Speed',
  Ingredients: 'Ingredient Finding',
  Skills: 'Main Skill Chance',
}

const MANDATORY_BERRY_SUBSKILL = 'Berry Finding S'

// Puntaje por combinación de ingredientes (sección 1.2: AAA ideal, ABA
// aceptable, ABC subóptimo). Requiere los 3 slots completos para calificar.
const INGREDIENT_COMBO_SCORE = { AAA: 100, ABA: 70, ABC: 40, incomplete: 0 }

const TIER_THRESHOLDS = [
  { tier: 'S', minScore: 90 },
  { tier: 'A', minScore: 75 },
  { tier: 'B', minScore: 50 },
]

function getTier(score) {
  const match = TIER_THRESHOLDS.find((entry) => score >= entry.minScore)
  return match?.tier ?? 'C'
}

function getIngredientCombo(ingredients) {
  const filled = ingredients.filter(Boolean)
  if (filled.length < 3) return 'incomplete'
  const uniqueCount = new Set(filled).size
  if (uniqueCount === 1) return 'AAA'
  if (uniqueCount === 2) return 'ABA'
  return 'ABC'
}

function getMatchedDesiredSubskills(subskills, desired) {
  return subskills.filter((skill) => desired.includes(skill))
}

// Evalúa un Pokémon de Sleep según su especialidad, sub-skills activas,
// ingredientes (solo relevante para Ingredients) y el stat que favorece su
// naturaleza. Regla de dominio no negociable (CLAUDE.md sección 6): un
// Pokémon de tipo Berries sin Berry Finding S SIEMPRE obtiene score 0.
export function evaluateSleepPokemon({ specialty, subskills = [], ingredients = [], naturePositiveStat = null }) {
  const desiredSubskills = DESIRED_SUBSKILLS_BY_SPECIALTY[specialty] ?? []
  const optimalNatureStat = OPTIMAL_NATURE_STAT_BY_SPECIALTY[specialty] ?? null
  const natureOptimal = Boolean(optimalNatureStat) && naturePositiveStat === optimalNatureStat
  const matchedDesiredSubskills = getMatchedDesiredSubskills(subskills, desiredSubskills)

  if (specialty === 'Berries') {
    const mandatoryMet = subskills.includes(MANDATORY_BERRY_SUBSKILL)
    if (!mandatoryMet) {
      return {
        specialty,
        score: 0,
        tier: 'C',
        mandatoryMet: false,
        desiredSubskills,
        matchedDesiredSubskills: [],
        natureOptimal,
        ingredientCombo: null,
      }
    }
    // Los 4 slots restantes (fuera de BFS) pueden cubrir las 4 sub-skills deseadas.
    const score = Math.min(100, 50 + matchedDesiredSubskills.length * 10 + (natureOptimal ? 10 : 0))
    return {
      specialty,
      score,
      tier: getTier(score),
      mandatoryMet: true,
      desiredSubskills,
      matchedDesiredSubskills,
      natureOptimal,
      ingredientCombo: null,
    }
  }

  if (specialty === 'Ingredients') {
    const ingredientCombo = getIngredientCombo(ingredients)
    const comboScore = INGREDIENT_COMBO_SCORE[ingredientCombo]
    const cappedMatches = Math.min(matchedDesiredSubskills.length, 5)
    const score = Math.min(100, Math.round(comboScore * 0.6 + cappedMatches * 6 + (natureOptimal ? 10 : 0)))
    return {
      specialty,
      score,
      tier: getTier(score),
      mandatoryMet: true,
      desiredSubskills,
      matchedDesiredSubskills,
      natureOptimal,
      ingredientCombo,
    }
  }

  if (specialty === 'Skills') {
    // "Sin filtro estricto, pero prioriza activación": base más baja que
    // Berries/Ingredients porque no hay criterio obligatorio que garantice
    // un piso de calidad.
    const cappedMatches = Math.min(matchedDesiredSubskills.length, 5)
    const score = Math.min(100, 40 + cappedMatches * 10 + (natureOptimal ? 10 : 0))
    return {
      specialty,
      score,
      tier: getTier(score),
      mandatoryMet: true,
      desiredSubskills,
      matchedDesiredSubskills,
      natureOptimal,
      ingredientCombo: null,
    }
  }

  return {
    specialty,
    score: 0,
    tier: 'C',
    mandatoryMet: false,
    desiredSubskills,
    matchedDesiredSubskills: [],
    natureOptimal,
    ingredientCombo: null,
  }
}

// Helpers para armar el input de evaluateSleepPokemon a partir de una entry
// del box (misma forma que producen BoxPanel/useSleepBox).
export function getEntrySubskills(entry) {
  return subskillLevels.map((level) => entry[`subskill_${level}`]).filter(Boolean)
}

export function getEntryIngredients(entry) {
  return [entry.ingredient_a, entry.ingredient_b, entry.ingredient_c].filter(Boolean)
}
