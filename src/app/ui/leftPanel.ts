import { scheduleRedraw } from '../../index'
import { stringToHTML, Vector } from '../utils'
import { onMouseDrag } from './userInteract'

const inputsElt: HTMLElement | any = document.querySelector('.inputs')
const resizeArea: HTMLElement | any = document.querySelector('#left-panel .resize-area')

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
	</div>`
	
	const elt: HTMLElement = stringToHTML(eltStr).firstChild as HTMLElement
	const eltInput: HTMLInputElement | any = elt.querySelector('input')
	const eltDelete: HTMLElement | any = elt.querySelector('.delete')
	
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
	
	eltDelete?.addEventListener('click', function (e: MouseEvent) {
		// only element left
		if (numInputs === 1) {
			elt.classList.add('illegal')
			setTimeout(() => elt.classList.remove('illegal'), 200)
			return
		}

		elt.classList.add('deleted')

		setTimeout(function () {
			elt.remove()
			const removedIndex = parseInt(elt.getAttribute('data-input-idx') || '0')
			numInputs--
			
			// re-index inputs
			const inputs = inputsElt.querySelectorAll('.input')
			for (let i = 0; i < inputs.length; i++) {
				inputs[i].setAttribute('data-input-idx', (i + 1).toString())
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
	
	elt.setAttribute('data-input-idx', (++currentInputIndex).toString())
	elt.classList.add('created')
	setTimeout(function () {
		elt.classList.remove('created')
	}, 120)

	numInputs++
	activateInput(elt)
	setTimeout(function () {
		eltInput?.focus()
	}, 0)
	inputsElt.appendChild(elt)
}

const activateInput = function (elt: HTMLElement): void {
	inputsElt.querySelectorAll('.input').forEach((elt: HTMLElement) => {
		elt.classList.remove('active')
	})
	elt.classList.add('active')
}
