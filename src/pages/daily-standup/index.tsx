

//import { JitsiMeeting } from '@jitsi/react-sdk';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import Script from 'next/script';

import { ReactNode, useEffect, useState } from 'react'

//import BlankLayout from 'src/@core/layouts/BlankLayout'
import UserLayout from 'src/layouts/UserLayout';

import { useAuth } from 'src/hooks/useAuth'
import Link from 'next/link';

import Button from '@mui/material/Button'

import axios from 'axios'

const MINIMUM_POWCO_BALANCE = 3

function DailyStandup() {

    const { user, powcoBalance } = useAuth()

    const [jitsiInitialized, setJitsiInitialized] = useState<boolean>()

    const [nJitsis, setNJitsis] = useState<number>(1)

    useEffect(() => {

        setNJitsis(nJitsis + 1)

        if (user && powcoBalance && powcoBalance >= MINIMUM_POWCO_BALANCE) {

            // @ts-ignore
            if (!window.JitsiMeetExternalAPI) { return }

            if (jitsiInitialized) { return }

            setJitsiInitialized(true)

            const token = localStorage.getItem('powco.auth.relayx.token');

            axios.post('https://pow.co/api/v1/jaas/auth', {
                wallet: 'relay',
                paymail: user.paymail,
                token
            })
            .then(({data}) => {

                const domain = "8x8.vc";

                const options = {
                    jwt: data.jwt,                
                    roomName: 'vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/SampleAppWorthyTruthsClarifyClearly',
                    width: '100%',
                    height: 700,
                    parentNode: document.querySelector('#jitsi-daily-meeting'),
                    lang: 'en',
                    configOverwrite: {
                        prejoinPageEnabled: false,
                        startWithAudioMuted: true,
                        startWithVideoMuted: true
                    },
                };

    
                // @ts-ignore
                var jitsi = new window.JitsiMeetExternalAPI(domain, options);

                console.log({ nJitsis })

                return function() {
                        
                        jitsi.dispose()
                }
            })
            .catch(error => {

                console.log('AUTH ERROR', error)

            })



        }

    // @ts-ignore
    }, [window.JitsiMeetExternalAPI])

    return (

        <>
            <Script src={'https://8x8.vc/vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/external_api.js'} />

            <Grid key={1234} item xs={12}>
                <Card>
                <CardHeader title={`Daily Discussion of Boostpow Costly Signals`}></CardHeader>
                <CardContent>

                    {user ? (
                        <>

                        {(powcoBalance !== null && powcoBalance > -1 && powcoBalance < MINIMUM_POWCO_BALANCE) ? (

                            <div>
                                <p>{MINIMUM_POWCO_BALANCE} POWCO required to attend daily meetings.</p>

                                    <Link passHref target='_blank' href='https://relayx.com/market/93f9f188f93f446f6b2d93b0ff7203f96473e39ad0f58eb02663896b53c4f020_o2'>
                                        <Button component='a' variant='contained' sx={{ px: 5.5 }}>
                                            Buy Now
                                        </Button>
                                    </Link>
                            </div>  

                        ) : (
                            <div>
                                <div id="jitsi-daily-meeting"></div>
                            </div>

                        )}
                        </>

  
                    ) : ( 
                        <div>
                            <p>Please login to join the daily meeting.</p>

                            <Link passHref href='/login'>
                                <Button component='a' variant='contained' sx={{ px: 5.5 }}>
                                    Login
                                </Button>
                            </Link> 
                        </div>
                    )}
                

                </CardContent>
                </Card>
            </Grid>

        </>
    )

};

DailyStandup.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

DailyStandup.guestGuard = false;

export default DailyStandup;
