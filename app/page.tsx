export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold mb-6">
          Study IA
        </h1>

        <p className="text-xl text-zinc-300 mb-8">
          Transforme PDFs em planos de estudo inteligentes com IA.
        </p>

        <div className="grid md:grid-cols-3 gap-4 text-left">
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <h2 className="font-semibold mb-2">Upload de PDF</h2>
            <p className="text-zinc-400 text-sm">
              Envie editais, apostilas e cadernos de questões.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <h2 className="font-semibold mb-2">Plano Automático</h2>
            <p className="text-zinc-400 text-sm">
              A IA cria um cronograma inteligente baseado no conteúdo.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <h2 className="font-semibold mb-2">Questões Organizadas</h2>
            <p className="text-zinc-400 text-sm">
              Resolva questões separadas por matéria e assunto.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
