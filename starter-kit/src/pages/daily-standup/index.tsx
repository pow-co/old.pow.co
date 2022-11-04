
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import Script from 'next/script';

import { ReactNode, useEffect } from 'react'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import UserLayout from 'src/layouts/UserLayout';

import { useAuth } from 'src/hooks/useAuth'

const MINIMUM_POWCO_BALANCE = 1

function DailyStandup() {

    const { logout, user, powcoBalance } = useAuth()

    useEffect(() => {

        if (powcoBalance >= MINIMUM_POWCO_BALANCE) {

            if (!window.JitsiMeetExternalAPI) { return }

            const domain = 'meet.jit.si';
            const options = {
                roomName: 'POWCO-Daily-Meeting',
                width: 700,
                height: 700,
                parentNode: document.querySelector('#jitsi-daily-meeting'),
                lang: 'de',
                userInfo: {
                    displayName: user?.paymail,
                    email: user?.paymail || ''
                }
            };

            // @ts-ignore
            const api = new window.JitsiMeetExternalAPI(domain, options);
        }

    }, [window.JitsiMeetExternalAPI])

    return (

        <>
            <Script src={'https://meet.jit.si/external_api.js'} />

            <Grid key={1234} item xs={12}>
                <Card>
                <CardHeader title={`POWCO Daily Meeting`}></CardHeader>
                <CardContent>
                    {(powcoBalance > -1 && powcoBalance < MINIMUM_POWCO_BALANCE) && (
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