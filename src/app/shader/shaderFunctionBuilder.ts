import { getGlobalTime, scheduleRedraw } from '../../index'
import { getExternVariable, getUserVariable, setUserVariable, Token } from '../lang/lexer'
import { ASTNode } from '../lang/parser'

let latestError: string | null = null
export const shaderFunctionBuilderGetError = (): string | null => latestError

export const buildShaderFunction = (ast: ASTNode | null): string | null => {
    if (!ast) return null

    latestError = null

    const result: string | null = evalNode(ast)

    return result
}

const reportError = function (error: string): null {
    console.error('Error during constant evaluation: ' + error)
    latestError = error
    return null
}

const numToFloatString = function (num: number): string {
    return num.toString().indexOf('.') === -1 ? num.toString() + '.0' : num.toString()
}

const isIterable = (obj: any): boolean => obj != null && typeof obj[Symbol.iterator] === 'function'

const evalNode = function (node: ASTNode): string | null {
    switch (node.op.tok) {
        case Token.UNDEF:
            return reportError('Token UNDEFINED is not allowed')
        
        case Token.NONE:
            return null
        
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
            return numToFloatString(node.op.val)
        
        case Token.CONST:
            if (typeof node.op.val !== 'number') {
                return reportError('Token CONSTANT must be a number')
            }
            return numToFloatString(node.op.val)
        
        case Token.VAR:
            return 'x'
        
        case Token.VAR2:
            return 'y'

        case Token.TIME:
            scheduleRedraw()
            return 't'

        case Token.ADD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ADDITION')
            }
            return `(${evalNode(node.left)}+${evalNode(node.right)})`

        case Token.SUB:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token SUBTRACTION')
            }
            return `(${evalNode(node.left)}-${evalNode(node.right)})`

        case Token.MULT:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MULTIPLICATION')
            }
            return `(${evalNode(node.left)}*${evalNode(node.right)})`

        case Token.DIV:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token DIVISION')
            }
            return `(${evalNode(node.left)}/${evalNode(node.right)})`

        case Token.POW:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token POWER')
            }
            return `pow(${evalNode(node.left)},${evalNode(node.right)})`

        case Token.SQRT:
            if (node.right == null) {
                return reportError('Missing argument for Token SQUARE ROOT')
            }
            return `sqrt(${evalNode(node.right)})`

        case Token.LOG:
            if (node.right == null) {
                return reportError('Missing argument for Token LOGARITHM')
            }
            return `log(${evalNode(node.right)})`

        case Token.EXP:
            if (node.right == null) {
                return reportError('Missing argument for Token EXPOENTIAL')
            }
            return `exp(${evalNode(node.right)})`

        case Token.SIN:
            if (node.right == null) {
                return reportError('Missing argument for Token SINE')
            }
            return `sin(${evalNode(node.right)})`

        case Token.COS:
            if (node.right == null) {
                return reportError('Missing argument for Token COSINE')
            }
            return `cos(${evalNode(node.right)})`

        case Token.TAN:
            if (node.right == null) {
                return reportError('Missing argument for Token TANGENT')
            }
            return `tan(${evalNode(node.right)})`

        case Token.ASIN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC SINE')
            }
            return `asin(${evalNode(node.right)})`

        case Token.ACOS:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC COSINE')
            }
            return `acos(${evalNode(node.right)})`

        case Token.ATAN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC TANGENT')
            }
            return `atan(${evalNode(node.right)})`
        
        case Token.SINH:
            if (node.right == null) {
                return reportError('Missing argument for Token SINE HYPERBOLICUS')
            }
            return `sinh(${evalNode(node.right)})`

        case Token.COSH:
            if (node.right == null) {
                return reportError('Missing argument for Token COSINE HYPERBOLICUS')
            }
            return `cosh(${evalNode(node.right)})`

        case Token.TANH:
            if (node.right == null) {
                return reportError('Missing argument for Token TANGENT HYPERBOLICUS')
            }
            return `tanh(${evalNode(node.right)})`

        case Token.FLOOR:
            if (node.right == null) {
                return reportError('Missing argument for Token FLOOR')
            }
            return `floor(${evalNode(node.right)})`

        case Token.MIN:
            if (node.right == null) {
                return reportError('Missing argument for Token MIN')
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token MIN')
            }
            return `min(${evalNode(node.right)})`

        case Token.MAX:
            if (node.right == null) {
                return reportError('Missing argument for Token MAX')
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token MAX')
            }
            return `max(${evalNode(node.right)})`

        case Token.DELIM:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token DELIMITER')
            }
            return `${evalNode(node.left)},${evalNode(node.right)}`

        case Token.ABS:
            if (node.right == null) {
                return reportError('Missing argument for Token ABSOLUTE')
            }
            return `abs(${evalNode(node.right)})`

        case Token.RAND:
            if (node.right == null) {
                return reportError('Missing argument for Token RANDOM')
            }
            return `random(${evalNode(node.right)})`

        case Token.PERLIN: {
            if (node.right == null) {
                return reportError('Missing arguments for Token PERLIN')
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token PERLIN')
            }
            return `noise(vec2(${evalNode(node.right)}))`
        }

        case Token.MOD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MODULUS')
            }
            return `mod(${evalNode(node.left)},${evalNode(node.right)})`
        
        case Token.LEVEL_SET:
            if (node.right == null) {
                return reportError('Missing argument for Token LEVEL SET')
            }
            if (node.right.op.tok === Token.DELIM) {
                if (node.right.left == null || node.right.right == null) {
                    return reportError('Missing arguments for Token LEVEL SET')
                }
                return `${evalNode(node.right.left)}+((level=${evalNode(node.right.right)})>0.0?0.0:0.0)`
            }
            return evalNode(node.right)
        
        case Token.VECTOR_FIELD:
            return reportError('Token VECTOR FIELD is not allowed')
        
        case Token.LESS:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN')
            }
            return `btof(${evalNode(node.left)}<${evalNode(node.right)})`

        case Token.GREATER:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN')
            }
            return `btof(${evalNode(node.left)}>${evalNode(node.right)})`

        case Token.LESS_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN OR EQUAL TO')
            }
            return `btof(${evalNode(node.left)}<=${evalNode(node.right)})`

        case Token.GREATER_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN OR EQUAL TO')
            }
            return `btof(${evalNode(node.left)}>=${evalNode(node.right)})`

        case Token.EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token EQUAL TO')
            }
            return `btof(${evalNode(node.left)}==${evalNode(node.right)})`
        
        case Token.AND:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token AND')
            }
            return `btof(ftob(${evalNode(node.left)})&&ftob(${evalNode(node.right)}))`

        case Token.OR:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token OR')
            }
            return `btof(ftob(${evalNode(node.left)})||ftob(${evalNode(node.right)}))`
        
        case Token.USERVAR:
            return `btof(${getUserVariable(node.op.val as string)})`
        
        case Token.FACTORIAL:
            if (node.right == null) {
                return reportError('Missing argument for Token FACTORIAL')
            }
            return `factorial(${evalNode(node.right)})`

        case Token.SIGMOID:
            if (node.right == null) {
                return reportError('Missing argument for Token SIGMOID')
            }
            return `(1.0/(1.0+exp(-(${evalNode(node.right)}))))`

        case Token.CIRCLE:
            if (node.right == null) {
                return reportError('Missing argument for Token CIRCLE')
            }
            return `circle(x,y,d,${evalNode(node.right)})`

        case Token.POINT:
            if (node.right == null) {
                return reportError('Missing argument for Token POINT')
            }
            return `point(x,y,d,${evalNode(node.right)})`

        case Token.TRUE:
            return 'btof(true)'

        case Token.FALSE:
            return 'btof(false)'

        case Token.POLAR:
            if (node.right == null) {
                return reportError('Missing argument for Token POLAR')
            }
            return `(POLAR+${evalNode(node.right)})`
        
        case Token.CARTESIAN:
            if (node.right == null) {
                return reportError('Missing argument for Token CARTESIAN')
            }
            return `(CARTESIAN+${evalNode(node.right)})`
        
        case Token.MOUSEX:
            return 'mx'
        
        case Token.MOUSEY:
            return 'my'

        case Token.MOUSE:
            return reportError('Token MOUSE is not allowed')

        case Token.ASSIGN:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ASSIGN')
            }
            if (node.left.op.tok !== Token.ASSIGNABLE) {
                if (node.left.op.tok === Token.USERVAR) {
                    setUserVariable(node.left.op.val as string, parseFloat(evalNode(node.right) as string))
                    return evalNode(node.right)
                }
                return `btof(abs(${evalNode(node.left)}-${evalNode(node.right)})<d)`
            }
            if (getExternVariable(node.left.op.val as string) == null) {
                return reportError(`Variable ${node.left.op.val} does not exist`)
            }
            getExternVariable(node.left.op.val as string)?.set(parseFloat(evalNode(node.right) as string))
            return evalNode(node.right)
        
        default:
            return reportError(`Unknown token ${node.op.val}`)
    }
}
