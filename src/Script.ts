import * as THREE from "three";
import Viewer from "./Application/Viewer"
let viewer = Viewer.initialize(document.querySelector("canvas.webgl")!);


document.addEventListener("toggleButtonEvent", (e) => {
    const lightOn = !(e as CustomEvent).detail
    viewer.lantern.ToggleLight(lightOn)
    if(!lightOn) viewer.scene.remove(viewer.environment.ambientLight)
    else viewer.scene.add(viewer.environment.ambientLight)
});

document.addEventListener("colorChangeEvent2", (e) => {
    (document.getElementById("colorLamp")! as HTMLElement).style.background = (e as CustomEvent).detail;
    const color = new THREE.Color((e as CustomEvent).detail)
    viewer.lantern.changeLampColor(color)
    viewer.environment.ambientLight.color = color
});

document.addEventListener("colorChangeEvent3", (e) => {
    (document.getElementById("colorWood")! as HTMLElement).style.background = (e as CustomEvent).detail;
    viewer.lantern.changeWoodColor(new THREE.Color((e as CustomEvent).detail))
});

document.addEventListener("checkboxEvent", (e) => {
    viewer.lantern.Addornaments((e as CustomEvent).detail)
});