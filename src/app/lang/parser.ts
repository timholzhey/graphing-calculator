import { PlotDisplayMode, PlotDriver } from '../defines'
import { Token, TokenFlag, OpCode, Error, lex, lexerGetError } from './lexer'

const MAX_PRECEDENCE = 8
const TokenPrecedence: { [key: number]: number } = {
	[Token.OR]: 0,
	[Token.DELIM]: 1,
	[Token.AND]: 2,
	[Token.EQUAL]: 3,
	[Token.NOT_EQUAL]: 3,
	[Token.ASSIGN]: 3,
	[Token.LESS]: 4,
	[Token.LESS_OR_EQUAL]: 4,
	[Token.GREATER]: 4,
	[Token.GREATER_OR_EQUAL]: 4,
	[Token.ADD]: 5,
	[Token.SUB]: 5,
	[Token.MULT]: 6,
	[Token.DIV]: 6,
	[Token.MOD]: 6,
	[Token.POW]: 7
}

export type ASTNode = {
	op: OpCode,
	left: ASTNode | null,
	right: ASTNode | null
}

const reportError = (error: string, position: number) => {
	console.debug(`Error at position ${position}: ${error}`)
	latestError = { desc: error, pos: position }
}

let latestError: Error | null = null
let continuous = false
let driver: PlotDriver = PlotDriver.CONSTANT
let displayMode: PlotDisplayMode = PlotDisplayMode.NONE

export const parserGetError = (): Error | null => latestError
export const parserGetContinuous = (): boolean => continuous
export const parserGetDriver = (): PlotDriver => driver
export const parserGetDisplayMode = (): PlotDisplayMode => displayMode

export const parse = (input: string): ASTNode | null => {
	latestError = null
	continuous = false
	driver = PlotDriver.CONSTANT
	displayMode = PlotDisplayMode.NONE

	let ops: OpCode[] | null = lex(input)
	console.debug('Lexer output:', ops)

	const lexerError = lexerGetError()
	if (lexerError) {
		latestError = JSON.parse(JSON.stringify(lexerError))
		return null
	}

	ops = validate(ops)
	console.debug('Validated ops:', ops)
	if (ops == null) return null
	
	ops = expand(ops)
	console.debug('Expanded ops:', ops)
	if (ops == null) return null
	
	const numVars = (ops.filter(op => op.tok === Token.VAR).length > 0 ? 1 : 0) +
		(ops.filter(op => op.tok === Token.VAR2).length > 0 ? 1 : 0)

	if (ops.filter(op => op.tok === Token.VECTOR_FIELD).length > 0) {
		driver = PlotDriver.CANVAS
		displayMode = PlotDisplayMode.VECTOR_FIELD
	} else if (ops.filter(op => op.flags & TokenFlag.WEBGL_ONLY).length > 0) {
		driver = PlotDriver.WEBGL
		displayMode = PlotDisplayMode.SET
		if (ops.filter(op => op.tok === Token.LEVEL_SET).length > 0) {
			displayMode = PlotDisplayMode.LEVEL_SET
		} else if (ops.filter(op => op.tok === Token.GRADIENT).length > 0) {
			displayMode = PlotDisplayMode.GRADIENT
		}
	} else if (numVars === 0) {
		driver = PlotDriver.CONSTANT
		displayMode = PlotDisplayMode.CONSTANT_EVAL
	} else if (numVars === 1) {
		driver = PlotDriver.CANVAS
		displayMode = PlotDisplayMode.FUNCTION_GRAPH
	}

	continuous = ops.filter(op => op.tok === Token.TIME).length > 0 ||
		ops.filter(op => op.tok === Token.MOUSEX).length > 0 ||
		ops.filter(op => op.tok === Token.MOUSEY).length > 0
	
	ops = optimize(ops)
	console.debug('Optimized ops:', ops)
	if (ops == null) return null
	
	return buildAST(ops)
}

const validate = (ops: OpCode[]): OpCode[] | null => {
	// Check for unmatched and mismatched parentheses
	const parenStack: { tok: Token, pos: number }[] = []

	for (let i = 0; i < ops.length; i++) {
		const op = ops[i]

		if (op.flags & TokenFlag.BEGIN_SCOPE) {
			parenStack.push({ tok: op.tok, pos: i })
		}

		if (op.flags & TokenFlag.END_SCOPE) {
			const { tok, pos } = parenStack.pop() || { tok: Token.NONE, pos: 0 }

			let expectTok: Token = Token.NONE
			switch (tok) {
				case Token.PAREN_OP: expectTok = Token.PAREN_CL; break
				case Token.BRACKET_OP: expectTok = Token.BRACKET_CL; break
				case Token.BRACE_OP: expectTok = Token.BRACE_CL; break
				case Token.ABS: expectTok = Token.ABS; break
			}

			if (op.tok !== expectTok) {
				reportError('Mismatched parentheses', pos)
				return null
			}
		}
	}

	if (parenStack.length > 0) {
		const { pos } = parenStack[0]
		reportError('Unmatched parentheses', pos)
		return null
	}

	return ops
}

const expand = (ops: OpCode[]): OpCode[] | null => {
	// Replace |x| with abs(x)
	const absStack: { tok: Token, pos: number }[] = []
	
	for (let i = 0; i < ops.length; i++) {
		const op = ops[i]

		if (op.tok === Token.ABS && op.flags & TokenFlag.BEGIN_SCOPE) {
			const top = absStack.pop()
			absStack.push({ tok: op.tok, pos: i })
			if (!top) continue

			const absExpr = ops.splice(top.pos + 1, i - top.pos - 1)
			ops.splice(top.pos, 2)
			ops.splice(top.pos, 0,
				{ tok: Token.ABS, val: 0, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
				{ tok: Token.PAREN_OP, val: 0, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.UNIQUE | TokenFlag.BEGIN_SCOPE },
				...absExpr,
				{ tok: Token.PAREN_CL, val: 0, flags: TokenFlag.IMPL_MULT_AFTER | TokenFlag.UNIQUE | TokenFlag.END_SCOPE }
			)
			i = top.pos + absExpr.length + 3
			absStack.pop()
		}
	}

	// Replace mouse with mouseX, delim, mouseY and z with x + y * i
	for (let i = 0; i < ops.length; i++) {
		if (ops[i].tok === Token.MOUSE) {
			ops.splice(i, 1,
				{ tok: Token.MOUSEX, val: 0, flags: TokenFlag.IMPL_MULT_BEFORE },
				{ tok: Token.DELIM, val: 0, flags: 0 },
				{ tok: Token.MOUSEY, val: 0, flags: TokenFlag.IMPL_MULT_BEFORE }
			)
			i += 2
		} else if (ops[i].tok === Token.COMPLEX) {
			ops.splice(i, 1,
				{ tok: Token.PAREN_OP, val: 0, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.BEGIN_SCOPE },
				{ tok: Token.VAR, val: 0, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
				{ tok: Token.ADD, val: 0, flags: 0 },
				{ tok: Token.VAR2, val: 0, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER | TokenFlag.WEBGL_ONLY },
				{ tok: Token.IMAGINARY, val: 0, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
				{ tok: Token.PAREN_CL, val: 0, flags: TokenFlag.IMPL_MULT_AFTER | TokenFlag.END_SCOPE }
			)
			i += 5
		}
	}

	// Insert implicit multiplication
	for (let i = 1; i < ops.length; i++) {
		if ((ops[i - 1].flags & TokenFlag.IMPL_MULT_AFTER) && (ops[i].flags & TokenFlag.IMPL_MULT_BEFORE)) {
			ops.splice(i, 0, { tok: Token.MULT, val: 0, flags: 0 })
		}
	}

	// Insert parentheses based on precedence
	for (let prec = MAX_PRECEDENCE; prec > 0; prec--) {
		for (let i = 0; i < ops.length; i++) {
			if (TokenPrecedence[ops[i].tok] === prec) {
				let left = 0
				let right = ops.length
				let level = 0

				// Find left boundry
				for (let j = i; j >= 0; j--) {
					if (ops[j].flags & TokenFlag.BEGIN_SCOPE) {
						level++
					} else if (ops[j].flags & TokenFlag.END_SCOPE) {
						level--
					}

					if ((TokenPrecedence[ops[j].tok] < prec && level === 0) || level > 0) {
						left = j + 1
						break
					}
				}

				// Find right boundry
				level = 0
				for (let j = i; j < ops.length; j++) {
					if (ops[j].flags & TokenFlag.BEGIN_SCOPE) {
						level++
					} else if (ops[j].flags & TokenFlag.END_SCOPE) {
						level--
					}

					if ((TokenPrecedence[ops[j].tok] < prec && level === 0) || level < 0) {
						right = j
						break
					}
				}

				// Insert parenthesis
				ops.splice(right, 0, { tok: Token.PAREN_CL, val: 0, flags: TokenFlag.IMPL_MULT_AFTER | TokenFlag.UNIQUE | TokenFlag.END_SCOPE })
				ops.splice(left, 0, { tok: Token.PAREN_OP, val: 0, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.UNIQUE | TokenFlag.BEGIN_SCOPE })
				i++
			}
		}
	}

	// Insert zero before leading minus
	for (let i = 0; i < ops.length; i++) {
		if (ops[i].tok === Token.SUB && (i === 0 || (ops[i - 1].flags & TokenFlag.BEGIN_SCOPE))) {
			ops.splice(i, 0, { tok: Token.NUM, val: 0, flags: TokenFlag.IMPL_MULT_AFTER })
		}
	}

	return ops
}

const optimize = (ops: OpCode[]): OpCode[] | null => {
	// Truncate consecutive negative signs
	let numConsecSub = 0
	for (let i = 0; i < ops.length; i++) {
		if (ops[i].tok === Token.SUB) {
			numConsecSub++
		} else {
			if (numConsecSub > 1) {
				if (numConsecSub % 2 === 1) {
					for (let j = 0; j < numConsecSub - 1; j++) {
						ops.splice(i - numConsecSub, 1)
					}
				} else {
					for (let j = 0; j < numConsecSub; j++) {
						ops.splice(i - numConsecSub, 1)
					}
					ops.splice(i - numConsecSub, 0, { tok: Token.ADD, val: 0, flags: 0 })
				}
			}
			numConsecSub = 0
		}
	}

	// Remove empty parenthesis
	for (let i = 1; i < ops.length; i++) {
		if ((ops[i].flags & TokenFlag.END_SCOPE) && (ops[i - 1].flags & TokenFlag.BEGIN_SCOPE)) {
			ops.splice(i - 1, 2)
		}
	}

	return ops
}

const buildAST = (ops: OpCode[]): ASTNode | null => {
	const root: ASTNode = { op: { tok: Token.NONE, val: 0, flags: 0 }, left: null, right: null }
	let current: ASTNode = root
	const stack: ASTNode[] = []
	let level = 0

	for (let i = 0; i < ops.length; i++) {
		const op = ops[i]

		if (op.flags & TokenFlag.BEGIN_SCOPE) {
			level++
		} else if (op.flags & TokenFlag.END_SCOPE) {
			if (level <= 0) {
				reportError('Unexpected end of scope', i)
				return null
			}
			level--
			current = stack.pop() as ASTNode
			continue
		}

		if (current.op == null || current.op.tok === Token.NONE || (current.op.flags & TokenFlag.BEGIN_SCOPE)) {
			current.op = op

			if (current.op.flags & TokenFlag.BEGIN_SCOPE) {
				stack.push(current)
			}
		} else {
			if (current.left == null) {
				if (current.op.flags & TokenFlag.PREFIX) {
					current.left = { op: { tok: Token.UNDEF, val: 0, flags: 0 }, left: null, right: null }
					current.right = { op, left: null, right: null }

					if (current.right.op.flags & TokenFlag.BEGIN_SCOPE) {
						stack.push(current)
						current = current.right
					}
					continue
				}

				const tmp = JSON.parse(JSON.stringify(current))
				current.left = tmp
				current.op = op
			} else if (current.right == null || (current.right.op.flags & TokenFlag.BEGIN_SCOPE)) {
				current.right = { op, left: null, right: null }
				
				if (current.right.op.flags & TokenFlag.BEGIN_SCOPE) {
					stack.push(current)
					current = current.right
				}
			} else if (current.right.op.flags & TokenFlag.PREFIX && current.right.right == null) {
				stack.push(current)
				current = current.right
				current.right = { op, left: null, right: null }
			} else {
				const tmp = JSON.parse(JSON.stringify(current))
				current.left = tmp
				current.right = null
				current.op = op
			}
		}
	}

	if (level !== 0) {
		reportError('Unexpected end of expression', ops.length)
		return null
	}

	return root
}
