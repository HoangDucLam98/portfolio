import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { soundManager } from '../../audio/audioEngine';
import { achievementsManager } from '../../game/achievements';

interface SproutlingPlayerProps {
  isPlaying: boolean;
  onStarsCountChange: (count: number, total: number) => void;
  onWin: () => void;
}

interface StarItem {
  id: number;
  position: [number, number, number];
  collected: boolean;
}

const INITIAL_STARS: StarItem[] = [
  { id: 1, position: [-1.8, 0.75, 0.4], collected: false },
  { id: 2, position: [-0.6, 0.75, -0.4], collected: false },
  { id: 3, position: [0.0, 0.75, 0.6], collected: false },
  { id: 4, position: [0.8, 0.75, -0.3], collected: false },
  { id: 5, position: [1.8, 0.75, 0.5], collected: false },
];

export function SproutlingPlayer({ isPlaying, onStarsCountChange, onWin }: SproutlingPlayerProps) {
  const playerRef = useRef<THREE.Group>(null);
  const [stars, setStars] = useState<StarItem[]>(INITIAL_STARS);
  
  // Physics State
  const pos = useRef(new THREE.Vector3(0, 0.6, 0.3));
  const vel = useRef(new THREE.Vector3(0, 0, 0));
  const isGrounded = useRef(true);
  const facingAngle = useRef(0);
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!isPlaying) return;

    // Reset stars when game starts
    setStars(INITIAL_STARS.map((s) => ({ ...s, collected: false })));
    onStarsCountChange(0, 5);
    pos.current.set(0, 0.6, 0.3);
    vel.current.set(0, 0, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'Space' && isGrounded.current) {
        vel.current.y = 0.12;
        isGrounded.current = false;
        soundManager.playJump();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  useFrame((_, delta) => {
    if (!isPlaying || !playerRef.current) return;

    const moveSpeed = 3.5;
    const moveX = (keys.current['KeyD'] || keys.current['ArrowRight'] ? 1 : 0) - (keys.current['KeyA'] || keys.current['ArrowLeft'] ? 1 : 0);
    const moveZ = (keys.current['KeyS'] || keys.current['ArrowDown'] ? 1 : 0) - (keys.current['KeyW'] || keys.current['ArrowUp'] ? 1 : 0);

    // Calculate movement vector
    const moveVec = new THREE.Vector2(moveX, moveZ);
    if (moveVec.length() > 0) {
      moveVec.normalize();
      pos.current.x += moveVec.x * moveSpeed * delta;
      pos.current.z += moveVec.y * moveSpeed * delta;
      facingAngle.current = Math.atan2(moveVec.x, moveVec.y);
    }

    // Gravity & Jump Physics
    if (!isGrounded.current) {
      vel.current.y -= 0.35 * delta;
      pos.current.y += vel.current.y;
      if (pos.current.y <= 0.6) {
        pos.current.y = 0.6;
        vel.current.y = 0;
        isGrounded.current = true;
      }
    }

    // Desk Boundary Clamping
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -2.4, 2.4);
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -1.0, 1.0);

    // Apply to 3D Mesh
    playerRef.current.position.copy(pos.current);
    playerRef.current.rotation.y = THREE.MathUtils.lerp(
      playerRef.current.rotation.y,
      facingAngle.current,
      delta * 12
    );

    // Walking wobble animation
    if (moveVec.length() > 0 && isGrounded.current) {
      playerRef.current.position.y = 0.6 + Math.abs(Math.sin(Date.now() * 0.015)) * 0.04;
      playerRef.current.rotation.z = Math.sin(Date.now() * 0.02) * 0.08;
    }

    // Check Star Collisions
    stars.forEach((star) => {
      if (!star.collected) {
        const starPos = new THREE.Vector3(...star.position);
        if (pos.current.distanceTo(starPos) < 0.35) {
          star.collected = true;
          soundManager.playCoin();
          const newStars = [...stars];
          setStars(newStars);

          const collectedCount = newStars.filter((s) => s.collected).length;
          onStarsCountChange(collectedCount, 5);

          if (collectedCount === 5) {
            soundManager.playAchievement();
            achievementsManager.unlock('star_collector');
            onWin();
          }
        }
      }
    });
  });

  if (!isPlaying) return null;

  return (
    <group>
      {/* ================= 3D SPROUTLING PLAYER CHARACTER ================= */}
      <group ref={playerRef} position={[0, 0.6, 0.3]} scale={0.65}>
        {/* Soft Drop Shadow under Player */}
        <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.22, 24]} />
          <meshBasicMaterial color="#3e2723" transparent opacity={0.25} />
        </mesh>

        {/* Cute Cream Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#fffdfa" roughness={0.4} />
        </mesh>

        {/* Coral Mushroom Cap */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <sphereGeometry args={[0.26, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ff9e80" roughness={0.35} />
        </mesh>

        {/* Cap Polka Dots */}
        {[0, 90, 180, 270].map((deg, idx) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={`dot-${idx}`}
              position={[Math.cos(rad) * 0.16, 0.22, Math.sin(rad) * 0.16]}
            >
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial color="#fffdfa" roughness={0.3} />
            </mesh>
          );
        })}

        {/* Green Sprout Leaf on Top */}
        <mesh position={[0, 0.35, 0]} rotation={[0.2, 0, 0.3]}>
          <dodecahedronGeometry args={[0.06, 0]} />
          <meshStandardMaterial color="#8da178" roughness={0.4} />
        </mesh>

        {/* Kawaii Black Eyes */}
        <mesh position={[-0.065, 0.04, 0.17]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#38271e" />
        </mesh>
        <mesh position={[0.065, 0.04, 0.17]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#38271e" />
        </mesh>

        {/* Eye White Highlights */}
        <mesh position={[-0.055, 0.05, 0.19]}>
          <sphereGeometry args={[0.01, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.075, 0.05, 0.19]}>
          <sphereGeometry args={[0.01, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Pink Cheeks */}
        <mesh position={[-0.1, -0.01, 0.16]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#ffb4a2" />
        </mesh>
        <mesh position={[0.1, -0.01, 0.16]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#ffb4a2" />
        </mesh>
      </group>

      {/* ================= 5 3D COLLECTIBLE GOLDEN STARS ================= */}
      {stars.map((star) => {
        if (star.collected) return null;
        return (
          <group key={`game-star-${star.id}`} position={star.position} scale={0.25}>
            <mesh>
              <octahedronGeometry args={[0.7, 2]} />
              <meshStandardMaterial
                color="#ffd166"
                emissive="#ffd166"
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>
            <pointLight color="#ffd166" intensity={1.2} distance={1.8} />
          </group>
        );
      })}
    </group>
  );
}
