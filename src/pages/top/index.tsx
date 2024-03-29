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

import BoostpowButton from 'boostpow-button'
import { BoostButton } from 'myboostpow-lib'
//import 'myboostpow-lib/dist/tailwind.css'

import { Box, useTheme } from '@mui/material'

import toast from 'react-hot-toast'

import loader from '../../loader'

import hljs from 'highlight.js'

const Markdown = require('react-remarkable')

const RemarkableOptions = {
  breaks: true,
  html: true,
  typographer: true,
  highlight: function (str: any, lang: any) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) {}

    return ''; // use external default escaping
  }
}

interface Ranking {
  content_txid: string;
  content_type?: string;
  content_text?: string;
  count: number;
  difficulty: number;
}

export const WhiteLink = styled.a`
  color: white;
  font-size: 70%;
  &:hover {
    cursor: pointer;
  }
`

export const BlackLink = styled.a`
  color: black;
  font-size: 70%;
  &:hover {
    cursor: pointer;
  }
`

import OnchainEvent from 'src/components/OnchainEvent'

/*function OnchainEvent({ txid }: {txid: string}) {

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

}*/

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

  const [start, setStartDate] = useState(startDate)

  const { data, error, refresh } = useAPI(`/api/v1/boost/rankings?start_date=${moment(start).unix()}`)

  const theme = useTheme()

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
        onSuccess={onBoostSuccess}
        onError={onBoostError}
      />
      {/* <BoostpowButton
          content={job.content_txid}
          currency={'USD'}
          value={0.05}
          onSuccess={onBoostSuccess}
          onError={onBoostError}
          onClick={onBoostClick}
        /> */}
    </Box>
  }

  return (
    <Grid container spacing={6}>

      {rankings.map((job: Ranking) => {
        
          return (
            <Grid key={job.content_txid} item xs={12}>
            <Card>
              <CardHeader sx={{}}
                title={<div><span>{job.difficulty.toFixed(3)} ⛏️</span> <small><Link rel="noreferrer"  href={`/${job.content_txid}`}>
                  {theme.palette.mode === 'dark' ? <WhiteLink>{job.content_txid}</WhiteLink> : <BlackLink>{job.content_txid}</BlackLink>}
                </Link></small></div>}
              ></CardHeader>

              <CardContent>



                {job.content_type?.match('image') && (                
                  <img src={`data:image/jpeg;base64,${job.content_text}`} style={{width: '100%', height: '100%'}}/>
                )}

                
                {job.content_type?.match('text/plain') && (
                  
                  <p>{job.content_text}</p>
                )}

                {job.content_type?.match('markdown') && (


                  <Markdown options={RemarkableOptions} source={job.content_text} />                  

                )}

                <OnchainEvent txid={job.content_txid}/>
                 

                <Twetch txid={job.content_txid}/>
                  {/* */}

                <Boost sx={{float: 'right', maxWidth: '100px'}} job={job} />

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

