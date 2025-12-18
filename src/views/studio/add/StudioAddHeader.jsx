// MUI Imports
import { useParams, useRouter } from 'next/navigation'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const StudioAddHeader = ({ onPublish }) => {
  const { lang: locale } = useParams()

  return (
    <div className='flex flex-wrap sm:items-center justify-between gap-6'>
      <Typography variant='h4'>Add a New Studio</Typography>

      <div className='flex gap-4'>
        <Button variant='tonal' color='secondary' href={`/${locale}/studio/list`}>
          Cancel
        </Button>
        {/* <Button variant='tonal'>Save Draft</Button> */}
        <Button variant='contained' onClick={onPublish}>
          Submit
        </Button>
      </div>
    </div>
  )
}

export default StudioAddHeader
