import { subskillRarity } from '../../../data/sleepData.js'

// Colores de las sub-skills como en el juego: incolora, azul y dorada.
const RARITY_STYLES = {
  white: { backgroundColor: '#ffffff', color: '#374151' },
  silver: { backgroundColor: '#bfdbfe', color: '#1e3a8a' },
  gold: { backgroundColor: '#fde68a', color: '#78350f' },
}

// Estilo inline para un <option> o para el <select> según la sub-skill
// elegida. Sin sub-skill devuelve undefined (se mantiene el estilo base).
export function getSubskillStyle(subskill) {
  return RARITY_STYLES[subskillRarity[subskill]]
}
