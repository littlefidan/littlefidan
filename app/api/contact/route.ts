import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Alle velden zijn verplicht' },
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
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Save contact form submission to database
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        subject,
        message,
        status: 'new',
        created_at: new Date().toISOString()
      })

    if (dbError) {
      // If table doesn't exist, create it
      if (dbError.code === '42P01') {
        try {
          await supabase.rpc('exec_sql', {
            sql: `
              CREATE TABLE IF NOT EXISTS contact_submissions (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'new',
                created_at TIMESTAMPTZ DEFAULT NOW(),
                responded_at TIMESTAMPTZ
              );
            `
          })
        } catch (error) {
          // Table creation might fail if RPC doesn't exist, but continue anyway
        }
      }
    }

    // Send email notification
    const { emailService } = await import('@/lib/email/service')
    await emailService.sendContactFormNotification(name, email, message)

    // Send auto-reply to user
    const autoReplyHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7fafc;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: white; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 40px;">
            <h1 style="color: #2d3748; font-size: 28px; margin-bottom: 24px;">
              Bedankt voor je bericht!
            </h1>
            
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 24px;">
              Beste ${name},
            </p>
            
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 24px;">
              We hebben je bericht ontvangen en zullen zo snel mogelijk reageren. 
              Meestal reageren we binnen 24-48 uur op werkdagen.
            </p>
            
            <div style="background-color: #f7fafc; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
              <h3 style="color: #2d3748; font-size: 18px; margin-bottom: 16px;">Je bericht:</h3>
              <p style="color: #4a5568; font-size: 14px; margin-bottom: 8px;">
                <strong>Onderwerp:</strong> ${subject}
              </p>
              <p style="color: #4a5568; font-size: 14px; white-space: pre-wrap;">
                ${message}
              </p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 24px;">
              In de tussentijd kun je:
            </p>
            
            <ul style="color: #4a5568; font-size: 16px; margin-bottom: 24px;">
              <li style="margin-bottom: 8px;">Onze <a href="${process.env.NEXT_PUBLIC_APP_URL}/faq" style="color: #48bb78;">FAQ pagina</a> bekijken</li>
              <li style="margin-bottom: 8px;">Ons volgen op <a href="https://instagram.com/littlefidan" style="color: #48bb78;">Instagram</a></li>
              <li style="margin-bottom: 8px;">Onze <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" style="color: #48bb78;">producten</a> bekijken</li>
            </ul>
            
            <div style="border-top: 1px solid #e2e8f0; margin-top: 32px; padding-top: 24px;">
              <p style="color: #718096; font-size: 14px; text-align: center;">
                Met vriendelijke groet,<br>
                Het LittleFidan Team
              </p>
            </div>
          </div>
          
          <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 24px;">
            © ${new Date().getFullYear()} LittleFidan. Alle rechten voorbehouden.
          </p>
        </div>
      </body>
      </html>
    `

    // Send auto-reply
    await emailService.send({
      to: email,
      subject: 'We hebben je bericht ontvangen - LittleFidan',
      html: autoReplyHtml
    })

    return NextResponse.json({ 
      success: true,
      message: 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.'
    })

  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden. Probeer het later opnieuw.' },
      { status: 500 }
    )
  }
}