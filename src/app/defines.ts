export enum PlotDisplayMode {
    NONE,
    CONSTANT_EVAL,
    FUNCTION_GRAPH,
    SET,
    LEVEL_SET,
    VECTOR_FIELD
}

export enum PlotStatus {
    PENDING,
    ACTIVE,
    ERROR
}

export enum PlotDriver {
    CONSTANT,
    CANVAS,
    WEBGL
}
