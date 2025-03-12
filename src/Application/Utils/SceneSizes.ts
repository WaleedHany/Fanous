import EventsEmitter from "./EventsEmitter"

export default class SceneSizes extends EventsEmitter
{
    width:number
    height:number
    pixelRatio:number

    constructor(canvas:HTMLCanvasElement)
    {
        // instansiate base class
        super()

        // Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 1)

        // Resize event
        window.addEventListener('resize', () =>
        {
            this.width =  window.innerWidth
            this.height = window.innerHeight
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 1)
            this.trigger('resize')
        })
    }
}