// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import useAPI from '../../@core/hooks/useAPI'
import { OnChainImage } from 'src/components/bfiles/Image'

import Image from 'next/image'

import Link from 'next/link'

import styled from 'styled-components'

import moment from 'moment'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { useEffect, useState } from 'react'
import { TextField } from '@mui/material'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useDateRange from 'src/hooks/useDateRange'
import { DateSpan, Dates } from '../_app'

import useBus from 'use-bus'

interface Ranking {
  content_txid: string;
  content_type?: string;
  content_text?: string;
  count: number;
  difficulty: number;
}

const WhiteLink = styled.a`
  color: white;
`

function Rankings({startDate, endDate}: Dates) {

  const [start, setStartDate] = useState(startDate)
  const [end, setEndDate] = useState(endDate)

  let { data, error, loading, refresh } = useAPI(`/api/v1/boost/rankings?start_date=${moment(start).unix()}`)

  console.log('result', { data, error, loading })

  useBus(
    'date_range_from_updated',
    ({value}) => {
      console.log('DATE RANGE FROM UPDATED VIA BUS!', value)

      console.log('moment', moment(value).toDate())
      console.log('unix', moment(value).unix())

      setStartDate(value)

      refresh()
    },
    [startDate],
  )

  useBus(
    'date_range_to_updated',
    ({value}) => {
      console.log('DATE RANGE TO UPDATED VIA BUS!', value)

      setEndDate(value)
      refresh()
    },
    [endDate],
  )

  if (!data && !error) {
    return <>Loading</>
  }

  if (error) {
    return <div>
      <h2>Error</h2>
      <h5>{error}</h5>
    </div>
  }

  const { rankings } = data
  return (
    <Grid container spacing={6}>

      {rankings.map((job: Ranking) => {
          return (
            <Grid item xs={12}>
            <Card>
              <CardHeader title={`${job.difficulty} ${job.content_type || ''}`}></CardHeader>
              <CardContent>
              <small ><Link target="_blank" href={`https://whatsonchain.com/${job.content_txid}`}>
                <WhiteLink>{job.content_txid}</WhiteLink>
                </Link></small>

              {job.content_type?.match('image') && (
                
                <Image src={`https://bitcoinfileserver.com/${job.content_txid}`} width={'100%'} height={'100%'} layout={'responsive'}/>
              )}

              
              {job.content_type?.match('text/plain') && (
                
                <p>{job.content_text}</p>
              )}

  
              </CardContent>
            </Card>
          </Grid>
          )
      })}

    </Grid>
  )
}

const Top = () => {

  return <>
    <DateSpan.Consumer>
      {({ startDate, endDate }) => (
        <Rankings startDate={startDate} endDate={endDate} />
      )}
    </DateSpan.Consumer>
  </>

}

export default Top
