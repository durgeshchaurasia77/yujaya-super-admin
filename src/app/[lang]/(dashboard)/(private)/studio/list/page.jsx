import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

import Grid from '@mui/material/Grid2'

import { authOptions } from '@/libs/auth'
import StudioListTable from '@views/studio/list/StudioListTable'
import AutoLogout from '@/components/AutoLogout'

const eCommerceStudiosList = async () => {
  const session = await getServerSession(authOptions)

  // 🔐 No session → redirect
  if (!session?.accessToken) {
    return <AutoLogout />
  }

  let data = null

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/studios`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      },
      cache: 'no-store'
    })

    // 🔐 Invalid token → redirect
    if (res.status === 406) {
      return <AutoLogout />
    }

    if (!res.ok) {
      throw new Error('Failed to fetch studios')
    }

    data = await res.json()
  } catch (error) {
    return <AutoLogout />
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <StudioListTable studioData={data?.studios ?? data} />
      </Grid>
    </Grid>
  )
}

export default eCommerceStudiosList
