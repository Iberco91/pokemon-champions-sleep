// Muestra los dos indicadores de un Pokémon de Sleep por separado: la tier de
// su especie (RaenonX, ver src/data/sleepSpeciesTiers.js) y la calidad del
// ejemplar (% de sleepScoring.js). Se usa en el Box, la ficha, la evaluación
// y el comparador para que todas las vistas digan lo mismo.

const SPECIES_TIER_BADGE_CLASS = {
  S: 'bg-violet-100 text-violet-800',
  A: 'bg-sky-100 text-sky-800',
  B: 'bg-emerald-100 text-emerald-800',
  C: 'bg-lime-100 text-lime-800',
  D: 'bg-amber-100 text-amber-800',
  E: 'bg-orange-100 text-orange-800',
  F: 'bg-red-100 text-red-800',
}

const QUALITY_BADGE_CLASS = {
  S: 'bg-emerald-100 text-emerald-800',
  A: 'bg-lime-100 text-lime-800',
  B: 'bg-amber-100 text-amber-800',
  C: 'bg-red-100 text-red-800',
}

const badgeClass = 'px-2 py-[0.1rem] rounded-full text-xs font-bold'

export default function EvaluationBadges({ evaluation }) {
  if (!evaluation) return null
  const { speciesTier } = evaluation

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2">
        {speciesTier ? (
          <span
            className={`${badgeClass} ${SPECIES_TIER_BADGE_CLASS[speciesTier.tier]}`}
            title={`Tier list de RaenonX: ${Math.round(speciesTier.strength).toLocaleString('es-CL')} de fuerza diaria a nivel 60`}
          >
            Especie: Tier {speciesTier.tier}
          </span>
        ) : (
          <span className={`${badgeClass} bg-gray-100 text-gray-600`}>Especie: sin datos</span>
        )}
        <span className={`${badgeClass} ${QUALITY_BADGE_CLASS[evaluation.tier]}`}>
          Calidad del ejemplar: {evaluation.score}%
        </span>
        {!evaluation.mandatoryMet && (
          <span className="text-red-600 text-xs font-semibold">Falta Berry Finding S (obligatorio)</span>
        )}
      </div>
      {speciesTier?.energySupport && (
        <p className="m-0 text-xs text-gray-500">
          Soporte de energía: la tier de especie no cuenta la energía que entrega al equipo, así que subestima su valor.
        </p>
      )}
    </div>
  )
}
