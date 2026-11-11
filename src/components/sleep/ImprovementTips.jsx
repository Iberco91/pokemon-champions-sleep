// Panel "¿Qué le falta para el 100%?": muestra los cambios de sub-skills,
// naturaleza e ingredientes que más suben el puntaje del ejemplar (ver
// src/lib/sleepImprovements.js). Plegable para que la búsqueda solo corra al
// abrirlo.

import { useEffect, useMemo, useState } from 'react'
import { natureOptions } from '../../data/sleepData.js'
import { computeImprovementPlan } from '../../lib/sleepImprovements.js'

function formatValue(field, value) {
  if (!value) return '—'
  if (field !== 'nature') return value
  const nature = natureOptions.find((option) => option.name === value)
  return nature?.positive ? `${value} (+${nature.positive})` : `${value} (neutra)`
}

function PlanDetails({ entry, species, nature, isSupport }) {
  // La búsqueda exhaustiva puede tardar 1-2 s (especialistas en Ingredientes
  // y supports): se corre después de pintar "Calculando..." para no congelar
  // la página.
  const [result, setResult] = useState(null)
  const inputs = useMemo(() => ({ entry, species, nature }), [entry, species, nature])
  useEffect(() => {
    const timer = setTimeout(() => setResult({ inputs, plan: computeImprovementPlan(inputs) }), 30)
    return () => clearTimeout(timer)
  }, [inputs])

  if (!result || result.inputs !== inputs) {
    return <p className="m-0 text-sm text-gray-500">Calculando la mejor combinación...</p>
  }
  const { plan } = result
  if (!plan) return null

  const metricLabel = isSupport ? 'Ejemplar' : 'Calidad del ejemplar'

  if (plan.steps.length === 0) {
    return (
      <p className="m-0 text-sm text-gray-600">
        {metricLabel}: {plan.startScore}%. No hay cambios que lo suban: ya está en su máximo.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2 text-sm text-gray-700">
      <p className="m-0">
        {metricLabel}: <strong>{plan.startScore}%</strong> → máximo alcanzable <strong>{plan.maxScore}%</strong>
      </p>
      <ol className="m-0 pl-5 flex flex-col gap-1">
        {plan.steps.map((step, index) => {
          const previousScore = index === 0 ? plan.startScore : plan.steps[index - 1].scoreAfter
          return (
            <li key={step.field}>
              <strong>{step.label}:</strong> {formatValue(step.field, step.from)} →{' '}
              <span className="font-semibold text-emerald-700">{formatValue(step.field, step.to)}</span>{' '}
              {step.movedFrom && (
                <span className="text-gray-500">(la que tenía en {step.movedFrom.replace('Sub-skill ', '')}) </span>
              )}
              <span className="text-gray-500">
                ({step.scoreAfter > previousScore ? 'sube a' : 'mantiene'} {step.scoreAfter}%)
              </span>
            </li>
          )
        })}
      </ol>
      {plan.maxScore < 100 && !isSupport && (
        <p className="m-0 text-xs text-gray-500">
          No llega a 100% porque la mitad del puntaje (eficiencia de RP) usa la fórmula de RP del juego, que no siempre
          premia lo mismo que su especialidad: por ejemplo, puede preferir ingredientes más valiosos en vez de AAA, o una
          naturaleza + Helping Speed en vez de la óptima. El máximo alcanzable es el mejor equilibrio entre ambas.
        </p>
      )}
    </div>
  )
}

export default function ImprovementTips({ entry, species, nature, isSupport, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  if (!species) return null

  return (
    <div className="p-3 rounded-xl bg-white border border-amber-200">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between text-left font-bold text-gray-800 text-sm"
        aria-expanded={open}
      >
        ¿Qué le falta para el 100%?
        <span className="text-gray-500">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="mt-2">
          <PlanDetails entry={entry} species={species} nature={nature} isSupport={isSupport} />
        </div>
      )}
    </div>
  )
}
