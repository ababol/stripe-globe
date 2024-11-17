import * as THREE from 'three';

const vertex = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform float u_time;
  uniform float u_maxExtrusion;

  void main() {
    vec3 newPosition = position;
    if(u_maxExtrusion > 1.0) newPosition.xyz = newPosition.xyz * u_maxExtrusion + sin(u_time);
    else newPosition.xyz = newPosition.xyz * u_maxExtrusion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragment = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform float u_time;

  vec3 colorA = vec3(0.196, 0.631, 0.886);
  vec3 colorB = vec3(0.192, 0.384, 0.498);

  void main() {
    vec3 color = mix(colorA, colorB, abs(sin(u_time)));
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createDotMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 1.0 },
      u_maxExtrusion: { value: 1.0 }
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
    transparent: true
  });
}

function calcPosFromLatLonRad(lon: number, lat: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export async function generateGlobeDots(
  group: THREE.Group,
  materials: THREE.ShaderMaterial[],
  baseMaterial: THREE.ShaderMaterial
): Promise<void> {
  const response = await fetch('https://raw.githubusercontent.com/jessehhydee/threejs-globe/main/img/world_alpha_mini.jpg');
  const blob = await response.blob();
  const imageBitmap = await createImageBitmap(blob);
  
  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(imageBitmap, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const activeLatLon: { [key: number]: number[] } = {};
  const radius = 20;
  const dotDensity = 2.5;

  // Process image data
  for (let y = 0; y < imageBitmap.height; y++) {
    const lat = 90 - (y * 180 / imageBitmap.height);
    activeLatLon[lat] = [];

    for (let x = 0; x < imageBitmap.width; x++) {
      const i = (y * imageBitmap.width + x) * 4;
      const lon = -180 + (x * 360 / imageBitmap.width);

      if (data[i] < 80 && data[i + 1] < 80 && data[i + 2] < 80) {
        activeLatLon[lat].push(lon);
      }
    }
  }

  // Generate dots
  for (let lat = 90; lat > -90; lat--) {
    const r = Math.cos(Math.abs(lat) * (Math.PI / 180)) * radius;
    const circumference = r * Math.PI * 2;
    const dotsForLat = circumference * dotDensity;

    for (let x = 0; x < dotsForLat; x++) {
      const lon = -180 + (x * 360 / dotsForLat);
      
      // Check if point should be visible
      const roundedLat = Math.round(lat);
      if (!activeLatLon[roundedLat]?.some(activeLon => Math.abs(activeLon - lon) < 0.5)) {
        continue;
      }

      const position = calcPosFromLatLonRad(lon, lat, radius);
      
      const dotGeometry = new THREE.CircleGeometry(0.1, 5);
      dotGeometry.lookAt(position);
      dotGeometry.translate(position.x, position.y, position.z);

      const material = baseMaterial.clone();
      material.uniforms.u_time.value = Math.random();
      materials.push(material);

      const mesh = new THREE.Mesh(dotGeometry, material);
      group.add(mesh);
    }
  }
}