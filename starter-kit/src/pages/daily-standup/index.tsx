
//import { JitsiMeeting } from '@jitsi/react-sdk';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import Script from 'next/script';

import { ReactNode, useEffect } from 'react'

//import BlankLayout from 'src/@core/layouts/BlankLayout'
import UserLayout from 'src/layouts/UserLayout';

import { useAuth } from 'src/hooks/useAuth'

const MINIMUM_POWCO_BALANCE = 1

function DailyStandup() {

    const { user, powcoBalance } = useAuth()

    useEffect(() => {

        if (powcoBalance && powcoBalance >= MINIMUM_POWCO_BALANCE) {

            // @ts-ignore
            if (!window.JitsiMeetExternalAPI) { return }

            const domain = 'meet.pow.co';
            const options = {
                roomName: 'powco-holders-daily-meeting',
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
    }, [window.JitsiMeetExternalAPI, powcoBalance, user?.paymail])

    return (

        <>
            <Script src={'https://meet.jit.si/external_api.js'} />

            <Grid key={1234} item xs={12}>
                <Card>
                <CardHeader title={`POWCO Daily Meeting`}></CardHeader>
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

DailyStandup.guestGuard = false;

export default DailyStandup;
