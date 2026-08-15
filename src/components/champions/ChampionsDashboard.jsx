import BuildsPanel from './builds/BuildsPanel.jsx'
import MetaPanel from './meta/MetaPanel.jsx'
import MatchupPanel from './matchups/MatchupPanel.jsx'

export function ChampionsDashboard() {
  return (
    <section
      className="flex flex-col gap-4 p-4 rounded-2xl bg-white/90 border border-amber-300 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
      aria-label="Pokémon Champions"
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <p className="mb-1 text-xs font-bold tracking-[0.24em] uppercase text-amber-600">
            Pokémon Champions
          </p>
          <h2 className="m-0 text-2xl font-bold text-gray-900">Meta y builds competitivos</h2>
        </div>
        <span className="px-[0.7rem] py-[0.4rem] rounded-full bg-amber-100 text-amber-800 text-[0.85rem] font-semibold">
          Pendiente de datos
        </span>
      </div>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        <BuildsPanel />
        <MetaPanel />
        <MatchupPanel />
      </div>
    </section>
  )
}
