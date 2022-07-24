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

// Perlin noise from https://github.com/josephg/noisejs/blob/master/perlin.js
const perm = new Array(512)
const gradP = new Array(512)

const p = [151, 160, 137, 91, 90, 15,
	131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
	190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
	88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
	77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
	102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
	135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
	5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
	223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
	129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
	251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
	49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
	138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180]

class Grad {
	x: number
	y: number
	z: number

	constructor (x: number, y: number, z: number) {
		this.x = x; this.y = y; this.z = z
	}
}

const grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
			new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
			new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)]

const seed = function (seed: number): void {
	if (seed > 0 && seed < 1) {
		seed *= 65536
	}

	seed = Math.floor(seed)
	if (seed < 256) {
		seed |= seed << 8
	}

	for (let i = 0; i < 256; i++) {
		let v
		if (i & 1) {
		v = p[i] ^ (seed & 255)
		} else {
		v = p[i] ^ ((seed >> 8) & 255)
		}

		perm[i] = perm[i + 256] = v
		gradP[i] = gradP[i + 256] = grad3[v % 12]
	}
}

seed(12345)

function fade (t: number): number {
	return t * t * t * (t * (t * 6 - 15) + 10)
}

function lerp (a: number, b: number, t: number): number {
	return (1 - t) * a + t * b
}

export const perlin2 = function (x: number, y: number): number {
	// Find unit grid cell containing point
	let X = Math.floor(x); let Y = Math.floor(y)
	// Get relative xy coordinates of point within that cell
	x = x - X; y = y - Y
	// Wrap the integer cells at 255 (smaller integer period can be introduced here)
	X = X & 255; Y = Y & 255

	// Calculate noise contributions from each of the four corners
	const n00 = gradP[X + perm[Y]].dot2(x, y)
	const n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1)
	const n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y)
	const n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1)

	// Compute the fade curve value for x
	const u = fade(x)

	// Interpolate the four results
	return lerp(
		lerp(n00, n10, u),
		lerp(n01, n11, u),
		fade(y))
}

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
