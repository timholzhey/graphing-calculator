import { getGlobalTime, scheduleRedraw } from '../../index'
import { getExternVariable, getUserVariable, setUserVariable, Token } from '../lang/lexer'
import { ASTNode } from '../lang/parser'
import { getMousePos } from '../ui/userInteract'
import { factorial, perlin2, sigmoid } from '../utils'

let latestError: string | null = null
let x: number | null

export const constantEval = function (ast: ASTNode | null): number {
    if (!ast) return 0

    latestError = null

    const result: number = evalNode(ast) as number

    return result
}

export const constantEvalX = function (ast: ASTNode | null, _x: number): number {
    x = _x

    const result = constantEval(ast)

    x = null
    return result
}

const reportError = function (error: string): number {
    console.error('Error during constant evaluation: ' + error)
    latestError = error
    return 0
}

export const constantEvalGetError = (): string | null => latestError

const isIterable = (obj: any): boolean => obj != null && typeof obj[Symbol.iterator] === 'function'

const evalNode = function (node: ASTNode): number | number[] {
    switch (node.op.tok) {
        case Token.UNDEF:
            return reportError('Token UNDEFINED is not allowed')
        
        case Token.NONE:
            return 0
        
        case Token.PAREN_OP:
            return reportError('Token OPEN PARENTHESIS is not allowed')
        
        case Token.PAREN_CL:
            return reportError('Token CLOSE PARENTHESIS is not allowed')
        
        case Token.BRACKET_OP:
            return reportError('Token OPEN BRACKET is not allowed')
        
        case Token.BRACKET_CL:
            return reportError('Token CLOSE BRACKET is not allowed')
        
        case Token.BRACE_OP:
            return reportError('Token OPEN BRACE is not allowed')

        case Token.BRACE_CL:
            return reportError('Token CLOSE BRACE is not allowed')
        
        case Token.NUM:
            if (typeof node.op.val !== 'number') {
                return reportError('Token NUMBER must be a number')
            }
            return node.op.val
        
        case Token.CONST:
            if (typeof node.op.val !== 'number') {
                return reportError('Token CONSTANT must be a number')
            }
            return node.op.val
        
        case Token.VAR:
            if (x == null) {
                return reportError('Token VARIABLE is not allowed')
            }
            return x
        
        case Token.VAR2:
            return reportError('Token VARIABLE2 is not allowed')

        case Token.TIME:
            scheduleRedraw()
            return getGlobalTime()

        case Token.ADD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ADDITION')
            }
            return (evalNode(node.left) as number) + (evalNode(node.right) as number)

        case Token.SUB:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token SUBTRACTION')
            }
            return (evalNode(node.left) as number) - (evalNode(node.right) as number)

        case Token.MULT:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MULTIPLICATION')
            }
            return (evalNode(node.left) as number) * (evalNode(node.right) as number)

        case Token.DIV:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token DIVISION')
            }
            return (evalNode(node.left) as number) / (evalNode(node.right) as number)

        case Token.POW:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token POWER')
            }
            return Math.pow(evalNode(node.left) as number, evalNode(node.right) as number)

        case Token.SQRT:
            if (node.right == null) {
                return reportError('Missing argument for Token SQUARE ROOT')
            }
            return Math.sqrt(evalNode(node.right) as number)

        case Token.LOG:
            if (node.right == null) {
                return reportError('Missing argument for Token LOGARITHM')
            }
            return Math.log(evalNode(node.right) as number)

        case Token.EXP:
            if (node.right == null) {
                return reportError('Missing argument for Token EXPOENTIAL')
            }
            return Math.exp(evalNode(node.right) as number)

        case Token.SIN:
            if (node.right == null) {
                return reportError('Missing argument for Token SINE')
            }
            return Math.sin(evalNode(node.right) as number)

        case Token.COS:
            if (node.right == null) {
                return reportError('Missing argument for Token COSINE')
            }
            return Math.cos(evalNode(node.right) as number)

        case Token.TAN:
            if (node.right == null) {
                return reportError('Missing argument for Token TANGENT')
            }
            return Math.tan(evalNode(node.right) as number)

        case Token.ASIN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC SINE')
            }
            return Math.asin(evalNode(node.right) as number)

        case Token.ACOS:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC COSINE')
            }
            return Math.acos(evalNode(node.right) as number)

        case Token.ATAN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC TANGENT')
            }
            return Math.atan(evalNode(node.right) as number)

        case Token.FLOOR:
            if (node.right == null) {
                return reportError('Missing argument for Token FLOOR')
            }
            return Math.floor(evalNode(node.right) as number)

        case Token.MIN:
            if (node.right == null) {
                return reportError('Missing argument for Token MIN')
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token MIN')
            }
            return Math.min(...evalNode(node.right) as number[])

        case Token.MAX:
            if (node.right == null) {
                return reportError('Missing argument for Token MAX')
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token MAX')
            }
            return Math.max(...evalNode(node.right) as number[])

        case Token.DELIM:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token DELIMITER')
            }
            return [evalNode(node.left) as number, evalNode(node.right) as number]

        case Token.ABS:
            if (node.right == null) {
                return reportError('Missing argument for Token ABSOLUTE')
            }
            return Math.abs(evalNode(node.right) as number)

        case Token.RAND:
            if (node.right == null) {
                return reportError('Missing argument for Token RANDOM')
            }
            return Math.random() * (evalNode(node.right) as number)

        case Token.PERLIN: {
            if (node.right == null) {
                return reportError('Missing arguments for Token PERLIN')
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token PERLIN')
            }
            const [x, y] = evalNode(node.right) as number[]
            return perlin2(x, y)
        }

        case Token.MOD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MODULUS')
            }
            return (evalNode(node.left) as number) % (evalNode(node.right) as number)
        
        case Token.LEVEL_SET:
            return reportError('Token LEVEL SET is not allowed')
        
        case Token.VECTOR_FIELD:
            return reportError('Token VECTOR FIELD is not allowed')
        
        case Token.LESS:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN')
            }
            return (evalNode(node.left) as number) < (evalNode(node.right) as number) ? 1 : 0

        case Token.GREATER:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN')
            }
            return (evalNode(node.left) as number) > (evalNode(node.right) as number) ? 1 : 0

        case Token.LESS_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN OR EQUAL TO')
            }
            return (evalNode(node.left) as number) <= (evalNode(node.right) as number) ? 1 : 0

        case Token.GREATER_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN OR EQUAL TO')
            }
            return (evalNode(node.left) as number) >= (evalNode(node.right) as number) ? 1 : 0

        case Token.EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token EQUAL TO')
            }
            return (evalNode(node.left) as number) - (evalNode(node.right) as number) < 0.00001 ? 1 : 0
        
        case Token.AND:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token AND')
            }
            return (evalNode(node.left) as number) && (evalNode(node.right) as number) ? 1 : 0

        case Token.OR:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token OR')
            }
            return (evalNode(node.left) as number) || (evalNode(node.right) as number) ? 1 : 0
        
        case Token.USERVAR:
            return getUserVariable(node.op.val as string)
        
        case Token.FACTORIAL:
            if (node.right == null) {
                return reportError('Missing argument for Token FACTORIAL')
            }
            return factorial(evalNode(node.right) as number)

        case Token.SIGMOID:
            if (node.right == null) {
                return reportError('Missing argument for Token SIGMOID')
            }
            return sigmoid(evalNode(node.right) as number)

        case Token.CIRCLE:
            return reportError('Token CIRCLE is not allowed')

        case Token.POINT:
            return reportError('Token POINT is not allowed')

        case Token.TRUE:
            return 1

        case Token.FALSE:
            return 0

        case Token.POLAR:
            return reportError('Token POLAR is not allowed')
        
        case Token.CARTESIAN:
            return reportError('Token CARTESIAN is not allowed')
        
        case Token.MOUSEX:
            return getMousePos().x
        
        case Token.MOUSEY:
            return getMousePos().y

        case Token.MOUSE:
            return [getMousePos().x, getMousePos().y]

        case Token.ASSIGN:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ASSIGN')
            }
            if (node.left.op.tok !== Token.ASSIGNABLE) {
                if (node.left.op.tok === Token.USERVAR) {
                    setUserVariable(node.left.op.val as string, evalNode(node.right) as number)
                    return evalNode(node.right)
                }
                return reportError('Left side of ASSIGN must be assignable')
            }
            if (getExternVariable(node.left.op.val as string) == null) {
                return reportError(`Variable ${node.left.op.val} does not exist`)
            }
            getExternVariable(node.left.op.val as string)?.set(evalNode(node.right) as number)
            return evalNode(node.right)
        
        default:
            return reportError(`Unknown token ${node.op.val}`)
    }
}
