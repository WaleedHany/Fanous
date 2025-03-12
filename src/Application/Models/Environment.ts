import * as THREE from 'three'

export default class Environment
{
    scene:THREE.Scene
    sunLight:THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 5)
    constructor(scene:THREE.Scene)
    {
        THREE.Object3D.DEFAULT_UP.set(0,0,1)
        this.scene = scene
        // Setup
        this.setSunLight()
    }

    setSunLight()
    {
        this.sunLight.color = new THREE.Color(0xffffff)
        this.sunLight.position.set(-40, -40, 20)
        let ambientLight = new THREE.AmbientLight(0xffffff,2)
        this.scene.add(ambientLight)
        this.scene.add(this.sunLight)
        // const directionalLightHelper = new THREE.DirectionalLightHelper(this.sunLight, 5)
        // this.scene.add(directionalLightHelper)
    }
}