
import { useRouter } from 'next/router';

export default function HandcashAuthSuccess() {

    const { query } = useRouter();

    const { authToken } = query

    return (
        <>
            <div className='card'>

                <h1>Handcash Auth Success</h1>

                {authToken && <p>authToken: {authToken}</p>}

            </div>
        </>
    )

}