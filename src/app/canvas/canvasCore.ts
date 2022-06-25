import { Vector } from '../utils'
import { scheduleRedraw } from '../../index'
import { onMouseDrag } from '../ui/userInteract'

export const mainCanvas = document.getElementById('main-canvas') as HTMLCanvasElement
const ctx = mainCanvas.getContext('2d')

const zoomButtonIn = document.querySelector('.zoom-in-button') as HTMLButtonElement
const zoomButtonOut = document.querySelector('.zoom-out-button') as HTMLButtonElement

const offset = new Vector(0, 0)
let scale = 1.0
const subdivisions = 16

const dragFromOffset = new Vector(0, 0)
const dragFromMouse = new Vector(0, 0)
let isDragged = false

const zoomCanvas = function (norm: number) {
	scale *= norm > 0 ? 1 + 0.2 * norm : 1 / (1 - 0.2 * norm)
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

export const canvasInit = function (): void {
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
}

export const canvasDraw = function (): void {
	if (!ctx) return

	mainCanvas.width = mainCanvas.clientWidth
	mainCanvas.height = mainCanvas.clientHeight

	ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)

	drawGrid()
}

const drawLine = function (fromX: number, fromY: number, toX: number, toY: number): void {
	if (!ctx) return

	ctx.beginPath()
	ctx.moveTo(fromX, fromY)
	ctx.lineTo(toX, toY)
	ctx.stroke()
}

const drawGrid = function (): void {
	if (!ctx) return

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
