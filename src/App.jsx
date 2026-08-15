import { SleepDashboard } from './components/sleep/SleepDashboard.jsx'
import { ChampionsDashboard } from './components/champions/ChampionsDashboard.jsx'
import LoginScreen from './components/shared/LoginScreen.jsx'
import { useAppState } from './hooks/useAppState.js'

function App() {
  const { status, message, auth } = useAppState()

  return (
    <main className="max-w-[1100px] mx-auto px-6 pt-12 pb-16">
      <header className="text-center mb-8">
        <p className="mb-3 text-[0.8rem] font-bold tracking-[0.25em] uppercase text-amber-600">
          Proyecto Pokémon Champions y Sleep
        </p>
        <h1 className="mb-3 text-4xl font-bold text-gray-800">Centro de herramientas</h1>
        <p className="mx-auto max-w-[640px] text-gray-600">
          La estructura base está lista para desarrollar los módulos de Sleep y Champions.
        </p>
        {auth.user && (
          <button
            type="button"
            onClick={() => auth.signOut()}
            className="mt-4 text-sm font-semibold text-amber-700 underline"
          >
            Cerrar sesión ({auth.user.email})
          </button>
        )}
      </header>

      {status === 'error' && (
        <p className="text-center text-red-600 mb-6">{message}</p>
      )}

      {status === 'loading' && (
        <p className="text-center text-gray-600 mb-6">{message}</p>
      )}

      {status === 'ready' && !auth.user && <LoginScreen onSignIn={auth.signInWithEmail} />}

      {status === 'ready' && auth.user && (
        <section
          className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
          aria-label="Módulos principales"
        >
          <SleepDashboard />
          <ChampionsDashboard />
        </section>
      )}
    </main>
  )
}

export default App
