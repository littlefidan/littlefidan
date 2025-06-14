import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-sage-400 text-white hover:bg-sage-500 hover:shadow-botanical',
        secondary: 'bg-accent-terracotta text-white hover:bg-accent-terracotta/90 hover:shadow-botanical',
        outline: 'border-2 border-sage-200 bg-transparent hover:bg-sage-50 hover:border-sage-300',
        ghost: 'hover:bg-sage-50 hover:text-sage-600',
        link: 'text-sage-500 underline-offset-4 hover:underline hover:text-sage-600',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-9 rounded-xl px-4',
        lg: 'h-11 rounded-3xl px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }