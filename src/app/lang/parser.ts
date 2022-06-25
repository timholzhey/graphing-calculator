import { Token, OpCode, Error } from './lexer'

const MAX_PRECEDENCE = 11
const TokenPrecedence: { [key: number]: number } = {
	[Token.OR]: 0,
	[Token.DELIM]: 1,
	[Token.XOR]: 2,
	[Token.AND]: 3,
	[Token.EQUAL]: 4,
	[Token.NOT_EQUAL]: 4,
	[Token.ASSIGN]: 4,
	[Token.LESS]: 5,
	[Token.LESS_OR_EQUAL]: 5,
	[Token.GREATER]: 5,
	[Token.GREATER_OR_EQUAL]: 5,
	[Token.ADD]: 6,
	[Token.SUB]: 6,
	[Token.MULT]: 7,
	[Token.DIV]: 7,
	[Token.MOD]: 7,
	[Token.POW]: 8
}

type ASTNode = {
	op: OpCode,
	left: ASTNode,
	right: ASTNode
}

let latestError: Error = { desc: '', pos: 0 }
let isError = false
export const getError = (): Error | null => isError ? latestError : null

export const parse = (ops: OpCode[]): ASTNode | null => {
	isError = false

	ops = validate(ops)
	if (ops == null) return null
	
	ops = expand(ops)
	if (ops == null) return null
	
	ops = optimize(ops)
	if (ops == null) return null
	
	return buildAST(ops)
}
