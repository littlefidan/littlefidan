import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createMollieClient, PaymentMethod } from '@mollie/api-client'
import { CheckoutRequest, CheckoutItem, OrderItem } from '@/types/checkout'
import { checkoutRequestSchema, safeValidate } from '@/lib/validation'

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
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    
    // Validate request body
    const body = await request.json()
    const validation = safeValidate(checkoutRequestSchema, body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }
    
    const { items, customerData, paymentMethod } = validation.data

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: CheckoutItem) => sum + item.price * item.quantity, 0)
    const vat = subtotal * 0.21
    const total = subtotal + vat

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user?.id || null,  // Allow guest checkout
        customer_email: customerData.email,
        customer_name: customerData.fullName,
        status: 'pending',
        payment_status: 'pending',
        payment_method: paymentMethod,
        subtotal,
        tax: vat,
        total,
        items: items,
        metadata: {
          is_business: customerData.isBusinessCustomer,
          company_name: customerData.companyName,
          vat_number: customerData.vatNumber
        }
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create order items
    const orderItems: Omit<OrderItem, 'order_id'>[] = items.map((item: CheckoutItem) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity || 1,
      total: item.price * (item.quantity || 1)
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
    }

    // If Mollie is configured, create payment
    if (process.env.MOLLIE_API_KEY) {
      try {
        const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY })
        
        const payment = await mollieClient.payments.create({
          amount: {
            currency: 'EUR',
            value: total.toFixed(2)
          },
          description: `LittleFidan bestelling ${orderNumber}`,
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${order.id}`,
          webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mollie`,
          metadata: {
            order_id: order.id,
            order_number: orderNumber
          },
          method: paymentMethod === 'ideal' ? [PaymentMethod.ideal] : undefined
        })

        // Update order with payment ID
        await supabase
          .from('orders')
          .update({ payment_id: payment.id })
          .eq('id', order.id)

        return NextResponse.json({
          success: true,
          checkoutUrl: payment.getCheckoutUrl(),
          orderId: order.id
        })
      } catch (mollieError) {
        console.error('Mollie error:', mollieError)
        // If Mollie fails, still return the order for development
      }
    }

    // Development mode: simulate successful payment
    // Send order confirmation email (even in dev mode)
    const { emailService } = await import('@/lib/email/service')
    await emailService.sendOrderConfirmation({
      orderNumber: order.order_number,
      customerName: customerData.fullName,
      customerEmail: customerData.email,
      items: items.map((item: CheckoutItem) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1
      })),
      subtotal,
      tax: vat,
      total
    })
    
    return NextResponse.json({
      success: true,
      checkoutUrl: `/checkout/success?order_id=${order.id}`,
      orderId: order.id,
      developmentMode: true
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}