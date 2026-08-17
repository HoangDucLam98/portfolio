import type { SkillItem } from '../types';

export const skillsData: SkillItem[] = [
  // Gameplay Programming
  {
    id: "csharp-unity",
    name: "C# & Unity 6",
    category: "gameplay",
    level: 98,
    iconName: "Gamepad2",
    color: "#a3b18a",
    description: "Character controllers, state machines, Cinemachine cameras, DOTS physics, and modular game architectures.",
    projectsCount: 22,
    position: [-2.4, 1.2, 0.4]
  },
  {
    id: "cpp-unreal",
    name: "C++ & Unreal Engine 5",
    category: "engine",
    level: 92,
    iconName: "Cpu",
    color: "#8ecae6",
    description: "Gameplay Ability System (GAS), memory management, custom actor components, and multiplayer replication.",
    projectsCount: 14,
    position: [-1.2, 2.2, -0.6]
  },
  {
    id: "godot",
    name: "Godot 4 & GDScript",
    category: "engine",
    level: 94,
    iconName: "Sparkles",
    color: "#ffb4a2",
    description: "Node tree architecture, 2D/3D physics pipelines, tilemap mechanics, and zero-overhead WebGL exports.",
    projectsCount: 16,
    position: [1.2, 2.0, 0.5]
  },
  {
    id: "cel-shaders",
    name: "HLSL / GLSL Cel-Shading",
    category: "graphics",
    level: 96,
    iconName: "Palette",
    color: "#ffe5b4",
    description: "Stylized toon lighting, ink-line outlines, vertex wind displacement, dynamic water, and custom post-processing.",
    projectsCount: 26,
    position: [2.5, 1.0, -0.4]
  },
  // Graphics & Art
  {
    id: "blender-lowpoly",
    name: "Blender 3D Stylized Art",
    category: "graphics",
    level: 90,
    iconName: "Box",
    color: "#d8b4fe",
    description: "Low-poly modeling, UV unwrapping, stylized hand-painted textures, rigging, and keyframe cartoon animation.",
    projectsCount: 30,
    position: [2.2, -0.8, 0.8]
  },
  {
    id: "vfx-particles",
    name: "VFX & Particle Systems",
    category: "graphics",
    level: 91,
    iconName: "Zap",
    color: "#ffb4a2",
    description: "Niagara & Unity Shuriken VFX, explosive cartoon impacts, slash trails, magical sparkles, and floating fireflies.",
    projectsCount: 19,
    position: [1.0, -1.8, -0.5]
  },
  // Gameplay & Physics
  {
    id: "game-physics",
    name: "Physics & Ragdolls",
    category: "gameplay",
    level: 93,
    iconName: "Activity",
    color: "#8ecae6",
    description: "Bouncy spring kinematics, joint constraints, buoyancy simulation, and momentum-based platforming controllers.",
    projectsCount: 18,
    position: [-0.9, -2.1, 0.6]
  },
  {
    id: "game-ai",
    name: "Game AI & Behavior Trees",
    category: "gameplay",
    level: 88,
    iconName: "Brain",
    color: "#a3b18a",
    description: "NavMesh pathfinding, hierarchical finite state machines (HFSM), enemy combat algorithms, and creature companion AI.",
    projectsCount: 15,
    position: [-2.3, -0.9, -0.7]
  },
  // Audio & Design
  {
    id: "fmod-audio",
    name: "FMOD & Spatial Audio",
    category: "audio-design",
    level: 86,
    iconName: "Volume2",
    color: "#ffe5b4",
    description: "Adaptive dynamic music layering, 3D sound occlusion, footstep surface switchers, and procedural chiptune SFX.",
    projectsCount: 12,
    position: [-2.8, 0.1, 0.9]
  },
  {
    id: "threejs-webgl",
    name: "Three.js & WebGL Games",
    category: "engine",
    level: 95,
    iconName: "Globe",
    color: "#8ecae6",
    description: "Browser-native 3D games, custom render passes, instanced meshes, and mobile touch/gamepad integration.",
    projectsCount: 20,
    position: [0.0, 2.5, 0.2]
  },
  {
    id: "level-design",
    name: "Level Design & Puzzles",
    category: "audio-design",
    level: 92,
    iconName: "Layers",
    color: "#d8b4fe",
    description: "Environmental storytelling, puzzle gating, pacing curves, blockout prototyping, and camera choreography.",
    projectsCount: 24,
    position: [2.7, 0.2, 0.3]
  },
  {
    id: "git-ci",
    name: "Git LFS & Steam Pipelines",
    category: "audio-design",
    level: 89,
    iconName: "GitBranch",
    color: "#a3b18a",
    description: "Git Large File Storage (LFS), automated SteamPipe build deployments, and multi-platform packaging workflows.",
    projectsCount: 28,
    position: [0.1, -2.4, 0.2]
  }
];
