import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  size?: number;
}

export function FloatingParticles({ count = 220, color = '#ffe5b4', size = 0.04 }: FloatingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = Math.random() * 10 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;

      sca[i] = Math.random() * 0.8 + 0.3;
    }
    return [pos, sca];
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime() * 0.15;
    pointsRef.current.rotation.y = t * 0.12;

    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 1;
      posArray[idx] += Math.sin(t * 2 + i) * 0.0025;
      if (posArray[idx] > 8) posArray[idx] = -1;
      if (posArray[idx] < -1) posArray[idx] = 8;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
