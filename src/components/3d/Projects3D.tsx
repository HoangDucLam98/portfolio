import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { projectsData } from '../../data/portfolioData';
import type { ProjectItem } from '../../types';
import { soundManager } from '../../audio/audioEngine';

interface Projects3DProps {
  activeIndex: number;
  onSelectProject: (project: ProjectItem) => void;
  onHoverIndex: (index: number) => void;
}

// Custom 3D Stylized Game Token Tailored to Each Shipped Game Title
function Project3DToken({
  projectId,
  color,
}: {
  projectId: string;
  color: string;
}) {
  const tokenRef = useRef<THREE.Group>(null);
  const sandWaveRef = useRef<THREE.Group>(null);
  const emberRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!tokenRef.current) return;
    const t = clock.getElapsedTime();
    tokenRef.current.rotation.y = t * 0.85;
    tokenRef.current.rotation.x = Math.sin(t * 0.7) * 0.12;

    if (sandWaveRef.current) {
      sandWaveRef.current.rotation.y = t * 1.5;
    }
    if (emberRef.current) {
      emberRef.current.position.y = Math.sin(t * 3.0) * 0.04;
    }
  });

  return (
    <group ref={tokenRef} position={[0, 0.46, 0.18]} scale={0.46}>

      {/* ================= 1. COLOR FLOW PUZZLE -> FLOWING SAND ART FLASK ================= */}
      {projectId === 'color-flow-puzzle' && (
        <group>
          {/* Glass Vessel Shell */}
          <mesh castShadow>
            <cylinderGeometry args={[0.55, 0.45, 1.15, 32]} />
            <meshPhysicalMaterial
              color="#e0f2fe"
              transparent
              opacity={0.4}
              roughness={0.08}
              transmission={0.88}
              ior={1.5}
              clearcoat={1.0}
            />
          </mesh>

          {/* Wooden Cork Cap */}
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.28, 0.24, 24]} />
            <meshStandardMaterial color="#c68b59" roughness={0.6} />
          </mesh>

          {/* Dual Flowing Sand Layers */}
          <group ref={sandWaveRef} position={[0, -0.08, 0]}>
            {/* Top Coral Sand Layer */}
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.48, 0.46, 0.38, 24]} />
              <meshStandardMaterial color="#f43f5e" roughness={0.4} />
            </mesh>
            {/* Bottom Cyan Water/Sand Layer */}
            <mesh position={[0, -0.22, 0]}>
              <cylinderGeometry args={[0.44, 0.41, 0.42, 24]} />
              <meshStandardMaterial color="#06b6d4" roughness={0.35} />
            </mesh>
            {/* Glowing Golden Flow Ring */}
            <mesh position={[0, -0.02, 0]}>
              <torusGeometry args={[0.46, 0.025, 16, 32]} />
              <meshBasicMaterial color="#fbbf24" />
            </mesh>
          </group>

          <pointLight color="#38bdf8" intensity={0.8} distance={1.2} />
        </group>
      )}

      {/* ================= 2. SURVIVAL HERO -> EXCALIBUR SWORD IN RUNE STONE ================= */}
      {projectId === 'survival-hero' && (
        <group position={[0, -0.15, 0]}>
          {/* Ancient Rune Pedestal Altar */}
          <mesh position={[0, -0.35, 0]} castShadow>
            <cylinderGeometry args={[0.72, 0.88, 0.45, 6]} />
            <meshStandardMaterial color="#475569" roughness={0.85} />
          </mesh>
          {/* Glowing Rune Ring */}
          <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.4, 0.52, 24]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
          </mesh>

          {/* Stylized Steel Blade (Inserted into Stone) */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[0.16, 1.05, 0.05]} />
            <meshPhysicalMaterial
              color="#f8fafc"
              metalness={0.85}
              roughness={0.15}
              clearcoat={0.8}
            />
          </mesh>
          {/* Glowing Flame Core */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.08, 0.95, 0.06]} />
            <meshBasicMaterial color="#f97316" />
          </mesh>

          {/* Golden Winged Crossguard */}
          <mesh position={[0, 0.88, 0]} castShadow>
            <boxGeometry args={[0.65, 0.12, 0.14]} />
            <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Red Ruby Inset */}
          <mesh position={[0, 0.88, 0.075]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>

          {/* Leather Grip & Golden Pommel */}
          <mesh position={[0, 1.06, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.26, 16]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.24, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Fiery Embers */}
          <group ref={emberRef} position={[0, 0.4, 0]}>
            <pointLight color="#f97316" intensity={1.5} distance={1.6} />
          </group>
        </group>
      )}

      {/* ================= 3. SUPERMARKET JOURNEY -> CUTE MINI SHOPPING CART ================= */}
      {projectId === 'supermarket-journey' && (
        <group position={[0, -0.05, 0]} scale={0.95}>
          {/* Orange Shopping Basket Frame */}
          <RoundedBox args={[0.92, 0.62, 0.72]} radius={0.06} smoothness={3} castShadow>
            <meshPhysicalMaterial
              color="#f97316"
              roughness={0.2}
              clearcoat={0.7}
            />
          </RoundedBox>

          {/* Inner Basket Cutout / Space */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.82, 0.52, 0.62]} />
            <meshStandardMaterial color="#fff7ed" roughness={0.4} />
          </mesh>

          {/* Grocery Item 1: Cartoon Red Apple */}
          <group position={[-0.2, 0.32, -0.1]}>
            <mesh castShadow>
              <sphereGeometry args={[0.18, 20, 20]} />
              <meshPhysicalMaterial color="#ef4444" roughness={0.15} clearcoat={0.8} />
            </mesh>
            {/* Tiny Green Leaf */}
            <mesh position={[0.08, 0.16, 0]} rotation={[0.4, 0.2, 0]}>
              <coneGeometry args={[0.06, 0.14, 8]} />
              <meshStandardMaterial color="#22c55e" roughness={0.3} />
            </mesh>
          </group>

          {/* Grocery Item 2: Milk Carton */}
          <group position={[0.18, 0.35, 0.05]}>
            <RoundedBox args={[0.22, 0.38, 0.22]} radius={0.02} smoothness={2} castShadow>
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </RoundedBox>
            <mesh position={[0, 0.12, 0.112]}>
              <planeGeometry args={[0.16, 0.12]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>

          {/* Metal Handlebar */}
          <mesh position={[0.48, 0.42, 0]} rotation={[-Math.PI / 6, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.75, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>

          {/* 4 Miniature Wheels */}
          {[
            [-0.35, -0.38, -0.32],
            [0.35, -0.38, -0.32],
            [-0.35, -0.38, 0.32],
            [0.35, -0.38, 0.32],
          ].map(([x, y, z], idx) => (
            <mesh key={`wheel-${idx}`} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.09, 0.09, 0.06, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
          ))}

          <pointLight color="#fbbf24" intensity={0.9} distance={1.4} />
        </group>
      )}

      {/* ================= 4. PRISON ESCAPE -> POLICE HANDCUFFS & BRASS KEY ================= */}
      {projectId === 'prison-escape-journey' && (
        <group position={[0, 0.05, 0]} scale={0.92}>
          {/* Left Chrome Handcuff Ring */}
          <mesh position={[-0.36, 0, 0]} rotation={[0.2, 0.4, 0]} castShadow>
            <torusGeometry args={[0.38, 0.065, 16, 32]} />
            <meshPhysicalMaterial
              color="#94a3b8"
              metalness={0.9}
              roughness={0.12}
              clearcoat={1.0}
            />
          </mesh>

          {/* Right Chrome Handcuff Ring */}
          <mesh position={[0.36, 0, 0]} rotation={[-0.2, -0.4, 0]} castShadow>
            <torusGeometry args={[0.38, 0.065, 16, 32]} />
            <meshPhysicalMaterial
              color="#94a3b8"
              metalness={0.9}
              roughness={0.12}
              clearcoat={1.0}
            />
          </mesh>

          {/* Interlocking Chain Link */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.16, 0.05, 16, 24]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Antique Golden Skeleton Key */}
          <group position={[0, -0.22, 0.22]} rotation={[0.4, 0.2, -Math.PI / 4]}>
            {/* Key Shaft */}
            <mesh castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.8, 16]} />
              <meshPhysicalMaterial color="#eab308" metalness={0.85} roughness={0.2} clearcoat={0.6} />
            </mesh>
            {/* Ornate Key Bow / Loop */}
            <mesh position={[0, 0.44, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.14, 0.04, 16, 24]} />
              <meshPhysicalMaterial color="#eab308" metalness={0.85} roughness={0.2} clearcoat={0.6} />
            </mesh>
            {/* Key Bit / Teeth */}
            <mesh position={[0.08, -0.28, 0]}>
              <boxGeometry args={[0.16, 0.12, 0.05]} />
              <meshPhysicalMaterial color="#eab308" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>

          {/* Cyan Stealth Searchlight Beam Glow */}
          <pointLight color="#38bdf8" intensity={1.2} distance={1.8} />
        </group>
      )}

      {/* Fallback Token */}
      {!['color-flow-puzzle', 'survival-hero', 'supermarket-journey', 'prison-escape-journey'].includes(projectId) && (
        <mesh castShadow>
          <octahedronGeometry args={[0.85, 2]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            roughness={0.2}
            clearcoat={0.8}
          />
        </mesh>
      )}

    </group>
  );
}

// Single 3D Project Card
function ProjectCard3D({
  project,
  index,
  activeIndex,
  onSelect,
  onHover,
}: {
  project: ProjectItem;
  index: number;
  activeIndex: number;
  onSelect: (p: ProjectItem) => void;
  onHover: (idx: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const offset = index - activeIndex;
  const angle = (offset * Math.PI) / 3.8;
  const radius = 4.2;

  const targetX = Math.sin(angle) * radius;
  const targetZ = -Math.cos(angle) * radius + radius * 0.8;
  const targetRotY = -angle * 0.75;

  const isCurrent = index === activeIndex;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 6);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 6);
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      isCurrent ? 0.3 : 0.0,
      delta * 6
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 6);

    if (hovered) {
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1.08, delta * 8));
    } else {
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, isCurrent ? 1.0 : 0.82, delta * 8));
    }
  });

  const handleOver = (e: unknown) => {
    (e as { stopPropagation?: () => void }).stopPropagation?.();
    setHovered(true);
    onHover(index);
    soundManager.playHover();
  };

  const handleOut = () => {
    setHovered(false);
  };

  const handleClick = (e: unknown) => {
    (e as { stopPropagation?: () => void }).stopPropagation?.();
    soundManager.playOpenModal();
    onSelect(project);
  };

  return (
    <group
      ref={groupRef}
      position={[targetX, 0, targetZ]}
      rotation={[0, targetRotY, 0]}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onClick={handleClick}
    >
      {/* Smooth Clay White Card Body */}
      <RoundedBox
        args={[2.2, 2.8, 0.12]}
        radius={0.12}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={isCurrent || hovered ? '#ffffff' : '#fcf6ed'}
          roughness={0.25}
          clearcoat={0.6}
        />
      </RoundedBox>

      {/* Pastel Rounded Border Ribbon */}
      <mesh position={[0, 0, 0.065]}>
        <ringGeometry args={[0.95, 0.98, 48]} />
        <meshBasicMaterial
          color={isCurrent || hovered ? project.color : '#e6d8cb'}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Embedded Tailored 3D Game Artifact Token */}
      <Project3DToken projectId={project.id} color={project.color} />

      {/* Category Badge */}
      <Text
        position={[0, -0.22, 0.08]}
        fontSize={0.12}
        color={project.color}
        anchorX="center"
        anchorY="middle"
      >
        {`★ ${project.category.toUpperCase()} ★`}
      </Text>

      {/* Project Title */}
      <Text
        position={[0, -0.45, 0.08]}
        fontSize={0.17}
        color="#2d221c"
        maxWidth={1.9}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {project.title}
      </Text>

      {/* Action CTA Prompt */}
      <Text
        position={[0, -0.95, 0.08]}
        fontSize={0.12}
        color={hovered ? '#e76f51' : '#786558'}
        anchorX="center"
        anchorY="middle"
      >
        {hovered ? '✨ CLICK TO VIEW SPECS' : 'INSPECT GAME SPECS ➔'}
      </Text>

      {/* Warm Glow Light */}
      {(isCurrent || hovered) && (
        <pointLight color={project.color} intensity={1.5} distance={2.4} position={[0, 0, 0.5]} />
      )}
    </group>
  );
}

export function Projects3D({ activeIndex, onSelectProject, onHoverIndex }: Projects3DProps) {
  const baseRingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (baseRingRef.current) {
      baseRingRef.current.rotation.z = clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <group position={[0, 0.4, 0]}>
      {/* Golden Sky Sanctuary Ring & Cloud Base */}
      <mesh ref={baseRingRef} position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.32, 64]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.45} />
      </mesh>
      {/* Cloud Platform Disc */}
      <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.2, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.35} roughness={0.9} />
      </mesh>

      {/* 3D Game Project Cards */}
      {projectsData.map((project, idx) => (
        <ProjectCard3D
          key={project.id}
          project={project}
          index={idx}
          activeIndex={activeIndex}
          onSelect={onSelectProject}
          onHover={onHoverIndex}
        />
      ))}
    </group>
  );
}
