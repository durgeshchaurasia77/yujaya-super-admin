'use client'

// React Imports
import { useMemo, useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// NextAuth
import { useSession, signOut } from 'next-auth/react'

import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { Box, InputAdornment } from '@mui/material'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// Tanstack Table
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Utils
import { rankItem } from '@tanstack/match-sorter-utils'
import classnames from 'classnames'

import { getServerSession } from 'next-auth'

import { updateStudioStatus, getStudioById, updateStudio, deleteStudio } from '@/libs/studios.api'

// Toast
import { useToast } from '@/contexts/ToastContext'

import { authOptions } from '@/libs/auth'

import AutoLogout from '@/components/AutoLogout'

// Components
import CustomTextField from '@core/components/mui/TextField'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Styles
import tableStyles from '@core/styles/table.module.css'

// ---------- Helpers ----------
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper()

// ---------- Component ----------
const StudioListTable = ({ studioData = [] }) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { showToast } = useToast()
  const { lang: locale } = useParams()

  const [data, setData] = useState(studioData)
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [openView, setOpenView] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedStudio, setSelectedStudio] = useState(null)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)
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

  // const session = await getServerSession(authOptions)
  const [formData, setFormData] = useState({
    userType: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryCode: '',
    gender: '',
    studioName: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: ''
  })

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

  const paymentModeLabel = {
    cash_payment: 'Cash Payment',
    bank_transfer: 'Bank Transfer',
    online: 'Online Payment'
  }

  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0])
  const [openDropdown, setOpenDropdown] = useState(false)

  const getSafeValue = (value, options, key = 'code') => {
    return options.some(opt => opt[key] === value) ? value : ''
  }

  // const handleEditOpen = async studioId => {
  //   try {
  // if (!session?.accessToken) {
  //   signOut({ callbackUrl: `/${locale}/login` })

  //   return
  // }

  //     const res = await getStudioById(studioId, session.accessToken)

  //     // const studio = res.data
  //     const { studio, plan } = res.data

  //     console.log(plan)

  //     // setSelectedStudio(studio)
  //     setSelectedStudio({
  //       ...studio,
  //       plan
  //     })

  //     setFormData({
  //       userType: studio.userType || '',
  //       firstName: studio.firstName || '',
  //       lastName: studio.lastName || '',
  //       email: studio.email || '',
  //       phoneNumber: studio.phoneNumber || '',
  //       countryCode: studio.countryCode || '',
  //       gender: studio.gender || '',
  //       isPaid: String(!!studio.isPaid),
  //       studioName: studio.studioName || '',
  //       address: studio.address || '',
  //       country: studio.country || '',
  //       state: studio.state || '',
  //       city: studio.city || '',
  //       zipcode: studio.zipcode || '',
  //       paymentMode: studio.plan?.paymentMode || ''
  //     })

  //     setOpenEdit(true)
  //   } catch (error) {
  //     showToast(error.message || 'Failed to load studio', 'error')
  //   }
  // }
  const handleEditOpen = async studioId => {
    try {
      if (!session?.accessToken) {
        signOut({ callbackUrl: `/${locale}/login` })

        return
      }

      const res = await getStudioById(studioId, session.accessToken)
      const { studio, plan } = res.data

      setSelectedStudio({ ...studio, plan })

      // 1️⃣ Country ke states preload
      if (studio.country) {
        const statesRes = await fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/states/${studio.country}`)

        const statesData = await statesRes.json()

        if (statesData.success) {
          setStates(statesData.data)
        }
      }

      // 2️⃣ State ke cities preload
      if (studio.country && studio.state) {
        const citiesRes = await fetch(
          `${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/cities/${studio.country}/${studio.state}`
        )

        const citiesData = await citiesRes.json()

        if (citiesData.success) {
          setCities(citiesData.data)
        }
      }

      // 3️⃣ Ab formData set karo (AFTER options)
      setFormData({
        userType: studio.userType || '',
        firstName: studio.firstName || '',
        lastName: studio.lastName || '',
        email: studio.email || '',
        phoneNumber: studio.phoneNumber || '',
        countryCode: studio.countryCode || '',
        gender: studio.gender || '',
        isPaid: String(!!studio.isPaid),
        studioName: studio.studioName || '',
        address: studio.address || '',
        country: studio.country || '',
        state: studio.state || '',
        city: studio.city || '',
        zipcode: studio.zipcode || ''
      })

      setOpenEdit(true)
    } catch (error) {
      showToast('Failed to load studio', 'error')
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // const handleUpdate = async () => {
  //   if (!session?.accessToken) {
  //     signOut({ callbackUrl: `/${locale}/login` })

  //     return
  //   }

  //   try {
  //     const result = await updateStudio(selectedStudio._id, formData, session.accessToken)

  //     // setTableData(prev => prev.map(item => (item._id === selectedStudio._id ? { ...item, ...result.data } : item)))
  //     setData(prev => prev.map(item => (item._id === selectedStudio._id ? { ...item, ...result.data } : item)))
  //     showToast('Updated successfully', 'success')
  //     setOpenEdit(false)
  //     setSelectedStudio(null)

  //     setTimeout(() => {
  //       router.replace(`/${locale}/studio/list`)
  //       router.refresh()
  //     }, 2000)

  //     // window.location.reload()
  //   } catch (error) {
  //     showToast(error.message || 'Update failed', 'error')
  //   }
  // }
  const handleUpdate = async () => {
    if (!session?.accessToken) {
      signOut({ callbackUrl: `/${locale}/login` })

      return
    }

    try {
      const result = await updateStudio(selectedStudio._id, formData, session.accessToken)

      setData(prev => prev.map(item => (item._id === selectedStudio._id ? { ...item, ...result.data } : item)))

      showToast('Updated successfully', 'success')
      setOpenEdit(false)
      setSelectedStudio(null)
    } catch (error) {
      showToast(error.message || 'Update failed', 'error')
    }
  }

  // 🔐 Auto logout if session expired
  if (status === 'unauthenticated') {
    signOut({ callbackUrl: `/${locale}/login` })

    return

    return null
  }

  const handleToggleStatus = async (studioId, currentStatus) => {
    if (!session?.accessToken) {
      signOut({ callbackUrl: `/${locale}/login` })

      return
    }

    const nextStatus = currentStatus !== 'active'

    const confirmMsg = `Are you sure you want to ${nextStatus ? 'activate' : 'deactivate'} this studio?`

    if (!confirm(confirmMsg)) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/studios/${studioId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ status: nextStatus })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || 'Failed to update status')
      }

      // ✅ Update UI
      setData(prev => prev.map(s => (s._id === studioId ? { ...s, status: result.status } : s)))

      showToast(result.message, 'success')
    } catch (error) {
      showToast(error.message || 'Something went wrong', 'error')
    }
  }

  // ---------- Delete ----------
  const handleDeleteStudio = async studioId => {
    if (!session?.accessToken) {
      signOut({ callbackUrl: `/${locale}/login` })

      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/studios/${studioId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      })

      if (res.status === 401) {
        signOut({ callbackUrl: `/${locale}/login` })

        return
      }

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || 'Failed to delete studio')
      }

      setData(prev => prev.filter(s => s._id !== studioId))
      showToast('Studio deleted successfully', 'success')
    } catch (error) {
      showToast(error.message || 'Something went wrong', 'error')
    }
  }

  // ---------- Columns ----------
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
      },

      columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
        id: 'ownerName',
        header: 'Owner Name',
        cell: info => <Typography fontWeight={500}>{info.getValue()}</Typography>
      }),

      columnHelper.accessor('studioName', {
        header: 'Studio Name',
        cell: ({ row }) => <Typography>{row.original.studioName}</Typography>
      }),

      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography>{row.original.email}</Typography>
      }),

      columnHelper.accessor('phoneNumber', {
        header: 'Phone',
        cell: ({ row }) => <Typography>{row.original.phoneNumber}</Typography>
      }),
      columnHelper.accessor('userType', {
        header: 'User Type',
        cell: ({ row }) => (
          <Typography>
            {row.original.userType === 'individual'
              ? 'Individual'
              : row.original.userType === 'studio'
                ? 'Studio/Academy'
                : '-'}
          </Typography>
        )
      }),

      columnHelper.accessor('isPaid', {
        header: 'Payment Status',
        cell: ({ row }) => {
          const isPaid = row.original.isPaid

          return (
            <Typography
              sx={{
                color: isPaid === true ? 'success.main' : isPaid === false ? 'warning.main' : 'text.secondary',
                fontWeight: 600
              }}
            >
              {isPaid === true ? 'Success' : isPaid === false ? 'Pending' : '-'}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            size='small'
            variant='tonal'
            label={row.original.status}
            color={row.original.status === 'active' ? 'success' : 'warning'}
          />
        )
      }),

      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <OptionMenu
              options={[
                {
                  text: row.original.status === 'active' ? 'Deactivate' : 'Activate',
                  icon: row.original.status === 'active' ? 'tabler-lock' : 'tabler-check',
                  menuItemProps: {
                    onClick: () => handleToggleStatus(row.original._id, row.original.status)
                  }
                },
                {
                  text: 'Edit',
                  icon: 'tabler-edit',
                  menuItemProps: {
                    onClick: () => handleEditOpen(row.original._id)
                  }
                },
                {
                  text: 'View',
                  icon: 'tabler-eye',
                  menuItemProps: {
                    onClick: () => {
                      setSelectedStudio(row.original)
                      setOpenView(true)
                    }
                  }
                },
                {
                  text: 'Delete',
                  icon: 'tabler-trash',
                  menuItemProps: {
                    onClick: () => {
                      if (confirm('Are you sure you want to delete this studio?')) {
                        handleDeleteStudio(row.original._id)
                      }
                    }
                  }
                }
              ]}
            />
          </div>
        )
      }
    ],
    [data, locale]
  )

  // ---------- Table ----------
  const table = useReactTable({
    data,
    columns,
    state: { rowSelection, globalFilter },
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 }
    },
    enableRowSelection: true
  })

  // ---------- UI ----------
  return (
    <Card>
      <CardHeader title='All Studio' />
      <Divider />

      <div className='flex flex-wrap justify-between gap-4 p-6'>
        <CustomTextField
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder='Search studio, owner, email...'
        />

        <div className='flex gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </CustomTextField>

          <Button
            variant='contained'
            component={Link}
            href={`/${locale}/studio/add`}
            startIcon={<i className='tabler-plus' />}
          >
            Add Studio
          </Button>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  No studios found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
      />
      <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Studio Details</DialogTitle>

        <DialogContent dividers>
          {selectedStudio && (
            <div className='flex flex-col gap-3'>
              <Typography>
                <strong>First Name:</strong> {selectedStudio.firstName}
              </Typography>
              <Typography>
                <strong>Owner Name:</strong> {selectedStudio.lastName}
              </Typography>

              {/* <Typography>
                <strong>Studio Name:</strong> {selectedStudio.studioName || '-'}
              </Typography> */}

              <Typography>
                <strong>Email:</strong> {selectedStudio.email || '-'}
              </Typography>

              <Typography>
                <strong>Phone:</strong> {selectedStudio.phoneNumber || '-'}
              </Typography>
              {selectedStudio?.gender && (
                <Typography>
                  <strong>Gender:</strong> {selectedStudio.gender}
                </Typography>
              )}

              {selectedStudio?.studioName && (
                <Typography>
                  <strong>Studio Name:</strong> {selectedStudio.studioName}
                </Typography>
              )}

              <Typography>
                <strong>User Type:</strong> {selectedStudio.userType === 'individual' ? 'Individual' : 'Studio/Academy'}
              </Typography>
              <Typography>
                <strong>Address:</strong> {selectedStudio.address || '-'}
              </Typography>
              <Typography>
                <strong>City:</strong> {selectedStudio.city || '-'}
              </Typography>
              <Typography>
                <strong>State:</strong> {selectedStudio.state || '-'}
              </Typography>
              <Typography>
                <strong>Country:</strong> {selectedStudio.country || '-'}
              </Typography>
              <Typography>
                <strong>Zip code:</strong> {selectedStudio.zipcode || '-'}
              </Typography>
              <Typography>
                <strong>Status:</strong>{' '}
                <Chip
                  size='small'
                  label={selectedStudio.status}
                  color={selectedStudio.status === 'active' ? 'success' : 'warning'}
                />
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth='md'>
        <DialogTitle>Edit User / Studio</DialogTitle>

        <DialogContent dividers>
          <CardContent>
            <Grid container spacing={6} className='mbe-6'>
              {/* USER TYPE */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  select
                  fullWidth
                  label='User Type *'
                  value={formData.userType}
                  onChange={e => handleChange('userType', e.target.value)}
                >
                  <MenuItem value='studio'>Studio/Academy</MenuItem>
                  <MenuItem value='individual'>Individual</MenuItem>
                </CustomTextField>
              </Grid>

              {/* FIRST NAME */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  label='First Name *'
                  value={formData.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                />
              </Grid>

              {/* LAST NAME */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  label='Last Name *'
                  value={formData.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                />
              </Grid>

              {/* EMAIL */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField fullWidth disabled label='Email *' value={formData.email} />
              </Grid>

              {/* PHONE */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  label='Phone Number *'
                  value={formData.phoneNumber}
                  onChange={e => handleChange('phoneNumber', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Box
                          sx={{ cursor: 'pointer', display: 'flex', gap: 1 }}
                          onClick={() => setOpenDropdown(!openDropdown)}
                        >
                          <img src={`https://flagcdn.com/24x18/${selectedCountry.iso}.png`} width='24' alt='' />
                          {selectedCountry.label}
                        </Box>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* GENDER */}
              {formData.userType === 'individual' && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Gender *'
                    value={formData.gender}
                    onChange={e => handleChange('gender', e.target.value)}
                  >
                    <MenuItem value='male'>Male</MenuItem>
                    <MenuItem value='female'>Female</MenuItem>
                    <MenuItem value='other'>Other</MenuItem>
                  </CustomTextField>
                </Grid>
              )}

              {/* STUDIO NAME */}
              {formData.userType === 'studio' && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    label='Studio Name *'
                    value={formData.studioName}
                    onChange={e => handleChange('studioName', e.target.value)}
                  />
                </Grid>
              )}

              {/* ADDRESS */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  label='Address'
                  value={formData.address}
                  onChange={e => handleChange('address', e.target.value)}
                />
              </Grid>
              {/* <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  select
                  fullWidth
                  label='Country'
                  value={formData.country}
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
              </Grid> */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  select
                  fullWidth
                  label='Country'
                  value={formData.country || ''}
                  onChange={e => {
                    const countryCode = e.target.value

                    handleChange('country', countryCode)
                    handleChange('state', '')
                    handleChange('city', '')

                    setStates([])
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
                {/* <CustomTextField
                  select
                  fullWidth
                  label='State'
                  value={formData.state}
                  disabled={!states.length}
                  onChange={e => {
                    const stateCode = e.target.value

                    handleChange('state', stateCode)
                    handleChange('city', '')

                    fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/cities/${formData.country}/${stateCode}`)
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
                </CustomTextField> */}
                <CustomTextField
                  select
                  fullWidth
                  label='State'
                  value={getSafeValue(formData.state, states, 'code')}
                  disabled={!states.length}
                  onChange={e => {
                    const stateCode = e.target.value

                    handleChange('state', stateCode)
                    handleChange('city', '')

                    fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_API_URL}/cities/${formData.country}/${stateCode}`)
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
                {/* <CustomTextField
                  select
                  fullWidth
                  label='City'
                  value={formData.city}
                  disabled={!cities.length}
                  onChange={e => handleChange('city', e.target.value)}
                >
                  {cities.map(city => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
                </CustomTextField> */}
                <CustomTextField
                  select
                  fullWidth
                  label='City'
                  value={getSafeValue(formData.city, cities, 'name')}
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
              {/* ZIP */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  label='Zipcode'
                  value={formData.zipcode}
                  onChange={e => handleChange('zipcode', e.target.value)}
                />
              </Grid>
              {/* PAYMENT STATUS */}
              <Grid size={{ xs: 12, sm: 6 }}>
                {selectedStudio?.plan ? (
                  <>
                    <CustomTextField
                      select
                      fullWidth
                      label='Payment Status *'
                      value={formData.isPaid}
                      onChange={e => handleChange('isPaid', e.target.value)}
                      disabled={selectedStudio.plan.paymentMode === 'online'}
                    >
                      <MenuItem value='true'>Paid</MenuItem>
                      <MenuItem value='false'>Unpaid</MenuItem>
                    </CustomTextField>

                    {selectedStudio.plan.paymentMode === 'online' && (
                      <Typography variant='caption' color='text.secondary'>
                        Online payments cannot be changed manually
                      </Typography>
                    )}
                  </>
                ) : (
                  <CustomTextField fullWidth label='Payment Status' value='No Active Plan' disabled />
                )}
              </Grid>

              {selectedStudio?.plan && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    fullWidth
                    label='Payment Mode'
                    value={paymentModeLabel[selectedStudio.plan.paymentMode] || '—'}
                    disabled
                  />
                </Grid>
              )}

              {/* PLAN INFO */}
              <Grid size={{ xs: 12 }}>
                {selectedStudio?.plan ? (
                  <Box
                    sx={{
                      p: 3,
                      border: '1px solid',
                      borderColor: 'success.main',
                      borderRadius: 2,
                      backgroundColor: 'success.light'
                    }}
                  >
                    <Typography variant='h6'>Active Plan</Typography>

                    <Typography>
                      <strong>Plan:</strong> {selectedStudio.plan.title}
                    </Typography>
                    <Typography>
                      <strong>Billing:</strong> {selectedStudio.plan.billingType}
                    </Typography>
                    <Typography>
                      <strong>Amount:</strong> ₹{selectedStudio.plan.amount}
                    </Typography>
                    <Typography>
                      <strong>Payment Mode:</strong> {paymentModeLabel[selectedStudio.plan.paymentMode]}
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      border: '1px dashed',
                      borderColor: 'error.main',
                      borderRadius: 2,
                      backgroundColor: 'error.light'
                    }}
                  >
                    <Typography variant='h6' color='error.main'>
                      No Active Plan
                    </Typography>

                    <Typography color='error.dark'>This studio does not have any active subscription plan.</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant='contained' onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default StudioListTable
