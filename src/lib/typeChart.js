// Tabla de tipos estándar de la saga principal (18 tipos; Stellar queda fuera
// porque solo aplica como Teratipo especial, no como tipo atacante regular).
// TYPE_CHART[attackType] lista únicamente los multiplicadores distintos de 1.

export const pokemonTypes = [
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
]

const TYPE_CHART = {
  Normal: { Roca: 0.5, Acero: 0.5, Fantasma: 0 },
  Fuego: { Fuego: 0.5, Agua: 0.5, Planta: 2, Hielo: 2, Bicho: 2, Roca: 0.5, Dragón: 0.5, Acero: 2 },
  Agua: { Fuego: 2, Agua: 0.5, Planta: 0.5, Tierra: 2, Roca: 2, Dragón: 0.5 },
  Eléctrico: { Agua: 2, Eléctrico: 0.5, Planta: 0.5, Tierra: 0, Volador: 2, Dragón: 0.5 },
  Planta: { Fuego: 0.5, Agua: 2, Planta: 0.5, Veneno: 0.5, Tierra: 2, Volador: 0.5, Bicho: 0.5, Roca: 2, Dragón: 0.5, Acero: 0.5 },
  Hielo: { Fuego: 0.5, Agua: 0.5, Planta: 2, Hielo: 0.5, Tierra: 2, Volador: 2, Dragón: 2, Acero: 0.5 },
  Lucha: { Normal: 2, Hielo: 2, Veneno: 0.5, Volador: 0.5, Psíquico: 0.5, Bicho: 0.5, Roca: 2, Fantasma: 0, Siniestro: 2, Hada: 0.5, Acero: 2 },
  Veneno: { Planta: 2, Veneno: 0.5, Tierra: 0.5, Roca: 0.5, Fantasma: 0.5, Acero: 0, Hada: 2 },
  Tierra: { Fuego: 2, Eléctrico: 2, Planta: 0.5, Veneno: 2, Volador: 0, Bicho: 0.5, Roca: 2, Acero: 2 },
  Volador: { Eléctrico: 0.5, Planta: 2, Lucha: 2, Bicho: 2, Roca: 0.5, Acero: 0.5 },
  Psíquico: { Lucha: 2, Veneno: 2, Psíquico: 0.5, Siniestro: 0, Acero: 0.5 },
  Bicho: { Fuego: 0.5, Planta: 2, Lucha: 0.5, Veneno: 0.5, Volador: 0.5, Psíquico: 2, Fantasma: 0.5, Siniestro: 2, Acero: 0.5, Hada: 0.5 },
  Roca: { Fuego: 2, Hielo: 2, Lucha: 0.5, Tierra: 0.5, Volador: 2, Bicho: 2, Acero: 0.5 },
  Fantasma: { Normal: 0, Psíquico: 2, Fantasma: 2, Siniestro: 0.5 },
  Dragón: { Dragón: 2, Acero: 0.5, Hada: 0 },
  Siniestro: { Lucha: 0.5, Psíquico: 2, Fantasma: 2, Siniestro: 0.5, Hada: 0.5 },
  Acero: { Fuego: 0.5, Agua: 0.5, Eléctrico: 0.5, Hielo: 2, Roca: 2, Acero: 0.5, Hada: 2 },
  Hada: { Fuego: 0.5, Lucha: 2, Veneno: 0.5, Dragón: 2, Siniestro: 2, Acero: 0.5 },
}

export function getTypeMultiplier(attackType, defendTypes) {
  return defendTypes.reduce((multiplier, defendType) => multiplier * (TYPE_CHART[attackType]?.[defendType] ?? 1), 1)
}

// Peor multiplicador que un defensor recibe de un atacante con 1-2 tipos:
// el atacante siempre usará el STAB más efectivo disponible.
export function getWorstIncomingMultiplier(attackTypes, defendTypes) {
  return Math.max(...attackTypes.map((attackType) => getTypeMultiplier(attackType, defendTypes)))
}
