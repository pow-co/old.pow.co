
import Script from 'next/script'

import { useEffect, useState } from 'react'

import { EventEmitter } from 'events'
        
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



export default function ArcadeGame() {

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

    // @ts-ignore
    if (!window.Module) {
        // @ts-ignore
        window.Module = {}
    }

    useEffect(() => {

        console.log('In Effect', window.Module?.canvas)

        if (window.Module && window.Module.canvas && !canvas) {

            setCanvas(window.Module.canvas)
        }

        console.log("window.Module", window.Module)

        let _canvas: any = document.getElementById("canvas");

        console.log('canvas', _canvas)

        setCanvas(_canvas)

        if (!canvas || !window.Module) {
            return
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // show Emscripten environment where the canvas is
        // arguments are passed to PICO-8

        window.Module.canvas = canvas;



    }, [window.Module, window.Module?.canvas])

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
    }, [window.getP8Gpio])

    return <>
        <Script src={'http://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.6/addons/p5.dom.js'} />        
        <Script src={'/arcade/scripts/flutter.js'} />

        <Script src={'/arcade/scripts/pico8-gpio-listener.js'} />

        <h1>World Builder Arcade Presents: Flutter!!</h1>

        <div className="pico8_el" onClick={() => window.Module.pico8Reset()}>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAaklEQVR4Ae2dOwoAMQhE15A+rfc/3bZ7AlMnQfywCkKsfcgMM9ZP+QHtIn0vLeBAFduiFdQ/0DmvtR5LXJ6CPSXe2ZXcFNlTxFbemKrbZPs35XogeS9xeQr+anT6LzoOwEDwZJ7jwhXUnwkTTiDQ2Ja34AAAABB0RVh0TG9kZVBORwAyMDExMDIyMeNZtsEAAAAASUVORK5CYII="
            alt="Reset"
            width="12"
            height="12"
          />

          Reset
        </div>

        <div className="pico8_el" onClick={() => window.Module.pico8TogglePaused()}>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAPUlEQVR4Ae3doQ0AIAxEUWABLPtPh2WCq26DwFSU/JPNT166QSu/Hg86W9dwLte+diP7AwAAAAAAgD+A+jM2ZAgo84I0PgAAABB0RVh0TG9kZVBORwAyMDExMDIyMeNZtsEAAAAASUVORK5CYII="
            alt="Pause"
            width="12"
            height="12"
          />

          Pause
        </div>
        <div className="pico8_el" onClick={() => window.Module.requestFullScreen(true, false)}>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAaklEQVR4Ae2dsQ1AIQhExfze1v2ns3UCrfgFhmgUUAoGgHscp21wX9BqaZoDojbB96OkDJKNcTN2BHTyYNYmoT2BlPL7BKgcPfHjAVXKKadkHOn9K1r16N0czN6a95N8mnA7Aq2fTZ3Af3UKmCSMazL8HwAAABB0RVh0TG9kZVBORwAyMDExMDIyMeNZtsEAAAAASUVORK5CYII="
            alt="Fullscreen"
            width="12"
            height="12"
          />

          Fullscreen
        </div>
        <div className="pico8_el" onClick={() => window.Module.pico8ToggleSound() }>
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

    </>

}
