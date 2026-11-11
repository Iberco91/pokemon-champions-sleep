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
//
// Ese puntaje es la "calidad del ejemplar": compara al Pokémon contra su
// propio techo, así que no dice nada de qué tan fuerte es su especie. Para eso
// la evaluación trae aparte `speciesTier` (tier list de RaenonX, ver
// sleepSpeciesTiers.js); los dos indicadores se muestran por separado. Los
// supports de energía traen además `supportTier` (ver más abajo), que
// reemplaza a la tier de RaenonX en la interfaz.

import { subskillLevels } from '../data/sleepData.js'
import { getSpeciesTier } from '../data/sleepSpeciesTiers.js'
import { getSupportSpeciesScore, isEnergySupport } from '../data/sleepSupportTiers.js'
import { getIngredientQuantity } from '../data/sleepIngredientSlots.js'
import { ingredientValues } from '../data/sleepRecipes.js'
import { computeRp, computeIdealRp, RP_SUBSKILL_CANDIDATES, OPTIMAL_NATURE_STAT_BY_SPECIALTY } from './sleepRp.js'

// "Helping Speed L" y "Skill Trigger L" no existen en el juego actual (ver
// nota en sleepData.js sobre subskillOptions).
//
// "Skill Level Up S/M" vale 0 en todos los puntajes (decisión del usuario
// 2026-10-30): solo sube el nivel de la Main Skill, que igual se lleva al
// máximo con Main Skill Seeds, y desde ahí la sub-skill no aporta nada.
//
// Puntos por sub-skill deseada (en vez de un valor plano por match): dentro
// de cada familia S/M/(L) los puntos son proporcionales a la magnitud real
// del efecto, para que se note la diferencia entre tener la variante baja o
// alta de la misma sub-skill:
//   - Helping Speed S/M: -7%/-14% frecuencia (sleepStats.js HELPING_SPEED_PERCENT) -> ratio 1:2
//   - Ingredient Finder S/M: +18%/+36% chance (sleepRpTables.js INGREDIENT_FINDER_AMOUNTS) -> ratio 1:2
//   - Skill Trigger S/M: +18%/+36% chance (sleepRpTables.js SKILL_TRIGGER_AMOUNTS) -> ratio 1:2
//   - Inventory Up S/M/L: +6/+12/+18 Carry Limit (sleepStats.js INVENTORY_UP_BONUS) -> ratio 1:2:3
// Las sub-skills de un solo tier (Helping Bonus) no tienen variante con la
// que compararse, así que mantienen el valor plano que ya tenían.
const BERRY_SUBSKILL_POINTS = { 'Helping Bonus': 10, 'Helping Speed S': 7, 'Helping Speed M': 13 }

// Helping Speed S/M también cuentan para Ingredientes (usuario 2026-11-11):
// -7%/-14% de frecuencia = más ayudas por día = más ingredientes. Antes no
// estaban y valían solo por RP, donde pierden contra el +22,1% fijo de Energy
// Recovery Bonus, así que "¿Qué le falta?" sugería cambiar Helping Speed M por
// Energy Recovery Bonus en Pokémon de Ingredientes.
const INGREDIENT_SUBSKILL_POINTS = {
  'Ingredient Finder S': 4,
  'Ingredient Finder M': 8,
  'Helping Speed S': 4,
  'Helping Speed M': 8,
  'Inventory Up S': 3,
  'Inventory Up M': 6,
  'Inventory Up L': 9,
  'Helping Bonus': 6,
}

const SKILLS_SUBSKILL_POINTS = {
  'Skill Trigger S': 7,
  'Skill Trigger M': 13,
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

// Berry Finding S fuera de Berries (pedido del usuario 2026-11-09): no es
// deseada ni óptima, pero suma algo porque da 1 berry más por recolección.
// Vale menos que cualquier deseada de la especialidad, así que nunca entra
// en el ejemplar ideal ni aparece como mejora sobre una deseada.
const SECONDARY_SUBSKILL_POINTS_BY_SPECIALTY = {
  Ingredients: { 'Berry Finding S': 2 },
  Skills: { 'Berry Finding S': 4 },
}

function sumSecondarySubskillPoints(specialty, subskills) {
  const pointsMap = SECONDARY_SUBSKILL_POINTS_BY_SPECIALTY[specialty] ?? {}
  return subskills.reduce((sum, skill) => sum + (pointsMap[skill] ?? 0), 0)
}

// Suma los puntos reales de las sub-skills deseadas presentes, en vez de
// contarlas parejo — así una Pokémon con Helping Speed M puntúa más que uno
// con Helping Speed S, aunque ambos "cuenten como match".
function sumSubskillPoints(specialty, matchedDesiredSubskills) {
  const pointsMap = SUBSKILL_POINTS_BY_SPECIALTY[specialty] ?? {}
  return matchedDesiredSubskills.reduce((sum, skill) => sum + (pointsMap[skill] ?? 0), 0)
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

// Letra de la calidad del ejemplar (escala definida por el usuario
// 2026-11-09): S 90-100, A 80-89, B 70-79, C 60-69, D 50-59, E bajo 50.
const TIER_THRESHOLDS = [
  { tier: 'S', minScore: 90 },
  { tier: 'A', minScore: 80 },
  { tier: 'B', minScore: 70 },
  { tier: 'C', minScore: 60 },
  { tier: 'D', minScore: 50 },
]
const LOWEST_TIER = 'E'

function getTier(score) {
  const match = TIER_THRESHOLDS.find((entry) => score >= entry.minScore)
  return match?.tier ?? LOWEST_TIER
}

function getIngredientCombo(ingredients) {
  const filled = ingredients.filter(Boolean)
  if (filled.length < 3) return 'incomplete'
  const uniqueCount = new Set(filled).size
  if (uniqueCount === 1) return 'AAA'
  if (uniqueCount === 2) return 'ABA'
  return 'ABC'
}

// --- Tier de support -----------------------------------------------------
//
// Para especies con Energy for Everyone / Energizing Cheer, la tier de
// RaenonX no sirve (no cuenta la energía que entregan al equipo). En su lugar
// se muestran dos indicadores separados, igual que en el resto de los
// Pokémon (especie / ejemplar; usuario 2026-11-09, antes era una mezcla
// 70/30 de ambos):
//   - Especie: la especie comparada con los otros supports
//     (sleepSupportTiers.js), `speciesScore` / `speciesTier`.
//   - Ejemplar: el ejemplar comparado con el mismo Pokémon ideal (naturaleza
//     + 5 sub-skills perfectas), `specimenScore` / `specimenTier`.
// Las letras usan la misma escala que la calidad del ejemplar (getTier: S
// 90+, A 80+, B 70+, C 60+, D 50+, E bajo 50), para que signifiquen lo mismo
// en todas partes.

// Ejemplar ideal: Skill Trigger M + Helping Speed M + Skill Trigger S + Berry
// Finding S + una de Helping Bonus / Energy Recovery Bonus / Helping Speed S
// = 85 puntos, más naturaleza + Main Skill Chance (15) = 100. Berry Finding S
// no ayuda como support, pero suma cuando la berry del Pokémon es favorita de
// Snorlax esa semana (pedido del usuario); vale 1 punto más que las de 11
// para que sin ella el máximo sea 84 y el ideal la exija. Skill Level Up S/M
// vale 0 (ver cabecera).
//
// Energy Recovery Bonus suma +14% a la energía que recupera TODO el equipo al
// dormir (nerolis-lab: member-state.ts cuenta los miembros con ERB del
// equipo), pero esa recuperación tiene tope de 100, así que no aporta si el
// usuario duerme ~8,5 h. Por eso vale como Helping Bonus y menos que Skill
// Trigger M, que da más activaciones de la skill todos los días (acordado con
// el usuario 2026-10-30).
const SUPPORT_SUBSKILL_POINTS = {
  'Skill Trigger M': 26,
  'Helping Speed M': 22,
  'Skill Trigger S': 14,
  'Berry Finding S': 12,
  'Helping Speed S': 11,
  'Helping Bonus': 11,
  'Energy Recovery Bonus': 11,
  // Solo suman en supports (decisión del usuario 2026-11-09): poco, para que
  // nunca reemplacen a las de arriba en el ejemplar ideal.
  'Dream Shard Bonus': 5,
  'Sleep EXP Bonus': 5,
  'Research EXP Bonus': 5,
}
const MAX_SUPPORT_SUBSKILL_POINTS = 85

function getSupportNaturePoints(nature) {
  if (nature?.positive === 'Main Skill Chance') return 15
  if (nature?.positive === 'Helping Speed') return 10
  if (nature?.negative === 'Main Skill Chance' || nature?.negative === 'Helping Speed') return 0
  return 7
}

function computeSupportSpecimenScore(subskills, nature) {
  const subskillPoints = subskills.reduce((sum, skill) => sum + (SUPPORT_SUBSKILL_POINTS[skill] ?? 0), 0)
  return Math.round(Math.min(MAX_SUPPORT_SUBSKILL_POINTS, subskillPoints) + getSupportNaturePoints(nature))
}

function computeSupportTier(species, subskills, nature) {
  if (!isEnergySupport(species)) return null
  const speciesScore = getSupportSpeciesScore(species)
  if (!speciesScore) return null
  const specimenScore = computeSupportSpecimenScore(subskills, nature)
  return {
    speciesScore: speciesScore.score,
    speciesTier: getTier(speciesScore.score),
    teamEnergy: speciesScore.teamEnergy,
    specimenScore,
    specimenTier: getTier(specimenScore),
  }
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
    // repartido por tier real en vez de parejo. Base 60 (antes 50, que dejaba
    // el techo en 90 y ningún Pokémon de Berries podía llegar a 100%;
    // corregido 2026-10-30).
    const subskillPoints = Math.min(30, sumSubskillPoints(specialty, matchedDesiredSubskills))
    const score = Math.min(100, 60 + subskillPoints + (natureOptimal ? 10 : 0))
    return { score, mandatoryMet: true, ingredientCombo: null }
  }

  if (specialty === 'Ingredients') {
    const ingredientCombo = getIngredientCombo(ingredients)
    const comboScore =
      ingredientCombo === 'ABA'
        ? getTwoUniqueIngredientScore(ingredients, speciesName)
        : INGREDIENT_COMBO_SCORE[ingredientCombo]
    const subskillPoints = Math.min(
      30,
      sumSubskillPoints(specialty, matchedDesiredSubskills) + sumSecondarySubskillPoints(specialty, subskills),
    )
    const score = Math.min(100, Math.round(comboScore * 0.6 + subskillPoints + (natureOptimal ? 10 : 0)))
    return { score, mandatoryMet: true, ingredientCombo }
  }

  if (specialty === 'Skills') {
    // "Sin filtro estricto, pero prioriza activación": base más baja que
    // Berries/Ingredients porque no hay criterio obligatorio que garantice
    // un piso de calidad.
    const subskillPoints = Math.min(
      50,
      sumSubskillPoints(specialty, matchedDesiredSubskills) + sumSecondarySubskillPoints(specialty, subskills),
    )
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
    speciesTier: getSpeciesTier(species),
    supportTier: computeSupportTier(species, subskills, nature),
  }

  if (!build.mandatoryMet) {
    return { ...baseResult, score: 0, tier: LOWEST_TIER, rpEfficiency: null, actualRp: null, idealRp: null }
  }

  const actualRp = species ? computeRp(entry, species, nature) : null
  const scoredRp = species
    ? computeRp(baseResult.supportTier ? entry : withoutNonScoringSubskills(entry), species, nature)
    : null
  const idealRp = species ? computeIdealRp(entry, species) : null
  const rpEfficiency =
    scoredRp != null && idealRp ? Math.max(0, Math.min(100, Math.round((scoredRp / idealRp) * 100))) : null

  const score = rpEfficiency != null ? Math.round(build.score * 0.5 + rpEfficiency * 0.5) : build.score

  return { ...baseResult, score, tier: getTier(score), rpEfficiency, actualRp, scoredRp, idealRp }
}

// Dream Shard Bonus, Sleep EXP Bonus y Research EXP Bonus multiplican el RP
// real del juego (+22,1%, igual que Helping Bonus), pero no aportan calorías a
// Snorlax. Por decisión del usuario (2026-11-09) no suman en el puntaje salvo
// en supports de energía (que valen por su tier de support, donde sí tienen
// algunos puntos), así que fuera de los supports la eficiencia de RP se
// calcula como si esos slots estuvieran vacíos. Sin esto, en un Pokémon que no
// es de Berries, Dream Shard Bonus subía más el RP que Berry Finding S y "¿Qué
// le falta?" sugería cambiar Berry Finding S por Dream Shard Bonus. El RP real
// (actualRp) se sigue mostrando tal cual lo calcula el juego.
//
// Energy Recovery Bonus entra en la misma lista (usuario 2026-11-11): también
// suma +22,1% al RP, pero no aumenta la producción del Pokémon (solo la
// energía del equipo al dormir, que tiene tope de 100). En supports sigue
// valiendo sus puntos de SUPPORT_SUBSKILL_POINTS.
const NON_SCORING_RP_SUBSKILLS = ['Dream Shard Bonus', 'Sleep EXP Bonus', 'Research EXP Bonus', 'Energy Recovery Bonus']

function withoutNonScoringSubskills(entry) {
  const cleaned = { ...entry }
  for (const level of subskillLevels) {
    if (NON_SCORING_RP_SUBSKILLS.includes(cleaned[`subskill_${level}`])) cleaned[`subskill_${level}`] = null
  }
  return cleaned
}

// Sub-skills que pueden subir el puntaje de esta especie (el resto vale 0 en
// todos los términos). Las usa sleepImprovements.js para acotar la búsqueda
// exhaustiva: build de la especialidad, Berry Finding S (obligatoria en
// Berries), las que suben el RP que puntúa y, en supports, las de su tier.
export function getScoringSubskills(species) {
  const support = isEnergySupport(species)
  const pool = new Set([
    ...Object.keys(SUBSKILL_POINTS_BY_SPECIALTY[species?.specialty] ?? {}),
    MANDATORY_BERRY_SUBSKILL,
    ...RP_SUBSKILL_CANDIDATES,
    'Energy Recovery Bonus',
    ...(support ? Object.keys(SUPPORT_SUBSKILL_POINTS) : []),
  ])
  if (!support) NON_SCORING_RP_SUBSKILLS.forEach((skill) => pool.delete(skill))
  return [...pool]
}

// Helpers para armar el input de evaluateSleepPokemon a partir de una entry
// del box (misma forma que producen BoxPanel/useSleepBox).
export function getEntrySubskills(entry) {
  return subskillLevels.map((level) => entry[`subskill_${level}`]).filter(Boolean)
}

export function getEntryIngredients(entry) {
  return [entry.ingredient_a, entry.ingredient_b, entry.ingredient_c].filter(Boolean)
}
