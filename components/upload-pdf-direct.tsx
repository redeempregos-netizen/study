'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'

export function UploadPdfDirect() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('Enviando PDF para o Storage...')

    const formData = new FormData(event.currentTarget)
    const file = formData.get('file') as File | null

    if (!file) {
      setMessage('Selecione um PDF.')
      setLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMessage('Faça login novamente.')
      setLoading(false)
      return
    }

    const fileExt = file.name.split('.').pop() || 'pdf'
    const filePath = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`

    const { error: uploadError } = await supabase.storage
      .from('study-pdfs')
      .upload(filePath, file, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (uploadError) {
      setMessage(`Erro no upload: ${uploadError.message}`)
      setLoading(false)
      return
    }

    setMessage('PDF enviado. Salvando documento...')

    const { error: insertError } = await supabase.from('documents').insert({
      user_id: user.id,
      title: file.name,
      document_type: fileExt,
      file_path: filePath,
      file_url: filePath,
      status: 'enviado',
    })

    if (insertError) {
      setMessage(`Erro ao salvar documento: ${insertError.message}`)
      setLoading(false)
      return
    }

    setMessage('PDF salvo com sucesso. Agora clique em Processar PDF.')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleUpload} className="mt-6 space-y-4">
      <input
        name="file"
        type="file"
        accept="application/pdf"
        className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-indigo-500 px-5 py-4 font-bold hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Enviando...' : 'Enviar PDF'}
      </button>
      {message && <p className="text-sm text-slate-300">{message}</p>}
    </form>
  )
}
