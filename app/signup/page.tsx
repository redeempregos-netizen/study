'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

export default function SignupPage() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Conta criada com sucesso.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <form onSubmit={handleSignup} className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8">
        <h1 className="text-3xl font-black">Criar conta</h1>
        <p className="mt-2 text-sm text-slate-400">Comece a usar sua IA de estudos.</p>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
          />
        </div>

        {message && <p className="mt-4 text-sm text-indigo-300">{message}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-indigo-500 px-5 py-4 font-bold hover:bg-indigo-400"
        >
          Criar conta
        </button>
      </form>
    </main>
  )
}
