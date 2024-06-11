uniform sampler2D uDiffuse;
varying vec2 vUv;
void main() {
  vec4 diffuseColor = texture2D(uDiffuse, vUv);
  gl_FragColor = diffuseColor;
}