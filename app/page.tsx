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

  if (!user) {
    redirect('/login')
  }

  const [{ data: profile }, { data: documents }, { data: plans }, { data: questions }, { data: answers }, { data: progress }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('study_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('questions').select('*').eq('user_id', user.id),
    supabase.from('answers').select('*').eq('user_id', user.id),
    supabase.from('progress').select('*').eq('user_id', user.id).order('accuracy', { ascending: true }),
  ])

  const totalAnswers = answers?.length || 0
  const correctAnswers = answers?.filter((answer: any) => answer.is_correct).length || 0
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0
  const activePlan = plans?.[0]
  const weakSubjects = progress?.slice(0, 3) || []

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
              <Card label="Planos criados" value={plans?.length || 0} detail="Cronogramas de estudo" />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 to-slate-900 p-7">
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Plano ativo</p>
                <h3 className="mt-3 text-3xl font-black">{activePlan?.title || 'Nenhum plano ativo ainda'}</h3>
                <p className="mt-3 max-w-2xl text-slate-300">
                  {activePlan ? 'Seu plano foi carregado do Supabase e será atualizado conforme você avança.' : 'Envie um PDF para gerar seu primeiro plano de estudo com IA.'}
                </p>
                <div className="mt-6 h-4 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-indigo-400" style={{ width: `${activePlan?.progress || 0}%` }} />
                </div>
                <p className="mt-3 text-sm text-slate-400">{activePlan?.progress || 0}% concluído</p>
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
                      <p className="font-bold">{doc.title}</p>
                      <p className="text-sm text-slate-400">{doc.file_url ? 'Arquivo salvo no Storage' : 'Sem arquivo vinculado'}</p>
                    </div>
                  )) : <p className="text-sm text-slate-400">Nenhum documento enviado ainda.</p>}
                </div>
              </div>
            </section>

            <section id="desempenho" className="rounded-3xl border border-white/10 bg-white/[.04] p-7">
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Desempenho</p>
              <h3 className="mt-2 text-2xl font-black">Recomendações da IA</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-900 p-5"><b>Próximo passo</b><p className="mt-2 text-sm text-slate-400">Envie um PDF e gere seu primeiro plano.</p></div>
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
