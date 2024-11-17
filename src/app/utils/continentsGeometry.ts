import * as THREE from 'three';

// This is a simplified low-poly geometry of continents
const positions = new Float32Array([
  // North America
  -0.35, 0.4, 0.8,
  -0.5, 0.6, 0.6,
  -0.7, 0.4, 0.5,
  -0.35, 0.4, 0.8,
  -0.7, 0.4, 0.5,
  -0.6, 0.2, 0.7,

  // South America
  -0.3, -0.2, 0.9,
  -0.4, -0.4, 0.8,
  -0.2, -0.6, 0.7,
  -0.3, -0.2, 0.9,
  -0.2, -0.6, 0.7,
  -0.1, -0.3, 0.9,

  // Europe
  0.3, 0.6, 0.7,
  0.1, 0.7, 0.6,
  0.4, 0.5, 0.7,
  0.3, 0.6, 0.7,
  0.4, 0.5, 0.7,
  0.5, 0.4, 0.7,

  // Africa
  0.2, 0.1, 0.9,
  0.1, -0.2, 0.9,
  0.4, -0.1, 0.8,
  0.2, 0.1, 0.9,
  0.4, -0.1, 0.8,
  0.5, 0.2, 0.8,

  // Asia
  0.7, 0.4, 0.5,
  0.6, 0.6, 0.4,
  0.8, 0.5, 0.2,
  0.7, 0.4, 0.5,
  0.8, 0.5, 0.2,
  0.9, 0.3, 0.3,

  // Australia
  0.8, -0.4, 0.4,
  0.7, -0.5, 0.5,
  0.9, -0.3, 0.3,
  0.8, -0.4, 0.4,
  0.9, -0.3, 0.3,
  1.0, -0.2, 0.2
]);

// Calculate normals
const normals = new Float32Array(positions.length);
for (let i = 0; i < positions.length; i += 3) {
  const x = positions[i];
  const y = positions[i + 1];
  const z = positions[i + 2];
  const length = Math.sqrt(x * x + y * y + z * z);
  
  normals[i] = x / length;
  normals[i + 1] = y / length;
  normals[i + 2] = z / length;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

export const continentsGeometry = geometry;