import { Mesh, Object3D ,Raycaster,Vector3, Vector2, OrthographicCamera, Scene, MeshBasicMaterial, MeshStandardMaterial} from "three";

import Camera from "./Camera";

const tempMouse = new Vector2()
let instance:Selection|null = null
let cameraVector = new Vector3();
let dir = new Vector3();

export default class Selection
{
    canvas: HTMLCanvasElement;  
    camera: Camera;
    scene: Scene;
    raycaster: Raycaster;
    mouse: Vector2 = new Vector2();
    highlightMaterial:MeshBasicMaterial|MeshStandardMaterial
    selectedObject?:Mesh|null
    allowedIntersections:Object3D[] = []
    textDiv?: HTMLElement;

    private constructor(canvas : HTMLCanvasElement, camera:Camera, scene:Scene, highlightMaterial:MeshBasicMaterial|MeshStandardMaterial)
    {
        instance = this
        this.canvas = canvas
        this.camera = camera
        this.scene = scene
        this.raycaster = new Raycaster();
        this.highlightMaterial = highlightMaterial
    }

    static initialize(canvas:HTMLCanvasElement, camera:Camera, scene:Scene, 
                      highlightMaterial:MeshBasicMaterial|MeshStandardMaterial){
        return instance ?? (instance = new Selection(canvas, camera, scene, highlightMaterial));
    }

    /**
     * Computes the position of the mouse on the screen
     * calculate mouse position in normalized device coordinates
     * (-1 to +1) for both components
     */
    #updateMousePosition(event:any) 
    {
        const rect = this.canvas.getBoundingClientRect()
	    tempMouse.x = ((event.clientX - rect.left) / this.canvas.clientWidth ) *  2 - 1
        tempMouse.y = -((event.clientY - rect.top) / this.canvas.clientHeight) * 2 + 1
        this.mouse = tempMouse
     }

     #setCameraProjection()
     {
        if (this.camera.instance instanceof OrthographicCamera)
        {
            cameraVector.set(this.mouse.x, this.mouse.y, -1);
            cameraVector.unproject(this.camera.instance);
            dir.set( 0, 0, - 1 ).transformDirection( this.camera.instance.matrixWorld );
            this.raycaster.set(cameraVector, dir); 
        }
        else{
            this.raycaster.setFromCamera(this.mouse, this.camera.instance);
        }  
     }

    hover(event:any)
    {
        this.#updateMousePosition(event) 
        this.#setCameraProjection()

        // Cast a ray
        this.updateSelection()
        const intersection = this.raycaster.intersectObjects(this.allowedIntersections)[0];
        let object = intersection?.object as Mesh
        if(object != null)
        {
            if(object.userData["material"] && this.selectedObject != object)
            {
                if(this.selectedObject != null){
                    // Removes previous highlight
                    this.selectedObject.material = this.selectedObject.userData["material"]
                    this.selectedObject = null
                }
                this.selectedObject = object
                // highlight intersected object
                this.selectedObject.material = this.highlightMaterial
                if(object.userData["showLoad"] && this.textDiv != null)
                    this.textDiv.innerHTML = object.userData["load"]
            }
        }
        else if(this.selectedObject != null) {
            // Removes previous highlight
            this.selectedObject.material = this.selectedObject.userData["material"]
            if(this.textDiv != null) this.textDiv.innerHTML = ""
            this.selectedObject = null

        }
    }

    updateSelection()
    {
        this.allowedIntersections = this.scene.children.filter(s => s.userData["material"] || s.children.filter(c => c.userData["material"]))
    }

    #mouseMove(event:any){
        instance?.hover(event)
    }
  
    enable(){
        this.canvas.addEventListener('mousemove', this.#mouseMove)
    }

    disable(){
        this.canvas.removeEventListener('mousemove', this.#mouseMove)
    }
}