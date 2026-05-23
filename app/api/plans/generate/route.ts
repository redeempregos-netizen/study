import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const defaultTasks = [
  {
    day_label: 'Dia 1',
    subject: 'Português',
    task: 'Ler o material enviado e resolver 20 questões de interpretação de texto.',
    estimated_minutes: 90,
    priority: 'alta',
    status: 'pendente',
  },
  {
    day_label: 'Dia 2',
    subject: 'Direito Constitucional',
    task: 'Estudar direitos fundamentais e resolver 20 questões.',
    estimated_minutes: 100,
    priority: 'alta',
    status: 'pendente',
  },
  {
    day_label: 'Dia 3',
    subject: 'Raciocínio Lógico',
    task: 'Revisar proposições lógicas e resolver questões comentadas.',
    estimated_minutes: 80,
    priority: 'media',
    status: 'pendente',
  },
  {
    day_label: 'Dia 4',
    subject: 'Direito Administrativo',
    task: 'Estudar atos administrativos e fazer revisão ativa.',
    estimated_minutes: 90,
    priority: 'media',
    status: 'pendente',
  },
  {
    day_label: 'Dia 5',
    subject: 'Revisão geral',
    task: 'Revisar erros, criar flashcards e refazer questões erradas.',
    estimated_minutes: 70,
    priority: 'alta',
    status: 'pendente',
  },
]

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
    return NextResponse.redirect(new URL('/?error=documento', request.url))
  }

  const { data: document } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (!document) {
    return NextResponse.redirect(new URL('/?error=documento_nao_encontrado', request.url))
  }

  const { data: plan, error: planError } = await supabase
    .from('study_plans')
    .insert({
      user_id: user.id,
      document_id: document.id,
      title: `Plano de estudos - ${document.title}`,
    })
    .select()
    .single()

  if (planError || !plan) {
    return NextResponse.redirect(new URL('/?error=plano', request.url))
  }

  const items = defaultTasks.map((task) => ({
    ...task,
    plan_id: plan.id,
  }))

  await supabase.from('study_plan_items').insert(items)

  await supabase
    .from('documents')
    .update({ status: 'plano gerado' })
    .eq('id', document.id)
    .eq('user_id', user.id)

  return NextResponse.redirect(new URL('/', request.url))
}
