
import Script from 'next/script'

import { useEffect, useState } from 'react'

import { EventEmitter } from 'events'

import { HasteClient } from '@hastearcade/web'
        
class Game extends EventEmitter {
    score: number;
    gamestate: number;
    gpio: any;
    onStart: Function;
    onEnd: Function;
    onNewScore: Function | undefined;
    constructor({ gpio, onStart, onEnd, onNewScore }: {gpio: any, onStart: Function, onEnd: Function, onNewScore?: Function}) {
        super()
      this.score = 0;
      this.gamestate = 0;
      this.gpio = gpio
      this.onStart = onStart;
      this.onEnd = onEnd;
      this.onNewScore = onNewScore;
    }

    subscribe() {
      this.gpio.subscribe((newIndices: any[]) => {
        if (newIndices.indexOf(0) !== -1) {
          this.score = this.gpio[0];
        }
        if (newIndices.indexOf(1) !== -1) {
          let gamestate = this.gpio[1];
          if (this.gamestate != gamestate) {
            console.log('Gamestate changed to: ' + gamestate);
    
            switch(gamestate) {
              case 1:
                this.onStart()
                break;
              case 2:
                this.onEnd({ score: this.score })
                break;
            }
          }
          this.gamestate = gamestate;
        }
      });
    }

  }

import { useArcadeWebsocket } from 'src/hooks/useArcadeWebsocket';

export default function ArcadeGame() {

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)


    const [hasteAuth, setHasteAuth] = useState<any>()

    const [hasteClient, setHasteClient] = useState<HasteClient>()

    const {socket, isConnected} = useArcadeWebsocket()

    // @ts-ignore
    if (!window.Module) {
        // @ts-ignore
        window.Module = {}
    }

    if (!hasteClient) {
      setHasteClient(HasteClient.build());
    }

    function logout() {
      setHasteAuth(null)
      if (hasteClient) {

        hasteClient.logout()
      }
    }

    useEffect(() => {

        if (!hasteClient) { return }

        const details = hasteClient.getTokenDetails();

        console.log('haste.auth.details', details)

        setHasteAuth(details)

        if (!details || !details.isAuthenticated) {
          //hasteClient.login();
          return
        }

        // @ts-ignore
        if (window.Module && window.Module.canvas && !canvas) {

            //@ts-ignore
            setCanvas(window.Module.canvas)
        }

        let _canvas: any = document.getElementById("canvas");

        setCanvas(_canvas)

        //@ts-ignore
        if (!canvas || !window.Module) {
            return
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // show Emscripten environment where the canvas is
        // arguments are passed to PICO-8

        //@ts-ignore
        window.Module.canvas = canvas;


    //@ts-ignore
    }, [window.Module, window.Module?.canvas])


    //@ts-ignore
    if (!window.Module) {
        return <></>
    }

    function onKeyDown_blocker(event: any) {
        event = event || window.event;
        var o = document.activeElement;
        if (!o || o == document.body || o.tagName == "canvas") {

          if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {


            if (event.preventDefault) event.preventDefault();
          }
        }
      }

    useEffect(() => {

        document.addEventListener("keydown", onKeyDown_blocker, false);

    }, [])

    useEffect(() => {

        //@ts-ignore
        if (!window.getP8Gpio) {
            return
        }

        //@ts-ignore
        var gpio = window.getP8Gpio();

        const game = new Game({

            gpio,
            
            onNewScore(score: number) {
            console.log('New score', { score });
            },

            onStart() {
            console.log('Game started');
            // Post to the API and create a Play in Haste and record it in the database
            },

            onEnd({ score }: {score: number}) {
            console.log('Game ended', { score });

            // Post to API and create Score in Haste and record it in the database
            // Update the Play in the database now that it is complete
            }

        })

        game.subscribe()

    //@ts-ignore        
    }, [window?.getP8Gpio])

    function handleReset() {
        //@ts-ignore
        window.Module.pico8Reset()
    }

    function handlePause() {
        //@ts-ignore
        window.Module.pico8TogglePaused()
    }

    function requestFullScreen() {
        
        //@ts-ignore
        window.Module.requestFullScreen()
    }

    function onClickSound() {

        //@ts-ignore
        window.Module.pico8ToggleSound() 
    }

    function picoReset() {

      //@ts-ignore
      window.Module.pico8Reset()
    }

    return <>
        <Script src={'http://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.6/addons/p5.dom.js'} />        
        <Script src={'/arcade/scripts/flutter.js'} />

        <Script src={'/arcade/scripts/pico8-gpio-listener.js'} />

        <h1>World Builder Arcade Presents: Flutter!!</h1>

        <small>
          {isConnected ? 'Socket Connected' : 'Socket Not Connected'}
        </small>

        {hasteAuth && hasteAuth.isAuthenticated && hasteClient ? <>
          <h2>Logged in as {hasteAuth.displayName} on Handcash</h2>
          <p>
            <a onClick={() => hasteClient.logout()}>Logout</a>
          </p>
        </> : <>
          <img onClick={() => hasteClient?.login() } src='https://docs.hastearcade.com/img/login.svg'/>
        </>}

          
        <div className="pico8_el" onClick={picoReset}>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAaklEQVR4Ae2dOwoAMQhE15A+rfc/3bZ7AlMnQfywCkKsfcgMM9ZP+QHtIn0vLeBAFduiFdQ/0DmvtR5LXJ6CPSXe2ZXcFNlTxFbemKrbZPs35XogeS9xeQr+anT6LzoOwEDwZJ7jwhXUnwkTTiDQ2Ja34AAAABB0RVh0TG9kZVBORwAyMDExMDIyMeNZtsEAAAAASUVORK5CYII="
            alt="Reset"
            width="12"
            height="12"
          />

          Reset
        </div>

        <div className="pico8_el" onClick={handlePause}>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAPUlEQVR4Ae3doQ0AIAxEUWABLPtPh2WCq26DwFSU/JPNT166QSu/Hg86W9dwLte+diP7AwAAAAAAgD+A+jM2ZAgo84I0PgAAABB0RVh0TG9kZVBORwAyMDExMDIyMeNZtsEAAAAASUVORK5CYII="
            alt="Pause"
            width="12"
            height="12"
          />

          Pause
        </div>
        <div className="pico8_el" onClick={requestFullScreen}>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAaklEQVR4Ae2dsQ1AIQhExfze1v2ns3UCrfgFhmgUUAoGgHscp21wX9BqaZoDojbB96OkDJKNcTN2BHTyYNYmoT2BlPL7BKgcPfHjAVXKKadkHOn9K1r16N0czN6a95N8mnA7Aq2fTZ3Af3UKmCSMazL8HwAAABB0RVh0TG9kZVBORwAyMDExMDIyMeNZtsEAAAAASUVORK5CYII="
            alt="Fullscreen"
            width="12"
            height="12"
          />

          Fullscreen
        </div>
        <div className="pico8_el" onClick={onClickSound}>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAXklEQVR4Ae2doQ4AIQxD4YLH8v9fh+ULhjpxxSwLg2uyapr1JRu1iV5Z+1BGl4+xNpX38SYo2uRvYiT5LwEmt+ocgXVLrhPEgBiw8Q5w7/kueSkK+D2tJO4E/I3GrwkqQCBabEj/4QAAABB0RVh0TG9kZVBORwAyMDExMDIyMeNZtsEAAAAASUVORK5CYII="
            alt="Toggle Sound"
            width="12"
            height="12"
          />

          Sound
        </div>

        <div id="game">
            <canvas
                className="emscripten"
                id="canvas"
                onContextMenu={(event) => event.preventDefault()}
            ></canvas>
        </div>

        <img src='https://docs.hastearcade.com/img/dark-badge.svg'/>

    </>

}
