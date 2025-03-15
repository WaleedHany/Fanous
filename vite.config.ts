import glsl from 'vite-plugin-glsl'
import {defineConfig} from "vite"

export default defineConfig({
    base:"/Fanous/",
    plugins:
    [
        glsl() // Handle shader files
    ]
})

