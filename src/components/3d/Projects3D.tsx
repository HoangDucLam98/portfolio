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

// 3D Stylized Game Token with smooth subdivisions
function Project3DToken({ type, color }: { type: ProjectItem['modelType']; color: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 1.0;
    meshRef.current.rotation.x = Math.sin(t * 0.8) * 0.15;
  });

  return (
    <group ref={meshRef} position={[0, 0.45, 0.18]} scale={0.42}>
      {type === 'star' && (
        <mesh>
          <octahedronGeometry args={[1, 2]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            roughness={0.25}
          />
        </mesh>
      )}

      {type === 'potion' && (
        <group>
          {/* Bottle body */}
          <mesh>
            <sphereGeometry args={[0.72, 32, 32]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              roughness={0.2}
              transparent
              opacity={0.88}
            />
          </mesh>
          {/* Bottle Neck & Cork */}
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.4, 32]} />
            <meshStandardMaterial color="#c68b59" roughness={0.6} />
          </mesh>
        </group>
      )}

      {type === 'gem' && (
        <mesh>
          <dodecahedronGeometry args={[0.9, 2]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
      )}

      {type === 'cartridge' && (
        <RoundedBox args={[1.2, 1.4, 0.25]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={color}
            roughness={0.4}
          />
        </RoundedBox>
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
        <meshStandardMaterial
          color={isCurrent || hovered ? '#ffffff' : '#fcf6ed'}
          roughness={0.35}
          metalness={0.02}
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

      {/* Embedded 3D Game Artifact Token */}
      <Project3DToken type={project.modelType} color={project.color} />

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
        color="#38271e"
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
        {hovered ? '✨ CLICK TO VIEW QUEST' : 'INSPECT GAME SPECS ➔'}
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
      {/* Ground Pastel Ring */}
      <mesh ref={baseRingRef} position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.28, 64]} />
        <meshBasicMaterial color="#8da178" transparent opacity={0.35} />
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
