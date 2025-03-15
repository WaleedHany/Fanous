import * as THREE from 'three'
import Camera from '../Utils/Camera'

export default class Environment
{
    scene:THREE.Scene
    sunLight:THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 8)
    ambientLight: THREE.AmbientLight|any
    moon:THREE.Mesh|any
    textureLoader: THREE.TextureLoader
    camera:Camera
    background:THREE.Texture|any
    constructor(scene:THREE.Scene, camera:Camera)
    {
        THREE.Object3D.DEFAULT_UP.set(0,0,1)
        this.scene = scene
        this.camera = camera
        // Setup
        this.textureLoader = new THREE.TextureLoader()
        this.setSunLight()
        this.setbackground()
    }

    setSunLight()
    {
        this.sunLight.color = new THREE.Color(0xffbbaa)
        this.sunLight.position.set(-40, 40, 20)
        let sunLight2 =new THREE.DirectionalLight(0xffffaa, 6)
        sunLight2.color = new THREE.Color(0xffffff)
        sunLight2.position.set(40, 60, 20)
        this.ambientLight = new THREE.AmbientLight(0xffbbaa,2)
        const ambientLight = new THREE.AmbientLight(0xffbbaa,3)
        this.scene.add(this.sunLight, sunLight2, this.ambientLight,ambientLight)
    }
    setbackground(){
        Promise.all([
        this.loadTexture(`${import.meta.env.BASE_URL}Assets/Images/Moon3.jpg`),
        this.loadTexture(`${import.meta.env.BASE_URL}Assets/Images/gradient_background.png`)
        ]).then(([moonTexture, backgroundTexture]) => {
            let moonMaterial = new THREE.SpriteMaterial({
                        map:moonTexture, alphaMap:moonTexture, rotation: -3*Math.PI/4
                        });
            this.moon = new THREE.Sprite( moonMaterial )
            this.moon.position.set( -1500, 100, 120)
            this. moon.scale.set(40, 40, 1)
            this.scene.add(this.moon)

            backgroundTexture.colorSpace = THREE.SRGBColorSpace;  // ✅ Fix faded colors
            //backgroundTexture.encoding //= THREE.LinearSRGBColorSpace;   // ✅ Prevents double correction
            backgroundTexture.needsUpdate = true;
            this.background = backgroundTexture
            this.scene.background = this.background
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

}