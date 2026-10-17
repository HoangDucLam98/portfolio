import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CyberGrid } from './CyberGrid';
import { FloatingParticles } from './FloatingParticles';
import { WorkspaceModel } from './WorkspaceModel';
import { SproutlingPlayer } from './SproutlingPlayer';
import { Skills3D } from './Skills3D';
import { Projects3D } from './Projects3D';
import { Contact3D } from './Contact3D';
import { CameraController } from './CameraController';
import type { SkillItem, ProjectItem, TimeOfDay } from '../../types';

function shouldUseLowPowerRendering() {
  if (typeof window === 'undefined') return false;

  const device = navigator as Navigator & { deviceMemory?: number };
  return (
    window.matchMedia('(max-width: 768px)').matches ||
    (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 4) ||
    (device.deviceMemory !== undefined && device.deviceMemory <= 4)
  );
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const environmentMap = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environmentMap;
    scene.environmentIntensity = 0.65;

    return () => {
      scene.environment = null;
      environmentMap.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene]);

  return null;
}

interface SceneContainerProps {
  activeSection: number;
  timeOfDay: TimeOfDay;
  dioramaMode: boolean;
  // Mini-game state
  isMiniGamePlaying: boolean;
  onStarsCountChange: (count: number, total: number) => void;
  onMiniGameWin: () => void;
  // Skills state
  activeSkillCategory: string;
  selectedSkill: SkillItem | null;
  onSelectSkill: (skill: SkillItem) => void;
  // Projects state
  activeProjectIndex: number;
  onSelectProject: (project: ProjectItem) => void;
  onHoverProjectIndex: (index: number) => void;
  // Contact state
  isSubmittingContact: boolean;
  isContactSuccess: boolean;
  isContactFocused: boolean;
}

export function SceneContainer({
  activeSection,
  timeOfDay,
  dioramaMode,
  isMiniGamePlaying,
  onStarsCountChange,
  onMiniGameWin,
  activeSkillCategory,
  selectedSkill,
  onSelectSkill,
  activeProjectIndex,
  onSelectProject,
  onHoverProjectIndex,
  isSubmittingContact,
  isContactSuccess,
  isContactFocused,
}: SceneContainerProps) {
  const [isLowPowerDevice, setIsLowPowerDevice] = useState(shouldUseLowPowerRendering);
  const [isReducedMotion, setIsReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const updateRenderingProfile = () => setIsLowPowerDevice(shouldUseLowPowerRendering());
    window.addEventListener('resize', updateRenderingProfile, { passive: true });
    return () => window.removeEventListener('resize', updateRenderingProfile);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const dpr: [number, number] = isLowPowerDevice ? [1, 1.25] : [1, 1.5];
  const shadowMapSize = isLowPowerDevice ? 512 : 1024;
  const primaryParticleCount = isReducedMotion ? 16 : isLowPowerDevice ? 60 : 140;
  const secondaryParticleCount = isReducedMotion ? 8 : isLowPowerDevice ? 30 : 60;

  // Vibrant, high-contrast Lighting & Color settings based on Time of Day
  const envConfig = {
    day: {
      bg: '#dbeafe',
      fogNear: 24,
      fogFar: 65,
      ambientColor: '#ffffff',
      ambientIntensity: 0.95,
      sunColor: '#fffbeb',
      sunIntensity: 3.6,
      sunPos: [8, 16, 7] as [number, number, number],
      rimColor: '#93c5fd',
      rimIntensity: 2.2,
      rimPos: [-6, 10, -6] as [number, number, number],
      fillColor: '#bfdbfe',
      fillIntensity: 0.8,
      particles1: '#facc15',
      particles2: '#38bdf8',
    },
    sunset: {
      bg: '#fed7aa',
      fogNear: 14,
      fogFar: 36,
      ambientColor: '#ffedd5',
      ambientIntensity: 0.8,
      sunColor: '#f97316',
      sunIntensity: 3.5,
      sunPos: [9, 7, 4] as [number, number, number],
      rimColor: '#c084fc',
      rimIntensity: 2.5,
      rimPos: [-6, 7, -5] as [number, number, number],
      fillColor: '#a855f7',
      fillIntensity: 1.1,
      particles1: '#ea580c',
      particles2: '#eab308',
    },
    night: {
      bg: '#0f172a',
      fogNear: 10,
      fogFar: 32,
      ambientColor: '#1e293b',
      ambientIntensity: 0.65,
      sunColor: '#38bdf8',
      sunIntensity: 1.2,
      sunPos: [4, 10, 4] as [number, number, number],
      rimColor: '#818cf8',
      rimIntensity: 1.8,
      rimPos: [-4, 7, -5] as [number, number, number],
      fillColor: '#fbbf24',
      fillIntensity: 0.8,
      particles1: '#38bdf8',
      particles2: '#f59e0b',
    },
  }[timeOfDay];

  return (
    <div className={`fixed inset-0 pointer-events-auto z-0 ${dioramaMode ? 'diorama-blur-mask' : ''}`}>
      <Canvas
        shadows={!isLowPowerDevice}
        dpr={dpr}
        camera={{ position: [0, 2.2, 6.2], fov: dioramaMode ? 36 : 45, near: 0.1, far: 100 }}
        gl={{
          antialias: !isLowPowerDevice,
          alpha: true,
          powerPreference: isLowPowerDevice ? 'low-power' : 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
      >
        <Suspense fallback={null}>
          {/* Dynamic Background & Fog */}
          <color attach="background" args={[envConfig.bg]} />
          <fog attach="fog" args={[envConfig.bg, envConfig.fogNear, envConfig.fogFar]} />

          {/* Procedural studio environment for specular gloss & reflections (no external HDR download) */}
          <StudioEnvironment />

          {/* Balanced Ambient Lighting - Eliminates Washed Out Look */}
          <ambientLight color={envConfig.ambientColor} intensity={envConfig.ambientIntensity} />
          
          {/* Key Directional Sun / Moon Light with Crisp Shadows */}
          <directionalLight
            position={envConfig.sunPos}
            intensity={envConfig.sunIntensity}
            color={envConfig.sunColor}
            castShadow={!isLowPowerDevice}
            shadow-mapSize={[shadowMapSize, shadowMapSize]}
            shadow-bias={-0.0001}
            shadow-camera-near={0.5}
            shadow-camera-far={28}
            shadow-camera-left={-7}
            shadow-camera-right={7}
            shadow-camera-top={7}
            shadow-camera-bottom={-7}
          />

          {/* Back Rim Light - Accentuates Object Silhouettes */}
          <directionalLight
            position={envConfig.rimPos}
            intensity={envConfig.rimIntensity}
            color={envConfig.rimColor}
          />

          {/* Secondary Fill Light */}
          <directionalLight
            position={[-6, 5, 4]}
            intensity={envConfig.fillIntensity}
            color={envConfig.fillColor}
          />

          {/* Cozy Night Desk Lamp Point Light */}
          {timeOfDay === 'night' && (
            <pointLight position={[0, 1.8, 0.4]} color="#ffd166" intensity={3.2} distance={6} />
          )}

          {/* Warm Floor Bounce */}
          <pointLight position={[0, -0.6, 2]} color={envConfig.particles1} intensity={0.7} distance={6} />

          {/* Global Floor and Stardust */}
          <CyberGrid />
          <FloatingParticles count={primaryParticleCount} color={envConfig.particles1} size={0.045} />
          <FloatingParticles count={secondaryParticleCount} color={envConfig.particles2} size={0.05} />

          {/* Section 0 & 1: 3D Workspace Scene */}
          {(activeSection === 0 || activeSection === 1) && (
            <group>
              <WorkspaceModel isLowPowerDevice={isLowPowerDevice} />
              {/* Playable 3D Mini-Game Character & Stars */}
              <SproutlingPlayer
                isPlaying={isMiniGamePlaying}
                onStarsCountChange={onStarsCountChange}
                onWin={onMiniGameWin}
              />
            </group>
          )}

          {/* Section 2: 3D Skills Constellation */}
          {activeSection === 2 && (
            <group>
              <Skills3D
                activeCategory={activeSkillCategory}
                selectedSkill={selectedSkill}
                onSelectSkill={onSelectSkill}
              />
            </group>
          )}

          {/* Section 3: 3D Projects Showcase Carousel */}
          {activeSection === 3 && (
            <group>
              <Projects3D
                activeIndex={activeProjectIndex}
                onSelectProject={onSelectProject}
                onHoverIndex={onHoverProjectIndex}
              />
            </group>
          )}

          {/* Section 4: 3D Contact Campfire */}
          {activeSection === 4 && (
            <group>
              <Contact3D
                isSubmitting={isSubmittingContact}
                isSuccess={isContactSuccess}
                isFocused={isContactFocused}
              />
            </group>
          )}

          {/* Scrollytelling Camera Controller (Disabled when mini-game is playing) */}
          {!isMiniGamePlaying && (
            <CameraController
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
