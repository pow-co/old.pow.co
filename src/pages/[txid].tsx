import useAPI from '../@core/hooks/useAPI'

import { useRouter } from 'next/router'

//import { ContentCard } from './top/index-new'

import CardContent from '@mui/material/CardContent'
import loader from 'src/loader'
import OnchainEvent from 'src/components/OnchainEvent'
import Twetch from 'src/components/bfiles/Twetch'
import { Boost } from './top/index-new'
import Image from 'next/image'
import { Card, CardHeader, useTheme } from '@mui/material'
import Link from 'next/link'
import { BlackLink, WhiteLink } from './top'


export default function ShowTransaction() {

    const { query } = useRouter()

    const theme = useTheme()

    const { data, error, loading } = useAPI(`/api/v1/content/${query.txid}`)

    if (!data) {
        return <></>
    }

    console.log("content", data.content)

    var content = {...data.content, content_txid: data.content.txid}

    return <>
        <Card>
        <CardHeader sx={{}}
                title={<div><span>{content.difficulty?.toFixed(3)} ⛏️</span> <small><Link rel="noreferrer"  href={`/${content.content_txid}`}>
                  {theme.palette.mode === 'dark' ? <WhiteLink>{content.content_txid}</WhiteLink> : <BlackLink>{content.content_txid}</BlackLink>}
                </Link></small></div>}
              ></CardHeader>

              <CardContent>

                {content.content_type?.match('image') && (                
                  <img src={`data:image/jpeg;base64,${content.content_text}`} style={{width: '100%', height: '100%'}}/>
                )}
                
                {content.content_type?.match('text/plain') && (
                  
                  <p>{content.content_text}</p>
                )}

                {content.content_type?.match('markdown') && (
                  
                  <div dangerouslySetInnerHTML={{ __html: content.content_text || ''}} />
                )}

                <OnchainEvent txid={content.content_txid}/>

                <Twetch txid={content.content_txid}/>
  
                <Boost sx={{float: 'right', maxWidth: '100px'}} job={content} />

              </CardContent>
              </Card>

    </>

}