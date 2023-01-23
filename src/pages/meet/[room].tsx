

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

import { useTokenMeetLiveWebsocket } from 'src/hooks/useWebsocket';

import { Socket } from 'socket.io-client/build/esm/socket';
import { useRouter } from 'next/router';

const MINIMUM_POWCO_BALANCE = 100

const events = [
    'cameraError',
    'avatarChanged',
    'audioAvailabilityChanged',
    'audioMuteStatusChanged',
    'breakoutRoomsUpdated',
    'browserSupport',
    'contentSharingParticipantsChanged',
    'dataChannelOpened',
    'endpointTextMessageReceived',
    'faceLandmarkDetected',
    'errorOccurred',
    'knockingParticipant',
    'largeVideoChanged',
    'log',
    'micError',
    'screenSharingStatusChanged',
    'dominantSpeakerChanged',
    'raiseHandUpdated',
    'tileViewChanged',
    'chatUpdated',
    'incomingMessage',
    'mouseEnter',
    'mouseLeave',
    'mouseMove',
    'toolbarButtonClicked',
    'outgoingMessage',
    'displayNameChange',
    'deviceListChanged',
    'emailChange',
    'feedbackSubmitted',
    'filmstripDisplayChanged',
    'moderationStatusChanged',
    'moderationParticipantApproved',
    'moderationParticipantRejected',
    'participantJoined',
    'participantKickedOut',
    'participantLeft',
    'participantRoleChanged',
    'participantsPaneToggled',
    'passwordRequired',
    'videoConferenceJoined',
    'videoConferenceLeft',
    'videoAvailabilityChanged',
    'videoMuteStatusChanged',
    'videoQualityChanged',
    'readyToClose',
    'recordingLinkAvailable',
    'recordingStatusChanged',
    'subjectChange',
    'suspendDetected',
    'peerConnectionFailure'
]


function DailyStandup() {

    const { user, powcoBalance, login } = useAuth()

    const [jitsiInitialized, setJitsiInitialized] = useState<boolean>()

    const [nJitsis, setNJitsis] = useState<number>(1)

    const { isConnected, socket } = useTokenMeetLiveWebsocket()

    const [jitsiJWT, setJitsiJWT] = useState<string>()

    const [userReady, setUserReady] = useState<boolean>(false)

    const { query } = useRouter()

    const defaultRoom = `pow.co`

    const room = query.room || defaultRoom

    const roomName = `vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/${room}`

    //@ts-ignore
    const minimumTokenBalance = room.split('-')[1] || 1

    //@ts-ignore
    const tokenOrigin = room.split('-')[0]

    async function handleJitsiEvent(type: string, event: any, socket: Socket) {

        //TODO: Pipe the event to websocket server

        console.log('JIITSI EVENT', {type, event, user})

        socket.emit('jitsi-event', {
            type,
            event,
            user,
            jwt: jitsiJWT,
            timestamp: new Date().toISOString(),
            roomName
        })
    }

    console.log('USER', user)

    if (!user) {
        console.log('no user -- login')
        login()
    }

    if (user && !userReady) {
        setUserReady(true)
    }

    useEffect(() => {

        console.log ({user, powcoBalance, minimumTokenBalance, tokenOrigin})


        if (true) {
  
            // @ts-ignore
            if (!window.JitsiMeetExternalAPI) {

                setTimeout(() => {
                    setNJitsis(nJitsis + 1)
                }, 520)
                
                return
            }

            console.log('JITSI INITIALIZED')


            if (jitsiInitialized) {

                return
            }


            setJitsiInitialized(true)

            const token = localStorage.getItem('powco.auth.relayx.token');

 

            //axios.post('http://localhost:5200/api/v1/jaas/auth', {
            axios.post('https://tokenmeet.live/api/v1/jaas/auth', {
                wallet: 'relay',
                paymail: user?.paymail || 'anonymous@relayx.io',
                token,
                roomName,
                tokenOrigin
            })
            .then(({data}) => {

                console.log('Jitsi JWT', data)

                const domain = "8x8.vc";

                setJitsiJWT(data.jwt)

                const options = {
                    jwt: data.jwt,                
                    roomName,
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

                // @ts-ignore
                window.jitsi = jitsi

                socket.on('jitsi.executeCommand', message => {

                    const { command, params } = message

                    console.log('jitsi.executeCommand', {command, params})

                    jitsi.executeCommand(command, params)

                })

                socket.on('jitsi.callFunction', async (message) => {

                    const { method, params, uid } = message

                    console.log('jitsi.callFunction', {method, params, uid})

                    const result = await jitsi[method](...params)

                    socket.emit('jitsi.callFunctionResult', {
                        uid,
                        result
                    })
                    
                })

                const handlers: any = events.reduce((acc: any, type: string) => {

                    acc[type] = (event: any) => {

                        if (event) {
                            handleJitsiEvent(type, event, socket)
                        }                    
                    }

                    return acc

                }, {})

                for (let type of events) {
                        
                        jitsi.addListener(type, handlers[type])
                }

                return function() {

                    for (let type of events) {
                            
                        jitsi.removeListener(type, handlers[type])
                    }
                            
                    jitsi.dispose()
                }
            })
            .catch(error => {

                console.log('AUTH ERROR', error)

            })
        }

    // @ts-ignore
    }, [window.JitsiMeetExternalAPI], nJitsis, userReady, user, jitsiInitialized)

    return (

        <>
            <Script src={'https://8x8.vc/vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/external_api.js'} />

            <Grid key={1234} item xs={12}>
                <Card>
                <CardHeader title={`Meet ${room}`}></CardHeader>
                <CardContent>

                    {user ? (
                        <>

                        {(powcoBalance !== null && powcoBalance > -1 && powcoBalance < MINIMUM_POWCO_BALANCE) ? (

                            <div>
                                <p>{minimumTokenBalance} {tokenOrigin} tokens required to join this room.</p>

                                    <Link passHref target='_blank' href={`https://relayx.com/market/${tokenOrigin}`}>
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

DailyStandup.guestGuard = true;

export default DailyStandup;

interface cameraError {
    type: string;
    message: string;
}

interface avatarChanged {
    id: string, // the id of the participant that changed his avatar.
    avatarURL: string // the new avatar URL.
}

interface audioAvailabilityChanged {
    available: boolean // new available status - boolean
}

interface audioMuteStatusChanged {
    muted: boolean // new muted status - boolean
}