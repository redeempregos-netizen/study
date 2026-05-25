import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractQuestionsFromPdf } from '@/lib/pdf-parser'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const formData = await request.formData()
  const documentId = formData.get('document_id') as string | null

  if (!documentId) {
    return NextResponse.redirect(new URL('/?error=document', request.url))
  }

  const { data: document } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (!document?.file_path) {
    return NextResponse.redirect(new URL('/?error=file', request.url))
  }

  await supabase
    .from('documents')
    .update({ status: 'baixando pdf' })
    .eq('id', document.id)

  try {
    const { data, error } = await supabase.storage
      .from('study-pdfs')
      .download(document.file_path)

    if (error || !data) {
      throw new Error(error?.message || 'Erro ao baixar PDF do Storage')
    }

    await supabase
      .from('documents')
      .update({ status: 'extraindo questões' })
      .eq('id', document.id)

    const buffer = await data.arrayBuffer()
    const extractedQuestions = await extractQuestionsFromPdf(buffer)

    await supabase
      .from('documents')
      .update({ status: `extraídas ${extractedQuestions.length} questões` })
      .eq('id', document.id)

    if (extractedQuestions.length) {
      const batchSize = 100

      for (let i = 0; i < extractedQuestions.length; i += batchSize) {
        const batch = extractedQuestions.slice(i, i + batchSize).map((question) => ({
          ...question,
          user_id: user.id,
          extracted_from_pdf: true,
        }))

        const { error: insertError } = await supabase.from('questions').insert(batch)

        if (insertError) {
          throw new Error(insertError.message)
        }
      }
    }

    await supabase
      .from('documents')
      .update({
        status: 'concluido',
        total_questions: extractedQuestions.length,
        processed_at: new Date().toISOString(),
      })
      .eq('id', document.id)
  } catch (error: any) {
    await supabase
      .from('documents')
      .update({ status: `erro: ${String(error?.message || error).slice(0, 120)}` })
      .eq('id', document.id)
  }

  return NextResponse.redirect(new URL('/', request.url))
}
