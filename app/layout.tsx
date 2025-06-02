import type { Metadata } from 'next'
import { Inter, Crimson_Pro, Sacramento } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const crimsonPro = Crimson_Pro({ 
  subsets: ['latin'],
  variable: '--font-crimson-pro',
})

const sacramento = Sacramento({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sacramento',
})

export const metadata: Metadata = {
  title: 'LittleFidan - Mindful Parenting & Natural Child Development',
  description: 'Premium botanical-inspired educational content platform for mindful parenting and natural child development.',
  keywords: ['mindful parenting', 'natural child development', 'botanical education', 'Dutch parenting', 'educational resources'],
  authors: [{ name: 'LittleFidan' }],
  creator: 'LittleFidan',
  publisher: 'LittleFidan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'LittleFidan - Mindful Parenting & Natural Child Development',
    description: 'Premium botanical-inspired educational content platform for mindful parenting and natural child development.',
    type: 'website',
    locale: 'nl_NL',
    alternateLocale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${crimsonPro.variable} ${sacramento.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}