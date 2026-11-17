// Motor de scoring de Pokémon Sleep (Fase 4 — CLAUDE.md sección 1.2, ampliado
// en Fase 8 con RP real). Traduce la tabla de Especialidad -> Criterios/
// Sub-skills deseadas/Naturaleza óptima en un puntaje base 0-100 ("build
// score": qué tan bien elegidas están las sub-skills/ingredientes/naturaleza
// en abstracto), y lo combina 50/50 con la "eficiencia de RP" real: el RP
// del Pokémon (sleepRp.js#computeRp) contra el RP máximo teórico que
// alcanzaría ESTE MISMO Pokémon, ambos a nivel 80 (SCORING_LEVEL) y con su Ribbon/nivel de Main Skill
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

import { getNatureStatFactor, subskillLevels } from '../data/sleepData.js'
import { getSpeciesTier } from '../data/sleepSpeciesTiers.js'
import { getSupportSpeciesScore, isEnergySupport } from '../data/sleepSupportTiers.js'
import { getIngredientQuantity } from '../data/sleepIngredientSlots.js'
import { ingredientValues } from '../data/sleepRecipes.js'
import {
  computeRp,
  computeIdealRp,
  RP_SUBSKILL_CANDIDATES,
  OPTIMAL_NATURE_STAT_BY_SPECIALTY,
  INGREDIENT_IDEAL_SUBSKILLS,
} from './sleepRp.js'

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
//
// Berries (recalibrado con el usuario 2026-11-16): las sub-skills deseadas
// valen hasta 55 en vez de 30, para que tener las buenas pese más que solo
// tener Berry Finding S (ver computeBuildScore).
const BERRY_SUBSKILL_POINTS = { 'Helping Bonus': 18, 'Helping Speed S': 12, 'Helping Speed M': 25 }
const BERRY_MANDATORY_POINTS = 25
const BERRY_MAX_SUBSKILL_POINTS = 55
const BERRY_NATURE_POINTS = 20

// Helping Speed S/M también cuentan para Ingredientes (usuario 2026-11-11):
// -7%/-14% de frecuencia = más ayudas por día = más ingredientes. Antes no
// estaban y valían solo por RP, donde pierden contra el +22,1% fijo de Energy
// Recovery Bonus, así que "¿Qué le falta?" sugería cambiar Helping Speed M por
// Energy Recovery Bonus en Pokémon de Ingredientes.
//
// Recalibrado con el usuario 2026-11-16: antes el tope era 30 y con 4
// deseadas ya se llegaba, así que la quinta no sumaba nada. Ahora las
// sub-skills valen hasta 45 puntos del build, proporcional a sus puntos
// contra los del set ideal (INGREDIENT_IDEAL_SUBSKILLS de sleepRp.js: IFM 16 +
// HSM 10 + IUL 9 + HB 8 + IFS 8 = 51). Ingredient Finder S vale más que
// Inventory Up M (usuario 2026-11-16): trae más ingredientes en todas las
// ayudas, mientras Inventory Up solo sirve cuando el Pokémon se llena de
// noche. Con IFS 6 = IUM 6, el ideal quedaba con dos Inventory Up.
const INGREDIENT_SUBSKILL_POINTS = {
  'Ingredient Finder S': 8,
  'Ingredient Finder M': 16,
  'Helping Speed S': 5,
  'Helping Speed M': 10,
  'Inventory Up S': 3,
  'Inventory Up M': 6,
  'Inventory Up L': 9,
  'Helping Bonus': 8,
}
const INGREDIENT_IDEAL_SUBSKILL_POINTS = INGREDIENT_IDEAL_SUBSKILLS.reduce(
  (sum, skill) => sum + INGREDIENT_SUBSKILL_POINTS[skill],
  0,
)
const INGREDIENT_COMBO_WEIGHT = 0.4
const INGREDIENT_MAX_SUBSKILL_POINTS = 45
const INGREDIENT_NATURE_POINTS = 15

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

// Ejemplar por activaciones reales (usuario 2026-11-17; antes era una suma
// de puntos fijos por sub-skill, que dejaba a un Gardevoir con 70% de las
// activaciones del ideal en 63%). Lo que aporta un support es cuántas veces
// activa su skill al día, que es proporcional a:
//   probabilidad de skill × ayudas por día
//   = naturaleza MSC (×1,2 / ×0,8) × (1 + Skill Trigger S 18% + M 36%)
//     × 1 / (naturaleza velocidad (×0,9 / ×1,075) × (1 − reducción))
// con reducción = Helping Speed S 7% + M 14% + Helping Bonus 5% (el propio
// Pokémon también recibe su Helping Bonus; nerolis-lab member-state.ts),
// con tope de 35% (MIN_HELP_SPEED_FACTOR de sleepStats.js). Nivel, Ribbon y
// frecuencia base se cancelan porque se compara con el MISMO Pokémon ideal.
//
// Ejemplar ideal: Skill Trigger M + Helping Speed M + Skill Trigger S + Berry
// Finding S + una de Helping Bonus / Energy Recovery Bonus / Helping Speed S,
// naturaleza + Main Skill Chance. Las activaciones valen hasta 95 puntos
// (cociente contra el ideal con Helping Bonus, con tope de 1, así que Helping
// Speed S como quinta también llega al máximo) y los 5 restantes son extras:
//   - Berry Finding S (5): no da activaciones, pero suma cuando la berry del
//     Pokémon es favorita de Snorlax esa semana (pedido del usuario), y el
//     ideal la exige.
//   - Dream Shard Bonus / Sleep EXP Bonus / Research EXP Bonus (2 c/u, solo
//     en supports, decisión del usuario 2026-11-09): poco, para que nunca
//     reemplacen a las de arriba. Los extras tienen tope de 5.
// Energy Recovery Bonus suma +14% a la energía que recupera TODO el equipo al
// dormir, pero esa recuperación tiene tope de 100, así que no aporta si el
// usuario duerme ~8,5 h. Por acuerdo con el usuario (2026-10-30) vale lo mismo
// que Helping Bonus, así que se modela con su mismo 5%. Skill Level Up S/M
// vale 0 (ver cabecera).
const SUPPORT_SKILL_CHANCE_AMOUNTS = { 'Skill Trigger S': 0.18, 'Skill Trigger M': 0.36 }
const SUPPORT_SPEED_REDUCTION_AMOUNTS = {
  'Helping Speed S': 0.07,
  'Helping Speed M': 0.14,
  'Helping Bonus': 0.05,
  'Energy Recovery Bonus': 0.05,
}
const SUPPORT_MAX_SPEED_REDUCTION = 0.35
const SUPPORT_EXTRA_POINTS = {
  'Berry Finding S': 5,
  'Dream Shard Bonus': 2,
  'Sleep EXP Bonus': 2,
  'Research EXP Bonus': 2,
}
const SUPPORT_ACTIVATION_WEIGHT = 95
const SUPPORT_MAX_EXTRA_POINTS = 5
const SUPPORT_IDEAL_SUBSKILLS = ['Skill Trigger M', 'Helping Speed M', 'Skill Trigger S', 'Berry Finding S', 'Helping Bonus']
const SUPPORT_IDEAL_NATURE = { positive: 'Main Skill Chance', negative: null }
// Sub-skills que mueven el puntaje del support (getScoringSubskills).
const SUPPORT_SCORING_SUBSKILLS = [
  ...Object.keys(SUPPORT_SKILL_CHANCE_AMOUNTS),
  ...Object.keys(SUPPORT_SPEED_REDUCTION_AMOUNTS),
  ...Object.keys(SUPPORT_EXTRA_POINTS),
]

function computeSupportActivations(subskills, nature) {
  const sumOf = (amounts) => subskills.reduce((sum, skill) => sum + (amounts[skill] ?? 0), 0)
  const skillChance = getNatureStatFactor(nature, 'Main Skill Chance') * (1 + sumOf(SUPPORT_SKILL_CHANCE_AMOUNTS))
  const speedReduction = Math.min(SUPPORT_MAX_SPEED_REDUCTION, sumOf(SUPPORT_SPEED_REDUCTION_AMOUNTS))
  const helpTimeFactor = getNatureStatFactor(nature, 'Helping Speed') * (1 - speedReduction)
  return skillChance / helpTimeFactor
}

const SUPPORT_IDEAL_ACTIVATIONS = computeSupportActivations(SUPPORT_IDEAL_SUBSKILLS, SUPPORT_IDEAL_NATURE)

function computeSupportSpecimenScore(subskills, nature) {
  const activationRatio = Math.min(1, computeSupportActivations(subskills, nature) / SUPPORT_IDEAL_ACTIVATIONS)
  const extraPoints = Math.min(
    SUPPORT_MAX_EXTRA_POINTS,
    subskills.reduce((sum, skill) => sum + (SUPPORT_EXTRA_POINTS[skill] ?? 0), 0),
  )
  return Math.round(Math.min(100, activationRatio * SUPPORT_ACTIVATION_WEIGHT + extraPoints))
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
    // BFS 25 + deseadas hasta 55 (HSM 25 + HB 18 + HSS 12) + naturaleza
    // + Helping Speed 20 = 100. Antes era 60 + 30 + 10, y la base de 60 por
    // tener BFS dominaba: Shiny (Raichu con BFS, Helping Bonus y 3 sub-skills
    // inútiles) sacaba 80% de estructura; ahora saca 63%.
    const subskillPoints = Math.min(BERRY_MAX_SUBSKILL_POINTS, sumSubskillPoints(specialty, matchedDesiredSubskills))
    const score = Math.min(100, BERRY_MANDATORY_POINTS + subskillPoints + (natureOptimal ? BERRY_NATURE_POINTS : 0))
    return { score, mandatoryMet: true, ingredientCombo: null }
  }

  if (specialty === 'Ingredients') {
    const ingredientCombo = getIngredientCombo(ingredients)
    const comboScore =
      ingredientCombo === 'ABA'
        ? getTwoUniqueIngredientScore(ingredients, speciesName)
        : INGREDIENT_COMBO_SCORE[ingredientCombo]
    // Combo (AAA = 40) + sub-skills hasta 45 + naturaleza + Ingredient
    // Finding 15 = 100. Antes: combo x 0,6 + hasta 30 + 10.
    const rawPoints =
      sumSubskillPoints(specialty, matchedDesiredSubskills) + sumSecondarySubskillPoints(specialty, subskills)
    const subskillPoints = INGREDIENT_MAX_SUBSKILL_POINTS * Math.min(1, rawPoints / INGREDIENT_IDEAL_SUBSKILL_POINTS)
    const score = Math.min(
      100,
      Math.round(comboScore * INGREDIENT_COMBO_WEIGHT + subskillPoints + (natureOptimal ? INGREDIENT_NATURE_POINTS : 0)),
    )
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

  // La eficiencia de RP se mide siempre a SCORING_LEVEL (ver más abajo); el RP
  // real (actualRp) sigue siendo el del nivel actual.
  const scoringEntry = toScoringLevel(entry)
  const filteredEntry = baseResult.supportTier ? scoringEntry : withoutNonScoringSubskills(scoringEntry, specialty)
  const actualRp = species ? computeRp(entry, species, nature) : null
  const scoredRp = species ? computeRp(filteredEntry, species, nature) : null
  const excludesNonScoringSubskills = species ? scoredRp !== computeRp(scoringEntry, species, nature) : false
  const idealRp = species ? computeIdealRp(scoringEntry, species) : null
  const rpEfficiency =
    scoredRp != null && idealRp ? Math.max(0, Math.min(100, Math.round((scoredRp / idealRp) * 100))) : null

  const score = rpEfficiency != null ? Math.round(build.score * 0.5 + rpEfficiency * 0.5) : build.score

  return {
    ...baseResult,
    score,
    tier: getTier(score),
    rpEfficiency,
    actualRp,
    scoredRp,
    idealRp,
    excludesNonScoringSubskills,
  }
}

// La calidad del ejemplar se evalúa como si el Pokémon estuviera en nivel 80
// (usuario 2026-11-16), con los 5 slots de sub-skills y los 3 de ingredientes
// desbloqueados. Así el puntaje no cambia al subir de nivel ni depende de qué
// slots están bloqueados hoy: antes, con Helping Speed M en el slot 80 de un
// Pokémon de nivel bajo, "¿Qué le falta?" sugería moverla a un slot
// desbloqueado, algo imposible en el juego.
export const SCORING_LEVEL = 80

export function toScoringLevel(entry) {
  return { ...entry, level: SCORING_LEVEL }
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
// valiendo lo mismo que Helping Bonus (computeSupportSpecimenScore).
const NON_SCORING_RP_SUBSKILLS = ['Dream Shard Bonus', 'Sleep EXP Bonus', 'Research EXP Bonus', 'Energy Recovery Bonus']

// Berry Finding S tampoco cuenta en el RP de los especialistas en
// Ingredientes ni en los de Skills (usuario 2026-11-16; en Skills, Sableye y
// Dedenne cambiaban Skill Trigger S por Berry Finding S): la fórmula de RP valora cada ingrediente
// suelto y no el plato que se cocina con él, así que premiaba más a Berry
// Finding S que a Ingredient Finder S (Bulbasaur: +875 RP contra +385) y el
// techo de RP de un Pokémon de Ingredientes exigía Berry Finding S. Mantiene
// sus 2 puntos de estructura. El techo excluye lo mismo (sleepRp.js).
function getNonScoringRpSubskills(specialty) {
  return specialty === 'Berries' ? NON_SCORING_RP_SUBSKILLS : [...NON_SCORING_RP_SUBSKILLS, MANDATORY_BERRY_SUBSKILL]
}

function withoutNonScoringSubskills(entry, specialty) {
  const excluded = getNonScoringRpSubskills(specialty)
  const cleaned = { ...entry }
  for (const level of subskillLevels) {
    if (excluded.includes(cleaned[`subskill_${level}`])) cleaned[`subskill_${level}`] = null
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
    ...(support ? SUPPORT_SCORING_SUBSKILLS : []),
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
