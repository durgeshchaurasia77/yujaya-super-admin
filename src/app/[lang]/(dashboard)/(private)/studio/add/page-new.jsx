'use client'

import { useEffect, useState } from 'react'

import { useRouter, useParams } from 'next/navigation'

import { useSession } from 'next-auth/react'
import Grid from '@mui/material/Grid2'

import { useToast } from '@/contexts/ToastContext'

import StudioAddHeader from '@views/studio/add/StudioAddHeader'
import StudioInformation from '@views/studio/add/StudioInformation'
import StudioImage from '@views/studio/add/StudioImage'

const DEFAULT_DATA = {
  userType: 'studio',
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
}

const AddStudioPage = ({ studioId }) => {
  const { data: session } = useSession()
  const { showToast } = useToast()
  const router = useRouter()
  const { lang: locale } = useParams()

  const [studioData, setStudioData] = useState(DEFAULT_DATA)
  const [images, setImages] = useState([])
  const isEdit = Boolean(studioId)

  // 🔹 Fetch studio data (EDIT MODE)
  useEffect(() => {
    if (!isEdit || !session?.accessToken) return

    const fetchStudio = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/studio/${studioId}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.message)

        setStudioData({
          ...data,
          rooms: data.rooms?.length ? data.rooms : DEFAULT_DATA.rooms
        })
      } catch (error) {
        showToast(error.message, 'error')
      }
    }

    fetchStudio()
  }, [studioId, session])

  // 🔹 Add / Update
  const handlePublish = async () => {
    try {
      const payload = {
        ...studioData,
        rooms: studioData.rooms.map(r => ({
          roomName: r.roomName,
          pax: Number(r.pax)
        }))
      }

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/studio/${studioId}`
        : `${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/studio`

      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed')
      }

      showToast(isEdit ? 'Studio updated successfully' : 'Studio created successfully', 'success')

      router.push(`/${locale}/studio/list`)
    } catch (error) {
      showToast(error.message || 'Something went wrong', 'error')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <StudioAddHeader onPublish={handlePublish} isEdit={isEdit} />
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
