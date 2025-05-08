import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from './context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Honey Dos',
  description: 'Keep track of your work across different platforms',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
} 