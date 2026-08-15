// Comparador evolutivo / sustitución de box (Fase 5 — CLAUDE.md sección 1.3).
// Proyecta el rendimiento de cada Pokémon de una misma línea evolutiva a un
// nivel objetivo (ej. 30 o 50) reutilizando el motor de stats de sleepStats.js
// y el de scoring de la Fase 4 (sleepScoring.js).

import { getEvolutionFamily } from '../data/sleepData.js'
import { computeCarryLimit, computeFrequencySeconds } from './sleepStats.js'
import { evaluateSleepPokemon, getEntryIngredients, getEntrySubskills } from './sleepScoring.js'

const SECONDS_PER_HOUR = 3600

// Proyecta una entry del box a un nivel objetivo: los sub-skills ya asignados
// se activan según los tramos de nivel (10/25/50/75/100) que el nivel
// objetivo alcance, igual que en el box real una vez que el Pokémon suba de
// nivel. El "throughput" (unidades recolectadas por hora) es la métrica de
// rendimiento usada para decidir cuál ejemplar conviene más entrenar.
export function projectEntryAtLevel(entry, species, nature, targetLevel) {
  const projectedEntry = { ...entry, level: targetLevel }
  const carryLimit = computeCarryLimit(projectedEntry, species)
  const frequencySeconds = computeFrequencySeconds(projectedEntry, species, nature)
  const helpsPerHour = frequencySeconds ? SECONDS_PER_HOUR / frequencySeconds : 0
  const throughputPerHour = carryLimit != null ? Math.round(carryLimit * helpsPerHour * 10) / 10 : null

  const evaluation = species
    ? evaluateSleepPokemon({
        specialty: species.specialty,
        subskills: getEntrySubskills(entry),
        ingredients: getEntryIngredients(entry),
        naturePositiveStat: nature?.positive ?? null,
      })
    : null

  return { entry, species, targetLevel, carryLimit, frequencySeconds, helpsPerHour, throughputPerHour, evaluation }
}

// Busca en el box otros ejemplares de la misma especie o línea evolutiva que
// la del Pokémon indicado (excluyéndolo a él mismo).
export function findEvolutionFamilyInBox(box, speciesName) {
  const family = getEvolutionFamily(speciesName)
  return box.filter((entry) => family.includes(entry.species?.name))
}

// Ordena las proyecciones de mayor a menor throughput y marca la mejor.
export function rankProjections(projections) {
  const sorted = [...projections].sort((a, b) => (b.throughputPerHour ?? 0) - (a.throughputPerHour ?? 0))
  return sorted.map((projection, index) => ({ ...projection, isBest: index === 0 && sorted.length > 1 }))
}
