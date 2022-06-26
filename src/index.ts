import { initLeftPanel } from './app/ui/leftPanel'
import { initMenuBar } from './app/ui/menubar'
import { canvasDraw, initCanvas } from './app/canvas/canvasCore'
import { initUserInteract } from './app/ui/userInteract'
import { drawPlots, drivePlots } from './app/core/controller'

let drawFrame = true
let frameTime = 0

export const scheduleRedraw = function (): void {
	drawFrame = true
}

export const getGlobalTime = (): number => frameTime

window.onload = function () {
	initUserInteract()
	initMenuBar()
	initLeftPanel()
	initCanvas()

	mainLoop()
}

const mainLoop = function () {
	if (drawFrame) {
		drawFrame = false
		canvasDraw()
		drawPlots()
	}

	drivePlots()
	frameTime += 0.01

	requestAnimationFrame(mainLoop)
}
