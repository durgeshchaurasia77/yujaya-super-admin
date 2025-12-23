'use client'

import { useSession } from 'next-auth/react'

import AutoLogout from '@/components/AutoLogout'

export default function AuthGuard({ children }) {
  const { status } = useSession()

  if (status === 'unauthenticated') {
    return <AutoLogout />
  }

  if (status === 'loading') {
    return null
  }

  return children
}
