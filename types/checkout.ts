export interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface CustomerData {
  email: string
  fullName: string
  isBusinessCustomer?: boolean
  companyName?: string
  vatNumber?: string
}

export interface CheckoutRequest {
  items: CheckoutItem[]
  customerData: CustomerData
  paymentMethod: 'ideal' | 'card' | 'banktransfer'
}

export interface OrderItem {
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  total: number
}