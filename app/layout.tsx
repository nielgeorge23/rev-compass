import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RevCompass · Revenue Intelligence',
  description: 'A multi-agent revenue intelligence workspace for grounded recovery opportunities.',
  generator: 'RevCompass',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f7f6',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
