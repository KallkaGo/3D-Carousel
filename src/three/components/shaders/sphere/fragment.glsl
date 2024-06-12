varying vec2 vUv;
uniform float uOpacity;
void main() {
  float dis = distance(vUv, vec2(0.5, 0.5));
  float alpha = smoothstep(.46, .48, dis);
  alpha * = 1. - smoothstep(.49, .5, dis);
  gl_FragColor = vec4(vec2(vUv), 1.0, alpha * .7);
  gl_FragColor = vec4(vec2(vUv), 1.0, alpha *uOpacity);
  #include <tonemapping_fragment>
	#include <colorspace_fragment>
}