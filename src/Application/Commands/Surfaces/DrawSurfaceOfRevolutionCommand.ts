import * as THREE from "three"
import Vector3D from "../../Geometry/Vector3D"
import Command from "../Commands"
import SurfaceOfRevolution from "../../Geometry/Surfaces/SurfaceOfRevolution"
import Line from "../../Geometry/Line"
import NURBSCurveBase from "../../Geometry/Curves/SplineCurves/NURBSCurveBase"
import PlaneEquation from "../../Geometry/PlaneEquation"

export default class DrawSurfaceOfRevolutionCommand extends Command
{
    scene: THREE.Scene
    surface: SurfaceOfRevolution

    constructor(startAngle:number,endAngle:number,line:Line, curve:NURBSCurveBase, scene:THREE.Scene) 
    {
        super()
        this.scene = scene
        this.surface = new SurfaceOfRevolution(startAngle, endAngle, line, curve)
    }

    execute()
    {
        let contourPoints: number[] = []
        let uvs: number[] = []
        let vertexNormals:number[] = []
        for(let i = 0; i<1.01; i+=0.01){
            let pointsInX :Vector3D[]= []
            let pointsInY: Vector3D[] = []
            for(let j = 0; j<1.01; j+=0.01)
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
        // console.log(indices,contourPoints)
        meshGeometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3))
        meshGeometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2))
        meshGeometry.setAttribute('normal', new THREE.Float32BufferAttribute( normalsArray, 3 ) )
        meshGeometry.setIndex(new THREE.BufferAttribute(indicesArray, 1))   
        meshGeometry.computeTangents()

        const material = new THREE.MeshStandardMaterial({ color: 0x45D6D2, side: THREE.DoubleSide, metalness:0.6,roughness:1 })
            const mesh = new THREE.Mesh(meshGeometry, material)
        this.scene.add(mesh)
        
        // const manager = new THREE.LoadingManager()
        // const textureLoader = new THREE.TextureLoader(manager)
        // let earthTexture = textureLoader.load('../../../../../public/Assets/earth/earth_Color.jpg')
        // let earthBumpMap = textureLoader.load('../../../../../public/Assets/earth//elev_bump_8k.jpg')
        // let earthSpecular = textureLoader.load('../../../../../public/Assets/earth/Specular.png')
        // manager.onLoad = () => {
        //     const earthMaterial = new THREE.MeshPhongMaterial({
        //         map: earthTexture,
        //         bumpMap: earthBumpMap,
        //         specularMap : earthSpecular,
        //         side: THREE.DoubleSide
        //     })
        //     const mesh = new THREE.Mesh(meshGeometry, earthMaterial) //sandMaterial
        //     this.scene.add(mesh)
        // }

        let subLinematerial = new THREE.LineDashedMaterial( 
            { color: 0x009999, dashSize: 1, gapSize: 1, linewidth: 4, scale: 1 })
            for (let i = 0; i < this.surface.controlPoints.length; i++) {
              const pointsGeometry = new THREE.BufferGeometry().setFromPoints(
                this.surface.controlPoints[i].map((x) => x.toVector3())
              );
              const pointsMaterial = new THREE.PointsMaterial({
                color: 0x00ff00,
                size: 1.4,
              });
              const controlPoints = new THREE.Points(pointsGeometry, pointsMaterial);
              this.scene.add(controlPoints);
              const linesGeometry = new THREE.BufferGeometry().setFromPoints(
                this.surface.controlPoints[i].map((x) => x.toVector3())
              );
              const lines = new THREE.Line(linesGeometry, subLinematerial);
              lines.computeLineDistances();
              this.scene.add(lines);
            }

    //      let normalIndicationMaterial = new THREE.LineBasicMaterial({ color: 0x008822,depthTest:false })
    //      let tangentUMaterial = new THREE.LineBasicMaterial({ color: 0xff0000,depthTest:false })
    //      let tangentVMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff,depthTest:false })
    //      let p1 = this.surface.evaluate(0.1, 0.1)
    //      let p2 = this.surface.evaluate(0.5, 0.5)
    //      let p3 = this.surface.evaluate(0, 0)
    //      let p4 = this.surface.evaluate(0.5, 0.1)
    //      let p5 = this.surface.evaluate(0.3, 0.8)
    //      let p6 = this.surface.evaluate(0.6, 0.6)
    //      let p7 = this.surface.evaluate(0.9, 0.3)
    
    //      let starts = [p1, p2, p3,p4,p5,p6,p7]
    //      let n1 = this.surface.calculateNormal(0.1, 0.1)
    //      let n2 = this.surface.calculateNormal(0.5, 0.5)
    //      let n3 = this.surface.calculateNormal(0, 0)
    //      let n4 = this.surface.calculateNormal(0.5, 0.1)
    //      let n5 = this.surface.calculateNormal(0.3, 0.8)
    //      let n6 = this.surface.calculateNormal(0.6, 0.6)
    //      let n7 = this.surface.calculateNormal(0.9, 0.3)
       
    //      let tus =     [p1.add(n1.tangentU.normalize()), p2.add(n2.tangentU.normalize()),p3.add(n3.tangentU.normalize()),p4.add(n4.tangentU.normalize()),p5.add(n5.tangentU.normalize()),p6.add(n6.tangentU.normalize()),p7.add(n7.tangentU.normalize())]
    //      let tvs =     [p1.add(n1.tangentV.normalize()), p2.add(n2.tangentV.normalize()),p3.add(n3.tangentV.normalize()),p4.add(n4.tangentV.normalize()),p5.add(n5.tangentV.normalize()),p6.add(n6.tangentV.normalize()),p7.add(n7.tangentV.normalize())]
    //      let normals = [p1.add(n1.normal  .normalize()), p2.add(n2.normal  .normalize()),p3.add(n3.normal  .normalize()),p4.add(n4.normal  .normalize())  ,p5.add(n5.normal.normalize())  ,p6.add(n6.normal.normalize())  ,p7.add(n7.normal.normalize())  ]
    
    //      for (let i = 0; i < normals.length; i++){
    //        const tangentGeometry =
    //            new THREE.BufferGeometry().setFromPoints([starts[i], tus[i]].map(x => x.toVector3()));
    //        const tangentLine = new THREE.Line(tangentGeometry, tangentUMaterial);
    //        this.scene.add(tangentLine)
    
    //        const tangentGeometry1 =
    //            new THREE.BufferGeometry().setFromPoints([starts[i], tvs[i]].map(x => x.toVector3()));
    //        const tangentLine1 = new THREE.Line(tangentGeometry1, tangentVMaterial);
    //        this.scene.add(tangentLine1)
    
    //        const tangentGeometry2 =
    //            new THREE.BufferGeometry().setFromPoints([starts[i], normals[i]].map(x => x.toVector3()));
    //        const normalLine1 = new THREE.Line(tangentGeometry2, normalIndicationMaterial);
    //        this.scene.add(normalLine1)
    //      }

    //     let u = 0.08; let v = 0.92
    //     let point = this.surface.evaluate(u, v)
    //     let timeStamp = this.surface.getPointInversion(point)
    //     console.log(u, v)
    //     console.log(point)
    //     console.log(timeStamp.u, timeStamp.v)
    //     console.log(this.surface.evaluate(timeStamp.u, timeStamp.v))

    //     u = 0.01; v = 0.02
    //     point = this.surface.evaluate(u, v)
    //     timeStamp = this.surface.getPointInversion(point)
    //     console.log(u, v)
    //     console.log(point)
    //     console.log(timeStamp.u, timeStamp.v)
    //     console.log(this.surface.evaluate(timeStamp.u, timeStamp.v))

    //     u = 0.7; v = 0.8
    //     point = this.surface.evaluate(u, v)
    //     timeStamp = this.surface.getPointInversion(point)
    //     console.log(u, v)
    //     console.log(point)
    //     console.log(timeStamp.u, timeStamp.v)
    //     console.log(this.surface.evaluate(timeStamp.u, timeStamp.v))

    //     u = 0.6; v = 0.4
    //     point = this.surface.evaluate(u, v)
    //     timeStamp = this.surface.getPointInversion(point)
    //     console.log(u, v)
    //     console.log(point)
    //     console.log(timeStamp.u, timeStamp.v)
    //     console.log(this.surface.evaluate(timeStamp.u, timeStamp.v))

    //     u = 0.89; v = 0.94
    //     point = this.surface.evaluate(u, v)
    //     timeStamp = this.surface.getPointInversion(point)
    //     console.log(u, v)
    //     console.log(point)
    //     console.log(timeStamp.u, timeStamp.v)
    //   console.log(this.surface.evaluate(timeStamp.u, timeStamp.v))
      
    //     let plane0 = new PlaneEquation(new Vector3D(0,0,0), new Vector3D(0,0,1))
    //     let plane1 = new PlaneEquation(new Vector3D(0,0,4), new Vector3D(0,0,1))
    //     let plane2 = new PlaneEquation(new Vector3D(0,0,8), new Vector3D(0,0,1))
    //     let plane3 = new PlaneEquation(new Vector3D(0,0,8), new Vector3D(-1,1,0))
    //     let intersections = this.surface.getPlaneIntersection(plane0)
    //     intersections.push(...this.surface.getPlaneIntersection(plane1))
    //     intersections.push(...this.surface.getPlaneIntersection(plane2))
    //     let intersections2 = this.surface.getPlaneIntersection(plane3)
    //     const pointsMaterial12 = new THREE.PointsMaterial({
    //         color: 0xff4444,
    //         size: 2,
    //         })
    //     const pointsMaterial13 = new THREE.PointsMaterial({
    //         color: 0x4444ff,
    //         size: 2,
    //         })
    //     let pointsGeometry12 = new THREE.BufferGeometry()
    //         .setFromPoints(intersections.map(p => p.point.toVector3()))
    //     let pointsGeometry13 = new THREE.BufferGeometry()
    //         .setFromPoints(intersections2.map(p => p.point.toVector3()))
    //     const controlPoints12 = new THREE.Points(pointsGeometry12, pointsMaterial12);
    //     const controlPoints13 = new THREE.Points(pointsGeometry13, pointsMaterial13);
    //     this.scene.add(controlPoints12, controlPoints13)
    }

    undo(){
    }
    redo(){
    }
    remove(){
    }
}