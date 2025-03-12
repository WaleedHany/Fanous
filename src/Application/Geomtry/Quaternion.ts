import { Vector3 } from "three"


export default class Quaternion
{
    //#region Properties

    realValue : number
    vector : Vector3
    magnitude : number
    quadrance : number
    conjugate :Quaternion|undefined
    inverse :Quaternion|undefined
    //#endregion // Properties

    //#region Constructors

    private constructor(s:number, vector:Vector3 )
    {
      this.realValue = s;
      this.vector = vector;
      this.quadrance = 
      (this.realValue * this.realValue) + (this.vector.x * this.vector.x) + 
      (this.vector.y * this.vector.y) + (this.vector.z * this.vector.z)
      this.magnitude = Math.sqrt(this.quadrance);
    }

    //#region Factory Methods

    static createQuaternion(s : number, vector:Vector3)
    {
      let quaternion = new Quaternion(s, vector);
      quaternion.getQuaternionConjugate();
      quaternion.getQuaternionInverse();
      return quaternion;
    }

    static createRotationQuaternion(angle:number, axisOfRotation:Vector3)
    {
      //double angleCos = Math.Cos(angle)
      //double h = Math.Sqrt((1 - angleCos) / (angleCos + 1))
      //double t = axisOfRotation.Length / h
      //Quaternion quaternion = new Quaternion(t, axisOfRotation)
      let angleCos = Math.cos(angle / 2);
      let u = axisOfRotation.clone().multiplyScalar(Math.sin(angle / 2));
      let quaternion = new Quaternion(angleCos, u);
      quaternion.getQuaternionConjugate();
      quaternion.getQuaternionInverse();
      return quaternion;
    }
    //#endregion //Factory Methods

    //#endregion // Constructors 

    //#region Methods
    /// <summary>
    /// Get Quaternion conjugate,
    /// ex:
    /// quaternion = (s, (ai + bj + ck)), then; conjugate = (s, (-ai - bj - ck)) 
    /// </summary>
    private getQuaternionConjugate()
    {
      let negatedVector = new Vector3(-this.vector.x, -this.vector.y, -this.vector.z);
      this.conjugate = new Quaternion(this.realValue, negatedVector);
      this.conjugate.conjugate = this;
    }

    /// <summary>
    /// Get quaternion inverse, 
    /// q' = Conjugate / Quadrance =  (s, (-ai - bj - ck)) / s^2 + a^2 + b^2 + c^2
    /// </summary>
    private getQuaternionInverse()
    {
      if (this.conjugate == null)
      {
        this.getQuaternionConjugate();
      }
      if(this.conjugate != null)
      {
        let sInverse = this.conjugate.realValue / this.quadrance;
        let vector =
          new Vector3
          (this.conjugate.vector.x / this.quadrance, 
           this.conjugate.vector.y / this.quadrance, 
           this.conjugate.vector.z / this.quadrance);
        this.inverse = new Quaternion(sInverse, vector);
        this.inverse.getQuaternionConjugate();
        this.inverse.inverse = this;
      }
    }

    /// <summary>
    /// Multiply two quaternions
    /// </summary>
    /// <param name="quaternion">Quaternion to be multiplied</param>
    /// <returns></returns>
    multiply(quaternion:Quaternion)
    {
      return Quaternion.multiplyQuaternions(this, quaternion);
    }

    /// <summary>
    /// Multiply two quaternions
    /// </summary>
    /// <param name="quaternion1">First quaternion</param>
    /// <param name="quaternion2">Second quaternion to be multiplied</param>
    /// <returns></returns>
    static multiplyQuaternions(quaternion1:Quaternion, quaternion2:Quaternion)
    {
      let t = quaternion1.realValue * quaternion2.realValue - quaternion1.vector.clone().dot(quaternion2.vector);
      let vector =
        quaternion2.vector.clone().multiplyScalar(quaternion1.realValue)
        .add(quaternion1.vector.clone().multiplyScalar(quaternion2.realValue))
        .add(quaternion1.vector.clone().cross(quaternion2.vector))

      return Quaternion.createQuaternion(t, vector);
    }
    //#endregion // Methods
}