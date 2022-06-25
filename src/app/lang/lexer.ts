export enum Token {
	UNDEF,
	NONE,
	VAR,
	VAR2,
	NUM,
	CONST,
	PAREN_OP,
	PAREN_CL,
	PAREN2_OP,
	PAREN2_CL,
	SET_OP,
	SET_CL,
	DELIM,
	ASSIGN,
	ASSIGNABLE,
	LESS,
	GREATER,
	LESS_OR_EQUAL,
	GREATER_OR_EQUAL,
	USERVAR,
	ADD,
	SUB,
	MULT,
	DIV,
	POW,
	AND,
	OR,
	XOR,
	NOT_EQUAL,
	EQUAL,
	TRUE,
	FALSE,
	SQRT,
	EXP,
	LOG,
	SIN,
	COS,
	TAN,
	ASIN,
	ACOS,
	ATAN,
	FLOOR,
	MIN,
	MAX,
	ABS,
	MOD,
	RAND,
	PERLIN,
	FACTORIAL,
	SIGMOID,
	LEVEL_SET,
	VECTOR_FIELD,
	CIRCLE,
	POINT,
	TIME,
	COMPLEX,
	POLAR,
	CARTESIAN,
	MOUSEX,
	MOUSEY,
	MOUSE
}

enum TokenFlag {
	IMPL_MULT_BEFORE = 1,
	IMPL_MULT_AFTER = 2,
	PREFIX = 4,
	POSTFIX = 8,
	UNIQUE = 16,
	BEGIN_SCOPE = 32,
	END_SCOPE = 64
}

// Map of strings to their tokens and flags bitfield
const StringTokenMap: { [key: string]: { tok: Token, flags: number } } = {
	// Control
	'(': { tok: Token.PAREN_OP, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.UNIQUE | TokenFlag.BEGIN_SCOPE },
	')': { tok: Token.PAREN_CL, flags: TokenFlag.IMPL_MULT_AFTER | TokenFlag.UNIQUE | TokenFlag.END_SCOPE },
	'[': { tok: Token.PAREN2_OP, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.UNIQUE | TokenFlag.BEGIN_SCOPE },
	']': { tok: Token.PAREN2_CL, flags: TokenFlag.IMPL_MULT_AFTER | TokenFlag.UNIQUE | TokenFlag.END_SCOPE },
	'{': { tok: Token.SET_OP, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.UNIQUE | TokenFlag.BEGIN_SCOPE },
	'}': { tok: Token.SET_CL, flags: TokenFlag.IMPL_MULT_AFTER | TokenFlag.UNIQUE | TokenFlag.END_SCOPE },
	',': { tok: Token.DELIM, flags: TokenFlag.UNIQUE },
	'=': { tok: Token.ASSIGN, flags: 0 },

	// Variables
	x: { tok: Token.VAR, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
	y: { tok: Token.VAR2, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },

	// Logical
	'<': { tok: Token.LESS, flags: 0 },
	'>': { tok: Token.GREATER, flags: 0 },
	'<=': { tok: Token.LESS_OR_EQUAL, flags: TokenFlag.UNIQUE },
	'>=': { tok: Token.GREATER_OR_EQUAL, flags: TokenFlag.UNIQUE },
	'!=': { tok: Token.NOT_EQUAL, flags: TokenFlag.UNIQUE },
	'==': { tok: Token.EQUAL, flags: TokenFlag.UNIQUE },
	'&&': { tok: Token.AND, flags: TokenFlag.UNIQUE },
	'||': { tok: Token.OR, flags: TokenFlag.UNIQUE },

	// Arithmetic
	'+': { tok: Token.ADD, flags: TokenFlag.UNIQUE },
	'-': { tok: Token.SUB, flags: TokenFlag.UNIQUE },
	'*': { tok: Token.MULT, flags: 0 },
	'/': { tok: Token.DIV, flags: TokenFlag.UNIQUE },
	'^': { tok: Token.POW, flags: TokenFlag.UNIQUE },
	'**': { tok: Token.POW, flags: TokenFlag.UNIQUE },
	'%': { tok: Token.MOD, flags: 0 },
	mod: { tok: Token.MOD, flags: 0 },

	// Literals
	true: { tok: Token.TRUE, flags: 0 },
	false: { tok: Token.FALSE, flags: 0 },

	// Functions
	sqrt: { tok: Token.SQRT, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	exp: { tok: Token.EXP, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	log: { tok: Token.LOG, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	ln: { tok: Token.LOG, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },

	sin: { tok: Token.SIN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	cos: { tok: Token.COS, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	tan: { tok: Token.TAN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },

	asin: { tok: Token.ASIN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	acos: { tok: Token.ACOS, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	atan: { tok: Token.ATAN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	arcsin: { tok: Token.ASIN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	arccos: { tok: Token.ACOS, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	arctan: { tok: Token.ATAN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },

	floor: { tok: Token.FLOOR, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	min: { tok: Token.MIN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	max: { tok: Token.MAX, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	abs: { tok: Token.ABS, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },

	rand: { tok: Token.RAND, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	random: { tok: Token.RAND, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	perlin: { tok: Token.PERLIN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	noise: { tok: Token.PERLIN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	fact: { tok: Token.FACTORIAL, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	factorial: { tok: Token.FACTORIAL, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	sigmoid: { tok: Token.SIGMOID, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },

	// Scalar fields
	Level: { tok: Token.LEVEL_SET, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	Niveau: { tok: Token.LEVEL_SET, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },

	// Vector fields
	VectorField: { tok: Token.VECTOR_FIELD, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	
	// Surrounding
	'|': { tok: Token.ABS, flags: TokenFlag.BEGIN_SCOPE | TokenFlag.END_SCOPE },

	// Shapes
	Circle: { tok: Token.CIRCLE, flags: TokenFlag.PREFIX },
	Point: { tok: Token.POINT, flags: TokenFlag.PREFIX },
	
	// Conversions
	Polar: { tok: Token.POLAR, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	Pol: { tok: Token.POLAR, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	Cartesian: { tok: Token.CARTESIAN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
	Cart: { tok: Token.CARTESIAN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },

	// Time
	t: { tok: Token.TIME, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },

	// Inputs
	mouseX: { tok: Token.MOUSEX, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
	mouseY: { tok: Token.MOUSEY, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
	mouse: { tok: Token.MOUSE, flags: 0 }
}

const StringConstantMap: { [key: string]: number } = {
	pi: Math.PI,
	Pi: Math.PI,
	e: Math.E
}

const escapeRegExp = (str: string) => {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export type Error = { desc: string, pos: number }

let latestError: Error = { desc: '', pos: 0 }
let isError = false
export const getError = (): Error | null => isError ? latestError : null

const reportError = (error: string, position: number) => {
	console.error(`Error at position ${position}: ${error}`)
	latestError = { desc: error, pos: position }
}

const isIdentifier = (str: string): boolean => {
	return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(str)
}

// getter and setter functions
const ExternVariables: { [key: string]: { (): number, (value: number): void } } = {}

// define data structure OpCode has a tok: Token, val: number, flags: TokenFlag
export type OpCode = { tok: Token, val: number | string, flags: TokenFlag }

export const lex = (str: string): OpCode[] => {
	isError = false

	str = str.replace(/\s/g, '')

	const chunks = str.split(
		new RegExp(`(${Object
			.keys(StringTokenMap)
			.filter(k => StringTokenMap[k].flags & TokenFlag.UNIQUE)
			.map(k => escapeRegExp(k))
			.join('|')})`, 'g'))
		.filter((seg: string) => seg !== '')

	const ops: OpCode[] = []
	let pos = 0

	chunks.forEach((chunk: string) => {
		let from = 0
		
		for (let i = chunk.length; i > from; i--) {
			const buf = chunk.substring(from, i)
			let found = false

			if (StringTokenMap[buf]) {
				ops.push({ tok: StringTokenMap[buf].tok, val: 0, flags: StringTokenMap[buf].flags })
				found = true
			} else if (StringConstantMap[buf]) {
				ops.push({ tok: Token.CONST, val: StringConstantMap[buf], flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER })
				found = true
			} else if (ExternVariables[buf]) {
				ops.push({ tok: Token.ASSIGNABLE, val: buf, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER })
				found = true
			} else if (!isNaN(Number(buf))) {
				ops.push({ tok: Token.NUM, val: parseFloat(buf), flags: TokenFlag.IMPL_MULT_AFTER })
				found = true
			} else if (i - 1 === from) {
				let longestIdent = ''
				for (let j = from + 1; j <= chunk.length; j++) {
					const tmp = chunk.substring(from, j)
					if (!isIdentifier(tmp)) {
						break
					}
					longestIdent = tmp
				}
				if (longestIdent !== '') {
					ops.push({ tok: Token.USERVAR, val: longestIdent, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER })
					from += longestIdent.length
					i = chunk.length + 1
					continue
				}
				reportError(`Unknown token: ${chunk.substring(from, chunk.length)}`, pos + from)
				return []
			}

			if (found) {
				from = i
				i = chunk.length + 1
				continue
			}
		}
		pos += chunk.length
	})

	return ops
}
