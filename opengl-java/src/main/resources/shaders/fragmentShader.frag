#version 150

in vec2 pass_texture_coords;
in vec3 surfaceNormal;
in vec3 toLightVector;
in vec3 toCameraVector;

out vec4 out_Color;

uniform sampler2D textureSampler;
uniform vec3 lightColor;
uniform float shineDamper;
uniform float reflectivity;
uniform float dissolvePercent;

uniform sampler2D dissolveMap;

void main(void){
	vec3 unitNormal = normalize(surfaceNormal);
	vec3 unitLightVector = normalize(toLightVector);
	vec3 unitVectorToCamera = normalize(toCameraVector);

	float brightness = dot(unitNormal, unitLightVector);
	brightness = max(brightness, 0.2);
	vec3 diffuse = brightness * lightColor;

	vec3 lightDirection = -unitLightVector;
	vec3 reflectedLightDirection = reflect(lightDirection, unitNormal);
	float specularFactor = dot(reflectedLightDirection, unitVectorToCamera);
	specularFactor = max(specularFactor, 0.0);
	float dampedFactor = pow(specularFactor, shineDamper);
	vec3 finalSpecular = dampedFactor * reflectivity * lightColor;

	vec4 textureColor = texture(textureSampler, pass_texture_coords);
	vec2 dissolveMapColor = texture(dissolveMap, pass_texture_coords).rg;
	if (dissolveMapColor.r < dissolvePercent) {
		discard;
	}

	out_Color = vec4(diffuse, 1.0) * textureColor + vec4(finalSpecular, 1.0);
}