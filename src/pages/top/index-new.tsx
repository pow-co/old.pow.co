// ** MUI Imports
import Card from '@mui/material/Card'

import Grid from '@mui/material/Grid'

import CardHeader from '@mui/material/CardHeader'

import CardContent from '@mui/material/CardContent'

import useAPI from '../../@core/hooks/useAPI'

import {  } from 'src/components/bfiles/Image'

import Image from 'next/image'

import Link from 'next/link'

import styled from 'styled-components'

import moment from 'moment'

import { useState } from 'react'

import { DateSpan, Dates } from '../_app'

import useBus from 'use-bus'



//import Twetch from 'src/components/bfiles/Twetch'

import BoostpowButton from 'boostpow-button'
import { BoostButton } from 'myboostpow-lib'
//import 'myboostpow-lib/dist/tailwind.css'

import { Box } from '@mui/material'

import toast from 'react-hot-toast'

import loader from '../../loader'

interface Ranking {
  content_txid: string;
  content_type?: string;
  content_text?: string;
  count: number;
  difficulty: number;
}

const WhiteLink = styled.a`
  color: white;
  font-size: 70%;
`
import OnchainEvent from '../../components/OnchainEvent'

function onBoostSuccess() {

  toast('boost success')
}

function onBoostError() {

  toast('boost error')
  
}

function onBoostClick() {

  toast('boost clicked')

}

export function Boost({sx, job}: any) {
  return <Box sx={sx}>
    <BoostButton 
        content={job.content_txid}
        value={124_000}
        tag='pow.co'
        onSuccess={onBoostSuccess}
        onError={onBoostError}
      />
    {/* <BoostpowButton
        content={job.content_txid}
        currency={'USD'}
        value={0.05}
        tag={'pow.co'}
        onSuccess={onBoostSuccess}
        onError={onBoostError}
        onClick={onBoostClick}
      /> */}
  </Box>
}

export function ContentCard({job}: {job: any}) {

  console.log('Content Card', job)

  return <Card>
    <CardHeader sx={{}}
      title={<div><span>{job.difficulty?.toFixed(3)} ⛏️</span> <small><Link target="_blank" rel="noreferrer"  href={`https://whatsonchain.com/${job.content_txid}`}>
      <WhiteLink>{job.content_txid}</WhiteLink>
      </Link></small></div>}
    ></CardHeader>

    <CardContent>            

      {job.content_type?.match('image') && (
        
        <Image alt='bitcoin file server image' loader={loader} src={`https://bitcoinfileserver.com/${job.content_txid}`} width={'100%'} height={'100%'} layout={'responsive'}/>
      )}

      
      {job.content_type?.match('text/plain') && (
        
        <p>{job.content_text}</p>
      )}

      {job.content_type?.match('markdown') && (
        
        <div dangerouslySetInnerHTML={{ __html: job.content_text || ''}} />
      )}

      <OnchainEvent txid={job.content_txid}/>

      {/*<Twetch txid={job.content_txid}/>*/}

      <Boost sx={{float: 'right', maxWidth: '100px'}} job={job} />

    </CardContent>
  </Card>


}

function Rankings({startDate, endDate}: Dates) {

  const [start, setStartDate] = useState(startDate)

  const { data, error, refresh } = useAPI(`/api/v1/boost/rankings?start_date=${moment(start).unix()}`)

  useBus(
    'date_range_from_updated',
    ({value}) => {

      setStartDate(value)

      refresh()
    },
    [startDate],
  )

  useBus(
    'date_range_to_updated',
    () => {
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

  const { rankings } = data;
  


  return (
    <Grid container spacing={6}>

      {rankings.map((job: Ranking) => {
        
          return (
            <Grid key={job.content_txid} item xs={12}>
              <ContentCard job={job}/>
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
