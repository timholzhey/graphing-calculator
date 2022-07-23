import { getGlobalTime, scheduleRedraw } from '../../index'
import { getExternVariable, getUserVariable, setUserVariable, Token } from '../lang/lexer'
import { ASTNode } from '../lang/parser'

let latestError: string | null = null
export const shaderFunctionBuilderGetError = (): string | null => latestError

let iterExpr: string = ''
export const shaderFunctionBuilderGetIterExpression = (): string => iterExpr

export const buildShaderFunction = (ast: ASTNode | null): string | null => {
    if (!ast) return null

    latestError = null
    iterExpr = ''

    const result: { val: string | null, cpx: boolean } = evalNode(ast)
    console.debug('Shader function: ' + result.val)

    return result.val
}

const reportError = function (error: string): { val: null, cpx: false } {
    console.error('Error during constant evaluation: ' + error)
    latestError = error
    return { val: null, cpx: false }
}

const numToFloatString = function (num: number): string {
    return num.toString().indexOf('.') === -1 ? num.toString() + '.0' : num.toString()
}

const isIterable = (obj: any): boolean => obj != null && typeof obj[Symbol.iterator] === 'function'

const real = (val: string): { val: string | null, cpx: false } => {
    return { val, cpx: false }
}
const complex = (val: string): { val: string, cpx: true } => {
    return { val, cpx: true }
}

const evalNode = function (node: ASTNode): { val: string | null, cpx: boolean } {
    let left, right

    switch (node.op.tok) {
        case Token.UNDEF:
            return reportError('Token UNDEFINED is not allowed')
        
        case Token.NONE:
            return real('0')
        
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
            return real(numToFloatString(node.op.val))
        
        case Token.CONST:
            if (typeof node.op.val !== 'number') {
                return reportError('Token CONSTANT must be a number')
            }
            return real(numToFloatString(node.op.val))
        
        case Token.VAR:
            return real('x')
        
        case Token.VAR2:
            return real('y')

        case Token.TIME:
            scheduleRedraw()
            return real('t')

        case Token.ADD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ADDITION')
            }
            left = evalNode(node.left)
            right = evalNode(node.right)
            if (!left.cpx && !right.cpx) {
                return real(`(${left.val}+${right.val})`)
            }
            return complex(`add(${left.val},${right.val})`)

        case Token.SUB:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token SUBTRACTION')
            }
            left = evalNode(node.left)
            right = evalNode(node.right)
            if (!left.cpx && !right.cpx) {
                return real(`(${left.val}-${right.val})`)
            }
            return complex(`sub(${left.val},${right.val})`)

        case Token.MULT:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MULTIPLICATION')
            }
            left = evalNode(node.left)
            right = evalNode(node.right)
            if (!left.cpx && !right.cpx) {
                return real(`(${left.val}*${right.val})`)
            }
            return complex(`mul(${left.val},${right.val})`)

        case Token.DIV:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token DIVISION')
            }
            left = evalNode(node.left)
            right = evalNode(node.right)
            if (!left.cpx && !right.cpx) {
                return real(`(${left.val}/${right.val})`)
            }
            return complex(`div(${left.val},${right.val})`)

        case Token.POW:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token POWER')
            }
            left = evalNode(node.left)
            right = evalNode(node.right)
            if (!left.cpx && !right.cpx) {
                return real(`_pow(${left.val},${right.val})`)
            }
            if (right.cpx) {
                return reportError('Power cannot be complex')
            }
            return complex(`_pow(${left.val},${right.val})`)

        case Token.SQRT:
            if (node.right == null) {
                return reportError('Missing argument for Token SQUARE ROOT')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`sqrt(${right.val})`)
            }
            return reportError('Square root cannot be complex')

        case Token.LOG:
            if (node.right == null) {
                return reportError('Missing argument for Token LOGARITHM')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`log(${right.val})`)
            }

        case Token.EXP:
            if (node.right == null) {
                return reportError('Missing argument for Token EXPOENTIAL')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`exp(${right.val})`)
            }
            return reportError('Exponential cannot be complex')

        case Token.SIN:
            if (node.right == null) {
                return reportError('Missing argument for Token SINE')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`sin(${right.val})`)
            }
            return reportError('Sine cannot be complex')

        case Token.COS:
            if (node.right == null) {
                return reportError('Missing argument for Token COSINE')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`cos(${right.val})`)
            }
            return reportError('Cosine cannot be complex')

        case Token.TAN:
            if (node.right == null) {
                return reportError('Missing argument for Token TANGENT')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`tan(${right.val})`)
            }
            return reportError('Tangent cannot be complex')

        case Token.ASIN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC SINE')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`asin(${right.val})`)
            }
            return reportError('Arc sine cannot be complex')

        case Token.ACOS:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC COSINE')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`acos(${right.val})`)
            }

        case Token.ATAN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC TANGENT')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`atan(${right.val})`)
            }
            return reportError('Arc tangent cannot be complex')
        
        case Token.SINH:
            if (node.right == null) {
                return reportError('Missing argument for Token SINE HYPERBOLICUS')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`sinh(${right.val})`)
            }
            return reportError('Sine hyperbolicus cannot be complex')

        case Token.COSH:
            if (node.right == null) {
                return reportError('Missing argument for Token COSINE HYPERBOLICUS')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`cosh(${right.val})`)
            }
            return reportError('Cosine hyperbolicus cannot be complex')

        case Token.TANH:
            if (node.right == null) {
                return reportError('Missing argument for Token TANGENT HYPERBOLICUS')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`tanh(${right.val})`)
            }

        case Token.FLOOR:
            if (node.right == null) {
                return reportError('Missing argument for Token FLOOR')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`floor(${right.val})`)
            }
            return reportError('Floor cannot be complex')

        case Token.MIN:
            if (node.right == null) {
                return reportError('Missing argument for Token MIN')
            }
            if (!isIterable(evalNode(node.right).val)) {
                return reportError('Malformed argument for Token MIN')
            }
            return real(`min(${evalNode(node.right).val})`)

        case Token.MAX:
            if (node.right == null) {
                return reportError('Missing argument for Token MAX')
            }
            if (!isIterable(evalNode(node.right).val)) {
                return reportError('Malformed argument for Token MAX')
            }
            return real(`max(${evalNode(node.right).val})`)

        case Token.DELIM:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token DELIMITER')
            }
            return real(`${evalNode(node.left).val},${evalNode(node.right).val}`)

        case Token.ABS:
            if (node.right == null) {
                return reportError('Missing argument for Token ABSOLUTE')
            }
            right = evalNode(node.right)
            if (!right.cpx) {
                return real(`abs(${right.val})`)
            }
            return real(`mag(${right.val})`)

        case Token.RAND:
            if (node.right == null) {
                return reportError('Missing argument for Token RANDOM')
            }
            return real(`random(${evalNode(node.right).val})`)

        case Token.PERLIN: {
            if (node.right == null) {
                return reportError('Missing arguments for Token PERLIN')
            }
            if (!isIterable(evalNode(node.right).val)) {
                return reportError('Malformed argument for Token PERLIN')
            }
            return real(`noise(vec2(${evalNode(node.right).val}))`)
        }

        case Token.MOD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MODULUS')
            }
            return real(`mod(${evalNode(node.left).val},${evalNode(node.right).val})`)
        
        case Token.LEVEL_SET:
            if (node.right == null) {
                return reportError('Missing argument for Token LEVEL SET')
            }
            if (node.right.op.tok === Token.DELIM) {
                if (node.right.left == null || node.right.right == null) {
                    return reportError('Missing arguments for Token LEVEL SET')
                }
                return real(`${evalNode(node.right.left).val}+((level=${evalNode(node.right.right).val})>0.0?0.0:0.0)`)
            }
            return evalNode(node.right)
        
        case Token.VECTOR_FIELD:
            return reportError('Token VECTOR FIELD is not allowed')
        
        case Token.LESS:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN')
            }
            return real(`btof(${evalNode(node.left).val}<${evalNode(node.right).val})`)

        case Token.GREATER:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN')
            }
            return real(`btof(${evalNode(node.left).val}>${evalNode(node.right).val})`)

        case Token.LESS_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN OR EQUAL TO')
            }
            return real(`btof(${evalNode(node.left).val}<=${evalNode(node.right).val})`)

        case Token.GREATER_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN OR EQUAL TO')
            }
            return real(`btof(${evalNode(node.left).val}>=${evalNode(node.right).val})`)

        case Token.EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token EQUAL TO')
            }
            return real(`btof(${evalNode(node.left).val}==${evalNode(node.right).val})`)
        
        case Token.AND:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token AND')
            }
            return real(`btof(ftob(${evalNode(node.left).val})&&ftob(${evalNode(node.right).val}))`)

        case Token.OR:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token OR')
            }
            return real(`btof(ftob(${evalNode(node.left).val})||ftob(${evalNode(node.right).val}))`)
        
        case Token.USERVAR:
            return real(`btof(${getUserVariable(node.op.val as string)})`)
        
        case Token.FACTORIAL:
            if (node.right == null) {
                return reportError('Missing argument for Token FACTORIAL')
            }
            return real(`factorial(${evalNode(node.right).val})`)

        case Token.SIGMOID:
            if (node.right == null) {
                return reportError('Missing argument for Token SIGMOID')
            }
            return real(`(1.0/(1.0+exp(-(${evalNode(node.right).val}))))`)

        case Token.CIRCLE:
            if (node.right == null) {
                return reportError('Missing argument for Token CIRCLE')
            }
            return real(`circle(x,y,d,${evalNode(node.right).val})`)

        case Token.POINT:
            if (node.right == null) {
                return reportError('Missing argument for Token POINT')
            }
            return real(`point(x,y,d,${evalNode(node.right).val})`)

        case Token.TRUE:
            return real('btof(true)')

        case Token.FALSE:
            return real('btof(false)')

        case Token.POLAR:
            if (node.right == null) {
                return reportError('Missing argument for Token POLAR')
            }
            return real(`(POLAR+${evalNode(node.right).val})`)
        
        case Token.CARTESIAN:
            if (node.right == null) {
                return reportError('Missing argument for Token CARTESIAN')
            }
            return real(`(CARTESIAN+${evalNode(node.right).val})`)
        
        case Token.MOUSEX:
            return real('mx')
        
        case Token.MOUSEY:
            return real('my')

        case Token.MOUSE:
            return reportError('Token MOUSE is not allowed')
        
        case Token.IMAGINARY:
            return complex('vec2(0.0,1.0)')

        case Token.SERIES:
            if (node.right == null || node.right.left == null || node.right.right == null) {
                return reportError('Missing argument for Token SERIES')
            }
            iterExpr = evalNode(node.right.right as ASTNode).val || ''
            return real(`series(i,x,y,t,${evalNode(node.right.left).val})`)
        
        case Token.ITERATOR:
            return real('k')
        
        case Token.COMPLEX:
            return reportError('Token COMPLEX is not allowed')
        
        case Token.MAGNITUDE:
            if (node.right == null) {
                return reportError('Missing argument for Token MAGNITUDE')
            }
            return real(`mag(${evalNode(node.right).val})`)
        
        case Token.GRADIENT:
            if (node.right == null) {
                return reportError('Missing argument for Token GRADIENT')
            }
            return evalNode(node.right)

        case Token.ASSIGN:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ASSIGN')
            }
            if (node.left.op.tok !== Token.ASSIGNABLE) {
                if (node.left.op.tok === Token.USERVAR) {
                    setUserVariable(node.left.op.val as string, parseFloat(evalNode(node.right).val as string))
                    return evalNode(node.right)
                }
                return real(`btof(abs(${evalNode(node.left).val}-${evalNode(node.right).val})<d)`)
            }
            if (getExternVariable(node.left.op.val as string) == null) {
                return reportError(`Variable ${node.left.op.val} does not exist`)
            }
            getExternVariable(node.left.op.val as string)?.set(parseFloat(evalNode(node.right).val as string))
            return evalNode(node.right)
        
        default:
            return reportError(`Unknown token ${node.op.val}`)
    }
}
