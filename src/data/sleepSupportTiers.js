// Energía diaria que cada especie de soporte entrega al equipo, para comparar
// a los supports entre sí (la tier list de RaenonX no lo mide, ver
// sleepSpeciesTiers.js). Son las 27 especies de nuestra Pokédex cuya Main
// Skill es Energy for Everyone S o Energizing Cheer S (incluidas sus variantes
// Berry Juice y Nuzzle). Moonlight (Charge Energy S) queda fuera: recupera
// energía sobre todo al propio Pokémon.
//
// Energía por activación al nivel máximo de skill (nivel 6), verificada
// 2026-10-30 contra nerolis-lab/nerolis-lab
// (common/src/types/mainskill/mainskills/**):
//   - Energy for Everyone S / Berry Juice: 18.1 a cada uno de los 5 del equipo
//   - Energizing Cheer S: 44 a un solo Pokémon
//   - Nuzzle (Energizing Cheer S): 35 a un solo Pokémon
// Los efectos extra de Berry Juice (jugo) y Nuzzle (ayuda de skill) no se
// cuentan: solo se mide energía.
//
// `teamEnergy` = ayudas por día × probabilidad de skill × energía por
// activación × Pokémon que la reciben, con el mismo benchmark para todas las
// especies (igual que RaenonX): nivel 60, skill al máximo, sin sub-skills,
// naturaleza neutra y sin Ribbon. Frecuencia a nivel 60 =
// floor(frecuencia base × (1 − 0.002 × 59)); ayudas por día = 86400 /
// frecuencia. Calculado desde supabase/seed.sql. Es un índice para comparar,
// no la energía exacta de una partida (no modela el sueño ni el tope de
// energía).

export const ENERGY_SUPPORT_SKILLS = [
  'Energy for Everyone S',
  'Berry Juice (Energy for Everyone S)',
  'Energizing Cheer S',
  'Nuzzle (Energizing Cheer S)',
]

const supportTeamEnergyByName = {
  Gardevoir: 155.2,
  Torterra: 146.8,
  Shuckle: 145.3,
  Pawmot: 144.1,
  Sylveon: 136.4,
  Wigglytuff: 129.0,
  Slowking: 110.3,
  Grotle: 110.2,
  Kirlia: 108.9,
  Wobbuffet: 101.0,
  Leafeon: 99.1,
  Jigglypuff: 97.8,
  Pawmo: 96.7,
  Slowbro: 90.8,
  Turtwig: 80.8,
  Ralts: 79.4,
  Pawmi: 69.4,
  Togedemaru: 68.6,
  Blissey: 65.8,
  Igglybuff: 64.8,
  Chansey: 61.8,
  Comfey: 60.3,
  Slowpoke: 59.0,
  Wynaut: 51.3,
  Ninetales: 48.1,
  Vulpix: 29.3,
  Happiny: 21.3,
}

const MAX_TEAM_ENERGY = Math.max(...Object.values(supportTeamEnergyByName))

export function isEnergySupport(species) {
  return ENERGY_SUPPORT_SKILLS.includes(species?.main_skill)
}

// Posición de la especie entre los supports: su energía diaria contra la del
// mejor support (Gardevoir = 100%).
export function getSupportSpeciesScore(species) {
  const teamEnergy = species?.name ? supportTeamEnergyByName[species.name] : null
  if (teamEnergy == null) return null
  return { teamEnergy, score: Math.round((teamEnergy / MAX_TEAM_ENERGY) * 100) }
}
