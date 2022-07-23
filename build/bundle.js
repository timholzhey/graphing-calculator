/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/canvas/canvasCore.ts":
/*!**************************************!*\
  !*** ./src/app/canvas/canvasCore.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDomain = exports.canvasDrawFunction = exports.canvasDraw = exports.resetCanvas = exports.initCanvas = exports.mainCanvas = void 0;
const utils_1 = __webpack_require__(/*! ../utils */ "./src/app/utils.ts");
const index_1 = __webpack_require__(/*! ../../index */ "./src/index.ts");
const userInteract_1 = __webpack_require__(/*! ../ui/userInteract */ "./src/app/ui/userInteract.ts");
const constantEval_1 = __webpack_require__(/*! ../core/constantEval */ "./src/app/core/constantEval.ts");
const lexer_1 = __webpack_require__(/*! ../lang/lexer */ "./src/app/lang/lexer.ts");
exports.mainCanvas = document.getElementById('main-canvas');
const ctx = exports.mainCanvas.getContext('2d');
const zoomButtonIn = document.querySelector('.zoom-in-button');
const zoomButtonOut = document.querySelector('.zoom-out-button');
const offset = new utils_1.Vector(0, 0);
let scale = 1.0;
const subdivisions = 16;
const step = 0.01;
const dragFromOffset = new utils_1.Vector(0, 0);
const dragFromMouse = new utils_1.Vector(0, 0);
let isDragged = false;
let gridEnabled = true;
const zoomCanvas = function (norm) {
    scale *= norm > 0 ? 1 + 0.2 * norm : 1 / (1 - 0.2 * norm);
    (0, index_1.scheduleRedraw)();
};
const zoomSmooth = function (norm) {
    const targetScale = scale * (norm > 0 ? 1 + 0.2 * norm : 1 / (1 - 0.2 * norm));
    const animationResolution = 0.1;
    const step = (targetScale - scale) / (1 / animationResolution);
    let counter = 0;
    const interval = setInterval(function () {
        scale += step;
        (0, index_1.scheduleRedraw)();
        counter++;
        if (counter >= 1 / animationResolution) {
            clearInterval(interval);
        }
    }, 10);
};
const initCanvas = function () {
    exports.mainCanvas.addEventListener('mousedown', function (e) {
        dragFromOffset.set(offset.x, offset.y);
        dragFromMouse.set(e.clientX, e.clientY);
        isDragged = true;
    });
    (0, userInteract_1.onMouseDrag)(exports.mainCanvas, (mouse) => {
        if (!isDragged)
            return;
        offset.x = dragFromOffset.x + mouse.x - dragFromMouse.x;
        offset.y = dragFromOffset.y + mouse.y - dragFromMouse.y;
        (0, index_1.scheduleRedraw)();
    });
    exports.mainCanvas.addEventListener('mouseup', () => {
        isDragged = false;
    });
    exports.mainCanvas.addEventListener('mouseleave', () => {
        isDragged = false;
    });
    exports.mainCanvas.addEventListener('wheel', (e) => {
        zoomCanvas(-e.deltaY / 200);
    });
    zoomButtonIn.addEventListener('click', () => {
        zoomSmooth(1);
    });
    zoomButtonOut.addEventListener('click', () => {
        zoomSmooth(-1);
    });
    (0, lexer_1.bindExternVariable)('scale', () => scale, (s) => { scale = s; (0, index_1.scheduleRedraw)(); });
    (0, lexer_1.bindExternVariable)('grid', () => gridEnabled ? 1 : 0, (g) => { gridEnabled = g > 0; (0, index_1.scheduleRedraw)(); });
};
exports.initCanvas = initCanvas;
const resetCanvas = function () {
    scale = 1.0;
    offset.set(0, 0);
    (0, index_1.scheduleRedraw)();
};
exports.resetCanvas = resetCanvas;
const canvasDraw = function () {
    if (!ctx)
        return;
    exports.mainCanvas.width = exports.mainCanvas.clientWidth;
    exports.mainCanvas.height = exports.mainCanvas.clientHeight;
    ctx.clearRect(0, 0, exports.mainCanvas.width, exports.mainCanvas.height);
    drawGrid();
};
exports.canvasDraw = canvasDraw;
const drawLine = function (fromX, fromY, toX, toY) {
    if (!ctx)
        return;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
};
const drawGrid = function () {
    if (!ctx || !gridEnabled)
        return;
    const width = exports.mainCanvas.width;
    const height = exports.mainCanvas.height;
    const aspect = width / height;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    drawLine(width / 2 + offset.x, 0, width / 2 + offset.x, height);
    drawLine(0, height / 2 + offset.y, width, height / 2 + offset.y);
    const subdivMult = Math.pow(2, Math.floor(Math.log(scale) / Math.log(2)));
    const yStep = height / subdivisions / subdivMult * scale;
    let ySub = -Math.floor(subdivisions / scale / 2 * subdivMult) / subdivMult -
        Math.floor(offset.y / yStep) / subdivMult - (offset.y < 0 ? (1 / subdivMult) : 0) - (1 / subdivMult);
    const yError = (height % (2 * yStep) - 2 * yStep) / 2;
    const yRepeatOffset = offset.y % yStep;
    for (let y = 0; y < height + 2 * yStep; y += yStep, ySub += 1 / subdivMult) {
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 0.5;
        drawLine(0, y + yError + yRepeatOffset, width, y + yError + yRepeatOffset);
        ctx.strokeStyle = 'transparent';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'right';
        if (ySub === 0)
            continue;
        ctx.beginPath();
        ctx.fillText((-ySub).toString(), width / 2 + offset.x - 10, y + yError + yRepeatOffset + 4);
    }
    const xStep = width / subdivisions / subdivMult / aspect * scale;
    let xSub = -Math.floor(subdivisions / scale / 2 * subdivMult * aspect) / subdivMult -
        Math.floor(offset.x / xStep) / subdivMult - (offset.x < 0 ? (1 / subdivMult) : 0) - (1 / subdivMult);
    const xError = (width % (2 * xStep) - 2 * xStep) / 2;
    const xRepeatOffset = offset.x % xStep;
    for (let x = 0; x < width + xStep; x += xStep, xSub += 1 / subdivMult) {
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 0.5;
        drawLine(x + xError + xRepeatOffset, 0, x + xError + xRepeatOffset, height);
        ctx.strokeStyle = 'transparent';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        if (xSub === 0) {
            ctx.beginPath();
            ctx.fillText((-xSub).toString(), x + xError + xRepeatOffset - 18, height / 2 + offset.y + 20);
            continue;
        }
        ctx.beginPath();
        ctx.fillText(xSub.toString(), x + xError + xRepeatOffset, height / 2 + offset.y + 20);
    }
};
const canvasDrawFunction = function (ast, color) {
    if (!ctx || !ast)
        return;
    const width = exports.mainCanvas.width;
    const height = exports.mainCanvas.height;
    const aspect = width / height;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'transparent';
    ctx.beginPath();
    const xStep = width / subdivisions / aspect * scale;
    const xOffset = offset.x / xStep;
    let moveTo = true;
    for (let x = -subdivisions / 2 * aspect / scale - xOffset; x < subdivisions / 2 * aspect / scale - xOffset; x += step / scale) {
        const c = (0, constantEval_1.constantEvalX)(ast, x);
        const f = typeof c === 'number' ? c : c.re;
        const error = (0, constantEval_1.constantEvalGetError)();
        if (error) {
            return;
        }
        const mappedX = (0, utils_1.map)(x, -subdivisions / 2 * aspect / scale, subdivisions / 2 * aspect / scale, 0, width) + offset.x;
        const mappedY = (0, utils_1.map)(f, -subdivisions / 2 / scale, subdivisions / 2 / scale, height, 0) + offset.y;
        if (moveTo) {
            ctx.moveTo(mappedX, mappedY);
            moveTo = false;
        }
        ctx.lineTo(mappedX, mappedY);
    }
    ctx.stroke();
};
exports.canvasDrawFunction = canvasDrawFunction;
const getDomain = function () {
    const width = exports.mainCanvas.width;
    const height = exports.mainCanvas.height;
    const aspect = width / height;
    const xStep = width / subdivisions / aspect * scale;
    const xOffset = offset.x / xStep;
    const minX = -subdivisions / 2 * aspect / scale - xOffset;
    const maxX = subdivisions / 2 * aspect / scale - xOffset;
    const yStep = height / subdivisions * scale;
    const yOffset = offset.y / yStep;
    const minY = -subdivisions / 2 / scale + yOffset;
    const maxY = subdivisions / 2 / scale + yOffset;
    return { minX, maxX, minY, maxY };
};
exports.getDomain = getDomain;


/***/ }),

/***/ "./src/app/core/constantEval.ts":
/*!**************************************!*\
  !*** ./src/app/core/constantEval.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.constantEvalGetError = exports.constantEvalX = exports.constantEval = void 0;
const index_1 = __webpack_require__(/*! ../../index */ "./src/index.ts");
const lexer_1 = __webpack_require__(/*! ../lang/lexer */ "./src/app/lang/lexer.ts");
const userInteract_1 = __webpack_require__(/*! ../ui/userInteract */ "./src/app/ui/userInteract.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/app/utils.ts");
let latestError = null;
let x;
const constantEval = function (ast) {
    if (!ast)
        return 0;
    latestError = null;
    const result = evalNode(ast);
    return result;
};
exports.constantEval = constantEval;
const constantEvalX = function (ast, _x) {
    x = _x;
    const result = (0, exports.constantEval)(ast);
    x = null;
    return result;
};
exports.constantEvalX = constantEvalX;
const reportError = function (error) {
    console.error('Error during constant evaluation: ' + error);
    latestError = error;
    return 0;
};
const constantEvalGetError = () => latestError;
exports.constantEvalGetError = constantEvalGetError;
const isIterable = (obj) => obj != null && typeof obj[Symbol.iterator] === 'function';
const evalNode = function (node) {
    var _a;
    let left, right;
    switch (node.op.tok) {
        case lexer_1.Token.UNDEF:
            return reportError('Token UNDEFINED is not allowed');
        case lexer_1.Token.NONE:
            return 0;
        case lexer_1.Token.PAREN_OP:
            return reportError('Token OPEN PARENTHESIS is not allowed');
        case lexer_1.Token.PAREN_CL:
            return reportError('Token CLOSE PARENTHESIS is not allowed');
        case lexer_1.Token.BRACKET_OP:
            return reportError('Token OPEN BRACKET is not allowed');
        case lexer_1.Token.BRACKET_CL:
            return reportError('Token CLOSE BRACKET is not allowed');
        case lexer_1.Token.BRACE_OP:
            return reportError('Token OPEN BRACE is not allowed');
        case lexer_1.Token.BRACE_CL:
            return reportError('Token CLOSE BRACE is not allowed');
        case lexer_1.Token.NUM:
            if (typeof node.op.val !== 'number') {
                return reportError('Token NUMBER must be a number');
            }
            return (0, utils_1.cpx)(node.op.val);
        case lexer_1.Token.CONST:
            if (typeof node.op.val !== 'number') {
                return reportError('Token CONSTANT must be a number');
            }
            return (0, utils_1.cpx)(node.op.val);
        case lexer_1.Token.VAR:
            if (x == null) {
                return reportError('Token VARIABLE is not defined');
            }
            return (0, utils_1.cpx)(x);
        case lexer_1.Token.VAR2:
            return reportError('Token VARIABLE2 is not allowed');
        case lexer_1.Token.TIME:
            (0, index_1.scheduleRedraw)();
            return (0, utils_1.cpx)((0, index_1.getGlobalTime)());
        case lexer_1.Token.ADD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ADDITION');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            return { re: left.re + right.re, im: left.im + right.im };
        case lexer_1.Token.SUB:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token SUBTRACTION');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            return { re: left.re - right.re, im: left.im - right.im };
        case lexer_1.Token.MULT:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MULTIPLICATION');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (left.im === 0 && right.im === 0) {
                return (0, utils_1.cpx)(left.re * right.re);
            }
            return { re: left.re * right.re - left.im * right.im, im: left.re * right.im + left.im * right.re };
        case lexer_1.Token.DIV:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token DIVISION');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (right.re === 0 && right.im === 0) {
                return reportError('Division by zero');
            }
            if (left.im === 0 && right.im === 0) {
                return (0, utils_1.cpx)(left.re / right.re);
            }
            const denom = right.re * right.re + right.im * right.im;
            return { re: (left.re * right.re + left.im * right.im) / denom, im: (left.im * right.re - left.re * right.im) / denom };
        case lexer_1.Token.POW:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token POWER');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (left.im === 0 && right.im === 0) {
                return (0, utils_1.cpx)(Math.pow(left.re, right.re));
            }
            if (right.im !== 0) {
                return reportError('Imaginary power is not allowed');
            }
            {
                const r = Math.sqrt(left.re * left.re + left.im * left.im);
                const phi = Math.atan2(left.im, left.re);
                const rpow = Math.pow(r, right.re);
                const phipow = right.re * phi;
                return { re: rpow * Math.cos(phipow), im: rpow * Math.sin(phipow) };
            }
        case lexer_1.Token.SQRT:
            if (node.right == null) {
                return reportError('Missing argument for Token SQUARE ROOT');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.sqrt(right.re));
            }
            return reportError('SQUARE ROOT is not defined for complex numbers');
        case lexer_1.Token.LOG:
            if (node.right == null) {
                return reportError('Missing argument for Token LOGARITHM');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.log(right.re));
            }
            return reportError('LOGARITHM is not defined for complex numbers');
        case lexer_1.Token.EXP:
            if (node.right == null) {
                return reportError('Missing argument for Token EXPOENTIAL');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.exp(right.re));
            }
            return { re: Math.exp(right.re) * Math.cos(right.im), im: Math.exp(right.re) * Math.sin(right.im) };
        case lexer_1.Token.SIN:
            if (node.right == null) {
                return reportError('Missing argument for Token SINE');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.sin(right.re));
            }
            return { re: Math.sin(right.re) * Math.cosh(right.im), im: Math.cos(right.re) * Math.sinh(right.im) };
        case lexer_1.Token.COS:
            if (node.right == null) {
                return reportError('Missing argument for Token COSINE');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.cos(right.re));
            }
            return { re: Math.cos(right.re) * Math.cosh(right.im), im: -Math.sin(right.re) * Math.sinh(right.im) };
        case lexer_1.Token.TAN:
            if (node.right == null) {
                return reportError('Missing argument for Token TANGENT');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.tan(right.re));
            }
            return { re: Math.sin(2 * right.re) / (Math.cos(2 * right.re) + Math.cosh(2 * right.im)), im: Math.sinh(2 * right.im) / (Math.cos(2 * right.re) + Math.cosh(2 * right.im)) };
        case lexer_1.Token.ASIN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC SINE');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.asin(right.re));
            }
            return { re: Math.log(right.re + Math.sqrt(1 - right.re * right.re)), im: Math.sign(right.im) * Math.sqrt(1 - right.re * right.re) };
        case lexer_1.Token.SINH:
            if (node.right == null) {
                return reportError('Missing argument for Token SINE HYPERBOLICUS');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.sinh(right.re));
            }
            return { re: Math.cosh(right.re) * Math.cos(right.im), im: Math.sinh(right.re) * Math.sin(right.im) };
        case lexer_1.Token.COSH:
            if (node.right == null) {
                return reportError('Missing argument for Token COSINE HYPERBOLICUS');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.cosh(right.re));
            }
            return { re: Math.cosh(right.re) * Math.cos(right.im), im: Math.sinh(right.re) * Math.sin(right.im) };
        case lexer_1.Token.TANH:
            if (node.right == null) {
                return reportError('Missing argument for Token TANGENT HYPERBOLICUS');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.tanh(right.re));
            }
            return { re: Math.cosh(2 * right.re) / (Math.cos(2 * right.re) + Math.cosh(2 * right.im)), im: Math.sinh(2 * right.im) / (Math.cos(2 * right.re) + Math.cosh(2 * right.im)) };
        case lexer_1.Token.ACOS:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC COSINE');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.acos(right.re));
            }
            return { re: Math.log(right.re + Math.sqrt(1 - right.re * right.re)), im: -Math.sign(right.im) * Math.sqrt(1 - right.re * right.re) };
        case lexer_1.Token.ATAN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC TANGENT');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.atan(right.re));
            }
            return { re: Math.atan(right.re / right.im), im: Math.log((1 + right.im) / (1 - right.im)) / 2 };
        case lexer_1.Token.FLOOR:
            if (node.right == null) {
                return reportError('Missing argument for Token FLOOR');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.floor(right.re));
            }
            return reportError('FLOOR is not defined for complex numbers');
        case lexer_1.Token.MIN:
            if (node.right == null) {
                return reportError('Missing argument for Token MIN');
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token MIN');
            }
            const vals = [...evalNode(node.right)];
            return (0, utils_1.cpx)(Math.min(...vals));
        case lexer_1.Token.MAX:
            if (node.right == null) {
                return reportError('Missing argument for Token MAX');
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token MAX');
            }
            const vals2 = [...evalNode(node.right)];
            return (0, utils_1.cpx)(Math.max(...vals2));
        case lexer_1.Token.DELIM:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token DELIMITER');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            {
                let out = [];
                if (typeof (left === null || left === void 0 ? void 0 : left.re) == 'number') {
                    out.push(left === null || left === void 0 ? void 0 : left.re);
                }
                else {
                    out.concat(left === null || left === void 0 ? void 0 : left.re);
                }
                if (typeof (right === null || right === void 0 ? void 0 : right.re) == 'number') {
                    out.push(right === null || right === void 0 ? void 0 : right.re);
                }
                else {
                    out.concat(right === null || right === void 0 ? void 0 : right.re);
                }
                return out;
            }
        case lexer_1.Token.ABS:
            if (node.right == null) {
                return reportError('Missing argument for Token ABSOLUTE');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.abs(right.re));
            }
            return (0, utils_1.cpx)(Math.sqrt(right.re * right.re + right.im * right.im));
        case lexer_1.Token.RAND:
            if (node.right == null) {
                return reportError('Missing argument for Token RANDOM');
            }
            return (0, utils_1.cpx)(Math.random() * evalNode(node.right));
        case lexer_1.Token.PERLIN: {
            if (node.right == null) {
                return reportError('Missing arguments for Token PERLIN');
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token PERLIN');
            }
            const [x, y] = evalNode(node.right);
            return (0, utils_1.cpx)((0, utils_1.perlin2)(x, y));
        }
        case lexer_1.Token.MOD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MODULUS');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(left.re % right.re);
            }
            return reportError('MODULUS is not defined for complex numbers');
        case lexer_1.Token.LEVEL_SET:
            return reportError('Token LEVEL SET is not allowed');
        case lexer_1.Token.VECTOR_FIELD:
            return reportError('Token VECTOR FIELD is not allowed');
        case lexer_1.Token.LESS:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(left.re < right.re ? 1 : 0);
            }
            return reportError('LESS THAN is not defined for complex numbers');
        case lexer_1.Token.GREATER:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(left.re > right.re ? 1 : 0);
            }
            return reportError('GREATER THAN is not defined for complex numbers');
        case lexer_1.Token.LESS_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN OR EQUAL TO');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(left.re <= right.re ? 1 : 0);
            }
            return reportError('LESS THAN OR EQUAL TO is not defined for complex numbers');
        case lexer_1.Token.GREATER_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN OR EQUAL TO');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(left.re >= right.re ? 1 : 0);
            }
            return reportError('GREATER THAN OR EQUAL TO is not defined for complex numbers');
        case lexer_1.Token.EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token EQUAL TO');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.abs(left.re - right.re) < 1e-10 ? 1 : 0);
            }
            return (0, utils_1.cpx)(Math.abs(left.re - right.re) < 1e-10 && Math.abs(left.im - right.im) < 1e-10 ? 1 : 0);
        case lexer_1.Token.AND:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token AND');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(left.re && right.re ? 1 : 0);
            }
            return reportError('AND is not defined for complex numbers');
        case lexer_1.Token.OR:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token OR');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(left.re || right.re ? 1 : 0);
            }
            return reportError('OR is not defined for complex numbers');
        case lexer_1.Token.USERVAR:
            return (0, utils_1.cpx)((0, lexer_1.getUserVariable)(node.op.val));
        case lexer_1.Token.FACTORIAL:
            if (node.right == null) {
                return reportError('Missing argument for Token FACTORIAL');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)((0, utils_1.factorial)(right.re));
            }
            return reportError('FACTORIAL is not defined for complex numbers');
        case lexer_1.Token.SIGMOID:
            if (node.right == null) {
                return reportError('Missing argument for Token SIGMOID');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)((0, utils_1.sigmoid)(right.re));
            }
            return reportError('SIGMOID is not defined for complex numbers');
        case lexer_1.Token.CIRCLE:
            return reportError('Token CIRCLE is not allowed');
        case lexer_1.Token.POINT:
            return reportError('Token POINT is not allowed');
        case lexer_1.Token.TRUE:
            return (0, utils_1.cpx)(1);
        case lexer_1.Token.FALSE:
            return (0, utils_1.cpx)(0);
        case lexer_1.Token.POLAR:
            return reportError('Token POLAR is not allowed');
        case lexer_1.Token.CARTESIAN:
            return reportError('Token CARTESIAN is not allowed');
        case lexer_1.Token.MOUSEX:
            return (0, utils_1.cpx)((0, userInteract_1.getMousePos)().x);
        case lexer_1.Token.MOUSEY:
            return (0, utils_1.cpx)((0, userInteract_1.getMousePos)().y);
        case lexer_1.Token.MOUSE:
            return [(0, userInteract_1.getMousePos)().x, (0, userInteract_1.getMousePos)().y];
        case lexer_1.Token.IMAGINARY:
            return { re: 0, im: 1 };
        case lexer_1.Token.SERIES:
            return reportError('Token SERIES not implemented');
        case lexer_1.Token.ITERATOR:
            return reportError('Token ITERATOR not implemented');
        case lexer_1.Token.COMPLEX:
            return reportError('Token COMPLEX is not allowed');
        case lexer_1.Token.GRADIENT:
            return reportError('Token GRADIENT is not allowed');
        case lexer_1.Token.MAGNITUDE:
            if (node.right == null) {
                return reportError('Missing argument for Token MAGNITUDE');
            }
            right = evalNode(node.right);
            if (right.im === 0) {
                return (0, utils_1.cpx)(Math.abs(right.re));
            }
            return (0, utils_1.cpx)(Math.sqrt(right.re * right.re + right.im * right.im));
        case lexer_1.Token.ASSIGN:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ASSIGN');
            }
            if (node.left.op.tok !== lexer_1.Token.ASSIGNABLE) {
                if (node.left.op.tok === lexer_1.Token.USERVAR) {
                    (0, lexer_1.setUserVariable)(node.left.op.val, evalNode(node.right).re);
                    return evalNode(node.right);
                }
                return reportError('Left side of ASSIGN must be assignable');
            }
            if ((0, lexer_1.getExternVariable)(node.left.op.val) == null) {
                return reportError(`Variable ${node.left.op.val} does not exist`);
            }
            (_a = (0, lexer_1.getExternVariable)(node.left.op.val)) === null || _a === void 0 ? void 0 : _a.set(evalNode(node.right).re);
            return evalNode(node.right);
        default:
            return reportError(`Unknown token ${node.op.val}`);
    }
};


/***/ }),

/***/ "./src/app/core/controller.ts":
/*!************************************!*\
  !*** ./src/app/core/controller.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPlotsShaderInfo = exports.drawPlots = exports.drivePlots = exports.loadPlots = exports.resetPlots = exports.setNumInputs = exports.setInputAt = void 0;
const index_1 = __webpack_require__(/*! ../../index */ "./src/index.ts");
const canvasCore_1 = __webpack_require__(/*! ../canvas/canvasCore */ "./src/app/canvas/canvasCore.ts");
const defines_1 = __webpack_require__(/*! ../defines */ "./src/app/defines.ts");
const parser_1 = __webpack_require__(/*! ../lang/parser */ "./src/app/lang/parser.ts");
const shaderFunctionBuilder_1 = __webpack_require__(/*! ../shader/shaderFunctionBuilder */ "./src/app/shader/shaderFunctionBuilder.ts");
const leftPanel_1 = __webpack_require__(/*! ../ui/leftPanel */ "./src/app/ui/leftPanel.ts");
const constantEval_1 = __webpack_require__(/*! ./constantEval */ "./src/app/core/constantEval.ts");
const plots = [];
let numInputs = 0;
const setInputAt = (index, value) => {
    if (index < 0 || index > numInputs) {
        return;
    }
    if (!plots[index]) {
        plots[index] = initPlot(index);
        (0, leftPanel_1.inputSetColorAt)(index, plots[index].color);
    }
    plots[index].input = value;
    plots[index].inputChanged = true;
    (0, index_1.scheduleRedraw)();
};
exports.setInputAt = setInputAt;
const setNumInputs = (num) => {
    numInputs = num;
    for (let i = numInputs; i < plots.length; i++) {
        delete plots[i];
    }
    (0, index_1.scheduleRedraw)();
};
exports.setNumInputs = setNumInputs;
const resetPlots = () => {
    plots.length = 0;
    (0, index_1.scheduleRedraw)();
};
exports.resetPlots = resetPlots;
const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
const getColorFromIndex = (index) => colors[(index - 1) % colors.length];
const loadPlots = function (plots, defaults) {
    (0, canvasCore_1.resetCanvas)();
    (0, leftPanel_1.resetInputs)();
    console.log(defaults);
    (0, exports.setNumInputs)(defaults.length);
    for (let i = 0; i < defaults.length; i++) {
        (0, leftPanel_1.addNewInputWithValue)(defaults[i]);
    }
    (0, exports.drivePlots)();
    (0, exports.drawPlots)();
    (0, leftPanel_1.resetInputs)();
    (0, exports.setNumInputs)(plots.length);
    for (let i = 0; i < plots.length; i++) {
        (0, leftPanel_1.addNewInputWithValue)(plots[i]);
    }
};
exports.loadPlots = loadPlots;
const initPlot = function (idx) {
    return {
        input: '',
        inputChanged: false,
        ast: null,
        status: defines_1.PlotStatus.PENDING,
        driver: defines_1.PlotDriver.CANVAS,
        displayMode: defines_1.PlotDisplayMode.NONE,
        shaderFunction: '',
        continuous: false,
        color: getColorFromIndex(idx),
        error: '',
        iterExpr: '',
    };
};
const drivePlots = () => {
    for (let i = 1; i <= numInputs; i++) {
        if (!plots[i]) {
            plots[i] = initPlot(i);
            (0, leftPanel_1.inputSetColorAt)(i, plots[i].color);
        }
        const plot = plots[i];
        if (plot.inputChanged) {
            plot.inputChanged = false;
            const statusBefore = plot.status;
            if (plot.input.trim().length === 0) {
                plot.status = defines_1.PlotStatus.PENDING;
                plot.ast = null;
                if (statusBefore !== plot.status) {
                    (0, leftPanel_1.inputSetStatusAt)(i, plot.status);
                }
                (0, index_1.scheduleRedraw)();
                continue;
            }
            const astBefore = plot.ast;
            plot.ast = (0, parser_1.parse)(plot.input);
            console.debug('Parsed AST:', plot.ast);
            const errorBefore = plot.error;
            const parserError = (0, parser_1.parserGetError)();
            if (parserError) {
                plot.status = defines_1.PlotStatus.ERROR;
                plot.error = parserError.desc;
            }
            else {
                plot.status = defines_1.PlotStatus.ACTIVE;
                plot.error = '';
            }
            if (JSON.stringify(astBefore) !== JSON.stringify(plot.ast)) {
                (0, index_1.scheduleRedraw)();
            }
            const driver = (0, parser_1.parserGetDriver)();
            if (plot.driver !== driver) {
                plot.driver = driver;
                (0, leftPanel_1.inputSetDriverAt)(i, driver);
            }
            plot.displayMode = (0, parser_1.parserGetDisplayMode)();
            if (plot.driver === defines_1.PlotDriver.WEBGL) {
                plot.shaderFunction = (0, shaderFunctionBuilder_1.buildShaderFunction)(plot.ast) || 'undefined';
                plot.iterExpr = (0, shaderFunctionBuilder_1.shaderFunctionBuilderGetIterExpression)();
                const shaderFunctionError = (0, shaderFunctionBuilder_1.shaderFunctionBuilderGetError)();
                if (shaderFunctionError) {
                    plot.status = defines_1.PlotStatus.ERROR;
                    plot.error = shaderFunctionError;
                }
            }
            plot.continuous = (0, parser_1.parserGetContinuous)();
            if (plot.status !== statusBefore) {
                (0, leftPanel_1.inputSetStatusAt)(i, plot.status);
            }
            if (plot.error !== errorBefore) {
                (0, leftPanel_1.inputSetErrorAt)(i, plot.error);
            }
        }
    }
};
exports.drivePlots = drivePlots;
const drawPlots = () => {
    for (let i = 1; i <= numInputs; i++) {
        const plot = plots[i];
        if (!plot)
            continue;
        if (plot.status !== defines_1.PlotStatus.ACTIVE)
            continue;
        switch (plot.driver) {
            case defines_1.PlotDriver.CONSTANT: {
                const result = (0, constantEval_1.constantEval)(plot.ast);
                (0, leftPanel_1.inputSetConstEvalAt)(i, result);
                const constEvalError = (0, constantEval_1.constantEvalGetError)();
                if (constEvalError) {
                    plot.status = defines_1.PlotStatus.ERROR;
                    plot.error = constEvalError;
                    (0, leftPanel_1.inputSetStatusAt)(i, plot.status);
                    (0, leftPanel_1.inputSetErrorAt)(i, plot.error);
                }
                break;
            }
            case defines_1.PlotDriver.CANVAS: {
                (0, canvasCore_1.canvasDrawFunction)(plot.ast, plot.color);
                const constEvalError = (0, constantEval_1.constantEvalGetError)();
                if (constEvalError) {
                    plot.status = defines_1.PlotStatus.ERROR;
                    plot.error = constEvalError;
                    (0, leftPanel_1.inputSetStatusAt)(i, plot.status);
                    (0, leftPanel_1.inputSetErrorAt)(i, plot.error);
                }
                break;
            }
            case defines_1.PlotDriver.WEBGL:
                break;
        }
        if (plot.continuous) {
            (0, index_1.scheduleRedraw)();
        }
    }
};
exports.drawPlots = drawPlots;
const getPlotsShaderInfo = () => {
    const shaderFunctions = [];
    const colors = [];
    const displayModes = [];
    const iterExpr = [];
    let numPlots = 0;
    for (let i = 1; i <= numInputs; i++) {
        const plot = plots[i];
        if (!plot || plot.driver !== defines_1.PlotDriver.WEBGL || plot.status !== defines_1.PlotStatus.ACTIVE)
            continue;
        if (plot.driver !== defines_1.PlotDriver.WEBGL)
            continue;
        shaderFunctions.push(plot.shaderFunction);
        colors.push(plot.color);
        displayModes.push(plot.displayMode);
        iterExpr.push(plot.iterExpr);
        numPlots++;
    }
    return { functions: shaderFunctions, colors, displayModes, numPlots, iterExpr };
};
exports.getPlotsShaderInfo = getPlotsShaderInfo;


/***/ }),

/***/ "./src/app/defines.ts":
/*!****************************!*\
  !*** ./src/app/defines.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlotDriver = exports.PlotStatus = exports.PlotDisplayMode = void 0;
var PlotDisplayMode;
(function (PlotDisplayMode) {
    PlotDisplayMode[PlotDisplayMode["NONE"] = 0] = "NONE";
    PlotDisplayMode[PlotDisplayMode["CONSTANT_EVAL"] = 1] = "CONSTANT_EVAL";
    PlotDisplayMode[PlotDisplayMode["FUNCTION_GRAPH"] = 2] = "FUNCTION_GRAPH";
    PlotDisplayMode[PlotDisplayMode["SET"] = 3] = "SET";
    PlotDisplayMode[PlotDisplayMode["LEVEL_SET"] = 4] = "LEVEL_SET";
    PlotDisplayMode[PlotDisplayMode["VECTOR_FIELD"] = 5] = "VECTOR_FIELD";
    PlotDisplayMode[PlotDisplayMode["GRADIENT"] = 6] = "GRADIENT";
})(PlotDisplayMode = exports.PlotDisplayMode || (exports.PlotDisplayMode = {}));
var PlotStatus;
(function (PlotStatus) {
    PlotStatus[PlotStatus["PENDING"] = 0] = "PENDING";
    PlotStatus[PlotStatus["ACTIVE"] = 1] = "ACTIVE";
    PlotStatus[PlotStatus["ERROR"] = 2] = "ERROR";
})(PlotStatus = exports.PlotStatus || (exports.PlotStatus = {}));
var PlotDriver;
(function (PlotDriver) {
    PlotDriver[PlotDriver["CONSTANT"] = 0] = "CONSTANT";
    PlotDriver[PlotDriver["CANVAS"] = 1] = "CANVAS";
    PlotDriver[PlotDriver["WEBGL"] = 2] = "WEBGL";
})(PlotDriver = exports.PlotDriver || (exports.PlotDriver = {}));


/***/ }),

/***/ "./src/app/lang/lexer.ts":
/*!*******************************!*\
  !*** ./src/app/lang/lexer.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lex = exports.clearUserVariables = exports.getUserVariable = exports.setUserVariable = exports.getExternVariable = exports.unbindExternVariable = exports.bindExternVariable = exports.lexerGetError = exports.TokenFlag = exports.Token = void 0;
var Token;
(function (Token) {
    Token[Token["UNDEF"] = 0] = "UNDEF";
    Token[Token["NONE"] = 1] = "NONE";
    Token[Token["VAR"] = 2] = "VAR";
    Token[Token["VAR2"] = 3] = "VAR2";
    Token[Token["NUM"] = 4] = "NUM";
    Token[Token["CONST"] = 5] = "CONST";
    Token[Token["PAREN_OP"] = 6] = "PAREN_OP";
    Token[Token["PAREN_CL"] = 7] = "PAREN_CL";
    Token[Token["BRACKET_OP"] = 8] = "BRACKET_OP";
    Token[Token["BRACKET_CL"] = 9] = "BRACKET_CL";
    Token[Token["BRACE_OP"] = 10] = "BRACE_OP";
    Token[Token["BRACE_CL"] = 11] = "BRACE_CL";
    Token[Token["DELIM"] = 12] = "DELIM";
    Token[Token["ASSIGN"] = 13] = "ASSIGN";
    Token[Token["ASSIGNABLE"] = 14] = "ASSIGNABLE";
    Token[Token["LESS"] = 15] = "LESS";
    Token[Token["GREATER"] = 16] = "GREATER";
    Token[Token["LESS_OR_EQUAL"] = 17] = "LESS_OR_EQUAL";
    Token[Token["GREATER_OR_EQUAL"] = 18] = "GREATER_OR_EQUAL";
    Token[Token["USERVAR"] = 19] = "USERVAR";
    Token[Token["ADD"] = 20] = "ADD";
    Token[Token["SUB"] = 21] = "SUB";
    Token[Token["MULT"] = 22] = "MULT";
    Token[Token["DIV"] = 23] = "DIV";
    Token[Token["POW"] = 24] = "POW";
    Token[Token["AND"] = 25] = "AND";
    Token[Token["OR"] = 26] = "OR";
    Token[Token["NOT_EQUAL"] = 27] = "NOT_EQUAL";
    Token[Token["EQUAL"] = 28] = "EQUAL";
    Token[Token["TRUE"] = 29] = "TRUE";
    Token[Token["FALSE"] = 30] = "FALSE";
    Token[Token["SQRT"] = 31] = "SQRT";
    Token[Token["EXP"] = 32] = "EXP";
    Token[Token["LOG"] = 33] = "LOG";
    Token[Token["SIN"] = 34] = "SIN";
    Token[Token["COS"] = 35] = "COS";
    Token[Token["TAN"] = 36] = "TAN";
    Token[Token["ASIN"] = 37] = "ASIN";
    Token[Token["ACOS"] = 38] = "ACOS";
    Token[Token["ATAN"] = 39] = "ATAN";
    Token[Token["SINH"] = 40] = "SINH";
    Token[Token["COSH"] = 41] = "COSH";
    Token[Token["TANH"] = 42] = "TANH";
    Token[Token["FLOOR"] = 43] = "FLOOR";
    Token[Token["MIN"] = 44] = "MIN";
    Token[Token["MAX"] = 45] = "MAX";
    Token[Token["ABS"] = 46] = "ABS";
    Token[Token["MOD"] = 47] = "MOD";
    Token[Token["RAND"] = 48] = "RAND";
    Token[Token["PERLIN"] = 49] = "PERLIN";
    Token[Token["FACTORIAL"] = 50] = "FACTORIAL";
    Token[Token["SIGMOID"] = 51] = "SIGMOID";
    Token[Token["LEVEL_SET"] = 52] = "LEVEL_SET";
    Token[Token["VECTOR_FIELD"] = 53] = "VECTOR_FIELD";
    Token[Token["CIRCLE"] = 54] = "CIRCLE";
    Token[Token["POINT"] = 55] = "POINT";
    Token[Token["TIME"] = 56] = "TIME";
    Token[Token["MAGNITUDE"] = 57] = "MAGNITUDE";
    Token[Token["IMAGINARY"] = 58] = "IMAGINARY";
    Token[Token["POLAR"] = 59] = "POLAR";
    Token[Token["CARTESIAN"] = 60] = "CARTESIAN";
    Token[Token["MOUSEX"] = 61] = "MOUSEX";
    Token[Token["MOUSEY"] = 62] = "MOUSEY";
    Token[Token["MOUSE"] = 63] = "MOUSE";
    Token[Token["SERIES"] = 64] = "SERIES";
    Token[Token["ITERATOR"] = 65] = "ITERATOR";
    Token[Token["COMPLEX"] = 66] = "COMPLEX";
    Token[Token["GRADIENT"] = 67] = "GRADIENT";
})(Token = exports.Token || (exports.Token = {}));
var TokenFlag;
(function (TokenFlag) {
    TokenFlag[TokenFlag["IMPL_MULT_BEFORE"] = 1] = "IMPL_MULT_BEFORE";
    TokenFlag[TokenFlag["IMPL_MULT_AFTER"] = 2] = "IMPL_MULT_AFTER";
    TokenFlag[TokenFlag["PREFIX"] = 4] = "PREFIX";
    TokenFlag[TokenFlag["UNIQUE"] = 16] = "UNIQUE";
    TokenFlag[TokenFlag["BEGIN_SCOPE"] = 32] = "BEGIN_SCOPE";
    TokenFlag[TokenFlag["END_SCOPE"] = 64] = "END_SCOPE";
    TokenFlag[TokenFlag["WEBGL_ONLY"] = 128] = "WEBGL_ONLY";
})(TokenFlag = exports.TokenFlag || (exports.TokenFlag = {}));
const StringTokenMap = {
    '(': { tok: Token.PAREN_OP, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.UNIQUE | TokenFlag.BEGIN_SCOPE },
    ')': { tok: Token.PAREN_CL, flags: TokenFlag.IMPL_MULT_AFTER | TokenFlag.UNIQUE | TokenFlag.END_SCOPE },
    '[': { tok: Token.BRACKET_OP, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.UNIQUE | TokenFlag.BEGIN_SCOPE },
    ']': { tok: Token.BRACKET_CL, flags: TokenFlag.IMPL_MULT_AFTER | TokenFlag.UNIQUE | TokenFlag.END_SCOPE },
    '{': { tok: Token.BRACE_OP, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.UNIQUE | TokenFlag.BEGIN_SCOPE },
    '}': { tok: Token.BRACE_CL, flags: TokenFlag.IMPL_MULT_AFTER | TokenFlag.UNIQUE | TokenFlag.END_SCOPE },
    ',': { tok: Token.DELIM, flags: TokenFlag.UNIQUE },
    '=': { tok: Token.ASSIGN, flags: 0 },
    x: { tok: Token.VAR, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
    y: { tok: Token.VAR2, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER | TokenFlag.WEBGL_ONLY },
    '<': { tok: Token.LESS, flags: 0 },
    '>': { tok: Token.GREATER, flags: 0 },
    '<=': { tok: Token.LESS_OR_EQUAL, flags: TokenFlag.UNIQUE },
    '>=': { tok: Token.GREATER_OR_EQUAL, flags: TokenFlag.UNIQUE },
    '!=': { tok: Token.NOT_EQUAL, flags: TokenFlag.UNIQUE },
    '==': { tok: Token.EQUAL, flags: TokenFlag.UNIQUE },
    '&&': { tok: Token.AND, flags: TokenFlag.UNIQUE },
    '||': { tok: Token.OR, flags: TokenFlag.UNIQUE },
    '+': { tok: Token.ADD, flags: TokenFlag.UNIQUE },
    '-': { tok: Token.SUB, flags: TokenFlag.UNIQUE },
    '*': { tok: Token.MULT, flags: 0 },
    '/': { tok: Token.DIV, flags: TokenFlag.UNIQUE },
    '^': { tok: Token.POW, flags: TokenFlag.UNIQUE },
    '**': { tok: Token.POW, flags: TokenFlag.UNIQUE },
    '%': { tok: Token.MOD, flags: 0 },
    mod: { tok: Token.MOD, flags: 0 },
    true: { tok: Token.TRUE, flags: 0 },
    false: { tok: Token.FALSE, flags: 0 },
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
    sinh: { tok: Token.SINH, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
    cosh: { tok: Token.COSH, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
    tanh: { tok: Token.TANH, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
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
    Level: { tok: Token.LEVEL_SET, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX | TokenFlag.WEBGL_ONLY },
    Niveau: { tok: Token.LEVEL_SET, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX | TokenFlag.WEBGL_ONLY },
    VectorField: { tok: Token.VECTOR_FIELD, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
    '|': { tok: Token.ABS, flags: TokenFlag.BEGIN_SCOPE | TokenFlag.END_SCOPE },
    Circle: { tok: Token.CIRCLE, flags: TokenFlag.PREFIX | TokenFlag.WEBGL_ONLY },
    Point: { tok: Token.POINT, flags: TokenFlag.PREFIX | TokenFlag.WEBGL_ONLY },
    Polar: { tok: Token.POLAR, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX | TokenFlag.WEBGL_ONLY },
    Pol: { tok: Token.POLAR, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX | TokenFlag.WEBGL_ONLY },
    Cartesian: { tok: Token.CARTESIAN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX | TokenFlag.WEBGL_ONLY },
    Cart: { tok: Token.CARTESIAN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX | TokenFlag.WEBGL_ONLY },
    t: { tok: Token.TIME, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
    mouseX: { tok: Token.MOUSEX, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
    mouseY: { tok: Token.MOUSEY, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
    mouse: { tok: Token.MOUSE, flags: 0 },
    i: { tok: Token.IMAGINARY, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
    Series: { tok: Token.SERIES, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX | TokenFlag.WEBGL_ONLY },
    k: { tok: Token.ITERATOR, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
    z: { tok: Token.COMPLEX, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
    Mag: { tok: Token.MAGNITUDE, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
    Gradient: { tok: Token.GRADIENT, flags: TokenFlag.PREFIX }
};
const StringConstantMap = {
    pi: Math.PI,
    Pi: Math.PI,
    e: Math.E
};
const escapeRegExp = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
let latestError = null;
const lexerGetError = () => latestError;
exports.lexerGetError = lexerGetError;
const reportError = (error, position) => {
    console.error(`Error at position ${position}: ${error}`);
    latestError = { desc: error, pos: position };
};
const isIdentifier = (str) => {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(str);
};
const ExternVariables = {};
const bindExternVariable = (name, getter, setter) => {
    ExternVariables[name] = { get: getter, set: setter };
};
exports.bindExternVariable = bindExternVariable;
const unbindExternVariable = (name) => {
    delete ExternVariables[name];
};
exports.unbindExternVariable = unbindExternVariable;
const getExternVariable = (name) => {
    return ExternVariables[name];
};
exports.getExternVariable = getExternVariable;
let UserVariables = {};
const setUserVariable = (name, value) => {
    UserVariables[name] = value;
};
exports.setUserVariable = setUserVariable;
const getUserVariable = (name) => UserVariables[name] || 0;
exports.getUserVariable = getUserVariable;
const clearUserVariables = () => {
    UserVariables = {};
};
exports.clearUserVariables = clearUserVariables;
const lex = (str) => {
    latestError = null;
    str = str.replace(/\s/g, '');
    const chunks = str.split(new RegExp(`(${Object
        .keys(StringTokenMap)
        .filter(k => StringTokenMap[k].flags & TokenFlag.UNIQUE)
        .map(k => escapeRegExp(k))
        .join('|')})`, 'g'))
        .filter((seg) => seg !== '');
    const ops = [];
    let pos = 0;
    chunks.forEach((chunk) => {
        let from = 0;
        for (let i = chunk.length; i > from; i--) {
            const buf = chunk.substring(from, i);
            let found = false;
            if (StringTokenMap[buf]) {
                ops.push({ tok: StringTokenMap[buf].tok, val: 0, flags: StringTokenMap[buf].flags });
                found = true;
            }
            else if (StringConstantMap[buf]) {
                ops.push({ tok: Token.CONST, val: StringConstantMap[buf], flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER });
                found = true;
            }
            else if (ExternVariables[buf]) {
                ops.push({ tok: Token.ASSIGNABLE, val: buf, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER });
                found = true;
            }
            else if (!isNaN(Number(buf))) {
                ops.push({ tok: Token.NUM, val: parseFloat(buf), flags: TokenFlag.IMPL_MULT_AFTER });
                found = true;
            }
            else if (i - 1 === from) {
                let longestIdent = '';
                for (let j = from + 1; j <= chunk.length; j++) {
                    const tmp = chunk.substring(from, j);
                    if (!isIdentifier(tmp)) {
                        break;
                    }
                    longestIdent = tmp;
                }
                if (longestIdent !== '') {
                    ops.push({ tok: Token.USERVAR, val: longestIdent, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER });
                    from += longestIdent.length;
                    i = chunk.length + 1;
                    continue;
                }
                reportError(`Unknown token: ´${chunk.substring(from, chunk.length)}´`, pos + from);
                return [];
            }
            if (found) {
                from = i;
                i = chunk.length + 1;
                continue;
            }
        }
        pos += chunk.length;
    });
    return ops;
};
exports.lex = lex;


/***/ }),

/***/ "./src/app/lang/parser.ts":
/*!********************************!*\
  !*** ./src/app/lang/parser.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parse = exports.parserGetDisplayMode = exports.parserGetDriver = exports.parserGetContinuous = exports.parserGetError = void 0;
const defines_1 = __webpack_require__(/*! ../defines */ "./src/app/defines.ts");
const lexer_1 = __webpack_require__(/*! ./lexer */ "./src/app/lang/lexer.ts");
const MAX_PRECEDENCE = 8;
const TokenPrecedence = {
    [lexer_1.Token.OR]: 0,
    [lexer_1.Token.DELIM]: 1,
    [lexer_1.Token.AND]: 2,
    [lexer_1.Token.EQUAL]: 3,
    [lexer_1.Token.NOT_EQUAL]: 3,
    [lexer_1.Token.ASSIGN]: 3,
    [lexer_1.Token.LESS]: 4,
    [lexer_1.Token.LESS_OR_EQUAL]: 4,
    [lexer_1.Token.GREATER]: 4,
    [lexer_1.Token.GREATER_OR_EQUAL]: 4,
    [lexer_1.Token.ADD]: 5,
    [lexer_1.Token.SUB]: 5,
    [lexer_1.Token.MULT]: 6,
    [lexer_1.Token.DIV]: 6,
    [lexer_1.Token.MOD]: 6,
    [lexer_1.Token.POW]: 7
};
const reportError = (error, position) => {
    console.error(`Error at position ${position}: ${error}`);
    latestError = { desc: error, pos: position };
};
let latestError = null;
let continuous = false;
let driver = defines_1.PlotDriver.CONSTANT;
let displayMode = defines_1.PlotDisplayMode.NONE;
const parserGetError = () => latestError;
exports.parserGetError = parserGetError;
const parserGetContinuous = () => continuous;
exports.parserGetContinuous = parserGetContinuous;
const parserGetDriver = () => driver;
exports.parserGetDriver = parserGetDriver;
const parserGetDisplayMode = () => displayMode;
exports.parserGetDisplayMode = parserGetDisplayMode;
const parse = (input) => {
    latestError = null;
    continuous = false;
    driver = defines_1.PlotDriver.CONSTANT;
    displayMode = defines_1.PlotDisplayMode.NONE;
    let ops = (0, lexer_1.lex)(input);
    console.debug('Lexer output:', ops);
    const lexerError = (0, lexer_1.lexerGetError)();
    if (lexerError) {
        latestError = JSON.parse(JSON.stringify(lexerError));
        return null;
    }
    ops = validate(ops);
    console.debug('Validated ops:', ops);
    if (ops == null)
        return null;
    ops = expand(ops);
    console.debug('Expanded ops:', ops);
    if (ops == null)
        return null;
    const numVars = (ops.filter(op => op.tok === lexer_1.Token.VAR).length > 0 ? 1 : 0) +
        (ops.filter(op => op.tok === lexer_1.Token.VAR2).length > 0 ? 1 : 0);
    if (ops.filter(op => op.flags & lexer_1.TokenFlag.WEBGL_ONLY).length > 0) {
        driver = defines_1.PlotDriver.WEBGL;
        displayMode = defines_1.PlotDisplayMode.SET;
        if (ops.filter(op => op.tok === lexer_1.Token.LEVEL_SET).length > 0) {
            displayMode = defines_1.PlotDisplayMode.LEVEL_SET;
        }
        else if (ops.filter(op => op.tok === lexer_1.Token.VECTOR_FIELD).length > 0) {
            displayMode = defines_1.PlotDisplayMode.VECTOR_FIELD;
        }
        else if (ops.filter(op => op.tok === lexer_1.Token.GRADIENT).length > 0) {
            displayMode = defines_1.PlotDisplayMode.GRADIENT;
        }
    }
    else if (numVars === 0) {
        driver = defines_1.PlotDriver.CONSTANT;
        displayMode = defines_1.PlotDisplayMode.CONSTANT_EVAL;
    }
    else if (numVars === 1) {
        driver = defines_1.PlotDriver.CANVAS;
        displayMode = defines_1.PlotDisplayMode.FUNCTION_GRAPH;
    }
    continuous = ops.filter(op => op.tok === lexer_1.Token.TIME).length > 0 ||
        ops.filter(op => op.tok === lexer_1.Token.MOUSEX).length > 0 ||
        ops.filter(op => op.tok === lexer_1.Token.MOUSEY).length > 0;
    ops = optimize(ops);
    console.debug('Optimized ops:', ops);
    if (ops == null)
        return null;
    return buildAST(ops);
};
exports.parse = parse;
const validate = (ops) => {
    const parenStack = [];
    for (let i = 0; i < ops.length; i++) {
        const op = ops[i];
        if (op.flags & lexer_1.TokenFlag.BEGIN_SCOPE) {
            parenStack.push({ tok: op.tok, pos: i });
        }
        if (op.flags & lexer_1.TokenFlag.END_SCOPE) {
            const { tok, pos } = parenStack.pop() || { tok: lexer_1.Token.NONE, pos: 0 };
            let expectTok = lexer_1.Token.NONE;
            switch (tok) {
                case lexer_1.Token.PAREN_OP:
                    expectTok = lexer_1.Token.PAREN_CL;
                    break;
                case lexer_1.Token.BRACKET_OP:
                    expectTok = lexer_1.Token.BRACKET_CL;
                    break;
                case lexer_1.Token.BRACE_OP:
                    expectTok = lexer_1.Token.BRACE_CL;
                    break;
                case lexer_1.Token.ABS:
                    expectTok = lexer_1.Token.ABS;
                    break;
            }
            if (op.tok !== expectTok) {
                reportError('Mismatched parentheses', pos);
                return null;
            }
        }
    }
    if (parenStack.length > 0) {
        const { pos } = parenStack[0];
        reportError('Unmatched parentheses', pos);
        return null;
    }
    return ops;
};
const expand = (ops) => {
    const absStack = [];
    for (let i = 0; i < ops.length; i++) {
        const op = ops[i];
        if (op.tok === lexer_1.Token.ABS && op.flags & lexer_1.TokenFlag.BEGIN_SCOPE) {
            const top = absStack.pop();
            absStack.push({ tok: op.tok, pos: i });
            if (!top)
                continue;
            const absExpr = ops.splice(top.pos + 1, i - top.pos - 1);
            ops.splice(top.pos, 2);
            ops.splice(top.pos, 0, { tok: lexer_1.Token.ABS, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_BEFORE | lexer_1.TokenFlag.PREFIX }, { tok: lexer_1.Token.PAREN_OP, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_BEFORE | lexer_1.TokenFlag.UNIQUE | lexer_1.TokenFlag.BEGIN_SCOPE }, ...absExpr, { tok: lexer_1.Token.PAREN_CL, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_AFTER | lexer_1.TokenFlag.UNIQUE | lexer_1.TokenFlag.END_SCOPE });
            i = top.pos + absExpr.length + 3;
            absStack.pop();
        }
    }
    for (let i = 0; i < ops.length; i++) {
        if (ops[i].tok === lexer_1.Token.MOUSE) {
            ops.splice(i, 1, { tok: lexer_1.Token.MOUSEX, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_BEFORE }, { tok: lexer_1.Token.DELIM, val: 0, flags: 0 }, { tok: lexer_1.Token.MOUSEY, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_BEFORE });
            i += 2;
        }
        else if (ops[i].tok === lexer_1.Token.COMPLEX) {
            ops.splice(i, 1, { tok: lexer_1.Token.PAREN_OP, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_BEFORE | lexer_1.TokenFlag.BEGIN_SCOPE }, { tok: lexer_1.Token.VAR, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_BEFORE | lexer_1.TokenFlag.IMPL_MULT_AFTER }, { tok: lexer_1.Token.ADD, val: 0, flags: 0 }, { tok: lexer_1.Token.VAR2, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_BEFORE | lexer_1.TokenFlag.IMPL_MULT_AFTER | lexer_1.TokenFlag.WEBGL_ONLY }, { tok: lexer_1.Token.IMAGINARY, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_BEFORE | lexer_1.TokenFlag.IMPL_MULT_AFTER }, { tok: lexer_1.Token.PAREN_CL, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_AFTER | lexer_1.TokenFlag.END_SCOPE });
            i += 5;
        }
    }
    for (let i = 1; i < ops.length; i++) {
        if ((ops[i - 1].flags & lexer_1.TokenFlag.IMPL_MULT_AFTER) && (ops[i].flags & lexer_1.TokenFlag.IMPL_MULT_BEFORE)) {
            ops.splice(i, 0, { tok: lexer_1.Token.MULT, val: 0, flags: 0 });
        }
    }
    for (let prec = MAX_PRECEDENCE; prec > 0; prec--) {
        for (let i = 0; i < ops.length; i++) {
            if (TokenPrecedence[ops[i].tok] === prec) {
                let left = 0;
                let right = ops.length;
                let level = 0;
                for (let j = i; j >= 0; j--) {
                    if (ops[j].flags & lexer_1.TokenFlag.BEGIN_SCOPE) {
                        level++;
                    }
                    else if (ops[j].flags & lexer_1.TokenFlag.END_SCOPE) {
                        level--;
                    }
                    if ((TokenPrecedence[ops[j].tok] < prec && level === 0) || level > 0) {
                        left = j + 1;
                        break;
                    }
                }
                level = 0;
                for (let j = i; j < ops.length; j++) {
                    if (ops[j].flags & lexer_1.TokenFlag.BEGIN_SCOPE) {
                        level++;
                    }
                    else if (ops[j].flags & lexer_1.TokenFlag.END_SCOPE) {
                        level--;
                    }
                    if ((TokenPrecedence[ops[j].tok] < prec && level === 0) || level < 0) {
                        right = j;
                        break;
                    }
                }
                ops.splice(right, 0, { tok: lexer_1.Token.PAREN_CL, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_AFTER | lexer_1.TokenFlag.UNIQUE | lexer_1.TokenFlag.END_SCOPE });
                ops.splice(left, 0, { tok: lexer_1.Token.PAREN_OP, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_BEFORE | lexer_1.TokenFlag.UNIQUE | lexer_1.TokenFlag.BEGIN_SCOPE });
                i++;
            }
        }
    }
    for (let i = 0; i < ops.length; i++) {
        if (ops[i].tok === lexer_1.Token.SUB && (i === 0 || (ops[i - 1].flags & lexer_1.TokenFlag.BEGIN_SCOPE))) {
            ops.splice(i, 0, { tok: lexer_1.Token.NUM, val: 0, flags: lexer_1.TokenFlag.IMPL_MULT_AFTER });
        }
    }
    return ops;
};
const optimize = (ops) => {
    let numConsecSub = 0;
    for (let i = 0; i < ops.length; i++) {
        if (ops[i].tok === lexer_1.Token.SUB) {
            numConsecSub++;
        }
        else {
            if (numConsecSub > 1) {
                if (numConsecSub % 2 === 1) {
                    for (let j = 0; j < numConsecSub - 1; j++) {
                        ops.splice(i - numConsecSub, 1);
                    }
                }
                else {
                    for (let j = 0; j < numConsecSub; j++) {
                        ops.splice(i - numConsecSub, 1);
                    }
                    ops.splice(i - numConsecSub, 0, { tok: lexer_1.Token.ADD, val: 0, flags: 0 });
                }
            }
            numConsecSub = 0;
        }
    }
    for (let i = 1; i < ops.length; i++) {
        if ((ops[i].flags & lexer_1.TokenFlag.END_SCOPE) && (ops[i - 1].flags & lexer_1.TokenFlag.BEGIN_SCOPE)) {
            ops.splice(i - 1, 2);
        }
    }
    return ops;
};
const buildAST = (ops) => {
    const root = { op: { tok: lexer_1.Token.NONE, val: 0, flags: 0 }, left: null, right: null };
    let current = root;
    const stack = [];
    let level = 0;
    for (let i = 0; i < ops.length; i++) {
        const op = ops[i];
        if (op.flags & lexer_1.TokenFlag.BEGIN_SCOPE) {
            level++;
        }
        else if (op.flags & lexer_1.TokenFlag.END_SCOPE) {
            if (level <= 0) {
                reportError('Unexpected end of scope', i);
                return null;
            }
            level--;
            current = stack.pop();
            continue;
        }
        if (current.op == null || current.op.tok === lexer_1.Token.NONE || (current.op.flags & lexer_1.TokenFlag.BEGIN_SCOPE)) {
            current.op = op;
            if (current.op.flags & lexer_1.TokenFlag.BEGIN_SCOPE) {
                stack.push(current);
            }
        }
        else {
            if (current.left == null) {
                if (current.op.flags & lexer_1.TokenFlag.PREFIX) {
                    current.left = { op: { tok: lexer_1.Token.UNDEF, val: 0, flags: 0 }, left: null, right: null };
                    current.right = { op, left: null, right: null };
                    if (current.right.op.flags & lexer_1.TokenFlag.BEGIN_SCOPE) {
                        stack.push(current);
                        current = current.right;
                    }
                    continue;
                }
                const tmp = JSON.parse(JSON.stringify(current));
                current.left = tmp;
                current.op = op;
            }
            else if (current.right == null || (current.right.op.flags & lexer_1.TokenFlag.BEGIN_SCOPE)) {
                current.right = { op, left: null, right: null };
                if (current.right.op.flags & lexer_1.TokenFlag.BEGIN_SCOPE) {
                    stack.push(current);
                    current = current.right;
                }
            }
            else if (current.right.op.flags & lexer_1.TokenFlag.PREFIX && current.right.right == null) {
                stack.push(current);
                current = current.right;
                current.right = { op, left: null, right: null };
            }
            else {
                const tmp = JSON.parse(JSON.stringify(current));
                current.left = tmp;
                current.right = null;
                current.op = op;
            }
        }
    }
    if (level !== 0) {
        reportError('Unexpected end of expression', ops.length);
        return null;
    }
    return root;
};


/***/ }),

/***/ "./src/app/shader/shaderCore.ts":
/*!**************************************!*\
  !*** ./src/app/shader/shaderCore.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.shadersDraw = exports.scheduleReloadShaders = exports.shaderCoreUpdate = exports.initShaderCore = exports.shadersClearAll = void 0;
const index_1 = __webpack_require__(/*! ../../index */ "./src/index.ts");
const canvasCore_1 = __webpack_require__(/*! ../canvas/canvasCore */ "./src/app/canvas/canvasCore.ts");
const controller_1 = __webpack_require__(/*! ../core/controller */ "./src/app/core/controller.ts");
const defines_1 = __webpack_require__(/*! ../defines */ "./src/app/defines.ts");
const mat4 = __webpack_require__(/*! ../lib/gl-matrix/mat4 */ "./src/app/lib/gl-matrix/mat4.js");
const userInteract_1 = __webpack_require__(/*! ../ui/userInteract */ "./src/app/ui/userInteract.ts");
const deviation = 0.004;
let info = null;
let buffers = null;
let shadersAreInitializing = false;
let shadersInitialized = false;
let error = false;
const fileBuffers = {};
const canvas = document.getElementById('shader-canvas');
const ctx = canvas.getContext('webgl2');
const shadersClearAll = function () {
    (0, exports.scheduleReloadShaders)();
};
exports.shadersClearAll = shadersClearAll;
const initShaderCore = function () {
    if (!canvas || !ctx) {
        console.error('Failed to initialize WebGL context.');
    }
};
exports.initShaderCore = initShaderCore;
function fetchBuffered(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fileBuffers[url]) {
            const response = yield fetch(url);
            const text = yield response.text();
            fileBuffers[url] = text;
            return text;
        }
        return Promise.resolve(fileBuffers[url]);
    });
}
function loadShaders() {
    return __awaiter(this, void 0, void 0, function* () {
        shadersAreInitializing = true;
        yield Promise.all([
            fetchBuffered('assets/shaders/plot.vert'),
            fetchBuffered('assets/shaders/plot.frag')
        ]).then(shaders => {
            shaders[1] = injectFunctionsIntoShaderSource(shaders[1]);
            const program = initShaders(shaders[0], shaders[1]);
            if (!program) {
                console.error('Failed to load shaders');
                return;
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
            };
            buffers = initBuffers();
            shadersInitialized = true;
            shadersAreInitializing = false;
        });
    });
}
const shaderCoreUpdate = function () {
    if (!shadersInitialized && !shadersAreInitializing && !error) {
        loadShaders();
        if (error) {
            console.error('Failed to load shaders');
        }
    }
};
exports.shaderCoreUpdate = shaderCoreUpdate;
const scheduleReloadShaders = function () {
    error = false;
    shadersInitialized = false;
    shadersAreInitializing = false;
};
exports.scheduleReloadShaders = scheduleReloadShaders;
const shadersDraw = function () {
    shadersInitialized = false;
    if (shadersInitialized && !error) {
        drawScene();
        return;
    }
    loadShaders().then(() => {
        if (!shadersInitialized) {
            console.error('Failed to initialize shaders');
            ctx.clearColor(0.0, 0.0, 0.0, 1.0);
            return;
        }
        drawScene();
    });
};
exports.shadersDraw = shadersDraw;
const hexColorToNormalRGBString = function (hex) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `${r / 255.0}, ${g / 255.0}, ${b / 255.0}`;
};
function injectFunctionsIntoShaderSource(shader) {
    const plots = (0, controller_1.getPlotsShaderInfo)();
    if (plots.numPlots === 0) {
        plots.functions = [];
        plots.colors = ['#000000'];
        plots.displayModes = [defines_1.PlotDisplayMode.NONE];
        plots.iterExpr = [];
    }
    plots.functions.push('0.0');
    plots.iterExpr.push('vec2(0.0,0.0)');
    return shader
        .replace(/USER_NUM_FUNC_INJ/g, `${plots.numPlots + 1}`)
        .replace(/USER_FUNC_INJ/g, `float[](${plots.functions.map(f => `(${f})`).join(',')})`)
        .replace(/USER_COL_INJ/g, `vec3[](${plots.colors.map(c => `vec3(${hexColorToNormalRGBString(c)})`).join(',')})`)
        .replace(/USER_DISP_INJ/g, `int[](${plots.displayModes.map(d => `${d}`).join(',')})`)
        .replace(/USER_ITER_EXPR_INJ/g, `vec2[](${plots.iterExpr.map(e => `(${e.length > 0 ? e : 'vec2(0.0,0.0)'})`).join(',')})`);
}
function initShaders(vertSrc, fragSrc) {
    const vertShader = loadShader(ctx.VERTEX_SHADER, vertSrc);
    const fragShader = loadShader(ctx.FRAGMENT_SHADER, fragSrc);
    if (!vertShader || !fragShader) {
        return null;
    }
    const program = ctx.createProgram();
    if (!program) {
        console.error('Failed to create program');
        return null;
    }
    ctx.attachShader(program, vertShader);
    ctx.attachShader(program, fragShader);
    ctx.linkProgram(program);
    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
        console.error('Failed to link program: ' + ctx.getProgramInfoLog(program));
        return null;
    }
    return program;
}
function loadShader(type, source) {
    const shader = ctx.createShader(type);
    if (!shader) {
        console.error('Failed to create shader');
        return null;
    }
    ctx.shaderSource(shader, source);
    ctx.compileShader(shader);
    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        console.error('Failed to compile shader: ' + ctx.getShaderInfoLog(shader));
        ctx.getShaderInfoLog(shader);
        ctx.deleteShader(shader);
        return null;
    }
    return shader;
}
function initBuffers() {
    const positionBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer);
    const positions = [
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0
    ];
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(positions), ctx.STATIC_DRAW);
    return positionBuffer;
}
function drawScene() {
    ctx.clearColor(0.0, 0.0, 0.0, 1.0);
    ctx.clearDepth(1.0);
    ctx.enable(ctx.DEPTH_TEST);
    ctx.depthFunc(ctx.LEQUAL);
    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
    const fov = 45 * Math.PI / 180;
    const aspect = ctx.canvas.clientWidth / ctx.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -1]);
    const numComponents = 2;
    const type = ctx.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers);
    ctx.vertexAttribPointer(info.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    ctx.enableVertexAttribArray(info.attribLocations.vertexPosition);
    ctx.useProgram(info.program);
    const mousePos = (0, userInteract_1.getMousePos)();
    const domain = (0, canvasCore_1.getDomain)();
    ctx.uniformMatrix4fv(info.uniformLocations.projectionMatrix, false, projectionMatrix);
    ctx.uniformMatrix4fv(info.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    ctx.uniform2f(info.uniformLocations.u_resolution, ctx.canvas.width, ctx.canvas.height);
    ctx.uniform2f(info.uniformLocations.u_mouse, mousePos.x, mousePos.y);
    ctx.uniform2f(info.uniformLocations.u_domain_x, domain.minX, domain.maxX);
    ctx.uniform2f(info.uniformLocations.u_domain_y, domain.minY, domain.maxY);
    ctx.uniform1f(info.uniformLocations.u_time, (0, index_1.getGlobalTime)());
    ctx.uniform1f(info.uniformLocations.u_deviation, deviation);
    ctx.uniform1i(info.uniformLocations.u_display_mode, 0);
    const vertexCount = 4;
    ctx.drawArrays(ctx.TRIANGLE_STRIP, offset, vertexCount);
}


/***/ }),

/***/ "./src/app/shader/shaderFunctionBuilder.ts":
/*!*************************************************!*\
  !*** ./src/app/shader/shaderFunctionBuilder.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildShaderFunction = exports.shaderFunctionBuilderGetIterExpression = exports.shaderFunctionBuilderGetError = void 0;
const index_1 = __webpack_require__(/*! ../../index */ "./src/index.ts");
const lexer_1 = __webpack_require__(/*! ../lang/lexer */ "./src/app/lang/lexer.ts");
let latestError = null;
const shaderFunctionBuilderGetError = () => latestError;
exports.shaderFunctionBuilderGetError = shaderFunctionBuilderGetError;
let iterExpr = '';
const shaderFunctionBuilderGetIterExpression = () => iterExpr;
exports.shaderFunctionBuilderGetIterExpression = shaderFunctionBuilderGetIterExpression;
const buildShaderFunction = (ast) => {
    if (!ast)
        return null;
    latestError = null;
    iterExpr = '';
    const result = evalNode(ast);
    console.debug('Shader function: ' + result.val);
    return result.val;
};
exports.buildShaderFunction = buildShaderFunction;
const reportError = function (error) {
    console.error('Error during constant evaluation: ' + error);
    latestError = error;
    return { val: null, cpx: false };
};
const numToFloatString = function (num) {
    return num.toString().indexOf('.') === -1 ? num.toString() + '.0' : num.toString();
};
const isIterable = (obj) => obj != null && typeof obj[Symbol.iterator] === 'function';
const real = (val) => {
    return { val, cpx: false };
};
const complex = (val) => {
    return { val, cpx: true };
};
const evalNode = function (node) {
    var _a;
    let left, right;
    switch (node.op.tok) {
        case lexer_1.Token.UNDEF:
            return reportError('Token UNDEFINED is not allowed');
        case lexer_1.Token.NONE:
            return real('0');
        case lexer_1.Token.PAREN_OP:
            return reportError('Token OPEN PARENTHESIS is not allowed');
        case lexer_1.Token.PAREN_CL:
            return reportError('Token CLOSE PARENTHESIS is not allowed');
        case lexer_1.Token.BRACKET_OP:
            return reportError('Token OPEN BRACKET is not allowed');
        case lexer_1.Token.BRACKET_CL:
            return reportError('Token CLOSE BRACKET is not allowed');
        case lexer_1.Token.BRACE_OP:
            return reportError('Token OPEN BRACE is not allowed');
        case lexer_1.Token.BRACE_CL:
            return reportError('Token CLOSE BRACE is not allowed');
        case lexer_1.Token.NUM:
            if (typeof node.op.val !== 'number') {
                return reportError('Token NUMBER must be a number');
            }
            return real(numToFloatString(node.op.val));
        case lexer_1.Token.CONST:
            if (typeof node.op.val !== 'number') {
                return reportError('Token CONSTANT must be a number');
            }
            return real(numToFloatString(node.op.val));
        case lexer_1.Token.VAR:
            return real('x');
        case lexer_1.Token.VAR2:
            return real('y');
        case lexer_1.Token.TIME:
            (0, index_1.scheduleRedraw)();
            return real('t');
        case lexer_1.Token.ADD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ADDITION');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (!left.cpx && !right.cpx) {
                return real(`(${left.val}+${right.val})`);
            }
            return complex(`add(${left.val},${right.val})`);
        case lexer_1.Token.SUB:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token SUBTRACTION');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (!left.cpx && !right.cpx) {
                return real(`(${left.val}-${right.val})`);
            }
            return complex(`sub(${left.val},${right.val})`);
        case lexer_1.Token.MULT:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MULTIPLICATION');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (!left.cpx && !right.cpx) {
                return real(`(${left.val}*${right.val})`);
            }
            return complex(`mul(${left.val},${right.val})`);
        case lexer_1.Token.DIV:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token DIVISION');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (!left.cpx && !right.cpx) {
                return real(`(${left.val}/${right.val})`);
            }
            return complex(`div(${left.val},${right.val})`);
        case lexer_1.Token.POW:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token POWER');
            }
            left = evalNode(node.left);
            right = evalNode(node.right);
            if (!left.cpx && !right.cpx) {
                return real(`_pow(${left.val},${right.val})`);
            }
            if (right.cpx) {
                return reportError('Power cannot be complex');
            }
            return complex(`_pow(${left.val},${right.val})`);
        case lexer_1.Token.SQRT:
            if (node.right == null) {
                return reportError('Missing argument for Token SQUARE ROOT');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`sqrt(${right.val})`);
            }
            return reportError('Square root cannot be complex');
        case lexer_1.Token.LOG:
            if (node.right == null) {
                return reportError('Missing argument for Token LOGARITHM');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`log(${right.val})`);
            }
        case lexer_1.Token.EXP:
            if (node.right == null) {
                return reportError('Missing argument for Token EXPOENTIAL');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`exp(${right.val})`);
            }
            return reportError('Exponential cannot be complex');
        case lexer_1.Token.SIN:
            if (node.right == null) {
                return reportError('Missing argument for Token SINE');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`sin(${right.val})`);
            }
            return reportError('Sine cannot be complex');
        case lexer_1.Token.COS:
            if (node.right == null) {
                return reportError('Missing argument for Token COSINE');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`cos(${right.val})`);
            }
            return reportError('Cosine cannot be complex');
        case lexer_1.Token.TAN:
            if (node.right == null) {
                return reportError('Missing argument for Token TANGENT');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`tan(${right.val})`);
            }
            return reportError('Tangent cannot be complex');
        case lexer_1.Token.ASIN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC SINE');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`asin(${right.val})`);
            }
            return reportError('Arc sine cannot be complex');
        case lexer_1.Token.ACOS:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC COSINE');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`acos(${right.val})`);
            }
        case lexer_1.Token.ATAN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC TANGENT');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`atan(${right.val})`);
            }
            return reportError('Arc tangent cannot be complex');
        case lexer_1.Token.SINH:
            if (node.right == null) {
                return reportError('Missing argument for Token SINE HYPERBOLICUS');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`sinh(${right.val})`);
            }
            return reportError('Sine hyperbolicus cannot be complex');
        case lexer_1.Token.COSH:
            if (node.right == null) {
                return reportError('Missing argument for Token COSINE HYPERBOLICUS');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`cosh(${right.val})`);
            }
            return reportError('Cosine hyperbolicus cannot be complex');
        case lexer_1.Token.TANH:
            if (node.right == null) {
                return reportError('Missing argument for Token TANGENT HYPERBOLICUS');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`tanh(${right.val})`);
            }
        case lexer_1.Token.FLOOR:
            if (node.right == null) {
                return reportError('Missing argument for Token FLOOR');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`floor(${right.val})`);
            }
            return reportError('Floor cannot be complex');
        case lexer_1.Token.MIN:
            if (node.right == null) {
                return reportError('Missing argument for Token MIN');
            }
            if (!isIterable(evalNode(node.right).val)) {
                return reportError('Malformed argument for Token MIN');
            }
            return real(`min(${evalNode(node.right).val})`);
        case lexer_1.Token.MAX:
            if (node.right == null) {
                return reportError('Missing argument for Token MAX');
            }
            if (!isIterable(evalNode(node.right).val)) {
                return reportError('Malformed argument for Token MAX');
            }
            return real(`max(${evalNode(node.right).val})`);
        case lexer_1.Token.DELIM:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token DELIMITER');
            }
            return real(`${evalNode(node.left).val},${evalNode(node.right).val}`);
        case lexer_1.Token.ABS:
            if (node.right == null) {
                return reportError('Missing argument for Token ABSOLUTE');
            }
            right = evalNode(node.right);
            if (!right.cpx) {
                return real(`abs(${right.val})`);
            }
            return real(`mag(${right.val})`);
        case lexer_1.Token.RAND:
            if (node.right == null) {
                return reportError('Missing argument for Token RANDOM');
            }
            return real(`random(${evalNode(node.right).val})`);
        case lexer_1.Token.PERLIN: {
            if (node.right == null) {
                return reportError('Missing arguments for Token PERLIN');
            }
            if (!isIterable(evalNode(node.right).val)) {
                return reportError('Malformed argument for Token PERLIN');
            }
            return real(`noise(vec2(${evalNode(node.right).val}))`);
        }
        case lexer_1.Token.MOD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MODULUS');
            }
            return real(`mod(${evalNode(node.left).val},${evalNode(node.right).val})`);
        case lexer_1.Token.LEVEL_SET:
            if (node.right == null) {
                return reportError('Missing argument for Token LEVEL SET');
            }
            if (node.right.op.tok === lexer_1.Token.DELIM) {
                if (node.right.left == null || node.right.right == null) {
                    return reportError('Missing arguments for Token LEVEL SET');
                }
                return real(`${evalNode(node.right.left).val}+((level=${evalNode(node.right.right).val})>0.0?0.0:0.0)`);
            }
            return evalNode(node.right);
        case lexer_1.Token.VECTOR_FIELD:
            return reportError('Token VECTOR FIELD is not allowed');
        case lexer_1.Token.LESS:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN');
            }
            return real(`btof(${evalNode(node.left).val}<${evalNode(node.right).val})`);
        case lexer_1.Token.GREATER:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN');
            }
            return real(`btof(${evalNode(node.left).val}>${evalNode(node.right).val})`);
        case lexer_1.Token.LESS_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN OR EQUAL TO');
            }
            return real(`btof(${evalNode(node.left).val}<=${evalNode(node.right).val})`);
        case lexer_1.Token.GREATER_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN OR EQUAL TO');
            }
            return real(`btof(${evalNode(node.left).val}>=${evalNode(node.right).val})`);
        case lexer_1.Token.EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token EQUAL TO');
            }
            return real(`btof(${evalNode(node.left).val}==${evalNode(node.right).val})`);
        case lexer_1.Token.AND:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token AND');
            }
            return real(`btof(ftob(${evalNode(node.left).val})&&ftob(${evalNode(node.right).val}))`);
        case lexer_1.Token.OR:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token OR');
            }
            return real(`btof(ftob(${evalNode(node.left).val})||ftob(${evalNode(node.right).val}))`);
        case lexer_1.Token.USERVAR:
            return real(`btof(${(0, lexer_1.getUserVariable)(node.op.val)})`);
        case lexer_1.Token.FACTORIAL:
            if (node.right == null) {
                return reportError('Missing argument for Token FACTORIAL');
            }
            return real(`factorial(${evalNode(node.right).val})`);
        case lexer_1.Token.SIGMOID:
            if (node.right == null) {
                return reportError('Missing argument for Token SIGMOID');
            }
            return real(`(1.0/(1.0+exp(-(${evalNode(node.right).val}))))`);
        case lexer_1.Token.CIRCLE:
            if (node.right == null) {
                return reportError('Missing argument for Token CIRCLE');
            }
            return real(`circle(x,y,d,${evalNode(node.right).val})`);
        case lexer_1.Token.POINT:
            if (node.right == null) {
                return reportError('Missing argument for Token POINT');
            }
            return real(`point(x,y,d,${evalNode(node.right).val})`);
        case lexer_1.Token.TRUE:
            return real('btof(true)');
        case lexer_1.Token.FALSE:
            return real('btof(false)');
        case lexer_1.Token.POLAR:
            if (node.right == null) {
                return reportError('Missing argument for Token POLAR');
            }
            return real(`(POLAR+${evalNode(node.right).val})`);
        case lexer_1.Token.CARTESIAN:
            if (node.right == null) {
                return reportError('Missing argument for Token CARTESIAN');
            }
            return real(`(CARTESIAN+${evalNode(node.right).val})`);
        case lexer_1.Token.MOUSEX:
            return real('mx');
        case lexer_1.Token.MOUSEY:
            return real('my');
        case lexer_1.Token.MOUSE:
            return reportError('Token MOUSE is not allowed');
        case lexer_1.Token.IMAGINARY:
            return complex('vec2(0.0,1.0)');
        case lexer_1.Token.SERIES:
            if (node.right == null || node.right.left == null || node.right.right == null) {
                return reportError('Missing argument for Token SERIES');
            }
            iterExpr = evalNode(node.right.right).val || '';
            return real(`series(i,x,y,t,${evalNode(node.right.left).val})`);
        case lexer_1.Token.ITERATOR:
            return real('k');
        case lexer_1.Token.COMPLEX:
            return reportError('Token COMPLEX is not allowed');
        case lexer_1.Token.MAGNITUDE:
            if (node.right == null) {
                return reportError('Missing argument for Token MAGNITUDE');
            }
            return real(`mag(${evalNode(node.right).val})`);
        case lexer_1.Token.GRADIENT:
            if (node.right == null) {
                return reportError('Missing argument for Token GRADIENT');
            }
            return evalNode(node.right);
        case lexer_1.Token.ASSIGN:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ASSIGN');
            }
            if (node.left.op.tok !== lexer_1.Token.ASSIGNABLE) {
                if (node.left.op.tok === lexer_1.Token.USERVAR) {
                    (0, lexer_1.setUserVariable)(node.left.op.val, parseFloat(evalNode(node.right).val));
                    return evalNode(node.right);
                }
                return real(`btof(abs(${evalNode(node.left).val}-${evalNode(node.right).val})<d)`);
            }
            if ((0, lexer_1.getExternVariable)(node.left.op.val) == null) {
                return reportError(`Variable ${node.left.op.val} does not exist`);
            }
            (_a = (0, lexer_1.getExternVariable)(node.left.op.val)) === null || _a === void 0 ? void 0 : _a.set(parseFloat(evalNode(node.right).val));
            return evalNode(node.right);
        default:
            return reportError(`Unknown token ${node.op.val}`);
    }
};


/***/ }),

/***/ "./src/app/ui/leftPanel.ts":
/*!*********************************!*\
  !*** ./src/app/ui/leftPanel.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLeftPanelWidth = exports.inputSetDriverAt = exports.inputSetStatusAt = exports.inputSetConstEvalAt = exports.inputSetErrorAt = exports.inputSetColorAt = exports.resetInputs = exports.addNewInputWithValue = exports.addNewInput = exports.initLeftPanel = void 0;
const index_1 = __webpack_require__(/*! ../../index */ "./src/index.ts");
const controller_1 = __webpack_require__(/*! ../core/controller */ "./src/app/core/controller.ts");
const defines_1 = __webpack_require__(/*! ../defines */ "./src/app/defines.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/app/utils.ts");
const userInteract_1 = __webpack_require__(/*! ./userInteract */ "./src/app/ui/userInteract.ts");
const inputsElt = document.querySelector('.inputs');
const resizeArea = document.querySelector('.resize-left-panel');
const leftPanel = document.getElementById('left-panel');
let currentInputIndex = 0;
let numInputs = 0;
const initLeftPanel = function () {
    (0, userInteract_1.onMouseDrag)(resizeArea, (mouse) => {
        const width = Math.max(250, Math.min(window.innerWidth * 0.95, mouse.x));
        document.documentElement.style.setProperty('--left-panel-width', `${width}px`);
        (0, index_1.scheduleRedraw)();
    });
    (0, exports.addNewInput)();
};
exports.initLeftPanel = initLeftPanel;
const addNewInput = function () {
    const eltStr = `
	<div class="input">
	<div class="status"><div class="indicator"></div></div>
	<input type="text" spellcheck="false" autocorrect="off" autocomplete="off" autocapitalize="off" autofocus>
	<div class="delete">×</div>
	<div class="const-eval"></div>
	</div>`;
    const elt = (0, utils_1.stringToHTML)(eltStr).firstChild;
    const eltInput = elt.querySelector('input');
    const eltDelete = elt.querySelector('.delete');
    const eltIndicator = elt.querySelector('.indicator');
    eltInput === null || eltInput === void 0 ? void 0 : eltInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (numInputs > currentInputIndex) {
                const nextElt = inputsElt.querySelector(`.input[data-input-idx="${++currentInputIndex}"]`);
                activateInput(nextElt);
                setTimeout(function () {
                    var _a;
                    (_a = nextElt.querySelector('input')) === null || _a === void 0 ? void 0 : _a.focus();
                }, 0);
                return;
            }
            (0, exports.addNewInput)();
        }
    });
    eltInput.addEventListener('click', function (e) {
        activateInput(elt);
        currentInputIndex = parseInt(elt.getAttribute('data-input-idx') || '0');
        eltInput === null || eltInput === void 0 ? void 0 : eltInput.focus();
    });
    eltInput === null || eltInput === void 0 ? void 0 : eltInput.addEventListener('focus', function (e) {
        activateInput(elt);
        currentInputIndex = parseInt(elt.getAttribute('data-input-idx') || '0');
    });
    eltInput === null || eltInput === void 0 ? void 0 : eltInput.addEventListener('input', function (e) {
        currentInputIndex = parseInt(elt.getAttribute('data-input-idx') || '0');
        if (eltIndicator.classList.contains('disabled')) {
            (0, controller_1.setInputAt)(currentInputIndex, '');
        }
        else {
            (0, controller_1.setInputAt)(currentInputIndex, eltInput.value);
        }
    });
    eltDelete === null || eltDelete === void 0 ? void 0 : eltDelete.addEventListener('click', function (e) {
        if (numInputs === 1) {
            elt.classList.add('illegal');
            const eltInput = elt.querySelector('input');
            if (eltInput) {
                eltInput.value = '';
            }
            const indicator = elt.querySelector('.indicator');
            indicator === null || indicator === void 0 ? void 0 : indicator.classList.remove('pending', 'active', 'error', 'disabled');
            const constEvalElt = elt.querySelector('.const-eval');
            constEvalElt === null || constEvalElt === void 0 ? void 0 : constEvalElt.classList.remove('visible');
            setTimeout(() => elt.classList.remove('illegal'), 200);
            (0, index_1.scheduleRedraw)();
            (0, controller_1.resetPlots)();
            return;
        }
        elt.classList.add('deleted');
        setTimeout(function () {
            elt.remove();
            const removedIndex = parseInt(elt.getAttribute('data-input-idx') || '0');
            numInputs--;
            (0, controller_1.setNumInputs)(numInputs);
            const inputs = inputsElt.querySelectorAll('.input');
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].setAttribute('data-input-idx', (i + 1).toString());
                const eltIndicator = inputs[i].querySelector('.indicator');
                if (eltIndicator === null || eltIndicator === void 0 ? void 0 : eltIndicator.classList.contains('disabled')) {
                    (0, controller_1.setInputAt)(i + 1, '');
                }
                else {
                    (0, controller_1.setInputAt)(i + 1, eltInput.value);
                }
            }
            if (numInputs > 0 && (removedIndex <= currentInputIndex || removedIndex === 1)) {
                const prevElt = inputsElt.querySelector(`.input[data-input-idx="${currentInputIndex - 1}"]`);
                activateInput(prevElt);
                setTimeout(function () {
                    var _a;
                    (_a = prevElt.querySelector('input')) === null || _a === void 0 ? void 0 : _a.focus();
                }, 0);
            }
        }, 120);
    });
    eltIndicator === null || eltIndicator === void 0 ? void 0 : eltIndicator.addEventListener('click', function (e) {
        eltIndicator.classList.toggle('disabled');
        currentInputIndex = parseInt(elt.getAttribute('data-input-idx') || '0');
        if (eltIndicator.classList.contains('disabled')) {
            (0, controller_1.setInputAt)(currentInputIndex, '');
        }
        else {
            (0, controller_1.setInputAt)(currentInputIndex, eltInput.value);
        }
    });
    elt.setAttribute('data-input-idx', (++currentInputIndex).toString());
    elt.classList.add('created');
    setTimeout(function () {
        elt.classList.remove('created');
    }, 120);
    numInputs++;
    (0, controller_1.setNumInputs)(numInputs);
    activateInput(elt);
    setTimeout(function () {
        eltInput === null || eltInput === void 0 ? void 0 : eltInput.focus();
    }, 0);
    inputsElt.appendChild(elt);
};
exports.addNewInput = addNewInput;
const addNewInputWithValue = function (value) {
    (0, exports.addNewInput)();
    (0, controller_1.setInputAt)(currentInputIndex, value);
    const eltInput = inputsElt.querySelector(`.input[data-input-idx="${currentInputIndex}"] input`);
    if (eltInput) {
        eltInput.value = value;
    }
};
exports.addNewInputWithValue = addNewInputWithValue;
const resetInputs = function () {
    const inputs = inputsElt.querySelectorAll('.input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].remove();
    }
    numInputs = 0;
    (0, controller_1.setNumInputs)(numInputs);
    currentInputIndex = 0;
    (0, controller_1.resetPlots)();
};
exports.resetInputs = resetInputs;
const getInputFromIndex = function (idx) {
    return inputsElt.querySelector(`.input[data-input-idx="${idx}"]`);
};
const inputSetColorAt = function (idx, color) {
    var _a;
    (_a = getInputFromIndex(idx)) === null || _a === void 0 ? void 0 : _a.setAttribute('data-color', color);
};
exports.inputSetColorAt = inputSetColorAt;
const inputSetErrorAt = function (idx, error) {
    const elt = getInputFromIndex(idx);
    if (!elt)
        return;
    const indicator = elt.querySelector('.indicator');
    if (!indicator)
        return;
    indicator.setAttribute('data-error', error);
};
exports.inputSetErrorAt = inputSetErrorAt;
const inputSetConstEvalAt = function (idx, constEval) {
    const elt = getInputFromIndex(idx);
    if (!elt)
        return;
    const constEvalElt = elt.querySelector('.const-eval');
    if (!constEvalElt)
        return;
    constEvalElt.innerText = '= ' + typeof constEval === 'number' ? constEval.toString() : (0, utils_1.complexToString)(constEval);
    constEvalElt.classList.add('visible');
};
exports.inputSetConstEvalAt = inputSetConstEvalAt;
const inputSetStatusAt = function (idx, status) {
    const elt = getInputFromIndex(idx);
    if (!elt)
        return;
    const indicator = elt.querySelector('.indicator');
    if (!indicator)
        return;
    indicator.classList.remove('pending', 'active', 'error');
    const constEvalElt = elt.querySelector('.const-eval');
    if (!constEvalElt)
        return;
    switch (status) {
        case defines_1.PlotStatus.PENDING:
            indicator.classList.add('pending');
            indicator.innerHTML = '';
            constEvalElt.classList.remove('visible');
            break;
        case defines_1.PlotStatus.ACTIVE:
            indicator.classList.add('active');
            indicator.style.backgroundColor = elt.getAttribute('data-color') || '#000';
            indicator.innerHTML = '';
            break;
        case defines_1.PlotStatus.ERROR:
            indicator.classList.add('error');
            indicator.innerHTML = '!';
            constEvalElt.classList.remove('visible');
            break;
    }
};
exports.inputSetStatusAt = inputSetStatusAt;
const inputSetDriverAt = function (idx, driver) {
    const elt = getInputFromIndex(idx);
    if (!elt)
        return;
    const constEvalElt = elt.querySelector('.const-eval');
    if (!constEvalElt)
        return;
    if (driver !== defines_1.PlotDriver.CONSTANT) {
        constEvalElt.classList.remove('visible');
    }
};
exports.inputSetDriverAt = inputSetDriverAt;
const activateInput = function (elt) {
    inputsElt.querySelectorAll('.input').forEach((elt) => {
        elt.classList.remove('active');
    });
    elt.classList.add('active');
};
const getLeftPanelWidth = function () {
    return leftPanel.offsetWidth;
};
exports.getLeftPanelWidth = getLeftPanelWidth;


/***/ }),

/***/ "./src/app/ui/menubar.ts":
/*!*******************************!*\
  !*** ./src/app/ui/menubar.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initMenuBar = void 0;
const controller_1 = __webpack_require__(/*! ../core/controller */ "./src/app/core/controller.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/app/utils.ts");
const menuBar = document.getElementById('menu-bar');
const initMenuBar = function () {
    const menuBarButtons = Array.from(menuBar.querySelectorAll('button'));
    menuBarButtons.forEach((button) => {
        const icon = button.dataset.icon || '';
        const href = button.dataset.href || '';
        const filter = button.dataset.filter || '';
        if (icon && href) {
            const iconStr = '<div class="button-icon"></div>';
            const iconElt = (0, utils_1.stringToHTML)(iconStr).firstChild;
            iconElt.style.backgroundImage = `url('${icon}')`;
            iconElt.style.filter = filter;
            button.appendChild(iconElt);
            button.addEventListener('click', () => {
                window.open(href, '_blank');
            });
        }
    });
    const demoButton = document.querySelector('.demo-button');
    const examplesList = document.querySelector('.examples-list');
    let exampleJson;
    let numExamples = 0;
    fetch('assets/demo/demo.json').then((response) => {
        return response.json();
    }).then((data) => {
        var _a;
        exampleJson = data;
        numExamples = data === null || data === void 0 ? void 0 : data.numPlots;
        for (let i = 0; i < numExamples; i++) {
            let container = document.createElement('div');
            container.innerHTML = (_a = data === null || data === void 0 ? void 0 : data.plots[i]) === null || _a === void 0 ? void 0 : _a.name;
            container.classList.add('example-list-item');
            container.addEventListener('click', () => {
                var _a, _b;
                (0, controller_1.loadPlots)(((_a = exampleJson === null || exampleJson === void 0 ? void 0 : exampleJson.plots[i]) === null || _a === void 0 ? void 0 : _a.inputs) || '', ((_b = exampleJson === null || exampleJson === void 0 ? void 0 : exampleJson.plots[i]) === null || _b === void 0 ? void 0 : _b.defaults) || '');
            });
            examplesList.appendChild(container);
        }
    });
    demoButton.addEventListener('click', () => {
        examplesList.classList.toggle('hidden');
    });
};
exports.initMenuBar = initMenuBar;


/***/ }),

/***/ "./src/app/ui/userInteract.ts":
/*!************************************!*\
  !*** ./src/app/ui/userInteract.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initUserInteract = exports.onMouseDrag = exports.getMousePos = void 0;
const utils_1 = __webpack_require__(/*! ../utils */ "./src/app/utils.ts");
let mouseClaimed = false;
let mouseDown = false;
let claimedCallback;
const mousePos = new utils_1.Vector(0, 0);
const mouseCallbacks = new Map();
const getMousePos = function () {
    return mousePos;
};
exports.getMousePos = getMousePos;
const onMouseDrag = function (elt, callback) {
    mouseCallbacks.set(elt, callback);
};
exports.onMouseDrag = onMouseDrag;
const initUserInteract = function () {
    document.addEventListener('mousedown', function (e) {
        mouseDown = true;
    });
    document.addEventListener('mousemove', function (e) {
        if (!mouseDown)
            return;
        mousePos.set(e.clientX, e.clientY);
        if (mouseClaimed) {
            claimedCallback(mousePos);
            return;
        }
        for (const [elt, callback] of mouseCallbacks) {
            if (elt === null || elt === void 0 ? void 0 : elt.contains(e.target)) {
                callback(mousePos);
                mouseClaimed = true;
                claimedCallback = callback;
                return;
            }
        }
    });
    document.addEventListener('mouseup', function (e) {
        mouseClaimed = false;
        mouseDown = false;
    });
};
exports.initUserInteract = initUserInteract;


/***/ }),

/***/ "./src/app/utils.ts":
/*!**************************!*\
  !*** ./src/app/utils.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.map = exports.sigmoid = exports.factorial = exports.perlin2 = exports.cpx = exports.complexToString = exports.Vector = exports.stringToHTML = void 0;
const stringToHTML = function (str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};
exports.stringToHTML = stringToHTML;
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.Vector = Vector;
const complexToString = function (c) {
    const re = Math.round(c.re * 1000000) / 1000000;
    const im = Math.round(c.im * 1000000) / 1000000;
    return im === 0 ? re.toString() : (re + ' + ' + im + 'i');
};
exports.complexToString = complexToString;
const cpx = (num) => ({ re: num, im: 0 });
exports.cpx = cpx;
const perm = new Array(512);
const gradP = new Array(512);
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
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
class Grad {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
const grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
    new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
    new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];
const seed = function (seed) {
    if (seed > 0 && seed < 1) {
        seed *= 65536;
    }
    seed = Math.floor(seed);
    if (seed < 256) {
        seed |= seed << 8;
    }
    for (let i = 0; i < 256; i++) {
        let v;
        if (i & 1) {
            v = p[i] ^ (seed & 255);
        }
        else {
            v = p[i] ^ ((seed >> 8) & 255);
        }
        perm[i] = perm[i + 256] = v;
        gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
};
seed(12345);
function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}
const perlin2 = function (x, y) {
    let X = Math.floor(x);
    let Y = Math.floor(y);
    x = x - X;
    y = y - Y;
    X = X & 255;
    Y = Y & 255;
    const n00 = gradP[X + perm[Y]].dot2(x, y);
    const n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
    const n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
    const n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);
    const u = fade(x);
    return lerp(lerp(n00, n10, u), lerp(n01, n11, u), fade(y));
};
exports.perlin2 = perlin2;
const factorial01 = function (x) {
    return (((((0.07288448978215456 * x - 0.31390051543712616) * x + 0.6538907084614038) * x - 0.810425715520978) * x + 0.9737655441276729) * x - 0.5761851668648887) * x + 0.9999830044034752;
};
const factorial = function (x) {
    const h = Math.floor(x);
    const f = x - h;
    let y = factorial01(f);
    if (x < 0)
        for (let n = 0; n < -h; n++)
            y /= f - n;
    else
        for (let n = 1; n < h + 1; n++)
            y *= f + n;
    return x > 0 ? y : Infinity;
};
exports.factorial = factorial;
const sigmoid = function (x) {
    return 1 / (1 + Math.exp(-x));
};
exports.sigmoid = sigmoid;
const constrain = function (n, low, high) {
    return Math.max(Math.min(n, high), low);
};
const map = function (n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};
exports.map = map;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getGlobalTime = exports.scheduleRedraw = void 0;
const leftPanel_1 = __webpack_require__(/*! ./app/ui/leftPanel */ "./src/app/ui/leftPanel.ts");
const menubar_1 = __webpack_require__(/*! ./app/ui/menubar */ "./src/app/ui/menubar.ts");
const canvasCore_1 = __webpack_require__(/*! ./app/canvas/canvasCore */ "./src/app/canvas/canvasCore.ts");
const userInteract_1 = __webpack_require__(/*! ./app/ui/userInteract */ "./src/app/ui/userInteract.ts");
const controller_1 = __webpack_require__(/*! ./app/core/controller */ "./src/app/core/controller.ts");
const shaderCore_1 = __webpack_require__(/*! ./app/shader/shaderCore */ "./src/app/shader/shaderCore.ts");
let drawFrame = true;
let frameTime = 0;
const scheduleRedraw = function () {
    drawFrame = true;
};
exports.scheduleRedraw = scheduleRedraw;
const getGlobalTime = () => frameTime;
exports.getGlobalTime = getGlobalTime;
window.onload = function () {
    (0, userInteract_1.initUserInteract)();
    (0, menubar_1.initMenuBar)();
    (0, leftPanel_1.initLeftPanel)();
    (0, canvasCore_1.initCanvas)();
    (0, shaderCore_1.initShaderCore)();
    mainLoop();
};
const mainLoop = function () {
    if (drawFrame) {
        drawFrame = false;
        (0, canvasCore_1.canvasDraw)();
        (0, shaderCore_1.shadersDraw)();
        (0, controller_1.drawPlots)();
    }
    (0, controller_1.drivePlots)();
    (0, shaderCore_1.shaderCoreUpdate)();
    frameTime += 0.01;
    requestAnimationFrame(mainLoop);
};


/***/ }),

/***/ "./src/app/lib/gl-matrix/common.js":
/*!*****************************************!*\
  !*** ./src/app/lib/gl-matrix/common.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ANGLE_ORDER": () => (/* binding */ ANGLE_ORDER),
/* harmony export */   "ARRAY_TYPE": () => (/* binding */ ARRAY_TYPE),
/* harmony export */   "EPSILON": () => (/* binding */ EPSILON),
/* harmony export */   "RANDOM": () => (/* binding */ RANDOM),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "setMatrixArrayType": () => (/* binding */ setMatrixArrayType),
/* harmony export */   "toRadian": () => (/* binding */ toRadian)
/* harmony export */ });
/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array
var RANDOM = Math.random
var ANGLE_ORDER = 'zyx'
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */

function setMatrixArrayType (type) {
  ARRAY_TYPE = type
}
const degree = Math.PI / 180
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */

function toRadian (a) {
  return a * degree
}
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

function equals (a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b))
}
if (!Math.hypot) {
 Math.hypot = function () {
  let y = 0
      let i = arguments.length

  while (i--) {
    y += arguments[i] * arguments[i]
  }

  return Math.sqrt(y)
}
}


/***/ }),

/***/ "./src/app/lib/gl-matrix/mat4.js":
/*!***************************************!*\
  !*** ./src/app/lib/gl-matrix/mat4.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "adjoint": () => (/* binding */ adjoint),
/* harmony export */   "clone": () => (/* binding */ clone),
/* harmony export */   "copy": () => (/* binding */ copy),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "decompose": () => (/* binding */ decompose),
/* harmony export */   "determinant": () => (/* binding */ determinant),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "exactEquals": () => (/* binding */ exactEquals),
/* harmony export */   "frob": () => (/* binding */ frob),
/* harmony export */   "fromQuat": () => (/* binding */ fromQuat),
/* harmony export */   "fromQuat2": () => (/* binding */ fromQuat2),
/* harmony export */   "fromRotation": () => (/* binding */ fromRotation),
/* harmony export */   "fromRotationTranslation": () => (/* binding */ fromRotationTranslation),
/* harmony export */   "fromRotationTranslationScale": () => (/* binding */ fromRotationTranslationScale),
/* harmony export */   "fromRotationTranslationScaleOrigin": () => (/* binding */ fromRotationTranslationScaleOrigin),
/* harmony export */   "fromScaling": () => (/* binding */ fromScaling),
/* harmony export */   "fromTranslation": () => (/* binding */ fromTranslation),
/* harmony export */   "fromValues": () => (/* binding */ fromValues),
/* harmony export */   "fromXRotation": () => (/* binding */ fromXRotation),
/* harmony export */   "fromYRotation": () => (/* binding */ fromYRotation),
/* harmony export */   "fromZRotation": () => (/* binding */ fromZRotation),
/* harmony export */   "frustum": () => (/* binding */ frustum),
/* harmony export */   "getRotation": () => (/* binding */ getRotation),
/* harmony export */   "getScaling": () => (/* binding */ getScaling),
/* harmony export */   "getTranslation": () => (/* binding */ getTranslation),
/* harmony export */   "identity": () => (/* binding */ identity),
/* harmony export */   "invert": () => (/* binding */ invert),
/* harmony export */   "lookAt": () => (/* binding */ lookAt),
/* harmony export */   "mul": () => (/* binding */ mul),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "multiplyScalar": () => (/* binding */ multiplyScalar),
/* harmony export */   "multiplyScalarAndAdd": () => (/* binding */ multiplyScalarAndAdd),
/* harmony export */   "ortho": () => (/* binding */ ortho),
/* harmony export */   "orthoNO": () => (/* binding */ orthoNO),
/* harmony export */   "orthoZO": () => (/* binding */ orthoZO),
/* harmony export */   "perspective": () => (/* binding */ perspective),
/* harmony export */   "perspectiveFromFieldOfView": () => (/* binding */ perspectiveFromFieldOfView),
/* harmony export */   "perspectiveNO": () => (/* binding */ perspectiveNO),
/* harmony export */   "perspectiveZO": () => (/* binding */ perspectiveZO),
/* harmony export */   "rotate": () => (/* binding */ rotate),
/* harmony export */   "rotateX": () => (/* binding */ rotateX),
/* harmony export */   "rotateY": () => (/* binding */ rotateY),
/* harmony export */   "rotateZ": () => (/* binding */ rotateZ),
/* harmony export */   "scale": () => (/* binding */ scale),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "str": () => (/* binding */ str),
/* harmony export */   "sub": () => (/* binding */ sub),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "targetTo": () => (/* binding */ targetTo),
/* harmony export */   "translate": () => (/* binding */ translate),
/* harmony export */   "transpose": () => (/* binding */ transpose)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./src/app/lib/gl-matrix/common.js");

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create () {
  const out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16)

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[1] = 0
    out[2] = 0
    out[3] = 0
    out[4] = 0
    out[6] = 0
    out[7] = 0
    out[8] = 0
    out[9] = 0
    out[11] = 0
    out[12] = 0
    out[13] = 0
    out[14] = 0
  }

  out[0] = 1
  out[5] = 1
  out[10] = 1
  out[15] = 1
  return out
}
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */

function clone (a) {
  const out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16)
  out[0] = a[0]
  out[1] = a[1]
  out[2] = a[2]
  out[3] = a[3]
  out[4] = a[4]
  out[5] = a[5]
  out[6] = a[6]
  out[7] = a[7]
  out[8] = a[8]
  out[9] = a[9]
  out[10] = a[10]
  out[11] = a[11]
  out[12] = a[12]
  out[13] = a[13]
  out[14] = a[14]
  out[15] = a[15]
  return out
}
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function copy (out, a) {
  out[0] = a[0]
  out[1] = a[1]
  out[2] = a[2]
  out[3] = a[3]
  out[4] = a[4]
  out[5] = a[5]
  out[6] = a[6]
  out[7] = a[7]
  out[8] = a[8]
  out[9] = a[9]
  out[10] = a[10]
  out[11] = a[11]
  out[12] = a[12]
  out[13] = a[13]
  out[14] = a[14]
  out[15] = a[15]
  return out
}
/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */

function fromValues (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  const out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16)
  out[0] = m00
  out[1] = m01
  out[2] = m02
  out[3] = m03
  out[4] = m10
  out[5] = m11
  out[6] = m12
  out[7] = m13
  out[8] = m20
  out[9] = m21
  out[10] = m22
  out[11] = m23
  out[12] = m30
  out[13] = m31
  out[14] = m32
  out[15] = m33
  return out
}
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */

function set (out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00
  out[1] = m01
  out[2] = m02
  out[3] = m03
  out[4] = m10
  out[5] = m11
  out[6] = m12
  out[7] = m13
  out[8] = m20
  out[9] = m21
  out[10] = m22
  out[11] = m23
  out[12] = m30
  out[13] = m31
  out[14] = m32
  out[15] = m33
  return out
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity (out) {
  out[0] = 1
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = 1
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = 1
  out[11] = 0
  out[12] = 0
  out[13] = 0
  out[14] = 0
  out[15] = 1
  return out
}
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function transpose (out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    const a01 = a[1]
        const a02 = a[2]
        const a03 = a[3]
    const a12 = a[6]
        const a13 = a[7]
    const a23 = a[11]
    out[1] = a[4]
    out[2] = a[8]
    out[3] = a[12]
    out[4] = a01
    out[6] = a[9]
    out[7] = a[13]
    out[8] = a02
    out[9] = a12
    out[11] = a[14]
    out[12] = a03
    out[13] = a13
    out[14] = a23
  } else {
    out[0] = a[0]
    out[1] = a[4]
    out[2] = a[8]
    out[3] = a[12]
    out[4] = a[1]
    out[5] = a[5]
    out[6] = a[9]
    out[7] = a[13]
    out[8] = a[2]
    out[9] = a[6]
    out[10] = a[10]
    out[11] = a[14]
    out[12] = a[3]
    out[13] = a[7]
    out[14] = a[11]
    out[15] = a[15]
  }

  return out
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function invert (out, a) {
  const a00 = a[0]
      const a01 = a[1]
      const a02 = a[2]
      const a03 = a[3]
  const a10 = a[4]
      const a11 = a[5]
      const a12 = a[6]
      const a13 = a[7]
  const a20 = a[8]
      const a21 = a[9]
      const a22 = a[10]
      const a23 = a[11]
  const a30 = a[12]
      const a31 = a[13]
      const a32 = a[14]
      const a33 = a[15]
  const b00 = a00 * a11 - a01 * a10
  const b01 = a00 * a12 - a02 * a10
  const b02 = a00 * a13 - a03 * a10
  const b03 = a01 * a12 - a02 * a11
  const b04 = a01 * a13 - a03 * a11
  const b05 = a02 * a13 - a03 * a12
  const b06 = a20 * a31 - a21 * a30
  const b07 = a20 * a32 - a22 * a30
  const b08 = a20 * a33 - a23 * a30
  const b09 = a21 * a32 - a22 * a31
  const b10 = a21 * a33 - a23 * a31
  const b11 = a22 * a33 - a23 * a32 // Calculate the determinant

  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

  if (!det) {
    return null
  }

  det = 1.0 / det
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det
  return out
}
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function adjoint (out, a) {
  const a00 = a[0]
      const a01 = a[1]
      const a02 = a[2]
      const a03 = a[3]
  const a10 = a[4]
      const a11 = a[5]
      const a12 = a[6]
      const a13 = a[7]
  const a20 = a[8]
      const a21 = a[9]
      const a22 = a[10]
      const a23 = a[11]
  const a30 = a[12]
      const a31 = a[13]
      const a32 = a[14]
      const a33 = a[15]
  const b00 = a00 * a11 - a01 * a10
  const b01 = a00 * a12 - a02 * a10
  const b02 = a00 * a13 - a03 * a10
  const b03 = a01 * a12 - a02 * a11
  const b04 = a01 * a13 - a03 * a11
  const b05 = a02 * a13 - a03 * a12
  const b06 = a20 * a31 - a21 * a30
  const b07 = a20 * a32 - a22 * a30
  const b08 = a20 * a33 - a23 * a30
  const b09 = a21 * a32 - a22 * a31
  const b10 = a21 * a33 - a23 * a31
  const b11 = a22 * a33 - a23 * a32
  out[0] = a11 * b11 - a12 * b10 + a13 * b09
  out[1] = a02 * b10 - a01 * b11 - a03 * b09
  out[2] = a31 * b05 - a32 * b04 + a33 * b03
  out[3] = a22 * b04 - a21 * b05 - a23 * b03
  out[4] = a12 * b08 - a10 * b11 - a13 * b07
  out[5] = a00 * b11 - a02 * b08 + a03 * b07
  out[6] = a32 * b02 - a30 * b05 - a33 * b01
  out[7] = a20 * b05 - a22 * b02 + a23 * b01
  out[8] = a10 * b10 - a11 * b08 + a13 * b06
  out[9] = a01 * b08 - a00 * b10 - a03 * b06
  out[10] = a30 * b04 - a31 * b02 + a33 * b00
  out[11] = a21 * b02 - a20 * b04 - a23 * b00
  out[12] = a11 * b07 - a10 * b09 - a12 * b06
  out[13] = a00 * b09 - a01 * b07 + a02 * b06
  out[14] = a31 * b01 - a30 * b03 - a32 * b00
  out[15] = a20 * b03 - a21 * b01 + a22 * b00
  return out
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {ReadonlyMat4} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant (a) {
  const a00 = a[0]
      const a01 = a[1]
      const a02 = a[2]
      const a03 = a[3]
  const a10 = a[4]
      const a11 = a[5]
      const a12 = a[6]
      const a13 = a[7]
  const a20 = a[8]
      const a21 = a[9]
      const a22 = a[10]
      const a23 = a[11]
  const a30 = a[12]
      const a31 = a[13]
      const a32 = a[14]
      const a33 = a[15]
  const b0 = a00 * a11 - a01 * a10
  const b1 = a00 * a12 - a02 * a10
  const b2 = a01 * a12 - a02 * a11
  const b3 = a20 * a31 - a21 * a30
  const b4 = a20 * a32 - a22 * a30
  const b5 = a21 * a32 - a22 * a31
  const b6 = a00 * b5 - a01 * b4 + a02 * b3
  const b7 = a10 * b5 - a11 * b4 + a12 * b3
  const b8 = a20 * b2 - a21 * b1 + a22 * b0
  const b9 = a30 * b2 - a31 * b1 + a32 * b0 // Calculate the determinant

  return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply (out, a, b) {
  const a00 = a[0]
      const a01 = a[1]
      const a02 = a[2]
      const a03 = a[3]
  const a10 = a[4]
      const a11 = a[5]
      const a12 = a[6]
      const a13 = a[7]
  const a20 = a[8]
      const a21 = a[9]
      const a22 = a[10]
      const a23 = a[11]
  const a30 = a[12]
      const a31 = a[13]
      const a32 = a[14]
      const a33 = a[15] // Cache only the current line of the second matrix

  let b0 = b[0]
      let b1 = b[1]
      let b2 = b[2]
      let b3 = b[3]
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
  b0 = b[4]
  b1 = b[5]
  b2 = b[6]
  b3 = b[7]
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
  b0 = b[8]
  b1 = b[9]
  b2 = b[10]
  b3 = b[11]
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
  b0 = b[12]
  b1 = b[13]
  b2 = b[14]
  b3 = b[15]
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
  return out
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate (out, a, v) {
  const x = v[0]
      const y = v[1]
      const z = v[2]
  let a00, a01, a02, a03
  let a10, a11, a12, a13
  let a20, a21, a22, a23

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12]
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13]
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14]
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15]
  } else {
    a00 = a[0]
    a01 = a[1]
    a02 = a[2]
    a03 = a[3]
    a10 = a[4]
    a11 = a[5]
    a12 = a[6]
    a13 = a[7]
    a20 = a[8]
    a21 = a[9]
    a22 = a[10]
    a23 = a[11]
    out[0] = a00
    out[1] = a01
    out[2] = a02
    out[3] = a03
    out[4] = a10
    out[5] = a11
    out[6] = a12
    out[7] = a13
    out[8] = a20
    out[9] = a21
    out[10] = a22
    out[11] = a23
    out[12] = a00 * x + a10 * y + a20 * z + a[12]
    out[13] = a01 * x + a11 * y + a21 * z + a[13]
    out[14] = a02 * x + a12 * y + a22 * z + a[14]
    out[15] = a03 * x + a13 * y + a23 * z + a[15]
  }

  return out
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale (out, a, v) {
  const x = v[0]
      const y = v[1]
      const z = v[2]
  out[0] = a[0] * x
  out[1] = a[1] * x
  out[2] = a[2] * x
  out[3] = a[3] * x
  out[4] = a[4] * y
  out[5] = a[5] * y
  out[6] = a[6] * y
  out[7] = a[7] * y
  out[8] = a[8] * z
  out[9] = a[9] * z
  out[10] = a[10] * z
  out[11] = a[11] * z
  out[12] = a[12]
  out[13] = a[13]
  out[14] = a[14]
  out[15] = a[15]
  return out
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate (out, a, rad, axis) {
  let x = axis[0]
      let y = axis[1]
      let z = axis[2]
  let len = Math.hypot(x, y, z)
  let s, c, t
  let a00, a01, a02, a03
  let a10, a11, a12, a13
  let a20, a21, a22, a23
  let b00, b01, b02
  let b10, b11, b12
  let b20, b21, b22

  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return null
  }

  len = 1 / len
  x *= len
  y *= len
  z *= len
  s = Math.sin(rad)
  c = Math.cos(rad)
  t = 1 - c
  a00 = a[0]
  a01 = a[1]
  a02 = a[2]
  a03 = a[3]
  a10 = a[4]
  a11 = a[5]
  a12 = a[6]
  a13 = a[7]
  a20 = a[8]
  a21 = a[9]
  a22 = a[10]
  a23 = a[11] // Construct the elements of the rotation matrix

  b00 = x * x * t + c
  b01 = y * x * t + z * s
  b02 = z * x * t - y * s
  b10 = x * y * t - z * s
  b11 = y * y * t + c
  b12 = z * y * t + x * s
  b20 = x * z * t + y * s
  b21 = y * z * t - x * s
  b22 = z * z * t + c // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02
  out[1] = a01 * b00 + a11 * b01 + a21 * b02
  out[2] = a02 * b00 + a12 * b01 + a22 * b02
  out[3] = a03 * b00 + a13 * b01 + a23 * b02
  out[4] = a00 * b10 + a10 * b11 + a20 * b12
  out[5] = a01 * b10 + a11 * b11 + a21 * b12
  out[6] = a02 * b10 + a12 * b11 + a22 * b12
  out[7] = a03 * b10 + a13 * b11 + a23 * b12
  out[8] = a00 * b20 + a10 * b21 + a20 * b22
  out[9] = a01 * b20 + a11 * b21 + a21 * b22
  out[10] = a02 * b20 + a12 * b21 + a22 * b22
  out[11] = a03 * b20 + a13 * b21 + a23 * b22

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12]
    out[13] = a[13]
    out[14] = a[14]
    out[15] = a[15]
  }

  return out
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX (out, a, rad) {
  const s = Math.sin(rad)
  const c = Math.cos(rad)
  const a10 = a[4]
  const a11 = a[5]
  const a12 = a[6]
  const a13 = a[7]
  const a20 = a[8]
  const a21 = a[9]
  const a22 = a[10]
  const a23 = a[11]

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    out[3] = a[3]
    out[12] = a[12]
    out[13] = a[13]
    out[14] = a[14]
    out[15] = a[15]
  } // Perform axis-specific matrix multiplication

  out[4] = a10 * c + a20 * s
  out[5] = a11 * c + a21 * s
  out[6] = a12 * c + a22 * s
  out[7] = a13 * c + a23 * s
  out[8] = a20 * c - a10 * s
  out[9] = a21 * c - a11 * s
  out[10] = a22 * c - a12 * s
  out[11] = a23 * c - a13 * s
  return out
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY (out, a, rad) {
  const s = Math.sin(rad)
  const c = Math.cos(rad)
  const a00 = a[0]
  const a01 = a[1]
  const a02 = a[2]
  const a03 = a[3]
  const a20 = a[8]
  const a21 = a[9]
  const a22 = a[10]
  const a23 = a[11]

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4]
    out[5] = a[5]
    out[6] = a[6]
    out[7] = a[7]
    out[12] = a[12]
    out[13] = a[13]
    out[14] = a[14]
    out[15] = a[15]
  } // Perform axis-specific matrix multiplication

  out[0] = a00 * c - a20 * s
  out[1] = a01 * c - a21 * s
  out[2] = a02 * c - a22 * s
  out[3] = a03 * c - a23 * s
  out[8] = a00 * s + a20 * c
  out[9] = a01 * s + a21 * c
  out[10] = a02 * s + a22 * c
  out[11] = a03 * s + a23 * c
  return out
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ (out, a, rad) {
  const s = Math.sin(rad)
  const c = Math.cos(rad)
  const a00 = a[0]
  const a01 = a[1]
  const a02 = a[2]
  const a03 = a[3]
  const a10 = a[4]
  const a11 = a[5]
  const a12 = a[6]
  const a13 = a[7]

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8]
    out[9] = a[9]
    out[10] = a[10]
    out[11] = a[11]
    out[12] = a[12]
    out[13] = a[13]
    out[14] = a[14]
    out[15] = a[15]
  } // Perform axis-specific matrix multiplication

  out[0] = a00 * c + a10 * s
  out[1] = a01 * c + a11 * s
  out[2] = a02 * c + a12 * s
  out[3] = a03 * c + a13 * s
  out[4] = a10 * c - a00 * s
  out[5] = a11 * c - a01 * s
  out[6] = a12 * c - a02 * s
  out[7] = a13 * c - a03 * s
  return out
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromTranslation (out, v) {
  out[0] = 1
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = 1
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = 1
  out[11] = 0
  out[12] = v[0]
  out[13] = v[1]
  out[14] = v[2]
  out[15] = 1
  return out
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Scaling vector
 * @returns {mat4} out
 */

function fromScaling (out, v) {
  out[0] = v[0]
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = v[1]
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = v[2]
  out[11] = 0
  out[12] = 0
  out[13] = 0
  out[14] = 0
  out[15] = 1
  return out
}
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function fromRotation (out, rad, axis) {
  let x = axis[0]
      let y = axis[1]
      let z = axis[2]
  let len = Math.hypot(x, y, z)
  let s, c, t

  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return null
  }

  len = 1 / len
  x *= len
  y *= len
  z *= len
  s = Math.sin(rad)
  c = Math.cos(rad)
  t = 1 - c // Perform rotation-specific matrix multiplication

  out[0] = x * x * t + c
  out[1] = y * x * t + z * s
  out[2] = z * x * t - y * s
  out[3] = 0
  out[4] = x * y * t - z * s
  out[5] = y * y * t + c
  out[6] = z * y * t + x * s
  out[7] = 0
  out[8] = x * z * t + y * s
  out[9] = y * z * t - x * s
  out[10] = z * z * t + c
  out[11] = 0
  out[12] = 0
  out[13] = 0
  out[14] = 0
  out[15] = 1
  return out
}
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromXRotation (out, rad) {
  const s = Math.sin(rad)
  const c = Math.cos(rad) // Perform axis-specific matrix multiplication

  out[0] = 1
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = c
  out[6] = s
  out[7] = 0
  out[8] = 0
  out[9] = -s
  out[10] = c
  out[11] = 0
  out[12] = 0
  out[13] = 0
  out[14] = 0
  out[15] = 1
  return out
}
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromYRotation (out, rad) {
  const s = Math.sin(rad)
  const c = Math.cos(rad) // Perform axis-specific matrix multiplication

  out[0] = c
  out[1] = 0
  out[2] = -s
  out[3] = 0
  out[4] = 0
  out[5] = 1
  out[6] = 0
  out[7] = 0
  out[8] = s
  out[9] = 0
  out[10] = c
  out[11] = 0
  out[12] = 0
  out[13] = 0
  out[14] = 0
  out[15] = 1
  return out
}
/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromZRotation (out, rad) {
  const s = Math.sin(rad)
  const c = Math.cos(rad) // Perform axis-specific matrix multiplication

  out[0] = c
  out[1] = s
  out[2] = 0
  out[3] = 0
  out[4] = -s
  out[5] = c
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = 1
  out[11] = 0
  out[12] = 0
  out[13] = 0
  out[14] = 0
  out[15] = 1
  return out
}
/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromRotationTranslation (out, q, v) {
  // Quaternion math
  const x = q[0]
      const y = q[1]
      const z = q[2]
      const w = q[3]
  const x2 = x + x
  const y2 = y + y
  const z2 = z + z
  const xx = x * x2
  const xy = x * y2
  const xz = x * z2
  const yy = y * y2
  const yz = y * z2
  const zz = z * z2
  const wx = w * x2
  const wy = w * y2
  const wz = w * z2
  out[0] = 1 - (yy + zz)
  out[1] = xy + wz
  out[2] = xz - wy
  out[3] = 0
  out[4] = xy - wz
  out[5] = 1 - (xx + zz)
  out[6] = yz + wx
  out[7] = 0
  out[8] = xz + wy
  out[9] = yz - wx
  out[10] = 1 - (xx + yy)
  out[11] = 0
  out[12] = v[0]
  out[13] = v[1]
  out[14] = v[2]
  out[15] = 1
  return out
}
/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {ReadonlyQuat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */

function fromQuat2 (out, a) {
  const translation = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3)
  const bx = -a[0]
      const by = -a[1]
      const bz = -a[2]
      const bw = a[3]
      const ax = a[4]
      const ay = a[5]
      const az = a[6]
      const aw = a[7]
  const magnitude = bx * bx + by * by + bz * bz + bw * bw // Only scale if it makes sense

  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2
  }

  fromRotationTranslation(out, a, translation)
  return out
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getTranslation (out, mat) {
  out[0] = mat[12]
  out[1] = mat[13]
  out[2] = mat[14]
  return out
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getScaling (out, mat) {
  const m11 = mat[0]
  const m12 = mat[1]
  const m13 = mat[2]
  const m21 = mat[4]
  const m22 = mat[5]
  const m23 = mat[6]
  const m31 = mat[8]
  const m32 = mat[9]
  const m33 = mat[10]
  out[0] = Math.hypot(m11, m12, m13)
  out[1] = Math.hypot(m21, m22, m23)
  out[2] = Math.hypot(m31, m32, m33)
  return out
}
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */

function getRotation (out, mat) {
  const scaling = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3)
  getScaling(scaling, mat)
  const is1 = 1 / scaling[0]
  const is2 = 1 / scaling[1]
  const is3 = 1 / scaling[2]
  const sm11 = mat[0] * is1
  const sm12 = mat[1] * is2
  const sm13 = mat[2] * is3
  const sm21 = mat[4] * is1
  const sm22 = mat[5] * is2
  const sm23 = mat[6] * is3
  const sm31 = mat[8] * is1
  const sm32 = mat[9] * is2
  const sm33 = mat[10] * is3
  const trace = sm11 + sm22 + sm33
  let S = 0

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2
    out[3] = 0.25 * S
    out[0] = (sm23 - sm32) / S
    out[1] = (sm31 - sm13) / S
    out[2] = (sm12 - sm21) / S
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2
    out[3] = (sm23 - sm32) / S
    out[0] = 0.25 * S
    out[1] = (sm12 + sm21) / S
    out[2] = (sm31 + sm13) / S
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2
    out[3] = (sm31 - sm13) / S
    out[0] = (sm12 + sm21) / S
    out[1] = 0.25 * S
    out[2] = (sm23 + sm32) / S
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2
    out[3] = (sm12 - sm21) / S
    out[0] = (sm31 + sm13) / S
    out[1] = (sm23 + sm32) / S
    out[2] = 0.25 * S
  }

  return out
}
/**
 * Decomposes a transformation matrix into its rotation, translation
 * and scale components. Returns only the rotation component
 * @param  {quat} out_r Quaternion to receive the rotation component
 * @param  {vec3} out_t Vector to receive the translation vector
 * @param  {vec3} out_s Vector to receive the scaling factor
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @returns {quat} out_r
 */

function decompose (out_r, out_t, out_s, mat) {
  out_t[0] = mat[12]
  out_t[1] = mat[13]
  out_t[2] = mat[14]
  const m11 = mat[0]
  const m12 = mat[1]
  const m13 = mat[2]
  const m21 = mat[4]
  const m22 = mat[5]
  const m23 = mat[6]
  const m31 = mat[8]
  const m32 = mat[9]
  const m33 = mat[10]
  out_s[0] = Math.hypot(m11, m12, m13)
  out_s[1] = Math.hypot(m21, m22, m23)
  out_s[2] = Math.hypot(m31, m32, m33)
  const is1 = 1 / out_s[0]
  const is2 = 1 / out_s[1]
  const is3 = 1 / out_s[2]
  const sm11 = m11 * is1
  const sm12 = m12 * is2
  const sm13 = m13 * is3
  const sm21 = m21 * is1
  const sm22 = m22 * is2
  const sm23 = m23 * is3
  const sm31 = m31 * is1
  const sm32 = m32 * is2
  const sm33 = m33 * is3
  const trace = sm11 + sm22 + sm33
  let S = 0

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2
    out_r[3] = 0.25 * S
    out_r[0] = (sm23 - sm32) / S
    out_r[1] = (sm31 - sm13) / S
    out_r[2] = (sm12 - sm21) / S
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2
    out_r[3] = (sm23 - sm32) / S
    out_r[0] = 0.25 * S
    out_r[1] = (sm12 + sm21) / S
    out_r[2] = (sm31 + sm13) / S
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2
    out_r[3] = (sm31 - sm13) / S
    out_r[0] = (sm12 + sm21) / S
    out_r[1] = 0.25 * S
    out_r[2] = (sm23 + sm32) / S
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2
    out_r[3] = (sm12 - sm21) / S
    out_r[0] = (sm31 + sm13) / S
    out_r[1] = (sm23 + sm32) / S
    out_r[2] = 0.25 * S
  }

  return out_r
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @returns {mat4} out
 */

function fromRotationTranslationScale (out, q, v, s) {
  // Quaternion math
  const x = q[0]
      const y = q[1]
      const z = q[2]
      const w = q[3]
  const x2 = x + x
  const y2 = y + y
  const z2 = z + z
  const xx = x * x2
  const xy = x * y2
  const xz = x * z2
  const yy = y * y2
  const yz = y * z2
  const zz = z * z2
  const wx = w * x2
  const wy = w * y2
  const wz = w * z2
  const sx = s[0]
  const sy = s[1]
  const sz = s[2]
  out[0] = (1 - (yy + zz)) * sx
  out[1] = (xy + wz) * sx
  out[2] = (xz - wy) * sx
  out[3] = 0
  out[4] = (xy - wz) * sy
  out[5] = (1 - (xx + zz)) * sy
  out[6] = (yz + wx) * sy
  out[7] = 0
  out[8] = (xz + wy) * sz
  out[9] = (yz - wx) * sz
  out[10] = (1 - (xx + yy)) * sz
  out[11] = 0
  out[12] = v[0]
  out[13] = v[1]
  out[14] = v[2]
  out[15] = 1
  return out
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */

function fromRotationTranslationScaleOrigin (out, q, v, s, o) {
  // Quaternion math
  const x = q[0]
      const y = q[1]
      const z = q[2]
      const w = q[3]
  const x2 = x + x
  const y2 = y + y
  const z2 = z + z
  const xx = x * x2
  const xy = x * y2
  const xz = x * z2
  const yy = y * y2
  const yz = y * z2
  const zz = z * z2
  const wx = w * x2
  const wy = w * y2
  const wz = w * z2
  const sx = s[0]
  const sy = s[1]
  const sz = s[2]
  const ox = o[0]
  const oy = o[1]
  const oz = o[2]
  const out0 = (1 - (yy + zz)) * sx
  const out1 = (xy + wz) * sx
  const out2 = (xz - wy) * sx
  const out4 = (xy - wz) * sy
  const out5 = (1 - (xx + zz)) * sy
  const out6 = (yz + wx) * sy
  const out8 = (xz + wy) * sz
  const out9 = (yz - wx) * sz
  const out10 = (1 - (xx + yy)) * sz
  out[0] = out0
  out[1] = out1
  out[2] = out2
  out[3] = 0
  out[4] = out4
  out[5] = out5
  out[6] = out6
  out[7] = 0
  out[8] = out8
  out[9] = out9
  out[10] = out10
  out[11] = 0
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz)
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz)
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz)
  out[15] = 1
  return out
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */

function fromQuat (out, q) {
  const x = q[0]
      const y = q[1]
      const z = q[2]
      const w = q[3]
  const x2 = x + x
  const y2 = y + y
  const z2 = z + z
  const xx = x * x2
  const yx = y * x2
  const yy = y * y2
  const zx = z * x2
  const zy = z * y2
  const zz = z * z2
  const wx = w * x2
  const wy = w * y2
  const wz = w * z2
  out[0] = 1 - yy - zz
  out[1] = yx + wz
  out[2] = zx - wy
  out[3] = 0
  out[4] = yx - wz
  out[5] = 1 - xx - zz
  out[6] = zy + wx
  out[7] = 0
  out[8] = zx + wy
  out[9] = zy - wx
  out[10] = 1 - xx - yy
  out[11] = 0
  out[12] = 0
  out[13] = 0
  out[14] = 0
  out[15] = 1
  return out
}
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */

function frustum (out, left, right, bottom, top, near, far) {
  const rl = 1 / (right - left)
  const tb = 1 / (top - bottom)
  const nf = 1 / (near - far)
  out[0] = near * 2 * rl
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = near * 2 * tb
  out[6] = 0
  out[7] = 0
  out[8] = (right + left) * rl
  out[9] = (top + bottom) * tb
  out[10] = (far + near) * nf
  out[11] = -1
  out[12] = 0
  out[13] = 0
  out[14] = far * near * 2 * nf
  out[15] = 0
  return out
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveNO (out, fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy / 2)
  out[0] = f / aspect
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = f
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[11] = -1
  out[12] = 0
  out[13] = 0
  out[15] = 0

  if (far != null && far !== Infinity) {
    const nf = 1 / (near - far)
    out[10] = (far + near) * nf
    out[14] = 2 * far * near * nf
  } else {
    out[10] = -1
    out[14] = -2 * near
  }

  return out
}
/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */

var perspective = perspectiveNO
/**
 * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveZO (out, fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy / 2)
  out[0] = f / aspect
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = f
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[11] = -1
  out[12] = 0
  out[13] = 0
  out[15] = 0

  if (far != null && far !== Infinity) {
    const nf = 1 / (near - far)
    out[10] = far * nf
    out[14] = far * near * nf
  } else {
    out[10] = -1
    out[14] = -near
  }

  return out
}
/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function perspectiveFromFieldOfView (out, fov, near, far) {
  const upTan = Math.tan(fov.upDegrees * Math.PI / 180.0)
  const downTan = Math.tan(fov.downDegrees * Math.PI / 180.0)
  const leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0)
  const rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0)
  const xScale = 2.0 / (leftTan + rightTan)
  const yScale = 2.0 / (upTan + downTan)
  out[0] = xScale
  out[1] = 0.0
  out[2] = 0.0
  out[3] = 0.0
  out[4] = 0.0
  out[5] = yScale
  out[6] = 0.0
  out[7] = 0.0
  out[8] = -((leftTan - rightTan) * xScale * 0.5)
  out[9] = (upTan - downTan) * yScale * 0.5
  out[10] = far / (near - far)
  out[11] = -1.0
  out[12] = 0.0
  out[13] = 0.0
  out[14] = far * near / (near - far)
  out[15] = 0.0
  return out
}
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoNO (out, left, right, bottom, top, near, far) {
  const lr = 1 / (left - right)
  const bt = 1 / (bottom - top)
  const nf = 1 / (near - far)
  out[0] = -2 * lr
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = -2 * bt
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = 2 * nf
  out[11] = 0
  out[12] = (left + right) * lr
  out[13] = (top + bottom) * bt
  out[14] = (far + near) * nf
  out[15] = 1
  return out
}
/**
 * Alias for {@link mat4.orthoNO}
 * @function
 */

var ortho = orthoNO
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoZO (out, left, right, bottom, top, near, far) {
  const lr = 1 / (left - right)
  const bt = 1 / (bottom - top)
  const nf = 1 / (near - far)
  out[0] = -2 * lr
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = -2 * bt
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = nf
  out[11] = 0
  out[12] = (left + right) * lr
  out[13] = (top + bottom) * bt
  out[14] = near * nf
  out[15] = 1
  return out
}
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt (out, eye, center, up) {
  let x0, x1, x2, y0, y1, y2, z0, z1, z2, len
  const eyex = eye[0]
  const eyey = eye[1]
  const eyez = eye[2]
  const upx = up[0]
  const upy = up[1]
  const upz = up[2]
  const centerx = center[0]
  const centery = center[1]
  const centerz = center[2]

  if (Math.abs(eyex - centerx) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON && Math.abs(eyey - centery) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON && Math.abs(eyez - centerz) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return identity(out)
  }

  z0 = eyex - centerx
  z1 = eyey - centery
  z2 = eyez - centerz
  len = 1 / Math.hypot(z0, z1, z2)
  z0 *= len
  z1 *= len
  z2 *= len
  x0 = upy * z2 - upz * z1
  x1 = upz * z0 - upx * z2
  x2 = upx * z1 - upy * z0
  len = Math.hypot(x0, x1, x2)

  if (!len) {
    x0 = 0
    x1 = 0
    x2 = 0
  } else {
    len = 1 / len
    x0 *= len
    x1 *= len
    x2 *= len
  }

  y0 = z1 * x2 - z2 * x1
  y1 = z2 * x0 - z0 * x2
  y2 = z0 * x1 - z1 * x0
  len = Math.hypot(y0, y1, y2)

  if (!len) {
    y0 = 0
    y1 = 0
    y2 = 0
  } else {
    len = 1 / len
    y0 *= len
    y1 *= len
    y2 *= len
  }

  out[0] = x0
  out[1] = y0
  out[2] = z0
  out[3] = 0
  out[4] = x1
  out[5] = y1
  out[6] = z1
  out[7] = 0
  out[8] = x2
  out[9] = y2
  out[10] = z2
  out[11] = 0
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez)
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez)
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez)
  out[15] = 1
  return out
}
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function targetTo (out, eye, target, up) {
  const eyex = eye[0]
      const eyey = eye[1]
      const eyez = eye[2]
      const upx = up[0]
      const upy = up[1]
      const upz = up[2]
  let z0 = eyex - target[0]
      let z1 = eyey - target[1]
      let z2 = eyez - target[2]
  let len = z0 * z0 + z1 * z1 + z2 * z2

  if (len > 0) {
    len = 1 / Math.sqrt(len)
    z0 *= len
    z1 *= len
    z2 *= len
  }

  let x0 = upy * z2 - upz * z1
      let x1 = upz * z0 - upx * z2
      let x2 = upx * z1 - upy * z0
  len = x0 * x0 + x1 * x1 + x2 * x2

  if (len > 0) {
    len = 1 / Math.sqrt(len)
    x0 *= len
    x1 *= len
    x2 *= len
  }

  out[0] = x0
  out[1] = x1
  out[2] = x2
  out[3] = 0
  out[4] = z1 * x2 - z2 * x1
  out[5] = z2 * x0 - z0 * x2
  out[6] = z0 * x1 - z1 * x0
  out[7] = 0
  out[8] = z0
  out[9] = z1
  out[10] = z2
  out[11] = 0
  out[12] = eyex
  out[13] = eyey
  out[14] = eyez
  out[15] = 1
  return out
}
/**
 * Returns a string representation of a mat4
 *
 * @param {ReadonlyMat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str (a) {
  return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')'
}
/**
 * Returns Frobenius norm of a mat4
 *
 * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob (a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15])
}
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function add (out, a, b) {
  out[0] = a[0] + b[0]
  out[1] = a[1] + b[1]
  out[2] = a[2] + b[2]
  out[3] = a[3] + b[3]
  out[4] = a[4] + b[4]
  out[5] = a[5] + b[5]
  out[6] = a[6] + b[6]
  out[7] = a[7] + b[7]
  out[8] = a[8] + b[8]
  out[9] = a[9] + b[9]
  out[10] = a[10] + b[10]
  out[11] = a[11] + b[11]
  out[12] = a[12] + b[12]
  out[13] = a[13] + b[13]
  out[14] = a[14] + b[14]
  out[15] = a[15] + b[15]
  return out
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function subtract (out, a, b) {
  out[0] = a[0] - b[0]
  out[1] = a[1] - b[1]
  out[2] = a[2] - b[2]
  out[3] = a[3] - b[3]
  out[4] = a[4] - b[4]
  out[5] = a[5] - b[5]
  out[6] = a[6] - b[6]
  out[7] = a[7] - b[7]
  out[8] = a[8] - b[8]
  out[9] = a[9] - b[9]
  out[10] = a[10] - b[10]
  out[11] = a[11] - b[11]
  out[12] = a[12] - b[12]
  out[13] = a[13] - b[13]
  out[14] = a[14] - b[14]
  out[15] = a[15] - b[15]
  return out
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */

function multiplyScalar (out, a, b) {
  out[0] = a[0] * b
  out[1] = a[1] * b
  out[2] = a[2] * b
  out[3] = a[3] * b
  out[4] = a[4] * b
  out[5] = a[5] * b
  out[6] = a[6] * b
  out[7] = a[7] * b
  out[8] = a[8] * b
  out[9] = a[9] * b
  out[10] = a[10] * b
  out[11] = a[11] * b
  out[12] = a[12] * b
  out[13] = a[13] * b
  out[14] = a[14] * b
  out[15] = a[15] * b
  return out
}
/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */

function multiplyScalarAndAdd (out, a, b, scale) {
  out[0] = a[0] + b[0] * scale
  out[1] = a[1] + b[1] * scale
  out[2] = a[2] + b[2] * scale
  out[3] = a[3] + b[3] * scale
  out[4] = a[4] + b[4] * scale
  out[5] = a[5] + b[5] * scale
  out[6] = a[6] + b[6] * scale
  out[7] = a[7] + b[7] * scale
  out[8] = a[8] + b[8] * scale
  out[9] = a[9] + b[9] * scale
  out[10] = a[10] + b[10] * scale
  out[11] = a[11] + b[11] * scale
  out[12] = a[12] + b[12] * scale
  out[13] = a[13] + b[13] * scale
  out[14] = a[14] + b[14] * scale
  out[15] = a[15] + b[15] * scale
  return out
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals (a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15]
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals (a, b) {
  const a0 = a[0]
      const a1 = a[1]
      const a2 = a[2]
      const a3 = a[3]
  const a4 = a[4]
      const a5 = a[5]
      const a6 = a[6]
      const a7 = a[7]
  const a8 = a[8]
      const a9 = a[9]
      const a10 = a[10]
      const a11 = a[11]
  const a12 = a[12]
      const a13 = a[13]
      const a14 = a[14]
      const a15 = a[15]
  const b0 = b[0]
      const b1 = b[1]
      const b2 = b[2]
      const b3 = b[3]
  const b4 = b[4]
      const b5 = b[5]
      const b6 = b[6]
      const b7 = b[7]
  const b8 = b[8]
      const b9 = b[9]
      const b10 = b[10]
      const b11 = b[11]
  const b12 = b[12]
      const b13 = b[13]
      const b14 = b[14]
      const b15 = b[15]
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15))
}
/**
 * Alias for {@link mat4.multiply}
 * @function
 */

var mul = multiply
/**
 * Alias for {@link mat4.subtract}
 * @function
 */

var sub = subtract


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQztJQUcvRCxRQUFRLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRWhFLE1BQU0sVUFBVSxHQUFHLFVBQUMsRUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUdqRSxNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsWUFBWSxHQUFHLFVBQVUsR0FBRyxLQUFLO0lBQ3hELElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVO1FBQ3pFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUNyRyxNQUFNLE1BQU0sR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztJQUNyRCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFFdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsSUFBSSxLQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxVQUFVLEVBQUU7UUFDM0UsR0FBRyxDQUFDLFdB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LHNDQUFzQyxDQUFDO2FBQzdEO1lBQ0QsS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFZO1lBQ3ZDLElBQUksS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ2hCLE9BQU8sZUFBRyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2pDO1lBQ0QsT0FBTyxXQUFXLENBQUMsOENBQThDLENBQUM7UUFFdEUsS0FBSyxhQUFLLENBQUMsR0FBRztZQUNWLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7Z0JBQ3BCLE9BQU8sV0FBVyxDQUFDLHVDQUF1QyxDQUFDO2FBQzlEO1lBQ0QsS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFZO1lBQ3ZDLElBQUksS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ2hCLE9BQU8sZUFBRyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2pDO1lBQ0QsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFFdkcsS0FBSyxhQUFLLENBQUMsR0FBRztZQUNWLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7Z0JBQ3BCLE9BQU8sV0FBVyxDQUFDLGlDQUFpQyxDQUFDO2FBQ3hEO1lBQ0QsS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFZO1lBQ3ZDLElBQUksS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ2hCLE9BQU8sZUFBRyxF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RUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFO0lBR2hELEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQ2hELEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQ2hELEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7SUFDbEMsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFDaEQsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFDaEQsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFDakQsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtJQUNqQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFO0lBR2pDLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7SUFDbkMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtJQUdyQyxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFDL0UsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQzdFLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRTtJQUM3RSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFFNUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQzdFLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRTtJQUM3RSxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFFN0UsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQy9FLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRTtJQUMvRSxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLElB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LE1BQU0sRUFBRTtJQUdyRixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLFVBQVUsRUFBRTtJQUM1RyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLFVBQVUsRUFBRTtJQUc3RyxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFHOUYsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLFNBQVMsRUFBRTtJQUczRSxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsVUFBVSxFQUFFO0lBQzdFLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUU7SUFHM0UsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUU7SUFDeEcsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUU7SUFDdEcsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUU7SUFDaEgsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUU7SUFHM0csQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsZUFBZSxFQUFFO0lBR3JGLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLGVBQWUsRUFBRTtJQUM1RixNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxlQUFlLEVBQUU7SUFDNUYsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtJQUdyQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxlQUFlLEVBQUU7SUFFMUYsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUU7SUFDMUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FB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SSxLQUFLLENBQUMsR0FBRyxDQUFDO0FBRTVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0lBQ25DLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0lBQ2pHLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDL0YsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHO0lBQzlGLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRztJQUMvRixHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUc7SUFDNUYsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUc7SUFDN0YsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRTtJQUNoRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUMzRixHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRztJQUM1RixHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRztJQUM3RixFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRztJQUMzRixHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0FBRTVGLE1BQU0sSUFBSTtJQUtULFlBQWEsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQzNDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDbkMsQ0FBQztDQUNEO0FBRUQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFGLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRWxGLE1BQU0sSUFBSSxHQUFHLFVBQVUsSUFBWTtJQUNsQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtRQUN6QixJQUFJLElBQUksS0FBSztLQUNiO0lBRUQsSUFBSSxHQUFHLElB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cUVBQXFFLCtDQUFnQixxRUFBcUUsK0NBQWdCLHFFQUFxRSwrQ0FBZ0IsdUVBQXVFLCtDQUFnQix5RUFBeUUsK0NBQWdCLHlFQUF5RSwrQ0FBZ0IseUVBQXlFLCtDQUFnQix5RUFBeUUsK0NBQWdCLHlFQUF5RSwrQ0FBZ0I7QUFDL3pDO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFTztBQUNQO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRU87Ozs7Ozs7VUMvN0RQO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZ3JhcGhpbmctY2FsY3VsYXRvci8uL3NyYy9hcHAvY2FudmFzL2NhbnZhc0NvcmUudHMiLCJ3ZWJwYWNrOi8vZ3JhcGhpbmctY2FsY3VsYXRvci8uL3NyYy9hcHAvY29yZS9jb25zdGFudEV2YWwudHMiLCJ3ZWJwYWNrOi8vZ3JhcGhpbmctY2FsY3VsYXRvci8uL3NyYy9hcHAvY29yZS9jb250cm9sbGVyLnRzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL2RlZmluZXMudHMiLCJ3ZWJwYWNrOi8vZ3JhcGhpbmctY2FsY3VsYXRvci8uL3NyYy9hcHAvbGFuZy9sZXhlci50cyIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yLy4vc3JjL2FwcC9sYW5nL3BhcnNlci50cyIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yLy4vc3JjL2FwcC9zaGFkZXIvc2hhZGVyQ29yZS50cyIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yLy4vc3JjL2FwcC9zaGFkZXIvc2hhZGVyRnVuY3Rpb25CdWlsZGVyLnRzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL3VpL2xlZnRQYW5lbC50cyIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yLy4vc3JjL2FwcC91aS9tZW51YmFyLnRzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL3VpL3VzZXJJbnRlcmFjdC50cyIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yLy4vc3JjL2FwcC91dGlscy50cyIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL2xpYi9nbC1tYXRyaXgvY29tbW9uLmpzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL2xpYi9nbC1tYXRyaXgvbWF0NC5qcyIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3Ivd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3Ivd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZ3JhcGhpbmctY2FsY3VsYXRvci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3Ivd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3Ivd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1hcCwgVmVjdG9yIH0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyBzY2hlZHVsZVJlZHJhdyB9IGZyb20gJy4uLy4uL2luZGV4J1xuaW1wb3J0IHsgb25Nb3VzZURyYWcgfSBmcm9tICcuLi91aS91c2VySW50ZXJhY3QnXG5pbXBvcnQgeyBBU1ROb2RlIH0gZnJvbSAnLi4vbGFuZy9wYXJzZXInXG5pbXBvcnQgeyBjb25zdGFudEV2YWxHZXRFcnJvciwgY29uc3RhbnRFdmFsWCB9IGZyb20gJy4uL2NvcmUvY29uc3RhbnRFdmFsJ1xuaW1wb3J0IHsgYmluZEV4dGVyblZhcmlhYmxlIH0gZnJvbSAnLi4vbGFuZy9sZXhlcidcblxuZXhwb3J0IGNvbnN0IG1haW5DYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuY29uc3QgY3R4ID0gbWFpbkNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbmNvbnN0IHpvb21CdXR0b25JbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy56b29tLWluLWJ1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50XG5jb25zdCB6b29tQnV0dG9uT3V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnpvb20tb3V0LWJ1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50XG5cbmNvbnN0IG9mZnNldCA9IG5ldyBWZWN0b3IoMCwgMClcbmxldCBzY2FsZSA9IDEuMFxuY29uc3Qgc3ViZGl2aXNpb25zID0gMTZcbmNvbnN0IHN0ZXAgPSAwLjAxXG5cbmNvbnN0IGRyYWdGcm9tT2Zmc2V0ID0gbmV3IFZlY3RvcigwLCAwKVxuY29uc3QgZHJhZ0Zyb21Nb3VzZSA9IG5ldyBWZWN0b3IoMCwgMClcbmxldCBpc0RyYWdnZWQgPSBmYWxzZVxuXG5sZXQgZ3JpZEVuYWJsZWQgPSB0cnVlXG5cbmNvbnN0IHpvb21DYW52YXMgPSBmdW5jdGlvbiAobm9ybTogbnVtYmVyKSB7XG5cdHNjYWxlICo9IG5vcm0gPiAwID8gMSArIDAuMiAqIG5vcm0gOiAxIC8gKDEgLSAwLjIgKiBub3JtKVxuXHRzY2hlZHVsZVJlZHJhdygpXG59XG5cbmNvbnN0IHpvb21TbW9vdGggPSBmdW5jdGlvbiAobm9ybTogbnVtYmVyKTogdm9pZCB7XG5cdGNvbnN0IHRhcmdldFNjYWxlID0gc2NhbGUgKiAobm9ybSA+IDAgPyAxICsgMC4yICogbm9ybSA6IDEgLyAoMSAtIDAuMiAqIG5vcm0pKVxuXHRjb25zdCBhbmltYXRpb25SZXNvbHV0aW9uID0gMC4xXG5cdGNvbnN0IHN0ZXAgPSAodGFyZ2V0U2NhbGUgLSBzY2FsZSkgLyAoMSAvIGFuaW1hdGlvblJlc29sdXRpb24pXG5cdGxldCBjb3VudGVyID0gMFxuXHRjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRzY2FsZSArPSBzdGVwXG5cdFx0c2NoZWR1bGVSZWRyYXcoKVxuXHRcdGNvdW50ZXIrK1xuXHRcdGlmIChjb3VudGVyID49IDEgLyBhbmltYXRpb25SZXNvbHV0aW9uKSB7XG5cdFx0XHRjbGVhckludGVydmFsKGludGVydmFsKVxuXHRcdH1cblx0fSwgMTApXG59XG5cbmV4cG9ydCBjb25zdCBpbml0Q2FudmFzID0gZnVuY3Rpb24gKCk6IHZvaWQge1xuXHRtYWluQ2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cdFx0ZHJhZ0Zyb21PZmZzZXQuc2V0KG9mZnNldC54LCBvZmZzZXQueSlcblx0XHRkcmFnRnJvbU1vdXNlLnNldChlLmNsaWVudFgsIGUuY2xpZW50WSlcblx0XHRpc0RyYWdnZWQgPSB0cnVlXG5cdH0pXG5cblx0b25Nb3VzZURyYWcobWFpbkNhbnZhcywgKG1vdXNlOiBWZWN0b3IpID0+IHtcblx0XHRpZiAoIWlzRHJhZ2dlZCkgcmV0dXJuXG5cdFx0b2Zmc2V0LnggPSBkcmFnRnJvbU9mZnNldC54ICsgbW91c2UueCAtIGRyYWdGcm9tTW91c2UueFxuXHRcdG9mZnNldC55ID0gZHJhZ0Zyb21PZmZzZXQueSArIG1vdXNlLnkgLSBkcmFnRnJvbU1vdXNlLnlcblx0XHRzY2hlZHVsZVJlZHJhdygpXG5cdH0pXG5cblx0bWFpbkNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xuXHRcdGlzRHJhZ2dlZCA9IGZhbHNlXG5cdH0pXG5cblx0bWFpbkNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuXHRcdGlzRHJhZ2dlZCA9IGZhbHNlXG5cdH0pXG5cblx0bWFpbkNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChlOiBXaGVlbEV2ZW50KSA9PiB7XG5cdFx0em9vbUNhbnZhcygtZS5kZWx0YVkgLyAyMDApXG5cdH0pXG5cblx0em9vbUJ1dHRvbkluLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdHpvb21TbW9vdGgoMSlcblx0fSlcblxuXHR6b29tQnV0dG9uT3V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdHpvb21TbW9vdGgoLTEpXG5cdH0pXG5cblx0YmluZEV4dGVyblZhcmlhYmxlKCdzY2FsZScsICgpID0+IHNjYWxlLCAoczogbnVtYmVyKSA9PiB7IHNjYWxlID0gczsgc2NoZWR1bGVSZWRyYXcoKSB9KVxuXHRiaW5kRXh0ZXJuVmFyaWFibGUoJ2dyaWQnLCAoKSA9PiBncmlkRW5hYmxlZCA/IDEgOiAwLCAoZzogbnVtYmVyKSA9PiB7IGdyaWRFbmFibGVkID0gZyA+IDA7IHNjaGVkdWxlUmVkcmF3KCkgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHJlc2V0Q2FudmFzID0gZnVuY3Rpb24gKCk6IHZvaWQge1xuXHRzY2FsZSA9IDEuMFxuXHRvZmZzZXQuc2V0KDAsIDApXG5cdHNjaGVkdWxlUmVkcmF3KClcbn1cblxuZXhwb3J0IGNvbnN0IGNhbnZhc0RyYXcgPSBmdW5jdGlvbiAoKTogdm9pZCB7XG5cdGlmICghY3R4KSByZXR1cm5cblxuXHRtYWluQ2FudmFzLndpZHRoID0gbWFpbkNhbnZhcy5jbGllbnRXaWR0aFxuXHRtYWluQ2FudmFzLmhlaWdodCA9IG1haW5DYW52YXMuY2xpZW50SGVpZ2h0XG5cblx0Y3R4LmNsZWFyUmVjdCgwLCAwLCBtYWluQ2FudmFzLndpZHRoLCBtYWluQ2FudmFzLmhlaWdodClcblxuXHRkcmF3R3JpZCgpXG59XG5cbmNvbnN0IGRyYXdMaW5lID0gZnVuY3Rpb24gKGZyb21YOiBudW1iZXIsIGZyb21ZOiBudW1iZXIsIHRvWDogbnVtYmVyLCB0b1k6IG51bWJlcik6IHZvaWQge1xuXHRpZiAoIWN0eCkgcmV0dXJuXG5cblx0Y3R4LmJlZ2luUGF0aCgpXG5cdGN0eC5tb3ZlVG8oZnJvbVgsIGZyb21ZKVxuXHRjdHgubGluZVRvKHRvWCwgdG9ZKVxuXHRjdHguc3Ryb2tlKClcbn1cblxuY29uc3QgZHJhd0dyaWQgPSBmdW5jdGlvbiAoKTogdm9pZCB7XG5cdGlmICghY3R4IHx8ICFncmlkRW5hYmxlZCkgcmV0dXJuXG5cblx0Y29uc3Qgd2lkdGggPSBtYWluQ2FudmFzLndpZHRoXG5cdGNvbnN0IGhlaWdodCA9IG1haW5DYW52YXMuaGVpZ2h0XG5cdGNvbnN0IGFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0XG5cblx0Y3R4LnN0cm9rZVN0eWxlID0gJyNmZmYnXG5cdGN0eC5saW5lV2lkdGggPSAyXG5cblx0Ly8geSBheGlzXG5cdGRyYXdMaW5lKHdpZHRoIC8gMiArIG9mZnNldC54LCAwLCB3aWR0aCAvIDIgKyBvZmZzZXQueCwgaGVpZ2h0KVxuXG5cdC8vIHggYXhpc1xuXHRkcmF3TGluZSgwLCBoZWlnaHQgLyAyICsgb2Zmc2V0LnksIHdpZHRoLCBoZWlnaHQgLyAyICsgb2Zmc2V0LnkpXG5cblx0Y29uc3Qgc3ViZGl2TXVsdCA9IDIgKiogTWF0aC5mbG9vcihNYXRoLmxvZyhzY2FsZSkgLyBNYXRoLmxvZygyKSlcblxuXHQvLyB5IGF4aXMgc3ViZGl2aXNpb25zXG5cdGNvbnN0IHlTdGVwID0gaGVpZ2h0IC8gc3ViZGl2aXNpb25zIC8gc3ViZGl2TXVsdCAqIHNjYWxlXG5cdGxldCB5U3ViID0gLU1hdGguZmxvb3Ioc3ViZGl2aXNpb25zIC8gc2NhbGUgLyAyICogc3ViZGl2TXVsdCkgLyBzdWJkaXZNdWx0IC1cblx0XHRNYXRoLmZsb29yKG9mZnNldC55IC8geVN0ZXApIC8gc3ViZGl2TXVsdCAtIChvZmZzZXQueSA8IDAgPyAoMSAvIHN1YmRpdk11bHQpIDogMCkgLSAoMSAvIHN1YmRpdk11bHQpXG5cdGNvbnN0IHlFcnJvciA9IChoZWlnaHQgJSAoMiAqIHlTdGVwKSAtIDIgKiB5U3RlcCkgLyAyXG5cdGNvbnN0IHlSZXBlYXRPZmZzZXQgPSBvZmZzZXQueSAlIHlTdGVwXG5cblx0Zm9yIChsZXQgeSA9IDA7IHkgPCBoZWlnaHQgKyAyICogeVN0ZXA7IHkgKz0geVN0ZXAsIHlTdWIgKz0gMSAvIHN1YmRpdk11bHQpIHtcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSAnIzY2Nidcblx0XHRjdHgubGluZVdpZHRoID0gMC41XG5cblx0XHRkcmF3TGluZSgwLCB5ICsgeUVycm9yICsgeVJlcGVhdE9mZnNldCwgd2lkdGgsIHkgKyB5RXJyb3IgKyB5UmVwZWF0T2Zmc2V0KVxuXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ3RyYW5zcGFyZW50J1xuXHRcdGN0eC5maWxsU3R5bGUgPSAnI2ZmZidcblx0XHRjdHgudGV4dEFsaWduID0gJ3JpZ2h0J1xuXG5cdFx0aWYgKHlTdWIgPT09IDApIGNvbnRpbnVlXG5cblx0XHQvLyB5IGxhYmVsc1xuXHRcdGN0eC5iZWdpblBhdGgoKVxuXHRcdGN0eC5maWxsVGV4dCgoLXlTdWIpLnRvU3RyaW5nKCksIHdpZHRoIC8gMiArIG9mZnNldC54IC0gMTAsIHkgKyB5RXJyb3IgKyB5UmVwZWF0T2Zmc2V0ICsgNClcblx0fVxuXG5cdC8vIHggYXhpcyBzdWJkaXZpc2lvbnNcblx0Y29uc3QgeFN0ZXAgPSB3aWR0aCAvIHN1YmRpdmlzaW9ucyAvIHN1YmRpdk11bHQgLyBhc3BlY3QgKiBzY2FsZVxuXHRsZXQgeFN1YiA9IC1NYXRoLmZsb29yKHN1YmRpdmlzaW9ucyAvIHNjYWxlIC8gMiAqIHN1YmRpdk11bHQgKiBhc3BlY3QpIC8gc3ViZGl2TXVsdCAtXG5cdFx0TWF0aC5mbG9vcihvZmZzZXQueCAvIHhTdGVwKSAvIHN1YmRpdk11bHQgLSAob2Zmc2V0LnggPCAwID8gKDEgLyBzdWJkaXZNdWx0KSA6IDApIC0gKDEgLyBzdWJkaXZNdWx0KVxuXHRjb25zdCB4RXJyb3IgPSAod2lkdGggJSAoMiAqIHhTdGVwKSAtIDIgKiB4U3RlcCkgLyAyXG5cdGNvbnN0IHhSZXBlYXRPZmZzZXQgPSBvZmZzZXQueCAlIHhTdGVwXG5cblx0Zm9yIChsZXQgeCA9IDA7IHggPCB3aWR0aCArIHhTdGVwOyB4ICs9IHhTdGVwLCB4U3ViICs9IDEgLyBzdWJkaXZNdWx0KSB7XG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gJyM2NjYnXG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDAuNVxuXG5cdFx0ZHJhd0xpbmUoeCArIHhFcnJvciArIHhSZXBlYXRPZmZzZXQsIDAsIHggKyB4RXJyb3IgKyB4UmVwZWF0T2Zmc2V0LCBoZWlnaHQpXG5cblx0XHRjdHguc3Ryb2tlU3R5bGUgPSAndHJhbnNwYXJlbnQnXG5cdFx0Y3R4LmZpbGxTdHlsZSA9ICcjZmZmJ1xuXHRcdGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xuXG5cdFx0aWYgKHhTdWIgPT09IDApIHtcblx0XHRcdGN0eC5iZWdpblBhdGgoKVxuXHRcdFx0Y3R4LmZpbGxUZXh0KCgteFN1YikudG9TdHJpbmcoKSwgeCArIHhFcnJvciArIHhSZXBlYXRPZmZzZXQgLSAxOCwgaGVpZ2h0IC8gMiArIG9mZnNldC55ICsgMjApXG5cdFx0XHRjb250aW51ZVxuXHRcdH1cblxuXHRcdC8vIHggbGFiZWxzXG5cdFx0Y3R4LmJlZ2luUGF0aCgpXG5cdFx0Y3R4LmZpbGxUZXh0KHhTdWIudG9TdHJpbmcoKSwgeCArIHhFcnJvciArIHhSZXBlYXRPZmZzZXQsIGhlaWdodCAvIDIgKyBvZmZzZXQueSArIDIwKVxuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBjYW52YXNEcmF3RnVuY3Rpb24gPSBmdW5jdGlvbiAoYXN0OiBBU1ROb2RlIHwgbnVsbCwgY29sb3I6IHN0cmluZyk6IHZvaWQge1xuXHRpZiAoIWN0eCB8fCAhYXN0KSByZXR1cm5cblxuXHRjb25zdCB3aWR0aCA9IG1haW5DYW52YXMud2lkdGhcblx0Y29uc3QgaGVpZ2h0ID0gbWFpbkNhbnZhcy5oZWlnaHRcblx0Y29uc3QgYXNwZWN0ID0gd2lkdGggLyBoZWlnaHRcblxuXHRjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxuXHRjdHgubGluZVdpZHRoID0gMi41XG5cdGN0eC5maWxsU3R5bGUgPSAndHJhbnNwYXJlbnQnXG5cdGN0eC5iZWdpblBhdGgoKVxuXG5cdGNvbnN0IHhTdGVwID0gd2lkdGggLyBzdWJkaXZpc2lvbnMgLyBhc3BlY3QgKiBzY2FsZVxuXHRjb25zdCB4T2Zmc2V0ID0gb2Zmc2V0LnggLyB4U3RlcFxuXHRsZXQgbW92ZVRvID0gdHJ1ZVxuXHRcblx0Zm9yIChsZXQgeCA9IC1zdWJkaXZpc2lvbnMgLyAyICogYXNwZWN0IC8gc2NhbGUgLSB4T2Zmc2V0OyB4IDwgc3ViZGl2aXNpb25zIC8gMiAqIGFzcGVjdCAvIHNjYWxlIC0geE9mZnNldDsgeCArPSBzdGVwIC8gc2NhbGUpIHtcblx0XHRjb25zdCBjID0gY29uc3RhbnRFdmFsWChhc3QsIHgpXG5cdFx0Y29uc3QgZiA9IHR5cGVvZiBjID09PSAnbnVtYmVyJyA/IGMgOiBjLnJlXG5cblx0XHRjb25zdCBlcnJvciA9IGNvbnN0YW50RXZhbEdldEVycm9yKClcblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHJldHVyblxuXHRcdH1cblxuXHRcdGNvbnN0IG1hcHBlZFggPSBtYXAoeCwgLXN1YmRpdmlzaW9ucyAvIDIgKiBhc3BlY3QgLyBzY2FsZSwgc3ViZGl2aXNpb25zIC8gMiAqIGFzcGVjdCAvIHNjYWxlLCAwLCB3aWR0aCkgKyBvZmZzZXQueFxuXHRcdGNvbnN0IG1hcHBlZFkgPSBtYXAoZiwgLXN1YmRpdmlzaW9ucyAvIDIgLyBzY2FsZSwgc3ViZGl2aXNpb25zIC8gMiAvIHNjYWxlLCBoZWlnaHQsIDApICsgb2Zmc2V0Lnlcblx0XHRcblx0XHRpZiAobW92ZVRvKSB7XG5cdFx0XHRjdHgubW92ZVRvKG1hcHBlZFgsIG1hcHBlZFkpXG5cdFx0XHRtb3ZlVG8gPSBmYWxzZVxuXHRcdH1cblx0XHRjdHgubGluZVRvKG1hcHBlZFgsIG1hcHBlZFkpXG5cdH1cblxuXHRjdHguc3Ryb2tlKClcbn1cblxuZXhwb3J0IGNvbnN0IGdldERvbWFpbiA9IGZ1bmN0aW9uICgpOiB7IG1pblg6IG51bWJlciwgbWF4WDogbnVtYmVyLCBtaW5ZOiBudW1iZXIsIG1heFk6IG51bWJlciB9IHtcblx0Y29uc3Qgd2lkdGggPSBtYWluQ2FudmFzLndpZHRoXG5cdGNvbnN0IGhlaWdodCA9IG1haW5DYW52YXMuaGVpZ2h0XG5cdGNvbnN0IGFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0XG5cbiAgICBjb25zdCB4U3RlcCA9IHdpZHRoIC8gc3ViZGl2aXNpb25zIC8gYXNwZWN0ICogc2NhbGVcbiAgICBjb25zdCB4T2Zmc2V0ID0gb2Zmc2V0LnggLyB4U3RlcFxuICAgIGNvbnN0IG1pblggPSAtc3ViZGl2aXNpb25zIC8gMiAqIGFzcGVjdCAvIHNjYWxlIC0geE9mZnNldFxuICAgIGNvbnN0IG1heFggPSBzdWJkaXZpc2lvbnMgLyAyICogYXNwZWN0IC8gc2NhbGUgLSB4T2Zmc2V0XG5cbiAgICBjb25zdCB5U3RlcCA9IGhlaWdodCAvIHN1YmRpdmlzaW9ucyAqIHNjYWxlXG4gICAgY29uc3QgeU9mZnNldCA9IG9mZnNldC55IC8geVN0ZXBcbiAgICBjb25zdCBtaW5ZID0gLXN1YmRpdmlzaW9ucyAvIDIgLyBzY2FsZSArIHlPZmZzZXRcbiAgICBjb25zdCBtYXhZID0gc3ViZGl2aXNpb25zIC8gMiAvIHNjYWxlICsgeU9mZnNldFxuXG4gICAgcmV0dXJuIHsgbWluWCwgbWF4WCwgbWluWSwgbWF4WSB9XG59XG4iLCJpbXBvcnQgeyBnZXRHbG9iYWxUaW1lLCBzY2hlZHVsZVJlZHJhdyB9IGZyb20gJy4uLy4uL2luZGV4J1xuaW1wb3J0IHsgZ2V0RXh0ZXJuVmFyaWFibGUsIGdldFVzZXJWYXJpYWJsZSwgc2V0VXNlclZhcmlhYmxlLCBUb2tlbiB9IGZyb20gJy4uL2xhbmcvbGV4ZXInXG5pbXBvcnQgeyBBU1ROb2RlIH0gZnJvbSAnLi4vbGFuZy9wYXJzZXInXG5pbXBvcnQgeyBnZXRNb3VzZVBvcyB9IGZyb20gJy4uL3VpL3VzZXJJbnRlcmFjdCdcbmltcG9ydCB7IENvbXBsZXgsIGNweCwgZmFjdG9yaWFsLCBwZXJsaW4yLCBzaWdtb2lkIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmxldCBsYXRlc3RFcnJvcjogc3RyaW5nIHwgbnVsbCA9IG51bGxcbmxldCB4OiBudW1iZXIgfCBudWxsXG5cbmV4cG9ydCBjb25zdCBjb25zdGFudEV2YWwgPSBmdW5jdGlvbiAoYXN0OiBBU1ROb2RlIHwgbnVsbCk6IENvbXBsZXggfCBudW1iZXIge1xuICAgIGlmICghYXN0KSByZXR1cm4gMFxuXG4gICAgbGF0ZXN0RXJyb3IgPSBudWxsXG5cbiAgICBjb25zdCByZXN1bHQ6IG51bWJlciA9IGV2YWxOb2RlKGFzdCkgYXMgbnVtYmVyXG5cbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbmV4cG9ydCBjb25zdCBjb25zdGFudEV2YWxYID0gZnVuY3Rpb24gKGFzdDogQVNUTm9kZSB8IG51bGwsIF94OiBudW1iZXIpOiBDb21wbGV4IHwgbnVtYmVyIHtcbiAgICB4ID0gX3hcblxuICAgIGNvbnN0IHJlc3VsdCA9IGNvbnN0YW50RXZhbChhc3QpXG5cbiAgICB4ID0gbnVsbFxuICAgIHJldHVybiByZXN1bHRcbn1cblxuY29uc3QgcmVwb3J0RXJyb3IgPSBmdW5jdGlvbiAoZXJyb3I6IHN0cmluZyk6IG51bWJlciB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZHVyaW5nIGNvbnN0YW50IGV2YWx1YXRpb246ICcgKyBlcnJvcilcbiAgICBsYXRlc3RFcnJvciA9IGVycm9yXG4gICAgcmV0dXJuIDBcbn1cblxuZXhwb3J0IGNvbnN0IGNvbnN0YW50RXZhbEdldEVycm9yID0gKCk6IHN0cmluZyB8IG51bGwgPT4gbGF0ZXN0RXJyb3JcblxuY29uc3QgaXNJdGVyYWJsZSA9IChvYmo6IGFueSk6IGJvb2xlYW4gPT4gb2JqICE9IG51bGwgJiYgdHlwZW9mIG9ialtTeW1ib2wuaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nXG5cbmNvbnN0IGV2YWxOb2RlID0gZnVuY3Rpb24gKG5vZGU6IEFTVE5vZGUpOiBudW1iZXIgfCBDb21wbGV4IHwgbnVtYmVyW10ge1xuICAgIGxldCBsZWZ0LCByaWdodFxuXG4gICAgc3dpdGNoIChub2RlLm9wLnRvaykge1xuICAgICAgICBjYXNlIFRva2VuLlVOREVGOlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBVTkRFRklORUQgaXMgbm90IGFsbG93ZWQnKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5OT05FOlxuICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uUEFSRU5fT1A6XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIE9QRU4gUEFSRU5USEVTSVMgaXMgbm90IGFsbG93ZWQnKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5QQVJFTl9DTDpcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gQ0xPU0UgUEFSRU5USEVTSVMgaXMgbm90IGFsbG93ZWQnKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5CUkFDS0VUX09QOlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBPUEVOIEJSQUNLRVQgaXMgbm90IGFsbG93ZWQnKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5CUkFDS0VUX0NMOlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBDTE9TRSBCUkFDS0VUIGlzIG5vdCBhbGxvd2VkJylcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uQlJBQ0VfT1A6XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIE9QRU4gQlJBQ0UgaXMgbm90IGFsbG93ZWQnKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uQlJBQ0VfQ0w6XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIENMT1NFIEJSQUNFIGlzIG5vdCBhbGxvd2VkJylcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uTlVNOlxuICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlLm9wLnZhbCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIE5VTUJFUiBtdXN0IGJlIGEgbnVtYmVyJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjcHgobm9kZS5vcC52YWwpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLkNPTlNUOlxuICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlLm9wLnZhbCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIENPTlNUQU5UIG11c3QgYmUgYSBudW1iZXInKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNweChub2RlLm9wLnZhbClcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uVkFSOlxuICAgICAgICAgICAgaWYgKHggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gVkFSSUFCTEUgaXMgbm90IGRlZmluZWQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNweCh4KVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5WQVIyOlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBWQVJJQUJMRTIgaXMgbm90IGFsbG93ZWQnKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uVElNRTpcbiAgICAgICAgICAgIHNjaGVkdWxlUmVkcmF3KClcbiAgICAgICAgICAgIHJldHVybiBjcHgoZ2V0R2xvYmFsVGltZSgpKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uQUREOlxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIEFERElUSU9OJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxlZnQgPSBldmFsTm9kZShub2RlLmxlZnQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgQ29tcGxleFxuICAgICAgICAgICAgcmV0dXJuIHsgcmU6IGxlZnQucmUgKyByaWdodC5yZSwgaW06IGxlZnQuaW0gKyByaWdodC5pbSB9XG5cbiAgICAgICAgY2FzZSBUb2tlbi5TVUI6XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gU1VCVFJBQ1RJT04nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVmdCA9IGV2YWxOb2RlKG5vZGUubGVmdCkgYXMgQ29tcGxleFxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICByZXR1cm4geyByZTogbGVmdC5yZSAtIHJpZ2h0LnJlLCBpbTogbGVmdC5pbSAtIHJpZ2h0LmltIH1cblxuICAgICAgICBjYXNlIFRva2VuLk1VTFQ6XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gTVVMVElQTElDQVRJT04nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVmdCA9IGV2YWxOb2RlKG5vZGUubGVmdCkgYXMgQ29tcGxleFxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAobGVmdC5pbSA9PT0gMCAmJiByaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgobGVmdC5yZSAqIHJpZ2h0LnJlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgcmU6IGxlZnQucmUgKiByaWdodC5yZSAtIGxlZnQuaW0gKiByaWdodC5pbSwgaW06IGxlZnQucmUgKiByaWdodC5pbSArIGxlZnQuaW0gKiByaWdodC5yZSB9XG5cbiAgICAgICAgY2FzZSBUb2tlbi5ESVY6XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gRElWSVNJT04nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVmdCA9IGV2YWxOb2RlKG5vZGUubGVmdCkgYXMgQ29tcGxleFxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAocmlnaHQucmUgPT09IDAgJiYgcmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ0RpdmlzaW9uIGJ5IHplcm8nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxlZnQuaW0gPT09IDAgJiYgcmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3B4KGxlZnQucmUgLyByaWdodC5yZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRlbm9tID0gcmlnaHQucmUgKiByaWdodC5yZSArIHJpZ2h0LmltICogcmlnaHQuaW1cbiAgICAgICAgICAgIHJldHVybiB7IHJlOiAobGVmdC5yZSAqIHJpZ2h0LnJlICsgbGVmdC5pbSAqIHJpZ2h0LmltKSAvIGRlbm9tLCBpbTogKGxlZnQuaW0gKiByaWdodC5yZSAtIGxlZnQucmUgKiByaWdodC5pbSkgLyBkZW5vbSB9XG5cbiAgICAgICAgY2FzZSBUb2tlbi5QT1c6XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gUE9XRVInKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVmdCA9IGV2YWxOb2RlKG5vZGUubGVmdCkgYXMgQ29tcGxleFxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAobGVmdC5pbSA9PT0gMCAmJiByaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgoTWF0aC5wb3cobGVmdC5yZSwgcmlnaHQucmUpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJpZ2h0LmltICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdJbWFnaW5hcnkgcG93ZXIgaXMgbm90IGFsbG93ZWQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIChhICsgYmkpXm4gPSByXm4gKGNvcyhuKnBoaSkgKyBzaW4obipwaGkpaSlcbiAgICAgICAgICAgICAgICBjb25zdCByID0gTWF0aC5zcXJ0KGxlZnQucmUgKiBsZWZ0LnJlICsgbGVmdC5pbSAqIGxlZnQuaW0pXG4gICAgICAgICAgICAgICAgY29uc3QgcGhpID0gTWF0aC5hdGFuMihsZWZ0LmltLCBsZWZ0LnJlKVxuICAgICAgICAgICAgICAgIGNvbnN0IHJwb3cgPSBNYXRoLnBvdyhyLCByaWdodC5yZSlcbiAgICAgICAgICAgICAgICBjb25zdCBwaGlwb3cgPSByaWdodC5yZSAqIHBoaVxuICAgICAgICAgICAgICAgIHJldHVybiB7IHJlOiBycG93ICogTWF0aC5jb3MocGhpcG93KSwgaW06IHJwb3cgKiBNYXRoLnNpbihwaGlwb3cpIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLlNRUlQ6XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBTUVVBUkUgUk9PVCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIGlmIChyaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgoTWF0aC5zcXJ0KHJpZ2h0LnJlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignU1FVQVJFIFJPT1QgaXMgbm90IGRlZmluZWQgZm9yIGNvbXBsZXggbnVtYmVycycpXG5cbiAgICAgICAgY2FzZSBUb2tlbi5MT0c6XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBMT0dBUklUSE0nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAocmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3B4KE1hdGgubG9nKHJpZ2h0LnJlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTE9HQVJJVEhNIGlzIG5vdCBkZWZpbmVkIGZvciBjb21wbGV4IG51bWJlcnMnKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uRVhQOlxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gRVhQT0VOVElBTCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIGlmIChyaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgoTWF0aC5leHAocmlnaHQucmUpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgcmU6IE1hdGguZXhwKHJpZ2h0LnJlKSAqIE1hdGguY29zKHJpZ2h0LmltKSwgaW06IE1hdGguZXhwKHJpZ2h0LnJlKSAqIE1hdGguc2luKHJpZ2h0LmltKSB9XG5cbiAgICAgICAgY2FzZSBUb2tlbi5TSU46XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBTSU5FJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgQ29tcGxleFxuICAgICAgICAgICAgaWYgKHJpZ2h0LmltID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNweChNYXRoLnNpbihyaWdodC5yZSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyByZTogTWF0aC5zaW4ocmlnaHQucmUpICogTWF0aC5jb3NoKHJpZ2h0LmltKSwgaW06IE1hdGguY29zKHJpZ2h0LnJlKSAqIE1hdGguc2luaChyaWdodC5pbSkgfVxuXG4gICAgICAgIGNhc2UgVG9rZW4uQ09TOlxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gQ09TSU5FJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgQ29tcGxleFxuICAgICAgICAgICAgaWYgKHJpZ2h0LmltID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNweChNYXRoLmNvcyhyaWdodC5yZSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyByZTogTWF0aC5jb3MocmlnaHQucmUpICogTWF0aC5jb3NoKHJpZ2h0LmltKSwgaW06IC1NYXRoLnNpbihyaWdodC5yZSkgKiBNYXRoLnNpbmgocmlnaHQuaW0pIH1cblxuICAgICAgICBjYXNlIFRva2VuLlRBTjpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIFRBTkdFTlQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAocmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3B4KE1hdGgudGFuKHJpZ2h0LnJlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHJlOiBNYXRoLnNpbigyICogcmlnaHQucmUpIC8gKE1hdGguY29zKDIgKiByaWdodC5yZSkgKyBNYXRoLmNvc2goMiAqIHJpZ2h0LmltKSksIGltOiBNYXRoLnNpbmgoMiAqIHJpZ2h0LmltKSAvIChNYXRoLmNvcygyICogcmlnaHQucmUpICsgTWF0aC5jb3NoKDIgKiByaWdodC5pbSkpIH1cblxuICAgICAgICBjYXNlIFRva2VuLkFTSU46XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBBUkMgU0lORScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIGlmIChyaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgoTWF0aC5hc2luKHJpZ2h0LnJlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHJlOiBNYXRoLmxvZyhyaWdodC5yZSArIE1hdGguc3FydCgxIC0gcmlnaHQucmUgKiByaWdodC5yZSkpLCBpbTogTWF0aC5zaWduKHJpZ2h0LmltKSAqIE1hdGguc3FydCgxIC0gcmlnaHQucmUgKiByaWdodC5yZSkgfVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5TSU5IOlxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gU0lORSBIWVBFUkJPTElDVVMnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAocmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3B4KE1hdGguc2luaChyaWdodC5yZSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyByZTogTWF0aC5jb3NoKHJpZ2h0LnJlKSAqIE1hdGguY29zKHJpZ2h0LmltKSwgaW06IE1hdGguc2luaChyaWdodC5yZSkgKiBNYXRoLnNpbihyaWdodC5pbSkgfVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5DT1NIOlxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gQ09TSU5FIEhZUEVSQk9MSUNVUycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIGlmIChyaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgoTWF0aC5jb3NoKHJpZ2h0LnJlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHJlOiBNYXRoLmNvc2gocmlnaHQucmUpICogTWF0aC5jb3MocmlnaHQuaW0pLCBpbTogTWF0aC5zaW5oKHJpZ2h0LnJlKSAqIE1hdGguc2luKHJpZ2h0LmltKSB9XG5cbiAgICAgICAgY2FzZSBUb2tlbi5UQU5IOlxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gVEFOR0VOVCBIWVBFUkJPTElDVVMnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAocmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3B4KE1hdGgudGFuaChyaWdodC5yZSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyByZTogTWF0aC5jb3NoKDIgKiByaWdodC5yZSkgLyAoTWF0aC5jb3MoMiAqIHJpZ2h0LnJlKSArIE1hdGguY29zaCgyICogcmlnaHQuaW0pKSwgaW06IE1hdGguc2luaCgyICogcmlnaHQuaW0pIC8gKE1hdGguY29zKDIgKiByaWdodC5yZSkgKyBNYXRoLmNvc2goMiAqIHJpZ2h0LmltKSkgfVxuXG4gICAgICAgIGNhc2UgVG9rZW4uQUNPUzpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIEFSQyBDT1NJTkUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAocmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3B4KE1hdGguYWNvcyhyaWdodC5yZSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyByZTogTWF0aC5sb2cocmlnaHQucmUgKyBNYXRoLnNxcnQoMSAtIHJpZ2h0LnJlICogcmlnaHQucmUpKSwgaW06IC1NYXRoLnNpZ24ocmlnaHQuaW0pICogTWF0aC5zcXJ0KDEgLSByaWdodC5yZSAqIHJpZ2h0LnJlKSB9XG5cbiAgICAgICAgY2FzZSBUb2tlbi5BVEFOOlxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gQVJDIFRBTkdFTlQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAocmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3B4KE1hdGguYXRhbihyaWdodC5yZSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyByZTogTWF0aC5hdGFuKHJpZ2h0LnJlIC8gcmlnaHQuaW0pLCBpbTogTWF0aC5sb2coKDEgKyByaWdodC5pbSkgLyAoMSAtIHJpZ2h0LmltKSkgLyAyIH1cblxuICAgICAgICBjYXNlIFRva2VuLkZMT09SOlxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gRkxPT1InKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAocmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3B4KE1hdGguZmxvb3IocmlnaHQucmUpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdGTE9PUiBpcyBub3QgZGVmaW5lZCBmb3IgY29tcGxleCBudW1iZXJzJylcblxuICAgICAgICBjYXNlIFRva2VuLk1JTjpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIE1JTicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzSXRlcmFibGUoZXZhbE5vZGUobm9kZS5yaWdodCkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNYWxmb3JtZWQgYXJndW1lbnQgZm9yIFRva2VuIE1JTicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2YWxzID0gWy4uLmV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIG51bWJlcltdXVxuICAgICAgICAgICAgcmV0dXJuIGNweChNYXRoLm1pbiguLi52YWxzKSlcblxuICAgICAgICBjYXNlIFRva2VuLk1BWDpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIE1BWCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzSXRlcmFibGUoZXZhbE5vZGUobm9kZS5yaWdodCkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNYWxmb3JtZWQgYXJndW1lbnQgZm9yIFRva2VuIE1BWCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2YWxzMiA9IFsuLi5ldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXJbXV1cbiAgICAgICAgICAgIHJldHVybiBjcHgoTWF0aC5tYXgoLi4udmFsczIpKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uREVMSU06XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gREVMSU1JVEVSJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxlZnQgPSBldmFsTm9kZShub2RlLmxlZnQpIGFzIGFueVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBhbnlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsZXQgb3V0OiBudW1iZXJbXSA9IFtdXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsZWZ0Py5yZSA9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICBvdXQucHVzaChsZWZ0Py5yZSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvdXQuY29uY2F0KGxlZnQ/LnJlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJpZ2h0Py5yZSA9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICBvdXQucHVzaChyaWdodD8ucmUpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0LmNvbmNhdChyaWdodD8ucmUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEZJWE1FXG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgVG9rZW4uQUJTOlxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gQUJTT0xVVEUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAocmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3B4KE1hdGguYWJzKHJpZ2h0LnJlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjcHgoTWF0aC5zcXJ0KHJpZ2h0LnJlICogcmlnaHQucmUgKyByaWdodC5pbSAqIHJpZ2h0LmltKSlcblxuICAgICAgICBjYXNlIFRva2VuLlJBTkQ6XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBSQU5ET00nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNweChNYXRoLnJhbmRvbSgpICogKGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIG51bWJlcikpXG5cbiAgICAgICAgY2FzZSBUb2tlbi5QRVJMSU46IHtcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBQRVJMSU4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc0l0ZXJhYmxlKGV2YWxOb2RlKG5vZGUucmlnaHQpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWFsZm9ybWVkIGFyZ3VtZW50IGZvciBUb2tlbiBQRVJMSU4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgbnVtYmVyW11cbiAgICAgICAgICAgIHJldHVybiBjcHgocGVybGluMih4LCB5KSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgVG9rZW4uTU9EOlxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIE1PRFVMVVMnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVmdCA9IGV2YWxOb2RlKG5vZGUubGVmdCkgYXMgQ29tcGxleFxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAocmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3B4KGxlZnQucmUgJSByaWdodC5yZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTU9EVUxVUyBpcyBub3QgZGVmaW5lZCBmb3IgY29tcGxleCBudW1iZXJzJylcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uTEVWRUxfU0VUOlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBMRVZFTCBTRVQgaXMgbm90IGFsbG93ZWQnKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5WRUNUT1JfRklFTEQ6XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIFZFQ1RPUiBGSUVMRCBpcyBub3QgYWxsb3dlZCcpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLkxFU1M6XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gTEVTUyBUSEFOJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxlZnQgPSBldmFsTm9kZShub2RlLmxlZnQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgQ29tcGxleFxuICAgICAgICAgICAgaWYgKHJpZ2h0LmltID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNweChsZWZ0LnJlIDwgcmlnaHQucmUgPyAxIDogMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTEVTUyBUSEFOIGlzIG5vdCBkZWZpbmVkIGZvciBjb21wbGV4IG51bWJlcnMnKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uR1JFQVRFUjpcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBHUkVBVEVSIFRIQU4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVmdCA9IGV2YWxOb2RlKG5vZGUubGVmdCkgYXMgQ29tcGxleFxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAocmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3B4KGxlZnQucmUgPiByaWdodC5yZSA/IDEgOiAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdHUkVBVEVSIFRIQU4gaXMgbm90IGRlZmluZWQgZm9yIGNvbXBsZXggbnVtYmVycycpXG5cbiAgICAgICAgY2FzZSBUb2tlbi5MRVNTX09SX0VRVUFMOlxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIExFU1MgVEhBTiBPUiBFUVVBTCBUTycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZWZ0ID0gZXZhbE5vZGUobm9kZS5sZWZ0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIGlmIChyaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgobGVmdC5yZSA8PSByaWdodC5yZSA/IDEgOiAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdMRVNTIFRIQU4gT1IgRVFVQUwgVE8gaXMgbm90IGRlZmluZWQgZm9yIGNvbXBsZXggbnVtYmVycycpXG5cbiAgICAgICAgY2FzZSBUb2tlbi5HUkVBVEVSX09SX0VRVUFMOlxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIEdSRUFURVIgVEhBTiBPUiBFUVVBTCBUTycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZWZ0ID0gZXZhbE5vZGUobm9kZS5sZWZ0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIGlmIChyaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgobGVmdC5yZSA+PSByaWdodC5yZSA/IDEgOiAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdHUkVBVEVSIFRIQU4gT1IgRVFVQUwgVE8gaXMgbm90IGRlZmluZWQgZm9yIGNvbXBsZXggbnVtYmVycycpXG5cbiAgICAgICAgY2FzZSBUb2tlbi5FUVVBTDpcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBFUVVBTCBUTycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZWZ0ID0gZXZhbE5vZGUobm9kZS5sZWZ0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIGlmIChyaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgoTWF0aC5hYnMobGVmdC5yZSAtIHJpZ2h0LnJlKSA8IDFlLTEwID8gMSA6IDApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY3B4KE1hdGguYWJzKGxlZnQucmUgLSByaWdodC5yZSkgPCAxZS0xMCAmJiBNYXRoLmFicyhsZWZ0LmltIC0gcmlnaHQuaW0pIDwgMWUtMTAgPyAxIDogMClcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uQU5EOlxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIEFORCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZWZ0ID0gZXZhbE5vZGUobm9kZS5sZWZ0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIGlmIChyaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgobGVmdC5yZSAmJiByaWdodC5yZSA/IDEgOiAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdBTkQgaXMgbm90IGRlZmluZWQgZm9yIGNvbXBsZXggbnVtYmVycycpXG5cbiAgICAgICAgY2FzZSBUb2tlbi5PUjpcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBPUicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZWZ0ID0gZXZhbE5vZGUobm9kZS5sZWZ0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIGlmIChyaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgobGVmdC5yZSB8fCByaWdodC5yZSA/IDEgOiAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdPUiBpcyBub3QgZGVmaW5lZCBmb3IgY29tcGxleCBudW1iZXJzJylcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uVVNFUlZBUjpcbiAgICAgICAgICAgIHJldHVybiBjcHgoZ2V0VXNlclZhcmlhYmxlKG5vZGUub3AudmFsIGFzIHN0cmluZykpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLkZBQ1RPUklBTDpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIEZBQ1RPUklBTCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIGlmIChyaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgoZmFjdG9yaWFsKHJpZ2h0LnJlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignRkFDVE9SSUFMIGlzIG5vdCBkZWZpbmVkIGZvciBjb21wbGV4IG51bWJlcnMnKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uU0lHTU9JRDpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIFNJR01PSUQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBDb21wbGV4XG4gICAgICAgICAgICBpZiAocmlnaHQuaW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3B4KHNpZ21vaWQocmlnaHQucmUpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdTSUdNT0lEIGlzIG5vdCBkZWZpbmVkIGZvciBjb21wbGV4IG51bWJlcnMnKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uQ0lSQ0xFOlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBDSVJDTEUgaXMgbm90IGFsbG93ZWQnKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uUE9JTlQ6XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIFBPSU5UIGlzIG5vdCBhbGxvd2VkJylcblxuICAgICAgICBjYXNlIFRva2VuLlRSVUU6XG4gICAgICAgICAgICByZXR1cm4gY3B4KDEpXG5cbiAgICAgICAgY2FzZSBUb2tlbi5GQUxTRTpcbiAgICAgICAgICAgIHJldHVybiBjcHgoMClcblxuICAgICAgICBjYXNlIFRva2VuLlBPTEFSOlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBQT0xBUiBpcyBub3QgYWxsb3dlZCcpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLkNBUlRFU0lBTjpcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gQ0FSVEVTSUFOIGlzIG5vdCBhbGxvd2VkJylcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uTU9VU0VYOlxuICAgICAgICAgICAgcmV0dXJuIGNweChnZXRNb3VzZVBvcygpLngpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLk1PVVNFWTpcbiAgICAgICAgICAgIHJldHVybiBjcHgoZ2V0TW91c2VQb3MoKS55KVxuXG4gICAgICAgIGNhc2UgVG9rZW4uTU9VU0U6XG4gICAgICAgICAgICByZXR1cm4gW2dldE1vdXNlUG9zKCkueCwgZ2V0TW91c2VQb3MoKS55XVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5JTUFHSU5BUlk6XG4gICAgICAgICAgICByZXR1cm4geyByZTogMCwgaW06IDEgfVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5TRVJJRVM6XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIFNFUklFUyBub3QgaW1wbGVtZW50ZWQnKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5JVEVSQVRPUjpcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gSVRFUkFUT1Igbm90IGltcGxlbWVudGVkJylcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uQ09NUExFWDpcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gQ09NUExFWCBpcyBub3QgYWxsb3dlZCcpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLkdSQURJRU5UOlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBHUkFESUVOVCBpcyBub3QgYWxsb3dlZCcpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLk1BR05JVFVERTpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIE1BR05JVFVERScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXhcbiAgICAgICAgICAgIGlmIChyaWdodC5pbSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcHgoTWF0aC5hYnMocmlnaHQucmUpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNweChNYXRoLnNxcnQocmlnaHQucmUgKiByaWdodC5yZSArIHJpZ2h0LmltICogcmlnaHQuaW0pKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uQVNTSUdOOlxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIEFTU0lHTicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0Lm9wLnRvayAhPT0gVG9rZW4uQVNTSUdOQUJMRSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmxlZnQub3AudG9rID09PSBUb2tlbi5VU0VSVkFSKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFVzZXJWYXJpYWJsZShub2RlLmxlZnQub3AudmFsIGFzIHN0cmluZywgKGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXgpLnJlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZhbE5vZGUobm9kZS5yaWdodClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdMZWZ0IHNpZGUgb2YgQVNTSUdOIG11c3QgYmUgYXNzaWduYWJsZScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ2V0RXh0ZXJuVmFyaWFibGUobm9kZS5sZWZ0Lm9wLnZhbCBhcyBzdHJpbmcpID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoYFZhcmlhYmxlICR7bm9kZS5sZWZ0Lm9wLnZhbH0gZG9lcyBub3QgZXhpc3RgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2V0RXh0ZXJuVmFyaWFibGUobm9kZS5sZWZ0Lm9wLnZhbCBhcyBzdHJpbmcpPy5zZXQoKGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIENvbXBsZXgpLnJlKVxuICAgICAgICAgICAgcmV0dXJuIGV2YWxOb2RlKG5vZGUucmlnaHQpXG4gICAgICAgIFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKGBVbmtub3duIHRva2VuICR7bm9kZS5vcC52YWx9YClcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBzY2hlZHVsZVJlZHJhdyB9IGZyb20gJy4uLy4uL2luZGV4J1xuaW1wb3J0IHsgY2FudmFzRHJhd0Z1bmN0aW9uLCByZXNldENhbnZhcyB9IGZyb20gJy4uL2NhbnZhcy9jYW52YXNDb3JlJ1xuaW1wb3J0IHsgUGxvdERpc3BsYXlNb2RlLCBQbG90RHJpdmVyLCBQbG90U3RhdHVzIH0gZnJvbSAnLi4vZGVmaW5lcydcbmltcG9ydCB7IEVycm9yIH0gZnJvbSAnLi4vbGFuZy9sZXhlcidcbmltcG9ydCB7IEFTVE5vZGUsIHBhcnNlLCBwYXJzZXJHZXRDb250aW51b3VzLCBwYXJzZXJHZXREaXNwbGF5TW9kZSwgcGFyc2VyR2V0RHJpdmVyLCBwYXJzZXJHZXRFcnJvciB9IGZyb20gJy4uL2xhbmcvcGFyc2VyJ1xuaW1wb3J0IHsgYnVpbGRTaGFkZXJGdW5jdGlvbiwgc2hhZGVyRnVuY3Rpb25CdWlsZGVyR2V0RXJyb3IsIHNoYWRlckZ1bmN0aW9uQnVpbGRlckdldEl0ZXJFeHByZXNzaW9uIH0gZnJvbSAnLi4vc2hhZGVyL3NoYWRlckZ1bmN0aW9uQnVpbGRlcidcbmltcG9ydCB7IGFkZE5ld0lucHV0V2l0aFZhbHVlLCBpbnB1dFNldENvbG9yQXQsIGlucHV0U2V0Q29uc3RFdmFsQXQsIGlucHV0U2V0RHJpdmVyQXQsIGlucHV0U2V0RXJyb3JBdCwgaW5wdXRTZXRTdGF0dXNBdCwgcmVzZXRJbnB1dHMgfSBmcm9tICcuLi91aS9sZWZ0UGFuZWwnXG5pbXBvcnQgeyBjb25zdGFudEV2YWwsIGNvbnN0YW50RXZhbEdldEVycm9yIH0gZnJvbSAnLi9jb25zdGFudEV2YWwnXG5cbnR5cGUgUGxvdCA9IHtcbiAgICBpbnB1dDogc3RyaW5nLFxuICAgIGlucHV0Q2hhbmdlZDogYm9vbGVhbixcbiAgICBhc3Q6IEFTVE5vZGUgfCBudWxsLFxuICAgIHN0YXR1czogUGxvdFN0YXR1cyxcbiAgICBkcml2ZXI6IFBsb3REcml2ZXIsXG4gICAgZGlzcGxheU1vZGU6IFBsb3REaXNwbGF5TW9kZSxcbiAgICBzaGFkZXJGdW5jdGlvbjogc3RyaW5nLFxuICAgIGNvbnRpbnVvdXM6IGJvb2xlYW4sXG4gICAgY29sb3I6IHN0cmluZyxcbiAgICBlcnJvcjogc3RyaW5nLFxuICAgIGl0ZXJFeHByOiBzdHJpbmcsXG59XG5cbmNvbnN0IHBsb3RzOiBQbG90W10gPSBbXVxubGV0IG51bUlucHV0cyA9IDBcblxuZXhwb3J0IGNvbnN0IHNldElucHV0QXQgPSAoaW5kZXg6IG51bWJlciwgdmFsdWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiBudW1JbnB1dHMpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKCFwbG90c1tpbmRleF0pIHtcbiAgICAgICAgcGxvdHNbaW5kZXhdID0gaW5pdFBsb3QoaW5kZXgpXG4gICAgICAgIGlucHV0U2V0Q29sb3JBdChpbmRleCwgcGxvdHNbaW5kZXhdLmNvbG9yKVxuICAgIH1cblxuICAgIHBsb3RzW2luZGV4XS5pbnB1dCA9IHZhbHVlXG4gICAgcGxvdHNbaW5kZXhdLmlucHV0Q2hhbmdlZCA9IHRydWVcbiAgICBzY2hlZHVsZVJlZHJhdygpXG59XG5cbmV4cG9ydCBjb25zdCBzZXROdW1JbnB1dHMgPSAobnVtOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBudW1JbnB1dHMgPSBudW1cbiAgICBmb3IgKGxldCBpID0gbnVtSW5wdXRzOyBpIDwgcGxvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGVsZXRlIHBsb3RzW2ldXG4gICAgfVxuICAgIHNjaGVkdWxlUmVkcmF3KClcbn1cblxuZXhwb3J0IGNvbnN0IHJlc2V0UGxvdHMgPSAoKTogdm9pZCA9PiB7XG4gICAgcGxvdHMubGVuZ3RoID0gMFxuICAgIHNjaGVkdWxlUmVkcmF3KClcbn1cblxuY29uc3QgY29sb3JzOiBzdHJpbmdbXSA9IFsnIzFmNzdiNCcsICcjZmY3ZjBlJywgJyMyY2EwMmMnLCAnI2Q2MjcyOCcsICcjOTQ2N2JkJywgJyM4YzU2NGInLCAnI2UzNzdjMicsICcjN2Y3ZjdmJywgJyNiY2JkMjInLCAnIzE3YmVjZiddXG5jb25zdCBnZXRDb2xvckZyb21JbmRleCA9IChpbmRleDogbnVtYmVyKTogc3RyaW5nID0+IGNvbG9yc1soaW5kZXggLSAxKSAlIGNvbG9ycy5sZW5ndGhdXG5cbmV4cG9ydCBjb25zdCBsb2FkUGxvdHMgPSBmdW5jdGlvbiAocGxvdHM6IHN0cmluZ1tdLCBkZWZhdWx0czogc3RyaW5nW10pIHtcbiAgICByZXNldENhbnZhcygpXG4gICAgcmVzZXRJbnB1dHMoKVxuXG4gICAgY29uc29sZS5sb2coZGVmYXVsdHMpXG4gICAgc2V0TnVtSW5wdXRzKGRlZmF1bHRzLmxlbmd0aClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlZmF1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFkZE5ld0lucHV0V2l0aFZhbHVlKGRlZmF1bHRzW2ldKVxuICAgIH1cbiAgICBkcml2ZVBsb3RzKClcbiAgICBkcmF3UGxvdHMoKVxuICAgIHJlc2V0SW5wdXRzKClcblxuICAgIHNldE51bUlucHV0cyhwbG90cy5sZW5ndGgpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBhZGROZXdJbnB1dFdpdGhWYWx1ZShwbG90c1tpXSlcbiAgICB9XG59XG5cbmNvbnN0IGluaXRQbG90ID0gZnVuY3Rpb24gKGlkeDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5wdXQ6ICcnLFxuICAgICAgICBpbnB1dENoYW5nZWQ6IGZhbHNlLFxuICAgICAgICBhc3Q6IG51bGwsXG4gICAgICAgIHN0YXR1czogUGxvdFN0YXR1cy5QRU5ESU5HLFxuICAgICAgICBkcml2ZXI6IFBsb3REcml2ZXIuQ0FOVkFTLFxuICAgICAgICBkaXNwbGF5TW9kZTogUGxvdERpc3BsYXlNb2RlLk5PTkUsXG4gICAgICAgIHNoYWRlckZ1bmN0aW9uOiAnJyxcbiAgICAgICAgY29udGludW91czogZmFsc2UsXG4gICAgICAgIGNvbG9yOiBnZXRDb2xvckZyb21JbmRleChpZHgpLFxuICAgICAgICBlcnJvcjogJycsXG4gICAgICAgIGl0ZXJFeHByOiAnJyxcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBkcml2ZVBsb3RzID0gKCk6IHZvaWQgPT4ge1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IG51bUlucHV0czsgaSsrKSB7XG4gICAgICAgIC8vIEluaXQgcGxvdFxuICAgICAgICBpZiAoIXBsb3RzW2ldKSB7XG4gICAgICAgICAgICBwbG90c1tpXSA9IGluaXRQbG90KGkpXG4gICAgICAgICAgICBpbnB1dFNldENvbG9yQXQoaSwgcGxvdHNbaV0uY29sb3IpXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHBsb3QgPSBwbG90c1tpXVxuXG4gICAgICAgIGlmIChwbG90LmlucHV0Q2hhbmdlZCkge1xuICAgICAgICAgICAgcGxvdC5pbnB1dENoYW5nZWQgPSBmYWxzZVxuICAgICAgICAgICAgY29uc3Qgc3RhdHVzQmVmb3JlID0gcGxvdC5zdGF0dXNcblxuICAgICAgICAgICAgLy8gQ2hlY2sgZW1wdHkgaW5wdXRcbiAgICAgICAgICAgIGlmIChwbG90LmlucHV0LnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBwbG90LnN0YXR1cyA9IFBsb3RTdGF0dXMuUEVORElOR1xuICAgICAgICAgICAgICAgIHBsb3QuYXN0ID0gbnVsbFxuXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1c0JlZm9yZSAhPT0gcGxvdC5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRTZXRTdGF0dXNBdChpLCBwbG90LnN0YXR1cylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2NoZWR1bGVSZWRyYXcoKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFBhcnNlIGlucHV0XG4gICAgICAgICAgICBjb25zdCBhc3RCZWZvcmUgPSBwbG90LmFzdFxuICAgICAgICAgICAgcGxvdC5hc3QgPSBwYXJzZShwbG90LmlucHV0KVxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnUGFyc2VkIEFTVDonLCBwbG90LmFzdClcblxuICAgICAgICAgICAgLy8gQ2hlY2sgc3RhdHVzXG4gICAgICAgICAgICBjb25zdCBlcnJvckJlZm9yZSA9IHBsb3QuZXJyb3JcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlckVycm9yOiBFcnJvciB8IG51bGwgPSBwYXJzZXJHZXRFcnJvcigpXG4gICAgICAgICAgICBpZiAocGFyc2VyRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBwbG90LnN0YXR1cyA9IFBsb3RTdGF0dXMuRVJST1JcbiAgICAgICAgICAgICAgICBwbG90LmVycm9yID0gcGFyc2VyRXJyb3IuZGVzY1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbG90LnN0YXR1cyA9IFBsb3RTdGF0dXMuQUNUSVZFXG4gICAgICAgICAgICAgICAgcGxvdC5lcnJvciA9ICcnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlZHJhd1xuICAgICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KGFzdEJlZm9yZSkgIT09IEpTT04uc3RyaW5naWZ5KHBsb3QuYXN0KSkge1xuICAgICAgICAgICAgICAgIHNjaGVkdWxlUmVkcmF3KClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2hlY2sgZHJpdmVyXG4gICAgICAgICAgICBjb25zdCBkcml2ZXIgPSBwYXJzZXJHZXREcml2ZXIoKVxuICAgICAgICAgICAgaWYgKHBsb3QuZHJpdmVyICE9PSBkcml2ZXIpIHtcbiAgICAgICAgICAgICAgICBwbG90LmRyaXZlciA9IGRyaXZlclxuICAgICAgICAgICAgICAgIGlucHV0U2V0RHJpdmVyQXQoaSwgZHJpdmVyKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDaGVjayBwcm9jZXNzIG1vZGVcbiAgICAgICAgICAgIHBsb3QuZGlzcGxheU1vZGUgPSBwYXJzZXJHZXREaXNwbGF5TW9kZSgpXG5cbiAgICAgICAgICAgIC8vIEJ1aWxkIHNoYWRlciBmdW5jdGlvblxuICAgICAgICAgICAgaWYgKHBsb3QuZHJpdmVyID09PSBQbG90RHJpdmVyLldFQkdMKSB7XG4gICAgICAgICAgICAgICAgcGxvdC5zaGFkZXJGdW5jdGlvbiA9IGJ1aWxkU2hhZGVyRnVuY3Rpb24ocGxvdC5hc3QpIHx8ICd1bmRlZmluZWQnXG5cbiAgICAgICAgICAgICAgICBwbG90Lml0ZXJFeHByID0gc2hhZGVyRnVuY3Rpb25CdWlsZGVyR2V0SXRlckV4cHJlc3Npb24oKVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhZGVyRnVuY3Rpb25FcnJvciA9IHNoYWRlckZ1bmN0aW9uQnVpbGRlckdldEVycm9yKClcbiAgICAgICAgICAgICAgICBpZiAoc2hhZGVyRnVuY3Rpb25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBwbG90LnN0YXR1cyA9IFBsb3RTdGF0dXMuRVJST1JcbiAgICAgICAgICAgICAgICAgICAgcGxvdC5lcnJvciA9IHNoYWRlckZ1bmN0aW9uRXJyb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGNvbnRpbnVvdXMgcmVuZGVyaW5nXG4gICAgICAgICAgICBwbG90LmNvbnRpbnVvdXMgPSBwYXJzZXJHZXRDb250aW51b3VzKClcblxuICAgICAgICAgICAgLy8gVXBkYXRlXG4gICAgICAgICAgICBpZiAocGxvdC5zdGF0dXMgIT09IHN0YXR1c0JlZm9yZSkge1xuICAgICAgICAgICAgICAgIGlucHV0U2V0U3RhdHVzQXQoaSwgcGxvdC5zdGF0dXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGxvdC5lcnJvciAhPT0gZXJyb3JCZWZvcmUpIHtcbiAgICAgICAgICAgICAgICBpbnB1dFNldEVycm9yQXQoaSwgcGxvdC5lcnJvcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGRyYXdQbG90cyA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBudW1JbnB1dHM7IGkrKykge1xuICAgICAgICBjb25zdCBwbG90ID0gcGxvdHNbaV1cbiAgICAgICAgaWYgKCFwbG90KSBjb250aW51ZVxuICAgICAgICBcbiAgICAgICAgaWYgKHBsb3Quc3RhdHVzICE9PSBQbG90U3RhdHVzLkFDVElWRSkgY29udGludWVcblxuICAgICAgICBzd2l0Y2ggKHBsb3QuZHJpdmVyKSB7XG4gICAgICAgICAgICBjYXNlIFBsb3REcml2ZXIuQ09OU1RBTlQ6IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBjb25zdGFudEV2YWwocGxvdC5hc3QpXG4gICAgICAgICAgICAgICAgaW5wdXRTZXRDb25zdEV2YWxBdChpLCByZXN1bHQpXG5cbiAgICAgICAgICAgICAgICBjb25zdCBjb25zdEV2YWxFcnJvciA9IGNvbnN0YW50RXZhbEdldEVycm9yKClcbiAgICAgICAgICAgICAgICBpZiAoY29uc3RFdmFsRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxvdC5zdGF0dXMgPSBQbG90U3RhdHVzLkVSUk9SXG4gICAgICAgICAgICAgICAgICAgIHBsb3QuZXJyb3IgPSBjb25zdEV2YWxFcnJvclxuICAgICAgICAgICAgICAgICAgICBpbnB1dFNldFN0YXR1c0F0KGksIHBsb3Quc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICBpbnB1dFNldEVycm9yQXQoaSwgcGxvdC5lcnJvcilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSBQbG90RHJpdmVyLkNBTlZBUzoge1xuICAgICAgICAgICAgICAgIGNhbnZhc0RyYXdGdW5jdGlvbihwbG90LmFzdCwgcGxvdC5jb2xvcilcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnN0RXZhbEVycm9yID0gY29uc3RhbnRFdmFsR2V0RXJyb3IoKVxuICAgICAgICAgICAgICAgIGlmIChjb25zdEV2YWxFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBwbG90LnN0YXR1cyA9IFBsb3RTdGF0dXMuRVJST1JcbiAgICAgICAgICAgICAgICAgICAgcGxvdC5lcnJvciA9IGNvbnN0RXZhbEVycm9yXG4gICAgICAgICAgICAgICAgICAgIGlucHV0U2V0U3RhdHVzQXQoaSwgcGxvdC5zdGF0dXMpXG4gICAgICAgICAgICAgICAgICAgIGlucHV0U2V0RXJyb3JBdChpLCBwbG90LmVycm9yKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFBsb3REcml2ZXIuV0VCR0w6XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbG90LmNvbnRpbnVvdXMpIHtcbiAgICAgICAgICAgIHNjaGVkdWxlUmVkcmF3KClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGdldFBsb3RzU2hhZGVySW5mbyA9ICgpOiB7IGZ1bmN0aW9uczogc3RyaW5nW10sIGNvbG9yczogc3RyaW5nW10sIGRpc3BsYXlNb2RlczogUGxvdERpc3BsYXlNb2RlW10sIG51bVBsb3RzOiBudW1iZXIsIGl0ZXJFeHByOiBzdHJpbmdbXSB9ID0+IHtcbiAgICBjb25zdCBzaGFkZXJGdW5jdGlvbnM6IHN0cmluZ1tdID0gW11cbiAgICBjb25zdCBjb2xvcnM6IHN0cmluZ1tdID0gW11cbiAgICBjb25zdCBkaXNwbGF5TW9kZXM6IFBsb3REaXNwbGF5TW9kZVtdID0gW11cbiAgICBjb25zdCBpdGVyRXhwcjogc3RyaW5nW10gPSBbXVxuXG4gICAgbGV0IG51bVBsb3RzID0gMFxuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gbnVtSW5wdXRzOyBpKyspIHtcbiAgICAgICAgY29uc3QgcGxvdCA9IHBsb3RzW2ldXG5cbiAgICAgICAgaWYgKCFwbG90IHx8IHBsb3QuZHJpdmVyICE9PSBQbG90RHJpdmVyLldFQkdMIHx8IHBsb3Quc3RhdHVzICE9PSBQbG90U3RhdHVzLkFDVElWRSkgY29udGludWVcblxuICAgICAgICBpZiAocGxvdC5kcml2ZXIgIT09IFBsb3REcml2ZXIuV0VCR0wpIGNvbnRpbnVlXG5cbiAgICAgICAgc2hhZGVyRnVuY3Rpb25zLnB1c2gocGxvdC5zaGFkZXJGdW5jdGlvbilcbiAgICAgICAgY29sb3JzLnB1c2gocGxvdC5jb2xvcilcbiAgICAgICAgZGlzcGxheU1vZGVzLnB1c2gocGxvdC5kaXNwbGF5TW9kZSlcbiAgICAgICAgaXRlckV4cHIucHVzaChwbG90Lml0ZXJFeHByKVxuICAgICAgICBudW1QbG90cysrXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgZnVuY3Rpb25zOiBzaGFkZXJGdW5jdGlvbnMsIGNvbG9ycywgZGlzcGxheU1vZGVzLCBudW1QbG90cywgaXRlckV4cHIgfVxufVxuIiwiZXhwb3J0IGVudW0gUGxvdERpc3BsYXlNb2RlIHtcbiAgICBOT05FLFxuICAgIENPTlNUQU5UX0VWQUwsXG4gICAgRlVOQ1RJT05fR1JBUEgsXG4gICAgU0VULFxuICAgIExFVkVMX1NFVCxcbiAgICBWRUNUT1JfRklFTEQsXG4gICAgR1JBRElFTlRcbn1cblxuZXhwb3J0IGVudW0gUGxvdFN0YXR1cyB7XG4gICAgUEVORElORyxcbiAgICBBQ1RJVkUsXG4gICAgRVJST1Jcbn1cblxuZXhwb3J0IGVudW0gUGxvdERyaXZlciB7XG4gICAgQ09OU1RBTlQsXG4gICAgQ0FOVkFTLFxuICAgIFdFQkdMXG59XG4iLCJleHBvcnQgZW51bSBUb2tlbiB7XG5cdFVOREVGLFxuXHROT05FLFxuXHRWQVIsXG5cdFZBUjIsXG5cdE5VTSxcblx0Q09OU1QsXG5cdFBBUkVOX09QLFxuXHRQQVJFTl9DTCxcblx0QlJBQ0tFVF9PUCxcblx0QlJBQ0tFVF9DTCxcblx0QlJBQ0VfT1AsXG5cdEJSQUNFX0NMLFxuXHRERUxJTSxcblx0QVNTSUdOLFxuXHRBU1NJR05BQkxFLFxuXHRMRVNTLFxuXHRHUkVBVEVSLFxuXHRMRVNTX09SX0VRVUFMLFxuXHRHUkVBVEVSX09SX0VRVUFMLFxuXHRVU0VSVkFSLFxuXHRBREQsXG5cdFNVQixcblx0TVVMVCxcblx0RElWLFxuXHRQT1csXG5cdEFORCxcblx0T1IsXG5cdE5PVF9FUVVBTCxcblx0RVFVQUwsXG5cdFRSVUUsXG5cdEZBTFNFLFxuXHRTUVJULFxuXHRFWFAsXG5cdExPRyxcblx0U0lOLFxuXHRDT1MsXG5cdFRBTixcblx0QVNJTixcblx0QUNPUyxcblx0QVRBTixcblx0U0lOSCxcblx0Q09TSCxcblx0VEFOSCxcblx0RkxPT1IsXG5cdE1JTixcblx0TUFYLFxuXHRBQlMsXG5cdE1PRCxcblx0UkFORCxcblx0UEVSTElOLFxuXHRGQUNUT1JJQUwsXG5cdFNJR01PSUQsXG5cdExFVkVMX1NFVCxcblx0VkVDVE9SX0ZJRUxELFxuXHRDSVJDTEUsXG5cdFBPSU5ULFxuXHRUSU1FLFxuXHRNQUdOSVRVREUsXG5cdElNQUdJTkFSWSxcblx0UE9MQVIsXG5cdENBUlRFU0lBTixcblx0TU9VU0VYLFxuXHRNT1VTRVksXG5cdE1PVVNFLFxuXHRTRVJJRVMsXG5cdElURVJBVE9SLFxuXHRDT01QTEVYLFxuXHRHUkFESUVOVCxcbn1cblxuZXhwb3J0IGVudW0gVG9rZW5GbGFnIHtcblx0SU1QTF9NVUxUX0JFRk9SRSA9IDEsXG5cdElNUExfTVVMVF9BRlRFUiA9IDIsXG5cdFBSRUZJWCA9IDQsXG5cdFVOSVFVRSA9IDE2LFxuXHRCRUdJTl9TQ09QRSA9IDMyLFxuXHRFTkRfU0NPUEUgPSA2NCxcblx0V0VCR0xfT05MWSA9IDEyOCxcbn1cblxuLy8gTWFwIG9mIHN0cmluZ3MgdG8gdGhlaXIgdG9rZW5zIGFuZCBmbGFncyBiaXRmaWVsZFxuY29uc3QgU3RyaW5nVG9rZW5NYXA6IHsgW2tleTogc3RyaW5nXTogeyB0b2s6IFRva2VuLCBmbGFnczogbnVtYmVyIH0gfSA9IHtcblx0Ly8gQ29udHJvbFxuXHQnKCc6IHsgdG9rOiBUb2tlbi5QQVJFTl9PUCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlVOSVFVRSB8IFRva2VuRmxhZy5CRUdJTl9TQ09QRSB9LFxuXHQnKSc6IHsgdG9rOiBUb2tlbi5QQVJFTl9DTCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfCBUb2tlbkZsYWcuVU5JUVVFIHwgVG9rZW5GbGFnLkVORF9TQ09QRSB9LFxuXHQnWyc6IHsgdG9rOiBUb2tlbi5CUkFDS0VUX09QLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuVU5JUVVFIHwgVG9rZW5GbGFnLkJFR0lOX1NDT1BFIH0sXG5cdCddJzogeyB0b2s6IFRva2VuLkJSQUNLRVRfQ0wsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0FGVEVSIHwgVG9rZW5GbGFnLlVOSVFVRSB8IFRva2VuRmxhZy5FTkRfU0NPUEUgfSxcblx0J3snOiB7IHRvazogVG9rZW4uQlJBQ0VfT1AsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5VTklRVUUgfCBUb2tlbkZsYWcuQkVHSU5fU0NPUEUgfSxcblx0J30nOiB7IHRvazogVG9rZW4uQlJBQ0VfQ0wsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0FGVEVSIHwgVG9rZW5GbGFnLlVOSVFVRSB8IFRva2VuRmxhZy5FTkRfU0NPUEUgfSxcblx0JywnOiB7IHRvazogVG9rZW4uREVMSU0sIGZsYWdzOiBUb2tlbkZsYWcuVU5JUVVFIH0sXG5cdCc9JzogeyB0b2s6IFRva2VuLkFTU0lHTiwgZmxhZ3M6IDAgfSxcblxuXHQvLyBWYXJpYWJsZXNcblx0eDogeyB0b2s6IFRva2VuLlZBUiwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUiB9LFxuXHR5OiB7IHRvazogVG9rZW4uVkFSMiwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUiB8IFRva2VuRmxhZy5XRUJHTF9PTkxZIH0sXG5cblx0Ly8gTG9naWNhbFxuXHQnPCc6IHsgdG9rOiBUb2tlbi5MRVNTLCBmbGFnczogMCB9LFxuXHQnPic6IHsgdG9rOiBUb2tlbi5HUkVBVEVSLCBmbGFnczogMCB9LFxuXHQnPD0nOiB7IHRvazogVG9rZW4uTEVTU19PUl9FUVVBTCwgZmxhZ3M6IFRva2VuRmxhZy5VTklRVUUgfSxcblx0Jz49JzogeyB0b2s6IFRva2VuLkdSRUFURVJfT1JfRVFVQUwsIGZsYWdzOiBUb2tlbkZsYWcuVU5JUVVFIH0sXG5cdCchPSc6IHsgdG9rOiBUb2tlbi5OT1RfRVFVQUwsIGZsYWdzOiBUb2tlbkZsYWcuVU5JUVVFIH0sXG5cdCc9PSc6IHsgdG9rOiBUb2tlbi5FUVVBTCwgZmxhZ3M6IFRva2VuRmxhZy5VTklRVUUgfSxcblx0JyYmJzogeyB0b2s6IFRva2VuLkFORCwgZmxhZ3M6IFRva2VuRmxhZy5VTklRVUUgfSxcblx0J3x8JzogeyB0b2s6IFRva2VuLk9SLCBmbGFnczogVG9rZW5GbGFnLlVOSVFVRSB9LFxuXG5cdC8vIEFyaXRobWV0aWNcblx0JysnOiB7IHRvazogVG9rZW4uQURELCBmbGFnczogVG9rZW5GbGFnLlVOSVFVRSB9LFxuXHQnLSc6IHsgdG9rOiBUb2tlbi5TVUIsIGZsYWdzOiBUb2tlbkZsYWcuVU5JUVVFIH0sXG5cdCcqJzogeyB0b2s6IFRva2VuLk1VTFQsIGZsYWdzOiAwIH0sXG5cdCcvJzogeyB0b2s6IFRva2VuLkRJViwgZmxhZ3M6IFRva2VuRmxhZy5VTklRVUUgfSxcblx0J14nOiB7IHRvazogVG9rZW4uUE9XLCBmbGFnczogVG9rZW5GbGFnLlVOSVFVRSB9LFxuXHQnKionOiB7IHRvazogVG9rZW4uUE9XLCBmbGFnczogVG9rZW5GbGFnLlVOSVFVRSB9LFxuXHQnJSc6IHsgdG9rOiBUb2tlbi5NT0QsIGZsYWdzOiAwIH0sXG5cdG1vZDogeyB0b2s6IFRva2VuLk1PRCwgZmxhZ3M6IDAgfSxcblxuXHQvLyBMaXRlcmFsc1xuXHR0cnVlOiB7IHRvazogVG9rZW4uVFJVRSwgZmxhZ3M6IDAgfSxcblx0ZmFsc2U6IHsgdG9rOiBUb2tlbi5GQUxTRSwgZmxhZ3M6IDAgfSxcblxuXHQvLyBGdW5jdGlvbnNcblx0c3FydDogeyB0b2s6IFRva2VuLlNRUlQsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0ZXhwOiB7IHRvazogVG9rZW4uRVhQLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXG5cdGxvZzogeyB0b2s6IFRva2VuLkxPRywgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxuXHRsbjogeyB0b2s6IFRva2VuLkxPRywgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxuXG5cdHNpbjogeyB0b2s6IFRva2VuLlNJTiwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxuXHRjb3M6IHsgdG9rOiBUb2tlbi5DT1MsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0dGFuOiB7IHRvazogVG9rZW4uVEFOLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXG5cblx0YXNpbjogeyB0b2s6IFRva2VuLkFTSU4sIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0YWNvczogeyB0b2s6IFRva2VuLkFDT1MsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0YXRhbjogeyB0b2s6IFRva2VuLkFUQU4sIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0YXJjc2luOiB7IHRvazogVG9rZW4uQVNJTiwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxuXHRhcmNjb3M6IHsgdG9rOiBUb2tlbi5BQ09TLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXG5cdGFyY3RhbjogeyB0b2s6IFRva2VuLkFUQU4sIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0c2luaDogeyB0b2s6IFRva2VuLlNJTkgsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0Y29zaDogeyB0b2s6IFRva2VuLkNPU0gsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0dGFuaDogeyB0b2s6IFRva2VuLlRBTkgsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblxuXHRmbG9vcjogeyB0b2s6IFRva2VuLkZMT09SLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXG5cdG1pbjogeyB0b2s6IFRva2VuLk1JTiwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxuXHRtYXg6IHsgdG9rOiBUb2tlbi5NQVgsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0YWJzOiB7IHRvazogVG9rZW4uQUJTLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXG5cblx0cmFuZDogeyB0b2s6IFRva2VuLlJBTkQsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0cmFuZG9tOiB7IHRvazogVG9rZW4uUkFORCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxuXHRwZXJsaW46IHsgdG9rOiBUb2tlbi5QRVJMSU4sIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0bm9pc2U6IHsgdG9rOiBUb2tlbi5QRVJMSU4sIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0ZmFjdDogeyB0b2s6IFRva2VuLkZBQ1RPUklBTCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxuXHRmYWN0b3JpYWw6IHsgdG9rOiBUb2tlbi5GQUNUT1JJQUwsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblx0c2lnbW9pZDogeyB0b2s6IFRva2VuLlNJR01PSUQsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcblxuXHQvLyBTY2FsYXIgZmllbGRzXG5cdExldmVsOiB7IHRvazogVG9rZW4uTEVWRUxfU0VULCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIHwgVG9rZW5GbGFnLldFQkdMX09OTFkgfSxcblx0Tml2ZWF1OiB7IHRvazogVG9rZW4uTEVWRUxfU0VULCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIHwgVG9rZW5GbGFnLldFQkdMX09OTFkgfSxcblxuXHQvLyBWZWN0b3IgZmllbGRzXG5cdFZlY3RvckZpZWxkOiB7IHRvazogVG9rZW4uVkVDVE9SX0ZJRUxELCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXG5cdFxuXHQvLyBTdXJyb3VuZGluZ1xuXHQnfCc6IHsgdG9rOiBUb2tlbi5BQlMsIGZsYWdzOiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUgfCBUb2tlbkZsYWcuRU5EX1NDT1BFIH0sXG5cblx0Ly8gU2hhcGVzXG5cdENpcmNsZTogeyB0b2s6IFRva2VuLkNJUkNMRSwgZmxhZ3M6IFRva2VuRmxhZy5QUkVGSVggfCBUb2tlbkZsYWcuV0VCR0xfT05MWSB9LFxuXHRQb2ludDogeyB0b2s6IFRva2VuLlBPSU5ULCBmbGFnczogVG9rZW5GbGFnLlBSRUZJWCB8IFRva2VuRmxhZy5XRUJHTF9PTkxZIH0sXG5cdFxuXHQvLyBDb252ZXJzaW9uc1xuXHRQb2xhcjogeyB0b2s6IFRva2VuLlBPTEFSLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIHwgVG9rZW5GbGFnLldFQkdMX09OTFkgfSxcblx0UG9sOiB7IHRvazogVG9rZW4uUE9MQVIsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfCBUb2tlbkZsYWcuV0VCR0xfT05MWSB9LFxuXHRDYXJ0ZXNpYW46IHsgdG9rOiBUb2tlbi5DQVJURVNJQU4sIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfCBUb2tlbkZsYWcuV0VCR0xfT05MWSB9LFxuXHRDYXJ0OiB7IHRvazogVG9rZW4uQ0FSVEVTSUFOLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIHwgVG9rZW5GbGFnLldFQkdMX09OTFkgfSxcblxuXHQvLyBUaW1lXG5cdHQ6IHsgdG9rOiBUb2tlbi5USU1FLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuSU1QTF9NVUxUX0FGVEVSIH0sXG5cblx0Ly8gSW5wdXRzXG5cdG1vdXNlWDogeyB0b2s6IFRva2VuLk1PVVNFWCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUiB9LFxuXHRtb3VzZVk6IHsgdG9rOiBUb2tlbi5NT1VTRVksIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSxcblx0bW91c2U6IHsgdG9rOiBUb2tlbi5NT1VTRSwgZmxhZ3M6IDAgfSxcblxuXHQvLyBDb21wbGV4XG5cdGk6IHsgdG9rOiBUb2tlbi5JTUFHSU5BUlksIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSxcblxuXHRTZXJpZXM6IHsgdG9rOiBUb2tlbi5TRVJJRVMsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfCBUb2tlbkZsYWcuV0VCR0xfT05MWSB9LFxuXHRrOiB7IHRvazogVG9rZW4uSVRFUkFUT1IsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSxcblx0ejogeyB0b2s6IFRva2VuLkNPTVBMRVgsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSxcblx0TWFnOiB7IHRvazogVG9rZW4uTUFHTklUVURFLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXG5cdEdyYWRpZW50OiB7IHRvazogVG9rZW4uR1JBRElFTlQsIGZsYWdzOiBUb2tlbkZsYWcuUFJFRklYIH1cbn1cblxuY29uc3QgU3RyaW5nQ29uc3RhbnRNYXA6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0gPSB7XG5cdHBpOiBNYXRoLlBJLFxuXHRQaTogTWF0aC5QSSxcblx0ZTogTWF0aC5FXG59XG5cbmNvbnN0IGVzY2FwZVJlZ0V4cCA9IChzdHI6IHN0cmluZykgPT4ge1xuXHRyZXR1cm4gc3RyLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJylcbn1cblxuZXhwb3J0IHR5cGUgRXJyb3IgPSB7IGRlc2M6IHN0cmluZywgcG9zOiBudW1iZXIgfVxuXG5sZXQgbGF0ZXN0RXJyb3I6IEVycm9yIHwgbnVsbCA9IG51bGxcbmV4cG9ydCBjb25zdCBsZXhlckdldEVycm9yID0gKCk6IEVycm9yIHwgbnVsbCA9PiBsYXRlc3RFcnJvclxuXG5jb25zdCByZXBvcnRFcnJvciA9IChlcnJvcjogc3RyaW5nLCBwb3NpdGlvbjogbnVtYmVyKSA9PiB7XG5cdGNvbnNvbGUuZXJyb3IoYEVycm9yIGF0IHBvc2l0aW9uICR7cG9zaXRpb259OiAke2Vycm9yfWApXG5cdGxhdGVzdEVycm9yID0geyBkZXNjOiBlcnJvciwgcG9zOiBwb3NpdGlvbiB9XG59XG5cbmNvbnN0IGlzSWRlbnRpZmllciA9IChzdHI6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuXHRyZXR1cm4gL15bYS16QS1aX11bYS16QS1aMC05X10qJC8udGVzdChzdHIpXG59XG5cbmNvbnN0IEV4dGVyblZhcmlhYmxlczogeyBba2V5OiBzdHJpbmddOiB7IGdldDogKCkgPT4gbnVtYmVyLCBzZXQ6ICh2YWw6IG51bWJlcikgPT4gdm9pZCB9IH0gPSB7fVxuXG5leHBvcnQgY29uc3QgYmluZEV4dGVyblZhcmlhYmxlID0gKG5hbWU6IHN0cmluZywgZ2V0dGVyOiAoKSA9PiBudW1iZXIsIHNldHRlcjogKHZhbHVlOiBudW1iZXIpID0+IHZvaWQpID0+IHtcblx0RXh0ZXJuVmFyaWFibGVzW25hbWVdID0geyBnZXQ6IGdldHRlciwgc2V0OiBzZXR0ZXIgfVxufVxuXG5leHBvcnQgY29uc3QgdW5iaW5kRXh0ZXJuVmFyaWFibGUgPSAobmFtZTogc3RyaW5nKSA9PiB7XG5cdGRlbGV0ZSBFeHRlcm5WYXJpYWJsZXNbbmFtZV1cbn1cblxuZXhwb3J0IGNvbnN0IGdldEV4dGVyblZhcmlhYmxlID0gKG5hbWU6IHN0cmluZyk6IHsgZ2V0OiAoKSA9PiBudW1iZXIsIHNldDogKHZhbDogbnVtYmVyKSA9PiB2b2lkIH0gfCBudWxsID0+IHtcblx0cmV0dXJuIEV4dGVyblZhcmlhYmxlc1tuYW1lXVxufVxuXG5sZXQgVXNlclZhcmlhYmxlczogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSA9IHt9XG5cbmV4cG9ydCBjb25zdCBzZXRVc2VyVmFyaWFibGUgPSAobmFtZTogc3RyaW5nLCB2YWx1ZTogbnVtYmVyKSA9PiB7XG5cdFVzZXJWYXJpYWJsZXNbbmFtZV0gPSB2YWx1ZVxufVxuXG5leHBvcnQgY29uc3QgZ2V0VXNlclZhcmlhYmxlID0gKG5hbWU6IHN0cmluZyk6IG51bWJlciA9PiBVc2VyVmFyaWFibGVzW25hbWVdIHx8IDBcblxuZXhwb3J0IGNvbnN0IGNsZWFyVXNlclZhcmlhYmxlcyA9ICgpID0+IHtcblx0VXNlclZhcmlhYmxlcyA9IHt9XG59XG5cbmV4cG9ydCB0eXBlIE9wQ29kZSA9IHsgdG9rOiBUb2tlbiwgdmFsOiBudW1iZXIgfCBzdHJpbmcsIGZsYWdzOiBUb2tlbkZsYWcgfVxuXG5leHBvcnQgY29uc3QgbGV4ID0gKHN0cjogc3RyaW5nKTogT3BDb2RlW10gPT4ge1xuXHRsYXRlc3RFcnJvciA9IG51bGxcblxuXHRzdHIgPSBzdHIucmVwbGFjZSgvXFxzL2csICcnKVxuXG5cdGNvbnN0IGNodW5rcyA9IHN0ci5zcGxpdChcblx0XHRuZXcgUmVnRXhwKGAoJHtPYmplY3Rcblx0XHRcdC5rZXlzKFN0cmluZ1Rva2VuTWFwKVxuXHRcdFx0LmZpbHRlcihrID0+IFN0cmluZ1Rva2VuTWFwW2tdLmZsYWdzICYgVG9rZW5GbGFnLlVOSVFVRSlcblx0XHRcdC5tYXAoayA9PiBlc2NhcGVSZWdFeHAoaykpXG5cdFx0XHQuam9pbignfCcpfSlgLCAnZycpKVxuXHRcdC5maWx0ZXIoKHNlZzogc3RyaW5nKSA9PiBzZWcgIT09ICcnKVxuXG5cdGNvbnN0IG9wczogT3BDb2RlW10gPSBbXVxuXHRsZXQgcG9zID0gMFxuXG5cdGNodW5rcy5mb3JFYWNoKChjaHVuazogc3RyaW5nKSA9PiB7XG5cdFx0bGV0IGZyb20gPSAwXG5cdFx0XG5cdFx0Zm9yIChsZXQgaSA9IGNodW5rLmxlbmd0aDsgaSA+IGZyb207IGktLSkge1xuXHRcdFx0Y29uc3QgYnVmID0gY2h1bmsuc3Vic3RyaW5nKGZyb20sIGkpXG5cdFx0XHRsZXQgZm91bmQgPSBmYWxzZVxuXG5cdFx0XHRpZiAoU3RyaW5nVG9rZW5NYXBbYnVmXSkge1xuXHRcdFx0XHRvcHMucHVzaCh7IHRvazogU3RyaW5nVG9rZW5NYXBbYnVmXS50b2ssIHZhbDogMCwgZmxhZ3M6IFN0cmluZ1Rva2VuTWFwW2J1Zl0uZmxhZ3MgfSlcblx0XHRcdFx0Zm91bmQgPSB0cnVlXG5cdFx0XHR9IGVsc2UgaWYgKFN0cmluZ0NvbnN0YW50TWFwW2J1Zl0pIHtcblx0XHRcdFx0b3BzLnB1c2goeyB0b2s6IFRva2VuLkNPTlNULCB2YWw6IFN0cmluZ0NvbnN0YW50TWFwW2J1Zl0sIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSlcblx0XHRcdFx0Zm91bmQgPSB0cnVlXG5cdFx0XHR9IGVsc2UgaWYgKEV4dGVyblZhcmlhYmxlc1tidWZdKSB7XG5cdFx0XHRcdG9wcy5wdXNoKHsgdG9rOiBUb2tlbi5BU1NJR05BQkxFLCB2YWw6IGJ1ZiwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUiB9KVxuXHRcdFx0XHRmb3VuZCA9IHRydWVcblx0XHRcdH0gZWxzZSBpZiAoIWlzTmFOKE51bWJlcihidWYpKSkge1xuXHRcdFx0XHRvcHMucHVzaCh7IHRvazogVG9rZW4uTlVNLCB2YWw6IHBhcnNlRmxvYXQoYnVmKSwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSlcblx0XHRcdFx0Zm91bmQgPSB0cnVlXG5cdFx0XHR9IGVsc2UgaWYgKGkgLSAxID09PSBmcm9tKSB7XG5cdFx0XHRcdGxldCBsb25nZXN0SWRlbnQgPSAnJ1xuXHRcdFx0XHRmb3IgKGxldCBqID0gZnJvbSArIDE7IGogPD0gY2h1bmsubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRjb25zdCB0bXAgPSBjaHVuay5zdWJzdHJpbmcoZnJvbSwgailcblx0XHRcdFx0XHRpZiAoIWlzSWRlbnRpZmllcih0bXApKSB7XG5cdFx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsb25nZXN0SWRlbnQgPSB0bXBcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobG9uZ2VzdElkZW50ICE9PSAnJykge1xuXHRcdFx0XHRcdG9wcy5wdXNoKHsgdG9rOiBUb2tlbi5VU0VSVkFSLCB2YWw6IGxvbmdlc3RJZGVudCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUiB9KVxuXHRcdFx0XHRcdGZyb20gKz0gbG9uZ2VzdElkZW50Lmxlbmd0aFxuXHRcdFx0XHRcdGkgPSBjaHVuay5sZW5ndGggKyAxXG5cdFx0XHRcdFx0Y29udGludWVcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXBvcnRFcnJvcihgVW5rbm93biB0b2tlbjogwrQke2NodW5rLnN1YnN0cmluZyhmcm9tLCBjaHVuay5sZW5ndGgpfcK0YCwgcG9zICsgZnJvbSlcblx0XHRcdFx0cmV0dXJuIFtdXG5cdFx0XHR9XG5cblx0XHRcdGlmIChmb3VuZCkge1xuXHRcdFx0XHRmcm9tID0gaVxuXHRcdFx0XHRpID0gY2h1bmsubGVuZ3RoICsgMVxuXHRcdFx0XHRjb250aW51ZVxuXHRcdFx0fVxuXHRcdH1cblx0XHRwb3MgKz0gY2h1bmsubGVuZ3RoXG5cdH0pXG5cblx0cmV0dXJuIG9wc1xufVxuIiwiaW1wb3J0IHsgUGxvdERpc3BsYXlNb2RlLCBQbG90RHJpdmVyIH0gZnJvbSAnLi4vZGVmaW5lcydcbmltcG9ydCB7IFRva2VuLCBUb2tlbkZsYWcsIE9wQ29kZSwgRXJyb3IsIGxleCwgbGV4ZXJHZXRFcnJvciB9IGZyb20gJy4vbGV4ZXInXG5cbmNvbnN0IE1BWF9QUkVDRURFTkNFID0gOFxuY29uc3QgVG9rZW5QcmVjZWRlbmNlOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge1xuXHRbVG9rZW4uT1JdOiAwLFxuXHRbVG9rZW4uREVMSU1dOiAxLFxuXHRbVG9rZW4uQU5EXTogMixcblx0W1Rva2VuLkVRVUFMXTogMyxcblx0W1Rva2VuLk5PVF9FUVVBTF06IDMsXG5cdFtUb2tlbi5BU1NJR05dOiAzLFxuXHRbVG9rZW4uTEVTU106IDQsXG5cdFtUb2tlbi5MRVNTX09SX0VRVUFMXTogNCxcblx0W1Rva2VuLkdSRUFURVJdOiA0LFxuXHRbVG9rZW4uR1JFQVRFUl9PUl9FUVVBTF06IDQsXG5cdFtUb2tlbi5BRERdOiA1LFxuXHRbVG9rZW4uU1VCXTogNSxcblx0W1Rva2VuLk1VTFRdOiA2LFxuXHRbVG9rZW4uRElWXTogNixcblx0W1Rva2VuLk1PRF06IDYsXG5cdFtUb2tlbi5QT1ddOiA3XG59XG5cbmV4cG9ydCB0eXBlIEFTVE5vZGUgPSB7XG5cdG9wOiBPcENvZGUsXG5cdGxlZnQ6IEFTVE5vZGUgfCBudWxsLFxuXHRyaWdodDogQVNUTm9kZSB8IG51bGxcbn1cblxuY29uc3QgcmVwb3J0RXJyb3IgPSAoZXJyb3I6IHN0cmluZywgcG9zaXRpb246IG51bWJlcikgPT4ge1xuXHRjb25zb2xlLmVycm9yKGBFcnJvciBhdCBwb3NpdGlvbiAke3Bvc2l0aW9ufTogJHtlcnJvcn1gKVxuXHRsYXRlc3RFcnJvciA9IHsgZGVzYzogZXJyb3IsIHBvczogcG9zaXRpb24gfVxufVxuXG5sZXQgbGF0ZXN0RXJyb3I6IEVycm9yIHwgbnVsbCA9IG51bGxcbmxldCBjb250aW51b3VzID0gZmFsc2VcbmxldCBkcml2ZXI6IFBsb3REcml2ZXIgPSBQbG90RHJpdmVyLkNPTlNUQU5UXG5sZXQgZGlzcGxheU1vZGU6IFBsb3REaXNwbGF5TW9kZSA9IFBsb3REaXNwbGF5TW9kZS5OT05FXG5cbmV4cG9ydCBjb25zdCBwYXJzZXJHZXRFcnJvciA9ICgpOiBFcnJvciB8IG51bGwgPT4gbGF0ZXN0RXJyb3JcbmV4cG9ydCBjb25zdCBwYXJzZXJHZXRDb250aW51b3VzID0gKCk6IGJvb2xlYW4gPT4gY29udGludW91c1xuZXhwb3J0IGNvbnN0IHBhcnNlckdldERyaXZlciA9ICgpOiBQbG90RHJpdmVyID0+IGRyaXZlclxuZXhwb3J0IGNvbnN0IHBhcnNlckdldERpc3BsYXlNb2RlID0gKCk6IFBsb3REaXNwbGF5TW9kZSA9PiBkaXNwbGF5TW9kZVxuXG5leHBvcnQgY29uc3QgcGFyc2UgPSAoaW5wdXQ6IHN0cmluZyk6IEFTVE5vZGUgfCBudWxsID0+IHtcblx0bGF0ZXN0RXJyb3IgPSBudWxsXG5cdGNvbnRpbnVvdXMgPSBmYWxzZVxuXHRkcml2ZXIgPSBQbG90RHJpdmVyLkNPTlNUQU5UXG5cdGRpc3BsYXlNb2RlID0gUGxvdERpc3BsYXlNb2RlLk5PTkVcblxuXHRsZXQgb3BzOiBPcENvZGVbXSB8IG51bGwgPSBsZXgoaW5wdXQpXG5cdGNvbnNvbGUuZGVidWcoJ0xleGVyIG91dHB1dDonLCBvcHMpXG5cblx0Y29uc3QgbGV4ZXJFcnJvciA9IGxleGVyR2V0RXJyb3IoKVxuXHRpZiAobGV4ZXJFcnJvcikge1xuXHRcdGxhdGVzdEVycm9yID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShsZXhlckVycm9yKSlcblx0XHRyZXR1cm4gbnVsbFxuXHR9XG5cblx0b3BzID0gdmFsaWRhdGUob3BzKVxuXHRjb25zb2xlLmRlYnVnKCdWYWxpZGF0ZWQgb3BzOicsIG9wcylcblx0aWYgKG9wcyA9PSBudWxsKSByZXR1cm4gbnVsbFxuXHRcblx0b3BzID0gZXhwYW5kKG9wcylcblx0Y29uc29sZS5kZWJ1ZygnRXhwYW5kZWQgb3BzOicsIG9wcylcblx0aWYgKG9wcyA9PSBudWxsKSByZXR1cm4gbnVsbFxuXHRcblx0Y29uc3QgbnVtVmFycyA9IChvcHMuZmlsdGVyKG9wID0+IG9wLnRvayA9PT0gVG9rZW4uVkFSKS5sZW5ndGggPiAwID8gMSA6IDApICtcblx0XHQob3BzLmZpbHRlcihvcCA9PiBvcC50b2sgPT09IFRva2VuLlZBUjIpLmxlbmd0aCA+IDAgPyAxIDogMClcblxuXHRpZiAob3BzLmZpbHRlcihvcCA9PiBvcC5mbGFncyAmIFRva2VuRmxhZy5XRUJHTF9PTkxZKS5sZW5ndGggPiAwKSB7XG5cdFx0ZHJpdmVyID0gUGxvdERyaXZlci5XRUJHTFxuXHRcdGRpc3BsYXlNb2RlID0gUGxvdERpc3BsYXlNb2RlLlNFVFxuXHRcdGlmIChvcHMuZmlsdGVyKG9wID0+IG9wLnRvayA9PT0gVG9rZW4uTEVWRUxfU0VUKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRkaXNwbGF5TW9kZSA9IFBsb3REaXNwbGF5TW9kZS5MRVZFTF9TRVRcblx0XHR9IGVsc2UgaWYgKG9wcy5maWx0ZXIob3AgPT4gb3AudG9rID09PSBUb2tlbi5WRUNUT1JfRklFTEQpLmxlbmd0aCA+IDApIHtcblx0XHRcdGRpc3BsYXlNb2RlID0gUGxvdERpc3BsYXlNb2RlLlZFQ1RPUl9GSUVMRFxuXHRcdH0gZWxzZSBpZiAob3BzLmZpbHRlcihvcCA9PiBvcC50b2sgPT09IFRva2VuLkdSQURJRU5UKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRkaXNwbGF5TW9kZSA9IFBsb3REaXNwbGF5TW9kZS5HUkFESUVOVFxuXHRcdH1cblx0fSBlbHNlIGlmIChudW1WYXJzID09PSAwKSB7XG5cdFx0ZHJpdmVyID0gUGxvdERyaXZlci5DT05TVEFOVFxuXHRcdGRpc3BsYXlNb2RlID0gUGxvdERpc3BsYXlNb2RlLkNPTlNUQU5UX0VWQUxcblx0fSBlbHNlIGlmIChudW1WYXJzID09PSAxKSB7XG5cdFx0ZHJpdmVyID0gUGxvdERyaXZlci5DQU5WQVNcblx0XHRkaXNwbGF5TW9kZSA9IFBsb3REaXNwbGF5TW9kZS5GVU5DVElPTl9HUkFQSFxuXHR9XG5cblx0Y29udGludW91cyA9IG9wcy5maWx0ZXIob3AgPT4gb3AudG9rID09PSBUb2tlbi5USU1FKS5sZW5ndGggPiAwIHx8XG5cdFx0b3BzLmZpbHRlcihvcCA9PiBvcC50b2sgPT09IFRva2VuLk1PVVNFWCkubGVuZ3RoID4gMCB8fFxuXHRcdG9wcy5maWx0ZXIob3AgPT4gb3AudG9rID09PSBUb2tlbi5NT1VTRVkpLmxlbmd0aCA+IDBcblx0XG5cdG9wcyA9IG9wdGltaXplKG9wcylcblx0Y29uc29sZS5kZWJ1ZygnT3B0aW1pemVkIG9wczonLCBvcHMpXG5cdGlmIChvcHMgPT0gbnVsbCkgcmV0dXJuIG51bGxcblx0XG5cdHJldHVybiBidWlsZEFTVChvcHMpXG59XG5cbmNvbnN0IHZhbGlkYXRlID0gKG9wczogT3BDb2RlW10pOiBPcENvZGVbXSB8IG51bGwgPT4ge1xuXHQvLyBDaGVjayBmb3IgdW5tYXRjaGVkIGFuZCBtaXNtYXRjaGVkIHBhcmVudGhlc2VzXG5cdGNvbnN0IHBhcmVuU3RhY2s6IHsgdG9rOiBUb2tlbiwgcG9zOiBudW1iZXIgfVtdID0gW11cblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG9wcy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IG9wID0gb3BzW2ldXG5cblx0XHRpZiAob3AuZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpIHtcblx0XHRcdHBhcmVuU3RhY2sucHVzaCh7IHRvazogb3AudG9rLCBwb3M6IGkgfSlcblx0XHR9XG5cblx0XHRpZiAob3AuZmxhZ3MgJiBUb2tlbkZsYWcuRU5EX1NDT1BFKSB7XG5cdFx0XHRjb25zdCB7IHRvaywgcG9zIH0gPSBwYXJlblN0YWNrLnBvcCgpIHx8IHsgdG9rOiBUb2tlbi5OT05FLCBwb3M6IDAgfVxuXG5cdFx0XHRsZXQgZXhwZWN0VG9rOiBUb2tlbiA9IFRva2VuLk5PTkVcblx0XHRcdHN3aXRjaCAodG9rKSB7XG5cdFx0XHRcdGNhc2UgVG9rZW4uUEFSRU5fT1A6IGV4cGVjdFRvayA9IFRva2VuLlBBUkVOX0NMOyBicmVha1xuXHRcdFx0XHRjYXNlIFRva2VuLkJSQUNLRVRfT1A6IGV4cGVjdFRvayA9IFRva2VuLkJSQUNLRVRfQ0w7IGJyZWFrXG5cdFx0XHRcdGNhc2UgVG9rZW4uQlJBQ0VfT1A6IGV4cGVjdFRvayA9IFRva2VuLkJSQUNFX0NMOyBicmVha1xuXHRcdFx0XHRjYXNlIFRva2VuLkFCUzogZXhwZWN0VG9rID0gVG9rZW4uQUJTOyBicmVha1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3AudG9rICE9PSBleHBlY3RUb2spIHtcblx0XHRcdFx0cmVwb3J0RXJyb3IoJ01pc21hdGNoZWQgcGFyZW50aGVzZXMnLCBwb3MpXG5cdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKHBhcmVuU3RhY2subGVuZ3RoID4gMCkge1xuXHRcdGNvbnN0IHsgcG9zIH0gPSBwYXJlblN0YWNrWzBdXG5cdFx0cmVwb3J0RXJyb3IoJ1VubWF0Y2hlZCBwYXJlbnRoZXNlcycsIHBvcylcblx0XHRyZXR1cm4gbnVsbFxuXHR9XG5cblx0cmV0dXJuIG9wc1xufVxuXG5jb25zdCBleHBhbmQgPSAob3BzOiBPcENvZGVbXSk6IE9wQ29kZVtdIHwgbnVsbCA9PiB7XG5cdC8vIFJlcGxhY2UgfHh8IHdpdGggYWJzKHgpXG5cdGNvbnN0IGFic1N0YWNrOiB7IHRvazogVG9rZW4sIHBvczogbnVtYmVyIH1bXSA9IFtdXG5cdFxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG9wcy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IG9wID0gb3BzW2ldXG5cblx0XHRpZiAob3AudG9rID09PSBUb2tlbi5BQlMgJiYgb3AuZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpIHtcblx0XHRcdGNvbnN0IHRvcCA9IGFic1N0YWNrLnBvcCgpXG5cdFx0XHRhYnNTdGFjay5wdXNoKHsgdG9rOiBvcC50b2ssIHBvczogaSB9KVxuXHRcdFx0aWYgKCF0b3ApIGNvbnRpbnVlXG5cblx0XHRcdGNvbnN0IGFic0V4cHIgPSBvcHMuc3BsaWNlKHRvcC5wb3MgKyAxLCBpIC0gdG9wLnBvcyAtIDEpXG5cdFx0XHRvcHMuc3BsaWNlKHRvcC5wb3MsIDIpXG5cdFx0XHRvcHMuc3BsaWNlKHRvcC5wb3MsIDAsXG5cdFx0XHRcdHsgdG9rOiBUb2tlbi5BQlMsIHZhbDogMCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxuXHRcdFx0XHR7IHRvazogVG9rZW4uUEFSRU5fT1AsIHZhbDogMCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlVOSVFVRSB8IFRva2VuRmxhZy5CRUdJTl9TQ09QRSB9LFxuXHRcdFx0XHQuLi5hYnNFeHByLFxuXHRcdFx0XHR7IHRvazogVG9rZW4uUEFSRU5fQ0wsIHZhbDogMCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfCBUb2tlbkZsYWcuVU5JUVVFIHwgVG9rZW5GbGFnLkVORF9TQ09QRSB9XG5cdFx0XHQpXG5cdFx0XHRpID0gdG9wLnBvcyArIGFic0V4cHIubGVuZ3RoICsgM1xuXHRcdFx0YWJzU3RhY2sucG9wKClcblx0XHR9XG5cdH1cblxuXHQvLyBSZXBsYWNlIG1vdXNlIHdpdGggbW91c2VYLCBkZWxpbSwgbW91c2VZIGFuZCB6IHdpdGggeCArIHkgKiBpXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgb3BzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKG9wc1tpXS50b2sgPT09IFRva2VuLk1PVVNFKSB7XG5cdFx0XHRvcHMuc3BsaWNlKGksIDEsXG5cdFx0XHRcdHsgdG9rOiBUb2tlbi5NT1VTRVgsIHZhbDogMCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIH0sXG5cdFx0XHRcdHsgdG9rOiBUb2tlbi5ERUxJTSwgdmFsOiAwLCBmbGFnczogMCB9LFxuXHRcdFx0XHR7IHRvazogVG9rZW4uTU9VU0VZLCB2YWw6IDAsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB9XG5cdFx0XHQpXG5cdFx0XHRpICs9IDJcblx0XHR9IGVsc2UgaWYgKG9wc1tpXS50b2sgPT09IFRva2VuLkNPTVBMRVgpIHtcblx0XHRcdG9wcy5zcGxpY2UoaSwgMSxcblx0XHRcdFx0eyB0b2s6IFRva2VuLlBBUkVOX09QLCB2YWw6IDAsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5CRUdJTl9TQ09QRSB9LFxuXHRcdFx0XHR7IHRvazogVG9rZW4uVkFSLCB2YWw6IDAsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSxcblx0XHRcdFx0eyB0b2s6IFRva2VuLkFERCwgdmFsOiAwLCBmbGFnczogMCB9LFxuXHRcdFx0XHR7IHRvazogVG9rZW4uVkFSMiwgdmFsOiAwLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuSU1QTF9NVUxUX0FGVEVSIHwgVG9rZW5GbGFnLldFQkdMX09OTFkgfSxcblx0XHRcdFx0eyB0b2s6IFRva2VuLklNQUdJTkFSWSwgdmFsOiAwLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuSU1QTF9NVUxUX0FGVEVSIH0sXG5cdFx0XHRcdHsgdG9rOiBUb2tlbi5QQVJFTl9DTCwgdmFsOiAwLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUiB8IFRva2VuRmxhZy5FTkRfU0NPUEUgfVxuXHRcdFx0KVxuXHRcdFx0aSArPSA1XG5cdFx0fVxuXHR9XG5cblx0Ly8gSW5zZXJ0IGltcGxpY2l0IG11bHRpcGxpY2F0aW9uXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgb3BzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKChvcHNbaSAtIDFdLmZsYWdzICYgVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUikgJiYgKG9wc1tpXS5mbGFncyAmIFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFKSkge1xuXHRcdFx0b3BzLnNwbGljZShpLCAwLCB7IHRvazogVG9rZW4uTVVMVCwgdmFsOiAwLCBmbGFnczogMCB9KVxuXHRcdH1cblx0fVxuXG5cdC8vIEluc2VydCBwYXJlbnRoZXNlcyBiYXNlZCBvbiBwcmVjZWRlbmNlXG5cdGZvciAobGV0IHByZWMgPSBNQVhfUFJFQ0VERU5DRTsgcHJlYyA+IDA7IHByZWMtLSkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgb3BzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoVG9rZW5QcmVjZWRlbmNlW29wc1tpXS50b2tdID09PSBwcmVjKSB7XG5cdFx0XHRcdGxldCBsZWZ0ID0gMFxuXHRcdFx0XHRsZXQgcmlnaHQgPSBvcHMubGVuZ3RoXG5cdFx0XHRcdGxldCBsZXZlbCA9IDBcblxuXHRcdFx0XHQvLyBGaW5kIGxlZnQgYm91bmRyeVxuXHRcdFx0XHRmb3IgKGxldCBqID0gaTsgaiA+PSAwOyBqLS0pIHtcblx0XHRcdFx0XHRpZiAob3BzW2pdLmZsYWdzICYgVG9rZW5GbGFnLkJFR0lOX1NDT1BFKSB7XG5cdFx0XHRcdFx0XHRsZXZlbCsrXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChvcHNbal0uZmxhZ3MgJiBUb2tlbkZsYWcuRU5EX1NDT1BFKSB7XG5cdFx0XHRcdFx0XHRsZXZlbC0tXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKChUb2tlblByZWNlZGVuY2Vbb3BzW2pdLnRva10gPCBwcmVjICYmIGxldmVsID09PSAwKSB8fCBsZXZlbCA+IDApIHtcblx0XHRcdFx0XHRcdGxlZnQgPSBqICsgMVxuXHRcdFx0XHRcdFx0YnJlYWtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBGaW5kIHJpZ2h0IGJvdW5kcnlcblx0XHRcdFx0bGV2ZWwgPSAwXG5cdFx0XHRcdGZvciAobGV0IGogPSBpOyBqIDwgb3BzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0aWYgKG9wc1tqXS5mbGFncyAmIFRva2VuRmxhZy5CRUdJTl9TQ09QRSkge1xuXHRcdFx0XHRcdFx0bGV2ZWwrK1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAob3BzW2pdLmZsYWdzICYgVG9rZW5GbGFnLkVORF9TQ09QRSkge1xuXHRcdFx0XHRcdFx0bGV2ZWwtLVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICgoVG9rZW5QcmVjZWRlbmNlW29wc1tqXS50b2tdIDwgcHJlYyAmJiBsZXZlbCA9PT0gMCkgfHwgbGV2ZWwgPCAwKSB7XG5cdFx0XHRcdFx0XHRyaWdodCA9IGpcblx0XHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSW5zZXJ0IHBhcmVudGhlc2lzXG5cdFx0XHRcdG9wcy5zcGxpY2UocmlnaHQsIDAsIHsgdG9rOiBUb2tlbi5QQVJFTl9DTCwgdmFsOiAwLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUiB8IFRva2VuRmxhZy5VTklRVUUgfCBUb2tlbkZsYWcuRU5EX1NDT1BFIH0pXG5cdFx0XHRcdG9wcy5zcGxpY2UobGVmdCwgMCwgeyB0b2s6IFRva2VuLlBBUkVOX09QLCB2YWw6IDAsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5VTklRVUUgfCBUb2tlbkZsYWcuQkVHSU5fU0NPUEUgfSlcblx0XHRcdFx0aSsrXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gSW5zZXJ0IHplcm8gYmVmb3JlIGxlYWRpbmcgbWludXNcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvcHMubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAob3BzW2ldLnRvayA9PT0gVG9rZW4uU1VCICYmIChpID09PSAwIHx8IChvcHNbaSAtIDFdLmZsYWdzICYgVG9rZW5GbGFnLkJFR0lOX1NDT1BFKSkpIHtcblx0XHRcdG9wcy5zcGxpY2UoaSwgMCwgeyB0b2s6IFRva2VuLk5VTSwgdmFsOiAwLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUiB9KVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBvcHNcbn1cblxuY29uc3Qgb3B0aW1pemUgPSAob3BzOiBPcENvZGVbXSk6IE9wQ29kZVtdIHwgbnVsbCA9PiB7XG5cdC8vIFRydW5jYXRlIGNvbnNlY3V0aXZlIG5lZ2F0aXZlIHNpZ25zXG5cdGxldCBudW1Db25zZWNTdWIgPSAwXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgb3BzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKG9wc1tpXS50b2sgPT09IFRva2VuLlNVQikge1xuXHRcdFx0bnVtQ29uc2VjU3ViKytcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKG51bUNvbnNlY1N1YiA+IDEpIHtcblx0XHRcdFx0aWYgKG51bUNvbnNlY1N1YiAlIDIgPT09IDEpIHtcblx0XHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG51bUNvbnNlY1N1YiAtIDE7IGorKykge1xuXHRcdFx0XHRcdFx0b3BzLnNwbGljZShpIC0gbnVtQ29uc2VjU3ViLCAxKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG51bUNvbnNlY1N1YjsgaisrKSB7XG5cdFx0XHRcdFx0XHRvcHMuc3BsaWNlKGkgLSBudW1Db25zZWNTdWIsIDEpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9wcy5zcGxpY2UoaSAtIG51bUNvbnNlY1N1YiwgMCwgeyB0b2s6IFRva2VuLkFERCwgdmFsOiAwLCBmbGFnczogMCB9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRudW1Db25zZWNTdWIgPSAwXG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIGVtcHR5IHBhcmVudGhlc2lzXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgb3BzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKChvcHNbaV0uZmxhZ3MgJiBUb2tlbkZsYWcuRU5EX1NDT1BFKSAmJiAob3BzW2kgLSAxXS5mbGFncyAmIFRva2VuRmxhZy5CRUdJTl9TQ09QRSkpIHtcblx0XHRcdG9wcy5zcGxpY2UoaSAtIDEsIDIpXG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG9wc1xufVxuXG5jb25zdCBidWlsZEFTVCA9IChvcHM6IE9wQ29kZVtdKTogQVNUTm9kZSB8IG51bGwgPT4ge1xuXHRjb25zdCByb290OiBBU1ROb2RlID0geyBvcDogeyB0b2s6IFRva2VuLk5PTkUsIHZhbDogMCwgZmxhZ3M6IDAgfSwgbGVmdDogbnVsbCwgcmlnaHQ6IG51bGwgfVxuXHRsZXQgY3VycmVudDogQVNUTm9kZSA9IHJvb3Rcblx0Y29uc3Qgc3RhY2s6IEFTVE5vZGVbXSA9IFtdXG5cdGxldCBsZXZlbCA9IDBcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG9wcy5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IG9wID0gb3BzW2ldXG5cblx0XHRpZiAob3AuZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpIHtcblx0XHRcdGxldmVsKytcblx0XHR9IGVsc2UgaWYgKG9wLmZsYWdzICYgVG9rZW5GbGFnLkVORF9TQ09QRSkge1xuXHRcdFx0aWYgKGxldmVsIDw9IDApIHtcblx0XHRcdFx0cmVwb3J0RXJyb3IoJ1VuZXhwZWN0ZWQgZW5kIG9mIHNjb3BlJywgaSlcblx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdH1cblx0XHRcdGxldmVsLS1cblx0XHRcdGN1cnJlbnQgPSBzdGFjay5wb3AoKSBhcyBBU1ROb2RlXG5cdFx0XHRjb250aW51ZVxuXHRcdH1cblxuXHRcdGlmIChjdXJyZW50Lm9wID09IG51bGwgfHwgY3VycmVudC5vcC50b2sgPT09IFRva2VuLk5PTkUgfHwgKGN1cnJlbnQub3AuZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpKSB7XG5cdFx0XHRjdXJyZW50Lm9wID0gb3BcblxuXHRcdFx0aWYgKGN1cnJlbnQub3AuZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpIHtcblx0XHRcdFx0c3RhY2sucHVzaChjdXJyZW50KVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoY3VycmVudC5sZWZ0ID09IG51bGwpIHtcblx0XHRcdFx0aWYgKGN1cnJlbnQub3AuZmxhZ3MgJiBUb2tlbkZsYWcuUFJFRklYKSB7XG5cdFx0XHRcdFx0Y3VycmVudC5sZWZ0ID0geyBvcDogeyB0b2s6IFRva2VuLlVOREVGLCB2YWw6IDAsIGZsYWdzOiAwIH0sIGxlZnQ6IG51bGwsIHJpZ2h0OiBudWxsIH1cblx0XHRcdFx0XHRjdXJyZW50LnJpZ2h0ID0geyBvcCwgbGVmdDogbnVsbCwgcmlnaHQ6IG51bGwgfVxuXG5cdFx0XHRcdFx0aWYgKGN1cnJlbnQucmlnaHQub3AuZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpIHtcblx0XHRcdFx0XHRcdHN0YWNrLnB1c2goY3VycmVudClcblx0XHRcdFx0XHRcdGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB0bXAgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGN1cnJlbnQpKVxuXHRcdFx0XHRjdXJyZW50LmxlZnQgPSB0bXBcblx0XHRcdFx0Y3VycmVudC5vcCA9IG9wXG5cdFx0XHR9IGVsc2UgaWYgKGN1cnJlbnQucmlnaHQgPT0gbnVsbCB8fCAoY3VycmVudC5yaWdodC5vcC5mbGFncyAmIFRva2VuRmxhZy5CRUdJTl9TQ09QRSkpIHtcblx0XHRcdFx0Y3VycmVudC5yaWdodCA9IHsgb3AsIGxlZnQ6IG51bGwsIHJpZ2h0OiBudWxsIH1cblx0XHRcdFx0XG5cdFx0XHRcdGlmIChjdXJyZW50LnJpZ2h0Lm9wLmZsYWdzICYgVG9rZW5GbGFnLkJFR0lOX1NDT1BFKSB7XG5cdFx0XHRcdFx0c3RhY2sucHVzaChjdXJyZW50KVxuXHRcdFx0XHRcdGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoY3VycmVudC5yaWdodC5vcC5mbGFncyAmIFRva2VuRmxhZy5QUkVGSVggJiYgY3VycmVudC5yaWdodC5yaWdodCA9PSBudWxsKSB7XG5cdFx0XHRcdHN0YWNrLnB1c2goY3VycmVudClcblx0XHRcdFx0Y3VycmVudCA9IGN1cnJlbnQucmlnaHRcblx0XHRcdFx0Y3VycmVudC5yaWdodCA9IHsgb3AsIGxlZnQ6IG51bGwsIHJpZ2h0OiBudWxsIH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHRtcCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY3VycmVudCkpXG5cdFx0XHRcdGN1cnJlbnQubGVmdCA9IHRtcFxuXHRcdFx0XHRjdXJyZW50LnJpZ2h0ID0gbnVsbFxuXHRcdFx0XHRjdXJyZW50Lm9wID0gb3Bcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiAobGV2ZWwgIT09IDApIHtcblx0XHRyZXBvcnRFcnJvcignVW5leHBlY3RlZCBlbmQgb2YgZXhwcmVzc2lvbicsIG9wcy5sZW5ndGgpXG5cdFx0cmV0dXJuIG51bGxcblx0fVxuXG5cdHJldHVybiByb290XG59XG4iLCJpbXBvcnQgeyBnZXRHbG9iYWxUaW1lLCBzY2hlZHVsZVJlZHJhdyB9IGZyb20gJy4uLy4uL2luZGV4J1xuaW1wb3J0IHsgZ2V0RG9tYWluIH0gZnJvbSAnLi4vY2FudmFzL2NhbnZhc0NvcmUnXG5pbXBvcnQgeyBnZXRQbG90c1NoYWRlckluZm8gfSBmcm9tICcuLi9jb3JlL2NvbnRyb2xsZXInXG5pbXBvcnQgeyBQbG90RGlzcGxheU1vZGUgfSBmcm9tICcuLi9kZWZpbmVzJ1xuaW1wb3J0ICogYXMgbWF0NCBmcm9tICcuLi9saWIvZ2wtbWF0cml4L21hdDQnXG5pbXBvcnQgeyBnZXRNb3VzZVBvcyB9IGZyb20gJy4uL3VpL3VzZXJJbnRlcmFjdCdcblxuY29uc3QgZGV2aWF0aW9uID0gMC4wMDRcblxubGV0IGluZm86IGFueSA9IG51bGxcbmxldCBidWZmZXJzOiBXZWJHTEJ1ZmZlciB8IG51bGwgPSBudWxsXG5sZXQgc2hhZGVyc0FyZUluaXRpYWxpemluZyA9IGZhbHNlXG5sZXQgc2hhZGVyc0luaXRpYWxpemVkID0gZmFsc2VcbmxldCBlcnJvciA9IGZhbHNlXG5jb25zdCBmaWxlQnVmZmVyczoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fVxuXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hhZGVyLWNhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50XG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wyJykgYXMgV2ViR0xSZW5kZXJpbmdDb250ZXh0XG5cbmV4cG9ydCBjb25zdCBzaGFkZXJzQ2xlYXJBbGwgPSBmdW5jdGlvbiAoKSB7XG5cdHNjaGVkdWxlUmVsb2FkU2hhZGVycygpXG59XG5cbmV4cG9ydCBjb25zdCBpbml0U2hhZGVyQ29yZSA9IGZ1bmN0aW9uICgpIHtcblx0aWYgKCFjYW52YXMgfHwgIWN0eCkge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBpbml0aWFsaXplIFdlYkdMIGNvbnRleHQuJylcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBmZXRjaEJ1ZmZlcmVkICh1cmw6IHN0cmluZykge1xuXHRpZiAoIWZpbGVCdWZmZXJzW3VybF0pIHtcblx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybClcblx0XHRjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXG5cdFx0ZmlsZUJ1ZmZlcnNbdXJsXSA9IHRleHRcblx0XHRyZXR1cm4gdGV4dFxuXHR9XG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoZmlsZUJ1ZmZlcnNbdXJsXSlcbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZFNoYWRlcnMgKCkge1xuXHRzaGFkZXJzQXJlSW5pdGlhbGl6aW5nID0gdHJ1ZVxuXG5cdGF3YWl0IFByb21pc2UuYWxsKFtcblx0XHRmZXRjaEJ1ZmZlcmVkKCdhc3NldHMvc2hhZGVycy9wbG90LnZlcnQnKSxcblx0XHRmZXRjaEJ1ZmZlcmVkKCdhc3NldHMvc2hhZGVycy9wbG90LmZyYWcnKVxuXHRdKS50aGVuKHNoYWRlcnMgPT4ge1xuXHRcdHNoYWRlcnNbMV0gPSBpbmplY3RGdW5jdGlvbnNJbnRvU2hhZGVyU291cmNlKHNoYWRlcnNbMV0pXG5cblx0XHRjb25zdCBwcm9ncmFtID0gaW5pdFNoYWRlcnMoc2hhZGVyc1swXSwgc2hhZGVyc1sxXSlcblx0XHRpZiAoIXByb2dyYW0pIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIHNoYWRlcnMnKVxuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXG5cdFx0aW5mbyA9IHtcblx0XHRcdHByb2dyYW0sXG5cdFx0XHRhdHRyaWJMb2NhdGlvbnM6IHtcblx0XHRcdFx0dmVydGV4UG9zaXRpb246IGN0eC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCAnYVZlcnRleFBvc2l0aW9uJylcblx0XHRcdH0sXG5cdFx0XHR1bmlmb3JtTG9jYXRpb25zOiB7XG5cdFx0XHRcdHByb2plY3Rpb25NYXRyaXg6IGN0eC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgJ3VQcm9qZWN0aW9uTWF0cml4JyksXG5cdFx0XHRcdG1vZGVsVmlld01hdHJpeDogY3R4LmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCAndU1vZGVsVmlld01hdHJpeCcpLFxuXHRcdFx0XHR1X3Jlc29sdXRpb246IGN0eC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgJ3VfcmVzb2x1dGlvbicpLFxuXHRcdFx0XHR1X21vdXNlOiBjdHguZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1X21vdXNlJyksXG5cdFx0XHRcdHVfdGltZTogY3R4LmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCAndV90aW1lJyksXG5cdFx0XHRcdHVfZGV2aWF0aW9uOiBjdHguZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1X2RldmlhdGlvbicpLFxuXHRcdFx0XHR1X2RvbWFpbl94OiBjdHguZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1X2RvbWFpbl94JyksXG5cdFx0XHRcdHVfZG9tYWluX3k6IGN0eC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgJ3VfZG9tYWluX3knKSxcblx0XHRcdFx0dV9kaXNwbGF5X21vZGU6IGN0eC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgJ3VfZGlzcGxheV9tb2RlJylcblx0XHRcdH1cblx0XHR9XG5cdFx0YnVmZmVycyA9IGluaXRCdWZmZXJzKClcblx0XHRcblx0XHRzaGFkZXJzSW5pdGlhbGl6ZWQgPSB0cnVlXG5cdFx0c2hhZGVyc0FyZUluaXRpYWxpemluZyA9IGZhbHNlXG5cdH0pXG59XG5cbmV4cG9ydCBjb25zdCBzaGFkZXJDb3JlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXHQvLyBTaGFkZXJzIGFyZSBub3QgbG9hZGVkIHlldFxuXHRpZiAoIXNoYWRlcnNJbml0aWFsaXplZCAmJiAhc2hhZGVyc0FyZUluaXRpYWxpemluZyAmJiAhZXJyb3IpIHtcblx0XHRsb2FkU2hhZGVycygpXG5cdFx0XG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBzaGFkZXJzJylcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHNjaGVkdWxlUmVsb2FkU2hhZGVycyA9IGZ1bmN0aW9uICgpIHtcblx0ZXJyb3IgPSBmYWxzZVxuXHRzaGFkZXJzSW5pdGlhbGl6ZWQgPSBmYWxzZVxuXHRzaGFkZXJzQXJlSW5pdGlhbGl6aW5nID0gZmFsc2Vcbn1cblxuZXhwb3J0IGNvbnN0IHNoYWRlcnNEcmF3ID0gZnVuY3Rpb24gKCkge1xuXHRzaGFkZXJzSW5pdGlhbGl6ZWQgPSBmYWxzZVxuXG5cdGlmIChzaGFkZXJzSW5pdGlhbGl6ZWQgJiYgIWVycm9yKSB7XG5cdFx0ZHJhd1NjZW5lKClcblx0XHRyZXR1cm5cblx0fVxuXG5cdGxvYWRTaGFkZXJzKCkudGhlbihcblx0XHQoKSA9PiB7XG5cdFx0XHRpZiAoIXNoYWRlcnNJbml0aWFsaXplZCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gaW5pdGlhbGl6ZSBzaGFkZXJzJylcblx0XHRcdFx0Y3R4LmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdGRyYXdTY2VuZSgpXG5cdFx0fVxuXHQpXG59XG5cbmNvbnN0IGhleENvbG9yVG9Ob3JtYWxSR0JTdHJpbmcgPSBmdW5jdGlvbiAoaGV4OiBzdHJpbmcpOiBzdHJpbmcge1xuXHRjb25zdCByID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZygxLCAzKSwgMTYpXG5cdGNvbnN0IGcgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDMsIDUpLCAxNilcblx0Y29uc3QgYiA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoNSwgNyksIDE2KVxuXHRyZXR1cm4gYCR7ciAvIDI1NS4wfSwgJHtnIC8gMjU1LjB9LCAke2IgLyAyNTUuMH1gXG59XG5cbmZ1bmN0aW9uIGluamVjdEZ1bmN0aW9uc0ludG9TaGFkZXJTb3VyY2UgKHNoYWRlcjogc3RyaW5nKTogc3RyaW5nIHtcblx0Y29uc3QgcGxvdHM6IHsgZnVuY3Rpb25zOiBzdHJpbmdbXSwgY29sb3JzOiBzdHJpbmdbXSwgZGlzcGxheU1vZGVzOiBQbG90RGlzcGxheU1vZGVbXSwgbnVtUGxvdHM6IG51bWJlciwgaXRlckV4cHI6IHN0cmluZ1tdIH0gPSBnZXRQbG90c1NoYWRlckluZm8oKVxuXHRcblx0aWYgKHBsb3RzLm51bVBsb3RzID09PSAwKSB7XG5cdFx0cGxvdHMuZnVuY3Rpb25zID0gW11cblx0XHRwbG90cy5jb2xvcnMgPSBbJyMwMDAwMDAnXVxuXHRcdHBsb3RzLmRpc3BsYXlNb2RlcyA9IFtQbG90RGlzcGxheU1vZGUuTk9ORV1cblx0XHRwbG90cy5pdGVyRXhwciA9IFtdXG5cdH1cblxuXHRwbG90cy5mdW5jdGlvbnMucHVzaCgnMC4wJylcblx0cGxvdHMuaXRlckV4cHIucHVzaCgndmVjMigwLjAsMC4wKScpXG5cblx0cmV0dXJuIHNoYWRlclxuXHRcdC5yZXBsYWNlKC9VU0VSX05VTV9GVU5DX0lOSi9nLCBgJHtwbG90cy5udW1QbG90cyArIDF9YClcblx0XHQucmVwbGFjZSgvVVNFUl9GVU5DX0lOSi9nLCBgZmxvYXRbXSgke3Bsb3RzLmZ1bmN0aW9ucy5tYXAoZiA9PiBgKCR7Zn0pYCkuam9pbignLCcpfSlgKVxuXHRcdC5yZXBsYWNlKC9VU0VSX0NPTF9JTkovZywgYHZlYzNbXSgke3Bsb3RzLmNvbG9ycy5tYXAoYyA9PiBgdmVjMygke2hleENvbG9yVG9Ob3JtYWxSR0JTdHJpbmcoYyl9KWApLmpvaW4oJywnKX0pYClcblx0XHQucmVwbGFjZSgvVVNFUl9ESVNQX0lOSi9nLCBgaW50W10oJHtwbG90cy5kaXNwbGF5TW9kZXMubWFwKGQgPT4gYCR7ZH1gKS5qb2luKCcsJyl9KWApXG5cdFx0LnJlcGxhY2UoL1VTRVJfSVRFUl9FWFBSX0lOSi9nLCBgdmVjMltdKCR7cGxvdHMuaXRlckV4cHIubWFwKGUgPT4gYCgke2UubGVuZ3RoID4gMCA/IGUgOiAndmVjMigwLjAsMC4wKSd9KWApLmpvaW4oJywnKX0pYClcbn1cblxuZnVuY3Rpb24gaW5pdFNoYWRlcnMgKHZlcnRTcmM6IHN0cmluZywgZnJhZ1NyYzogc3RyaW5nKSB7XG5cdC8vIGxvYWQgc291cmNlXG5cdGNvbnN0IHZlcnRTaGFkZXIgPSBsb2FkU2hhZGVyKGN0eC5WRVJURVhfU0hBREVSLCB2ZXJ0U3JjKVxuXHRjb25zdCBmcmFnU2hhZGVyID0gbG9hZFNoYWRlcihjdHguRlJBR01FTlRfU0hBREVSLCBmcmFnU3JjKVxuXHRcblx0aWYgKCF2ZXJ0U2hhZGVyIHx8ICFmcmFnU2hhZGVyKSB7XG5cdFx0cmV0dXJuIG51bGxcblx0fVxuXHRcblx0Ly8gY3JlYXRlIHByb2dyYW1cblx0Y29uc3QgcHJvZ3JhbSA9IGN0eC5jcmVhdGVQcm9ncmFtKClcblx0aWYgKCFwcm9ncmFtKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtJylcblx0XHRyZXR1cm4gbnVsbFxuXHR9XG5cdFxuXHRjdHguYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRTaGFkZXIpXG5cdGN0eC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ1NoYWRlcilcblx0Y3R4LmxpbmtQcm9ncmFtKHByb2dyYW0pXG5cdFxuXHQvLyBjaGVjayBpZiBwcm9ncmFtIGlzIGxpbmtlZFxuXHRpZiAoIWN0eC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGN0eC5MSU5LX1NUQVRVUykpIHtcblx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gbGluayBwcm9ncmFtOiAnICsgY3R4LmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pKVxuXHRcdHJldHVybiBudWxsXG5cdH1cblx0XG5cdHJldHVybiBwcm9ncmFtXG59XG5cbmZ1bmN0aW9uIGxvYWRTaGFkZXIgKHR5cGU6IG51bWJlciwgc291cmNlOiBzdHJpbmcpIHtcblx0Y29uc3Qgc2hhZGVyID0gY3R4LmNyZWF0ZVNoYWRlcih0eXBlKVxuXHRpZiAoIXNoYWRlcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgc2hhZGVyJylcblx0XHRyZXR1cm4gbnVsbFxuXHR9XG5cdFxuXHRjdHguc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKVxuXHRjdHguY29tcGlsZVNoYWRlcihzaGFkZXIpXG5cdFxuXHQvLyBjaGVjayBpZiBzaGFkZXIgY29tcGlsZWRcblx0aWYgKCFjdHguZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgY3R4LkNPTVBJTEVfU1RBVFVTKSkge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjb21waWxlIHNoYWRlcjogJyArIGN0eC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpXG5cdFx0Y3R4LmdldFNoYWRlckluZm9Mb2coc2hhZGVyKVxuXHRcdGN0eC5kZWxldGVTaGFkZXIoc2hhZGVyKVxuXHRcdHJldHVybiBudWxsXG5cdH1cblx0XG5cdHJldHVybiBzaGFkZXJcbn1cblxuZnVuY3Rpb24gaW5pdEJ1ZmZlcnMgKCk6IFdlYkdMQnVmZmVyIHwgbnVsbCB7XG5cdGNvbnN0IHBvc2l0aW9uQnVmZmVyID0gY3R4LmNyZWF0ZUJ1ZmZlcigpXG5cdGN0eC5iaW5kQnVmZmVyKGN0eC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKVxuXHRcblx0Ly8gU3F1YXJlXG5cdGNvbnN0IHBvc2l0aW9ucyA9IFtcblx0XHQxLjAsIDEuMCxcblx0XHQtMS4wLCAxLjAsXG5cdFx0MS4wLCAtMS4wLFxuXHRcdC0xLjAsIC0xLjBcblx0XVxuXHRcblx0Y3R4LmJ1ZmZlckRhdGEoY3R4LkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLCBjdHguU1RBVElDX0RSQVcpXG5cdFxuXHRyZXR1cm4gcG9zaXRpb25CdWZmZXJcbn1cblxuZnVuY3Rpb24gZHJhd1NjZW5lICgpIHtcblx0Ly8gQ2xlYXJcblx0Y3R4LmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKVxuXHRjdHguY2xlYXJEZXB0aCgxLjApXG5cdGN0eC5lbmFibGUoY3R4LkRFUFRIX1RFU1QpXG5cdGN0eC5kZXB0aEZ1bmMoY3R4LkxFUVVBTClcblx0Y3R4LmNsZWFyKGN0eC5DT0xPUl9CVUZGRVJfQklUIHwgY3R4LkRFUFRIX0JVRkZFUl9CSVQpXG5cdFxuXHQvLyBQZXJzcGVjdGl2ZVxuXHRjb25zdCBmb3YgPSA0NSAqIE1hdGguUEkgLyAxODBcblx0Y29uc3QgYXNwZWN0ID0gY3R4LmNhbnZhcy5jbGllbnRXaWR0aCAvIGN0eC5jYW52YXMuY2xpZW50SGVpZ2h0XG5cdGNvbnN0IHpOZWFyID0gMC4xXG5cdGNvbnN0IHpGYXIgPSAxMDAuMFxuXHRjb25zdCBwcm9qZWN0aW9uTWF0cml4ID0gbWF0NC5jcmVhdGUoKVxuXHRcblx0bWF0NC5wZXJzcGVjdGl2ZShwcm9qZWN0aW9uTWF0cml4LCBmb3YsIGFzcGVjdCwgek5lYXIsIHpGYXIpXG5cdFxuXHRjb25zdCBtb2RlbFZpZXdNYXRyaXggPSBtYXQ0LmNyZWF0ZSgpXG5cdFxuXHRtYXQ0LnRyYW5zbGF0ZShtb2RlbFZpZXdNYXRyaXgsIG1vZGVsVmlld01hdHJpeCwgWzAsIDAsIC0xXSlcblx0XG5cdGNvbnN0IG51bUNvbXBvbmVudHMgPSAyXG5cdGNvbnN0IHR5cGUgPSBjdHguRkxPQVRcblx0Y29uc3Qgbm9ybWFsaXplID0gZmFsc2Vcblx0Y29uc3Qgc3RyaWRlID0gMFxuXHRjb25zdCBvZmZzZXQgPSAwXG5cdFxuXHRjdHguYmluZEJ1ZmZlcihjdHguQVJSQVlfQlVGRkVSLCBidWZmZXJzKVxuXHRjdHgudmVydGV4QXR0cmliUG9pbnRlcihpbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhQb3NpdGlvbiwgbnVtQ29tcG9uZW50cywgdHlwZSwgbm9ybWFsaXplLCBzdHJpZGUsIG9mZnNldClcblx0Y3R4LmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleFBvc2l0aW9uKVxuXHRcblx0Y3R4LnVzZVByb2dyYW0oaW5mby5wcm9ncmFtKVxuXHRcblx0Y29uc3QgbW91c2VQb3MgPSBnZXRNb3VzZVBvcygpXG5cdGNvbnN0IGRvbWFpbjogeyBtaW5YOiBudW1iZXIsIG1heFg6IG51bWJlciwgbWluWTogbnVtYmVyLCBtYXhZOiBudW1iZXIgfSA9IGdldERvbWFpbigpXG5cdFxuXHQvLyBTZXQgdW5pZm9ybXNcblx0Y3R4LnVuaWZvcm1NYXRyaXg0ZnYoaW5mby51bmlmb3JtTG9jYXRpb25zLnByb2plY3Rpb25NYXRyaXgsIGZhbHNlLCBwcm9qZWN0aW9uTWF0cml4KVxuXHRjdHgudW5pZm9ybU1hdHJpeDRmdihpbmZvLnVuaWZvcm1Mb2NhdGlvbnMubW9kZWxWaWV3TWF0cml4LCBmYWxzZSwgbW9kZWxWaWV3TWF0cml4KVxuXHRjdHgudW5pZm9ybTJmKGluZm8udW5pZm9ybUxvY2F0aW9ucy51X3Jlc29sdXRpb24sIGN0eC5jYW52YXMud2lkdGgsIGN0eC5jYW52YXMuaGVpZ2h0KVxuXHRjdHgudW5pZm9ybTJmKGluZm8udW5pZm9ybUxvY2F0aW9ucy51X21vdXNlLCBtb3VzZVBvcy54LCBtb3VzZVBvcy55KVxuXHRjdHgudW5pZm9ybTJmKGluZm8udW5pZm9ybUxvY2F0aW9ucy51X2RvbWFpbl94LCBkb21haW4ubWluWCwgZG9tYWluLm1heFgpXG5cdGN0eC51bmlmb3JtMmYoaW5mby51bmlmb3JtTG9jYXRpb25zLnVfZG9tYWluX3ksIGRvbWFpbi5taW5ZLCBkb21haW4ubWF4WSlcblx0Y3R4LnVuaWZvcm0xZihpbmZvLnVuaWZvcm1Mb2NhdGlvbnMudV90aW1lLCBnZXRHbG9iYWxUaW1lKCkpXG5cdGN0eC51bmlmb3JtMWYoaW5mby51bmlmb3JtTG9jYXRpb25zLnVfZGV2aWF0aW9uLCBkZXZpYXRpb24pXG5cdGN0eC51bmlmb3JtMWkoaW5mby51bmlmb3JtTG9jYXRpb25zLnVfZGlzcGxheV9tb2RlLCAwKSAvLyBUT0RPXG5cdFxuXHRjb25zdCB2ZXJ0ZXhDb3VudCA9IDRcblx0Y3R4LmRyYXdBcnJheXMoY3R4LlRSSUFOR0xFX1NUUklQLCBvZmZzZXQsIHZlcnRleENvdW50KVxufVxuIiwiaW1wb3J0IHsgZ2V0R2xvYmFsVGltZSwgc2NoZWR1bGVSZWRyYXcgfSBmcm9tICcuLi8uLi9pbmRleCdcbmltcG9ydCB7IGdldEV4dGVyblZhcmlhYmxlLCBnZXRVc2VyVmFyaWFibGUsIHNldFVzZXJWYXJpYWJsZSwgVG9rZW4gfSBmcm9tICcuLi9sYW5nL2xleGVyJ1xuaW1wb3J0IHsgQVNUTm9kZSB9IGZyb20gJy4uL2xhbmcvcGFyc2VyJ1xuXG5sZXQgbGF0ZXN0RXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsXG5leHBvcnQgY29uc3Qgc2hhZGVyRnVuY3Rpb25CdWlsZGVyR2V0RXJyb3IgPSAoKTogc3RyaW5nIHwgbnVsbCA9PiBsYXRlc3RFcnJvclxuXG5sZXQgaXRlckV4cHI6IHN0cmluZyA9ICcnXG5leHBvcnQgY29uc3Qgc2hhZGVyRnVuY3Rpb25CdWlsZGVyR2V0SXRlckV4cHJlc3Npb24gPSAoKTogc3RyaW5nID0+IGl0ZXJFeHByXG5cbmV4cG9ydCBjb25zdCBidWlsZFNoYWRlckZ1bmN0aW9uID0gKGFzdDogQVNUTm9kZSB8IG51bGwpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICBpZiAoIWFzdCkgcmV0dXJuIG51bGxcblxuICAgIGxhdGVzdEVycm9yID0gbnVsbFxuICAgIGl0ZXJFeHByID0gJydcblxuICAgIGNvbnN0IHJlc3VsdDogeyB2YWw6IHN0cmluZyB8IG51bGwsIGNweDogYm9vbGVhbiB9ID0gZXZhbE5vZGUoYXN0KVxuICAgIGNvbnNvbGUuZGVidWcoJ1NoYWRlciBmdW5jdGlvbjogJyArIHJlc3VsdC52YWwpXG5cbiAgICByZXR1cm4gcmVzdWx0LnZhbFxufVxuXG5jb25zdCByZXBvcnRFcnJvciA9IGZ1bmN0aW9uIChlcnJvcjogc3RyaW5nKTogeyB2YWw6IG51bGwsIGNweDogZmFsc2UgfSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZHVyaW5nIGNvbnN0YW50IGV2YWx1YXRpb246ICcgKyBlcnJvcilcbiAgICBsYXRlc3RFcnJvciA9IGVycm9yXG4gICAgcmV0dXJuIHsgdmFsOiBudWxsLCBjcHg6IGZhbHNlIH1cbn1cblxuY29uc3QgbnVtVG9GbG9hdFN0cmluZyA9IGZ1bmN0aW9uIChudW06IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIG51bS50b1N0cmluZygpLmluZGV4T2YoJy4nKSA9PT0gLTEgPyBudW0udG9TdHJpbmcoKSArICcuMCcgOiBudW0udG9TdHJpbmcoKVxufVxuXG5jb25zdCBpc0l0ZXJhYmxlID0gKG9iajogYW55KTogYm9vbGVhbiA9PiBvYmogIT0gbnVsbCAmJiB0eXBlb2Ygb2JqW1N5bWJvbC5pdGVyYXRvcl0gPT09ICdmdW5jdGlvbidcblxuY29uc3QgcmVhbCA9ICh2YWw6IHN0cmluZyk6IHsgdmFsOiBzdHJpbmcgfCBudWxsLCBjcHg6IGZhbHNlIH0gPT4ge1xuICAgIHJldHVybiB7IHZhbCwgY3B4OiBmYWxzZSB9XG59XG5jb25zdCBjb21wbGV4ID0gKHZhbDogc3RyaW5nKTogeyB2YWw6IHN0cmluZywgY3B4OiB0cnVlIH0gPT4ge1xuICAgIHJldHVybiB7IHZhbCwgY3B4OiB0cnVlIH1cbn1cblxuY29uc3QgZXZhbE5vZGUgPSBmdW5jdGlvbiAobm9kZTogQVNUTm9kZSk6IHsgdmFsOiBzdHJpbmcgfCBudWxsLCBjcHg6IGJvb2xlYW4gfSB7XG4gICAgbGV0IGxlZnQsIHJpZ2h0XG5cbiAgICBzd2l0Y2ggKG5vZGUub3AudG9rKSB7XG4gICAgICAgIGNhc2UgVG9rZW4uVU5ERUY6XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIFVOREVGSU5FRCBpcyBub3QgYWxsb3dlZCcpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLk5PTkU6XG4gICAgICAgICAgICByZXR1cm4gcmVhbCgnMCcpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLlBBUkVOX09QOlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBPUEVOIFBBUkVOVEhFU0lTIGlzIG5vdCBhbGxvd2VkJylcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uUEFSRU5fQ0w6XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIENMT1NFIFBBUkVOVEhFU0lTIGlzIG5vdCBhbGxvd2VkJylcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uQlJBQ0tFVF9PUDpcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gT1BFTiBCUkFDS0VUIGlzIG5vdCBhbGxvd2VkJylcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uQlJBQ0tFVF9DTDpcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gQ0xPU0UgQlJBQ0tFVCBpcyBub3QgYWxsb3dlZCcpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLkJSQUNFX09QOlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBPUEVOIEJSQUNFIGlzIG5vdCBhbGxvd2VkJylcblxuICAgICAgICBjYXNlIFRva2VuLkJSQUNFX0NMOlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBDTE9TRSBCUkFDRSBpcyBub3QgYWxsb3dlZCcpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLk5VTTpcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZS5vcC52YWwgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBOVU1CRVIgbXVzdCBiZSBhIG51bWJlcicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVhbChudW1Ub0Zsb2F0U3RyaW5nKG5vZGUub3AudmFsKSlcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uQ09OU1Q6XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5vZGUub3AudmFsICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gQ09OU1RBTlQgbXVzdCBiZSBhIG51bWJlcicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVhbChudW1Ub0Zsb2F0U3RyaW5nKG5vZGUub3AudmFsKSlcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uVkFSOlxuICAgICAgICAgICAgcmV0dXJuIHJlYWwoJ3gnKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5WQVIyOlxuICAgICAgICAgICAgcmV0dXJuIHJlYWwoJ3knKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uVElNRTpcbiAgICAgICAgICAgIHNjaGVkdWxlUmVkcmF3KClcbiAgICAgICAgICAgIHJldHVybiByZWFsKCd0JylcblxuICAgICAgICBjYXNlIFRva2VuLkFERDpcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBBRERJVElPTicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZWZ0ID0gZXZhbE5vZGUobm9kZS5sZWZ0KVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KVxuICAgICAgICAgICAgaWYgKCFsZWZ0LmNweCAmJiAhcmlnaHQuY3B4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWwoYCgke2xlZnQudmFsfSske3JpZ2h0LnZhbH0pYClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb21wbGV4KGBhZGQoJHtsZWZ0LnZhbH0sJHtyaWdodC52YWx9KWApXG5cbiAgICAgICAgY2FzZSBUb2tlbi5TVUI6XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gU1VCVFJBQ1RJT04nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVmdCA9IGV2YWxOb2RlKG5vZGUubGVmdClcbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodClcbiAgICAgICAgICAgIGlmICghbGVmdC5jcHggJiYgIXJpZ2h0LmNweCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWFsKGAoJHtsZWZ0LnZhbH0tJHtyaWdodC52YWx9KWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29tcGxleChgc3ViKCR7bGVmdC52YWx9LCR7cmlnaHQudmFsfSlgKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uTVVMVDpcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBNVUxUSVBMSUNBVElPTicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZWZ0ID0gZXZhbE5vZGUobm9kZS5sZWZ0KVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KVxuICAgICAgICAgICAgaWYgKCFsZWZ0LmNweCAmJiAhcmlnaHQuY3B4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWwoYCgke2xlZnQudmFsfSoke3JpZ2h0LnZhbH0pYClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb21wbGV4KGBtdWwoJHtsZWZ0LnZhbH0sJHtyaWdodC52YWx9KWApXG5cbiAgICAgICAgY2FzZSBUb2tlbi5ESVY6XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gRElWSVNJT04nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVmdCA9IGV2YWxOb2RlKG5vZGUubGVmdClcbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodClcbiAgICAgICAgICAgIGlmICghbGVmdC5jcHggJiYgIXJpZ2h0LmNweCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWFsKGAoJHtsZWZ0LnZhbH0vJHtyaWdodC52YWx9KWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29tcGxleChgZGl2KCR7bGVmdC52YWx9LCR7cmlnaHQudmFsfSlgKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uUE9XOlxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIFBPV0VSJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxlZnQgPSBldmFsTm9kZShub2RlLmxlZnQpXG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpXG4gICAgICAgICAgICBpZiAoIWxlZnQuY3B4ICYmICFyaWdodC5jcHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVhbChgX3Bvdygke2xlZnQudmFsfSwke3JpZ2h0LnZhbH0pYClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyaWdodC5jcHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Bvd2VyIGNhbm5vdCBiZSBjb21wbGV4JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb21wbGV4KGBfcG93KCR7bGVmdC52YWx9LCR7cmlnaHQudmFsfSlgKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uU1FSVDpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIFNRVUFSRSBST09UJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodClcbiAgICAgICAgICAgIGlmICghcmlnaHQuY3B4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWwoYHNxcnQoJHtyaWdodC52YWx9KWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1NxdWFyZSByb290IGNhbm5vdCBiZSBjb21wbGV4JylcblxuICAgICAgICBjYXNlIFRva2VuLkxPRzpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIExPR0FSSVRITScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpXG4gICAgICAgICAgICBpZiAoIXJpZ2h0LmNweCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWFsKGBsb2coJHtyaWdodC52YWx9KWApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBUb2tlbi5FWFA6XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBFWFBPRU5USUFMJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodClcbiAgICAgICAgICAgIGlmICghcmlnaHQuY3B4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWwoYGV4cCgke3JpZ2h0LnZhbH0pYClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignRXhwb25lbnRpYWwgY2Fubm90IGJlIGNvbXBsZXgnKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uU0lOOlxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gU0lORScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpXG4gICAgICAgICAgICBpZiAoIXJpZ2h0LmNweCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWFsKGBzaW4oJHtyaWdodC52YWx9KWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1NpbmUgY2Fubm90IGJlIGNvbXBsZXgnKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uQ09TOlxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gQ09TSU5FJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodClcbiAgICAgICAgICAgIGlmICghcmlnaHQuY3B4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWwoYGNvcygke3JpZ2h0LnZhbH0pYClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignQ29zaW5lIGNhbm5vdCBiZSBjb21wbGV4JylcblxuICAgICAgICBjYXNlIFRva2VuLlRBTjpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIFRBTkdFTlQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmlnaHQgPSBldmFsTm9kZShub2RlLnJpZ2h0KVxuICAgICAgICAgICAgaWYgKCFyaWdodC5jcHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVhbChgdGFuKCR7cmlnaHQudmFsfSlgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUYW5nZW50IGNhbm5vdCBiZSBjb21wbGV4JylcblxuICAgICAgICBjYXNlIFRva2VuLkFTSU46XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBBUkMgU0lORScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpXG4gICAgICAgICAgICBpZiAoIXJpZ2h0LmNweCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWFsKGBhc2luKCR7cmlnaHQudmFsfSlgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdBcmMgc2luZSBjYW5ub3QgYmUgY29tcGxleCcpXG5cbiAgICAgICAgY2FzZSBUb2tlbi5BQ09TOlxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gQVJDIENPU0lORScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpXG4gICAgICAgICAgICBpZiAoIXJpZ2h0LmNweCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWFsKGBhY29zKCR7cmlnaHQudmFsfSlgKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgVG9rZW4uQVRBTjpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIEFSQyBUQU5HRU5UJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodClcbiAgICAgICAgICAgIGlmICghcmlnaHQuY3B4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWwoYGF0YW4oJHtyaWdodC52YWx9KWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ0FyYyB0YW5nZW50IGNhbm5vdCBiZSBjb21wbGV4JylcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uU0lOSDpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIFNJTkUgSFlQRVJCT0xJQ1VTJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodClcbiAgICAgICAgICAgIGlmICghcmlnaHQuY3B4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWwoYHNpbmgoJHtyaWdodC52YWx9KWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1NpbmUgaHlwZXJib2xpY3VzIGNhbm5vdCBiZSBjb21wbGV4JylcblxuICAgICAgICBjYXNlIFRva2VuLkNPU0g6XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBDT1NJTkUgSFlQRVJCT0xJQ1VTJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodClcbiAgICAgICAgICAgIGlmICghcmlnaHQuY3B4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWwoYGNvc2goJHtyaWdodC52YWx9KWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ0Nvc2luZSBoeXBlcmJvbGljdXMgY2Fubm90IGJlIGNvbXBsZXgnKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uVEFOSDpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIFRBTkdFTlQgSFlQRVJCT0xJQ1VTJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodClcbiAgICAgICAgICAgIGlmICghcmlnaHQuY3B4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWwoYHRhbmgoJHtyaWdodC52YWx9KWApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBUb2tlbi5GTE9PUjpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIEZMT09SJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJpZ2h0ID0gZXZhbE5vZGUobm9kZS5yaWdodClcbiAgICAgICAgICAgIGlmICghcmlnaHQuY3B4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWwoYGZsb29yKCR7cmlnaHQudmFsfSlgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdGbG9vciBjYW5ub3QgYmUgY29tcGxleCcpXG5cbiAgICAgICAgY2FzZSBUb2tlbi5NSU46XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBNSU4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc0l0ZXJhYmxlKGV2YWxOb2RlKG5vZGUucmlnaHQpLnZhbCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01hbGZvcm1lZCBhcmd1bWVudCBmb3IgVG9rZW4gTUlOJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZWFsKGBtaW4oJHtldmFsTm9kZShub2RlLnJpZ2h0KS52YWx9KWApXG5cbiAgICAgICAgY2FzZSBUb2tlbi5NQVg6XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBNQVgnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc0l0ZXJhYmxlKGV2YWxOb2RlKG5vZGUucmlnaHQpLnZhbCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01hbGZvcm1lZCBhcmd1bWVudCBmb3IgVG9rZW4gTUFYJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZWFsKGBtYXgoJHtldmFsTm9kZShub2RlLnJpZ2h0KS52YWx9KWApXG5cbiAgICAgICAgY2FzZSBUb2tlbi5ERUxJTTpcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBERUxJTUlURVInKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlYWwoYCR7ZXZhbE5vZGUobm9kZS5sZWZ0KS52YWx9LCR7ZXZhbE5vZGUobm9kZS5yaWdodCkudmFsfWApXG5cbiAgICAgICAgY2FzZSBUb2tlbi5BQlM6XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBBQlNPTFVURScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaWdodCA9IGV2YWxOb2RlKG5vZGUucmlnaHQpXG4gICAgICAgICAgICBpZiAoIXJpZ2h0LmNweCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWFsKGBhYnMoJHtyaWdodC52YWx9KWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVhbChgbWFnKCR7cmlnaHQudmFsfSlgKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uUkFORDpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIFJBTkRPTScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVhbChgcmFuZG9tKCR7ZXZhbE5vZGUobm9kZS5yaWdodCkudmFsfSlgKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uUEVSTElOOiB7XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gUEVSTElOJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNJdGVyYWJsZShldmFsTm9kZShub2RlLnJpZ2h0KS52YWwpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNYWxmb3JtZWQgYXJndW1lbnQgZm9yIFRva2VuIFBFUkxJTicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVhbChgbm9pc2UodmVjMigke2V2YWxOb2RlKG5vZGUucmlnaHQpLnZhbH0pKWApXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFRva2VuLk1PRDpcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBNT0RVTFVTJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZWFsKGBtb2QoJHtldmFsTm9kZShub2RlLmxlZnQpLnZhbH0sJHtldmFsTm9kZShub2RlLnJpZ2h0KS52YWx9KWApXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLkxFVkVMX1NFVDpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIExFVkVMIFNFVCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodC5vcC50b2sgPT09IFRva2VuLkRFTElNKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBMRVZFTCBTRVQnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVhbChgJHtldmFsTm9kZShub2RlLnJpZ2h0LmxlZnQpLnZhbH0rKChsZXZlbD0ke2V2YWxOb2RlKG5vZGUucmlnaHQucmlnaHQpLnZhbH0pPjAuMD8wLjA6MC4wKWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZXZhbE5vZGUobm9kZS5yaWdodClcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uVkVDVE9SX0ZJRUxEOlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBWRUNUT1IgRklFTEQgaXMgbm90IGFsbG93ZWQnKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5MRVNTOlxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIExFU1MgVEhBTicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVhbChgYnRvZigke2V2YWxOb2RlKG5vZGUubGVmdCkudmFsfTwke2V2YWxOb2RlKG5vZGUucmlnaHQpLnZhbH0pYClcblxuICAgICAgICBjYXNlIFRva2VuLkdSRUFURVI6XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gR1JFQVRFUiBUSEFOJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZWFsKGBidG9mKCR7ZXZhbE5vZGUobm9kZS5sZWZ0KS52YWx9PiR7ZXZhbE5vZGUobm9kZS5yaWdodCkudmFsfSlgKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uTEVTU19PUl9FUVVBTDpcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBMRVNTIFRIQU4gT1IgRVFVQUwgVE8nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlYWwoYGJ0b2YoJHtldmFsTm9kZShub2RlLmxlZnQpLnZhbH08PSR7ZXZhbE5vZGUobm9kZS5yaWdodCkudmFsfSlgKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uR1JFQVRFUl9PUl9FUVVBTDpcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBHUkVBVEVSIFRIQU4gT1IgRVFVQUwgVE8nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlYWwoYGJ0b2YoJHtldmFsTm9kZShub2RlLmxlZnQpLnZhbH0+PSR7ZXZhbE5vZGUobm9kZS5yaWdodCkudmFsfSlgKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uRVFVQUw6XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gRVFVQUwgVE8nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlYWwoYGJ0b2YoJHtldmFsTm9kZShub2RlLmxlZnQpLnZhbH09PSR7ZXZhbE5vZGUobm9kZS5yaWdodCkudmFsfSlgKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5BTkQ6XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gQU5EJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZWFsKGBidG9mKGZ0b2IoJHtldmFsTm9kZShub2RlLmxlZnQpLnZhbH0pJiZmdG9iKCR7ZXZhbE5vZGUobm9kZS5yaWdodCkudmFsfSkpYClcblxuICAgICAgICBjYXNlIFRva2VuLk9SOlxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIE9SJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZWFsKGBidG9mKGZ0b2IoJHtldmFsTm9kZShub2RlLmxlZnQpLnZhbH0pfHxmdG9iKCR7ZXZhbE5vZGUobm9kZS5yaWdodCkudmFsfSkpYClcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uVVNFUlZBUjpcbiAgICAgICAgICAgIHJldHVybiByZWFsKGBidG9mKCR7Z2V0VXNlclZhcmlhYmxlKG5vZGUub3AudmFsIGFzIHN0cmluZyl9KWApXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLkZBQ1RPUklBTDpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIEZBQ1RPUklBTCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVhbChgZmFjdG9yaWFsKCR7ZXZhbE5vZGUobm9kZS5yaWdodCkudmFsfSlgKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uU0lHTU9JRDpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIFNJR01PSUQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlYWwoYCgxLjAvKDEuMCtleHAoLSgke2V2YWxOb2RlKG5vZGUucmlnaHQpLnZhbH0pKSkpYClcblxuICAgICAgICBjYXNlIFRva2VuLkNJUkNMRTpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIENJUkNMRScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVhbChgY2lyY2xlKHgseSxkLCR7ZXZhbE5vZGUobm9kZS5yaWdodCkudmFsfSlgKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uUE9JTlQ6XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBQT0lOVCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVhbChgcG9pbnQoeCx5LGQsJHtldmFsTm9kZShub2RlLnJpZ2h0KS52YWx9KWApXG5cbiAgICAgICAgY2FzZSBUb2tlbi5UUlVFOlxuICAgICAgICAgICAgcmV0dXJuIHJlYWwoJ2J0b2YodHJ1ZSknKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uRkFMU0U6XG4gICAgICAgICAgICByZXR1cm4gcmVhbCgnYnRvZihmYWxzZSknKVxuXG4gICAgICAgIGNhc2UgVG9rZW4uUE9MQVI6XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBQT0xBUicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVhbChgKFBPTEFSKyR7ZXZhbE5vZGUobm9kZS5yaWdodCkudmFsfSlgKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5DQVJURVNJQU46XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBDQVJURVNJQU4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlYWwoYChDQVJURVNJQU4rJHtldmFsTm9kZShub2RlLnJpZ2h0KS52YWx9KWApXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLk1PVVNFWDpcbiAgICAgICAgICAgIHJldHVybiByZWFsKCdteCcpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLk1PVVNFWTpcbiAgICAgICAgICAgIHJldHVybiByZWFsKCdteScpXG5cbiAgICAgICAgY2FzZSBUb2tlbi5NT1VTRTpcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gTU9VU0UgaXMgbm90IGFsbG93ZWQnKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5JTUFHSU5BUlk6XG4gICAgICAgICAgICByZXR1cm4gY29tcGxleCgndmVjMigwLjAsMS4wKScpXG5cbiAgICAgICAgY2FzZSBUb2tlbi5TRVJJRVM6XG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsIHx8IG5vZGUucmlnaHQubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gU0VSSUVTJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGl0ZXJFeHByID0gZXZhbE5vZGUobm9kZS5yaWdodC5yaWdodCBhcyBBU1ROb2RlKS52YWwgfHwgJydcbiAgICAgICAgICAgIHJldHVybiByZWFsKGBzZXJpZXMoaSx4LHksdCwke2V2YWxOb2RlKG5vZGUucmlnaHQubGVmdCkudmFsfSlgKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5JVEVSQVRPUjpcbiAgICAgICAgICAgIHJldHVybiByZWFsKCdrJylcbiAgICAgICAgXG4gICAgICAgIGNhc2UgVG9rZW4uQ09NUExFWDpcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gQ09NUExFWCBpcyBub3QgYWxsb3dlZCcpXG4gICAgICAgIFxuICAgICAgICBjYXNlIFRva2VuLk1BR05JVFVERTpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIE1BR05JVFVERScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVhbChgbWFnKCR7ZXZhbE5vZGUobm9kZS5yaWdodCkudmFsfSlgKVxuICAgICAgICBcbiAgICAgICAgY2FzZSBUb2tlbi5HUkFESUVOVDpcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIEdSQURJRU5UJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBldmFsTm9kZShub2RlLnJpZ2h0KVxuXG4gICAgICAgIGNhc2UgVG9rZW4uQVNTSUdOOlxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIEFTU0lHTicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0Lm9wLnRvayAhPT0gVG9rZW4uQVNTSUdOQUJMRSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmxlZnQub3AudG9rID09PSBUb2tlbi5VU0VSVkFSKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFVzZXJWYXJpYWJsZShub2RlLmxlZnQub3AudmFsIGFzIHN0cmluZywgcGFyc2VGbG9hdChldmFsTm9kZShub2RlLnJpZ2h0KS52YWwgYXMgc3RyaW5nKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2YWxOb2RlKG5vZGUucmlnaHQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZWFsKGBidG9mKGFicygke2V2YWxOb2RlKG5vZGUubGVmdCkudmFsfS0ke2V2YWxOb2RlKG5vZGUucmlnaHQpLnZhbH0pPGQpYClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChnZXRFeHRlcm5WYXJpYWJsZShub2RlLmxlZnQub3AudmFsIGFzIHN0cmluZykgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcihgVmFyaWFibGUgJHtub2RlLmxlZnQub3AudmFsfSBkb2VzIG5vdCBleGlzdGApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnZXRFeHRlcm5WYXJpYWJsZShub2RlLmxlZnQub3AudmFsIGFzIHN0cmluZyk/LnNldChwYXJzZUZsb2F0KGV2YWxOb2RlKG5vZGUucmlnaHQpLnZhbCBhcyBzdHJpbmcpKVxuICAgICAgICAgICAgcmV0dXJuIGV2YWxOb2RlKG5vZGUucmlnaHQpXG4gICAgICAgIFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKGBVbmtub3duIHRva2VuICR7bm9kZS5vcC52YWx9YClcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBzY2hlZHVsZVJlZHJhdyB9IGZyb20gJy4uLy4uL2luZGV4J1xuaW1wb3J0IHsgcmVzZXRQbG90cywgc2V0SW5wdXRBdCwgc2V0TnVtSW5wdXRzIH0gZnJvbSAnLi4vY29yZS9jb250cm9sbGVyJ1xuaW1wb3J0IHsgUGxvdERyaXZlciwgUGxvdFN0YXR1cyB9IGZyb20gJy4uL2RlZmluZXMnXG5pbXBvcnQgeyBDb21wbGV4LCBjb21wbGV4VG9TdHJpbmcsIHN0cmluZ1RvSFRNTCwgVmVjdG9yIH0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyBvbk1vdXNlRHJhZyB9IGZyb20gJy4vdXNlckludGVyYWN0J1xuXG5jb25zdCBpbnB1dHNFbHQ6IEhUTUxFbGVtZW50IHwgYW55ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmlucHV0cycpXG5jb25zdCByZXNpemVBcmVhOiBIVE1MRWxlbWVudCB8IGFueSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXNpemUtbGVmdC1wYW5lbCcpXG5jb25zdCBsZWZ0UGFuZWw6IEhUTUxFbGVtZW50IHwgYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xlZnQtcGFuZWwnKVxuXG5sZXQgY3VycmVudElucHV0SW5kZXggPSAwXG5sZXQgbnVtSW5wdXRzID0gMFxuXG5leHBvcnQgY29uc3QgaW5pdExlZnRQYW5lbCA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcblx0b25Nb3VzZURyYWcocmVzaXplQXJlYSwgKG1vdXNlOiBWZWN0b3IpID0+IHtcblx0XHRjb25zdCB3aWR0aCA9IE1hdGgubWF4KDI1MCwgTWF0aC5taW4od2luZG93LmlubmVyV2lkdGggKiAwLjk1LCBtb3VzZS54KSlcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGVmdC1wYW5lbC13aWR0aCcsIGAke3dpZHRofXB4YClcblx0XHRzY2hlZHVsZVJlZHJhdygpXG5cdH0pXG5cdFxuXHRhZGROZXdJbnB1dCgpXG59XG5cbmV4cG9ydCBjb25zdCBhZGROZXdJbnB1dCA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcblx0Y29uc3QgZWx0U3RyID0gYFxuXHQ8ZGl2IGNsYXNzPVwiaW5wdXRcIj5cblx0PGRpdiBjbGFzcz1cInN0YXR1c1wiPjxkaXYgY2xhc3M9XCJpbmRpY2F0b3JcIj48L2Rpdj48L2Rpdj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgc3BlbGxjaGVjaz1cImZhbHNlXCIgYXV0b2NvcnJlY3Q9XCJvZmZcIiBhdXRvY29tcGxldGU9XCJvZmZcIiBhdXRvY2FwaXRhbGl6ZT1cIm9mZlwiIGF1dG9mb2N1cz5cblx0PGRpdiBjbGFzcz1cImRlbGV0ZVwiPsOXPC9kaXY+XG5cdDxkaXYgY2xhc3M9XCJjb25zdC1ldmFsXCI+PC9kaXY+XG5cdDwvZGl2PmBcblx0XG5cdGNvbnN0IGVsdDogSFRNTEVsZW1lbnQgPSBzdHJpbmdUb0hUTUwoZWx0U3RyKS5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG5cdGNvbnN0IGVsdElucHV0OiBIVE1MSW5wdXRFbGVtZW50IHwgYW55ID0gZWx0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jylcblx0Y29uc3QgZWx0RGVsZXRlOiBIVE1MRWxlbWVudCB8IGFueSA9IGVsdC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlJylcblx0Y29uc3QgZWx0SW5kaWNhdG9yOiBIVE1MRWxlbWVudCB8IGFueSA9IGVsdC5xdWVyeVNlbGVjdG9yKCcuaW5kaWNhdG9yJylcblx0XG5cdGVsdElucHV0Py5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGU6IEtleWJvYXJkRXZlbnQpIHtcblx0XHRpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKVxuXHRcdFx0aWYgKG51bUlucHV0cyA+IGN1cnJlbnRJbnB1dEluZGV4KSB7XG5cdFx0XHRcdGNvbnN0IG5leHRFbHQgPSBpbnB1dHNFbHQucXVlcnlTZWxlY3RvcihgLmlucHV0W2RhdGEtaW5wdXQtaWR4PVwiJHsrK2N1cnJlbnRJbnB1dEluZGV4fVwiXWApXG5cdFx0XHRcdGFjdGl2YXRlSW5wdXQobmV4dEVsdClcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0bmV4dEVsdC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpPy5mb2N1cygpXG5cdFx0XHRcdH0sIDApXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0YWRkTmV3SW5wdXQoKVxuXHRcdH1cblx0fSlcblx0XG5cdGVsdElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGU6IE1vdXNlRXZlbnQpIHtcblx0XHRhY3RpdmF0ZUlucHV0KGVsdClcblx0XHRjdXJyZW50SW5wdXRJbmRleCA9IHBhcnNlSW50KGVsdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5wdXQtaWR4JykgfHwgJzAnKVxuXHRcdGVsdElucHV0Py5mb2N1cygpXG5cdH0pXG5cdFxuXHRlbHRJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoZTogRm9jdXNFdmVudCkge1xuXHRcdGFjdGl2YXRlSW5wdXQoZWx0KVxuXHRcdGN1cnJlbnRJbnB1dEluZGV4ID0gcGFyc2VJbnQoZWx0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbnB1dC1pZHgnKSB8fCAnMCcpXG5cdH0pXG5cblx0ZWx0SW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKGU6IElucHV0RXZlbnQpIHtcblx0XHRjdXJyZW50SW5wdXRJbmRleCA9IHBhcnNlSW50KGVsdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5wdXQtaWR4JykgfHwgJzAnKVxuXG5cdFx0aWYgKGVsdEluZGljYXRvci5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykpIHtcblx0XHRcdHNldElucHV0QXQoY3VycmVudElucHV0SW5kZXgsICcnKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZXRJbnB1dEF0KGN1cnJlbnRJbnB1dEluZGV4LCBlbHRJbnB1dC52YWx1ZSlcblx0XHR9XG5cdH0pXG5cdFxuXHRlbHREZWxldGU/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGU6IE1vdXNlRXZlbnQpIHtcblx0XHQvLyBvbmx5IGVsZW1lbnQgbGVmdFxuXHRcdGlmIChudW1JbnB1dHMgPT09IDEpIHtcblx0XHRcdGVsdC5jbGFzc0xpc3QuYWRkKCdpbGxlZ2FsJylcblxuXHRcdFx0Y29uc3QgZWx0SW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBhbnkgPSBlbHQucXVlcnlTZWxlY3RvcignaW5wdXQnKVxuXHRcdFx0aWYgKGVsdElucHV0KSB7XG5cdFx0XHRcdGVsdElucHV0LnZhbHVlID0gJydcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaW5kaWNhdG9yOiBIVE1MRWxlbWVudCB8IG51bGwgPSBlbHQucXVlcnlTZWxlY3RvcignLmluZGljYXRvcicpXG5cdFx0XHRpbmRpY2F0b3I/LmNsYXNzTGlzdC5yZW1vdmUoJ3BlbmRpbmcnLCAnYWN0aXZlJywgJ2Vycm9yJywgJ2Rpc2FibGVkJylcblxuXHRcdFx0Y29uc3QgY29uc3RFdmFsRWx0OiBIVE1MRWxlbWVudCB8IG51bGwgPSBlbHQucXVlcnlTZWxlY3RvcignLmNvbnN0LWV2YWwnKVxuXHRcdFx0Y29uc3RFdmFsRWx0Py5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcblxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiBlbHQuY2xhc3NMaXN0LnJlbW92ZSgnaWxsZWdhbCcpLCAyMDApXG5cdFx0XHRcblx0XHRcdHNjaGVkdWxlUmVkcmF3KClcblx0XHRcdHJlc2V0UGxvdHMoKVxuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXG5cdFx0ZWx0LmNsYXNzTGlzdC5hZGQoJ2RlbGV0ZWQnKVxuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRlbHQucmVtb3ZlKClcblx0XHRcdGNvbnN0IHJlbW92ZWRJbmRleCA9IHBhcnNlSW50KGVsdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5wdXQtaWR4JykgfHwgJzAnKVxuXHRcdFx0bnVtSW5wdXRzLS1cblx0XHRcdHNldE51bUlucHV0cyhudW1JbnB1dHMpXG5cdFx0XHRcblx0XHRcdC8vIHJlLWluZGV4IGlucHV0c1xuXHRcdFx0Y29uc3QgaW5wdXRzID0gaW5wdXRzRWx0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnB1dCcpXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpbnB1dHNbaV0uc2V0QXR0cmlidXRlKCdkYXRhLWlucHV0LWlkeCcsIChpICsgMSkudG9TdHJpbmcoKSlcblxuXHRcdFx0XHRjb25zdCBlbHRJbmRpY2F0b3IgPSBpbnB1dHNbaV0ucXVlcnlTZWxlY3RvcignLmluZGljYXRvcicpXG5cdFx0XHRcdGlmIChlbHRJbmRpY2F0b3I/LmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkge1xuXHRcdFx0XHRcdHNldElucHV0QXQoaSArIDEsICcnKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNldElucHV0QXQoaSArIDEsIGVsdElucHV0LnZhbHVlKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIHJlbW92ZWQgZWxlbWVudCBpcyBiZWZvcmUgY3VycmVudCBlbGVtZW50IG9yIGZpcnN0IGVsZW1lbnRcblx0XHRcdGlmIChudW1JbnB1dHMgPiAwICYmIChyZW1vdmVkSW5kZXggPD0gY3VycmVudElucHV0SW5kZXggfHwgcmVtb3ZlZEluZGV4ID09PSAxKSkge1xuXHRcdFx0XHRjb25zdCBwcmV2RWx0ID0gaW5wdXRzRWx0LnF1ZXJ5U2VsZWN0b3IoYC5pbnB1dFtkYXRhLWlucHV0LWlkeD1cIiR7Y3VycmVudElucHV0SW5kZXggLSAxfVwiXWApXG5cdFx0XHRcdGFjdGl2YXRlSW5wdXQocHJldkVsdClcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cHJldkVsdC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpPy5mb2N1cygpXG5cdFx0XHRcdH0sIDApXG5cdFx0XHR9XG5cdFx0fSwgMTIwKVxuXHR9KVxuXG5cdGVsdEluZGljYXRvcj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZTogTW91c2VFdmVudCkge1xuXHRcdGVsdEluZGljYXRvci5jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcpXG5cdFx0Y3VycmVudElucHV0SW5kZXggPSBwYXJzZUludChlbHQuZ2V0QXR0cmlidXRlKCdkYXRhLWlucHV0LWlkeCcpIHx8ICcwJylcblxuXHRcdGlmIChlbHRJbmRpY2F0b3IuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XG5cdFx0XHRzZXRJbnB1dEF0KGN1cnJlbnRJbnB1dEluZGV4LCAnJylcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2V0SW5wdXRBdChjdXJyZW50SW5wdXRJbmRleCwgZWx0SW5wdXQudmFsdWUpXG5cdFx0fVxuXHR9KVxuXHRcblx0ZWx0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbnB1dC1pZHgnLCAoKytjdXJyZW50SW5wdXRJbmRleCkudG9TdHJpbmcoKSlcblx0ZWx0LmNsYXNzTGlzdC5hZGQoJ2NyZWF0ZWQnKVxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRlbHQuY2xhc3NMaXN0LnJlbW92ZSgnY3JlYXRlZCcpXG5cdH0sIDEyMClcblxuXHRudW1JbnB1dHMrK1xuXHRzZXROdW1JbnB1dHMobnVtSW5wdXRzKVxuXHRhY3RpdmF0ZUlucHV0KGVsdClcblx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0ZWx0SW5wdXQ/LmZvY3VzKClcblx0fSwgMClcblx0aW5wdXRzRWx0LmFwcGVuZENoaWxkKGVsdClcbn1cblxuZXhwb3J0IGNvbnN0IGFkZE5ld0lucHV0V2l0aFZhbHVlID0gZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcblx0YWRkTmV3SW5wdXQoKVxuXHRzZXRJbnB1dEF0KGN1cnJlbnRJbnB1dEluZGV4LCB2YWx1ZSlcblx0Y29uc3QgZWx0SW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBhbnkgPSBpbnB1dHNFbHQucXVlcnlTZWxlY3RvcihgLmlucHV0W2RhdGEtaW5wdXQtaWR4PVwiJHtjdXJyZW50SW5wdXRJbmRleH1cIl0gaW5wdXRgKVxuXHRpZiAoZWx0SW5wdXQpIHtcblx0XHRlbHRJbnB1dC52YWx1ZSA9IHZhbHVlXG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHJlc2V0SW5wdXRzID0gZnVuY3Rpb24gKCk6IHZvaWQge1xuXHRjb25zdCBpbnB1dHMgPSBpbnB1dHNFbHQucXVlcnlTZWxlY3RvckFsbCgnLmlucHV0Jylcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcblx0XHRpbnB1dHNbaV0ucmVtb3ZlKClcblx0fVxuXHRudW1JbnB1dHMgPSAwXG5cdHNldE51bUlucHV0cyhudW1JbnB1dHMpXG5cdGN1cnJlbnRJbnB1dEluZGV4ID0gMFxuXHRyZXNldFBsb3RzKClcbn1cblxuY29uc3QgZ2V0SW5wdXRGcm9tSW5kZXggPSBmdW5jdGlvbiAoaWR4OiBudW1iZXIpOiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCB7XG5cdHJldHVybiBpbnB1dHNFbHQucXVlcnlTZWxlY3RvcihgLmlucHV0W2RhdGEtaW5wdXQtaWR4PVwiJHtpZHh9XCJdYClcbn1cblxuZXhwb3J0IGNvbnN0IGlucHV0U2V0Q29sb3JBdCA9IGZ1bmN0aW9uIChpZHg6IG51bWJlciwgY29sb3I6IHN0cmluZykge1xuXHRnZXRJbnB1dEZyb21JbmRleChpZHgpPy5zZXRBdHRyaWJ1dGUoJ2RhdGEtY29sb3InLCBjb2xvcilcbn1cblxuZXhwb3J0IGNvbnN0IGlucHV0U2V0RXJyb3JBdCA9IGZ1bmN0aW9uIChpZHg6IG51bWJlciwgZXJyb3I6IHN0cmluZykge1xuXHRjb25zdCBlbHQgPSBnZXRJbnB1dEZyb21JbmRleChpZHgpXG5cdGlmICghZWx0KSByZXR1cm5cblxuXHRjb25zdCBpbmRpY2F0b3I6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGVsdC5xdWVyeVNlbGVjdG9yKCcuaW5kaWNhdG9yJylcblx0aWYgKCFpbmRpY2F0b3IpIHJldHVyblxuXG5cdGluZGljYXRvci5zZXRBdHRyaWJ1dGUoJ2RhdGEtZXJyb3InLCBlcnJvcilcbn1cblxuZXhwb3J0IGNvbnN0IGlucHV0U2V0Q29uc3RFdmFsQXQgPSBmdW5jdGlvbiAoaWR4OiBudW1iZXIsIGNvbnN0RXZhbDogQ29tcGxleCB8IG51bWJlcikge1xuXHRjb25zdCBlbHQgPSBnZXRJbnB1dEZyb21JbmRleChpZHgpXG5cdGlmICghZWx0KSByZXR1cm5cblxuXHRjb25zdCBjb25zdEV2YWxFbHQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGVsdC5xdWVyeVNlbGVjdG9yKCcuY29uc3QtZXZhbCcpXG5cdGlmICghY29uc3RFdmFsRWx0KSByZXR1cm5cblxuXHRjb25zdEV2YWxFbHQuaW5uZXJUZXh0ID0gJz0gJyArIHR5cGVvZiBjb25zdEV2YWwgPT09ICdudW1iZXInID8gY29uc3RFdmFsLnRvU3RyaW5nKCkgOiBjb21wbGV4VG9TdHJpbmcoY29uc3RFdmFsIGFzIENvbXBsZXgpXG5cdGNvbnN0RXZhbEVsdC5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcbn1cblxuZXhwb3J0IGNvbnN0IGlucHV0U2V0U3RhdHVzQXQgPSBmdW5jdGlvbiAoaWR4OiBudW1iZXIsIHN0YXR1czogUGxvdFN0YXR1cykge1xuXHRjb25zdCBlbHQgPSBnZXRJbnB1dEZyb21JbmRleChpZHgpXG5cdGlmICghZWx0KSByZXR1cm5cblxuXHRjb25zdCBpbmRpY2F0b3I6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGVsdC5xdWVyeVNlbGVjdG9yKCcuaW5kaWNhdG9yJylcblx0aWYgKCFpbmRpY2F0b3IpIHJldHVyblxuXHRpbmRpY2F0b3IuY2xhc3NMaXN0LnJlbW92ZSgncGVuZGluZycsICdhY3RpdmUnLCAnZXJyb3InKVxuXG5cdGNvbnN0IGNvbnN0RXZhbEVsdDogSFRNTEVsZW1lbnQgfCBudWxsID0gZWx0LnF1ZXJ5U2VsZWN0b3IoJy5jb25zdC1ldmFsJylcblx0aWYgKCFjb25zdEV2YWxFbHQpIHJldHVyblxuXG5cdHN3aXRjaCAoc3RhdHVzKSB7XG5cdFx0Y2FzZSBQbG90U3RhdHVzLlBFTkRJTkc6XG5cdFx0XHRpbmRpY2F0b3IuY2xhc3NMaXN0LmFkZCgncGVuZGluZycpXG5cdFx0XHRpbmRpY2F0b3IuaW5uZXJIVE1MID0gJydcblx0XHRcdGNvbnN0RXZhbEVsdC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcblx0XHRcdGJyZWFrXG5cdFx0Y2FzZSBQbG90U3RhdHVzLkFDVElWRTpcblx0XHRcdGluZGljYXRvci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuXHRcdFx0aW5kaWNhdG9yLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGVsdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29sb3InKSB8fCAnIzAwMCdcblx0XHRcdGluZGljYXRvci5pbm5lckhUTUwgPSAnJ1xuXHRcdFx0YnJlYWtcblx0XHRjYXNlIFBsb3RTdGF0dXMuRVJST1I6XG5cdFx0XHRpbmRpY2F0b3IuY2xhc3NMaXN0LmFkZCgnZXJyb3InKVxuXHRcdFx0aW5kaWNhdG9yLmlubmVySFRNTCA9ICchJ1xuXHRcdFx0Y29uc3RFdmFsRWx0LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxuXHRcdFx0YnJlYWtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgaW5wdXRTZXREcml2ZXJBdCA9IGZ1bmN0aW9uIChpZHg6IG51bWJlciwgZHJpdmVyOiBQbG90RHJpdmVyKSB7XG5cdGNvbnN0IGVsdCA9IGdldElucHV0RnJvbUluZGV4KGlkeClcblx0aWYgKCFlbHQpIHJldHVyblxuXG5cdGNvbnN0IGNvbnN0RXZhbEVsdDogSFRNTEVsZW1lbnQgfCBudWxsID0gZWx0LnF1ZXJ5U2VsZWN0b3IoJy5jb25zdC1ldmFsJylcblx0aWYgKCFjb25zdEV2YWxFbHQpIHJldHVyblxuXG5cdGlmIChkcml2ZXIgIT09IFBsb3REcml2ZXIuQ09OU1RBTlQpIHtcblx0XHRjb25zdEV2YWxFbHQuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXG5cdH1cbn1cblxuY29uc3QgYWN0aXZhdGVJbnB1dCA9IGZ1bmN0aW9uIChlbHQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG5cdGlucHV0c0VsdC5xdWVyeVNlbGVjdG9yQWxsKCcuaW5wdXQnKS5mb3JFYWNoKChlbHQ6IEhUTUxFbGVtZW50KSA9PiB7XG5cdFx0ZWx0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG5cdH0pXG5cdGVsdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0TGVmdFBhbmVsV2lkdGggPSBmdW5jdGlvbiAoKTogbnVtYmVyIHtcblx0cmV0dXJuIGxlZnRQYW5lbC5vZmZzZXRXaWR0aFxufVxuIiwiaW1wb3J0IHsgbG9hZFBsb3RzIH0gZnJvbSAnLi4vY29yZS9jb250cm9sbGVyJ1xuaW1wb3J0IHsgc3RyaW5nVG9IVE1MIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmNvbnN0IG1lbnVCYXI6IEhUTUxFbGVtZW50IHwgYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtYmFyJylcblxuZXhwb3J0IGNvbnN0IGluaXRNZW51QmFyID0gZnVuY3Rpb24gKCk6IHZvaWQge1xuXHRjb25zdCBtZW51QmFyQnV0dG9uczogSFRNTEJ1dHRvbkVsZW1lbnRbXSA9IEFycmF5LmZyb20obWVudUJhci5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24nKSlcblx0bWVudUJhckJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCkgPT4ge1xuXHRcdGNvbnN0IGljb246IHN0cmluZyA9IGJ1dHRvbi5kYXRhc2V0Lmljb24gfHwgJydcblx0XHRjb25zdCBocmVmOiBzdHJpbmcgPSBidXR0b24uZGF0YXNldC5ocmVmIHx8ICcnXG5cdFx0Y29uc3QgZmlsdGVyOiBzdHJpbmcgPSBidXR0b24uZGF0YXNldC5maWx0ZXIgfHwgJydcblx0XHRpZiAoaWNvbiAmJiBocmVmKSB7XG5cdFx0XHRjb25zdCBpY29uU3RyID0gJzxkaXYgY2xhc3M9XCJidXR0b24taWNvblwiPjwvZGl2Pidcblx0XHRcdGNvbnN0IGljb25FbHQgPSBzdHJpbmdUb0hUTUwoaWNvblN0cikuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuXHRcdFx0aWNvbkVsdC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke2ljb259JylgXG5cdFx0XHRpY29uRWx0LnN0eWxlLmZpbHRlciA9IGZpbHRlclxuXHRcdFx0YnV0dG9uLmFwcGVuZENoaWxkKGljb25FbHQpXG5cdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdHdpbmRvdy5vcGVuKGhyZWYsICdfYmxhbmsnKVxuXHRcdFx0fSlcblx0XHR9XG5cdH0pXG5cblx0Y29uc3QgZGVtb0J1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVtby1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudFxuXHRjb25zdCBleGFtcGxlc0xpc3Q6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmV4YW1wbGVzLWxpc3QnKSBhcyBIVE1MRGl2RWxlbWVudFxuXHRsZXQgZXhhbXBsZUpzb246IGFueVxuXHRsZXQgbnVtRXhhbXBsZXMgPSAwXG5cblx0ZmV0Y2goJ2Fzc2V0cy9kZW1vL2RlbW8uanNvbicpLnRoZW4oKHJlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xuXHRcdHJldHVybiByZXNwb25zZS5qc29uKClcblx0fSkudGhlbigoZGF0YTogYW55KSA9PiB7XG5cdFx0ZXhhbXBsZUpzb24gPSBkYXRhXG5cdFx0bnVtRXhhbXBsZXMgPSBkYXRhPy5udW1QbG90c1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtRXhhbXBsZXM7IGkrKykge1xuXHRcdFx0bGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRjb250YWluZXIuaW5uZXJIVE1MID0gZGF0YT8ucGxvdHNbaV0/Lm5hbWVcblx0XHRcdGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdleGFtcGxlLWxpc3QtaXRlbScpXG5cdFx0XHRjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdGxvYWRQbG90cyhleGFtcGxlSnNvbj8ucGxvdHNbaV0/LmlucHV0cyB8fCAnJywgZXhhbXBsZUpzb24/LnBsb3RzW2ldPy5kZWZhdWx0cyB8fCAnJylcblx0XHRcdH0pXG5cdFx0XHRleGFtcGxlc0xpc3QuYXBwZW5kQ2hpbGQoY29udGFpbmVyKVxuXHRcdH1cblx0fSlcblxuXHRkZW1vQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdGV4YW1wbGVzTGlzdC5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKVxuXHR9KVxufVxuIiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyBnZXRMZWZ0UGFuZWxXaWR0aCB9IGZyb20gJy4vbGVmdFBhbmVsJ1xuXG5sZXQgbW91c2VDbGFpbWVkID0gZmFsc2VcbmxldCBtb3VzZURvd24gPSBmYWxzZVxubGV0IGNsYWltZWRDYWxsYmFjazogKG1vdXNlOiBWZWN0b3IpID0+IHZvaWRcbmNvbnN0IG1vdXNlUG9zID0gbmV3IFZlY3RvcigwLCAwKVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtY2FsbC1zcGFjaW5nXG5jb25zdCBtb3VzZUNhbGxiYWNrcyA9IG5ldyBNYXA8SFRNTEVsZW1lbnQsIChwb3M6IFZlY3RvcikgPT4gdm9pZD4oKVxuXG5leHBvcnQgY29uc3QgZ2V0TW91c2VQb3MgPSBmdW5jdGlvbiAoKTogVmVjdG9yIHtcblx0cmV0dXJuIG1vdXNlUG9zXG59XG5cbmV4cG9ydCBjb25zdCBvbk1vdXNlRHJhZyA9IGZ1bmN0aW9uIChlbHQ6IEhUTUxFbGVtZW50LCBjYWxsYmFjazogKHBvczogVmVjdG9yKSA9PiB2b2lkKTogdm9pZCB7XG5cdG1vdXNlQ2FsbGJhY2tzLnNldChlbHQsIGNhbGxiYWNrKVxufVxuXG5leHBvcnQgY29uc3QgaW5pdFVzZXJJbnRlcmFjdCA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblx0XHRtb3VzZURvd24gPSB0cnVlXG5cdH0pXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcblx0XHRpZiAoIW1vdXNlRG93bikgcmV0dXJuXG5cdFx0bW91c2VQb3Muc2V0KGUuY2xpZW50WCwgZS5jbGllbnRZKVxuXHRcdGlmIChtb3VzZUNsYWltZWQpIHtcblx0XHRcdGNsYWltZWRDYWxsYmFjayhtb3VzZVBvcylcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHRmb3IgKGNvbnN0IFtlbHQsIGNhbGxiYWNrXSBvZiBtb3VzZUNhbGxiYWNrcykge1xuXHRcdFx0aWYgKGVsdD8uY29udGFpbnMoZS50YXJnZXQgYXMgTm9kZSkpIHtcblx0XHRcdFx0Y2FsbGJhY2sobW91c2VQb3MpXG5cdFx0XHRcdG1vdXNlQ2xhaW1lZCA9IHRydWVcblx0XHRcdFx0Y2xhaW1lZENhbGxiYWNrID0gY2FsbGJhY2tcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0fVxuXHR9KVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbiAoZTogTW91c2VFdmVudCk6IHZvaWQge1xuXHRcdG1vdXNlQ2xhaW1lZCA9IGZhbHNlXG5cdFx0bW91c2VEb3duID0gZmFsc2Vcblx0fSlcbn1cbiIsImV4cG9ydCBjb25zdCBzdHJpbmdUb0hUTUwgPSBmdW5jdGlvbiAoc3RyOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG5cdGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuXHRjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN0ciwgJ3RleHQvaHRtbCcpXG5cdHJldHVybiBkb2MuYm9keVxufVxuXG5leHBvcnQgY2xhc3MgVmVjdG9yIHtcblx0eDogbnVtYmVyXG5cdHk6IG51bWJlclxuXHRcblx0Y29uc3RydWN0b3IgKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG5cdFx0dGhpcy54ID0geFxuXHRcdHRoaXMueSA9IHlcblx0fVxuXHRcblx0c2V0ICh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuXHRcdHRoaXMueCA9IHhcblx0XHR0aGlzLnkgPSB5XG5cdH1cbn1cblxuZXhwb3J0IHR5cGUgQ29tcGxleCA9IHtcbiAgICByZTogbnVtYmVyXG4gICAgaW06IG51bWJlclxufVxuXG5leHBvcnQgY29uc3QgY29tcGxleFRvU3RyaW5nID0gZnVuY3Rpb24gKGM6IENvbXBsZXgpOiBzdHJpbmcge1xuXHQvLyByb3VuZCBjb21wb25lbnRzIHRvIDYgZGVjaW1hbCBwbGFjZXNcblx0Y29uc3QgcmUgPSBNYXRoLnJvdW5kKGMucmUgKiAxMDAwMDAwKSAvIDEwMDAwMDBcblx0Y29uc3QgaW0gPSBNYXRoLnJvdW5kKGMuaW0gKiAxMDAwMDAwKSAvIDEwMDAwMDBcblx0cmV0dXJuIGltID09PSAwID8gcmUudG9TdHJpbmcoKSA6IChyZSArICcgKyAnICsgaW0gKyAnaScpXG59XG5cbmV4cG9ydCBjb25zdCBjcHggPSAobnVtOiBudW1iZXIpID0+ICh7IHJlOiBudW0sIGltOiAwIH0pXG5cbi8vIFBlcmxpbiBub2lzZSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9qb3NlcGhnL25vaXNlanMvYmxvYi9tYXN0ZXIvcGVybGluLmpzXG5jb25zdCBwZXJtID0gbmV3IEFycmF5KDUxMilcbmNvbnN0IGdyYWRQID0gbmV3IEFycmF5KDUxMilcblxuY29uc3QgcCA9IFsxNTEsIDE2MCwgMTM3LCA5MSwgOTAsIDE1LFxuXHQxMzEsIDEzLCAyMDEsIDk1LCA5NiwgNTMsIDE5NCwgMjMzLCA3LCAyMjUsIDE0MCwgMzYsIDEwMywgMzAsIDY5LCAxNDIsIDgsIDk5LCAzNywgMjQwLCAyMSwgMTAsIDIzLFxuXHQxOTAsIDYsIDE0OCwgMjQ3LCAxMjAsIDIzNCwgNzUsIDAsIDI2LCAxOTcsIDYyLCA5NCwgMjUyLCAyMTksIDIwMywgMTE3LCAzNSwgMTEsIDMyLCA1NywgMTc3LCAzMyxcblx0ODgsIDIzNywgMTQ5LCA1NiwgODcsIDE3NCwgMjAsIDEyNSwgMTM2LCAxNzEsIDE2OCwgNjgsIDE3NSwgNzQsIDE2NSwgNzEsIDEzNCwgMTM5LCA0OCwgMjcsIDE2Nixcblx0NzcsIDE0NiwgMTU4LCAyMzEsIDgzLCAxMTEsIDIyOSwgMTIyLCA2MCwgMjExLCAxMzMsIDIzMCwgMjIwLCAxMDUsIDkyLCA0MSwgNTUsIDQ2LCAyNDUsIDQwLCAyNDQsXG5cdDEwMiwgMTQzLCA1NCwgNjUsIDI1LCA2MywgMTYxLCAxLCAyMTYsIDgwLCA3MywgMjA5LCA3NiwgMTMyLCAxODcsIDIwOCwgODksIDE4LCAxNjksIDIwMCwgMTk2LFxuXHQxMzUsIDEzMCwgMTE2LCAxODgsIDE1OSwgODYsIDE2NCwgMTAwLCAxMDksIDE5OCwgMTczLCAxODYsIDMsIDY0LCA1MiwgMjE3LCAyMjYsIDI1MCwgMTI0LCAxMjMsXG5cdDUsIDIwMiwgMzgsIDE0NywgMTE4LCAxMjYsIDI1NSwgODIsIDg1LCAyMTIsIDIwNywgMjA2LCA1OSwgMjI3LCA0NywgMTYsIDU4LCAxNywgMTgyLCAxODksIDI4LCA0Mixcblx0MjIzLCAxODMsIDE3MCwgMjEzLCAxMTksIDI0OCwgMTUyLCAyLCA0NCwgMTU0LCAxNjMsIDcwLCAyMjEsIDE1MywgMTAxLCAxNTUsIDE2NywgNDMsIDE3MiwgOSxcblx0MTI5LCAyMiwgMzksIDI1MywgMTksIDk4LCAxMDgsIDExMCwgNzksIDExMywgMjI0LCAyMzIsIDE3OCwgMTg1LCAxMTIsIDEwNCwgMjE4LCAyNDYsIDk3LCAyMjgsXG5cdDI1MSwgMzQsIDI0MiwgMTkzLCAyMzgsIDIxMCwgMTQ0LCAxMiwgMTkxLCAxNzksIDE2MiwgMjQxLCA4MSwgNTEsIDE0NSwgMjM1LCAyNDksIDE0LCAyMzksIDEwNyxcblx0NDksIDE5MiwgMjE0LCAzMSwgMTgxLCAxOTksIDEwNiwgMTU3LCAxODQsIDg0LCAyMDQsIDE3NiwgMTE1LCAxMjEsIDUwLCA0NSwgMTI3LCA0LCAxNTAsIDI1NCxcblx0MTM4LCAyMzYsIDIwNSwgOTMsIDIyMiwgMTE0LCA2NywgMjksIDI0LCA3MiwgMjQzLCAxNDEsIDEyOCwgMTk1LCA3OCwgNjYsIDIxNSwgNjEsIDE1NiwgMTgwXVxuXG5jbGFzcyBHcmFkIHtcblx0eDogbnVtYmVyXG5cdHk6IG51bWJlclxuXHR6OiBudW1iZXJcblxuXHRjb25zdHJ1Y3RvciAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcikge1xuXHRcdHRoaXMueCA9IHg7IHRoaXMueSA9IHk7IHRoaXMueiA9IHpcblx0fVxufVxuXG5jb25zdCBncmFkMyA9IFtuZXcgR3JhZCgxLCAxLCAwKSwgbmV3IEdyYWQoLTEsIDEsIDApLCBuZXcgR3JhZCgxLCAtMSwgMCksIG5ldyBHcmFkKC0xLCAtMSwgMCksXG5cdFx0XHRuZXcgR3JhZCgxLCAwLCAxKSwgbmV3IEdyYWQoLTEsIDAsIDEpLCBuZXcgR3JhZCgxLCAwLCAtMSksIG5ldyBHcmFkKC0xLCAwLCAtMSksXG5cdFx0XHRuZXcgR3JhZCgwLCAxLCAxKSwgbmV3IEdyYWQoMCwgLTEsIDEpLCBuZXcgR3JhZCgwLCAxLCAtMSksIG5ldyBHcmFkKDAsIC0xLCAtMSldXG5cbmNvbnN0IHNlZWQgPSBmdW5jdGlvbiAoc2VlZDogbnVtYmVyKTogdm9pZCB7XG5cdGlmIChzZWVkID4gMCAmJiBzZWVkIDwgMSkge1xuXHRcdHNlZWQgKj0gNjU1MzZcblx0fVxuXG5cdHNlZWQgPSBNYXRoLmZsb29yKHNlZWQpXG5cdGlmIChzZWVkIDwgMjU2KSB7XG5cdFx0c2VlZCB8PSBzZWVkIDw8IDhcblx0fVxuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcblx0XHRsZXQgdlxuXHRcdGlmIChpICYgMSkge1xuXHRcdHYgPSBwW2ldIF4gKHNlZWQgJiAyNTUpXG5cdFx0fSBlbHNlIHtcblx0XHR2ID0gcFtpXSBeICgoc2VlZCA+PiA4KSAmIDI1NSlcblx0XHR9XG5cblx0XHRwZXJtW2ldID0gcGVybVtpICsgMjU2XSA9IHZcblx0XHRncmFkUFtpXSA9IGdyYWRQW2kgKyAyNTZdID0gZ3JhZDNbdiAlIDEyXVxuXHR9XG59XG5cbnNlZWQoMTIzNDUpXG5cbmZ1bmN0aW9uIGZhZGUgKHQ6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiB0ICogdCAqIHQgKiAodCAqICh0ICogNiAtIDE1KSArIDEwKVxufVxuXG5mdW5jdGlvbiBsZXJwIChhOiBudW1iZXIsIGI6IG51bWJlciwgdDogbnVtYmVyKTogbnVtYmVyIHtcblx0cmV0dXJuICgxIC0gdCkgKiBhICsgdCAqIGJcbn1cblxuZXhwb3J0IGNvbnN0IHBlcmxpbjIgPSBmdW5jdGlvbiAoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXIge1xuXHQvLyBGaW5kIHVuaXQgZ3JpZCBjZWxsIGNvbnRhaW5pbmcgcG9pbnRcblx0bGV0IFggPSBNYXRoLmZsb29yKHgpOyBsZXQgWSA9IE1hdGguZmxvb3IoeSlcblx0Ly8gR2V0IHJlbGF0aXZlIHh5IGNvb3JkaW5hdGVzIG9mIHBvaW50IHdpdGhpbiB0aGF0IGNlbGxcblx0eCA9IHggLSBYOyB5ID0geSAtIFlcblx0Ly8gV3JhcCB0aGUgaW50ZWdlciBjZWxscyBhdCAyNTUgKHNtYWxsZXIgaW50ZWdlciBwZXJpb2QgY2FuIGJlIGludHJvZHVjZWQgaGVyZSlcblx0WCA9IFggJiAyNTU7IFkgPSBZICYgMjU1XG5cblx0Ly8gQ2FsY3VsYXRlIG5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIG9mIHRoZSBmb3VyIGNvcm5lcnNcblx0Y29uc3QgbjAwID0gZ3JhZFBbWCArIHBlcm1bWV1dLmRvdDIoeCwgeSlcblx0Y29uc3QgbjAxID0gZ3JhZFBbWCArIHBlcm1bWSArIDFdXS5kb3QyKHgsIHkgLSAxKVxuXHRjb25zdCBuMTAgPSBncmFkUFtYICsgMSArIHBlcm1bWV1dLmRvdDIoeCAtIDEsIHkpXG5cdGNvbnN0IG4xMSA9IGdyYWRQW1ggKyAxICsgcGVybVtZICsgMV1dLmRvdDIoeCAtIDEsIHkgLSAxKVxuXG5cdC8vIENvbXB1dGUgdGhlIGZhZGUgY3VydmUgdmFsdWUgZm9yIHhcblx0Y29uc3QgdSA9IGZhZGUoeClcblxuXHQvLyBJbnRlcnBvbGF0ZSB0aGUgZm91ciByZXN1bHRzXG5cdHJldHVybiBsZXJwKFxuXHRcdGxlcnAobjAwLCBuMTAsIHUpLFxuXHRcdGxlcnAobjAxLCBuMTEsIHUpLFxuXHRcdGZhZGUoeSkpXG59XG5cbmNvbnN0IGZhY3RvcmlhbDAxID0gZnVuY3Rpb24gKHg6IG51bWJlcik6IG51bWJlciB7XG5cdHJldHVybiAoKCgoKDAuMDcyODg0NDg5NzgyMTU0NTYgKiB4IC0gMC4zMTM5MDA1MTU0MzcxMjYxNikgKiB4ICsgMC42NTM4OTA3MDg0NjE0MDM4KSAqIHggLSAwLjgxMDQyNTcxNTUyMDk3OCkgKiB4ICsgMC45NzM3NjU1NDQxMjc2NzI5KSAqIHggLSAwLjU3NjE4NTE2Njg2NDg4ODcpICogeCArIDAuOTk5OTgzMDA0NDAzNDc1MlxufVxuXG5leHBvcnQgY29uc3QgZmFjdG9yaWFsID0gZnVuY3Rpb24gKHg6IG51bWJlcik6IG51bWJlciB7XG5cdGNvbnN0IGggPSBNYXRoLmZsb29yKHgpXG5cdGNvbnN0IGYgPSB4IC0gaFxuXHRsZXQgeSA9IGZhY3RvcmlhbDAxKGYpXG5cdGlmICh4IDwgMCkgZm9yIChsZXQgbiA9IDA7IG4gPCAtaDsgbisrKSB5IC89IGYgLSBuXG5cdGVsc2UgZm9yIChsZXQgbiA9IDE7IG4gPCBoICsgMTsgbisrKSB5ICo9IGYgKyBuXG5cdHJldHVybiB4ID4gMCA/IHkgOiBJbmZpbml0eVxufVxuXG5leHBvcnQgY29uc3Qgc2lnbW9pZCA9IGZ1bmN0aW9uICh4OiBudW1iZXIpOiBudW1iZXIge1xuXHRyZXR1cm4gMSAvICgxICsgTWF0aC5leHAoLXgpKVxufVxuXG5jb25zdCBjb25zdHJhaW4gPSBmdW5jdGlvbiAobjogbnVtYmVyLCBsb3c6IG51bWJlciwgaGlnaDogbnVtYmVyKSB7XG5cdHJldHVybiBNYXRoLm1heChNYXRoLm1pbihuLCBoaWdoKSwgbG93KVxufVxuXG5leHBvcnQgY29uc3QgbWFwID0gZnVuY3Rpb24gKG46IG51bWJlciwgc3RhcnQxOiBudW1iZXIsIHN0b3AxOiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBzdG9wMjogbnVtYmVyKSB7XG5cdHJldHVybiAobiAtIHN0YXJ0MSkgLyAoc3RvcDEgLSBzdGFydDEpICogKHN0b3AyIC0gc3RhcnQyKSArIHN0YXJ0MlxufVxuIiwiaW1wb3J0IHsgaW5pdExlZnRQYW5lbCB9IGZyb20gJy4vYXBwL3VpL2xlZnRQYW5lbCdcbmltcG9ydCB7IGluaXRNZW51QmFyIH0gZnJvbSAnLi9hcHAvdWkvbWVudWJhcidcbmltcG9ydCB7IGNhbnZhc0RyYXcsIGluaXRDYW52YXMgfSBmcm9tICcuL2FwcC9jYW52YXMvY2FudmFzQ29yZSdcbmltcG9ydCB7IGluaXRVc2VySW50ZXJhY3QgfSBmcm9tICcuL2FwcC91aS91c2VySW50ZXJhY3QnXG5pbXBvcnQgeyBkcmF3UGxvdHMsIGRyaXZlUGxvdHMgfSBmcm9tICcuL2FwcC9jb3JlL2NvbnRyb2xsZXInXG5pbXBvcnQgeyBzaGFkZXJzRHJhdywgaW5pdFNoYWRlckNvcmUsIHNoYWRlckNvcmVVcGRhdGUgfSBmcm9tICcuL2FwcC9zaGFkZXIvc2hhZGVyQ29yZSdcblxubGV0IGRyYXdGcmFtZSA9IHRydWVcbmxldCBmcmFtZVRpbWUgPSAwXG5cbmV4cG9ydCBjb25zdCBzY2hlZHVsZVJlZHJhdyA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcblx0ZHJhd0ZyYW1lID0gdHJ1ZVxufVxuXG5leHBvcnQgY29uc3QgZ2V0R2xvYmFsVGltZSA9ICgpOiBudW1iZXIgPT4gZnJhbWVUaW1lXG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG5cdGluaXRVc2VySW50ZXJhY3QoKVxuXHRpbml0TWVudUJhcigpXG5cdGluaXRMZWZ0UGFuZWwoKVxuXHRpbml0Q2FudmFzKClcblx0aW5pdFNoYWRlckNvcmUoKVxuXG5cdG1haW5Mb29wKClcbn1cblxuY29uc3QgbWFpbkxvb3AgPSBmdW5jdGlvbiAoKSB7XG5cdGlmIChkcmF3RnJhbWUpIHtcblx0XHRkcmF3RnJhbWUgPSBmYWxzZVxuXHRcdGNhbnZhc0RyYXcoKVxuXHRcdHNoYWRlcnNEcmF3KClcblx0XHRkcmF3UGxvdHMoKVxuXHR9XG5cblx0ZHJpdmVQbG90cygpXG5cdHNoYWRlckNvcmVVcGRhdGUoKVxuXHRmcmFtZVRpbWUgKz0gMC4wMVxuXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcClcbn1cbiIsIi8qKlxuICogQ29tbW9uIHV0aWxpdGllc1xuICogQG1vZHVsZSBnbE1hdHJpeFxuICovXG4vLyBDb25maWd1cmF0aW9uIENvbnN0YW50c1xuZXhwb3J0IHZhciBFUFNJTE9OID0gMC4wMDAwMDFcbmV4cG9ydCB2YXIgQVJSQVlfVFlQRSA9IHR5cGVvZiBGbG9hdDMyQXJyYXkgIT09ICd1bmRlZmluZWQnID8gRmxvYXQzMkFycmF5IDogQXJyYXlcbmV4cG9ydCB2YXIgUkFORE9NID0gTWF0aC5yYW5kb21cbmV4cG9ydCB2YXIgQU5HTEVfT1JERVIgPSAnenl4J1xuLyoqXG4gKiBTZXRzIHRoZSB0eXBlIG9mIGFycmF5IHVzZWQgd2hlbiBjcmVhdGluZyBuZXcgdmVjdG9ycyBhbmQgbWF0cmljZXNcbiAqXG4gKiBAcGFyYW0ge0Zsb2F0MzJBcnJheUNvbnN0cnVjdG9yIHwgQXJyYXlDb25zdHJ1Y3Rvcn0gdHlwZSBBcnJheSB0eXBlLCBzdWNoIGFzIEZsb2F0MzJBcnJheSBvciBBcnJheVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRNYXRyaXhBcnJheVR5cGUgKHR5cGUpIHtcbiAgQVJSQVlfVFlQRSA9IHR5cGVcbn1cbmNvbnN0IGRlZ3JlZSA9IE1hdGguUEkgLyAxODBcbi8qKlxuICogQ29udmVydCBEZWdyZWUgVG8gUmFkaWFuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGEgQW5nbGUgaW4gRGVncmVlc1xuICovXG5cbmV4cG9ydCBmdW5jdGlvbiB0b1JhZGlhbiAoYSkge1xuICByZXR1cm4gYSAqIGRlZ3JlZVxufVxuLyoqXG4gKiBUZXN0cyB3aGV0aGVyIG9yIG5vdCB0aGUgYXJndW1lbnRzIGhhdmUgYXBwcm94aW1hdGVseSB0aGUgc2FtZSB2YWx1ZSwgd2l0aGluIGFuIGFic29sdXRlXG4gKiBvciByZWxhdGl2ZSB0b2xlcmFuY2Ugb2YgZ2xNYXRyaXguRVBTSUxPTiAoYW4gYWJzb2x1dGUgdG9sZXJhbmNlIGlzIHVzZWQgZm9yIHZhbHVlcyBsZXNzXG4gKiB0aGFuIG9yIGVxdWFsIHRvIDEuMCwgYW5kIGEgcmVsYXRpdmUgdG9sZXJhbmNlIGlzIHVzZWQgZm9yIGxhcmdlciB2YWx1ZXMpXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGEgVGhlIGZpcnN0IG51bWJlciB0byB0ZXN0LlxuICogQHBhcmFtIHtOdW1iZXJ9IGIgVGhlIHNlY29uZCBudW1iZXIgdG8gdGVzdC5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBudW1iZXJzIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFscyAoYSwgYikge1xuICByZXR1cm4gTWF0aC5hYnMoYSAtIGIpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEpLCBNYXRoLmFicyhiKSlcbn1cbmlmICghTWF0aC5oeXBvdCkge1xuIE1hdGguaHlwb3QgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCB5ID0gMFxuICAgICAgbGV0IGkgPSBhcmd1bWVudHMubGVuZ3RoXG5cbiAgd2hpbGUgKGktLSkge1xuICAgIHkgKz0gYXJndW1lbnRzW2ldICogYXJndW1lbnRzW2ldXG4gIH1cblxuICByZXR1cm4gTWF0aC5zcXJ0KHkpXG59XG59XG4iLCJpbXBvcnQgKiBhcyBnbE1hdHJpeCBmcm9tICcuL2NvbW1vbi5qcydcbi8qKlxuICogNHg0IE1hdHJpeDxicj5Gb3JtYXQ6IGNvbHVtbi1tYWpvciwgd2hlbiB0eXBlZCBvdXQgaXQgbG9va3MgbGlrZSByb3ctbWFqb3I8YnI+VGhlIG1hdHJpY2VzIGFyZSBiZWluZyBwb3N0IG11bHRpcGxpZWQuXG4gKiBAbW9kdWxlIG1hdDRcbiAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgbWF0NFxuICpcbiAqIEByZXR1cm5zIHttYXQ0fSBhIG5ldyA0eDQgbWF0cml4XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSAoKSB7XG4gIGNvbnN0IG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDE2KVxuXG4gIGlmIChnbE1hdHJpeC5BUlJBWV9UWVBFICE9IEZsb2F0MzJBcnJheSkge1xuICAgIG91dFsxXSA9IDBcbiAgICBvdXRbMl0gPSAwXG4gICAgb3V0WzNdID0gMFxuICAgIG91dFs0XSA9IDBcbiAgICBvdXRbNl0gPSAwXG4gICAgb3V0WzddID0gMFxuICAgIG91dFs4XSA9IDBcbiAgICBvdXRbOV0gPSAwXG4gICAgb3V0WzExXSA9IDBcbiAgICBvdXRbMTJdID0gMFxuICAgIG91dFsxM10gPSAwXG4gICAgb3V0WzE0XSA9IDBcbiAgfVxuXG4gIG91dFswXSA9IDFcbiAgb3V0WzVdID0gMVxuICBvdXRbMTBdID0gMVxuICBvdXRbMTVdID0gMVxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbWF0NCBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIG1hdHJpeCB0byBjbG9uZVxuICogQHJldHVybnMge21hdDR9IGEgbmV3IDR4NCBtYXRyaXhcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gY2xvbmUgKGEpIHtcbiAgY29uc3Qgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoMTYpXG4gIG91dFswXSA9IGFbMF1cbiAgb3V0WzFdID0gYVsxXVxuICBvdXRbMl0gPSBhWzJdXG4gIG91dFszXSA9IGFbM11cbiAgb3V0WzRdID0gYVs0XVxuICBvdXRbNV0gPSBhWzVdXG4gIG91dFs2XSA9IGFbNl1cbiAgb3V0WzddID0gYVs3XVxuICBvdXRbOF0gPSBhWzhdXG4gIG91dFs5XSA9IGFbOV1cbiAgb3V0WzEwXSA9IGFbMTBdXG4gIG91dFsxMV0gPSBhWzExXVxuICBvdXRbMTJdID0gYVsxMl1cbiAgb3V0WzEzXSA9IGFbMTNdXG4gIG91dFsxNF0gPSBhWzE0XVxuICBvdXRbMTVdID0gYVsxNV1cbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgbWF0NCB0byBhbm90aGVyXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHkgKG91dCwgYSkge1xuICBvdXRbMF0gPSBhWzBdXG4gIG91dFsxXSA9IGFbMV1cbiAgb3V0WzJdID0gYVsyXVxuICBvdXRbM10gPSBhWzNdXG4gIG91dFs0XSA9IGFbNF1cbiAgb3V0WzVdID0gYVs1XVxuICBvdXRbNl0gPSBhWzZdXG4gIG91dFs3XSA9IGFbN11cbiAgb3V0WzhdID0gYVs4XVxuICBvdXRbOV0gPSBhWzldXG4gIG91dFsxMF0gPSBhWzEwXVxuICBvdXRbMTFdID0gYVsxMV1cbiAgb3V0WzEyXSA9IGFbMTJdXG4gIG91dFsxM10gPSBhWzEzXVxuICBvdXRbMTRdID0gYVsxNF1cbiAgb3V0WzE1XSA9IGFbMTVdXG4gIHJldHVybiBvdXRcbn1cbi8qKlxuICogQ3JlYXRlIGEgbmV3IG1hdDQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVzXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG0wMCBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAwIHBvc2l0aW9uIChpbmRleCAwKVxuICogQHBhcmFtIHtOdW1iZXJ9IG0wMSBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAxIHBvc2l0aW9uIChpbmRleCAxKVxuICogQHBhcmFtIHtOdW1iZXJ9IG0wMiBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAyKVxuICogQHBhcmFtIHtOdW1iZXJ9IG0wMyBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAzIHBvc2l0aW9uIChpbmRleCAzKVxuICogQHBhcmFtIHtOdW1iZXJ9IG0xMCBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAwIHBvc2l0aW9uIChpbmRleCA0KVxuICogQHBhcmFtIHtOdW1iZXJ9IG0xMSBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAxIHBvc2l0aW9uIChpbmRleCA1KVxuICogQHBhcmFtIHtOdW1iZXJ9IG0xMiBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAyIHBvc2l0aW9uIChpbmRleCA2KVxuICogQHBhcmFtIHtOdW1iZXJ9IG0xMyBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAzIHBvc2l0aW9uIChpbmRleCA3KVxuICogQHBhcmFtIHtOdW1iZXJ9IG0yMCBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAwIHBvc2l0aW9uIChpbmRleCA4KVxuICogQHBhcmFtIHtOdW1iZXJ9IG0yMSBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAxIHBvc2l0aW9uIChpbmRleCA5KVxuICogQHBhcmFtIHtOdW1iZXJ9IG0yMiBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAxMClcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMjMgQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggMTEpXG4gKiBAcGFyYW0ge051bWJlcn0gbTMwIENvbXBvbmVudCBpbiBjb2x1bW4gMywgcm93IDAgcG9zaXRpb24gKGluZGV4IDEyKVxuICogQHBhcmFtIHtOdW1iZXJ9IG0zMSBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAxIHBvc2l0aW9uIChpbmRleCAxMylcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMzIgQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggMTQpXG4gKiBAcGFyYW0ge051bWJlcn0gbTMzIENvbXBvbmVudCBpbiBjb2x1bW4gMywgcm93IDMgcG9zaXRpb24gKGluZGV4IDE1KVxuICogQHJldHVybnMge21hdDR9IEEgbmV3IG1hdDRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbVZhbHVlcyAobTAwLCBtMDEsIG0wMiwgbTAzLCBtMTAsIG0xMSwgbTEyLCBtMTMsIG0yMCwgbTIxLCBtMjIsIG0yMywgbTMwLCBtMzEsIG0zMiwgbTMzKSB7XG4gIGNvbnN0IG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDE2KVxuICBvdXRbMF0gPSBtMDBcbiAgb3V0WzFdID0gbTAxXG4gIG91dFsyXSA9IG0wMlxuICBvdXRbM10gPSBtMDNcbiAgb3V0WzRdID0gbTEwXG4gIG91dFs1XSA9IG0xMVxuICBvdXRbNl0gPSBtMTJcbiAgb3V0WzddID0gbTEzXG4gIG91dFs4XSA9IG0yMFxuICBvdXRbOV0gPSBtMjFcbiAgb3V0WzEwXSA9IG0yMlxuICBvdXRbMTFdID0gbTIzXG4gIG91dFsxMl0gPSBtMzBcbiAgb3V0WzEzXSA9IG0zMVxuICBvdXRbMTRdID0gbTMyXG4gIG91dFsxNV0gPSBtMzNcbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBtYXQ0IHRvIHRoZSBnaXZlbiB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHtOdW1iZXJ9IG0wMCBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAwIHBvc2l0aW9uIChpbmRleCAwKVxuICogQHBhcmFtIHtOdW1iZXJ9IG0wMSBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAxIHBvc2l0aW9uIChpbmRleCAxKVxuICogQHBhcmFtIHtOdW1iZXJ9IG0wMiBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAyKVxuICogQHBhcmFtIHtOdW1iZXJ9IG0wMyBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAzIHBvc2l0aW9uIChpbmRleCAzKVxuICogQHBhcmFtIHtOdW1iZXJ9IG0xMCBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAwIHBvc2l0aW9uIChpbmRleCA0KVxuICogQHBhcmFtIHtOdW1iZXJ9IG0xMSBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAxIHBvc2l0aW9uIChpbmRleCA1KVxuICogQHBhcmFtIHtOdW1iZXJ9IG0xMiBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAyIHBvc2l0aW9uIChpbmRleCA2KVxuICogQHBhcmFtIHtOdW1iZXJ9IG0xMyBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAzIHBvc2l0aW9uIChpbmRleCA3KVxuICogQHBhcmFtIHtOdW1iZXJ9IG0yMCBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAwIHBvc2l0aW9uIChpbmRleCA4KVxuICogQHBhcmFtIHtOdW1iZXJ9IG0yMSBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAxIHBvc2l0aW9uIChpbmRleCA5KVxuICogQHBhcmFtIHtOdW1iZXJ9IG0yMiBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAxMClcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMjMgQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggMTEpXG4gKiBAcGFyYW0ge051bWJlcn0gbTMwIENvbXBvbmVudCBpbiBjb2x1bW4gMywgcm93IDAgcG9zaXRpb24gKGluZGV4IDEyKVxuICogQHBhcmFtIHtOdW1iZXJ9IG0zMSBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAxIHBvc2l0aW9uIChpbmRleCAxMylcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMzIgQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggMTQpXG4gKiBAcGFyYW0ge051bWJlcn0gbTMzIENvbXBvbmVudCBpbiBjb2x1bW4gMywgcm93IDMgcG9zaXRpb24gKGluZGV4IDE1KVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXQgKG91dCwgbTAwLCBtMDEsIG0wMiwgbTAzLCBtMTAsIG0xMSwgbTEyLCBtMTMsIG0yMCwgbTIxLCBtMjIsIG0yMywgbTMwLCBtMzEsIG0zMiwgbTMzKSB7XG4gIG91dFswXSA9IG0wMFxuICBvdXRbMV0gPSBtMDFcbiAgb3V0WzJdID0gbTAyXG4gIG91dFszXSA9IG0wM1xuICBvdXRbNF0gPSBtMTBcbiAgb3V0WzVdID0gbTExXG4gIG91dFs2XSA9IG0xMlxuICBvdXRbN10gPSBtMTNcbiAgb3V0WzhdID0gbTIwXG4gIG91dFs5XSA9IG0yMVxuICBvdXRbMTBdID0gbTIyXG4gIG91dFsxMV0gPSBtMjNcbiAgb3V0WzEyXSA9IG0zMFxuICBvdXRbMTNdID0gbTMxXG4gIG91dFsxNF0gPSBtMzJcbiAgb3V0WzE1XSA9IG0zM1xuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIFNldCBhIG1hdDQgdG8gdGhlIGlkZW50aXR5IG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlkZW50aXR5IChvdXQpIHtcbiAgb3V0WzBdID0gMVxuICBvdXRbMV0gPSAwXG4gIG91dFsyXSA9IDBcbiAgb3V0WzNdID0gMFxuICBvdXRbNF0gPSAwXG4gIG91dFs1XSA9IDFcbiAgb3V0WzZdID0gMFxuICBvdXRbN10gPSAwXG4gIG91dFs4XSA9IDBcbiAgb3V0WzldID0gMFxuICBvdXRbMTBdID0gMVxuICBvdXRbMTFdID0gMFxuICBvdXRbMTJdID0gMFxuICBvdXRbMTNdID0gMFxuICBvdXRbMTRdID0gMFxuICBvdXRbMTVdID0gMVxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIFRyYW5zcG9zZSB0aGUgdmFsdWVzIG9mIGEgbWF0NFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc3Bvc2UgKG91dCwgYSkge1xuICAvLyBJZiB3ZSBhcmUgdHJhbnNwb3Npbmcgb3Vyc2VsdmVzIHdlIGNhbiBza2lwIGEgZmV3IHN0ZXBzIGJ1dCBoYXZlIHRvIGNhY2hlIHNvbWUgdmFsdWVzXG4gIGlmIChvdXQgPT09IGEpIHtcbiAgICBjb25zdCBhMDEgPSBhWzFdXG4gICAgICAgIGNvbnN0IGEwMiA9IGFbMl1cbiAgICAgICAgY29uc3QgYTAzID0gYVszXVxuICAgIGNvbnN0IGExMiA9IGFbNl1cbiAgICAgICAgY29uc3QgYTEzID0gYVs3XVxuICAgIGNvbnN0IGEyMyA9IGFbMTFdXG4gICAgb3V0WzFdID0gYVs0XVxuICAgIG91dFsyXSA9IGFbOF1cbiAgICBvdXRbM10gPSBhWzEyXVxuICAgIG91dFs0XSA9IGEwMVxuICAgIG91dFs2XSA9IGFbOV1cbiAgICBvdXRbN10gPSBhWzEzXVxuICAgIG91dFs4XSA9IGEwMlxuICAgIG91dFs5XSA9IGExMlxuICAgIG91dFsxMV0gPSBhWzE0XVxuICAgIG91dFsxMl0gPSBhMDNcbiAgICBvdXRbMTNdID0gYTEzXG4gICAgb3V0WzE0XSA9IGEyM1xuICB9IGVsc2Uge1xuICAgIG91dFswXSA9IGFbMF1cbiAgICBvdXRbMV0gPSBhWzRdXG4gICAgb3V0WzJdID0gYVs4XVxuICAgIG91dFszXSA9IGFbMTJdXG4gICAgb3V0WzRdID0gYVsxXVxuICAgIG91dFs1XSA9IGFbNV1cbiAgICBvdXRbNl0gPSBhWzldXG4gICAgb3V0WzddID0gYVsxM11cbiAgICBvdXRbOF0gPSBhWzJdXG4gICAgb3V0WzldID0gYVs2XVxuICAgIG91dFsxMF0gPSBhWzEwXVxuICAgIG91dFsxMV0gPSBhWzE0XVxuICAgIG91dFsxMl0gPSBhWzNdXG4gICAgb3V0WzEzXSA9IGFbN11cbiAgICBvdXRbMTRdID0gYVsxMV1cbiAgICBvdXRbMTVdID0gYVsxNV1cbiAgfVxuXG4gIHJldHVybiBvdXRcbn1cbi8qKlxuICogSW52ZXJ0cyBhIG1hdDRcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJ0IChvdXQsIGEpIHtcbiAgY29uc3QgYTAwID0gYVswXVxuICAgICAgY29uc3QgYTAxID0gYVsxXVxuICAgICAgY29uc3QgYTAyID0gYVsyXVxuICAgICAgY29uc3QgYTAzID0gYVszXVxuICBjb25zdCBhMTAgPSBhWzRdXG4gICAgICBjb25zdCBhMTEgPSBhWzVdXG4gICAgICBjb25zdCBhMTIgPSBhWzZdXG4gICAgICBjb25zdCBhMTMgPSBhWzddXG4gIGNvbnN0IGEyMCA9IGFbOF1cbiAgICAgIGNvbnN0IGEyMSA9IGFbOV1cbiAgICAgIGNvbnN0IGEyMiA9IGFbMTBdXG4gICAgICBjb25zdCBhMjMgPSBhWzExXVxuICBjb25zdCBhMzAgPSBhWzEyXVxuICAgICAgY29uc3QgYTMxID0gYVsxM11cbiAgICAgIGNvbnN0IGEzMiA9IGFbMTRdXG4gICAgICBjb25zdCBhMzMgPSBhWzE1XVxuICBjb25zdCBiMDAgPSBhMDAgKiBhMTEgLSBhMDEgKiBhMTBcbiAgY29uc3QgYjAxID0gYTAwICogYTEyIC0gYTAyICogYTEwXG4gIGNvbnN0IGIwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMFxuICBjb25zdCBiMDMgPSBhMDEgKiBhMTIgLSBhMDIgKiBhMTFcbiAgY29uc3QgYjA0ID0gYTAxICogYTEzIC0gYTAzICogYTExXG4gIGNvbnN0IGIwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMlxuICBjb25zdCBiMDYgPSBhMjAgKiBhMzEgLSBhMjEgKiBhMzBcbiAgY29uc3QgYjA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwXG4gIGNvbnN0IGIwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMFxuICBjb25zdCBiMDkgPSBhMjEgKiBhMzIgLSBhMjIgKiBhMzFcbiAgY29uc3QgYjEwID0gYTIxICogYTMzIC0gYTIzICogYTMxXG4gIGNvbnN0IGIxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMiAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XG5cbiAgbGV0IGRldCA9IGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNlxuXG4gIGlmICghZGV0KSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGRldCA9IDEuMCAvIGRldFxuICBvdXRbMF0gPSAoYTExICogYjExIC0gYTEyICogYjEwICsgYTEzICogYjA5KSAqIGRldFxuICBvdXRbMV0gPSAoYTAyICogYjEwIC0gYTAxICogYjExIC0gYTAzICogYjA5KSAqIGRldFxuICBvdXRbMl0gPSAoYTMxICogYjA1IC0gYTMyICogYjA0ICsgYTMzICogYjAzKSAqIGRldFxuICBvdXRbM10gPSAoYTIyICogYjA0IC0gYTIxICogYjA1IC0gYTIzICogYjAzKSAqIGRldFxuICBvdXRbNF0gPSAoYTEyICogYjA4IC0gYTEwICogYjExIC0gYTEzICogYjA3KSAqIGRldFxuICBvdXRbNV0gPSAoYTAwICogYjExIC0gYTAyICogYjA4ICsgYTAzICogYjA3KSAqIGRldFxuICBvdXRbNl0gPSAoYTMyICogYjAyIC0gYTMwICogYjA1IC0gYTMzICogYjAxKSAqIGRldFxuICBvdXRbN10gPSAoYTIwICogYjA1IC0gYTIyICogYjAyICsgYTIzICogYjAxKSAqIGRldFxuICBvdXRbOF0gPSAoYTEwICogYjEwIC0gYTExICogYjA4ICsgYTEzICogYjA2KSAqIGRldFxuICBvdXRbOV0gPSAoYTAxICogYjA4IC0gYTAwICogYjEwIC0gYTAzICogYjA2KSAqIGRldFxuICBvdXRbMTBdID0gKGEzMCAqIGIwNCAtIGEzMSAqIGIwMiArIGEzMyAqIGIwMCkgKiBkZXRcbiAgb3V0WzExXSA9IChhMjEgKiBiMDIgLSBhMjAgKiBiMDQgLSBhMjMgKiBiMDApICogZGV0XG4gIG91dFsxMl0gPSAoYTExICogYjA3IC0gYTEwICogYjA5IC0gYTEyICogYjA2KSAqIGRldFxuICBvdXRbMTNdID0gKGEwMCAqIGIwOSAtIGEwMSAqIGIwNyArIGEwMiAqIGIwNikgKiBkZXRcbiAgb3V0WzE0XSA9IChhMzEgKiBiMDEgLSBhMzAgKiBiMDMgLSBhMzIgKiBiMDApICogZGV0XG4gIG91dFsxNV0gPSAoYTIwICogYjAzIC0gYTIxICogYjAxICsgYTIyICogYjAwKSAqIGRldFxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGFkanVnYXRlIG9mIGEgbWF0NFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGpvaW50IChvdXQsIGEpIHtcbiAgY29uc3QgYTAwID0gYVswXVxuICAgICAgY29uc3QgYTAxID0gYVsxXVxuICAgICAgY29uc3QgYTAyID0gYVsyXVxuICAgICAgY29uc3QgYTAzID0gYVszXVxuICBjb25zdCBhMTAgPSBhWzRdXG4gICAgICBjb25zdCBhMTEgPSBhWzVdXG4gICAgICBjb25zdCBhMTIgPSBhWzZdXG4gICAgICBjb25zdCBhMTMgPSBhWzddXG4gIGNvbnN0IGEyMCA9IGFbOF1cbiAgICAgIGNvbnN0IGEyMSA9IGFbOV1cbiAgICAgIGNvbnN0IGEyMiA9IGFbMTBdXG4gICAgICBjb25zdCBhMjMgPSBhWzExXVxuICBjb25zdCBhMzAgPSBhWzEyXVxuICAgICAgY29uc3QgYTMxID0gYVsxM11cbiAgICAgIGNvbnN0IGEzMiA9IGFbMTRdXG4gICAgICBjb25zdCBhMzMgPSBhWzE1XVxuICBjb25zdCBiMDAgPSBhMDAgKiBhMTEgLSBhMDEgKiBhMTBcbiAgY29uc3QgYjAxID0gYTAwICogYTEyIC0gYTAyICogYTEwXG4gIGNvbnN0IGIwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMFxuICBjb25zdCBiMDMgPSBhMDEgKiBhMTIgLSBhMDIgKiBhMTFcbiAgY29uc3QgYjA0ID0gYTAxICogYTEzIC0gYTAzICogYTExXG4gIGNvbnN0IGIwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMlxuICBjb25zdCBiMDYgPSBhMjAgKiBhMzEgLSBhMjEgKiBhMzBcbiAgY29uc3QgYjA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwXG4gIGNvbnN0IGIwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMFxuICBjb25zdCBiMDkgPSBhMjEgKiBhMzIgLSBhMjIgKiBhMzFcbiAgY29uc3QgYjEwID0gYTIxICogYTMzIC0gYTIzICogYTMxXG4gIGNvbnN0IGIxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMlxuICBvdXRbMF0gPSBhMTEgKiBiMTEgLSBhMTIgKiBiMTAgKyBhMTMgKiBiMDlcbiAgb3V0WzFdID0gYTAyICogYjEwIC0gYTAxICogYjExIC0gYTAzICogYjA5XG4gIG91dFsyXSA9IGEzMSAqIGIwNSAtIGEzMiAqIGIwNCArIGEzMyAqIGIwM1xuICBvdXRbM10gPSBhMjIgKiBiMDQgLSBhMjEgKiBiMDUgLSBhMjMgKiBiMDNcbiAgb3V0WzRdID0gYTEyICogYjA4IC0gYTEwICogYjExIC0gYTEzICogYjA3XG4gIG91dFs1XSA9IGEwMCAqIGIxMSAtIGEwMiAqIGIwOCArIGEwMyAqIGIwN1xuICBvdXRbNl0gPSBhMzIgKiBiMDIgLSBhMzAgKiBiMDUgLSBhMzMgKiBiMDFcbiAgb3V0WzddID0gYTIwICogYjA1IC0gYTIyICogYjAyICsgYTIzICogYjAxXG4gIG91dFs4XSA9IGExMCAqIGIxMCAtIGExMSAqIGIwOCArIGExMyAqIGIwNlxuICBvdXRbOV0gPSBhMDEgKiBiMDggLSBhMDAgKiBiMTAgLSBhMDMgKiBiMDZcbiAgb3V0WzEwXSA9IGEzMCAqIGIwNCAtIGEzMSAqIGIwMiArIGEzMyAqIGIwMFxuICBvdXRbMTFdID0gYTIxICogYjAyIC0gYTIwICogYjA0IC0gYTIzICogYjAwXG4gIG91dFsxMl0gPSBhMTEgKiBiMDcgLSBhMTAgKiBiMDkgLSBhMTIgKiBiMDZcbiAgb3V0WzEzXSA9IGEwMCAqIGIwOSAtIGEwMSAqIGIwNyArIGEwMiAqIGIwNlxuICBvdXRbMTRdID0gYTMxICogYjAxIC0gYTMwICogYjAzIC0gYTMyICogYjAwXG4gIG91dFsxNV0gPSBhMjAgKiBiMDMgLSBhMjEgKiBiMDEgKyBhMjIgKiBiMDBcbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkZXRlcm1pbmFudCBvZiBhIG1hdDRcbiAqXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge051bWJlcn0gZGV0ZXJtaW5hbnQgb2YgYVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmFudCAoYSkge1xuICBjb25zdCBhMDAgPSBhWzBdXG4gICAgICBjb25zdCBhMDEgPSBhWzFdXG4gICAgICBjb25zdCBhMDIgPSBhWzJdXG4gICAgICBjb25zdCBhMDMgPSBhWzNdXG4gIGNvbnN0IGExMCA9IGFbNF1cbiAgICAgIGNvbnN0IGExMSA9IGFbNV1cbiAgICAgIGNvbnN0IGExMiA9IGFbNl1cbiAgICAgIGNvbnN0IGExMyA9IGFbN11cbiAgY29uc3QgYTIwID0gYVs4XVxuICAgICAgY29uc3QgYTIxID0gYVs5XVxuICAgICAgY29uc3QgYTIyID0gYVsxMF1cbiAgICAgIGNvbnN0IGEyMyA9IGFbMTFdXG4gIGNvbnN0IGEzMCA9IGFbMTJdXG4gICAgICBjb25zdCBhMzEgPSBhWzEzXVxuICAgICAgY29uc3QgYTMyID0gYVsxNF1cbiAgICAgIGNvbnN0IGEzMyA9IGFbMTVdXG4gIGNvbnN0IGIwID0gYTAwICogYTExIC0gYTAxICogYTEwXG4gIGNvbnN0IGIxID0gYTAwICogYTEyIC0gYTAyICogYTEwXG4gIGNvbnN0IGIyID0gYTAxICogYTEyIC0gYTAyICogYTExXG4gIGNvbnN0IGIzID0gYTIwICogYTMxIC0gYTIxICogYTMwXG4gIGNvbnN0IGI0ID0gYTIwICogYTMyIC0gYTIyICogYTMwXG4gIGNvbnN0IGI1ID0gYTIxICogYTMyIC0gYTIyICogYTMxXG4gIGNvbnN0IGI2ID0gYTAwICogYjUgLSBhMDEgKiBiNCArIGEwMiAqIGIzXG4gIGNvbnN0IGI3ID0gYTEwICogYjUgLSBhMTEgKiBiNCArIGExMiAqIGIzXG4gIGNvbnN0IGI4ID0gYTIwICogYjIgLSBhMjEgKiBiMSArIGEyMiAqIGIwXG4gIGNvbnN0IGI5ID0gYTMwICogYjIgLSBhMzEgKiBiMSArIGEzMiAqIGIwIC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcblxuICByZXR1cm4gYTEzICogYjYgLSBhMDMgKiBiNyArIGEzMyAqIGI4IC0gYTIzICogYjlcbn1cbi8qKlxuICogTXVsdGlwbGllcyB0d28gbWF0NHNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBtdWx0aXBseSAob3V0LCBhLCBiKSB7XG4gIGNvbnN0IGEwMCA9IGFbMF1cbiAgICAgIGNvbnN0IGEwMSA9IGFbMV1cbiAgICAgIGNvbnN0IGEwMiA9IGFbMl1cbiAgICAgIGNvbnN0IGEwMyA9IGFbM11cbiAgY29uc3QgYTEwID0gYVs0XVxuICAgICAgY29uc3QgYTExID0gYVs1XVxuICAgICAgY29uc3QgYTEyID0gYVs2XVxuICAgICAgY29uc3QgYTEzID0gYVs3XVxuICBjb25zdCBhMjAgPSBhWzhdXG4gICAgICBjb25zdCBhMjEgPSBhWzldXG4gICAgICBjb25zdCBhMjIgPSBhWzEwXVxuICAgICAgY29uc3QgYTIzID0gYVsxMV1cbiAgY29uc3QgYTMwID0gYVsxMl1cbiAgICAgIGNvbnN0IGEzMSA9IGFbMTNdXG4gICAgICBjb25zdCBhMzIgPSBhWzE0XVxuICAgICAgY29uc3QgYTMzID0gYVsxNV0gLy8gQ2FjaGUgb25seSB0aGUgY3VycmVudCBsaW5lIG9mIHRoZSBzZWNvbmQgbWF0cml4XG5cbiAgbGV0IGIwID0gYlswXVxuICAgICAgbGV0IGIxID0gYlsxXVxuICAgICAgbGV0IGIyID0gYlsyXVxuICAgICAgbGV0IGIzID0gYlszXVxuICBvdXRbMF0gPSBiMCAqIGEwMCArIGIxICogYTEwICsgYjIgKiBhMjAgKyBiMyAqIGEzMFxuICBvdXRbMV0gPSBiMCAqIGEwMSArIGIxICogYTExICsgYjIgKiBhMjEgKyBiMyAqIGEzMVxuICBvdXRbMl0gPSBiMCAqIGEwMiArIGIxICogYTEyICsgYjIgKiBhMjIgKyBiMyAqIGEzMlxuICBvdXRbM10gPSBiMCAqIGEwMyArIGIxICogYTEzICsgYjIgKiBhMjMgKyBiMyAqIGEzM1xuICBiMCA9IGJbNF1cbiAgYjEgPSBiWzVdXG4gIGIyID0gYls2XVxuICBiMyA9IGJbN11cbiAgb3V0WzRdID0gYjAgKiBhMDAgKyBiMSAqIGExMCArIGIyICogYTIwICsgYjMgKiBhMzBcbiAgb3V0WzVdID0gYjAgKiBhMDEgKyBiMSAqIGExMSArIGIyICogYTIxICsgYjMgKiBhMzFcbiAgb3V0WzZdID0gYjAgKiBhMDIgKyBiMSAqIGExMiArIGIyICogYTIyICsgYjMgKiBhMzJcbiAgb3V0WzddID0gYjAgKiBhMDMgKyBiMSAqIGExMyArIGIyICogYTIzICsgYjMgKiBhMzNcbiAgYjAgPSBiWzhdXG4gIGIxID0gYls5XVxuICBiMiA9IGJbMTBdXG4gIGIzID0gYlsxMV1cbiAgb3V0WzhdID0gYjAgKiBhMDAgKyBiMSAqIGExMCArIGIyICogYTIwICsgYjMgKiBhMzBcbiAgb3V0WzldID0gYjAgKiBhMDEgKyBiMSAqIGExMSArIGIyICogYTIxICsgYjMgKiBhMzFcbiAgb3V0WzEwXSA9IGIwICogYTAyICsgYjEgKiBhMTIgKyBiMiAqIGEyMiArIGIzICogYTMyXG4gIG91dFsxMV0gPSBiMCAqIGEwMyArIGIxICogYTEzICsgYjIgKiBhMjMgKyBiMyAqIGEzM1xuICBiMCA9IGJbMTJdXG4gIGIxID0gYlsxM11cbiAgYjIgPSBiWzE0XVxuICBiMyA9IGJbMTVdXG4gIG91dFsxMl0gPSBiMCAqIGEwMCArIGIxICogYTEwICsgYjIgKiBhMjAgKyBiMyAqIGEzMFxuICBvdXRbMTNdID0gYjAgKiBhMDEgKyBiMSAqIGExMSArIGIyICogYTIxICsgYjMgKiBhMzFcbiAgb3V0WzE0XSA9IGIwICogYTAyICsgYjEgKiBhMTIgKyBiMiAqIGEyMiArIGIzICogYTMyXG4gIG91dFsxNV0gPSBiMCAqIGEwMyArIGIxICogYTEzICsgYjIgKiBhMjMgKyBiMyAqIGEzM1xuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIFRyYW5zbGF0ZSBhIG1hdDQgYnkgdGhlIGdpdmVuIHZlY3RvclxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgbWF0cml4IHRvIHRyYW5zbGF0ZVxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IHYgdmVjdG9yIHRvIHRyYW5zbGF0ZSBieVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGUgKG91dCwgYSwgdikge1xuICBjb25zdCB4ID0gdlswXVxuICAgICAgY29uc3QgeSA9IHZbMV1cbiAgICAgIGNvbnN0IHogPSB2WzJdXG4gIGxldCBhMDAsIGEwMSwgYTAyLCBhMDNcbiAgbGV0IGExMCwgYTExLCBhMTIsIGExM1xuICBsZXQgYTIwLCBhMjEsIGEyMiwgYTIzXG5cbiAgaWYgKGEgPT09IG91dCkge1xuICAgIG91dFsxMl0gPSBhWzBdICogeCArIGFbNF0gKiB5ICsgYVs4XSAqIHogKyBhWzEyXVxuICAgIG91dFsxM10gPSBhWzFdICogeCArIGFbNV0gKiB5ICsgYVs5XSAqIHogKyBhWzEzXVxuICAgIG91dFsxNF0gPSBhWzJdICogeCArIGFbNl0gKiB5ICsgYVsxMF0gKiB6ICsgYVsxNF1cbiAgICBvdXRbMTVdID0gYVszXSAqIHggKyBhWzddICogeSArIGFbMTFdICogeiArIGFbMTVdXG4gIH0gZWxzZSB7XG4gICAgYTAwID0gYVswXVxuICAgIGEwMSA9IGFbMV1cbiAgICBhMDIgPSBhWzJdXG4gICAgYTAzID0gYVszXVxuICAgIGExMCA9IGFbNF1cbiAgICBhMTEgPSBhWzVdXG4gICAgYTEyID0gYVs2XVxuICAgIGExMyA9IGFbN11cbiAgICBhMjAgPSBhWzhdXG4gICAgYTIxID0gYVs5XVxuICAgIGEyMiA9IGFbMTBdXG4gICAgYTIzID0gYVsxMV1cbiAgICBvdXRbMF0gPSBhMDBcbiAgICBvdXRbMV0gPSBhMDFcbiAgICBvdXRbMl0gPSBhMDJcbiAgICBvdXRbM10gPSBhMDNcbiAgICBvdXRbNF0gPSBhMTBcbiAgICBvdXRbNV0gPSBhMTFcbiAgICBvdXRbNl0gPSBhMTJcbiAgICBvdXRbN10gPSBhMTNcbiAgICBvdXRbOF0gPSBhMjBcbiAgICBvdXRbOV0gPSBhMjFcbiAgICBvdXRbMTBdID0gYTIyXG4gICAgb3V0WzExXSA9IGEyM1xuICAgIG91dFsxMl0gPSBhMDAgKiB4ICsgYTEwICogeSArIGEyMCAqIHogKyBhWzEyXVxuICAgIG91dFsxM10gPSBhMDEgKiB4ICsgYTExICogeSArIGEyMSAqIHogKyBhWzEzXVxuICAgIG91dFsxNF0gPSBhMDIgKiB4ICsgYTEyICogeSArIGEyMiAqIHogKyBhWzE0XVxuICAgIG91dFsxNV0gPSBhMDMgKiB4ICsgYTEzICogeSArIGEyMyAqIHogKyBhWzE1XVxuICB9XG5cbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBTY2FsZXMgdGhlIG1hdDQgYnkgdGhlIGRpbWVuc2lvbnMgaW4gdGhlIGdpdmVuIHZlYzMgbm90IHVzaW5nIHZlY3Rvcml6YXRpb25cbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGEgdGhlIG1hdHJpeCB0byBzY2FsZVxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IHYgdGhlIHZlYzMgdG8gc2NhbGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDR9IG91dFxuICoqL1xuXG5leHBvcnQgZnVuY3Rpb24gc2NhbGUgKG91dCwgYSwgdikge1xuICBjb25zdCB4ID0gdlswXVxuICAgICAgY29uc3QgeSA9IHZbMV1cbiAgICAgIGNvbnN0IHogPSB2WzJdXG4gIG91dFswXSA9IGFbMF0gKiB4XG4gIG91dFsxXSA9IGFbMV0gKiB4XG4gIG91dFsyXSA9IGFbMl0gKiB4XG4gIG91dFszXSA9IGFbM10gKiB4XG4gIG91dFs0XSA9IGFbNF0gKiB5XG4gIG91dFs1XSA9IGFbNV0gKiB5XG4gIG91dFs2XSA9IGFbNl0gKiB5XG4gIG91dFs3XSA9IGFbN10gKiB5XG4gIG91dFs4XSA9IGFbOF0gKiB6XG4gIG91dFs5XSA9IGFbOV0gKiB6XG4gIG91dFsxMF0gPSBhWzEwXSAqIHpcbiAgb3V0WzExXSA9IGFbMTFdICogelxuICBvdXRbMTJdID0gYVsxMl1cbiAgb3V0WzEzXSA9IGFbMTNdXG4gIG91dFsxNF0gPSBhWzE0XVxuICBvdXRbMTVdID0gYVsxNV1cbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBSb3RhdGVzIGEgbWF0NCBieSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBnaXZlbiBheGlzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IGF4aXMgdGhlIGF4aXMgdG8gcm90YXRlIGFyb3VuZFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiByb3RhdGUgKG91dCwgYSwgcmFkLCBheGlzKSB7XG4gIGxldCB4ID0gYXhpc1swXVxuICAgICAgbGV0IHkgPSBheGlzWzFdXG4gICAgICBsZXQgeiA9IGF4aXNbMl1cbiAgbGV0IGxlbiA9IE1hdGguaHlwb3QoeCwgeSwgeilcbiAgbGV0IHMsIGMsIHRcbiAgbGV0IGEwMCwgYTAxLCBhMDIsIGEwM1xuICBsZXQgYTEwLCBhMTEsIGExMiwgYTEzXG4gIGxldCBhMjAsIGEyMSwgYTIyLCBhMjNcbiAgbGV0IGIwMCwgYjAxLCBiMDJcbiAgbGV0IGIxMCwgYjExLCBiMTJcbiAgbGV0IGIyMCwgYjIxLCBiMjJcblxuICBpZiAobGVuIDwgZ2xNYXRyaXguRVBTSUxPTikge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBsZW4gPSAxIC8gbGVuXG4gIHggKj0gbGVuXG4gIHkgKj0gbGVuXG4gIHogKj0gbGVuXG4gIHMgPSBNYXRoLnNpbihyYWQpXG4gIGMgPSBNYXRoLmNvcyhyYWQpXG4gIHQgPSAxIC0gY1xuICBhMDAgPSBhWzBdXG4gIGEwMSA9IGFbMV1cbiAgYTAyID0gYVsyXVxuICBhMDMgPSBhWzNdXG4gIGExMCA9IGFbNF1cbiAgYTExID0gYVs1XVxuICBhMTIgPSBhWzZdXG4gIGExMyA9IGFbN11cbiAgYTIwID0gYVs4XVxuICBhMjEgPSBhWzldXG4gIGEyMiA9IGFbMTBdXG4gIGEyMyA9IGFbMTFdIC8vIENvbnN0cnVjdCB0aGUgZWxlbWVudHMgb2YgdGhlIHJvdGF0aW9uIG1hdHJpeFxuXG4gIGIwMCA9IHggKiB4ICogdCArIGNcbiAgYjAxID0geSAqIHggKiB0ICsgeiAqIHNcbiAgYjAyID0geiAqIHggKiB0IC0geSAqIHNcbiAgYjEwID0geCAqIHkgKiB0IC0geiAqIHNcbiAgYjExID0geSAqIHkgKiB0ICsgY1xuICBiMTIgPSB6ICogeSAqIHQgKyB4ICogc1xuICBiMjAgPSB4ICogeiAqIHQgKyB5ICogc1xuICBiMjEgPSB5ICogeiAqIHQgLSB4ICogc1xuICBiMjIgPSB6ICogeiAqIHQgKyBjIC8vIFBlcmZvcm0gcm90YXRpb24tc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG5cbiAgb3V0WzBdID0gYTAwICogYjAwICsgYTEwICogYjAxICsgYTIwICogYjAyXG4gIG91dFsxXSA9IGEwMSAqIGIwMCArIGExMSAqIGIwMSArIGEyMSAqIGIwMlxuICBvdXRbMl0gPSBhMDIgKiBiMDAgKyBhMTIgKiBiMDEgKyBhMjIgKiBiMDJcbiAgb3V0WzNdID0gYTAzICogYjAwICsgYTEzICogYjAxICsgYTIzICogYjAyXG4gIG91dFs0XSA9IGEwMCAqIGIxMCArIGExMCAqIGIxMSArIGEyMCAqIGIxMlxuICBvdXRbNV0gPSBhMDEgKiBiMTAgKyBhMTEgKiBiMTEgKyBhMjEgKiBiMTJcbiAgb3V0WzZdID0gYTAyICogYjEwICsgYTEyICogYjExICsgYTIyICogYjEyXG4gIG91dFs3XSA9IGEwMyAqIGIxMCArIGExMyAqIGIxMSArIGEyMyAqIGIxMlxuICBvdXRbOF0gPSBhMDAgKiBiMjAgKyBhMTAgKiBiMjEgKyBhMjAgKiBiMjJcbiAgb3V0WzldID0gYTAxICogYjIwICsgYTExICogYjIxICsgYTIxICogYjIyXG4gIG91dFsxMF0gPSBhMDIgKiBiMjAgKyBhMTIgKiBiMjEgKyBhMjIgKiBiMjJcbiAgb3V0WzExXSA9IGEwMyAqIGIyMCArIGExMyAqIGIyMSArIGEyMyAqIGIyMlxuXG4gIGlmIChhICE9PSBvdXQpIHtcbiAgICAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCBsYXN0IHJvd1xuICAgIG91dFsxMl0gPSBhWzEyXVxuICAgIG91dFsxM10gPSBhWzEzXVxuICAgIG91dFsxNF0gPSBhWzE0XVxuICAgIG91dFsxNV0gPSBhWzE1XVxuICB9XG5cbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBSb3RhdGVzIGEgbWF0cml4IGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFggYXhpc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgbWF0cml4IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gcm90YXRlWCAob3V0LCBhLCByYWQpIHtcbiAgY29uc3QgcyA9IE1hdGguc2luKHJhZClcbiAgY29uc3QgYyA9IE1hdGguY29zKHJhZClcbiAgY29uc3QgYTEwID0gYVs0XVxuICBjb25zdCBhMTEgPSBhWzVdXG4gIGNvbnN0IGExMiA9IGFbNl1cbiAgY29uc3QgYTEzID0gYVs3XVxuICBjb25zdCBhMjAgPSBhWzhdXG4gIGNvbnN0IGEyMSA9IGFbOV1cbiAgY29uc3QgYTIyID0gYVsxMF1cbiAgY29uc3QgYTIzID0gYVsxMV1cblxuICBpZiAoYSAhPT0gb3V0KSB7XG4gICAgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgcm93c1xuICAgIG91dFswXSA9IGFbMF1cbiAgICBvdXRbMV0gPSBhWzFdXG4gICAgb3V0WzJdID0gYVsyXVxuICAgIG91dFszXSA9IGFbM11cbiAgICBvdXRbMTJdID0gYVsxMl1cbiAgICBvdXRbMTNdID0gYVsxM11cbiAgICBvdXRbMTRdID0gYVsxNF1cbiAgICBvdXRbMTVdID0gYVsxNV1cbiAgfSAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG5cbiAgb3V0WzRdID0gYTEwICogYyArIGEyMCAqIHNcbiAgb3V0WzVdID0gYTExICogYyArIGEyMSAqIHNcbiAgb3V0WzZdID0gYTEyICogYyArIGEyMiAqIHNcbiAgb3V0WzddID0gYTEzICogYyArIGEyMyAqIHNcbiAgb3V0WzhdID0gYTIwICogYyAtIGExMCAqIHNcbiAgb3V0WzldID0gYTIxICogYyAtIGExMSAqIHNcbiAgb3V0WzEwXSA9IGEyMiAqIGMgLSBhMTIgKiBzXG4gIG91dFsxMV0gPSBhMjMgKiBjIC0gYTEzICogc1xuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIFJvdGF0ZXMgYSBtYXRyaXggYnkgdGhlIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgWSBheGlzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiByb3RhdGVZIChvdXQsIGEsIHJhZCkge1xuICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKVxuICBjb25zdCBjID0gTWF0aC5jb3MocmFkKVxuICBjb25zdCBhMDAgPSBhWzBdXG4gIGNvbnN0IGEwMSA9IGFbMV1cbiAgY29uc3QgYTAyID0gYVsyXVxuICBjb25zdCBhMDMgPSBhWzNdXG4gIGNvbnN0IGEyMCA9IGFbOF1cbiAgY29uc3QgYTIxID0gYVs5XVxuICBjb25zdCBhMjIgPSBhWzEwXVxuICBjb25zdCBhMjMgPSBhWzExXVxuXG4gIGlmIChhICE9PSBvdXQpIHtcbiAgICAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCByb3dzXG4gICAgb3V0WzRdID0gYVs0XVxuICAgIG91dFs1XSA9IGFbNV1cbiAgICBvdXRbNl0gPSBhWzZdXG4gICAgb3V0WzddID0gYVs3XVxuICAgIG91dFsxMl0gPSBhWzEyXVxuICAgIG91dFsxM10gPSBhWzEzXVxuICAgIG91dFsxNF0gPSBhWzE0XVxuICAgIG91dFsxNV0gPSBhWzE1XVxuICB9IC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cblxuICBvdXRbMF0gPSBhMDAgKiBjIC0gYTIwICogc1xuICBvdXRbMV0gPSBhMDEgKiBjIC0gYTIxICogc1xuICBvdXRbMl0gPSBhMDIgKiBjIC0gYTIyICogc1xuICBvdXRbM10gPSBhMDMgKiBjIC0gYTIzICogc1xuICBvdXRbOF0gPSBhMDAgKiBzICsgYTIwICogY1xuICBvdXRbOV0gPSBhMDEgKiBzICsgYTIxICogY1xuICBvdXRbMTBdID0gYTAyICogcyArIGEyMiAqIGNcbiAgb3V0WzExXSA9IGEwMyAqIHMgKyBhMjMgKiBjXG4gIHJldHVybiBvdXRcbn1cbi8qKlxuICogUm90YXRlcyBhIG1hdHJpeCBieSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBaIGF4aXNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHJvdGF0ZVogKG91dCwgYSwgcmFkKSB7XG4gIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpXG4gIGNvbnN0IGMgPSBNYXRoLmNvcyhyYWQpXG4gIGNvbnN0IGEwMCA9IGFbMF1cbiAgY29uc3QgYTAxID0gYVsxXVxuICBjb25zdCBhMDIgPSBhWzJdXG4gIGNvbnN0IGEwMyA9IGFbM11cbiAgY29uc3QgYTEwID0gYVs0XVxuICBjb25zdCBhMTEgPSBhWzVdXG4gIGNvbnN0IGExMiA9IGFbNl1cbiAgY29uc3QgYTEzID0gYVs3XVxuXG4gIGlmIChhICE9PSBvdXQpIHtcbiAgICAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCBsYXN0IHJvd1xuICAgIG91dFs4XSA9IGFbOF1cbiAgICBvdXRbOV0gPSBhWzldXG4gICAgb3V0WzEwXSA9IGFbMTBdXG4gICAgb3V0WzExXSA9IGFbMTFdXG4gICAgb3V0WzEyXSA9IGFbMTJdXG4gICAgb3V0WzEzXSA9IGFbMTNdXG4gICAgb3V0WzE0XSA9IGFbMTRdXG4gICAgb3V0WzE1XSA9IGFbMTVdXG4gIH0gLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuXG4gIG91dFswXSA9IGEwMCAqIGMgKyBhMTAgKiBzXG4gIG91dFsxXSA9IGEwMSAqIGMgKyBhMTEgKiBzXG4gIG91dFsyXSA9IGEwMiAqIGMgKyBhMTIgKiBzXG4gIG91dFszXSA9IGEwMyAqIGMgKyBhMTMgKiBzXG4gIG91dFs0XSA9IGExMCAqIGMgLSBhMDAgKiBzXG4gIG91dFs1XSA9IGExMSAqIGMgLSBhMDEgKiBzXG4gIG91dFs2XSA9IGExMiAqIGMgLSBhMDIgKiBzXG4gIG91dFs3XSA9IGExMyAqIGMgLSBhMDMgKiBzXG4gIHJldHVybiBvdXRcbn1cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgdmVjdG9yIHRyYW5zbGF0aW9uXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQ0LnRyYW5zbGF0ZShkZXN0LCBkZXN0LCB2ZWMpO1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSB2IFRyYW5zbGF0aW9uIHZlY3RvclxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tVHJhbnNsYXRpb24gKG91dCwgdikge1xuICBvdXRbMF0gPSAxXG4gIG91dFsxXSA9IDBcbiAgb3V0WzJdID0gMFxuICBvdXRbM10gPSAwXG4gIG91dFs0XSA9IDBcbiAgb3V0WzVdID0gMVxuICBvdXRbNl0gPSAwXG4gIG91dFs3XSA9IDBcbiAgb3V0WzhdID0gMFxuICBvdXRbOV0gPSAwXG4gIG91dFsxMF0gPSAxXG4gIG91dFsxMV0gPSAwXG4gIG91dFsxMl0gPSB2WzBdXG4gIG91dFsxM10gPSB2WzFdXG4gIG91dFsxNF0gPSB2WzJdXG4gIG91dFsxNV0gPSAxXG4gIHJldHVybiBvdXRcbn1cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgdmVjdG9yIHNjYWxpbmdcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDQuc2NhbGUoZGVzdCwgZGVzdCwgdmVjKTtcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gdiBTY2FsaW5nIHZlY3RvclxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tU2NhbGluZyAob3V0LCB2KSB7XG4gIG91dFswXSA9IHZbMF1cbiAgb3V0WzFdID0gMFxuICBvdXRbMl0gPSAwXG4gIG91dFszXSA9IDBcbiAgb3V0WzRdID0gMFxuICBvdXRbNV0gPSB2WzFdXG4gIG91dFs2XSA9IDBcbiAgb3V0WzddID0gMFxuICBvdXRbOF0gPSAwXG4gIG91dFs5XSA9IDBcbiAgb3V0WzEwXSA9IHZbMl1cbiAgb3V0WzExXSA9IDBcbiAgb3V0WzEyXSA9IDBcbiAgb3V0WzEzXSA9IDBcbiAgb3V0WzE0XSA9IDBcbiAgb3V0WzE1XSA9IDFcbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBnaXZlbiBhbmdsZSBhcm91bmQgYSBnaXZlbiBheGlzXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQ0LnJvdGF0ZShkZXN0LCBkZXN0LCByYWQsIGF4aXMpO1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gYXhpcyB0aGUgYXhpcyB0byByb3RhdGUgYXJvdW5kXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21Sb3RhdGlvbiAob3V0LCByYWQsIGF4aXMpIHtcbiAgbGV0IHggPSBheGlzWzBdXG4gICAgICBsZXQgeSA9IGF4aXNbMV1cbiAgICAgIGxldCB6ID0gYXhpc1syXVxuICBsZXQgbGVuID0gTWF0aC5oeXBvdCh4LCB5LCB6KVxuICBsZXQgcywgYywgdFxuXG4gIGlmIChsZW4gPCBnbE1hdHJpeC5FUFNJTE9OKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGxlbiA9IDEgLyBsZW5cbiAgeCAqPSBsZW5cbiAgeSAqPSBsZW5cbiAgeiAqPSBsZW5cbiAgcyA9IE1hdGguc2luKHJhZClcbiAgYyA9IE1hdGguY29zKHJhZClcbiAgdCA9IDEgLSBjIC8vIFBlcmZvcm0gcm90YXRpb24tc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG5cbiAgb3V0WzBdID0geCAqIHggKiB0ICsgY1xuICBvdXRbMV0gPSB5ICogeCAqIHQgKyB6ICogc1xuICBvdXRbMl0gPSB6ICogeCAqIHQgLSB5ICogc1xuICBvdXRbM10gPSAwXG4gIG91dFs0XSA9IHggKiB5ICogdCAtIHogKiBzXG4gIG91dFs1XSA9IHkgKiB5ICogdCArIGNcbiAgb3V0WzZdID0geiAqIHkgKiB0ICsgeCAqIHNcbiAgb3V0WzddID0gMFxuICBvdXRbOF0gPSB4ICogeiAqIHQgKyB5ICogc1xuICBvdXRbOV0gPSB5ICogeiAqIHQgLSB4ICogc1xuICBvdXRbMTBdID0geiAqIHogKiB0ICsgY1xuICBvdXRbMTFdID0gMFxuICBvdXRbMTJdID0gMFxuICBvdXRbMTNdID0gMFxuICBvdXRbMTRdID0gMFxuICBvdXRbMTVdID0gMVxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBYIGF4aXNcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDQucm90YXRlWChkZXN0LCBkZXN0LCByYWQpO1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21YUm90YXRpb24gKG91dCwgcmFkKSB7XG4gIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpXG4gIGNvbnN0IGMgPSBNYXRoLmNvcyhyYWQpIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cblxuICBvdXRbMF0gPSAxXG4gIG91dFsxXSA9IDBcbiAgb3V0WzJdID0gMFxuICBvdXRbM10gPSAwXG4gIG91dFs0XSA9IDBcbiAgb3V0WzVdID0gY1xuICBvdXRbNl0gPSBzXG4gIG91dFs3XSA9IDBcbiAgb3V0WzhdID0gMFxuICBvdXRbOV0gPSAtc1xuICBvdXRbMTBdID0gY1xuICBvdXRbMTFdID0gMFxuICBvdXRbMTJdID0gMFxuICBvdXRbMTNdID0gMFxuICBvdXRbMTRdID0gMFxuICBvdXRbMTVdID0gMVxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBZIGF4aXNcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDQucm90YXRlWShkZXN0LCBkZXN0LCByYWQpO1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21ZUm90YXRpb24gKG91dCwgcmFkKSB7XG4gIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpXG4gIGNvbnN0IGMgPSBNYXRoLmNvcyhyYWQpIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cblxuICBvdXRbMF0gPSBjXG4gIG91dFsxXSA9IDBcbiAgb3V0WzJdID0gLXNcbiAgb3V0WzNdID0gMFxuICBvdXRbNF0gPSAwXG4gIG91dFs1XSA9IDFcbiAgb3V0WzZdID0gMFxuICBvdXRbN10gPSAwXG4gIG91dFs4XSA9IHNcbiAgb3V0WzldID0gMFxuICBvdXRbMTBdID0gY1xuICBvdXRbMTFdID0gMFxuICBvdXRbMTJdID0gMFxuICBvdXRbMTNdID0gMFxuICBvdXRbMTRdID0gMFxuICBvdXRbMTVdID0gMVxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBaIGF4aXNcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDQucm90YXRlWihkZXN0LCBkZXN0LCByYWQpO1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21aUm90YXRpb24gKG91dCwgcmFkKSB7XG4gIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpXG4gIGNvbnN0IGMgPSBNYXRoLmNvcyhyYWQpIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cblxuICBvdXRbMF0gPSBjXG4gIG91dFsxXSA9IHNcbiAgb3V0WzJdID0gMFxuICBvdXRbM10gPSAwXG4gIG91dFs0XSA9IC1zXG4gIG91dFs1XSA9IGNcbiAgb3V0WzZdID0gMFxuICBvdXRbN10gPSAwXG4gIG91dFs4XSA9IDBcbiAgb3V0WzldID0gMFxuICBvdXRbMTBdID0gMVxuICBvdXRbMTFdID0gMFxuICBvdXRbMTJdID0gMFxuICBvdXRbMTNdID0gMFxuICBvdXRbMTRdID0gMFxuICBvdXRbMTVdID0gMVxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHF1YXRlcm5pb24gcm90YXRpb24gYW5kIHZlY3RvciB0cmFuc2xhdGlvblxuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDQuaWRlbnRpdHkoZGVzdCk7XG4gKiAgICAgbWF0NC50cmFuc2xhdGUoZGVzdCwgdmVjKTtcbiAqICAgICBsZXQgcXVhdE1hdCA9IG1hdDQuY3JlYXRlKCk7XG4gKiAgICAgcXVhdDQudG9NYXQ0KHF1YXQsIHF1YXRNYXQpO1xuICogICAgIG1hdDQubXVsdGlwbHkoZGVzdCwgcXVhdE1hdCk7XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHtxdWF0NH0gcSBSb3RhdGlvbiBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gdiBUcmFuc2xhdGlvbiB2ZWN0b3JcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbVJvdGF0aW9uVHJhbnNsYXRpb24gKG91dCwgcSwgdikge1xuICAvLyBRdWF0ZXJuaW9uIG1hdGhcbiAgY29uc3QgeCA9IHFbMF1cbiAgICAgIGNvbnN0IHkgPSBxWzFdXG4gICAgICBjb25zdCB6ID0gcVsyXVxuICAgICAgY29uc3QgdyA9IHFbM11cbiAgY29uc3QgeDIgPSB4ICsgeFxuICBjb25zdCB5MiA9IHkgKyB5XG4gIGNvbnN0IHoyID0geiArIHpcbiAgY29uc3QgeHggPSB4ICogeDJcbiAgY29uc3QgeHkgPSB4ICogeTJcbiAgY29uc3QgeHogPSB4ICogejJcbiAgY29uc3QgeXkgPSB5ICogeTJcbiAgY29uc3QgeXogPSB5ICogejJcbiAgY29uc3QgenogPSB6ICogejJcbiAgY29uc3Qgd3ggPSB3ICogeDJcbiAgY29uc3Qgd3kgPSB3ICogeTJcbiAgY29uc3Qgd3ogPSB3ICogejJcbiAgb3V0WzBdID0gMSAtICh5eSArIHp6KVxuICBvdXRbMV0gPSB4eSArIHd6XG4gIG91dFsyXSA9IHh6IC0gd3lcbiAgb3V0WzNdID0gMFxuICBvdXRbNF0gPSB4eSAtIHd6XG4gIG91dFs1XSA9IDEgLSAoeHggKyB6eilcbiAgb3V0WzZdID0geXogKyB3eFxuICBvdXRbN10gPSAwXG4gIG91dFs4XSA9IHh6ICsgd3lcbiAgb3V0WzldID0geXogLSB3eFxuICBvdXRbMTBdID0gMSAtICh4eCArIHl5KVxuICBvdXRbMTFdID0gMFxuICBvdXRbMTJdID0gdlswXVxuICBvdXRbMTNdID0gdlsxXVxuICBvdXRbMTRdID0gdlsyXVxuICBvdXRbMTVdID0gMVxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbWF0NCBmcm9tIGEgZHVhbCBxdWF0LlxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IE1hdHJpeFxuICogQHBhcmFtIHtSZWFkb25seVF1YXQyfSBhIER1YWwgUXVhdGVybmlvblxuICogQHJldHVybnMge21hdDR9IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbVF1YXQyIChvdXQsIGEpIHtcbiAgY29uc3QgdHJhbnNsYXRpb24gPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSgzKVxuICBjb25zdCBieCA9IC1hWzBdXG4gICAgICBjb25zdCBieSA9IC1hWzFdXG4gICAgICBjb25zdCBieiA9IC1hWzJdXG4gICAgICBjb25zdCBidyA9IGFbM11cbiAgICAgIGNvbnN0IGF4ID0gYVs0XVxuICAgICAgY29uc3QgYXkgPSBhWzVdXG4gICAgICBjb25zdCBheiA9IGFbNl1cbiAgICAgIGNvbnN0IGF3ID0gYVs3XVxuICBjb25zdCBtYWduaXR1ZGUgPSBieCAqIGJ4ICsgYnkgKiBieSArIGJ6ICogYnogKyBidyAqIGJ3IC8vIE9ubHkgc2NhbGUgaWYgaXQgbWFrZXMgc2Vuc2VcblxuICBpZiAobWFnbml0dWRlID4gMCkge1xuICAgIHRyYW5zbGF0aW9uWzBdID0gKGF4ICogYncgKyBhdyAqIGJ4ICsgYXkgKiBieiAtIGF6ICogYnkpICogMiAvIG1hZ25pdHVkZVxuICAgIHRyYW5zbGF0aW9uWzFdID0gKGF5ICogYncgKyBhdyAqIGJ5ICsgYXogKiBieCAtIGF4ICogYnopICogMiAvIG1hZ25pdHVkZVxuICAgIHRyYW5zbGF0aW9uWzJdID0gKGF6ICogYncgKyBhdyAqIGJ6ICsgYXggKiBieSAtIGF5ICogYngpICogMiAvIG1hZ25pdHVkZVxuICB9IGVsc2Uge1xuICAgIHRyYW5zbGF0aW9uWzBdID0gKGF4ICogYncgKyBhdyAqIGJ4ICsgYXkgKiBieiAtIGF6ICogYnkpICogMlxuICAgIHRyYW5zbGF0aW9uWzFdID0gKGF5ICogYncgKyBhdyAqIGJ5ICsgYXogKiBieCAtIGF4ICogYnopICogMlxuICAgIHRyYW5zbGF0aW9uWzJdID0gKGF6ICogYncgKyBhdyAqIGJ6ICsgYXggKiBieSAtIGF5ICogYngpICogMlxuICB9XG5cbiAgZnJvbVJvdGF0aW9uVHJhbnNsYXRpb24ob3V0LCBhLCB0cmFuc2xhdGlvbilcbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0cmFuc2xhdGlvbiB2ZWN0b3IgY29tcG9uZW50IG9mIGEgdHJhbnNmb3JtYXRpb25cbiAqICBtYXRyaXguIElmIGEgbWF0cml4IGlzIGJ1aWx0IHdpdGggZnJvbVJvdGF0aW9uVHJhbnNsYXRpb24sXG4gKiAgdGhlIHJldHVybmVkIHZlY3RvciB3aWxsIGJlIHRoZSBzYW1lIGFzIHRoZSB0cmFuc2xhdGlvbiB2ZWN0b3JcbiAqICBvcmlnaW5hbGx5IHN1cHBsaWVkLlxuICogQHBhcmFtICB7dmVjM30gb3V0IFZlY3RvciB0byByZWNlaXZlIHRyYW5zbGF0aW9uIGNvbXBvbmVudFxuICogQHBhcmFtICB7UmVhZG9ubHlNYXQ0fSBtYXQgTWF0cml4IHRvIGJlIGRlY29tcG9zZWQgKGlucHV0KVxuICogQHJldHVybiB7dmVjM30gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zbGF0aW9uIChvdXQsIG1hdCkge1xuICBvdXRbMF0gPSBtYXRbMTJdXG4gIG91dFsxXSA9IG1hdFsxM11cbiAgb3V0WzJdID0gbWF0WzE0XVxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIFJldHVybnMgdGhlIHNjYWxpbmcgZmFjdG9yIGNvbXBvbmVudCBvZiBhIHRyYW5zZm9ybWF0aW9uXG4gKiAgbWF0cml4LiBJZiBhIG1hdHJpeCBpcyBidWlsdCB3aXRoIGZyb21Sb3RhdGlvblRyYW5zbGF0aW9uU2NhbGVcbiAqICB3aXRoIGEgbm9ybWFsaXplZCBRdWF0ZXJuaW9uIHBhcmFtdGVyLCB0aGUgcmV0dXJuZWQgdmVjdG9yIHdpbGwgYmVcbiAqICB0aGUgc2FtZSBhcyB0aGUgc2NhbGluZyB2ZWN0b3JcbiAqICBvcmlnaW5hbGx5IHN1cHBsaWVkLlxuICogQHBhcmFtICB7dmVjM30gb3V0IFZlY3RvciB0byByZWNlaXZlIHNjYWxpbmcgZmFjdG9yIGNvbXBvbmVudFxuICogQHBhcmFtICB7UmVhZG9ubHlNYXQ0fSBtYXQgTWF0cml4IHRvIGJlIGRlY29tcG9zZWQgKGlucHV0KVxuICogQHJldHVybiB7dmVjM30gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNjYWxpbmcgKG91dCwgbWF0KSB7XG4gIGNvbnN0IG0xMSA9IG1hdFswXVxuICBjb25zdCBtMTIgPSBtYXRbMV1cbiAgY29uc3QgbTEzID0gbWF0WzJdXG4gIGNvbnN0IG0yMSA9IG1hdFs0XVxuICBjb25zdCBtMjIgPSBtYXRbNV1cbiAgY29uc3QgbTIzID0gbWF0WzZdXG4gIGNvbnN0IG0zMSA9IG1hdFs4XVxuICBjb25zdCBtMzIgPSBtYXRbOV1cbiAgY29uc3QgbTMzID0gbWF0WzEwXVxuICBvdXRbMF0gPSBNYXRoLmh5cG90KG0xMSwgbTEyLCBtMTMpXG4gIG91dFsxXSA9IE1hdGguaHlwb3QobTIxLCBtMjIsIG0yMylcbiAgb3V0WzJdID0gTWF0aC5oeXBvdChtMzEsIG0zMiwgbTMzKVxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIFJldHVybnMgYSBxdWF0ZXJuaW9uIHJlcHJlc2VudGluZyB0aGUgcm90YXRpb25hbCBjb21wb25lbnRcbiAqICBvZiBhIHRyYW5zZm9ybWF0aW9uIG1hdHJpeC4gSWYgYSBtYXRyaXggaXMgYnVpbHQgd2l0aFxuICogIGZyb21Sb3RhdGlvblRyYW5zbGF0aW9uLCB0aGUgcmV0dXJuZWQgcXVhdGVybmlvbiB3aWxsIGJlIHRoZVxuICogIHNhbWUgYXMgdGhlIHF1YXRlcm5pb24gb3JpZ2luYWxseSBzdXBwbGllZC5cbiAqIEBwYXJhbSB7cXVhdH0gb3V0IFF1YXRlcm5pb24gdG8gcmVjZWl2ZSB0aGUgcm90YXRpb24gY29tcG9uZW50XG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gbWF0IE1hdHJpeCB0byBiZSBkZWNvbXBvc2VkIChpbnB1dClcbiAqIEByZXR1cm4ge3F1YXR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSb3RhdGlvbiAob3V0LCBtYXQpIHtcbiAgY29uc3Qgc2NhbGluZyA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDMpXG4gIGdldFNjYWxpbmcoc2NhbGluZywgbWF0KVxuICBjb25zdCBpczEgPSAxIC8gc2NhbGluZ1swXVxuICBjb25zdCBpczIgPSAxIC8gc2NhbGluZ1sxXVxuICBjb25zdCBpczMgPSAxIC8gc2NhbGluZ1syXVxuICBjb25zdCBzbTExID0gbWF0WzBdICogaXMxXG4gIGNvbnN0IHNtMTIgPSBtYXRbMV0gKiBpczJcbiAgY29uc3Qgc20xMyA9IG1hdFsyXSAqIGlzM1xuICBjb25zdCBzbTIxID0gbWF0WzRdICogaXMxXG4gIGNvbnN0IHNtMjIgPSBtYXRbNV0gKiBpczJcbiAgY29uc3Qgc20yMyA9IG1hdFs2XSAqIGlzM1xuICBjb25zdCBzbTMxID0gbWF0WzhdICogaXMxXG4gIGNvbnN0IHNtMzIgPSBtYXRbOV0gKiBpczJcbiAgY29uc3Qgc20zMyA9IG1hdFsxMF0gKiBpczNcbiAgY29uc3QgdHJhY2UgPSBzbTExICsgc20yMiArIHNtMzNcbiAgbGV0IFMgPSAwXG5cbiAgaWYgKHRyYWNlID4gMCkge1xuICAgIFMgPSBNYXRoLnNxcnQodHJhY2UgKyAxLjApICogMlxuICAgIG91dFszXSA9IDAuMjUgKiBTXG4gICAgb3V0WzBdID0gKHNtMjMgLSBzbTMyKSAvIFNcbiAgICBvdXRbMV0gPSAoc20zMSAtIHNtMTMpIC8gU1xuICAgIG91dFsyXSA9IChzbTEyIC0gc20yMSkgLyBTXG4gIH0gZWxzZSBpZiAoc20xMSA+IHNtMjIgJiYgc20xMSA+IHNtMzMpIHtcbiAgICBTID0gTWF0aC5zcXJ0KDEuMCArIHNtMTEgLSBzbTIyIC0gc20zMykgKiAyXG4gICAgb3V0WzNdID0gKHNtMjMgLSBzbTMyKSAvIFNcbiAgICBvdXRbMF0gPSAwLjI1ICogU1xuICAgIG91dFsxXSA9IChzbTEyICsgc20yMSkgLyBTXG4gICAgb3V0WzJdID0gKHNtMzEgKyBzbTEzKSAvIFNcbiAgfSBlbHNlIGlmIChzbTIyID4gc20zMykge1xuICAgIFMgPSBNYXRoLnNxcnQoMS4wICsgc20yMiAtIHNtMTEgLSBzbTMzKSAqIDJcbiAgICBvdXRbM10gPSAoc20zMSAtIHNtMTMpIC8gU1xuICAgIG91dFswXSA9IChzbTEyICsgc20yMSkgLyBTXG4gICAgb3V0WzFdID0gMC4yNSAqIFNcbiAgICBvdXRbMl0gPSAoc20yMyArIHNtMzIpIC8gU1xuICB9IGVsc2Uge1xuICAgIFMgPSBNYXRoLnNxcnQoMS4wICsgc20zMyAtIHNtMTEgLSBzbTIyKSAqIDJcbiAgICBvdXRbM10gPSAoc20xMiAtIHNtMjEpIC8gU1xuICAgIG91dFswXSA9IChzbTMxICsgc20xMykgLyBTXG4gICAgb3V0WzFdID0gKHNtMjMgKyBzbTMyKSAvIFNcbiAgICBvdXRbMl0gPSAwLjI1ICogU1xuICB9XG5cbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBEZWNvbXBvc2VzIGEgdHJhbnNmb3JtYXRpb24gbWF0cml4IGludG8gaXRzIHJvdGF0aW9uLCB0cmFuc2xhdGlvblxuICogYW5kIHNjYWxlIGNvbXBvbmVudHMuIFJldHVybnMgb25seSB0aGUgcm90YXRpb24gY29tcG9uZW50XG4gKiBAcGFyYW0gIHtxdWF0fSBvdXRfciBRdWF0ZXJuaW9uIHRvIHJlY2VpdmUgdGhlIHJvdGF0aW9uIGNvbXBvbmVudFxuICogQHBhcmFtICB7dmVjM30gb3V0X3QgVmVjdG9yIHRvIHJlY2VpdmUgdGhlIHRyYW5zbGF0aW9uIHZlY3RvclxuICogQHBhcmFtICB7dmVjM30gb3V0X3MgVmVjdG9yIHRvIHJlY2VpdmUgdGhlIHNjYWxpbmcgZmFjdG9yXG4gKiBAcGFyYW0gIHtSZWFkb25seU1hdDR9IG1hdCBNYXRyaXggdG8gYmUgZGVjb21wb3NlZCAoaW5wdXQpXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0X3JcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZGVjb21wb3NlIChvdXRfciwgb3V0X3QsIG91dF9zLCBtYXQpIHtcbiAgb3V0X3RbMF0gPSBtYXRbMTJdXG4gIG91dF90WzFdID0gbWF0WzEzXVxuICBvdXRfdFsyXSA9IG1hdFsxNF1cbiAgY29uc3QgbTExID0gbWF0WzBdXG4gIGNvbnN0IG0xMiA9IG1hdFsxXVxuICBjb25zdCBtMTMgPSBtYXRbMl1cbiAgY29uc3QgbTIxID0gbWF0WzRdXG4gIGNvbnN0IG0yMiA9IG1hdFs1XVxuICBjb25zdCBtMjMgPSBtYXRbNl1cbiAgY29uc3QgbTMxID0gbWF0WzhdXG4gIGNvbnN0IG0zMiA9IG1hdFs5XVxuICBjb25zdCBtMzMgPSBtYXRbMTBdXG4gIG91dF9zWzBdID0gTWF0aC5oeXBvdChtMTEsIG0xMiwgbTEzKVxuICBvdXRfc1sxXSA9IE1hdGguaHlwb3QobTIxLCBtMjIsIG0yMylcbiAgb3V0X3NbMl0gPSBNYXRoLmh5cG90KG0zMSwgbTMyLCBtMzMpXG4gIGNvbnN0IGlzMSA9IDEgLyBvdXRfc1swXVxuICBjb25zdCBpczIgPSAxIC8gb3V0X3NbMV1cbiAgY29uc3QgaXMzID0gMSAvIG91dF9zWzJdXG4gIGNvbnN0IHNtMTEgPSBtMTEgKiBpczFcbiAgY29uc3Qgc20xMiA9IG0xMiAqIGlzMlxuICBjb25zdCBzbTEzID0gbTEzICogaXMzXG4gIGNvbnN0IHNtMjEgPSBtMjEgKiBpczFcbiAgY29uc3Qgc20yMiA9IG0yMiAqIGlzMlxuICBjb25zdCBzbTIzID0gbTIzICogaXMzXG4gIGNvbnN0IHNtMzEgPSBtMzEgKiBpczFcbiAgY29uc3Qgc20zMiA9IG0zMiAqIGlzMlxuICBjb25zdCBzbTMzID0gbTMzICogaXMzXG4gIGNvbnN0IHRyYWNlID0gc20xMSArIHNtMjIgKyBzbTMzXG4gIGxldCBTID0gMFxuXG4gIGlmICh0cmFjZSA+IDApIHtcbiAgICBTID0gTWF0aC5zcXJ0KHRyYWNlICsgMS4wKSAqIDJcbiAgICBvdXRfclszXSA9IDAuMjUgKiBTXG4gICAgb3V0X3JbMF0gPSAoc20yMyAtIHNtMzIpIC8gU1xuICAgIG91dF9yWzFdID0gKHNtMzEgLSBzbTEzKSAvIFNcbiAgICBvdXRfclsyXSA9IChzbTEyIC0gc20yMSkgLyBTXG4gIH0gZWxzZSBpZiAoc20xMSA+IHNtMjIgJiYgc20xMSA+IHNtMzMpIHtcbiAgICBTID0gTWF0aC5zcXJ0KDEuMCArIHNtMTEgLSBzbTIyIC0gc20zMykgKiAyXG4gICAgb3V0X3JbM10gPSAoc20yMyAtIHNtMzIpIC8gU1xuICAgIG91dF9yWzBdID0gMC4yNSAqIFNcbiAgICBvdXRfclsxXSA9IChzbTEyICsgc20yMSkgLyBTXG4gICAgb3V0X3JbMl0gPSAoc20zMSArIHNtMTMpIC8gU1xuICB9IGVsc2UgaWYgKHNtMjIgPiBzbTMzKSB7XG4gICAgUyA9IE1hdGguc3FydCgxLjAgKyBzbTIyIC0gc20xMSAtIHNtMzMpICogMlxuICAgIG91dF9yWzNdID0gKHNtMzEgLSBzbTEzKSAvIFNcbiAgICBvdXRfclswXSA9IChzbTEyICsgc20yMSkgLyBTXG4gICAgb3V0X3JbMV0gPSAwLjI1ICogU1xuICAgIG91dF9yWzJdID0gKHNtMjMgKyBzbTMyKSAvIFNcbiAgfSBlbHNlIHtcbiAgICBTID0gTWF0aC5zcXJ0KDEuMCArIHNtMzMgLSBzbTExIC0gc20yMikgKiAyXG4gICAgb3V0X3JbM10gPSAoc20xMiAtIHNtMjEpIC8gU1xuICAgIG91dF9yWzBdID0gKHNtMzEgKyBzbTEzKSAvIFNcbiAgICBvdXRfclsxXSA9IChzbTIzICsgc20zMikgLyBTXG4gICAgb3V0X3JbMl0gPSAwLjI1ICogU1xuICB9XG5cbiAgcmV0dXJuIG91dF9yXG59XG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHF1YXRlcm5pb24gcm90YXRpb24sIHZlY3RvciB0cmFuc2xhdGlvbiBhbmQgdmVjdG9yIHNjYWxlXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQ0LnRyYW5zbGF0ZShkZXN0LCB2ZWMpO1xuICogICAgIGxldCBxdWF0TWF0ID0gbWF0NC5jcmVhdGUoKTtcbiAqICAgICBxdWF0NC50b01hdDQocXVhdCwgcXVhdE1hdCk7XG4gKiAgICAgbWF0NC5tdWx0aXBseShkZXN0LCBxdWF0TWF0KTtcbiAqICAgICBtYXQ0LnNjYWxlKGRlc3QsIHNjYWxlKVxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7cXVhdDR9IHEgUm90YXRpb24gcXVhdGVybmlvblxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IHYgVHJhbnNsYXRpb24gdmVjdG9yXG4gKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gcyBTY2FsaW5nIHZlY3RvclxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUm90YXRpb25UcmFuc2xhdGlvblNjYWxlIChvdXQsIHEsIHYsIHMpIHtcbiAgLy8gUXVhdGVybmlvbiBtYXRoXG4gIGNvbnN0IHggPSBxWzBdXG4gICAgICBjb25zdCB5ID0gcVsxXVxuICAgICAgY29uc3QgeiA9IHFbMl1cbiAgICAgIGNvbnN0IHcgPSBxWzNdXG4gIGNvbnN0IHgyID0geCArIHhcbiAgY29uc3QgeTIgPSB5ICsgeVxuICBjb25zdCB6MiA9IHogKyB6XG4gIGNvbnN0IHh4ID0geCAqIHgyXG4gIGNvbnN0IHh5ID0geCAqIHkyXG4gIGNvbnN0IHh6ID0geCAqIHoyXG4gIGNvbnN0IHl5ID0geSAqIHkyXG4gIGNvbnN0IHl6ID0geSAqIHoyXG4gIGNvbnN0IHp6ID0geiAqIHoyXG4gIGNvbnN0IHd4ID0gdyAqIHgyXG4gIGNvbnN0IHd5ID0gdyAqIHkyXG4gIGNvbnN0IHd6ID0gdyAqIHoyXG4gIGNvbnN0IHN4ID0gc1swXVxuICBjb25zdCBzeSA9IHNbMV1cbiAgY29uc3Qgc3ogPSBzWzJdXG4gIG91dFswXSA9ICgxIC0gKHl5ICsgenopKSAqIHN4XG4gIG91dFsxXSA9ICh4eSArIHd6KSAqIHN4XG4gIG91dFsyXSA9ICh4eiAtIHd5KSAqIHN4XG4gIG91dFszXSA9IDBcbiAgb3V0WzRdID0gKHh5IC0gd3opICogc3lcbiAgb3V0WzVdID0gKDEgLSAoeHggKyB6eikpICogc3lcbiAgb3V0WzZdID0gKHl6ICsgd3gpICogc3lcbiAgb3V0WzddID0gMFxuICBvdXRbOF0gPSAoeHogKyB3eSkgKiBzelxuICBvdXRbOV0gPSAoeXogLSB3eCkgKiBzelxuICBvdXRbMTBdID0gKDEgLSAoeHggKyB5eSkpICogc3pcbiAgb3V0WzExXSA9IDBcbiAgb3V0WzEyXSA9IHZbMF1cbiAgb3V0WzEzXSA9IHZbMV1cbiAgb3V0WzE0XSA9IHZbMl1cbiAgb3V0WzE1XSA9IDFcbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBxdWF0ZXJuaW9uIHJvdGF0aW9uLCB2ZWN0b3IgdHJhbnNsYXRpb24gYW5kIHZlY3RvciBzY2FsZSwgcm90YXRpbmcgYW5kIHNjYWxpbmcgYXJvdW5kIHRoZSBnaXZlbiBvcmlnaW5cbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDQudHJhbnNsYXRlKGRlc3QsIHZlYyk7XG4gKiAgICAgbWF0NC50cmFuc2xhdGUoZGVzdCwgb3JpZ2luKTtcbiAqICAgICBsZXQgcXVhdE1hdCA9IG1hdDQuY3JlYXRlKCk7XG4gKiAgICAgcXVhdDQudG9NYXQ0KHF1YXQsIHF1YXRNYXQpO1xuICogICAgIG1hdDQubXVsdGlwbHkoZGVzdCwgcXVhdE1hdCk7XG4gKiAgICAgbWF0NC5zY2FsZShkZXN0LCBzY2FsZSlcbiAqICAgICBtYXQ0LnRyYW5zbGF0ZShkZXN0LCBuZWdhdGl2ZU9yaWdpbik7XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHtxdWF0NH0gcSBSb3RhdGlvbiBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gdiBUcmFuc2xhdGlvbiB2ZWN0b3JcbiAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSBzIFNjYWxpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gbyBUaGUgb3JpZ2luIHZlY3RvciBhcm91bmQgd2hpY2ggdG8gc2NhbGUgYW5kIHJvdGF0ZVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUm90YXRpb25UcmFuc2xhdGlvblNjYWxlT3JpZ2luIChvdXQsIHEsIHYsIHMsIG8pIHtcbiAgLy8gUXVhdGVybmlvbiBtYXRoXG4gIGNvbnN0IHggPSBxWzBdXG4gICAgICBjb25zdCB5ID0gcVsxXVxuICAgICAgY29uc3QgeiA9IHFbMl1cbiAgICAgIGNvbnN0IHcgPSBxWzNdXG4gIGNvbnN0IHgyID0geCArIHhcbiAgY29uc3QgeTIgPSB5ICsgeVxuICBjb25zdCB6MiA9IHogKyB6XG4gIGNvbnN0IHh4ID0geCAqIHgyXG4gIGNvbnN0IHh5ID0geCAqIHkyXG4gIGNvbnN0IHh6ID0geCAqIHoyXG4gIGNvbnN0IHl5ID0geSAqIHkyXG4gIGNvbnN0IHl6ID0geSAqIHoyXG4gIGNvbnN0IHp6ID0geiAqIHoyXG4gIGNvbnN0IHd4ID0gdyAqIHgyXG4gIGNvbnN0IHd5ID0gdyAqIHkyXG4gIGNvbnN0IHd6ID0gdyAqIHoyXG4gIGNvbnN0IHN4ID0gc1swXVxuICBjb25zdCBzeSA9IHNbMV1cbiAgY29uc3Qgc3ogPSBzWzJdXG4gIGNvbnN0IG94ID0gb1swXVxuICBjb25zdCBveSA9IG9bMV1cbiAgY29uc3Qgb3ogPSBvWzJdXG4gIGNvbnN0IG91dDAgPSAoMSAtICh5eSArIHp6KSkgKiBzeFxuICBjb25zdCBvdXQxID0gKHh5ICsgd3opICogc3hcbiAgY29uc3Qgb3V0MiA9ICh4eiAtIHd5KSAqIHN4XG4gIGNvbnN0IG91dDQgPSAoeHkgLSB3eikgKiBzeVxuICBjb25zdCBvdXQ1ID0gKDEgLSAoeHggKyB6eikpICogc3lcbiAgY29uc3Qgb3V0NiA9ICh5eiArIHd4KSAqIHN5XG4gIGNvbnN0IG91dDggPSAoeHogKyB3eSkgKiBzelxuICBjb25zdCBvdXQ5ID0gKHl6IC0gd3gpICogc3pcbiAgY29uc3Qgb3V0MTAgPSAoMSAtICh4eCArIHl5KSkgKiBzelxuICBvdXRbMF0gPSBvdXQwXG4gIG91dFsxXSA9IG91dDFcbiAgb3V0WzJdID0gb3V0MlxuICBvdXRbM10gPSAwXG4gIG91dFs0XSA9IG91dDRcbiAgb3V0WzVdID0gb3V0NVxuICBvdXRbNl0gPSBvdXQ2XG4gIG91dFs3XSA9IDBcbiAgb3V0WzhdID0gb3V0OFxuICBvdXRbOV0gPSBvdXQ5XG4gIG91dFsxMF0gPSBvdXQxMFxuICBvdXRbMTFdID0gMFxuICBvdXRbMTJdID0gdlswXSArIG94IC0gKG91dDAgKiBveCArIG91dDQgKiBveSArIG91dDggKiBveilcbiAgb3V0WzEzXSA9IHZbMV0gKyBveSAtIChvdXQxICogb3ggKyBvdXQ1ICogb3kgKyBvdXQ5ICogb3opXG4gIG91dFsxNF0gPSB2WzJdICsgb3ogLSAob3V0MiAqIG94ICsgb3V0NiAqIG95ICsgb3V0MTAgKiBveilcbiAgb3V0WzE1XSA9IDFcbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBDYWxjdWxhdGVzIGEgNHg0IG1hdHJpeCBmcm9tIHRoZSBnaXZlbiBxdWF0ZXJuaW9uXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHtSZWFkb25seVF1YXR9IHEgUXVhdGVybmlvbiB0byBjcmVhdGUgbWF0cml4IGZyb21cbiAqXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21RdWF0IChvdXQsIHEpIHtcbiAgY29uc3QgeCA9IHFbMF1cbiAgICAgIGNvbnN0IHkgPSBxWzFdXG4gICAgICBjb25zdCB6ID0gcVsyXVxuICAgICAgY29uc3QgdyA9IHFbM11cbiAgY29uc3QgeDIgPSB4ICsgeFxuICBjb25zdCB5MiA9IHkgKyB5XG4gIGNvbnN0IHoyID0geiArIHpcbiAgY29uc3QgeHggPSB4ICogeDJcbiAgY29uc3QgeXggPSB5ICogeDJcbiAgY29uc3QgeXkgPSB5ICogeTJcbiAgY29uc3QgenggPSB6ICogeDJcbiAgY29uc3QgenkgPSB6ICogeTJcbiAgY29uc3QgenogPSB6ICogejJcbiAgY29uc3Qgd3ggPSB3ICogeDJcbiAgY29uc3Qgd3kgPSB3ICogeTJcbiAgY29uc3Qgd3ogPSB3ICogejJcbiAgb3V0WzBdID0gMSAtIHl5IC0genpcbiAgb3V0WzFdID0geXggKyB3elxuICBvdXRbMl0gPSB6eCAtIHd5XG4gIG91dFszXSA9IDBcbiAgb3V0WzRdID0geXggLSB3elxuICBvdXRbNV0gPSAxIC0geHggLSB6elxuICBvdXRbNl0gPSB6eSArIHd4XG4gIG91dFs3XSA9IDBcbiAgb3V0WzhdID0genggKyB3eVxuICBvdXRbOV0gPSB6eSAtIHd4XG4gIG91dFsxMF0gPSAxIC0geHggLSB5eVxuICBvdXRbMTFdID0gMFxuICBvdXRbMTJdID0gMFxuICBvdXRbMTNdID0gMFxuICBvdXRbMTRdID0gMFxuICBvdXRbMTVdID0gMVxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIEdlbmVyYXRlcyBhIGZydXN0dW0gbWF0cml4IHdpdGggdGhlIGdpdmVuIGJvdW5kc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBsZWZ0IExlZnQgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7TnVtYmVyfSByaWdodCBSaWdodCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtOdW1iZXJ9IGJvdHRvbSBCb3R0b20gYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7TnVtYmVyfSB0b3AgVG9wIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge051bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge051bWJlcn0gZmFyIEZhciBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBmcnVzdHVtIChvdXQsIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XG4gIGNvbnN0IHJsID0gMSAvIChyaWdodCAtIGxlZnQpXG4gIGNvbnN0IHRiID0gMSAvICh0b3AgLSBib3R0b20pXG4gIGNvbnN0IG5mID0gMSAvIChuZWFyIC0gZmFyKVxuICBvdXRbMF0gPSBuZWFyICogMiAqIHJsXG4gIG91dFsxXSA9IDBcbiAgb3V0WzJdID0gMFxuICBvdXRbM10gPSAwXG4gIG91dFs0XSA9IDBcbiAgb3V0WzVdID0gbmVhciAqIDIgKiB0YlxuICBvdXRbNl0gPSAwXG4gIG91dFs3XSA9IDBcbiAgb3V0WzhdID0gKHJpZ2h0ICsgbGVmdCkgKiBybFxuICBvdXRbOV0gPSAodG9wICsgYm90dG9tKSAqIHRiXG4gIG91dFsxMF0gPSAoZmFyICsgbmVhcikgKiBuZlxuICBvdXRbMTFdID0gLTFcbiAgb3V0WzEyXSA9IDBcbiAgb3V0WzEzXSA9IDBcbiAgb3V0WzE0XSA9IGZhciAqIG5lYXIgKiAyICogbmZcbiAgb3V0WzE1XSA9IDBcbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBwZXJzcGVjdGl2ZSBwcm9qZWN0aW9uIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBib3VuZHMuXG4gKiBUaGUgbmVhci9mYXIgY2xpcCBwbGFuZXMgY29ycmVzcG9uZCB0byBhIG5vcm1hbGl6ZWQgZGV2aWNlIGNvb3JkaW5hdGUgWiByYW5nZSBvZiBbLTEsIDFdLFxuICogd2hpY2ggbWF0Y2hlcyBXZWJHTC9PcGVuR0wncyBjbGlwIHZvbHVtZS5cbiAqIFBhc3NpbmcgbnVsbC91bmRlZmluZWQvbm8gdmFsdWUgZm9yIGZhciB3aWxsIGdlbmVyYXRlIGluZmluaXRlIHByb2plY3Rpb24gbWF0cml4LlxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cbiAqIEBwYXJhbSB7bnVtYmVyfSBmb3Z5IFZlcnRpY2FsIGZpZWxkIG9mIHZpZXcgaW4gcmFkaWFuc1xuICogQHBhcmFtIHtudW1iZXJ9IGFzcGVjdCBBc3BlY3QgcmF0aW8uIHR5cGljYWxseSB2aWV3cG9ydCB3aWR0aC9oZWlnaHRcbiAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtLCBjYW4gYmUgbnVsbCBvciBJbmZpbml0eVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBwZXJzcGVjdGl2ZU5PIChvdXQsIGZvdnksIGFzcGVjdCwgbmVhciwgZmFyKSB7XG4gIGNvbnN0IGYgPSAxLjAgLyBNYXRoLnRhbihmb3Z5IC8gMilcbiAgb3V0WzBdID0gZiAvIGFzcGVjdFxuICBvdXRbMV0gPSAwXG4gIG91dFsyXSA9IDBcbiAgb3V0WzNdID0gMFxuICBvdXRbNF0gPSAwXG4gIG91dFs1XSA9IGZcbiAgb3V0WzZdID0gMFxuICBvdXRbN10gPSAwXG4gIG91dFs4XSA9IDBcbiAgb3V0WzldID0gMFxuICBvdXRbMTFdID0gLTFcbiAgb3V0WzEyXSA9IDBcbiAgb3V0WzEzXSA9IDBcbiAgb3V0WzE1XSA9IDBcblxuICBpZiAoZmFyICE9IG51bGwgJiYgZmFyICE9PSBJbmZpbml0eSkge1xuICAgIGNvbnN0IG5mID0gMSAvIChuZWFyIC0gZmFyKVxuICAgIG91dFsxMF0gPSAoZmFyICsgbmVhcikgKiBuZlxuICAgIG91dFsxNF0gPSAyICogZmFyICogbmVhciAqIG5mXG4gIH0gZWxzZSB7XG4gICAgb3V0WzEwXSA9IC0xXG4gICAgb3V0WzE0XSA9IC0yICogbmVhclxuICB9XG5cbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIG1hdDQucGVyc3BlY3RpdmVOT31cbiAqIEBmdW5jdGlvblxuICovXG5cbmV4cG9ydCB2YXIgcGVyc3BlY3RpdmUgPSBwZXJzcGVjdGl2ZU5PXG4vKipcbiAqIEdlbmVyYXRlcyBhIHBlcnNwZWN0aXZlIHByb2plY3Rpb24gbWF0cml4IHN1aXRhYmxlIGZvciBXZWJHUFUgd2l0aCB0aGUgZ2l2ZW4gYm91bmRzLlxuICogVGhlIG5lYXIvZmFyIGNsaXAgcGxhbmVzIGNvcnJlc3BvbmQgdG8gYSBub3JtYWxpemVkIGRldmljZSBjb29yZGluYXRlIFogcmFuZ2Ugb2YgWzAsIDFdLFxuICogd2hpY2ggbWF0Y2hlcyBXZWJHUFUvVnVsa2FuL0RpcmVjdFgvTWV0YWwncyBjbGlwIHZvbHVtZS5cbiAqIFBhc3NpbmcgbnVsbC91bmRlZmluZWQvbm8gdmFsdWUgZm9yIGZhciB3aWxsIGdlbmVyYXRlIGluZmluaXRlIHByb2plY3Rpb24gbWF0cml4LlxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cbiAqIEBwYXJhbSB7bnVtYmVyfSBmb3Z5IFZlcnRpY2FsIGZpZWxkIG9mIHZpZXcgaW4gcmFkaWFuc1xuICogQHBhcmFtIHtudW1iZXJ9IGFzcGVjdCBBc3BlY3QgcmF0aW8uIHR5cGljYWxseSB2aWV3cG9ydCB3aWR0aC9oZWlnaHRcbiAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtLCBjYW4gYmUgbnVsbCBvciBJbmZpbml0eVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBwZXJzcGVjdGl2ZVpPIChvdXQsIGZvdnksIGFzcGVjdCwgbmVhciwgZmFyKSB7XG4gIGNvbnN0IGYgPSAxLjAgLyBNYXRoLnRhbihmb3Z5IC8gMilcbiAgb3V0WzBdID0gZiAvIGFzcGVjdFxuICBvdXRbMV0gPSAwXG4gIG91dFsyXSA9IDBcbiAgb3V0WzNdID0gMFxuICBvdXRbNF0gPSAwXG4gIG91dFs1XSA9IGZcbiAgb3V0WzZdID0gMFxuICBvdXRbN10gPSAwXG4gIG91dFs4XSA9IDBcbiAgb3V0WzldID0gMFxuICBvdXRbMTFdID0gLTFcbiAgb3V0WzEyXSA9IDBcbiAgb3V0WzEzXSA9IDBcbiAgb3V0WzE1XSA9IDBcblxuICBpZiAoZmFyICE9IG51bGwgJiYgZmFyICE9PSBJbmZpbml0eSkge1xuICAgIGNvbnN0IG5mID0gMSAvIChuZWFyIC0gZmFyKVxuICAgIG91dFsxMF0gPSBmYXIgKiBuZlxuICAgIG91dFsxNF0gPSBmYXIgKiBuZWFyICogbmZcbiAgfSBlbHNlIHtcbiAgICBvdXRbMTBdID0gLTFcbiAgICBvdXRbMTRdID0gLW5lYXJcbiAgfVxuXG4gIHJldHVybiBvdXRcbn1cbi8qKlxuICogR2VuZXJhdGVzIGEgcGVyc3BlY3RpdmUgcHJvamVjdGlvbiBtYXRyaXggd2l0aCB0aGUgZ2l2ZW4gZmllbGQgb2Ygdmlldy5cbiAqIFRoaXMgaXMgcHJpbWFyaWx5IHVzZWZ1bCBmb3IgZ2VuZXJhdGluZyBwcm9qZWN0aW9uIG1hdHJpY2VzIHRvIGJlIHVzZWRcbiAqIHdpdGggdGhlIHN0aWxsIGV4cGVyaWVtZW50YWwgV2ViVlIgQVBJLlxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cbiAqIEBwYXJhbSB7T2JqZWN0fSBmb3YgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZyB2YWx1ZXM6IHVwRGVncmVlcywgZG93bkRlZ3JlZXMsIGxlZnREZWdyZWVzLCByaWdodERlZ3JlZXNcbiAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHBlcnNwZWN0aXZlRnJvbUZpZWxkT2ZWaWV3IChvdXQsIGZvdiwgbmVhciwgZmFyKSB7XG4gIGNvbnN0IHVwVGFuID0gTWF0aC50YW4oZm92LnVwRGVncmVlcyAqIE1hdGguUEkgLyAxODAuMClcbiAgY29uc3QgZG93blRhbiA9IE1hdGgudGFuKGZvdi5kb3duRGVncmVlcyAqIE1hdGguUEkgLyAxODAuMClcbiAgY29uc3QgbGVmdFRhbiA9IE1hdGgudGFuKGZvdi5sZWZ0RGVncmVlcyAqIE1hdGguUEkgLyAxODAuMClcbiAgY29uc3QgcmlnaHRUYW4gPSBNYXRoLnRhbihmb3YucmlnaHREZWdyZWVzICogTWF0aC5QSSAvIDE4MC4wKVxuICBjb25zdCB4U2NhbGUgPSAyLjAgLyAobGVmdFRhbiArIHJpZ2h0VGFuKVxuICBjb25zdCB5U2NhbGUgPSAyLjAgLyAodXBUYW4gKyBkb3duVGFuKVxuICBvdXRbMF0gPSB4U2NhbGVcbiAgb3V0WzFdID0gMC4wXG4gIG91dFsyXSA9IDAuMFxuICBvdXRbM10gPSAwLjBcbiAgb3V0WzRdID0gMC4wXG4gIG91dFs1XSA9IHlTY2FsZVxuICBvdXRbNl0gPSAwLjBcbiAgb3V0WzddID0gMC4wXG4gIG91dFs4XSA9IC0oKGxlZnRUYW4gLSByaWdodFRhbikgKiB4U2NhbGUgKiAwLjUpXG4gIG91dFs5XSA9ICh1cFRhbiAtIGRvd25UYW4pICogeVNjYWxlICogMC41XG4gIG91dFsxMF0gPSBmYXIgLyAobmVhciAtIGZhcilcbiAgb3V0WzExXSA9IC0xLjBcbiAgb3V0WzEyXSA9IDAuMFxuICBvdXRbMTNdID0gMC4wXG4gIG91dFsxNF0gPSBmYXIgKiBuZWFyIC8gKG5lYXIgLSBmYXIpXG4gIG91dFsxNV0gPSAwLjBcbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBvcnRob2dvbmFsIHByb2plY3Rpb24gbWF0cml4IHdpdGggdGhlIGdpdmVuIGJvdW5kcy5cbiAqIFRoZSBuZWFyL2ZhciBjbGlwIHBsYW5lcyBjb3JyZXNwb25kIHRvIGEgbm9ybWFsaXplZCBkZXZpY2UgY29vcmRpbmF0ZSBaIHJhbmdlIG9mIFstMSwgMV0sXG4gKiB3aGljaCBtYXRjaGVzIFdlYkdML09wZW5HTCdzIGNsaXAgdm9sdW1lLlxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IExlZnQgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSByaWdodCBSaWdodCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtudW1iZXJ9IGJvdHRvbSBCb3R0b20gYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3AgVG9wIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge251bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge251bWJlcn0gZmFyIEZhciBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBvcnRob05PIChvdXQsIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XG4gIGNvbnN0IGxyID0gMSAvIChsZWZ0IC0gcmlnaHQpXG4gIGNvbnN0IGJ0ID0gMSAvIChib3R0b20gLSB0b3ApXG4gIGNvbnN0IG5mID0gMSAvIChuZWFyIC0gZmFyKVxuICBvdXRbMF0gPSAtMiAqIGxyXG4gIG91dFsxXSA9IDBcbiAgb3V0WzJdID0gMFxuICBvdXRbM10gPSAwXG4gIG91dFs0XSA9IDBcbiAgb3V0WzVdID0gLTIgKiBidFxuICBvdXRbNl0gPSAwXG4gIG91dFs3XSA9IDBcbiAgb3V0WzhdID0gMFxuICBvdXRbOV0gPSAwXG4gIG91dFsxMF0gPSAyICogbmZcbiAgb3V0WzExXSA9IDBcbiAgb3V0WzEyXSA9IChsZWZ0ICsgcmlnaHQpICogbHJcbiAgb3V0WzEzXSA9ICh0b3AgKyBib3R0b20pICogYnRcbiAgb3V0WzE0XSA9IChmYXIgKyBuZWFyKSAqIG5mXG4gIG91dFsxNV0gPSAxXG4gIHJldHVybiBvdXRcbn1cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayBtYXQ0Lm9ydGhvTk99XG4gKiBAZnVuY3Rpb25cbiAqL1xuXG5leHBvcnQgdmFyIG9ydGhvID0gb3J0aG9OT1xuLyoqXG4gKiBHZW5lcmF0ZXMgYSBvcnRob2dvbmFsIHByb2plY3Rpb24gbWF0cml4IHdpdGggdGhlIGdpdmVuIGJvdW5kcy5cbiAqIFRoZSBuZWFyL2ZhciBjbGlwIHBsYW5lcyBjb3JyZXNwb25kIHRvIGEgbm9ybWFsaXplZCBkZXZpY2UgY29vcmRpbmF0ZSBaIHJhbmdlIG9mIFswLCAxXSxcbiAqIHdoaWNoIG1hdGNoZXMgV2ViR1BVL1Z1bGthbi9EaXJlY3RYL01ldGFsJ3MgY2xpcCB2b2x1bWUuXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xuICogQHBhcmFtIHtudW1iZXJ9IGxlZnQgTGVmdCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtudW1iZXJ9IHJpZ2h0IFJpZ2h0IGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge251bWJlcn0gYm90dG9tIEJvdHRvbSBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtudW1iZXJ9IHRvcCBUb3AgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIG9ydGhvWk8gKG91dCwgbGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpIHtcbiAgY29uc3QgbHIgPSAxIC8gKGxlZnQgLSByaWdodClcbiAgY29uc3QgYnQgPSAxIC8gKGJvdHRvbSAtIHRvcClcbiAgY29uc3QgbmYgPSAxIC8gKG5lYXIgLSBmYXIpXG4gIG91dFswXSA9IC0yICogbHJcbiAgb3V0WzFdID0gMFxuICBvdXRbMl0gPSAwXG4gIG91dFszXSA9IDBcbiAgb3V0WzRdID0gMFxuICBvdXRbNV0gPSAtMiAqIGJ0XG4gIG91dFs2XSA9IDBcbiAgb3V0WzddID0gMFxuICBvdXRbOF0gPSAwXG4gIG91dFs5XSA9IDBcbiAgb3V0WzEwXSA9IG5mXG4gIG91dFsxMV0gPSAwXG4gIG91dFsxMl0gPSAobGVmdCArIHJpZ2h0KSAqIGxyXG4gIG91dFsxM10gPSAodG9wICsgYm90dG9tKSAqIGJ0XG4gIG91dFsxNF0gPSBuZWFyICogbmZcbiAgb3V0WzE1XSA9IDFcbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBsb29rLWF0IG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBleWUgcG9zaXRpb24sIGZvY2FsIHBvaW50LCBhbmQgdXAgYXhpcy5cbiAqIElmIHlvdSB3YW50IGEgbWF0cml4IHRoYXQgYWN0dWFsbHkgbWFrZXMgYW4gb2JqZWN0IGxvb2sgYXQgYW5vdGhlciBvYmplY3QsIHlvdSBzaG91bGQgdXNlIHRhcmdldFRvIGluc3RlYWQuXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IGV5ZSBQb3NpdGlvbiBvZiB0aGUgdmlld2VyXG4gKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gY2VudGVyIFBvaW50IHRoZSB2aWV3ZXIgaXMgbG9va2luZyBhdFxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IHVwIHZlYzMgcG9pbnRpbmcgdXBcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gbG9va0F0IChvdXQsIGV5ZSwgY2VudGVyLCB1cCkge1xuICBsZXQgeDAsIHgxLCB4MiwgeTAsIHkxLCB5MiwgejAsIHoxLCB6MiwgbGVuXG4gIGNvbnN0IGV5ZXggPSBleWVbMF1cbiAgY29uc3QgZXlleSA9IGV5ZVsxXVxuICBjb25zdCBleWV6ID0gZXllWzJdXG4gIGNvbnN0IHVweCA9IHVwWzBdXG4gIGNvbnN0IHVweSA9IHVwWzFdXG4gIGNvbnN0IHVweiA9IHVwWzJdXG4gIGNvbnN0IGNlbnRlcnggPSBjZW50ZXJbMF1cbiAgY29uc3QgY2VudGVyeSA9IGNlbnRlclsxXVxuICBjb25zdCBjZW50ZXJ6ID0gY2VudGVyWzJdXG5cbiAgaWYgKE1hdGguYWJzKGV5ZXggLSBjZW50ZXJ4KSA8IGdsTWF0cml4LkVQU0lMT04gJiYgTWF0aC5hYnMoZXlleSAtIGNlbnRlcnkpIDwgZ2xNYXRyaXguRVBTSUxPTiAmJiBNYXRoLmFicyhleWV6IC0gY2VudGVyeikgPCBnbE1hdHJpeC5FUFNJTE9OKSB7XG4gICAgcmV0dXJuIGlkZW50aXR5KG91dClcbiAgfVxuXG4gIHowID0gZXlleCAtIGNlbnRlcnhcbiAgejEgPSBleWV5IC0gY2VudGVyeVxuICB6MiA9IGV5ZXogLSBjZW50ZXJ6XG4gIGxlbiA9IDEgLyBNYXRoLmh5cG90KHowLCB6MSwgejIpXG4gIHowICo9IGxlblxuICB6MSAqPSBsZW5cbiAgejIgKj0gbGVuXG4gIHgwID0gdXB5ICogejIgLSB1cHogKiB6MVxuICB4MSA9IHVweiAqIHowIC0gdXB4ICogejJcbiAgeDIgPSB1cHggKiB6MSAtIHVweSAqIHowXG4gIGxlbiA9IE1hdGguaHlwb3QoeDAsIHgxLCB4MilcblxuICBpZiAoIWxlbikge1xuICAgIHgwID0gMFxuICAgIHgxID0gMFxuICAgIHgyID0gMFxuICB9IGVsc2Uge1xuICAgIGxlbiA9IDEgLyBsZW5cbiAgICB4MCAqPSBsZW5cbiAgICB4MSAqPSBsZW5cbiAgICB4MiAqPSBsZW5cbiAgfVxuXG4gIHkwID0gejEgKiB4MiAtIHoyICogeDFcbiAgeTEgPSB6MiAqIHgwIC0gejAgKiB4MlxuICB5MiA9IHowICogeDEgLSB6MSAqIHgwXG4gIGxlbiA9IE1hdGguaHlwb3QoeTAsIHkxLCB5MilcblxuICBpZiAoIWxlbikge1xuICAgIHkwID0gMFxuICAgIHkxID0gMFxuICAgIHkyID0gMFxuICB9IGVsc2Uge1xuICAgIGxlbiA9IDEgLyBsZW5cbiAgICB5MCAqPSBsZW5cbiAgICB5MSAqPSBsZW5cbiAgICB5MiAqPSBsZW5cbiAgfVxuXG4gIG91dFswXSA9IHgwXG4gIG91dFsxXSA9IHkwXG4gIG91dFsyXSA9IHowXG4gIG91dFszXSA9IDBcbiAgb3V0WzRdID0geDFcbiAgb3V0WzVdID0geTFcbiAgb3V0WzZdID0gejFcbiAgb3V0WzddID0gMFxuICBvdXRbOF0gPSB4MlxuICBvdXRbOV0gPSB5MlxuICBvdXRbMTBdID0gejJcbiAgb3V0WzExXSA9IDBcbiAgb3V0WzEyXSA9IC0oeDAgKiBleWV4ICsgeDEgKiBleWV5ICsgeDIgKiBleWV6KVxuICBvdXRbMTNdID0gLSh5MCAqIGV5ZXggKyB5MSAqIGV5ZXkgKyB5MiAqIGV5ZXopXG4gIG91dFsxNF0gPSAtKHowICogZXlleCArIHoxICogZXlleSArIHoyICogZXlleilcbiAgb3V0WzE1XSA9IDFcbiAgcmV0dXJuIG91dFxufVxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBtYXRyaXggdGhhdCBtYWtlcyBzb21ldGhpbmcgbG9vayBhdCBzb21ldGhpbmcgZWxzZS5cbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXG4gKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gZXllIFBvc2l0aW9uIG9mIHRoZSB2aWV3ZXJcbiAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSBjZW50ZXIgUG9pbnQgdGhlIHZpZXdlciBpcyBsb29raW5nIGF0XG4gKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gdXAgdmVjMyBwb2ludGluZyB1cFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiB0YXJnZXRUbyAob3V0LCBleWUsIHRhcmdldCwgdXApIHtcbiAgY29uc3QgZXlleCA9IGV5ZVswXVxuICAgICAgY29uc3QgZXlleSA9IGV5ZVsxXVxuICAgICAgY29uc3QgZXlleiA9IGV5ZVsyXVxuICAgICAgY29uc3QgdXB4ID0gdXBbMF1cbiAgICAgIGNvbnN0IHVweSA9IHVwWzFdXG4gICAgICBjb25zdCB1cHogPSB1cFsyXVxuICBsZXQgejAgPSBleWV4IC0gdGFyZ2V0WzBdXG4gICAgICBsZXQgejEgPSBleWV5IC0gdGFyZ2V0WzFdXG4gICAgICBsZXQgejIgPSBleWV6IC0gdGFyZ2V0WzJdXG4gIGxldCBsZW4gPSB6MCAqIHowICsgejEgKiB6MSArIHoyICogejJcblxuICBpZiAobGVuID4gMCkge1xuICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKVxuICAgIHowICo9IGxlblxuICAgIHoxICo9IGxlblxuICAgIHoyICo9IGxlblxuICB9XG5cbiAgbGV0IHgwID0gdXB5ICogejIgLSB1cHogKiB6MVxuICAgICAgbGV0IHgxID0gdXB6ICogejAgLSB1cHggKiB6MlxuICAgICAgbGV0IHgyID0gdXB4ICogejEgLSB1cHkgKiB6MFxuICBsZW4gPSB4MCAqIHgwICsgeDEgKiB4MSArIHgyICogeDJcblxuICBpZiAobGVuID4gMCkge1xuICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKVxuICAgIHgwICo9IGxlblxuICAgIHgxICo9IGxlblxuICAgIHgyICo9IGxlblxuICB9XG5cbiAgb3V0WzBdID0geDBcbiAgb3V0WzFdID0geDFcbiAgb3V0WzJdID0geDJcbiAgb3V0WzNdID0gMFxuICBvdXRbNF0gPSB6MSAqIHgyIC0gejIgKiB4MVxuICBvdXRbNV0gPSB6MiAqIHgwIC0gejAgKiB4MlxuICBvdXRbNl0gPSB6MCAqIHgxIC0gejEgKiB4MFxuICBvdXRbN10gPSAwXG4gIG91dFs4XSA9IHowXG4gIG91dFs5XSA9IHoxXG4gIG91dFsxMF0gPSB6MlxuICBvdXRbMTFdID0gMFxuICBvdXRbMTJdID0gZXlleFxuICBvdXRbMTNdID0gZXlleVxuICBvdXRbMTRdID0gZXllelxuICBvdXRbMTVdID0gMVxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBtYXQ0XG4gKlxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGEgbWF0cml4IHRvIHJlcHJlc2VudCBhcyBhIHN0cmluZ1xuICogQHJldHVybnMge1N0cmluZ30gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXhcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gc3RyIChhKSB7XG4gIHJldHVybiAnbWF0NCgnICsgYVswXSArICcsICcgKyBhWzFdICsgJywgJyArIGFbMl0gKyAnLCAnICsgYVszXSArICcsICcgKyBhWzRdICsgJywgJyArIGFbNV0gKyAnLCAnICsgYVs2XSArICcsICcgKyBhWzddICsgJywgJyArIGFbOF0gKyAnLCAnICsgYVs5XSArICcsICcgKyBhWzEwXSArICcsICcgKyBhWzExXSArICcsICcgKyBhWzEyXSArICcsICcgKyBhWzEzXSArICcsICcgKyBhWzE0XSArICcsICcgKyBhWzE1XSArICcpJ1xufVxuLyoqXG4gKiBSZXR1cm5zIEZyb2Jlbml1cyBub3JtIG9mIGEgbWF0NFxuICpcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIHRoZSBtYXRyaXggdG8gY2FsY3VsYXRlIEZyb2Jlbml1cyBub3JtIG9mXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBGcm9iZW5pdXMgbm9ybVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9iIChhKSB7XG4gIHJldHVybiBNYXRoLmh5cG90KGFbMF0sIGFbMV0sIGFbMl0sIGFbM10sIGFbNF0sIGFbNV0sIGFbNl0sIGFbN10sIGFbOF0sIGFbOV0sIGFbMTBdLCBhWzExXSwgYVsxMl0sIGFbMTNdLCBhWzE0XSwgYVsxNV0pXG59XG4vKipcbiAqIEFkZHMgdHdvIG1hdDQnc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZCAob3V0LCBhLCBiKSB7XG4gIG91dFswXSA9IGFbMF0gKyBiWzBdXG4gIG91dFsxXSA9IGFbMV0gKyBiWzFdXG4gIG91dFsyXSA9IGFbMl0gKyBiWzJdXG4gIG91dFszXSA9IGFbM10gKyBiWzNdXG4gIG91dFs0XSA9IGFbNF0gKyBiWzRdXG4gIG91dFs1XSA9IGFbNV0gKyBiWzVdXG4gIG91dFs2XSA9IGFbNl0gKyBiWzZdXG4gIG91dFs3XSA9IGFbN10gKyBiWzddXG4gIG91dFs4XSA9IGFbOF0gKyBiWzhdXG4gIG91dFs5XSA9IGFbOV0gKyBiWzldXG4gIG91dFsxMF0gPSBhWzEwXSArIGJbMTBdXG4gIG91dFsxMV0gPSBhWzExXSArIGJbMTFdXG4gIG91dFsxMl0gPSBhWzEyXSArIGJbMTJdXG4gIG91dFsxM10gPSBhWzEzXSArIGJbMTNdXG4gIG91dFsxNF0gPSBhWzE0XSArIGJbMTRdXG4gIG91dFsxNV0gPSBhWzE1XSArIGJbMTVdXG4gIHJldHVybiBvdXRcbn1cbi8qKlxuICogU3VidHJhY3RzIG1hdHJpeCBiIGZyb20gbWF0cml4IGFcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJ0cmFjdCAob3V0LCBhLCBiKSB7XG4gIG91dFswXSA9IGFbMF0gLSBiWzBdXG4gIG91dFsxXSA9IGFbMV0gLSBiWzFdXG4gIG91dFsyXSA9IGFbMl0gLSBiWzJdXG4gIG91dFszXSA9IGFbM10gLSBiWzNdXG4gIG91dFs0XSA9IGFbNF0gLSBiWzRdXG4gIG91dFs1XSA9IGFbNV0gLSBiWzVdXG4gIG91dFs2XSA9IGFbNl0gLSBiWzZdXG4gIG91dFs3XSA9IGFbN10gLSBiWzddXG4gIG91dFs4XSA9IGFbOF0gLSBiWzhdXG4gIG91dFs5XSA9IGFbOV0gLSBiWzldXG4gIG91dFsxMF0gPSBhWzEwXSAtIGJbMTBdXG4gIG91dFsxMV0gPSBhWzExXSAtIGJbMTFdXG4gIG91dFsxMl0gPSBhWzEyXSAtIGJbMTJdXG4gIG91dFsxM10gPSBhWzEzXSAtIGJbMTNdXG4gIG91dFsxNF0gPSBhWzE0XSAtIGJbMTRdXG4gIG91dFsxNV0gPSBhWzE1XSAtIGJbMTVdXG4gIHJldHVybiBvdXRcbn1cbi8qKlxuICogTXVsdGlwbHkgZWFjaCBlbGVtZW50IG9mIHRoZSBtYXRyaXggYnkgYSBzY2FsYXIuXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIHRoZSBtYXRyaXggdG8gc2NhbGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBiIGFtb3VudCB0byBzY2FsZSB0aGUgbWF0cml4J3MgZWxlbWVudHMgYnlcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gbXVsdGlwbHlTY2FsYXIgKG91dCwgYSwgYikge1xuICBvdXRbMF0gPSBhWzBdICogYlxuICBvdXRbMV0gPSBhWzFdICogYlxuICBvdXRbMl0gPSBhWzJdICogYlxuICBvdXRbM10gPSBhWzNdICogYlxuICBvdXRbNF0gPSBhWzRdICogYlxuICBvdXRbNV0gPSBhWzVdICogYlxuICBvdXRbNl0gPSBhWzZdICogYlxuICBvdXRbN10gPSBhWzddICogYlxuICBvdXRbOF0gPSBhWzhdICogYlxuICBvdXRbOV0gPSBhWzldICogYlxuICBvdXRbMTBdID0gYVsxMF0gKiBiXG4gIG91dFsxMV0gPSBhWzExXSAqIGJcbiAgb3V0WzEyXSA9IGFbMTJdICogYlxuICBvdXRbMTNdID0gYVsxM10gKiBiXG4gIG91dFsxNF0gPSBhWzE0XSAqIGJcbiAgb3V0WzE1XSA9IGFbMTVdICogYlxuICByZXR1cm4gb3V0XG59XG4vKipcbiAqIEFkZHMgdHdvIG1hdDQncyBhZnRlciBtdWx0aXBseWluZyBlYWNoIGVsZW1lbnQgb2YgdGhlIHNlY29uZCBvcGVyYW5kIGJ5IGEgc2NhbGFyIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgdGhlIGFtb3VudCB0byBzY2FsZSBiJ3MgZWxlbWVudHMgYnkgYmVmb3JlIGFkZGluZ1xuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBtdWx0aXBseVNjYWxhckFuZEFkZCAob3V0LCBhLCBiLCBzY2FsZSkge1xuICBvdXRbMF0gPSBhWzBdICsgYlswXSAqIHNjYWxlXG4gIG91dFsxXSA9IGFbMV0gKyBiWzFdICogc2NhbGVcbiAgb3V0WzJdID0gYVsyXSArIGJbMl0gKiBzY2FsZVxuICBvdXRbM10gPSBhWzNdICsgYlszXSAqIHNjYWxlXG4gIG91dFs0XSA9IGFbNF0gKyBiWzRdICogc2NhbGVcbiAgb3V0WzVdID0gYVs1XSArIGJbNV0gKiBzY2FsZVxuICBvdXRbNl0gPSBhWzZdICsgYls2XSAqIHNjYWxlXG4gIG91dFs3XSA9IGFbN10gKyBiWzddICogc2NhbGVcbiAgb3V0WzhdID0gYVs4XSArIGJbOF0gKiBzY2FsZVxuICBvdXRbOV0gPSBhWzldICsgYls5XSAqIHNjYWxlXG4gIG91dFsxMF0gPSBhWzEwXSArIGJbMTBdICogc2NhbGVcbiAgb3V0WzExXSA9IGFbMTFdICsgYlsxMV0gKiBzY2FsZVxuICBvdXRbMTJdID0gYVsxMl0gKyBiWzEyXSAqIHNjYWxlXG4gIG91dFsxM10gPSBhWzEzXSArIGJbMTNdICogc2NhbGVcbiAgb3V0WzE0XSA9IGFbMTRdICsgYlsxNF0gKiBzY2FsZVxuICBvdXRbMTVdID0gYVsxNV0gKyBiWzE1XSAqIHNjYWxlXG4gIHJldHVybiBvdXRcbn1cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgbWF0cmljZXMgaGF2ZSBleGFjdGx5IHRoZSBzYW1lIGVsZW1lbnRzIGluIHRoZSBzYW1lIHBvc2l0aW9uICh3aGVuIGNvbXBhcmVkIHdpdGggPT09KVxuICpcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIFRoZSBmaXJzdCBtYXRyaXguXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYiBUaGUgc2Vjb25kIG1hdHJpeC5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBtYXRyaWNlcyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZXhhY3RFcXVhbHMgKGEsIGIpIHtcbiAgcmV0dXJuIGFbMF0gPT09IGJbMF0gJiYgYVsxXSA9PT0gYlsxXSAmJiBhWzJdID09PSBiWzJdICYmIGFbM10gPT09IGJbM10gJiYgYVs0XSA9PT0gYls0XSAmJiBhWzVdID09PSBiWzVdICYmIGFbNl0gPT09IGJbNl0gJiYgYVs3XSA9PT0gYls3XSAmJiBhWzhdID09PSBiWzhdICYmIGFbOV0gPT09IGJbOV0gJiYgYVsxMF0gPT09IGJbMTBdICYmIGFbMTFdID09PSBiWzExXSAmJiBhWzEyXSA9PT0gYlsxMl0gJiYgYVsxM10gPT09IGJbMTNdICYmIGFbMTRdID09PSBiWzE0XSAmJiBhWzE1XSA9PT0gYlsxNV1cbn1cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgbWF0cmljZXMgaGF2ZSBhcHByb3hpbWF0ZWx5IHRoZSBzYW1lIGVsZW1lbnRzIGluIHRoZSBzYW1lIHBvc2l0aW9uLlxuICpcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIFRoZSBmaXJzdCBtYXRyaXguXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYiBUaGUgc2Vjb25kIG1hdHJpeC5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBtYXRyaWNlcyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZXF1YWxzIChhLCBiKSB7XG4gIGNvbnN0IGEwID0gYVswXVxuICAgICAgY29uc3QgYTEgPSBhWzFdXG4gICAgICBjb25zdCBhMiA9IGFbMl1cbiAgICAgIGNvbnN0IGEzID0gYVszXVxuICBjb25zdCBhNCA9IGFbNF1cbiAgICAgIGNvbnN0IGE1ID0gYVs1XVxuICAgICAgY29uc3QgYTYgPSBhWzZdXG4gICAgICBjb25zdCBhNyA9IGFbN11cbiAgY29uc3QgYTggPSBhWzhdXG4gICAgICBjb25zdCBhOSA9IGFbOV1cbiAgICAgIGNvbnN0IGExMCA9IGFbMTBdXG4gICAgICBjb25zdCBhMTEgPSBhWzExXVxuICBjb25zdCBhMTIgPSBhWzEyXVxuICAgICAgY29uc3QgYTEzID0gYVsxM11cbiAgICAgIGNvbnN0IGExNCA9IGFbMTRdXG4gICAgICBjb25zdCBhMTUgPSBhWzE1XVxuICBjb25zdCBiMCA9IGJbMF1cbiAgICAgIGNvbnN0IGIxID0gYlsxXVxuICAgICAgY29uc3QgYjIgPSBiWzJdXG4gICAgICBjb25zdCBiMyA9IGJbM11cbiAgY29uc3QgYjQgPSBiWzRdXG4gICAgICBjb25zdCBiNSA9IGJbNV1cbiAgICAgIGNvbnN0IGI2ID0gYls2XVxuICAgICAgY29uc3QgYjcgPSBiWzddXG4gIGNvbnN0IGI4ID0gYls4XVxuICAgICAgY29uc3QgYjkgPSBiWzldXG4gICAgICBjb25zdCBiMTAgPSBiWzEwXVxuICAgICAgY29uc3QgYjExID0gYlsxMV1cbiAgY29uc3QgYjEyID0gYlsxMl1cbiAgICAgIGNvbnN0IGIxMyA9IGJbMTNdXG4gICAgICBjb25zdCBiMTQgPSBiWzE0XVxuICAgICAgY29uc3QgYjE1ID0gYlsxNV1cbiAgcmV0dXJuIE1hdGguYWJzKGEwIC0gYjApIDw9IGdsTWF0cml4LkVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEwKSwgTWF0aC5hYnMoYjApKSAmJiBNYXRoLmFicyhhMSAtIGIxKSA8PSBnbE1hdHJpeC5FUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMSksIE1hdGguYWJzKGIxKSkgJiYgTWF0aC5hYnMoYTIgLSBiMikgPD0gZ2xNYXRyaXguRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTIpLCBNYXRoLmFicyhiMikpICYmIE1hdGguYWJzKGEzIC0gYjMpIDw9IGdsTWF0cml4LkVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEzKSwgTWF0aC5hYnMoYjMpKSAmJiBNYXRoLmFicyhhNCAtIGI0KSA8PSBnbE1hdHJpeC5FUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhNCksIE1hdGguYWJzKGI0KSkgJiYgTWF0aC5hYnMoYTUgLSBiNSkgPD0gZ2xNYXRyaXguRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTUpLCBNYXRoLmFicyhiNSkpICYmIE1hdGguYWJzKGE2IC0gYjYpIDw9IGdsTWF0cml4LkVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGE2KSwgTWF0aC5hYnMoYjYpKSAmJiBNYXRoLmFicyhhNyAtIGI3KSA8PSBnbE1hdHJpeC5FUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhNyksIE1hdGguYWJzKGI3KSkgJiYgTWF0aC5hYnMoYTggLSBiOCkgPD0gZ2xNYXRyaXguRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTgpLCBNYXRoLmFicyhiOCkpICYmIE1hdGguYWJzKGE5IC0gYjkpIDw9IGdsTWF0cml4LkVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGE5KSwgTWF0aC5hYnMoYjkpKSAmJiBNYXRoLmFicyhhMTAgLSBiMTApIDw9IGdsTWF0cml4LkVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGExMCksIE1hdGguYWJzKGIxMCkpICYmIE1hdGguYWJzKGExMSAtIGIxMSkgPD0gZ2xNYXRyaXguRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTExKSwgTWF0aC5hYnMoYjExKSkgJiYgTWF0aC5hYnMoYTEyIC0gYjEyKSA8PSBnbE1hdHJpeC5FUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMTIpLCBNYXRoLmFicyhiMTIpKSAmJiBNYXRoLmFicyhhMTMgLSBiMTMpIDw9IGdsTWF0cml4LkVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGExMyksIE1hdGguYWJzKGIxMykpICYmIE1hdGguYWJzKGExNCAtIGIxNCkgPD0gZ2xNYXRyaXguRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTE0KSwgTWF0aC5hYnMoYjE0KSkgJiYgTWF0aC5hYnMoYTE1IC0gYjE1KSA8PSBnbE1hdHJpeC5FUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMTUpLCBNYXRoLmFicyhiMTUpKVxufVxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIG1hdDQubXVsdGlwbHl9XG4gKiBAZnVuY3Rpb25cbiAqL1xuXG5leHBvcnQgdmFyIG11bCA9IG11bHRpcGx5XG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgbWF0NC5zdWJ0cmFjdH1cbiAqIEBmdW5jdGlvblxuICovXG5cbmV4cG9ydCB2YXIgc3ViID0gc3VidHJhY3RcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=