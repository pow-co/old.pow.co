

//import { JitsiMeeting } from '@jitsi/react-sdk';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import Script from 'next/script';

import { ReactNode, useEffect, useState } from 'react'

//import BlankLayout from 'src/@core/layouts/BlankLayout'
import UserLayout from 'src/layouts/UserLayout';

import { useAuth } from 'src/hooks/useAuth'

const MINIMUM_POWCO_BALANCE = 1

function DailyStandup() {

    const { user, powcoBalance } = useAuth()

    const [jitsiInitialized, setJitsiInitialized] = useState<boolean>(false)

    useEffect(() => {

        if (powcoBalance && powcoBalance >= MINIMUM_POWCO_BALANCE) {

            // @ts-ignore
            if (!window.JitsiMeetExternalAPI) { return }

            if (jitsiInitialized) { return }

            setJitsiInitialized(true)

            const domain = 'meet.jit.si';
            const options = {
                roomName: 'vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cd/daily-boostpow-costly-signals',
                width: '100%',
                height: 700,
                parentNode: document.querySelector('#jitsi-daily-meeting'),
                lang: 'en',
                userInfo: {
                    displayName: `${user?.paymail} ${powcoBalance} POWCO`,
                    email: user?.paymail || '',
                    avatarUrl: `https://bitpic.network/u/${user?.paymail}`

                },
                configOverwrite: {
                    prejoinPageEnabled: false,
                    startWithAudioMuted: true,
                    startWithViudeMuted: true
                },
            };

            // @ts-ignore
            new window.JitsiMeetExternalAPI(domain, options);

        }

    // @ts-ignore
    }, [window.JitsiMeetExternalAPI])

    return (

        <>
            <Script src={'https://8x8.vc/external_api.js'} />

            <Grid key={1234} item xs={12}>
                <Card>
                <CardHeader title={`Daily Discussion of Boostpow Costly Signals`}></CardHeader>
                <CardContent>
                    {(powcoBalance && powcoBalance > -1 && powcoBalance < MINIMUM_POWCO_BALANCE) && (
                        <p>Error: {MINIMUM_POWCO_BALANCE} POWCO required to attend daily meetings.</p>
                    )}
                    
                    <div id="jitsi-daily-meeting"></div>

                </CardContent>
                </Card>
            </Grid>

        </>
    )

};

DailyStandup.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

DailyStandup.guestGuard = true;

export default DailyStandup;
