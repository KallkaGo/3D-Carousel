varying vec2 vUv;
uniform float uTime;
uniform float uDisCenter;
uniform vec2 uHoverUv;
uniform float uHoverState;
const float PI = 3.14159265359;

void main() {
  vec2 uv2 = uv;
  vec3 p = position;
  float dis = distance(uv, uHoverUv);

  /* float */
  p.y += sin(uTime) * .05;
  p.z += 10. * sin(10. * dis + uTime) * uHoverState;
  /* distort */
  p.y += sin(PI * uv.x) * .05;
  p.z += sin(PI * uv.x) * .1;

  /* scale */
  // p *= (1. + .2 * uDisCenter);
  // uv2 = uv2 * 2. - 1.;
  // uv2 *= (1. + .2 * uDisCenter) * .6;
  // uv2 = (uv2 + 1.) * .5;

  vec4 modelPosition = modelMatrix * vec4(p, 1.);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;
  vUv = uv2;
}
