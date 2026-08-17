import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { skillsData } from '../../data/skillsData';
import type { SkillItem } from '../../types';
import { soundManager } from '../../audio/audioEngine';

interface Skills3DProps {
  activeCategory: string;
  selectedSkill: SkillItem | null;
  onSelectSkill: (skill: SkillItem) => void;
}

// Single Interactive 3D Skill Node
function SkillNode({
  skill,
  isActiveCategory,
  isSelected,
  onSelect,
}: {
  skill: SkillItem;
  isActiveCategory: boolean;
  isSelected: boolean;
  onSelect: (skill: SkillItem) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.7 + skill.position[0];
      meshRef.current.rotation.x = Math.sin(t * 0.5 + skill.position[1]) * 0.2;
      meshRef.current.position.y = skill.position[1] + Math.sin(t * 1.6 + skill.position[0]) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.0;
    }
  });

  const handlePointerOver = (e: unknown) => {
    (e as { stopPropagation?: () => void }).stopPropagation?.();
    setHovered(true);
    soundManager.playSkillSelect();
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  const handleClick = (e: unknown) => {
    (e as { stopPropagation?: () => void }).stopPropagation?.();
    soundManager.playClick();
    onSelect(skill);
  };

  const scale = isSelected ? 1.4 : hovered ? 1.25 : isActiveCategory ? 1.0 : 0.65;
  const opacity = isActiveCategory ? 1.0 : 0.35;

  return (
    <group position={skill.position}>
      {/* Smooth Subdivided Polyhedron Node */}
      <mesh
        ref={meshRef}
        scale={scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <dodecahedronGeometry args={[0.26, 2]} />
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={isSelected ? 0.8 : hovered ? 0.5 : 0.2}
          roughness={0.3}
          metalness={0.08}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Orbiting Halo Ring on Hover/Select */}
      {(hovered || isSelected) && (
        <mesh ref={ringRef} scale={scale * 1.28}>
          <ringGeometry args={[0.32, 0.36, 48]} />
          <meshBasicMaterial
            color={skill.color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {(hovered || isSelected) && (
        <pointLight color={skill.color} intensity={1.5} distance={2.4} />
      )}

      {/* 3D Text Label */}
      <Text
        position={[0, -0.42, 0]}
        fontSize={0.15}
        color={isSelected || hovered ? '#38271e' : '#5c4a3f'}
        anchorX="center"
        anchorY="middle"
      >
        {skill.name}
      </Text>

      {/* Level Badge */}
      <Text
        position={[0, -0.62, 0]}
        fontSize={0.11}
        color="#8da178"
        anchorX="center"
        anchorY="middle"
      >
        {`LVL ${skill.level}%`}
      </Text>
    </group>
  );
}

export function Skills3D({ activeCategory, selectedSkill, onSelectSkill }: Skills3DProps) {
  const coreRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // Constellation network lines
  const linePoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < skillsData.length; i++) {
      for (let j = i + 1; j < skillsData.length; j++) {
        const p1 = new THREE.Vector3(...skillsData[i].position);
        const p2 = new THREE.Vector3(...skillsData[j].position);
        if (p1.distanceTo(p2) < 2.6) {
          points.push(p1, p2);
        }
      }
    }
    return points;
  }, []);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(linePoints);
  }, [linePoints]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.18;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.4;
      ring1Ref.current.rotation.z = t * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.35;
      ring2Ref.current.rotation.x = t * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Whimsical Star / Mana Core */}
      <group ref={coreRef} position={[0, 0, 0]}>
        <mesh>
          <octahedronGeometry args={[0.54, 2]} />
          <meshStandardMaterial
            color="#ffd166"
            emissive="#ffd166"
            emissiveIntensity={0.5}
            roughness={0.25}
          />
        </mesh>

        {/* Outer Rotating Pastel Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[0.92, 0.015, 24, 64]} />
          <meshBasicMaterial color="#8da178" transparent opacity={0.6} />
        </mesh>
        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.2, 0.012, 24, 64]} />
          <meshBasicMaterial color="#ff9e80" transparent opacity={0.5} />
        </mesh>

        <pointLight color="#ffd166" intensity={1.8} distance={5.0} />
      </group>

      {/* Constellation Network Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#8da178"
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </lineSegments>

      {/* 3D Skill Nodes */}
      {skillsData.map((skill) => {
        const isActiveCategory =
          activeCategory === 'all' || skill.category === activeCategory;
        const isSelected = selectedSkill?.id === skill.id;

        return (
          <SkillNode
            key={skill.id}
            skill={skill}
            isActiveCategory={isActiveCategory}
            isSelected={isSelected}
            onSelect={onSelectSkill}
          />
        );
      })}
    </group>
  );
}
