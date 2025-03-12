import * as THREE from "three";
import LanternPart from "./LanternPart";
import LanternTop2 from "./lanternTop2";
import LanternBottom from "./LanternBottom";
import Lanternedge from "./edge";
import LanternBottomTop from "./lanternBottonTop";
import LanternMid from "./lanternMid";
import lanternTopFooter from "./lanternTopFooter";
import LanternNeck from "./lanternNeck";
import Renderer from "../Utils/Renderer";

export default class LanternParts{
    TopDome:LanternPart
    TopDomeNeck:LanternPart
    TopDomeBase:LanternPart
    MidLamp:LanternPart
    BottomDomeBase:LanternPart
    BottomDome:LanternPart
    edge:LanternPart
    object:THREE.Mesh

    constructor(renderer:Renderer) {
       
        this.TopDome = this.loadPointsFromSring(LanternTop2.object)
        this.TopDomeNeck = this.loadPointsFromSring(LanternNeck.object)
        this.TopDomeBase = this.loadPointsFromSring(lanternTopFooter.object)
        this.MidLamp = this.loadPointsFromSring(LanternMid.object)
        this.BottomDomeBase = this.loadPointsFromSring(LanternBottomTop.object)
        this.BottomDome = this.loadPointsFromSring(LanternBottom.object)
        this.edge = this.loadPointsFromSring(Lanternedge.edge)

         this.TopDome.object.position.y +=  this.TopDome.height + this.TopDomeNeck.height + this.TopDomeBase.height + this.MidLamp.height
         this.TopDomeNeck.object.position.y +=  this.TopDomeNeck.height + this.TopDomeBase.height + this.MidLamp.height
         this.TopDomeBase.object.position.y +=  this.TopDomeBase.height + this.MidLamp.height
         this.MidLamp.object.position.y +=this.MidLamp.height
         this.MidLamp.object.renderOrder=0
         this.edge.object.position.y +=this.edge.height
         this.edge.object.position.x -=(this.MidLamp.width/2 - this.edge.width/3.6)

     
         this.BottomDome.object.position.y -= this.BottomDomeBase.height
         this.MidLamp.updatematerial(new THREE.MeshBasicMaterial({color:0xAA6612, side:THREE.DoubleSide, transparent:true, opacity:0.5}))
        
         this.MidLamp.object.layers.toggle(renderer.BLOOM_SCENE)
         this.MidLamp.object.userData = {isEmmisive: false}
         this.object = new THREE.Mesh()

        this.object.add(this.TopDome.object, this.TopDomeNeck.object, this.TopDomeBase.object,this.MidLamp.object,
                       this.BottomDomeBase.object, this.BottomDome.object, this.edge.object)
    }

    loadPointsFromSring(pointsString:string):LanternPart {
        const pointsArray = JSON.parse(pointsString)
    
        // Convert each point into a THREE.Vector3 object
        const vector3Array = pointsArray.map((group: { x: number | undefined; y: number | undefined; z: number | undefined }[]) => 
        group.map((point: { x: number | undefined; y: number | undefined; z: number | undefined }) => new THREE.Vector3(point.x, point.y, point.z)))
    
        let points = this.normalizePoints(vector3Array)
    
        let contourPoints: number[] = []
        for(let i = 0; i<points.points.length; i+=1){
          for(let j = 0; j<points.points[i].length; j+=1)
          {      
            let point = points.points[i][j]           
            contourPoints.push(point.x)
            contourPoints.push(point.y)
            contourPoints.push(point.z)
          } 
        }
    
         let indices: number[] = []
         const length = Math.floor(Math.sqrt(contourPoints.length/3))
         for (let i = 0; i<(contourPoints.length/3)-length; i++)
             if(i == 0 || (i+1)%length != 0) indices.push(i, i+length, i+1, i+length, i+length+1, i+1)
         const meshGeometry = new THREE.BufferGeometry()
         const verticesArray = new Float32Array(contourPoints)
         const indicesArray = new Uint16Array(indices)
         meshGeometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3))
         meshGeometry.setIndex(new THREE.BufferAttribute(indicesArray, 1))
         meshGeometry.computeVertexNormals()
         let objectMaterial = new THREE.MeshPhongMaterial({ color: 0x45D6D2, side:THREE.DoubleSide, shininess:100, reflectivity:1})
         return new LanternPart(meshGeometry, points.height, points.width, points.avgX, points.minY, objectMaterial)   
        }
    
      normalizePoints(vector3Array: THREE.Vector3[][]): {points:THREE.Vector3[][], width:number, height:number, avgX:number, minY:number} {
        let totalX = 0
        let count = 0
        let minX = Infinity
        let minY = Infinity
        let maxX = 0
        let maxY = 0
    
        // Compute total x sum and min y value
        vector3Array.forEach(group => {
            group.forEach(point => {
              totalX += point.x;
              count++;
              if (point.y < minY) minY = point.y
              if (point.y > maxY) maxY = point.y
              if (point.x < minX) minX = point.x
              if (point.x > maxX) maxX = point.x
          });
        });
    
        let width = maxX-minX
        let height = maxY - minY
        // Calculate the average x value
        const avgX = totalX / count;
    
        let points = vector3Array.map(group =>
          group.map(point => new THREE.Vector3(
              point.x - avgX,
              (point.y - minY) * -1,
              point.z // Keep z as is
          ))
        )
        minY = 0
        return {points, width, height, avgX, minY}
      }
}