import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function CyberGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (gridRef.current) {
      const material = gridRef.current.material as THREE.LineBasicMaterial;
      if (material) {
        material.opacity = 0.22 + Math.sin(t * 1.2) * 0.04;
      }
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.08;
    }
  });

  return (
    <group position={[0, -1.2, 0]}>
      {/* Soft Pastel Sage & Cream Grid */}
      <gridHelper
        ref={gridRef}
        args={[80, 80, '#8da178', '#dfcaa8']}
        position={[0, 0, 0]}
      >
        <lineBasicMaterial
          attach="material"
          color="#8da178"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </gridHelper>

      {/* Bright Warm Honey Oak Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#ebd5be"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Cozy Pastel Rings */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[10, 10.35, 64]} />
        <meshBasicMaterial
          color="#ff9e80"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[18, 18.3, 64]} />
        <meshBasicMaterial
          color="#70b0d0"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
