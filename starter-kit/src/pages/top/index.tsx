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

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { useState } from 'react'
import { TextField } from '@mui/material'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

const Top = () => {

  const [date, setDate] = useState<Date>()

  let { data, error, loading } = useAPI('/api/v1/boost/rankings')

  console.log('result', { data, error, loading })

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


  function handleChange(value: Date) {
    setDate(value)
  }

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

export default Top
