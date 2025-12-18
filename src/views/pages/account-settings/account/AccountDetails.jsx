'use client'

import { useState, useEffect } from 'react'

import { signOut, useSession } from 'next-auth/react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Toast
import { useToast } from '@/contexts/ToastContext'
import getAvatarSrc from '../../../../app/helper.js'

// Components
import CustomTextField from '@core/components/mui/TextField'

// Initial form state
const initialData = {
  name: '',
  email: '',
  phone: ''
}

const AccountDetails = () => {
  const [formData, setFormData] = useState(initialData)

  // const [fileInput, setFileInput] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')

  const { showToast } = useToast()
  const { data: session, status } = useSession()

  if (!session?.accessToken) {
    signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // const handleFileInputChange = e => {
  //   const reader = new FileReader()
  //   const { files } = e.target

  //   if (files?.length) {
  //     reader.onload = () => setImgSrc(reader.result)
  //     reader.readAsDataURL(files[0])
  //     setFileInput(files[0])
  //   }
  // }

  const handleFileInputChange = e => {
    const file = e.target.files?.[0]

    if (!file) return

    if (file.size > 800 * 1024) {
      showToast('Image must be under 800KB', 'error')

      return
    }

    setSelectedFile(file)
    const reader = new FileReader()

    reader.onload = () => setImgSrc(reader.result)
    reader.readAsDataURL(file)
  }

  const uploadProfileImage = async () => {
    if (!selectedFile) return

    const formData = new FormData()

    formData.append('avatar', selectedFile)

    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/profile/avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      },
      body: formData
    })

    if (!session?.accessToken) {
      signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
    }

    if (res.status === 406) {
      signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
    }

    if (!res.ok) throw new Error('Image upload failed')

    const data = await res.json()

    setImgSrc(data.avatarUrl)
    setSelectedFile(null)

    showToast('Profile photo updated', 'success')
  }

  useEffect(() => {
    if (status !== 'authenticated' || !session?.accessToken) return

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        })

        if (!res.ok) throw new Error('Failed to load profile')

        const data = await res.json()

        console.log('PROFILE >>>>', data)

        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || ''
        })

        if (data.avatarUrl) {
          setImgSrc(data.avatarUrl)
        }
      } catch (error) {
        showToast(error.message || 'Failed to load profile', 'error')
      }
    }

    fetchProfile()
  }, [status, session])

  // 🔥 UPDATE PROFILE
  const handleSubmit = async e => {
    e.preventDefault()

    try {
      if (selectedFile) {
        await uploadProfileImage()
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/profileUpdate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to update profile')

      showToast('Account updated successfully', 'success')
    } catch (error) {
      showToast(error.message || 'Something went wrong', 'error')
    }
  }

  const handleFileInputReset = () => {
    setFileInput('')
    setImgSrc('/images/avatars/1.png')
  }

  return (
    <Card>
      <CardContent className='mbe-4'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <img height={100} width={100} className='rounded' src={getAvatarSrc(imgSrc)} alt='Profile' />

          <div className='flex flex-col gap-4'>
            <Button component='label' variant='contained'>
              Upload New Photo
              <input hidden type='file' accept='image/png, image/jpeg' onChange={handleFileInputChange} />
            </Button>

            <Button variant='tonal' color='secondary' onClick={handleFileInputReset}>
              Reset
            </Button>
            <Typography>Allowed JPG or PNG. Max size 800KB</Typography>
          </div>
        </div>
      </CardContent>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Name'
                value={formData.name}
                onChange={e => handleFormChange('name', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Email'
                value={formData.email}
                onChange={e => handleFormChange('email', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Phone Number'
                value={formData.phone}
                onChange={e => handleFormChange('phone', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12 }} className='flex gap-4'>
              <Button type='submit' variant='contained'>
                Save Changes
              </Button>
              <Button variant='tonal' color='secondary' onClick={() => setFormData(initialData)}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
