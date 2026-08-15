// Simulador de Win-Rate & Matrix Counter (Fase 8 — CLAUDE.md sección 2.3).
// Estima, para un equipo de hasta 6, qué tan bien responde frente a cada
// amenaza del Top de Meta (championsData.js) combinando matchups de tipo
// directos (typeChart.js) y Speed tiers como proxy de quién actúa primero.
// El % de win-rate es una heurística de referencia, no una simulación de
// daño real (no hay stats de ataque/defensa cargadas todavía).

import { getWorstIncomingMultiplier, pokemonTypes } from './typeChart.js'
import { metaTop } from '../data/championsData.js'

const BASE_WIN_RATE = 50
const SPEED_ADVANTAGE_BONUS = 10
const SPEED_DISADVANTAGE_PENALTY = -5
const MIN_WIN_RATE = 5
const MAX_WIN_RATE = 95

function getDamageAdjustment(incomingMultiplier) {
  if (incomingMultiplier === 0) return 40
  if (incomingMultiplier <= 0.25) return 30
  if (incomingMultiplier < 1) return 20
  if (incomingMultiplier === 1) return 0
  if (incomingMultiplier <= 2) return -20
  return -35
}

// Evalúa cómo responde el equipo a una amenaza puntual: encuentra el
// miembro que mejor la resiste (menor multiplicador entrante) y usa su
// comparación de Speed contra la amenaza como proxy de Check/Counter.
export function evaluateTeamVsThreat(team, threat) {
  const responders = team.map((member) => ({
    member,
    incoming: getWorstIncomingMultiplier(threat.types, member.types),
  }))
  const bestResponder = responders.reduce((best, current) => (current.incoming < best.incoming ? current : best))

  const speedAdvantage = bestResponder.member.baseSpeed > threat.baseSpeed
  const score =
    BASE_WIN_RATE +
    getDamageAdjustment(bestResponder.incoming) +
    (speedAdvantage ? SPEED_ADVANTAGE_BONUS : SPEED_DISADVANTAGE_PENALTY)

  return {
    threat,
    bestResponder: bestResponder.member,
    incoming: bestResponder.incoming,
    speedAdvantage,
    winRate: Math.max(MIN_WIN_RATE, Math.min(MAX_WIN_RATE, score)),
  }
}

// Win-rate global ponderado por uso del Meta, más las 2 amenazas donde el
// equipo rinde peor (para las sugerencias de mejora).
export function simulateTeamWinRate(team, threats = metaTop) {
  const results = threats.map((threat) => evaluateTeamVsThreat(team, threat))
  const weightSum = threats.reduce((sum, threat) => sum + threat.usagePercentage, 0)
  const overallWinRate = Math.round(
    results.reduce((sum, result) => sum + result.winRate * result.threat.usagePercentage, 0) / weightSum,
  )
  const worstMatchups = [...results].sort((a, b) => a.winRate - b.winRate).slice(0, 2)

  return { results, overallWinRate, worstMatchups }
}

// Sugiere el tipo que mejor resiste a una amenaza (menor multiplicador
// entrante posible con un solo tipo), para el mensaje de mejora crítica.
export function suggestCounterType(threat) {
  return pokemonTypes.reduce((best, type) => {
    const multiplier = getWorstIncomingMultiplier(threat.types, [type])
    return multiplier < best.multiplier ? { type, multiplier } : best
  }, { type: pokemonTypes[0], multiplier: getWorstIncomingMultiplier(threat.types, [pokemonTypes[0]]) })
}

export function buildVulnerabilityMessage(vulnerability) {
  const counter = suggestCounterType(vulnerability.threat)
  return `Tu equipo cae en ${100 - vulnerability.winRate}% frente a ${vulnerability.threat.name}. Se sugiere incluir un tipo ${counter.type} o cambiar Tera a ${counter.type}.`
}
