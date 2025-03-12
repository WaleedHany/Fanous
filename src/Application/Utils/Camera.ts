import * as THREE from 'three'
import CameraControls from 'camera-controls'
import SceneSizes from './SceneSizes'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Renderer from './Renderer'

const clock = new THREE.Clock();

export default class Camera
{
    sizes : SceneSizes
    scene : THREE.Scene
    canvas:HTMLCanvasElement
    isPrespective:boolean
    instance : THREE.PerspectiveCamera|THREE.OrthographicCamera|any
    controls: CameraControls|any
    x :number = 0
    y :number = 0
    width :number|any
    height:number|any
    widthRatio :number|any
    heightRatio:number|any

    static numberOfScreens:number = 0

    constructor(sizes:SceneSizes, scene:THREE.Scene, canvas:HTMLCanvasElement, isPrespective:boolean = true)
    {
        this.sizes  = sizes
        this.scene  = scene
        this.canvas = canvas
        this.isPrespective = isPrespective
        this.setInstance()
        this.setControls()
        // default full screen boundaries
        this.setBoundaries(0, 0, this.sizes.width, this.sizes.height)
        Camera.numberOfScreens += 1
    }

    setInstance()
    {
        if (this.isPrespective)
        {
            this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 4000)
            this.instance.position.set(240, 70, 120)    
            this.instance.lookAt(0,-150,0)
        }
        else
        { 
            let aspect = this.sizes.width / this.sizes.height
            this.instance = new THREE.OrthographicCamera(-50, 50, 50 / aspect, -50 / aspect, -1000, 2000)
            this.instance.position.set(1, 1, 1)
            if (Camera.numberOfScreens == 1) this.instance.position.set(0, 0, 1)
            if (Camera.numberOfScreens == 3)this.instance.position.set(1, 0, 0)
        }
        //this.instance.up.set(0,-1,0)
    }

    setControls()
    {
        CameraControls.install({THREE: THREE})
        this.controls = new CameraControls(this.instance, this.canvas)
        this.controls.smoothTime = 0.1
        this.controls.zoomSpeed  = 0.1
        this.controls.dollyToCursor = true
        this.controls.infinityDolly = true
        this.controls.mouseButtons.left = CameraControls.ACTION.NONE
        this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE
        this.controls.mouseButtons.middle = CameraControls.ACTION.TRUCK 
        //this.controls.lookAt(0,50,0)
        // this.controls.boundaryEnclosesCamera
    }

    disableMotion(){
        //this.controls.dollyToCursor = false
        //this.controls.infinityDolly = false
        this.controls.mouseButtons.left = CameraControls.ACTION.NONE
        this.controls.mouseButtons.right = CameraControls.ACTION.NONE
        this.controls.mouseButtons.wheel = CameraControls.ACTION.NONE
    }

    enableMotion()
    {
        //this.controls.dollyToCursor = true
        //this.controls.infinityDolly = true
        this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK
        this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE
        this.controls.mouseButtons.wheel = CameraControls.ACTION.ZOOM
    }

    disableTruck(){
        this.controls.mouseButtons.left = CameraControls.ACTION.NONE
    }
    enableTruck(){
        this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK
    }

    setBoundaries(x:number, y:number, w:number, h:number, adjustPosition = true)
    {
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.widthRatio = this.width/this.sizes.width
        this.heightRatio = this.height / this.sizes.height
        this.instance.aspect = this.widthRatio/this.heightRatio
        this.setFieldOfView(x, y, w, h, adjustPosition)
    }

    setFieldOfView(x:number, y:number, w:number, h:number, adjustPosition = true)
    { 
        let xValue = x * this.sizes.width
        let yValue = y * this.sizes.height
        if (xValue >= 0 && (xValue + w) <= this.sizes.width &&
            w > 0 && h > 0 &&
            yValue >= 0 && (yValue + h) <= this.sizes.height)
        {
            this.instance.setViewOffset(this.sizes.width, this.sizes.height, x * this.sizes.width, y * this.sizes.height, w, h);
            if(adjustPosition) this.getNewCameraPosition(x,y, this.instance.zoom)
        }   
        this.instance.updateProjectionMatrix()
    }

    getVisibleHeightAtZDepth(depth:number)
    {
        // compensate for cameras not positioned at z=0
        const cameraOffset = this.instance.position.z;
        if ( depth < cameraOffset ) depth -= cameraOffset;
        else depth += cameraOffset;
      
        if (this.instance.isPerspectiveCamera)
        {
            // vertical fov in radians
            const vFOV = this.instance.fov * Math.PI / 180; 
            // Math.abs to ensure the result is always positive
            return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
        }
        else
        {
            return ( this.instance.top - this.instance.bottom ) / ( 2 * Math.abs( depth ) );
        }

      };
      
    getVisibleWidthAtZDepth(depth:number)
    {
        if (this.instance.isPerspectiveCamera)
        {
            const height = this.getVisibleHeightAtZDepth(depth);
            return height * this.instance.aspect;
        }
        else {
            return ( this.instance.right - this.instance.left ) / ( 2 * Math.abs( depth ) );
        }
    };

    getNewCameraPosition(x:number, y:number, depth:number)
    {
        // x-axis
        let windowWidth = this.getVisibleWidthAtZDepth(depth)
        let startPointX = x
        if (Math.abs(0.5 - x) > Math.abs(0.5 - (x + this.widthRatio))) startPointX = x + this.widthRatio
        let eccentricityX = Math.abs(0.5 - startPointX)
        if((x - 0.5)*((x + this.widthRatio)-0.5) <= 0) eccentricityX *= -1
        let midpointX = (eccentricityX + 0.5) * windowWidth 
        let factorX = 1
        if (x >= 0.5) factorX = -1
        // y-axis
        let windowheight = this.getVisibleHeightAtZDepth(depth)
        let startPointY = y
        if (Math.abs(0.5 - y) > Math.abs(0.5 - (y + this.heightRatio))) startPointY = y + this.heightRatio
        let eccentricityY = Math.abs(0.5 - startPointY)
        if((y - 0.5)*((y + this.heightRatio)-0.5) <= 0) eccentricityY *= -1
        let midpointY = (eccentricityY + 0.5) * windowheight 
        let factorY = 1
        if (y >= 0.5) factorY = -1
        this.controls.setFocalOffset(midpointX * factorX, midpointY * factorY, 0, true)
    }

    isMouseOver(x:number, y:number)
    {
        if (x >= this.x && x <= this.x + (this.width / this.sizes.width) &&
            y >= this.y && y <= this.y + (this.height / this.sizes.height) && !this.controls.enabled)
        {
            return this
        }
        return null
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        const delta = clock.getDelta()
        this.controls.update(delta)
    }

    dispose()
    {
        if (Camera.numberOfScreens > 1)
        {
            Camera.numberOfScreens -= 1
            this.scene.remove(this.instance)
            this.instance.clearViewOffset()
            this.instance.clear()
            this.instance = null
            this.controls.dispose()
            this.controls = null
        }
    }
}

export class ViewerCameras{
    mainCamera:Camera
    mainAxisCamera:THREE.OrthographicCamera|THREE.PerspectiveCamera
    mainCamera2D:Camera
    axisCamera2D:THREE.OrthographicCamera
    axisCameraControls?:OrbitControls
    axisCamera2DControls?:OrbitControls

    constructor(mainCamera:Camera, renderer:Renderer) 
    {
        this.mainCamera = mainCamera
        this.mainAxisCamera = this.#addMainAxisCamera(renderer)
        this.mainCamera2D = this.#add2DCamera()
        this.axisCamera2D = this.#add2DAxisCamera(renderer)
    }

    #addMainAxisCamera(renderer:Renderer)
    {
        const origin = new THREE.Vector3(0,0,0)
        const aspect = 1 // this.sizes.width/this.sizes.height
        let axisCamera= new THREE.OrthographicCamera(-2, 2, 2 / aspect, -2 / aspect, -1000, 2000)
        axisCamera.up.set(0,0,1)
        this.axisCameraControls = new OrbitControls(axisCamera, renderer.instance.domElement)
        // to disable zoom
        this.axisCameraControls.enableZoom = false;
        // to disable rotation
        this.axisCameraControls.enableRotate = true;
        // to disable pan
        this.axisCameraControls.enablePan = false;
        this.axisCameraControls.mouseButtons = {
            MIDDLE: THREE.MOUSE.PAN,
            RIGHT: THREE.MOUSE.ROTATE
        }
        axisCamera.position.x= -0.9
        axisCamera.position.y= -0.9
        axisCamera.position.z= 1
        axisCamera.lookAt(origin)
        axisCamera.updateProjectionMatrix ()   
        return axisCamera
    }

    #add2DCamera()
    {
        let camera = new Camera(this.mainCamera.sizes, this.mainCamera.scene, this.mainCamera.canvas, false)
        camera.controls.setPosition(0, 0, 1)
        camera.controls.rotate( 22/14, 0, false )
        camera.controls.mouseButtons.right = CameraControls.ACTION.NONE
        return camera
    }

    set2DCamera(x:number, y:number)
    {
        this.mainCamera2D?.controls.reset(false)
        this.mainCamera2D?.controls.moveTo(x, y, 0, false)
        this.mainCamera2D?.controls.rotate( 22/14, 0, false )
        if(this.mainCamera2D != null) return this.mainCamera2D
        else return this.mainCamera
    }

    #add2DAxisCamera(renderer:Renderer)
    {
        const origin = new THREE.Vector3(0,0,0)
        const aspect = 1 // this.sizes.width/this.sizes.height
       // let axisCamera= new THREE.OrthographicCamera(-2, 2, 2 / aspect, -2 / aspect, -1000, 2000)
       let axisCamera= new THREE.OrthographicCamera(-2, 2, 2 / aspect, -2 / aspect, -1000, 2000)
        this.axisCamera2DControls = new OrbitControls(axisCamera, renderer.instance.domElement)
        // to disable zoom
        this.axisCamera2DControls.enableZoom = false;
        // to disable rotation
        this.axisCamera2DControls.enableRotate = false;
        // to disable pan
        this.axisCamera2DControls.enablePan = false;
        axisCamera.up.set(0,0,1)
        axisCamera.position.x= 0 
        axisCamera.position.y= 0
        axisCamera.position.z= 1
        axisCamera.lookAt(origin)
        axisCamera.updateProjectionMatrix ()
        return axisCamera
    }

    // resetAxisCamera(renderer:Renderer)
    // {
    //     return this.#addMainAxisCamera(renderer)
    // }

    update3DCameraPosition(x:number, y:number, z:number)
    {
        this.mainCamera.controls.moveTo(x,y,x,false)
    }
}