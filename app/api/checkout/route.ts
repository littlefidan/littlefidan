import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createMollieClient } from '@mollie/api-client'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    
    const body = await request.json()
    const { items, customerData, paymentMethod } = body

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
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
    const orderItems = items.map((item: any) => ({
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
          method: paymentMethod === 'ideal' ? 'ideal' as any : undefined
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
      items: items.map((item: any) => ({
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