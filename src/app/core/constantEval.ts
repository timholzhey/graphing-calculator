import { getGlobalTime, scheduleRedraw } from '../../index'
import { getExternVariable, getUserVariable, setUserVariable, Token } from '../lang/lexer'
import { ASTNode } from '../lang/parser'
import { getMousePos } from '../ui/userInteract'
import { Complex, cpx, factorial, isIterable, perlin2, sigmoid } from '../utils'

let latestError: string | null = null
let x: number | null
let y: number | null
let iterator = 0
let index = 1

export const constantEval = function (ast: ASTNode | null): Complex | number | number[] {
    if (!ast) return 0

    latestError = null
    iterator = 0
    index = 1

    const result: number = evalNode(ast) as number

    return result
}

export const constantEvalX = function (ast: ASTNode | null, _x: number): Complex | number | number[] {
    x = _x

    const result = constantEval(ast)

    x = null
    return result
}

export const constantEvalXY = function (ast: ASTNode | null, _x: number, _y: number): Complex | number | number[] {
    x = _x
    y = _y

    const result = constantEval(ast)

    x = null
    y = null
    return result
}

const reportError = function (error: string): number {
    console.error('Error during constant evaluation: ' + error)
    latestError = error
    return 0
}

export const constantEvalGetError = (): string | null => latestError

const evalNode = function (node: ASTNode): number | Complex | number[] {
    let left, right

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
            return cpx(node.op.val)
        
        case Token.CONST:
            if (typeof node.op.val !== 'number') {
                return reportError('Token CONSTANT must be a number')
            }
            return cpx(node.op.val)
        
        case Token.VAR:
            if (x == null) {
                return reportError('Token VARIABLE is not defined')
            }
            return cpx(x)
        
        case Token.VAR2:
            if (y == null) {
                return reportError('Token VARIABLE2 is not defined')
            }
            return cpx(y)

        case Token.TIME:
            scheduleRedraw()
            return cpx(getGlobalTime())

        case Token.ADD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ADDITION')
            }
            left = evalNode(node.left) as Complex
            right = evalNode(node.right) as Complex
            return { re: left.re + right.re, im: left.im + right.im }

        case Token.SUB:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token SUBTRACTION')
            }
            left = evalNode(node.left) as Complex
            right = evalNode(node.right) as Complex
            return { re: left.re - right.re, im: left.im - right.im }

        case Token.MULT:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MULTIPLICATION')
            }
            left = evalNode(node.left) as Complex
            right = evalNode(node.right) as Complex
            if (left.im === 0 && right.im === 0) {
                return cpx(left.re * right.re)
            }
            return { re: left.re * right.re - left.im * right.im, im: left.re * right.im + left.im * right.re }

        case Token.DIV:
            {
                if (node.left == null || node.right == null) {
                    return reportError('Missing arguments for Token DIVISION')
                }
                left = evalNode(node.left) as Complex
                right = evalNode(node.right) as Complex
                if (right.re === 0 && right.im === 0) {
                    return reportError('Division by zero')
                }
                if (left.im === 0 && right.im === 0) {
                    return cpx(left.re / right.re)
                }
                const denom = right.re * right.re + right.im * right.im
                return { re: (left.re * right.re + left.im * right.im) / denom, im: (left.im * right.re - left.re * right.im) / denom }
            }

        case Token.POW:
            {
                if (node.left == null || node.right == null) {
                    return reportError('Missing arguments for Token POWER')
                }
                left = evalNode(node.left) as Complex
                right = evalNode(node.right) as Complex
                if (left.im === 0 && right.im === 0) {
                    return cpx(Math.pow(left.re, right.re))
                }
                if (right.im !== 0) {
                    return reportError('Imaginary power is not allowed')
                }
                // (a + bi)^n = r^n (cos(n*phi) + sin(n*phi)i)
                const r = Math.sqrt(left.re * left.re + left.im * left.im)
                const phi = Math.atan2(left.im, left.re)
                const rpow = Math.pow(r, right.re)
                const phipow = right.re * phi
                return { re: rpow * Math.cos(phipow), im: rpow * Math.sin(phipow) }
            }
            
        case Token.SQRT:
            if (node.right == null) {
                return reportError('Missing argument for Token SQUARE ROOT')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.sqrt(right.re))
            }
            return reportError('SQUARE ROOT is not defined for complex numbers')

        case Token.LOG:
            if (node.right == null) {
                return reportError('Missing argument for Token LOGARITHM')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.log(right.re))
            }
            return reportError('LOGARITHM is not defined for complex numbers')

        case Token.EXP:
            if (node.right == null) {
                return reportError('Missing argument for Token EXPOENTIAL')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.exp(right.re))
            }
            return { re: Math.exp(right.re) * Math.cos(right.im), im: Math.exp(right.re) * Math.sin(right.im) }

        case Token.SIN:
            if (node.right == null) {
                return reportError('Missing argument for Token SINE')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.sin(right.re))
            }
            return { re: Math.sin(right.re) * Math.cosh(right.im), im: Math.cos(right.re) * Math.sinh(right.im) }

        case Token.COS:
            if (node.right == null) {
                return reportError('Missing argument for Token COSINE')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.cos(right.re))
            }
            return { re: Math.cos(right.re) * Math.cosh(right.im), im: -Math.sin(right.re) * Math.sinh(right.im) }

        case Token.TAN:
            if (node.right == null) {
                return reportError('Missing argument for Token TANGENT')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.tan(right.re))
            }
            return { re: Math.sin(2 * right.re) / (Math.cos(2 * right.re) + Math.cosh(2 * right.im)), im: Math.sinh(2 * right.im) / (Math.cos(2 * right.re) + Math.cosh(2 * right.im)) }

        case Token.ASIN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC SINE')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.asin(right.re))
            }
            return { re: Math.log(right.re + Math.sqrt(1 - right.re * right.re)), im: Math.sign(right.im) * Math.sqrt(1 - right.re * right.re) }
        
        case Token.SINH:
            if (node.right == null) {
                return reportError('Missing argument for Token SINE HYPERBOLICUS')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.sinh(right.re))
            }
            return { re: Math.cosh(right.re) * Math.cos(right.im), im: Math.sinh(right.re) * Math.sin(right.im) }
        
        case Token.COSH:
            if (node.right == null) {
                return reportError('Missing argument for Token COSINE HYPERBOLICUS')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.cosh(right.re))
            }
            return { re: Math.cosh(right.re) * Math.cos(right.im), im: Math.sinh(right.re) * Math.sin(right.im) }

        case Token.TANH:
            if (node.right == null) {
                return reportError('Missing argument for Token TANGENT HYPERBOLICUS')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.tanh(right.re))
            }
            return { re: Math.cosh(2 * right.re) / (Math.cos(2 * right.re) + Math.cosh(2 * right.im)), im: Math.sinh(2 * right.im) / (Math.cos(2 * right.re) + Math.cosh(2 * right.im)) }

        case Token.ACOS:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC COSINE')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.acos(right.re))
            }
            return { re: Math.log(right.re + Math.sqrt(1 - right.re * right.re)), im: -Math.sign(right.im) * Math.sqrt(1 - right.re * right.re) }

        case Token.ATAN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC TANGENT')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.atan(right.re))
            }
            return { re: Math.atan(right.re / right.im), im: Math.log((1 + right.im) / (1 - right.im)) / 2 }

        case Token.FLOOR:
            if (node.right == null) {
                return reportError('Missing argument for Token FLOOR')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.floor(right.re))
            }
            return reportError('FLOOR is not defined for complex numbers')

        case Token.MIN:
            {
                if (node.right == null) {
                    return reportError('Missing argument for Token MIN')
                }
                if (!isIterable(evalNode(node.right))) {
                    return reportError('Malformed argument for Token MIN')
                }
                const vals = [...evalNode(node.right) as number[]]
                return cpx(Math.min(...vals))
            }

        case Token.MAX:
            {
                if (node.right == null) {
                    return reportError('Missing argument for Token MAX')
                }
                if (!isIterable(evalNode(node.right))) {
                    return reportError('Malformed argument for Token MAX')
                }
                const vals2 = [...evalNode(node.right) as number[]]
                return cpx(Math.max(...vals2))
            }

        case Token.DELIM:
            {
                if (node.left == null || node.right == null) {
                    return reportError('Missing arguments for Token DELIMITER')
                }
                left = evalNode(node.left) as any
                right = evalNode(node.right) as any
                const out: number[] = []
                if (typeof left?.re === 'number') {
                    out.push(left?.re)
                } else {
                    out.concat(left?.re)
                }
                if (typeof right?.re === 'number') {
                    out.push(right?.re)
                } else {
                    out.concat(right?.re)
                }
                // FIXME
                return out
            }

        case Token.ABS:
            if (node.right == null) {
                return reportError('Missing argument for Token ABSOLUTE')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.abs(right.re))
            }
            return cpx(Math.sqrt(right.re * right.re + right.im * right.im))

        case Token.RAND:
            if (node.right == null) {
                return reportError('Missing argument for Token RANDOM')
            }
            return cpx(Math.random() * (evalNode(node.right) as number))

        case Token.PERLIN: {
            if (node.right == null) {
                return reportError('Missing arguments for Token PERLIN')
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token PERLIN')
            }
            const [x, y] = evalNode(node.right) as number[]
            return cpx(perlin2(x, y))
        }

        case Token.MOD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MODULUS')
            }
            left = evalNode(node.left) as Complex
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(left.re % right.re)
            }
            return reportError('MODULUS is not defined for complex numbers')
        
        case Token.LEVEL_SET:
            return reportError('Token LEVEL SET is not allowed')
        
        case Token.VECTOR_FIELD:
            if (node.right == null) {
                return reportError('Missing argument for Token VECTOR FIELD')
            }
            return evalNode(node.right)
        
        case Token.LESS:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN')
            }
            left = evalNode(node.left) as Complex
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(left.re < right.re ? 1 : 0)
            }
            return reportError('LESS THAN is not defined for complex numbers')

        case Token.GREATER:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN')
            }
            left = evalNode(node.left) as Complex
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(left.re > right.re ? 1 : 0)
            }
            return reportError('GREATER THAN is not defined for complex numbers')

        case Token.LESS_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN OR EQUAL TO')
            }
            left = evalNode(node.left) as Complex
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(left.re <= right.re ? 1 : 0)
            }
            return reportError('LESS THAN OR EQUAL TO is not defined for complex numbers')

        case Token.GREATER_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN OR EQUAL TO')
            }
            left = evalNode(node.left) as Complex
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(left.re >= right.re ? 1 : 0)
            }
            return reportError('GREATER THAN OR EQUAL TO is not defined for complex numbers')

        case Token.EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token EQUAL TO')
            }
            left = evalNode(node.left) as Complex
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.abs(left.re - right.re) < 1e-10 ? 1 : 0)
            }
            return cpx(Math.abs(left.re - right.re) < 1e-10 && Math.abs(left.im - right.im) < 1e-10 ? 1 : 0)
        
        case Token.AND:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token AND')
            }
            left = evalNode(node.left) as Complex
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(left.re && right.re ? 1 : 0)
            }
            return reportError('AND is not defined for complex numbers')

        case Token.OR:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token OR')
            }
            left = evalNode(node.left) as Complex
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(left.re || right.re ? 1 : 0)
            }
            return reportError('OR is not defined for complex numbers')
        
        case Token.USERVAR:
            return cpx(getUserVariable(node.op.val as string))
        
        case Token.FACTORIAL:
            if (node.right == null) {
                return reportError('Missing argument for Token FACTORIAL')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(factorial(right.re))
            }
            return reportError('FACTORIAL is not defined for complex numbers')

        case Token.SIGMOID:
            if (node.right == null) {
                return reportError('Missing argument for Token SIGMOID')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(sigmoid(right.re))
            }
            return reportError('SIGMOID is not defined for complex numbers')

        case Token.CIRCLE:
            return reportError('Token CIRCLE is not allowed')

        case Token.POINT:
            return reportError('Token POINT is not allowed')

        case Token.TRUE:
            return cpx(1)

        case Token.FALSE:
            return cpx(0)

        case Token.POLAR:
            return reportError('Token POLAR is not allowed')
        
        case Token.CARTESIAN:
            return reportError('Token CARTESIAN is not allowed')
        
        case Token.MOUSEX:
            return cpx(getMousePos().x)
        
        case Token.MOUSEY:
            return cpx(getMousePos().y)

        case Token.MOUSE:
            return [getMousePos().x, getMousePos().y]
        
        case Token.IMAGINARY:
            return { re: 0, im: 1 }
        
        case Token.SERIES: {
            if (node.right == null || node.right.left == null || node.right.right == null || node.right.left.left == null || node.right.left.right == null) {
                return reportError('Missing argument for Token SERIES')
            }
            const start = (evalNode(node.right.left.left) as Complex).re
            const niter = (evalNode(node.right.left.right) as Complex).re
            const expr = node.right.right
            iterator = start
            for (; index <= niter; index++) {
                iterator = (evalNode(expr) as Complex).re
            }
            return cpx(iterator)
        }

        case Token.DIV_SERIES:
            return reportError('Token SERIES not implemented')
        
        case Token.ITERATOR:
            return cpx(iterator)
        
        case Token.INDEX:
            return cpx(index)
        
        case Token.COMPLEX:
            return reportError('Token COMPLEX is not allowed')
        
        case Token.GRADIENT:
            return reportError('Token GRADIENT is not allowed')
        
        case Token.MAGNITUDE:
            if (node.right == null) {
                return reportError('Missing argument for Token MAGNITUDE')
            }
            right = evalNode(node.right) as Complex
            if (right.im === 0) {
                return cpx(Math.abs(right.re))
            } if (node.right == null) {
                return reportError('Missing argument for Token SIGMOID')
            }
            return cpx(Math.sqrt(right.re * right.re + right.im * right.im))

        case Token.ASSIGN:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ASSIGN')
            }
            if (node.left.op.tok !== Token.ASSIGNABLE) {
                if (node.left.op.tok === Token.USERVAR) {
                    setUserVariable(node.left.op.val as string, (evalNode(node.right) as Complex).re)
                    return evalNode(node.right)
                }
                return reportError('Left side of ASSIGN must be assignable')
            }
            if (getExternVariable(node.left.op.val as string) == null) {
                return reportError(`Variable ${node.left.op.val} does not exist`)
            }
            right = evalNode(node.right) as any
            getExternVariable(node.left.op.val as string)?.set(right?.re ? right.re : right)
            return evalNode(node.right)
        
        case Token.ASSIGNABLE:
            {
                if (getExternVariable(node.op.val as string) == null) {
                    return reportError(`Variable ${node.op.val} does not exist`)
                }
                const extern = getExternVariable(node.op.val as string)?.get() as any
                return isIterable(extern) ? extern : cpx(extern)
            }
                        
        default:
            return reportError(`Unknown token ${node.op.tok}`)
    }
}
