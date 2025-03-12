import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import EventsEmitter from "./EventsEmitter"

    export default class Resources extends EventsEmitter{
        static font:Font|any 
        isReady:boolean = false
        static wallZoneTextSize:number = 1
        static roofZoneTextSize:number = 1
        constructor()
        {
            super()
            this.loadFont()     
        }

        loadFont()
        {
            const loader = new FontLoader()       
            loader.load('../../Assets/Fonts/Open_Sans/Open Sans_Regular.json', (font:any) => {
                Resources.font = font
                this.sourceLoaded()
                this.isReady = true
            })
        }
        sourceLoaded()
        {
            this.trigger('ready')
        }
    }
    