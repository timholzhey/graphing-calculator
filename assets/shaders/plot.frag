#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795
#define INFINITY 1e8
#define SHAPE_THICKNESS 2.5

#define DISPLAY_MODE_SET				3
#define DISPLAY_MODE_LEVEL_SET			4

// Inline assign
#define ASSIGNF(x,y)			((x = y) > 0.0 ? 0.0 : 0.0)
#define POLAR					(ASSIGNF(x,polar.x) + ASSIGNF(y,polar.y))
#define CARTESIAN				(ASSIGNF(x,cartesian.x) + ASSIGNF(y,cartesian.y))

// User supplied functions
#define NUM_USER_FX		USER_NUM_FUNC_INJ
#define USER_COL		USER_COL_INJ
#define USER_DISP		USER_DISP_INJ

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_domain_x;
uniform vec2 u_domain_y;
uniform float u_time;
uniform float u_deviation;
uniform int u_display_mode;

out vec4 fragColor;

// 2D Random
float random(in vec2 st) {
	return fract(sin(dot(st.xy,
			vec2(12.9898,78.233)))
			* 43758.5453123);
}

// 1D Random
float random(in float st) {
    return fract(sin(st) * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// 1D Noise
float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noise(float x) {
	float i = floor(x);
	float f = fract(x);
	float u = f * f * (3.0 - 2.0 * f);
	return mix(hash(i), hash(i + 1.0), u);
}

#define factorial01(x) (((((0.07288448978215456 * x - 0.31390051543712616) * x + 0.6538907084614038) * x - 0.810425715520978) * x + 0.9737655441276729) * x - 0.5761851668648887) * x + 0.9999830044034752
float factorial(in float x) {
	float h = floor(x), f = x - h, y = factorial01(f);
	if (x < 0.0) for (float n=0.0; n < -h; n++) y /= f - n;
	else for (float n=1.0; n < h + 1.0; n++) y *= f + n;
	return x > 0.0 ? y : INFINITY;
}

// Shapes
float circle(float x, float y, float d, float r) {
	return (x*x + y*y <= (r+d*SHAPE_THICKNESS)*(r+d*SHAPE_THICKNESS) && x*x + y*y >= (r-d*SHAPE_THICKNESS)*(r-d*SHAPE_THICKNESS)) ? 1.0 : 0.0;
}

float circle(float x, float y, float d, float dx, float dy, float r) {
	return ((x-dx)*(x-dx) + (y-dy)*(y-dy) <= (r+d*SHAPE_THICKNESS)*(r+d*SHAPE_THICKNESS) && (x-dx)*(x-dx) + (y-dy)*(y-dy) >= (r-d*SHAPE_THICKNESS)*(r-d*SHAPE_THICKNESS)) ? 1.0 : 0.0;
}

float circle(float x, float y, float d, float dx, float dy, float r, float fill) {
	return ((x-dx)*(x-dx) + (y-dy)*(y-dy) <= r*r ? 1.0 : 0.0) * fill;
}

float point(float x, float y, float d, float dx, float dy) {
	return (x-dx)*(x-dx) + (y-dy)*(y-dy) <= d/SHAPE_THICKNESS ? 1.0 : 0.0;
}

// Conversions
// To bol
bool tob(float x) {
	return x > 0.0;
}

// To float
float tof(bool x) {
	return x ? 1.0 : 0.0;
}

vec3 randomColor(float idx){
	return vec3(random(idx), random(idx + 1.), random(idx + 2.));
}

vec2 toPol(float x, float y) {
	return vec2(sqrt(x*x + y*y), atan(y, x));
}

vec2 toCart(float r, float theta) {
	return vec2(r * cos(theta), r * sin(theta));
}

float level = 1.0;
vec3 levelset(float f) {
	vec3 color = randomColor(floor(f * level));
	return color;
}

float f_x(int i, float x, float y, float t, float d, float mx, float my) {
	float undefined = 0.0;
	vec2 polar = toCart(x, y);
	vec2 cartesian = toPol(x, y);
	float result[NUM_USER_FX] = USER_FUNC_INJ;
	return result[i];
}

void main() {
	vec2 coordNorm = gl_FragCoord.xy / u_resolution;
	vec2 mouseNorm = u_mouse / u_resolution;
	vec3 color = vec3(0.1, 0.5, 0.9);
	float f;
	float t = u_time;
	float x = coordNorm.x * (u_domain_x[1] - u_domain_x[0]) + u_domain_x[0];
	float y = coordNorm.y * (u_domain_y[1] - u_domain_y[0]) + u_domain_y[0];
	float d = u_deviation * (u_domain_y[1] - u_domain_y[0]) / 10.0;
	float mx = mouseNorm.x * (u_domain_x[1] - u_domain_x[0]) + u_domain_x[0];
	// Mouse y is reversed
	float my = (1.0 - mouseNorm.y) * (u_domain_y[1] - u_domain_y[0]) + u_domain_y[0];

	int display_modes[] = USER_DISP;

	for (int i = 0; i < NUM_USER_FX - 1; i++) {
		if (display_modes[i] == DISPLAY_MODE_SET) {
			d = u_deviation * (u_domain_x[1] - u_domain_x[0]) / 8.0;
			f = min(f_x(i, x, y, t, d, mx, my), 1.0);
			fragColor += vec4(f * color, f);
		} else if (display_modes[i] == DISPLAY_MODE_LEVEL_SET) {
			f = f_x(i, x, y, t, d, mx, my);
			vec3 l = levelset(f);
			fragColor += vec4(l * color, 1.0);
		} else {
			fragColor = vec4(1.0, 0.0, 0.0, 1.0);
		}
	}
}
