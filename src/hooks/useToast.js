'use client'

import { useState } from 'react'

export const useToast = () => {
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity })
  }

  const closeToast = () => {
    setToast(prev => ({ ...prev, open: false }))
  }

  return { toast, showToast, closeToast }
}
