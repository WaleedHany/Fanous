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
    constructor(scene:THREE.Scene, camera:Camera)
    {
        THREE.Object3D.DEFAULT_UP.set(0,0,1)
        this.scene = scene
        this.camera = camera
        // Setup
        this.textureLoader = new THREE.TextureLoader()
        this.setSunLight()
        this.setMoon()
    }

    setSunLight()
    {
        this.sunLight.color = new THREE.Color(0xffbbaa)
        this.sunLight.position.set(-40, 40, 20)
        let sunLight2 =new THREE.DirectionalLight(0xffffaa, 6)
        sunLight2.color = new THREE.Color(0xffffff)
        sunLight2.position.set(40, 60, 20)
        this.ambientLight = new THREE.AmbientLight(0xffbbaa,4)
        const ambientLight = new THREE.AmbientLight(0xffbbaa,6)
        this.scene.add(this.sunLight, sunLight2, this.ambientLight,ambientLight)
    }
    setMoon(){
        this.loadTexture(`${import.meta.env.BASE_URL}Assets/Images/Moon1.jpg`, (moonTexture) => {
            let moonMaterial = new THREE.SpriteMaterial({
                        map:moonTexture, alphaMap:moonTexture, rotation: Math.PI / 4
                        });
            this.moon = new THREE.Sprite( moonMaterial )
            this.moon.position.set( -1500, 100, 120)
            this. moon.scale.set(40, 40, 1)
            this.scene.add(this.moon)
      })
    }

    loadTexture(path: string, callback: (texture: THREE.Texture) => void) {
        this.textureLoader.load(
            path,
            (texture) => {
                callback(texture);
            },
            undefined,
            (error) => {
                console.error(`Failed to load texture: ${path}`, error);
            }
        );
    }

}