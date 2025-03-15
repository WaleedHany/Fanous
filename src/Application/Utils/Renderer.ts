import {
    Scene, WebGLRenderer, WebGLRenderTarget, HalfFloatType,
    ACESFilmicToneMapping,
    SRGBColorSpace,
    RGBAFormat,
} from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

import Viewer from '../Viewer'
import Camera from './Camera'
import SceneSizes from './SceneSizes'
import { ClearPass } from 'three/examples/jsm/Addons.js'

export default class Renderer {
    instance: WebGLRenderer | any
    canvas: HTMLCanvasElement
    sizes: SceneSizes
    scene: Scene
    application
    camera: Camera
    composer: EffectComposer|any  // Add EffectComposer

    constructor(canvas: HTMLCanvasElement, sizes: SceneSizes, scene: Scene, application: Viewer, camera: Camera) {
        this.canvas = canvas
        this.sizes = sizes
        this.scene = scene
        this.application = application
        this.camera = camera
        this.setInstance()
        this.setPostProcessing() // Setup EffectComposer
    }

    setInstance() {
        this.instance = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true, preserveDrawingBuffer: true   // Keep background transparency
        })
        this.instance.toneMapping = ACESFilmicToneMapping
        this.instance.toneMappingExposure = 0.8
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1))
        this.instance.autoClear = false
        this.instance.setClearColor(0x000000, 0)  // Ensure transparency
        this.instance.domElement.style.background = "none";
        this.instance.outputEncoding = SRGBColorSpace
    }

    setPostProcessing() {
        const renderTarget = new WebGLRenderTarget(this.sizes.width, this.sizes.height, {
            type: HalfFloatType,
            format: RGBAFormat,
            colorSpace: SRGBColorSpace, 
        })
        renderTarget.samples = 8

        this.composer = new EffectComposer(this.instance, renderTarget)
    
        const clearPass = new ClearPass()
        this.composer.addPass(clearPass)

        this.composer.addPass(new RenderPass(this.scene, this.camera.instance))
        const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
        this.composer.addPass(gammaCorrectionPass)

        // Add Bloom Effect
        const bloomPass = new UnrealBloomPass(undefined!, 0.2,4, 0.6)
        this.composer.addPass(bloomPass)
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.composer.setSize(this.sizes.width, this.sizes.height) // Update composer size
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1))
        this.application.cameraList.forEach(c => c.instance.updateProjectionMatrix())
    }

    update() {
        if (this.application.cameraList.length === 1 && !this.application.allowAxisScene) {
            this.instance.setScissorTest(false)
            this.composer.render()  // Use EffectComposer instead of instance.render()
        } else {
            this.instance.setScissorTest(true)
            this.instance.setViewport(
                0, 0,
                this.sizes.height * 0.2,
                this.sizes.height * 0.2
            )
            this.instance.setScissor(
                0, 0,
                this.sizes.height * 0.2,
                this.sizes.height * 0.2
            )
            this.application.axisCamera.updateProjectionMatrix()
            this.instance.render(this.application.axisScene, this.application.axisCamera)

            let left = this.camera.x * this.sizes.width
            let bottom = this.sizes.height - ((this.camera.heightRatio * this.sizes.height) + (this.camera.y * this.sizes.height))
            let width = this.camera.widthRatio * this.sizes.width
            let height = this.camera.heightRatio * this.sizes.height
            this.instance.setViewport(left, bottom, width, height)
            this.instance.setScissor(left, bottom, width, height)
            this.camera.instance.updateProjectionMatrix()

            // Render with post-processing for the main scene
            this.composer.render()
        }
    }
}

// import {CineonToneMapping, Scene, WebGLRenderer/*, PCFSoftShadowMap, CineonToneMapping, Vector2, Color*/} from 'three'
// import Viewer from '../Viewer'
// import Camera from './Camera'
// import SceneSizes from './SceneSizes'

// export default class Renderer
// {
//     instance:WebGLRenderer|any
//     canvas : HTMLCanvasElement
//     sizes : SceneSizes
//     scene :Scene
//     application
//     camera : Camera

//     constructor(canvas:HTMLCanvasElement, sizes:SceneSizes, scene:Scene, application:Viewer, camera:Camera)
//     {
//         this.canvas = canvas
//         this.sizes = sizes
//         this.scene = scene
//         this.application = application
//         this.camera = camera
//         this.setInstance()
//     }

//     setInstance()
//     {
//         this.instance = new WebGLRenderer({
//             canvas: this.canvas,
//             antialias: true,
//             alpha: true,
//         })
//         this.instance.toneMapping =  CineonToneMapping
//         this.instance.toneMappingExposure = 1.3
//         this.instance.setSize(this.sizes.width, this.sizes.height)
//         this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1))
//         this.instance.autoClear = false
//     }

//     resize()
//     {
//         this.instance.setSize(this.sizes.width, this.sizes.height)
//         this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1))
//         this.application.cameraList.forEach(c => c.instance.updateProjectionMatrix())
//     }

//     update()
//     {
//         if (this.application.cameraList.length == 1 && !this.application.allowAxisScene)
//         {
//             this.instance.setScissorTest (false)
//             this.instance.render(this.scene, this.camera.instance)
//         }
//         else {
//             this.instance.setScissorTest(true)
//             this.instance.setViewport (
//                 0, 0,
//                 this.sizes.height*0.2,
//                 this.sizes.height*0.2 )
//             this.instance.setScissor(
//                 0, 0,
//                 this.sizes.height*0.2 ,
//                 this.sizes.height*0.2 
//             )
//             this.application.axisCamera.updateProjectionMatrix()
//             this.instance.render(this.application.axisScene, this.application.axisCamera)
//             // for (const camera of this.application.cameraList)
//             // {        
//                 let left = (this.camera.x * this.sizes.width)
//                 let bottom = this.sizes.height - ((this.camera.heightRatio * this.sizes.height) + (this.camera.y * this.sizes.height))
//                 let width = this.camera.widthRatio * this.sizes.width
//                 let height = this.camera.heightRatio * this.sizes.height
//                 this.instance.setViewport (left,bottom,width,height)
//                 this.instance.setScissor(left,bottom,width,height)
//                 this.camera.instance.updateProjectionMatrix()
//                 this.instance.render (this.scene, this.camera.instance)
//             //}
//         }
//     }
// }
