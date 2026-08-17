import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface Contact3DProps {
  isSubmitting: boolean;
  isSuccess: boolean;
  isFocused: boolean;
}

export function Contact3D({ isSubmitting, isSuccess, isFocused }: Contact3DProps) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Warm firefly & magical star particles
  const particleCount = 180;
  const [particlePositions, particleVelocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.0;
      pos[i * 3 + 1] = Math.random() * 2.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.0;

      vel[i * 3] = (Math.random() - 0.5) * 0.03;
      vel[i * 3 + 1] = Math.random() * 0.06 + 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
    }
    return [pos, vel];
  }, [particleCount]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = isSubmitting || isSuccess ? 3.0 : isFocused ? 1.8 : 1.0;

    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 0.8 * speed;
      crystalRef.current.rotation.x = Math.sin(t * 1.1) * 0.15;
      crystalRef.current.position.y = 0.8 + Math.sin(t * 2) * 0.08;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 1.2 * speed;
      ring1Ref.current.rotation.x = Math.sin(t * 0.8) * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 1.0 * speed;
      ring2Ref.current.rotation.z = Math.cos(t * 0.6) * 0.3;
    }

    // Magic beam pulse
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = isSuccess ? 0.8 : isSubmitting ? 0.5 : isFocused ? 0.35 : 0.2;
      }
    }

    // Particle flow
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += particleVelocities[i * 3 + 1] * (isSuccess ? 2.5 : 1.0);
        posArray[i * 3] += particleVelocities[i * 3];
        posArray[i * 3 + 2] += particleVelocities[i * 3 + 2];

        if (posArray[i * 3 + 1] > 5.5) {
          posArray[i * 3 + 1] = 0.2;
          posArray[i * 3] = (Math.random() - 0.5) * 1.0;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Campfire Stone Pedestal Ring */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.6, 0.3, 24]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} />
      </mesh>

      {/* Wooden Logs around the campfire */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <mesh
            key={`log-${i}`}
            position={[Math.cos(rad) * 0.55, 0.18, Math.sin(rad) * 0.55]}
            rotation={[0.3, -rad, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.07, 0.07, 0.5, 12]} />
            <meshStandardMaterial color="#8d6b4f" roughness={0.8} />
          </mesh>
        );
      })}

      {/* Floating Magic Star Rings */}
      <group position={[0, 0.8, 0]}>
        <mesh ref={ring1Ref}>
          <torusGeometry args={[0.75, 0.015, 16, 48]} />
          <meshBasicMaterial
            color={isSuccess ? '#a3b18a' : '#ffe5b4'}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh ref={ring2Ref}>
          <torusGeometry args={[0.95, 0.012, 16, 48]} />
          <meshBasicMaterial
            color={isSuccess ? '#8ecae6' : '#ffb4a2'}
            transparent
            opacity={0.65}
          />
        </mesh>
      </group>

      {/* Floating Magic Heart / Flame Crystal Core */}
      <mesh ref={crystalRef} position={[0, 0.8, 0]}>
        <octahedronGeometry args={[0.36, 0]} />
        <meshStandardMaterial
          color={isSuccess ? '#a3b18a' : isSubmitting ? '#ffb4a2' : '#ffd166'}
          emissive={isSuccess ? '#a3b18a' : '#ffd166'}
          emissiveIntensity={isSuccess ? 1.5 : isFocused ? 1.0 : 0.6}
          roughness={0.25}
        />
      </mesh>

      {/* Vertical Magic Light Beam */}
      <mesh ref={beamRef} position={[0, 3.0, 0]}>
        <cylinderGeometry args={[0.12, 0.22, 4.4, 20]} />
        <meshBasicMaterial
          color={isSuccess ? '#a3b18a' : '#ffe5b4'}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating Magical Firefly Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={isSuccess ? '#a3b18a' : '#ffd166'}
          size={0.06}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Warm Ambient Campfire Light */}
      <pointLight
        position={[0, 0.9, 0]}
        color={isSuccess ? '#a3b18a' : '#ffd166'}
        intensity={isSuccess ? 2.5 : isFocused ? 2.0 : 1.4}
        distance={5.5}
      />

      {/* Whimsical 3D Text Status */}
      <Text
        position={[0, -0.38, 1.15]}
        fontSize={0.13}
        color={isSuccess ? '#a3b18a' : '#ffe5b4'}
        anchorX="center"
        anchorY="middle"
      >
        {isSuccess ? '★ QUEST DISPATCHED SUCCESSFULLY! ★' : isSubmitting ? '✦ PREPARING CARRIER PIGEON...' : '★ CAMPFIRE BEACON ACTIVE ★'}
      </Text>
    </group>
  );
}
