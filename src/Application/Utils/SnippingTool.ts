import { Color, Scene, Vector2 } from "three";
import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox.js';
import { SelectionHelper } from 'three/examples/jsm/interactive/SelectionHelper.js';
import Camera from "./Camera";
import EventsEmitter from "./EventsEmitter";
import Renderer from "./Renderer";

const tempMouse = new Vector2()
const tempMousePositionOnCanvas = new Vector2()
let instance:SnippingTool

export default class SnippingTool extends EventsEmitter
{
    camera:Camera
    scene: Scene
    mouse: Vector2
    snippingStartPositionOnCanvas:Vector2
    snippingEndPositionOnCanvas:Vector2
    renderer: Renderer
    selection: SelectionBox
    helper: SelectionHelper
    startFlag: boolean
    canvas:HTMLCanvasElement

    /**
     * Snipping tool using selection boc
     * @param {HTMLCanvasElement} cancvas  html canvas
     * @param {Camera} camera  Three.js camera
     * @param {THREE.scene} scene  THREE.js scene
     * @param {Renderer} renderer WebGl renderer
     */
    private constructor(canvas: HTMLCanvasElement, camera:Camera, scene:Scene, renderer:Renderer)
    {
        super()
        this.canvas = canvas
        instance = this
        this.camera = camera
        this.scene = scene
        this.mouse = new Vector2()
        this.snippingStartPositionOnCanvas = new Vector2()
        this.snippingEndPositionOnCanvas = new Vector2()
        // Box selection
        this.renderer = renderer
        this.selection = new SelectionBox(this.camera.instance, this.scene)
        this.helper = new SelectionHelper( this.renderer.instance, 'selectionBox')
        this.startFlag = false
    }  
    
    public static initialize(canvas:HTMLCanvasElement, camera:Camera, scene:Scene, renderer:Renderer)
    {
        return instance || (instance = new SnippingTool(canvas, camera, scene, renderer));
    }

    /**
     * Computes the position of the mouse on the screen
     * calculate mouse position in normalized device coordinates
     * (-1 to +1) for both components
     */
    #UpdateMousePosition(event:any) 
    {
        const rect = this.renderer.instance.domElement.getBoundingClientRect()
        tempMousePositionOnCanvas.x = event.clientX- rect.left
        tempMousePositionOnCanvas.y = event.clientY - rect.top
	    tempMouse.x = ((event.clientX - rect.left) / this.canvas.clientWidth ) *  2 - 1
        tempMouse.y = -((event.clientY - rect.top) / this.canvas.clientHeight) * 2 + 1
        this.mouse = tempMouse
     }

     #MouseDown(event:any)
    {
        if (event.button === 0 && event.target == instance.canvas && instance != null) 
        {
            instance.#UpdateMousePosition(event)
            instance.selection.startPoint.set(
                instance.mouse.x,
                instance.mouse.y,
                0.5);
            instance.snippingStartPositionOnCanvas = tempMousePositionOnCanvas.clone()
            instance.startFlag = true
        }
        else
        {
            instance.helper.element.style.visibility = 'hidden'
        }
    }

    #MouseMove(event:any)
    {
        if (event.button === 0 && instance != null && instance.startFlag) 
        {
            instance.#UpdateMousePosition(event);
            if (instance.helper.isDown) 
            {
                instance.selection.endPoint.set(
                    instance.mouse.x,
                    instance.mouse.y,
                    0.5);
                    instance.helper.element.style.visibility = 'visible'
            }
            else{
                instance.startFlag = false
            }
        }
        else
        {
            instance.startFlag = false
            instance.helper.element.style.visibility = 'hidden'
        }
    }
    
    #MouseUp(event:any)
    {
        if (event.button === 0 && instance.startFlag) 
        {
            instance.#UpdateMousePosition(event);
            instance.selection.endPoint.set(instance.mouse.x, instance.mouse.y, 0.5);
            
            instance.snippingEndPositionOnCanvas = tempMousePositionOnCanvas.clone()
            let distance = instance.selection.endPoint.distanceTo(instance.selection.startPoint)
            if(distance > 0.1)
            {
                let width = Math.abs(instance.snippingStartPositionOnCanvas.x - instance.snippingEndPositionOnCanvas.x)
                let height = Math.abs(instance.snippingStartPositionOnCanvas.y - instance.snippingEndPositionOnCanvas.y)

                let x = Math.min(instance.snippingStartPositionOnCanvas.x, instance.snippingEndPositionOnCanvas.x)
                let y =  Math.min(instance.snippingStartPositionOnCanvas.y, instance.snippingEndPositionOnCanvas.y)

                const aspectRatioY = instance.canvas.height/instance.canvas.clientHeight;
                const aspectRatioX = instance.canvas.width/instance.canvas.clientWidth;

                const cv2 = document.createElement('canvas');
                cv2.width = width*aspectRatioX;
                cv2.height = height*aspectRatioY;
                const ctx2 = cv2.getContext('2d');
                // change backgound of the scene
                instance.scene.background = new Color(0xffffff)
                // update the renderer
                instance.renderer.update()
                // draw the snipped region on canvas
                ctx2!.drawImage(instance.canvas, x*aspectRatioX, y*aspectRatioY, width*aspectRatioX, height*aspectRatioY, 0, 0, cv2.width, cv2.height);
                // create a base64 image
                const dataURI = cv2.toDataURL('image/jp').split(';base64,')[1];
                console.log(dataURI)
                // remove scene background
                instance.scene.background = null
            }   
            // hide selection box
            instance.helper.element.style.visibility = 'hidden'
            // new selection started to false
            instance.startFlag = false;
            instance.disable()
        }     
    }

    #AdditionalKeysPressed(event:any){
        if (event.key == "Escape") instance. disable()
    }

    enable()
    {
        this.camera.disableTruck()
        document.addEventListener('keydown', this.#AdditionalKeysPressed)
        this.canvas.addEventListener('mousedown', this.#MouseDown)
        this.canvas.addEventListener('mousemove', this.#MouseMove)
        this.canvas.addEventListener('mouseup', this.#MouseUp)
    }

    disable()
    {
        this.canvas.removeEventListener('mousedown', this.#MouseDown)
        document.removeEventListener('keydown', this.#AdditionalKeysPressed)
        this.canvas.removeEventListener('mousemove', this.#MouseMove)
        this.canvas.removeEventListener('mouseup', this.#MouseUp)
        this.camera.enableTruck()
        // trigger end of snipping
        instance.trigger('endSnipping')
    }
}