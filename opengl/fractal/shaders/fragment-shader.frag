precision mediump float;

varying vec2 v_coordinates;

uniform float u_distance;
uniform sampler2D u_palette;
const float INV_PALETTE_WIDTH = 1.0 / 128.0;

uniform int u_depth;
uniform vec2 u_translation;
uniform vec2 u_scale;
uniform vec2 u_c;

vec2 f(vec2 z) {
    return vec2(z.x * z.x - z.y * z.y + u_c.x, z.x * z.y + + z.x * z.y + u_c.y);
}

void main() {
    vec2 z = vec2(v_coordinates.x / u_scale.x, v_coordinates.y / u_scale.y);
    z = z + u_translation;
    bool isSet = false;
    int nIterations = 0;

    const int MAX_ITERATIONS = 300;
    for (int i = 1; i <= MAX_ITERATIONS; i++) {
        if (i > u_depth) {
            break;
        }
        if (!isSet) {
            z = f(z);
        }
        if ((length(z) > u_distance) && !isSet) {
            nIterations = i;
            isSet = true;
        }
    }

    float k = float(nIterations) * INV_PALETTE_WIDTH;
    gl_FragColor = texture2D(u_palette, vec2(k + 0.5 * INV_PALETTE_WIDTH, 0.5));
}
