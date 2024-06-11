varying vec2 vUv;
uniform float uTime;

const float PI = 3.14159265359;

void main() {
  vec3 p = position;
  /* float */
  p.y += sin(uTime) * .1;

  /* distort */
  p.y += sin(PI * uv.x) * .05;
  p.z += sin(PI * uv.x) * .1;
  vec4 modelPosition = modelMatrix * vec4(p, 1.);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;
  vUv = uv;
}
