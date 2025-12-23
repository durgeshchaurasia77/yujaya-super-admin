import { signOut } from 'next-auth/react'

export async function apiClient(url, options = {}, token) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    }
  })

  if (res.status === 406) {
    signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })

    return Promise.reject(new Error('Session expired'))
  }

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || 'API request failed')
  }

  return result
}
