# Web graphing calculator for multidimensional analysis

Made with ts, webgl and canvas

## Functions

| Name | Description | Min num args | Args | Args dimension | Aliases |
|---|---|---|---|---|---|
`Level` | Displays the levels of a scalar set | 1 | set, (level subdivisions) | 2 | `Niveau` |
`Gradient` | Same as Level but with a blended color gradient | 1 | set | 2 | |
`VectorField` | Displays the vectors of a vector field | 2 | y, y | 1 | |
`Circle` | Displays a circle shape | 3 | x, y, rad, (fill) | 1 | |
`Point` | Displays a point shape | 2 | x, y | 1 | |
`Polar` | Converts coordinates from cartesian to polar | 1 | set | 2 | `Pol` |
`Cartesian` | Converts coordinates from polar to cartesian | 1 | set | 2 | `Cart` |
`Series` | Iterates a series based on an expression and returns the final value | 3 | start, steps, expression | 1/complex | |
`DivSeries` | Iterates a divergent series up to a threshhold and returns the number of iterations up until divergence | 4 | start, steps, threshhold, expression | 1/complex | |
`Mag` | Magnitude of a complex number | 1 | number | complex | |

## Base functions

| Name | Description | Num args | Aliases |
|---|---|---|---|
| `mod` | Modulo | 1 | `%` |
| `sqrt` | Square root | 1 | |
| `exp` | Exponential | 1 | |
| `log` | Natural logarithm | 1 | `ln` |
| `sin` | Sine | 1 | |
| `cos` | Cosine | 1 | |
| `tan` | Tangent | 1 | |
| `asin` | Arcus sine | 1 | `arcsin` |
| `acos` | Arcus cosine | 1 | `arccos` |
| `atan` | Arcus tangent | 1 | `arctan` |
| `sinh` | Hyperbolic sine | 1 | |
| `cosh` | Hyperbolic cosine | 1 | |
| `tanh` | Hyperbolic tangent | 1 | |
| `floor` | Floor | 1 | |
| `min` | Minimum | 2 | |
| `max` | Maximum | 2 | |
| `abs` | Absolute value | 1 | |
| `factorial` | Factorial | 1 | `fact` |
| `sigmoid` | Sigmoid | 1 | |
| `random` | Random number up to | 1 | `rand` |
| `noise` | jo | 1 | `perlin` |

## Base operators



## Constants

| Name | Aliases |
|---|---|
`pi` | `Pi` |
`e` | |
`true` | 1 |
`false` | 0 |

## Variables

Name | Description |
|---|---|
`x` | First dimension variable |
`y` | Second dimension variable |
`t` | Frame time |
`k` | Iterator for series |
`mouseX` | X position of the mouse |
`mouseY` | Y position of the mouse |
`scale` | Scale of the graph grid |
`grid` | Turn grid on or off |
`offset` | Set viewport xy offset
