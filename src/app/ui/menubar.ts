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
}
