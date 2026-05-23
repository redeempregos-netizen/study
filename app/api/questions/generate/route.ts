import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const mockQuestions = {
  'Português': [
    {
      question: 'Assinale a alternativa em que há erro de concordância verbal.',
      option_a: 'Faltam documentos no processo.',
      option_b: 'Existem muitas dúvidas sobre o tema.',
      option_c: 'Houveram problemas na execução.',
      option_d: 'Precisam-se de servidores públicos.',
      option_e: 'Faz dois anos que estudo.',
      correct_answer: 'C',
      explanation: 'O verbo haver no sentido de existir é impessoal.',
    },
  ],
  'Direito Constitucional': [
    {
      question: 'A Constituição Federal de 1988 estabelece que os direitos fundamentais:',
      option_a: 'Podem ser abolidos por decreto.',
      option_b: 'São ilimitados.',
      option_c: 'Possuem aplicação imediata.',
      option_d: 'Dependem de autorização judicial.',
      option_e: 'Não possuem eficácia jurídica.',
      correct_answer: 'C',
      explanation: 'Os direitos fundamentais têm aplicação imediata conforme art. 5º.',
    },
  ],
  'Raciocínio Lógico': [
    {
      question: 'Se todo servidor é concursado e João é servidor, então:',
      option_a: 'João não é concursado.',
      option_b: 'João é concursado.',
      option_c: 'Nenhum servidor é concursado.',
      option_d: 'João é terceirizado.',
      option_e: 'Não é possível concluir.',
      correct_answer: 'B',
      explanation: 'A conclusão lógica válida é que João é concursado.',
    },
  ],
  'Direito Administrativo': [
    {
      question: 'O ato administrativo vinculado:',
      option_a: 'Permite liberdade total ao agente.',
      option_b: 'Não depende da lei.',
      option_c: 'Segue critérios definidos em lei.',
      option_d: 'É sempre sigiloso.',
      option_e: 'Não possui finalidade pública.',
      correct_answer: 'C',
      explanation: 'Atos vinculados seguem estritamente a previsão legal.',
    },
  ],
}

export async function POST(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const formData = await request.formData()
  const planId = formData.get('plan_id') as string | null

  if (!planId) {
    return NextResponse.redirect(new URL('/?error=plan', request.url))
  }

  const { data: items } = await supabase
    .from('study_plan_items')
    .select('*')
    .eq('plan_id', planId)

  if (!items?.length) {
    return NextResponse.redirect(new URL('/?error=items', request.url))
  }

  const questionsToInsert: any[] = []

  items.forEach((item: any) => {
    const subjectQuestions = mockQuestions[item.subject as keyof typeof mockQuestions]

    if (subjectQuestions) {
      subjectQuestions.forEach((question) => {
        questionsToInsert.push({
          user_id: user.id,
          subject: item.subject,
          question: question.question,
          option_a: question.option_a,
          option_b: question.option_b,
          option_c: question.option_c,
          option_d: question.option_d,
          option_e: question.option_e,
          correct_answer: question.correct_answer,
          explanation: question.explanation,
        })
      })
    }
  })

  if (questionsToInsert.length) {
    await supabase.from('questions').insert(questionsToInsert)
  }

  return NextResponse.redirect(new URL('/', request.url))
}
