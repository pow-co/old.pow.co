
interface ImageParams {
    data: string;
    contentType?: string;
    encoding?: string;
    alt?: string;
}

export function Image({ data, contentType, encoding, alt }: ImageParams) {

    contentType = contentType || 'image/jpeg'

    encoding = encoding || 'base64'

    return <img alt={alt} src={`data:${contentType};${encoding},${data}`}/>
}

