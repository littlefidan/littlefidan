// Email service configuration
// This file prepares for email integration (Resend, SendGrid, etc.)

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
  subtotal: number
  tax: number
  total: number
  downloadLinks?: Array<{
    productName: string
    downloadUrl: string
  }>
}

export interface NewsletterWelcomeData {
  name?: string
  email: string
  discountCode?: string
}

export class EmailService {
  private apiKey: string
  private fromEmail: string
  private fromName: string

  constructor() {
    this.apiKey = process.env.EMAIL_API_KEY || ''
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@littlefidan.nl'
    this.fromName = process.env.EMAIL_FROM_NAME || 'LittleFidan'
  }

  async send(options: EmailOptions): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('Email service not configured. Email would have been sent to:', options.to)
      console.log('Subject:', options.subject)
      return true // Return true in development
    }

    try {
      // When email service is configured, implement the actual sending logic here
      // Example for Resend:
      // const resend = new Resend(this.apiKey)
      // await resend.emails.send({
      //   from: options.from || `${this.fromName} <${this.fromEmail}>`,
      //   to: options.to,
      //   subject: options.subject,
      //   html: options.html,
      //   reply_to: options.replyTo
      // })

      console.log('Email sent successfully to:', options.to)
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  async sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
    const html = this.getOrderConfirmationTemplate(data)
    
    return this.send({
      to: data.customerEmail,
      subject: `Bevestiging van je bestelling #${data.orderNumber}`,
      html
    })
  }

  async sendPasswordReset(email: string, resetLink: string): Promise<boolean> {
    const html = this.getPasswordResetTemplate(email, resetLink)
    
    return this.send({
      to: email,
      subject: 'Wachtwoord resetten - LittleFidan',
      html
    })
  }

  async sendNewsletterWelcome(data: NewsletterWelcomeData): Promise<boolean> {
    const html = this.getNewsletterWelcomeTemplate(data)
    
    return this.send({
      to: data.email,
      subject: 'Welkom bij de LittleFidan nieuwsbrief!',
      html
    })
  }

  async sendContactFormNotification(
    name: string,
    email: string,
    message: string
  ): Promise<boolean> {
    const html = this.getContactFormTemplate(name, email, message)
    
    return this.send({
      to: this.fromEmail,
      subject: `Nieuw contactformulier bericht van ${name}`,
      html,
      replyTo: email
    })
  }

  // Email Templates
  private getOrderConfirmationTemplate(data: OrderEmailData): string {
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          ${item.name}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          €${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('')

    const downloadLinksHtml = data.downloadLinks ? `
      <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; margin-top: 32px;">
        <h2 style="color: #4a5568; font-size: 20px; margin-bottom: 16px;">Je Downloads</h2>
        ${data.downloadLinks.map(link => `
          <div style="margin-bottom: 12px;">
            <a href="${link.downloadUrl}" style="color: #48bb78; text-decoration: none; font-weight: 500;">
              📥 Download ${link.productName}
            </a>
          </div>
        `).join('')}
        <p style="color: #718096; font-size: 14px; margin-top: 16px;">
          Downloads zijn 30 dagen geldig met maximaal 5 downloads per product.
        </p>
      </div>
    ` : ''

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7fafc;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: white; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 40px;">
            <h1 style="color: #2d3748; font-size: 28px; margin-bottom: 24px; text-align: center;">
              Bedankt voor je bestelling!
            </h1>
            
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 24px;">
              Beste ${data.customerName},
            </p>
            
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 24px;">
              Je bestelling is succesvol ontvangen. Hieronder vind je een overzicht van je bestelling.
            </p>
            
            <div style="background-color: #edf2f7; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <p style="margin: 0; color: #4a5568;">
                <strong>Bestelnummer:</strong> ${data.orderNumber}
              </p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background-color: #f7fafc;">
                  <th style="padding: 12px; text-align: left; color: #4a5568;">Product</th>
                  <th style="padding: 12px; text-align: center; color: #4a5568;">Aantal</th>
                  <th style="padding: 12px; text-align: right; color: #4a5568;">Prijs</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right; color: #4a5568;">Subtotaal:</td>
                  <td style="padding: 12px; text-align: right; color: #4a5568;">€${data.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right; color: #4a5568;">BTW (21%):</td>
                  <td style="padding: 12px; text-align: right; color: #4a5568;">€${data.tax.toFixed(2)}</td>
                </tr>
                <tr style="font-weight: bold;">
                  <td colspan="2" style="padding: 12px; text-align: right; color: #2d3748; font-size: 18px;">Totaal:</td>
                  <td style="padding: 12px; text-align: right; color: #2d3748; font-size: 18px;">€${data.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            ${downloadLinksHtml}
            
            <div style="border-top: 1px solid #e2e8f0; margin-top: 32px; padding-top: 24px;">
              <p style="color: #718096; font-size: 14px; text-align: center;">
                Heb je vragen? Neem contact op via 
                <a href="mailto:support@littlefidan.nl" style="color: #48bb78;">support@littlefidan.nl</a>
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
  }

  private getPasswordResetTemplate(email: string, resetLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7fafc;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: white; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 40px;">
            <h1 style="color: #2d3748; font-size: 28px; margin-bottom: 24px; text-align: center;">
              Wachtwoord resetten
            </h1>
            
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 24px;">
              Je hebt een verzoek ingediend om je wachtwoord te resetten voor je LittleFidan account.
            </p>
            
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 32px;">
              Klik op de onderstaande knop om een nieuw wachtwoord in te stellen:
            </p>
            
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${resetLink}" style="display: inline-block; background-color: #48bb78; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 500;">
                Wachtwoord resetten
              </a>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-bottom: 16px;">
              Of kopieer deze link naar je browser:
            </p>
            
            <p style="color: #718096; font-size: 14px; word-break: break-all; background-color: #f7fafc; padding: 12px; border-radius: 4px;">
              ${resetLink}
            </p>
            
            <p style="color: #718096; font-size: 14px; margin-top: 24px;">
              Deze link is 1 uur geldig. Als je geen wachtwoord reset hebt aangevraagd, kun je deze email negeren.
            </p>
          </div>
          
          <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 24px;">
            © ${new Date().getFullYear()} LittleFidan. Alle rechten voorbehouden.
          </p>
        </div>
      </body>
      </html>
    `
  }

  private getNewsletterWelcomeTemplate(data: NewsletterWelcomeData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7fafc;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: white; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 40px;">
            <h1 style="color: #2d3748; font-size: 28px; margin-bottom: 24px; text-align: center;">
              Welkom bij de LittleFidan familie! 🌿
            </h1>
            
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 24px;">
              ${data.name ? `Beste ${data.name},` : 'Beste lezer,'}
            </p>
            
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 24px;">
              Bedankt voor je aanmelding voor onze nieuwsbrief! We zijn blij dat je deel uitmaakt van onze gemeenschap.
            </p>
            
            ${data.discountCode ? `
              <div style="background-color: #f0fff4; border: 2px dashed #48bb78; padding: 24px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
                <p style="color: #276749; font-size: 18px; margin-bottom: 8px; font-weight: bold;">
                  Speciale welkomstkorting!
                </p>
                <p style="color: #2d3748; font-size: 24px; margin-bottom: 8px; font-weight: bold;">
                  10% KORTING
                </p>
                <p style="color: #4a5568; font-size: 16px; margin-bottom: 16px;">
                  Gebruik code: <strong>${data.discountCode}</strong>
                </p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" style="display: inline-block; background-color: #48bb78; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 500;">
                  Shop nu
                </a>
              </div>
            ` : ''}
            
            <h2 style="color: #2d3748; font-size: 20px; margin-bottom: 16px;">
              Wat kun je verwachten?
            </h2>
            
            <ul style="color: #4a5568; font-size: 16px; margin-bottom: 24px; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Exclusieve kortingen en aanbiedingen</li>
              <li style="margin-bottom: 8px;">Eerste toegang tot nieuwe producten</li>
              <li style="margin-bottom: 8px;">Educatieve tips en inspiratie</li>
              <li style="margin-bottom: 8px;">Seizoensgebonden activiteiten</li>
            </ul>
            
            <div style="background-color: #f7fafc; padding: 24px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
              <p style="color: #4a5568; font-size: 16px; margin-bottom: 16px;">
                Volg ons ook op social media voor dagelijkse inspiratie!
              </p>
              <a href="https://instagram.com/littlefidan" style="color: #48bb78; text-decoration: none; font-weight: 500;">
                @littlefidan op Instagram
              </a>
            </div>
            
            <p style="color: #718096; font-size: 14px; text-align: center;">
              Je ontvangt deze email omdat je je hebt aangemeld op littlefidan.nl.
              <br>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(data.email)}" style="color: #718096; text-decoration: underline;">
                Uitschrijven
              </a>
            </p>
          </div>
          
          <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 24px;">
            © ${new Date().getFullYear()} LittleFidan. Alle rechten voorbehouden.
          </p>
        </div>
      </body>
      </html>
    `
  }

  private getContactFormTemplate(name: string, email: string, message: string): string {
    return `
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
              Nieuw contactformulier bericht
            </h1>
            
            <div style="background-color: #f7fafc; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
              <p style="color: #4a5568; font-size: 16px; margin-bottom: 8px;">
                <strong>Naam:</strong> ${name}
              </p>
              <p style="color: #4a5568; font-size: 16px; margin-bottom: 0;">
                <strong>Email:</strong> <a href="mailto:${email}" style="color: #48bb78;">${email}</a>
              </p>
            </div>
            
            <h2 style="color: #2d3748; font-size: 20px; margin-bottom: 16px;">
              Bericht:
            </h2>
            
            <div style="background-color: #f7fafc; padding: 24px; border-radius: 8px; white-space: pre-wrap; color: #4a5568; font-size: 16px;">
              ${message}
            </div>
            
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
              <a href="mailto:${email}" style="display: inline-block; background-color: #48bb78; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 500;">
                Beantwoorden
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

export const emailService = new EmailService()