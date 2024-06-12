uniform sampler2D uDiffuse;
uniform float uDisCenter;
varying vec2 vUv;

vec3 grayscale(vec3 color) {
  return vec3(color.r * 0.3 + color.g * 0.59 + color.b * 0.11);
}

void main() {
  vec4 diffuseColor = texture2D(uDiffuse, vUv);

  float alpha = clamp(uDisCenter, .2, 1.);

  vec4 col = vec4(diffuseColor.rgb, alpha);

  vec4 blackColor = vec4(grayscale(diffuseColor.rgb), alpha);

  vec4 finColor = mix(col, blackColor, 1. - uDisCenter);

  gl_FragColor = finColor;

  #include <tonemapping_fragment>
	#include <colorspace_fragment>
}