import { Complex, isIterable, map, Vector } from '../utils'
import { getFPSSmoothed, scheduleExit, scheduleRedraw, scheduleSnapshot } from '../../index'
import { onMouseDrag } from '../ui/userInteract'
import { ASTNode } from '../lang/parser'
import { constantEvalGetError, constantEvalX, constantEvalXY } from '../core/constantEval'
import { bindExternVariable } from '../lang/lexer'
import { loadPlots } from '../core/controller'
import { PlotDisplayMode } from '../defines'

export const mainCanvas = document.getElementById('main-canvas') as HTMLCanvasElement
const ctx = mainCanvas.getContext('2d')

const zoomButtonIn = document.querySelector('.zoom-in-button') as HTMLButtonElement
const zoomButtonOut = document.querySelector('.zoom-out-button') as HTMLButtonElement
const fpsDisplay = document.querySelector('.fps-display') as HTMLDivElement
const app = document.getElementById('app') as HTMLDivElement

const offset = new Vector(0, 0)
let scale = 1.0
const subdivisions = 16
const step = 0.01

const dragFromOffset = new Vector(0, 0)
const dragFromMouse = new Vector(0, 0)
let isDragged = false

let gridEnabled = true

let imageDataURL = ''

const zoomCanvas = function (norm: number) {
	const fact = norm > 0 ? 1 + 0.2 * norm : 1 / (1 - 0.2 * norm)
	scale *= fact
	offset.x *= fact
	offset.y *= fact
	scheduleRedraw()
}

const zoomSmooth = function (norm: number): void {
	const targetScale = scale * (norm > 0 ? 1 + 0.2 * norm : 1 / (1 - 0.2 * norm))
	const animationResolution = 0.1
	const step = (targetScale - scale) / (1 / animationResolution)
	let counter = 0
	
	const interval = setInterval(function () {
		scale += step
		scheduleRedraw()
		counter++
		if (counter >= 1 / animationResolution) {
			clearInterval(interval)
		}
	}, 10)
}

export const initCanvas = function (): boolean {
	mainCanvas.addEventListener('mousedown', function (e: MouseEvent): void {
		dragFromOffset.set(offset.x, offset.y)
		dragFromMouse.set(e.clientX, e.clientY)
		isDragged = true
	})

	onMouseDrag(mainCanvas, (mouse: Vector) => {
		if (!isDragged) return
		offset.x = dragFromOffset.x + mouse.x - dragFromMouse.x
		offset.y = dragFromOffset.y + mouse.y - dragFromMouse.y
		scheduleRedraw()
	})

	mainCanvas.addEventListener('mouseup', () => {
		isDragged = false
	})

	mainCanvas.addEventListener('mouseleave', () => {
		isDragged = false
	})

	mainCanvas.addEventListener('wheel', (e: WheelEvent) => {
		zoomCanvas(-e.deltaY / 200)
	})

	zoomButtonIn.addEventListener('click', () => {
		zoomSmooth(1)
	})

	zoomButtonOut.addEventListener('click', () => {
		zoomSmooth(-1)
	})

	bindExternVariable('scale', () => scale, (s: number | number[]) => { scale = s as number; scheduleRedraw() })
	bindExternVariable('grid', () => gridEnabled ? 1 : 0, (g: number | number[]) => { gridEnabled = g as number > 0; scheduleRedraw() })
	bindExternVariable('offset', () => [offset.x, offset.y], (o: number | number[]) => { setOffset((o as number[])[0], (o as number[])[1]); scheduleRedraw() })

	window.onresize = () => scheduleRedraw()

	const params = new URLSearchParams(window.location.search)
	const plots = params.get('plot')
	const _scale = params.get('scale')
	const preview = params.get('preview')

	if (plots) {
		loadPlots(plots.split(';'), [])
	}
	if (_scale) {
		scale = parseFloat(_scale)
	}
	if (preview && preview === 'true') {
		enablePreview()
		app.classList.add('preview')
		return true
	}

	return false
}

export const enablePreview = function (): void {
	gridEnabled = false
	app.classList.add('fullscreen')
	scheduleRedraw()
	setTimeout(() => {
		scheduleSnapshot()
		scheduleExit()
	}, 100)
}

export const canvasFreezeFrame = function (): void {
	// merge main canvas with shader canvas
	const shaderCanvas = document.getElementById('shader-canvas') as HTMLCanvasElement
	if (!ctx) return
	ctx.drawImage(shaderCanvas, 0, 0, mainCanvas.width, mainCanvas.height)

	const img = document.createElement('img')
	img.src = mainCanvas.toDataURL('image/png')
	imageDataURL = img.src

	img.style.position = 'absolute'
	img.style.top = '0'
	img.style.left = '0'
	img.style.width = '100%'
	img.style.height = '100%'
	img.style.objectFit = 'cover'

	document.body.appendChild(img)
}

export const canvasGetImageDataURL = (): string => imageDataURL

const setOffset = function (x: number, y: number) {
	offset.x = -x * (mainCanvas.width / subdivisions)
	offset.y = y * (mainCanvas.height / subdivisions)
}

export const getScale = () => scale
export const getOffset = () => offset

export const resetCanvas = function (): void {
	scale = 1.0
	offset.set(0, 0)
	gridEnabled = true
	scheduleRedraw()
}

export const canvasDraw = function (): void {
	if (!ctx) return

	mainCanvas.width = mainCanvas.clientWidth
	mainCanvas.height = mainCanvas.clientHeight

	ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)

	drawGrid()
}

export const driveCanvas = function (): void {
	fpsDisplay.innerHTML = getFPSSmoothed().toFixed(0)
}

const drawLine = function (fromX: number, fromY: number, toX: number, toY: number): void {
	if (!ctx) return

	ctx.beginPath()
	ctx.moveTo(fromX, fromY)
	ctx.lineTo(toX, toY)
	ctx.stroke()
}

const drawGrid = function (): void {
	if (!ctx || !gridEnabled) return

	const width = mainCanvas.width
	const height = mainCanvas.height
	const aspect = width / height

	ctx.strokeStyle = '#fff'
	ctx.lineWidth = 2

	// y axis
	drawLine(width / 2 + offset.x, 0, width / 2 + offset.x, height)

	// x axis
	drawLine(0, height / 2 + offset.y, width, height / 2 + offset.y)

	const subdivMult = 2 ** Math.floor(Math.log(scale) / Math.log(2))

	// y axis subdivisions
	const yStep = height / subdivisions / subdivMult * scale
	let ySub = -Math.floor(subdivisions / scale / 2 * subdivMult) / subdivMult -
		Math.floor(offset.y / yStep) / subdivMult - (offset.y < 0 ? (1 / subdivMult) : 0) - (1 / subdivMult)
	const yError = (height % (2 * yStep) - 2 * yStep) / 2
	const yRepeatOffset = offset.y % yStep

	for (let y = 0; y < height + 2 * yStep; y += yStep, ySub += 1 / subdivMult) {
		ctx.strokeStyle = '#666'
		ctx.lineWidth = 0.5

		drawLine(0, y + yError + yRepeatOffset, width, y + yError + yRepeatOffset)

		ctx.strokeStyle = 'transparent'
		ctx.fillStyle = '#fff'
		ctx.textAlign = 'right'

		if (ySub === 0) continue

		// y labels
		ctx.beginPath()
		ctx.fillText((-ySub).toString(), width / 2 + offset.x - 10, y + yError + yRepeatOffset + 4)
	}

	// x axis subdivisions
	const xStep = width / subdivisions / subdivMult / aspect * scale
	let xSub = -Math.floor(subdivisions / scale / 2 * subdivMult * aspect) / subdivMult -
		Math.floor(offset.x / xStep) / subdivMult - (offset.x < 0 ? (1 / subdivMult) : 0) - (1 / subdivMult)
	const xError = (width % (2 * xStep) - 2 * xStep) / 2
	const xRepeatOffset = offset.x % xStep

	for (let x = 0; x < width + xStep; x += xStep, xSub += 1 / subdivMult) {
		ctx.strokeStyle = '#666'
		ctx.lineWidth = 0.5

		drawLine(x + xError + xRepeatOffset, 0, x + xError + xRepeatOffset, height)

		ctx.strokeStyle = 'transparent'
		ctx.fillStyle = '#fff'
		ctx.textAlign = 'center'

		if (xSub === 0) {
			ctx.beginPath()
			ctx.fillText((-xSub).toString(), x + xError + xRepeatOffset - 18, height / 2 + offset.y + 20)
			continue
		}

		// x labels
		ctx.beginPath()
		ctx.fillText(xSub.toString(), x + xError + xRepeatOffset, height / 2 + offset.y + 20)
	}
}

const canvasDrawVectorField = function (ast: ASTNode | null, color: string): void {
	if (!ctx || !ast) return

	const width = mainCanvas.width
	const height = mainCanvas.height
	const aspect = width / height

	ctx.strokeStyle = color
	ctx.lineWidth = 3
	ctx.fillStyle = 'transparent'
	ctx.beginPath()

	const xStep = width / subdivisions / aspect * scale
	const xOffset = offset.x / xStep
	const yStep = height / subdivisions * scale
	const yOffset = offset.y / yStep
	const _step = 1
	const maxVecLength = 50
	
	for (let y = (-subdivisions - 1) / 2 / scale + yOffset; y < subdivisions / 2 / scale + yOffset; y += _step / scale) {
		for (let x = -subdivisions / 2 * aspect / scale - xOffset; x < subdivisions / 2 * aspect / scale - xOffset; x += _step / scale) {
			const res = constantEvalXY(ast, x, y)
			if (!isIterable(res)) {
				return
			}
			const arr = res as number[]
			const vec = new Vector(arr[0], arr[1])
			vec.mult(scale * ctx.lineWidth)
			if (vec.mag() > maxVecLength) {
				vec.setMag(maxVecLength)
			}
			vec.y *= -1

			const error = constantEvalGetError()
			if (error) {
				return
			}

			const posX = map(x, -subdivisions / 2 * aspect / scale, subdivisions / 2 * aspect / scale, 0, width) + offset.x
			const posY = map(y, (-subdivisions - 1) / 2 / scale, subdivisions / 2 / scale, height, 0) + offset.y
			const endX = posX + vec.x
			const endY = posY + vec.y
			
			ctx.moveTo(posX, posY)
			ctx.lineTo(endX, endY)

			const arrowBaseToHead = vec.copy().mult(0.7)
			const arrowBase = (new Vector(posX, posY)).add(arrowBaseToHead)
			const arrowHead = new Vector(endX, endY)
			const PI = 3.141592653589
			const leftEdge = arrowBase.copy().add(arrowBaseToHead.copy().rotate(PI / 2).mult(0.1))
			const rightEdge = arrowBase.copy().add(arrowBaseToHead.copy().rotate(-PI / 2).mult(0.1))

			ctx.fillStyle = color
			ctx.moveTo(arrowHead.x, arrowHead.y)
			ctx.lineTo(leftEdge.x, leftEdge.y)
			ctx.lineTo(rightEdge.x, rightEdge.y)
			ctx.lineTo(arrowHead.x, arrowHead.y)
			ctx.fillStyle = 'transparent'
		}
	}

	ctx.stroke()
}

export const canvasDrawFunction = function (ast: ASTNode | null, color: string, mode: PlotDisplayMode): void {
	if (!ctx || !ast) return

	if (mode === PlotDisplayMode.VECTOR_FIELD) {
		canvasDrawVectorField(ast, color)
		return
	}

	const width = mainCanvas.width
	const height = mainCanvas.height
	const aspect = width / height

	ctx.strokeStyle = color
	ctx.lineWidth = 2.5
	ctx.fillStyle = 'transparent'
	ctx.beginPath()

	const xStep = width / subdivisions / aspect * scale
	const xOffset = offset.x / xStep
	let moveTo = true
	
	for (let x = -subdivisions / 2 * aspect / scale - xOffset; x < subdivisions / 2 * aspect / scale - xOffset; x += step / scale) {
		const c = constantEvalX(ast, x)
		const f = typeof c === 'number' ? c : (c as Complex).re

		const error = constantEvalGetError()
		if (error) {
			return
		}

		const mappedX = map(x, -subdivisions / 2 * aspect / scale, subdivisions / 2 * aspect / scale, 0, width) + offset.x
		const mappedY = map(f, -subdivisions / 2 / scale, subdivisions / 2 / scale, height, 0) + offset.y
		
		if (moveTo) {
			ctx.moveTo(mappedX, mappedY)
			moveTo = false
		}
		ctx.lineTo(mappedX, mappedY)
	}

	ctx.stroke()
}

export const getDomain = function (): { minX: number, maxX: number, minY: number, maxY: number } {
	const width = mainCanvas.width
	const height = mainCanvas.height
	const aspect = width / height

    const xStep = width / subdivisions / aspect * scale
    const xOffset = offset.x / xStep
    const minX = -subdivisions / 2 * aspect / scale - xOffset
    const maxX = subdivisions / 2 * aspect / scale - xOffset

    const yStep = height / subdivisions * scale
    const yOffset = offset.y / yStep
    const minY = -subdivisions / 2 / scale + yOffset
    const maxY = subdivisions / 2 / scale + yOffset

    return { minX, maxX, minY, maxY }
}
