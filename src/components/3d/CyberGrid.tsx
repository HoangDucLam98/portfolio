import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Single Puffy Low-Poly Cartoon Cloud
function PuffyCloud({
  position,
  scale = 1.0,
  speed = 0.2,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}) {
  const cloudRef = useRef<THREE.Group>(null);
  const initialX = position[0];

  useFrame(({ clock }) => {
    if (!cloudRef.current) return;
    const t = clock.getElapsedTime() * speed;
    // Slow drifting animation
    cloudRef.current.position.x = initialX + Math.sin(t) * 1.5;
    cloudRef.current.position.y = position[1] + Math.cos(t * 1.3) * 0.25;
  });

  return (
    <group ref={cloudRef} position={position} scale={scale}>
      {/* Central big puff */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      {/* Left puff */}
      <mesh position={[-0.9, -0.2, 0.2]} castShadow receiveShadow>
        <sphereGeometry args={[0.9, 14, 14]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>
      {/* Right puff */}
      <mesh position={[0.95, -0.15, -0.1]} castShadow receiveShadow>
        <sphereGeometry args={[0.85, 14, 14]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>
      {/* Top puff */}
      <mesh position={[0.2, 0.6, -0.1]} castShadow receiveShadow>
        <sphereGeometry args={[0.8, 14, 14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.65} />
      </mesh>
      {/* Soft Bottom Fill */}
      <mesh position={[0, -0.4, 0]} scale={[1.8, 0.4, 1.2]}>
        <sphereGeometry args={[1.0, 14, 14]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Distant Floating Sky Isle
function DistantIsland({
  position,
  scale = 0.8,
  rotSpeed = 0.05,
}: {
  position: [number, number, number];
  scale?: number;
  rotSpeed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.35;
    groupRef.current.rotation.y = t * rotSpeed;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Island Rock Base */}
      <mesh position={[0, -1.2, 0]} castShadow>
        <cylinderGeometry args={[1.8, 0.2, 2.4, 6]} />
        <meshStandardMaterial color="#644933" roughness={0.85} />
      </mesh>
      {/* Lush Grass Crust */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 1.8, 0.4, 6]} />
        <meshStandardMaterial color="#22c55e" roughness={0.7} />
      </mesh>
      {/* Ancient Sky Pillar */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 1.4, 6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>
      {/* Floating Glowing Rune Shard */}
      <mesh position={[0, 1.8, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
}

export function CyberGrid() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.06;
    }
  });

  return (
    <group position={[0, -2.4, 0]}>
      {/* Vast Drifting Sea of Fluffy Cartoon Clouds */}
      <PuffyCloud position={[-14, -3.2, -18]} scale={3.8} speed={0.08} />
      <PuffyCloud position={[16, -3.8, -20]} scale={4.2} speed={0.06} />
      <PuffyCloud position={[-18, -2.8, 8]} scale={3.4} speed={0.1} />
      <PuffyCloud position={[20, -3.0, 10]} scale={3.6} speed={0.09} />
      <PuffyCloud position={[0, -4.5, -24]} scale={5.0} speed={0.05} />
      <PuffyCloud position={[-8, -2.2, 14]} scale={2.8} speed={0.12} />
      <PuffyCloud position={[12, -2.5, 16]} scale={3.0} speed={0.11} />

      {/* Distant Mysterious Floating Sky Isles */}
      <DistantIsland position={[-22, 1.5, -28]} scale={1.4} rotSpeed={0.03} />
      <DistantIsland position={[24, 2.2, -26]} scale={1.2} rotSpeed={-0.025} />
      <DistantIsland position={[-20, -0.5, 18]} scale={0.9} rotSpeed={0.04} />
      <DistantIsland position={[22, 0.8, 20]} scale={1.0} rotSpeed={-0.03} />

      {/* Celestial Golden Horizon Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.0, 0]}>
        <ringGeometry args={[28, 28.5, 64]} />
        <meshBasicMaterial
          color="#facc15"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Soft Ambient Horizon Fog Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]}>
        <circleGeometry args={[65, 32]} />
        <meshStandardMaterial
          color="#bae6fd"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}
