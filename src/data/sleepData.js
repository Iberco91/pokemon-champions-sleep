export const sleepSpecialties = ['Berries', 'Ingredients', 'Skills']

// Las 17 sub-skills oficiales actuales del juego. Verificado 2026-08-29 contra
// nerolis-lab/nerolis-lab (calculadora open-source de la comunidad, código
// activamente mantenido). OJO: "Helping Speed L" y "Skill Trigger L" que
// CLAUDE.md sección 1.2 todavía menciona ya NO EXISTEN — el juego las
// reemplazó por "Skill Level Up S/M" (suben directamente el nivel del Main
// Skill). Si esto sorprende, es porque CLAUDE.md quedó desactualizado tras un
// parche, igual que ya pasó una vez con los niveles de desbloqueo (ver abajo).
export const subskillOptions = [
  'Berry Finding S',
  'Dream Shard Bonus',
  'Energy Recovery Bonus',
  'Helping Bonus',
  'Helping Speed S',
  'Helping Speed M',
  'Ingredient Finder S',
  'Ingredient Finder M',
  'Inventory Up S',
  'Inventory Up M',
  'Inventory Up L',
  'Research EXP Bonus',
  'Skill Level Up S',
  'Skill Level Up M',
  'Skill Trigger S',
  'Skill Trigger M',
  'Sleep EXP Bonus',
]

// Las 25 naturalezas oficiales del juego. positive/negative usan los mismos
// nombres de stat que sleepStats.js ('Helping Speed', 'Ingredient Finding',
// 'Main Skill Chance', 'EXP Gain', 'Energy Recovery'). Verificado contra
// Game8 y GameRant (tablas coincidentes) — 20 con efecto + 5 neutras.
export const natureOptions = [
  { name: 'Adamant', positive: 'Helping Speed', negative: 'Ingredient Finding' },
  { name: 'Brave', positive: 'Helping Speed', negative: 'EXP Gain' },
  { name: 'Bold', positive: 'Energy Recovery', negative: 'Helping Speed' },
  { name: 'Calm', positive: 'Main Skill Chance', negative: 'Helping Speed' },
  { name: 'Careful', positive: 'Main Skill Chance', negative: 'Ingredient Finding' },
  { name: 'Gentle', positive: 'Main Skill Chance', negative: 'Energy Recovery' },
  { name: 'Hasty', positive: 'EXP Gain', negative: 'Energy Recovery' },
  { name: 'Impish', positive: 'Energy Recovery', negative: 'Ingredient Finding' },
  { name: 'Jolly', positive: 'EXP Gain', negative: 'Ingredient Finding' },
  { name: 'Lonely', positive: 'Helping Speed', negative: 'Energy Recovery' },
  { name: 'Lax', positive: 'Energy Recovery', negative: 'Main Skill Chance' },
  { name: 'Modest', positive: 'Ingredient Finding', negative: 'Helping Speed' },
  { name: 'Mild', positive: 'Ingredient Finding', negative: 'Energy Recovery' },
  { name: 'Naive', positive: 'EXP Gain', negative: 'Main Skill Chance' },
  { name: 'Naughty', positive: 'Helping Speed', negative: 'Main Skill Chance' },
  { name: 'Quiet', positive: 'Ingredient Finding', negative: 'EXP Gain' },
  { name: 'Rash', positive: 'Ingredient Finding', negative: 'Main Skill Chance' },
  { name: 'Relaxed', positive: 'Energy Recovery', negative: 'EXP Gain' },
  { name: 'Sassy', positive: 'Main Skill Chance', negative: 'EXP Gain' },
  { name: 'Timid', positive: 'EXP Gain', negative: 'Helping Speed' },
  { name: 'Bashful', positive: null, negative: null },
  { name: 'Hardy', positive: null, negative: null },
  { name: 'Docile', positive: null, negative: null },
  { name: 'Quirky', positive: null, negative: null },
  { name: 'Serious', positive: null, negative: null },
]

// Magnitud real de cada stat de naturaleza (Fase 7 — CLAUDE.md 1.2/1.4).
// Multiplicadores exactos verificados 2026-08-29 contra nerolis-lab
// (common/src/types/nature/nature.ts), consistentes con Game8/GameRant.
// 'Helping Speed' ya viene invertido (positivo = tiempo de ayuda más corto,
// listo para multiplicar directo por la frecuencia base en segundos).
export const NATURE_STAT_FACTORS = {
  'Helping Speed': { positive: 0.9, negative: 1.075 },
  'Ingredient Finding': { positive: 1.2, negative: 0.8 },
  'Main Skill Chance': { positive: 1.2, negative: 0.8 },
  'EXP Gain': { positive: 1.18, negative: 0.82 },
  'Energy Recovery': { positive: 1.2, negative: 0.88 },
}

export function getNatureStatFactor(nature, statName) {
  if (!nature || !statName) return 1
  if (nature.positive === statName) return NATURE_STAT_FACTORS[statName]?.positive ?? 1
  if (nature.negative === statName) return NATURE_STAT_FACTORS[statName]?.negative ?? 1
  return 1
}

// Lineas evolutivas completas del Pokedex actual, reconstruidas 2026-09-02 desde el grafo
// evolvesFrom/evolvesInto de nerolis-lab (incluye familias con ramificaciones, ej. Eevee).
export const evolutionFamilies = [
  ['Aron', 'Lairon', 'Aggron'],
  ['Bagon', 'Shelgon', 'Salamence'],
  ['Bellsprout', 'Weepinbell', 'Victreebel'],
  ['Bonsly', 'Sudowoodo'],
  ['Bulbasaur', 'Ivysaur', 'Venusaur'],
  ['Caterpie', 'Metapod', 'Butterfree'],
  ['Cetoddle', 'Cetitan'],
  ['Charmander', 'Charmeleon', 'Charizard'],
  ['Chikorita', 'Bayleef', 'Meganium'],
  ['Chimchar', 'Monferno', 'Infernape'],
  ['Cleffa', 'Clefairy', 'Clefable'],
  ['Croagunk', 'Toxicroak'],
  ['Cubone', 'Marowak'],
  ['Cutiefly', 'Ribombee'],
  ['Cyndaquil', 'Quilava', 'Typhlosion'],
  ['Diglett', 'Dugtrio'],
  ['Doduo', 'Dodrio'],
  ['Dratini', 'Dragonair', 'Dragonite'],
  ['Drifloon', 'Drifblim'],
  ['Dwebble', 'Crustle'],
  ['Eevee', 'Vaporeon', 'Jolteon', 'Flareon', 'Espeon', 'Umbreon', 'Leafeon', 'Glaceon', 'Sylveon'],
  ['Ekans', 'Arbok'],
  ['Fuecoco', 'Crocalor', 'Skeledirge'],
  ['Gastly', 'Haunter', 'Gengar'],
  ['Geodude', 'Graveler', 'Golem'],
  ['Growlithe', 'Arcanine'],
  ['Grubbin', 'Charjabug', 'Vikavolt'],
  ['Gulpin', 'Swalot'],
  ['Happiny', 'Chansey', 'Blissey'],
  ['Houndour', 'Houndoom'],
  ['Igglybuff', 'Jigglypuff', 'Wigglytuff'],
  ['Larvitar', 'Pupitar', 'Tyranitar'],
  ['Magnemite', 'Magneton', 'Magnezone'],
  ['Mankey', 'Primeape'],
  ['Mareep', 'Flaaffy', 'Ampharos'],
  ['Meowth', 'Persian'],
  ['Mime Jr.', 'Mr. Mime'],
  ['Mudkip', 'Marshtomp', 'Swampert'],
  ['Munna', 'Musharna'],
  ['Murkrow', 'Honchkrow'],
  ['Natu', 'Xatu'],
  ['Noibat', 'Noivern'],
  ['Onix', 'Steelix'],
  ['Pawmi', 'Pawmo', 'Pawmot'],
  ['Pichu', 'Pikachu', 'Raichu'],
  ['Piplup', 'Prinplup', 'Empoleon'],
  ['Psyduck', 'Golduck'],
  ['Pumpkaboo (Jumbo Variety)', 'Gourgeist (Jumbo Variety)'],
  ['Pumpkaboo (Large Variety)', 'Gourgeist (Large Variety)'],
  ['Pumpkaboo (Medium Variety)', 'Gourgeist (Medium Variety)'],
  ['Pumpkaboo (Small Variety)', 'Gourgeist (Small Variety)'],
  ['Quaxly', 'Quaxwell', 'Quaquaval'],
  ['Ralts', 'Kirlia', 'Gardevoir', 'Gallade'],
  ['Rattata', 'Raticate'],
  ['Riolu', 'Lucario'],
  ['Rufflet', 'Braviary'],
  ['Sandshrew', 'Sandslash'],
  ['Shinx', 'Luxio', 'Luxray'],
  ['Shuppet', 'Banette'],
  ['Slakoth', 'Vigoroth', 'Slaking'],
  ['Slowpoke', 'Slowbro', 'Slowking'],
  ['Sneasel', 'Weavile'],
  ['Snover', 'Abomasnow'],
  ['Spheal', 'Sealeo', 'Walrein'],
  ['Sprigatito', 'Floragato', 'Meowscarada'],
  ['Squirtle', 'Wartortle', 'Blastoise'],
  ['Stufful', 'Bewear'],
  ['Swablu', 'Altaria'],
  ['Tinkatink', 'Tinkatuff', 'Tinkaton'],
  ['Togepi', 'Togetic', 'Togekiss'],
  ['Torchic', 'Combusken', 'Blaziken'],
  ['Totodile', 'Croconaw', 'Feraligatr'],
  ['Toxel', 'Toxtricity (Amped Form)', 'Toxtricity (Low Key Form)'],
  ['Trapinch', 'Vibrava', 'Flygon'],
  ['Treecko', 'Grovyle', 'Sceptile'],
  ['Turtwig', 'Grotle', 'Torterra'],
  ['Tyrunt', 'Tyrantrum'],
  ['Vulpix', 'Ninetales'],
  ['Vulpix (Alolan Form)', 'Ninetales (Alolan Form)'],
  ['Wooper', 'Quagsire'],
  ['Wooper (Paldean Form)', 'Clodsire'],
  ['Wynaut', 'Wobbuffet'],
]

export function getEvolutionFamily(speciesName) {
  return evolutionFamilies.find((family) => family.includes(speciesName)) ?? [speciesName]
}

// Mapas curados para el optimizer de equipo de la Fase 6 (CLAUDE.md 1.4).
// Set inicial de referencia — ampliar con el resto de mapas del juego.
export const snorlaxMaps = ['Greengrass Isle', 'Cyan Beach', 'Taupe Hollow']

export const dishTypes = ['Curry', 'Ensaladas', 'Postres']

// Las 81 recetas reales (con ingredientes, bonus% y fórmula de valor) viven
// ahora en src/data/sleepRecipes.js — reemplaza a este placeholder que tenía
// valores de "value" inventados.

// Tope real de nivel: el mismo parche 3.6.0 (25/06/2026) que bajó los
// niveles de sub-skill a 70/80 también subió el tope de nivel de 65 a 70
// (fuente: pokemonsleep.net, notas de la actualización 3.6.0). No es 100.
export const sleepLevels = { min: 1, max: 70 }

// Niveles de desbloqueo de sub-skills. Desde el parche 3.6.0 (25/06/2026) el
// juego bajó los dos últimos: 75->70 y 100->80 (fuente: pokemonsleep.net,
// notas de actualización oficiales). Si cambian de nuevo, este es el único
// lugar que hay que tocar — sleepScoring.js y sleepStats.js lo importan.
export const subskillLevels = [10, 25, 50, 70, 80]

// Ingredientes conocidos del juego. Lista de referencia inicial, ampliable.
// Lista completa de los 19 ingredientes reales del juego (fuente:
// src/data/sleepRecipes.js). "Snoozy Toadstool" no existe en el juego real —
// era un nombre inventado; el correcto es "Snoozy Tomato". También se
// agregaron los 5 ingredientes que faltaban (Corn, Coffee, Avocado, Pumpkin,
// Tomato).
export const ingredientOptions = [
  'Bean Sausage',
  'Fancy Apple',
  'Warming Ginger',
  'Honey',
  'Moomoo Milk',
  'Pure Oil',
  'Soft Potato',
  'Fiery Herb',
  'Snoozy Tomato',
  'Tasty Mushroom',
  'Greengrass Soybeans',
  'Slowpoke Tail',
  'Large Leek',
  'Soothing Cacao',
  'Fancy Egg',
  'Greengrass Corn',
  'Rousing Coffee',
  'Glossy Avocado',
  'Plump Pumpkin',
]
