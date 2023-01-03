
import useSWR from 'swr'

import { YoutubeMetadataOnchain } from "./YoutubeMetadataOnchain"

import { LinkPreview } from '@dhaiwat10/react-link-preview';

import Gist from "react-gist";

import { fetcher } from '../@core/hooks/useAPI'
import PowcoDevIssue from './feed/PowcoDevIssue';

const customFetcher = async (url: string) => {
    const response = await fetch(`https://link-preview-proxy.pow.co/v2?url=${url}`);
    const json = await response.json();
    return json.metadata;
};  

export default function OnchainEvent({ txid }: {txid: string}) {

    console.log('OnchainEvent', { txid})

    // @ts-ignore
    const { data } = useSWR(`https://onchain.sv/api/v1/events/${txid}`, fetcher)
  
    if (!data || data.events.length === 0) {
      return <></>
    }
  
    var [event] = data.events
  
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
  
    if (event.app === 'powco.dev' && event.type === 'github.issue') {

      return <PowcoDevIssue event={event} />

  
    }
  
    if (event.type === 'url') {
  
      if (event.content.url.match('https://gist.github.com')) {
  
        const id = event.content.url.split('/').pop()
  
        return <>
              <small><a href='{event.content.html_url}' className='blankLink'>{event.content.url}</a></small>
  
              <Gist id={id} />
  
        </>
  
      }
      
      const url = event.content.url || event.content
  
      return <>
        <LinkPreview url={url} fetcher={customFetcher} fallback={<div>  
          <small><a target='_blank' href={event.content.html_url} className='blankLink'>{event.content.html_url}</a></small>
          <h3>{event.content.url}</h3>
        </div>} />
  
      </>
  
    }
  
    return (
      <>
      </>
    )
  
  }