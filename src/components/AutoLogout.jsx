'use client'

import { useEffect } from 'react'

import { signOut } from 'next-auth/react'

export default function AutoLogout() {
  useEffect(() => {
    signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
  }, [])

  return null
}
