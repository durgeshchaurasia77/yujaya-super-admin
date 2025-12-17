'use client'

import { useState } from 'react'

import { useRouter, useParams } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import { useSession } from 'next-auth/react'

import { useToast } from '@/contexts/ToastContext'

import StudioAddHeader from '@views/studio/add/StudioAddHeader'
import StudioInformation from '@views/studio/add/StudioInformation'
import StudioImage from '@views/studio/add/StudioImage'

const AddStudioPage = () => {
  const { data: session } = useSession()
  const { showToast } = useToast()
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params

  const [studioData, setStudioData] = useState({
    userType: 'individual',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    studioName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    rooms: [{ roomName: '', pax: '' }]
  })

  const [images, setImages] = useState([])

  const handlePublish = async () => {
    try {
      const payload = {
        ...studioData,
        rooms: studioData.rooms.map(r => ({
          roomName: r.roomName,
          pax: Number(r.pax)
        }))
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/studio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create studio')
      }

      showToast(data.message || 'Studio published successfully', 'success')
      router.push(`/${locale}/studio/list`)
    } catch (error) {
      showToast(error.message || 'Something went wrong', 'error')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <StudioAddHeader onPublish={handlePublish} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <StudioInformation data={studioData} setData={setStudioData} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <StudioImage images={images} setImages={setImages} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default AddStudioPage
