import * as THREE from "three"
import Vector3D from "../../Geometry/Vector3D"
import Command from "../Commands"
import BezierSurfacePatch from "../../Geometry/Surfaces/BezierSurfacePatch"

export default class DrawBezierSurfacePatchCommand extends Command
{
  scene: THREE.Scene
  pointsList: Vector3D[][]
  surface: BezierSurfacePatch

  constructor(pointsList:Vector3D[][], scene:THREE.Scene) 
  {
    super()
    this.scene = scene
    this.pointsList = pointsList
    this.surface = new BezierSurfacePatch(this.pointsList)
  }

  execute()
  {
    if(this.pointsList.length < 4) return
    let contourPoints: number[] = []
    let linematerial = new THREE.LineBasicMaterial( { color: 0xff7700} )
    for(let i = 0; i<=1.04; i+=0.04){
      let pointsInX :Vector3D[]= []
      let pointsInY :Vector3D[]= [] 
      for(let j = 0; j<=1.04; j+=0.04)
      {      
        let point = this.surface.evaluate(i, j)
        pointsInX.push(point)
        pointsInY.push(this.surface.evaluate(j, i))                     
        contourPoints.push(point.x)
        contourPoints.push(point.y)
        contourPoints.push(point.z)
      } 
      let lineGeomX = new THREE.BufferGeometry().setFromPoints(pointsInX.map(x => x.toVector3()) )
      let lineGeomY = new THREE.BufferGeometry().setFromPoints(pointsInY.map(x => x.toVector3()) )
      let lineX = new THREE.Line( lineGeomX, linematerial )
      let lineY = new THREE.Line( lineGeomY, linematerial )
      this.scene.add(lineX, lineY)
    }
    let indices: number[] = []
    const length = Math.sqrt(contourPoints.length/3)
    for (let i = 0; i<(contourPoints.length/3)-length; i++)
        if(i == 0 || (i+1)%length != 0) indices.push(i, i+length, i+1, i+length, i+length+1, i+1)
    const meshGeometry = new THREE.BufferGeometry()
    const verticesArray = new Float32Array(contourPoints)
    const indicesArray = new Uint16Array(indices)
    // console.log(indices,contourPoints)
    meshGeometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3))
    meshGeometry.setIndex(new THREE.BufferAttribute(indicesArray, 1))
    meshGeometry.computeVertexNormals()
    const material = new THREE.MeshPhongMaterial({ color: 0x45D6D2, side:THREE.DoubleSide, shininess:100, reflectivity:1,})
    const mesh = new THREE.Mesh(meshGeometry, material)
    const box = new THREE.BoxGeometry(2)
    this.scene.add(new THREE.Mesh(box, material))
    this.scene.add(mesh)

    let subLinematerial = new THREE.LineDashedMaterial( 
        { color:0x009999, dashSize: 1, gapSize: 1, linewidth: 4,scale: 1}) //linewidth: 2,
    for(let i = 0; i<this.pointsList.length;i++)
    {
      const pointsGeometry = new THREE.BufferGeometry().setFromPoints(this.pointsList[i].map(x => x.toVector3()))
      const pointsMaterial = new THREE.PointsMaterial({ color: 0x00ff00, size: 1.4})
      const controlPoints = new THREE.Points(pointsGeometry, pointsMaterial)
      this.scene.add(controlPoints)      
      const linesGeometry = new THREE.BufferGeometry().setFromPoints(this.pointsList[i].map(x => x.toVector3()));
      const lines = new THREE.Line(linesGeometry, subLinematerial);
      lines.computeLineDistances();
     // this.scene.add(lines)
    }

    // let normalIndicationMaterial = new THREE.LineBasicMaterial({ color: 0x008822,depthTest:false })
    // let tangentUMaterial = new THREE.LineBasicMaterial({ color: 0xff0000,depthTest:false })
    // let tangentVMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff,depthTest:false })
    // let p1 = this.surface.evaluate(0.1, 0.1)
    // let p2 = this.surface.evaluate(0.5, 0.5)
    // let p3 = this.surface.evaluate(0.1, 0.5)
    // let p4 = this.surface.evaluate(0.5, 0.1)
    // let p5 = this.surface.evaluate(0.3, 0.8)
    // let p6 = this.surface.evaluate(0.6, 0.2)
    // let p7 = this.surface.evaluate(0.9, 0.2)

    // let starts = [p1, p2, p3,p4,p5,p6,p7]
    // let n1 = this.surface.calculateNormal(0.1, 0.1)
    // let n2 = this.surface.calculateNormal(0.5, 0.5)
    // let n3 = this.surface.calculateNormal(0.1, 0.5)
    // let n4 = this.surface.calculateNormal(0.5, 0.1)
    // let n5 = this.surface.calculateNormal(0.3, 0.8)
    // let n6 = this.surface.calculateNormal(0.6, 0.2)
    // let n7 = this.surface.calculateNormal(0.9, 0.2)
   
    // let tus =     [p1.add(n1.tangentU.normalize()), p2.add(n2.tangentU.normalize()),p3.add(n3.tangentU.normalize()),p4.add(n4.tangentU.normalize()),p5.add(n5.tangentU.normalize()),p6.add(n6.tangentU.normalize()),p7.add(n7.tangentU.normalize())]
    // let tvs =     [p1.add(n1.tangentV.normalize()), p2.add(n2.tangentV.normalize()),p3.add(n3.tangentV.normalize()),p4.add(n4.tangentV.normalize()),p5.add(n5.tangentV.normalize()),p6.add(n6.tangentV.normalize()),p7.add(n7.tangentV.normalize())]
    // let normals = [p1.add(n1.normal  .normalize()), p2.add(n2.normal  .normalize()),p3.add(n3.normal  .normalize()),p4.add(n4.normal  .normalize())  ,p5.add(n5.normal.normalize())  ,p6.add(n6.normal.normalize())  ,p7.add(n7.normal.normalize())  ]
    
    // for (let i = 0; i < normals.length; i++){
    //   const tangentGeometry =
    //       new THREE.BufferGeometry().setFromPoints([starts[i], tus[i]].map(x => x.toVector3()));
    //   const tangentLine = new THREE.Line(tangentGeometry, tangentUMaterial);
    //   this.scene.add(tangentLine)

    //   const tangentGeometry1 =
    //       new THREE.BufferGeometry().setFromPoints([starts[i], tvs[i]].map(x => x.toVector3()));
    //   const tangentLine1 = new THREE.Line(tangentGeometry1, tangentVMaterial);
    //   this.scene.add(tangentLine1)

    //   const tangentGeometry2 =
    //       new THREE.BufferGeometry().setFromPoints([starts[i], normals[i]].map(x => x.toVector3()));
    //   const normalLine1 = new THREE.Line(tangentGeometry2, normalIndicationMaterial);
    //   this.scene.add(normalLine1)
    // }

    // let u = 0.89; let v = 0.94
    // let point = this.surface.evaluate(u, v)
    // let timeStamp = this.surface.getPointInversion(point)
    // console.log(u, v)
    // console.log(point)
    // console.log(timeStamp.u, timeStamp.v)
    // console.log(this.surface.evaluate(timeStamp.u, timeStamp.v))

    // u = 0.01; v = 0.12
    // point = this.surface.evaluate(u, v)
    // timeStamp = this.surface.getPointInversion(point)
    // console.log(u, v)
    // console.log(point)
    // console.log(timeStamp.u, timeStamp.v)
    // console.log(this.surface.evaluate(timeStamp.u, timeStamp.v))

    // let plane0 = new PlaneEquation(new Vector3D(0,0,0), new Vector3D(0,0,1))
    // let plane1 = new PlaneEquation(new Vector3D(0,0,4), new Vector3D(0,0,1))
    // let plane2 = new PlaneEquation(new Vector3D(0,0,8), new Vector3D(0,0,1))
    // let plane3 = new PlaneEquation(new Vector3D(0,0,8), new Vector3D(-1,1,0))
    // let intersections = this.surface.getPlaneIntersection(plane0)
    // intersections.push(...this.surface.getPlaneIntersection(plane1))
    // intersections.push(...this.surface.getPlaneIntersection(plane2))
    // let intersections2 = this.surface.getPlaneIntersection(plane3)
    // const pointsMaterial12 = new THREE.PointsMaterial({
    //     color: 0xff4444,
    //     size: 2,
    //     })
    // const pointsMaterial13 = new THREE.PointsMaterial({
    //     color: 0x4444ff,
    //     size: 2,
    //     })
    // let pointsGeometry12 = new THREE.BufferGeometry()
    //     .setFromPoints(intersections.map(p => p.point.toVector3()))
    // let pointsGeometry13 = new THREE.BufferGeometry()
    //     .setFromPoints(intersections2.map(p => p.point.toVector3()))
    // const controlPoints12 = new THREE.Points(pointsGeometry12, pointsMaterial12);
    // const controlPoints13 = new THREE.Points(pointsGeometry13, pointsMaterial13);
    // this.scene.add(controlPoints12, controlPoints13);
    // console.log("intersections", intersections, intersections2)
  }

  undo(){
  }
  redo(){
  }
  remove(){
  }
}