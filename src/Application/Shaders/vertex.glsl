varying vec3 vertexNormal;
varying vec3 vPositionNormal; 

void main()
{
    vertexNormal = normalize(normalMatrix * normal);
    vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}