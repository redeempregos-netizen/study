type ExtractedPage = {
  page: number
  text: string
}

type ExtractedQuestion = {
  source_id: string | null
  source_number: number
  source_page: number
  subject: string
  topic: string | null
  exam: string | null
  question: string
  option_a: string | null
  option_b: string | null
  option_c: string | null
  option_d: string | null
  option_e: string | null
  correct_answer: string | null
  explanation: string | null
}

function cleanText(value: string) {
  return value
    .replace(/Caderno de Questões Comentadas[^\n]*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getBetween(text: string, start: string, end?: string) {
  const startIndex = text.indexOf(start)
  if (startIndex === -1) return null

  const contentStart = startIndex + start.length
  const endIndex = end ? text.indexOf(end, contentStart) : -1

  return text.slice(contentStart, endIndex === -1 ? undefined : endIndex).trim()
}

function extractOption(text: string, letter: string, nextLetter?: string) {
  const start = `(${letter})`
  const end = nextLetter ? `(${nextLetter})` : '\nCaderno de Questões'
  const value = getBetween(text, start, end)
  return value ? cleanText(value) : null
}

async function extractPagesFromPdf(buffer: ArrayBuffer): Promise<ExtractedPage[]> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
  })

  const pdf = await loadingTask.promise
  const pages: ExtractedPage[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    const text = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join('\n')

    pages.push({ page: pageNumber, text })
  }

  return pages
}

function parseQuestionPage(questionPage: ExtractedPage, answerPage?: ExtractedPage): ExtractedQuestion | null {
  const text = questionPage.text
  const answerText = answerPage?.text || ''

  if (!text.includes('ID:') || !text.includes('Alternativas')) return null

  const idMatch = text.match(/ID:\s*(\d+)/)
  const topicMatch = text.match(/TÓPICO:\s*(.*?)\s*\|\s*PROVA:/s)
  const examMatch = text.match(/PROVA:\s*(.*?)(?:\nAlternativas|Alternativas)/s)
  const numberMatch = text.match(/(?:\n|^)\s*(\d{1,4})\s*\n/)

  const questionNumber = numberMatch ? Number(numberMatch[1]) : questionPage.page

  let question = ''
  if (numberMatch?.index !== undefined) {
    question = text.slice(numberMatch.index + numberMatch[0].length)
  } else {
    question = text.split('Alternativas').pop() || ''
  }

  question = cleanText(question)

  const correctAnswerMatch = answerText.match(/Resposta:\s*([A-E])/i)
  const commentMatch = answerText.match(/Comentário\s*([\s\S]*)/i)

  return {
    source_id: idMatch?.[1] || null,
    source_number: questionNumber,
    source_page: questionPage.page,
    subject: 'Artes Visuais',
    topic: topicMatch ? cleanText(topicMatch[1]) : null,
    exam: examMatch ? cleanText(examMatch[1]) : null,
    question,
    option_a: extractOption(text, 'A', 'B'),
    option_b: extractOption(text, 'B', 'C'),
    option_c: extractOption(text, 'C', 'D'),
    option_d: extractOption(text, 'D', 'E'),
    option_e: extractOption(text, 'E'),
    correct_answer: correctAnswerMatch?.[1]?.toUpperCase() || null,
    explanation: commentMatch ? cleanText(commentMatch[1]) : null,
  }
}

export async function extractQuestionsFromPdf(buffer: ArrayBuffer) {
  const pages = await extractPagesFromPdf(buffer)
  const questions: ExtractedQuestion[] = []

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]

    if (!page.text.includes('ID:') || !page.text.includes('Alternativas')) continue

    const nextPage = pages[i + 1]
    const parsed = parseQuestionPage(page, nextPage)

    if (parsed?.question) {
      questions.push(parsed)
    }
  }

  return questions
}
