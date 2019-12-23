#version 400 core

in vec4 clipSpace;
in vec2 textureCoords;

out vec4 out_Color;

uniform sampler2D reflectionTexture;
uniform sampler2D dudvMap;

uniform float moveFactor;

const float waveStrength = 0.01;

void main(void) {

	vec2 ndc = (clipSpace.xy / clipSpace.w) / 2.0 + 0.5;
	vec2 reflectTexCoords = vec2(ndc.x, -ndc.y);

	vec2 distortion1 = (texture(dudvMap, vec2(textureCoords.x + moveFactor, textureCoords.y)).rg * 2.0 - 1.0) * waveStrength;
	vec2 distortion2 = (texture(dudvMap, vec2(-textureCoords.x, textureCoords.y + moveFactor)).rg * 2.0 - 1.0) * waveStrength;

	vec2 distortion = distortion1 + distortion2;

	reflectTexCoords += distortion;
	reflectTexCoords.x = clamp(reflectTexCoords.x, 0.001, 0.999);
	reflectTexCoords.y = clamp(reflectTexCoords.y, -0.999, -0.001);

	vec4 reflectColor = texture(reflectionTexture, reflectTexCoords);

	out_Color = reflectColor;
	out_Color = mix(out_Color, vec4(0.0, 0.3, 0.5, 1.0), 0.2);

}