import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface CameraControllerProps {
  scrollProgress: number; // 0.0 to 1.0
  activeSection: number;  // 0 to 4
}

// Station definitions
const STATIONS = [
  // 0: Hero (Desk overview)
  {
    cam: new THREE.Vector3(0, 2.2, 6.2),
    target: new THREE.Vector3(0, 0.7, 0),
    fov: 45,
  },
  // 1: About (Deep zoom into the curved monitor)
  {
    cam: new THREE.Vector3(0, 1.35, 1.8),
    target: new THREE.Vector3(0, 1.35, -0.4),
    fov: 42,
  },
  // 2: Skills (Constellation orbit view)
  {
    cam: new THREE.Vector3(0, 0.3, 7.5),
    target: new THREE.Vector3(0, 0.0, 0),
    fov: 48,
  },
  // 3: Projects (Holographic carousel perspective)
  {
    cam: new THREE.Vector3(0, 1.2, 7.2),
    target: new THREE.Vector3(0, 0.4, 0),
    fov: 46,
  },
  // 4: Contact (Quantum terminal elevation)
  {
    cam: new THREE.Vector3(0, 1.8, 5.8),
    target: new THREE.Vector3(0, 0.8, 0),
    fov: 46,
  },
];

export function CameraController({ scrollProgress }: CameraControllerProps) {
  const { camera, pointer } = useThree();
  const currentCamPos = useRef(new THREE.Vector3(0, 2.2, 6.2));
  const currentTarget = useRef(new THREE.Vector3(0, 0.7, 0));

  // Compute station interpolation
  const interpolated = useMemo(() => {
    // 4 intervals between 5 stations: [0-0.25], [0.25-0.5], [0.5-0.75], [0.75-1.0]
    const clamped = Math.max(0, Math.min(1, scrollProgress));
    const segmentCount = STATIONS.length - 1;
    const rawIndex = clamped * segmentCount;
    const startIndex = Math.min(Math.floor(rawIndex), segmentCount - 1);
    const endIndex = startIndex + 1;
    const factor = rawIndex - startIndex;

    // Smooth easeInOut curve
    const smoothFactor = factor * factor * (3 - 2 * factor);

    const camPos = new THREE.Vector3().lerpVectors(
      STATIONS[startIndex].cam,
      STATIONS[endIndex].cam,
      smoothFactor
    );

    const targetPos = new THREE.Vector3().lerpVectors(
      STATIONS[startIndex].target,
      STATIONS[endIndex].target,
      smoothFactor
    );

    return { camPos, targetPos };
  }, [scrollProgress]);

  useFrame((_, delta) => {
    // Add subtle mouse parallax
    const parallaxX = pointer.x * 0.35;
    const parallaxY = pointer.y * 0.22;

    const targetCamWithParallax = new THREE.Vector3(
      interpolated.camPos.x + parallaxX,
      interpolated.camPos.y + parallaxY,
      interpolated.camPos.z
    );

    // Smooth lerp camera position
    currentCamPos.current.lerp(targetCamWithParallax, delta * 4.5);
    currentTarget.current.lerp(interpolated.targetPos, delta * 4.5);

    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
