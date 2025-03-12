import {Scene, WebGLRenderer, PCFSoftShadowMap, CineonToneMapping, Vector2, Color} from 'three'
import Viewer from '../Viewer'
import Camera from './Camera'
import SceneSizes from './SceneSizes'

export default class Renderer
{
    instance:WebGLRenderer|any
    canvas : HTMLCanvasElement
    sizes : SceneSizes
    scene :Scene
    application
    camera : Camera

    constructor(canvas:HTMLCanvasElement, sizes:SceneSizes, scene:Scene, application:Viewer, camera:Camera)
    {
        this.canvas = canvas
        this.sizes = sizes
        this.scene = scene
        this.application = application
        this.camera = camera
        this.setInstance()
    }

    setInstance()
    {
        this.instance = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        })
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1))
        this.instance.autoClear = false
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1))
        this.application.cameraList.forEach(c => c.instance.updateProjectionMatrix())
    }

    update()
    {
        if (this.application.cameraList.length == 1 && !this.application.allowAxisScene)
        {
            this.instance.setScissorTest (false)
            this.instance.render(this.scene, this.camera.instance)
        }
        else {
            this.instance.setScissorTest(true)
            this.instance.setViewport (
                0, 0,
                this.sizes.height*0.2,
                this.sizes.height*0.2 )
            this.instance.setScissor(
                0, 0,
                this.sizes.height*0.2 ,
                this.sizes.height*0.2 
            )
            this.application.axisCamera.updateProjectionMatrix()
            this.instance.render(this.application.axisScene, this.application.axisCamera)
            // for (const camera of this.application.cameraList)
            // {        
                let left = (this.camera.x * this.sizes.width)
                let bottom = this.sizes.height - ((this.camera.heightRatio * this.sizes.height) + (this.camera.y * this.sizes.height))
                let width = this.camera.widthRatio * this.sizes.width
                let height = this.camera.heightRatio * this.sizes.height
                this.instance.setViewport (left,bottom,width,height)
                this.instance.setScissor(left,bottom,width,height)
                this.camera.instance.updateProjectionMatrix()
                this.instance.render (this.scene, this.camera.instance)
            //}
        }
    }
}
// import { 
//     Scene, WebGLRenderer, Vector2, MeshBasicMaterial, Layers, ShaderMaterial, Color,
//     ReinhardToneMapping,
//     WebGLRenderTarget,
//     RGBAFormat,
//     DepthTexture,
//     UnsignedShortType
// } from 'three' 
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js' 
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js' 
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js' 
// import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js' 
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js' 
// import Viewer from '../Viewer' 
// import Camera from './Camera' 
// import SceneSizes from './SceneSizes'
// const materials:any = {}
// const depthTexture = new DepthTexture(1,1);
// depthTexture.type = UnsignedShortType;
// export default class Renderer {
//     instance: WebGLRenderer|any
//     canvas: HTMLCanvasElement 
//     sizes: SceneSizes 
//     scene: Scene 
//     application: Viewer 
//     camera: Camera 

//     BLOOM_SCENE = 1 
//     composer: EffectComposer|any
//     bloomComposer: EffectComposer|any
//     bloomPass: UnrealBloomPass|any
//     outputPass: OutputPass|any
//     mixPass: ShaderPass|any
//     finalComposer: EffectComposer|any
//     darkMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x000000 }) 
//     bloomLayer :Layers|any
    

//     constructor(canvas: HTMLCanvasElement, sizes: SceneSizes, scene: Scene, application: Viewer, camera: Camera) {
//         this.canvas = canvas 
//         this.sizes = sizes 
//         this.scene = scene 
//         this.application = application 
//         this.camera = camera 
//         this.setInstance() 
//         this.setPostProcessing() 
//     }

//     setInstance() {
//         this.instance = new WebGLRenderer({
//             canvas: this.canvas,
//             antialias: true,
//             alpha: true,
//         }) 

//         this.instance.setSize(this.sizes.width, this.sizes.height) 
//         this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1)) 
//         this.instance.autoClear = false 
//     }

//     resize() {
//         this.instance.setSize(this.sizes.width, this.sizes.height) 
//         this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1)) 
//         this.application.cameraList.forEach(c => c.instance.updateProjectionMatrix()) 
//         this.bloomComposer.setSize(this.sizes.width, this.sizes.height) 
//         this.finalComposer.setSize(this.sizes.width, this.sizes.height) 
//     }

//     setPostProcessing() {
//         this.instance.toneMapping = ReinhardToneMapping;
//         const renderScene = new RenderPass(this.scene, this.camera.instance) 
        
//         this.bloomPass = new UnrealBloomPass(new Vector2(this.sizes.width, this.sizes.height), 1, 0.2, 0.1) 
//         this.bloomPass.threshold = 0 
//         this.bloomPass.strength = 0.6
//         this.bloomPass.radius = 0.3

//         const bloomRenderTarget = new WebGLRenderTarget(this.sizes.width, this.sizes.height, {
//             format: RGBAFormat,
//             depthTexture: depthTexture,
//             depthBuffer: true
//         });
//         this.bloomComposer = new EffectComposer(this.instance, bloomRenderTarget) 
//         this.bloomComposer.renderToScreen = false;
//         this.bloomComposer.addPass(renderScene) 
//         this.bloomComposer.addPass(this.bloomPass)
//             const vertexShader = document.getElementById('vertexshader')?.textContent! 
//             const fragmentShader = document.getElementById('fragmentshader')?.textContent! 

//             this.mixPass = new ShaderPass(
//                 new ShaderMaterial({
//                     uniforms: {
//                         baseTexture: { value: null },
//                         bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
//                         depthTexture: { value: depthTexture } 
//                     },
//                     vertexShader,
//                     fragmentShader,
//                 }),
//                 'baseTexture'
//             ) 
//             this.mixPass.needsSwap = true;

//             this.outputPass = new OutputPass() 
//             this.finalComposer = new EffectComposer(this.instance) 
//             this.finalComposer.addPass(renderScene) 
//             this.finalComposer.addPass(this.mixPass) 
//             this.finalComposer.addPass(this.outputPass)

//             this.bloomLayer = new Layers()
//             this.bloomLayer.set(this.BLOOM_SCENE) 
//     }

//     update() {
//         this.scene.traverse(this.darkenNonBloomed.bind(this))

//         this.bloomComposer.render()

//         this.scene.traverse(this.restoreMaterial.bind(this))

//        this.finalComposer.render()
//     }


//     darkenNonBloomed( obj:any ) {
//         if ( obj.isMesh && !obj.layers.test(this.bloomLayer) && obj.userData.isEmmisive != true) {
//             if (!(obj.material instanceof MeshBasicMaterial)) {
//                 materials[ obj.uuid ] = obj.material
//                 obj.material = this.darkMaterial 
//             }
//         }

//     }

//     restoreMaterial( obj:any ) {

//         if ( materials[ obj.uuid ] ) {

//             obj.material = materials[ obj.uuid ] 
//             delete materials[ obj.uuid ] 
//         }
//     }
// }
