import './globals.css'

export const metadata = {
  title: 'Study IA',
  description: 'Plataforma de estudos com IA'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
