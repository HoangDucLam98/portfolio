import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float, ContactShadows } from '@react-three/drei';
import { soundManager } from '../../audio/audioEngine';
import { achievementsManager } from '../../game/achievements';

// Procedural texture for the Bright Cartoon Game Engine Screen
function createGameEngineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Soft clean light-blue blueprint background
    ctx.fillStyle = '#eaf2f8';
    ctx.fillRect(0, 0, 1024, 640);

    // Subtle grid
    ctx.strokeStyle = 'rgba(112, 176, 208, 0.25)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < 1024; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 640);
      ctx.stroke();
    }
    for (let y = 0; y < 640; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Top Header Bar
    ctx.fillStyle = '#d5e4ee';
    ctx.fillRect(0, 0, 1024, 52);

    ctx.fillStyle = '#38271e';
    ctx.font = 'bold 18px "Fredoka", "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🎮 GAME ENGINE NODE GRAPH // ASTRID\'S ODYSSEY', 28, 33);

    ctx.fillStyle = '#6d4c41';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText('● 60 FPS [LOCKED] | 14 Draw Calls | Unity 6', 640, 33);

    // Node 1: State Machine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(60, 100, 240, 170, 18);
    ctx.fill();
    ctx.strokeStyle = '#ff9e80';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ff9e80';
    ctx.beginPath();
    ctx.roundRect(60, 100, 240, 42, [18, 18, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('⚡ State Machine', 80, 128);

    ctx.fillStyle = '#4a332d';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('▸ Idle -> Glide (Jump)', 80, 165);
    ctx.fillText('▸ WindSpeed: 16.4 m/s', 80, 192);
    ctx.fillText('▸ Stamina: 100%', 80, 219);
    ctx.fillText('▸ Out: MoveVector3', 80, 246);

    // Node 2: Player Controller
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(380, 130, 270, 190, 18);
    ctx.fill();
    ctx.strokeStyle = '#8da178';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#8da178';
    ctx.beginPath();
    ctx.roundRect(380, 130, 270, 42, [18, 18, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🍄 PlayerController.cs', 400, 158);

    ctx.fillStyle = '#4a332d';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('▸ GravityScale: 0.85', 400, 195);
    ctx.fillText('▸ GliderDeploy: TRUE', 400, 222);
    ctx.fillText('▸ Bounciness: 0.7', 400, 249);
    ctx.fillText('▸ CelMaterial: Hero_Toon', 400, 276);
    ctx.fillText('▸ Out: WorldTransform', 400, 303);

    // Node 3: Cel Shader & Wind VFX
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(730, 170, 240, 170, 18);
    ctx.fill();
    ctx.strokeStyle = '#70b0d0';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#70b0d0';
    ctx.beginPath();
    ctx.roundRect(730, 170, 240, 42, [18, 18, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✨ Stylized Cel Shading', 750, 198);

    ctx.fillStyle = '#4a332d';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('▸ ToonSteps: 3', 750, 235);
    ctx.fillText('▸ OutlineWidth: 0.04', 750, 262);
    ctx.fillText('▸ FoliageBending: ON', 750, 289);
    ctx.fillText('▸ Status: COMPILED', 750, 316);

    // Bezier Cables
    ctx.strokeStyle = '#ff9e80';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(300, 246);
    ctx.bezierCurveTo(340, 246, 340, 222, 380, 222);
    ctx.stroke();

    ctx.strokeStyle = '#8da178';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(650, 303);
    ctx.bezierCurveTo(690, 303, 690, 262, 730, 262);
    ctx.stroke();

    // Bottom Console Bar
    ctx.fillStyle = '#d5e4ee';
    ctx.fillRect(0, 520, 1024, 120);
    ctx.fillStyle = '#2e7d32';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('✔ [SproutlingEngine] Asset bundle "Island_Flora_04.pak" loaded [100%]', 28, 555);
    ctx.fillStyle = '#b7791f';
    ctx.fillText('✔ [AudioEngine] FMOD Event "event:/Music/CozyMeadow" playing (Stereo 48kHz)', 28, 580);
    ctx.fillStyle = '#1565c0';
    ctx.fillText('▶ Game State: PLAY_MODE_ACTIVE | Nintendo Switch Controller Connected', 28, 605);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

export function WorkspaceModel() {
  const [hovered, setHovered] = useState<string | null>(null);
  const steamRef = useRef<THREE.Group>(null);
  const plantRef = useRef<THREE.Group>(null);
  const leafRef = useRef<THREE.Group>(null);

  const monitorTexture = useMemo(() => createGameEngineTexture(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Plant breathing animation
    if (plantRef.current) {
      plantRef.current.scale.set(
        1 + Math.sin(t * 1.5) * 0.02,
        1 + Math.sin(t * 1.5 + 0.5) * 0.03,
        1 + Math.sin(t * 1.5) * 0.02
      );
    }

    // Floating Green Leaf Particles
    if (leafRef.current) {
      leafRef.current.children.forEach((child, i) => {
        child.position.y = 0.8 + Math.sin(t + i) * 0.4;
        child.position.x = -1.2 + Math.cos(t * 0.8 + i * 1.5) * 0.4;
        child.position.z = -0.35 + Math.sin(t * 0.6 + i) * 0.3;
        child.rotation.y = t + i;
        child.rotation.z = Math.sin(t + i) * 0.4;
      });
    }

    // Rising Steam Bubbles
    if (steamRef.current) {
      steamRef.current.children.forEach((child, i) => {
        const p = (t * 0.7 + i * 0.33) % 1;
        child.position.y = 0.35 + p * 0.5;
        child.position.x = Math.sin(t * 2 + i) * 0.03;
        child.scale.setScalar(0.035 + p * 0.045);
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.opacity = (1 - p) * 0.65;
        }
      });
    }
  });

  const handleHover = (name: string) => {
    setHovered(name);
    soundManager.playHover();
  };

  return (
    <group position={[0, -0.25, 0]}>
      {/* ================= BACKGROUND BOOKSHELF ================= */}
      <group position={[-2.8, 1.2, -1.8]}>
        <RoundedBox args={[1.4, 2.8, 0.4]} radius={0.06} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#c89666" roughness={0.6} metalness={0.05} />
        </RoundedBox>
        {/* Books with smooth rounded covers */}
        {[-0.8, -0.2, 0.4, 1.0].map((shelfY, sIdx) => (
          <group key={`shelf-${shelfY}`} position={[0, shelfY, 0.1]}>
            {[-0.4, -0.2, 0.0, 0.2, 0.4].map((bookX, bIdx) => {
              const bookColors = ['#ff9e80', '#8da178', '#70b0d0', '#ffd166', '#d8b4fe'];
              return (
                <group key={`book-${bIdx}`} position={[bookX, 0.15, 0]}>
                  <RoundedBox args={[0.08, 0.28, 0.24]} radius={0.02} smoothness={3}>
                    <meshStandardMaterial
                      color={bookColors[(sIdx + bIdx) % bookColors.length]}
                      roughness={0.4}
                    />
                  </RoundedBox>
                </group>
              );
            })}
          </group>
        ))}
      </group>

      {/* ================= SMOOTH CHUNKY HONEY WOODEN DESK ================= */}
      {/* Table Top with Beautiful Rounded Bevels */}
      <RoundedBox
        args={[5.2, 0.16, 2.5]}
        radius={0.06}
        smoothness={8}
        position={[0, 0.4, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#d8a47f"
          roughness={0.55}
          metalness={0.03}
        />
      </RoundedBox>

      {/* Chunky Cylindrical Legs */}
      {[
        [-2.3, -0.4, -0.95],
        [2.3, -0.4, -0.95],
        [-2.3, -0.4, 0.95],
        [2.3, -0.4, 0.95],
      ].map(([x, y, z], i) => (
        <mesh key={`leg-${i}`} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.45, 32]} />
          <meshStandardMaterial color="#c68b59" roughness={0.6} />
        </mesh>
      ))}

      {/* Birch Wood Desk Riser Shelf with Rounded Edges */}
      <group position={[0, 0.54, -0.4]}>
        <RoundedBox args={[3.2, 0.09, 0.9]} radius={0.04} smoothness={6} castShadow receiveShadow>
          <meshStandardMaterial color="#faedcd" roughness={0.5} />
        </RoundedBox>
      </group>
      <group position={[-1.4, 0.47, -0.4]}>
        <RoundedBox args={[0.12, 0.08, 0.8]} radius={0.02} smoothness={4} castShadow>
          <meshStandardMaterial color="#d8a47f" />
        </RoundedBox>
      </group>
      <group position={[1.4, 0.47, -0.4]}>
        <RoundedBox args={[0.12, 0.08, 0.8]} radius={0.02} smoothness={4} castShadow>
          <meshStandardMaterial color="#d8a47f" />
        </RoundedBox>
      </group>

      {/* Smooth Rounded Desk Mat */}
      <group position={[0, 0.485, 0.35]}>
        <RoundedBox args={[2.8, 0.01, 1.2]} radius={0.05} smoothness={6} receiveShadow>
          <meshStandardMaterial color="#fefae0" roughness={0.7} />
        </RoundedBox>
      </group>

      {/* ================= SAGE GREEN CARTOON MONITOR ================= */}
      <group
        position={[0, 1.4, -0.4]}
        onPointerOver={() => handleHover('Monitor')}
        onPointerOut={() => setHovered(null)}
        onClick={() => soundManager.playClick()}
      >
        {/* Monitor Base Foot & Neck */}
        <mesh position={[0, -0.78, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.4, 0.06, 32]} />
          <meshStandardMaterial color="#8da178" roughness={0.4} metalness={0.08} />
        </mesh>
        <mesh position={[0, -0.45, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.65, 24]} />
          <meshStandardMaterial color="#7a8d66" roughness={0.4} />
        </mesh>

        {/* Sculpted Smooth Rounded Monitor Bezel */}
        <group position={[0, 0.1, 0]}>
          <RoundedBox args={[2.7, 1.6, 0.22]} radius={0.14} smoothness={8} castShadow>
            <meshStandardMaterial
              color={hovered === 'Monitor' ? '#9db288' : '#8da178'}
              roughness={0.4}
              metalness={0.05}
            />
          </RoundedBox>
        </group>

        {/* Screen Display with Texture */}
        <mesh position={[0, 0.1, 0.115]}>
          <planeGeometry args={[2.52, 1.42]} />
          <meshBasicMaterial map={monitorTexture} toneMapped={false} />
        </mesh>

        {/* Tactile Peach Power Knob */}
        <mesh position={[1.15, -0.58, 0.11]}>
          <sphereGeometry args={[0.038, 24, 24]} />
          <meshStandardMaterial color="#ff9e80" roughness={0.3} />
        </mesh>

        {/* Warm Sunlight Bounce */}
        <pointLight
          position={[0, 0.1, 0.5]}
          color="#fff2d6"
          intensity={hovered === 'Monitor' ? 1.6 : 1.2}
          distance={3.5}
        />
      </group>

      {/* ================= NINTENDO SWITCH / HANDHELD CONSOLE ================= */}
      <group
        position={[-1.0, 0.5, 0.4]}
        rotation={[-0.05, 0.15, 0]}
        onPointerOver={() => handleHover('Console')}
        onPointerOut={() => setHovered(null)}
        onClick={() => soundManager.playSuccess()}
      >
        {/* Tablet Body */}
        <RoundedBox args={[0.38, 0.024, 0.22]} radius={0.012} smoothness={4} castShadow>
          <meshStandardMaterial color="#3e2723" roughness={0.4} />
        </RoundedBox>
        {/* Screen Area */}
        <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.34, 0.18]} />
          <meshStandardMaterial color="#70b0d0" emissive="#70b0d0" emissiveIntensity={0.3} />
        </mesh>

        {/* Left Sky Blue Joy-Con (Sculpted Rounded) */}
        <group position={[-0.23, 0, 0]}>
          <RoundedBox args={[0.08, 0.024, 0.22]} radius={0.018} smoothness={4} castShadow>
            <meshStandardMaterial
              color={hovered === 'Console' ? '#80c2f0' : '#64b5f6'}
              roughness={0.35}
            />
          </RoundedBox>
          {/* Smooth Joystick */}
          <mesh position={[0, 0.02, -0.04]}>
            <sphereGeometry args={[0.02, 20, 20]} />
            <meshStandardMaterial color="#2d1c16" roughness={0.5} />
          </mesh>
        </group>

        {/* Right Coral Peach Joy-Con (Sculpted Rounded) */}
        <group position={[0.23, 0, 0]}>
          <RoundedBox args={[0.08, 0.024, 0.22]} radius={0.018} smoothness={4} castShadow>
            <meshStandardMaterial
              color={hovered === 'Console' ? '#ff9e80' : '#ff8a80'}
              roughness={0.35}
            />
          </RoundedBox>
          {/* Smooth Joystick */}
          <mesh position={[0, 0.02, 0.04]}>
            <sphereGeometry args={[0.02, 20, 20]} />
            <meshStandardMaterial color="#2d1c16" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ================= POTTED SUCCULENT PLANT ("FLORA") ================= */}
      <group
        ref={plantRef}
        position={[-1.2, 0.68, -0.35]}
        onPointerOver={() => handleHover('Plant')}
        onPointerOut={() => setHovered(null)}
        onClick={() => soundManager.playSkillSelect()}
      >
        {/* Smooth Glazed Ceramic Pot */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.19, 0.15, 0.26, 32]} />
          <meshStandardMaterial
            color="#70b0d0"
            roughness={0.25}
            metalness={0.08}
          />
        </mesh>
        {/* Pot Rim Torus for smooth glazed lip */}
        <mesh position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.19, 0.015, 16, 32]} />
          <meshStandardMaterial color="#70b0d0" roughness={0.25} />
        </mesh>
        {/* Pot Label Plate "FLORA" */}
        <group position={[0, 0, 0.185]}>
          <RoundedBox args={[0.15, 0.06, 0.012]} radius={0.005} smoothness={3}>
            <meshStandardMaterial color="#fffdfa" roughness={0.3} />
          </RoundedBox>
        </group>
        {/* Soil */}
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.175, 0.175, 0.02, 24]} />
          <meshStandardMaterial color="#5d4037" roughness={0.9} />
        </mesh>

        {/* Lush Cartoon Succulent Petals */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={`petal-${deg}`}
              position={[Math.cos(rad) * 0.09, 0.18, Math.sin(rad) * 0.09]}
              rotation={[0.35, -rad, 0]}
              castShadow
            >
              <sphereGeometry args={[0.075, 24, 24]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#8da178' : '#7ba065'}
                roughness={0.4}
              />
            </mesh>
          );
        })}
        {/* Center Bud */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial color="#9db288" roughness={0.4} />
        </mesh>
      </group>

      {/* Floating Leaf Particles */}
      <group ref={leafRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={`fl-leaf-${i}`} position={[-1.2, 0.8 + i * 0.1, -0.35]} scale={0.045}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#8da178" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ================= CHUNKY MECHANICAL KEYBOARD ================= */}
      <group
        position={[0, 0.5, 0.42]}
        onPointerOver={() => handleHover('Keyboard')}
        onPointerOut={() => setHovered(null)}
        onClick={() => soundManager.playClick()}
      >
        <RoundedBox args={[1.08, 0.03, 0.38]} radius={0.015} smoothness={4} castShadow>
          <meshStandardMaterial color="#4a332d" roughness={0.6} />
        </RoundedBox>

        {/* Smooth Rounded Keycaps */}
        {[-0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42].map((x, colIdx) =>
          [-0.1, -0.03, 0.04, 0.11].map((z, rowIdx) => {
            const keyColor =
              colIdx === 3 && rowIdx === 3
                ? '#ff9e80' // Peach Spacebar
                : colIdx % 2 === 0
                ? '#fffdfa' // Cream
                : '#8da178'; // Sage
            return (
              <group key={`pk-${colIdx}-${rowIdx}`} position={[x, 0.028, z]}>
                <RoundedBox args={[0.095, 0.022, 0.055]} radius={0.008} smoothness={3}>
                  <meshStandardMaterial color={keyColor} roughness={0.4} />
                </RoundedBox>
              </group>
            );
          })
        )}
      </group>

      {/* ================= CUTE ROUNDED MOUSE ================= */}
      <group
        position={[0.85, 0.5, 0.42]}
        onPointerOver={() => handleHover('Mouse')}
        onPointerOut={() => setHovered(null)}
        onClick={() => soundManager.playClick()}
      >
        <RoundedBox args={[0.16, 0.04, 0.24]} radius={0.03} smoothness={6} castShadow>
          <meshStandardMaterial color="#fffdfa" roughness={0.4} />
        </RoundedBox>
        {/* Sage Green Scroll Wheel */}
        <mesh position={[0, 0.024, -0.04]}>
          <cylinderGeometry args={[0.016, 0.016, 0.03, 20]} />
          <meshStandardMaterial color="#8da178" />
        </mesh>
      </group>

      {/* ================= CARVED WOODEN MUG & PUFFY STEAM ================= */}
      <group
        position={[1.2, 0.68, -0.35]}
        onPointerOver={() => handleHover('Coffee')}
        onPointerOut={() => setHovered(null)}
        onClick={() => {
          soundManager.playClick();
          achievementsManager.trackCoffeeClick();
        }}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.095, 0.24, 32]} />
          <meshStandardMaterial color="#c68b59" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.105, 32]} />
          <meshStandardMaterial color="#4e342e" roughness={0.3} />
        </mesh>
        {/* Chunky Smooth Handle */}
        <mesh position={[0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.065, 0.022, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#c68b59" roughness={0.55} />
        </mesh>

        {/* Rising Puffy Steam Bubbles */}
        <group ref={steamRef}>
          {[0, 1, 2].map((i) => (
            <mesh key={`bub-${i}`} position={[0, 0.3 + i * 0.12, 0]}>
              <sphereGeometry args={[0.055, 24, 24]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.5}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ================= FLOATING CUTE STARS, GEMS & CLOUDS ================= */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
        {/* 3D Golden Star with Soft Bevels */}
        <mesh
          position={[1.9, 2.3, -0.2]}
          onClick={() => soundManager.playSuccess()}
        >
          <octahedronGeometry args={[0.28, 2]} />
          <meshStandardMaterial
            color="#ffd166"
            emissive="#ffd166"
            emissiveIntensity={0.6}
            roughness={0.25}
          />
        </mesh>
        <pointLight position={[1.9, 2.3, -0.2]} color="#ffd166" intensity={1.5} distance={3.0} />

        {/* 3D Pastel Gem */}
        <mesh
          position={[-1.9, 2.2, -0.2]}
          onClick={() => soundManager.playSkillSelect()}
        >
          <dodecahedronGeometry args={[0.24, 2]} />
          <meshStandardMaterial
            color="#ffb4a2"
            emissive="#ff9e80"
            emissiveIntensity={0.5}
            roughness={0.25}
          />
        </mesh>
        <pointLight position={[-1.9, 2.2, -0.2]} color="#ff9e80" intensity={1.2} distance={3.0} />

        {/* Fluffy White 3D Clouds */}
        <group position={[-2.6, 2.6, -0.6]}>
          <mesh>
            <sphereGeometry args={[0.24, 24, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
          <mesh position={[0.2, -0.04, 0]}>
            <sphereGeometry args={[0.18, 24, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
          <mesh position={[-0.2, -0.04, 0]}>
            <sphereGeometry args={[0.17, 24, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
        </group>

        <group position={[2.7, 2.5, -0.6]}>
          <mesh>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
          <mesh position={[0.18, -0.03, 0]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
          <mesh position={[-0.18, -0.03, 0]}>
            <sphereGeometry args={[0.15, 24, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
        </group>
      </Float>

      {/* Ultra Soft Contact Shadow under Desk */}
      <ContactShadows
        position={[0, -1.18, 0]}
        opacity={0.45}
        scale={10}
        blur={2.2}
        far={3.5}
        color="#8d6b4f"
      />
    </group>
  );
}
