import * as THREE from "three"
import LanternPart from "./LanternPart"
import LanternTop2 from "./lanternTop2"
import LanternBottom from "./LanternBottom"
import Lanternedge from "./edge"
import LanternBottomTop from "./lanternBottonTop"
import LanternMid from "./lanternMid"
import lanternTopFooter from "./lanternTopFooter"
import LanternNeck from "./lanternNeck"
import Renderer from "../Utils/Renderer"
import Rotations from "../Geomtry/Rotations"

let material:THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x885426, side:THREE.DoubleSide, roughness:0.55, metalness:0.3, reflectivity:0.35 }) //0x774315 //0x45D6D2
let footerMaterial:THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x885426, side:THREE.DoubleSide, roughness:0.55, metalness:0.3, reflectivity:0.35}) //0x774315 //0x45D6D2
let bottomDomeMaterial:THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x885426, side:THREE.DoubleSide, roughness:0.55, metalness:0.3, reflectivity:0.35}) //0x774315 //0x45D6D2
let neckMaterial:THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ color: 0x885426, side:THREE.DoubleSide, roughness:0.55, metalness:0.3, reflectivity:0.35}) //0x774315 //0x45D6D2
let texture = new THREE.Texture()
let bump = new THREE.Texture()

let lampOnMaterial = new THREE.MeshPhysicalMaterial({
  metalness: .3,
  roughness: .1,
  envMapIntensity: 0.9,
  clearcoat: 1, color:new THREE.Color(1.0, 0.75, 0.1),
  transparent: true,
  // transmission: .95,
  opacity: .5,
  reflectivity: 0.8,
  ior: 0.9,
  side: THREE.BackSide,
})

let lampOffMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0.1,
  roughness: 0.9,
  envMapIntensity: 0.9,
  clearcoat: 1,
  transparent: true,
  transmission: .95,
  opacity: 0.6,
  reflectivity: 0.8,
})

export default class LanternParts{
    TopDome:LanternPart|any
    TopDomeNeck:LanternPart|any
    TopDomeBase:LanternPart|any
    MidLamp:LanternPart|any
    BottomDomeBase:LanternPart|any
    BottomDome:LanternPart|any
    edge:LanternPart|any
    glow:THREE.Mesh|any
    glow2:THREE.Mesh|any

    object:THREE.Mesh|any
    textureLoader:THREE.TextureLoader
  ornaments: THREE.Mesh|any

    constructor(renderer: Renderer) { 
      this.textureLoader = new THREE.TextureLoader();
  
      // Load textures asynchronously
      Promise.all([
          this.loadTexture(`${import.meta.env.BASE_URL}Assets/Images/DomeTexture.png`),
          this.loadTexture(`${import.meta.env.BASE_URL}/Assets/Images/DomeBump.png`)
      ]).then(([colorTexture, bumpTexture]) => {
     
        colorTexture.wrapS = THREE.RepeatWrapping;
        colorTexture.wrapT = THREE.RepeatWrapping;
        colorTexture.repeat.set(0.040, 0.01); // Adjust as needed

        bumpTexture.wrapS = THREE.RepeatWrapping;
        bumpTexture.wrapT = THREE.RepeatWrapping;
        bumpTexture.repeat.set(0.040, 0.01);

        texture = colorTexture.clone()
        bump = bumpTexture.clone()

          material.map = colorTexture;
          material.bumpMap = bumpTexture;
          material.bumpScale=20
          material.transparent = true;
          material.alphaTest = 0.5;
          material.needsUpdate = true;
  
          const bottomMaterialTexture = colorTexture.clone()
          const bottomMaterialBump = bumpTexture.clone()
          bottomMaterialTexture.repeat.set(0.050, 0.025)
          bottomMaterialBump.repeat.set(0.050, 0.025)

          bottomDomeMaterial.map = bottomMaterialTexture;
          bottomDomeMaterial.bumpMap = bottomMaterialBump;
          bottomDomeMaterial.bumpScale=20
          bottomDomeMaterial.transparent = true;
          bottomDomeMaterial.alphaTest = 0.5;
          bottomDomeMaterial.needsUpdate = true;

          const footerMaterialTexture = colorTexture.clone()
          const footerMaterialBump = bumpTexture.clone()
          footerMaterialTexture.repeat.set(0.05, 0.005)
          footerMaterialBump.repeat.set   (0.05, 0.005)

          footerMaterial.map = footerMaterialTexture;
          footerMaterial.bumpMap = footerMaterialBump;
          footerMaterial.bumpScale=20
          footerMaterial.transparent = true;
          footerMaterial.alphaTest = 0.5;
          footerMaterial.needsUpdate = true;

          const neckMaterialTexture = colorTexture.clone()
          const neckMaterialBump = bumpTexture.clone()
          neckMaterialTexture.repeat.set(6, 6)
          neckMaterialBump.repeat.set   (6, 6)

          neckMaterial.map = footerMaterialTexture;
          neckMaterial.bumpMap = footerMaterialBump;
          neckMaterial.bumpScale=20
          neckMaterial.transparent = true;
          neckMaterial.alphaTest = 0.5;
          neckMaterial.needsUpdate = true;
          // Now proceed with object creation after textures are loaded
          this.createLanternObjects(renderer);
      }).catch(error => {
          console.error("Error loading textures:", error);
      });
    }

    loadTexture(path: string): Promise<THREE.Texture> {
      return new Promise((resolve, reject) => {
          this.textureLoader.load(
              path,
              texture => resolve(texture), // On success, resolve the texture
              undefined,
              error => reject(error) // On error, reject the promise
          );
      });
  }


  createLanternObjects(renderer: Renderer) {
    this.TopDome = this.loadPointsFromSring(LanternTop2.object)
    this.TopDomeNeck = this.loadPointsFromSring(LanternNeck.object, neckMaterial)
    this.TopDomeBase = this.loadPointsFromSring(lanternTopFooter.object, footerMaterial)
    this.MidLamp = this.loadPointsFromSring(LanternMid.object)
    this.BottomDomeBase = this.loadPointsFromSring(LanternBottomTop.object, neckMaterial)
    this.BottomDome = this.loadPointsFromSring(LanternBottom.object, bottomDomeMaterial) 
    const edges = this.loadPointsForEdgesFromString(Lanternedge.edge,6)
    this.TopDome.object.position.y +=  this.TopDome.height + this.TopDomeNeck.height + this.TopDomeBase.height + this.MidLamp.height-0.2
    this.TopDomeNeck.object.position.y +=  this.TopDomeNeck.height + this.TopDomeBase.height + this.MidLamp.height - 0.1
    this.TopDomeBase.object.position.y +=  this.TopDomeBase.height + this.MidLamp.height
    this.BottomDome.object.position.y -= this.BottomDomeBase.height -0.5
    //#region MidLamp
    this.MidLamp.object.position.y += this.MidLamp.height
    this.MidLamp.object.renderOrder = 0
    this.MidLamp.updatematerial(lampOnMaterial)
    this.glow = new THREE.Mesh(new THREE.SphereGeometry(this.MidLamp.width/2),  new THREE.ShaderMaterial({
      vertexShader: document.getElementById("atmosphereVertex")?.textContent!,
      fragmentShader: document.getElementById("atmosphereFragment")?.textContent!,
      uniforms: {
        uColor: { value: new THREE.Vector4(1.0, 0.75, 0.1, 0.4) },
        glowStrength: { value: 2 },
      },
      blending: THREE.AdditiveBlending, opacity:0.15, depthTest:false,
      side: THREE.BackSide        
  }))
  this.glow2 = new THREE.Mesh(new THREE.SphereGeometry(this.MidLamp.width/2.8),  new THREE.ShaderMaterial({
    vertexShader: document.getElementById("atmosphereVertex")?.textContent!,
    fragmentShader: document.getElementById("atmosphereFragment")?.textContent!,
    uniforms: {
      uColor: { value: new THREE.Vector4(1.0, 0.95, 0.4, 0.4) },
      glowStrength: { value: 1},
    },
    blending: THREE.AdditiveBlending, opacity:0.1, depthTest:false,
    side: THREE.BackSide        
}))
  this.glow.scale.set(1.5,1.3,1.5)
  this.glow.position.set(this.MidLamp.object.position.x,this.MidLamp.object.position.y-22,this.MidLamp.object.position.z)
  this.glow2.position.set(this.MidLamp.object.position.x,this.MidLamp.object.position.y-34,this.MidLamp.object.position.z)
  const light=new THREE.PointLight()
  light.intensity=5
  light.position.set(this.MidLamp.object.position.x,this.MidLamp.object.position.y-22,this.MidLamp.object.position.z)

  this.ornaments = new THREE.Mesh(this.MidLamp.geometry, material.clone())
  this.ornaments.position.set(this.MidLamp.object.position.x,this.MidLamp.object.position.y,this.MidLamp.object.position.z)
  texture.repeat.set(0.12, 0.04)
  bump.repeat.set(0.12, 0.04)
  this.ornaments.material.map = texture
  this.ornaments.material.bumpMap = bump
  this.ornaments.material.alphaMap = bump
  this.ornaments.material.transparent= true
  //#endregion // MidLamp
  this.object = new THREE.Mesh()

  const ring = new THREE.Mesh(new THREE.TorusGeometry(4,0.8, 3), this.TopDome.object.material)
  ring.position.set(this.TopDome.object.position.x,this.TopDome.object.position.y+4,this.TopDome.object.position.z)
    //  this.MidLamp.object.layers.toggle(renderer.BLOOM_SCENE)
    //  this.MidLamp.object.userData = {isEmmisive: true}
     

     this.object.add(this.TopDome.object, this.TopDomeNeck.object, this.TopDomeBase.object,this.MidLamp.object,
                   this.BottomDomeBase.object, this.BottomDome.object, this.glow, this.glow2 ,light, ring) //, ornaments

    for(let edge of edges){
      edge.object.position.y += edge.height
      //edge.object.scale.set(1.045,1,1.045)
        edge.object.position.x += 0.5
       this.object.add(edge.object)
     }
    renderer.scene.add(this.object)
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
      const uvsArray = new Float32Array(uvs);
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
       return new LanternPart(meshGeometry, points.height, points.width, points.avgX, points.minY, objectMaterial)   
      }

      loadPointsForEdgesFromString(pointsString:string, numberOfEdges:number, definedMaterial:THREE.Material|null = null):LanternPart[] {
        const pointsArray = JSON.parse(pointsString)
    
        // Convert each point into a THREE.Vector3 object
        const vector3Array = pointsArray.map((group: { x: number | undefined; y: number | undefined; z: number | undefined }[]) => 
        group.map((point: { x: number | undefined; y: number | undefined; z: number | undefined }) => new THREE.Vector3(point.x, point.y, point.z)))
    
        let points = this.normalizePoints(vector3Array)
        let parts = []
        for(let i = 0; i< numberOfEdges;i++){
          const angle = 44*i/(7*numberOfEdges)
          let uvs = []
          let contourPoints: number[] = []
          for(let j = 0; j<points.points.length;j++){
            for(let k = 0; k<points.points[j].length;k++)
            {
              if(angle == 0) points.points[j][k].x -= this.MidLamp.width/2 - points.width/4.1
              let point = points.points[j][k]
              if(angle!=0) point = Rotations.rotatePointAboutArbitraryAxisPassingThroughAPoint( points.points[j][k], angle, new THREE.Vector3(0,1,0), new THREE.Vector3(this.MidLamp.avgX,0,0))
              contourPoints.push(point.x)
              contourPoints.push(point.y)
              contourPoints.push(point.z)
              uvs.push(j,k)
            }  
          }

          const uvsArray = new Float32Array(uvs);
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

    changeLampColor(color:THREE.Color){
      this.glow.material.uniforms.uColor.value.set(color.r, color.g, color.b, 0.4)
      this.glow2.material.uniforms.uColor.value.set(color.r, color.g, color.b, 0.4)
      this.MidLamp.object.material.color = color
    }
    changeWoodColor(color:THREE.Color){
      material.color = color
      neckMaterial.color = color
      bottomDomeMaterial.color = color
      footerMaterial.color = color
    }
    ToggleLight(light:boolean){
      if(!light){
        this.MidLamp.object.material = lampOffMaterial
        this.object.remove(this.glow, this.glow2)
      } 
      else{
        this.MidLamp.object.material = lampOnMaterial
        this.object.add(this.glow, this.glow2)
      }
    }

    Addornaments(addornaments:boolean){
      if(addornaments) this.object.add(this.ornaments)
      else this.object.remove(this.ornaments)
    }
}