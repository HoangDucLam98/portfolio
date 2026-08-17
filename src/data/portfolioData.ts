import type { ProjectItem } from '../types';

export const personalInfo = {
  name: "Hoang Duc Lam",
  title: "Gameplay Programmer & Technical 3D Game Artist",
  tagline: "Crafting wholesome, physics-driven 3D worlds, mobile game mechanics, and engaging gameplay experiences.",
  location: "Vietnam / Remote Worldwide",
  availability: "Open for Game Development & Technical Art Roles",
  bio: "Passionate Game Developer & Technical Artist with a strong track record of designing, building, and publishing mobile 3D games across puzzle, action RPG, and simulation genres. Specializing in Unity 6, C#, shader programming, gameplay physics, performance optimization, and mobile store deployment.",
  stats: [
    { label: "Shipped Games", value: "4+ Published" },
    { label: "Total Downloads", value: "500k+" },
    { label: "Physics & Shaders", value: "24+" },
    { label: "Target Platforms", value: "Android / iOS / Web" },
  ],
  experience: [
    {
      period: "2023 — Present",
      role: "Lead Gameplay Programmer",
      company: "Mobile Game Studio",
      description: "Architected core gameplay mechanics, custom character controllers, AI crowd systems, and UI pipelines for published 3D mobile titles with over 500k+ organic downloads."
    },
    {
      period: "2021 — 2023",
      role: "Game Developer & Technical Artist",
      company: "Indie Game Lab",
      description: "Developed custom shaders, particle VFX, ragdoll physics solvers, and mobile render pipeline (URP) optimizations to guarantee locked 60 FPS across low-end to flagship mobile devices."
    },
    {
      period: "2019 — 2021",
      role: "Junior Unity Game Programmer",
      company: "Interactive Play Labs",
      description: "Implemented state machines, touch gesture input handlers, level progression systems, audio pipelines, and Google Play Store SDK integrations."
    }
  ],
  socials: {
    github: "https://github.com/HoangDucLam98",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "lamhd98@gmail.com",
    discord: "https://discord.com"
  }
};

export const projectsData: ProjectItem[] = [
  {
    id: "color-flow-puzzle",
    title: "Color Flow Puzzle",
    subtitle: "Minimalist Color Connection & Flow Puzzle Game",
    category: "Cozy Sim",
    description: "A satisfying, relaxing logic puzzle game where players connect matching color nodes with flowing pipes without intersecting or crossing paths.",
    longDescription: "Color Flow Puzzle features smooth grid-based pathfinding algorithms, custom dynamic line rendering shaders, and haptic feedback. Designed with a clean pastel visual aesthetic and progressive level difficulty, ensuring zero lag and ultra-low battery consumption on mobile devices.",
    features: [
      "Smooth bezier curve line drawing and real-time color blending",
      "500+ handcrafted puzzle levels with intelligent hint system",
      "Tactile haptic vibrations and satisfying acoustic audio feedback",
      "Optimized memory footprint (< 35MB) with instant boot time"
    ],
    techStack: ["Unity 6", "C#", "Custom Shader Graph", "DOTween", "Mobile Touch API", "Android SDK"],
    metrics: [
      { label: "Platform", value: "Google Play" },
      { label: "Rating", value: "4.8 ★ Positive" },
      { label: "Frame Rate", value: "60 FPS Locked" }
    ],
    liveUrl: "https://play.google.com/store/apps/details?id=com.color.flow.puzzle",
    githubUrl: "https://github.com/HoangDucLam98/portfolio",
    color: "#8da178",
    glowColor: "rgba(141, 161, 120, 0.4)",
    modelType: "potion"
  },
  {
    id: "survival-hero",
    title: "Survival Hero: Action RPG",
    subtitle: "Fast-Paced Roguelite Action Survival with Dynamic Combat",
    category: "Indie Game",
    description: "An adrenaline-fueled top-down roguelite action RPG where heroes battle relentless monster hordes using procedural skill synergies and elemental combos.",
    longDescription: "Built with high-performance object pooling architecture to seamlessly handle 200+ simultaneous on-screen enemy entities at 60 FPS. Features dynamic damage number floating animations, directional hit-stop physics, diverse hero talent trees, and procedural loot dropping mechanics.",
    features: [
      "Massive enemy crowd flocking AI with zero garbage collection spikes",
      "Deep roguelite skill combo trees (Fire Tornadoes, Lightning Orbs, Holy Blades)",
      "Dynamic hitstop physics impact and screen-shake combat feel",
      "Custom stylized Shuriken VFX and multi-layered FMOD audio mix"
    ],
    techStack: ["Unity 6", "C#", "Object Pooling", "Particle Shuriken VFX", "Spine 2D/3D", "Android / APKPure"],
    metrics: [
      { label: "Platform", value: "Google Play / APKPure" },
      { label: "Max Entities", value: "200+ Active" },
      { label: "Play Time", value: "Endless Roguelike" }
    ],
    liveUrl: "https://apkpure.com/vn/survival-hero-action-rpg-game/com.nmg.survivalhero",
    githubUrl: "https://github.com/HoangDucLam98/portfolio",
    color: "#ff8a80",
    glowColor: "rgba(255, 138, 128, 0.4)",
    modelType: "star"
  },
  {
    id: "supermarket-journey",
    title: "Supermarket Journey",
    subtitle: "Immersive 3D Retail Tycoon & Store Management Simulator",
    category: "Gameplay & Physics",
    description: "A first-person 3D store simulator where players stock shelves, set competitive market prices, scan customer items, and expand their retail supermarket empire.",
    longDescription: "Supermarket Journey combines first-person physical object placement with comprehensive retail economics. Features NavMesh customer AI queuing at checkout counters, interactive cash register scanning mechanics, dynamic product restocking delivery physics, and customizable store layouts.",
    features: [
      "First-person 3D shelf stocking with realistic snap-to-grid box physics",
      "Intelligent customer NPC AI with shopping carts, pathfinding, and patience meters",
      "Real-time dynamic pricing algorithm with wholesale market fluctuation",
      "Custom stylized low-poly 3D models and bakery/grocery assets"
    ],
    techStack: ["Unity 6", "C#", "NavMesh AI", "Universal Render Pipeline (URP)", "Blender 3D", "Android SDK"],
    metrics: [
      { label: "Platform", value: "Google Play" },
      { label: "Genre", value: "3D Tycoon Sim" },
      { label: "Performance", value: "Solid 60 FPS" }
    ],
    liveUrl: "https://play.google.com/store/apps/details?id=com.supermarket.journey",
    githubUrl: "https://github.com/HoangDucLam98/portfolio",
    color: "#ffd166",
    glowColor: "rgba(255, 209, 102, 0.4)",
    modelType: "cartridge"
  },
  {
    id: "prison-escape-journey",
    title: "Prison Escape Journey Simulator",
    subtitle: "Tactical Stealth Sandbox & Physics Puzzle Escape Game",
    category: "3D & Shaders",
    description: "A thrilling stealth puzzle simulator where players outsmart prison guards, bypass surveillance cameras, solve environmental locks, and plan elaborate escapes.",
    longDescription: "Engineered with custom vision cone field-of-view shaders, real-time guard hearing radius systems, and physics-driven distraction objects. Players crawl through ventilation shafts, disguise themselves in uniforms, and execute synchronized timing maneuvers to reach extraction points.",
    features: [
      "Custom mesh-generated vision cones with dynamic wall occlusion shaders",
      "Ragdoll physics interactions with throwable distraction tools and traps",
      "Multi-route sandbox level design with ventilation, tunnels, and rooftops",
      "Cinemachine dynamic camera choreography during stealth takedowns"
    ],
    techStack: ["Unity 6", "C#", "Custom HLSL Vision Shaders", "Ragdoll Physics", "Cinemachine", "Google Play"],
    metrics: [
      { label: "Platform", value: "Google Play" },
      { label: "Stealth Levels", value: "60+ Escape Quests" },
      { label: "Shader Pass", value: "Custom Occlusion" }
    ],
    liveUrl: "https://play.google.com/store/apps/details?id=com.prison.escape.journey.simulator",
    githubUrl: "https://github.com/HoangDucLam98/portfolio",
    color: "#70b0d0",
    glowColor: "rgba(112, 176, 208, 0.4)",
    modelType: "gem"
  }
];
