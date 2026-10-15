import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { skillsData } from '../../data/skillsData';
import type { SkillItem } from '../../types';
import { soundManager } from '../../audio/audioEngine';

interface Skills3DProps {
  activeCategory: string;
  selectedSkill: SkillItem | null;
  onSelectSkill: (skill: SkillItem) => void;
}

// Custom Tailored 3D Stylized Artifact for each Game Dev Skill
function Skill3DModel({
  skillId,
  color,
  isSelected,
  hovered,
  opacity,
}: {
  skillId: string;
  color: string;
  isSelected: boolean;
  hovered: boolean;
  opacity: number;
}) {
  const innerRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!innerRef.current) return;
    const t = clock.getElapsedTime();
    innerRef.current.rotation.y = t * 0.9;
    innerRef.current.rotation.x = Math.sin(t * 0.7) * 0.15;
  });

  // 1. Unity 6 & C# -> Stylized Beveled Power Cube with Glowing Core
  if (skillId === 'csharp-unity') {
    return (
      <group ref={innerRef}>
        <RoundedBox args={[0.42, 0.42, 0.42]} radius={0.08} smoothness={4} castShadow>
          <meshPhysicalMaterial
            color="#22c55e"
            roughness={0.25}
            clearcoat={0.7}
            clearcoatRoughness={0.15}
            transparent
            opacity={opacity}
          />
        </RoundedBox>
        {/* Glowing Inner Energy Core */}
        <mesh>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshBasicMaterial color="#86efac" />
        </mesh>
        {/* Floating Orbital Mini-Ring */}
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[0.34, 0.015, 16, 32]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.7} />
        </mesh>
      </group>
    );
  }

  // 2. C++ & Unreal Engine 5 -> Stylized RPG Knight Heraldic Shield
  if (skillId === 'cpp-unreal') {
    return (
      <group ref={innerRef} scale={0.9}>
        {/* Shield Body */}
        <RoundedBox args={[0.42, 0.48, 0.08]} radius={0.06} smoothness={3} castShadow>
          <meshPhysicalMaterial
            color="#0284c7"
            roughness={0.2}
            metalness={0.4}
            clearcoat={0.8}
            transparent
            opacity={opacity}
          />
        </RoundedBox>
        {/* Metallic Beveled Rim */}
        <mesh position={[0, 0, 0.045]}>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 6]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glowing Center Sigil */}
        <mesh position={[0, 0, 0.068]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    );
  }

  // 3. Godot 4 & GDScript -> Stylized Chibi Robot Head
  if (skillId === 'godot') {
    return (
      <group ref={innerRef} scale={0.88}>
        {/* Robot Head Body */}
        <RoundedBox args={[0.42, 0.36, 0.36]} radius={0.08} smoothness={4} castShadow>
          <meshPhysicalMaterial
            color="#38bdf8"
            roughness={0.25}
            clearcoat={0.7}
            transparent
            opacity={opacity}
          />
        </RoundedBox>
        {/* Left Glowing Eye */}
        <mesh position={[-0.11, 0.03, 0.185]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 20]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Right Glowing Eye */}
        <mesh position={[0.11, 0.03, 0.185]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 20]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Cute Head Antenna */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#f43f5e" />
        </mesh>
      </group>
    );
  }

  // 4. HLSL / GLSL Cel-Shading -> Refractive Shader Prism Crystal
  if (skillId === 'cel-shaders') {
    return (
      <group ref={innerRef} scale={0.95}>
        <mesh castShadow>
          <octahedronGeometry args={[0.34, 0]} />
          <meshPhysicalMaterial
            color="#c084fc"
            roughness={0.1}
            transmission={0.88}
            ior={1.6}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            transparent
            opacity={opacity}
          />
        </mesh>
        {/* Internal Rainbow Sparkle */}
        <mesh scale={0.4}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshBasicMaterial color="#f472b6" />
        </mesh>
      </group>
    );
  }

  // 5. Blender 3D Stylized Art -> Artist's 3D Color Wheel / Modeling Gem
  if (skillId === 'blender-lowpoly') {
    return (
      <group ref={innerRef} scale={0.9}>
        <RoundedBox args={[0.42, 0.42, 0.15]} radius={0.06} smoothness={3} castShadow>
          <meshPhysicalMaterial
            color="#f97316"
            roughness={0.2}
            clearcoat={0.8}
            transparent
            opacity={opacity}
          />
        </RoundedBox>
        {/* Color Palette Studs */}
        {[
          [-0.1, 0.1, 0.08],
          [0.1, 0.1, 0.08],
          [-0.1, -0.1, 0.08],
          [0.1, -0.1, 0.08],
        ].map(([x, y, z], i) => (
          <mesh key={`stud-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial
              color={['#38bdf8', '#4ade80', '#fbbf24', '#f43f5e'][i]}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    );
  }

  // 6. Audio & FMOD -> Stylized Retro Game Sound Speaker
  if (skillId === 'fmod-audio') {
    return (
      <group ref={innerRef} scale={0.9}>
        {/* Speaker Cabinet */}
        <RoundedBox args={[0.42, 0.42, 0.28]} radius={0.06} smoothness={3} castShadow>
          <meshPhysicalMaterial
            color="#f59e0b"
            roughness={0.25}
            clearcoat={0.6}
            transparent
            opacity={opacity}
          />
        </RoundedBox>
        {/* Speaker Subwoofer Cone */}
        <mesh position={[0, 0, 0.145]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.1, 0.03, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        {/* Center Dust Cap */}
        <mesh position={[0, 0, 0.165]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color="#ffd166" />
        </mesh>
      </group>
    );
  }

  // 7. Level Design & Puzzles -> Stylized 3D Rubik / Puzzle Cube
  if (skillId === 'level-design') {
    return (
      <group ref={innerRef} scale={0.9}>
        <RoundedBox args={[0.4, 0.4, 0.4]} radius={0.04} smoothness={3} castShadow>
          <meshPhysicalMaterial
            color="#a855f7"
            roughness={0.2}
            clearcoat={0.7}
            transparent
            opacity={opacity}
          />
        </RoundedBox>
        {/* 3D Grid Inset Lines */}
        <mesh>
          <boxGeometry args={[0.41, 0.03, 0.41]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh>
          <boxGeometry args={[0.41, 0.41, 0.03]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    );
  }

  // 8. VFX & Particles -> Floating Magic Quad Star
  if (skillId === 'vfx-particles') {
    return (
      <group ref={innerRef} scale={0.95}>
        <mesh castShadow>
          <octahedronGeometry args={[0.32, 2]} />
          <meshPhysicalMaterial
            color="#fb7185"
            emissive="#fb7185"
            emissiveIntensity={0.6}
            roughness={0.2}
            clearcoat={0.8}
            transparent
            opacity={opacity}
          />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]} scale={0.65}>
          <octahedronGeometry args={[0.32, 2]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>
    );
  }

  // Default: Elegant Beveled Stylized Polyhedron
  return (
    <group ref={innerRef}>
      <mesh castShadow>
        <dodecahedronGeometry args={[0.26, 1]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.7 : hovered ? 0.4 : 0.15}
          roughness={0.25}
          clearcoat={0.7}
          clearcoatRoughness={0.15}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
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
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y =
        skill.position[1] + Math.sin(t * 1.5 + skill.position[0]) * 0.07;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.2;
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

  const scale = isSelected ? 1.35 : hovered ? 1.2 : isActiveCategory ? 1.0 : 0.65;
  const opacity = isActiveCategory ? 1.0 : 0.35;

  return (
    <group ref={groupRef} position={skill.position}>
      {/* 3D Model Container */}
      <group
        scale={scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <Skill3DModel
          skillId={skill.id}
          color={skill.color}
          isSelected={isSelected}
          hovered={hovered}
          opacity={opacity}
        />

        {/* Orbiting Halo Ring on Hover/Select */}
        {(hovered || isSelected) && (
          <mesh ref={ringRef} scale={1.35}>
            <ringGeometry args={[0.34, 0.38, 48]} />
            <meshBasicMaterial
              color={skill.color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
            />
          </mesh>
        )}

        {(hovered || isSelected) && (
          <pointLight color={skill.color} intensity={1.6} distance={2.2} />
        )}

        {/* Miniature Floating Sky Stone Pedestal */}
        <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.18, 0.08, 6]} />
          <meshStandardMaterial color="#64748b" roughness={0.85} />
        </mesh>
        {/* Moss / Grass Top on Pedestal */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.32, 0.3, 0.025, 6]} />
          <meshStandardMaterial color="#22c55e" roughness={0.7} />
        </mesh>
      </group>

      {/* 3D Text Label */}
      <Text
        position={[0, -0.52, 0]}
        fontSize={0.145}
        color={isSelected || hovered ? '#1e293b' : '#475569'}
        anchorX="center"
        anchorY="middle"
      >
        {skill.name}
      </Text>

      {/* Level Badge */}
      <Text
        position={[0, -0.72, 0]}
        fontSize={0.11}
        color="#15803d"
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
      coreRef.current.rotation.y = t * 0.22;
      coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.12;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.45;
      ring1Ref.current.rotation.z = t * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.38;
      ring2Ref.current.rotation.x = t * 0.55;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Ancient Zelda Sky Relic Core */}
      <group ref={coreRef} position={[0, 0, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.62, 1]} />
          <meshPhysicalMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.8}
            roughness={0.12}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* Orbiting Emerald & Cyan Runic Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.05, 0.02, 24, 64]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.7} />
        </mesh>
        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.38, 0.016, 24, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>

        <pointLight color="#facc15" intensity={2.8} distance={6.0} />
      </group>

      {/* Constellation Golden Ley-Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#facc15"
          transparent
          opacity={0.35}
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
