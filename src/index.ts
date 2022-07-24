import { initLeftPanel } from './app/ui/leftPanel'
import { initMenuBar } from './app/ui/menubar'
import { canvasDraw, driveCanvas, initCanvas } from './app/canvas/canvasCore'
import { initUserInteract } from './app/ui/userInteract'
import { drawPlots, drivePlots } from './app/core/controller'
import { shadersDraw, initShaderCore, shaderCoreUpdate } from './app/shader/shaderCore'

let drawFrame = true
let frameTime = 0
let frameDelta = 0
let lastFrameTimestamp = 0
const fpsBufferSmoothing: number[] = Array(1).fill(60)

export const scheduleRedraw = function (): void {
	drawFrame = true
}

export const getGlobalTime = (): number => frameTime

export const getFPSSmoothed = (): number => fpsBufferSmoothing.reduce((a: number, b: number) => a + b) / fpsBufferSmoothing.length

window.onload = function () {
	initUserInteract()
	initMenuBar()
	initLeftPanel()
	initCanvas()
	initShaderCore()

	mainLoop()
}

const mainLoop = function () {
	if (drawFrame) {
		drawFrame = false
		canvasDraw()
		shadersDraw()
		drawPlots()
	}

	driveCanvas()
	drivePlots()
	shaderCoreUpdate()
	frameTime += 0.01

	const now = Date.now()
	frameDelta = now - lastFrameTimestamp
	lastFrameTimestamp = now
	fpsBufferSmoothing.push(1000 / frameDelta)
	if (fpsBufferSmoothing.length > 100) fpsBufferSmoothing.shift()

	requestAnimationFrame(mainLoop)
}
