import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Simple in-memory rate limiting (replace with Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // 10 requests
const RATE_WINDOW = 60 * 60 * 1000 // per hour

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

    // Simple rate limiting
    const now = Date.now()
    const userRateData = requestCounts.get(user.id) || { count: 0, resetTime: now + RATE_WINDOW }
    
    if (now > userRateData.resetTime) {
      userRateData.count = 0
      userRateData.resetTime = now + RATE_WINDOW
    }
    
    if (userRateData.count >= RATE_LIMIT) {
      const minutesLeft = Math.ceil((userRateData.resetTime - now) / 60000)
      return NextResponse.json({ 
        error: `Rate limit bereikt. Probeer het over ${minutesLeft} minuten opnieuw.` 
      }, { status: 429 })
    }
    
    userRateData.count++
    requestCounts.set(user.id, userRateData)

    // Get request data
    const { prompt, size = '1792x1024', quality = 'hd', n = 1 } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is verplicht' }, { status: 400 })
    }

    // Validate prompt length
    if (prompt.length > 4000) {
      return NextResponse.json({ error: 'Prompt is te lang (max 4000 karakters)' }, { status: 400 })
    }

    // Check OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || !apiKey.startsWith('sk-')) {
      console.error('Invalid OpenAI API key format')
      return NextResponse.json({ error: 'OpenAI API configuratie onjuist' }, { status: 500 })
    }

    // Call DALL-E 3 API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
      
      // Provide user-friendly error messages
      let errorMessage = 'Fout bij genereren van afbeelding'
      if (error.error?.code === 'rate_limit_exceeded') {
        errorMessage = 'Te veel verzoeken. Probeer het over een minuut opnieuw.'
      } else if (error.error?.code === 'invalid_api_key') {
        errorMessage = 'Ongeldige API key configuratie'
      } else if (error.error?.message) {
        errorMessage = error.error.message
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status })
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