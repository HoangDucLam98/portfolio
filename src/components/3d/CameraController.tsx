import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

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

export function CameraController() {
  const { camera, pointer } = useThree();
  const currentCamPos = useRef(new THREE.Vector3(0, 2.2, 6.2));
  const currentTarget = useRef(new THREE.Vector3(0, 0.7, 0));
  const desiredCamPos = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / totalScroll)) : 0;
    const segmentCount = STATIONS.length - 1;
    const rawIndex = progress * segmentCount;
    const startIndex = Math.min(Math.floor(rawIndex), segmentCount - 1);
    const endIndex = startIndex + 1;
    const factor = rawIndex - startIndex;
    const smoothFactor = factor * factor * (3 - 2 * factor);

    // Add subtle mouse parallax
    const parallaxX = pointer.x * 0.35;
    const parallaxY = pointer.y * 0.22;

    desiredCamPos.lerpVectors(STATIONS[startIndex].cam, STATIONS[endIndex].cam, smoothFactor);
    desiredCamPos.x += parallaxX;
    desiredCamPos.y += parallaxY;
    desiredTarget.lerpVectors(STATIONS[startIndex].target, STATIONS[endIndex].target, smoothFactor);

    // Smooth lerp camera position
    const lerpAlpha = Math.min(delta * 4.5, 1);
    currentCamPos.current.lerp(desiredCamPos, lerpAlpha);
    currentTarget.current.lerp(desiredTarget, lerpAlpha);

    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
