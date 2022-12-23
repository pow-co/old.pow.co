
import { Card, CardContent, CardHeader, Grid } from '@mui/material';

import { ReactNode, useState, useRef } from 'react'

import UserLayout from 'src/layouts/UserLayout';

import { useAuth } from 'src/hooks/useAuth'


const MINIMUM_POWCO_BALANCE = 1

function DailyStandupLivestream() {

    const { user, powcoBalance } = useAuth()

    const [jitsiInitialized, setJitsiInitialized] = useState<boolean>(false)

    const playerRef:any = useRef();

    return (

        <>

            <Grid key={1234} item xs={12}>
                <Card>
                <CardHeader title={`Daily Discussion of Boostpow Costly Signals`}></CardHeader>
                <CardContent>
                    {(powcoBalance && powcoBalance > -1 && powcoBalance < MINIMUM_POWCO_BALANCE) && (
                        <p>Error: {MINIMUM_POWCO_BALANCE} POWCO required to attend daily meetings.</p>
                    )}


                </CardContent>
                </Card>
            </Grid>

        </>
    )

};

DailyStandupLivestream.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

DailyStandupLivestream.guestGuard = true;

export default DailyStandupLivestream;
