import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, ContactShadows, RoundedBox } from '@react-three/drei';
import { soundManager } from '../../audio/audioEngine';
import { achievementsManager } from '../../game/achievements';

const baseUrl = import.meta.env.BASE_URL || '/';
const MODEL_PATH = `${baseUrl}models/developer_room.glb`;

// Procedural texture for the Bright Cartoon Game Engine Screen
function createGameEngineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Clean bright blueprint cyan background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1024, 640);

    // Dynamic grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
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
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 1024, 52);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18px "Fredoka", "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🎮 SPROUTLING ENGINE // HOANG DUC LAM - GAME DEV STUDIO', 28, 33);

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText('● 60 FPS [LOCKED] | Vulkan/Metal | Unity 6', 640, 33);

    // Node 1: Character State Machine
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(50, 95, 260, 180, 18);
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(50, 95, 260, 42, [18, 18, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('⚡ Character State Machine', 70, 122);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('▸ State: Running / Airborne', 70, 160);
    ctx.fillText('▸ MoveSpeed: 8.5 m/s', 70, 188);
    ctx.fillText('▸ JumpForce: 12.0 N', 70, 216);
    ctx.fillText('▸ Out: RigidbodyVelocity', 70, 244);

    // Node 2: Procedural Shader & Cel-Shading
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(370, 120, 280, 200, 18);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(370, 120, 280, 42, [18, 18, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🍄 Stylized Cel Shader Pass', 390, 148);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('▸ LightBands: 3 Steps Toon', 390, 185);
    ctx.fillText('▸ RimHighlight: #fed7aa', 390, 212);
    ctx.fillText('▸ ClearcoatRough: 0.1', 390, 239);
    ctx.fillText('▸ Out: PhysicalShading', 390, 266);
    ctx.fillText('▸ Status: COMPILED [OK]', 390, 293);

    // Node 3: Quest & Audio System
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(710, 150, 260, 180, 18);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(710, 150, 260, 42, [18, 18, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✨ FMOD Spatial Audio', 730, 178);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('▸ Event: /SFX/GoldenStar', 730, 215);
    ctx.fillText('▸ MasterVolume: 100%', 730, 242);
    ctx.fillText('▸ Polyphony: 32 Channels', 730, 269);
    ctx.fillText('▸ DSP Status: ACTIVE', 730, 296);

    // Neon Connecting Curves
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(310, 244);
    ctx.bezierCurveTo(340, 244, 340, 212, 370, 212);
    ctx.stroke();

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(650, 266);
    ctx.bezierCurveTo(680, 266, 680, 242, 710, 242);
    ctx.stroke();

    // Bottom Console Bar
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 520, 1024, 120);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('✔ [SproutlingStudio] Loaded 4 Shipped Mobile Game Projects [100%]', 28, 555);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('✔ [GamePhysics] Object Pooling: 200 Entities Active (Survival Hero Engine)', 28, 580);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('▶ Press [G] to launch 3D Mini-Game on Desk | Nintendo Switch Connected', 28, 605);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

export function WorkspaceModel() {
  const [hovered, setHovered] = useState<string | null>(null);
  const steamRef = useRef<THREE.Group>(null);
  const screenTexture = useMemo(() => createGameEngineTexture(), []);

  // Load the High Quality 3D Developer Room Model
  const gltf = useGLTF(MODEL_PATH);

  // Clone and enrich materials with vibrant PBR & textures
  const enrichedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Upgrade material properties for vibrant stylized toy/clay look
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.roughness = Math.min(mat.roughness ?? 0.5, 0.38);
          mat.metalness = Math.max(mat.metalness ?? 0, 0.04);
          mat.envMapIntensity = 1.3;

          // Replace PC screen material with our glowing procedural game engine texture
          if (mesh.name === 'Plane020' || mesh.name === 'PC Screen' || mesh.name.includes('Screen')) {
            mesh.material = new THREE.MeshBasicMaterial({
              map: screenTexture,
              toneMapped: false,
            });
          }

          // Glowing LED fans on PC Tower
          if (mesh.name.includes('Tower') || mesh.name.includes('Cube006_2')) {
            mat.emissive = new THREE.Color('#38bdf8');
            mat.emissiveIntensity = 0.6;
          }
        }
      }
    });

    return clone;
  }, [gltf.scene, screenTexture]);

  // Gentle steam animation for coffee mug
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (steamRef.current) {
      steamRef.current.position.y = 0.18 + Math.sin(t * 2.5) * 0.04;
      steamRef.current.rotation.y = t * 0.4;
    }
  });

  const handleHover = (name: string) => {
    setHovered(name);
    soundManager.playHover();
  };

  return (
    <group position={[0, -0.2, 0]}>
      {/* ================= HIGH-QUALITY 3D DEVELOPER ISOMETRIC ROOM ================= */}
      <group
        scale={0.098}
        position={[0.32, -0.15, 0.35]}
        rotation={[0, -Math.PI * 0.48, 0]}
      >
        <primitive object={enrichedScene} />
      </group>

      {/* ================= EXTRA INTERACTIVE PROP 1: NINTENDO SWITCH ================= */}
      <group
        position={[-0.85, 0.56, 0.65]}
        rotation={[-0.05, 0.25, 0]}
        scale={1.15}
        onPointerOver={() => handleHover('Console')}
        onPointerOut={() => setHovered(null)}
        onClick={() => {
          soundManager.playSuccess();
          achievementsManager.unlock('switch_enthusiast');
        }}
      >
        {/* Tablet Body */}
        <RoundedBox args={[0.38, 0.024, 0.22]} radius={0.012} smoothness={4} castShadow>
          <meshPhysicalMaterial
            color="#1e293b"
            roughness={0.2}
            clearcoat={0.7}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>
        {/* Glowing Screen */}
        <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.34, 0.18]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Left Electric Cyan Joy-Con */}
        <group position={[-0.23, 0, 0]}>
          <RoundedBox args={[0.08, 0.024, 0.22]} radius={0.018} smoothness={4} castShadow>
            <meshPhysicalMaterial
              color={hovered === 'Console' ? '#38bdf8' : '#0284c7'}
              roughness={0.15}
              clearcoat={0.8}
            />
          </RoundedBox>
          <mesh position={[0, 0.02, -0.04]}>
            <sphereGeometry args={[0.02, 20, 20]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
        </group>

        {/* Right Neon Coral Joy-Con */}
        <group position={[0.23, 0, 0]}>
          <RoundedBox args={[0.08, 0.024, 0.22]} radius={0.018} smoothness={4} castShadow>
            <meshPhysicalMaterial
              color={hovered === 'Console' ? '#fb7185' : '#f43f5e'}
              roughness={0.15}
              clearcoat={0.8}
            />
          </RoundedBox>
          <mesh position={[0, 0.02, 0.04]}>
            <sphereGeometry args={[0.02, 20, 20]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
        </group>

        <pointLight position={[0, 0.1, 0]} color="#38bdf8" intensity={0.5} distance={1.2} />
      </group>

      {/* ================= EXTRA INTERACTIVE PROP 2: CARVED COFFEE MUG ================= */}
      <group
        position={[1.15, 0.58, 0.35]}
        onPointerOver={() => handleHover('Coffee')}
        onPointerOut={() => setHovered(null)}
        onClick={() => {
          soundManager.playClick();
          achievementsManager.trackCoffeeClick();
        }}
      >
        {/* Ceramic Mug Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.11, 0.09, 0.22, 32]} />
          <meshPhysicalMaterial
            color="#ea580c"
            roughness={0.2}
            clearcoat={0.7}
            clearcoatRoughness={0.15}
          />
        </mesh>
        {/* Creamy Foam */}
        <mesh position={[0, 0.095, 0]}>
          <cylinderGeometry args={[0.095, 0.095, 0.02, 24]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.6} />
        </mesh>
        {/* Mug Handle */}
        <mesh position={[0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.065, 0.02, 16, 24]} />
          <meshPhysicalMaterial color="#ea580c" roughness={0.2} clearcoat={0.7} />
        </mesh>

        {/* Puffy Steam Particles */}
        <group ref={steamRef} position={[0, 0.16, 0]}>
          <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.8}>
            <mesh position={[0, 0.04, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
            </mesh>
            <mesh position={[0.02, 0.09, 0.01]}>
              <sphereGeometry args={[0.042, 16, 16]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
            </mesh>
          </Float>
        </group>
      </group>

      {/* ================= EXTRA INTERACTIVE PROP 3: FLORA SUCCULENT POT ================= */}
      <group
        position={[-1.25, 0.58, -0.1]}
        scale={0.9}
        onPointerOver={() => handleHover('Plant')}
        onPointerOut={() => setHovered(null)}
        onClick={() => soundManager.playSkillSelect()}
      >
        {/* Pastel Ceramic Pot */}
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.12, 0.22, 32]} />
          <meshPhysicalMaterial
            color="#10b981"
            roughness={0.25}
            clearcoat={0.6}
          />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.145, 0.145, 0.02, 24]} />
          <meshStandardMaterial color="#3f2e27" roughness={0.9} />
        </mesh>
        {/* Plump Jade Succulent Petals */}
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={`succulent-${deg}`}
              position={[Math.cos(rad) * 0.07, 0.15, Math.sin(rad) * 0.07]}
              rotation={[0.35, -rad, 0]}
              castShadow
            >
              <sphereGeometry args={[0.065, 20, 20]} />
              <meshPhysicalMaterial
                color="#4ade80"
                roughness={0.25}
                clearcoat={0.5}
              />
            </mesh>
          );
        })}
        {/* Center Bud */}
        <mesh position={[0, 0.21, 0]} castShadow>
          <sphereGeometry args={[0.06, 20, 20]} />
          <meshPhysicalMaterial color="#86efac" roughness={0.25} clearcoat={0.6} />
        </mesh>
      </group>

      {/* Soft Contact Shadows on Table Surface */}
      <ContactShadows
        position={[0, 0.53, 0.2]}
        opacity={0.45}
        scale={3.6}
        blur={1.8}
        far={1.2}
      />
    </group>
  );
}

// Preload the model asset so there is zero latency upon opening
useGLTF.preload(MODEL_PATH);
