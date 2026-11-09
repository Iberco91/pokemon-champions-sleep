// "¿Qué le falta para llegar al 100%?": lista ordenada de cambios (sub-skill
// por slot, naturaleza y, en especialistas en Ingredientes, ingrediente por
// slot) que más suben el puntaje del ejemplar. Pedido del usuario 2026-10-30.
//
// Usa el mismo evaluateSleepPokemon que muestra el porcentaje, así que las
// sugerencias nunca contradicen al puntaje. El puntaje objetivo es la tier de
// support (supportTier.score) en supports de energía y la calidad del
// ejemplar (score) en el resto.
//
// Búsqueda: una pasada voraz (de a un cambio, cubre los ingredientes), luego
// una búsqueda exhaustiva de sub-skills + naturaleza (ver
// exhaustiveSubskillsAndNature) y otra pasada voraz. Es barato porque
// computeIdealRp queda cacheado por especie/nivel/Ribbon/nivel de skill y no
// cambia entre variantes. `maxScore` es el techo real: en la calidad del
// ejemplar no siempre es 100, porque la mitad de "build" y la de RP premian
// sub-skills algo distintas.

import { natureOptions, subskillLevels, subskillOptions } from '../data/sleepData.js'
import { getIngredientSlotOptions } from '../data/sleepIngredientSlots.js'
import { evaluateSleepPokemon, getScoringSubskills } from './sleepScoring.js'

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

function greedyImprove(start, startScore, species) {
  let state = start
  let currentScore = startScore
  for (let step = 0; step < MAX_STEPS; step += 1) {
    let best = null
    for (const change of candidateChanges(state, species)) {
      const next = applyChange(state, change)
      const score = scoreOf(next, species)
      if (score > currentScore && (!best || score > best.score)) best = { next, score }
    }
    if (!best) break
    state = best.next
    currentScore = best.score
  }
  return { state, score: currentScore }
}

function* combinations(items, size) {
  if (size === 0) {
    yield []
    return
  }
  for (let i = 0; i <= items.length - size; i += 1) {
    for (const rest of combinations(items.slice(i + 1), size - 1)) yield [items[i], ...rest]
  }
}

// Las 5 neutras dan exactamente lo mismo: basta probar una.
function getDistinctNatures(current) {
  const seenNeutral = { value: false }
  return natureOptions.filter((option) => {
    if (option.positive) return true
    if (option.name === current?.name) return true
    if (current && !current.positive) return false
    if (seenNeutral.value) return false
    seenNeutral.value = true
    return true
  })
}

// Reparte las sub-skills elegidas en los slots tratando de no mover las que
// el Pokémon ya tiene: primero las deja en su slot si sigue siendo del mismo
// tipo (activo/bloqueado), y las demás van a los slots libres en orden.
function assignSubskills(entry, activeSkills, lockedSkills, activeLevels, lockedLevels) {
  const patch = {}
  const place = (skills, levels) => {
    const remaining = [...skills]
    const freeLevels = []
    for (const level of levels) {
      const current = entry[`subskill_${level}`] ?? null
      const index = remaining.indexOf(current)
      if (index >= 0) {
        patch[`subskill_${level}`] = current
        remaining.splice(index, 1)
      } else {
        freeLevels.push(level)
      }
    }
    freeLevels.forEach((level, index) => {
      patch[`subskill_${level}`] = remaining[index] ?? null
    })
  }
  place(activeSkills, activeLevels)
  place(lockedSkills, lockedLevels)
  return patch
}

function countDifferences(a, b) {
  const fields = ['nature', ...subskillLevels.map((level) => `subskill_${level}`)]
  return fields.filter((field) => getFieldValue(a, field) !== getFieldValue(b, field)).length
}

// Búsqueda exhaustiva de sub-skills + naturaleza. El build cuenta las 5
// sub-skills y el RP solo las de slots ya desbloqueados, así que importa
// qué conjunto de 5 se elige y cuáles de ellas van en los slots activos.
// Se prueban todas las combinaciones de 5 entre las sub-skills que pueden
// sumar (getScoringSubskills, más las que ya tiene el Pokémon), cada reparto
// activo/bloqueado y cada naturaleza distinta. La búsqueda voraz de antes
// (de a un cambio) se quedaba en óptimos locales: con La Nae (Togekiss nv.
// 67) se detenía en 96% cuando 99% era posible cambiando varias a la vez.
function exhaustiveSubskillsAndNature(start, species) {
  const level = start.entry.level ?? 1
  const activeLevels = subskillLevels.filter((lvl) => level >= lvl)
  const lockedLevels = subskillLevels.filter((lvl) => level < lvl)
  const currentSkills = subskillLevels.map((lvl) => start.entry[`subskill_${lvl}`]).filter(Boolean)
  const pool = [...new Set([...getScoringSubskills(species), ...currentSkills])]
  const setSize = Math.min(subskillLevels.length, pool.length)
  const activeCount = Math.min(activeLevels.length, setSize)

  let best = null
  for (const nature of getDistinctNatures(start.nature)) {
    for (const set of combinations(pool, setSize)) {
      for (const activeSkills of combinations(set, activeCount)) {
        const lockedSkills = set.filter((skill) => !activeSkills.includes(skill))
        const patch = assignSubskills(start.entry, activeSkills, lockedSkills, activeLevels, lockedLevels)
        const candidate = { entry: { ...start.entry, ...patch }, nature }
        const score = scoreOf(candidate, species)
        if (!best || score > best.score) {
          best = { state: candidate, score, changes: countDifferences(start, candidate) }
        } else if (score === best.score) {
          const changes = countDifferences(start, candidate)
          if (changes < best.changes) best = { state: candidate, score, changes }
        }
      }
    }
  }
  return best
}

// Ordena las diferencias entre el original y el óptimo: en cada paso aplica
// la que más sube el puntaje, para mostrar primero los cambios de más impacto.
function buildSteps(start, target, species) {
  const fields = Object.keys(FIELD_LABELS).filter((field) => getFieldValue(start, field) !== getFieldValue(target, field))
  const steps = []
  let replay = start
  let pending = [...fields]
  const subskillFields = subskillLevels.map((level) => `subskill_${level}`)
  // Si un cambio pone una sub-skill que todavía está en otro slot pendiente
  // (se está moviendo de slot), los dos slots se cambian juntos en un mismo
  // paso: así nunca se cuenta la misma sub-skill dos veces ni aparece una
  // baja intermedia del puntaje.
  const groupFor = (state, field, remaining) => {
    if (!subskillFields.includes(field)) return [field]
    const value = target.entry[field] ?? null
    const source = remaining.find((other) => other !== field && subskillFields.includes(other) && value && (state.entry[other] ?? null) === value)
    return source ? [field, source] : [field]
  }
  while (pending.length) {
    let best = null
    for (const field of pending) {
      const group = groupFor(replay, field, pending)
      let next = replay
      for (const member of group) {
        next = member === 'nature' ? { ...next, nature: target.nature } : applyChange(next, { patch: { [member]: target.entry[member] ?? null } })
      }
      const score = scoreOf(next, species)
      if (!best || score > best.score) best = { group, next, score }
    }
    replay = best.next
    pending = pending.filter((field) => !best.group.includes(field))
    const [destination, source] = best.group
    best.group.forEach((field) => {
      steps.push({
        field,
        label: FIELD_LABELS[field],
        from: getFieldValue(start, field),
        to: getFieldValue(target, field),
        movedFrom: field === destination && source ? FIELD_LABELS[source] : null,
        scoreAfter: best.score,
      })
    })
  }
  return steps
}

export function computeImprovementPlan({ entry, species, nature }) {
  if (!species) return null
  const start = { entry, nature }
  const startScore = scoreOf(start, species)

  // 1) Voraz (cubre ingredientes), 2) exhaustiva de sub-skills + naturaleza,
  // 3) voraz otra vez por si el nuevo punto habilita otro cambio.
  let { state, score } = greedyImprove(start, startScore, species)
  const exhaustive = exhaustiveSubskillsAndNature(state, species)
  if (exhaustive && exhaustive.score > score) ({ state, score } = exhaustive)
  ;({ state, score } = greedyImprove(state, score, species))

  if (score <= startScore) return { startScore, maxScore: startScore, steps: [] }
  return { startScore, maxScore: score, steps: buildSteps(start, state, species) }
}
