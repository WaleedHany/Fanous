import { ConeGeometry, CylinderGeometry, Group, Mesh, MeshBasicMaterial, Scene, Vector3 } from "three"

const hex = 0x008000;
const headLength = 3;

export default class DirectionArrow
{
    faceNo:number
    direction : Vector3
    arrow : Group = new Group()
    origin : Vector3
    static material = new MeshBasicMaterial( {color: hex} );
    static materialDark = new MeshBasicMaterial( {color: 0x222222} );

    constructor(faceNo:number, origin:Vector3, direction:Vector3, length: number)
    {
        this.faceNo = faceNo
        this.direction = direction
        this.origin = origin
        let arrowPosition = this.origin.clone().add(this.direction.clone().multiplyScalar(length-headLength/2))
        let midPoint = this.origin.clone().add(this.direction.clone().multiplyScalar((length-headLength)/2))
        let axisOfRotation = this.direction.cross(new Vector3(0,1,0))

        let arrowGeometry = new ConeGeometry(1, 3, 10,2,false) 
        let arrowMesh = new Mesh(arrowGeometry, DirectionArrow.material)

        arrowMesh.rotateOnWorldAxis(axisOfRotation, -22/14)
        arrowMesh.position.set(arrowPosition.x, arrowPosition.y, arrowPosition.z)

        const cylenderGeometry = new CylinderGeometry( 0.4, 0.4, length-headLength, 20);
        const cylenderMesh = new Mesh(cylenderGeometry, DirectionArrow.material)

        cylenderMesh.rotateOnWorldAxis(axisOfRotation, 22/14)
        cylenderMesh.position.set(midPoint.x, midPoint.y, midPoint.z)
        
        this.arrow.add(cylenderMesh)
        this.arrow.add(arrowMesh)
    }

    hideColor()
    {
        this.arrow.children.forEach(c => {if(c instanceof Mesh) c.material = DirectionArrow.materialDark})
    }

    showColor()
    {
        this.arrow.children.forEach(c => {if(c instanceof Mesh) c.material = DirectionArrow.material})
    }

    dispose(scene:Scene)
    {
        scene.remove(this.arrow)
        this.arrow.traverse(o => {if(o instanceof Mesh) o?.geometry?.dispose()})
    }
}