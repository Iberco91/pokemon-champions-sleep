// Datos reales de berries de Pokémon Sleep (Fase 6 — CLAUDE.md sección 1.4).
// Fuente: código fuente de dos calculadoras open-source independientes que
// coinciden en todos los valores (nerolis-lab/nerolis-lab —
// common/src/types/berry/berries.ts — y nitoyon/pokesleep-tool —
// src/util/Berry.ts). Clave = nombre de la berry sin el sufijo " Berry" que
// usa species.berry_type en este proyecto (ej. "Grepa Berry" -> "Grepa").
export const berryBaseValues = {
  Pamtre: 24,
  Lum: 24,
  Grepa: 25,
  Bluk: 26,
  Pecha: 26,
  Mago: 26,
  Leppa: 27,
  Cheri: 27,
  Persim: 28,
  Figy: 29,
  Durin: 30,
  Sitrus: 30,
  Oran: 31,
  Wiki: 31,
  Chesto: 32,
  Rawst: 32,
  Belue: 33,
  Yache: 35,
}

// Berry favorita de la semana da el doble de Strength (confirmado:
// BASE_FAVORED_BERRY_MULTIPLIER en nerolis-lab/nerolis-lab). No modelamos el
// multiplicador de islas "Expert" (2.4x) porque la app no tiene ese concepto.
export const FAVORITE_BERRY_MULTIPLIER = 2

export function getBerryBaseValue(berryTypeLabel) {
  if (!berryTypeLabel) return null
  const name = berryTypeLabel.replace(/\s*Berry$/i, '').trim()
  return berryBaseValues[name] ?? null
}

// Strength de una berry para un Pokémon de nivel `level`: el máximo entre una
// curva lineal y una exponencial de 2.5%/nivel (fórmula confirmada, idéntica
// en ambas fuentes), ajustada por el Area Bonus de la isla (0-85%, dato que
// solo el jugador conoce — no hay tabla pública de nivel de isla -> bonus).
export function berryStrengthForLevel(baseValue, level, areaBonus = 0) {
  if (!baseValue) return 0
  const linear = baseValue + level - 1
  const exponential = Math.round(baseValue * 1.025 ** (level - 1))
  const raw = Math.max(linear, exponential)
  return Math.ceil(raw * (1 + areaBonus / 100))
}
