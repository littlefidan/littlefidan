import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Check auth
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    // Check admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Geen admin rechten' }, { status: 403 })
    }

    // Get request data
    const { prompt, size = '1024x1024', quality = 'standard', n = 1 } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is verplicht' }, { status: 400 })
    }

    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key niet geconfigureerd' }, { status: 500 })
    }

    // Call DALL-E 3 API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        size,
        quality,
        n,
        response_format: 'url'
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      return NextResponse.json({ 
        error: error.error?.message || 'Fout bij genereren van afbeelding' 
      }, { status: response.status })
    }

    const data = await response.json()
    
    // Return the first image
    const image = data.data[0]
    
    return NextResponse.json({
      url: image.url,
      revised_prompt: image.revised_prompt
    })

  } catch (error) {
    console.error('AI generate error:', error)
    return NextResponse.json({ 
      error: 'Er is een fout opgetreden bij het genereren' 
    }, { status: 500 })
  }
}