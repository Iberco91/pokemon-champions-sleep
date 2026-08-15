import { useState } from 'react'

export default function LoginScreen({ onSignIn }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ message: '', isError: false })
  const [sending, setSending] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setStatus({ message: 'Escribe tu correo primero.', isError: true })
      return
    }
    setSending(true)
    const { error } = await onSignIn(trimmed)
    setSending(false)
    if (error) {
      setStatus({ message: `No se pudo enviar el link: ${error.message}`, isError: true })
      return
    }
    setStatus({
      message: `Te enviamos un link a ${trimmed}. Ábrelo desde este dispositivo para entrar.`,
      isError: false,
    })
  }

  return (
    <div className="max-w-[420px] mx-auto mt-16 p-6 rounded-2xl bg-white/90 border border-amber-300 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      <p className="mb-3 text-xs font-bold tracking-[0.24em] uppercase text-amber-600">
        🔒 Iniciar sesión
      </p>
      <p className="mb-4 text-gray-600">
        Ingresa tu correo y te enviaremos un link mágico. Al abrirlo desde cualquier dispositivo,
        tu box quedará sincronizado entre todos.
      </p>
      <form className="flex flex-wrap gap-2" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={sending}
          className="flex-1 min-w-[180px] px-[0.7rem] py-[0.6rem] rounded-[0.65rem] border border-amber-200 bg-[#fffef9]"
        />
        <button
          type="submit"
          disabled={sending}
          className="px-4 py-[0.6rem] rounded-[0.65rem] bg-pikachu text-gray-900 font-bold disabled:opacity-60"
        >
          {sending ? 'Enviando...' : 'Enviar link mágico'}
        </button>
      </form>
      {status.message && (
        <p className={`mt-3 text-sm ${status.isError ? 'text-red-600' : 'text-gray-600'}`}>
          {status.message}
        </p>
      )}
    </div>
  )
}
