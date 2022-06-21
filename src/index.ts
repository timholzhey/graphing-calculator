import { initLeftPanel } from './app/ui/leftPanel'
import { initMenuBar } from './app/ui/menubar'
import { canvasDraw, canvasInit } from './app/canvas/canvasCore'
import { userInteractInit } from './app/ui/userInteract'

let drawFrame = true

export const scheduleRedraw = function (): void {
	drawFrame = true
}

window.onload = function () {
	userInteractInit()
	initMenuBar()
	initLeftPanel()
	canvasInit()

	mainLoop()
}

const mainLoop = function () {
	if (drawFrame) {
		drawFrame = false
		canvasDraw()
	}

	requestAnimationFrame(mainLoop)
}
