// "¿Qué le falta para llegar al 100%?": lista ordenada de cambios (sub-skill
// por slot, naturaleza y, en especialistas en Ingredientes, ingrediente por
// slot) que más suben el puntaje del ejemplar. Pedido del usuario 2026-10-30.
//
// Usa el mismo evaluateSleepPokemon que muestra el porcentaje, así que las
// sugerencias nunca contradicen al puntaje. El puntaje objetivo es la tier de
// support (supportTier.score) en supports de energía y la calidad del
// ejemplar (score) en el resto.
//
// Búsqueda voraz: en cada paso se prueban todos los cambios de un solo
// elemento (más intercambiar dos sub-skills de slot), se aplica el que más
// sube el puntaje y se repite hasta que ningún cambio mejore. Es barato
// porque computeIdealRp queda cacheado por especie/nivel/Ribbon/nivel de skill
// y no cambia entre variantes. `maxScore` es el techo que encontró la
// búsqueda: en la calidad del ejemplar no siempre es 100, porque la mitad de
// "build" y la de RP premian sub-skills algo distintas.

import { natureOptions, subskillLevels, subskillOptions } from '../data/sleepData.js'
import { getIngredientSlotOptions } from '../data/sleepIngredientSlots.js'
import { evaluateSleepPokemon } from './sleepScoring.js'

const MAX_STEPS = 12
const INGREDIENT_FIELDS = [
  { field: 'ingredient_a', slot: 'a', label: 'Ingrediente A' },
  { field: 'ingredient_b', slot: 'b', label: 'Ingrediente B' },
  { field: 'ingredient_c', slot: 'c', label: 'Ingrediente C' },
]

const FIELD_LABELS = {
  nature: 'Naturaleza',
  ...Object.fromEntries(subskillLevels.map((level) => [`subskill_${level}`, `Sub-skill nv. ${level}`])),
  ...Object.fromEntries(INGREDIENT_FIELDS.map(({ field, label }) => [field, label])),
}

function getTargetScore(evaluation) {
  return evaluation.supportTier ? evaluation.supportTier.score : evaluation.score
}

function scoreOf({ entry, nature }, species) {
  return getTargetScore(evaluateSleepPokemon({ entry, species, nature }))
}

// Cada candidato es un parche sobre la entry (o una naturaleza nueva).
function* candidateChanges({ entry, nature }, species) {
  // Intercambiar dos sub-skills de slot importa: para el RP solo cuentan las
  // de slots ya desbloqueados al nivel actual.
  for (const [index, levelA] of subskillLevels.entries()) {
    for (const levelB of subskillLevels.slice(index + 1)) {
      const fieldA = `subskill_${levelA}`
      const fieldB = `subskill_${levelB}`
      if ((entry[fieldA] ?? null) === (entry[fieldB] ?? null)) continue
      yield { patch: { [fieldA]: entry[fieldB] ?? null, [fieldB]: entry[fieldA] ?? null } }
    }
  }

  for (const level of subskillLevels) {
    const field = `subskill_${level}`
    const otherSubskills = subskillLevels.filter((lvl) => lvl !== level).map((lvl) => entry[`subskill_${lvl}`])
    for (const skill of subskillOptions) {
      // El juego no repite sub-skills en un mismo Pokémon.
      if (skill === entry[field] || otherSubskills.includes(skill)) continue
      yield { patch: { [field]: skill } }
    }
  }

  for (const option of natureOptions) {
    if (option.name !== nature?.name) yield { nature: option }
  }

  if (species.specialty !== 'Ingredients') return
  for (const { field, slot } of INGREDIENT_FIELDS) {
    for (const { name } of getIngredientSlotOptions(species.name, slot)) {
      if (name !== entry[field]) yield { patch: { [field]: name } }
    }
  }
}

function applyChange(state, change) {
  if (change.nature) return { ...state, nature: change.nature }
  return { ...state, entry: { ...state.entry, ...change.patch } }
}

function getFieldValue(state, field) {
  return field === 'nature' ? state.nature?.name ?? null : state.entry[field] ?? null
}

export function computeImprovementPlan({ entry, species, nature }) {
  if (!species) return null
  const start = { entry, nature }
  const startScore = scoreOf(start, species)

  let state = start
  let currentScore = startScore
  const touchedFields = []

  for (let step = 0; step < MAX_STEPS; step += 1) {
    let best = null
    for (const change of candidateChanges(state, species)) {
      const next = applyChange(state, change)
      const score = scoreOf(next, species)
      if (score > currentScore && (!best || score > best.score)) best = { change, next, score }
    }
    if (!best) break
    state = best.next
    currentScore = best.score
    const fields = best.change.nature ? ['nature'] : Object.keys(best.change.patch)
    fields.forEach((field) => {
      if (!touchedFields.includes(field)) touchedFields.push(field)
    })
  }

  // Diferencias entre el ejemplar original y el mejor encontrado, en el
  // orden en que la búsqueda las fue tocando, con el puntaje acumulado.
  let replay = start
  const steps = touchedFields
    .filter((field) => getFieldValue(start, field) !== getFieldValue(state, field))
    .map((field) => {
      const to = getFieldValue(state, field)
      replay = field === 'nature' ? { ...replay, nature: state.nature } : applyChange(replay, { patch: { [field]: to } })
      return { field, label: FIELD_LABELS[field], from: getFieldValue(start, field), to, scoreAfter: scoreOf(replay, species) }
    })

  return { startScore, maxScore: currentScore, steps }
}
