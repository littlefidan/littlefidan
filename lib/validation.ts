import { z } from 'zod'

// Email validation
export const emailSchema = z.string().email('Invalid email address')

// Checkout validation schemas
export const checkoutItemSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  image: z.string().url().optional()
})

export const customerDataSchema = z.object({
  email: emailSchema,
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  isBusinessCustomer: z.boolean().optional(),
  companyName: z.string().optional(),
  vatNumber: z.string().optional()
})

export const checkoutRequestSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, 'At least one item is required'),
  customerData: customerDataSchema,
  paymentMethod: z.enum(['ideal', 'card', 'banktransfer'])
})

// Order validation schemas
export const paginationSchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(
    z.number().int().min(1).max(100).default(20)
  ),
  offset: z.string().regex(/^\d+$/).transform(Number).pipe(
    z.number().int().min(0).default(0)
  )
})

// Product validation schemas
export const productCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  category: z.string().optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
  active: z.boolean().default(true)
})

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

// Newsletter validation
export const newsletterSchema = z.object({
  email: emailSchema
})

// Helper function to validate and sanitize input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

// Helper function to safely validate with error handling
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: true; data: T 
} | { 
  success: false; error: string 
} {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Invalid input' }
  }
}