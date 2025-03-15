import * as THREE from 'three'
import SceneSizes from './Utils/SceneSizes'
import Time from './Utils/Time'
import Camera, { ViewerCameras } from './Utils/Camera'
import Renderer from './Utils/Renderer'
import Environment from './Models/Environment'
import GlobalCoordinatesArrows from './Helpers/GlobalCoordinatesArrows'
import Resources from './Utils/Resources'
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.ts'
import SnippingTool from './Utils/SnippingTool'
import Selection from './Utils/Selection'
import Raycasting from './Utils/Raycasting'
import LanternParts from './Objects/LanternParts'
import CameraControls from 'camera-controls'

let instance:Viewer|null = null

/**
 * Initalize the main programe
 */
export default class Viewer {
  static instanceNo: number = 0
  canvas: HTMLCanvasElement
  sizes: SceneSizes
  scene: THREE.Scene
  axisScene: THREE.Scene
  allowAxisScene: boolean = false
  camera: Camera
  axisCamera: OrthographicCamera|THREE.PerspectiveCamera
  viewerCameras: ViewerCameras
  resources: Resources
  cameraList: Camera[]
  renderer: Renderer
  time: Time
  selection: Selection|any
  environment: Environment
  axes: GlobalCoordinatesArrows
  snippingTool: SnippingTool
  raycaster: Raycasting
  lantern:LanternParts
  stars: THREE.Points|any

  private constructor(_canvas: HTMLCanvasElement) {
      Viewer.instanceNo += 1
      instance = this
      // Canvas
      this.canvas = _canvas
      // sizes
      this.sizes = new SceneSizes(this.canvas)
      this.sizes.on('resize', () => {
        this.resize()
      })

    // Scene
    this.scene = new THREE.Scene()
    //this.scene.background = new THREE.Color(0xffffff)//
    this.axisScene = new THREE.Scene()
    //this.axisScene.background = new THREE.Color(0xffffff)//

    // Cameras
    this.camera = new Camera(this.sizes, this.scene, this.canvas, true)
        
    // Renderer
    this.renderer = new Renderer(this.canvas, this.sizes, this.scene, this, this.camera)

    // Additional cameras
    this.viewerCameras = new ViewerCameras(this.camera, this.renderer)
    this.axisCamera = this.viewerCameras.mainAxisCamera
    this.cameraList = []
    this.cameraList.push(this.camera)

    // Main view
    this.resources = new Resources()
    this.environment = new Environment(this.scene, this.camera)

    this.lantern = new LanternParts(this.renderer)
    //this.scene.add(this.lantern.object)
    
    // Time
    this.time = new Time()
    this.time.on('tick', () => this.update())
    
    // Snipping tool
    this.snippingTool = SnippingTool.initialize(this.canvas, this.camera, this.scene, this.renderer)

    const origin = new THREE.Vector3(0, 0, 0)
    this.axes = new GlobalCoordinatesArrows(origin, 1.2)
    this.addAxes()
    this.camera.controls.addEventListener('updateAxisCamera', () => {this.#updateAxisCameraOreintation()})
    this.raycaster = Raycasting.InitializeRaycaster(this.camera, this.scene, this.renderer, this.scene.children)

    this.addStars(3000)

  }

  #updateAxisCameraOreintation()
  {
      let direction = new THREE.Vector3()
      this.camera.instance.getWorldDirection(direction)
      this.axisCamera.position.set(-direction.x, -direction.y, -direction.z)
      this.axisCamera.lookAt(new THREE.Vector3(0,0,0))
  }

  public static initialize(canvas: HTMLCanvasElement) {
    return instance ?? (instance = new Viewer(canvas));
  }

  public static getInstance() {
    return instance
  }

  resetCamera() {
    if (this.cameraList.length > 0) {
      this.camera = this.cameraList[0]
      this.renderer.camera = this.camera
      //this.selection.camera = this.camera
    }
  }

  resize()
  {
      this.camera.resize()
      this.renderer.resize()
  }

  update()
  { 
      this.camera.update()
      this.renderer.update()
      if(this.camera?.instance?.position != null && this.environment.moon != null)
      {  
        let scale = this.camera?.instance?.position?.sub(this.environment.moon?.position)?.length()/16
        this.environment.moon?.scale.set(scale,scale,scale)
        let target
        (this.camera?.controls as CameraControls).getTarget(target= new THREE.Vector3(), true)
        let dot = target.clone().sub(this.camera?.instance?.position).normalize()
        .dot(new THREE.Vector3(0,1,0))//this.environment.moon.position.clone().sub(this.camera?.instance?.position).normalize())
        if(dot< -0.4) 
          this.scene.remove(this.environment.moon)
        else this.scene.add(this.environment.moon)
      }
      //this.animateStars()
  }

  unSelect()
  {
      //this.selection.UnSelect(this.SelectedObjects)
  }      

  dispose()
  {
      this.sizes.off('resize')
      this.time.off('tick')

       // Traverse the whole scene
       this.scene.traverse((child) =>
       {
          // Test if it's a mesh
          if(child instanceof THREE.Mesh)
          {
              child.geometry.dispose()

              // Loop through the material properties
              for(const key in child.material)
              {
                  const value = child.material[key]

                  // Test if there is a dispose function
                  if(value && typeof value.dispose === 'function')
                  {
                      value.dispose()
                  }
              }
          }
          this.camera.controls.dispose()
          this.renderer.instance.dispose()
       })
  }

  addAxes()
  {
      this.allowAxisScene = true
      let axes = this.axes.get()
      axes.renderOrder = 1;
      this.axisScene.remove(this.axes.get2D())    
      this.axisScene.add(axes)
  }

  add2DAxes()
  {
      this.allowAxisScene = true
      let axes = this.axes.get2D()
      axes.renderOrder = 1;  
      this.axisScene.remove(this.axes.get())     
      this.axisScene.add(axes)
  }

  addStars(count = 1000) {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff, // White stars
        size: 0.5, // Adjust star size
        transparent: true
    });

    // Generate random positions
    const starVertices = [];
    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 4000 // Spread stars in space
        const y = (Math.random() - 0.5) * 4000
        const z = (Math.random() - 0.5) * 4000
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }
} 