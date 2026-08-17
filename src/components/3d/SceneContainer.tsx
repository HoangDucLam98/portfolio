import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
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
  // Lighting & Color settings based on Time of Day
  const envConfig = {
    day: {
      bg: '#fbf3ea',
      fogNear: 12,
      fogFar: 34,
      ambientColor: '#fff8ee',
      ambientIntensity: 1.8,
      sunColor: '#fff2d6',
      sunIntensity: 2.2,
      sunPos: [6, 14, 6] as [number, number, number],
      fillColor: '#70b0d0',
      fillIntensity: 0.8,
      particles1: '#ffd166',
      particles2: '#ff9e80',
    },
    sunset: {
      bg: '#fad2b0',
      fogNear: 10,
      fogFar: 30,
      ambientColor: '#ffe5b4',
      ambientIntensity: 1.5,
      sunColor: '#ff9a60',
      sunIntensity: 2.6,
      sunPos: [10, 8, 4] as [number, number, number],
      fillColor: '#9b5de5',
      fillIntensity: 1.1,
      particles1: '#ff9e80',
      particles2: '#ffd166',
    },
    night: {
      bg: '#131722',
      fogNear: 8,
      fogFar: 28,
      ambientColor: '#1e2436',
      ambientIntensity: 0.9,
      sunColor: '#70b0d0',
      sunIntensity: 0.8,
      sunPos: [4, 10, 4] as [number, number, number],
      fillColor: '#ffd166',
      fillIntensity: 0.6,
      particles1: '#70b0d0',
      particles2: '#ffd166',
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
        }}
      >
        <Suspense fallback={null}>
          {/* Dynamic Background & Fog */}
          <color attach="background" args={[envConfig.bg]} />
          <fog attach="fog" args={[envConfig.bg, envConfig.fogNear, envConfig.fogFar]} />

          {/* Ambient Lighting */}
          <ambientLight color={envConfig.ambientColor} intensity={envConfig.ambientIntensity} />
          
          {/* Key Directional Sun / Moon Light */}
          <directionalLight
            position={envConfig.sunPos}
            intensity={envConfig.sunIntensity}
            color={envConfig.sunColor}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={0.5}
            shadow-camera-far={25}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
          />

          {/* Secondary Fill Light */}
          <directionalLight
            position={[-6, 6, -4]}
            intensity={envConfig.fillIntensity}
            color={envConfig.fillColor}
          />

          {/* Cozy Night Desk Lamp Point Light */}
          {timeOfDay === 'night' && (
            <pointLight position={[0, 1.8, 0.4]} color="#ffd166" intensity={2.8} distance={5} />
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
