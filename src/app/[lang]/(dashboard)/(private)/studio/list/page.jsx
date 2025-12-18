// MUI Imports
import { redirect } from 'next/navigation'

import Grid from '@mui/material/Grid2'

import { signOut } from 'next-auth/react'

// import { redirect } from 'next/navigation'
// Next Auth
import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'

// Components
import StudioListTable from '@views/studio/list/StudioListTable'
import StudioCard from '@views/studio/list/StudioCard'

const eCommerceStudiosList = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
  }

  // console.log(session.accessToken)

  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/studios`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`
    },
    cache: 'no-store'
  })

  // console.log(res)

  if (!res.ok) {
    if (res.status === 406) {
      signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
    }

    const text = await res.text()

    console.error('API error:', text)
    throw new Error('Failed to fetch studios')
  }

  const data = await res.json()

  return (
    <Grid container spacing={6}>
      {/* <Grid size={{ xs: 12 }}>
        <StudioCard />
      </Grid> */}

      <Grid size={{ xs: 12 }}>
        {/* ✅ prop name FIXED */}
        <StudioListTable studioData={data?.studios ?? data} />
      </Grid>
    </Grid>
  )
}

export default eCommerceStudiosList
