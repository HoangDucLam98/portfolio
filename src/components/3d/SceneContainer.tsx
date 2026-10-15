import { Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { CyberGrid } from './CyberGrid';
import { FloatingParticles } from './FloatingParticles';
import { WorkspaceModel } from './WorkspaceModel';
import { SproutlingPlayer } from './SproutlingPlayer';
import { Skills3D } from './Skills3D';
import { Projects3D } from './Projects3D';
import { Contact3D } from './Contact3D';
import { CameraController } from './CameraController';
import type { SkillItem, ProjectItem, TimeOfDay } from '../../types';

interface SceneContainerProps {
  scrollProgress: number;
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
  scrollProgress,
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
  // Vibrant, high-contrast Lighting & Color settings based on Time of Day
  const envConfig = {
    day: {
      bg: '#fff8f0',
      fogNear: 16,
      fogFar: 42,
      ambientColor: '#fff5ea',
      ambientIntensity: 0.85,
      sunColor: '#fff9e6',
      sunIntensity: 3.2,
      sunPos: [7, 14, 7] as [number, number, number],
      rimColor: '#fed7aa',
      rimIntensity: 2.2,
      rimPos: [-5, 8, -6] as [number, number, number],
      fillColor: '#93c5fd',
      fillIntensity: 0.85,
      particles1: '#f59e0b',
      particles2: '#f43f5e',
      envPreset: 'sunset' as const,
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
      envPreset: 'sunset' as const,
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
      envPreset: 'city' as const,
    },
  }[timeOfDay];

  return (
    <div className={`fixed inset-0 pointer-events-auto z-0 ${dioramaMode ? 'diorama-blur-mask' : ''}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 2.2, 6.2], fov: dioramaMode ? 36 : 45, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
      >
        <Suspense fallback={null}>
          {/* Dynamic Background & Fog */}
          <color attach="background" args={[envConfig.bg]} />
          <fog attach="fog" args={[envConfig.bg, envConfig.fogNear, envConfig.fogFar]} />

          {/* Studio HDR Environment for Specular Gloss & Reflections */}
          <Environment preset={envConfig.envPreset} environmentIntensity={0.65} />

          {/* Balanced Ambient Lighting - Eliminates Washed Out Look */}
          <ambientLight color={envConfig.ambientColor} intensity={envConfig.ambientIntensity} />
          
          {/* Key Directional Sun / Moon Light with Crisp Shadows */}
          <directionalLight
            position={envConfig.sunPos}
            intensity={envConfig.sunIntensity}
            color={envConfig.sunColor}
            castShadow
            shadow-mapSize={[2048, 2048]}
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
          <FloatingParticles count={180} color={envConfig.particles1} size={0.045} />
          <FloatingParticles count={80} color={envConfig.particles2} size={0.05} />

          {/* Section 0 & 1: 3D Workspace Scene */}
          <group visible={activeSection === 0 || activeSection === 1}>
            <WorkspaceModel />
            {/* Playable 3D Mini-Game Character & Stars */}
            <SproutlingPlayer
              isPlaying={isMiniGamePlaying}
              onStarsCountChange={onStarsCountChange}
              onWin={onMiniGameWin}
            />
          </group>

          {/* Section 2: 3D Skills Constellation */}
          <group visible={activeSection === 2}>
            <Skills3D
              activeCategory={activeSkillCategory}
              selectedSkill={selectedSkill}
              onSelectSkill={onSelectSkill}
            />
          </group>

          {/* Section 3: 3D Projects Showcase Carousel */}
          <group visible={activeSection === 3}>
            <Projects3D
              activeIndex={activeProjectIndex}
              onSelectProject={onSelectProject}
              onHoverIndex={onHoverProjectIndex}
            />
          </group>

          {/* Section 4: 3D Contact Campfire */}
          <group visible={activeSection === 4}>
            <Contact3D
              isSubmitting={isSubmittingContact}
              isSuccess={isContactSuccess}
              isFocused={isContactFocused}
            />
          </group>

          {/* Scrollytelling Camera Controller (Disabled when mini-game is playing) */}
          {!isMiniGamePlaying && (
            <CameraController
              scrollProgress={scrollProgress}
              activeSection={activeSection}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
