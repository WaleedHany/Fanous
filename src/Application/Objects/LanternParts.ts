import * as THREE from "three"
import LanternPart from "./LanternPart"
import LanternBottom from "./LanternBottom"
import Lanternedge from "./edge"
import LanternBottomTop from "./lanternBottonTop"
import LanternMid from "./lanternMid"
import lanternTopFooter from "./lanternTopFooter"
import LanternNeck from "./lanternNeck"
import Rotations from "../Geomtry/Rotations"
import lanternTop2Head from "./LanternTop2Head"
import LanternTop from "./lanternTop"
// import vertex from "../Shaders/vertex.glsl"
// import fragment from "../Shaders/fragment.glsl"

let hangerMaterial :THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x885426, side:THREE.FrontSide, roughness:0.5, metalness:0.8, reflectivity:0.2 , depthTest:true, transparent:true}) //0x774315 //0x45D6D2
let material:THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x885426, side:THREE.DoubleSide, roughness:0.55, metalness:0.3, reflectivity:0.35 }) //0x774315 //0x45D6D2
let footerMaterial:THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x885426, side:THREE.DoubleSide, roughness:0.55, metalness:0.3, reflectivity:0.35}) //0x774315 //0x45D6D2
let bottomDomeMaterial:THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x885426, side:THREE.DoubleSide, roughness:0.55, metalness:0.3, reflectivity:0.35}) //0x774315 //0x45D6D2
let neckMaterial:THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x885426, side:THREE.DoubleSide, roughness:0.55, metalness:0.3, reflectivity:0.35}) //0x774315 //0x45D6D2
let ornamentMaterial:THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x885426, side:THREE.DoubleSide, roughness:1, metalness:0.1, reflectivity:0.1, transparent:true, })
let ornamentMaterial2:THREE.MeshPhysicalMaterial

let lampOnMaterial = new THREE.MeshPhysicalMaterial({
  metalness: .3,
  roughness: 0.0,
  envMapIntensity: 1,
  clearcoat: 1, color:0xff820f, // 0xffbe33, //new THREE.Color(1.0, 0.75, 0.1),
  transparent: true,
  opacity: .5,
  reflectivity: 0.0,
  ior: 0.0,
  side: THREE.FrontSide,
})

let lampOffMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0.4,
  roughness: 0.1,
  envMapIntensity: 0.9,
  clearcoat: 1,
  transparent: true,
  transmission: .95,
  opacity: 0.4,
  reflectivity: 1,
})

export default class LanternParts{
    TopDome:LanternPart|any
    TopDomeHead:LanternPart|any
    TopDomeNeck:LanternPart|any
    TopDomeBase:LanternPart|any
    MidLamp:LanternPart|any
    BottomDomeBase:LanternPart|any
    BottomDome:LanternPart|any
    edge:LanternPart|any
    glow:THREE.Mesh|any
    //glow2:THREE.Mesh|any
    hangerRing:THREE.Mesh|any
    object:THREE.Mesh|any
    textureLoader:THREE.TextureLoader
    ornaments: THREE.Mesh|any

    constructor(scene: THREE.Scene) { 
      this.textureLoader = new THREE.TextureLoader()
  
      // Load textures asynchronously
      Promise.all([
          this.loadTexture(`${import.meta.env.BASE_URL}Assets/Images/DomeTexture.png`),
          this.loadTexture(`${import.meta.env.BASE_URL}/Assets/Images/DomeBump.png`),
          this.loadTexture(`${import.meta.env.BASE_URL}/Assets/Images/ornaments2.png`),
          // this.loadTexture(`${import.meta.env.BASE_URL}/Assets/Images/GlassPattern.png`)
      ]).then(([colorTexture, bumpTexture, GlassPatternTexture]) => {
     
        colorTexture.wrapS = THREE.RepeatWrapping
        colorTexture.wrapT = THREE.RepeatWrapping
        colorTexture.repeat.set(0.040, 0.01) // Adjust as needed

        bumpTexture.wrapS = THREE.RepeatWrapping
        bumpTexture.wrapT = THREE.RepeatWrapping
        bumpTexture.repeat.set(0.040, 0.01)

          material.map = colorTexture
          material.bumpMap = bumpTexture
          material.bumpScale=20
          material.transparent = true
          //material.alphaMap=bumpTexture
          material.needsUpdate = true
  
          const bottomMaterialTexture = colorTexture.clone()
          const bottomMaterialBump = bumpTexture.clone()
          bottomMaterialTexture.repeat.set(0.050, 0.025)
          bottomMaterialBump.repeat.set(0.050, 0.025)

          bottomDomeMaterial.map = bottomMaterialTexture
          bottomDomeMaterial.bumpMap = bottomMaterialBump
          bottomDomeMaterial.bumpScale=20
          bottomDomeMaterial.transparent = true
          bottomDomeMaterial.needsUpdate = true

          const footerMaterialTexture = colorTexture.clone()
          const footerMaterialBump = bumpTexture.clone()
          footerMaterialTexture.repeat.set(0.05, 0.005)
          footerMaterialBump.repeat.set   (0.05, 0.005)

          footerMaterial.map = footerMaterialTexture
          footerMaterial.bumpMap = footerMaterialBump
          footerMaterial.bumpScale=20
          footerMaterial.transparent = true
          footerMaterial.needsUpdate = true

          const neckMaterialTexture = colorTexture.clone()
          const neckMaterialBump = bumpTexture.clone()
          neckMaterialTexture.repeat.set(6, 6)
          neckMaterialBump.repeat.set   (6, 6)

          neckMaterial.map = footerMaterialTexture
          neckMaterial.bumpMap = footerMaterialBump
          neckMaterial.bumpScale=20
          neckMaterial.transparent = true
          neckMaterial.needsUpdate = true
          
          const ornamentMaterialTexture = colorTexture.clone()
          const ornamentMaterialBump = bumpTexture.clone()
          ornamentMaterialTexture.repeat.set(0.06, 0.02)
          ornamentMaterialBump.repeat.set(0.06, 0.02)

          ornamentMaterial.map = ornamentMaterialTexture
          ornamentMaterial.bumpMap = ornamentMaterialBump
          ornamentMaterial.bumpScale=10
          ornamentMaterial.alphaMap = ornamentMaterialBump

          ornamentMaterial2 = material.clone()
          GlassPatternTexture.wrapS = THREE.RepeatWrapping
          GlassPatternTexture.wrapT = THREE.RepeatWrapping
          GlassPatternTexture.rotation = Math.PI
          const ornamentMaterialTexture2 = GlassPatternTexture
          const ornamentMaterialBump2 = GlassPatternTexture
          ornamentMaterialTexture2.repeat.set(0.118, 0.020)
          ornamentMaterialBump2.repeat.set(0.118, 0.020)

          ornamentMaterial2.map = ornamentMaterialTexture2
          ornamentMaterial2.bumpMap = ornamentMaterialBump2
          ornamentMaterial2.bumpScale = 40
          ornamentMaterial2.alphaMap = ornamentMaterialBump2
          ornamentMaterial2.transparent= true

          this.createLanternObjects(scene)
      }).catch(error => {
          console.error("Error loading textures:", error)
      })
    }
    loadTexture(path: string): Promise<THREE.Texture> {
      return new Promise((resolve, reject) => {
          this.textureLoader.load(
              path,
              texture => resolve(texture),
              undefined,
              error => reject(error)
          )
      })
  }

  createLanternObjects(scene: THREE.Scene) {
    this.TopDome = this.loadPointsFromSring(LanternTop.object)
    this.TopDomeHead = this.loadPointsFromSring(lanternTop2Head.object, hangerMaterial)
    this.TopDomeNeck = this.loadPointsFromSring(LanternNeck.object, neckMaterial)
    this.TopDomeBase = this.loadPointsFromSring(lanternTopFooter.object, footerMaterial)
    this.MidLamp = this.loadPointsFromSring(LanternMid.object, lampOnMaterial)
    this.BottomDomeBase = this.loadPointsFromSring(LanternBottomTop.object, neckMaterial)
    this.BottomDome = this.loadPointsFromSring(LanternBottom.object, bottomDomeMaterial) 
    const edges = this.loadPointsForEdgesFromString(Lanternedge.edge,6)
    this.TopDome.object.position.y +=  this.TopDome.height + this.TopDomeNeck.height + this.TopDomeBase.height + this.MidLamp.height-0.2
    this.TopDomeHead.object.position.y +=  this.TopDome.height + this.TopDomeNeck.height + this.TopDomeBase.height + this.MidLamp.height
    this.TopDomeHead.object.position.x += 0.2
    this.TopDomeNeck.object.position.y +=  this.TopDomeNeck.height + this.TopDomeBase.height + this.MidLamp.height - 0.1
    this.TopDomeBase.object.position.y +=  this.TopDomeBase.height + this.MidLamp.height
    this.BottomDome.object.position.y -= this.BottomDomeBase.height -0.5
    //#region MidLamp
    this.MidLamp.object.position.y += this.MidLamp.height
    this.MidLamp.object.renderOrder = 0
    this.glow = new THREE.Mesh(this.MidLamp.object.geometry.clone(), new THREE.MeshStandardMaterial({color:0xff820f, emissive:0xff820f, emissiveIntensity:4, side:THREE.DoubleSide}) )
    //new THREE.Mesh(new THREE.SphereGeometry(this.MidLamp.width / 2)
  //   new THREE.ShaderMaterial({
  //     vertexShader: vertex,
  //     fragmentShader: fragment,
  //     uniforms: {
  //       uColor: { value: new THREE.Vector4(1.0, 0.75, 0.1, 0.4) },
  //       glowStrength: { value: 2.4 },
  //       fadeDegree: { value: 3 },
  //     },
  //     blending: THREE.AdditiveBlending, opacity:0.15, depthTest:false,
  //     side: THREE.BackSide        
  // })

//   this.glow2 = new THREE.Mesh(new THREE.SphereGeometry(this.MidLamp.width / 2.8),  new THREE.ShaderMaterial({
//     vertexShader: vertex,
//     fragmentShader: fragment,
//     uniforms: {
//       uColor: { value: new THREE.Vector4(1.0, 0.95, 0.4, 0.4) },
//       glowStrength: { value: 1.1},
//       fadeDegree: { value: 4 },
//     },
//     blending: THREE.AdditiveBlending, opacity:0.3, depthTest:false,
//     side: THREE.BackSide        
// }))

 // this.glow.scale.set(1.5,1.4,1.5)
 //this.glow.scale.set(0.9,0.9,0.9)
  this.glow.position.set(this.MidLamp.object.position.x,this.MidLamp.object.position.y,this.MidLamp.object.position.z)
  //this.glow2.position.set(this.MidLamp.object.position.x,this.MidLamp.object.position.y-42,this.MidLamp.object.position.z)
  const light=new THREE.PointLight()
  light.intensity=5
  light.position.set(this.MidLamp.object.position.x,this.MidLamp.object.position.y-22,this.MidLamp.object.position.z)

  this.ornaments = new THREE.Mesh(this.MidLamp.geometry, ornamentMaterial)
  this.ornaments.position.set(this.MidLamp.object.position.x,this.MidLamp.object.position.y,this.MidLamp.object.position.z)
  this.ornaments.renderOrder=1
  this.ornaments.add(new THREE.Mesh(this.MidLamp.geometry, ornamentMaterial),new THREE.Mesh(this.MidLamp.geometry, ornamentMaterial))
   // ,new THREE.Mesh(this.MidLamp.geometry, ornamentMaterial)) //,new THREE.Mesh(this.MidLamp.geometry, ornamentMaterial))
  //#endregion // MidLamp
  this.object = new THREE.Mesh()

  this.hangerRing = new THREE.Mesh(new THREE.TorusGeometry(4,0.8, 3), hangerMaterial)
  this.hangerRing.position.set(this.TopDome.object.position.x,this.TopDome.object.position.y+4,this.TopDome.object.position.z)
  this.hangerRing.renderOrder = 1

     this.object.add(this.hangerRing, this.TopDome.object, this.TopDomeNeck.object, this.TopDomeBase.object,  this.MidLamp.object,
                   this.BottomDomeBase.object, this.BottomDome.object, this.glow, light) //, ornaments,, this.TopDomeHead.object,this.glow2 ,

    for(let edge of edges){
      edge.object.position.y += edge.height
        edge.object.position.x += 0.5
       this.object.add(edge.object)
     }
     this.object.rotation.y = 22/21
    scene.add(this.object)
  }


    createObject(points:{points:THREE.Vector3[][], width:number, height:number, avgX:number, minY:number}, definedMaterial:THREE.Material|null = null)
    : LanternPart{
      let uvs = []
      let contourPoints: number[] = []
      for(let i = 0; i<points.points.length; i+=1){
        for(let j = 0; j<points.points[i].length; j+=1)
        {      
          let point = points.points[i][j]           
          contourPoints.push(point.x)
          contourPoints.push(point.y)
          contourPoints.push(point.z)
          uvs.push(i,j)
        } 
      }
      const uvsArray = new Float32Array(uvs)
       let indices: number[] = []
       const length = Math.floor(Math.sqrt(contourPoints.length/3))
       for (let i = 0 ;i<(contourPoints.length/3)-length; i++)
           if(i == 0 || (i+1)%length != 0) indices.push(i, i+length, i+1, i+length, i+length+1, i+1)
       const meshGeometry = new THREE.BufferGeometry()
       const verticesArray = new Float32Array(contourPoints)
       const indicesArray = new Uint16Array(indices)
       meshGeometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3))
       meshGeometry.setAttribute('uv', new THREE.BufferAttribute(uvsArray, 2))
       meshGeometry.setIndex(new THREE.BufferAttribute(indicesArray, 1))
       meshGeometry.computeVertexNormals()
       meshGeometry.computeTangents()
       let objectMaterial:THREE.Material = material
       if(definedMaterial != null) objectMaterial = definedMaterial
       return new LanternPart(meshGeometry, points.height, points.width, points.avgX, points.minY, objectMaterial)   
      }

      loadPointsForEdgesFromString(pointsString:string, numberOfEdges:number, definedMaterial:THREE.Material|null = null):LanternPart[] {
        const pointsArray = JSON.parse(pointsString)
    
        // Convert each point into a THREE.Vector3 object
        const vector3Array = pointsArray.map((group: { x: number | undefined; y: number | undefined; z: number | undefined }[]) => 
        group.map((point: { x: number | undefined; y: number | undefined; z: number | undefined }) => new THREE.Vector3(point.x, point.y, point.z)))
    
        let points = this.normalizePoints(vector3Array)
        let parts = []
        for(let i = 0; i< numberOfEdges; i++){
          const angle = 44*i/(7*numberOfEdges)
          let uvs = []
          let contourPoints: number[] = []
          for(let j = 0; j<points.points.length; j++){
            for(let k = 0; k<points.points[j].length; k++)
            {
              if(angle == 0) points.points[j][k].x -= this.MidLamp.width/2 - points.width/4.1
              let point = points.points[j][k]
              if(angle!=0) point = Rotations.rotatePointAboutArbitraryAxisPassingThroughAPoint( 
                points.points[j][k], angle, new THREE.Vector3(0,1,0), new THREE.Vector3(this.MidLamp.avgX,0,0))
              contourPoints.push(point.x)
              contourPoints.push(point.y)
              contourPoints.push(point.z)
              uvs.push(j,k)
            }  
          }
          const uvsArray = new Float32Array(uvs)
          let indices: number[] = []
          const length = Math.floor(Math.sqrt(contourPoints.length/3))
          for (let i = 0; i<(contourPoints.length/3)-length; i++)
              if(i == 0 || (i+1)%length != 0) indices.push(i, i+length, i+1, i+length, i+length+1, i+1)
          const meshGeometry = new THREE.BufferGeometry()
          const verticesArray = new Float32Array(contourPoints)
          const indicesArray = new Uint16Array(indices)
          meshGeometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3))
          meshGeometry.setAttribute('uv', new THREE.BufferAttribute(uvsArray, 2))
          meshGeometry.setIndex(new THREE.BufferAttribute(indicesArray, 1))
          meshGeometry.computeVertexNormals()
          meshGeometry.computeTangents()
          let objectMaterial:THREE.Material = material
          if(definedMaterial != null) objectMaterial = definedMaterial
          parts.push( new LanternPart(meshGeometry, points.height, points.width, points.avgX, points.minY, objectMaterial) )
        }
        return parts
    }

    loadPointsFromSring(pointsString:string, definedMaterial:THREE.Material|null = null):LanternPart {
        const pointsArray = JSON.parse(pointsString)
    
        // Convert each point into a THREE.Vector3 object
        const vector3Array = pointsArray.map((group: { x: number | undefined; y: number | undefined; z: number | undefined }[]) => 
        group.map((point: { x: number | undefined; y: number | undefined; z: number | undefined }) => new THREE.Vector3(point.x, point.y, point.z)))
    
        let points = this.normalizePoints(vector3Array)
        return this.createObject(points, definedMaterial)
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
              totalX += point.x
              count++
              if (point.y < minY) minY = point.y
              if (point.y > maxY) maxY = point.y
              if (point.x < minX) minX = point.x
              if (point.x > maxX) maxX = point.x
          })
        })
    
        let width = maxX-minX
        let height = maxY - minY
        // Calculate the average x value
        const avgX = totalX / count
    
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

    changeLampColor(color:THREE.Color){
      //this.glow.material.uniforms.uColor.value.set(color.r, color.g, color.b, 0.4)
      //this.glow2.material.uniforms.uColor.value.set(color.r, color.g, color.b, 0.4)
      this.MidLamp.object.material.color = color
      this.glow.material.color = color
      this.glow.material.emissive = color
    }
    changeWoodColor(color:THREE.Color){
      material.color = color
      neckMaterial.color = color
      bottomDomeMaterial.color = color
      footerMaterial.color = color
      ornamentMaterial.color = color
      hangerMaterial.color = color
    }
    ToggleLight(light:boolean){
      if(!light){
        this.MidLamp.object.material = lampOffMaterial
        this.object.remove(this.glow)
      } 
      else{
        this.MidLamp.object.material = lampOnMaterial
        this.object.add(this.glow)
      }
    }

    Addornaments(addornaments:boolean){
      if(addornaments) {
        this.object.add(this.ornaments)
       // this.object.remove(this.)
      }
      else this.object.remove(this.ornaments)
    }

    updateLightIntensity(intensity:number){
      this.glow.material.emissiveIntensity = intensity
    }
}