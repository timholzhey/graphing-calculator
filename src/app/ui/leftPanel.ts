import { scheduleRedraw } from '../../index'
import { resetPlots, setInputAt, setNumInputs } from '../core/controller'
import { PlotDriver, PlotStatus } from '../defines'
import { stringToHTML, Vector } from '../utils'
import { onMouseDrag } from './userInteract'

const inputsElt: HTMLElement | any = document.querySelector('.inputs')
const resizeArea: HTMLElement | any = document.querySelector('.resize-left-panel')
const leftPanel: HTMLElement | any = document.getElementById('left-panel')

let currentInputIndex = 0
let numInputs = 0

export const initLeftPanel = function (): void {
	onMouseDrag(resizeArea, (mouse: Vector) => {
		const width = Math.max(250, Math.min(window.innerWidth * 0.95, mouse.x))
		document.documentElement.style.setProperty('--left-panel-width', `${width}px`)
		scheduleRedraw()
	})
	
	addNewInput()
}

export const addNewInput = function (): void {
	const eltStr = `
	<div class="input">
	<div class="status"><div class="indicator"></div></div>
	<input type="text" spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="off" autofocus>
	<div class="delete">×</div>
	<div class="const-eval"></div>
	</div>`
	
	const elt: HTMLElement = stringToHTML(eltStr).firstChild as HTMLElement
	const eltInput: HTMLInputElement | any = elt.querySelector('input')
	const eltDelete: HTMLElement | any = elt.querySelector('.delete')
	const eltIndicator: HTMLElement | any = elt.querySelector('.indicator')
	
	eltInput?.addEventListener('keydown', function (e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault()
			if (numInputs > currentInputIndex) {
				const nextElt = inputsElt.querySelector(`.input[data-input-idx="${++currentInputIndex}"]`)
				activateInput(nextElt)
				setTimeout(function () {
					nextElt.querySelector('input')?.focus()
				}, 0)
				return
			}
			addNewInput()
		}
	})
	
	eltInput.addEventListener('click', function (e: MouseEvent) {
		activateInput(elt)
		currentInputIndex = parseInt(elt.getAttribute('data-input-idx') || '0')
		eltInput?.focus()
	})
	
	eltInput?.addEventListener('focus', function (e: FocusEvent) {
		activateInput(elt)
		currentInputIndex = parseInt(elt.getAttribute('data-input-idx') || '0')
	})

	eltInput?.addEventListener('input', function (e: InputEvent) {
		currentInputIndex = parseInt(elt.getAttribute('data-input-idx') || '0')

		if (eltIndicator.classList.contains('disabled')) {
			setInputAt(currentInputIndex, '')
		} else {
			setInputAt(currentInputIndex, eltInput.value)
		}
	})
	
	eltDelete?.addEventListener('click', function (e: MouseEvent) {
		// only element left
		if (numInputs === 1) {
			elt.classList.add('illegal')

			const eltInput: HTMLInputElement | any = elt.querySelector('input')
			if (eltInput) {
				eltInput.value = ''
			}

			const indicator: HTMLElement | null = elt.querySelector('.indicator')
			indicator?.classList.remove('pending', 'active', 'error', 'disabled')

			const constEvalElt: HTMLElement | null = elt.querySelector('.const-eval')
			constEvalElt?.classList.remove('visible')

			setTimeout(() => elt.classList.remove('illegal'), 200)
			
			scheduleRedraw()
			resetPlots()
			return
		}

		elt.classList.add('deleted')

		setTimeout(function () {
			elt.remove()
			const removedIndex = parseInt(elt.getAttribute('data-input-idx') || '0')
			numInputs--
			setNumInputs(numInputs)
			
			// re-index inputs
			const inputs = inputsElt.querySelectorAll('.input')
			for (let i = 0; i < inputs.length; i++) {
				inputs[i].setAttribute('data-input-idx', (i + 1).toString())

				const eltIndicator = inputs[i].querySelector('.indicator')
				if (eltIndicator?.classList.contains('disabled')) {
					setInputAt(i + 1, '')
				} else {
					setInputAt(i + 1, eltInput.value)
				}
			}
			
			// removed element is before current element or first element
			if (numInputs > 0 && (removedIndex <= currentInputIndex || removedIndex === 1)) {
				const prevElt = inputsElt.querySelector(`.input[data-input-idx="${currentInputIndex - 1}"]`)
				activateInput(prevElt)
				setTimeout(function () {
					prevElt.querySelector('input')?.focus()
				}, 0)
			}
		}, 120)
	})

	eltIndicator?.addEventListener('click', function (e: MouseEvent) {
		eltIndicator.classList.toggle('disabled')
		currentInputIndex = parseInt(elt.getAttribute('data-input-idx') || '0')

		if (eltIndicator.classList.contains('disabled')) {
			setInputAt(currentInputIndex, '')
		} else {
			setInputAt(currentInputIndex, eltInput.value)
		}
	})
	
	elt.setAttribute('data-input-idx', (++currentInputIndex).toString())
	elt.classList.add('created')
	setTimeout(function () {
		elt.classList.remove('created')
	}, 120)

	numInputs++
	setNumInputs(numInputs)
	activateInput(elt)
	setTimeout(function () {
		eltInput?.focus()
	}, 0)
	inputsElt.appendChild(elt)
}

export const addNewInputWithValue = function (value: string): void {
	addNewInput()
	setInputAt(currentInputIndex, value)
	const eltInput: HTMLInputElement | any = inputsElt.querySelector(`.input[data-input-idx="${currentInputIndex}"] input`)
	if (eltInput) {
		eltInput.value = value
	}
}

export const resetInputs = function (): void {
	const inputs = inputsElt.querySelectorAll('.input')
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].remove()
	}
	numInputs = 0
	setNumInputs(numInputs)
	currentInputIndex = 0
	resetPlots()
}

const getInputFromIndex = function (idx: number): HTMLInputElement | null {
	return inputsElt.querySelector(`.input[data-input-idx="${idx}"]`)
}

export const inputSetColorAt = function (idx: number, color: string) {
	getInputFromIndex(idx)?.setAttribute('data-color', color)
}

export const inputSetErrorAt = function (idx: number, error: string) {
	const elt = getInputFromIndex(idx)
	if (!elt) return

	const indicator: HTMLElement | null = elt.querySelector('.indicator')
	if (!indicator) return

	indicator.setAttribute('data-error', error)
}

export const inputSetConstEvalAt = function (idx: number, constEval: number) {
	const elt = getInputFromIndex(idx)
	if (!elt) return

	const constEvalElt: HTMLElement | null = elt.querySelector('.const-eval')
	if (!constEvalElt) return

	constEvalElt.innerText = '= ' + constEval.toString()
	constEvalElt.classList.add('visible')
}

export const inputSetStatusAt = function (idx: number, status: PlotStatus) {
	const elt = getInputFromIndex(idx)
	if (!elt) return

	const indicator: HTMLElement | null = elt.querySelector('.indicator')
	if (!indicator) return
	indicator.classList.remove('pending', 'active', 'error')

	const constEvalElt: HTMLElement | null = elt.querySelector('.const-eval')
	if (!constEvalElt) return

	switch (status) {
		case PlotStatus.PENDING:
			indicator.classList.add('pending')
			indicator.innerHTML = ''
			constEvalElt.classList.remove('visible')
			break
		case PlotStatus.ACTIVE:
			indicator.classList.add('active')
			indicator.style.backgroundColor = elt.getAttribute('data-color') || '#000'
			indicator.innerHTML = ''
			break
		case PlotStatus.ERROR:
			indicator.classList.add('error')
			indicator.innerHTML = '!'
			constEvalElt.classList.remove('visible')
			break
	}
}

export const inputSetDriverAt = function (idx: number, driver: PlotDriver) {
	const elt = getInputFromIndex(idx)
	if (!elt) return

	const constEvalElt: HTMLElement | null = elt.querySelector('.const-eval')
	if (!constEvalElt) return

	if (driver !== PlotDriver.CONSTANT) {
		constEvalElt.classList.remove('visible')
	}
}

const activateInput = function (elt: HTMLElement): void {
	inputsElt.querySelectorAll('.input').forEach((elt: HTMLElement) => {
		elt.classList.remove('active')
	})
	elt.classList.add('active')
}

export const getLeftPanelWidth = function (): number {
	return leftPanel.offsetWidth
}
