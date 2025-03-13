import * as THREE from "three";
import Viewer from "./Application/Viewer"
let viewer = Viewer.initialize(document.querySelector("canvas.webgl")!);


document.addEventListener("toggleButtonEvent", (e) => {
    viewer.lantern.ToggleLight(!(e as CustomEvent).detail)
});

document.addEventListener("colorChangeEvent2", (e) => {
    (document.getElementById("colorLamp")! as HTMLElement).style.background = (e as CustomEvent).detail;
    viewer.lantern.changeLampColor(new THREE.Color((e as CustomEvent).detail))
});

document.addEventListener("colorChangeEvent3", (e) => {
    (document.getElementById("colorWood")! as HTMLElement).style.background = (e as CustomEvent).detail;
    viewer.lantern.changeWoodColor(new THREE.Color((e as CustomEvent).detail))
});

document.addEventListener("checkboxEvent", (e) => {
    viewer.lantern.Addornaments((e as CustomEvent).detail)
});