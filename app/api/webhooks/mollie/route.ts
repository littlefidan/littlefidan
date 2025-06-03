import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createMollieClient } from '@mollie/api-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id || !process.env.MOLLIE_API_KEY) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY })
    const payment = await mollieClient.payments.get(id)

    const supabase = createServerComponentClient({ cookies })

    // Get order from payment metadata
    const orderId = (payment.metadata as any)?.order_id
    if (!orderId) {
      console.error('No order ID in payment metadata')
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update order based on payment status
    let orderStatus = 'pending'
    let paymentStatus = 'pending'

    switch (payment.status) {
      case 'paid':
        orderStatus = 'processing'
        paymentStatus = 'paid'
        break
      case 'canceled':
        orderStatus = 'cancelled'
        paymentStatus = 'failed'
        break
      case 'expired':
        orderStatus = 'cancelled'
        paymentStatus = 'failed'
        break
      case 'failed':
        orderStatus = 'cancelled'
        paymentStatus = 'failed'
        break
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order:', updateError)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    // If payment is successful, send confirmation email (when email service is ready)
    if (payment.status === 'paid') {
      // TODO: Send order confirmation email
      // Payment successful for order: orderId
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}