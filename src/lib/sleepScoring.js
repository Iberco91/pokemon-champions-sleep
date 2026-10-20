// Motor de scoring de Pokémon Sleep (Fase 4 — CLAUDE.md sección 1.2, ampliado
// en Fase 8 con RP real). Traduce la tabla de Especialidad -> Criterios/
// Sub-skills deseadas/Naturaleza óptima en un puntaje base 0-100 ("build
// score": qué tan bien elegidas están las sub-skills/ingredientes/naturaleza
// en abstracto), y lo combina 50/50 con la "eficiencia de RP" real: el RP
// actual del Pokémon (sleepRp.js#computeRp) contra el RP máximo teórico que
// alcanzaría ESTE MISMO Pokémon en su mismo nivel/Ribbon/nivel de Main Skill
// con la mejor tirada posible de sub-skills/naturaleza/ingredientes
// (sleepRp.js#computeIdealRp). Ese cociente reemplaza los cortes fijos por
// nivel (ej. "6000 de RP a nivel 60 es bueno") porque compara al Pokémon
// contra su propio techo, no contra un número absoluto que varía según
// especie y nivel — mismo enfoque que usan calculadoras de IV de la
// comunidad (ej. nitoyon/pokesleep-tool). El peso base ("build score") sigue
// siendo un valor de referencia razonable — no hay una fórmula oficial
// publicada para eso — igual que en sleepStats.js.

import { subskillLevels } from '../data/sleepData.js'
import { getIngredientQuantity } from '../data/sleepIngredientSlots.js'
import { ingredientValues } from '../data/sleepRecipes.js'
import { computeRp, computeIdealRp } from './sleepRp.js'

// "Helping Speed L" y "Skill Trigger L" no existen en el juego actual (ver
// nota en sleepData.js sobre subskillOptions) — se reemplazan por "Skill
// Level Up S/M", que suben directo el nivel del Main Skill.
//
// Puntos por sub-skill deseada (en vez de un valor plano por match): dentro
// de cada familia S/M/(L) los puntos son proporcionales a la magnitud real
// del efecto, para que se note la diferencia entre tener la variante baja o
// alta de la misma sub-skill:
//   - Helping Speed S/M: -7%/-14% frecuencia (sleepStats.js HELPING_SPEED_PERCENT) -> ratio 1:2
//   - Ingredient Finder S/M: +18%/+36% chance (sleepRpTables.js INGREDIENT_FINDER_AMOUNTS) -> ratio 1:2
//   - Skill Trigger S/M: +18%/+36% chance (sleepRpTables.js SKILL_TRIGGER_AMOUNTS) -> ratio 1:2
//   - Skill Level Up S/M: +1/+2 niveles de Main Skill (Game8/TheGamer, verificado 2026-10-20) -> ratio 1:2
//   - Inventory Up S/M/L: +6/+12/+18 Carry Limit (sleepStats.js INVENTORY_UP_BONUS) -> ratio 1:2:3
// Las sub-skills de un solo tier (Helping Bonus) no tienen variante con la
// que compararse, así que mantienen el valor plano que ya tenían.
const BERRY_SUBSKILL_POINTS = { 'Helping Bonus': 10, 'Helping Speed S': 7, 'Helping Speed M': 13 }

const INGREDIENT_SUBSKILL_POINTS = {
  'Ingredient Finder S': 4,
  'Ingredient Finder M': 8,
  'Inventory Up S': 3,
  'Inventory Up M': 6,
  'Inventory Up L': 9,
  'Helping Bonus': 6,
}

const SKILLS_SUBSKILL_POINTS = {
  'Skill Trigger S': 7,
  'Skill Trigger M': 13,
  'Skill Level Up S': 7,
  'Skill Level Up M': 13,
  'Helping Speed S': 7,
  'Helping Speed M': 13,
  'Helping Bonus': 10,
}

const SUBSKILL_POINTS_BY_SPECIALTY = {
  Berries: BERRY_SUBSKILL_POINTS,
  Ingredients: INGREDIENT_SUBSKILL_POINTS,
  Skills: SKILLS_SUBSKILL_POINTS,
}

const DESIRED_SUBSKILLS_BY_SPECIALTY = {
  Berries: Object.keys(BERRY_SUBSKILL_POINTS),
  Ingredients: Object.keys(INGREDIENT_SUBSKILL_POINTS),
  Skills: Object.keys(SKILLS_SUBSKILL_POINTS),
}

// Suma los puntos reales de las sub-skills deseadas presentes, en vez de
// contarlas parejo — así una Pokémon con Helping Speed M puntúa más que uno
// con Helping Speed S, aunque ambos "cuenten como match".
function sumSubskillPoints(specialty, matchedDesiredSubskills) {
  const pointsMap = SUBSKILL_POINTS_BY_SPECIALTY[specialty] ?? {}
  return matchedDesiredSubskills.reduce((sum, skill) => sum + (pointsMap[skill] ?? 0), 0)
}

const OPTIMAL_NATURE_STAT_BY_SPECIALTY = {
  Berries: 'Helping Speed',
  Ingredients: 'Ingredient Finding',
  Skills: 'Main Skill Chance',
}

const MANDATORY_BERRY_SUBSKILL = 'Berry Finding S'

// Puntaje por combinación de ingredientes (sección 1.2: AAA ideal, ABA
// aceptable, ABC subóptimo). Requiere los 3 slots completos para calificar.
// El valor de ABA de acá abajo es solo el piso/fallback (caso 50/50 — ver
// getTwoUniqueIngredientScore): dentro de ese balde no todos los "2 únicos"
// valen igual, así que el valor real se calcula aparte.
const INGREDIENT_COMBO_SCORE = { AAA: 100, ABA: 70, ABC: 40, incomplete: 0 }

const SLOT_LETTERS = ['a', 'b', 'c']

// Dentro del balde "2 ingredientes únicos" (ABA) no da lo mismo CUÁL de los
// dos se repite: que el ingrediente repetido sea el de mayor valor real de
// los 3 slots es casi tan bueno como AAA; que sea el más débil (y el fuerte
// quede solo en 1 slot) es casi tan malo como ABC. Se calcula qué fracción
// del valor total ponderado (cantidad real del slot x valor real del
// ingrediente — mismos datos que usa sleepRp.js#getIngredientFactor) aporta
// el ingrediente repetido, y se interpola linealmente entre el piso de ABC
// (40) y el techo de AAA (100). En el caso promedio (50% del valor viene del
// repetido) da exactamente 70, el mismo valor plano que había antes.
function getTwoUniqueIngredientScore(ingredients, speciesName) {
  const filled = ingredients.filter(Boolean)
  const counts = new Map()
  filled.forEach((name) => counts.set(name, (counts.get(name) ?? 0) + 1))
  const repeatedName = [...counts.entries()].find(([, count]) => count === 2)?.[0]
  if (!repeatedName || !speciesName) return INGREDIENT_COMBO_SCORE.ABA

  let repeatedValue = 0
  let totalValue = 0
  ingredients.forEach((name, index) => {
    if (!name) return
    const quantity = getIngredientQuantity(speciesName, SLOT_LETTERS[index], name) ?? 0
    const value = quantity * (ingredientValues[name] ?? 0)
    totalValue += value
    if (name === repeatedName) repeatedValue += value
  })
  if (totalValue <= 0) return INGREDIENT_COMBO_SCORE.ABA

  const repeatedShare = repeatedValue / totalValue
  return Math.round(40 + repeatedShare * 60)
}

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

// Puntaje estructural ("build score") por especialidad: qué tan bien
// elegidas están las sub-skills/ingredientes/naturaleza en abstracto, sin
// mirar el RP real. Es la mitad del score final (ver evaluateSleepPokemon).
function computeBuildScore(specialty, subskills, ingredients, natureOptimal, matchedDesiredSubskills, speciesName) {
  if (specialty === 'Berries') {
    const mandatoryMet = subskills.includes(MANDATORY_BERRY_SUBSKILL)
    if (!mandatoryMet) return { score: 0, mandatoryMet: false, ingredientCombo: null }
    // Los 4 slots restantes (fuera de BFS) pueden cubrir las 3 sub-skills
    // deseadas restantes — techo 30 (igual que antes: 3 matches x 10), ahora
    // repartido por tier real en vez de parejo.
    const subskillPoints = Math.min(30, sumSubskillPoints(specialty, matchedDesiredSubskills))
    const score = Math.min(100, 50 + subskillPoints + (natureOptimal ? 10 : 0))
    return { score, mandatoryMet: true, ingredientCombo: null }
  }

  if (specialty === 'Ingredients') {
    const ingredientCombo = getIngredientCombo(ingredients)
    const comboScore =
      ingredientCombo === 'ABA'
        ? getTwoUniqueIngredientScore(ingredients, speciesName)
        : INGREDIENT_COMBO_SCORE[ingredientCombo]
    const subskillPoints = Math.min(30, sumSubskillPoints(specialty, matchedDesiredSubskills))
    const score = Math.min(100, Math.round(comboScore * 0.6 + subskillPoints + (natureOptimal ? 10 : 0)))
    return { score, mandatoryMet: true, ingredientCombo }
  }

  if (specialty === 'Skills') {
    // "Sin filtro estricto, pero prioriza activación": base más baja que
    // Berries/Ingredients porque no hay criterio obligatorio que garantice
    // un piso de calidad.
    const subskillPoints = Math.min(50, sumSubskillPoints(specialty, matchedDesiredSubskills))
    const score = Math.min(100, 40 + subskillPoints + (natureOptimal ? 10 : 0))
    return { score, mandatoryMet: true, ingredientCombo: null }
  }

  return { score: 0, mandatoryMet: false, ingredientCombo: null }
}

// Evalúa un Pokémon de Sleep según su especialidad, sub-skills activas,
// ingredientes (solo relevante para Ingredients), naturaleza y RP real vs.
// su propio techo teórico (ver cabecera del archivo). Regla de dominio no
// negociable (CLAUDE.md sección 6): un Pokémon de tipo Berries sin Berry
// Finding S SIEMPRE obtiene score 0, sin importar su RP.
export function evaluateSleepPokemon({ entry, species, nature }) {
  const specialty = species?.specialty
  const subskills = getEntrySubskills(entry)
  const ingredients = getEntryIngredients(entry)
  const naturePositiveStat = nature?.positive ?? null

  const desiredSubskills = DESIRED_SUBSKILLS_BY_SPECIALTY[specialty] ?? []
  const optimalNatureStat = OPTIMAL_NATURE_STAT_BY_SPECIALTY[specialty] ?? null
  const natureOptimal = Boolean(optimalNatureStat) && naturePositiveStat === optimalNatureStat
  const matchedDesiredSubskills = getMatchedDesiredSubskills(subskills, desiredSubskills)

  const build = computeBuildScore(specialty, subskills, ingredients, natureOptimal, matchedDesiredSubskills, species?.name)

  const baseResult = {
    specialty,
    desiredSubskills,
    matchedDesiredSubskills: build.mandatoryMet ? matchedDesiredSubskills : [],
    natureOptimal,
    ingredientCombo: build.ingredientCombo,
    mandatoryMet: build.mandatoryMet,
    buildScore: build.score,
  }

  if (!build.mandatoryMet) {
    return { ...baseResult, score: 0, tier: 'C', rpEfficiency: null, actualRp: null, idealRp: null }
  }

  const actualRp = species ? computeRp(entry, species, nature) : null
  const idealRp = species ? computeIdealRp(entry, species) : null
  const rpEfficiency =
    actualRp != null && idealRp ? Math.max(0, Math.min(100, Math.round((actualRp / idealRp) * 100))) : null

  const score = rpEfficiency != null ? Math.round(build.score * 0.5 + rpEfficiency * 0.5) : build.score

  return { ...baseResult, score, tier: getTier(score), rpEfficiency, actualRp, idealRp }
}

// Helpers para armar el input de evaluateSleepPokemon a partir de una entry
// del box (misma forma que producen BoxPanel/useSleepBox).
export function getEntrySubskills(entry) {
  return subskillLevels.map((level) => entry[`subskill_${level}`]).filter(Boolean)
}

export function getEntryIngredients(entry) {
  return [entry.ingredient_a, entry.ingredient_b, entry.ingredient_c].filter(Boolean)
}
