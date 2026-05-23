const metrics = [
  { label: 'PDFs enviados', value: '3', detail: '2 processados pela IA' },
  { label: 'Questões respondidas', value: '428', detail: '+64 nesta semana' },
  { label: 'Taxa de acerto', value: '74%', detail: 'meta: 82%' },
  { label: 'Progresso geral', value: '61%', detail: '18 dias de plano' },
]

const documents = [
  { name: 'Edital Prefeitura 2026.pdf', type: 'Edital', status: 'Concluído' },
  { name: 'Apostila Português.pdf', type: 'Apostila', status: 'Processando' },
  { name: 'Caderno Constitucional.pdf', type: 'Questões', status: 'Enviado' },
]

const schedule = [
  { day: 'Segunda', subject: 'Português', task: '30 questões + revisão de crase', time: '1h30', priority: 'Alta', status: 'Em andamento' },
  { day: 'Terça', subject: 'Constitucional', task: 'Direitos fundamentais + 20 questões', time: '2h', priority: 'Alta', status: 'Pendente' },
  { day: 'Quarta', subject: 'RLM', task: 'Proposições e tabelas verdade', time: '1h', priority: 'Média', status: 'Pendente' },
  { day: 'Quinta', subject: 'Administrativo', task: 'Atos administrativos + revisão', time: '1h40', priority: 'Média', status: 'Pendente' },
]

const weakSubjects = [
  { name: 'Raciocínio Lógico', score: 38 },
  { name: 'Direito Administrativo', score: 49 },
  { name: 'Informática', score: 52 },
]

const questions = [
  {
    subject: 'Português',
    text: 'Assinale a alternativa em que o uso da crase está correto.',
    options: ['Vou a escola cedo.', 'Entreguei o documento à diretora.', 'Cheguei à pé.', 'Referiu-se a ela.', 'Voltou a casa dos pais.'],
    answer: 'B',
    explanation: 'Ocorre crase antes de palavra feminina determinada: à diretora.',
  },
  {
    subject: 'Constitucional',
    text: 'Os direitos e garantias fundamentais estão previstos principalmente em qual artigo da Constituição Federal?',
    options: ['Art. 1º', 'Art. 3º', 'Art. 5º', 'Art. 37', 'Art. 144'],
    answer: 'C',
    explanation: 'O art. 5º concentra os direitos e garantias fundamentais individuais e coletivos.',
  },
]

export default function Home() {
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
            {['Dashboard', 'Upload de PDF', 'Plano de estudos', 'Questões', 'Desempenho'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} className="block rounded-2xl px-4 py-3 hover:bg-white/10">{item}</a>
            ))}
          </nav>
          <div className="mt-10 rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-5">
            <p className="text-sm font-bold text-indigo-200">IA pronta para conectar</p>
            <p className="mt-2 text-xs text-slate-400">Supabase, Storage e geração automática de plano serão conectados nas próximas etapas.</p>
          </div>
        </aside>

        <section className="flex-1">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-400">Olá, Marcelo 👋</p>
                <h2 className="text-2xl font-black">Seu painel de estudos</h2>
              </div>
              <a href="#upload-de-pdf" className="rounded-2xl bg-indigo-500 px-5 py-3 text-center text-sm font-bold hover:bg-indigo-400">Enviar novo PDF</a>
            </div>
          </header>

          <div className="space-y-8 p-5 lg:p-8">
            <section id="dashboard" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/[.04] p-6">
                  <p className="text-sm text-slate-400">{metric.label}</p>
                  <p className="mt-2 text-4xl font-black">{metric.value}</p>
                  <p className="mt-2 text-sm text-indigo-200">{metric.detail}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 to-slate-900 p-7">
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Plano ativo</p>
                <h3 className="mt-3 text-3xl font-black">Concurso Administrativo Municipal</h3>
                <p className="mt-3 max-w-2xl text-slate-300">Plano de 30 dias gerado a partir do edital, priorizando matérias com maior incidência e menor desempenho.</p>
                <div className="mt-6 h-4 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[61%] rounded-full bg-indigo-400" />
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-200">61% concluído</span>
                  <span className="rounded-full bg-amber-500/15 px-4 py-2 text-amber-200">3 revisões pendentes</span>
                  <span className="rounded-full bg-red-500/15 px-4 py-2 text-red-200">RLM é prioridade</span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[.04] p-7">
                <h3 className="text-xl font-black">Matérias fracas</h3>
                <div className="mt-5 space-y-4">
                  {weakSubjects.map((item) => (
                    <div key={item.name}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-bold text-red-300">{item.score}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10">
                        <div className="h-3 rounded-full bg-red-400" style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="upload-de-pdf" className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
              <div className="rounded-3xl border border-dashed border-indigo-400/40 bg-indigo-500/5 p-7">
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Upload de PDF</p>
                <h3 className="mt-3 text-2xl font-black">Envie edital, apostila ou caderno</h3>
                <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900 p-10 text-center hover:bg-slate-800">
                  <span className="text-5xl">📄</span>
                  <span className="mt-4 font-bold">Escolher PDF</span>
                  <span className="mt-1 text-sm text-slate-400">Até 50MB • PDF</span>
                  <input type="file" accept="application/pdf" className="hidden" />
                </label>
                <button className="mt-5 w-full rounded-2xl bg-indigo-500 px-5 py-4 font-bold hover:bg-indigo-400">Gerar plano de estudos</button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[.04] p-7">
                <h3 className="text-xl font-black">Documentos enviados</h3>
                <div className="mt-5 space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.name} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-900 p-4">
                      <div>
                        <p className="font-bold">{doc.name}</p>
                        <p className="text-sm text-slate-400">{doc.type}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{doc.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="plano-de-estudos" className="rounded-3xl border border-white/10 bg-white/[.04] p-7">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Plano de estudos</p>
                  <h3 className="mt-2 text-2xl font-black">Cronograma semanal</h3>
                </div>
                <p className="text-sm text-slate-400">Organizado por prioridade, tempo e desempenho.</p>
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                {schedule.map((item) => (
                  <div key={item.day} className="grid gap-3 border-b border-white/10 bg-slate-900 p-4 last:border-b-0 md:grid-cols-[110px_160px_1fr_90px_110px_130px] md:items-center">
                    <p className="font-bold">{item.day}</p>
                    <p className="text-indigo-200">{item.subject}</p>
                    <p className="text-slate-300">{item.task}</p>
                    <p>{item.time}</p>
                    <p className="text-amber-200">{item.priority}</p>
                    <p className="rounded-full bg-white/10 px-3 py-1 text-center text-xs font-bold">{item.status}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="questões" className="rounded-3xl border border-white/10 bg-white/[.04] p-7">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Questões</p>
                  <h3 className="mt-2 text-2xl font-black">Treino por disciplina</h3>
                </div>
                <select className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm">
                  <option>Todas as disciplinas</option>
                  <option>Português</option>
                  <option>Constitucional</option>
                </select>
              </div>
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {questions.map((question, index) => (
                  <article key={question.text} className="rounded-3xl border border-white/10 bg-slate-900 p-5">
                    <p className="text-sm font-bold text-indigo-200">{question.subject} • Questão {index + 1}</p>
                    <h4 className="mt-3 font-bold text-slate-100">{question.text}</h4>
                    <div className="mt-4 space-y-2">
                      {question.options.map((option, i) => (
                        <div key={option} className="rounded-2xl border border-white/10 bg-white/[.03] p-3 text-sm">
                          {String.fromCharCode(65 + i)}) {option}
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-bold hover:bg-indigo-400">Responder</button>
                    <div className="mt-4 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-100">
                      <b>Gabarito: {question.answer}</b> — {question.explanation}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="desempenho" className="rounded-3xl border border-white/10 bg-white/[.04] p-7">
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Desempenho</p>
              <h3 className="mt-2 text-2xl font-black">Recomendações da IA</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-900 p-5"><b>Revisar hoje</b><p className="mt-2 text-sm text-slate-400">Crase, atos administrativos e proposições lógicas.</p></div>
                <div className="rounded-2xl bg-slate-900 p-5"><b>Erro recorrente</b><p className="mt-2 text-sm text-slate-400">Questões de exceção e alternativa incorreta.</p></div>
                <div className="rounded-2xl bg-slate-900 p-5"><b>Próxima meta</b><p className="mt-2 text-sm text-slate-400">Chegar a 80% em Português até sexta-feira.</p></div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}
