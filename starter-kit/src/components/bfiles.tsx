
interface ImageParams {
    data: string;
    contentType?: string;
    encoding?: string;
}

export function Image({ data, contentType, encoding }: ImageParams) {

    contentType = contentType || 'image/jpeg'

    encoding = encoding || 'base64'

    return <img src={`data:${contentType};${encoding},${data}`}/>
}

