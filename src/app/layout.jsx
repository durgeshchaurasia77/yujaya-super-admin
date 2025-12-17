'use client'

import { ToastProvider } from '@/contexts/ToastContext'

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
