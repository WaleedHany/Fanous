import * as THREE from "three"
import Viewer from "./Application/Viewer"
let viewer = Viewer.initialize(document.querySelector("canvas.webgl")!)


// Wait for DOM to Load
document.addEventListener("DOMContentLoaded", () => {

    const panelContent = document.getElementById("panelContent") as HTMLDivElement
    const togglePanel = document.getElementById("togglePanel") as HTMLButtonElement

    let isPanelExpanded = false

    togglePanel?.addEventListener("click", function() {
        isPanelExpanded = !isPanelExpanded;

        if (isPanelExpanded) {
            panelContent.style.display = "block";
            setTimeout(() => panelContent.classList.add("expanded"), 50); 
        } else {
            panelContent.classList.remove("expanded");
            setTimeout(() => panelContent.style.display = "none", 50);
        }

        // Change arrow direction
        togglePanel.textContent = isPanelExpanded ? "▶ Controls" : "◀ Controls";
    });

    let isToggled = false
    const toggleButton = document.getElementById("toggleButton") as HTMLButtonElement
    toggleButton?.addEventListener("click", function() {
        isToggled = !isToggled
        this.textContent = isToggled ? "Light Off" : "Light On"
        document.dispatchEvent(new CustomEvent("toggleButtonEvent", { detail: isToggled }))
    })

    document.querySelectorAll(".color-btn").forEach(button => {
        button.addEventListener("click", function() {
            const picker = button.nextElementSibling as HTMLInputElement
            if (picker) picker.click() // Open the color picker
        })
    })

    document.querySelectorAll(".color-picker").forEach(picker => {
        picker.addEventListener("input", function() {
            const color = (picker as HTMLInputElement).value
            const eventName = picker.getAttribute("data-event")
            if (eventName) {
                console.log(`${eventName} - Color Changed:`, color)
                document.dispatchEvent(new CustomEvent(eventName, { detail: color }))
            }
        })
    })

    const featureToggle = document.getElementById("featureToggle") as HTMLInputElement
    featureToggle?.addEventListener("change", function() {
        document.dispatchEvent(new CustomEvent("checkboxEvent", { detail: this.checked }))
    })

    const intensitySlider = document.getElementById("intensitySlider") as HTMLInputElement
    const intensityValueLabel = document.getElementById("intensityValue") as HTMLSpanElement

    intensitySlider?.addEventListener("input", function() {
        const intensityValue = (this as HTMLInputElement).value
        if (intensityValueLabel) intensityValueLabel.textContent = intensityValue // Update display
        document.dispatchEvent(new CustomEvent("intensityChangeEvent", { detail: parseFloat(intensityValue) }))
    })
})

document.addEventListener("DOMContentLoaded", () => {
    const intensityInput = document.getElementById("intensityInput") as HTMLInputElement
    const intensitySlider = document.getElementById("intensitySlider") as HTMLInputElement

    intensityInput?.addEventListener("input", function() {
        const value = parseFloat(this.value)
        if (!isNaN(value) && value >= 0 && value <= 20) {
            intensitySlider.value = this.value
            document.dispatchEvent(new CustomEvent("intensityChangeEvent", { detail: value }))
        }
    })

    intensitySlider?.addEventListener("input", function() {
        intensityInput.value = this.value
        document.dispatchEvent(new CustomEvent("intensityChangeEvent", { detail: parseFloat(this.value) }))
    })
})


document.addEventListener("toggleButtonEvent", (e) => {
    const lightOn = !(e as CustomEvent).detail
    viewer.lantern.ToggleLight(lightOn)
    if(!lightOn) viewer.scene.remove(viewer.environment.ambientLight)
    else viewer.scene.add(viewer.environment.ambientLight)
})

document.addEventListener("colorChangeEvent2", (e) => {
    (document.getElementById("colorLamp")! as HTMLElement).style.background = (e as CustomEvent).detail
    const color = new THREE.Color((e as CustomEvent).detail)
    viewer.lantern.changeLampColor(color)
    viewer.environment.ambientLight.color = color
})

document.addEventListener("colorChangeEvent3", (e) => {
    (document.getElementById("colorWood")! as HTMLElement).style.background = (e as CustomEvent).detail
    viewer.lantern.changeWoodColor(new THREE.Color((e as CustomEvent).detail))
})

document.addEventListener("checkboxEvent", (e) => {
    viewer.lantern.Addornaments((e as CustomEvent).detail)
})

document.addEventListener("intensityChangeEvent", function(e) {
    const intensity = (e as CustomEvent).detail
    viewer.lantern.updateLightIntensity(intensity)
})