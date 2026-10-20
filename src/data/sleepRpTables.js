// Tablas de datos para el cálculo real de RP (Fase 7 — CLAUDE.md 1.1/1.2).
// Fuente: código fuente de nerolis-lab/nerolis-lab (calculadora open-source de
// la comunidad, Apache-2.0 — github.com/nerolis-lab/nerolis-lab), verificado
// 2026-08-29. Reemplaza el placeholder `estimateRp = nivel * 15` que no tenía
// ninguna base real.

// RP que aporta el Main Skill según su propio nivel (1-6, 1-7 u 8 según la
// skill), independiente del nivel del Pokémon.
// mainSkillRpTable COMPLETO -- generado 2026-09-02 desde nerolis-lab (common/src/types/mainskill/
// mainskills/**/*.ts, campo RP de cada Mainskill), cubre las 28 main skills realmente usadas por
// alguna especie del Pokedex sin legendarios/miticos (ver nota en supabase/seed.sql). Las primeras
// 4 ya estaban y coinciden exacto.
export const mainSkillRpTable = {
  'Aura Sphere (Dream Shard Magnet S)': [1040, 1479, 2040, 2816, 3888, 5372, 6905, 8543],
  'Berry Burst': [1400, 1991, 2747, 3791, 5234, 7232],
  'Berry Juice (Energy for Everyone S)': [1220, 1735, 2392, 3303, 4559, 6299],
  'Bulk Up (Cooking Assist S)': [1144, 1626, 2244, 3098, 4277, 5910, 7596],
  'Charge Energy S': [400, 569, 785, 1083, 1496, 2066],
  'Charge Strength M': [880, 1251, 1726, 2383, 3290, 4546, 6252],
  'Charge Strength S': [400, 569, 785, 1083, 1496, 2066, 2842],
  'Cooking Power-Up S': [880, 1251, 1726, 2383, 3290, 4546, 5843],
  'Disguise (Berry Burst)': [1400, 1991, 2747, 3791, 5234, 7232],
  'Dream Shard Magnet S': [880, 1251, 1726, 2383, 3290, 4546, 5843, 7303],
  'Dream Shard Magnet S Range': [880, 1251, 1726, 2383, 3290, 4546, 5843, 7303],
  'Energizing Cheer S': [766, 1089, 1502, 2074, 2863, 3956],
  'Energy for Everyone S': [1120, 1593, 2197, 3033, 4187, 5785],
  'Extra Helpful S': [880, 1251, 1726, 2383, 3290, 4546, 5843],
  'Hyper Cutter (Ingredient Draw S)': [880, 1251, 1726, 2383, 3290, 4846, 5843],
  'Ingredient Draw S': [880, 1251, 1726, 2383, 3290, 4846, 5843],
  'Ingredient Magnet S': [880, 1251, 1726, 2383, 3290, 4546, 5843],
  'Metronome': [880, 1251, 1726, 2383, 3290, 4546, 5843],
  'Mimic (Skill Copy)': [600, 853, 1177, 1625, 2243, 3099, 3984],
  'Minus (Cooking Power-Up S)': [880, 1251, 1726, 2383, 3290, 4546, 5843],
  'Moonlight (Charge Energy S)': [560, 797, 1099, 1516, 2094, 2892],
  'Nuzzle (Energizing Cheer S)': [880, 1251, 1726, 2383, 3290, 4546],
  'Plus (Ingredient Magnet S)': [880, 1251, 1726, 2383, 3290, 4546, 5843],
  'Present (Ingredient Magnet S)': [880, 1251, 1726, 2383, 3290, 4546, 5843],
  'Stockpile (Charge Strength S)': [600, 853, 1177, 1625, 2243, 3099, 3984],
  'Super Luck (Ingredient Draw S)': [880, 1251, 1726, 2383, 3290, 4546, 5843],
  'Tasty Chance S': [880, 1251, 1726, 2383, 3290, 4546],
  'Transform (Skill Copy)': [600, 853, 1177, 1625, 2243, 3099, 3984],
}

export function getMainSkillMaxLevel(skillName) {
  return mainSkillRpTable[skillName]?.length ?? 6
}

// Porcentaje que suman las sub-skills de activación (no confundir con los
// bonos de Carry Limit en segundos de sleepStats.js). "amount" ya viene como
// fracción (0.18 = +18%), se usa como (1 + suma) multiplicando el % base.
export const INGREDIENT_FINDER_AMOUNTS = { 'Ingredient Finder S': 0.18, 'Ingredient Finder M': 0.36 }
export const SKILL_TRIGGER_AMOUNTS = { 'Skill Trigger S': 0.18, 'Skill Trigger M': 0.36 }
export const HELPING_SPEED_PERCENT_AMOUNTS = { 'Helping Speed S': 0.07, 'Helping Speed M': 0.14 }

// Factor "misc" del RP: cada sub-skill activa suma directo a un multiplicador
// que arranca en 1. Las de Inventory ya existen como bono de Carry Limit en
// segundos en otra parte del código — este es un efecto adicional y distinto,
// específico del cálculo de RP.
export const MISC_RP_SUBSKILL_FACTORS = {
  'Dream Shard Bonus': 0.221,
  'Energy Recovery Bonus': 0.221,
  'Helping Bonus': 0.221,
  'Research EXP Bonus': 0.221,
  'Sleep EXP Bonus': 0.221,
  'Inventory Up S': 0.071,
  'Inventory Up M': 0.139,
  'Inventory Up L': 0.181,
}

// Crecimiento del valor de ingrediente según el nivel del Pokémon (no del
// nivel de receta — eso es recipeLevelBonusTable en sleepRecipes.js, un
// concepto distinto). Tabla exacta 1-70; más allá se usa la fórmula de
// respaldo que ya trae la fuente original para niveles fuera de rango.
const ING_GROWTH_TABLE = {
  1: 1.0, 2: 1.003, 3: 1.007, 4: 1.011, 5: 1.016, 6: 1.021, 7: 1.027, 8: 1.033, 9: 1.039, 10: 1.046,
  11: 1.053, 12: 1.061, 13: 1.069, 14: 1.077, 15: 1.085, 16: 1.094, 17: 1.104, 18: 1.114, 19: 1.124, 20: 1.134,
  21: 1.145, 22: 1.156, 23: 1.168, 24: 1.18, 25: 1.192, 26: 1.205, 27: 1.218, 28: 1.231, 29: 1.245, 30: 1.259,
  31: 1.274, 32: 1.288, 33: 1.303, 34: 1.319, 35: 1.335, 36: 1.351, 37: 1.368, 38: 1.385, 39: 1.402, 40: 1.42,
  41: 1.439, 42: 1.457, 43: 1.477, 44: 1.496, 45: 1.517, 46: 1.537, 47: 1.558, 48: 1.58, 49: 1.602, 50: 1.625,
  51: 1.648, 52: 1.671, 53: 1.696, 54: 1.72, 55: 1.745, 56: 1.771, 57: 1.798, 58: 1.824, 59: 1.852, 60: 1.88,
  61: 1.927, 62: 1.975, 63: 2.024, 64: 2.075, 65: 2.127, 66: 2.18, 67: 2.235, 68: 2.29, 69: 2.348, 70: 2.406,
}

export function getIngredientGrowthFactor(level) {
  return (
    ING_GROWTH_TABLE[level] ??
    0.000000398 * level ** 3 + 0.000159 * level ** 2 + 0.00367 * level - 0.00609 + 1
  )
}

// Bono de Carry Limit por nivel de Ribbon (cinta de amistad), acumulativo.
export function calculateRibbonCarryBonus(ribbonLevel) {
  let bonus = 0
  if (ribbonLevel >= 1) bonus += 1
  if (ribbonLevel >= 2) bonus += 2
  if (ribbonLevel >= 3) bonus += 3
  if (ribbonLevel >= 4) bonus += 2
  return bonus
}

// Bono de frecuencia por Ribbon: solo aplica a Pokémon que todavía no llegan
// a su última evolución (remainingEvolutions 1 o 2).
export function calculateRibbonFrequencyFactor(remainingEvolutions, ribbonLevel) {
  let factor = 1
  if (ribbonLevel >= 2) {
    if (remainingEvolutions === 1) factor -= 0.05
    else if (remainingEvolutions === 2) factor -= 0.11
  }
  if (ribbonLevel >= 4) {
    if (remainingEvolutions === 1) factor -= 0.07
    else if (remainingEvolutions === 2) factor -= 0.14
  }
  return factor
}

// Floor a n decimales corrigiendo errores de precisión IEEE754 (ej. 0.1+0.2).
export function floorWithCorrection(num, decimals) {
  const factor = 10 ** decimals
  const shifted = num * factor
  const rounded = Math.abs(shifted - Math.round(shifted)) < 1e-10 ? Math.round(shifted) : shifted
  return Math.floor(rounded) / factor
}
