import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    // Get email from request
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is verplicht' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ongeldig email adres' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .single()

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Reactivate subscription
        const { error } = await supabase
          .from('subscribers')
          .update({ 
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('email', email)

        if (error) throw error

        return NextResponse.json({ 
          message: 'Je bent weer aangemeld voor de nieuwsbrief!',
          reactivated: true 
        })
      }

      return NextResponse.json({ 
        message: 'Je bent al aangemeld voor de nieuwsbrief',
        already_subscribed: true 
      })
    }

    // Subscribe new email
    const { error } = await supabase
      .from('subscribers')
      .insert([{
        email,
        name,
        status: 'active',
        metadata: {
          source: 'website',
          signup_date: new Date().toISOString()
        }
      }])

    if (error) {
      throw error
    }

    // Send welcome email
    const { emailService } = await import('@/lib/email/service')
    await emailService.sendNewsletterWelcome({
      email,
      name,
      discountCode: 'WELCOME10'
    })

    return NextResponse.json({ 
      message: 'Bedankt voor je aanmelding! Check je email voor een welkomstkorting.',
      success: true 
    })
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden. Probeer het later opnieuw.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is verplicht' },
        { status: 400 }
      )
    }

    // Unsubscribe
    const { error } = await supabase
      .from('subscribers')
      .update({ 
        status: 'unsubscribed',
        updated_at: new Date().toISOString()
      })
      .eq('email', email)

    if (error) throw error

    return NextResponse.json({ 
      message: 'Je bent uitgeschreven van de nieuwsbrief',
      success: true 
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}