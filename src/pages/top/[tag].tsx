
import { useRouter } from 'next/router'


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

import { useEffect, useState } from 'react'

import { DateSpan, Dates } from '../_app'

import useBus from 'use-bus'

import { fetcher } from '../../@core/hooks/useAPI'

import YouTube from 'react-youtube';

import useSWR from 'swr'

import Twetch from 'src/components/bfiles/Twetch'

import BoostpowButton from 'boostpow-button'
import { BoostButton } from 'myboostpow-lib'
//import 'myboostpow-lib/dist/tailwind.css'

import { Box } from '@mui/material'

import toast from 'react-hot-toast'

import loader from '../../loader'
import useDateRange from 'src/hooks/useDateRange'

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

function OnchainEvent({ txid }: {txid: string}) {

  // @ts-ignore
  const { data } = useSWR(`https://onchain.sv/api/v1/events/${txid}`, fetcher)

  if (!data || data.events.length === 0) {
    return <></>
  }

  const [event] = data.events

  if (event.app === 'powstream.com') {

    if (event.type === 'youtube_video_metadata' && event.author === '1D1hSyDc7UF4KbGFTSSXLirCBepjcN19GN') {

      return <YoutubeMetadataOnchain txid={txid} event={event}/>

    }
  }

  if (event.app === 'egoboost.vip') {

    return <>
    <h3><a className="egoboost-link" href={`https://egoboost.vip`}>EgoBoost.VIP</a></h3>

    <h3>Paymail: {event.content?.paymail}</h3>
  </>
  }

  if (event.app === '1HWaEAD5TXC2fWHDiua9Vue3Mf8V1ZmakN') { // askbitcoin.ai

    if (event.type === 'question') {
      
      return <>
        <h3><a className="askbitcoinLink" href={`https://askbitcoin.ai/questions/${event.txid}`}>AskBitcoin.AI Question:</a></h3>

        <h3>Question: {event.content.content}</h3>
      </>
    }

    if (event.type === 'answer') {

      return <>
        <h3><a className="askbitcoinLink" href={`https://askbitcoin.ai/answers/${event.txid}`}>AskBitcoin.AI Answer:</a></h3>
        <h4>{event. content.content}</h4>
      </>
    }

  }

  if (event.app === 'boostpatriots.win' && event.author === "18h6yhKBBqXQge6XRauMTeEaQ9HF4jR1qV") {

    return <>
      <h3><a rel="noreferrer"  href={`https://boostpatriots.win${event.content.href}`}>BoostPatriots.Win</a></h3>
      <h4>{event.content.title}</h4>
    </>
  }

  return (
    <>
    </>
  )

}

function YoutubeMetadataOnchain({event}: {txid: string, event: any}) {

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

    const router = useRouter()

    var tag = String(router.query.tag)

   tag = Buffer.from(tag, 'utf8').toString('hex')

   console.log('TAG', tag)

  const [start, setStartDate] = useState(startDate)

  const { data, error, refresh } = useAPI(`/api/v1/boost/rankings?tag=${tag}&start_date=${moment(start).unix()}`)

  const { setStartDate: globalSetStartDate } = useDateRange()


  useEffect(() => {

      setStartDate(moment().subtract(5, 'years').toDate())

      //globalSetStartDate(moment().subtract(5, 'years').toDate())

      //refresh()


  }, [])


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

  function onBoostSuccess() {

    toast('boost success')
  }

  function onBoostError() {

    toast('boost error')
    
  }

  function onBoostClick() {

    toast('boost clicked')

  }

  function Boost({sx, job}: any) {
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

  return (
    <Grid container spacing={6}>
        <h1>Top By Tag: {router.query.tag}</h1>

      {rankings.map((job: Ranking) => {
        
          return (
            <Grid key={job.content_txid} item xs={12}>
            <Card>
              <CardHeader sx={{}}
                title={<div><span>{job.difficulty.toFixed(3)} ⛏️</span> <small><Link target="_blank" rel="noreferrer"  href={`https://whatsonchain.com/${job.content_txid}`}>
                <WhiteLink>{job.content_txid}</WhiteLink>
                </Link></small></div>}
              ></CardHeader>

              <CardContent>

                

                {/*{job.content_type?.match('image') && (
                  
                  <Image alt='bitcoin file server image' loader={loader} src={`https://bitcoinfileserver.com/${job.content_txid}`} width={'100%'} height={'100%'} layout={'responsive'}/>
                )}*/}

                                {/*
                {job.content_type?.match('text/plain') && (
                  
                  <p>{job.content_text}</p>
                )}

                {job.content_type?.match('markdown') && (
                  
                  <div dangerouslySetInnerHTML={{ __html: job.content_text || ''}} />
                )}

                <OnchainEvent txid={job.content_txid}/>

                <Twetch txid={job.content_txid}/>
  
                <Boost sx={{float: 'right', maxWidth: '100px'}} job={job} />

                */}


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
