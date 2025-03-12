// import { Mesh, Vector3 } from "three";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// import { Font } from "three/examples/jsm/loaders/FontLoader";
// import Vector3D from "../../Geometry/Vector3D";
// import Materials from "../../models/Building/Materials/Materials";
// import Resources from "../../utils/Resources";

// export class Labels{

//     static addHorizontalText(name:string, planeDirection:Vector3D, position:Vector3D, font:Font, offset:number, size:number = Resources.roofZoneTextSize)
//     {
//         const geometry= new TextGeometry( name,
//         {
//             font: font,
//             size: size,
//             height: 0.005,
//             curveSegments: 12,
// 	    })
//         let text = new Mesh( geometry, BuildingMaterials.textMaterial )
//         text.rotateZ(22/14)
//         geometry.computeBoundingBox();
//         let center = geometry.boundingBox?.getCenter(new Vector3())
//         text.updateMatrixWorld();
//         center?.applyMatrix4(text.matrixWorld)
//         center = center ==null? new Vector3(0,0,0):center  
//         let point = position.add(planeDirection.multiply(offset)).toVector3()
//         text.position.set(point.x-center.x, point.y-center.y, point.z-center.z)
//         return text
//     }

//     static addText(name:string, planeDirection:Vector3D, position:Vector3D, font:Font, offset:number, size:number = Resources.roofZoneTextSize)
//     {
//         const geometry= new TextGeometry( name,
//         {
//             font: font,
//             size: size,
//             height: 0.005,
//             curveSegments: 12,
// 	    })
        
//         let text = new Mesh( geometry, BuildingMaterials.textMaterial )
//         if( planeDirection.isAlmostEqualTo(new Vector3D(0,-1,0)))
//             text.rotateX(22/14)
//         else if(planeDirection.isAlmostEqualTo(new Vector3D(0,1,0)))
//             text.rotateX(-22/14)
//         else
//         {
//             text.rotateZ(-Vector3D.getAngle(planeDirection, new Vector3D(0,1,0)))
//             text.rotateX(22/14)
//         }
//         if(planeDirection.isAlmostEqualTo(new Vector3D(0,1,0)) )
//         {             
//             text.rotateZ(-22/7)
//         }
//         if(planeDirection.isAlmostEqualTo(new Vector3D(1,0,0)))
//         {
//             text.rotateY(22/7)
//         }
//         geometry.computeBoundingBox();
//         let center = geometry.boundingBox?.getCenter(new Vector3())
//         text.updateMatrixWorld();
//         center?.applyMatrix4(text.matrixWorld)
//         center = center ==null? new Vector3(0,0,0):center  
//         let point = position.add(planeDirection.multiply(offset)).toVector3()
//         text.position.set(point.x-center.x, point.y-center.y, point.z-center.z)
//         return text
//     }

//     static addPlanViewText(name:string, planeDirection:Vector3D, position:Vector3D, font:Font, offset:number)
//     {
//         const geometry= new TextGeometry( name,
//         {
//             font: font,
//             size: Resources.wallZoneTextSize,
//             height: 0.005,
//             curveSegments: 12,
// 	    })
//         let text = new Mesh( geometry, BuildingMaterials.textMaterial )
//         text.rotateZ(22/14)
//         geometry.computeBoundingBox();
//         let center = geometry.boundingBox?.getCenter(new Vector3())
//         text.updateMatrixWorld();
//         center?.applyMatrix4(text.matrixWorld)
//         center = center ==null? new Vector3(0,0,0):center  
//         let point = position.add(planeDirection.multiply(offset)).toVector3()
//         text.position.set(point.x-center.x, point.y-center.y, point.z-center.z)
//         return text
//     }

//     static updateTextSize(textList:Mesh[], wallZoneTextSize:number)
//     {
//         textList.forEach(t =>
//         {
//             t.geometry.computeBoundingBox();
//             let beforeScalingCenter = t.geometry.boundingBox?.getCenter(new Vector3())
//             t.updateMatrixWorld();
//             beforeScalingCenter?.applyMatrix4(t.matrixWorld)
//             let point = beforeScalingCenter ==null? new Vector3(0,0,0):beforeScalingCenter    

//             t.scale.set(wallZoneTextSize,wallZoneTextSize,0)  

//             t.geometry.computeBoundingBox();
//             let center = t.geometry.boundingBox?.getCenter(new Vector3())
//             t.updateMatrixWorld();
//             center?.applyMatrix4(t.matrixWorld)
//             center = center ==null? new Vector3(0,0,0):center 
//             let position = t.position       
//             t.position.set(position.x+(point.x-center.x), position.y+(point.y-center.y), position.z+(point.z-center.z))
//         })
//     }

//     static assignWallZoneUserData(mesh:Mesh, load:WallWindZone|null)
//     {
//         mesh.userData = 
//         {
//             material:mesh.material, 
//             showLoad: load? true:false,
//             load:
//             `Zone: ${load?.name} [F${load?.faceNo}]\nMax Net Pressure: ${load?.maxNetPressure} KN/m²\nWidth: ${load?.zoneWidth} m\nCpe(+): ${load?.cpePositive}\nCpe(-): ${load?.cpeNegative}`
//         }
//     }

//     static assignRoofZoneUserData(mesh:Mesh, load:RoofWindZone|null)
//     {
//         mesh.userData = 
//         {
//             material:mesh.material, 
//             showLoad: load? true:false,
//             load:`Zone: ${load?.name} [F${load?.faceNo}]\nPos. Pressure: ${load?.maxNetPositivePressure} KN/m²\nNeg. Pressure: ${load?.maxNetNegativePressure} KN/m²\nX Length: ${load?.dimX} m\nY Length: ${load?.dimY} m\nCpe(+): ${load?.cpePositive}\nCpe(-): ${load?.cpeNegative}`
//         }
//     }
// }