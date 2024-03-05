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
	
	set (x: number, y: number): Vector {
		this.x = x
		this.y = y
		return this
	}

	add (v: Vector): Vector {
		this.x += v.x
		this.y += v.y
		return this
	}

	mult (x: number): Vector {
		this.x *= x
		this.y *= x
		return this
	}

	copy (): Vector {
		return new Vector(this.x, this.y)
	}

	mag (): number {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}

	magSq (): number {
		return this.x * this.x + this.y * this.y
	}

	heading (): number {
		return Math.atan(this.y / this.x)
	}

	rotate (phi: number): Vector {
		const newHeading = this.heading() + phi
		const mag = this.mag()
		this.x = mag * Math.cos(newHeading)
		this.y = mag * Math.sin(newHeading)
		return this
	}

	normalize (): Vector {
		const len = this.mag()
		if (len !== 0) this.mult(1 / len)
		return this
	}

	setMag (mag: number): Vector {
		return this.normalize().mult(mag)
	}
}

export type Complex = {
    re: number
    im: number
}

export const complexToString = function (c: Complex): string {
	// round components to 6 decimal places
	const re = Math.round(c.re * 1000000) / 1000000
	const im = Math.round(c.im * 1000000) / 1000000
	return im === 0 ? re.toString() : (re + ' + ' + im + 'i')
}

export const cpx = (num: number) => ({ re: num, im: 0 })

export const isIterable = (obj: any): boolean => obj != null && typeof obj[Symbol.iterator] === 'function'

const factorial01 = function (x: number): number {
	return (((((0.07288448978215456 * x - 0.31390051543712616) * x + 0.6538907084614038) * x - 0.810425715520978) * x + 0.9737655441276729) * x - 0.5761851668648887) * x + 0.9999830044034752
}

export const factorial = function (x: number): number {
	const h = Math.floor(x)
	const f = x - h
	let y = factorial01(f)
	if (x < 0) for (let n = 0; n < -h; n++) y /= f - n
	else for (let n = 1; n < h + 1; n++) y *= f + n
	return x > 0 ? y : Infinity
}

export const sigmoid = function (x: number): number {
	return 1 / (1 + Math.exp(-x))
}

const constrain = function (n: number, low: number, high: number) {
	return Math.max(Math.min(n, high), low)
}

export const map = function (n: number, start1: number, stop1: number, start2: number, stop2: number) {
	return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2
}

export const splitmix32 = function (a: number): () => number {
    return function () {
      a |= 0; a = a + 0x9e3779b9 | 0
      let t = a ^ a >>> 16; t = Math.imul(t, 0x21f0aaad)
          t = t ^ t >>> 15; t = Math.imul(t, 0x735a2d97)
      return ((t = t ^ t >>> 15) >>> 0) / 4294967296
    }
}
