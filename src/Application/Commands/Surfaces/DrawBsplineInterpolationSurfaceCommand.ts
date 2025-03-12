import * as THREE from "three"
import Vector3D from "../../Geometry/Vector3D"
import Command from "../Commands"
import BspLineInterpolationSurface from "../../Geometry/Surfaces/BspLineInterpolationSurface"
import PlaneEquation from "../../Geometry/PlaneEquation"

export default class DrawBsplineInterpolationSurfaceCommand extends Command {
  scene: THREE.Scene
  pointsList: Vector3D[][]
  surface: BspLineInterpolationSurface
  color:string = 'rgb(69, 214, 210)'

  constructor(pointsList:Vector3D[][], surface:BspLineInterpolationSurface, scene: THREE.Scene, color = 'rgb(69, 214, 210)')
  {
    super()
    this.scene = scene
    this.pointsList = pointsList
    this.surface = surface
    this.color = color
  }

  execute() {
    if (this.pointsList.length < 1) return
    let contourPoints: number[] = []
    let uvs: number[] = []
    let vertexNormals:number[] = []
    for(let i = 0; i<1.02; i+=0.02)
    {
      let pointsInX :Vector3D[]= []
      let pointsInY: Vector3D[] = []
      for(let j = 0; j<1.02; j+=0.02)
      {      
          let point = this.surface.evaluate(i, j)
          let normalVectors = this.surface.calculateNormal(i, j)
          const normal = normalVectors.normal.normalize()
          pointsInX.push(point)
          pointsInY.push(this.surface.evaluate(j, i))                     
          contourPoints.push(point.x, point.y, point.z)
          vertexNormals.push(normal.x, normal.y, normal.z)
          uvs.push(i,j)
      }
      let linematerial = new THREE.LineBasicMaterial( { color: 0xff7700} )
      let lineGeomX = new THREE.BufferGeometry().setFromPoints(pointsInX.map(x => x.toVector3()) )
      let lineGeomY = new THREE.BufferGeometry().setFromPoints(pointsInY.map(x => x.toVector3()) )
      let lineX = new THREE.Line( lineGeomX, linematerial )
      let lineY = new THREE.Line( lineGeomY, linematerial )
      this.scene.add(lineX, lineY)
  }
  let indices = []
  let length = Math.sqrt(contourPoints.length/3)
  for (let i = 0; i<(contourPoints.length/3)-length; i++)
      if(i == 0 || (i+1)%length != 0)indices.push(i,i+length, i+1, i+1, i+length, i+length+1)
  const meshGeometry = new THREE.BufferGeometry()
  const verticesArray = new Float32Array(contourPoints)
  const normalsArray = new Float32Array(vertexNormals)
  const uvArray = new Float32Array(uvs)
  const indicesArray = new Uint16Array(indices)
  meshGeometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3))
  meshGeometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2))
  meshGeometry.setAttribute('normal', new THREE.Float32BufferAttribute( normalsArray, 3 ) )
  meshGeometry.setIndex(new THREE.BufferAttribute(indicesArray, 1))   
  meshGeometry.computeTangents()

  const material = new THREE.MeshStandardMaterial({ color: this.color, side: THREE.DoubleSide, metalness:0.6,roughness:1 })

      const mesh = new THREE.Mesh(meshGeometry, material) //sandMaterial
      this.scene.add(mesh)
 
  let subLinematerial = new THREE.LineDashedMaterial({
    color: 0x009999,
    dashSize: 1,
    gapSize: 1,
    linewidth: 4,
    scale: 1,
  }); //linewidth: 2,
    
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0x00ff00,
    size: 1.4,
  });
    
    for (let i = 0; i < this.pointsList.length; i++) {
      const pointsGeometry = new THREE.BufferGeometry().setFromPoints(
        this.pointsList[i].map((x) => x.toVector3())
      );
  
      const controlPoints = new THREE.Points(pointsGeometry, pointsMaterial);
      this.scene.add(controlPoints);
      const linesGeometry = new THREE.BufferGeometry().setFromPoints(
        this.pointsList[i].map((x) => x.toVector3())
      );
      const lines = new THREE.Line(linesGeometry, subLinematerial);
      lines.computeLineDistances();
      this.scene.add(lines);
    }

    let normalIndicationMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      depthTest: false,
    });
    let tangentUMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
      depthTest: false,
    });
    let tangentVMaterial = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      depthTest: false,
    });
    // let p1 = this.surface.evaluate(0.318, 0.5468)
    // let p2 = this.surface.evaluate(0.629, 0.621)
    // let p3 = this.surface.evaluate(0.632, 0.7543)
    // let p4 = this.surface.evaluate(0.512, 0.32)
    // let p5 = this.surface.evaluate(0.95, 0.447)
    // let p6 = this.surface.evaluate(0.84, 0.83)
    // let p7 = this.surface.evaluate(0.444, 0.976)

    // let starts = [p1, p2, p3, p4, p5, p6, p7]
    // let n1 = this.surface.calculateNormal(0.318, 0.5468)
    // let n2 = this.surface.calculateNormal(0.629, 0.621)
    // let n3 = this.surface.calculateNormal(0.632, 0.7543)
    // let n4 = this.surface.calculateNormal(0.512, 0.32)
    // let n5 = this.surface.calculateNormal(0.95, 0.447)
    // let n6 = this.surface.calculateNormal(0.84, 0.83)
    // let n7 = this.surface.calculateNormal(0.444, 0.976)

    // let tus = [
    //   p1.add(n1.tangentU.normalize()),
    //   p2.add(n2.tangentU.normalize()),
    //   p3.add(n3.tangentU.normalize()),
    //   p4.add(n4.tangentU.normalize()),
    //   p5.add(n5.tangentU.normalize()),
    //   p6.add(n6.tangentU.normalize()),
    //   p7.add(n7.tangentU.normalize()),
    // ];
    // let tvs = [
    //   p1.add(n1.tangentV.normalize()),
    //   p2.add(n2.tangentV.normalize()),
    //   p3.add(n3.tangentV.normalize()),
    //   p4.add(n4.tangentV.normalize()),
    //   p5.add(n5.tangentV.normalize()),
    //   p6.add(n6.tangentV.normalize()),
    //   p7.add(n7.tangentV.normalize()),
    // ];
    // let normals = [
    //   p1.add(n1.normal.normalize()),
    //   p2.add(n2.normal.normalize()),
    //   p3.add(n3.normal.normalize()),
    //   p4.add(n4.normal.normalize()),
    //   p5.add(n5.normal.normalize()),
    //   p6.add(n6.normal.normalize()),
    //   p7.add(n7.normal.normalize()),
    // ];

    // for (let i = 0; i < normals.length; i++) {
    //   const tangentGeometry = new THREE.BufferGeometry().setFromPoints(
    //     [starts[i], tus[i]].map((x) => x.toVector3())
    //   );
    //   const tangentLine = new THREE.Line(tangentGeometry, tangentUMaterial);
    //   this.scene.add(tangentLine);

    //   const tangentGeometry1 = new THREE.BufferGeometry().setFromPoints(
    //     [starts[i], tvs[i]].map((x) => x.toVector3())
    //   );
    //   const tangentLine1 = new THREE.Line(tangentGeometry1, tangentVMaterial);
    //   this.scene.add(tangentLine1);

    //   const tangentGeometry2 = new THREE.BufferGeometry().setFromPoints(
    //     [starts[i], normals[i]].map((x) => x.toVector3())
    //   );
    //   const normalLine1 = new THREE.Line(
    //     tangentGeometry2,
    //     normalIndicationMaterial
    //   );
    //   this.scene.add(normalLine1);
    // }

    let u = 0.08; let v = 0.92
    let point = this.surface.evaluate(u, v)
    let timeStamp = this.surface.getPointInversion(point)
    console.log(u, v)
    console.log(point)
    console.log(timeStamp.u, timeStamp.v)
    console.log(this.surface.evaluate(timeStamp.u, timeStamp.v))

    u = 0.9916; v = 0.02
    point = this.surface.evaluate(u, v)
    timeStamp = this.surface.getPointInversion(point)
    console.log(u, v)
    console.log(point)
    console.log(timeStamp.u, timeStamp.v)
    console.log(this.surface.evaluate(timeStamp.u, timeStamp.v))

    u = 0.7; v = 0.8
    point = this.surface.evaluate(u, v)
    timeStamp = this.surface.getPointInversion(point)
    console.log(u, v)
    console.log(point)
    console.log(timeStamp.u, timeStamp.v)
    console.log(this.surface.evaluate(timeStamp.u, timeStamp.v))

    u = 0.6; v = 0.99
    point = this.surface.evaluate(u, v)
    timeStamp = this.surface.getPointInversion(point)
    console.log(u, v)
    console.log(point)
    console.log(timeStamp.u, timeStamp.v)
    console.log(this.surface.evaluate(timeStamp.u, timeStamp.v))

    u = 0.8654; v = 0.9812
    point = this.surface.evaluate(u, v)
    timeStamp = this.surface.getPointInversion(point)
    console.log(u, v)
    console.log(point)
    console.log(timeStamp.u, timeStamp.v)
    console.log(this.surface.evaluate(timeStamp.u, timeStamp.v))

    //let plane0 = new PlaneEquation(new Vector3D(0,0,0), new Vector3D(0,0,1))
    let plane1 = new PlaneEquation(new Vector3D(0,0,4), new Vector3D(0,0,1))
    //let plane2 = new PlaneEquation(new Vector3D(0,0,8), new Vector3D(0,0,1))
    let plane3 = new PlaneEquation(new Vector3D(0,0,8), new Vector3D(-1,1,0))
    let intersections = this.surface.getPlaneIntersection(plane1)
    //intersections.push(...this.surface.getPlaneIntersection(plane2))
    //intersections.push(...this.surface.getPlaneIntersection(plane0))
    let intersections2 = this.surface.getPlaneIntersection(plane3)
    const pointsMaterial12 = new THREE.PointsMaterial({color: 0xff4444, size: 2})
    const pointsMaterial13 = new THREE.PointsMaterial({color: 0x4444ff, size: 2})
    const pointsMaterial14 = new THREE.PointsMaterial({color: 0x4444ff, size: 2})
    let pointsGeometry12 = new THREE.BufferGeometry()
        .setFromPoints(intersections.filter(i => i.correct).map(p => p.point.toVector3()))
    let pointsGeometry13 = new THREE.BufferGeometry()
        .setFromPoints(intersections2.filter(i => i.correct).map(p => p.point.toVector3()))
    // const curve = new NURBSCurve(intersections2.map(p => p.point))
    // DrawNURBSCurveCommand.SetCurve(curve, this.scene, 'purple').execute()
    const point6 = new Vector3D(54,62,8)
    const pointsMaterial16 = new THREE.PointsMaterial({color: 0xff88ff, size: 3})
    const projection = this.surface.getPointInversion(point6)
    console.log('projection', projection.u, projection.v)
    const projected = this.surface.evaluate(projection.u, projection.v)
    let pointsGeometry16 = new THREE.BufferGeometry()
        .setFromPoints([point6, projected].map(p => p.toVector3()))
    const controlPoints16 = new THREE.Points(pointsGeometry16, pointsMaterial16)
    const normal1 = projected.subtract(point6).normalize()
    console.log(normal1, this.surface.calculateNormal(projection.u, projection.v).normal.normalize())

    const controlPoints12 = new THREE.Points(pointsGeometry12, pointsMaterial12)
    const controlPoints13 = new THREE.Points(pointsGeometry13, pointsMaterial13)
    this.scene.add(controlPoints12, controlPoints13, controlPoints16);

    // let notCorrect = intersections.filter(i => !i.correct).concat(...intersections2.filter(i => !i.correct))
    // notCorrect.forEach(e =>{
    //   const normal = this.surface.calculateNormal(e.u, e.v)
    //   const tangentGeometry = new THREE.BufferGeometry().setFromPoints(
    //     [e.point, e.point.add(normal.tangentU.normalize())].map((x) => x.toVector3())
    //   );
    //   const tangentLine = new THREE.Line(tangentGeometry, tangentUMaterial);
    //   this.scene.add(tangentLine);

    //   const tangentGeometry1 = new THREE.BufferGeometry().setFromPoints(
    //     [e.point, e.point.add(normal.tangentV.normalize())].map((x) => x.toVector3())
    //   );
    //   const tangentLine1 = new THREE.Line(tangentGeometry1, tangentVMaterial);
    //   this.scene.add(tangentLine1);

    //   const tangentGeometry2 = new THREE.BufferGeometry().setFromPoints(
    //     [e.point, e.point.add(normal.normal.normalize())].map((x) => x.toVector3())
    //   );
    //   const normalLine1 = new THREE.Line(
    //     tangentGeometry2,
    //     normalIndicationMaterial
    //   );
    //   this.scene.add(normalLine1);
    // })

    // let plane = new THREE.PlaneGeometry(200, 200)
    // plane.lookAt(new THREE.Vector3(0,0,1))
    // let plane2 = new THREE.PlaneGeometry(200, 200)
    // plane2.lookAt(new THREE.Vector3(-1,1,0))
    // let planeMaterial = new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:0.2,})
    // let mesh1 = new THREE.Mesh(plane, planeMaterial)
    // mesh1.position.z = 4
    // let mesh2 = new THREE.Mesh(plane2, planeMaterial)
    // this.scene.add(mesh1, mesh2)
    //console.log("intersections", intersections, intersections2)
  }

  undo() {}
  redo() {}
  remove() {}
}
