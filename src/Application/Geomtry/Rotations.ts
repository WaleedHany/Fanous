import { Vector3 } from "three";
import Quaternion from "./Quaternion";

export default class Rotations
{
    //#region Rotations

    //#region Basic Rotations
    static twoDimensionRotationAboutArbitraryPointInXYPlane
      (point:Vector3, angle:number, referencePoint:Vector3)
    {
      let  x = point.x;
      let  y = point.y;
      let  z = point.z;
      let  pX = referencePoint.x;
      let  pY = referencePoint.y;
      let  newPoint:number[][] = Rotations.rotationAboutArbitraryPointInXYPlane(x, y, pX, pY, angle);
      return new Vector3(newPoint[0][0], newPoint[0][1], z);
    }

    static rotationAboutArbitraryPointInXYPlane
        (x:number, y:number, refX:number, refY:number, angle:number)
    {
      let points2Dmatrix = [[x, y, 1]];
      let rotation2DMatrix:number[][] = 
      [
        [Math.cos(angle), - Math.sin(angle), refX * (1 - Math.cos(angle)) + refY * Math.sin(angle)],
        [Math.sin(angle), Math.cos(angle),  refY * (1 - Math.cos(angle)) - refX * Math.sin(angle)],
        [0,0, 1],
      ]
      return Rotations.multiplyMatrices(points2Dmatrix, rotation2DMatrix);
    }

    static RotationAboutAxisPassingThroughPoint3D(point:Vector3, angle:number, axis:Vector3, refPoint:Vector3)
    {
      let pointVector = [point.x, point.y, point.z]
      let axisVector = [axis.x, axis.y, axis.z] 
      let refPointVector = [refPoint.x, refPoint.y, refPoint.z]

      var result = Rotations.threeDimensionRotationAboutAxisPassingThroughPoint(pointVector, angle, axisVector, refPointVector);
      return new Vector3(result[0][0], result[0][1], result[0][2]);
    }

    static threeDimensionRotationAboutAxisPassingThroughPoint
      (point:number[], angle:number, axis:number[], refPoint:number[])
    {
      if (point.length != 3 || axis.length != 3) return [];
      let pointVector = [point[0] - refPoint[0], point[1] - refPoint[1], point[2] - refPoint[2]]
      let result = Rotations.threeDimensionRotationAboutArbitraryAxis(pointVector, angle, axis);
      result[0][0] += refPoint[0];
      result[0][1] += refPoint[1];
      result[0][2] += refPoint[2];
      return result;
    }

    static threeDimensionRotationAboutArbitraryVectorAxis
      (point:Vector3, angle:number, axis:Vector3)
    {
      let pointVector = [point.x, point.y, point.z ] 
      let axisVector = [axis.x, axis.y, axis.z ] 
      var result = Rotations.threeDimensionRotationAboutArbitraryAxis(pointVector, angle, axisVector);
      return new Vector3(result[0] [0], result[0][1], result[0][2]);
    }

    static threeDimensionRotationAboutArbitraryAxis(point:number[], angle:number, axis:number[])
    {
      if (point.length != 3 || axis.length != 3) return [];

      let  cosAngle = Math.cos(angle);
      let  sinAngle = Math.sin(angle);
      let  k = 1 - cosAngle;
      let  a = axis[0];
      let  b = axis[1];
      let  c = axis[2];

      let  e11 = a * a * k + cosAngle;
      let  e12 = a * b * k - c * sinAngle;
      let  e13 = a * c * k + b * sinAngle;
      let  e21 = a * b * k + c * sinAngle;
      let  e22 = b * b * k + cosAngle;
      let  e23 = b * c * k - a * sinAngle;
      let  e31 = a * c * k - b * sinAngle;
      let  e32 = b * c * k + a * sinAngle;
      let  e33 = c * c * k + cosAngle;

      let pointVector = [[point[0], point[1], point[2]]]

      let rotation3DMatrix:number[][] =
      [
        [e11, e12, e13],
        [e21, e22, e23],
        [e31, e32, e33]
      ];
      return Rotations.multiplyMatrices(pointVector, rotation3DMatrix);
    }
    ///#endregion // Basic Rotations

    //#region Quaternion Rotations

    static RotateVectorAboutArbitraryPointInXYPlane(point:Vector3, angle:number, refPoint:Vector3)
    {
      let axis = new Vector3(0.0, 0.0, 1.0);
      return Rotations.rotatePointAboutArbitraryAxisPassingThroughAPoint(point, angle, axis, refPoint);
    }

    static RotatePointAboutArbitraryPointInXYPlane(point:Vector3, angle:number, refPoint:Vector3)
    {
      let axis = new Vector3(0.0, 0.0, 1.0);
      let pointVector = new Vector3(point.x, point.y, point.z);
      let refPointVector = new Vector3(refPoint.x, refPoint.y, refPoint.z);
      let result = Rotations.rotatePointAboutArbitraryAxisPassingThroughAPoint(pointVector, angle, axis, refPointVector);
      return new Vector3(result.x, result.y, result.z);
    }

    static rotatePointAboutArbitraryAxisPassingThroughAPoint
     (point:Vector3, angle:number, axis:Vector3, refPoint:Vector3)
    {
      let pointVector = new Vector3(point.x - refPoint.x, point.y - refPoint.y, point.z - refPoint.z);
      let result = Rotations.rotatePointAboutArbitraryVectorIn3D(pointVector, angle, axis);
      return new Vector3(result.x + refPoint.x, result.y + refPoint.y, result.z + refPoint.z);
    }

    static rotatePointAboutArbitraryVectorIn3D
      ( point:Vector3, angle:number, rotationAxis:Vector3)
    {
      let q = Quaternion.createRotationQuaternion(angle, rotationAxis);
      let p = Quaternion.createQuaternion(0, point);
      let qp = q.multiply(p);
      let qpq_ = qp.multiply(q.inverse!);
      return qpq_.vector;
    }
    //#endregion // Quaternion Rotations

    //#endregion // Rotations

    //#region Helper Methods

    // This function multiplies
    // mat1[][] and mat2[][], and
    // stores the result in res[][]
    static multiplyMatrices(mat1:number[][], mat2:number[][])
    {
        let res:number[][] = []
        let col1 = mat1.length
        let col2 = mat2.length
        let row2 = mat2[0].length
        let i, j, k;
        for (i = 0; i < col1; i++) {
            for (j = 0; j < row2; j++) {
                res[i][j] = 0;
                for (k = 0; k < col2; k++)
                    res[i][j] += mat1[i][k] * mat2[k][j];
            }
        }
        return res
    }

    //#endregion // Helper Methods
}