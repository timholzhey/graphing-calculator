import { loadPlots } from '../core/controller'
import { stringToHTML } from '../utils'

const menuBar: HTMLElement | any = document.getElementById('menu-bar')

export const initMenuBar = function (): void {
	const menuBarButtons: HTMLButtonElement[] = Array.from(menuBar.querySelectorAll('button'))
	menuBarButtons.forEach((button: HTMLButtonElement) => {
		const icon: string = button.dataset.icon || ''
		const href: string = button.dataset.href || ''
		const filter: string = button.dataset.filter || ''
		if (icon && href) {
			const iconStr = '<div class="button-icon"></div>'
			const iconElt = stringToHTML(iconStr).firstChild as HTMLElement
			iconElt.style.backgroundImage = `url('${icon}')`
			iconElt.style.filter = filter
			button.appendChild(iconElt)
			button.addEventListener('click', () => {
				window.open(href, '_blank')
			})
		}
	})

	const demoButton: HTMLButtonElement = document.querySelector('.demo-button') as HTMLButtonElement
	const examplesList: HTMLDivElement = document.querySelector('.examples-list') as HTMLDivElement
	let exampleJson: any
	let numExamples = 0

	fetch('assets/demo/demo.json').then((response: Response) => {
		return response.json()
	}).then((data: any) => {
		exampleJson = data
		numExamples = data?.numPlots
		for (let i = 0; i < numExamples; i++) {
			let container = document.createElement('div')
			container.innerHTML = data?.plots[i]?.name
			container.classList.add('example-list-item')
			container.addEventListener('click', () => {
				loadPlots(exampleJson?.plots[i]?.inputs || '', exampleJson?.plots[i]?.defaults || '')
			})
			examplesList.appendChild(container)
		}
	})

	demoButton.addEventListener('click', () => {
		examplesList.classList.toggle('hidden')
	})
}
