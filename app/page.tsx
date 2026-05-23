import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function Card({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.04] p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-4xl font-black">{value}</p>
      <p className="mt-2 text-sm text-indigo-200">{detail}</p>
    </div>
  )
}

export default async function Home() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, { data: documents }, { data: plans }, { data: questions }, { data: answers }, { data: progress }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('study_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('questions').select('*').eq('user_id', user.id),
    supabase.from('answers').select('*').eq('user_id', user.id),
    supabase.from('progress').select('*').eq('user_id', user.id).order('accuracy', { ascending: true }),
  ])

  const activePlan = plans?.[0]
  const { data: planItems } = activePlan
    ? await supabase
        .from('study_plan_items')
        .select('*')
        .eq('plan_id', activePlan.id)
        .order('created_at', { ascending: true })
    : { data: [] }

  const totalAnswers = answers?.length || 0
  const correctAnswers = answers?.filter((answer: any) => answer.is_correct).length || 0
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0
  const weakSubjects = progress?.slice(0, 3) || []
  const completedTasks = planItems?.filter((item: any) => item.status === 'concluido').length || 0
  const totalTasks = planItems?.length || 0
  const planProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : activePlan?.progress || 0

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-slate-900/70 p-6 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-xl font-black">S</div>
            <div>
              <h1 className="text-xl font-black">Study IA</h1>
              <p className="text-xs text-slate-400">Concursos públicos</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2 text-sm font-semibold text-slate-300">
            <a href="#dashboard" className="block rounded-2xl px-4 py-3 hover:bg-white/10">Dashboard</a>
            <a href="#upload" className="block rounded-2xl px-4 py-3 hover:bg-white/10">Upload de PDF</a>
            <a href="#plano" className="block rounded-2xl px-4 py-3 hover:bg-white/10">Plano de estudos</a>
            <a href="#desempenho" className="block rounded-2xl px-4 py-3 hover:bg-white/10">Desempenho</a>
          </nav>

          <a href="/auth/logout" className="mt-10 block rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10">Sair</a>
        </aside>

        <section className="flex-1">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-400">Olá, {profile?.full_name || user.email} 👋</p>
                <h2 className="text-2xl font-black">Seu painel de estudos</h2>
              </div>
              <a href="#upload" className="rounded-2xl bg-indigo-500 px-5 py-3 text-center text-sm font-bold hover:bg-indigo-400">Enviar novo PDF</a>
            </div>
          </header>

          <div className="space-y-8 p-5 lg:p-8">
            <section id="dashboard" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card label="PDFs enviados" value={documents?.length || 0} detail="Documentos salvos no Supabase" />
              <Card label="Questões geradas" value={questions?.length || 0} detail="Questões vinculadas ao usuário" />
              <Card label="Taxa de acerto" value={`${accuracy}%`} detail={`${correctAnswers} certas de ${totalAnswers}`} />
              <Card label="Tarefas do plano" value={totalTasks} detail={`${completedTasks} concluídas`} />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 to-slate-900 p-7">
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Plano ativo</p>
                <h3 className="mt-3 text-3xl font-black">{activePlan?.title || 'Nenhum plano ativo ainda'}</h3>
                <p className="mt-3 max-w-2xl text-slate-300">
                  {activePlan ? 'Seu plano foi carregado do Supabase e as tarefas reais aparecem abaixo.' : 'Envie um PDF para gerar seu primeiro plano de estudo com IA.'}
                </p>
                <div className="mt-6 h-4 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-indigo-400" style={{ width: `${planProgress}%` }} />
                </div>
                <p className="mt-3 text-sm text-slate-400">{planProgress}% concluído</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[.04] p-7">
                <h3 className="text-xl font-black">Matérias fracas</h3>
                <div className="mt-5 space-y-4">
                  {weakSubjects.length ? weakSubjects.map((item: any) => (
                    <div key={item.id}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>{item.subject}</span>
                        <span className="font-bold text-red-300">{item.accuracy}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10">
                        <div className="h-3 rounded-full bg-red-400" style={{ width: `${item.accuracy}%` }} />
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-400">Responda questões para identificar seus pontos fracos.</p>}
                </div>
              </div>
            </section>

            <section id="plano" className="rounded-3xl border border-white/10 bg-white/[.04] p-7">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Tarefas reais do plano</p>
                  <h3 className="mt-2 text-2xl font-black">Cronograma gerado</h3>
                </div>
                <p className="text-sm text-slate-400">Atualiza automaticamente após concluir.</p>
              </div>

              <div className="mt-6 space-y-3">
                {planItems?.length ? planItems.map((item: any) => (
                  <div key={item.id} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900 p-4 xl:grid-cols-[90px_140px_1fr_80px_90px_120px_140px] xl:items-center">
                    <p className="font-bold text-indigo-200">{item.day_label}</p>
                    <p className="font-semibold">{item.subject}</p>
                    <p className="text-sm text-slate-300">{item.task}</p>
                    <p className="text-sm">{item.estimated_minutes} min</p>
                    <p className="text-sm text-amber-200">{item.priority}</p>
                    <span className={item.status === 'concluido' ? 'rounded-full bg-emerald-500/20 px-3 py-1 text-center text-xs font-bold text-emerald-300' : 'rounded-full bg-white/10 px-3 py-1 text-center text-xs font-bold'}>
                      {item.status === 'concluido' ? 'Concluído' : item.status}
                    </span>
                    {item.status === 'concluido' ? (
                      <div className="rounded-2xl bg-emerald-500/20 px-4 py-3 text-center text-sm font-bold text-emerald-300">✓ Feito</div>
                    ) : (
                      <form action="/api/tasks/complete" method="post">
                        <input type="hidden" name="task_id" value={item.id} />
                        <input type="hidden" name="plan_id" value={item.plan_id} />
                        <button className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-400">Concluir</button>
                      </form>
                    )}
                  </div>
                )) : <p className="rounded-2xl bg-slate-900 p-5 text-sm text-slate-400">Nenhuma tarefa ainda. Envie um PDF e clique em Gerar plano.</p>}
              </div>
            </section>

            <section id="upload" className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
              <div className="rounded-3xl border border-dashed border-indigo-400/40 bg-indigo-500/5 p-7">
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Upload de PDF</p>
                <h3 className="mt-3 text-2xl font-black">Envie edital, apostila ou caderno</h3>
                <form action="/api/documents/upload" method="post" encType="multipart/form-data" className="mt-6 space-y-4">
                  <input name="file" type="file" accept="application/pdf" className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm" />
                  <button className="w-full rounded-2xl bg-indigo-500 px-5 py-4 font-bold hover:bg-indigo-400">Enviar PDF</button>
                </form>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[.04] p-7">
                <h3 className="text-xl font-black">Documentos enviados</h3>
                <div className="mt-5 space-y-3">
                  {documents?.length ? documents.map((doc: any) => (
                    <div key={doc.id} className="rounded-2xl bg-slate-900 p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-bold">{doc.title}</p>
                          <p className="text-sm text-slate-400">Status: {doc.status || 'enviado'}</p>
                          <p className="text-sm text-slate-500">{doc.file_url ? 'Arquivo salvo no Storage' : 'Sem arquivo vinculado'}</p>
                        </div>
                        <form action="/api/plans/generate" method="post">
                          <input type="hidden" name="document_id" value={doc.id} />
                          <button className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-400">Gerar plano</button>
                        </form>
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-400">Nenhum documento enviado ainda.</p>}
                </div>
              </div>
            </section>

            <section id="desempenho" className="rounded-3xl border border-white/10 bg-white/[.04] p-7">
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Desempenho</p>
              <h3 className="mt-2 text-2xl font-black">Recomendações da IA</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-900 p-5"><b>Próximo passo</b><p className="mt-2 text-sm text-slate-400">Conclua as tarefas do plano e responda questões.</p></div>
                <div className="rounded-2xl bg-slate-900 p-5"><b>Questões</b><p className="mt-2 text-sm text-slate-400">As questões serão criadas a partir do documento enviado.</p></div>
                <div className="rounded-2xl bg-slate-900 p-5"><b>Revisões</b><p className="mt-2 text-sm text-slate-400">A IA vai ajustar o cronograma com base nos seus erros.</p></div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}
