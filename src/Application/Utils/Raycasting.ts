import {
    Raycaster, Vector2, Vector3, Mesh, MeshBasicMaterial, 
    Triangle, PerspectiveCamera,  RingGeometry,
    LineBasicMaterial, Scene, Object3D, Intersection} from "three";
import EventEmitter from "./EventsEmitter";
import Renderer from "./Renderer";
import Camera from "./Camera";
  
  const tempMouse = new Vector2();
  const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;
  let instance: Raycasting
  let cameraVector = new Vector3();
  let dir = new Vector3()
  const scaleFactor = 10
  
  export default class Raycasting extends EventEmitter {
    raycaster: Raycaster
    mouse: Vector2
    HighlightedPoint: { a: Vector3; b: Vector3; c: Vector3 }
    marker: Mesh
    triangle: Triangle
    pointsList: Vector3[]
    numberOfClicks: number
    LineMaterial: LineBasicMaterial
    LinePoints: Vector3[]
    objects: Object3D[] = []
    renderer: Renderer
    camera: Camera
    scene: Scene
  
    private constructor( camera:Camera, scene: Scene, renderer: Renderer, objects: Object3D[]) 
    {
      super(); 
      this.camera = camera
      this.scene = scene
      this.renderer = renderer
      this.objects = objects
      this.raycaster = new Raycaster()
      this.raycaster.params.Line.threshold = 0.2
      this.raycaster.params.Mesh.threshold = 0.4
      this.raycaster.params.Points.threshold = 0.8
      this.mouse = new Vector2();
      this.HighlightedPoint = { a: new Vector3(), b: new Vector3(), c: new Vector3() }
      this.marker = new Mesh(new RingGeometry(0.1, 0.13, 20), new MeshBasicMaterial({
        color: 0xae0000, transparent: true, depthTest: false
      }));
      this.marker.name = 'VertexSnippingMarker'
      this.triangle = new Triangle()
      this.pointsList = []
  
      this.numberOfClicks = 1
      this.LineMaterial = new LineBasicMaterial({ color: 0xff0000 })

      this.LinePoints = []
      instance = this
    }

    static InitializeRaycaster(camera: Camera, scene: Scene, renderer: Renderer, objects: Object3D[])
    {
        return instance ?? new Raycasting(camera, scene, renderer, objects)
    }
  
    /**
     * Computes the position of the mouse on the screen
     * calculate mouse position in normalized device coordinates
     * (-1 to +1) for both components
     */
    #updateMousePosition(event: MouseEvent) {
      tempMouse.x =
        ((event.clientX / window.innerWidth) - this.camera.x) * (2 * window.innerWidth / this.camera.sizes.width) - 1
      tempMouse.y =
        -((event.clientY / window.innerHeight) - this.camera.y) * (2 * window.innerHeight / this.camera.sizes.height) + 1
      this.mouse = tempMouse
    }

    #getMarkerPosition(intersection:Intersection, scale:number)
    {
      if (intersection != null) {
        // if( instanceof Points) 
        // {
        //   const points: Vector3[] = []
        //   const numbers = intersection.object.geometry.attributes.position.array
        //   const hitPoint = new Vector3(intersection.point.x, intersection.point.y, intersection.point.z)
        //   for (let i = 0; i < numbers.length; i += 3) 
        //     points.push(new Vector3(numbers[i], numbers[i + 1], numbers[i + 2]))
        //   points.sort((a:Vector3,b:Vector3) => a.sub(hitPoint).length() - b.sub(hitPoint).length())
        //   this.marker.position.set(points[0].x, points[0].y,points[0].z)        
        // }
        // else this.marker.position.set(intersection.point.x, intersection.point.y, intersection.point.z)
        if(this.camera.instance instanceof PerspectiveCamera)
        {
          scale = intersection.distance / 18
          this.marker.lookAt(this.camera.instance.position)
        }
        else
        {
            scale = scaleFactor / this.camera.instance.zoom
            this.marker.lookAt(cameraVector)
        }
        this.marker.scale.set(scale, scale, 1)
      this.scene.add(this.marker)
      }
    }
  
    hover(event: MouseEvent) {
      this.#updateMousePosition(event);
      if (this.camera.instance instanceof PerspectiveCamera) {
        this.raycaster.setFromCamera(this.mouse, this.camera.instance)
      } 
      else {
        cameraVector.set(this.mouse.x, this.mouse.y, -1)
        cameraVector.unproject(this.camera.instance)
        dir.set(0, 0, -1).transformDirection(this.camera.instance.matrixWorld)
        this.raycaster.set(cameraVector, dir)
      }
      let scale = 1
      const intersection = this.raycaster.intersectObjects(this.scene.children)[0]
      console.log(intersection)
      if(intersection != null) this.#getMarkerPosition(intersection, scale)        
    }
  
    #mouseMove(event: MouseEvent) {
      instance?.hover(event)
    }
  
    #mouseDown(event: MouseEvent) 
    {
       if (event.button === 0) 
       {
         let object = instance?.scene.getObjectByName('VertexSnippingMarker');
         if (object != null){
          let pos = object.position.clone()
          instance.pointsList.push(new Vector3(pos.x,pos.y,pos.z));
          instance.trigger('OnOneClick')
         }        
         if (instance.numberOfClicks == instance.pointsList.length) {
          instance.scene.remove(instance.marker)
          instance.trigger('ExecuteCommand')
        }
       }
    }

    #keyDown(event:KeyboardEvent)
    {
      if(event.key === 'Enter') instance.trigger('ExecuteCommandKey');
    }
  
    #mouseWheel(event: MouseEvent) {
      //let object  instance?.scene.getObjectByName('VertexSnippingMarker')
      //if (object != null) instance?.scene.remove(object)
      instance?.hover(event)
    }
  
    enable(numberOfClicks:number = 1) {
      canvas.addEventListener('mousedown', this.#mouseDown)
      canvas.addEventListener('mousemove', this.#mouseMove)
      canvas.addEventListener("wheel", this.#mouseWheel)
      window.addEventListener("keydown", this.#keyDown)
      this.numberOfClicks = numberOfClicks;
      instance.pointsList = []
    }
  
    disable() {
      canvas.removeEventListener('mousedown', this.#mouseDown)
      canvas.removeEventListener('mousemove', this.#mouseMove)
      canvas.removeEventListener('wheel', this.#mouseWheel) 
      window.removeEventListener("keydown", this.#keyDown)
      this.scene.remove(this.marker)
      this.pointsList = []
    }
  }