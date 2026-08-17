import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CyberGrid } from './CyberGrid';
import { FloatingParticles } from './FloatingParticles';
import { WorkspaceModel } from './WorkspaceModel';
import { Skills3D } from './Skills3D';
import { Projects3D } from './Projects3D';
import { Contact3D } from './Contact3D';
import { CameraController } from './CameraController';
import type { SkillItem, ProjectItem } from '../../types';

interface SceneContainerProps {
  scrollProgress: number;
  activeSection: number;
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
  return (
    <div className="fixed inset-0 pointer-events-auto z-0">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 2.2, 6.2], fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          {/* Bright Cozy Atmospheric Lighting */}
          <color attach="background" args={['#fbf3ea']} />
          <fog attach="fog" args={['#fbf3ea', 12, 34]} />

          <ambientLight color="#fff8ee" intensity={1.8} />
          
          {/* Warm Sunbeam Key Light */}
          <directionalLight
            position={[6, 14, 6]}
            intensity={2.2}
            color="#fff2d6"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={0.5}
            shadow-camera-far={25}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
          />

          {/* Soft Sky Blue Fill Light */}
          <directionalLight
            position={[-6, 6, -4]}
            intensity={0.8}
            color="#70b0d0"
          />

          {/* Warm Floor Ambient Bounce */}
          <pointLight position={[0, -0.6, 2]} color="#ffd166" intensity={0.7} distance={6} />

          {/* Global Floor and Soft Stardust Atmosphere */}
          <CyberGrid />
          <FloatingParticles count={180} color="#ffd166" size={0.045} />
          <FloatingParticles count={80} color="#ff9e80" size={0.05} />

          {/* Section 0 & 1: 3D Workspace Scene */}
          <group visible={activeSection === 0 || activeSection === 1}>
            <WorkspaceModel />
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

          {/* Scrollytelling Camera Controller */}
          <CameraController
            scrollProgress={scrollProgress}
            activeSection={activeSection}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
