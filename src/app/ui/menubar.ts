import { enablePreview } from '../canvas/canvasCore'
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
			const container = document.createElement('div')
			const heading = document.createElement('h3')
			heading.innerHTML = data?.plots[i]?.name
			container.appendChild(heading)

			container.classList.add('example-list-item')

			const iframe = document.createElement('iframe')
			iframe.src = `?plot=${exampleJson?.plots[i]?.inputs.map(encodeURIComponent).join(';') || ''}&preview=true`
			iframe.classList.add('example-preview')
			iframe.style.overflow = 'hidden'
			iframe.style.border = 'none'
			container.appendChild(iframe)

			const clickable = document.createElement('div')
			clickable.classList.add('example-clickable')
			clickable.addEventListener('click', () => {
				loadPlots(exampleJson?.plots[i]?.inputs || '', exampleJson?.plots[i]?.defaults || '')
			})
			container.appendChild(clickable)

			examplesList.appendChild(container)
		}
	})

	demoButton.addEventListener('click', () => {
		examplesList.classList.toggle('hidden')
	})

	const title = document.querySelector('.menu-bar-title h1') as HTMLHeadingElement
	title.onclick = () => window.location.replace(window.location.origin)

	const exportButton = document.querySelector('.export-button') as HTMLButtonElement
	exportButton.addEventListener('click', () => {
		enablePreview()
	})

	const exitFullscreen = document.querySelector('.exit-fullscreen') as HTMLDivElement
	exitFullscreen.addEventListener('click', () => {
		window.location.reload()
	})
}
