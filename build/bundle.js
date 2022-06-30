/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/canvas/canvasCore.ts":
/*!**************************************!*\
  !*** ./src/app/canvas/canvasCore.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDomain = exports.canvasDrawFunction = exports.canvasDraw = exports.initCanvas = exports.mainCanvas = void 0;
const utils_1 = __webpack_require__(/*! ../utils */ "./src/app/utils.ts");
const index_1 = __webpack_require__(/*! ../../index */ "./src/index.ts");
const userInteract_1 = __webpack_require__(/*! ../ui/userInteract */ "./src/app/ui/userInteract.ts");
const constantEval_1 = __webpack_require__(/*! ../core/constantEval */ "./src/app/core/constantEval.ts");
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
};
exports.initCanvas = initCanvas;
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
    if (!ctx)
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
        const f = (0, constantEval_1.constantEvalX)(ast, x);
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
            return node.op.val;
        case lexer_1.Token.CONST:
            if (typeof node.op.val !== 'number') {
                return reportError('Token CONSTANT must be a number');
            }
            return node.op.val;
        case lexer_1.Token.VAR:
            if (x == null) {
                return reportError('Token VARIABLE is not allowed');
            }
            return x;
        case lexer_1.Token.VAR2:
            return reportError('Token VARIABLE2 is not allowed');
        case lexer_1.Token.TIME:
            (0, index_1.scheduleRedraw)();
            return (0, index_1.getGlobalTime)();
        case lexer_1.Token.ADD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ADDITION');
            }
            return evalNode(node.left) + evalNode(node.right);
        case lexer_1.Token.SUB:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token SUBTRACTION');
            }
            return evalNode(node.left) - evalNode(node.right);
        case lexer_1.Token.MULT:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MULTIPLICATION');
            }
            return evalNode(node.left) * evalNode(node.right);
        case lexer_1.Token.DIV:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token DIVISION');
            }
            return evalNode(node.left) / evalNode(node.right);
        case lexer_1.Token.POW:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token POWER');
            }
            return Math.pow(evalNode(node.left), evalNode(node.right));
        case lexer_1.Token.SQRT:
            if (node.right == null) {
                return reportError('Missing argument for Token SQUARE ROOT');
            }
            return Math.sqrt(evalNode(node.right));
        case lexer_1.Token.LOG:
            if (node.right == null) {
                return reportError('Missing argument for Token LOGARITHM');
            }
            return Math.log(evalNode(node.right));
        case lexer_1.Token.EXP:
            if (node.right == null) {
                return reportError('Missing argument for Token EXPOENTIAL');
            }
            return Math.exp(evalNode(node.right));
        case lexer_1.Token.SIN:
            if (node.right == null) {
                return reportError('Missing argument for Token SINE');
            }
            return Math.sin(evalNode(node.right));
        case lexer_1.Token.COS:
            if (node.right == null) {
                return reportError('Missing argument for Token COSINE');
            }
            return Math.cos(evalNode(node.right));
        case lexer_1.Token.TAN:
            if (node.right == null) {
                return reportError('Missing argument for Token TANGENT');
            }
            return Math.tan(evalNode(node.right));
        case lexer_1.Token.ASIN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC SINE');
            }
            return Math.asin(evalNode(node.right));
        case lexer_1.Token.ACOS:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC COSINE');
            }
            return Math.acos(evalNode(node.right));
        case lexer_1.Token.ATAN:
            if (node.right == null) {
                return reportError('Missing argument for Token ARC TANGENT');
            }
            return Math.atan(evalNode(node.right));
        case lexer_1.Token.FLOOR:
            if (node.right == null) {
                return reportError('Missing argument for Token FLOOR');
            }
            return Math.floor(evalNode(node.right));
        case lexer_1.Token.MIN:
            if (node.right == null) {
                return reportError('Missing argument for Token MIN');
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token MIN');
            }
            return Math.min(...evalNode(node.right));
        case lexer_1.Token.MAX:
            if (node.right == null) {
                return reportError('Missing argument for Token MAX');
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token MAX');
            }
            return Math.max(...evalNode(node.right));
        case lexer_1.Token.DELIM:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token DELIMITER');
            }
            return [evalNode(node.left), evalNode(node.right)];
        case lexer_1.Token.ABS:
            if (node.right == null) {
                return reportError('Missing argument for Token ABSOLUTE');
            }
            return Math.abs(evalNode(node.right));
        case lexer_1.Token.RAND:
            if (node.right == null) {
                return reportError('Missing argument for Token RANDOM');
            }
            return Math.random() * evalNode(node.right);
        case lexer_1.Token.PERLIN: {
            if (node.right == null) {
                return reportError('Missing arguments for Token PERLIN');
            }
            if (!isIterable(evalNode(node.right))) {
                return reportError('Malformed argument for Token PERLIN');
            }
            const [x, y] = evalNode(node.right);
            return (0, utils_1.perlin2)(x, y);
        }
        case lexer_1.Token.MOD:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token MODULUS');
            }
            return evalNode(node.left) % evalNode(node.right);
        case lexer_1.Token.LEVEL_SET:
            return reportError('Token LEVEL SET is not allowed');
        case lexer_1.Token.VECTOR_FIELD:
            return reportError('Token VECTOR FIELD is not allowed');
        case lexer_1.Token.LESS:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN');
            }
            return evalNode(node.left) < evalNode(node.right) ? 1 : 0;
        case lexer_1.Token.GREATER:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN');
            }
            return evalNode(node.left) > evalNode(node.right) ? 1 : 0;
        case lexer_1.Token.LESS_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token LESS THAN OR EQUAL TO');
            }
            return evalNode(node.left) <= evalNode(node.right) ? 1 : 0;
        case lexer_1.Token.GREATER_OR_EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token GREATER THAN OR EQUAL TO');
            }
            return evalNode(node.left) >= evalNode(node.right) ? 1 : 0;
        case lexer_1.Token.EQUAL:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token EQUAL TO');
            }
            return evalNode(node.left) - evalNode(node.right) < 0.00001 ? 1 : 0;
        case lexer_1.Token.AND:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token AND');
            }
            return evalNode(node.left) && evalNode(node.right) ? 1 : 0;
        case lexer_1.Token.OR:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token OR');
            }
            return evalNode(node.left) || evalNode(node.right) ? 1 : 0;
        case lexer_1.Token.USERVAR:
            return (0, lexer_1.getUserVariable)(node.op.val);
        case lexer_1.Token.FACTORIAL:
            if (node.right == null) {
                return reportError('Missing argument for Token FACTORIAL');
            }
            return (0, utils_1.factorial)(evalNode(node.right));
        case lexer_1.Token.SIGMOID:
            if (node.right == null) {
                return reportError('Missing argument for Token SIGMOID');
            }
            return (0, utils_1.sigmoid)(evalNode(node.right));
        case lexer_1.Token.CIRCLE:
            return reportError('Token CIRCLE is not allowed');
        case lexer_1.Token.POINT:
            return reportError('Token POINT is not allowed');
        case lexer_1.Token.TRUE:
            return 1;
        case lexer_1.Token.FALSE:
            return 0;
        case lexer_1.Token.POLAR:
            return reportError('Token POLAR is not allowed');
        case lexer_1.Token.CARTESIAN:
            return reportError('Token CARTESIAN is not allowed');
        case lexer_1.Token.MOUSEX:
            return (0, userInteract_1.getMousePos)().x;
        case lexer_1.Token.MOUSEY:
            return (0, userInteract_1.getMousePos)().y;
        case lexer_1.Token.MOUSE:
            return [(0, userInteract_1.getMousePos)().x, (0, userInteract_1.getMousePos)().y];
        case lexer_1.Token.ASSIGN:
            if (node.left == null || node.right == null) {
                return reportError('Missing arguments for Token ASSIGN');
            }
            if (node.left.op.tok !== lexer_1.Token.ASSIGNABLE) {
                if (node.left.op.tok === lexer_1.Token.USERVAR) {
                    (0, lexer_1.setUserVariable)(node.left.op.val, evalNode(node.right));
                    return evalNode(node.right);
                }
                return reportError('Left side of ASSIGN must be assignable');
            }
            if ((0, lexer_1.getExternVariable)(node.left.op.val) == null) {
                return reportError(`Variable ${node.left.op.val} does not exist`);
            }
            (_a = (0, lexer_1.getExternVariable)(node.left.op.val)) === null || _a === void 0 ? void 0 : _a.set(evalNode(node.right));
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
exports.getPlotsShaderInfo = exports.drawPlots = exports.drivePlots = exports.resetPlots = exports.setNumInputs = exports.setInputAt = void 0;
const index_1 = __webpack_require__(/*! ../../index */ "./src/index.ts");
const canvasCore_1 = __webpack_require__(/*! ../canvas/canvasCore */ "./src/app/canvas/canvasCore.ts");
const defines_1 = __webpack_require__(/*! ../defines */ "./src/app/defines.ts");
const parser_1 = __webpack_require__(/*! ../lang/parser */ "./src/app/lang/parser.ts");
const shaderFunction_1 = __webpack_require__(/*! ../shader/shaderFunction */ "./src/app/shader/shaderFunction.ts");
const leftPanel_1 = __webpack_require__(/*! ../ui/leftPanel */ "./src/app/ui/leftPanel.ts");
const constantEval_1 = __webpack_require__(/*! ./constantEval */ "./src/app/core/constantEval.ts");
const plots = [];
let numInputs = 0;
const setInputAt = (index, value) => {
    if (index < 0 || index > numInputs) {
        return;
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
const getColorFromIndex = (index) => colors[index % colors.length];
const drivePlots = () => {
    for (let i = 1; i <= numInputs; i++) {
        if (!plots[i]) {
            plots[i] = {
                input: '',
                inputChanged: false,
                ast: null,
                status: defines_1.PlotStatus.PENDING,
                driver: defines_1.PlotDriver.CANVAS,
                displayMode: defines_1.PlotDisplayMode.NONE,
                shaderFunction: '',
                color: getColorFromIndex(i),
                error: ''
            };
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
            if (plot.status !== statusBefore) {
                (0, leftPanel_1.inputSetStatusAt)(i, plot.status);
            }
            if (plot.error !== errorBefore) {
                (0, leftPanel_1.inputSetErrorAt)(i, plot.error);
            }
            if (JSON.stringify(astBefore) !== JSON.stringify(plot.ast)) {
                (0, index_1.scheduleRedraw)();
            }
            const numVars = (0, parser_1.parserGetNumVars)();
            const driverBefore = plot.driver;
            switch (numVars) {
                case 0:
                    plot.driver = defines_1.PlotDriver.CONSTANT;
                    break;
                case 1:
                    plot.driver = defines_1.PlotDriver.CANVAS;
                    break;
                case 2:
                    plot.driver = defines_1.PlotDriver.WEBGL;
                    break;
            }
            if (plot.driver !== driverBefore) {
                (0, leftPanel_1.inputSetDriverAt)(i, plot.driver);
            }
            plot.displayMode = (0, parser_1.parserGetDisplayMode)();
            if (plot.driver === defines_1.PlotDriver.WEBGL) {
                plot.shaderFunction = (0, shaderFunction_1.buildShaderFunction)(plot.ast);
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
    }
};
exports.drawPlots = drawPlots;
const getPlotsShaderInfo = () => {
    const shaderFunctions = [];
    const colors = [];
    const displayModes = [];
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
        numPlots++;
    }
    return { functions: shaderFunctions, colors, displayModes, numPlots };
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
    Token[Token["FLOOR"] = 40] = "FLOOR";
    Token[Token["MIN"] = 41] = "MIN";
    Token[Token["MAX"] = 42] = "MAX";
    Token[Token["ABS"] = 43] = "ABS";
    Token[Token["MOD"] = 44] = "MOD";
    Token[Token["RAND"] = 45] = "RAND";
    Token[Token["PERLIN"] = 46] = "PERLIN";
    Token[Token["FACTORIAL"] = 47] = "FACTORIAL";
    Token[Token["SIGMOID"] = 48] = "SIGMOID";
    Token[Token["LEVEL_SET"] = 49] = "LEVEL_SET";
    Token[Token["VECTOR_FIELD"] = 50] = "VECTOR_FIELD";
    Token[Token["CIRCLE"] = 51] = "CIRCLE";
    Token[Token["POINT"] = 52] = "POINT";
    Token[Token["TIME"] = 53] = "TIME";
    Token[Token["COMPLEX"] = 54] = "COMPLEX";
    Token[Token["POLAR"] = 55] = "POLAR";
    Token[Token["CARTESIAN"] = 56] = "CARTESIAN";
    Token[Token["MOUSEX"] = 57] = "MOUSEX";
    Token[Token["MOUSEY"] = 58] = "MOUSEY";
    Token[Token["MOUSE"] = 59] = "MOUSE";
})(Token = exports.Token || (exports.Token = {}));
var TokenFlag;
(function (TokenFlag) {
    TokenFlag[TokenFlag["IMPL_MULT_BEFORE"] = 1] = "IMPL_MULT_BEFORE";
    TokenFlag[TokenFlag["IMPL_MULT_AFTER"] = 2] = "IMPL_MULT_AFTER";
    TokenFlag[TokenFlag["PREFIX"] = 4] = "PREFIX";
    TokenFlag[TokenFlag["UNIQUE"] = 16] = "UNIQUE";
    TokenFlag[TokenFlag["BEGIN_SCOPE"] = 32] = "BEGIN_SCOPE";
    TokenFlag[TokenFlag["END_SCOPE"] = 64] = "END_SCOPE";
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
    y: { tok: Token.VAR2, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
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
    Level: { tok: Token.LEVEL_SET, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
    Niveau: { tok: Token.LEVEL_SET, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
    VectorField: { tok: Token.VECTOR_FIELD, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
    '|': { tok: Token.ABS, flags: TokenFlag.BEGIN_SCOPE | TokenFlag.END_SCOPE },
    Circle: { tok: Token.CIRCLE, flags: TokenFlag.PREFIX },
    Point: { tok: Token.POINT, flags: TokenFlag.PREFIX },
    Polar: { tok: Token.POLAR, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
    Pol: { tok: Token.POLAR, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
    Cartesian: { tok: Token.CARTESIAN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
    Cart: { tok: Token.CARTESIAN, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.PREFIX },
    t: { tok: Token.TIME, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
    mouseX: { tok: Token.MOUSEX, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
    mouseY: { tok: Token.MOUSEY, flags: TokenFlag.IMPL_MULT_BEFORE | TokenFlag.IMPL_MULT_AFTER },
    mouse: { tok: Token.MOUSE, flags: 0 }
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
exports.parse = exports.parserGetDisplayMode = exports.parserGetNumVars = exports.parserGetError = void 0;
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
let latestError = null;
const parserGetError = () => latestError;
exports.parserGetError = parserGetError;
const reportError = (error, position) => {
    console.error(`Error at position ${position}: ${error}`);
    latestError = { desc: error, pos: position };
};
let numVars = 0;
let displayMode = defines_1.PlotDisplayMode.NONE;
const parserGetNumVars = () => numVars;
exports.parserGetNumVars = parserGetNumVars;
const parserGetDisplayMode = () => displayMode;
exports.parserGetDisplayMode = parserGetDisplayMode;
const parse = (input) => {
    latestError = null;
    numVars = 0;
    displayMode = defines_1.PlotDisplayMode.NONE;
    let ops = (0, lexer_1.lex)(input);
    console.debug('Lexer output:', ops);
    const lexerError = (0, lexer_1.lexerGetError)();
    if (lexerError) {
        latestError = JSON.parse(JSON.stringify(lexerError));
        return null;
    }
    numVars = (ops.filter(op => op.tok === lexer_1.Token.VAR).length > 0 ? 1 : 0) +
        (ops.filter(op => op.tok === lexer_1.Token.VAR2).length > 0 ? 1 : 0);
    if (numVars === 0) {
        displayMode = defines_1.PlotDisplayMode.CONSTANT_EVAL;
    }
    else if (numVars === 1) {
        displayMode = defines_1.PlotDisplayMode.FUNCTION_GRAPH;
    }
    else if (numVars === 2) {
        displayMode = defines_1.PlotDisplayMode.SET;
        if (ops.filter(op => op.tok === lexer_1.Token.LEVEL_SET).length > 0) {
            displayMode = defines_1.PlotDisplayMode.LEVEL_SET;
        }
        else if (ops.filter(op => op.tok === lexer_1.Token.VECTOR_FIELD).length > 0) {
            displayMode = defines_1.PlotDisplayMode.VECTOR_FIELD;
        }
    }
    ops = validate(ops);
    console.debug('Validated ops:', ops);
    if (ops == null)
        return null;
    ops = expand(ops);
    console.debug('Expanded ops:', ops);
    if (ops == null)
        return null;
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
exports.shadersDraw = exports.shaderCoreUpdate = exports.initShaderCore = exports.shadersClearAll = void 0;
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
    scheduleReloadShaders();
};
exports.shadersClearAll = shadersClearAll;
const initShaderCore = function () {
    if (!canvas || !ctx) {
        console.error('Failed to initialize WebGL context.');
    }
};
exports.initShaderCore = initShaderCore;
function scheduleReloadShaders() {
    error = false;
    shadersInitialized = false;
    shadersAreInitializing = false;
    (0, index_1.scheduleRedraw)();
}
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
function shaderCoreUpdate() {
    if (!shadersInitialized && !shadersAreInitializing && !error) {
        loadShaders();
        if (error) {
            console.error('Failed to load shaders');
        }
    }
}
exports.shaderCoreUpdate = shaderCoreUpdate;
const shadersDraw = function () {
    shadersInitialized = false;
    loadShaders().then(() => {
        if (!shadersInitialized) {
            console.error('Failed to initialize shaders');
            return;
        }
        drawScene();
    });
};
exports.shadersDraw = shadersDraw;
function injectFunctionsIntoShaderSource(shader) {
    const plots = (0, controller_1.getPlotsShaderInfo)();
    if (plots.numPlots === 0) {
        plots.functions = [];
        plots.colors = [''];
        plots.displayModes = [defines_1.PlotDisplayMode.NONE];
    }
    plots.functions.push('0.0');
    return shader
        .replace(/USER_NUM_FUNC_INJ/g, `${plots.numPlots + 1}`)
        .replace(/USER_FUNC_INJ/g, `float[](${plots.functions.map(f => `(${f})`).join(',')})`)
        .replace(/USER_COL_INJ/g, `${plots.colors.map(c => `"${c}"`).join(',')}`)
        .replace(/USER_DISP_INJ/g, `int[](${plots.displayModes.map(d => `${d}`).join(',')})`);
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

/***/ "./src/app/shader/shaderFunction.ts":
/*!******************************************!*\
  !*** ./src/app/shader/shaderFunction.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildShaderFunction = void 0;
const buildShaderFunction = (ast) => {
    return 'x<y?1.0:0.0';
};
exports.buildShaderFunction = buildShaderFunction;


/***/ }),

/***/ "./src/app/ui/leftPanel.ts":
/*!*********************************!*\
  !*** ./src/app/ui/leftPanel.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.inputSetDriverAt = exports.inputSetStatusAt = exports.inputSetConstEvalAt = exports.inputSetErrorAt = exports.inputSetColorAt = exports.addNewInput = exports.initLeftPanel = void 0;
const index_1 = __webpack_require__(/*! ../../index */ "./src/index.ts");
const controller_1 = __webpack_require__(/*! ../core/controller */ "./src/app/core/controller.ts");
const defines_1 = __webpack_require__(/*! ../defines */ "./src/app/defines.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/app/utils.ts");
const userInteract_1 = __webpack_require__(/*! ./userInteract */ "./src/app/ui/userInteract.ts");
const inputsElt = document.querySelector('.inputs');
const resizeArea = document.querySelector('.resize-left-panel');
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
    constEvalElt.innerText = '= ' + constEval.toString();
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


/***/ }),

/***/ "./src/app/ui/menubar.ts":
/*!*******************************!*\
  !*** ./src/app/ui/menubar.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initMenuBar = void 0;
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
exports.map = exports.sigmoid = exports.factorial = exports.perlin2 = exports.Vector = exports.stringToHTML = void 0;
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
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var RANDOM = Math.random;
var ANGLE_ORDER = "zyx";
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */

function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}
var degree = Math.PI / 180;
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */

function toRadian(a) {
  return a * degree;
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

function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

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

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
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

function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
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

function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a12 = a[6],
        a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function adjoint(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  out[0] = a11 * b11 - a12 * b10 + a13 * b09;
  out[1] = a02 * b10 - a01 * b11 - a03 * b09;
  out[2] = a31 * b05 - a32 * b04 + a33 * b03;
  out[3] = a22 * b04 - a21 * b05 - a23 * b03;
  out[4] = a12 * b08 - a10 * b11 - a13 * b07;
  out[5] = a00 * b11 - a02 * b08 + a03 * b07;
  out[6] = a32 * b02 - a30 * b05 - a33 * b01;
  out[7] = a20 * b05 - a22 * b02 + a23 * b01;
  out[8] = a10 * b10 - a11 * b08 + a13 * b06;
  out[9] = a01 * b08 - a00 * b10 - a03 * b06;
  out[10] = a30 * b04 - a31 * b02 + a33 * b00;
  out[11] = a21 * b02 - a20 * b04 - a23 * b00;
  out[12] = a11 * b07 - a10 * b09 - a12 * b06;
  out[13] = a00 * b09 - a01 * b07 + a02 * b06;
  out[14] = a31 * b01 - a30 * b03 - a32 * b00;
  out[15] = a20 * b03 - a21 * b01 + a22 * b00;
  return out;
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {ReadonlyMat4} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b0 = a00 * a11 - a01 * a10;
  var b1 = a00 * a12 - a02 * a10;
  var b2 = a01 * a12 - a02 * a11;
  var b3 = a20 * a31 - a21 * a30;
  var b4 = a20 * a32 - a22 * a30;
  var b5 = a21 * a32 - a22 * a31;
  var b6 = a00 * b5 - a01 * b4 + a02 * b3;
  var b7 = a10 * b5 - a11 * b4 + a12 * b3;
  var b8 = a20 * b2 - a21 * b1 + a22 * b0;
  var b9 = a30 * b2 - a31 * b1 + a32 * b0; // Calculate the determinant

  return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
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

function rotate(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
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

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
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

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
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

function fromRotation(out, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;

  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c; // Perform rotation-specific matrix multiplication

  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
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

function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
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

function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
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

function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
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

function fromRotationTranslation(out, q, v) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {ReadonlyQuat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */

function fromQuat2(out, a) {
  var translation = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }

  fromRotationTranslation(out, a, translation);
  return out;
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

function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
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

function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
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

function getRotation(out, mat) {
  var scaling = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }

  return out;
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

function decompose(out_r, out_t, out_s, mat) {
  out_t[0] = mat[12];
  out_t[1] = mat[13];
  out_t[2] = mat[14];
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out_s[0] = Math.hypot(m11, m12, m13);
  out_s[1] = Math.hypot(m21, m22, m23);
  out_s[2] = Math.hypot(m31, m32, m33);
  var is1 = 1 / out_s[0];
  var is2 = 1 / out_s[1];
  var is3 = 1 / out_s[2];
  var sm11 = m11 * is1;
  var sm12 = m12 * is2;
  var sm13 = m13 * is3;
  var sm21 = m21 * is1;
  var sm22 = m22 * is2;
  var sm23 = m23 * is3;
  var sm31 = m31 * is1;
  var sm32 = m32 * is2;
  var sm33 = m33 * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out_r[3] = 0.25 * S;
    out_r[0] = (sm23 - sm32) / S;
    out_r[1] = (sm31 - sm13) / S;
    out_r[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
    out_r[3] = (sm23 - sm32) / S;
    out_r[0] = 0.25 * S;
    out_r[1] = (sm12 + sm21) / S;
    out_r[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out_r[3] = (sm31 - sm13) / S;
    out_r[0] = (sm12 + sm21) / S;
    out_r[1] = 0.25 * S;
    out_r[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out_r[3] = (sm12 - sm21) / S;
    out_r[0] = (sm31 + sm13) / S;
    out_r[1] = (sm23 + sm32) / S;
    out_r[2] = 0.25 * S;
  }

  return out_r;
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

function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
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

function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */

function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
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

function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
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

function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    var nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */

var perspective = perspectiveNO;
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

function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    var nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }

  return out;
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

function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = far * near / (near - far);
  out[15] = 0.0;
  return out;
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

function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Alias for {@link mat4.orthoNO}
 * @function
 */

var ortho = orthoNO;
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

function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
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

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON && Math.abs(eyey - centery) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON && Math.abs(eyez - centerz) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
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

function targetTo(out, eye, target, up) {
  var eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];
  var z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];
  var len = z0 * z0 + z1 * z1 + z2 * z2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  var x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
/**
 * Returns a string representation of a mat4
 *
 * @param {ReadonlyMat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
/**
 * Returns Frobenius norm of a mat4
 *
 * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
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

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  out[9] = a[9] + b[9] * scale;
  out[10] = a[10] + b[10] * scale;
  out[11] = a[11] + b[11] * scale;
  out[12] = a[12] + b[12] * scale;
  out[13] = a[13] + b[13] * scale;
  out[14] = a[14] + b[14] * scale;
  out[15] = a[15] + b[15] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var a8 = a[8],
      a9 = a[9],
      a10 = a[10],
      a11 = a[11];
  var a12 = a[12],
      a13 = a[13],
      a14 = a[14],
      a15 = a[15];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  var b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  var b8 = b[8],
      b9 = b[9],
      b10 = b[10],
      b11 = b[11];
  var b12 = b[12],
      b13 = b[13],
      b14 = b[14],
      b15 = b[15];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}
/**
 * Alias for {@link mat4.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link mat4.subtract}
 * @function
 */

var sub = subtract;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TUFBTSxFQUFFO0lBQzlELElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQ3ZELElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQ25ELElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQ2pELElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFO0lBR2hELEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQ2hELEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQ2hELEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7SUFDbEMsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFDaEQsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFDaEQsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFDakQsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtJQUNqQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFO0lBR2pDLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7SUFDbkMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtJQUdyQyxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFDL0UsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQzdFLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRTtJQUM3RSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFFNUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFO0lBQzdFLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRTtJQUM3RSxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFNBQVMs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LEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtJQUNqRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQy9GLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRztJQUM5RixFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUc7SUFDL0YsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHO0lBQzVGLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHO0lBQzdGLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUU7SUFDaEcsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDM0YsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUc7SUFDNUYsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUc7SUFDN0YsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUc7SUFDM0YsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUU1RixNQUFNLElBQUk7SUFLVCxZQUFhLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUMzQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ25DLENBQUM7Q0FDRDtBQUVELE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxRixJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlFLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVsRixNQUFNLElBQUksR0FBRyxVQUFVLElBQVk7SUFDbEMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7UUFDekIsSUFBSSxJQUFJLEtBQUs7S0FDYjtJQUVELElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztJQUN2QixJQUFJLElBQUksR0FBRyxHQUFHLEVBQUU7UUFDZixJQUFJLElBQUksSUFBSSxJQUFJLENBQUM7S0FDakI7SUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzdCLElBQUksQ0FBQztRQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNYLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ3RCO2FBQU07WUFDUCxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQzdCO1FBRUQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUMzQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUN6QztBQUNGLENBQUM7QUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDO0FBRVgsU0FBUyxJQUFJLENBQUUsQ0FBUztJQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDM0MsQ0FBQztBQUVELFNBQVMsSUFBSSxDQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztJQUM3QyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUMzQixDQUFDO0FBRU0sTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFTLEVBQUUsQ0FBUztJQUVwRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFNUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFFcEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7SUFBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUc7SUFHeEIsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakQsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBR3pELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFHakIsT0FBTyxJQUFJLENBQ1YsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ2pCLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUNqQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDVixDQUFDO0FBdEJZLGVBQU8sV0FzQm5CO0FBRUQsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFTO0lBQ3RDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixHQUFHLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxrQkFBa0I7QUFDM0wsQ0FBQztBQUVNLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBUztJQUMzQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNmLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUFFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7O1FBQzdDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTtBQUM1QixDQUFDO0FBUFksaUJBQVMsYUFPckI7QUFFTSxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQVM7SUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFGWSxlQUFPLFdBRW5CO0FBRUQsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFTLEVBQUUsR0FBVyxFQUFFLElBQVk7SUFDL0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQztBQUN4QyxDQUFDO0FBRU0sTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFTLEVBQUUsTUFBYyxFQUFFLEtBQWEsRUFBRSxNQUFjLEVBQUUsS0FBYTtJQUNuRyxPQUFPLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLE1BQU07QUFDbkUsQ0FBQztBQUZZLFdBQUcsT0FFZjs7Ozs7Ozs7Ozs7Ozs7QUNySUQsK0ZBQWtEO0FBQ2xELHlGQUE4QztBQUM5QywwR0FBZ0U7QUFDaEUsd0dBQXdEO0FBQ3hELHNHQUE2RDtBQUM3RCwwR0FBdUY7QUFFdkYsSUFBSSxTQUFTLEdBQUcsSUFBSTtBQUNwQixJQUFJLFNBQVMsR0FBRyxDQUFDO0FBRVYsTUFBTSxjQUFjLEdBQUc7SUFDN0IsU0FBUyxHQUFHLElBQUk7QUFDakIsQ0FBQztBQUZZLHNCQUFjLGtCQUUxQjtBQUVNLE1BQU0sYUFBYSxHQUFHLEdBQVcsRUFBRSxDQUFDLFNBQVM7QUFBdkMscUJBQWEsaUJBQTBCO0FBRXBELE1BQU0sQ0FBQyxNQUFNLEdBQUc7SUFDZixtQ0FBZ0IsR0FBRTtJQUNsQix5QkFBVyxHQUFFO0lBQ2IsNkJBQWEsR0FBRTtJQUNmLDJCQUFVLEdBQUU7SUFDWiwrQkFBYyxHQUFFO0lBRWhCLFFBQVEsRUFBRTtBQUNYLENBQUM7QUFFRCxNQUFNLFFBQVEsR0FBRztJQUNoQixJQUFJLFNBQVMsRUFBRTtRQUNkLFNBQVMsR0FBRyxLQUFLO1FBQ2pCLDJCQUFVLEdBQUU7UUFDWiw0QkFBVyxHQUFFO1FBQ2IsMEJBQVMsR0FBRTtLQUNYO0lBRUQsMkJBQVUsR0FBRTtJQUNaLGlDQUFnQixHQUFFO0lBQ2xCLFNBQVMsSUFBSSxJQUFJO0lBRWpCLHFCQUFxQixDQUFDLFFBQVEsQ0FBQztBQUNoQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2Q0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ0E7QUFDQTtBQUNBO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsV0FBVyw0Q0FBNEM7QUFDdkQ7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRHdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1AsZ0JBQWdCLGtEQUFtQjtBQUNuQztBQUNBLE1BQU0sa0RBQW1CO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQLGdCQUFnQixrREFBbUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsY0FBYztBQUN6QixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ087QUFDUCxnQkFBZ0Isa0RBQW1CO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsY0FBYztBQUN6QixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsY0FBYztBQUN6QixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVyxjQUFjO0FBQ3pCLGFBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsY0FBYztBQUN6QixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsY0FBYztBQUN6QixXQUFXLGNBQWM7QUFDekIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsY0FBYztBQUN6QixXQUFXLGNBQWM7QUFDekIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsY0FBYztBQUN6QixXQUFXLGNBQWM7QUFDekIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQixXQUFXLGNBQWM7QUFDekIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsY0FBYztBQUN6QixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSwrQ0FBZ0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsUUFBUTtBQUNuQixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQixXQUFXLGNBQWM7QUFDekIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsY0FBYztBQUN6QixXQUFXLFFBQVE7QUFDbkIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQixXQUFXLGNBQWM7QUFDekIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsY0FBYztBQUN6QixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsY0FBYztBQUN6QixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSwrQ0FBZ0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ087QUFDUDtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsUUFBUTtBQUNuQixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsY0FBYztBQUN6QixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQixXQUFXLGVBQWU7QUFDMUIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQLHdCQUF3QixrREFBbUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxNQUFNO0FBQ2xCLFlBQVksY0FBYztBQUMxQixZQUFZLE1BQU07QUFDbEI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksTUFBTTtBQUNsQixZQUFZLGNBQWM7QUFDMUIsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsY0FBYztBQUN6QixZQUFZLE1BQU07QUFDbEI7QUFDQTtBQUNPO0FBQ1Asb0JBQW9CLGtEQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxNQUFNO0FBQ2xCLFlBQVksTUFBTTtBQUNsQixZQUFZLE1BQU07QUFDbEIsWUFBWSxjQUFjO0FBQzFCLGFBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsY0FBYztBQUN6QixXQUFXLGNBQWM7QUFDekIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQixXQUFXLE9BQU87QUFDbEIsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsY0FBYztBQUN6QixXQUFXLGNBQWM7QUFDekIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVyxjQUFjO0FBQ3pCO0FBQ0EsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsY0FBYztBQUN6QixXQUFXLGNBQWM7QUFDekIsV0FBVyxjQUFjO0FBQ3pCLGFBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLCtDQUFnQiwrQkFBK0IsK0NBQWdCLCtCQUErQiwrQ0FBZ0I7QUFDL0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQixXQUFXLGNBQWM7QUFDekIsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsY0FBYztBQUN6QixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsY0FBYztBQUN6QixXQUFXLGNBQWM7QUFDekIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQixXQUFXLGNBQWM7QUFDekIsV0FBVyxjQUFjO0FBQ3pCLGFBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsUUFBUTtBQUNuQixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsY0FBYztBQUN6QixXQUFXLGNBQWM7QUFDekIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekIsV0FBVyxjQUFjO0FBQ3pCLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsY0FBYztBQUN6QixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QiwrQ0FBZ0IscUVBQXFFLCtDQUFnQixxRUFBcUUsK0NBQWdCLHFFQUFxRSwrQ0FBZ0IscUVBQXFFLCtDQUFnQixxRUFBcUUsK0NBQWdCLHFFQUFxRSwrQ0FBZ0IscUVBQXFFLCtDQUFnQixxRUFBcUUsK0NBQWdCLHFFQUFxRSwrQ0FBZ0IsdUVBQXVFLCtDQUFnQix5RUFBeUUsK0NBQWdCLHlFQUF5RSwrQ0FBZ0IseUVBQXlFLCtDQUFnQix5RUFBeUUsK0NBQWdCLHlFQUF5RSwrQ0FBZ0I7QUFDL3pDO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDTzs7Ozs7O1VDbDhEUDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL2NhbnZhcy9jYW52YXNDb3JlLnRzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL2NvcmUvY29uc3RhbnRFdmFsLnRzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL2NvcmUvY29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yLy4vc3JjL2FwcC9kZWZpbmVzLnRzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL2xhbmcvbGV4ZXIudHMiLCJ3ZWJwYWNrOi8vZ3JhcGhpbmctY2FsY3VsYXRvci8uL3NyYy9hcHAvbGFuZy9wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vZ3JhcGhpbmctY2FsY3VsYXRvci8uL3NyYy9hcHAvc2hhZGVyL3NoYWRlckNvcmUudHMiLCJ3ZWJwYWNrOi8vZ3JhcGhpbmctY2FsY3VsYXRvci8uL3NyYy9hcHAvc2hhZGVyL3NoYWRlckZ1bmN0aW9uLnRzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL3VpL2xlZnRQYW5lbC50cyIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yLy4vc3JjL2FwcC91aS9tZW51YmFyLnRzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL3VpL3VzZXJJbnRlcmFjdC50cyIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yLy4vc3JjL2FwcC91dGlscy50cyIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL2xpYi9nbC1tYXRyaXgvY29tbW9uLmpzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3IvLi9zcmMvYXBwL2xpYi9nbC1tYXRyaXgvbWF0NC5qcyIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3Ivd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3Ivd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ncmFwaGluZy1jYWxjdWxhdG9yL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZ3JhcGhpbmctY2FsY3VsYXRvci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3Ivd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2dyYXBoaW5nLWNhbGN1bGF0b3Ivd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1hcCwgVmVjdG9yIH0gZnJvbSAnLi4vdXRpbHMnXHJcbmltcG9ydCB7IHNjaGVkdWxlUmVkcmF3IH0gZnJvbSAnLi4vLi4vaW5kZXgnXHJcbmltcG9ydCB7IG9uTW91c2VEcmFnIH0gZnJvbSAnLi4vdWkvdXNlckludGVyYWN0J1xyXG5pbXBvcnQgeyBBU1ROb2RlIH0gZnJvbSAnLi4vbGFuZy9wYXJzZXInXHJcbmltcG9ydCB7IGNvbnN0YW50RXZhbEdldEVycm9yLCBjb25zdGFudEV2YWxYIH0gZnJvbSAnLi4vY29yZS9jb25zdGFudEV2YWwnXHJcblxyXG5leHBvcnQgY29uc3QgbWFpbkNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50XHJcbmNvbnN0IGN0eCA9IG1haW5DYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG5cclxuY29uc3Qgem9vbUJ1dHRvbkluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnpvb20taW4tYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnRcclxuY29uc3Qgem9vbUJ1dHRvbk91dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy56b29tLW91dC1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudFxyXG5cclxuY29uc3Qgb2Zmc2V0ID0gbmV3IFZlY3RvcigwLCAwKVxyXG5sZXQgc2NhbGUgPSAxLjBcclxuY29uc3Qgc3ViZGl2aXNpb25zID0gMTZcclxuY29uc3Qgc3RlcCA9IDAuMDFcclxuXHJcbmNvbnN0IGRyYWdGcm9tT2Zmc2V0ID0gbmV3IFZlY3RvcigwLCAwKVxyXG5jb25zdCBkcmFnRnJvbU1vdXNlID0gbmV3IFZlY3RvcigwLCAwKVxyXG5sZXQgaXNEcmFnZ2VkID0gZmFsc2VcclxuXHJcbmNvbnN0IHpvb21DYW52YXMgPSBmdW5jdGlvbiAobm9ybTogbnVtYmVyKSB7XHJcblx0c2NhbGUgKj0gbm9ybSA+IDAgPyAxICsgMC4yICogbm9ybSA6IDEgLyAoMSAtIDAuMiAqIG5vcm0pXHJcblx0c2NoZWR1bGVSZWRyYXcoKVxyXG59XHJcblxyXG5jb25zdCB6b29tU21vb3RoID0gZnVuY3Rpb24gKG5vcm06IG51bWJlcik6IHZvaWQge1xyXG5cdGNvbnN0IHRhcmdldFNjYWxlID0gc2NhbGUgKiAobm9ybSA+IDAgPyAxICsgMC4yICogbm9ybSA6IDEgLyAoMSAtIDAuMiAqIG5vcm0pKVxyXG5cdGNvbnN0IGFuaW1hdGlvblJlc29sdXRpb24gPSAwLjFcclxuXHRjb25zdCBzdGVwID0gKHRhcmdldFNjYWxlIC0gc2NhbGUpIC8gKDEgLyBhbmltYXRpb25SZXNvbHV0aW9uKVxyXG5cdGxldCBjb3VudGVyID0gMFxyXG5cdGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG5cdFx0c2NhbGUgKz0gc3RlcFxyXG5cdFx0c2NoZWR1bGVSZWRyYXcoKVxyXG5cdFx0Y291bnRlcisrXHJcblx0XHRpZiAoY291bnRlciA+PSAxIC8gYW5pbWF0aW9uUmVzb2x1dGlvbikge1xyXG5cdFx0XHRjbGVhckludGVydmFsKGludGVydmFsKVxyXG5cdFx0fVxyXG5cdH0sIDEwKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdENhbnZhcyA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcclxuXHRtYWluQ2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlOiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcblx0XHRkcmFnRnJvbU9mZnNldC5zZXQob2Zmc2V0LngsIG9mZnNldC55KVxyXG5cdFx0ZHJhZ0Zyb21Nb3VzZS5zZXQoZS5jbGllbnRYLCBlLmNsaWVudFkpXHJcblx0XHRpc0RyYWdnZWQgPSB0cnVlXHJcblx0fSlcclxuXHJcblx0b25Nb3VzZURyYWcobWFpbkNhbnZhcywgKG1vdXNlOiBWZWN0b3IpID0+IHtcclxuXHRcdGlmICghaXNEcmFnZ2VkKSByZXR1cm5cclxuXHRcdG9mZnNldC54ID0gZHJhZ0Zyb21PZmZzZXQueCArIG1vdXNlLnggLSBkcmFnRnJvbU1vdXNlLnhcclxuXHRcdG9mZnNldC55ID0gZHJhZ0Zyb21PZmZzZXQueSArIG1vdXNlLnkgLSBkcmFnRnJvbU1vdXNlLnlcclxuXHRcdHNjaGVkdWxlUmVkcmF3KClcclxuXHR9KVxyXG5cclxuXHRtYWluQ2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB7XHJcblx0XHRpc0RyYWdnZWQgPSBmYWxzZVxyXG5cdH0pXHJcblxyXG5cdG1haW5DYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcclxuXHRcdGlzRHJhZ2dlZCA9IGZhbHNlXHJcblx0fSlcclxuXHJcblx0bWFpbkNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChlOiBXaGVlbEV2ZW50KSA9PiB7XHJcblx0XHR6b29tQ2FudmFzKC1lLmRlbHRhWSAvIDIwMClcclxuXHR9KVxyXG5cclxuXHR6b29tQnV0dG9uSW4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0XHR6b29tU21vb3RoKDEpXHJcblx0fSlcclxuXHJcblx0em9vbUJ1dHRvbk91dC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdHpvb21TbW9vdGgoLTEpXHJcblx0fSlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNhbnZhc0RyYXcgPSBmdW5jdGlvbiAoKTogdm9pZCB7XHJcblx0aWYgKCFjdHgpIHJldHVyblxyXG5cclxuXHRtYWluQ2FudmFzLndpZHRoID0gbWFpbkNhbnZhcy5jbGllbnRXaWR0aFxyXG5cdG1haW5DYW52YXMuaGVpZ2h0ID0gbWFpbkNhbnZhcy5jbGllbnRIZWlnaHRcclxuXHJcblx0Y3R4LmNsZWFyUmVjdCgwLCAwLCBtYWluQ2FudmFzLndpZHRoLCBtYWluQ2FudmFzLmhlaWdodClcclxuXHJcblx0ZHJhd0dyaWQoKVxyXG59XHJcblxyXG5jb25zdCBkcmF3TGluZSA9IGZ1bmN0aW9uIChmcm9tWDogbnVtYmVyLCBmcm9tWTogbnVtYmVyLCB0b1g6IG51bWJlciwgdG9ZOiBudW1iZXIpOiB2b2lkIHtcclxuXHRpZiAoIWN0eCkgcmV0dXJuXHJcblxyXG5cdGN0eC5iZWdpblBhdGgoKVxyXG5cdGN0eC5tb3ZlVG8oZnJvbVgsIGZyb21ZKVxyXG5cdGN0eC5saW5lVG8odG9YLCB0b1kpXHJcblx0Y3R4LnN0cm9rZSgpXHJcbn1cclxuXHJcbmNvbnN0IGRyYXdHcmlkID0gZnVuY3Rpb24gKCk6IHZvaWQge1xyXG5cdGlmICghY3R4KSByZXR1cm5cclxuXHJcblx0Y29uc3Qgd2lkdGggPSBtYWluQ2FudmFzLndpZHRoXHJcblx0Y29uc3QgaGVpZ2h0ID0gbWFpbkNhbnZhcy5oZWlnaHRcclxuXHRjb25zdCBhc3BlY3QgPSB3aWR0aCAvIGhlaWdodFxyXG5cclxuXHRjdHguc3Ryb2tlU3R5bGUgPSAnI2ZmZidcclxuXHRjdHgubGluZVdpZHRoID0gMlxyXG5cclxuXHQvLyB5IGF4aXNcclxuXHRkcmF3TGluZSh3aWR0aCAvIDIgKyBvZmZzZXQueCwgMCwgd2lkdGggLyAyICsgb2Zmc2V0LngsIGhlaWdodClcclxuXHJcblx0Ly8geCBheGlzXHJcblx0ZHJhd0xpbmUoMCwgaGVpZ2h0IC8gMiArIG9mZnNldC55LCB3aWR0aCwgaGVpZ2h0IC8gMiArIG9mZnNldC55KVxyXG5cclxuXHRjb25zdCBzdWJkaXZNdWx0ID0gMiAqKiBNYXRoLmZsb29yKE1hdGgubG9nKHNjYWxlKSAvIE1hdGgubG9nKDIpKVxyXG5cclxuXHQvLyB5IGF4aXMgc3ViZGl2aXNpb25zXHJcblx0Y29uc3QgeVN0ZXAgPSBoZWlnaHQgLyBzdWJkaXZpc2lvbnMgLyBzdWJkaXZNdWx0ICogc2NhbGVcclxuXHRsZXQgeVN1YiA9IC1NYXRoLmZsb29yKHN1YmRpdmlzaW9ucyAvIHNjYWxlIC8gMiAqIHN1YmRpdk11bHQpIC8gc3ViZGl2TXVsdCAtXHJcblx0XHRNYXRoLmZsb29yKG9mZnNldC55IC8geVN0ZXApIC8gc3ViZGl2TXVsdCAtIChvZmZzZXQueSA8IDAgPyAoMSAvIHN1YmRpdk11bHQpIDogMCkgLSAoMSAvIHN1YmRpdk11bHQpXHJcblx0Y29uc3QgeUVycm9yID0gKGhlaWdodCAlICgyICogeVN0ZXApIC0gMiAqIHlTdGVwKSAvIDJcclxuXHRjb25zdCB5UmVwZWF0T2Zmc2V0ID0gb2Zmc2V0LnkgJSB5U3RlcFxyXG5cclxuXHRmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodCArIDIgKiB5U3RlcDsgeSArPSB5U3RlcCwgeVN1YiArPSAxIC8gc3ViZGl2TXVsdCkge1xyXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gJyM2NjYnXHJcblx0XHRjdHgubGluZVdpZHRoID0gMC41XHJcblxyXG5cdFx0ZHJhd0xpbmUoMCwgeSArIHlFcnJvciArIHlSZXBlYXRPZmZzZXQsIHdpZHRoLCB5ICsgeUVycm9yICsgeVJlcGVhdE9mZnNldClcclxuXHJcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSAndHJhbnNwYXJlbnQnXHJcblx0XHRjdHguZmlsbFN0eWxlID0gJyNmZmYnXHJcblx0XHRjdHgudGV4dEFsaWduID0gJ3JpZ2h0J1xyXG5cclxuXHRcdGlmICh5U3ViID09PSAwKSBjb250aW51ZVxyXG5cclxuXHRcdC8vIHkgbGFiZWxzXHJcblx0XHRjdHguYmVnaW5QYXRoKClcclxuXHRcdGN0eC5maWxsVGV4dCgoLXlTdWIpLnRvU3RyaW5nKCksIHdpZHRoIC8gMiArIG9mZnNldC54IC0gMTAsIHkgKyB5RXJyb3IgKyB5UmVwZWF0T2Zmc2V0ICsgNClcclxuXHR9XHJcblxyXG5cdC8vIHggYXhpcyBzdWJkaXZpc2lvbnNcclxuXHRjb25zdCB4U3RlcCA9IHdpZHRoIC8gc3ViZGl2aXNpb25zIC8gc3ViZGl2TXVsdCAvIGFzcGVjdCAqIHNjYWxlXHJcblx0bGV0IHhTdWIgPSAtTWF0aC5mbG9vcihzdWJkaXZpc2lvbnMgLyBzY2FsZSAvIDIgKiBzdWJkaXZNdWx0ICogYXNwZWN0KSAvIHN1YmRpdk11bHQgLVxyXG5cdFx0TWF0aC5mbG9vcihvZmZzZXQueCAvIHhTdGVwKSAvIHN1YmRpdk11bHQgLSAob2Zmc2V0LnggPCAwID8gKDEgLyBzdWJkaXZNdWx0KSA6IDApIC0gKDEgLyBzdWJkaXZNdWx0KVxyXG5cdGNvbnN0IHhFcnJvciA9ICh3aWR0aCAlICgyICogeFN0ZXApIC0gMiAqIHhTdGVwKSAvIDJcclxuXHRjb25zdCB4UmVwZWF0T2Zmc2V0ID0gb2Zmc2V0LnggJSB4U3RlcFxyXG5cclxuXHRmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoICsgeFN0ZXA7IHggKz0geFN0ZXAsIHhTdWIgKz0gMSAvIHN1YmRpdk11bHQpIHtcclxuXHRcdGN0eC5zdHJva2VTdHlsZSA9ICcjNjY2J1xyXG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDAuNVxyXG5cclxuXHRcdGRyYXdMaW5lKHggKyB4RXJyb3IgKyB4UmVwZWF0T2Zmc2V0LCAwLCB4ICsgeEVycm9yICsgeFJlcGVhdE9mZnNldCwgaGVpZ2h0KVxyXG5cclxuXHRcdGN0eC5zdHJva2VTdHlsZSA9ICd0cmFuc3BhcmVudCdcclxuXHRcdGN0eC5maWxsU3R5bGUgPSAnI2ZmZidcclxuXHRcdGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xyXG5cclxuXHRcdGlmICh4U3ViID09PSAwKSB7XHJcblx0XHRcdGN0eC5iZWdpblBhdGgoKVxyXG5cdFx0XHRjdHguZmlsbFRleHQoKC14U3ViKS50b1N0cmluZygpLCB4ICsgeEVycm9yICsgeFJlcGVhdE9mZnNldCAtIDE4LCBoZWlnaHQgLyAyICsgb2Zmc2V0LnkgKyAyMClcclxuXHRcdFx0Y29udGludWVcclxuXHRcdH1cclxuXHJcblx0XHQvLyB4IGxhYmVsc1xyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpXHJcblx0XHRjdHguZmlsbFRleHQoeFN1Yi50b1N0cmluZygpLCB4ICsgeEVycm9yICsgeFJlcGVhdE9mZnNldCwgaGVpZ2h0IC8gMiArIG9mZnNldC55ICsgMjApXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2FudmFzRHJhd0Z1bmN0aW9uID0gZnVuY3Rpb24gKGFzdDogQVNUTm9kZSB8IG51bGwsIGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcclxuXHRpZiAoIWN0eCB8fCAhYXN0KSByZXR1cm5cclxuXHJcblx0Y29uc3Qgd2lkdGggPSBtYWluQ2FudmFzLndpZHRoXHJcblx0Y29uc3QgaGVpZ2h0ID0gbWFpbkNhbnZhcy5oZWlnaHRcclxuXHRjb25zdCBhc3BlY3QgPSB3aWR0aCAvIGhlaWdodFxyXG5cclxuXHRjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG5cdGN0eC5saW5lV2lkdGggPSAyLjVcclxuXHRjdHguZmlsbFN0eWxlID0gJ3RyYW5zcGFyZW50J1xyXG5cdGN0eC5iZWdpblBhdGgoKVxyXG5cclxuXHRjb25zdCB4U3RlcCA9IHdpZHRoIC8gc3ViZGl2aXNpb25zIC8gYXNwZWN0ICogc2NhbGVcclxuXHRjb25zdCB4T2Zmc2V0ID0gb2Zmc2V0LnggLyB4U3RlcFxyXG5cdGxldCBtb3ZlVG8gPSB0cnVlXHJcblx0XHJcblx0Zm9yIChsZXQgeCA9IC1zdWJkaXZpc2lvbnMgLyAyICogYXNwZWN0IC8gc2NhbGUgLSB4T2Zmc2V0OyB4IDwgc3ViZGl2aXNpb25zIC8gMiAqIGFzcGVjdCAvIHNjYWxlIC0geE9mZnNldDsgeCArPSBzdGVwIC8gc2NhbGUpIHtcclxuXHRcdGNvbnN0IGYgPSBjb25zdGFudEV2YWxYKGFzdCwgeClcclxuXHJcblx0XHRjb25zdCBlcnJvciA9IGNvbnN0YW50RXZhbEdldEVycm9yKClcclxuXHRcdGlmIChlcnJvcikge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBtYXBwZWRYID0gbWFwKHgsIC1zdWJkaXZpc2lvbnMgLyAyICogYXNwZWN0IC8gc2NhbGUsIHN1YmRpdmlzaW9ucyAvIDIgKiBhc3BlY3QgLyBzY2FsZSwgMCwgd2lkdGgpICsgb2Zmc2V0LnhcclxuXHRcdGNvbnN0IG1hcHBlZFkgPSBtYXAoZiwgLXN1YmRpdmlzaW9ucyAvIDIgLyBzY2FsZSwgc3ViZGl2aXNpb25zIC8gMiAvIHNjYWxlLCBoZWlnaHQsIDApICsgb2Zmc2V0LnlcclxuXHRcdFxyXG5cdFx0aWYgKG1vdmVUbykge1xyXG5cdFx0XHRjdHgubW92ZVRvKG1hcHBlZFgsIG1hcHBlZFkpXHJcblx0XHRcdG1vdmVUbyA9IGZhbHNlXHJcblx0XHR9XHJcblx0XHRjdHgubGluZVRvKG1hcHBlZFgsIG1hcHBlZFkpXHJcblx0fVxyXG5cclxuXHRjdHguc3Ryb2tlKClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldERvbWFpbiA9IGZ1bmN0aW9uICgpOiB7IG1pblg6IG51bWJlciwgbWF4WDogbnVtYmVyLCBtaW5ZOiBudW1iZXIsIG1heFk6IG51bWJlciB9IHtcclxuXHRjb25zdCB3aWR0aCA9IG1haW5DYW52YXMud2lkdGhcclxuXHRjb25zdCBoZWlnaHQgPSBtYWluQ2FudmFzLmhlaWdodFxyXG5cdGNvbnN0IGFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0XHJcblxyXG4gICAgY29uc3QgeFN0ZXAgPSB3aWR0aCAvIHN1YmRpdmlzaW9ucyAvIGFzcGVjdCAqIHNjYWxlXHJcbiAgICBjb25zdCB4T2Zmc2V0ID0gb2Zmc2V0LnggLyB4U3RlcFxyXG4gICAgY29uc3QgbWluWCA9IC1zdWJkaXZpc2lvbnMgLyAyICogYXNwZWN0IC8gc2NhbGUgLSB4T2Zmc2V0XHJcbiAgICBjb25zdCBtYXhYID0gc3ViZGl2aXNpb25zIC8gMiAqIGFzcGVjdCAvIHNjYWxlIC0geE9mZnNldFxyXG5cclxuICAgIGNvbnN0IHlTdGVwID0gaGVpZ2h0IC8gc3ViZGl2aXNpb25zICogc2NhbGVcclxuICAgIGNvbnN0IHlPZmZzZXQgPSBvZmZzZXQueSAvIHlTdGVwXHJcbiAgICBjb25zdCBtaW5ZID0gLXN1YmRpdmlzaW9ucyAvIDIgLyBzY2FsZSArIHlPZmZzZXRcclxuICAgIGNvbnN0IG1heFkgPSBzdWJkaXZpc2lvbnMgLyAyIC8gc2NhbGUgKyB5T2Zmc2V0XHJcblxyXG4gICAgcmV0dXJuIHsgbWluWCwgbWF4WCwgbWluWSwgbWF4WSB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZ2V0R2xvYmFsVGltZSwgc2NoZWR1bGVSZWRyYXcgfSBmcm9tICcuLi8uLi9pbmRleCdcclxuaW1wb3J0IHsgZ2V0RXh0ZXJuVmFyaWFibGUsIGdldFVzZXJWYXJpYWJsZSwgc2V0VXNlclZhcmlhYmxlLCBUb2tlbiB9IGZyb20gJy4uL2xhbmcvbGV4ZXInXHJcbmltcG9ydCB7IEFTVE5vZGUgfSBmcm9tICcuLi9sYW5nL3BhcnNlcidcclxuaW1wb3J0IHsgZ2V0TW91c2VQb3MgfSBmcm9tICcuLi91aS91c2VySW50ZXJhY3QnXHJcbmltcG9ydCB7IGZhY3RvcmlhbCwgcGVybGluMiwgc2lnbW9pZCB9IGZyb20gJy4uL3V0aWxzJ1xyXG5cclxubGV0IGxhdGVzdEVycm9yOiBzdHJpbmcgfCBudWxsID0gbnVsbFxyXG5sZXQgeDogbnVtYmVyIHwgbnVsbFxyXG5cclxuZXhwb3J0IGNvbnN0IGNvbnN0YW50RXZhbCA9IGZ1bmN0aW9uIChhc3Q6IEFTVE5vZGUgfCBudWxsKTogbnVtYmVyIHtcclxuICAgIGlmICghYXN0KSByZXR1cm4gMFxyXG5cclxuICAgIGxhdGVzdEVycm9yID0gbnVsbFxyXG5cclxuICAgIGNvbnN0IHJlc3VsdDogbnVtYmVyID0gZXZhbE5vZGUoYXN0KSBhcyBudW1iZXJcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjb25zdGFudEV2YWxYID0gZnVuY3Rpb24gKGFzdDogQVNUTm9kZSB8IG51bGwsIF94OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgeCA9IF94XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gY29uc3RhbnRFdmFsKGFzdClcclxuXHJcbiAgICB4ID0gbnVsbFxyXG4gICAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5jb25zdCByZXBvcnRFcnJvciA9IGZ1bmN0aW9uIChlcnJvcjogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGR1cmluZyBjb25zdGFudCBldmFsdWF0aW9uOiAnICsgZXJyb3IpXHJcbiAgICBsYXRlc3RFcnJvciA9IGVycm9yXHJcbiAgICByZXR1cm4gMFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY29uc3RhbnRFdmFsR2V0RXJyb3IgPSAoKTogc3RyaW5nIHwgbnVsbCA9PiBsYXRlc3RFcnJvclxyXG5cclxuY29uc3QgaXNJdGVyYWJsZSA9IChvYmo6IGFueSk6IGJvb2xlYW4gPT4gb2JqICE9IG51bGwgJiYgdHlwZW9mIG9ialtTeW1ib2wuaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nXHJcblxyXG5jb25zdCBldmFsTm9kZSA9IGZ1bmN0aW9uIChub2RlOiBBU1ROb2RlKTogbnVtYmVyIHwgbnVtYmVyW10ge1xyXG4gICAgc3dpdGNoIChub2RlLm9wLnRvaykge1xyXG4gICAgICAgIGNhc2UgVG9rZW4uVU5ERUY6XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gVU5ERUZJTkVEIGlzIG5vdCBhbGxvd2VkJylcclxuICAgICAgICBcclxuICAgICAgICBjYXNlIFRva2VuLk5PTkU6XHJcbiAgICAgICAgICAgIHJldHVybiAwXHJcbiAgICAgICAgXHJcbiAgICAgICAgY2FzZSBUb2tlbi5QQVJFTl9PUDpcclxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBPUEVOIFBBUkVOVEhFU0lTIGlzIG5vdCBhbGxvd2VkJylcclxuICAgICAgICBcclxuICAgICAgICBjYXNlIFRva2VuLlBBUkVOX0NMOlxyXG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIENMT1NFIFBBUkVOVEhFU0lTIGlzIG5vdCBhbGxvd2VkJylcclxuICAgICAgICBcclxuICAgICAgICBjYXNlIFRva2VuLkJSQUNLRVRfT1A6XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gT1BFTiBCUkFDS0VUIGlzIG5vdCBhbGxvd2VkJylcclxuICAgICAgICBcclxuICAgICAgICBjYXNlIFRva2VuLkJSQUNLRVRfQ0w6XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gQ0xPU0UgQlJBQ0tFVCBpcyBub3QgYWxsb3dlZCcpXHJcbiAgICAgICAgXHJcbiAgICAgICAgY2FzZSBUb2tlbi5CUkFDRV9PUDpcclxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBPUEVOIEJSQUNFIGlzIG5vdCBhbGxvd2VkJylcclxuXHJcbiAgICAgICAgY2FzZSBUb2tlbi5CUkFDRV9DTDpcclxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBDTE9TRSBCUkFDRSBpcyBub3QgYWxsb3dlZCcpXHJcbiAgICAgICAgXHJcbiAgICAgICAgY2FzZSBUb2tlbi5OVU06XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZS5vcC52YWwgIT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIE5VTUJFUiBtdXN0IGJlIGEgbnVtYmVyJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5vcC52YWxcclxuICAgICAgICBcclxuICAgICAgICBjYXNlIFRva2VuLkNPTlNUOlxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5vZGUub3AudmFsICE9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBDT05TVEFOVCBtdXN0IGJlIGEgbnVtYmVyJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5vcC52YWxcclxuICAgICAgICBcclxuICAgICAgICBjYXNlIFRva2VuLlZBUjpcclxuICAgICAgICAgICAgaWYgKHggPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBWQVJJQUJMRSBpcyBub3QgYWxsb3dlZCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHhcclxuICAgICAgICBcclxuICAgICAgICBjYXNlIFRva2VuLlZBUjI6XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gVkFSSUFCTEUyIGlzIG5vdCBhbGxvd2VkJylcclxuXHJcbiAgICAgICAgY2FzZSBUb2tlbi5USU1FOlxyXG4gICAgICAgICAgICBzY2hlZHVsZVJlZHJhdygpXHJcbiAgICAgICAgICAgIHJldHVybiBnZXRHbG9iYWxUaW1lKClcclxuXHJcbiAgICAgICAgY2FzZSBUb2tlbi5BREQ6XHJcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIEFERElUSU9OJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKGV2YWxOb2RlKG5vZGUubGVmdCkgYXMgbnVtYmVyKSArIChldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uU1VCOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBTVUJUUkFDVElPTicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIChldmFsTm9kZShub2RlLmxlZnQpIGFzIG51bWJlcikgLSAoZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgbnVtYmVyKVxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLk1VTFQ6XHJcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIE1VTFRJUExJQ0FUSU9OJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKGV2YWxOb2RlKG5vZGUubGVmdCkgYXMgbnVtYmVyKSAqIChldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uRElWOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBESVZJU0lPTicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIChldmFsTm9kZShub2RlLmxlZnQpIGFzIG51bWJlcikgLyAoZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgbnVtYmVyKVxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLlBPVzpcclxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gUE9XRVInKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnBvdyhldmFsTm9kZShub2RlLmxlZnQpIGFzIG51bWJlciwgZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgbnVtYmVyKVxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLlNRUlQ6XHJcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gU1FVQVJFIFJPT1QnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQoZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgbnVtYmVyKVxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLkxPRzpcclxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBMT0dBUklUSE0nKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmxvZyhldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uRVhQOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIEVYUE9FTlRJQUwnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmV4cChldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uU0lOOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIFNJTkUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNpbihldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uQ09TOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIENPU0lORScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY29zKGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIG51bWJlcilcclxuXHJcbiAgICAgICAgY2FzZSBUb2tlbi5UQU46XHJcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gVEFOR0VOVCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIE1hdGgudGFuKGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIG51bWJlcilcclxuXHJcbiAgICAgICAgY2FzZSBUb2tlbi5BU0lOOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIEFSQyBTSU5FJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hc2luKGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIG51bWJlcilcclxuXHJcbiAgICAgICAgY2FzZSBUb2tlbi5BQ09TOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIEFSQyBDT1NJTkUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFjb3MoZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgbnVtYmVyKVxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLkFUQU46XHJcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gQVJDIFRBTkdFTlQnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmF0YW4oZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgbnVtYmVyKVxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLkZMT09SOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIEZMT09SJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uTUlOOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIE1JTicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFpc0l0ZXJhYmxlKGV2YWxOb2RlKG5vZGUucmlnaHQpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNYWxmb3JtZWQgYXJndW1lbnQgZm9yIFRva2VuIE1JTicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWluKC4uLmV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIG51bWJlcltdKVxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLk1BWDpcclxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBNQVgnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaXNJdGVyYWJsZShldmFsTm9kZShub2RlLnJpZ2h0KSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWFsZm9ybWVkIGFyZ3VtZW50IGZvciBUb2tlbiBNQVgnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heCguLi5ldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXJbXSlcclxuXHJcbiAgICAgICAgY2FzZSBUb2tlbi5ERUxJTTpcclxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gREVMSU1JVEVSJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gW2V2YWxOb2RlKG5vZGUubGVmdCkgYXMgbnVtYmVyLCBldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXJdXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uQUJTOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIEFCU09MVVRFJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMoZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgbnVtYmVyKVxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLlJBTkQ6XHJcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudCBmb3IgVG9rZW4gUkFORE9NJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uUEVSTElOOiB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIFBFUkxJTicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFpc0l0ZXJhYmxlKGV2YWxOb2RlKG5vZGUucmlnaHQpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNYWxmb3JtZWQgYXJndW1lbnQgZm9yIFRva2VuIFBFUkxJTicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgbnVtYmVyW11cclxuICAgICAgICAgICAgcmV0dXJuIHBlcmxpbjIoeCwgeSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uTU9EOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBNT0RVTFVTJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKGV2YWxOb2RlKG5vZGUubGVmdCkgYXMgbnVtYmVyKSAlIChldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpXHJcbiAgICAgICAgXHJcbiAgICAgICAgY2FzZSBUb2tlbi5MRVZFTF9TRVQ6XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gTEVWRUwgU0VUIGlzIG5vdCBhbGxvd2VkJylcclxuICAgICAgICBcclxuICAgICAgICBjYXNlIFRva2VuLlZFQ1RPUl9GSUVMRDpcclxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdUb2tlbiBWRUNUT1IgRklFTEQgaXMgbm90IGFsbG93ZWQnKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNhc2UgVG9rZW4uTEVTUzpcclxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gTEVTUyBUSEFOJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKGV2YWxOb2RlKG5vZGUubGVmdCkgYXMgbnVtYmVyKSA8IChldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpID8gMSA6IDBcclxuXHJcbiAgICAgICAgY2FzZSBUb2tlbi5HUkVBVEVSOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBHUkVBVEVSIFRIQU4nKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAoZXZhbE5vZGUobm9kZS5sZWZ0KSBhcyBudW1iZXIpID4gKGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIG51bWJlcikgPyAxIDogMFxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLkxFU1NfT1JfRVFVQUw6XHJcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIExFU1MgVEhBTiBPUiBFUVVBTCBUTycpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIChldmFsTm9kZShub2RlLmxlZnQpIGFzIG51bWJlcikgPD0gKGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIG51bWJlcikgPyAxIDogMFxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLkdSRUFURVJfT1JfRVFVQUw6XHJcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQgPT0gbnVsbCB8fCBub2RlLnJpZ2h0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTWlzc2luZyBhcmd1bWVudHMgZm9yIFRva2VuIEdSRUFURVIgVEhBTiBPUiBFUVVBTCBUTycpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIChldmFsTm9kZShub2RlLmxlZnQpIGFzIG51bWJlcikgPj0gKGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIG51bWJlcikgPyAxIDogMFxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLkVRVUFMOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBFUVVBTCBUTycpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIChldmFsTm9kZShub2RlLmxlZnQpIGFzIG51bWJlcikgLSAoZXZhbE5vZGUobm9kZS5yaWdodCkgYXMgbnVtYmVyKSA8IDAuMDAwMDEgPyAxIDogMFxyXG4gICAgICAgIFxyXG4gICAgICAgIGNhc2UgVG9rZW4uQU5EOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0ID09IG51bGwgfHwgbm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnRzIGZvciBUb2tlbiBBTkQnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAoZXZhbE5vZGUobm9kZS5sZWZ0KSBhcyBudW1iZXIpICYmIChldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpID8gMSA6IDBcclxuXHJcbiAgICAgICAgY2FzZSBUb2tlbi5PUjpcclxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gT1InKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAoZXZhbE5vZGUobm9kZS5sZWZ0KSBhcyBudW1iZXIpIHx8IChldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpID8gMSA6IDBcclxuICAgICAgICBcclxuICAgICAgICBjYXNlIFRva2VuLlVTRVJWQVI6XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRVc2VyVmFyaWFibGUobm9kZS5vcC52YWwgYXMgc3RyaW5nKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNhc2UgVG9rZW4uRkFDVE9SSUFMOlxyXG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ01pc3NpbmcgYXJndW1lbnQgZm9yIFRva2VuIEZBQ1RPUklBTCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcmlhbChldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uU0lHTU9JRDpcclxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50IGZvciBUb2tlbiBTSUdNT0lEJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2lnbW9pZChldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uQ0lSQ0xFOlxyXG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIENJUkNMRSBpcyBub3QgYWxsb3dlZCcpXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uUE9JTlQ6XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gUE9JTlQgaXMgbm90IGFsbG93ZWQnKVxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLlRSVUU6XHJcbiAgICAgICAgICAgIHJldHVybiAxXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uRkFMU0U6XHJcbiAgICAgICAgICAgIHJldHVybiAwXHJcblxyXG4gICAgICAgIGNhc2UgVG9rZW4uUE9MQVI6XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignVG9rZW4gUE9MQVIgaXMgbm90IGFsbG93ZWQnKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNhc2UgVG9rZW4uQ0FSVEVTSUFOOlxyXG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0RXJyb3IoJ1Rva2VuIENBUlRFU0lBTiBpcyBub3QgYWxsb3dlZCcpXHJcbiAgICAgICAgXHJcbiAgICAgICAgY2FzZSBUb2tlbi5NT1VTRVg6XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRNb3VzZVBvcygpLnhcclxuICAgICAgICBcclxuICAgICAgICBjYXNlIFRva2VuLk1PVVNFWTpcclxuICAgICAgICAgICAgcmV0dXJuIGdldE1vdXNlUG9zKCkueVxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLk1PVVNFOlxyXG4gICAgICAgICAgICByZXR1cm4gW2dldE1vdXNlUG9zKCkueCwgZ2V0TW91c2VQb3MoKS55XVxyXG5cclxuICAgICAgICBjYXNlIFRva2VuLkFTU0lHTjpcclxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdCA9PSBudWxsIHx8IG5vZGUucmlnaHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50cyBmb3IgVG9rZW4gQVNTSUdOJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0Lm9wLnRvayAhPT0gVG9rZW4uQVNTSUdOQUJMRSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubGVmdC5vcC50b2sgPT09IFRva2VuLlVTRVJWQVIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRVc2VyVmFyaWFibGUobm9kZS5sZWZ0Lm9wLnZhbCBhcyBzdHJpbmcsIGV2YWxOb2RlKG5vZGUucmlnaHQpIGFzIG51bWJlcilcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZhbE5vZGUobm9kZS5yaWdodClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcignTGVmdCBzaWRlIG9mIEFTU0lHTiBtdXN0IGJlIGFzc2lnbmFibGUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChnZXRFeHRlcm5WYXJpYWJsZShub2RlLmxlZnQub3AudmFsIGFzIHN0cmluZykgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcG9ydEVycm9yKGBWYXJpYWJsZSAke25vZGUubGVmdC5vcC52YWx9IGRvZXMgbm90IGV4aXN0YClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRFeHRlcm5WYXJpYWJsZShub2RlLmxlZnQub3AudmFsIGFzIHN0cmluZyk/LnNldChldmFsTm9kZShub2RlLnJpZ2h0KSBhcyBudW1iZXIpXHJcbiAgICAgICAgICAgIHJldHVybiBldmFsTm9kZShub2RlLnJpZ2h0KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRFcnJvcihgVW5rbm93biB0b2tlbiAke25vZGUub3AudmFsfWApXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgc2NoZWR1bGVSZWRyYXcgfSBmcm9tICcuLi8uLi9pbmRleCdcclxuaW1wb3J0IHsgY2FudmFzRHJhd0Z1bmN0aW9uIH0gZnJvbSAnLi4vY2FudmFzL2NhbnZhc0NvcmUnXHJcbmltcG9ydCB7IFBsb3REaXNwbGF5TW9kZSwgUGxvdERyaXZlciwgUGxvdFN0YXR1cyB9IGZyb20gJy4uL2RlZmluZXMnXHJcbmltcG9ydCB7IEVycm9yIH0gZnJvbSAnLi4vbGFuZy9sZXhlcidcclxuaW1wb3J0IHsgQVNUTm9kZSwgcGFyc2UsIHBhcnNlckdldERpc3BsYXlNb2RlLCBwYXJzZXJHZXRFcnJvciwgcGFyc2VyR2V0TnVtVmFycyB9IGZyb20gJy4uL2xhbmcvcGFyc2VyJ1xyXG5pbXBvcnQgeyBidWlsZFNoYWRlckZ1bmN0aW9uIH0gZnJvbSAnLi4vc2hhZGVyL3NoYWRlckZ1bmN0aW9uJ1xyXG5pbXBvcnQgeyBpbnB1dFNldENvbG9yQXQsIGlucHV0U2V0Q29uc3RFdmFsQXQsIGlucHV0U2V0RHJpdmVyQXQsIGlucHV0U2V0RXJyb3JBdCwgaW5wdXRTZXRTdGF0dXNBdCB9IGZyb20gJy4uL3VpL2xlZnRQYW5lbCdcclxuaW1wb3J0IHsgY29uc3RhbnRFdmFsLCBjb25zdGFudEV2YWxHZXRFcnJvciB9IGZyb20gJy4vY29uc3RhbnRFdmFsJ1xyXG5cclxudHlwZSBQbG90ID0ge1xyXG4gICAgaW5wdXQ6IHN0cmluZyxcclxuICAgIGlucHV0Q2hhbmdlZDogYm9vbGVhbixcclxuICAgIGFzdDogQVNUTm9kZSB8IG51bGwsXHJcbiAgICBzdGF0dXM6IFBsb3RTdGF0dXMsXHJcbiAgICBkcml2ZXI6IFBsb3REcml2ZXIsXHJcbiAgICBkaXNwbGF5TW9kZTogUGxvdERpc3BsYXlNb2RlLFxyXG4gICAgc2hhZGVyRnVuY3Rpb246IHN0cmluZyxcclxuICAgIGNvbG9yOiBzdHJpbmcsXHJcbiAgICBlcnJvcjogc3RyaW5nLFxyXG59XHJcblxyXG5jb25zdCBwbG90czogUGxvdFtdID0gW11cclxubGV0IG51bUlucHV0cyA9IDBcclxuXHJcbmV4cG9ydCBjb25zdCBzZXRJbnB1dEF0ID0gKGluZGV4OiBudW1iZXIsIHZhbHVlOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiBudW1JbnB1dHMpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBwbG90c1tpbmRleF0uaW5wdXQgPSB2YWx1ZVxyXG4gICAgcGxvdHNbaW5kZXhdLmlucHV0Q2hhbmdlZCA9IHRydWVcclxuICAgIHNjaGVkdWxlUmVkcmF3KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldE51bUlucHV0cyA9IChudW06IG51bWJlcik6IHZvaWQgPT4ge1xyXG4gICAgbnVtSW5wdXRzID0gbnVtXHJcbiAgICBmb3IgKGxldCBpID0gbnVtSW5wdXRzOyBpIDwgcGxvdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkZWxldGUgcGxvdHNbaV1cclxuICAgIH1cclxuICAgIHNjaGVkdWxlUmVkcmF3KClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlc2V0UGxvdHMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICBwbG90cy5sZW5ndGggPSAwXHJcbiAgICBzY2hlZHVsZVJlZHJhdygpXHJcbn1cclxuXHJcbmNvbnN0IGNvbG9yczogc3RyaW5nW10gPSBbJyMxZjc3YjQnLCAnI2ZmN2YwZScsICcjMmNhMDJjJywgJyNkNjI3MjgnLCAnIzk0NjdiZCcsICcjOGM1NjRiJywgJyNlMzc3YzInLCAnIzdmN2Y3ZicsICcjYmNiZDIyJywgJyMxN2JlY2YnXVxyXG5jb25zdCBnZXRDb2xvckZyb21JbmRleCA9IChpbmRleDogbnVtYmVyKTogc3RyaW5nID0+IGNvbG9yc1tpbmRleCAlIGNvbG9ycy5sZW5ndGhdXHJcblxyXG5leHBvcnQgY29uc3QgZHJpdmVQbG90cyA9ICgpOiB2b2lkID0+IHtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IG51bUlucHV0czsgaSsrKSB7XHJcbiAgICAgICAgLy8gSW5pdCBwbG90XHJcbiAgICAgICAgaWYgKCFwbG90c1tpXSkge1xyXG4gICAgICAgICAgICBwbG90c1tpXSA9IHtcclxuICAgICAgICAgICAgICAgIGlucHV0OiAnJyxcclxuICAgICAgICAgICAgICAgIGlucHV0Q2hhbmdlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhc3Q6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFBsb3RTdGF0dXMuUEVORElORyxcclxuICAgICAgICAgICAgICAgIGRyaXZlcjogUGxvdERyaXZlci5DQU5WQVMsXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5TW9kZTogUGxvdERpc3BsYXlNb2RlLk5PTkUsXHJcbiAgICAgICAgICAgICAgICBzaGFkZXJGdW5jdGlvbjogJycsXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogZ2V0Q29sb3JGcm9tSW5kZXgoaSksXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbnB1dFNldENvbG9yQXQoaSwgcGxvdHNbaV0uY29sb3IpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHBsb3QgPSBwbG90c1tpXVxyXG5cclxuICAgICAgICBpZiAocGxvdC5pbnB1dENoYW5nZWQpIHtcclxuICAgICAgICAgICAgcGxvdC5pbnB1dENoYW5nZWQgPSBmYWxzZVxyXG4gICAgICAgICAgICBjb25zdCBzdGF0dXNCZWZvcmUgPSBwbG90LnN0YXR1c1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgZW1wdHkgaW5wdXRcclxuICAgICAgICAgICAgaWYgKHBsb3QuaW5wdXQudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcGxvdC5zdGF0dXMgPSBQbG90U3RhdHVzLlBFTkRJTkdcclxuICAgICAgICAgICAgICAgIHBsb3QuYXN0ID0gbnVsbFxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXNCZWZvcmUgIT09IHBsb3Quc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRTZXRTdGF0dXNBdChpLCBwbG90LnN0YXR1cylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNjaGVkdWxlUmVkcmF3KClcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFBhcnNlIGlucHV0XHJcbiAgICAgICAgICAgIGNvbnN0IGFzdEJlZm9yZSA9IHBsb3QuYXN0XHJcbiAgICAgICAgICAgIHBsb3QuYXN0ID0gcGFyc2UocGxvdC5pbnB1dClcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnUGFyc2VkIEFTVDonLCBwbG90LmFzdClcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHN0YXR1c1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvckJlZm9yZSA9IHBsb3QuZXJyb3JcclxuICAgICAgICAgICAgY29uc3QgcGFyc2VyRXJyb3I6IEVycm9yIHwgbnVsbCA9IHBhcnNlckdldEVycm9yKClcclxuICAgICAgICAgICAgaWYgKHBhcnNlckVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnN0YXR1cyA9IFBsb3RTdGF0dXMuRVJST1JcclxuICAgICAgICAgICAgICAgIHBsb3QuZXJyb3IgPSBwYXJzZXJFcnJvci5kZXNjXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwbG90LnN0YXR1cyA9IFBsb3RTdGF0dXMuQUNUSVZFXHJcbiAgICAgICAgICAgICAgICBwbG90LmVycm9yID0gJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGxvdC5zdGF0dXMgIT09IHN0YXR1c0JlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgaW5wdXRTZXRTdGF0dXNBdChpLCBwbG90LnN0YXR1cylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGxvdC5lcnJvciAhPT0gZXJyb3JCZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIGlucHV0U2V0RXJyb3JBdChpLCBwbG90LmVycm9yKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBSZWRyYXdcclxuICAgICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KGFzdEJlZm9yZSkgIT09IEpTT04uc3RyaW5naWZ5KHBsb3QuYXN0KSkge1xyXG4gICAgICAgICAgICAgICAgc2NoZWR1bGVSZWRyYXcoKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBkcml2ZXJcclxuICAgICAgICAgICAgY29uc3QgbnVtVmFycyA9IHBhcnNlckdldE51bVZhcnMoKVxyXG4gICAgICAgICAgICBjb25zdCBkcml2ZXJCZWZvcmUgPSBwbG90LmRyaXZlclxyXG4gICAgICAgICAgICBzd2l0Y2ggKG51bVZhcnMpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogcGxvdC5kcml2ZXIgPSBQbG90RHJpdmVyLkNPTlNUQU5UOyBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOiBwbG90LmRyaXZlciA9IFBsb3REcml2ZXIuQ0FOVkFTOyBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOiBwbG90LmRyaXZlciA9IFBsb3REcml2ZXIuV0VCR0w7IGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBsb3QuZHJpdmVyICE9PSBkcml2ZXJCZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIGlucHV0U2V0RHJpdmVyQXQoaSwgcGxvdC5kcml2ZXIpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHByb2Nlc3MgbW9kZVxyXG4gICAgICAgICAgICBwbG90LmRpc3BsYXlNb2RlID0gcGFyc2VyR2V0RGlzcGxheU1vZGUoKVxyXG5cclxuICAgICAgICAgICAgLy8gQnVpbGQgc2hhZGVyIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGlmIChwbG90LmRyaXZlciA9PT0gUGxvdERyaXZlci5XRUJHTCkge1xyXG4gICAgICAgICAgICAgICAgcGxvdC5zaGFkZXJGdW5jdGlvbiA9IGJ1aWxkU2hhZGVyRnVuY3Rpb24ocGxvdC5hc3QpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkcmF3UGxvdHMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBudW1JbnB1dHM7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHBsb3QgPSBwbG90c1tpXVxyXG4gICAgICAgIGlmICghcGxvdCkgY29udGludWVcclxuICAgICAgICBcclxuICAgICAgICBpZiAocGxvdC5zdGF0dXMgIT09IFBsb3RTdGF0dXMuQUNUSVZFKSBjb250aW51ZVxyXG5cclxuICAgICAgICBzd2l0Y2ggKHBsb3QuZHJpdmVyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgUGxvdERyaXZlci5DT05TVEFOVDoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY29uc3RhbnRFdmFsKHBsb3QuYXN0KVxyXG4gICAgICAgICAgICAgICAgaW5wdXRTZXRDb25zdEV2YWxBdChpLCByZXN1bHQpXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY29uc3RFdmFsRXJyb3IgPSBjb25zdGFudEV2YWxHZXRFcnJvcigpXHJcbiAgICAgICAgICAgICAgICBpZiAoY29uc3RFdmFsRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBwbG90LnN0YXR1cyA9IFBsb3RTdGF0dXMuRVJST1JcclxuICAgICAgICAgICAgICAgICAgICBwbG90LmVycm9yID0gY29uc3RFdmFsRXJyb3JcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dFNldFN0YXR1c0F0KGksIHBsb3Quc3RhdHVzKVxyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0U2V0RXJyb3JBdChpLCBwbG90LmVycm9yKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FzZSBQbG90RHJpdmVyLkNBTlZBUzoge1xyXG4gICAgICAgICAgICAgICAgY2FudmFzRHJhd0Z1bmN0aW9uKHBsb3QuYXN0LCBwbG90LmNvbG9yKVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnN0RXZhbEVycm9yID0gY29uc3RhbnRFdmFsR2V0RXJyb3IoKVxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnN0RXZhbEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxvdC5zdGF0dXMgPSBQbG90U3RhdHVzLkVSUk9SXHJcbiAgICAgICAgICAgICAgICAgICAgcGxvdC5lcnJvciA9IGNvbnN0RXZhbEVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRTZXRTdGF0dXNBdChpLCBwbG90LnN0YXR1cylcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dFNldEVycm9yQXQoaSwgcGxvdC5lcnJvcilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgUGxvdERyaXZlci5XRUJHTDpcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UGxvdHNTaGFkZXJJbmZvID0gKCk6IHsgZnVuY3Rpb25zOiBzdHJpbmdbXSwgY29sb3JzOiBzdHJpbmdbXSwgZGlzcGxheU1vZGVzOiBQbG90RGlzcGxheU1vZGVbXSwgbnVtUGxvdHM6IG51bWJlciB9ID0+IHtcclxuICAgIGNvbnN0IHNoYWRlckZ1bmN0aW9uczogc3RyaW5nW10gPSBbXVxyXG4gICAgY29uc3QgY29sb3JzOiBzdHJpbmdbXSA9IFtdXHJcbiAgICBjb25zdCBkaXNwbGF5TW9kZXM6IFBsb3REaXNwbGF5TW9kZVtdID0gW11cclxuICAgIGxldCBudW1QbG90cyA9IDBcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBudW1JbnB1dHM7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHBsb3QgPSBwbG90c1tpXVxyXG5cclxuICAgICAgICBpZiAoIXBsb3QgfHwgcGxvdC5kcml2ZXIgIT09IFBsb3REcml2ZXIuV0VCR0wgfHwgcGxvdC5zdGF0dXMgIT09IFBsb3RTdGF0dXMuQUNUSVZFKSBjb250aW51ZVxyXG5cclxuICAgICAgICBpZiAocGxvdC5kcml2ZXIgIT09IFBsb3REcml2ZXIuV0VCR0wpIGNvbnRpbnVlXHJcblxyXG4gICAgICAgIHNoYWRlckZ1bmN0aW9ucy5wdXNoKHBsb3Quc2hhZGVyRnVuY3Rpb24pXHJcbiAgICAgICAgY29sb3JzLnB1c2gocGxvdC5jb2xvcilcclxuICAgICAgICBkaXNwbGF5TW9kZXMucHVzaChwbG90LmRpc3BsYXlNb2RlKVxyXG4gICAgICAgIG51bVBsb3RzKytcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geyBmdW5jdGlvbnM6IHNoYWRlckZ1bmN0aW9ucywgY29sb3JzLCBkaXNwbGF5TW9kZXMsIG51bVBsb3RzIH1cclxufVxyXG4iLCJleHBvcnQgZW51bSBQbG90RGlzcGxheU1vZGUge1xyXG4gICAgTk9ORSxcclxuICAgIENPTlNUQU5UX0VWQUwsXHJcbiAgICBGVU5DVElPTl9HUkFQSCxcclxuICAgIFNFVCxcclxuICAgIExFVkVMX1NFVCxcclxuICAgIFZFQ1RPUl9GSUVMRFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBQbG90U3RhdHVzIHtcclxuICAgIFBFTkRJTkcsXHJcbiAgICBBQ1RJVkUsXHJcbiAgICBFUlJPUlxyXG59XHJcblxyXG5leHBvcnQgZW51bSBQbG90RHJpdmVyIHtcclxuICAgIENPTlNUQU5ULFxyXG4gICAgQ0FOVkFTLFxyXG4gICAgV0VCR0xcclxufVxyXG4iLCJleHBvcnQgZW51bSBUb2tlbiB7XHJcblx0VU5ERUYsXHJcblx0Tk9ORSxcclxuXHRWQVIsXHJcblx0VkFSMixcclxuXHROVU0sXHJcblx0Q09OU1QsXHJcblx0UEFSRU5fT1AsXHJcblx0UEFSRU5fQ0wsXHJcblx0QlJBQ0tFVF9PUCxcclxuXHRCUkFDS0VUX0NMLFxyXG5cdEJSQUNFX09QLFxyXG5cdEJSQUNFX0NMLFxyXG5cdERFTElNLFxyXG5cdEFTU0lHTixcclxuXHRBU1NJR05BQkxFLFxyXG5cdExFU1MsXHJcblx0R1JFQVRFUixcclxuXHRMRVNTX09SX0VRVUFMLFxyXG5cdEdSRUFURVJfT1JfRVFVQUwsXHJcblx0VVNFUlZBUixcclxuXHRBREQsXHJcblx0U1VCLFxyXG5cdE1VTFQsXHJcblx0RElWLFxyXG5cdFBPVyxcclxuXHRBTkQsXHJcblx0T1IsXHJcblx0Tk9UX0VRVUFMLFxyXG5cdEVRVUFMLFxyXG5cdFRSVUUsXHJcblx0RkFMU0UsXHJcblx0U1FSVCxcclxuXHRFWFAsXHJcblx0TE9HLFxyXG5cdFNJTixcclxuXHRDT1MsXHJcblx0VEFOLFxyXG5cdEFTSU4sXHJcblx0QUNPUyxcclxuXHRBVEFOLFxyXG5cdEZMT09SLFxyXG5cdE1JTixcclxuXHRNQVgsXHJcblx0QUJTLFxyXG5cdE1PRCxcclxuXHRSQU5ELFxyXG5cdFBFUkxJTixcclxuXHRGQUNUT1JJQUwsXHJcblx0U0lHTU9JRCxcclxuXHRMRVZFTF9TRVQsXHJcblx0VkVDVE9SX0ZJRUxELFxyXG5cdENJUkNMRSxcclxuXHRQT0lOVCxcclxuXHRUSU1FLFxyXG5cdENPTVBMRVgsXHJcblx0UE9MQVIsXHJcblx0Q0FSVEVTSUFOLFxyXG5cdE1PVVNFWCxcclxuXHRNT1VTRVksXHJcblx0TU9VU0VcclxufVxyXG5cclxuZXhwb3J0IGVudW0gVG9rZW5GbGFnIHtcclxuXHRJTVBMX01VTFRfQkVGT1JFID0gMSxcclxuXHRJTVBMX01VTFRfQUZURVIgPSAyLFxyXG5cdFBSRUZJWCA9IDQsXHJcblx0VU5JUVVFID0gMTYsXHJcblx0QkVHSU5fU0NPUEUgPSAzMixcclxuXHRFTkRfU0NPUEUgPSA2NFxyXG59XHJcblxyXG4vLyBNYXAgb2Ygc3RyaW5ncyB0byB0aGVpciB0b2tlbnMgYW5kIGZsYWdzIGJpdGZpZWxkXHJcbmNvbnN0IFN0cmluZ1Rva2VuTWFwOiB7IFtrZXk6IHN0cmluZ106IHsgdG9rOiBUb2tlbiwgZmxhZ3M6IG51bWJlciB9IH0gPSB7XHJcblx0Ly8gQ29udHJvbFxyXG5cdCcoJzogeyB0b2s6IFRva2VuLlBBUkVOX09QLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuVU5JUVVFIHwgVG9rZW5GbGFnLkJFR0lOX1NDT1BFIH0sXHJcblx0JyknOiB7IHRvazogVG9rZW4uUEFSRU5fQ0wsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0FGVEVSIHwgVG9rZW5GbGFnLlVOSVFVRSB8IFRva2VuRmxhZy5FTkRfU0NPUEUgfSxcclxuXHQnWyc6IHsgdG9rOiBUb2tlbi5CUkFDS0VUX09QLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuVU5JUVVFIHwgVG9rZW5GbGFnLkJFR0lOX1NDT1BFIH0sXHJcblx0J10nOiB7IHRvazogVG9rZW4uQlJBQ0tFVF9DTCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfCBUb2tlbkZsYWcuVU5JUVVFIHwgVG9rZW5GbGFnLkVORF9TQ09QRSB9LFxyXG5cdCd7JzogeyB0b2s6IFRva2VuLkJSQUNFX09QLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuVU5JUVVFIHwgVG9rZW5GbGFnLkJFR0lOX1NDT1BFIH0sXHJcblx0J30nOiB7IHRvazogVG9rZW4uQlJBQ0VfQ0wsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0FGVEVSIHwgVG9rZW5GbGFnLlVOSVFVRSB8IFRva2VuRmxhZy5FTkRfU0NPUEUgfSxcclxuXHQnLCc6IHsgdG9rOiBUb2tlbi5ERUxJTSwgZmxhZ3M6IFRva2VuRmxhZy5VTklRVUUgfSxcclxuXHQnPSc6IHsgdG9rOiBUb2tlbi5BU1NJR04sIGZsYWdzOiAwIH0sXHJcblxyXG5cdC8vIFZhcmlhYmxlc1xyXG5cdHg6IHsgdG9rOiBUb2tlbi5WQVIsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSxcclxuXHR5OiB7IHRvazogVG9rZW4uVkFSMiwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUiB9LFxyXG5cclxuXHQvLyBMb2dpY2FsXHJcblx0JzwnOiB7IHRvazogVG9rZW4uTEVTUywgZmxhZ3M6IDAgfSxcclxuXHQnPic6IHsgdG9rOiBUb2tlbi5HUkVBVEVSLCBmbGFnczogMCB9LFxyXG5cdCc8PSc6IHsgdG9rOiBUb2tlbi5MRVNTX09SX0VRVUFMLCBmbGFnczogVG9rZW5GbGFnLlVOSVFVRSB9LFxyXG5cdCc+PSc6IHsgdG9rOiBUb2tlbi5HUkVBVEVSX09SX0VRVUFMLCBmbGFnczogVG9rZW5GbGFnLlVOSVFVRSB9LFxyXG5cdCchPSc6IHsgdG9rOiBUb2tlbi5OT1RfRVFVQUwsIGZsYWdzOiBUb2tlbkZsYWcuVU5JUVVFIH0sXHJcblx0Jz09JzogeyB0b2s6IFRva2VuLkVRVUFMLCBmbGFnczogVG9rZW5GbGFnLlVOSVFVRSB9LFxyXG5cdCcmJic6IHsgdG9rOiBUb2tlbi5BTkQsIGZsYWdzOiBUb2tlbkZsYWcuVU5JUVVFIH0sXHJcblx0J3x8JzogeyB0b2s6IFRva2VuLk9SLCBmbGFnczogVG9rZW5GbGFnLlVOSVFVRSB9LFxyXG5cclxuXHQvLyBBcml0aG1ldGljXHJcblx0JysnOiB7IHRvazogVG9rZW4uQURELCBmbGFnczogVG9rZW5GbGFnLlVOSVFVRSB9LFxyXG5cdCctJzogeyB0b2s6IFRva2VuLlNVQiwgZmxhZ3M6IFRva2VuRmxhZy5VTklRVUUgfSxcclxuXHQnKic6IHsgdG9rOiBUb2tlbi5NVUxULCBmbGFnczogMCB9LFxyXG5cdCcvJzogeyB0b2s6IFRva2VuLkRJViwgZmxhZ3M6IFRva2VuRmxhZy5VTklRVUUgfSxcclxuXHQnXic6IHsgdG9rOiBUb2tlbi5QT1csIGZsYWdzOiBUb2tlbkZsYWcuVU5JUVVFIH0sXHJcblx0JyoqJzogeyB0b2s6IFRva2VuLlBPVywgZmxhZ3M6IFRva2VuRmxhZy5VTklRVUUgfSxcclxuXHQnJSc6IHsgdG9rOiBUb2tlbi5NT0QsIGZsYWdzOiAwIH0sXHJcblx0bW9kOiB7IHRvazogVG9rZW4uTU9ELCBmbGFnczogMCB9LFxyXG5cclxuXHQvLyBMaXRlcmFsc1xyXG5cdHRydWU6IHsgdG9rOiBUb2tlbi5UUlVFLCBmbGFnczogMCB9LFxyXG5cdGZhbHNlOiB7IHRvazogVG9rZW4uRkFMU0UsIGZsYWdzOiAwIH0sXHJcblxyXG5cdC8vIEZ1bmN0aW9uc1xyXG5cdHNxcnQ6IHsgdG9rOiBUb2tlbi5TUVJULCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0ZXhwOiB7IHRvazogVG9rZW4uRVhQLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0bG9nOiB7IHRvazogVG9rZW4uTE9HLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0bG46IHsgdG9rOiBUb2tlbi5MT0csIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcclxuXHJcblx0c2luOiB7IHRvazogVG9rZW4uU0lOLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0Y29zOiB7IHRvazogVG9rZW4uQ09TLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0dGFuOiB7IHRvazogVG9rZW4uVEFOLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblxyXG5cdGFzaW46IHsgdG9rOiBUb2tlbi5BU0lOLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0YWNvczogeyB0b2s6IFRva2VuLkFDT1MsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcclxuXHRhdGFuOiB7IHRvazogVG9rZW4uQVRBTiwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxyXG5cdGFyY3NpbjogeyB0b2s6IFRva2VuLkFTSU4sIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcclxuXHRhcmNjb3M6IHsgdG9rOiBUb2tlbi5BQ09TLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0YXJjdGFuOiB7IHRvazogVG9rZW4uQVRBTiwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxyXG5cclxuXHRmbG9vcjogeyB0b2s6IFRva2VuLkZMT09SLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0bWluOiB7IHRvazogVG9rZW4uTUlOLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0bWF4OiB7IHRvazogVG9rZW4uTUFYLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0YWJzOiB7IHRvazogVG9rZW4uQUJTLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblxyXG5cdHJhbmQ6IHsgdG9rOiBUb2tlbi5SQU5ELCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0cmFuZG9tOiB7IHRvazogVG9rZW4uUkFORCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxyXG5cdHBlcmxpbjogeyB0b2s6IFRva2VuLlBFUkxJTiwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxyXG5cdG5vaXNlOiB7IHRvazogVG9rZW4uUEVSTElOLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0ZmFjdDogeyB0b2s6IFRva2VuLkZBQ1RPUklBTCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxyXG5cdGZhY3RvcmlhbDogeyB0b2s6IFRva2VuLkZBQ1RPUklBTCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxyXG5cdHNpZ21vaWQ6IHsgdG9rOiBUb2tlbi5TSUdNT0lELCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblxyXG5cdC8vIFNjYWxhciBmaWVsZHNcclxuXHRMZXZlbDogeyB0b2s6IFRva2VuLkxFVkVMX1NFVCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxyXG5cdE5pdmVhdTogeyB0b2s6IFRva2VuLkxFVkVMX1NFVCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlBSRUZJWCB9LFxyXG5cclxuXHQvLyBWZWN0b3IgZmllbGRzXHJcblx0VmVjdG9yRmllbGQ6IHsgdG9rOiBUb2tlbi5WRUNUT1JfRklFTEQsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcclxuXHRcclxuXHQvLyBTdXJyb3VuZGluZ1xyXG5cdCd8JzogeyB0b2s6IFRva2VuLkFCUywgZmxhZ3M6IFRva2VuRmxhZy5CRUdJTl9TQ09QRSB8IFRva2VuRmxhZy5FTkRfU0NPUEUgfSxcclxuXHJcblx0Ly8gU2hhcGVzXHJcblx0Q2lyY2xlOiB7IHRvazogVG9rZW4uQ0lSQ0xFLCBmbGFnczogVG9rZW5GbGFnLlBSRUZJWCB9LFxyXG5cdFBvaW50OiB7IHRvazogVG9rZW4uUE9JTlQsIGZsYWdzOiBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0XHJcblx0Ly8gQ29udmVyc2lvbnNcclxuXHRQb2xhcjogeyB0b2s6IFRva2VuLlBPTEFSLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblx0UG9sOiB7IHRvazogVG9rZW4uUE9MQVIsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcclxuXHRDYXJ0ZXNpYW46IHsgdG9rOiBUb2tlbi5DQVJURVNJQU4sIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcclxuXHRDYXJ0OiB7IHRvazogVG9rZW4uQ0FSVEVTSUFOLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuUFJFRklYIH0sXHJcblxyXG5cdC8vIFRpbWVcclxuXHR0OiB7IHRvazogVG9rZW4uVElNRSwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUiB9LFxyXG5cclxuXHQvLyBJbnB1dHNcclxuXHRtb3VzZVg6IHsgdG9rOiBUb2tlbi5NT1VTRVgsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSxcclxuXHRtb3VzZVk6IHsgdG9rOiBUb2tlbi5NT1VTRVksIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSxcclxuXHRtb3VzZTogeyB0b2s6IFRva2VuLk1PVVNFLCBmbGFnczogMCB9XHJcbn1cclxuXHJcbmNvbnN0IFN0cmluZ0NvbnN0YW50TWFwOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge1xyXG5cdHBpOiBNYXRoLlBJLFxyXG5cdFBpOiBNYXRoLlBJLFxyXG5cdGU6IE1hdGguRVxyXG59XHJcblxyXG5jb25zdCBlc2NhcGVSZWdFeHAgPSAoc3RyOiBzdHJpbmcpID0+IHtcclxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJylcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgRXJyb3IgPSB7IGRlc2M6IHN0cmluZywgcG9zOiBudW1iZXIgfVxyXG5cclxubGV0IGxhdGVzdEVycm9yOiBFcnJvciB8IG51bGwgPSBudWxsXHJcbmV4cG9ydCBjb25zdCBsZXhlckdldEVycm9yID0gKCk6IEVycm9yIHwgbnVsbCA9PiBsYXRlc3RFcnJvclxyXG5cclxuY29uc3QgcmVwb3J0RXJyb3IgPSAoZXJyb3I6IHN0cmluZywgcG9zaXRpb246IG51bWJlcikgPT4ge1xyXG5cdGNvbnNvbGUuZXJyb3IoYEVycm9yIGF0IHBvc2l0aW9uICR7cG9zaXRpb259OiAke2Vycm9yfWApXHJcblx0bGF0ZXN0RXJyb3IgPSB7IGRlc2M6IGVycm9yLCBwb3M6IHBvc2l0aW9uIH1cclxufVxyXG5cclxuY29uc3QgaXNJZGVudGlmaWVyID0gKHN0cjogc3RyaW5nKTogYm9vbGVhbiA9PiB7XHJcblx0cmV0dXJuIC9eW2EtekEtWl9dW2EtekEtWjAtOV9dKiQvLnRlc3Qoc3RyKVxyXG59XHJcblxyXG5jb25zdCBFeHRlcm5WYXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogeyBnZXQ6ICgpID0+IG51bWJlciwgc2V0OiAodmFsOiBudW1iZXIpID0+IHZvaWQgfSB9ID0ge31cclxuXHJcbmV4cG9ydCBjb25zdCBiaW5kRXh0ZXJuVmFyaWFibGUgPSAobmFtZTogc3RyaW5nLCBnZXR0ZXI6ICgpID0+IG51bWJlciwgc2V0dGVyOiAodmFsdWU6IG51bWJlcikgPT4gdm9pZCkgPT4ge1xyXG5cdEV4dGVyblZhcmlhYmxlc1tuYW1lXSA9IHsgZ2V0OiBnZXR0ZXIsIHNldDogc2V0dGVyIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVuYmluZEV4dGVyblZhcmlhYmxlID0gKG5hbWU6IHN0cmluZykgPT4ge1xyXG5cdGRlbGV0ZSBFeHRlcm5WYXJpYWJsZXNbbmFtZV1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldEV4dGVyblZhcmlhYmxlID0gKG5hbWU6IHN0cmluZyk6IHsgZ2V0OiAoKSA9PiBudW1iZXIsIHNldDogKHZhbDogbnVtYmVyKSA9PiB2b2lkIH0gfCBudWxsID0+IHtcclxuXHRyZXR1cm4gRXh0ZXJuVmFyaWFibGVzW25hbWVdXHJcbn1cclxuXHJcbmxldCBVc2VyVmFyaWFibGVzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge31cclxuXHJcbmV4cG9ydCBjb25zdCBzZXRVc2VyVmFyaWFibGUgPSAobmFtZTogc3RyaW5nLCB2YWx1ZTogbnVtYmVyKSA9PiB7XHJcblx0VXNlclZhcmlhYmxlc1tuYW1lXSA9IHZhbHVlXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRVc2VyVmFyaWFibGUgPSAobmFtZTogc3RyaW5nKTogbnVtYmVyID0+IFVzZXJWYXJpYWJsZXNbbmFtZV0gfHwgMFxyXG5cclxuZXhwb3J0IGNvbnN0IGNsZWFyVXNlclZhcmlhYmxlcyA9ICgpID0+IHtcclxuXHRVc2VyVmFyaWFibGVzID0ge31cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgT3BDb2RlID0geyB0b2s6IFRva2VuLCB2YWw6IG51bWJlciB8IHN0cmluZywgZmxhZ3M6IFRva2VuRmxhZyB9XHJcblxyXG5leHBvcnQgY29uc3QgbGV4ID0gKHN0cjogc3RyaW5nKTogT3BDb2RlW10gPT4ge1xyXG5cdGxhdGVzdEVycm9yID0gbnVsbFxyXG5cclxuXHRzdHIgPSBzdHIucmVwbGFjZSgvXFxzL2csICcnKVxyXG5cclxuXHRjb25zdCBjaHVua3MgPSBzdHIuc3BsaXQoXHJcblx0XHRuZXcgUmVnRXhwKGAoJHtPYmplY3RcclxuXHRcdFx0LmtleXMoU3RyaW5nVG9rZW5NYXApXHJcblx0XHRcdC5maWx0ZXIoayA9PiBTdHJpbmdUb2tlbk1hcFtrXS5mbGFncyAmIFRva2VuRmxhZy5VTklRVUUpXHJcblx0XHRcdC5tYXAoayA9PiBlc2NhcGVSZWdFeHAoaykpXHJcblx0XHRcdC5qb2luKCd8Jyl9KWAsICdnJykpXHJcblx0XHQuZmlsdGVyKChzZWc6IHN0cmluZykgPT4gc2VnICE9PSAnJylcclxuXHJcblx0Y29uc3Qgb3BzOiBPcENvZGVbXSA9IFtdXHJcblx0bGV0IHBvcyA9IDBcclxuXHJcblx0Y2h1bmtzLmZvckVhY2goKGNodW5rOiBzdHJpbmcpID0+IHtcclxuXHRcdGxldCBmcm9tID0gMFxyXG5cdFx0XHJcblx0XHRmb3IgKGxldCBpID0gY2h1bmsubGVuZ3RoOyBpID4gZnJvbTsgaS0tKSB7XHJcblx0XHRcdGNvbnN0IGJ1ZiA9IGNodW5rLnN1YnN0cmluZyhmcm9tLCBpKVxyXG5cdFx0XHRsZXQgZm91bmQgPSBmYWxzZVxyXG5cclxuXHRcdFx0aWYgKFN0cmluZ1Rva2VuTWFwW2J1Zl0pIHtcclxuXHRcdFx0XHRvcHMucHVzaCh7IHRvazogU3RyaW5nVG9rZW5NYXBbYnVmXS50b2ssIHZhbDogMCwgZmxhZ3M6IFN0cmluZ1Rva2VuTWFwW2J1Zl0uZmxhZ3MgfSlcclxuXHRcdFx0XHRmb3VuZCA9IHRydWVcclxuXHRcdFx0fSBlbHNlIGlmIChTdHJpbmdDb25zdGFudE1hcFtidWZdKSB7XHJcblx0XHRcdFx0b3BzLnB1c2goeyB0b2s6IFRva2VuLkNPTlNULCB2YWw6IFN0cmluZ0NvbnN0YW50TWFwW2J1Zl0sIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSlcclxuXHRcdFx0XHRmb3VuZCA9IHRydWVcclxuXHRcdFx0fSBlbHNlIGlmIChFeHRlcm5WYXJpYWJsZXNbYnVmXSkge1xyXG5cdFx0XHRcdG9wcy5wdXNoKHsgdG9rOiBUb2tlbi5BU1NJR05BQkxFLCB2YWw6IGJ1ZiwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUiB9KVxyXG5cdFx0XHRcdGZvdW5kID0gdHJ1ZVxyXG5cdFx0XHR9IGVsc2UgaWYgKCFpc05hTihOdW1iZXIoYnVmKSkpIHtcclxuXHRcdFx0XHRvcHMucHVzaCh7IHRvazogVG9rZW4uTlVNLCB2YWw6IHBhcnNlRmxvYXQoYnVmKSwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSlcclxuXHRcdFx0XHRmb3VuZCA9IHRydWVcclxuXHRcdFx0fSBlbHNlIGlmIChpIC0gMSA9PT0gZnJvbSkge1xyXG5cdFx0XHRcdGxldCBsb25nZXN0SWRlbnQgPSAnJ1xyXG5cdFx0XHRcdGZvciAobGV0IGogPSBmcm9tICsgMTsgaiA8PSBjaHVuay5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0Y29uc3QgdG1wID0gY2h1bmsuc3Vic3RyaW5nKGZyb20sIGopXHJcblx0XHRcdFx0XHRpZiAoIWlzSWRlbnRpZmllcih0bXApKSB7XHJcblx0XHRcdFx0XHRcdGJyZWFrXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsb25nZXN0SWRlbnQgPSB0bXBcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGxvbmdlc3RJZGVudCAhPT0gJycpIHtcclxuXHRcdFx0XHRcdG9wcy5wdXNoKHsgdG9rOiBUb2tlbi5VU0VSVkFSLCB2YWw6IGxvbmdlc3RJZGVudCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUiB9KVxyXG5cdFx0XHRcdFx0ZnJvbSArPSBsb25nZXN0SWRlbnQubGVuZ3RoXHJcblx0XHRcdFx0XHRpID0gY2h1bmsubGVuZ3RoICsgMVxyXG5cdFx0XHRcdFx0Y29udGludWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmVwb3J0RXJyb3IoYFVua25vd24gdG9rZW46IMK0JHtjaHVuay5zdWJzdHJpbmcoZnJvbSwgY2h1bmsubGVuZ3RoKX3CtGAsIHBvcyArIGZyb20pXHJcblx0XHRcdFx0cmV0dXJuIFtdXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChmb3VuZCkge1xyXG5cdFx0XHRcdGZyb20gPSBpXHJcblx0XHRcdFx0aSA9IGNodW5rLmxlbmd0aCArIDFcclxuXHRcdFx0XHRjb250aW51ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRwb3MgKz0gY2h1bmsubGVuZ3RoXHJcblx0fSlcclxuXHJcblx0cmV0dXJuIG9wc1xyXG59XHJcbiIsImltcG9ydCB7IFBsb3REaXNwbGF5TW9kZSB9IGZyb20gJy4uL2RlZmluZXMnXHJcbmltcG9ydCB7IFRva2VuLCBUb2tlbkZsYWcsIE9wQ29kZSwgRXJyb3IsIGxleCwgbGV4ZXJHZXRFcnJvciB9IGZyb20gJy4vbGV4ZXInXHJcblxyXG5jb25zdCBNQVhfUFJFQ0VERU5DRSA9IDhcclxuY29uc3QgVG9rZW5QcmVjZWRlbmNlOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge1xyXG5cdFtUb2tlbi5PUl06IDAsXHJcblx0W1Rva2VuLkRFTElNXTogMSxcclxuXHRbVG9rZW4uQU5EXTogMixcclxuXHRbVG9rZW4uRVFVQUxdOiAzLFxyXG5cdFtUb2tlbi5OT1RfRVFVQUxdOiAzLFxyXG5cdFtUb2tlbi5BU1NJR05dOiAzLFxyXG5cdFtUb2tlbi5MRVNTXTogNCxcclxuXHRbVG9rZW4uTEVTU19PUl9FUVVBTF06IDQsXHJcblx0W1Rva2VuLkdSRUFURVJdOiA0LFxyXG5cdFtUb2tlbi5HUkVBVEVSX09SX0VRVUFMXTogNCxcclxuXHRbVG9rZW4uQUREXTogNSxcclxuXHRbVG9rZW4uU1VCXTogNSxcclxuXHRbVG9rZW4uTVVMVF06IDYsXHJcblx0W1Rva2VuLkRJVl06IDYsXHJcblx0W1Rva2VuLk1PRF06IDYsXHJcblx0W1Rva2VuLlBPV106IDdcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQVNUTm9kZSA9IHtcclxuXHRvcDogT3BDb2RlLFxyXG5cdGxlZnQ6IEFTVE5vZGUgfCBudWxsLFxyXG5cdHJpZ2h0OiBBU1ROb2RlIHwgbnVsbFxyXG59XHJcblxyXG5sZXQgbGF0ZXN0RXJyb3I6IEVycm9yIHwgbnVsbCA9IG51bGxcclxuZXhwb3J0IGNvbnN0IHBhcnNlckdldEVycm9yID0gKCk6IEVycm9yIHwgbnVsbCA9PiBsYXRlc3RFcnJvclxyXG5cclxuY29uc3QgcmVwb3J0RXJyb3IgPSAoZXJyb3I6IHN0cmluZywgcG9zaXRpb246IG51bWJlcikgPT4ge1xyXG5cdGNvbnNvbGUuZXJyb3IoYEVycm9yIGF0IHBvc2l0aW9uICR7cG9zaXRpb259OiAke2Vycm9yfWApXHJcblx0bGF0ZXN0RXJyb3IgPSB7IGRlc2M6IGVycm9yLCBwb3M6IHBvc2l0aW9uIH1cclxufVxyXG5cclxubGV0IG51bVZhcnMgPSAwXHJcbmxldCBkaXNwbGF5TW9kZTogUGxvdERpc3BsYXlNb2RlID0gUGxvdERpc3BsYXlNb2RlLk5PTkVcclxuXHJcbmV4cG9ydCBjb25zdCBwYXJzZXJHZXROdW1WYXJzID0gKCk6IG51bWJlciA9PiBudW1WYXJzXHJcbmV4cG9ydCBjb25zdCBwYXJzZXJHZXREaXNwbGF5TW9kZSA9ICgpOiBQbG90RGlzcGxheU1vZGUgPT4gZGlzcGxheU1vZGVcclxuXHJcbmV4cG9ydCBjb25zdCBwYXJzZSA9IChpbnB1dDogc3RyaW5nKTogQVNUTm9kZSB8IG51bGwgPT4ge1xyXG5cdGxhdGVzdEVycm9yID0gbnVsbFxyXG5cdG51bVZhcnMgPSAwXHJcblx0ZGlzcGxheU1vZGUgPSBQbG90RGlzcGxheU1vZGUuTk9ORVxyXG5cclxuXHRsZXQgb3BzOiBPcENvZGVbXSB8IG51bGwgPSBsZXgoaW5wdXQpXHJcblx0Y29uc29sZS5kZWJ1ZygnTGV4ZXIgb3V0cHV0OicsIG9wcylcclxuXHJcblx0Y29uc3QgbGV4ZXJFcnJvciA9IGxleGVyR2V0RXJyb3IoKVxyXG5cdGlmIChsZXhlckVycm9yKSB7XHJcblx0XHRsYXRlc3RFcnJvciA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobGV4ZXJFcnJvcikpXHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH1cclxuXHJcblx0bnVtVmFycyA9IChvcHMuZmlsdGVyKG9wID0+IG9wLnRvayA9PT0gVG9rZW4uVkFSKS5sZW5ndGggPiAwID8gMSA6IDApICtcclxuXHRcdChvcHMuZmlsdGVyKG9wID0+IG9wLnRvayA9PT0gVG9rZW4uVkFSMikubGVuZ3RoID4gMCA/IDEgOiAwKVxyXG5cdFxyXG5cdGlmIChudW1WYXJzID09PSAwKSB7XHJcblx0XHRkaXNwbGF5TW9kZSA9IFBsb3REaXNwbGF5TW9kZS5DT05TVEFOVF9FVkFMXHJcblx0fSBlbHNlIGlmIChudW1WYXJzID09PSAxKSB7XHJcblx0XHRkaXNwbGF5TW9kZSA9IFBsb3REaXNwbGF5TW9kZS5GVU5DVElPTl9HUkFQSFxyXG5cdH0gZWxzZSBpZiAobnVtVmFycyA9PT0gMikge1xyXG5cdFx0ZGlzcGxheU1vZGUgPSBQbG90RGlzcGxheU1vZGUuU0VUXHJcblx0XHRpZiAob3BzLmZpbHRlcihvcCA9PiBvcC50b2sgPT09IFRva2VuLkxFVkVMX1NFVCkubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRkaXNwbGF5TW9kZSA9IFBsb3REaXNwbGF5TW9kZS5MRVZFTF9TRVRcclxuXHRcdH0gZWxzZSBpZiAob3BzLmZpbHRlcihvcCA9PiBvcC50b2sgPT09IFRva2VuLlZFQ1RPUl9GSUVMRCkubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRkaXNwbGF5TW9kZSA9IFBsb3REaXNwbGF5TW9kZS5WRUNUT1JfRklFTERcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG9wcyA9IHZhbGlkYXRlKG9wcylcclxuXHRjb25zb2xlLmRlYnVnKCdWYWxpZGF0ZWQgb3BzOicsIG9wcylcclxuXHRpZiAob3BzID09IG51bGwpIHJldHVybiBudWxsXHJcblx0XHJcblx0b3BzID0gZXhwYW5kKG9wcylcclxuXHRjb25zb2xlLmRlYnVnKCdFeHBhbmRlZCBvcHM6Jywgb3BzKVxyXG5cdGlmIChvcHMgPT0gbnVsbCkgcmV0dXJuIG51bGxcclxuXHRcclxuXHRvcHMgPSBvcHRpbWl6ZShvcHMpXHJcblx0Y29uc29sZS5kZWJ1ZygnT3B0aW1pemVkIG9wczonLCBvcHMpXHJcblx0aWYgKG9wcyA9PSBudWxsKSByZXR1cm4gbnVsbFxyXG5cdFxyXG5cdHJldHVybiBidWlsZEFTVChvcHMpXHJcbn1cclxuXHJcbmNvbnN0IHZhbGlkYXRlID0gKG9wczogT3BDb2RlW10pOiBPcENvZGVbXSB8IG51bGwgPT4ge1xyXG5cdC8vIENoZWNrIGZvciB1bm1hdGNoZWQgYW5kIG1pc21hdGNoZWQgcGFyZW50aGVzZXNcclxuXHRjb25zdCBwYXJlblN0YWNrOiB7IHRvazogVG9rZW4sIHBvczogbnVtYmVyIH1bXSA9IFtdXHJcblxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgb3BzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRjb25zdCBvcCA9IG9wc1tpXVxyXG5cclxuXHRcdGlmIChvcC5mbGFncyAmIFRva2VuRmxhZy5CRUdJTl9TQ09QRSkge1xyXG5cdFx0XHRwYXJlblN0YWNrLnB1c2goeyB0b2s6IG9wLnRvaywgcG9zOiBpIH0pXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG9wLmZsYWdzICYgVG9rZW5GbGFnLkVORF9TQ09QRSkge1xyXG5cdFx0XHRjb25zdCB7IHRvaywgcG9zIH0gPSBwYXJlblN0YWNrLnBvcCgpIHx8IHsgdG9rOiBUb2tlbi5OT05FLCBwb3M6IDAgfVxyXG5cclxuXHRcdFx0bGV0IGV4cGVjdFRvazogVG9rZW4gPSBUb2tlbi5OT05FXHJcblx0XHRcdHN3aXRjaCAodG9rKSB7XHJcblx0XHRcdFx0Y2FzZSBUb2tlbi5QQVJFTl9PUDogZXhwZWN0VG9rID0gVG9rZW4uUEFSRU5fQ0w7IGJyZWFrXHJcblx0XHRcdFx0Y2FzZSBUb2tlbi5CUkFDS0VUX09QOiBleHBlY3RUb2sgPSBUb2tlbi5CUkFDS0VUX0NMOyBicmVha1xyXG5cdFx0XHRcdGNhc2UgVG9rZW4uQlJBQ0VfT1A6IGV4cGVjdFRvayA9IFRva2VuLkJSQUNFX0NMOyBicmVha1xyXG5cdFx0XHRcdGNhc2UgVG9rZW4uQUJTOiBleHBlY3RUb2sgPSBUb2tlbi5BQlM7IGJyZWFrXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChvcC50b2sgIT09IGV4cGVjdFRvaykge1xyXG5cdFx0XHRcdHJlcG9ydEVycm9yKCdNaXNtYXRjaGVkIHBhcmVudGhlc2VzJywgcG9zKVxyXG5cdFx0XHRcdHJldHVybiBudWxsXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmIChwYXJlblN0YWNrLmxlbmd0aCA+IDApIHtcclxuXHRcdGNvbnN0IHsgcG9zIH0gPSBwYXJlblN0YWNrWzBdXHJcblx0XHRyZXBvcnRFcnJvcignVW5tYXRjaGVkIHBhcmVudGhlc2VzJywgcG9zKVxyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9XHJcblxyXG5cdHJldHVybiBvcHNcclxufVxyXG5cclxuY29uc3QgZXhwYW5kID0gKG9wczogT3BDb2RlW10pOiBPcENvZGVbXSB8IG51bGwgPT4ge1xyXG5cdC8vIFJlcGxhY2UgfHh8IHdpdGggYWJzKHgpXHJcblx0Y29uc3QgYWJzU3RhY2s6IHsgdG9rOiBUb2tlbiwgcG9zOiBudW1iZXIgfVtdID0gW11cclxuXHRcclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG9wcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0Y29uc3Qgb3AgPSBvcHNbaV1cclxuXHJcblx0XHRpZiAob3AudG9rID09PSBUb2tlbi5BQlMgJiYgb3AuZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpIHtcclxuXHRcdFx0Y29uc3QgdG9wID0gYWJzU3RhY2sucG9wKClcclxuXHRcdFx0YWJzU3RhY2sucHVzaCh7IHRvazogb3AudG9rLCBwb3M6IGkgfSlcclxuXHRcdFx0aWYgKCF0b3ApIGNvbnRpbnVlXHJcblxyXG5cdFx0XHRjb25zdCBhYnNFeHByID0gb3BzLnNwbGljZSh0b3AucG9zICsgMSwgaSAtIHRvcC5wb3MgLSAxKVxyXG5cdFx0XHRvcHMuc3BsaWNlKHRvcC5wb3MsIDIpXHJcblx0XHRcdG9wcy5zcGxpY2UodG9wLnBvcywgMCxcclxuXHRcdFx0XHR7IHRvazogVG9rZW4uQUJTLCB2YWw6IDAsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB8IFRva2VuRmxhZy5QUkVGSVggfSxcclxuXHRcdFx0XHR7IHRvazogVG9rZW4uUEFSRU5fT1AsIHZhbDogMCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFIHwgVG9rZW5GbGFnLlVOSVFVRSB8IFRva2VuRmxhZy5CRUdJTl9TQ09QRSB9LFxyXG5cdFx0XHRcdC4uLmFic0V4cHIsXHJcblx0XHRcdFx0eyB0b2s6IFRva2VuLlBBUkVOX0NMLCB2YWw6IDAsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0FGVEVSIHwgVG9rZW5GbGFnLlVOSVFVRSB8IFRva2VuRmxhZy5FTkRfU0NPUEUgfVxyXG5cdFx0XHQpXHJcblx0XHRcdGkgPSB0b3AucG9zICsgYWJzRXhwci5sZW5ndGggKyAzXHJcblx0XHRcdGFic1N0YWNrLnBvcCgpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBSZXBsYWNlIG1vdXNlIHdpdGggbW91c2VYLCBkZWxpbSwgbW91c2VZXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvcHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmIChvcHNbaV0udG9rID09PSBUb2tlbi5NT1VTRSkge1xyXG5cdFx0XHRvcHMuc3BsaWNlKGksIDEsXHJcblx0XHRcdFx0eyB0b2s6IFRva2VuLk1PVVNFWCwgdmFsOiAwLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfSxcclxuXHRcdFx0XHR7IHRvazogVG9rZW4uREVMSU0sIHZhbDogMCwgZmxhZ3M6IDAgfSxcclxuXHRcdFx0XHR7IHRvazogVG9rZW4uTU9VU0VZLCB2YWw6IDAsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0JFRk9SRSB9XHJcblx0XHRcdClcclxuXHRcdFx0aSArPSAyXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBJbnNlcnQgaW1wbGljaXQgbXVsdGlwbGljYXRpb25cclxuXHRmb3IgKGxldCBpID0gMTsgaSA8IG9wcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0aWYgKChvcHNbaSAtIDFdLmZsYWdzICYgVG9rZW5GbGFnLklNUExfTVVMVF9BRlRFUikgJiYgKG9wc1tpXS5mbGFncyAmIFRva2VuRmxhZy5JTVBMX01VTFRfQkVGT1JFKSkge1xyXG5cdFx0XHRvcHMuc3BsaWNlKGksIDAsIHsgdG9rOiBUb2tlbi5NVUxULCB2YWw6IDAsIGZsYWdzOiAwIH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBJbnNlcnQgcGFyZW50aGVzZXMgYmFzZWQgb24gcHJlY2VkZW5jZVxyXG5cdGZvciAobGV0IHByZWMgPSBNQVhfUFJFQ0VERU5DRTsgcHJlYyA+IDA7IHByZWMtLSkge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvcHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKFRva2VuUHJlY2VkZW5jZVtvcHNbaV0udG9rXSA9PT0gcHJlYykge1xyXG5cdFx0XHRcdGxldCBsZWZ0ID0gMFxyXG5cdFx0XHRcdGxldCByaWdodCA9IG9wcy5sZW5ndGhcclxuXHRcdFx0XHRsZXQgbGV2ZWwgPSAwXHJcblxyXG5cdFx0XHRcdC8vIEZpbmQgbGVmdCBib3VuZHJ5XHJcblx0XHRcdFx0Zm9yIChsZXQgaiA9IGk7IGogPj0gMDsgai0tKSB7XHJcblx0XHRcdFx0XHRpZiAob3BzW2pdLmZsYWdzICYgVG9rZW5GbGFnLkJFR0lOX1NDT1BFKSB7XHJcblx0XHRcdFx0XHRcdGxldmVsKytcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAob3BzW2pdLmZsYWdzICYgVG9rZW5GbGFnLkVORF9TQ09QRSkge1xyXG5cdFx0XHRcdFx0XHRsZXZlbC0tXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKChUb2tlblByZWNlZGVuY2Vbb3BzW2pdLnRva10gPCBwcmVjICYmIGxldmVsID09PSAwKSB8fCBsZXZlbCA+IDApIHtcclxuXHRcdFx0XHRcdFx0bGVmdCA9IGogKyAxXHJcblx0XHRcdFx0XHRcdGJyZWFrXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBGaW5kIHJpZ2h0IGJvdW5kcnlcclxuXHRcdFx0XHRsZXZlbCA9IDBcclxuXHRcdFx0XHRmb3IgKGxldCBqID0gaTsgaiA8IG9wcy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0aWYgKG9wc1tqXS5mbGFncyAmIFRva2VuRmxhZy5CRUdJTl9TQ09QRSkge1xyXG5cdFx0XHRcdFx0XHRsZXZlbCsrXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG9wc1tqXS5mbGFncyAmIFRva2VuRmxhZy5FTkRfU0NPUEUpIHtcclxuXHRcdFx0XHRcdFx0bGV2ZWwtLVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICgoVG9rZW5QcmVjZWRlbmNlW29wc1tqXS50b2tdIDwgcHJlYyAmJiBsZXZlbCA9PT0gMCkgfHwgbGV2ZWwgPCAwKSB7XHJcblx0XHRcdFx0XHRcdHJpZ2h0ID0galxyXG5cdFx0XHRcdFx0XHRicmVha1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gSW5zZXJ0IHBhcmVudGhlc2lzXHJcblx0XHRcdFx0b3BzLnNwbGljZShyaWdodCwgMCwgeyB0b2s6IFRva2VuLlBBUkVOX0NMLCB2YWw6IDAsIGZsYWdzOiBUb2tlbkZsYWcuSU1QTF9NVUxUX0FGVEVSIHwgVG9rZW5GbGFnLlVOSVFVRSB8IFRva2VuRmxhZy5FTkRfU0NPUEUgfSlcclxuXHRcdFx0XHRvcHMuc3BsaWNlKGxlZnQsIDAsIHsgdG9rOiBUb2tlbi5QQVJFTl9PUCwgdmFsOiAwLCBmbGFnczogVG9rZW5GbGFnLklNUExfTVVMVF9CRUZPUkUgfCBUb2tlbkZsYWcuVU5JUVVFIHwgVG9rZW5GbGFnLkJFR0lOX1NDT1BFIH0pXHJcblx0XHRcdFx0aSsrXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIEluc2VydCB6ZXJvIGJlZm9yZSBsZWFkaW5nIG1pbnVzXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvcHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmIChvcHNbaV0udG9rID09PSBUb2tlbi5TVUIgJiYgKGkgPT09IDAgfHwgKG9wc1tpIC0gMV0uZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpKSkge1xyXG5cdFx0XHRvcHMuc3BsaWNlKGksIDAsIHsgdG9rOiBUb2tlbi5OVU0sIHZhbDogMCwgZmxhZ3M6IFRva2VuRmxhZy5JTVBMX01VTFRfQUZURVIgfSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBvcHNcclxufVxyXG5cclxuY29uc3Qgb3B0aW1pemUgPSAob3BzOiBPcENvZGVbXSk6IE9wQ29kZVtdIHwgbnVsbCA9PiB7XHJcblx0Ly8gVHJ1bmNhdGUgY29uc2VjdXRpdmUgbmVnYXRpdmUgc2lnbnNcclxuXHRsZXQgbnVtQ29uc2VjU3ViID0gMFxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgb3BzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRpZiAob3BzW2ldLnRvayA9PT0gVG9rZW4uU1VCKSB7XHJcblx0XHRcdG51bUNvbnNlY1N1YisrXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAobnVtQ29uc2VjU3ViID4gMSkge1xyXG5cdFx0XHRcdGlmIChudW1Db25zZWNTdWIgJSAyID09PSAxKSB7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG51bUNvbnNlY1N1YiAtIDE7IGorKykge1xyXG5cdFx0XHRcdFx0XHRvcHMuc3BsaWNlKGkgLSBudW1Db25zZWNTdWIsIDEpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbnVtQ29uc2VjU3ViOyBqKyspIHtcclxuXHRcdFx0XHRcdFx0b3BzLnNwbGljZShpIC0gbnVtQ29uc2VjU3ViLCAxKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0b3BzLnNwbGljZShpIC0gbnVtQ29uc2VjU3ViLCAwLCB7IHRvazogVG9rZW4uQURELCB2YWw6IDAsIGZsYWdzOiAwIH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdG51bUNvbnNlY1N1YiA9IDBcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFJlbW92ZSBlbXB0eSBwYXJlbnRoZXNpc1xyXG5cdGZvciAobGV0IGkgPSAxOyBpIDwgb3BzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRpZiAoKG9wc1tpXS5mbGFncyAmIFRva2VuRmxhZy5FTkRfU0NPUEUpICYmIChvcHNbaSAtIDFdLmZsYWdzICYgVG9rZW5GbGFnLkJFR0lOX1NDT1BFKSkge1xyXG5cdFx0XHRvcHMuc3BsaWNlKGkgLSAxLCAyKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIG9wc1xyXG59XHJcblxyXG5jb25zdCBidWlsZEFTVCA9IChvcHM6IE9wQ29kZVtdKTogQVNUTm9kZSB8IG51bGwgPT4ge1xyXG5cdGNvbnN0IHJvb3Q6IEFTVE5vZGUgPSB7IG9wOiB7IHRvazogVG9rZW4uTk9ORSwgdmFsOiAwLCBmbGFnczogMCB9LCBsZWZ0OiBudWxsLCByaWdodDogbnVsbCB9XHJcblx0bGV0IGN1cnJlbnQ6IEFTVE5vZGUgPSByb290XHJcblx0Y29uc3Qgc3RhY2s6IEFTVE5vZGVbXSA9IFtdXHJcblx0bGV0IGxldmVsID0gMFxyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG9wcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0Y29uc3Qgb3AgPSBvcHNbaV1cclxuXHJcblx0XHRpZiAob3AuZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpIHtcclxuXHRcdFx0bGV2ZWwrK1xyXG5cdFx0fSBlbHNlIGlmIChvcC5mbGFncyAmIFRva2VuRmxhZy5FTkRfU0NPUEUpIHtcclxuXHRcdFx0aWYgKGxldmVsIDw9IDApIHtcclxuXHRcdFx0XHRyZXBvcnRFcnJvcignVW5leHBlY3RlZCBlbmQgb2Ygc2NvcGUnLCBpKVxyXG5cdFx0XHRcdHJldHVybiBudWxsXHJcblx0XHRcdH1cclxuXHRcdFx0bGV2ZWwtLVxyXG5cdFx0XHRjdXJyZW50ID0gc3RhY2sucG9wKCkgYXMgQVNUTm9kZVxyXG5cdFx0XHRjb250aW51ZVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChjdXJyZW50Lm9wID09IG51bGwgfHwgY3VycmVudC5vcC50b2sgPT09IFRva2VuLk5PTkUgfHwgKGN1cnJlbnQub3AuZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpKSB7XHJcblx0XHRcdGN1cnJlbnQub3AgPSBvcFxyXG5cclxuXHRcdFx0aWYgKGN1cnJlbnQub3AuZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpIHtcclxuXHRcdFx0XHRzdGFjay5wdXNoKGN1cnJlbnQpXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmIChjdXJyZW50LmxlZnQgPT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmIChjdXJyZW50Lm9wLmZsYWdzICYgVG9rZW5GbGFnLlBSRUZJWCkge1xyXG5cdFx0XHRcdFx0Y3VycmVudC5sZWZ0ID0geyBvcDogeyB0b2s6IFRva2VuLlVOREVGLCB2YWw6IDAsIGZsYWdzOiAwIH0sIGxlZnQ6IG51bGwsIHJpZ2h0OiBudWxsIH1cclxuXHRcdFx0XHRcdGN1cnJlbnQucmlnaHQgPSB7IG9wLCBsZWZ0OiBudWxsLCByaWdodDogbnVsbCB9XHJcblxyXG5cdFx0XHRcdFx0aWYgKGN1cnJlbnQucmlnaHQub3AuZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpIHtcclxuXHRcdFx0XHRcdFx0c3RhY2sucHVzaChjdXJyZW50KVxyXG5cdFx0XHRcdFx0XHRjdXJyZW50ID0gY3VycmVudC5yaWdodFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y29udGludWVcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnN0IHRtcCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY3VycmVudCkpXHJcblx0XHRcdFx0Y3VycmVudC5sZWZ0ID0gdG1wXHJcblx0XHRcdFx0Y3VycmVudC5vcCA9IG9wXHJcblx0XHRcdH0gZWxzZSBpZiAoY3VycmVudC5yaWdodCA9PSBudWxsIHx8IChjdXJyZW50LnJpZ2h0Lm9wLmZsYWdzICYgVG9rZW5GbGFnLkJFR0lOX1NDT1BFKSkge1xyXG5cdFx0XHRcdGN1cnJlbnQucmlnaHQgPSB7IG9wLCBsZWZ0OiBudWxsLCByaWdodDogbnVsbCB9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKGN1cnJlbnQucmlnaHQub3AuZmxhZ3MgJiBUb2tlbkZsYWcuQkVHSU5fU0NPUEUpIHtcclxuXHRcdFx0XHRcdHN0YWNrLnB1c2goY3VycmVudClcclxuXHRcdFx0XHRcdGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKGN1cnJlbnQucmlnaHQub3AuZmxhZ3MgJiBUb2tlbkZsYWcuUFJFRklYICYmIGN1cnJlbnQucmlnaHQucmlnaHQgPT0gbnVsbCkge1xyXG5cdFx0XHRcdHN0YWNrLnB1c2goY3VycmVudClcclxuXHRcdFx0XHRjdXJyZW50ID0gY3VycmVudC5yaWdodFxyXG5cdFx0XHRcdGN1cnJlbnQucmlnaHQgPSB7IG9wLCBsZWZ0OiBudWxsLCByaWdodDogbnVsbCB9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc3QgdG1wID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjdXJyZW50KSlcclxuXHRcdFx0XHRjdXJyZW50LmxlZnQgPSB0bXBcclxuXHRcdFx0XHRjdXJyZW50LnJpZ2h0ID0gbnVsbFxyXG5cdFx0XHRcdGN1cnJlbnQub3AgPSBvcFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpZiAobGV2ZWwgIT09IDApIHtcclxuXHRcdHJlcG9ydEVycm9yKCdVbmV4cGVjdGVkIGVuZCBvZiBleHByZXNzaW9uJywgb3BzLmxlbmd0aClcclxuXHRcdHJldHVybiBudWxsXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcm9vdFxyXG59XHJcbiIsImltcG9ydCB7IGdldEdsb2JhbFRpbWUsIHNjaGVkdWxlUmVkcmF3IH0gZnJvbSAnLi4vLi4vaW5kZXgnXHJcbmltcG9ydCB7IGdldERvbWFpbiB9IGZyb20gJy4uL2NhbnZhcy9jYW52YXNDb3JlJ1xyXG5pbXBvcnQgeyBnZXRQbG90c1NoYWRlckluZm8gfSBmcm9tICcuLi9jb3JlL2NvbnRyb2xsZXInXHJcbmltcG9ydCB7IFBsb3REaXNwbGF5TW9kZSB9IGZyb20gJy4uL2RlZmluZXMnXHJcbmltcG9ydCAqIGFzIG1hdDQgZnJvbSAnLi4vbGliL2dsLW1hdHJpeC9tYXQ0J1xyXG5pbXBvcnQgeyBnZXRNb3VzZVBvcyB9IGZyb20gJy4uL3VpL3VzZXJJbnRlcmFjdCdcclxuXHJcbmNvbnN0IGRldmlhdGlvbiA9IDAuMDA0XHJcblxyXG5sZXQgaW5mbzogYW55ID0gbnVsbFxyXG5sZXQgYnVmZmVyczogV2ViR0xCdWZmZXIgfCBudWxsID0gbnVsbFxyXG5sZXQgc2hhZGVyc0FyZUluaXRpYWxpemluZyA9IGZhbHNlXHJcbmxldCBzaGFkZXJzSW5pdGlhbGl6ZWQgPSBmYWxzZVxyXG5sZXQgZXJyb3IgPSBmYWxzZVxyXG5jb25zdCBmaWxlQnVmZmVyczoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fVxyXG5cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NoYWRlci1jYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxyXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wyJykgYXMgV2ViR0xSZW5kZXJpbmdDb250ZXh0XHJcblxyXG5leHBvcnQgY29uc3Qgc2hhZGVyc0NsZWFyQWxsID0gZnVuY3Rpb24gKCkge1xyXG5cdHNjaGVkdWxlUmVsb2FkU2hhZGVycygpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpbml0U2hhZGVyQ29yZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoIWNhbnZhcyB8fCAhY3R4KSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gaW5pdGlhbGl6ZSBXZWJHTCBjb250ZXh0LicpXHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzY2hlZHVsZVJlbG9hZFNoYWRlcnMgKCkge1xyXG5cdGVycm9yID0gZmFsc2VcclxuXHRzaGFkZXJzSW5pdGlhbGl6ZWQgPSBmYWxzZVxyXG5cdHNoYWRlcnNBcmVJbml0aWFsaXppbmcgPSBmYWxzZVxyXG5cdHNjaGVkdWxlUmVkcmF3KClcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hCdWZmZXJlZCAodXJsOiBzdHJpbmcpIHtcclxuXHRpZiAoIWZpbGVCdWZmZXJzW3VybF0pIHtcclxuXHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKVxyXG5cdFx0Y29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG5cdFx0ZmlsZUJ1ZmZlcnNbdXJsXSA9IHRleHRcclxuXHRcdHJldHVybiB0ZXh0XHJcblx0fVxyXG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoZmlsZUJ1ZmZlcnNbdXJsXSlcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gbG9hZFNoYWRlcnMgKCkge1xyXG5cdHNoYWRlcnNBcmVJbml0aWFsaXppbmcgPSB0cnVlXHJcblxyXG5cdGF3YWl0IFByb21pc2UuYWxsKFtcclxuXHRcdGZldGNoQnVmZmVyZWQoJ2Fzc2V0cy9zaGFkZXJzL3Bsb3QudmVydCcpLFxyXG5cdFx0ZmV0Y2hCdWZmZXJlZCgnYXNzZXRzL3NoYWRlcnMvcGxvdC5mcmFnJylcclxuXHRdKS50aGVuKHNoYWRlcnMgPT4ge1xyXG5cdFx0c2hhZGVyc1sxXSA9IGluamVjdEZ1bmN0aW9uc0ludG9TaGFkZXJTb3VyY2Uoc2hhZGVyc1sxXSlcclxuXHJcblx0XHRjb25zdCBwcm9ncmFtID0gaW5pdFNoYWRlcnMoc2hhZGVyc1swXSwgc2hhZGVyc1sxXSlcclxuXHRcdGlmICghcHJvZ3JhbSkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBzaGFkZXJzJylcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblxyXG5cdFx0aW5mbyA9IHtcclxuXHRcdFx0cHJvZ3JhbSxcclxuXHRcdFx0YXR0cmliTG9jYXRpb25zOiB7XHJcblx0XHRcdFx0dmVydGV4UG9zaXRpb246IGN0eC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCAnYVZlcnRleFBvc2l0aW9uJylcclxuXHRcdFx0fSxcclxuXHRcdFx0dW5pZm9ybUxvY2F0aW9uczoge1xyXG5cdFx0XHRcdHByb2plY3Rpb25NYXRyaXg6IGN0eC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgJ3VQcm9qZWN0aW9uTWF0cml4JyksXHJcblx0XHRcdFx0bW9kZWxWaWV3TWF0cml4OiBjdHguZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1TW9kZWxWaWV3TWF0cml4JyksXHJcblx0XHRcdFx0dV9yZXNvbHV0aW9uOiBjdHguZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1X3Jlc29sdXRpb24nKSxcclxuXHRcdFx0XHR1X21vdXNlOiBjdHguZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1X21vdXNlJyksXHJcblx0XHRcdFx0dV90aW1lOiBjdHguZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1X3RpbWUnKSxcclxuXHRcdFx0XHR1X2RldmlhdGlvbjogY3R4LmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCAndV9kZXZpYXRpb24nKSxcclxuXHRcdFx0XHR1X2RvbWFpbl94OiBjdHguZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1X2RvbWFpbl94JyksXHJcblx0XHRcdFx0dV9kb21haW5feTogY3R4LmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCAndV9kb21haW5feScpLFxyXG5cdFx0XHRcdHVfZGlzcGxheV9tb2RlOiBjdHguZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1X2Rpc3BsYXlfbW9kZScpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGJ1ZmZlcnMgPSBpbml0QnVmZmVycygpXHJcblx0XHRcclxuXHRcdHNoYWRlcnNJbml0aWFsaXplZCA9IHRydWVcclxuXHRcdHNoYWRlcnNBcmVJbml0aWFsaXppbmcgPSBmYWxzZVxyXG5cdH0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaGFkZXJDb3JlVXBkYXRlICgpIHtcclxuXHQvLyBTaGFkZXJzIGFyZSBub3QgbG9hZGVkIHlldFxyXG5cdGlmICghc2hhZGVyc0luaXRpYWxpemVkICYmICFzaGFkZXJzQXJlSW5pdGlhbGl6aW5nICYmICFlcnJvcikge1xyXG5cdFx0bG9hZFNoYWRlcnMoKVxyXG5cdFx0XHJcblx0XHRpZiAoZXJyb3IpIHtcclxuXHRcdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvYWQgc2hhZGVycycpXHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2hhZGVyc0RyYXcgPSBmdW5jdGlvbiAoKSB7XHJcblx0c2hhZGVyc0luaXRpYWxpemVkID0gZmFsc2VcclxuXHJcblx0bG9hZFNoYWRlcnMoKS50aGVuKFxyXG5cdFx0KCkgPT4ge1xyXG5cdFx0XHRpZiAoIXNoYWRlcnNJbml0aWFsaXplZCkge1xyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBpbml0aWFsaXplIHNoYWRlcnMnKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHR9XHJcblx0XHRcdGRyYXdTY2VuZSgpXHJcblx0XHR9XHJcblx0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBpbmplY3RGdW5jdGlvbnNJbnRvU2hhZGVyU291cmNlIChzaGFkZXI6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0Y29uc3QgcGxvdHM6IHsgZnVuY3Rpb25zOiBzdHJpbmdbXSwgY29sb3JzOiBzdHJpbmdbXSwgZGlzcGxheU1vZGVzOiBQbG90RGlzcGxheU1vZGVbXSwgbnVtUGxvdHM6IG51bWJlciB9ID0gZ2V0UGxvdHNTaGFkZXJJbmZvKClcclxuXHRcclxuXHRpZiAocGxvdHMubnVtUGxvdHMgPT09IDApIHtcclxuXHRcdHBsb3RzLmZ1bmN0aW9ucyA9IFtdXHJcblx0XHRwbG90cy5jb2xvcnMgPSBbJyddXHJcblx0XHRwbG90cy5kaXNwbGF5TW9kZXMgPSBbUGxvdERpc3BsYXlNb2RlLk5PTkVdXHJcblx0fVxyXG5cclxuXHRwbG90cy5mdW5jdGlvbnMucHVzaCgnMC4wJylcclxuXHJcblx0cmV0dXJuIHNoYWRlclxyXG5cdFx0LnJlcGxhY2UoL1VTRVJfTlVNX0ZVTkNfSU5KL2csIGAke3Bsb3RzLm51bVBsb3RzICsgMX1gKVxyXG5cdFx0LnJlcGxhY2UoL1VTRVJfRlVOQ19JTkovZywgYGZsb2F0W10oJHtwbG90cy5mdW5jdGlvbnMubWFwKGYgPT4gYCgke2Z9KWApLmpvaW4oJywnKX0pYClcclxuXHRcdC5yZXBsYWNlKC9VU0VSX0NPTF9JTkovZywgYCR7cGxvdHMuY29sb3JzLm1hcChjID0+IGBcIiR7Y31cImApLmpvaW4oJywnKX1gKVxyXG5cdFx0LnJlcGxhY2UoL1VTRVJfRElTUF9JTkovZywgYGludFtdKCR7cGxvdHMuZGlzcGxheU1vZGVzLm1hcChkID0+IGAke2R9YCkuam9pbignLCcpfSlgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0U2hhZGVycyAodmVydFNyYzogc3RyaW5nLCBmcmFnU3JjOiBzdHJpbmcpIHtcclxuXHQvLyBsb2FkIHNvdXJjZVxyXG5cdGNvbnN0IHZlcnRTaGFkZXIgPSBsb2FkU2hhZGVyKGN0eC5WRVJURVhfU0hBREVSLCB2ZXJ0U3JjKVxyXG5cdGNvbnN0IGZyYWdTaGFkZXIgPSBsb2FkU2hhZGVyKGN0eC5GUkFHTUVOVF9TSEFERVIsIGZyYWdTcmMpXHJcblx0XHJcblx0aWYgKCF2ZXJ0U2hhZGVyIHx8ICFmcmFnU2hhZGVyKSB7XHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cdH1cclxuXHRcclxuXHQvLyBjcmVhdGUgcHJvZ3JhbVxyXG5cdGNvbnN0IHByb2dyYW0gPSBjdHguY3JlYXRlUHJvZ3JhbSgpXHJcblx0aWYgKCFwcm9ncmFtKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIHByb2dyYW0nKVxyXG5cdFx0cmV0dXJuIG51bGxcclxuXHR9XHJcblx0XHJcblx0Y3R4LmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0U2hhZGVyKVxyXG5cdGN0eC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ1NoYWRlcilcclxuXHRjdHgubGlua1Byb2dyYW0ocHJvZ3JhbSlcclxuXHRcclxuXHQvLyBjaGVjayBpZiBwcm9ncmFtIGlzIGxpbmtlZFxyXG5cdGlmICghY3R4LmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgY3R4LkxJTktfU1RBVFVTKSkge1xyXG5cdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxpbmsgcHJvZ3JhbTogJyArIGN0eC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKSlcclxuXHRcdHJldHVybiBudWxsXHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBwcm9ncmFtXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTaGFkZXIgKHR5cGU6IG51bWJlciwgc291cmNlOiBzdHJpbmcpIHtcclxuXHRjb25zdCBzaGFkZXIgPSBjdHguY3JlYXRlU2hhZGVyKHR5cGUpXHJcblx0aWYgKCFzaGFkZXIpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgc2hhZGVyJylcclxuXHRcdHJldHVybiBudWxsXHJcblx0fVxyXG5cdFxyXG5cdGN0eC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpXHJcblx0Y3R4LmNvbXBpbGVTaGFkZXIoc2hhZGVyKVxyXG5cdFxyXG5cdC8vIGNoZWNrIGlmIHNoYWRlciBjb21waWxlZFxyXG5cdGlmICghY3R4LmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGN0eC5DT01QSUxFX1NUQVRVUykpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjb21waWxlIHNoYWRlcjogJyArIGN0eC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpXHJcblx0XHRjdHguZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpXHJcblx0XHRjdHguZGVsZXRlU2hhZGVyKHNoYWRlcilcclxuXHRcdHJldHVybiBudWxsXHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBzaGFkZXJcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdEJ1ZmZlcnMgKCk6IFdlYkdMQnVmZmVyIHwgbnVsbCB7XHJcblx0Y29uc3QgcG9zaXRpb25CdWZmZXIgPSBjdHguY3JlYXRlQnVmZmVyKClcclxuXHRjdHguYmluZEJ1ZmZlcihjdHguQVJSQVlfQlVGRkVSLCBwb3NpdGlvbkJ1ZmZlcilcclxuXHRcclxuXHQvLyBTcXVhcmVcclxuXHRjb25zdCBwb3NpdGlvbnMgPSBbXHJcblx0XHQxLjAsIDEuMCxcclxuXHRcdC0xLjAsIDEuMCxcclxuXHRcdDEuMCwgLTEuMCxcclxuXHRcdC0xLjAsIC0xLjBcclxuXHRdXHJcblx0XHJcblx0Y3R4LmJ1ZmZlckRhdGEoY3R4LkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLCBjdHguU1RBVElDX0RSQVcpXHJcblx0XHJcblx0cmV0dXJuIHBvc2l0aW9uQnVmZmVyXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdTY2VuZSAoKSB7XHJcblx0Ly8gQ2xlYXJcclxuXHRjdHguY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApXHJcblx0Y3R4LmNsZWFyRGVwdGgoMS4wKVxyXG5cdGN0eC5lbmFibGUoY3R4LkRFUFRIX1RFU1QpXHJcblx0Y3R4LmRlcHRoRnVuYyhjdHguTEVRVUFMKVxyXG5cdGN0eC5jbGVhcihjdHguQ09MT1JfQlVGRkVSX0JJVCB8IGN0eC5ERVBUSF9CVUZGRVJfQklUKVxyXG5cdFxyXG5cdC8vIFBlcnNwZWN0aXZlXHJcblx0Y29uc3QgZm92ID0gNDUgKiBNYXRoLlBJIC8gMTgwXHJcblx0Y29uc3QgYXNwZWN0ID0gY3R4LmNhbnZhcy5jbGllbnRXaWR0aCAvIGN0eC5jYW52YXMuY2xpZW50SGVpZ2h0XHJcblx0Y29uc3Qgek5lYXIgPSAwLjFcclxuXHRjb25zdCB6RmFyID0gMTAwLjBcclxuXHRjb25zdCBwcm9qZWN0aW9uTWF0cml4ID0gbWF0NC5jcmVhdGUoKVxyXG5cdFxyXG5cdG1hdDQucGVyc3BlY3RpdmUocHJvamVjdGlvbk1hdHJpeCwgZm92LCBhc3BlY3QsIHpOZWFyLCB6RmFyKVxyXG5cdFxyXG5cdGNvbnN0IG1vZGVsVmlld01hdHJpeCA9IG1hdDQuY3JlYXRlKClcclxuXHRcclxuXHRtYXQ0LnRyYW5zbGF0ZShtb2RlbFZpZXdNYXRyaXgsIG1vZGVsVmlld01hdHJpeCwgWzAsIDAsIC0xXSlcclxuXHRcclxuXHRjb25zdCBudW1Db21wb25lbnRzID0gMlxyXG5cdGNvbnN0IHR5cGUgPSBjdHguRkxPQVRcclxuXHRjb25zdCBub3JtYWxpemUgPSBmYWxzZVxyXG5cdGNvbnN0IHN0cmlkZSA9IDBcclxuXHRjb25zdCBvZmZzZXQgPSAwXHJcblx0XHJcblx0Y3R4LmJpbmRCdWZmZXIoY3R4LkFSUkFZX0JVRkZFUiwgYnVmZmVycylcclxuXHRjdHgudmVydGV4QXR0cmliUG9pbnRlcihpbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhQb3NpdGlvbiwgbnVtQ29tcG9uZW50cywgdHlwZSwgbm9ybWFsaXplLCBzdHJpZGUsIG9mZnNldClcclxuXHRjdHguZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoaW5mby5hdHRyaWJMb2NhdGlvbnMudmVydGV4UG9zaXRpb24pXHJcblx0XHJcblx0Y3R4LnVzZVByb2dyYW0oaW5mby5wcm9ncmFtKVxyXG5cdFxyXG5cdGNvbnN0IG1vdXNlUG9zID0gZ2V0TW91c2VQb3MoKVxyXG5cdGNvbnN0IGRvbWFpbjogeyBtaW5YOiBudW1iZXIsIG1heFg6IG51bWJlciwgbWluWTogbnVtYmVyLCBtYXhZOiBudW1iZXIgfSA9IGdldERvbWFpbigpXHJcblx0XHJcblx0Ly8gU2V0IHVuaWZvcm1zXHJcblx0Y3R4LnVuaWZvcm1NYXRyaXg0ZnYoaW5mby51bmlmb3JtTG9jYXRpb25zLnByb2plY3Rpb25NYXRyaXgsIGZhbHNlLCBwcm9qZWN0aW9uTWF0cml4KVxyXG5cdGN0eC51bmlmb3JtTWF0cml4NGZ2KGluZm8udW5pZm9ybUxvY2F0aW9ucy5tb2RlbFZpZXdNYXRyaXgsIGZhbHNlLCBtb2RlbFZpZXdNYXRyaXgpXHJcblx0Y3R4LnVuaWZvcm0yZihpbmZvLnVuaWZvcm1Mb2NhdGlvbnMudV9yZXNvbHV0aW9uLCBjdHguY2FudmFzLndpZHRoLCBjdHguY2FudmFzLmhlaWdodClcclxuXHRjdHgudW5pZm9ybTJmKGluZm8udW5pZm9ybUxvY2F0aW9ucy51X21vdXNlLCBtb3VzZVBvcy54LCBtb3VzZVBvcy55KVxyXG5cdGN0eC51bmlmb3JtMmYoaW5mby51bmlmb3JtTG9jYXRpb25zLnVfZG9tYWluX3gsIGRvbWFpbi5taW5YLCBkb21haW4ubWF4WClcclxuXHRjdHgudW5pZm9ybTJmKGluZm8udW5pZm9ybUxvY2F0aW9ucy51X2RvbWFpbl95LCBkb21haW4ubWluWSwgZG9tYWluLm1heFkpXHJcblx0Y3R4LnVuaWZvcm0xZihpbmZvLnVuaWZvcm1Mb2NhdGlvbnMudV90aW1lLCBnZXRHbG9iYWxUaW1lKCkpXHJcblx0Y3R4LnVuaWZvcm0xZihpbmZvLnVuaWZvcm1Mb2NhdGlvbnMudV9kZXZpYXRpb24sIGRldmlhdGlvbilcclxuXHRjdHgudW5pZm9ybTFpKGluZm8udW5pZm9ybUxvY2F0aW9ucy51X2Rpc3BsYXlfbW9kZSwgMCkgLy8gVE9ET1xyXG5cdFxyXG5cdGNvbnN0IHZlcnRleENvdW50ID0gNFxyXG5cdGN0eC5kcmF3QXJyYXlzKGN0eC5UUklBTkdMRV9TVFJJUCwgb2Zmc2V0LCB2ZXJ0ZXhDb3VudClcclxufVxyXG4iLCJpbXBvcnQgeyBBU1ROb2RlIH0gZnJvbSAnLi4vbGFuZy9wYXJzZXInXHJcblxyXG5leHBvcnQgY29uc3QgYnVpbGRTaGFkZXJGdW5jdGlvbiA9IChhc3Q6IEFTVE5vZGUgfCBudWxsKTogc3RyaW5nID0+IHtcclxuICAgIC8vIFRPRE9cclxuICAgIHJldHVybiAneDx5PzEuMDowLjAnXHJcbn1cclxuIiwiaW1wb3J0IHsgc2NoZWR1bGVSZWRyYXcgfSBmcm9tICcuLi8uLi9pbmRleCdcclxuaW1wb3J0IHsgcmVzZXRQbG90cywgc2V0SW5wdXRBdCwgc2V0TnVtSW5wdXRzIH0gZnJvbSAnLi4vY29yZS9jb250cm9sbGVyJ1xyXG5pbXBvcnQgeyBQbG90RHJpdmVyLCBQbG90U3RhdHVzIH0gZnJvbSAnLi4vZGVmaW5lcydcclxuaW1wb3J0IHsgc3RyaW5nVG9IVE1MLCBWZWN0b3IgfSBmcm9tICcuLi91dGlscydcclxuaW1wb3J0IHsgb25Nb3VzZURyYWcgfSBmcm9tICcuL3VzZXJJbnRlcmFjdCdcclxuXHJcbmNvbnN0IGlucHV0c0VsdDogSFRNTEVsZW1lbnQgfCBhbnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5wdXRzJylcclxuY29uc3QgcmVzaXplQXJlYTogSFRNTEVsZW1lbnQgfCBhbnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzaXplLWxlZnQtcGFuZWwnKVxyXG5cclxubGV0IGN1cnJlbnRJbnB1dEluZGV4ID0gMFxyXG5sZXQgbnVtSW5wdXRzID0gMFxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRMZWZ0UGFuZWwgPSBmdW5jdGlvbiAoKTogdm9pZCB7XHJcblx0b25Nb3VzZURyYWcocmVzaXplQXJlYSwgKG1vdXNlOiBWZWN0b3IpID0+IHtcclxuXHRcdGNvbnN0IHdpZHRoID0gTWF0aC5tYXgoMjUwLCBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aCAqIDAuOTUsIG1vdXNlLngpKVxyXG5cdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWxlZnQtcGFuZWwtd2lkdGgnLCBgJHt3aWR0aH1weGApXHJcblx0XHRzY2hlZHVsZVJlZHJhdygpXHJcblx0fSlcclxuXHRcclxuXHRhZGROZXdJbnB1dCgpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBhZGROZXdJbnB1dCA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcclxuXHRjb25zdCBlbHRTdHIgPSBgXHJcblx0PGRpdiBjbGFzcz1cImlucHV0XCI+XHJcblx0PGRpdiBjbGFzcz1cInN0YXR1c1wiPjxkaXYgY2xhc3M9XCJpbmRpY2F0b3JcIj48L2Rpdj48L2Rpdj5cclxuXHQ8aW5wdXQgdHlwZT1cInRleHRcIiBzcGVsbGNoZWNrPVwiZmFsc2VcIiBhdXRvY29ycmVjdD1cIm9mZlwiIGF1dG9jb21wbGV0ZT1cIm9mZlwiIGF1dG9jYXBpdGFsaXplPVwib2ZmXCIgYXV0b2ZvY3VzPlxyXG5cdDxkaXYgY2xhc3M9XCJkZWxldGVcIj7DlzwvZGl2PlxyXG5cdDxkaXYgY2xhc3M9XCJjb25zdC1ldmFsXCI+PC9kaXY+XHJcblx0PC9kaXY+YFxyXG5cdFxyXG5cdGNvbnN0IGVsdDogSFRNTEVsZW1lbnQgPSBzdHJpbmdUb0hUTUwoZWx0U3RyKS5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XHJcblx0Y29uc3QgZWx0SW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBhbnkgPSBlbHQucXVlcnlTZWxlY3RvcignaW5wdXQnKVxyXG5cdGNvbnN0IGVsdERlbGV0ZTogSFRNTEVsZW1lbnQgfCBhbnkgPSBlbHQucXVlcnlTZWxlY3RvcignLmRlbGV0ZScpXHJcblx0Y29uc3QgZWx0SW5kaWNhdG9yOiBIVE1MRWxlbWVudCB8IGFueSA9IGVsdC5xdWVyeVNlbGVjdG9yKCcuaW5kaWNhdG9yJylcclxuXHRcclxuXHRlbHRJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChlOiBLZXlib2FyZEV2ZW50KSB7XHJcblx0XHRpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHRcdGlmIChudW1JbnB1dHMgPiBjdXJyZW50SW5wdXRJbmRleCkge1xyXG5cdFx0XHRcdGNvbnN0IG5leHRFbHQgPSBpbnB1dHNFbHQucXVlcnlTZWxlY3RvcihgLmlucHV0W2RhdGEtaW5wdXQtaWR4PVwiJHsrK2N1cnJlbnRJbnB1dEluZGV4fVwiXWApXHJcblx0XHRcdFx0YWN0aXZhdGVJbnB1dChuZXh0RWx0KVxyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0bmV4dEVsdC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpPy5mb2N1cygpXHJcblx0XHRcdFx0fSwgMClcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0fVxyXG5cdFx0XHRhZGROZXdJbnB1dCgpXHJcblx0XHR9XHJcblx0fSlcclxuXHRcclxuXHRlbHRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlOiBNb3VzZUV2ZW50KSB7XHJcblx0XHRhY3RpdmF0ZUlucHV0KGVsdClcclxuXHRcdGN1cnJlbnRJbnB1dEluZGV4ID0gcGFyc2VJbnQoZWx0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbnB1dC1pZHgnKSB8fCAnMCcpXHJcblx0XHRlbHRJbnB1dD8uZm9jdXMoKVxyXG5cdH0pXHJcblx0XHJcblx0ZWx0SW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24gKGU6IEZvY3VzRXZlbnQpIHtcclxuXHRcdGFjdGl2YXRlSW5wdXQoZWx0KVxyXG5cdFx0Y3VycmVudElucHV0SW5kZXggPSBwYXJzZUludChlbHQuZ2V0QXR0cmlidXRlKCdkYXRhLWlucHV0LWlkeCcpIHx8ICcwJylcclxuXHR9KVxyXG5cclxuXHRlbHRJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoZTogSW5wdXRFdmVudCkge1xyXG5cdFx0Y3VycmVudElucHV0SW5kZXggPSBwYXJzZUludChlbHQuZ2V0QXR0cmlidXRlKCdkYXRhLWlucHV0LWlkeCcpIHx8ICcwJylcclxuXHJcblx0XHRpZiAoZWx0SW5kaWNhdG9yLmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRzZXRJbnB1dEF0KGN1cnJlbnRJbnB1dEluZGV4LCAnJylcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHNldElucHV0QXQoY3VycmVudElucHV0SW5kZXgsIGVsdElucHV0LnZhbHVlKVxyXG5cdFx0fVxyXG5cdH0pXHJcblx0XHJcblx0ZWx0RGVsZXRlPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlOiBNb3VzZUV2ZW50KSB7XHJcblx0XHQvLyBvbmx5IGVsZW1lbnQgbGVmdFxyXG5cdFx0aWYgKG51bUlucHV0cyA9PT0gMSkge1xyXG5cdFx0XHRlbHQuY2xhc3NMaXN0LmFkZCgnaWxsZWdhbCcpXHJcblxyXG5cdFx0XHRjb25zdCBlbHRJbnB1dDogSFRNTElucHV0RWxlbWVudCB8IGFueSA9IGVsdC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpXHJcblx0XHRcdGlmIChlbHRJbnB1dCkge1xyXG5cdFx0XHRcdGVsdElucHV0LnZhbHVlID0gJydcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgaW5kaWNhdG9yOiBIVE1MRWxlbWVudCB8IG51bGwgPSBlbHQucXVlcnlTZWxlY3RvcignLmluZGljYXRvcicpXHJcblx0XHRcdGluZGljYXRvcj8uY2xhc3NMaXN0LnJlbW92ZSgncGVuZGluZycsICdhY3RpdmUnLCAnZXJyb3InLCAnZGlzYWJsZWQnKVxyXG5cclxuXHRcdFx0Y29uc3QgY29uc3RFdmFsRWx0OiBIVE1MRWxlbWVudCB8IG51bGwgPSBlbHQucXVlcnlTZWxlY3RvcignLmNvbnN0LWV2YWwnKVxyXG5cdFx0XHRjb25zdEV2YWxFbHQ/LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG5cclxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiBlbHQuY2xhc3NMaXN0LnJlbW92ZSgnaWxsZWdhbCcpLCAyMDApXHJcblx0XHRcdFxyXG5cdFx0XHRzY2hlZHVsZVJlZHJhdygpXHJcblx0XHRcdHJlc2V0UGxvdHMoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHRlbHQuY2xhc3NMaXN0LmFkZCgnZGVsZXRlZCcpXHJcblxyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGVsdC5yZW1vdmUoKVxyXG5cdFx0XHRjb25zdCByZW1vdmVkSW5kZXggPSBwYXJzZUludChlbHQuZ2V0QXR0cmlidXRlKCdkYXRhLWlucHV0LWlkeCcpIHx8ICcwJylcclxuXHRcdFx0bnVtSW5wdXRzLS1cclxuXHRcdFx0c2V0TnVtSW5wdXRzKG51bUlucHV0cylcclxuXHRcdFx0XHJcblx0XHRcdC8vIHJlLWluZGV4IGlucHV0c1xyXG5cdFx0XHRjb25zdCBpbnB1dHMgPSBpbnB1dHNFbHQucXVlcnlTZWxlY3RvckFsbCgnLmlucHV0JylcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRpbnB1dHNbaV0uc2V0QXR0cmlidXRlKCdkYXRhLWlucHV0LWlkeCcsIChpICsgMSkudG9TdHJpbmcoKSlcclxuXHJcblx0XHRcdFx0Y29uc3QgZWx0SW5kaWNhdG9yID0gaW5wdXRzW2ldLnF1ZXJ5U2VsZWN0b3IoJy5pbmRpY2F0b3InKVxyXG5cdFx0XHRcdGlmIChlbHRJbmRpY2F0b3I/LmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkge1xyXG5cdFx0XHRcdFx0c2V0SW5wdXRBdChpICsgMSwgJycpXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHNldElucHV0QXQoaSArIDEsIGVsdElucHV0LnZhbHVlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Ly8gcmVtb3ZlZCBlbGVtZW50IGlzIGJlZm9yZSBjdXJyZW50IGVsZW1lbnQgb3IgZmlyc3QgZWxlbWVudFxyXG5cdFx0XHRpZiAobnVtSW5wdXRzID4gMCAmJiAocmVtb3ZlZEluZGV4IDw9IGN1cnJlbnRJbnB1dEluZGV4IHx8IHJlbW92ZWRJbmRleCA9PT0gMSkpIHtcclxuXHRcdFx0XHRjb25zdCBwcmV2RWx0ID0gaW5wdXRzRWx0LnF1ZXJ5U2VsZWN0b3IoYC5pbnB1dFtkYXRhLWlucHV0LWlkeD1cIiR7Y3VycmVudElucHV0SW5kZXggLSAxfVwiXWApXHJcblx0XHRcdFx0YWN0aXZhdGVJbnB1dChwcmV2RWx0KVxyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0cHJldkVsdC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpPy5mb2N1cygpXHJcblx0XHRcdFx0fSwgMClcclxuXHRcdFx0fVxyXG5cdFx0fSwgMTIwKVxyXG5cdH0pXHJcblxyXG5cdGVsdEluZGljYXRvcj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZTogTW91c2VFdmVudCkge1xyXG5cdFx0ZWx0SW5kaWNhdG9yLmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2FibGVkJylcclxuXHRcdGN1cnJlbnRJbnB1dEluZGV4ID0gcGFyc2VJbnQoZWx0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbnB1dC1pZHgnKSB8fCAnMCcpXHJcblxyXG5cdFx0aWYgKGVsdEluZGljYXRvci5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykpIHtcclxuXHRcdFx0c2V0SW5wdXRBdChjdXJyZW50SW5wdXRJbmRleCwgJycpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZXRJbnB1dEF0KGN1cnJlbnRJbnB1dEluZGV4LCBlbHRJbnB1dC52YWx1ZSlcclxuXHRcdH1cclxuXHR9KVxyXG5cdFxyXG5cdGVsdC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5wdXQtaWR4JywgKCsrY3VycmVudElucHV0SW5kZXgpLnRvU3RyaW5nKCkpXHJcblx0ZWx0LmNsYXNzTGlzdC5hZGQoJ2NyZWF0ZWQnKVxyXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0ZWx0LmNsYXNzTGlzdC5yZW1vdmUoJ2NyZWF0ZWQnKVxyXG5cdH0sIDEyMClcclxuXHJcblx0bnVtSW5wdXRzKytcclxuXHRzZXROdW1JbnB1dHMobnVtSW5wdXRzKVxyXG5cdGFjdGl2YXRlSW5wdXQoZWx0KVxyXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0ZWx0SW5wdXQ/LmZvY3VzKClcclxuXHR9LCAwKVxyXG5cdGlucHV0c0VsdC5hcHBlbmRDaGlsZChlbHQpXHJcbn1cclxuXHJcbmNvbnN0IGdldElucHV0RnJvbUluZGV4ID0gZnVuY3Rpb24gKGlkeDogbnVtYmVyKTogSFRNTElucHV0RWxlbWVudCB8IG51bGwge1xyXG5cdHJldHVybiBpbnB1dHNFbHQucXVlcnlTZWxlY3RvcihgLmlucHV0W2RhdGEtaW5wdXQtaWR4PVwiJHtpZHh9XCJdYClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGlucHV0U2V0Q29sb3JBdCA9IGZ1bmN0aW9uIChpZHg6IG51bWJlciwgY29sb3I6IHN0cmluZykge1xyXG5cdGdldElucHV0RnJvbUluZGV4KGlkeCk/LnNldEF0dHJpYnV0ZSgnZGF0YS1jb2xvcicsIGNvbG9yKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaW5wdXRTZXRFcnJvckF0ID0gZnVuY3Rpb24gKGlkeDogbnVtYmVyLCBlcnJvcjogc3RyaW5nKSB7XHJcblx0Y29uc3QgZWx0ID0gZ2V0SW5wdXRGcm9tSW5kZXgoaWR4KVxyXG5cdGlmICghZWx0KSByZXR1cm5cclxuXHJcblx0Y29uc3QgaW5kaWNhdG9yOiBIVE1MRWxlbWVudCB8IG51bGwgPSBlbHQucXVlcnlTZWxlY3RvcignLmluZGljYXRvcicpXHJcblx0aWYgKCFpbmRpY2F0b3IpIHJldHVyblxyXG5cclxuXHRpbmRpY2F0b3Iuc2V0QXR0cmlidXRlKCdkYXRhLWVycm9yJywgZXJyb3IpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpbnB1dFNldENvbnN0RXZhbEF0ID0gZnVuY3Rpb24gKGlkeDogbnVtYmVyLCBjb25zdEV2YWw6IG51bWJlcikge1xyXG5cdGNvbnN0IGVsdCA9IGdldElucHV0RnJvbUluZGV4KGlkeClcclxuXHRpZiAoIWVsdCkgcmV0dXJuXHJcblxyXG5cdGNvbnN0IGNvbnN0RXZhbEVsdDogSFRNTEVsZW1lbnQgfCBudWxsID0gZWx0LnF1ZXJ5U2VsZWN0b3IoJy5jb25zdC1ldmFsJylcclxuXHRpZiAoIWNvbnN0RXZhbEVsdCkgcmV0dXJuXHJcblxyXG5cdGNvbnN0RXZhbEVsdC5pbm5lclRleHQgPSAnPSAnICsgY29uc3RFdmFsLnRvU3RyaW5nKClcclxuXHRjb25zdEV2YWxFbHQuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpbnB1dFNldFN0YXR1c0F0ID0gZnVuY3Rpb24gKGlkeDogbnVtYmVyLCBzdGF0dXM6IFBsb3RTdGF0dXMpIHtcclxuXHRjb25zdCBlbHQgPSBnZXRJbnB1dEZyb21JbmRleChpZHgpXHJcblx0aWYgKCFlbHQpIHJldHVyblxyXG5cclxuXHRjb25zdCBpbmRpY2F0b3I6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGVsdC5xdWVyeVNlbGVjdG9yKCcuaW5kaWNhdG9yJylcclxuXHRpZiAoIWluZGljYXRvcikgcmV0dXJuXHJcblx0aW5kaWNhdG9yLmNsYXNzTGlzdC5yZW1vdmUoJ3BlbmRpbmcnLCAnYWN0aXZlJywgJ2Vycm9yJylcclxuXHJcblx0Y29uc3QgY29uc3RFdmFsRWx0OiBIVE1MRWxlbWVudCB8IG51bGwgPSBlbHQucXVlcnlTZWxlY3RvcignLmNvbnN0LWV2YWwnKVxyXG5cdGlmICghY29uc3RFdmFsRWx0KSByZXR1cm5cclxuXHJcblx0c3dpdGNoIChzdGF0dXMpIHtcclxuXHRcdGNhc2UgUGxvdFN0YXR1cy5QRU5ESU5HOlxyXG5cdFx0XHRpbmRpY2F0b3IuY2xhc3NMaXN0LmFkZCgncGVuZGluZycpXHJcblx0XHRcdGluZGljYXRvci5pbm5lckhUTUwgPSAnJ1xyXG5cdFx0XHRjb25zdEV2YWxFbHQuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcblx0XHRcdGJyZWFrXHJcblx0XHRjYXNlIFBsb3RTdGF0dXMuQUNUSVZFOlxyXG5cdFx0XHRpbmRpY2F0b3IuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHRcdFx0aW5kaWNhdG9yLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGVsdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29sb3InKSB8fCAnIzAwMCdcclxuXHRcdFx0aW5kaWNhdG9yLmlubmVySFRNTCA9ICcnXHJcblx0XHRcdGJyZWFrXHJcblx0XHRjYXNlIFBsb3RTdGF0dXMuRVJST1I6XHJcblx0XHRcdGluZGljYXRvci5jbGFzc0xpc3QuYWRkKCdlcnJvcicpXHJcblx0XHRcdGluZGljYXRvci5pbm5lckhUTUwgPSAnISdcclxuXHRcdFx0Y29uc3RFdmFsRWx0LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG5cdFx0XHRicmVha1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGlucHV0U2V0RHJpdmVyQXQgPSBmdW5jdGlvbiAoaWR4OiBudW1iZXIsIGRyaXZlcjogUGxvdERyaXZlcikge1xyXG5cdGNvbnN0IGVsdCA9IGdldElucHV0RnJvbUluZGV4KGlkeClcclxuXHRpZiAoIWVsdCkgcmV0dXJuXHJcblxyXG5cdGNvbnN0IGNvbnN0RXZhbEVsdDogSFRNTEVsZW1lbnQgfCBudWxsID0gZWx0LnF1ZXJ5U2VsZWN0b3IoJy5jb25zdC1ldmFsJylcclxuXHRpZiAoIWNvbnN0RXZhbEVsdCkgcmV0dXJuXHJcblxyXG5cdGlmIChkcml2ZXIgIT09IFBsb3REcml2ZXIuQ09OU1RBTlQpIHtcclxuXHRcdGNvbnN0RXZhbEVsdC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGFjdGl2YXRlSW5wdXQgPSBmdW5jdGlvbiAoZWx0OiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG5cdGlucHV0c0VsdC5xdWVyeVNlbGVjdG9yQWxsKCcuaW5wdXQnKS5mb3JFYWNoKChlbHQ6IEhUTUxFbGVtZW50KSA9PiB7XHJcblx0XHRlbHQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuXHR9KVxyXG5cdGVsdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG59XHJcbiIsImltcG9ydCB7IHN0cmluZ1RvSFRNTCB9IGZyb20gJy4uL3V0aWxzJ1xyXG5cclxuY29uc3QgbWVudUJhcjogSFRNTEVsZW1lbnQgfCBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1iYXInKVxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRNZW51QmFyID0gZnVuY3Rpb24gKCk6IHZvaWQge1xyXG5cdGNvbnN0IG1lbnVCYXJCdXR0b25zOiBIVE1MQnV0dG9uRWxlbWVudFtdID0gQXJyYXkuZnJvbShtZW51QmFyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbicpKVxyXG5cdG1lbnVCYXJCdXR0b25zLmZvckVhY2goKGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQpID0+IHtcclxuXHRcdGNvbnN0IGljb246IHN0cmluZyA9IGJ1dHRvbi5kYXRhc2V0Lmljb24gfHwgJydcclxuXHRcdGNvbnN0IGhyZWY6IHN0cmluZyA9IGJ1dHRvbi5kYXRhc2V0LmhyZWYgfHwgJydcclxuXHRcdGNvbnN0IGZpbHRlcjogc3RyaW5nID0gYnV0dG9uLmRhdGFzZXQuZmlsdGVyIHx8ICcnXHJcblx0XHRpZiAoaWNvbiAmJiBocmVmKSB7XHJcblx0XHRcdGNvbnN0IGljb25TdHIgPSAnPGRpdiBjbGFzcz1cImJ1dHRvbi1pY29uXCI+PC9kaXY+J1xyXG5cdFx0XHRjb25zdCBpY29uRWx0ID0gc3RyaW5nVG9IVE1MKGljb25TdHIpLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcclxuXHRcdFx0aWNvbkVsdC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcke2ljb259JylgXHJcblx0XHRcdGljb25FbHQuc3R5bGUuZmlsdGVyID0gZmlsdGVyXHJcblx0XHRcdGJ1dHRvbi5hcHBlbmRDaGlsZChpY29uRWx0KVxyXG5cdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0XHRcdFx0d2luZG93Lm9wZW4oaHJlZiwgJ19ibGFuaycpXHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fSlcclxufVxyXG4iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tICcuLi91dGlscydcclxuXHJcbmxldCBtb3VzZUNsYWltZWQgPSBmYWxzZVxyXG5sZXQgbW91c2VEb3duID0gZmFsc2VcclxubGV0IGNsYWltZWRDYWxsYmFjazogKG1vdXNlOiBWZWN0b3IpID0+IHZvaWRcclxuY29uc3QgbW91c2VQb3MgPSBuZXcgVmVjdG9yKDAsIDApXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLWNhbGwtc3BhY2luZ1xyXG5jb25zdCBtb3VzZUNhbGxiYWNrcyA9IG5ldyBNYXA8SFRNTEVsZW1lbnQsIChwb3M6IFZlY3RvcikgPT4gdm9pZD4oKVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldE1vdXNlUG9zID0gZnVuY3Rpb24gKCk6IFZlY3RvciB7XHJcblx0cmV0dXJuIG1vdXNlUG9zXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBvbk1vdXNlRHJhZyA9IGZ1bmN0aW9uIChlbHQ6IEhUTUxFbGVtZW50LCBjYWxsYmFjazogKHBvczogVmVjdG9yKSA9PiB2b2lkKTogdm9pZCB7XHJcblx0bW91c2VDYWxsYmFja3Muc2V0KGVsdCwgY2FsbGJhY2spXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpbml0VXNlckludGVyYWN0ID0gZnVuY3Rpb24gKCk6IHZvaWQge1xyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlOiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcblx0XHRtb3VzZURvd24gPSB0cnVlXHJcblx0fSlcclxuXHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuXHRcdGlmICghbW91c2VEb3duKSByZXR1cm5cclxuXHRcdG1vdXNlUG9zLnNldChlLmNsaWVudFgsIGUuY2xpZW50WSlcclxuXHRcdGlmIChtb3VzZUNsYWltZWQpIHtcclxuXHRcdFx0Y2xhaW1lZENhbGxiYWNrKG1vdXNlUG9zKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHRcdGZvciAoY29uc3QgW2VsdCwgY2FsbGJhY2tdIG9mIG1vdXNlQ2FsbGJhY2tzKSB7XHJcblx0XHRcdGlmIChlbHQ/LmNvbnRhaW5zKGUudGFyZ2V0IGFzIE5vZGUpKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2sobW91c2VQb3MpXHJcblx0XHRcdFx0bW91c2VDbGFpbWVkID0gdHJ1ZVxyXG5cdFx0XHRcdGNsYWltZWRDYWxsYmFjayA9IGNhbGxiYWNrXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24gKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuXHRcdG1vdXNlQ2xhaW1lZCA9IGZhbHNlXHJcblx0XHRtb3VzZURvd24gPSBmYWxzZVxyXG5cdH0pXHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IHN0cmluZ1RvSFRNTCA9IGZ1bmN0aW9uIChzdHI6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuXHRjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKClcclxuXHRjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHN0ciwgJ3RleHQvaHRtbCcpXHJcblx0cmV0dXJuIGRvYy5ib2R5XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWZWN0b3Ige1xyXG5cdHg6IG51bWJlclxyXG5cdHk6IG51bWJlclxyXG5cdFxyXG5cdGNvbnN0cnVjdG9yICh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0dGhpcy54ID0geFxyXG5cdFx0dGhpcy55ID0geVxyXG5cdH1cclxuXHRcclxuXHRzZXQgKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XHJcblx0XHR0aGlzLnggPSB4XHJcblx0XHR0aGlzLnkgPSB5XHJcblx0fVxyXG59XHJcblxyXG4vLyBQZXJsaW4gbm9pc2UgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vam9zZXBoZy9ub2lzZWpzL2Jsb2IvbWFzdGVyL3Blcmxpbi5qc1xyXG5jb25zdCBwZXJtID0gbmV3IEFycmF5KDUxMilcclxuY29uc3QgZ3JhZFAgPSBuZXcgQXJyYXkoNTEyKVxyXG5cclxuY29uc3QgcCA9IFsxNTEsIDE2MCwgMTM3LCA5MSwgOTAsIDE1LFxyXG5cdDEzMSwgMTMsIDIwMSwgOTUsIDk2LCA1MywgMTk0LCAyMzMsIDcsIDIyNSwgMTQwLCAzNiwgMTAzLCAzMCwgNjksIDE0MiwgOCwgOTksIDM3LCAyNDAsIDIxLCAxMCwgMjMsXHJcblx0MTkwLCA2LCAxNDgsIDI0NywgMTIwLCAyMzQsIDc1LCAwLCAyNiwgMTk3LCA2MiwgOTQsIDI1MiwgMjE5LCAyMDMsIDExNywgMzUsIDExLCAzMiwgNTcsIDE3NywgMzMsXHJcblx0ODgsIDIzNywgMTQ5LCA1NiwgODcsIDE3NCwgMjAsIDEyNSwgMTM2LCAxNzEsIDE2OCwgNjgsIDE3NSwgNzQsIDE2NSwgNzEsIDEzNCwgMTM5LCA0OCwgMjcsIDE2NixcclxuXHQ3NywgMTQ2LCAxNTgsIDIzMSwgODMsIDExMSwgMjI5LCAxMjIsIDYwLCAyMTEsIDEzMywgMjMwLCAyMjAsIDEwNSwgOTIsIDQxLCA1NSwgNDYsIDI0NSwgNDAsIDI0NCxcclxuXHQxMDIsIDE0MywgNTQsIDY1LCAyNSwgNjMsIDE2MSwgMSwgMjE2LCA4MCwgNzMsIDIwOSwgNzYsIDEzMiwgMTg3LCAyMDgsIDg5LCAxOCwgMTY5LCAyMDAsIDE5NixcclxuXHQxMzUsIDEzMCwgMTE2LCAxODgsIDE1OSwgODYsIDE2NCwgMTAwLCAxMDksIDE5OCwgMTczLCAxODYsIDMsIDY0LCA1MiwgMjE3LCAyMjYsIDI1MCwgMTI0LCAxMjMsXHJcblx0NSwgMjAyLCAzOCwgMTQ3LCAxMTgsIDEyNiwgMjU1LCA4MiwgODUsIDIxMiwgMjA3LCAyMDYsIDU5LCAyMjcsIDQ3LCAxNiwgNTgsIDE3LCAxODIsIDE4OSwgMjgsIDQyLFxyXG5cdDIyMywgMTgzLCAxNzAsIDIxMywgMTE5LCAyNDgsIDE1MiwgMiwgNDQsIDE1NCwgMTYzLCA3MCwgMjIxLCAxNTMsIDEwMSwgMTU1LCAxNjcsIDQzLCAxNzIsIDksXHJcblx0MTI5LCAyMiwgMzksIDI1MywgMTksIDk4LCAxMDgsIDExMCwgNzksIDExMywgMjI0LCAyMzIsIDE3OCwgMTg1LCAxMTIsIDEwNCwgMjE4LCAyNDYsIDk3LCAyMjgsXHJcblx0MjUxLCAzNCwgMjQyLCAxOTMsIDIzOCwgMjEwLCAxNDQsIDEyLCAxOTEsIDE3OSwgMTYyLCAyNDEsIDgxLCA1MSwgMTQ1LCAyMzUsIDI0OSwgMTQsIDIzOSwgMTA3LFxyXG5cdDQ5LCAxOTIsIDIxNCwgMzEsIDE4MSwgMTk5LCAxMDYsIDE1NywgMTg0LCA4NCwgMjA0LCAxNzYsIDExNSwgMTIxLCA1MCwgNDUsIDEyNywgNCwgMTUwLCAyNTQsXHJcblx0MTM4LCAyMzYsIDIwNSwgOTMsIDIyMiwgMTE0LCA2NywgMjksIDI0LCA3MiwgMjQzLCAxNDEsIDEyOCwgMTk1LCA3OCwgNjYsIDIxNSwgNjEsIDE1NiwgMTgwXVxyXG5cclxuY2xhc3MgR3JhZCB7XHJcblx0eDogbnVtYmVyXHJcblx0eTogbnVtYmVyXHJcblx0ejogbnVtYmVyXHJcblxyXG5cdGNvbnN0cnVjdG9yICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XHJcblx0XHR0aGlzLnggPSB4OyB0aGlzLnkgPSB5OyB0aGlzLnogPSB6XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBncmFkMyA9IFtuZXcgR3JhZCgxLCAxLCAwKSwgbmV3IEdyYWQoLTEsIDEsIDApLCBuZXcgR3JhZCgxLCAtMSwgMCksIG5ldyBHcmFkKC0xLCAtMSwgMCksXHJcblx0XHRcdG5ldyBHcmFkKDEsIDAsIDEpLCBuZXcgR3JhZCgtMSwgMCwgMSksIG5ldyBHcmFkKDEsIDAsIC0xKSwgbmV3IEdyYWQoLTEsIDAsIC0xKSxcclxuXHRcdFx0bmV3IEdyYWQoMCwgMSwgMSksIG5ldyBHcmFkKDAsIC0xLCAxKSwgbmV3IEdyYWQoMCwgMSwgLTEpLCBuZXcgR3JhZCgwLCAtMSwgLTEpXVxyXG5cclxuY29uc3Qgc2VlZCA9IGZ1bmN0aW9uIChzZWVkOiBudW1iZXIpOiB2b2lkIHtcclxuXHRpZiAoc2VlZCA+IDAgJiYgc2VlZCA8IDEpIHtcclxuXHRcdHNlZWQgKj0gNjU1MzZcclxuXHR9XHJcblxyXG5cdHNlZWQgPSBNYXRoLmZsb29yKHNlZWQpXHJcblx0aWYgKHNlZWQgPCAyNTYpIHtcclxuXHRcdHNlZWQgfD0gc2VlZCA8PCA4XHJcblx0fVxyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XHJcblx0XHRsZXQgdlxyXG5cdFx0aWYgKGkgJiAxKSB7XHJcblx0XHR2ID0gcFtpXSBeIChzZWVkICYgMjU1KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdHYgPSBwW2ldIF4gKChzZWVkID4+IDgpICYgMjU1KVxyXG5cdFx0fVxyXG5cclxuXHRcdHBlcm1baV0gPSBwZXJtW2kgKyAyNTZdID0gdlxyXG5cdFx0Z3JhZFBbaV0gPSBncmFkUFtpICsgMjU2XSA9IGdyYWQzW3YgJSAxMl1cclxuXHR9XHJcbn1cclxuXHJcbnNlZWQoMTIzNDUpXHJcblxyXG5mdW5jdGlvbiBmYWRlICh0OiBudW1iZXIpOiBudW1iZXIge1xyXG5cdHJldHVybiB0ICogdCAqIHQgKiAodCAqICh0ICogNiAtIDE1KSArIDEwKVxyXG59XHJcblxyXG5mdW5jdGlvbiBsZXJwIChhOiBudW1iZXIsIGI6IG51bWJlciwgdDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRyZXR1cm4gKDEgLSB0KSAqIGEgKyB0ICogYlxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcGVybGluMiA9IGZ1bmN0aW9uICh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciB7XHJcblx0Ly8gRmluZCB1bml0IGdyaWQgY2VsbCBjb250YWluaW5nIHBvaW50XHJcblx0bGV0IFggPSBNYXRoLmZsb29yKHgpOyBsZXQgWSA9IE1hdGguZmxvb3IoeSlcclxuXHQvLyBHZXQgcmVsYXRpdmUgeHkgY29vcmRpbmF0ZXMgb2YgcG9pbnQgd2l0aGluIHRoYXQgY2VsbFxyXG5cdHggPSB4IC0gWDsgeSA9IHkgLSBZXHJcblx0Ly8gV3JhcCB0aGUgaW50ZWdlciBjZWxscyBhdCAyNTUgKHNtYWxsZXIgaW50ZWdlciBwZXJpb2QgY2FuIGJlIGludHJvZHVjZWQgaGVyZSlcclxuXHRYID0gWCAmIDI1NTsgWSA9IFkgJiAyNTVcclxuXHJcblx0Ly8gQ2FsY3VsYXRlIG5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIG9mIHRoZSBmb3VyIGNvcm5lcnNcclxuXHRjb25zdCBuMDAgPSBncmFkUFtYICsgcGVybVtZXV0uZG90Mih4LCB5KVxyXG5cdGNvbnN0IG4wMSA9IGdyYWRQW1ggKyBwZXJtW1kgKyAxXV0uZG90Mih4LCB5IC0gMSlcclxuXHRjb25zdCBuMTAgPSBncmFkUFtYICsgMSArIHBlcm1bWV1dLmRvdDIoeCAtIDEsIHkpXHJcblx0Y29uc3QgbjExID0gZ3JhZFBbWCArIDEgKyBwZXJtW1kgKyAxXV0uZG90Mih4IC0gMSwgeSAtIDEpXHJcblxyXG5cdC8vIENvbXB1dGUgdGhlIGZhZGUgY3VydmUgdmFsdWUgZm9yIHhcclxuXHRjb25zdCB1ID0gZmFkZSh4KVxyXG5cclxuXHQvLyBJbnRlcnBvbGF0ZSB0aGUgZm91ciByZXN1bHRzXHJcblx0cmV0dXJuIGxlcnAoXHJcblx0XHRsZXJwKG4wMCwgbjEwLCB1KSxcclxuXHRcdGxlcnAobjAxLCBuMTEsIHUpLFxyXG5cdFx0ZmFkZSh5KSlcclxufVxyXG5cclxuY29uc3QgZmFjdG9yaWFsMDEgPSBmdW5jdGlvbiAoeDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRyZXR1cm4gKCgoKCgwLjA3Mjg4NDQ4OTc4MjE1NDU2ICogeCAtIDAuMzEzOTAwNTE1NDM3MTI2MTYpICogeCArIDAuNjUzODkwNzA4NDYxNDAzOCkgKiB4IC0gMC44MTA0MjU3MTU1MjA5NzgpICogeCArIDAuOTczNzY1NTQ0MTI3NjcyOSkgKiB4IC0gMC41NzYxODUxNjY4NjQ4ODg3KSAqIHggKyAwLjk5OTk4MzAwNDQwMzQ3NTJcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGZhY3RvcmlhbCA9IGZ1bmN0aW9uICh4OiBudW1iZXIpOiBudW1iZXIge1xyXG5cdGNvbnN0IGggPSBNYXRoLmZsb29yKHgpXHJcblx0Y29uc3QgZiA9IHggLSBoXHJcblx0bGV0IHkgPSBmYWN0b3JpYWwwMShmKVxyXG5cdGlmICh4IDwgMCkgZm9yIChsZXQgbiA9IDA7IG4gPCAtaDsgbisrKSB5IC89IGYgLSBuXHJcblx0ZWxzZSBmb3IgKGxldCBuID0gMTsgbiA8IGggKyAxOyBuKyspIHkgKj0gZiArIG5cclxuXHRyZXR1cm4geCA+IDAgPyB5IDogSW5maW5pdHlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNpZ21vaWQgPSBmdW5jdGlvbiAoeDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRyZXR1cm4gMSAvICgxICsgTWF0aC5leHAoLXgpKVxyXG59XHJcblxyXG5jb25zdCBjb25zdHJhaW4gPSBmdW5jdGlvbiAobjogbnVtYmVyLCBsb3c6IG51bWJlciwgaGlnaDogbnVtYmVyKSB7XHJcblx0cmV0dXJuIE1hdGgubWF4KE1hdGgubWluKG4sIGhpZ2gpLCBsb3cpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBtYXAgPSBmdW5jdGlvbiAobjogbnVtYmVyLCBzdGFydDE6IG51bWJlciwgc3RvcDE6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIHN0b3AyOiBudW1iZXIpIHtcclxuXHRyZXR1cm4gKG4gLSBzdGFydDEpIC8gKHN0b3AxIC0gc3RhcnQxKSAqIChzdG9wMiAtIHN0YXJ0MikgKyBzdGFydDJcclxufVxyXG4iLCJpbXBvcnQgeyBpbml0TGVmdFBhbmVsIH0gZnJvbSAnLi9hcHAvdWkvbGVmdFBhbmVsJ1xyXG5pbXBvcnQgeyBpbml0TWVudUJhciB9IGZyb20gJy4vYXBwL3VpL21lbnViYXInXHJcbmltcG9ydCB7IGNhbnZhc0RyYXcsIGluaXRDYW52YXMgfSBmcm9tICcuL2FwcC9jYW52YXMvY2FudmFzQ29yZSdcclxuaW1wb3J0IHsgaW5pdFVzZXJJbnRlcmFjdCB9IGZyb20gJy4vYXBwL3VpL3VzZXJJbnRlcmFjdCdcclxuaW1wb3J0IHsgZHJhd1Bsb3RzLCBkcml2ZVBsb3RzIH0gZnJvbSAnLi9hcHAvY29yZS9jb250cm9sbGVyJ1xyXG5pbXBvcnQgeyBzaGFkZXJzRHJhdywgaW5pdFNoYWRlckNvcmUsIHNoYWRlckNvcmVVcGRhdGUgfSBmcm9tICcuL2FwcC9zaGFkZXIvc2hhZGVyQ29yZSdcclxuXHJcbmxldCBkcmF3RnJhbWUgPSB0cnVlXHJcbmxldCBmcmFtZVRpbWUgPSAwXHJcblxyXG5leHBvcnQgY29uc3Qgc2NoZWR1bGVSZWRyYXcgPSBmdW5jdGlvbiAoKTogdm9pZCB7XHJcblx0ZHJhd0ZyYW1lID0gdHJ1ZVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0R2xvYmFsVGltZSA9ICgpOiBudW1iZXIgPT4gZnJhbWVUaW1lXHJcblxyXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cdGluaXRVc2VySW50ZXJhY3QoKVxyXG5cdGluaXRNZW51QmFyKClcclxuXHRpbml0TGVmdFBhbmVsKClcclxuXHRpbml0Q2FudmFzKClcclxuXHRpbml0U2hhZGVyQ29yZSgpXHJcblxyXG5cdG1haW5Mb29wKClcclxufVxyXG5cclxuY29uc3QgbWFpbkxvb3AgPSBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKGRyYXdGcmFtZSkge1xyXG5cdFx0ZHJhd0ZyYW1lID0gZmFsc2VcclxuXHRcdGNhbnZhc0RyYXcoKVxyXG5cdFx0c2hhZGVyc0RyYXcoKVxyXG5cdFx0ZHJhd1Bsb3RzKClcclxuXHR9XHJcblxyXG5cdGRyaXZlUGxvdHMoKVxyXG5cdHNoYWRlckNvcmVVcGRhdGUoKVxyXG5cdGZyYW1lVGltZSArPSAwLjAxXHJcblxyXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluTG9vcClcclxufVxyXG4iLCIvKipcclxuICogQ29tbW9uIHV0aWxpdGllc1xyXG4gKiBAbW9kdWxlIGdsTWF0cml4XHJcbiAqL1xyXG4vLyBDb25maWd1cmF0aW9uIENvbnN0YW50c1xyXG5leHBvcnQgdmFyIEVQU0lMT04gPSAwLjAwMDAwMTtcclxuZXhwb3J0IHZhciBBUlJBWV9UWVBFID0gdHlwZW9mIEZsb2F0MzJBcnJheSAhPT0gXCJ1bmRlZmluZWRcIiA/IEZsb2F0MzJBcnJheSA6IEFycmF5O1xyXG5leHBvcnQgdmFyIFJBTkRPTSA9IE1hdGgucmFuZG9tO1xyXG5leHBvcnQgdmFyIEFOR0xFX09SREVSID0gXCJ6eXhcIjtcclxuLyoqXHJcbiAqIFNldHMgdGhlIHR5cGUgb2YgYXJyYXkgdXNlZCB3aGVuIGNyZWF0aW5nIG5ldyB2ZWN0b3JzIGFuZCBtYXRyaWNlc1xyXG4gKlxyXG4gKiBAcGFyYW0ge0Zsb2F0MzJBcnJheUNvbnN0cnVjdG9yIHwgQXJyYXlDb25zdHJ1Y3Rvcn0gdHlwZSBBcnJheSB0eXBlLCBzdWNoIGFzIEZsb2F0MzJBcnJheSBvciBBcnJheVxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRNYXRyaXhBcnJheVR5cGUodHlwZSkge1xyXG4gIEFSUkFZX1RZUEUgPSB0eXBlO1xyXG59XHJcbnZhciBkZWdyZWUgPSBNYXRoLlBJIC8gMTgwO1xyXG4vKipcclxuICogQ29udmVydCBEZWdyZWUgVG8gUmFkaWFuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBhIEFuZ2xlIGluIERlZ3JlZXNcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdG9SYWRpYW4oYSkge1xyXG4gIHJldHVybiBhICogZGVncmVlO1xyXG59XHJcbi8qKlxyXG4gKiBUZXN0cyB3aGV0aGVyIG9yIG5vdCB0aGUgYXJndW1lbnRzIGhhdmUgYXBwcm94aW1hdGVseSB0aGUgc2FtZSB2YWx1ZSwgd2l0aGluIGFuIGFic29sdXRlXHJcbiAqIG9yIHJlbGF0aXZlIHRvbGVyYW5jZSBvZiBnbE1hdHJpeC5FUFNJTE9OIChhbiBhYnNvbHV0ZSB0b2xlcmFuY2UgaXMgdXNlZCBmb3IgdmFsdWVzIGxlc3NcclxuICogdGhhbiBvciBlcXVhbCB0byAxLjAsIGFuZCBhIHJlbGF0aXZlIHRvbGVyYW5jZSBpcyB1c2VkIGZvciBsYXJnZXIgdmFsdWVzKVxyXG4gKlxyXG4gKiBAcGFyYW0ge051bWJlcn0gYSBUaGUgZmlyc3QgbnVtYmVyIHRvIHRlc3QuXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBiIFRoZSBzZWNvbmQgbnVtYmVyIHRvIHRlc3QuXHJcbiAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBudW1iZXJzIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XHJcbiAgcmV0dXJuIE1hdGguYWJzKGEgLSBiKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhKSwgTWF0aC5hYnMoYikpO1xyXG59XHJcbmlmICghTWF0aC5oeXBvdCkgTWF0aC5oeXBvdCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeSA9IDAsXHJcbiAgICAgIGkgPSBhcmd1bWVudHMubGVuZ3RoO1xyXG5cclxuICB3aGlsZSAoaS0tKSB7XHJcbiAgICB5ICs9IGFyZ3VtZW50c1tpXSAqIGFyZ3VtZW50c1tpXTtcclxuICB9XHJcblxyXG4gIHJldHVybiBNYXRoLnNxcnQoeSk7XHJcbn07IiwiaW1wb3J0ICogYXMgZ2xNYXRyaXggZnJvbSBcIi4vY29tbW9uLmpzXCI7XHJcbi8qKlxyXG4gKiA0eDQgTWF0cml4PGJyPkZvcm1hdDogY29sdW1uLW1ham9yLCB3aGVuIHR5cGVkIG91dCBpdCBsb29rcyBsaWtlIHJvdy1tYWpvcjxicj5UaGUgbWF0cmljZXMgYXJlIGJlaW5nIHBvc3QgbXVsdGlwbGllZC5cclxuICogQG1vZHVsZSBtYXQ0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgbWF0NFxyXG4gKlxyXG4gKiBAcmV0dXJucyB7bWF0NH0gYSBuZXcgNHg0IG1hdHJpeFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoKSB7XHJcbiAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDE2KTtcclxuXHJcbiAgaWYgKGdsTWF0cml4LkFSUkFZX1RZUEUgIT0gRmxvYXQzMkFycmF5KSB7XHJcbiAgICBvdXRbMV0gPSAwO1xyXG4gICAgb3V0WzJdID0gMDtcclxuICAgIG91dFszXSA9IDA7XHJcbiAgICBvdXRbNF0gPSAwO1xyXG4gICAgb3V0WzZdID0gMDtcclxuICAgIG91dFs3XSA9IDA7XHJcbiAgICBvdXRbOF0gPSAwO1xyXG4gICAgb3V0WzldID0gMDtcclxuICAgIG91dFsxMV0gPSAwO1xyXG4gICAgb3V0WzEyXSA9IDA7XHJcbiAgICBvdXRbMTNdID0gMDtcclxuICAgIG91dFsxNF0gPSAwO1xyXG4gIH1cclxuXHJcbiAgb3V0WzBdID0gMTtcclxuICBvdXRbNV0gPSAxO1xyXG4gIG91dFsxMF0gPSAxO1xyXG4gIG91dFsxNV0gPSAxO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgbWF0NCBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIG1hdHJpeFxyXG4gKlxyXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSBtYXRyaXggdG8gY2xvbmVcclxuICogQHJldHVybnMge21hdDR9IGEgbmV3IDR4NCBtYXRyaXhcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xvbmUoYSkge1xyXG4gIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSgxNik7XHJcbiAgb3V0WzBdID0gYVswXTtcclxuICBvdXRbMV0gPSBhWzFdO1xyXG4gIG91dFsyXSA9IGFbMl07XHJcbiAgb3V0WzNdID0gYVszXTtcclxuICBvdXRbNF0gPSBhWzRdO1xyXG4gIG91dFs1XSA9IGFbNV07XHJcbiAgb3V0WzZdID0gYVs2XTtcclxuICBvdXRbN10gPSBhWzddO1xyXG4gIG91dFs4XSA9IGFbOF07XHJcbiAgb3V0WzldID0gYVs5XTtcclxuICBvdXRbMTBdID0gYVsxMF07XHJcbiAgb3V0WzExXSA9IGFbMTFdO1xyXG4gIG91dFsxMl0gPSBhWzEyXTtcclxuICBvdXRbMTNdID0gYVsxM107XHJcbiAgb3V0WzE0XSA9IGFbMTRdO1xyXG4gIG91dFsxNV0gPSBhWzE1XTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgbWF0NCB0byBhbm90aGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIHRoZSBzb3VyY2UgbWF0cml4XHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29weShvdXQsIGEpIHtcclxuICBvdXRbMF0gPSBhWzBdO1xyXG4gIG91dFsxXSA9IGFbMV07XHJcbiAgb3V0WzJdID0gYVsyXTtcclxuICBvdXRbM10gPSBhWzNdO1xyXG4gIG91dFs0XSA9IGFbNF07XHJcbiAgb3V0WzVdID0gYVs1XTtcclxuICBvdXRbNl0gPSBhWzZdO1xyXG4gIG91dFs3XSA9IGFbN107XHJcbiAgb3V0WzhdID0gYVs4XTtcclxuICBvdXRbOV0gPSBhWzldO1xyXG4gIG91dFsxMF0gPSBhWzEwXTtcclxuICBvdXRbMTFdID0gYVsxMV07XHJcbiAgb3V0WzEyXSA9IGFbMTJdO1xyXG4gIG91dFsxM10gPSBhWzEzXTtcclxuICBvdXRbMTRdID0gYVsxNF07XHJcbiAgb3V0WzE1XSA9IGFbMTVdO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuLyoqXHJcbiAqIENyZWF0ZSBhIG5ldyBtYXQ0IHdpdGggdGhlIGdpdmVuIHZhbHVlc1xyXG4gKlxyXG4gKiBAcGFyYW0ge051bWJlcn0gbTAwIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDAgcG9zaXRpb24gKGluZGV4IDApXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMDEgQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggMSlcclxuICogQHBhcmFtIHtOdW1iZXJ9IG0wMiBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAyKVxyXG4gKiBAcGFyYW0ge051bWJlcn0gbTAzIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDMgcG9zaXRpb24gKGluZGV4IDMpXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMTAgQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMCBwb3NpdGlvbiAoaW5kZXggNClcclxuICogQHBhcmFtIHtOdW1iZXJ9IG0xMSBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAxIHBvc2l0aW9uIChpbmRleCA1KVxyXG4gKiBAcGFyYW0ge051bWJlcn0gbTEyIENvbXBvbmVudCBpbiBjb2x1bW4gMSwgcm93IDIgcG9zaXRpb24gKGluZGV4IDYpXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMTMgQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggNylcclxuICogQHBhcmFtIHtOdW1iZXJ9IG0yMCBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAwIHBvc2l0aW9uIChpbmRleCA4KVxyXG4gKiBAcGFyYW0ge051bWJlcn0gbTIxIENvbXBvbmVudCBpbiBjb2x1bW4gMiwgcm93IDEgcG9zaXRpb24gKGluZGV4IDkpXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMjIgQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggMTApXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMjMgQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggMTEpXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMzAgQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMCBwb3NpdGlvbiAoaW5kZXggMTIpXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMzEgQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggMTMpXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMzIgQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggMTQpXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMzMgQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggMTUpXHJcbiAqIEByZXR1cm5zIHttYXQ0fSBBIG5ldyBtYXQ0XHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZyb21WYWx1ZXMobTAwLCBtMDEsIG0wMiwgbTAzLCBtMTAsIG0xMSwgbTEyLCBtMTMsIG0yMCwgbTIxLCBtMjIsIG0yMywgbTMwLCBtMzEsIG0zMiwgbTMzKSB7XHJcbiAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDE2KTtcclxuICBvdXRbMF0gPSBtMDA7XHJcbiAgb3V0WzFdID0gbTAxO1xyXG4gIG91dFsyXSA9IG0wMjtcclxuICBvdXRbM10gPSBtMDM7XHJcbiAgb3V0WzRdID0gbTEwO1xyXG4gIG91dFs1XSA9IG0xMTtcclxuICBvdXRbNl0gPSBtMTI7XHJcbiAgb3V0WzddID0gbTEzO1xyXG4gIG91dFs4XSA9IG0yMDtcclxuICBvdXRbOV0gPSBtMjE7XHJcbiAgb3V0WzEwXSA9IG0yMjtcclxuICBvdXRbMTFdID0gbTIzO1xyXG4gIG91dFsxMl0gPSBtMzA7XHJcbiAgb3V0WzEzXSA9IG0zMTtcclxuICBvdXRbMTRdID0gbTMyO1xyXG4gIG91dFsxNV0gPSBtMzM7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogU2V0IHRoZSBjb21wb25lbnRzIG9mIGEgbWF0NCB0byB0aGUgZ2l2ZW4gdmFsdWVzXHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMDAgQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMCBwb3NpdGlvbiAoaW5kZXggMClcclxuICogQHBhcmFtIHtOdW1iZXJ9IG0wMSBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAxIHBvc2l0aW9uIChpbmRleCAxKVxyXG4gKiBAcGFyYW0ge051bWJlcn0gbTAyIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDIgcG9zaXRpb24gKGluZGV4IDIpXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMDMgQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggMylcclxuICogQHBhcmFtIHtOdW1iZXJ9IG0xMCBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAwIHBvc2l0aW9uIChpbmRleCA0KVxyXG4gKiBAcGFyYW0ge051bWJlcn0gbTExIENvbXBvbmVudCBpbiBjb2x1bW4gMSwgcm93IDEgcG9zaXRpb24gKGluZGV4IDUpXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMTIgQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggNilcclxuICogQHBhcmFtIHtOdW1iZXJ9IG0xMyBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAzIHBvc2l0aW9uIChpbmRleCA3KVxyXG4gKiBAcGFyYW0ge051bWJlcn0gbTIwIENvbXBvbmVudCBpbiBjb2x1bW4gMiwgcm93IDAgcG9zaXRpb24gKGluZGV4IDgpXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBtMjEgQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggOSlcclxuICogQHBhcmFtIHtOdW1iZXJ9IG0yMiBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAxMClcclxuICogQHBhcmFtIHtOdW1iZXJ9IG0yMyBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAzIHBvc2l0aW9uIChpbmRleCAxMSlcclxuICogQHBhcmFtIHtOdW1iZXJ9IG0zMCBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAwIHBvc2l0aW9uIChpbmRleCAxMilcclxuICogQHBhcmFtIHtOdW1iZXJ9IG0zMSBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAxIHBvc2l0aW9uIChpbmRleCAxMylcclxuICogQHBhcmFtIHtOdW1iZXJ9IG0zMiBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAxNClcclxuICogQHBhcmFtIHtOdW1iZXJ9IG0zMyBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAzIHBvc2l0aW9uIChpbmRleCAxNSlcclxuICogQHJldHVybnMge21hdDR9IG91dFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXQob3V0LCBtMDAsIG0wMSwgbTAyLCBtMDMsIG0xMCwgbTExLCBtMTIsIG0xMywgbTIwLCBtMjEsIG0yMiwgbTIzLCBtMzAsIG0zMSwgbTMyLCBtMzMpIHtcclxuICBvdXRbMF0gPSBtMDA7XHJcbiAgb3V0WzFdID0gbTAxO1xyXG4gIG91dFsyXSA9IG0wMjtcclxuICBvdXRbM10gPSBtMDM7XHJcbiAgb3V0WzRdID0gbTEwO1xyXG4gIG91dFs1XSA9IG0xMTtcclxuICBvdXRbNl0gPSBtMTI7XHJcbiAgb3V0WzddID0gbTEzO1xyXG4gIG91dFs4XSA9IG0yMDtcclxuICBvdXRbOV0gPSBtMjE7XHJcbiAgb3V0WzEwXSA9IG0yMjtcclxuICBvdXRbMTFdID0gbTIzO1xyXG4gIG91dFsxMl0gPSBtMzA7XHJcbiAgb3V0WzEzXSA9IG0zMTtcclxuICBvdXRbMTRdID0gbTMyO1xyXG4gIG91dFsxNV0gPSBtMzM7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogU2V0IGEgbWF0NCB0byB0aGUgaWRlbnRpdHkgbWF0cml4XHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaWRlbnRpdHkob3V0KSB7XHJcbiAgb3V0WzBdID0gMTtcclxuICBvdXRbMV0gPSAwO1xyXG4gIG91dFsyXSA9IDA7XHJcbiAgb3V0WzNdID0gMDtcclxuICBvdXRbNF0gPSAwO1xyXG4gIG91dFs1XSA9IDE7XHJcbiAgb3V0WzZdID0gMDtcclxuICBvdXRbN10gPSAwO1xyXG4gIG91dFs4XSA9IDA7XHJcbiAgb3V0WzldID0gMDtcclxuICBvdXRbMTBdID0gMTtcclxuICBvdXRbMTFdID0gMDtcclxuICBvdXRbMTJdID0gMDtcclxuICBvdXRbMTNdID0gMDtcclxuICBvdXRbMTRdID0gMDtcclxuICBvdXRbMTVdID0gMTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBUcmFuc3Bvc2UgdGhlIHZhbHVlcyBvZiBhIG1hdDRcclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcclxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcclxuICogQHJldHVybnMge21hdDR9IG91dFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0cmFuc3Bvc2Uob3V0LCBhKSB7XHJcbiAgLy8gSWYgd2UgYXJlIHRyYW5zcG9zaW5nIG91cnNlbHZlcyB3ZSBjYW4gc2tpcCBhIGZldyBzdGVwcyBidXQgaGF2ZSB0byBjYWNoZSBzb21lIHZhbHVlc1xyXG4gIGlmIChvdXQgPT09IGEpIHtcclxuICAgIHZhciBhMDEgPSBhWzFdLFxyXG4gICAgICAgIGEwMiA9IGFbMl0sXHJcbiAgICAgICAgYTAzID0gYVszXTtcclxuICAgIHZhciBhMTIgPSBhWzZdLFxyXG4gICAgICAgIGExMyA9IGFbN107XHJcbiAgICB2YXIgYTIzID0gYVsxMV07XHJcbiAgICBvdXRbMV0gPSBhWzRdO1xyXG4gICAgb3V0WzJdID0gYVs4XTtcclxuICAgIG91dFszXSA9IGFbMTJdO1xyXG4gICAgb3V0WzRdID0gYTAxO1xyXG4gICAgb3V0WzZdID0gYVs5XTtcclxuICAgIG91dFs3XSA9IGFbMTNdO1xyXG4gICAgb3V0WzhdID0gYTAyO1xyXG4gICAgb3V0WzldID0gYTEyO1xyXG4gICAgb3V0WzExXSA9IGFbMTRdO1xyXG4gICAgb3V0WzEyXSA9IGEwMztcclxuICAgIG91dFsxM10gPSBhMTM7XHJcbiAgICBvdXRbMTRdID0gYTIzO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXRbMF0gPSBhWzBdO1xyXG4gICAgb3V0WzFdID0gYVs0XTtcclxuICAgIG91dFsyXSA9IGFbOF07XHJcbiAgICBvdXRbM10gPSBhWzEyXTtcclxuICAgIG91dFs0XSA9IGFbMV07XHJcbiAgICBvdXRbNV0gPSBhWzVdO1xyXG4gICAgb3V0WzZdID0gYVs5XTtcclxuICAgIG91dFs3XSA9IGFbMTNdO1xyXG4gICAgb3V0WzhdID0gYVsyXTtcclxuICAgIG91dFs5XSA9IGFbNl07XHJcbiAgICBvdXRbMTBdID0gYVsxMF07XHJcbiAgICBvdXRbMTFdID0gYVsxNF07XHJcbiAgICBvdXRbMTJdID0gYVszXTtcclxuICAgIG91dFsxM10gPSBhWzddO1xyXG4gICAgb3V0WzE0XSA9IGFbMTFdO1xyXG4gICAgb3V0WzE1XSA9IGFbMTVdO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogSW52ZXJ0cyBhIG1hdDRcclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcclxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcclxuICogQHJldHVybnMge21hdDR9IG91dFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnQob3V0LCBhKSB7XHJcbiAgdmFyIGEwMCA9IGFbMF0sXHJcbiAgICAgIGEwMSA9IGFbMV0sXHJcbiAgICAgIGEwMiA9IGFbMl0sXHJcbiAgICAgIGEwMyA9IGFbM107XHJcbiAgdmFyIGExMCA9IGFbNF0sXHJcbiAgICAgIGExMSA9IGFbNV0sXHJcbiAgICAgIGExMiA9IGFbNl0sXHJcbiAgICAgIGExMyA9IGFbN107XHJcbiAgdmFyIGEyMCA9IGFbOF0sXHJcbiAgICAgIGEyMSA9IGFbOV0sXHJcbiAgICAgIGEyMiA9IGFbMTBdLFxyXG4gICAgICBhMjMgPSBhWzExXTtcclxuICB2YXIgYTMwID0gYVsxMl0sXHJcbiAgICAgIGEzMSA9IGFbMTNdLFxyXG4gICAgICBhMzIgPSBhWzE0XSxcclxuICAgICAgYTMzID0gYVsxNV07XHJcbiAgdmFyIGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMDtcclxuICB2YXIgYjAxID0gYTAwICogYTEyIC0gYTAyICogYTEwO1xyXG4gIHZhciBiMDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTA7XHJcbiAgdmFyIGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMTtcclxuICB2YXIgYjA0ID0gYTAxICogYTEzIC0gYTAzICogYTExO1xyXG4gIHZhciBiMDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTI7XHJcbiAgdmFyIGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMDtcclxuICB2YXIgYjA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwO1xyXG4gIHZhciBiMDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzA7XHJcbiAgdmFyIGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMTtcclxuICB2YXIgYjEwID0gYTIxICogYTMzIC0gYTIzICogYTMxO1xyXG4gIHZhciBiMTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzI7IC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcclxuXHJcbiAgdmFyIGRldCA9IGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNjtcclxuXHJcbiAgaWYgKCFkZXQpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgZGV0ID0gMS4wIC8gZGV0O1xyXG4gIG91dFswXSA9IChhMTEgKiBiMTEgLSBhMTIgKiBiMTAgKyBhMTMgKiBiMDkpICogZGV0O1xyXG4gIG91dFsxXSA9IChhMDIgKiBiMTAgLSBhMDEgKiBiMTEgLSBhMDMgKiBiMDkpICogZGV0O1xyXG4gIG91dFsyXSA9IChhMzEgKiBiMDUgLSBhMzIgKiBiMDQgKyBhMzMgKiBiMDMpICogZGV0O1xyXG4gIG91dFszXSA9IChhMjIgKiBiMDQgLSBhMjEgKiBiMDUgLSBhMjMgKiBiMDMpICogZGV0O1xyXG4gIG91dFs0XSA9IChhMTIgKiBiMDggLSBhMTAgKiBiMTEgLSBhMTMgKiBiMDcpICogZGV0O1xyXG4gIG91dFs1XSA9IChhMDAgKiBiMTEgLSBhMDIgKiBiMDggKyBhMDMgKiBiMDcpICogZGV0O1xyXG4gIG91dFs2XSA9IChhMzIgKiBiMDIgLSBhMzAgKiBiMDUgLSBhMzMgKiBiMDEpICogZGV0O1xyXG4gIG91dFs3XSA9IChhMjAgKiBiMDUgLSBhMjIgKiBiMDIgKyBhMjMgKiBiMDEpICogZGV0O1xyXG4gIG91dFs4XSA9IChhMTAgKiBiMTAgLSBhMTEgKiBiMDggKyBhMTMgKiBiMDYpICogZGV0O1xyXG4gIG91dFs5XSA9IChhMDEgKiBiMDggLSBhMDAgKiBiMTAgLSBhMDMgKiBiMDYpICogZGV0O1xyXG4gIG91dFsxMF0gPSAoYTMwICogYjA0IC0gYTMxICogYjAyICsgYTMzICogYjAwKSAqIGRldDtcclxuICBvdXRbMTFdID0gKGEyMSAqIGIwMiAtIGEyMCAqIGIwNCAtIGEyMyAqIGIwMCkgKiBkZXQ7XHJcbiAgb3V0WzEyXSA9IChhMTEgKiBiMDcgLSBhMTAgKiBiMDkgLSBhMTIgKiBiMDYpICogZGV0O1xyXG4gIG91dFsxM10gPSAoYTAwICogYjA5IC0gYTAxICogYjA3ICsgYTAyICogYjA2KSAqIGRldDtcclxuICBvdXRbMTRdID0gKGEzMSAqIGIwMSAtIGEzMCAqIGIwMyAtIGEzMiAqIGIwMCkgKiBkZXQ7XHJcbiAgb3V0WzE1XSA9IChhMjAgKiBiMDMgLSBhMjEgKiBiMDEgKyBhMjIgKiBiMDApICogZGV0O1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuLyoqXHJcbiAqIENhbGN1bGF0ZXMgdGhlIGFkanVnYXRlIG9mIGEgbWF0NFxyXG4gKlxyXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxyXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgc291cmNlIG1hdHJpeFxyXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkam9pbnQob3V0LCBhKSB7XHJcbiAgdmFyIGEwMCA9IGFbMF0sXHJcbiAgICAgIGEwMSA9IGFbMV0sXHJcbiAgICAgIGEwMiA9IGFbMl0sXHJcbiAgICAgIGEwMyA9IGFbM107XHJcbiAgdmFyIGExMCA9IGFbNF0sXHJcbiAgICAgIGExMSA9IGFbNV0sXHJcbiAgICAgIGExMiA9IGFbNl0sXHJcbiAgICAgIGExMyA9IGFbN107XHJcbiAgdmFyIGEyMCA9IGFbOF0sXHJcbiAgICAgIGEyMSA9IGFbOV0sXHJcbiAgICAgIGEyMiA9IGFbMTBdLFxyXG4gICAgICBhMjMgPSBhWzExXTtcclxuICB2YXIgYTMwID0gYVsxMl0sXHJcbiAgICAgIGEzMSA9IGFbMTNdLFxyXG4gICAgICBhMzIgPSBhWzE0XSxcclxuICAgICAgYTMzID0gYVsxNV07XHJcbiAgdmFyIGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMDtcclxuICB2YXIgYjAxID0gYTAwICogYTEyIC0gYTAyICogYTEwO1xyXG4gIHZhciBiMDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTA7XHJcbiAgdmFyIGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMTtcclxuICB2YXIgYjA0ID0gYTAxICogYTEzIC0gYTAzICogYTExO1xyXG4gIHZhciBiMDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTI7XHJcbiAgdmFyIGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMDtcclxuICB2YXIgYjA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwO1xyXG4gIHZhciBiMDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzA7XHJcbiAgdmFyIGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMTtcclxuICB2YXIgYjEwID0gYTIxICogYTMzIC0gYTIzICogYTMxO1xyXG4gIHZhciBiMTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzI7XHJcbiAgb3V0WzBdID0gYTExICogYjExIC0gYTEyICogYjEwICsgYTEzICogYjA5O1xyXG4gIG91dFsxXSA9IGEwMiAqIGIxMCAtIGEwMSAqIGIxMSAtIGEwMyAqIGIwOTtcclxuICBvdXRbMl0gPSBhMzEgKiBiMDUgLSBhMzIgKiBiMDQgKyBhMzMgKiBiMDM7XHJcbiAgb3V0WzNdID0gYTIyICogYjA0IC0gYTIxICogYjA1IC0gYTIzICogYjAzO1xyXG4gIG91dFs0XSA9IGExMiAqIGIwOCAtIGExMCAqIGIxMSAtIGExMyAqIGIwNztcclxuICBvdXRbNV0gPSBhMDAgKiBiMTEgLSBhMDIgKiBiMDggKyBhMDMgKiBiMDc7XHJcbiAgb3V0WzZdID0gYTMyICogYjAyIC0gYTMwICogYjA1IC0gYTMzICogYjAxO1xyXG4gIG91dFs3XSA9IGEyMCAqIGIwNSAtIGEyMiAqIGIwMiArIGEyMyAqIGIwMTtcclxuICBvdXRbOF0gPSBhMTAgKiBiMTAgLSBhMTEgKiBiMDggKyBhMTMgKiBiMDY7XHJcbiAgb3V0WzldID0gYTAxICogYjA4IC0gYTAwICogYjEwIC0gYTAzICogYjA2O1xyXG4gIG91dFsxMF0gPSBhMzAgKiBiMDQgLSBhMzEgKiBiMDIgKyBhMzMgKiBiMDA7XHJcbiAgb3V0WzExXSA9IGEyMSAqIGIwMiAtIGEyMCAqIGIwNCAtIGEyMyAqIGIwMDtcclxuICBvdXRbMTJdID0gYTExICogYjA3IC0gYTEwICogYjA5IC0gYTEyICogYjA2O1xyXG4gIG91dFsxM10gPSBhMDAgKiBiMDkgLSBhMDEgKiBiMDcgKyBhMDIgKiBiMDY7XHJcbiAgb3V0WzE0XSA9IGEzMSAqIGIwMSAtIGEzMCAqIGIwMyAtIGEzMiAqIGIwMDtcclxuICBvdXRbMTVdID0gYTIwICogYjAzIC0gYTIxICogYjAxICsgYTIyICogYjAwO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuLyoqXHJcbiAqIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgbWF0NFxyXG4gKlxyXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgc291cmNlIG1hdHJpeFxyXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkZXRlcm1pbmFudCBvZiBhXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRldGVybWluYW50KGEpIHtcclxuICB2YXIgYTAwID0gYVswXSxcclxuICAgICAgYTAxID0gYVsxXSxcclxuICAgICAgYTAyID0gYVsyXSxcclxuICAgICAgYTAzID0gYVszXTtcclxuICB2YXIgYTEwID0gYVs0XSxcclxuICAgICAgYTExID0gYVs1XSxcclxuICAgICAgYTEyID0gYVs2XSxcclxuICAgICAgYTEzID0gYVs3XTtcclxuICB2YXIgYTIwID0gYVs4XSxcclxuICAgICAgYTIxID0gYVs5XSxcclxuICAgICAgYTIyID0gYVsxMF0sXHJcbiAgICAgIGEyMyA9IGFbMTFdO1xyXG4gIHZhciBhMzAgPSBhWzEyXSxcclxuICAgICAgYTMxID0gYVsxM10sXHJcbiAgICAgIGEzMiA9IGFbMTRdLFxyXG4gICAgICBhMzMgPSBhWzE1XTtcclxuICB2YXIgYjAgPSBhMDAgKiBhMTEgLSBhMDEgKiBhMTA7XHJcbiAgdmFyIGIxID0gYTAwICogYTEyIC0gYTAyICogYTEwO1xyXG4gIHZhciBiMiA9IGEwMSAqIGExMiAtIGEwMiAqIGExMTtcclxuICB2YXIgYjMgPSBhMjAgKiBhMzEgLSBhMjEgKiBhMzA7XHJcbiAgdmFyIGI0ID0gYTIwICogYTMyIC0gYTIyICogYTMwO1xyXG4gIHZhciBiNSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMTtcclxuICB2YXIgYjYgPSBhMDAgKiBiNSAtIGEwMSAqIGI0ICsgYTAyICogYjM7XHJcbiAgdmFyIGI3ID0gYTEwICogYjUgLSBhMTEgKiBiNCArIGExMiAqIGIzO1xyXG4gIHZhciBiOCA9IGEyMCAqIGIyIC0gYTIxICogYjEgKyBhMjIgKiBiMDtcclxuICB2YXIgYjkgPSBhMzAgKiBiMiAtIGEzMSAqIGIxICsgYTMyICogYjA7IC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcclxuXHJcbiAgcmV0dXJuIGExMyAqIGI2IC0gYTAzICogYjcgKyBhMzMgKiBiOCAtIGEyMyAqIGI5O1xyXG59XHJcbi8qKlxyXG4gKiBNdWx0aXBsaWVzIHR3byBtYXQ0c1xyXG4gKlxyXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxyXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxyXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcclxuICogQHJldHVybnMge21hdDR9IG91dFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtdWx0aXBseShvdXQsIGEsIGIpIHtcclxuICB2YXIgYTAwID0gYVswXSxcclxuICAgICAgYTAxID0gYVsxXSxcclxuICAgICAgYTAyID0gYVsyXSxcclxuICAgICAgYTAzID0gYVszXTtcclxuICB2YXIgYTEwID0gYVs0XSxcclxuICAgICAgYTExID0gYVs1XSxcclxuICAgICAgYTEyID0gYVs2XSxcclxuICAgICAgYTEzID0gYVs3XTtcclxuICB2YXIgYTIwID0gYVs4XSxcclxuICAgICAgYTIxID0gYVs5XSxcclxuICAgICAgYTIyID0gYVsxMF0sXHJcbiAgICAgIGEyMyA9IGFbMTFdO1xyXG4gIHZhciBhMzAgPSBhWzEyXSxcclxuICAgICAgYTMxID0gYVsxM10sXHJcbiAgICAgIGEzMiA9IGFbMTRdLFxyXG4gICAgICBhMzMgPSBhWzE1XTsgLy8gQ2FjaGUgb25seSB0aGUgY3VycmVudCBsaW5lIG9mIHRoZSBzZWNvbmQgbWF0cml4XHJcblxyXG4gIHZhciBiMCA9IGJbMF0sXHJcbiAgICAgIGIxID0gYlsxXSxcclxuICAgICAgYjIgPSBiWzJdLFxyXG4gICAgICBiMyA9IGJbM107XHJcbiAgb3V0WzBdID0gYjAgKiBhMDAgKyBiMSAqIGExMCArIGIyICogYTIwICsgYjMgKiBhMzA7XHJcbiAgb3V0WzFdID0gYjAgKiBhMDEgKyBiMSAqIGExMSArIGIyICogYTIxICsgYjMgKiBhMzE7XHJcbiAgb3V0WzJdID0gYjAgKiBhMDIgKyBiMSAqIGExMiArIGIyICogYTIyICsgYjMgKiBhMzI7XHJcbiAgb3V0WzNdID0gYjAgKiBhMDMgKyBiMSAqIGExMyArIGIyICogYTIzICsgYjMgKiBhMzM7XHJcbiAgYjAgPSBiWzRdO1xyXG4gIGIxID0gYls1XTtcclxuICBiMiA9IGJbNl07XHJcbiAgYjMgPSBiWzddO1xyXG4gIG91dFs0XSA9IGIwICogYTAwICsgYjEgKiBhMTAgKyBiMiAqIGEyMCArIGIzICogYTMwO1xyXG4gIG91dFs1XSA9IGIwICogYTAxICsgYjEgKiBhMTEgKyBiMiAqIGEyMSArIGIzICogYTMxO1xyXG4gIG91dFs2XSA9IGIwICogYTAyICsgYjEgKiBhMTIgKyBiMiAqIGEyMiArIGIzICogYTMyO1xyXG4gIG91dFs3XSA9IGIwICogYTAzICsgYjEgKiBhMTMgKyBiMiAqIGEyMyArIGIzICogYTMzO1xyXG4gIGIwID0gYls4XTtcclxuICBiMSA9IGJbOV07XHJcbiAgYjIgPSBiWzEwXTtcclxuICBiMyA9IGJbMTFdO1xyXG4gIG91dFs4XSA9IGIwICogYTAwICsgYjEgKiBhMTAgKyBiMiAqIGEyMCArIGIzICogYTMwO1xyXG4gIG91dFs5XSA9IGIwICogYTAxICsgYjEgKiBhMTEgKyBiMiAqIGEyMSArIGIzICogYTMxO1xyXG4gIG91dFsxMF0gPSBiMCAqIGEwMiArIGIxICogYTEyICsgYjIgKiBhMjIgKyBiMyAqIGEzMjtcclxuICBvdXRbMTFdID0gYjAgKiBhMDMgKyBiMSAqIGExMyArIGIyICogYTIzICsgYjMgKiBhMzM7XHJcbiAgYjAgPSBiWzEyXTtcclxuICBiMSA9IGJbMTNdO1xyXG4gIGIyID0gYlsxNF07XHJcbiAgYjMgPSBiWzE1XTtcclxuICBvdXRbMTJdID0gYjAgKiBhMDAgKyBiMSAqIGExMCArIGIyICogYTIwICsgYjMgKiBhMzA7XHJcbiAgb3V0WzEzXSA9IGIwICogYTAxICsgYjEgKiBhMTEgKyBiMiAqIGEyMSArIGIzICogYTMxO1xyXG4gIG91dFsxNF0gPSBiMCAqIGEwMiArIGIxICogYTEyICsgYjIgKiBhMjIgKyBiMyAqIGEzMjtcclxuICBvdXRbMTVdID0gYjAgKiBhMDMgKyBiMSAqIGExMyArIGIyICogYTIzICsgYjMgKiBhMzM7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogVHJhbnNsYXRlIGEgbWF0NCBieSB0aGUgZ2l2ZW4gdmVjdG9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIHRoZSBtYXRyaXggdG8gdHJhbnNsYXRlXHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSB2IHZlY3RvciB0byB0cmFuc2xhdGUgYnlcclxuICogQHJldHVybnMge21hdDR9IG91dFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGUob3V0LCBhLCB2KSB7XHJcbiAgdmFyIHggPSB2WzBdLFxyXG4gICAgICB5ID0gdlsxXSxcclxuICAgICAgeiA9IHZbMl07XHJcbiAgdmFyIGEwMCwgYTAxLCBhMDIsIGEwMztcclxuICB2YXIgYTEwLCBhMTEsIGExMiwgYTEzO1xyXG4gIHZhciBhMjAsIGEyMSwgYTIyLCBhMjM7XHJcblxyXG4gIGlmIChhID09PSBvdXQpIHtcclxuICAgIG91dFsxMl0gPSBhWzBdICogeCArIGFbNF0gKiB5ICsgYVs4XSAqIHogKyBhWzEyXTtcclxuICAgIG91dFsxM10gPSBhWzFdICogeCArIGFbNV0gKiB5ICsgYVs5XSAqIHogKyBhWzEzXTtcclxuICAgIG91dFsxNF0gPSBhWzJdICogeCArIGFbNl0gKiB5ICsgYVsxMF0gKiB6ICsgYVsxNF07XHJcbiAgICBvdXRbMTVdID0gYVszXSAqIHggKyBhWzddICogeSArIGFbMTFdICogeiArIGFbMTVdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBhMDAgPSBhWzBdO1xyXG4gICAgYTAxID0gYVsxXTtcclxuICAgIGEwMiA9IGFbMl07XHJcbiAgICBhMDMgPSBhWzNdO1xyXG4gICAgYTEwID0gYVs0XTtcclxuICAgIGExMSA9IGFbNV07XHJcbiAgICBhMTIgPSBhWzZdO1xyXG4gICAgYTEzID0gYVs3XTtcclxuICAgIGEyMCA9IGFbOF07XHJcbiAgICBhMjEgPSBhWzldO1xyXG4gICAgYTIyID0gYVsxMF07XHJcbiAgICBhMjMgPSBhWzExXTtcclxuICAgIG91dFswXSA9IGEwMDtcclxuICAgIG91dFsxXSA9IGEwMTtcclxuICAgIG91dFsyXSA9IGEwMjtcclxuICAgIG91dFszXSA9IGEwMztcclxuICAgIG91dFs0XSA9IGExMDtcclxuICAgIG91dFs1XSA9IGExMTtcclxuICAgIG91dFs2XSA9IGExMjtcclxuICAgIG91dFs3XSA9IGExMztcclxuICAgIG91dFs4XSA9IGEyMDtcclxuICAgIG91dFs5XSA9IGEyMTtcclxuICAgIG91dFsxMF0gPSBhMjI7XHJcbiAgICBvdXRbMTFdID0gYTIzO1xyXG4gICAgb3V0WzEyXSA9IGEwMCAqIHggKyBhMTAgKiB5ICsgYTIwICogeiArIGFbMTJdO1xyXG4gICAgb3V0WzEzXSA9IGEwMSAqIHggKyBhMTEgKiB5ICsgYTIxICogeiArIGFbMTNdO1xyXG4gICAgb3V0WzE0XSA9IGEwMiAqIHggKyBhMTIgKiB5ICsgYTIyICogeiArIGFbMTRdO1xyXG4gICAgb3V0WzE1XSA9IGEwMyAqIHggKyBhMTMgKiB5ICsgYTIzICogeiArIGFbMTVdO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogU2NhbGVzIHRoZSBtYXQ0IGJ5IHRoZSBkaW1lbnNpb25zIGluIHRoZSBnaXZlbiB2ZWMzIG5vdCB1c2luZyB2ZWN0b3JpemF0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIHRoZSBtYXRyaXggdG8gc2NhbGVcclxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IHYgdGhlIHZlYzMgdG8gc2NhbGUgdGhlIG1hdHJpeCBieVxyXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XHJcbiAqKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzY2FsZShvdXQsIGEsIHYpIHtcclxuICB2YXIgeCA9IHZbMF0sXHJcbiAgICAgIHkgPSB2WzFdLFxyXG4gICAgICB6ID0gdlsyXTtcclxuICBvdXRbMF0gPSBhWzBdICogeDtcclxuICBvdXRbMV0gPSBhWzFdICogeDtcclxuICBvdXRbMl0gPSBhWzJdICogeDtcclxuICBvdXRbM10gPSBhWzNdICogeDtcclxuICBvdXRbNF0gPSBhWzRdICogeTtcclxuICBvdXRbNV0gPSBhWzVdICogeTtcclxuICBvdXRbNl0gPSBhWzZdICogeTtcclxuICBvdXRbN10gPSBhWzddICogeTtcclxuICBvdXRbOF0gPSBhWzhdICogejtcclxuICBvdXRbOV0gPSBhWzldICogejtcclxuICBvdXRbMTBdID0gYVsxMF0gKiB6O1xyXG4gIG91dFsxMV0gPSBhWzExXSAqIHo7XHJcbiAgb3V0WzEyXSA9IGFbMTJdO1xyXG4gIG91dFsxM10gPSBhWzEzXTtcclxuICBvdXRbMTRdID0gYVsxNF07XHJcbiAgb3V0WzE1XSA9IGFbMTVdO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuLyoqXHJcbiAqIFJvdGF0ZXMgYSBtYXQ0IGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIGdpdmVuIGF4aXNcclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcclxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcclxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcclxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IGF4aXMgdGhlIGF4aXMgdG8gcm90YXRlIGFyb3VuZFxyXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvdGF0ZShvdXQsIGEsIHJhZCwgYXhpcykge1xyXG4gIHZhciB4ID0gYXhpc1swXSxcclxuICAgICAgeSA9IGF4aXNbMV0sXHJcbiAgICAgIHogPSBheGlzWzJdO1xyXG4gIHZhciBsZW4gPSBNYXRoLmh5cG90KHgsIHksIHopO1xyXG4gIHZhciBzLCBjLCB0O1xyXG4gIHZhciBhMDAsIGEwMSwgYTAyLCBhMDM7XHJcbiAgdmFyIGExMCwgYTExLCBhMTIsIGExMztcclxuICB2YXIgYTIwLCBhMjEsIGEyMiwgYTIzO1xyXG4gIHZhciBiMDAsIGIwMSwgYjAyO1xyXG4gIHZhciBiMTAsIGIxMSwgYjEyO1xyXG4gIHZhciBiMjAsIGIyMSwgYjIyO1xyXG5cclxuICBpZiAobGVuIDwgZ2xNYXRyaXguRVBTSUxPTikge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBsZW4gPSAxIC8gbGVuO1xyXG4gIHggKj0gbGVuO1xyXG4gIHkgKj0gbGVuO1xyXG4gIHogKj0gbGVuO1xyXG4gIHMgPSBNYXRoLnNpbihyYWQpO1xyXG4gIGMgPSBNYXRoLmNvcyhyYWQpO1xyXG4gIHQgPSAxIC0gYztcclxuICBhMDAgPSBhWzBdO1xyXG4gIGEwMSA9IGFbMV07XHJcbiAgYTAyID0gYVsyXTtcclxuICBhMDMgPSBhWzNdO1xyXG4gIGExMCA9IGFbNF07XHJcbiAgYTExID0gYVs1XTtcclxuICBhMTIgPSBhWzZdO1xyXG4gIGExMyA9IGFbN107XHJcbiAgYTIwID0gYVs4XTtcclxuICBhMjEgPSBhWzldO1xyXG4gIGEyMiA9IGFbMTBdO1xyXG4gIGEyMyA9IGFbMTFdOyAvLyBDb25zdHJ1Y3QgdGhlIGVsZW1lbnRzIG9mIHRoZSByb3RhdGlvbiBtYXRyaXhcclxuXHJcbiAgYjAwID0geCAqIHggKiB0ICsgYztcclxuICBiMDEgPSB5ICogeCAqIHQgKyB6ICogcztcclxuICBiMDIgPSB6ICogeCAqIHQgLSB5ICogcztcclxuICBiMTAgPSB4ICogeSAqIHQgLSB6ICogcztcclxuICBiMTEgPSB5ICogeSAqIHQgKyBjO1xyXG4gIGIxMiA9IHogKiB5ICogdCArIHggKiBzO1xyXG4gIGIyMCA9IHggKiB6ICogdCArIHkgKiBzO1xyXG4gIGIyMSA9IHkgKiB6ICogdCAtIHggKiBzO1xyXG4gIGIyMiA9IHogKiB6ICogdCArIGM7IC8vIFBlcmZvcm0gcm90YXRpb24tc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXHJcblxyXG4gIG91dFswXSA9IGEwMCAqIGIwMCArIGExMCAqIGIwMSArIGEyMCAqIGIwMjtcclxuICBvdXRbMV0gPSBhMDEgKiBiMDAgKyBhMTEgKiBiMDEgKyBhMjEgKiBiMDI7XHJcbiAgb3V0WzJdID0gYTAyICogYjAwICsgYTEyICogYjAxICsgYTIyICogYjAyO1xyXG4gIG91dFszXSA9IGEwMyAqIGIwMCArIGExMyAqIGIwMSArIGEyMyAqIGIwMjtcclxuICBvdXRbNF0gPSBhMDAgKiBiMTAgKyBhMTAgKiBiMTEgKyBhMjAgKiBiMTI7XHJcbiAgb3V0WzVdID0gYTAxICogYjEwICsgYTExICogYjExICsgYTIxICogYjEyO1xyXG4gIG91dFs2XSA9IGEwMiAqIGIxMCArIGExMiAqIGIxMSArIGEyMiAqIGIxMjtcclxuICBvdXRbN10gPSBhMDMgKiBiMTAgKyBhMTMgKiBiMTEgKyBhMjMgKiBiMTI7XHJcbiAgb3V0WzhdID0gYTAwICogYjIwICsgYTEwICogYjIxICsgYTIwICogYjIyO1xyXG4gIG91dFs5XSA9IGEwMSAqIGIyMCArIGExMSAqIGIyMSArIGEyMSAqIGIyMjtcclxuICBvdXRbMTBdID0gYTAyICogYjIwICsgYTEyICogYjIxICsgYTIyICogYjIyO1xyXG4gIG91dFsxMV0gPSBhMDMgKiBiMjAgKyBhMTMgKiBiMjEgKyBhMjMgKiBiMjI7XHJcblxyXG4gIGlmIChhICE9PSBvdXQpIHtcclxuICAgIC8vIElmIHRoZSBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIGRpZmZlciwgY29weSB0aGUgdW5jaGFuZ2VkIGxhc3Qgcm93XHJcbiAgICBvdXRbMTJdID0gYVsxMl07XHJcbiAgICBvdXRbMTNdID0gYVsxM107XHJcbiAgICBvdXRbMTRdID0gYVsxNF07XHJcbiAgICBvdXRbMTVdID0gYVsxNV07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBSb3RhdGVzIGEgbWF0cml4IGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFggYXhpc1xyXG4gKlxyXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxyXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgbWF0cml4IHRvIHJvdGF0ZVxyXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxyXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvdGF0ZVgob3V0LCBhLCByYWQpIHtcclxuICB2YXIgcyA9IE1hdGguc2luKHJhZCk7XHJcbiAgdmFyIGMgPSBNYXRoLmNvcyhyYWQpO1xyXG4gIHZhciBhMTAgPSBhWzRdO1xyXG4gIHZhciBhMTEgPSBhWzVdO1xyXG4gIHZhciBhMTIgPSBhWzZdO1xyXG4gIHZhciBhMTMgPSBhWzddO1xyXG4gIHZhciBhMjAgPSBhWzhdO1xyXG4gIHZhciBhMjEgPSBhWzldO1xyXG4gIHZhciBhMjIgPSBhWzEwXTtcclxuICB2YXIgYTIzID0gYVsxMV07XHJcblxyXG4gIGlmIChhICE9PSBvdXQpIHtcclxuICAgIC8vIElmIHRoZSBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIGRpZmZlciwgY29weSB0aGUgdW5jaGFuZ2VkIHJvd3NcclxuICAgIG91dFswXSA9IGFbMF07XHJcbiAgICBvdXRbMV0gPSBhWzFdO1xyXG4gICAgb3V0WzJdID0gYVsyXTtcclxuICAgIG91dFszXSA9IGFbM107XHJcbiAgICBvdXRbMTJdID0gYVsxMl07XHJcbiAgICBvdXRbMTNdID0gYVsxM107XHJcbiAgICBvdXRbMTRdID0gYVsxNF07XHJcbiAgICBvdXRbMTVdID0gYVsxNV07XHJcbiAgfSAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXHJcblxyXG5cclxuICBvdXRbNF0gPSBhMTAgKiBjICsgYTIwICogcztcclxuICBvdXRbNV0gPSBhMTEgKiBjICsgYTIxICogcztcclxuICBvdXRbNl0gPSBhMTIgKiBjICsgYTIyICogcztcclxuICBvdXRbN10gPSBhMTMgKiBjICsgYTIzICogcztcclxuICBvdXRbOF0gPSBhMjAgKiBjIC0gYTEwICogcztcclxuICBvdXRbOV0gPSBhMjEgKiBjIC0gYTExICogcztcclxuICBvdXRbMTBdID0gYTIyICogYyAtIGExMiAqIHM7XHJcbiAgb3V0WzExXSA9IGEyMyAqIGMgLSBhMTMgKiBzO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuLyoqXHJcbiAqIFJvdGF0ZXMgYSBtYXRyaXggYnkgdGhlIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgWSBheGlzXHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm90YXRlWShvdXQsIGEsIHJhZCkge1xyXG4gIHZhciBzID0gTWF0aC5zaW4ocmFkKTtcclxuICB2YXIgYyA9IE1hdGguY29zKHJhZCk7XHJcbiAgdmFyIGEwMCA9IGFbMF07XHJcbiAgdmFyIGEwMSA9IGFbMV07XHJcbiAgdmFyIGEwMiA9IGFbMl07XHJcbiAgdmFyIGEwMyA9IGFbM107XHJcbiAgdmFyIGEyMCA9IGFbOF07XHJcbiAgdmFyIGEyMSA9IGFbOV07XHJcbiAgdmFyIGEyMiA9IGFbMTBdO1xyXG4gIHZhciBhMjMgPSBhWzExXTtcclxuXHJcbiAgaWYgKGEgIT09IG91dCkge1xyXG4gICAgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgcm93c1xyXG4gICAgb3V0WzRdID0gYVs0XTtcclxuICAgIG91dFs1XSA9IGFbNV07XHJcbiAgICBvdXRbNl0gPSBhWzZdO1xyXG4gICAgb3V0WzddID0gYVs3XTtcclxuICAgIG91dFsxMl0gPSBhWzEyXTtcclxuICAgIG91dFsxM10gPSBhWzEzXTtcclxuICAgIG91dFsxNF0gPSBhWzE0XTtcclxuICAgIG91dFsxNV0gPSBhWzE1XTtcclxuICB9IC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cclxuXHJcblxyXG4gIG91dFswXSA9IGEwMCAqIGMgLSBhMjAgKiBzO1xyXG4gIG91dFsxXSA9IGEwMSAqIGMgLSBhMjEgKiBzO1xyXG4gIG91dFsyXSA9IGEwMiAqIGMgLSBhMjIgKiBzO1xyXG4gIG91dFszXSA9IGEwMyAqIGMgLSBhMjMgKiBzO1xyXG4gIG91dFs4XSA9IGEwMCAqIHMgKyBhMjAgKiBjO1xyXG4gIG91dFs5XSA9IGEwMSAqIHMgKyBhMjEgKiBjO1xyXG4gIG91dFsxMF0gPSBhMDIgKiBzICsgYTIyICogYztcclxuICBvdXRbMTFdID0gYTAzICogcyArIGEyMyAqIGM7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogUm90YXRlcyBhIG1hdHJpeCBieSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBaIGF4aXNcclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcclxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcclxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcclxuICogQHJldHVybnMge21hdDR9IG91dFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb3RhdGVaKG91dCwgYSwgcmFkKSB7XHJcbiAgdmFyIHMgPSBNYXRoLnNpbihyYWQpO1xyXG4gIHZhciBjID0gTWF0aC5jb3MocmFkKTtcclxuICB2YXIgYTAwID0gYVswXTtcclxuICB2YXIgYTAxID0gYVsxXTtcclxuICB2YXIgYTAyID0gYVsyXTtcclxuICB2YXIgYTAzID0gYVszXTtcclxuICB2YXIgYTEwID0gYVs0XTtcclxuICB2YXIgYTExID0gYVs1XTtcclxuICB2YXIgYTEyID0gYVs2XTtcclxuICB2YXIgYTEzID0gYVs3XTtcclxuXHJcbiAgaWYgKGEgIT09IG91dCkge1xyXG4gICAgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgbGFzdCByb3dcclxuICAgIG91dFs4XSA9IGFbOF07XHJcbiAgICBvdXRbOV0gPSBhWzldO1xyXG4gICAgb3V0WzEwXSA9IGFbMTBdO1xyXG4gICAgb3V0WzExXSA9IGFbMTFdO1xyXG4gICAgb3V0WzEyXSA9IGFbMTJdO1xyXG4gICAgb3V0WzEzXSA9IGFbMTNdO1xyXG4gICAgb3V0WzE0XSA9IGFbMTRdO1xyXG4gICAgb3V0WzE1XSA9IGFbMTVdO1xyXG4gIH0gLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxyXG5cclxuXHJcbiAgb3V0WzBdID0gYTAwICogYyArIGExMCAqIHM7XHJcbiAgb3V0WzFdID0gYTAxICogYyArIGExMSAqIHM7XHJcbiAgb3V0WzJdID0gYTAyICogYyArIGExMiAqIHM7XHJcbiAgb3V0WzNdID0gYTAzICogYyArIGExMyAqIHM7XHJcbiAgb3V0WzRdID0gYTEwICogYyAtIGEwMCAqIHM7XHJcbiAgb3V0WzVdID0gYTExICogYyAtIGEwMSAqIHM7XHJcbiAgb3V0WzZdID0gYTEyICogYyAtIGEwMiAqIHM7XHJcbiAgb3V0WzddID0gYTEzICogYyAtIGEwMyAqIHM7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgdmVjdG9yIHRyYW5zbGF0aW9uXHJcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxyXG4gKlxyXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcclxuICogICAgIG1hdDQudHJhbnNsYXRlKGRlc3QsIGRlc3QsIHZlYyk7XHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcclxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IHYgVHJhbnNsYXRpb24gdmVjdG9yXHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZnJvbVRyYW5zbGF0aW9uKG91dCwgdikge1xyXG4gIG91dFswXSA9IDE7XHJcbiAgb3V0WzFdID0gMDtcclxuICBvdXRbMl0gPSAwO1xyXG4gIG91dFszXSA9IDA7XHJcbiAgb3V0WzRdID0gMDtcclxuICBvdXRbNV0gPSAxO1xyXG4gIG91dFs2XSA9IDA7XHJcbiAgb3V0WzddID0gMDtcclxuICBvdXRbOF0gPSAwO1xyXG4gIG91dFs5XSA9IDA7XHJcbiAgb3V0WzEwXSA9IDE7XHJcbiAgb3V0WzExXSA9IDA7XHJcbiAgb3V0WzEyXSA9IHZbMF07XHJcbiAgb3V0WzEzXSA9IHZbMV07XHJcbiAgb3V0WzE0XSA9IHZbMl07XHJcbiAgb3V0WzE1XSA9IDE7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgdmVjdG9yIHNjYWxpbmdcclxuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XHJcbiAqXHJcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xyXG4gKiAgICAgbWF0NC5zY2FsZShkZXN0LCBkZXN0LCB2ZWMpO1xyXG4gKlxyXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSB2IFNjYWxpbmcgdmVjdG9yXHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZnJvbVNjYWxpbmcob3V0LCB2KSB7XHJcbiAgb3V0WzBdID0gdlswXTtcclxuICBvdXRbMV0gPSAwO1xyXG4gIG91dFsyXSA9IDA7XHJcbiAgb3V0WzNdID0gMDtcclxuICBvdXRbNF0gPSAwO1xyXG4gIG91dFs1XSA9IHZbMV07XHJcbiAgb3V0WzZdID0gMDtcclxuICBvdXRbN10gPSAwO1xyXG4gIG91dFs4XSA9IDA7XHJcbiAgb3V0WzldID0gMDtcclxuICBvdXRbMTBdID0gdlsyXTtcclxuICBvdXRbMTFdID0gMDtcclxuICBvdXRbMTJdID0gMDtcclxuICBvdXRbMTNdID0gMDtcclxuICBvdXRbMTRdID0gMDtcclxuICBvdXRbMTVdID0gMTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBnaXZlbiBhbmdsZSBhcm91bmQgYSBnaXZlbiBheGlzXHJcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxyXG4gKlxyXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcclxuICogICAgIG1hdDQucm90YXRlKGRlc3QsIGRlc3QsIHJhZCwgYXhpcyk7XHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcclxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcclxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IGF4aXMgdGhlIGF4aXMgdG8gcm90YXRlIGFyb3VuZFxyXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZyb21Sb3RhdGlvbihvdXQsIHJhZCwgYXhpcykge1xyXG4gIHZhciB4ID0gYXhpc1swXSxcclxuICAgICAgeSA9IGF4aXNbMV0sXHJcbiAgICAgIHogPSBheGlzWzJdO1xyXG4gIHZhciBsZW4gPSBNYXRoLmh5cG90KHgsIHksIHopO1xyXG4gIHZhciBzLCBjLCB0O1xyXG5cclxuICBpZiAobGVuIDwgZ2xNYXRyaXguRVBTSUxPTikge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBsZW4gPSAxIC8gbGVuO1xyXG4gIHggKj0gbGVuO1xyXG4gIHkgKj0gbGVuO1xyXG4gIHogKj0gbGVuO1xyXG4gIHMgPSBNYXRoLnNpbihyYWQpO1xyXG4gIGMgPSBNYXRoLmNvcyhyYWQpO1xyXG4gIHQgPSAxIC0gYzsgLy8gUGVyZm9ybSByb3RhdGlvbi1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cclxuXHJcbiAgb3V0WzBdID0geCAqIHggKiB0ICsgYztcclxuICBvdXRbMV0gPSB5ICogeCAqIHQgKyB6ICogcztcclxuICBvdXRbMl0gPSB6ICogeCAqIHQgLSB5ICogcztcclxuICBvdXRbM10gPSAwO1xyXG4gIG91dFs0XSA9IHggKiB5ICogdCAtIHogKiBzO1xyXG4gIG91dFs1XSA9IHkgKiB5ICogdCArIGM7XHJcbiAgb3V0WzZdID0geiAqIHkgKiB0ICsgeCAqIHM7XHJcbiAgb3V0WzddID0gMDtcclxuICBvdXRbOF0gPSB4ICogeiAqIHQgKyB5ICogcztcclxuICBvdXRbOV0gPSB5ICogeiAqIHQgLSB4ICogcztcclxuICBvdXRbMTBdID0geiAqIHogKiB0ICsgYztcclxuICBvdXRbMTFdID0gMDtcclxuICBvdXRbMTJdID0gMDtcclxuICBvdXRbMTNdID0gMDtcclxuICBvdXRbMTRdID0gMDtcclxuICBvdXRbMTVdID0gMTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gdGhlIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgWCBheGlzXHJcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxyXG4gKlxyXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcclxuICogICAgIG1hdDQucm90YXRlWChkZXN0LCBkZXN0LCByYWQpO1xyXG4gKlxyXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XHJcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZnJvbVhSb3RhdGlvbihvdXQsIHJhZCkge1xyXG4gIHZhciBzID0gTWF0aC5zaW4ocmFkKTtcclxuICB2YXIgYyA9IE1hdGguY29zKHJhZCk7IC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cclxuXHJcbiAgb3V0WzBdID0gMTtcclxuICBvdXRbMV0gPSAwO1xyXG4gIG91dFsyXSA9IDA7XHJcbiAgb3V0WzNdID0gMDtcclxuICBvdXRbNF0gPSAwO1xyXG4gIG91dFs1XSA9IGM7XHJcbiAgb3V0WzZdID0gcztcclxuICBvdXRbN10gPSAwO1xyXG4gIG91dFs4XSA9IDA7XHJcbiAgb3V0WzldID0gLXM7XHJcbiAgb3V0WzEwXSA9IGM7XHJcbiAgb3V0WzExXSA9IDA7XHJcbiAgb3V0WzEyXSA9IDA7XHJcbiAgb3V0WzEzXSA9IDA7XHJcbiAgb3V0WzE0XSA9IDA7XHJcbiAgb3V0WzE1XSA9IDE7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFkgYXhpc1xyXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcclxuICpcclxuICogICAgIG1hdDQuaWRlbnRpdHkoZGVzdCk7XHJcbiAqICAgICBtYXQ0LnJvdGF0ZVkoZGVzdCwgZGVzdCwgcmFkKTtcclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxyXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxyXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZyb21ZUm90YXRpb24ob3V0LCByYWQpIHtcclxuICB2YXIgcyA9IE1hdGguc2luKHJhZCk7XHJcbiAgdmFyIGMgPSBNYXRoLmNvcyhyYWQpOyAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXHJcblxyXG4gIG91dFswXSA9IGM7XHJcbiAgb3V0WzFdID0gMDtcclxuICBvdXRbMl0gPSAtcztcclxuICBvdXRbM10gPSAwO1xyXG4gIG91dFs0XSA9IDA7XHJcbiAgb3V0WzVdID0gMTtcclxuICBvdXRbNl0gPSAwO1xyXG4gIG91dFs3XSA9IDA7XHJcbiAgb3V0WzhdID0gcztcclxuICBvdXRbOV0gPSAwO1xyXG4gIG91dFsxMF0gPSBjO1xyXG4gIG91dFsxMV0gPSAwO1xyXG4gIG91dFsxMl0gPSAwO1xyXG4gIG91dFsxM10gPSAwO1xyXG4gIG91dFsxNF0gPSAwO1xyXG4gIG91dFsxNV0gPSAxO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBaIGF4aXNcclxuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XHJcbiAqXHJcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xyXG4gKiAgICAgbWF0NC5yb3RhdGVaKGRlc3QsIGRlc3QsIHJhZCk7XHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcclxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcclxuICogQHJldHVybnMge21hdDR9IG91dFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmcm9tWlJvdGF0aW9uKG91dCwgcmFkKSB7XHJcbiAgdmFyIHMgPSBNYXRoLnNpbihyYWQpO1xyXG4gIHZhciBjID0gTWF0aC5jb3MocmFkKTsgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxyXG5cclxuICBvdXRbMF0gPSBjO1xyXG4gIG91dFsxXSA9IHM7XHJcbiAgb3V0WzJdID0gMDtcclxuICBvdXRbM10gPSAwO1xyXG4gIG91dFs0XSA9IC1zO1xyXG4gIG91dFs1XSA9IGM7XHJcbiAgb3V0WzZdID0gMDtcclxuICBvdXRbN10gPSAwO1xyXG4gIG91dFs4XSA9IDA7XHJcbiAgb3V0WzldID0gMDtcclxuICBvdXRbMTBdID0gMTtcclxuICBvdXRbMTFdID0gMDtcclxuICBvdXRbMTJdID0gMDtcclxuICBvdXRbMTNdID0gMDtcclxuICBvdXRbMTRdID0gMDtcclxuICBvdXRbMTVdID0gMTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBxdWF0ZXJuaW9uIHJvdGF0aW9uIGFuZCB2ZWN0b3IgdHJhbnNsYXRpb25cclxuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XHJcbiAqXHJcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xyXG4gKiAgICAgbWF0NC50cmFuc2xhdGUoZGVzdCwgdmVjKTtcclxuICogICAgIGxldCBxdWF0TWF0ID0gbWF0NC5jcmVhdGUoKTtcclxuICogICAgIHF1YXQ0LnRvTWF0NChxdWF0LCBxdWF0TWF0KTtcclxuICogICAgIG1hdDQubXVsdGlwbHkoZGVzdCwgcXVhdE1hdCk7XHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcclxuICogQHBhcmFtIHtxdWF0NH0gcSBSb3RhdGlvbiBxdWF0ZXJuaW9uXHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSB2IFRyYW5zbGF0aW9uIHZlY3RvclxyXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZyb21Sb3RhdGlvblRyYW5zbGF0aW9uKG91dCwgcSwgdikge1xyXG4gIC8vIFF1YXRlcm5pb24gbWF0aFxyXG4gIHZhciB4ID0gcVswXSxcclxuICAgICAgeSA9IHFbMV0sXHJcbiAgICAgIHogPSBxWzJdLFxyXG4gICAgICB3ID0gcVszXTtcclxuICB2YXIgeDIgPSB4ICsgeDtcclxuICB2YXIgeTIgPSB5ICsgeTtcclxuICB2YXIgejIgPSB6ICsgejtcclxuICB2YXIgeHggPSB4ICogeDI7XHJcbiAgdmFyIHh5ID0geCAqIHkyO1xyXG4gIHZhciB4eiA9IHggKiB6MjtcclxuICB2YXIgeXkgPSB5ICogeTI7XHJcbiAgdmFyIHl6ID0geSAqIHoyO1xyXG4gIHZhciB6eiA9IHogKiB6MjtcclxuICB2YXIgd3ggPSB3ICogeDI7XHJcbiAgdmFyIHd5ID0gdyAqIHkyO1xyXG4gIHZhciB3eiA9IHcgKiB6MjtcclxuICBvdXRbMF0gPSAxIC0gKHl5ICsgenopO1xyXG4gIG91dFsxXSA9IHh5ICsgd3o7XHJcbiAgb3V0WzJdID0geHogLSB3eTtcclxuICBvdXRbM10gPSAwO1xyXG4gIG91dFs0XSA9IHh5IC0gd3o7XHJcbiAgb3V0WzVdID0gMSAtICh4eCArIHp6KTtcclxuICBvdXRbNl0gPSB5eiArIHd4O1xyXG4gIG91dFs3XSA9IDA7XHJcbiAgb3V0WzhdID0geHogKyB3eTtcclxuICBvdXRbOV0gPSB5eiAtIHd4O1xyXG4gIG91dFsxMF0gPSAxIC0gKHh4ICsgeXkpO1xyXG4gIG91dFsxMV0gPSAwO1xyXG4gIG91dFsxMl0gPSB2WzBdO1xyXG4gIG91dFsxM10gPSB2WzFdO1xyXG4gIG91dFsxNF0gPSB2WzJdO1xyXG4gIG91dFsxNV0gPSAxO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgbWF0NCBmcm9tIGEgZHVhbCBxdWF0LlxyXG4gKlxyXG4gKiBAcGFyYW0ge21hdDR9IG91dCBNYXRyaXhcclxuICogQHBhcmFtIHtSZWFkb25seVF1YXQyfSBhIER1YWwgUXVhdGVybmlvblxyXG4gKiBAcmV0dXJucyB7bWF0NH0gbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmcm9tUXVhdDIob3V0LCBhKSB7XHJcbiAgdmFyIHRyYW5zbGF0aW9uID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoMyk7XHJcbiAgdmFyIGJ4ID0gLWFbMF0sXHJcbiAgICAgIGJ5ID0gLWFbMV0sXHJcbiAgICAgIGJ6ID0gLWFbMl0sXHJcbiAgICAgIGJ3ID0gYVszXSxcclxuICAgICAgYXggPSBhWzRdLFxyXG4gICAgICBheSA9IGFbNV0sXHJcbiAgICAgIGF6ID0gYVs2XSxcclxuICAgICAgYXcgPSBhWzddO1xyXG4gIHZhciBtYWduaXR1ZGUgPSBieCAqIGJ4ICsgYnkgKiBieSArIGJ6ICogYnogKyBidyAqIGJ3OyAvL09ubHkgc2NhbGUgaWYgaXQgbWFrZXMgc2Vuc2VcclxuXHJcbiAgaWYgKG1hZ25pdHVkZSA+IDApIHtcclxuICAgIHRyYW5zbGF0aW9uWzBdID0gKGF4ICogYncgKyBhdyAqIGJ4ICsgYXkgKiBieiAtIGF6ICogYnkpICogMiAvIG1hZ25pdHVkZTtcclxuICAgIHRyYW5zbGF0aW9uWzFdID0gKGF5ICogYncgKyBhdyAqIGJ5ICsgYXogKiBieCAtIGF4ICogYnopICogMiAvIG1hZ25pdHVkZTtcclxuICAgIHRyYW5zbGF0aW9uWzJdID0gKGF6ICogYncgKyBhdyAqIGJ6ICsgYXggKiBieSAtIGF5ICogYngpICogMiAvIG1hZ25pdHVkZTtcclxuICB9IGVsc2Uge1xyXG4gICAgdHJhbnNsYXRpb25bMF0gPSAoYXggKiBidyArIGF3ICogYnggKyBheSAqIGJ6IC0gYXogKiBieSkgKiAyO1xyXG4gICAgdHJhbnNsYXRpb25bMV0gPSAoYXkgKiBidyArIGF3ICogYnkgKyBheiAqIGJ4IC0gYXggKiBieikgKiAyO1xyXG4gICAgdHJhbnNsYXRpb25bMl0gPSAoYXogKiBidyArIGF3ICogYnogKyBheCAqIGJ5IC0gYXkgKiBieCkgKiAyO1xyXG4gIH1cclxuXHJcbiAgZnJvbVJvdGF0aW9uVHJhbnNsYXRpb24ob3V0LCBhLCB0cmFuc2xhdGlvbik7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogUmV0dXJucyB0aGUgdHJhbnNsYXRpb24gdmVjdG9yIGNvbXBvbmVudCBvZiBhIHRyYW5zZm9ybWF0aW9uXHJcbiAqICBtYXRyaXguIElmIGEgbWF0cml4IGlzIGJ1aWx0IHdpdGggZnJvbVJvdGF0aW9uVHJhbnNsYXRpb24sXHJcbiAqICB0aGUgcmV0dXJuZWQgdmVjdG9yIHdpbGwgYmUgdGhlIHNhbWUgYXMgdGhlIHRyYW5zbGF0aW9uIHZlY3RvclxyXG4gKiAgb3JpZ2luYWxseSBzdXBwbGllZC5cclxuICogQHBhcmFtICB7dmVjM30gb3V0IFZlY3RvciB0byByZWNlaXZlIHRyYW5zbGF0aW9uIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0gIHtSZWFkb25seU1hdDR9IG1hdCBNYXRyaXggdG8gYmUgZGVjb21wb3NlZCAoaW5wdXQpXHJcbiAqIEByZXR1cm4ge3ZlYzN9IG91dFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUcmFuc2xhdGlvbihvdXQsIG1hdCkge1xyXG4gIG91dFswXSA9IG1hdFsxMl07XHJcbiAgb3V0WzFdID0gbWF0WzEzXTtcclxuICBvdXRbMl0gPSBtYXRbMTRdO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHNjYWxpbmcgZmFjdG9yIGNvbXBvbmVudCBvZiBhIHRyYW5zZm9ybWF0aW9uXHJcbiAqICBtYXRyaXguIElmIGEgbWF0cml4IGlzIGJ1aWx0IHdpdGggZnJvbVJvdGF0aW9uVHJhbnNsYXRpb25TY2FsZVxyXG4gKiAgd2l0aCBhIG5vcm1hbGl6ZWQgUXVhdGVybmlvbiBwYXJhbXRlciwgdGhlIHJldHVybmVkIHZlY3RvciB3aWxsIGJlXHJcbiAqICB0aGUgc2FtZSBhcyB0aGUgc2NhbGluZyB2ZWN0b3JcclxuICogIG9yaWdpbmFsbHkgc3VwcGxpZWQuXHJcbiAqIEBwYXJhbSAge3ZlYzN9IG91dCBWZWN0b3IgdG8gcmVjZWl2ZSBzY2FsaW5nIGZhY3RvciBjb21wb25lbnRcclxuICogQHBhcmFtICB7UmVhZG9ubHlNYXQ0fSBtYXQgTWF0cml4IHRvIGJlIGRlY29tcG9zZWQgKGlucHV0KVxyXG4gKiBAcmV0dXJuIHt2ZWMzfSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2NhbGluZyhvdXQsIG1hdCkge1xyXG4gIHZhciBtMTEgPSBtYXRbMF07XHJcbiAgdmFyIG0xMiA9IG1hdFsxXTtcclxuICB2YXIgbTEzID0gbWF0WzJdO1xyXG4gIHZhciBtMjEgPSBtYXRbNF07XHJcbiAgdmFyIG0yMiA9IG1hdFs1XTtcclxuICB2YXIgbTIzID0gbWF0WzZdO1xyXG4gIHZhciBtMzEgPSBtYXRbOF07XHJcbiAgdmFyIG0zMiA9IG1hdFs5XTtcclxuICB2YXIgbTMzID0gbWF0WzEwXTtcclxuICBvdXRbMF0gPSBNYXRoLmh5cG90KG0xMSwgbTEyLCBtMTMpO1xyXG4gIG91dFsxXSA9IE1hdGguaHlwb3QobTIxLCBtMjIsIG0yMyk7XHJcbiAgb3V0WzJdID0gTWF0aC5oeXBvdChtMzEsIG0zMiwgbTMzKTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgcXVhdGVybmlvbiByZXByZXNlbnRpbmcgdGhlIHJvdGF0aW9uYWwgY29tcG9uZW50XHJcbiAqICBvZiBhIHRyYW5zZm9ybWF0aW9uIG1hdHJpeC4gSWYgYSBtYXRyaXggaXMgYnVpbHQgd2l0aFxyXG4gKiAgZnJvbVJvdGF0aW9uVHJhbnNsYXRpb24sIHRoZSByZXR1cm5lZCBxdWF0ZXJuaW9uIHdpbGwgYmUgdGhlXHJcbiAqICBzYW1lIGFzIHRoZSBxdWF0ZXJuaW9uIG9yaWdpbmFsbHkgc3VwcGxpZWQuXHJcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IFF1YXRlcm5pb24gdG8gcmVjZWl2ZSB0aGUgcm90YXRpb24gY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBtYXQgTWF0cml4IHRvIGJlIGRlY29tcG9zZWQgKGlucHV0KVxyXG4gKiBAcmV0dXJuIHtxdWF0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Um90YXRpb24ob3V0LCBtYXQpIHtcclxuICB2YXIgc2NhbGluZyA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDMpO1xyXG4gIGdldFNjYWxpbmcoc2NhbGluZywgbWF0KTtcclxuICB2YXIgaXMxID0gMSAvIHNjYWxpbmdbMF07XHJcbiAgdmFyIGlzMiA9IDEgLyBzY2FsaW5nWzFdO1xyXG4gIHZhciBpczMgPSAxIC8gc2NhbGluZ1syXTtcclxuICB2YXIgc20xMSA9IG1hdFswXSAqIGlzMTtcclxuICB2YXIgc20xMiA9IG1hdFsxXSAqIGlzMjtcclxuICB2YXIgc20xMyA9IG1hdFsyXSAqIGlzMztcclxuICB2YXIgc20yMSA9IG1hdFs0XSAqIGlzMTtcclxuICB2YXIgc20yMiA9IG1hdFs1XSAqIGlzMjtcclxuICB2YXIgc20yMyA9IG1hdFs2XSAqIGlzMztcclxuICB2YXIgc20zMSA9IG1hdFs4XSAqIGlzMTtcclxuICB2YXIgc20zMiA9IG1hdFs5XSAqIGlzMjtcclxuICB2YXIgc20zMyA9IG1hdFsxMF0gKiBpczM7XHJcbiAgdmFyIHRyYWNlID0gc20xMSArIHNtMjIgKyBzbTMzO1xyXG4gIHZhciBTID0gMDtcclxuXHJcbiAgaWYgKHRyYWNlID4gMCkge1xyXG4gICAgUyA9IE1hdGguc3FydCh0cmFjZSArIDEuMCkgKiAyO1xyXG4gICAgb3V0WzNdID0gMC4yNSAqIFM7XHJcbiAgICBvdXRbMF0gPSAoc20yMyAtIHNtMzIpIC8gUztcclxuICAgIG91dFsxXSA9IChzbTMxIC0gc20xMykgLyBTO1xyXG4gICAgb3V0WzJdID0gKHNtMTIgLSBzbTIxKSAvIFM7XHJcbiAgfSBlbHNlIGlmIChzbTExID4gc20yMiAmJiBzbTExID4gc20zMykge1xyXG4gICAgUyA9IE1hdGguc3FydCgxLjAgKyBzbTExIC0gc20yMiAtIHNtMzMpICogMjtcclxuICAgIG91dFszXSA9IChzbTIzIC0gc20zMikgLyBTO1xyXG4gICAgb3V0WzBdID0gMC4yNSAqIFM7XHJcbiAgICBvdXRbMV0gPSAoc20xMiArIHNtMjEpIC8gUztcclxuICAgIG91dFsyXSA9IChzbTMxICsgc20xMykgLyBTO1xyXG4gIH0gZWxzZSBpZiAoc20yMiA+IHNtMzMpIHtcclxuICAgIFMgPSBNYXRoLnNxcnQoMS4wICsgc20yMiAtIHNtMTEgLSBzbTMzKSAqIDI7XHJcbiAgICBvdXRbM10gPSAoc20zMSAtIHNtMTMpIC8gUztcclxuICAgIG91dFswXSA9IChzbTEyICsgc20yMSkgLyBTO1xyXG4gICAgb3V0WzFdID0gMC4yNSAqIFM7XHJcbiAgICBvdXRbMl0gPSAoc20yMyArIHNtMzIpIC8gUztcclxuICB9IGVsc2Uge1xyXG4gICAgUyA9IE1hdGguc3FydCgxLjAgKyBzbTMzIC0gc20xMSAtIHNtMjIpICogMjtcclxuICAgIG91dFszXSA9IChzbTEyIC0gc20yMSkgLyBTO1xyXG4gICAgb3V0WzBdID0gKHNtMzEgKyBzbTEzKSAvIFM7XHJcbiAgICBvdXRbMV0gPSAoc20yMyArIHNtMzIpIC8gUztcclxuICAgIG91dFsyXSA9IDAuMjUgKiBTO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogRGVjb21wb3NlcyBhIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBpbnRvIGl0cyByb3RhdGlvbiwgdHJhbnNsYXRpb25cclxuICogYW5kIHNjYWxlIGNvbXBvbmVudHMuIFJldHVybnMgb25seSB0aGUgcm90YXRpb24gY29tcG9uZW50XHJcbiAqIEBwYXJhbSAge3F1YXR9IG91dF9yIFF1YXRlcm5pb24gdG8gcmVjZWl2ZSB0aGUgcm90YXRpb24gY29tcG9uZW50XHJcbiAqIEBwYXJhbSAge3ZlYzN9IG91dF90IFZlY3RvciB0byByZWNlaXZlIHRoZSB0cmFuc2xhdGlvbiB2ZWN0b3JcclxuICogQHBhcmFtICB7dmVjM30gb3V0X3MgVmVjdG9yIHRvIHJlY2VpdmUgdGhlIHNjYWxpbmcgZmFjdG9yXHJcbiAqIEBwYXJhbSAge1JlYWRvbmx5TWF0NH0gbWF0IE1hdHJpeCB0byBiZSBkZWNvbXBvc2VkIChpbnB1dClcclxuICogQHJldHVybnMge3F1YXR9IG91dF9yXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlY29tcG9zZShvdXRfciwgb3V0X3QsIG91dF9zLCBtYXQpIHtcclxuICBvdXRfdFswXSA9IG1hdFsxMl07XHJcbiAgb3V0X3RbMV0gPSBtYXRbMTNdO1xyXG4gIG91dF90WzJdID0gbWF0WzE0XTtcclxuICB2YXIgbTExID0gbWF0WzBdO1xyXG4gIHZhciBtMTIgPSBtYXRbMV07XHJcbiAgdmFyIG0xMyA9IG1hdFsyXTtcclxuICB2YXIgbTIxID0gbWF0WzRdO1xyXG4gIHZhciBtMjIgPSBtYXRbNV07XHJcbiAgdmFyIG0yMyA9IG1hdFs2XTtcclxuICB2YXIgbTMxID0gbWF0WzhdO1xyXG4gIHZhciBtMzIgPSBtYXRbOV07XHJcbiAgdmFyIG0zMyA9IG1hdFsxMF07XHJcbiAgb3V0X3NbMF0gPSBNYXRoLmh5cG90KG0xMSwgbTEyLCBtMTMpO1xyXG4gIG91dF9zWzFdID0gTWF0aC5oeXBvdChtMjEsIG0yMiwgbTIzKTtcclxuICBvdXRfc1syXSA9IE1hdGguaHlwb3QobTMxLCBtMzIsIG0zMyk7XHJcbiAgdmFyIGlzMSA9IDEgLyBvdXRfc1swXTtcclxuICB2YXIgaXMyID0gMSAvIG91dF9zWzFdO1xyXG4gIHZhciBpczMgPSAxIC8gb3V0X3NbMl07XHJcbiAgdmFyIHNtMTEgPSBtMTEgKiBpczE7XHJcbiAgdmFyIHNtMTIgPSBtMTIgKiBpczI7XHJcbiAgdmFyIHNtMTMgPSBtMTMgKiBpczM7XHJcbiAgdmFyIHNtMjEgPSBtMjEgKiBpczE7XHJcbiAgdmFyIHNtMjIgPSBtMjIgKiBpczI7XHJcbiAgdmFyIHNtMjMgPSBtMjMgKiBpczM7XHJcbiAgdmFyIHNtMzEgPSBtMzEgKiBpczE7XHJcbiAgdmFyIHNtMzIgPSBtMzIgKiBpczI7XHJcbiAgdmFyIHNtMzMgPSBtMzMgKiBpczM7XHJcbiAgdmFyIHRyYWNlID0gc20xMSArIHNtMjIgKyBzbTMzO1xyXG4gIHZhciBTID0gMDtcclxuXHJcbiAgaWYgKHRyYWNlID4gMCkge1xyXG4gICAgUyA9IE1hdGguc3FydCh0cmFjZSArIDEuMCkgKiAyO1xyXG4gICAgb3V0X3JbM10gPSAwLjI1ICogUztcclxuICAgIG91dF9yWzBdID0gKHNtMjMgLSBzbTMyKSAvIFM7XHJcbiAgICBvdXRfclsxXSA9IChzbTMxIC0gc20xMykgLyBTO1xyXG4gICAgb3V0X3JbMl0gPSAoc20xMiAtIHNtMjEpIC8gUztcclxuICB9IGVsc2UgaWYgKHNtMTEgPiBzbTIyICYmIHNtMTEgPiBzbTMzKSB7XHJcbiAgICBTID0gTWF0aC5zcXJ0KDEuMCArIHNtMTEgLSBzbTIyIC0gc20zMykgKiAyO1xyXG4gICAgb3V0X3JbM10gPSAoc20yMyAtIHNtMzIpIC8gUztcclxuICAgIG91dF9yWzBdID0gMC4yNSAqIFM7XHJcbiAgICBvdXRfclsxXSA9IChzbTEyICsgc20yMSkgLyBTO1xyXG4gICAgb3V0X3JbMl0gPSAoc20zMSArIHNtMTMpIC8gUztcclxuICB9IGVsc2UgaWYgKHNtMjIgPiBzbTMzKSB7XHJcbiAgICBTID0gTWF0aC5zcXJ0KDEuMCArIHNtMjIgLSBzbTExIC0gc20zMykgKiAyO1xyXG4gICAgb3V0X3JbM10gPSAoc20zMSAtIHNtMTMpIC8gUztcclxuICAgIG91dF9yWzBdID0gKHNtMTIgKyBzbTIxKSAvIFM7XHJcbiAgICBvdXRfclsxXSA9IDAuMjUgKiBTO1xyXG4gICAgb3V0X3JbMl0gPSAoc20yMyArIHNtMzIpIC8gUztcclxuICB9IGVsc2Uge1xyXG4gICAgUyA9IE1hdGguc3FydCgxLjAgKyBzbTMzIC0gc20xMSAtIHNtMjIpICogMjtcclxuICAgIG91dF9yWzNdID0gKHNtMTIgLSBzbTIxKSAvIFM7XHJcbiAgICBvdXRfclswXSA9IChzbTMxICsgc20xMykgLyBTO1xyXG4gICAgb3V0X3JbMV0gPSAoc20yMyArIHNtMzIpIC8gUztcclxuICAgIG91dF9yWzJdID0gMC4yNSAqIFM7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3V0X3I7XHJcbn1cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHF1YXRlcm5pb24gcm90YXRpb24sIHZlY3RvciB0cmFuc2xhdGlvbiBhbmQgdmVjdG9yIHNjYWxlXHJcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxyXG4gKlxyXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcclxuICogICAgIG1hdDQudHJhbnNsYXRlKGRlc3QsIHZlYyk7XHJcbiAqICAgICBsZXQgcXVhdE1hdCA9IG1hdDQuY3JlYXRlKCk7XHJcbiAqICAgICBxdWF0NC50b01hdDQocXVhdCwgcXVhdE1hdCk7XHJcbiAqICAgICBtYXQ0Lm11bHRpcGx5KGRlc3QsIHF1YXRNYXQpO1xyXG4gKiAgICAgbWF0NC5zY2FsZShkZXN0LCBzY2FsZSlcclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxyXG4gKiBAcGFyYW0ge3F1YXQ0fSBxIFJvdGF0aW9uIHF1YXRlcm5pb25cclxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IHYgVHJhbnNsYXRpb24gdmVjdG9yXHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSBzIFNjYWxpbmcgdmVjdG9yXHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZnJvbVJvdGF0aW9uVHJhbnNsYXRpb25TY2FsZShvdXQsIHEsIHYsIHMpIHtcclxuICAvLyBRdWF0ZXJuaW9uIG1hdGhcclxuICB2YXIgeCA9IHFbMF0sXHJcbiAgICAgIHkgPSBxWzFdLFxyXG4gICAgICB6ID0gcVsyXSxcclxuICAgICAgdyA9IHFbM107XHJcbiAgdmFyIHgyID0geCArIHg7XHJcbiAgdmFyIHkyID0geSArIHk7XHJcbiAgdmFyIHoyID0geiArIHo7XHJcbiAgdmFyIHh4ID0geCAqIHgyO1xyXG4gIHZhciB4eSA9IHggKiB5MjtcclxuICB2YXIgeHogPSB4ICogejI7XHJcbiAgdmFyIHl5ID0geSAqIHkyO1xyXG4gIHZhciB5eiA9IHkgKiB6MjtcclxuICB2YXIgenogPSB6ICogejI7XHJcbiAgdmFyIHd4ID0gdyAqIHgyO1xyXG4gIHZhciB3eSA9IHcgKiB5MjtcclxuICB2YXIgd3ogPSB3ICogejI7XHJcbiAgdmFyIHN4ID0gc1swXTtcclxuICB2YXIgc3kgPSBzWzFdO1xyXG4gIHZhciBzeiA9IHNbMl07XHJcbiAgb3V0WzBdID0gKDEgLSAoeXkgKyB6eikpICogc3g7XHJcbiAgb3V0WzFdID0gKHh5ICsgd3opICogc3g7XHJcbiAgb3V0WzJdID0gKHh6IC0gd3kpICogc3g7XHJcbiAgb3V0WzNdID0gMDtcclxuICBvdXRbNF0gPSAoeHkgLSB3eikgKiBzeTtcclxuICBvdXRbNV0gPSAoMSAtICh4eCArIHp6KSkgKiBzeTtcclxuICBvdXRbNl0gPSAoeXogKyB3eCkgKiBzeTtcclxuICBvdXRbN10gPSAwO1xyXG4gIG91dFs4XSA9ICh4eiArIHd5KSAqIHN6O1xyXG4gIG91dFs5XSA9ICh5eiAtIHd4KSAqIHN6O1xyXG4gIG91dFsxMF0gPSAoMSAtICh4eCArIHl5KSkgKiBzejtcclxuICBvdXRbMTFdID0gMDtcclxuICBvdXRbMTJdID0gdlswXTtcclxuICBvdXRbMTNdID0gdlsxXTtcclxuICBvdXRbMTRdID0gdlsyXTtcclxuICBvdXRbMTVdID0gMTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBxdWF0ZXJuaW9uIHJvdGF0aW9uLCB2ZWN0b3IgdHJhbnNsYXRpb24gYW5kIHZlY3RvciBzY2FsZSwgcm90YXRpbmcgYW5kIHNjYWxpbmcgYXJvdW5kIHRoZSBnaXZlbiBvcmlnaW5cclxuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XHJcbiAqXHJcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xyXG4gKiAgICAgbWF0NC50cmFuc2xhdGUoZGVzdCwgdmVjKTtcclxuICogICAgIG1hdDQudHJhbnNsYXRlKGRlc3QsIG9yaWdpbik7XHJcbiAqICAgICBsZXQgcXVhdE1hdCA9IG1hdDQuY3JlYXRlKCk7XHJcbiAqICAgICBxdWF0NC50b01hdDQocXVhdCwgcXVhdE1hdCk7XHJcbiAqICAgICBtYXQ0Lm11bHRpcGx5KGRlc3QsIHF1YXRNYXQpO1xyXG4gKiAgICAgbWF0NC5zY2FsZShkZXN0LCBzY2FsZSlcclxuICogICAgIG1hdDQudHJhbnNsYXRlKGRlc3QsIG5lZ2F0aXZlT3JpZ2luKTtcclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxyXG4gKiBAcGFyYW0ge3F1YXQ0fSBxIFJvdGF0aW9uIHF1YXRlcm5pb25cclxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IHYgVHJhbnNsYXRpb24gdmVjdG9yXHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSBzIFNjYWxpbmcgdmVjdG9yXHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSBvIFRoZSBvcmlnaW4gdmVjdG9yIGFyb3VuZCB3aGljaCB0byBzY2FsZSBhbmQgcm90YXRlXHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZnJvbVJvdGF0aW9uVHJhbnNsYXRpb25TY2FsZU9yaWdpbihvdXQsIHEsIHYsIHMsIG8pIHtcclxuICAvLyBRdWF0ZXJuaW9uIG1hdGhcclxuICB2YXIgeCA9IHFbMF0sXHJcbiAgICAgIHkgPSBxWzFdLFxyXG4gICAgICB6ID0gcVsyXSxcclxuICAgICAgdyA9IHFbM107XHJcbiAgdmFyIHgyID0geCArIHg7XHJcbiAgdmFyIHkyID0geSArIHk7XHJcbiAgdmFyIHoyID0geiArIHo7XHJcbiAgdmFyIHh4ID0geCAqIHgyO1xyXG4gIHZhciB4eSA9IHggKiB5MjtcclxuICB2YXIgeHogPSB4ICogejI7XHJcbiAgdmFyIHl5ID0geSAqIHkyO1xyXG4gIHZhciB5eiA9IHkgKiB6MjtcclxuICB2YXIgenogPSB6ICogejI7XHJcbiAgdmFyIHd4ID0gdyAqIHgyO1xyXG4gIHZhciB3eSA9IHcgKiB5MjtcclxuICB2YXIgd3ogPSB3ICogejI7XHJcbiAgdmFyIHN4ID0gc1swXTtcclxuICB2YXIgc3kgPSBzWzFdO1xyXG4gIHZhciBzeiA9IHNbMl07XHJcbiAgdmFyIG94ID0gb1swXTtcclxuICB2YXIgb3kgPSBvWzFdO1xyXG4gIHZhciBveiA9IG9bMl07XHJcbiAgdmFyIG91dDAgPSAoMSAtICh5eSArIHp6KSkgKiBzeDtcclxuICB2YXIgb3V0MSA9ICh4eSArIHd6KSAqIHN4O1xyXG4gIHZhciBvdXQyID0gKHh6IC0gd3kpICogc3g7XHJcbiAgdmFyIG91dDQgPSAoeHkgLSB3eikgKiBzeTtcclxuICB2YXIgb3V0NSA9ICgxIC0gKHh4ICsgenopKSAqIHN5O1xyXG4gIHZhciBvdXQ2ID0gKHl6ICsgd3gpICogc3k7XHJcbiAgdmFyIG91dDggPSAoeHogKyB3eSkgKiBzejtcclxuICB2YXIgb3V0OSA9ICh5eiAtIHd4KSAqIHN6O1xyXG4gIHZhciBvdXQxMCA9ICgxIC0gKHh4ICsgeXkpKSAqIHN6O1xyXG4gIG91dFswXSA9IG91dDA7XHJcbiAgb3V0WzFdID0gb3V0MTtcclxuICBvdXRbMl0gPSBvdXQyO1xyXG4gIG91dFszXSA9IDA7XHJcbiAgb3V0WzRdID0gb3V0NDtcclxuICBvdXRbNV0gPSBvdXQ1O1xyXG4gIG91dFs2XSA9IG91dDY7XHJcbiAgb3V0WzddID0gMDtcclxuICBvdXRbOF0gPSBvdXQ4O1xyXG4gIG91dFs5XSA9IG91dDk7XHJcbiAgb3V0WzEwXSA9IG91dDEwO1xyXG4gIG91dFsxMV0gPSAwO1xyXG4gIG91dFsxMl0gPSB2WzBdICsgb3ggLSAob3V0MCAqIG94ICsgb3V0NCAqIG95ICsgb3V0OCAqIG96KTtcclxuICBvdXRbMTNdID0gdlsxXSArIG95IC0gKG91dDEgKiBveCArIG91dDUgKiBveSArIG91dDkgKiBveik7XHJcbiAgb3V0WzE0XSA9IHZbMl0gKyBveiAtIChvdXQyICogb3ggKyBvdXQ2ICogb3kgKyBvdXQxMCAqIG96KTtcclxuICBvdXRbMTVdID0gMTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBDYWxjdWxhdGVzIGEgNHg0IG1hdHJpeCBmcm9tIHRoZSBnaXZlbiBxdWF0ZXJuaW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcclxuICogQHBhcmFtIHtSZWFkb25seVF1YXR9IHEgUXVhdGVybmlvbiB0byBjcmVhdGUgbWF0cml4IGZyb21cclxuICpcclxuICogQHJldHVybnMge21hdDR9IG91dFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmcm9tUXVhdChvdXQsIHEpIHtcclxuICB2YXIgeCA9IHFbMF0sXHJcbiAgICAgIHkgPSBxWzFdLFxyXG4gICAgICB6ID0gcVsyXSxcclxuICAgICAgdyA9IHFbM107XHJcbiAgdmFyIHgyID0geCArIHg7XHJcbiAgdmFyIHkyID0geSArIHk7XHJcbiAgdmFyIHoyID0geiArIHo7XHJcbiAgdmFyIHh4ID0geCAqIHgyO1xyXG4gIHZhciB5eCA9IHkgKiB4MjtcclxuICB2YXIgeXkgPSB5ICogeTI7XHJcbiAgdmFyIHp4ID0geiAqIHgyO1xyXG4gIHZhciB6eSA9IHogKiB5MjtcclxuICB2YXIgenogPSB6ICogejI7XHJcbiAgdmFyIHd4ID0gdyAqIHgyO1xyXG4gIHZhciB3eSA9IHcgKiB5MjtcclxuICB2YXIgd3ogPSB3ICogejI7XHJcbiAgb3V0WzBdID0gMSAtIHl5IC0geno7XHJcbiAgb3V0WzFdID0geXggKyB3ejtcclxuICBvdXRbMl0gPSB6eCAtIHd5O1xyXG4gIG91dFszXSA9IDA7XHJcbiAgb3V0WzRdID0geXggLSB3ejtcclxuICBvdXRbNV0gPSAxIC0geHggLSB6ejtcclxuICBvdXRbNl0gPSB6eSArIHd4O1xyXG4gIG91dFs3XSA9IDA7XHJcbiAgb3V0WzhdID0genggKyB3eTtcclxuICBvdXRbOV0gPSB6eSAtIHd4O1xyXG4gIG91dFsxMF0gPSAxIC0geHggLSB5eTtcclxuICBvdXRbMTFdID0gMDtcclxuICBvdXRbMTJdID0gMDtcclxuICBvdXRbMTNdID0gMDtcclxuICBvdXRbMTRdID0gMDtcclxuICBvdXRbMTVdID0gMTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBmcnVzdHVtIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBib3VuZHNcclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xyXG4gKiBAcGFyYW0ge051bWJlcn0gbGVmdCBMZWZ0IGJvdW5kIG9mIHRoZSBmcnVzdHVtXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSByaWdodCBSaWdodCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxyXG4gKiBAcGFyYW0ge051bWJlcn0gYm90dG9tIEJvdHRvbSBib3VuZCBvZiB0aGUgZnJ1c3R1bVxyXG4gKiBAcGFyYW0ge051bWJlcn0gdG9wIFRvcCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxyXG4gKiBAcGFyYW0ge051bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZnJ1c3R1bShvdXQsIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XHJcbiAgdmFyIHJsID0gMSAvIChyaWdodCAtIGxlZnQpO1xyXG4gIHZhciB0YiA9IDEgLyAodG9wIC0gYm90dG9tKTtcclxuICB2YXIgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xyXG4gIG91dFswXSA9IG5lYXIgKiAyICogcmw7XHJcbiAgb3V0WzFdID0gMDtcclxuICBvdXRbMl0gPSAwO1xyXG4gIG91dFszXSA9IDA7XHJcbiAgb3V0WzRdID0gMDtcclxuICBvdXRbNV0gPSBuZWFyICogMiAqIHRiO1xyXG4gIG91dFs2XSA9IDA7XHJcbiAgb3V0WzddID0gMDtcclxuICBvdXRbOF0gPSAocmlnaHQgKyBsZWZ0KSAqIHJsO1xyXG4gIG91dFs5XSA9ICh0b3AgKyBib3R0b20pICogdGI7XHJcbiAgb3V0WzEwXSA9IChmYXIgKyBuZWFyKSAqIG5mO1xyXG4gIG91dFsxMV0gPSAtMTtcclxuICBvdXRbMTJdID0gMDtcclxuICBvdXRbMTNdID0gMDtcclxuICBvdXRbMTRdID0gZmFyICogbmVhciAqIDIgKiBuZjtcclxuICBvdXRbMTVdID0gMDtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBwZXJzcGVjdGl2ZSBwcm9qZWN0aW9uIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBib3VuZHMuXHJcbiAqIFRoZSBuZWFyL2ZhciBjbGlwIHBsYW5lcyBjb3JyZXNwb25kIHRvIGEgbm9ybWFsaXplZCBkZXZpY2UgY29vcmRpbmF0ZSBaIHJhbmdlIG9mIFstMSwgMV0sXHJcbiAqIHdoaWNoIG1hdGNoZXMgV2ViR0wvT3BlbkdMJ3MgY2xpcCB2b2x1bWUuXHJcbiAqIFBhc3NpbmcgbnVsbC91bmRlZmluZWQvbm8gdmFsdWUgZm9yIGZhciB3aWxsIGdlbmVyYXRlIGluZmluaXRlIHByb2plY3Rpb24gbWF0cml4LlxyXG4gKlxyXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBmb3Z5IFZlcnRpY2FsIGZpZWxkIG9mIHZpZXcgaW4gcmFkaWFuc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gYXNwZWN0IEFzcGVjdCByYXRpby4gdHlwaWNhbGx5IHZpZXdwb3J0IHdpZHRoL2hlaWdodFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtLCBjYW4gYmUgbnVsbCBvciBJbmZpbml0eVxyXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBlcnNwZWN0aXZlTk8ob3V0LCBmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhcikge1xyXG4gIHZhciBmID0gMS4wIC8gTWF0aC50YW4oZm92eSAvIDIpO1xyXG4gIG91dFswXSA9IGYgLyBhc3BlY3Q7XHJcbiAgb3V0WzFdID0gMDtcclxuICBvdXRbMl0gPSAwO1xyXG4gIG91dFszXSA9IDA7XHJcbiAgb3V0WzRdID0gMDtcclxuICBvdXRbNV0gPSBmO1xyXG4gIG91dFs2XSA9IDA7XHJcbiAgb3V0WzddID0gMDtcclxuICBvdXRbOF0gPSAwO1xyXG4gIG91dFs5XSA9IDA7XHJcbiAgb3V0WzExXSA9IC0xO1xyXG4gIG91dFsxMl0gPSAwO1xyXG4gIG91dFsxM10gPSAwO1xyXG4gIG91dFsxNV0gPSAwO1xyXG5cclxuICBpZiAoZmFyICE9IG51bGwgJiYgZmFyICE9PSBJbmZpbml0eSkge1xyXG4gICAgdmFyIG5mID0gMSAvIChuZWFyIC0gZmFyKTtcclxuICAgIG91dFsxMF0gPSAoZmFyICsgbmVhcikgKiBuZjtcclxuICAgIG91dFsxNF0gPSAyICogZmFyICogbmVhciAqIG5mO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXRbMTBdID0gLTE7XHJcbiAgICBvdXRbMTRdID0gLTIgKiBuZWFyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogQWxpYXMgZm9yIHtAbGluayBtYXQ0LnBlcnNwZWN0aXZlTk99XHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuXHJcbmV4cG9ydCB2YXIgcGVyc3BlY3RpdmUgPSBwZXJzcGVjdGl2ZU5PO1xyXG4vKipcclxuICogR2VuZXJhdGVzIGEgcGVyc3BlY3RpdmUgcHJvamVjdGlvbiBtYXRyaXggc3VpdGFibGUgZm9yIFdlYkdQVSB3aXRoIHRoZSBnaXZlbiBib3VuZHMuXHJcbiAqIFRoZSBuZWFyL2ZhciBjbGlwIHBsYW5lcyBjb3JyZXNwb25kIHRvIGEgbm9ybWFsaXplZCBkZXZpY2UgY29vcmRpbmF0ZSBaIHJhbmdlIG9mIFswLCAxXSxcclxuICogd2hpY2ggbWF0Y2hlcyBXZWJHUFUvVnVsa2FuL0RpcmVjdFgvTWV0YWwncyBjbGlwIHZvbHVtZS5cclxuICogUGFzc2luZyBudWxsL3VuZGVmaW5lZC9ubyB2YWx1ZSBmb3IgZmFyIHdpbGwgZ2VuZXJhdGUgaW5maW5pdGUgcHJvamVjdGlvbiBtYXRyaXguXHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cclxuICogQHBhcmFtIHtudW1iZXJ9IGZvdnkgVmVydGljYWwgZmllbGQgb2YgdmlldyBpbiByYWRpYW5zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBhc3BlY3QgQXNwZWN0IHJhdGlvLiB0eXBpY2FsbHkgdmlld3BvcnQgd2lkdGgvaGVpZ2h0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cclxuICogQHBhcmFtIHtudW1iZXJ9IGZhciBGYXIgYm91bmQgb2YgdGhlIGZydXN0dW0sIGNhbiBiZSBudWxsIG9yIEluZmluaXR5XHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGVyc3BlY3RpdmVaTyhvdXQsIGZvdnksIGFzcGVjdCwgbmVhciwgZmFyKSB7XHJcbiAgdmFyIGYgPSAxLjAgLyBNYXRoLnRhbihmb3Z5IC8gMik7XHJcbiAgb3V0WzBdID0gZiAvIGFzcGVjdDtcclxuICBvdXRbMV0gPSAwO1xyXG4gIG91dFsyXSA9IDA7XHJcbiAgb3V0WzNdID0gMDtcclxuICBvdXRbNF0gPSAwO1xyXG4gIG91dFs1XSA9IGY7XHJcbiAgb3V0WzZdID0gMDtcclxuICBvdXRbN10gPSAwO1xyXG4gIG91dFs4XSA9IDA7XHJcbiAgb3V0WzldID0gMDtcclxuICBvdXRbMTFdID0gLTE7XHJcbiAgb3V0WzEyXSA9IDA7XHJcbiAgb3V0WzEzXSA9IDA7XHJcbiAgb3V0WzE1XSA9IDA7XHJcblxyXG4gIGlmIChmYXIgIT0gbnVsbCAmJiBmYXIgIT09IEluZmluaXR5KSB7XHJcbiAgICB2YXIgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xyXG4gICAgb3V0WzEwXSA9IGZhciAqIG5mO1xyXG4gICAgb3V0WzE0XSA9IGZhciAqIG5lYXIgKiBuZjtcclxuICB9IGVsc2Uge1xyXG4gICAgb3V0WzEwXSA9IC0xO1xyXG4gICAgb3V0WzE0XSA9IC1uZWFyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogR2VuZXJhdGVzIGEgcGVyc3BlY3RpdmUgcHJvamVjdGlvbiBtYXRyaXggd2l0aCB0aGUgZ2l2ZW4gZmllbGQgb2Ygdmlldy5cclxuICogVGhpcyBpcyBwcmltYXJpbHkgdXNlZnVsIGZvciBnZW5lcmF0aW5nIHByb2plY3Rpb24gbWF0cmljZXMgdG8gYmUgdXNlZFxyXG4gKiB3aXRoIHRoZSBzdGlsbCBleHBlcmllbWVudGFsIFdlYlZSIEFQSS5cclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xyXG4gKiBAcGFyYW0ge09iamVjdH0gZm92IE9iamVjdCBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgdmFsdWVzOiB1cERlZ3JlZXMsIGRvd25EZWdyZWVzLCBsZWZ0RGVncmVlcywgcmlnaHREZWdyZWVzXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cclxuICogQHBhcmFtIHtudW1iZXJ9IGZhciBGYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cclxuICogQHJldHVybnMge21hdDR9IG91dFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwZXJzcGVjdGl2ZUZyb21GaWVsZE9mVmlldyhvdXQsIGZvdiwgbmVhciwgZmFyKSB7XHJcbiAgdmFyIHVwVGFuID0gTWF0aC50YW4oZm92LnVwRGVncmVlcyAqIE1hdGguUEkgLyAxODAuMCk7XHJcbiAgdmFyIGRvd25UYW4gPSBNYXRoLnRhbihmb3YuZG93bkRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwLjApO1xyXG4gIHZhciBsZWZ0VGFuID0gTWF0aC50YW4oZm92LmxlZnREZWdyZWVzICogTWF0aC5QSSAvIDE4MC4wKTtcclxuICB2YXIgcmlnaHRUYW4gPSBNYXRoLnRhbihmb3YucmlnaHREZWdyZWVzICogTWF0aC5QSSAvIDE4MC4wKTtcclxuICB2YXIgeFNjYWxlID0gMi4wIC8gKGxlZnRUYW4gKyByaWdodFRhbik7XHJcbiAgdmFyIHlTY2FsZSA9IDIuMCAvICh1cFRhbiArIGRvd25UYW4pO1xyXG4gIG91dFswXSA9IHhTY2FsZTtcclxuICBvdXRbMV0gPSAwLjA7XHJcbiAgb3V0WzJdID0gMC4wO1xyXG4gIG91dFszXSA9IDAuMDtcclxuICBvdXRbNF0gPSAwLjA7XHJcbiAgb3V0WzVdID0geVNjYWxlO1xyXG4gIG91dFs2XSA9IDAuMDtcclxuICBvdXRbN10gPSAwLjA7XHJcbiAgb3V0WzhdID0gLSgobGVmdFRhbiAtIHJpZ2h0VGFuKSAqIHhTY2FsZSAqIDAuNSk7XHJcbiAgb3V0WzldID0gKHVwVGFuIC0gZG93blRhbikgKiB5U2NhbGUgKiAwLjU7XHJcbiAgb3V0WzEwXSA9IGZhciAvIChuZWFyIC0gZmFyKTtcclxuICBvdXRbMTFdID0gLTEuMDtcclxuICBvdXRbMTJdID0gMC4wO1xyXG4gIG91dFsxM10gPSAwLjA7XHJcbiAgb3V0WzE0XSA9IGZhciAqIG5lYXIgLyAobmVhciAtIGZhcik7XHJcbiAgb3V0WzE1XSA9IDAuMDtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBvcnRob2dvbmFsIHByb2plY3Rpb24gbWF0cml4IHdpdGggdGhlIGdpdmVuIGJvdW5kcy5cclxuICogVGhlIG5lYXIvZmFyIGNsaXAgcGxhbmVzIGNvcnJlc3BvbmQgdG8gYSBub3JtYWxpemVkIGRldmljZSBjb29yZGluYXRlIFogcmFuZ2Ugb2YgWy0xLCAxXSxcclxuICogd2hpY2ggbWF0Y2hlcyBXZWJHTC9PcGVuR0wncyBjbGlwIHZvbHVtZS5cclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xyXG4gKiBAcGFyYW0ge251bWJlcn0gbGVmdCBMZWZ0IGJvdW5kIG9mIHRoZSBmcnVzdHVtXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByaWdodCBSaWdodCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxyXG4gKiBAcGFyYW0ge251bWJlcn0gYm90dG9tIEJvdHRvbSBib3VuZCBvZiB0aGUgZnJ1c3R1bVxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG9wIFRvcCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxyXG4gKiBAcGFyYW0ge251bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb3J0aG9OTyhvdXQsIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XHJcbiAgdmFyIGxyID0gMSAvIChsZWZ0IC0gcmlnaHQpO1xyXG4gIHZhciBidCA9IDEgLyAoYm90dG9tIC0gdG9wKTtcclxuICB2YXIgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xyXG4gIG91dFswXSA9IC0yICogbHI7XHJcbiAgb3V0WzFdID0gMDtcclxuICBvdXRbMl0gPSAwO1xyXG4gIG91dFszXSA9IDA7XHJcbiAgb3V0WzRdID0gMDtcclxuICBvdXRbNV0gPSAtMiAqIGJ0O1xyXG4gIG91dFs2XSA9IDA7XHJcbiAgb3V0WzddID0gMDtcclxuICBvdXRbOF0gPSAwO1xyXG4gIG91dFs5XSA9IDA7XHJcbiAgb3V0WzEwXSA9IDIgKiBuZjtcclxuICBvdXRbMTFdID0gMDtcclxuICBvdXRbMTJdID0gKGxlZnQgKyByaWdodCkgKiBscjtcclxuICBvdXRbMTNdID0gKHRvcCArIGJvdHRvbSkgKiBidDtcclxuICBvdXRbMTRdID0gKGZhciArIG5lYXIpICogbmY7XHJcbiAgb3V0WzE1XSA9IDE7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogQWxpYXMgZm9yIHtAbGluayBtYXQ0Lm9ydGhvTk99XHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuXHJcbmV4cG9ydCB2YXIgb3J0aG8gPSBvcnRob05PO1xyXG4vKipcclxuICogR2VuZXJhdGVzIGEgb3J0aG9nb25hbCBwcm9qZWN0aW9uIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBib3VuZHMuXHJcbiAqIFRoZSBuZWFyL2ZhciBjbGlwIHBsYW5lcyBjb3JyZXNwb25kIHRvIGEgbm9ybWFsaXplZCBkZXZpY2UgY29vcmRpbmF0ZSBaIHJhbmdlIG9mIFswLCAxXSxcclxuICogd2hpY2ggbWF0Y2hlcyBXZWJHUFUvVnVsa2FuL0RpcmVjdFgvTWV0YWwncyBjbGlwIHZvbHVtZS5cclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xyXG4gKiBAcGFyYW0ge251bWJlcn0gbGVmdCBMZWZ0IGJvdW5kIG9mIHRoZSBmcnVzdHVtXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByaWdodCBSaWdodCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxyXG4gKiBAcGFyYW0ge251bWJlcn0gYm90dG9tIEJvdHRvbSBib3VuZCBvZiB0aGUgZnJ1c3R1bVxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG9wIFRvcCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxyXG4gKiBAcGFyYW0ge251bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb3J0aG9aTyhvdXQsIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XHJcbiAgdmFyIGxyID0gMSAvIChsZWZ0IC0gcmlnaHQpO1xyXG4gIHZhciBidCA9IDEgLyAoYm90dG9tIC0gdG9wKTtcclxuICB2YXIgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xyXG4gIG91dFswXSA9IC0yICogbHI7XHJcbiAgb3V0WzFdID0gMDtcclxuICBvdXRbMl0gPSAwO1xyXG4gIG91dFszXSA9IDA7XHJcbiAgb3V0WzRdID0gMDtcclxuICBvdXRbNV0gPSAtMiAqIGJ0O1xyXG4gIG91dFs2XSA9IDA7XHJcbiAgb3V0WzddID0gMDtcclxuICBvdXRbOF0gPSAwO1xyXG4gIG91dFs5XSA9IDA7XHJcbiAgb3V0WzEwXSA9IG5mO1xyXG4gIG91dFsxMV0gPSAwO1xyXG4gIG91dFsxMl0gPSAobGVmdCArIHJpZ2h0KSAqIGxyO1xyXG4gIG91dFsxM10gPSAodG9wICsgYm90dG9tKSAqIGJ0O1xyXG4gIG91dFsxNF0gPSBuZWFyICogbmY7XHJcbiAgb3V0WzE1XSA9IDE7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogR2VuZXJhdGVzIGEgbG9vay1hdCBtYXRyaXggd2l0aCB0aGUgZ2l2ZW4gZXllIHBvc2l0aW9uLCBmb2NhbCBwb2ludCwgYW5kIHVwIGF4aXMuXHJcbiAqIElmIHlvdSB3YW50IGEgbWF0cml4IHRoYXQgYWN0dWFsbHkgbWFrZXMgYW4gb2JqZWN0IGxvb2sgYXQgYW5vdGhlciBvYmplY3QsIHlvdSBzaG91bGQgdXNlIHRhcmdldFRvIGluc3RlYWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cclxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IGV5ZSBQb3NpdGlvbiBvZiB0aGUgdmlld2VyXHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSBjZW50ZXIgUG9pbnQgdGhlIHZpZXdlciBpcyBsb29raW5nIGF0XHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlWZWMzfSB1cCB2ZWMzIHBvaW50aW5nIHVwXHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9va0F0KG91dCwgZXllLCBjZW50ZXIsIHVwKSB7XHJcbiAgdmFyIHgwLCB4MSwgeDIsIHkwLCB5MSwgeTIsIHowLCB6MSwgejIsIGxlbjtcclxuICB2YXIgZXlleCA9IGV5ZVswXTtcclxuICB2YXIgZXlleSA9IGV5ZVsxXTtcclxuICB2YXIgZXlleiA9IGV5ZVsyXTtcclxuICB2YXIgdXB4ID0gdXBbMF07XHJcbiAgdmFyIHVweSA9IHVwWzFdO1xyXG4gIHZhciB1cHogPSB1cFsyXTtcclxuICB2YXIgY2VudGVyeCA9IGNlbnRlclswXTtcclxuICB2YXIgY2VudGVyeSA9IGNlbnRlclsxXTtcclxuICB2YXIgY2VudGVyeiA9IGNlbnRlclsyXTtcclxuXHJcbiAgaWYgKE1hdGguYWJzKGV5ZXggLSBjZW50ZXJ4KSA8IGdsTWF0cml4LkVQU0lMT04gJiYgTWF0aC5hYnMoZXlleSAtIGNlbnRlcnkpIDwgZ2xNYXRyaXguRVBTSUxPTiAmJiBNYXRoLmFicyhleWV6IC0gY2VudGVyeikgPCBnbE1hdHJpeC5FUFNJTE9OKSB7XHJcbiAgICByZXR1cm4gaWRlbnRpdHkob3V0KTtcclxuICB9XHJcblxyXG4gIHowID0gZXlleCAtIGNlbnRlcng7XHJcbiAgejEgPSBleWV5IC0gY2VudGVyeTtcclxuICB6MiA9IGV5ZXogLSBjZW50ZXJ6O1xyXG4gIGxlbiA9IDEgLyBNYXRoLmh5cG90KHowLCB6MSwgejIpO1xyXG4gIHowICo9IGxlbjtcclxuICB6MSAqPSBsZW47XHJcbiAgejIgKj0gbGVuO1xyXG4gIHgwID0gdXB5ICogejIgLSB1cHogKiB6MTtcclxuICB4MSA9IHVweiAqIHowIC0gdXB4ICogejI7XHJcbiAgeDIgPSB1cHggKiB6MSAtIHVweSAqIHowO1xyXG4gIGxlbiA9IE1hdGguaHlwb3QoeDAsIHgxLCB4Mik7XHJcblxyXG4gIGlmICghbGVuKSB7XHJcbiAgICB4MCA9IDA7XHJcbiAgICB4MSA9IDA7XHJcbiAgICB4MiA9IDA7XHJcbiAgfSBlbHNlIHtcclxuICAgIGxlbiA9IDEgLyBsZW47XHJcbiAgICB4MCAqPSBsZW47XHJcbiAgICB4MSAqPSBsZW47XHJcbiAgICB4MiAqPSBsZW47XHJcbiAgfVxyXG5cclxuICB5MCA9IHoxICogeDIgLSB6MiAqIHgxO1xyXG4gIHkxID0gejIgKiB4MCAtIHowICogeDI7XHJcbiAgeTIgPSB6MCAqIHgxIC0gejEgKiB4MDtcclxuICBsZW4gPSBNYXRoLmh5cG90KHkwLCB5MSwgeTIpO1xyXG5cclxuICBpZiAoIWxlbikge1xyXG4gICAgeTAgPSAwO1xyXG4gICAgeTEgPSAwO1xyXG4gICAgeTIgPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBsZW4gPSAxIC8gbGVuO1xyXG4gICAgeTAgKj0gbGVuO1xyXG4gICAgeTEgKj0gbGVuO1xyXG4gICAgeTIgKj0gbGVuO1xyXG4gIH1cclxuXHJcbiAgb3V0WzBdID0geDA7XHJcbiAgb3V0WzFdID0geTA7XHJcbiAgb3V0WzJdID0gejA7XHJcbiAgb3V0WzNdID0gMDtcclxuICBvdXRbNF0gPSB4MTtcclxuICBvdXRbNV0gPSB5MTtcclxuICBvdXRbNl0gPSB6MTtcclxuICBvdXRbN10gPSAwO1xyXG4gIG91dFs4XSA9IHgyO1xyXG4gIG91dFs5XSA9IHkyO1xyXG4gIG91dFsxMF0gPSB6MjtcclxuICBvdXRbMTFdID0gMDtcclxuICBvdXRbMTJdID0gLSh4MCAqIGV5ZXggKyB4MSAqIGV5ZXkgKyB4MiAqIGV5ZXopO1xyXG4gIG91dFsxM10gPSAtKHkwICogZXlleCArIHkxICogZXlleSArIHkyICogZXlleik7XHJcbiAgb3V0WzE0XSA9IC0oejAgKiBleWV4ICsgejEgKiBleWV5ICsgejIgKiBleWV6KTtcclxuICBvdXRbMTVdID0gMTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBtYXRyaXggdGhhdCBtYWtlcyBzb21ldGhpbmcgbG9vayBhdCBzb21ldGhpbmcgZWxzZS5cclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xyXG4gKiBAcGFyYW0ge1JlYWRvbmx5VmVjM30gZXllIFBvc2l0aW9uIG9mIHRoZSB2aWV3ZXJcclxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IGNlbnRlciBQb2ludCB0aGUgdmlld2VyIGlzIGxvb2tpbmcgYXRcclxuICogQHBhcmFtIHtSZWFkb25seVZlYzN9IHVwIHZlYzMgcG9pbnRpbmcgdXBcclxuICogQHJldHVybnMge21hdDR9IG91dFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0YXJnZXRUbyhvdXQsIGV5ZSwgdGFyZ2V0LCB1cCkge1xyXG4gIHZhciBleWV4ID0gZXllWzBdLFxyXG4gICAgICBleWV5ID0gZXllWzFdLFxyXG4gICAgICBleWV6ID0gZXllWzJdLFxyXG4gICAgICB1cHggPSB1cFswXSxcclxuICAgICAgdXB5ID0gdXBbMV0sXHJcbiAgICAgIHVweiA9IHVwWzJdO1xyXG4gIHZhciB6MCA9IGV5ZXggLSB0YXJnZXRbMF0sXHJcbiAgICAgIHoxID0gZXlleSAtIHRhcmdldFsxXSxcclxuICAgICAgejIgPSBleWV6IC0gdGFyZ2V0WzJdO1xyXG4gIHZhciBsZW4gPSB6MCAqIHowICsgejEgKiB6MSArIHoyICogejI7XHJcblxyXG4gIGlmIChsZW4gPiAwKSB7XHJcbiAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KGxlbik7XHJcbiAgICB6MCAqPSBsZW47XHJcbiAgICB6MSAqPSBsZW47XHJcbiAgICB6MiAqPSBsZW47XHJcbiAgfVxyXG5cclxuICB2YXIgeDAgPSB1cHkgKiB6MiAtIHVweiAqIHoxLFxyXG4gICAgICB4MSA9IHVweiAqIHowIC0gdXB4ICogejIsXHJcbiAgICAgIHgyID0gdXB4ICogejEgLSB1cHkgKiB6MDtcclxuICBsZW4gPSB4MCAqIHgwICsgeDEgKiB4MSArIHgyICogeDI7XHJcblxyXG4gIGlmIChsZW4gPiAwKSB7XHJcbiAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KGxlbik7XHJcbiAgICB4MCAqPSBsZW47XHJcbiAgICB4MSAqPSBsZW47XHJcbiAgICB4MiAqPSBsZW47XHJcbiAgfVxyXG5cclxuICBvdXRbMF0gPSB4MDtcclxuICBvdXRbMV0gPSB4MTtcclxuICBvdXRbMl0gPSB4MjtcclxuICBvdXRbM10gPSAwO1xyXG4gIG91dFs0XSA9IHoxICogeDIgLSB6MiAqIHgxO1xyXG4gIG91dFs1XSA9IHoyICogeDAgLSB6MCAqIHgyO1xyXG4gIG91dFs2XSA9IHowICogeDEgLSB6MSAqIHgwO1xyXG4gIG91dFs3XSA9IDA7XHJcbiAgb3V0WzhdID0gejA7XHJcbiAgb3V0WzldID0gejE7XHJcbiAgb3V0WzEwXSA9IHoyO1xyXG4gIG91dFsxMV0gPSAwO1xyXG4gIG91dFsxMl0gPSBleWV4O1xyXG4gIG91dFsxM10gPSBleWV5O1xyXG4gIG91dFsxNF0gPSBleWV6O1xyXG4gIG91dFsxNV0gPSAxO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBtYXQ0XHJcbiAqXHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIG1hdHJpeCB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcclxuICogQHJldHVybnMge1N0cmluZ30gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXhcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RyKGEpIHtcclxuICByZXR1cm4gXCJtYXQ0KFwiICsgYVswXSArIFwiLCBcIiArIGFbMV0gKyBcIiwgXCIgKyBhWzJdICsgXCIsIFwiICsgYVszXSArIFwiLCBcIiArIGFbNF0gKyBcIiwgXCIgKyBhWzVdICsgXCIsIFwiICsgYVs2XSArIFwiLCBcIiArIGFbN10gKyBcIiwgXCIgKyBhWzhdICsgXCIsIFwiICsgYVs5XSArIFwiLCBcIiArIGFbMTBdICsgXCIsIFwiICsgYVsxMV0gKyBcIiwgXCIgKyBhWzEyXSArIFwiLCBcIiArIGFbMTNdICsgXCIsIFwiICsgYVsxNF0gKyBcIiwgXCIgKyBhWzE1XSArIFwiKVwiO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIEZyb2Jlbml1cyBub3JtIG9mIGEgbWF0NFxyXG4gKlxyXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgbWF0cml4IHRvIGNhbGN1bGF0ZSBGcm9iZW5pdXMgbm9ybSBvZlxyXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBGcm9iZW5pdXMgbm9ybVxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmcm9iKGEpIHtcclxuICByZXR1cm4gTWF0aC5oeXBvdChhWzBdLCBhWzFdLCBhWzJdLCBhWzNdLCBhWzRdLCBhWzVdLCBhWzZdLCBhWzddLCBhWzhdLCBhWzldLCBhWzEwXSwgYVsxMV0sIGFbMTJdLCBhWzEzXSwgYVsxNF0sIGFbMTVdKTtcclxufVxyXG4vKipcclxuICogQWRkcyB0d28gbWF0NCdzXHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxyXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZChvdXQsIGEsIGIpIHtcclxuICBvdXRbMF0gPSBhWzBdICsgYlswXTtcclxuICBvdXRbMV0gPSBhWzFdICsgYlsxXTtcclxuICBvdXRbMl0gPSBhWzJdICsgYlsyXTtcclxuICBvdXRbM10gPSBhWzNdICsgYlszXTtcclxuICBvdXRbNF0gPSBhWzRdICsgYls0XTtcclxuICBvdXRbNV0gPSBhWzVdICsgYls1XTtcclxuICBvdXRbNl0gPSBhWzZdICsgYls2XTtcclxuICBvdXRbN10gPSBhWzddICsgYls3XTtcclxuICBvdXRbOF0gPSBhWzhdICsgYls4XTtcclxuICBvdXRbOV0gPSBhWzldICsgYls5XTtcclxuICBvdXRbMTBdID0gYVsxMF0gKyBiWzEwXTtcclxuICBvdXRbMTFdID0gYVsxMV0gKyBiWzExXTtcclxuICBvdXRbMTJdID0gYVsxMl0gKyBiWzEyXTtcclxuICBvdXRbMTNdID0gYVsxM10gKyBiWzEzXTtcclxuICBvdXRbMTRdID0gYVsxNF0gKyBiWzE0XTtcclxuICBvdXRbMTVdID0gYVsxNV0gKyBiWzE1XTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBTdWJ0cmFjdHMgbWF0cml4IGIgZnJvbSBtYXRyaXggYVxyXG4gKlxyXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxyXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxyXG4gKiBAcGFyYW0ge1JlYWRvbmx5TWF0NH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcclxuICogQHJldHVybnMge21hdDR9IG91dFxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdWJ0cmFjdChvdXQsIGEsIGIpIHtcclxuICBvdXRbMF0gPSBhWzBdIC0gYlswXTtcclxuICBvdXRbMV0gPSBhWzFdIC0gYlsxXTtcclxuICBvdXRbMl0gPSBhWzJdIC0gYlsyXTtcclxuICBvdXRbM10gPSBhWzNdIC0gYlszXTtcclxuICBvdXRbNF0gPSBhWzRdIC0gYls0XTtcclxuICBvdXRbNV0gPSBhWzVdIC0gYls1XTtcclxuICBvdXRbNl0gPSBhWzZdIC0gYls2XTtcclxuICBvdXRbN10gPSBhWzddIC0gYls3XTtcclxuICBvdXRbOF0gPSBhWzhdIC0gYls4XTtcclxuICBvdXRbOV0gPSBhWzldIC0gYls5XTtcclxuICBvdXRbMTBdID0gYVsxMF0gLSBiWzEwXTtcclxuICBvdXRbMTFdID0gYVsxMV0gLSBiWzExXTtcclxuICBvdXRbMTJdID0gYVsxMl0gLSBiWzEyXTtcclxuICBvdXRbMTNdID0gYVsxM10gLSBiWzEzXTtcclxuICBvdXRbMTRdID0gYVsxNF0gLSBiWzE0XTtcclxuICBvdXRbMTVdID0gYVsxNV0gLSBiWzE1XTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qKlxyXG4gKiBNdWx0aXBseSBlYWNoIGVsZW1lbnQgb2YgdGhlIG1hdHJpeCBieSBhIHNjYWxhci5cclxuICpcclxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcclxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGEgdGhlIG1hdHJpeCB0byBzY2FsZVxyXG4gKiBAcGFyYW0ge051bWJlcn0gYiBhbW91bnQgdG8gc2NhbGUgdGhlIG1hdHJpeCdzIGVsZW1lbnRzIGJ5XHJcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbXVsdGlwbHlTY2FsYXIob3V0LCBhLCBiKSB7XHJcbiAgb3V0WzBdID0gYVswXSAqIGI7XHJcbiAgb3V0WzFdID0gYVsxXSAqIGI7XHJcbiAgb3V0WzJdID0gYVsyXSAqIGI7XHJcbiAgb3V0WzNdID0gYVszXSAqIGI7XHJcbiAgb3V0WzRdID0gYVs0XSAqIGI7XHJcbiAgb3V0WzVdID0gYVs1XSAqIGI7XHJcbiAgb3V0WzZdID0gYVs2XSAqIGI7XHJcbiAgb3V0WzddID0gYVs3XSAqIGI7XHJcbiAgb3V0WzhdID0gYVs4XSAqIGI7XHJcbiAgb3V0WzldID0gYVs5XSAqIGI7XHJcbiAgb3V0WzEwXSA9IGFbMTBdICogYjtcclxuICBvdXRbMTFdID0gYVsxMV0gKiBiO1xyXG4gIG91dFsxMl0gPSBhWzEyXSAqIGI7XHJcbiAgb3V0WzEzXSA9IGFbMTNdICogYjtcclxuICBvdXRbMTRdID0gYVsxNF0gKiBiO1xyXG4gIG91dFsxNV0gPSBhWzE1XSAqIGI7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4vKipcclxuICogQWRkcyB0d28gbWF0NCdzIGFmdGVyIG11bHRpcGx5aW5nIGVhY2ggZWxlbWVudCBvZiB0aGUgc2Vjb25kIG9wZXJhbmQgYnkgYSBzY2FsYXIgdmFsdWUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxyXG4gKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgdGhlIGFtb3VudCB0byBzY2FsZSBiJ3MgZWxlbWVudHMgYnkgYmVmb3JlIGFkZGluZ1xyXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG11bHRpcGx5U2NhbGFyQW5kQWRkKG91dCwgYSwgYiwgc2NhbGUpIHtcclxuICBvdXRbMF0gPSBhWzBdICsgYlswXSAqIHNjYWxlO1xyXG4gIG91dFsxXSA9IGFbMV0gKyBiWzFdICogc2NhbGU7XHJcbiAgb3V0WzJdID0gYVsyXSArIGJbMl0gKiBzY2FsZTtcclxuICBvdXRbM10gPSBhWzNdICsgYlszXSAqIHNjYWxlO1xyXG4gIG91dFs0XSA9IGFbNF0gKyBiWzRdICogc2NhbGU7XHJcbiAgb3V0WzVdID0gYVs1XSArIGJbNV0gKiBzY2FsZTtcclxuICBvdXRbNl0gPSBhWzZdICsgYls2XSAqIHNjYWxlO1xyXG4gIG91dFs3XSA9IGFbN10gKyBiWzddICogc2NhbGU7XHJcbiAgb3V0WzhdID0gYVs4XSArIGJbOF0gKiBzY2FsZTtcclxuICBvdXRbOV0gPSBhWzldICsgYls5XSAqIHNjYWxlO1xyXG4gIG91dFsxMF0gPSBhWzEwXSArIGJbMTBdICogc2NhbGU7XHJcbiAgb3V0WzExXSA9IGFbMTFdICsgYlsxMV0gKiBzY2FsZTtcclxuICBvdXRbMTJdID0gYVsxMl0gKyBiWzEyXSAqIHNjYWxlO1xyXG4gIG91dFsxM10gPSBhWzEzXSArIGJbMTNdICogc2NhbGU7XHJcbiAgb3V0WzE0XSA9IGFbMTRdICsgYlsxNF0gKiBzY2FsZTtcclxuICBvdXRbMTVdID0gYVsxNV0gKyBiWzE1XSAqIHNjYWxlO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIG1hdHJpY2VzIGhhdmUgZXhhY3RseSB0aGUgc2FtZSBlbGVtZW50cyBpbiB0aGUgc2FtZSBwb3NpdGlvbiAod2hlbiBjb21wYXJlZCB3aXRoID09PSlcclxuICpcclxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGEgVGhlIGZpcnN0IG1hdHJpeC5cclxuICogQHBhcmFtIHtSZWFkb25seU1hdDR9IGIgVGhlIHNlY29uZCBtYXRyaXguXHJcbiAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBtYXRyaWNlcyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXhhY3RFcXVhbHMoYSwgYikge1xyXG4gIHJldHVybiBhWzBdID09PSBiWzBdICYmIGFbMV0gPT09IGJbMV0gJiYgYVsyXSA9PT0gYlsyXSAmJiBhWzNdID09PSBiWzNdICYmIGFbNF0gPT09IGJbNF0gJiYgYVs1XSA9PT0gYls1XSAmJiBhWzZdID09PSBiWzZdICYmIGFbN10gPT09IGJbN10gJiYgYVs4XSA9PT0gYls4XSAmJiBhWzldID09PSBiWzldICYmIGFbMTBdID09PSBiWzEwXSAmJiBhWzExXSA9PT0gYlsxMV0gJiYgYVsxMl0gPT09IGJbMTJdICYmIGFbMTNdID09PSBiWzEzXSAmJiBhWzE0XSA9PT0gYlsxNF0gJiYgYVsxNV0gPT09IGJbMTVdO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBtYXRyaWNlcyBoYXZlIGFwcHJveGltYXRlbHkgdGhlIHNhbWUgZWxlbWVudHMgaW4gdGhlIHNhbWUgcG9zaXRpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBhIFRoZSBmaXJzdCBtYXRyaXguXHJcbiAqIEBwYXJhbSB7UmVhZG9ubHlNYXQ0fSBiIFRoZSBzZWNvbmQgbWF0cml4LlxyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgbWF0cmljZXMgYXJlIGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XHJcbiAgdmFyIGEwID0gYVswXSxcclxuICAgICAgYTEgPSBhWzFdLFxyXG4gICAgICBhMiA9IGFbMl0sXHJcbiAgICAgIGEzID0gYVszXTtcclxuICB2YXIgYTQgPSBhWzRdLFxyXG4gICAgICBhNSA9IGFbNV0sXHJcbiAgICAgIGE2ID0gYVs2XSxcclxuICAgICAgYTcgPSBhWzddO1xyXG4gIHZhciBhOCA9IGFbOF0sXHJcbiAgICAgIGE5ID0gYVs5XSxcclxuICAgICAgYTEwID0gYVsxMF0sXHJcbiAgICAgIGExMSA9IGFbMTFdO1xyXG4gIHZhciBhMTIgPSBhWzEyXSxcclxuICAgICAgYTEzID0gYVsxM10sXHJcbiAgICAgIGExNCA9IGFbMTRdLFxyXG4gICAgICBhMTUgPSBhWzE1XTtcclxuICB2YXIgYjAgPSBiWzBdLFxyXG4gICAgICBiMSA9IGJbMV0sXHJcbiAgICAgIGIyID0gYlsyXSxcclxuICAgICAgYjMgPSBiWzNdO1xyXG4gIHZhciBiNCA9IGJbNF0sXHJcbiAgICAgIGI1ID0gYls1XSxcclxuICAgICAgYjYgPSBiWzZdLFxyXG4gICAgICBiNyA9IGJbN107XHJcbiAgdmFyIGI4ID0gYls4XSxcclxuICAgICAgYjkgPSBiWzldLFxyXG4gICAgICBiMTAgPSBiWzEwXSxcclxuICAgICAgYjExID0gYlsxMV07XHJcbiAgdmFyIGIxMiA9IGJbMTJdLFxyXG4gICAgICBiMTMgPSBiWzEzXSxcclxuICAgICAgYjE0ID0gYlsxNF0sXHJcbiAgICAgIGIxNSA9IGJbMTVdO1xyXG4gIHJldHVybiBNYXRoLmFicyhhMCAtIGIwKSA8PSBnbE1hdHJpeC5FUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMCksIE1hdGguYWJzKGIwKSkgJiYgTWF0aC5hYnMoYTEgLSBiMSkgPD0gZ2xNYXRyaXguRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTEpLCBNYXRoLmFicyhiMSkpICYmIE1hdGguYWJzKGEyIC0gYjIpIDw9IGdsTWF0cml4LkVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEyKSwgTWF0aC5hYnMoYjIpKSAmJiBNYXRoLmFicyhhMyAtIGIzKSA8PSBnbE1hdHJpeC5FUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMyksIE1hdGguYWJzKGIzKSkgJiYgTWF0aC5hYnMoYTQgLSBiNCkgPD0gZ2xNYXRyaXguRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTQpLCBNYXRoLmFicyhiNCkpICYmIE1hdGguYWJzKGE1IC0gYjUpIDw9IGdsTWF0cml4LkVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGE1KSwgTWF0aC5hYnMoYjUpKSAmJiBNYXRoLmFicyhhNiAtIGI2KSA8PSBnbE1hdHJpeC5FUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhNiksIE1hdGguYWJzKGI2KSkgJiYgTWF0aC5hYnMoYTcgLSBiNykgPD0gZ2xNYXRyaXguRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTcpLCBNYXRoLmFicyhiNykpICYmIE1hdGguYWJzKGE4IC0gYjgpIDw9IGdsTWF0cml4LkVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGE4KSwgTWF0aC5hYnMoYjgpKSAmJiBNYXRoLmFicyhhOSAtIGI5KSA8PSBnbE1hdHJpeC5FUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhOSksIE1hdGguYWJzKGI5KSkgJiYgTWF0aC5hYnMoYTEwIC0gYjEwKSA8PSBnbE1hdHJpeC5FUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMTApLCBNYXRoLmFicyhiMTApKSAmJiBNYXRoLmFicyhhMTEgLSBiMTEpIDw9IGdsTWF0cml4LkVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGExMSksIE1hdGguYWJzKGIxMSkpICYmIE1hdGguYWJzKGExMiAtIGIxMikgPD0gZ2xNYXRyaXguRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTEyKSwgTWF0aC5hYnMoYjEyKSkgJiYgTWF0aC5hYnMoYTEzIC0gYjEzKSA8PSBnbE1hdHJpeC5FUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMTMpLCBNYXRoLmFicyhiMTMpKSAmJiBNYXRoLmFicyhhMTQgLSBiMTQpIDw9IGdsTWF0cml4LkVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGExNCksIE1hdGguYWJzKGIxNCkpICYmIE1hdGguYWJzKGExNSAtIGIxNSkgPD0gZ2xNYXRyaXguRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTE1KSwgTWF0aC5hYnMoYjE1KSk7XHJcbn1cclxuLyoqXHJcbiAqIEFsaWFzIGZvciB7QGxpbmsgbWF0NC5tdWx0aXBseX1cclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5cclxuZXhwb3J0IHZhciBtdWwgPSBtdWx0aXBseTtcclxuLyoqXHJcbiAqIEFsaWFzIGZvciB7QGxpbmsgbWF0NC5zdWJ0cmFjdH1cclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5cclxuZXhwb3J0IHZhciBzdWIgPSBzdWJ0cmFjdDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9