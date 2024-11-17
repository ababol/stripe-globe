import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Globe, GlobeRef } from "./globe";
import { OrbitControls } from "@react-three/drei";
import { Transaction, LocationData } from "../types";

interface GlobeContainerProps {
  onLocationsLoad?: (locations: LocationData[]) => void;
  onLocationHover?: (locationId: string | null) => void;
  hoveredLocationId?: string | null;
  focusedTransaction?: Transaction;
}

export function GlobeContainer({
  onLocationsLoad,
  focusedTransaction,
  onLocationHover,
  hoveredLocationId,
}: GlobeContainerProps) {
  const globeRef = useRef<GlobeRef>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  React.useEffect(() => {
    if (focusedTransaction?.coordinates && globeRef.current) {
      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }

      globeRef.current.focusLocation(
        focusedTransaction.coordinates.lat,
        focusedTransaction.coordinates.long
      );

      setTimeout(() => {
        if (controlsRef.current) {
          controlsRef.current.autoRotate = true;
        }
      }, 1000);
    }
  }, [focusedTransaction]);

  return (
    <div className="w-[800px] h-[800px]">
      <Canvas camera={{ position: [0, 20, 100], fov: 30 }}>
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
          enableDamping={true}
          // Allow full vertical rotation
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          enableRotate={true}
          rotateSpeed={0.5}
          target={[0, 0, 0]}
        />
        <Globe
          ref={globeRef}
          onLocationLoad={onLocationsLoad}
          onLocationHover={onLocationHover}
          hoveredLocationId={hoveredLocationId}
        />
      </Canvas>
    </div>
  );
}
