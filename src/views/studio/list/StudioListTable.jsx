'use client'

// React Imports
import { useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// NextAuth
import { useSession, signOut } from 'next-auth/react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
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

// Toast
import { useToast } from '@/contexts/ToastContext'

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
  const [selectedStudio, setSelectedStudio] = useState(null)

  // 🔐 Auto logout if session expired
  if (status === 'unauthenticated') {
    signOut({ callbackUrl: '/en/login' })

    return null
  }

  const handleToggleStatus = async (studioId, currentStatus) => {
    if (!session?.accessToken) {
      await signOut({ callbackUrl: '/login' })

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
      await signOut({ callbackUrl: '/en/login' })

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
        await signOut({ callbackUrl: '/en/login' })

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
    </Card>
  )
}

export default StudioListTable
