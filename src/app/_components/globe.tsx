import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";
import { LocationData } from "../types";
import { createDotMaterial, generateGlobeDots } from "../utils/globeUtils";

const latLongToVector3 = (
  lat: number,
  long: number,
  radius: number
): THREE.Vector3 => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((long + 180) * Math.PI) / 180;

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
};

interface GlobeProps {
  onLocationLoad?: (locations: LocationData[]) => void;
  onLocationHover?: (locationId: string | null) => void;
  hoveredLocationId?: string | null;
}

export interface GlobeRef {
  focusLocation: (lat: number, long: number) => void;
}

const locations: LocationData[] = [
  { id: "1", lat: 40.7128, long: -74.006, name: "New York, US" },
  { id: "2", lat: 48.8566, long: 2.3522, name: "Paris, FR" },
  { id: "3", lat: 51.5074, long: -0.1278, name: "London, UK" },
  { id: "4", lat: 35.6762, long: 139.6503, name: "Tokyo, JP" },
  { id: "5", lat: -33.8688, long: 151.2093, name: "Sydney, AU" },
];

export const Globe = forwardRef<GlobeRef, GlobeProps>(
  ({ onLocationLoad, onLocationHover, hoveredLocationId }, ref) => {
    const globeRef = useRef<THREE.Mesh>(null);
    const dotsGroup = useRef<THREE.Group>(null);
    const locationsGroup = useRef<THREE.Group>(null);
    const targetRotation = useRef<{
      longitude: number;
      isAnimating: boolean;
    } | null>(null);
    const materials = useRef<THREE.ShaderMaterial[]>([]);
    const currentRotation = useRef(0);

    useImperativeHandle(ref, () => ({
      focusLocation: (lat: number, long: number) => {
        if (globeRef.current) {
          // Normalize the target longitude to be between -180 and 180
          const normalizedLong = ((long + 180) % 360) - 180;
          targetRotation.current = {
            longitude: normalizedLong,
            isAnimating: true,
          };
        }
      },
    }));

    useEffect(() => {
      if (dotsGroup.current) {
        const dotMaterial = createDotMaterial();
        generateGlobeDots(dotsGroup.current, materials.current, dotMaterial);
      }
    }, []);

    useFrame(() => {
      if (globeRef.current && dotsGroup.current && locationsGroup.current) {
        if (targetRotation.current?.isAnimating) {
          // Get current rotation in radians
          const currentAngle = currentRotation.current;

          // Convert target longitude to radians
          const targetAngle =
            (targetRotation.current.longitude * Math.PI) / 180;

          // Calculate the shortest path
          let deltaAngle = targetAngle - currentAngle;

          // Normalize the rotation to take the shortest path
          if (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
          if (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

          // Smooth rotation with easing
          const step = deltaAngle * 0.08;

          // Update current rotation
          currentRotation.current += step;

          // Normalize current rotation
          if (currentRotation.current > Math.PI)
            currentRotation.current -= Math.PI * 2;
          if (currentRotation.current < -Math.PI)
            currentRotation.current += Math.PI * 2;

          // Create rotation matrix
          const rotation = new THREE.Matrix4().makeRotationY(
            currentRotation.current
          );

          // Apply rotation to all groups
          globeRef.current.setRotationFromMatrix(rotation);
          dotsGroup.current.setRotationFromMatrix(rotation);
          locationsGroup.current.setRotationFromMatrix(rotation);

          // Check if we're close enough to target
          if (Math.abs(deltaAngle) < 0.01) {
            targetRotation.current.isAnimating = false;
          }
        }

        materials.current.forEach((mat) => {
          mat.uniforms.u_time.value += 0.03;
        });
      }
    });

    useEffect(() => {
      onLocationLoad?.(locations);
    }, [onLocationLoad]);

    return (
      <>
        <pointLight
          position={[-50, 0, 60]}
          intensity={17}
          color="#081b26"
          distance={200}
        />
        <hemisphereLight args={[0xffffbb, 0x080820, 1.5]} />

        <Sphere ref={globeRef} args={[19.5, 35, 35]}>
          <meshStandardMaterial
            color="#0b2636"
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </Sphere>

        <group ref={dotsGroup} />

        <group ref={locationsGroup}>
          {locations.map((location) => {
            const position = latLongToVector3(location.lat, location.long, 20);
            const isHovered = hoveredLocationId === location.id;
            return (
              <mesh
                key={location.id}
                position={position}
                onPointerOver={() => onLocationHover?.(location.id)}
                onPointerOut={() => onLocationHover?.(null)}
              >
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial
                  color={isHovered ? "#10b981" : "#4f46e5"}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            );
          })}
        </group>
      </>
    );
  }
);

Globe.displayName = "Globe";
