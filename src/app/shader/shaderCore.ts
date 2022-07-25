import { getGlobalTime, scheduleRedraw } from '../../index'
import { getDomain } from '../canvas/canvasCore'
import { getPlotsShaderInfo } from '../core/controller'
import { PlotDisplayMode } from '../defines'
import * as mat4 from '../lib/gl-matrix/mat4'
import { getMousePos } from '../ui/userInteract'

const deviation = 0.004

let info: any = null
let buffers: WebGLBuffer | null = null
let shadersAreInitializing = false
let shadersInitialized = false
let error = false
const fileBuffers: {[key: string]: string} = {}

const canvas = document.getElementById('shader-canvas') as HTMLCanvasElement
const ctx = canvas.getContext('webgl2', { preserveDrawingBuffer: true }) as WebGLRenderingContext

export const shadersClearAll = function () {
	scheduleReloadShaders()
}

export const initShaderCore = function () {
	if (!canvas || !ctx) {
		console.error('Failed to initialize WebGL context.')
	}
}

async function fetchBuffered (url: string) {
	if (!fileBuffers[url]) {
		const response = await fetch(url)
		const text = await response.text()
		fileBuffers[url] = text
		return text
	}
	return Promise.resolve(fileBuffers[url])
}

async function loadShaders () {
	shadersAreInitializing = true

	await Promise.all([
		fetchBuffered('assets/shaders/plot.vert'),
		fetchBuffered('assets/shaders/plot.frag')
	]).then(shaders => {
		shaders[1] = injectFunctionsIntoShaderSource(shaders[1])

		const program = initShaders(shaders[0], shaders[1])
		if (!program) {
			console.error('Failed to load shaders')
			return
		}

		info = {
			program,
			attribLocations: {
				vertexPosition: ctx.getAttribLocation(program, 'aVertexPosition')
			},
			uniformLocations: {
				projectionMatrix: ctx.getUniformLocation(program, 'uProjectionMatrix'),
				modelViewMatrix: ctx.getUniformLocation(program, 'uModelViewMatrix'),
				u_resolution: ctx.getUniformLocation(program, 'u_resolution'),
				u_mouse: ctx.getUniformLocation(program, 'u_mouse'),
				u_time: ctx.getUniformLocation(program, 'u_time'),
				u_deviation: ctx.getUniformLocation(program, 'u_deviation'),
				u_domain_x: ctx.getUniformLocation(program, 'u_domain_x'),
				u_domain_y: ctx.getUniformLocation(program, 'u_domain_y'),
				u_display_mode: ctx.getUniformLocation(program, 'u_display_mode')
			}
		}
		buffers = initBuffers()
		
		shadersInitialized = true
		shadersAreInitializing = false
	})
}

export const shaderCoreUpdate = function () {
	// Shaders are not loaded yet
	if (!shadersInitialized && !shadersAreInitializing && !error) {
		loadShaders()
		
		if (error) {
			console.error('Failed to load shaders')
		}
	}
}

export const scheduleReloadShaders = function () {
	error = false
	shadersInitialized = false
	shadersAreInitializing = false
}

export const shadersDraw = function () {
	shadersInitialized = false

	if (shadersInitialized && !error) {
		drawScene()
		return
	}

	loadShaders().then(
		() => {
			if (!shadersInitialized) {
				console.error('Failed to initialize shaders')
				ctx.clearColor(0.0, 0.0, 0.0, 1.0)
				return
			}
			drawScene()
		}
	)
}

const hexColorToNormalRGBString = function (hex: string): string {
	const r = parseInt(hex.substring(1, 3), 16)
	const g = parseInt(hex.substring(3, 5), 16)
	const b = parseInt(hex.substring(5, 7), 16)
	return `${r / 255.0}, ${g / 255.0}, ${b / 255.0}`
}

function injectFunctionsIntoShaderSource (shader: string): string {
	const plots: { functions: string[], colors: string[], displayModes: PlotDisplayMode[], numPlots: number, iterExpr: string[] } = getPlotsShaderInfo()
	
	if (plots.numPlots === 0) {
		plots.functions = []
		plots.colors = ['#000000']
		plots.displayModes = [PlotDisplayMode.NONE]
		plots.iterExpr = []
	}

	plots.functions.push('0.0')
	plots.iterExpr.push('vec2(0.0,0.0)')

	return shader
		.replace(/USER_NUM_FUNC_INJ/g, `${plots.numPlots + 1}`)
		.replace(/USER_FUNC_INJ/g, `float[](${plots.functions.map(f => `(${f})`).join(',')})`)
		.replace(/USER_COL_INJ/g, `vec3[](${plots.colors.map(c => `vec3(${hexColorToNormalRGBString(c)})`).join(',')})`)
		.replace(/USER_DISP_INJ/g, `int[](${plots.displayModes.map(d => `${d}`).join(',')})`)
		.replace(/USER_ITER_EXPR_INJ/g, `vec2[](${plots.iterExpr.map(e => `(${e.length > 0 ? e : 'vec2(0.0,0.0)'})`).join(',')})`)
}

function initShaders (vertSrc: string, fragSrc: string) {
	// load source
	const vertShader = loadShader(ctx.VERTEX_SHADER, vertSrc)
	const fragShader = loadShader(ctx.FRAGMENT_SHADER, fragSrc)
	
	if (!vertShader || !fragShader) {
		return null
	}
	
	// create program
	const program = ctx.createProgram()
	if (!program) {
		console.error('Failed to create program')
		return null
	}
	
	ctx.attachShader(program, vertShader)
	ctx.attachShader(program, fragShader)
	ctx.linkProgram(program)
	
	// check if program is linked
	if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
		console.error('Failed to link program: ' + ctx.getProgramInfoLog(program))
		return null
	}
	
	return program
}

function loadShader (type: number, source: string) {
	const shader = ctx.createShader(type)
	if (!shader) {
		console.error('Failed to create shader')
		return null
	}
	
	ctx.shaderSource(shader, source)
	ctx.compileShader(shader)
	
	// check if shader compiled
	if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
		console.error('Failed to compile shader: ' + ctx.getShaderInfoLog(shader))
		ctx.getShaderInfoLog(shader)
		ctx.deleteShader(shader)
		return null
	}
	
	return shader
}

function initBuffers (): WebGLBuffer | null {
	const positionBuffer = ctx.createBuffer()
	ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer)
	
	// Square
	const positions = [
		1.0, 1.0,
		-1.0, 1.0,
		1.0, -1.0,
		-1.0, -1.0
	]
	
	ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(positions), ctx.STATIC_DRAW)
	
	return positionBuffer
}

function drawScene () {
	// Clear
	ctx.clearColor(0.0, 0.0, 0.0, 1.0)
	ctx.clearDepth(1.0)
	ctx.enable(ctx.DEPTH_TEST)
	ctx.depthFunc(ctx.LEQUAL)
	ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT)
	
	// Perspective
	const fov = 45 * Math.PI / 180
	const aspect = ctx.canvas.clientWidth / ctx.canvas.clientHeight
	const zNear = 0.1
	const zFar = 100.0
	const projectionMatrix = mat4.create()
	
	mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar)
	
	const modelViewMatrix = mat4.create()
	
	mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -1])
	
	const numComponents = 2
	const type = ctx.FLOAT
	const normalize = false
	const stride = 0
	const offset = 0
	
	ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers)
	ctx.vertexAttribPointer(info.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset)
	ctx.enableVertexAttribArray(info.attribLocations.vertexPosition)
	
	ctx.useProgram(info.program)
	
	const mousePos = getMousePos()
	const domain: { minX: number, maxX: number, minY: number, maxY: number } = getDomain()
	
	// Set uniforms
	ctx.uniformMatrix4fv(info.uniformLocations.projectionMatrix, false, projectionMatrix)
	ctx.uniformMatrix4fv(info.uniformLocations.modelViewMatrix, false, modelViewMatrix)
	ctx.uniform2f(info.uniformLocations.u_resolution, ctx.canvas.width, ctx.canvas.height)
	ctx.uniform2f(info.uniformLocations.u_mouse, mousePos.x, mousePos.y)
	ctx.uniform2f(info.uniformLocations.u_domain_x, domain.minX, domain.maxX)
	ctx.uniform2f(info.uniformLocations.u_domain_y, domain.minY, domain.maxY)
	ctx.uniform1f(info.uniformLocations.u_time, getGlobalTime())
	ctx.uniform1f(info.uniformLocations.u_deviation, deviation)
	ctx.uniform1i(info.uniformLocations.u_display_mode, 0) // TODO
	
	const vertexCount = 4
	ctx.drawArrays(ctx.TRIANGLE_STRIP, offset, vertexCount)
}
