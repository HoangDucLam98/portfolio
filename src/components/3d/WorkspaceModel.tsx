import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float, ContactShadows, RoundedBox } from '@react-three/drei';
import { soundManager } from '../../audio/audioEngine';
import { achievementsManager } from '../../game/achievements';

// Procedural texture for the Bright Cartoon Game Engine Screen
function createGameEngineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Rich deep slate IDE background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1024, 576);

    // Subtle isometric grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1.2;
    for (let x = 0; x < 1024; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 576);
      ctx.stroke();
    }
    for (let y = 0; y < 576; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Top App Header
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 1024, 48);

    // Window controls
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath(); ctx.arc(24, 24, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(44, 24, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.beginPath(); ctx.arc(64, 24, 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🎮 SPROUTLING SKY ENGINE // HOANG DUC LAM - 3D STUDIO', 95, 29);

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('● 60 FPS [LOCKED] | Vulkan/Metal | Unity 6', 710, 29);

    // Node 1: Character State Machine
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(40, 80, 260, 175, 14);
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(40, 80, 260, 38, [14, 14, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('⚡ Sky Adventurer Controller', 58, 104);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('▸ State: Airborne / Gliding', 58, 142);
    ctx.fillText('▸ MoveSpeed: 8.5 m/s', 58, 168);
    ctx.fillText('▸ JumpForce: 12.0 N', 58, 194);
    ctx.fillText('▸ WindDrift: Active [URP]', 58, 220);

    // Node 2: Cel-Shading & Shaders
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(360, 105, 290, 195, 14);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(360, 105, 290, 38, [14, 14, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🍄 Fantasy Cel Shader & Sunburst', 378, 129);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('▸ WindDisplacement: Grass Vertex', 378, 166);
    ctx.fillText('▸ SunRays: Volumetric Golden', 378, 192);
    ctx.fillText('▸ RimHighlight: #fde047', 378, 218);
    ctx.fillText('▸ Status: COMPILED [OK]', 378, 244);
    ctx.fillText('▸ Out: TearsOfTheKingdomStyle', 378, 270);

    // Node 3: Audio & SFX
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(710, 130, 260, 175, 14);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(710, 130, 260, 38, [14, 14, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✨ FMOD Spatial Audio', 728, 154);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('▸ Event: /SFX/SkyWindBreeze', 728, 192);
    ctx.fillText('▸ MasterVolume: 100%', 728, 218);
    ctx.fillText('▸ AmbientDSP: ChirpingBirds', 728, 244);
    ctx.fillText('▸ Status: 3D SPATIAL OK', 728, 270);

    // Connecting neon splines
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(300, 220);
    ctx.bezierCurveTo(330, 220, 330, 192, 360, 192);
    ctx.stroke();

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(650, 244);
    ctx.bezierCurveTo(680, 244, 680, 218, 710, 218);
    ctx.stroke();

    // Bottom Console Bar
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 465, 1024, 111);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 12.5px "JetBrains Mono", monospace';
    ctx.fillText('✔ [SproutlingSky] Generated Zelda/Genshin Floating Sky Archipelago [100%]', 24, 498);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('✔ [GamePhysics] Object Pooling: 200 Entities Active (Survival Hero Engine)', 24, 523);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('▶ Press [G] to launch 3D Mini-Game on Island | Nintendo Switch Ready', 24, 548);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

export function WorkspaceModel({ isLowPowerDevice = false }: { isLowPowerDevice?: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const steamRef = useRef<THREE.Group>(null);
  const fanRef1 = useRef<THREE.Mesh>(null);
  const fanRef2 = useRef<THREE.Mesh>(null);
  const crystalOrbitRef = useRef<THREE.Group>(null);
  const waterfallRef = useRef<THREE.Mesh>(null);
  const screenTexture = useMemo(() => createGameEngineTexture(), []);

  // Animations: Rising steam, rotating fans, floating crystals & waterfall pulse
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (steamRef.current) {
      steamRef.current.position.y = 0.16 + Math.sin(t * 2.5) * 0.03;
      steamRef.current.rotation.y = t * 0.4;
    }
    if (fanRef1.current) {
      fanRef1.current.rotation.z = t * 8.0;
    }
    if (fanRef2.current) {
      fanRef2.current.rotation.z = t * 8.0;
    }
    if (crystalOrbitRef.current) {
      crystalOrbitRef.current.rotation.y = t * 0.4;
    }
    if (waterfallRef.current) {
      waterfallRef.current.position.y = -0.5 - ((t * 0.6) % 0.3);
    }
  });

  const handleHover = (name: string) => {
    setHovered(name);
    soundManager.playHover();
  };

  return (
    <group position={[0, 0, 0]}>

      {/* ================= 0. LUSH FLOATING SKY ISLAND (ZELDA / GENSHIN) ================= */}
      <group position={[0, -0.05, 0]}>
        {/* Main Lush Grass Top Plateau (Spans around the desk) */}
        <RoundedBox args={[4.6, 0.45, 3.2]} radius={0.3} smoothness={4} castShadow receiveShadow position={[0, 0.32, 0.05]}>
          <meshPhysicalMaterial
            color="#22c55e"
            roughness={0.65}
            clearcoat={0.25}
          />
        </RoundedBox>

        {/* Emerald Edge Turf Fringe */}
        <RoundedBox args={[4.8, 0.2, 3.4]} radius={0.25} smoothness={3} receiveShadow position={[0, 0.22, 0.05]}>
          <meshStandardMaterial color="#16a34a" roughness={0.75} />
        </RoundedBox>

        {/* Faceted Earth/Stone Stratum descending downwards */}
        <mesh position={[0, -0.65, 0.05]} castShadow>
          <cylinderGeometry args={[2.2, 1.3, 1.4, 7]} />
          <meshStandardMaterial color="#6c482f" roughness={0.9} />
        </mesh>

        {/* Inverted Tapered Stalactite Rocky Tip */}
        <mesh position={[0, -1.8, 0.05]} rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[1.35, 1.5, 6]} />
          <meshStandardMaterial color="#4a3322" roughness={0.95} />
        </mesh>

        {/* Embedded Glowing Cyan Sky Crystals in Cliff Rock */}
        <mesh position={[-1.4, -0.7, 1.1]} rotation={[0.4, 0.3, 0.2]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[1.5, -0.9, -0.8]} rotation={[-0.3, 0.5, -0.4]}>
          <octahedronGeometry args={[0.26, 0]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0.2, -1.9, 0.6]} rotation={[0.2, 0, 0.5]}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>

        {/* Miniature Cascading Sky Waterfall (Curves off edge at left-front) */}
        <group position={[-2.1, 0.1, 0.7]} rotation={[0, 0.3, 0]}>
          {/* Water Pool on Grass */}
          <mesh position={[0.1, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.35, 16]} />
            <meshPhysicalMaterial
              color="#38bdf8"
              transparent
              opacity={0.8}
              roughness={0.1}
              transmission={0.8}
            />
          </mesh>
          {/* Cascading Stream */}
          <mesh ref={waterfallRef} position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.16, 0.22, 1.4, 16]} />
            <meshPhysicalMaterial
              color="#67e8f9"
              transparent
              opacity={0.75}
              roughness={0.1}
              transmission={0.85}
              clearcoat={1.0}
            />
          </mesh>
          {/* Rising Mist Puffs */}
          <mesh position={[0, -1.3, 0]}>
            <sphereGeometry args={[0.28, 12, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
          </mesh>
        </group>

        {/* Stepping River Stones on Grass */}
        {[
          [-0.6, 0.55, 1.1],
          [-0.2, 0.55, 1.25],
          [0.3, 0.55, 1.15],
          [0.7, 0.55, 1.3],
        ].map(([x, y, z], idx) => (
          <mesh key={`stone-${idx}`} position={[x, y, z]} rotation={[0, idx * 0.7, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.14, 0.16, 0.04, 8]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.6} />
          </mesh>
        ))}

        {/* Tiny Stylized Wildflowers (Yellow, Red, Sky Blue) */}
        {[
          { pos: [-1.8, 0.56, 0.2] as [number, number, number], col: '#facc15' },
          { pos: [-1.9, 0.56, -0.4] as [number, number, number], col: '#f43f5e' },
          { pos: [1.8, 0.56, 0.8] as [number, number, number], col: '#facc15' },
          { pos: [1.9, 0.56, -0.3] as [number, number, number], col: '#38bdf8' },
          { pos: [-1.2, 0.56, 1.3] as [number, number, number], col: '#f472b6' },
          { pos: [1.3, 0.56, 1.2] as [number, number, number], col: '#4ade80' },
        ].map(({ pos, col }, idx) => (
          <group key={`flower-${idx}`} position={pos}>
            <mesh position={[0, 0.05, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color={col} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.05, 6]} />
              <meshStandardMaterial color="#15803d" />
            </mesh>
          </group>
        ))}

        {/* Orbiting Sky Shard Crystals */}
        <group ref={crystalOrbitRef} position={[0, 0.8, 0]}>
          <mesh position={[2.7, 0.4, 0]} rotation={[0.4, 0.4, 0]}>
            <octahedronGeometry args={[0.18, 0]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[-2.6, 0.2, -0.8]} rotation={[-0.3, 0.2, 0.5]}>
            <octahedronGeometry args={[0.15, 0]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
          <mesh position={[0.8, 0.6, -2.2]} rotation={[0.5, -0.2, 0.3]}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshBasicMaterial color="#4ade80" />
          </mesh>
        </group>
      </group>

      {/* ================= 1. CURATED STYLIZED WORKSPACE DESK ================= */}
      <group position={[0, 0, 0]}>
        {/* Desk Tabletop (Warm Honey Oak with Chamfered Edges) -> Surface at exactly Y = 0.60 */}
        <RoundedBox args={[3.6, 0.12, 1.8]} radius={0.06} smoothness={4} castShadow receiveShadow position={[0, 0.54, 0]}>
          <meshPhysicalMaterial
            color="#f4d3a4"
            roughness={0.28}
            clearcoat={0.35}
            clearcoatRoughness={0.2}
          />
        </RoundedBox>

        {/* Desk Pad / Mat */}
        <RoundedBox args={[2.7, 0.015, 1.2]} radius={0.03} smoothness={3} receiveShadow position={[0, 0.608, 0.05]}>
          <meshStandardMaterial color="#2d3748" roughness={0.7} />
        </RoundedBox>

        {/* 4 Sturdy Wooden Legs with Brass Footing */}
        {[
          [-1.6, 0.24, -0.72],
          [1.6, 0.24, -0.72],
          [-1.6, 0.24, 0.72],
          [1.6, 0.24, 0.72],
        ].map(([x, y, z], idx) => (
          <group key={`leg-${idx}`} position={[x, y, z]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.055, 0.045, 0.48, 24]} />
              <meshStandardMaterial color="#c48a58" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.05, 0.058, 0.08, 24]} />
              <meshStandardMaterial color="#eab308" metalness={0.75} roughness={0.25} />
            </mesh>
          </group>
        ))}

        {/* Desk Support Crossbeams */}
        <mesh position={[0, 0.42, -0.7]} castShadow>
          <boxGeometry args={[3.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#9a6438" roughness={0.5} />
        </mesh>
      </group>

      {/* ================= 2. ULTRAWIDE CURVED SCREEN & STAND ================= */}
      <group position={[0, 0.61, -0.32]}>
        {/* Heavy Aluminum Monitor Base */}
        <RoundedBox args={[0.7, 0.03, 0.3]} radius={0.015} smoothness={3} castShadow position={[0, 0.015, 0]}>
          <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.3} />
        </RoundedBox>

        {/* Vertical Stand Column */}
        <mesh position={[0, 0.46, -0.06]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 0.9, 24]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Monitor Screen Frame */}
        <group position={[0, 0.72, 0.06]} rotation={[-0.04, 0, 0]}>
          {/* Bezel Body */}
          <RoundedBox args={[2.22, 1.25, 0.06]} radius={0.03} smoothness={4} castShadow>
            <meshPhysicalMaterial
              color="#1e293b"
              roughness={0.25}
              clearcoat={0.6}
              clearcoatRoughness={0.15}
            />
          </RoundedBox>

          {/* Glowing Game Engine Display Screen */}
          <mesh position={[0, 0, 0.032]}>
            <planeGeometry args={[2.14, 1.17]} />
            <meshBasicMaterial map={screenTexture} toneMapped={false} />
          </mesh>

          {/* Webcam on top bezel */}
          <mesh position={[0, 0.61, 0.015]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
          </mesh>

          {/* Ambient Back Glow LED Strip */}
          <pointLight position={[0, 0, -0.18]} color="#38bdf8" intensity={0.9} distance={1.8} />
        </group>
      </group>

      {/* ================= 3. CUSTOM RGB GLASS GAMING PC TOWER ================= */}
      <group position={[1.32, 0.61, -0.05]} rotation={[0, -0.15, 0]}>
        <RoundedBox args={[0.42, 0.76, 0.62]} radius={0.025} smoothness={3} castShadow position={[0, 0.38, 0]}>
          <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.3} />
        </RoundedBox>

        <mesh position={[-0.215, 0.38, 0]}>
          <planeGeometry args={[0.6, 0.7]} />
          <meshPhysicalMaterial
            color="#0284c7"
            transparent
            opacity={0.4}
            roughness={0.08}
            metalness={0.1}
            transmission={0.85}
            clearcoat={1.0}
          />
        </mesh>

        <group position={[0, 0.42, 0.315]}>
          <group position={[0, 0.16, 0]}>
            <mesh ref={fanRef1}>
              <ringGeometry args={[0.08, 0.12, 24]} />
              <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
            </mesh>
            <pointLight color="#38bdf8" intensity={0.8} distance={0.9} />
          </group>

          <group position={[0, -0.16, 0]}>
            <mesh ref={fanRef2}>
              <ringGeometry args={[0.08, 0.12, 24]} />
              <meshBasicMaterial color="#f43f5e" side={THREE.DoubleSide} />
            </mesh>
            <pointLight color="#f43f5e" intensity={0.8} distance={0.9} />
          </group>
        </group>

        <pointLight position={[-0.05, 0.45, 0]} color="#a855f7" intensity={1.2} distance={0.7} />
      </group>

      {/* ================= 4. MECHANICAL KEYBOARD & MOUSE ================= */}
      <group position={[0, 0.615, 0.22]}>
        <RoundedBox args={[0.88, 0.03, 0.3]} radius={0.015} smoothness={3} castShadow position={[-0.15, 0.015, 0]}>
          <meshPhysicalMaterial color="#334155" roughness={0.3} clearcoat={0.5} />
        </RoundedBox>

        <mesh position={[-0.15, 0.035, 0]}>
          <boxGeometry args={[0.82, 0.015, 0.25]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[-0.15, 0.045, 0.09]}>
          <boxGeometry args={[0.28, 0.016, 0.035]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.25} />
        </mesh>
        <mesh position={[-0.5, 0.045, -0.09]}>
          <boxGeometry args={[0.04, 0.016, 0.035]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.25} />
        </mesh>

        <group position={[0.55, 0.018, 0.02]} rotation={[0, -0.08, 0]}>
          <RoundedBox args={[0.13, 0.038, 0.22]} radius={0.025} smoothness={4} castShadow>
            <meshPhysicalMaterial
              color="#0f172a"
              roughness={0.2}
              clearcoat={0.7}
              clearcoatRoughness={0.1}
            />
          </RoundedBox>
          <mesh position={[0, 0.022, -0.03]}>
            <cylinderGeometry args={[0.014, 0.014, 0.025, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      </group>

      {/* ================= 5. INTERACTIVE NINTENDO SWITCH ================= */}
      <group
        position={[-0.95, 0.615, 0.18]}
        rotation={[-0.04, 0.22, 0]}
        scale={1.05}
        onPointerOver={() => handleHover('Console')}
        onPointerOut={() => setHovered(null)}
        onClick={() => {
          soundManager.playSuccess();
          achievementsManager.unlock('switch_enthusiast');
        }}
      >
        <RoundedBox args={[0.38, 0.024, 0.22]} radius={0.014} smoothness={4} castShadow>
          <meshPhysicalMaterial
            color="#1e293b"
            roughness={0.2}
            clearcoat={0.7}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>

        <mesh position={[0, 0.0135, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.33, 0.18]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        <group position={[-0.23, 0, 0]}>
          <RoundedBox args={[0.08, 0.024, 0.22]} radius={0.018} smoothness={4} castShadow>
            <meshPhysicalMaterial
              color={hovered === 'Console' ? '#38bdf8' : '#0284c7'}
              roughness={0.15}
              clearcoat={0.8}
            />
          </RoundedBox>
          <mesh position={[0, 0.02, -0.04]} castShadow>
            <sphereGeometry args={[0.018, 20, 20]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
        </group>

        <group position={[0.23, 0, 0]}>
          <RoundedBox args={[0.08, 0.024, 0.22]} radius={0.018} smoothness={4} castShadow>
            <meshPhysicalMaterial
              color={hovered === 'Console' ? '#fb7185' : '#f43f5e'}
              roughness={0.15}
              clearcoat={0.8}
            />
          </RoundedBox>
          <mesh position={[0, 0.02, 0.04]} castShadow>
            <sphereGeometry args={[0.018, 20, 20]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
        </group>

        <pointLight position={[0, 0.08, 0]} color="#38bdf8" intensity={0.45} distance={0.9} />
      </group>

      {/* ================= 6. INTERACTIVE CERAMIC COFFEE MUG ================= */}
      <group
        position={[0.88, 0.615, 0.22]}
        onPointerOver={() => handleHover('Coffee')}
        onPointerOut={() => setHovered(null)}
        onClick={() => {
          soundManager.playClick();
          achievementsManager.trackCoffeeClick();
        }}
      >
        <mesh position={[0, 0.005, 0]} receiveShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.01, 32]} />
          <meshStandardMaterial color="#b45309" roughness={0.8} />
        </mesh>

        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.075, 0.21, 32]} />
          <meshPhysicalMaterial
            color="#ea580c"
            roughness={0.18}
            clearcoat={0.85}
            clearcoatRoughness={0.12}
          />
        </mesh>

        <mesh position={[0, 0.21, 0]}>
          <cylinderGeometry args={[0.082, 0.082, 0.015, 24]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.5} />
        </mesh>

        <mesh position={[0.095, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.055, 0.016, 16, 24]} />
          <meshPhysicalMaterial color="#ea580c" roughness={0.18} clearcoat={0.85} />
        </mesh>

        <group ref={steamRef} position={[0, 0.26, 0]}>
          <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.7}>
            <mesh position={[0, 0.03, 0]}>
              <sphereGeometry args={[0.026, 16, 16]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.45} />
            </mesh>
            <mesh position={[0.015, 0.07, 0.01]}>
              <sphereGeometry args={[0.032, 16, 16]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
            </mesh>
          </Float>
        </group>
      </group>

      {/* ================= 7. SUCCULENT CERAMIC PLANTER ================= */}
      <group position={[-1.38, 0.615, -0.15]} scale={0.92} onPointerOver={() => handleHover('Plant')} onPointerOut={() => setHovered(null)}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.11, 0.22, 12]} />
          <meshPhysicalMaterial
            color="#10b981"
            roughness={0.2}
            clearcoat={0.7}
          />
        </mesh>

        <mesh position={[0, 0.215, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.02, 16]} />
          <meshStandardMaterial color="#3f2e27" roughness={0.9} />
        </mesh>

        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={`petal-${deg}`}
              position={[Math.cos(rad) * 0.065, 0.26, Math.sin(rad) * 0.065]}
              rotation={[0.35, -rad, 0]}
              castShadow
            >
              <sphereGeometry args={[0.055, 18, 18]} />
              <meshPhysicalMaterial color="#4ade80" roughness={0.25} clearcoat={0.6} />
            </mesh>
          );
        })}
        <mesh position={[0, 0.31, 0]} castShadow>
          <sphereGeometry args={[0.05, 18, 18]} />
          <meshPhysicalMaterial color="#86efac" roughness={0.2} clearcoat={0.7} />
        </mesh>
      </group>

      {/* Soft Contact Shadows on Island Grass */}
      {!isLowPowerDevice && (
        <ContactShadows
          position={[0, 0.54, 0]}
          opacity={0.35}
          scale={3.8}
          blur={1.8}
          far={1.2}
        />
      )}
    </group>
  );
}
