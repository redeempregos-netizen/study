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
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.redirect(new URL('/?error=nofile', request.url))
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('study-pdfs')
    .upload(fileName, file, {
      contentType: 'application/pdf',
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.redirect(new URL('/?error=upload', request.url))
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('study-pdfs').getPublicUrl(fileName)

  await supabase.from('documents').insert({
    user_id: user.id,
    title: file.name,
    document_type: 'pdf',
    file_url: publicUrl,
    status: 'enviado',
  })

  return NextResponse.redirect(new URL('/', request.url))
}
