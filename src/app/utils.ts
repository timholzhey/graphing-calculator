export const stringToHTML = function (str: string): HTMLElement {
	const parser = new DOMParser()
	const doc = parser.parseFromString(str, 'text/html')
	return doc.body
}

export class Vector {
	x: number
	y: number

	constructor (x: number, y: number) {
		this.x = x
		this.y = y
	}

	set (x: number, y: number): void {
		this.x = x
		this.y = y
	}
}
