'use client'
import { useState, useEffect } from 'react'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'

// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import '@/libs/styles/tiptapEditor.css'

const StudioInformation = ({ data, setData }) => {
  const addRoom = () => {
    setData(prev => ({
      ...prev,
      rooms: [...prev.rooms, { roomName: '', pax: '' }]
    }))
  }

  const removeRoom = index => {
    if (data.rooms.length <= 1) return
    setData(prev => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index)
    }))
  }

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleRoomChange = (index, field, value) => {
    const rooms = [...data.rooms]

    rooms[index][field] = value
    setData(prev => ({ ...prev, rooms }))
  }

  return (
    <Card>
      <CardHeader title='Studio Information' />
      <CardContent>
        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='First Name'
              value={data?.name}
              onChange={e => handleChange('firstName', e.target.value)}
              placeholder='Name here...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Last Name'
              value={data?.name}
              onChange={e => handleChange('lastName', e.target.value)}
              placeholder='Name here...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Email Id'
              value={data?.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder='Email here...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Phone No.'
              value={data?.phoneNumber}
              onChange={e => handleChange('phoneNumber', e.target.value)}
              placeholder='Phone Number here...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Studio Name'
              value={data?.studioName}
              onChange={e => handleChange('studioName', e.target.value)}
              placeholder='Name here...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Address'
              value={data?.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder='Address here...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='User Type'
              value={data.userType}
              onChange={e => handleChange('userType', e.target.value)}
            >
              <MenuItem value='individual'>Individual</MenuItem>
              <MenuItem value='studio'>Studio</MenuItem>
            </CustomTextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='City'
              value={data?.city}
              onChange={e => handleChange('city', e.target.value)}
              placeholder='City here...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='State'
              value={data?.state}
              onChange={e => handleChange('state', e.target.value)}
              placeholder='State here...'
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Country'
              value={data?.country}
              onChange={e => handleChange('country', e.target.value)}
              placeholder='Country here...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label='Zipcode'
              value={data?.zipcode}
              onChange={e => handleChange('zipcode', e.target.value)}
              placeholder='Zipcode here...'
            />
          </Grid>
        </Grid>
      </CardContent>
      {/* <CardHeader title='Add Room:(Minimum 1 Room must be selected)' /> */}
      <CardHeader title='Add Rooms (Minimum 1 required)' action={<Button onClick={addRoom}>Add Room</Button>} />

      <CardContent>
        <Grid container spacing={6}>
          {data.rooms.map((room, index) => (
            <Grid key={index} size={{ xs: 12 }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <CustomTextField
                    fullWidth
                    label='Room Name'
                    value={room.roomName}
                    onChange={e => handleRoomChange(index, 'roomName', e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 5 }}>
                  <CustomTextField
                    fullWidth
                    type='number'
                    label='Pax Capacity'
                    value={room.pax}
                    onChange={e => handleRoomChange(index, 'pax', e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 2 }}>
                  <Button color='error' disabled={data.rooms.length <= 1} onClick={() => removeRoom(index)}>
                    Remove
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StudioInformation
