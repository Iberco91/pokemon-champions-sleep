// Tipos y velocidad base reales de cada especie (necesarios para el
// simulador de win-rate de la Fase 8 — CLAUDE.md 2.3).
export const championsPool = [
  { name: 'Gengar', role: 'Specialist', types: ['Fantasma', 'Veneno'], baseSpeed: 110 },
  { name: 'Lucario', role: 'Brawler', types: ['Lucha', 'Acero'], baseSpeed: 90 },
  { name: 'Mimikyu', role: 'Setup', types: ['Fantasma', 'Hada'], baseSpeed: 96 },
  { name: 'Cinderace', role: 'Tempo', types: ['Fuego'], baseSpeed: 119 },
]

// Top de Meta curado manualmente como referencia inicial para el simulador
// de la Fase 8, hasta que el Meta Tracker automatizado de la Fase 9
// (CLAUDE.md 2.2) lo reemplace por datos rastreados cada 14 días.
export const metaTop = [
  { rank: 1, name: 'Flutter Mane', types: ['Fantasma', 'Hada'], baseSpeed: 135, usagePercentage: 42 },
  { rank: 2, name: 'Gholdengo', types: ['Acero', 'Fantasma'], baseSpeed: 84, usagePercentage: 38 },
  { rank: 3, name: 'Iron Valiant', types: ['Hada', 'Lucha'], baseSpeed: 116, usagePercentage: 33 },
  { rank: 4, name: 'Kingambit', types: ['Siniestro', 'Acero'], baseSpeed: 50, usagePercentage: 30 },
  { rank: 5, name: 'Great Tusk', types: ['Tierra'], baseSpeed: 87, usagePercentage: 28 },
  { rank: 6, name: 'Landorus', types: ['Tierra', 'Volador'], baseSpeed: 91, usagePercentage: 26 },
  { rank: 7, name: 'Ogerpon', types: ['Planta'], baseSpeed: 110, usagePercentage: 24 },
  { rank: 8, name: 'Dragonite', types: ['Dragón', 'Volador'], baseSpeed: 80, usagePercentage: 21 },
]

export const moves = ['Shadow Ball', 'Aura Sphere', 'Play Rough', 'Flame Charge']
export const abilities = ['Levitate', 'Steadfast', 'Disguise', 'Pyro Arm']
export const heldItems = ['Ghost Gem', 'Fighting Gem', 'Fairy Gem', 'Fire Gem']

// Formatos ilustrativos para el registro de la Fase 7 (CLAUDE.md 2.1) —
// Pokémon Champions todavía no publica su lista oficial de formatos, así que
// este es un set de referencia a reemplazar cuando se confirme.
export const championsFormats = ['Formato Estándar', 'Formato Restringido', 'Formato Doble']

// Tipos Tera estándar de la mecánica de turno (18 tipos + Stellar).
export const teraTypes = [
  'Normal',
  'Fuego',
  'Agua',
  'Eléctrico',
  'Planta',
  'Hielo',
  'Lucha',
  'Veneno',
  'Tierra',
  'Volador',
  'Psíquico',
  'Bicho',
  'Roca',
  'Fantasma',
  'Dragón',
  'Siniestro',
  'Acero',
  'Hada',
  'Stellar',
]

// Stats base para EVs/IVs.
export const battleStats = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed']

export const maxEvPerStat = 252
export const maxEvTotal = 508
export const maxIvPerStat = 31

// Las 25 naturalezas estándar de la saga principal (independientes de las
// naturalezas de Pokémon Sleep en sleepData.js, que afectan stats distintos).
export const championsNatures = [
  { name: 'Hardy', plus: null, minus: null },
  { name: 'Lonely', plus: 'Attack', minus: 'Defense' },
  { name: 'Brave', plus: 'Attack', minus: 'Speed' },
  { name: 'Adamant', plus: 'Attack', minus: 'Sp. Atk' },
  { name: 'Naughty', plus: 'Attack', minus: 'Sp. Def' },
  { name: 'Bold', plus: 'Defense', minus: 'Attack' },
  { name: 'Docile', plus: null, minus: null },
  { name: 'Relaxed', plus: 'Defense', minus: 'Speed' },
  { name: 'Impish', plus: 'Defense', minus: 'Sp. Atk' },
  { name: 'Lax', plus: 'Defense', minus: 'Sp. Def' },
  { name: 'Timid', plus: 'Speed', minus: 'Attack' },
  { name: 'Hasty', plus: 'Speed', minus: 'Defense' },
  { name: 'Serious', plus: null, minus: null },
  { name: 'Jolly', plus: 'Speed', minus: 'Sp. Atk' },
  { name: 'Naive', plus: 'Speed', minus: 'Sp. Def' },
  { name: 'Modest', plus: 'Sp. Atk', minus: 'Attack' },
  { name: 'Mild', plus: 'Sp. Atk', minus: 'Defense' },
  { name: 'Quiet', plus: 'Sp. Atk', minus: 'Speed' },
  { name: 'Bashful', plus: null, minus: null },
  { name: 'Rash', plus: 'Sp. Atk', minus: 'Sp. Def' },
  { name: 'Calm', plus: 'Sp. Def', minus: 'Attack' },
  { name: 'Gentle', plus: 'Sp. Def', minus: 'Defense' },
  { name: 'Sassy', plus: 'Sp. Def', minus: 'Speed' },
  { name: 'Careful', plus: 'Sp. Def', minus: 'Sp. Atk' },
  { name: 'Quirky', plus: null, minus: null },
]
