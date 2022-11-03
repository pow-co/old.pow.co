
import useSWR from 'swr'

import axios from 'axios';

interface ImageParams {
    data: string;
    contentType?: string;
    encoding?: string;
    alt?: string;
}

const bitcoinfilesProvider = 'https://bitcoinfilesystem.com'

const fetcher = (url: string): Promise<any> => axios.get(url).then(res => res.data)

export function OnChainImage({ txid, alt }: { txid: string, alt?: string }) {

    const url = `${bitcoinfilesProvider}/${txid}`

    console.log('useSWR', url)

    const { data } = useSWR(url, fetcher)

    console.log('useSWR.result', { url, data })

    return <Image alt={alt} data={data} />
}

export function Image({ data, contentType, encoding, alt }: ImageParams) {

    contentType = contentType || 'image/jpeg'

    encoding = encoding || 'base64'

    return <img alt={alt} src={`data:${contentType};${encoding},${data}`}/>
}