import { useState } from 'react'

// Two-step delete: the first click only asks for confirmation, so a stray
// click never removes a Pokémon. onConfirm must resolve to { error }.
export default function ConfirmDeleteButton({ label, onConfirm }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  async function handleConfirm() {
    setDeleting(true)
    setError(null)
    const { error: deleteError } = await onConfirm()
    setDeleting(false)
    if (deleteError) {
      setError('No se pudo eliminar. Intenta de nuevo.')
      return
    }
    setConfirming(false)
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs font-semibold text-red-600 underline shrink-0"
      >
        Eliminar
      </button>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1 shrink-0">
      <span className="text-xs font-semibold text-gray-800">¿Eliminar a {label}?</span>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="px-2 py-0.5 rounded-md border border-gray-300 bg-white text-xs font-semibold text-gray-700 disabled:opacity-40"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={deleting}
          className="px-2 py-0.5 rounded-md bg-red-600 text-xs font-semibold text-white disabled:opacity-40"
        >
          {deleting ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}
