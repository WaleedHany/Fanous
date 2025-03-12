import { BufferGeometry, Material, Mesh, MeshPhongMaterial } from "three"

export default class LanternPart{
    material:Material = new MeshPhongMaterial()
    geometry:BufferGeometry
    height:number
    width:number
    midX : number
    bottomY : number
    object : Mesh


    constructor(geometry : BufferGeometry, heigh:number, width:number, midX:number, bottomY:number, material:Material = new MeshPhongMaterial()) {
        this.geometry = geometry
        this.height = heigh
        this.width = width
        this.midX = midX
        this.bottomY = bottomY
        this.material = material
        this.object = new Mesh(this.geometry, this.material)
        this.object.renderOrder = 1
    }

    updatematerial(material:Material){
        this.material = material
        this.object.material = material
    }
}