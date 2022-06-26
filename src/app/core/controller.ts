import { scheduleRedraw } from '../../index'
import { canvasDrawFunction } from '../canvas/canvasCore'
import { PlotDisplayMode, PlotDriver, PlotStatus } from '../defines'
import { Error } from '../lang/lexer'
import { ASTNode, parse, parserGetDisplayMode, parserGetError, parserGetNumVars } from '../lang/parser'
import { inputSetColorAt, inputSetConstEvalAt, inputSetDriverAt, inputSetErrorAt, inputSetStatusAt } from '../ui/leftPanel'
import { constantEval, constantEvalGetError } from './constantEval'

type Plot = {
    input: string,
    inputChanged: boolean,
    ast: ASTNode | null,
    status: PlotStatus,
    driver: PlotDriver,
    displayMode: PlotDisplayMode,
    color: string,
    error: string,
}

const plots: Plot[] = []
let numInputs = 0

export const setInputAt = (index: number, value: string): void => {
    if (index < 0 || index > numInputs) {
        return
    }

    plots[index].input = value
    plots[index].inputChanged = true
    scheduleRedraw()
}

export const setNumInputs = (num: number): void => {
    numInputs = num
    for (let i = numInputs; i < plots.length; i++) {
        delete plots[i]
    }
    scheduleRedraw()
}

export const resetPlots = (): void => {
    plots.length = 0
    scheduleRedraw()
}

const colors: string[] = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
const getColorFromIndex = (index: number): string => colors[index % colors.length]

export const drivePlots = (): void => {
    for (let i = 1; i <= numInputs; i++) {
        // Init plot
        if (!plots[i]) {
            plots[i] = {
                input: '',
                inputChanged: false,
                ast: null,
                status: PlotStatus.PENDING,
                driver: PlotDriver.CANVAS,
                displayMode: PlotDisplayMode.NONE,
                color: getColorFromIndex(i),
                error: ''
            }
            inputSetColorAt(i, plots[i].color)
        }
        
        const plot = plots[i]

        if (plot.inputChanged) {
            plot.inputChanged = false
            const statusBefore = plot.status

            // Check empty input
            if (plot.input.trim().length === 0) {
                plot.status = PlotStatus.PENDING
                plot.ast = null

                if (statusBefore !== plot.status) {
                    inputSetStatusAt(i, plot.status)
                }
                scheduleRedraw()
                continue
            }

            // Parse input
            const astBefore = plot.ast
            plot.ast = parse(plot.input)
            console.debug('Parsed AST:', plot.ast)

            // Check status
            const errorBefore = plot.error
            const parserError: Error | null = parserGetError()
            if (parserError) {
                plot.status = PlotStatus.ERROR
                plot.error = parserError.desc
            } else {
                plot.status = PlotStatus.ACTIVE
                plot.error = ''
            }
            if (plot.status !== statusBefore) {
                inputSetStatusAt(i, plot.status)
            }
            if (plot.error !== errorBefore) {
                inputSetErrorAt(i, plot.error)
            }

            // Redraw
            if (JSON.stringify(astBefore) !== JSON.stringify(plot.ast)) {
                scheduleRedraw()
            }

            // Check driver
            const numVars = parserGetNumVars()
            const driverBefore = plot.driver
            switch (numVars) {
                case 0: plot.driver = PlotDriver.CONSTANT; break
                case 1: plot.driver = PlotDriver.CANVAS; break
                case 2: plot.driver = PlotDriver.WEBGL; break
            }
            if (plot.driver !== driverBefore) {
                inputSetDriverAt(i, plot.driver)
            }

            // Check process mode
            plot.displayMode = parserGetDisplayMode()
        }
    }
}

export const drawPlots = (): void => {
    for (let i = 1; i <= numInputs; i++) {
        const plot = plots[i]
        if (!plot) continue
        
        if (plot.status !== PlotStatus.ACTIVE) continue

        switch (plot.driver) {
            case PlotDriver.CONSTANT: {
                const result = constantEval(plot.ast)
                inputSetConstEvalAt(i, result)

                const constEvalError = constantEvalGetError()
                if (constEvalError) {
                    plot.status = PlotStatus.ERROR
                    plot.error = constEvalError
                    inputSetStatusAt(i, plot.status)
                    inputSetErrorAt(i, plot.error)
                }
                break
            }
            case PlotDriver.CANVAS: {
                canvasDrawFunction(plot.ast, plot.color)

                const constEvalError = constantEvalGetError()
                if (constEvalError) {
                    plot.status = PlotStatus.ERROR
                    plot.error = constEvalError
                    inputSetStatusAt(i, plot.status)
                    inputSetErrorAt(i, plot.error)
                }
                break
            }
            case PlotDriver.WEBGL:
                // webGLDriver(plot.ast, plot.color, plot.displayMode)
                break
        }
    }
}
