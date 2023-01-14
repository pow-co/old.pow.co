
import Box from '@mui/material/Box'

import { useState } from 'react'

import { wrapRelayx } from 'stag-relayx'

import axios from 'axios'

//import { wrapRelayx } from '/Users/zyler/github/stagwallet/stag-relayx'

import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

export default function SearchBar() {

    const router = useRouter()

    const [formInput, setFormInput] = useState()
    const [submitting, setSubmitting] = useState<boolean>(false)

    //@ts-ignore
    const stag = wrapRelayx(window.relayone)


    async function onSubmit(e: any) {

        e.preventDefault()

        if (!formInput) {
            return
        }

        setSubmitting(true)

        try {

            console.log('link.submit', formInput)

            toast('Verifying Your URL Link', {
                icon: '👏',
                style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                },
            });

            console.log('stag.onchain.findOrCreate', {
                where: {
                    app: 'pow.co',
                    type: 'url',
                    content: {
                        url: formInput
                    }
                },
                defaults: {
                    app: 'pow.co',
                    type: 'url',
                    content: {
                        url: formInput
                    }
                }
            })

            const [result, isNew] = await stag.onchain.findOrCreate({
                where: {
                    app: 'pow.co',
                    type: 'url',
                    content: {
                        url: formInput
                    }
                },
                defaults: {
                    app: 'pow.co',
                    type: 'url',
                    content: {
                        url: formInput
                    }
                }
            })

            console.log('stag.onchain.findOrCreate.result', {result, isNew})

            // redirect to /[result.txid]

            router.push(`/${result.txid}`)
            /*
            if (isNew) {

                toast('Posted URL On Chain...Now Boosting', {
                    icon: '👏',
                    style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    },
                });
            } else {

                toast('URL Found Already On Chain...Now Boosting', {
                    icon: '👏',
                    style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    },
                });
            }

            const {txid} = result

            const {data} = await axios.get(`https://pow.co/api/v1/boostpow/${txid}/new?difficulty=0.025`)

            console.log('axios data', data)

            const boostBuyResult = await stag.boost.buy({
                content: txid,
                difficulty: 0.025,
                value: data.outputs[0].amount
            })

            toast('Boostpow Job Purchased', {
                    icon: '👏',
                    style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    },
            });

            console.log({boostBuyResult})*/

            setSubmitting(false)


        } catch(error) {

            setSubmitting(false)


            console.error(error)
        }

    }

    function onChange({target: {value}}: any) {

        console.log(value)

        setFormInput(value)

    }

    return (
        <>
            <Box sx={{width: '100%'}}>

                <form onSubmit={onSubmit}>
                    {submitting ? (
                    <input onChange={onChange} disabled placeholder='Please Wait While Transaction Is Posting' style={{width: '100%', padding: '1em', border: '1px solid #eee', borderRadius: '0.5em'}} value={formInput} type='search' />

                    ) : (
                        <input onChange={onChange} placeholder='Share any URL' style={{width: '100%', padding: '1em', border: '1px solid #eee', borderRadius: '0.5em'}} value={formInput} type='search' />

                    )}
                </form>
            </Box>

        </>
      )
}