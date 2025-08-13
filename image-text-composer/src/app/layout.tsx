import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Image Text Composer',
  description: 'Upload a PNG and overlay customizable text layers. Built with Next.js, Konva, and Zustand.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}