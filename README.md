# Study

Aplicativo de estudos com IA para transformar PDFs em planos de estudo, questões organizadas e acompanhamento de progresso.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Vercel
- OpenAI API

## Objetivo

O usuário poderá enviar um PDF, como edital, apostila ou caderno de questões, e o sistema irá:

1. Extrair o conteúdo do PDF.
2. Identificar disciplinas, assuntos e tópicos importantes.
3. Gerar um plano de estudo personalizado.
4. Organizar questões por matéria e assunto.
5. Acompanhar progresso, acertos, erros e revisões.

## Estrutura planejada

```txt
app/
  page.tsx
  dashboard/
  upload/
  plano/
  questoes/
components/
lib/
  supabase.ts
  openai.ts
  pdf.ts
types/
supabase/
  schema.sql
```

## Variáveis de ambiente

Crie um arquivo `.env.local` baseado no `.env.example`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## Deploy

O deploy será feito pela Vercel conectado ao GitHub.

No painel da Vercel, configure as mesmas variáveis de ambiente do `.env.example`.

## Banco de dados

O schema inicial ficará em `supabase/schema.sql`.

Tabelas principais planejadas:

- users_profile
- documents
- study_plans
- study_plan_items
- questions
- answers
- progress
