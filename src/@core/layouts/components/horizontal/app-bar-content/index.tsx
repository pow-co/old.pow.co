// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'
import Image from 'next/image'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

import { TextField } from '@mui/material'

import moment from 'moment'

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
  horizontalAppBarContent?: (props?: any) => ReactNode
  horizontalAppBarBranding?: (props?: any) => ReactNode
}

const StyledLink = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

import { useState } from 'react'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import useDateRange from 'src/hooks/useDateRange'

import { dispatch } from 'use-bus'
import loader from 'src/loader'

const AppBarContent = (props: Props) => {
  // ** Props
  const {
    horizontalAppBarContent: userHorizontalAppBarContent,
    horizontalAppBarBranding: userHorizontalAppBarBranding
  } = props

  // ** Hooks
  const theme = useTheme()

  const { startDate, setStartDate, endDate, setEndDate } = useDateRange()

  
  function handleChangeFrom(value: any) {
    setStartDate(value)

    dispatch({ type: 'date_range_from_updated', value })
  }

  function handleChangeTo(value: any) {
    setEndDate(value)

    dispatch({ type: 'date_range_to_updated', value })
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {userHorizontalAppBarBranding ? (
        userHorizontalAppBarBranding(props)
      ) : (
        <>
        <Link href='/' passHref>
          <StyledLink>
            <Image loader={loader} src={`https://doge.bitcoinfiles.org/63276afcc38dd807ca518eaafaf1544b53f76e9fb21846a6a17baad8b9a83555`} width={25} height={25}/>
          <Typography
              variant='h6'
              sx={{
                ml: 3,
                fontWeight: 600,
                lineHeight: 'normal',
                textTransform: 'uppercase'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </StyledLink>

        </Link>
        <Link href='/tags' passHref>
          Tags
        </Link>
        <Link href='/posts/new' passHref>
          Post
        </Link>
        <Link href='/meet' passHref>
          Meet
        </Link>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <MobileDatePicker
            inputFormat="MM/DD/YYYY"
            value={startDate}
            onChange={handleChangeFrom}
            renderInput={(params) => <TextField {...params} />}
          />

        </LocalizationProvider>
        </>
      )}
      {userHorizontalAppBarContent ? userHorizontalAppBarContent(props) : null}
    </Box>
  )
}

export default AppBarContent
