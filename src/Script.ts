import Viewer from "./Application/Viewer"
let viewer = Viewer.initialize(document.querySelector("canvas.webgl")!);


// document.getElementById("B-splineCentripetal")!.onclick = function () {
//   DrawBsplineSurfaceCentripetal();
// }
// function DrawBsplineSurfaceCentripetal() {
//   viewer.raycaster.enable(20);
//   viewer.raycaster.on("ExecuteCommand", () => {
//     if (points.length == 20) {
//       const grid: Vector3D[][] = [];

//       for (let i = 0; i < 4; i++) {
//         const row: Vector3D[] = []
//         for (let j = 0; j < 5; j++) {
//           const index = i * 5 + j
//           const point = points[index]
//           row.push(point)
//         }
//         grid.push(row)
//       }
//       const surface = BspLineInterpolationSurface.setSurfaceFromGivenPoints(grid, Parameterization.Centripetal)
//       // viewer.commands.executeCommand(
//       //   new DrawBsplineInterpolationSurfaceCommand(grid, surface, viewer.scene)
//       // )
//       const addition = new Vector3D(0,0,5)
//       const surface11 = surface.splitSurface(0.4, false)
//       const surface1 = surface11.firstSurface     
//       //surface1.controlPoints = surface1.controlPoints.map(p => p.map(c => c.add(addition)))
//       const surface2 = surface11.secondSurface
//       //surface2.controlPoints = surface2.controlPoints.map(p => p.map(c => c.add(addition)))
//       viewer.commands.executeCommand(
//         new DrawBsplineInterpolationSurfaceCommand(grid, surface1 as BspLineInterpolationSurface, viewer.scene, 'skyblue')
//       )
//       viewer.commands.executeCommand(
//         new DrawBsplineInterpolationSurfaceCommand(grid, surface2 as BspLineInterpolationSurface, viewer.scene, 'rgb(153, 156, 252)')
//       )
//       points = []
//       viewer.raycaster.disable()
//       viewer.raycaster.off("ExecuteCommand")
//       viewer.raycaster.off("ExecuteCommandKey")
//     }
//   })
//}