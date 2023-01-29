
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

import { determinePowcoMeetingTokenRequirement  } from 'src/utils/tokenmeet';

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

import { sendMessage } from 'src/utils/bsocial/message'

function DailyStandup() {

    const { login } = useAuth()

    const { user, powcoBalance } = useAuth()

    const [jitsiInitialized, setJitsiInitialized] = useState<boolean>()

    const [nJitsis, setNJitsis] = useState<number>(1)

    const { isConnected, socket } = useTokenMeetLiveWebsocket()

    const [jitsiJWT, setJitsiJWT] = useState<string>()

    const roomName = 'vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/powco-club-room'

    const [tokenMeetLiveMeetingTokenRequirement, setTokenMeetLiveMeetingTokenRequirement] = useState<number | null>(null)

    useEffect(() => {        
    
        determinePowcoMeetingTokenRequirement()
            .then(({ value }: any) => setTokenMeetLiveMeetingTokenRequirement(value))
    
    }, [])

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

        if (type === "outgoingMessage") {

            console.log('OUTGOING MESSAGE', event)

            try {

                const result: any = await sendMessage({
                    app: 'chat.pow.co',
                    channel: 'powco-development',
                    message: event.message,
                    paymail: user?.paymail
                })

                console.log('bsocial.sendMessage.result', result)

            } catch(error) {

                console.error('bsocial.sendMessage.error', error)
            }


        }
    }

    function handleLogin() {
        login()
    }

    useEffect(() => {

        console.log('USE EFFECT', {nJitsis, powcoBalance, tokenMeetLiveMeetingTokenRequirement})

        if (user && tokenMeetLiveMeetingTokenRequirement !== null && powcoBalance && powcoBalance >= tokenMeetLiveMeetingTokenRequirement) {

            // @ts-ignore
            if (!window.JitsiMeetExternalAPI) {

                setTimeout(() => {
                    setNJitsis(nJitsis + 1)
                }, 520)
                
                return
            }

            if (jitsiInitialized) {

                return
            }

            setJitsiInitialized(true)

            const token = localStorage.getItem('powco.auth.relayx.token');

            axios.post('https://tokenmeet.live/api/v1/jaas/auth', {
                wallet: 'relay',
                paymail: user.paymail,
                token
            })
            .then(({data}) => {

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
                        startWithVideoMuted: true,
                        transcribingEnabled: true
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

        console.log('--end use effect--', {nJitsis})

    // @ts-ignore
    }, [window.JitsiMeetExternalAPI, jitsiJWT, powcoBalance, tokenMeetLiveMeetingTokenRequirement])

    return (

        <>
            <Script src={'https://8x8.vc/vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/external_api.js'} />

            <Grid key={1234} item xs={12}>
                <Card>
                <CardHeader title={`Daily Discussion of Boostpow Costly Signals`}></CardHeader>
                <CardContent>

                    {user ? (
                        <>
                        <div>
                            {tokenMeetLiveMeetingTokenRequirement === null ? (
                                <p>Computing Token Requirement Based On An Ask Bitcoin Question</p>
                            ) : (
                                <p>Presently this room requires {tokenMeetLiveMeetingTokenRequirement} pow.co tokens to enter <a href="https://askbitcoin.com/questions/bcbeb659562d1a4a97d40705d74d261eabdbff9c4dd8bcf463421656a8215eb7">as determined by the bitcoin hive mind here</a>.</p>
                            )}
                            

                        {(tokenMeetLiveMeetingTokenRequirement && powcoBalance !== null && powcoBalance > -1 && powcoBalance < tokenMeetLiveMeetingTokenRequirement) ? (
                                <>

                                    <Link passHref target='_blank' href='https://relayx.com/market/93f9f188f93f446f6b2d93b0ff7203f96473e39ad0f58eb02663896b53c4f020_o2'>
                                        <Button component='a' variant='contained' sx={{ px: 5.5 }}>
                                            Buy Now
                                        </Button>
                                    </Link>
                                </>

                        ) : (
                                <div id="jitsi-daily-meeting"></div>

                        )}
                        </div>  

                        </>

  
                    ) : ( 
                        <div>
                            <p>Please login to join this room.</p>

                            <Link passHref href='' onClick={handleLogin}>
                                <Button  onClick={handleLogin} component='a' variant='contained' sx={{ px: 5.5 }}>
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
