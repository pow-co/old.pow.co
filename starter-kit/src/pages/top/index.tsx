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

import { fetcher } from '../../@core/hooks/useAPI'

import YouTube from 'react-youtube';

import useSWR from 'swr'
import Twetch from 'src/components/bfiles/Twetch'

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

function OnchainEvent({ txid }: {txid: string}) {

  // @ts-ignore
  const { data } = useSWR(`https://onchain.sv/api/v1/events/${txid}`, fetcher)

  if (!data || data.events.length === 0) {
    return <></>
  }

  const [event] = data.events

  console.log('EVENT', event)

  if (event.app === 'powstream.com') {

    if (event.type === 'youtube_video_metadata' && event.author === '1D1hSyDc7UF4KbGFTSSXLirCBepjcN19GN') {

      return <YoutubeMetadataOnchain txid={txid} event={event}/>

    }
  }

  if (event.app === '1HWaEAD5TXC2fWHDiua9Vue3Mf8V1ZmakN') { // askbitcoin.ai

    if (event.type === 'question') {

      console.log('askbitcoin.ai.question', event)
      
      return <>
        <h3><a className="askbitcoinLink" href={`https://askbitcoin.ai/questions/${event.txid}`}>AskBitcoin.AI Question:</a></h3>

        <h3>Question: {event.content.content}</h3>
      </>
    }

    if (event.type === 'answer') {

      console.log('askbitcoin.ai.answer', event)

      return <>
        <h3><a className="askbitcoinLink" href={`https://askbitcoin.ai/answers/${event.txid}`}>AskBitcoin.AI Answer:</a></h3>
        <h4>{event. content.content}</h4>
      </>
    }

  }

  if (event.app === 'boostpatriots.win' && event.author === "18h6yhKBBqXQge6XRauMTeEaQ9HF4jR1qV") {

    console.log('BOOST PATRIOTS', event)

    return <>
      <h3><a rel="noreferrer"  href={`https://boostpatriots.win${event.content.href}`}>BoostPatriots.Win</a></h3>
      <h4>{event.content.title}</h4>
    </>
  }

  return (
    <>
      <h1>{data.events[0].content.title}</h1>
      <h4>by {data.events[0].content.author_name}</h4>
      <p>txid: {txid}</p>    
    </>
  )

}

function YoutubeMetadataOnchain({txid, event}: {txid: string, event: any}) {

  console.log('youtube', {txid, event})

  const opts = {
    //height: '390',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  return (
    <>

      <YouTube videoId={event.content.video_id} opts={opts}/>
    </>
  )

}

function Rankings({startDate, endDate}: Dates) {

  const [start, setStartDate] = useState(startDate)

  const { data, error, loading, refresh } = useAPI(`/api/v1/boost/rankings?start_date=${moment(start).unix()}`)

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
            <Card>
              <CardHeader title={`${job.difficulty} ${job.content_type || ''}`}></CardHeader>
              <CardContent>
                <small ><Link target="_blank" rel="noreferrer"  href={`https://whatsonchain.com/${job.content_txid}`}>
                  <WhiteLink>{job.content_txid}</WhiteLink>
                  </Link></small>

                {job.content_type?.match('image') && (
                  
                  <Image alt='bitcoin file server image' src={`https://bitcoinfileserver.com/${job.content_txid}`} width={'100%'} height={'100%'} layout={'responsive'}/>
                )}

                
                {job.content_type?.match('text/plain') && (
                  
                  <p>{job.content_text}</p>
                )}

                <OnchainEvent txid={job.content_txid}/>

                <Twetch txid={job.content_txid}/>
  
              </CardContent>
            </Card>
          </Grid>
          )
      })}

    </Grid>
  )
}

const Top = () => {

  console.log("TOP INDEX PAGE")

  return <>
    <DateSpan.Consumer>
      {({ startDate, endDate }) => (
        <Rankings startDate={startDate} endDate={endDate} />
      )}
    </DateSpan.Consumer>
  </>

}

export default Top
