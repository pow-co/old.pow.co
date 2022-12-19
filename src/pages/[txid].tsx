import useAPI from '../@core/hooks/useAPI'

import { useRouter } from 'next/router'

import { ContentCard } from './top/index-new'

export default function ShowTransaction() {

    const { query } = useRouter()

    const { data, error, loading } = useAPI(`/api/v1/content/${query.txid}`)

    if (!data) {
        return <></>
    }

    console.log("content", data.content)

    var content = {...data.content, content_txid: data.content.txid}

    return <>
        <ContentCard job={content}/>
    </>

}