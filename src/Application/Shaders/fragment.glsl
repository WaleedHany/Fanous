varying vec3 vertexNormal;
varying vec3 vPositionNormal;
uniform vec4 uColor; 

uniform float glowStrength;
uniform float fadeDegree;

void main()
{
   float intensity = pow(abs(dot(normalize(vertexNormal), normalize(vPositionNormal))), fadeDegree); 
  //float intensity = 1.0 / (1.0 + exp(-fadeDegree * (dot(normalize(vertexNormal), normalize(vPositionNormal)) - 0.5)));
  //float intensity = exp(-fadeDegree * (1.0 - abs(dot(normalize(vertexNormal), normalize(vPositionNormal)))));
  intensity = smoothstep(0.0, 1.0, intensity) * glowStrength;
  gl_FragColor = uColor * intensity;
}  