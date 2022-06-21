import { Vector } from '../utils'

let mouseClaimed = false
let mouseDown = false
let claimedCallback: (mouse: Vector) => void
const mousePos = new Vector(0, 0)
// eslint-disable-next-line func-call-spacing
const mouseCallbacks = new Map<HTMLElement, (pos: Vector) => void>()

export const getMousePos = function (): Vector {
	return mousePos
}

export const onMouseDrag = function (elt: HTMLElement, callback: (pos: Vector) => void): void {
	mouseCallbacks.set(elt, callback)
}

export const userInteractInit = function (): void {
	document.addEventListener('mousedown', function (e: MouseEvent): void {
		mouseDown = true
	})

	document.addEventListener('mousemove', function (e: MouseEvent): void {
		if (!mouseDown) return
		mousePos.set(e.clientX, e.clientY)
		if (mouseClaimed) {
			claimedCallback(mousePos)
			return
		}
		for (const [elt, callback] of mouseCallbacks) {
			if (elt.contains(e.target as Node)) {
				callback(mousePos)
				mouseClaimed = true
				claimedCallback = callback
				return
			}
		}
	})

	document.addEventListener('mouseup', function (e: MouseEvent): void {
		mouseClaimed = false
		mouseDown = false
	})
}
