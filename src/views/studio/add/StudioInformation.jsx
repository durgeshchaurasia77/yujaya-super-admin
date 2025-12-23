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
import { Box, InputAdornment } from '@mui/material'

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

  // const handleChange = (field, value) => {
  //   if (field === 'userType') {
  //     return {
  //       ...prev,
  //       userType: value,
  //       gender: value === 'individual' ? prev.gender : '',
  //       studioName: value === 'studio' ? prev.studioName : ''
  //     }
  //   }

  //   setData(prev => ({ ...prev, [field]: value }))
  // }
  const handleChange = (field, value) => {
    setData(prev => {
      if (field === 'userType') {
        return {
          ...prev,
          userType: value,
          gender: value === 'individual' ? prev.gender : '',
          studioName: value === 'studio' ? prev.studioName : ''
        }
      }

      return {
        ...prev,
        [field]: value
      }
    })
  }

  const handleRoomChange = (index, field, value) => {
    const rooms = [...data.rooms]

    rooms[index][field] = value
    setData(prev => ({ ...prev, rooms }))
  }

  const countryCodes = [
    { value: '+1', iso: 'us', label: '+1' },
    { value: '+1', iso: 'ca', label: '+1' },
    { value: '+7', iso: 'ru', label: '+7' },
    { value: '+7', iso: 'kz', label: '+7' },
    { value: '+20', iso: 'eg', label: '+20' },
    { value: '+27', iso: 'za', label: '+27' },
    { value: '+30', iso: 'gr', label: '+30' },
    { value: '+31', iso: 'nl', label: '+31' },
    { value: '+32', iso: 'be', label: '+32' },
    { value: '+33', iso: 'fr', label: '+33' },
    { value: '+34', iso: 'es', label: '+34' },
    { value: '+36', iso: 'hu', label: '+36' },
    { value: '+39', iso: 'it', label: '+39' },
    { value: '+40', iso: 'ro', label: '+40' },
    { value: '+41', iso: 'ch', label: '+41' },
    { value: '+43', iso: 'at', label: '+43' },
    { value: '+44', iso: 'gb', label: '+44' },
    { value: '+45', iso: 'dk', label: '+45' },
    { value: '+46', iso: 'se', label: '+46' },
    { value: '+47', iso: 'no', label: '+47' },
    { value: '+48', iso: 'pl', label: '+48' },
    { value: '+49', iso: 'de', label: '+49' },

    // Americas
    { value: '+51', iso: 'pe', label: '+51' },
    { value: '+52', iso: 'mx', label: '+52' },
    { value: '+53', iso: 'cu', label: '+53' },
    { value: '+54', iso: 'ar', label: '+54' },
    { value: '+55', iso: 'br', label: '+55' },
    { value: '+56', iso: 'cl', label: '+56' },
    { value: '+57', iso: 'co', label: '+57' },
    { value: '+58', iso: 've', label: '+58' },

    // Asia
    { value: '+60', iso: 'my', label: '+60' },
    { value: '+61', iso: 'au', label: '+61' },
    { value: '+62', iso: 'id', label: '+62' },
    { value: '+63', iso: 'ph', label: '+63' },
    { value: '+64', iso: 'nz', label: '+64' },
    { value: '+65', iso: 'sg', label: '+65' },
    { value: '+66', iso: 'th', label: '+66' },
    { value: '+81', iso: 'jp', label: '+81' },
    { value: '+82', iso: 'kr', label: '+82' },
    { value: '+84', iso: 'vn', label: '+84' },
    { value: '+86', iso: 'cn', label: '+86' },
    { value: '+90', iso: 'tr', label: '+90' },
    { value: '+91', iso: 'in', label: '+91' },
    { value: '+92', iso: 'pk', label: '+92' },
    { value: '+93', iso: 'af', label: '+93' },
    { value: '+94', iso: 'lk', label: '+94' },
    { value: '+95', iso: 'mm', label: '+95' },
    { value: '+98', iso: 'ir', label: '+98' },

    // Africa
    { value: '+212', iso: 'ma', label: '+212' },
    { value: '+213', iso: 'dz', label: '+213' },
    { value: '+216', iso: 'tn', label: '+216' },
    { value: '+218', iso: 'ly', label: '+218' },
    { value: '+220', iso: 'gm', label: '+220' },
    { value: '+221', iso: 'sn', label: '+221' },
    { value: '+222', iso: 'mr', label: '+222' },
    { value: '+223', iso: 'ml', label: '+223' },
    { value: '+224', iso: 'gn', label: '+224' },
    { value: '+225', iso: 'ci', label: '+225' },
    { value: '+226', iso: 'bf', label: '+226' },
    { value: '+227', iso: 'ne', label: '+227' },
    { value: '+228', iso: 'tg', label: '+228' },
    { value: '+229', iso: 'bj', label: '+229' },
    { value: '+230', iso: 'mu', label: '+230' },
    { value: '+231', iso: 'lr', label: '+231' },
    { value: '+232', iso: 'sl', label: '+232' },
    { value: '+233', iso: 'gh', label: '+233' },
    { value: '+234', iso: 'ng', label: '+234' },
    { value: '+235', iso: 'td', label: '+235' },
    { value: '+236', iso: 'cf', label: '+236' },
    { value: '+237', iso: 'cm', label: '+237' },
    { value: '+238', iso: 'cv', label: '+238' },
    { value: '+239', iso: 'st', label: '+239' },
    { value: '+240', iso: 'gq', label: '+240' },
    { value: '+241', iso: 'ga', label: '+241' },
    { value: '+242', iso: 'cg', label: '+242' },
    { value: '+243', iso: 'cd', label: '+243' },
    { value: '+244', iso: 'ao', label: '+244' },
    { value: '+245', iso: 'gw', label: '+245' },
    { value: '+246', iso: 'io', label: '+246' },
    { value: '+247', iso: 'sh', label: '+247' },
    { value: '+248', iso: 'sc', label: '+248' },
    { value: '+249', iso: 'sd', label: '+249' },
    { value: '+250', iso: 'rw', label: '+250' },
    { value: '+251', iso: 'et', label: '+251' },
    { value: '+252', iso: 'so', label: '+252' },
    { value: '+253', iso: 'dj', label: '+253' },
    { value: '+254', iso: 'ke', label: '+254' },
    { value: '+255', iso: 'tz', label: '+255' },
    { value: '+256', iso: 'ug', label: '+256' },
    { value: '+257', iso: 'bi', label: '+257' },
    { value: '+258', iso: 'mz', label: '+258' },
    { value: '+260', iso: 'zm', label: '+260' },
    { value: '+261', iso: 'mg', label: '+261' },
    { value: '+262', iso: 're', label: '+262' },
    { value: '+263', iso: 'zw', label: '+263' },
    { value: '+264', iso: 'na', label: '+264' },
    { value: '+265', iso: 'mw', label: '+265' },
    { value: '+266', iso: 'ls', label: '+266' },
    { value: '+267', iso: 'bw', label: '+267' },
    { value: '+268', iso: 'sz', label: '+268' },
    { value: '+269', iso: 'km', label: '+269' },

    // Oceania + Islands
    { value: '+290', iso: 'sh', label: '+290' },
    { value: '+297', iso: 'aw', label: '+297' },
    { value: '+298', iso: 'fo', label: '+298' },
    { value: '+299', iso: 'gl', label: '+299' },

    // Europe Extras
    { value: '+350', iso: 'gi', label: '+350' },
    { value: '+351', iso: 'pt', label: '+351' },
    { value: '+352', iso: 'lu', label: '+352' },
    { value: '+353', iso: 'ie', label: '+353' },
    { value: '+354', iso: 'is', label: '+354' },
    { value: '+355', iso: 'al', label: '+355' },
    { value: '+356', iso: 'mt', label: '+356' },
    { value: '+357', iso: 'cy', label: '+357' },
    { value: '+358', iso: 'fi', label: '+358' },
    { value: '+359', iso: 'bg', label: '+359' },
    { value: '+370', iso: 'lt', label: '+370' },
    { value: '+371', iso: 'lv', label: '+371' },
    { value: '+372', iso: 'ee', label: '+372' },
    { value: '+373', iso: 'md', label: '+373' },
    { value: '+374', iso: 'am', label: '+374' },
    { value: '+375', iso: 'by', label: '+375' },
    { value: '+376', iso: 'ad', label: '+376' },
    { value: '+377', iso: 'mc', label: '+377' },
    { value: '+378', iso: 'sm', label: '+378' },
    { value: '+380', iso: 'ua', label: '+380' },
    { value: '+381', iso: 'rs', label: '+381' },
    { value: '+382', iso: 'me', label: '+382' },
    { value: '+383', iso: 'xk', label: '+383' },
    { value: '+385', iso: 'hr', label: '+385' },
    { value: '+386', iso: 'si', label: '+386' },
    { value: '+387', iso: 'ba', label: '+387' },
    { value: '+389', iso: 'mk', label: '+389' },
    { value: '+420', iso: 'cz', label: '+420' },
    { value: '+421', iso: 'sk', label: '+421' },
    { value: '+423', iso: 'li', label: '+423' },

    // N America Small
    { value: '+500', iso: 'fk', label: '+500' },
    { value: '+501', iso: 'bz', label: '+501' },
    { value: '+502', iso: 'gt', label: '+502' },
    { value: '+503', iso: 'sv', label: '+503' },
    { value: '+504', iso: 'hn', label: '+504' },
    { value: '+505', iso: 'ni', label: '+505' },
    { value: '+506', iso: 'cr', label: '+506' },
    { value: '+507', iso: 'pa', label: '+507' },
    { value: '+508', iso: 'pm', label: '+508' },
    { value: '+509', iso: 'ht', label: '+509' },

    // More Americas
    { value: '+590', iso: 'gp', label: '+590' },
    { value: '+591', iso: 'bo', label: '+591' },
    { value: '+592', iso: 'gy', label: '+592' },
    { value: '+593', iso: 'ec', label: '+593' },
    { value: '+594', iso: 'gf', label: '+594' },
    { value: '+595', iso: 'py', label: '+595' },
    { value: '+596', iso: 'mq', label: '+596' },
    { value: '+597', iso: 'sr', label: '+597' },
    { value: '+598', iso: 'uy', label: '+598' },
    { value: '+599', iso: 'cw', label: '+599' },

    // Oceania More
    { value: '+670', iso: 'tl', label: '+670' },
    { value: '+672', iso: 'aq', label: '+672' },
    { value: '+673', iso: 'bn', label: '+673' },
    { value: '+674', iso: 'nr', label: '+674' },
    { value: '+675', iso: 'pg', label: '+675' },
    { value: '+676', iso: 'to', label: '+676' },
    { value: '+677', iso: 'sb', label: '+677' },
    { value: '+678', iso: 'vu', label: '+678' },
    { value: '+679', iso: 'fj', label: '+679' },
    { value: '+680', iso: 'pw', label: '+680' },
    { value: '+681', iso: 'wf', label: '+681' },
    { value: '+682', iso: 'ck', label: '+682' },
    { value: '+683', iso: 'nu', label: '+683' },
    { value: '+684', iso: 'as', label: '+684' },
    { value: '+685', iso: 'ws', label: '+685' },
    { value: '+686', iso: 'ki', label: '+686' },
    { value: '+687', iso: 'nc', label: '+687' },
    { value: '+688', iso: 'tv', label: '+688' },
    { value: '+689', iso: 'pf', label: '+689' },
    { value: '+690', iso: 'tk', label: '+690' },
    { value: '+691', iso: 'fm', label: '+691' },
    { value: '+692', iso: 'mh', label: '+692' },

    // Asia Extras
    { value: '+850', iso: 'kp', label: '+850' },
    { value: '+852', iso: 'hk', label: '+852' },
    { value: '+853', iso: 'mo', label: '+853' },
    { value: '+855', iso: 'kh', label: '+855' },
    { value: '+856', iso: 'la', label: '+856' },
    { value: '+880', iso: 'bd', label: '+880' },
    { value: '+886', iso: 'tw', label: '+886' },

    // Middle East
    { value: '+960', iso: 'mv', label: '+960' },
    { value: '+961', iso: 'lb', label: '+961' },
    { value: '+962', iso: 'jo', label: '+962' },
    { value: '+963', iso: 'sy', label: '+963' },
    { value: '+964', iso: 'iq', label: '+964' },
    { value: '+965', iso: 'kw', label: '+965' },
    { value: '+966', iso: 'sa', label: '+966' },
    { value: '+967', iso: 'ye', label: '+967' },
    { value: '+968', iso: 'om', label: '+968' },
    { value: '+970', iso: 'ps', label: '+970' },
    { value: '+971', iso: 'ae', label: '+971' },
    { value: '+972', iso: 'il', label: '+972' },
    { value: '+973', iso: 'bh', label: '+973' },
    { value: '+974', iso: 'qa', label: '+974' },
    { value: '+975', iso: 'bt', label: '+975' },
    { value: '+976', iso: 'mn', label: '+976' },
    { value: '+977', iso: 'np', label: '+977' },

    // Central Asia
    { value: '+992', iso: 'tj', label: '+992' },
    { value: '+993', iso: 'tm', label: '+993' },
    { value: '+994', iso: 'az', label: '+994' },
    { value: '+995', iso: 'ge', label: '+995' },
    { value: '+996', iso: 'kg', label: '+996' },
    { value: '+998', iso: 'uz', label: '+998' }
  ]

  const [openDropdown, setOpenDropdown] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0])
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/country-list`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setCountries(res.data)
      })
  }, [])

  // const handleUserTypeChange = value => {
  //   handleChange('userType', value)

  //   if (value === 'individual') {
  //     handleChange('studioName', '')
  //   } else {
  //     handleChange('gender', '')
  //   }
  // }

  return (
    <Card>
      <CardHeader title='Studio Information' />
      <CardContent>
        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              fullWidth
              label={
                <>
                  User Type <span style={{ color: 'red' }}>*</span>
                </>
              }
              value={data.userType}
              onChange={e => handleChange('userType', e.target.value)}
            >
              <MenuItem value='studio'>Studio/Academy</MenuItem>
              <MenuItem value='individual'>Individual</MenuItem>
            </CustomTextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label={
                <>
                  First Name <span style={{ color: 'red' }}>*</span>
                </>
              }
              value={data?.name}
              onChange={e => handleChange('firstName', e.target.value)}
              placeholder='Name here...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label={
                <>
                  Last Name <span style={{ color: 'red' }}>*</span>
                </>
              }
              value={data?.name}
              onChange={e => handleChange('lastName', e.target.value)}
              placeholder='Name here...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label={
                <>
                  Email Id <span style={{ color: 'red' }}>*</span>
                </>
              }
              value={data?.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder='Email here...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <label className='form-label'>
              Phone No. <span style={{ color: 'red' }}>*</span>
            </label>

            <CustomTextField
              fullWidth
              placeholder='Phone Number here...'
              value={data?.phoneNumber}
              onChange={e => handleChange('phoneNumber', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Box
                      onClick={() => setOpenDropdown(!openDropdown)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        gap: 1,
                        minWidth: 70
                      }}
                    >
                      <img src={`https://flagcdn.com/24x18/${selectedCountry.iso}.png`} width='24' alt='' />
                      {selectedCountry.label}
                    </Box>
                  </InputAdornment>
                )
              }}
            />

            {/* Dropdown */}
            {openDropdown && (
              <Box
                sx={{
                  position: 'absolute',
                  mt: 1,
                  width: 120,
                  maxHeight: 200,
                  overflowY: 'auto',
                  bgcolor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  zIndex: 1300
                }}
              >
                {countryCodes.map(cc => (
                  <Box
                    key={cc.value}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                    onClick={() => {
                      setSelectedCountry(cc)
                      setOpenDropdown(false)
                      handleChange('countryCode', cc.label)
                    }}
                  >
                    <img src={`https://flagcdn.com/24x18/${cc.iso}.png`} width='24' alt='' />
                    {cc.label}
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
          {data.userType === 'individual' && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label={
                  <>
                    Gender <span style={{ color: 'red' }}>*</span>
                  </>
                }
                value={data.gender}
                onChange={e => handleChange('gender', e.target.value)}
              >
                <MenuItem value='male'>Male</MenuItem>
                <MenuItem value='female'>Female</MenuItem>
                <MenuItem value='other'>Other</MenuItem>
              </CustomTextField>
            </Grid>
          )}
          {data.userType === 'studio' && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label={
                  <>
                    Studio Name <span style={{ color: 'red' }}>*</span>
                  </>
                }
                value={data?.studioName}
                onChange={e => handleChange('studioName', e.target.value)}
                placeholder='Name here...'
              />
            </Grid>
          )}

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
              label='Country'
              value={data.country}
              onChange={e => {
                const countryCode = e.target.value

                handleChange('country', countryCode)
                handleChange('state', '')
                handleChange('city', '')

                setCities([])

                fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/states/${countryCode}`)
                  .then(res => res.json())
                  .then(res => {
                    if (res.success) setStates(res.data)
                  })
              }}
            >
              {countries.map(country => (
                <MenuItem key={country.code} value={country.code}>
                  {country.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='State'
              value={data.state}
              disabled={!states.length}
              onChange={e => {
                const stateCode = e.target.value

                handleChange('state', stateCode)
                handleChange('city', '')

                fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/cities/${data.country}/${stateCode}`)
                  .then(res => res.json())
                  .then(res => {
                    if (res.success) setCities(res.data)
                  })
              }}
            >
              {states.map(state => (
                <MenuItem key={state.code} value={state.code}>
                  {state.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='City'
              value={data.city}
              disabled={!cities.length}
              onChange={e => handleChange('city', e.target.value)}
            >
              {cities.map(city => (
                <MenuItem key={city.name} value={city.name}>
                  {city.name}
                </MenuItem>
              ))}
            </CustomTextField>
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
    </Card>
  )
}

export default StudioInformation
