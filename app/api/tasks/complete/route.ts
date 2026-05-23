import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const formData = await request.formData()
  const taskId = formData.get('task_id') as string | null
  const planId = formData.get('plan_id') as string | null

  if (!taskId || !planId) {
    return NextResponse.redirect(new URL('/?error=tarefa', request.url))
  }

  const { data: plan } = await supabase
    .from('study_plans')
    .select('id')
    .eq('id', planId)
    .eq('user_id', user.id)
    .single()

  if (!plan) {
    return NextResponse.redirect(new URL('/?error=plano_nao_encontrado', request.url))
  }

  await supabase
    .from('study_plan_items')
    .update({ status: 'concluido' })
    .eq('id', taskId)
    .eq('plan_id', planId)

  const { data: items } = await supabase
    .from('study_plan_items')
    .select('status')
    .eq('plan_id', planId)

  const total = items?.length || 0
  const completed = items?.filter((item: any) => item.status === 'concluido').length || 0
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  await supabase
    .from('study_plans')
    .update({ progress })
    .eq('id', planId)
    .eq('user_id', user.id)

  return NextResponse.redirect(new URL('/', request.url))
}
