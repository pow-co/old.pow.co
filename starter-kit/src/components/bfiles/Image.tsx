
import useSWR from 'swr'

import axios from 'axios';

interface ImageParams {
    data: string;
    contentType?: string;
    encoding?: string;
}

const bitcoinfilesProvider = 'https://bitcoinfilesystem.com'

const fetcher = (url: string): Promise<any> => axios.get(url).then(res => res.data)

export function OnChainImage({ txid }: { txid: string }) {

    const url = `${bitcoinfilesProvider}/${txid}`

    console.log('useSWR', url)

    const { data, error } = useSWR(url, fetcher)

    console.log('useSWR.result', { url, data })

    return <Image data={data} />
}

export function Image({ data, contentType, encoding }: ImageParams) {

    contentType = contentType || 'image/jpeg'

    encoding = encoding || 'base64'

    return <img src={`data:${contentType};${encoding},${data}`}/>
}