'use client'

import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

export default function Toast({ toast, onClose }) {
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={toast.severity} sx={{ width: '100%' }}>
        {toast.message}
      </Alert>
    </Snackbar>
  )
}
