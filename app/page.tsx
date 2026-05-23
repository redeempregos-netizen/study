const stats = [
  { label: 'PDFs analisados', value: '12' },
  { label: 'Horas planejadas', value: '86h' },
  { label: 'Questões no plano', value: '1.240' },
]

const subjects = [
  { name: 'Português', progress: 72, status: 'Revisar crase e concordância' },
  { name: 'Direito Constitucional', progress: 54, status: 'Focar em direitos fundamentais' },
  { name: 'Raciocínio Lógico', progress: 38, status: 'Resolver mais questões' },
]

const plan = [
  'Ler resumo gerado pela IA do edital',
  'Responder 30 questões de Português',
  'Revisar erros do último simulado',
  'Criar flashcards dos artigos importantes',
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-blue-950 via-[#070b14] to-black">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 font-black">S</div>
            <div>
              <p className="text-lg font-bold">Study IA</p>
              <p className="text-xs text-blue-200">Seu plano de estudos automático</p>
            </div>
          </div>
          <a href="#upload" className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-950 hover:bg-blue-100">Começar agora</a>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <span className="rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">MVP online • Supabase + Vercel</span>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">Transforme qualquer PDF em um plano de aprovação.</h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">Envie edital, apostila ou caderno de questões. A Study IA organiza matérias, monta cronograma, separa questões e mostra onde você precisa melhorar.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#upload" className="rounded-2xl bg-blue-500 px-7 py-4 text-center font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400">Enviar PDF</a>
              <a href="#dashboard" className="rounded-2xl border border-white/15 px-7 py-4 text-center font-bold text-white hover:bg-white/10">Ver dashboard</a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-slate-950 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Plano gerado</p>
                  <h2 className="text-2xl font-bold">Concurso Administrativo</h2>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">Ativo</span>
              </div>
              <div className="space-y-3">
                {plan.map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-white/10 bg-white/[.03] p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">{index + 1}</span>
                    <p className="text-sm text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="dashboard" className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/[.04] p-6">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-2 text-4xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div id="upload" className="rounded-3xl border border-dashed border-blue-400/40 bg-blue-500/5 p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-300">Upload</p>
            <h2 className="mt-3 text-3xl font-black">Envie seu PDF</h2>
            <p className="mt-3 text-slate-300">Nesta primeira versão, a área visual já está pronta. Na próxima etapa conectamos o upload real ao Supabase Storage e a leitura pela IA.</p>
            <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-950 p-10 text-center hover:bg-slate-900">
              <span className="text-5xl">📄</span>
              <span className="mt-4 font-bold">Clique para escolher um PDF</span>
              <span className="mt-1 text-sm text-slate-400">Edital, apostila ou caderno de questões</span>
              <input type="file" accept="application/pdf" className="hidden" />
            </label>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[.04] p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-300">Desempenho por matéria</p>
            <div className="mt-6 space-y-5">
              {subjects.map((subject) => (
                <div key={subject.name}>
                  <div className="mb-2 flex justify-between gap-4">
                    <div>
                      <p className="font-bold">{subject.name}</p>
                      <p className="text-sm text-slate-400">{subject.status}</p>
                    </div>
                    <p className="font-bold text-blue-300">{subject.progress}%</p>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${subject.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
