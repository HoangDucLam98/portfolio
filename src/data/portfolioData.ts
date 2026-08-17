import type { ProjectItem } from '../types';

export const personalInfo = {
  name: "Alex Vance",
  title: "Gameplay Programmer & Technical 3D Game Artist",
  tagline: "Crafting wholesome, physics-driven 3D worlds, charming mechanics, and unforgettable indie game experiences.",
  location: "Vancouver, BC / Remote Worldwide",
  availability: "Open for Indie Game Collabs & Technical Art Roles",
  bio: "Passionate Game Developer with 6+ years specializing in stylized 3D graphics, physics-driven gameplay mechanics, custom cel-shaders, and cross-platform indie games (Unity, Unreal Engine, Godot, WebGL). I love turning playful ideas into living, breathing cartoon worlds that bring wonder to players of all ages.",
  stats: [
    { label: "Shipped Games", value: "5+" },
    { label: "Active Players", value: "450k+" },
    { label: "Custom Cel Shaders", value: "24+" },
    { label: "Game Jams Won", value: "8" },
  ],
  experience: [
    {
      period: "2024 — Present",
      role: "Lead Gameplay Engineer",
      company: "Sproutling Game Studio",
      description: "Directed core physics mechanics, character controller feel, and stylized rendering pipelines for a whimsical 3D adventure game nominated for Indie Game of the Year."
    },
    {
      period: "2022 — 2024",
      role: "Technical Artist & Shader Dev",
      company: "Starfall Interactive",
      description: "Authored custom HLSL/GLSL cel-shading graphs, interactive foliage bending, dynamic water shaders, and procedural world generators running at solid 60 FPS on mobile and Nintendo Switch."
    },
    {
      period: "2020 — 2022",
      role: "Junior 3D Game Programmer",
      company: "Moonbeam Play Labs",
      description: "Implemented AI behavior trees, UI inventory systems, inventory puzzles, and cross-platform multiplayer netcode using Unity and C#."
    }
  ],
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "alex.vance.games@gmail.com",
    discord: "https://discord.com"
  }
};

export const projectsData: ProjectItem[] = [
  {
    id: "astrids-odyssey",
    title: "Astrid's Odyssey",
    subtitle: "3D Whimsical Adventure & Physics Puzzle RPG",
    category: "Indie Game",
    description: "A cozy open-world exploration adventure where players sail between floating sky islands, solving environmental wind puzzles and befriending magical spirit creatures.",
    longDescription: "Astrid's Odyssey was built in Unity with custom C# physics solvers and a hand-crafted cel-shading pipeline. Players control Astrid as she glides on wind currents, manipulates magnetic relics, and explores vibrant islands. Features custom vertex-displacement grass, dynamic cloud volumes, and interactive creature AI that learns from player gestures.",
    features: [
      "Custom momentum-based glider physics with thermal updraft mechanics",
      "Interactive procedural wind system affecting grass, trees, and sails",
      "Dynamic day/night cycle with cozy starry night cel-shading",
      "Spatial audio engine with adaptive chiptune/acoustic soundtrack"
    ],
    techStack: ["Unity 6", "C#", "HLSL Cel Shaders", "Blender", "FMOD Audio", "Cinemachine"],
    metrics: [
      { label: "Target Platform", value: "PC / Switch / Web" },
      { label: "Frame Rate", value: "60 FPS Locked" },
      { label: "Wishlists", value: "35,000+" }
    ],
    liveUrl: "https://example.com/astrids-odyssey",
    githubUrl: "https://github.com/example/astrids-odyssey",
    color: "#a3b18a",
    glowColor: "rgba(163, 177, 138, 0.4)",
    modelType: "star"
  },
  {
    id: "sproutling-valley",
    title: "Sproutling Valley",
    subtitle: "Cozy Creature Alchemy & Botanical Sim",
    category: "Cozy Sim",
    description: "A charming village builder where you cultivate magical botanical familiars, brew whimsical potions, and restore balance to an enchanted forest.",
    longDescription: "Created with Godot 4 and WebGL, Sproutling Valley emphasizes tactile cozy interactions. Players drag, drop, harvest, and blend ingredients with custom bouncy spring physics. The custom tilemap lighting and warm claymorphism aesthetic create a deeply calming atmosphere.",
    features: [
      "Tactile drag-and-drop alchemy cauldron with fluid particle dynamics",
      "30+ Unique botanical creature species with distinct genetics and traits",
      "Seasonal weather events with real-time rain puddles and snow blankets",
      "Browser-playable zero-install WebGL export with instant save states"
    ],
    techStack: ["Godot 4", "GDScript / C#", "Custom GLSL", "Aseprite", "Wasm/WebGL"],
    metrics: [
      { label: "Player Rating", value: "98% Overwhelmingly Positive" },
      { label: "Play Time", value: "15+ Hours" },
      { label: "Bundle Size", value: "< 28MB WebGL" }
    ],
    liveUrl: "https://example.com/sproutling-valley",
    githubUrl: "https://github.com/example/sproutling-valley",
    color: "#ffb4a2",
    glowColor: "rgba(255, 180, 162, 0.4)",
    modelType: "potion"
  },
  {
    id: "chronoblade-arena",
    title: "ChronoBlade Arena",
    subtitle: "Fast-Paced Cel-Shaded Action Brawler",
    category: "Gameplay & Physics",
    description: "A high-octane 3D anime-inspired arena combat game with time-manipulation parries, aerial juggling combos, and vibrant impact VFX.",
    longDescription: "Engineered in Unreal Engine 5 with custom gameplay ability systems (GAS) and frame-accurate hitboxes. Players slow time with precision dodges and chain elemental weapon transformations. Built with GPU particle bursts, motion trails, and zero input lag networking.",
    features: [
      "Frame-accurate collision detection with directional hitstop impact",
      "Time-dilation mechanics with localized bullet-time spheres",
      "Custom anime cel-shader with ink-line outline post-processing",
      "Local co-op and rollback netcode online multiplayer"
    ],
    techStack: ["Unreal Engine 5", "C++", "Niagara VFX", "HLSL", "Blender"],
    metrics: [
      { label: "Input Latency", value: "< 8ms" },
      { label: "Steam Demo Plays", value: "120,000+" },
      { label: "Physics Substeps", value: "120 Hz" }
    ],
    liveUrl: "https://example.com/chronoblade",
    githubUrl: "https://github.com/example/chronoblade",
    color: "#8ecae6",
    glowColor: "rgba(142, 202, 230, 0.4)",
    modelType: "gem"
  },
  {
    id: "nebula-drift",
    title: "Nebula Drift: Starway",
    subtitle: "Low-Poly Cozy Space Racer",
    category: "3D & Shaders",
    description: "A relaxing low-poly space arcade racer where you drift along cosmic rainbow ribbons, dodging planetary debris and collecting stardust.",
    longDescription: "Built natively with Three.js and React Three Fiber to demonstrate browser gaming capabilities. Features spline-based roller coaster track generation, procedural asteroid fields, and instant arcade physics that feel responsive on both keyboard and gamepad.",
    features: [
      "Procedural Catmull-Rom space highway generation with dynamic banks",
      "Gamepad API integration with haptic vibration support",
      "Audio-reactive starfield that pulses to the rhythm of the soundtrack",
      "Global WebGL leaderboard with anti-cheat replay validation"
    ],
    techStack: ["React 19", "Three.js", "R3F", "GLSL Shaders", "Gamepad API", "Web Audio"],
    metrics: [
      { label: "Performance", value: "60 FPS Mobile/Web" },
      { label: "Track Variations", value: "Infinite Seeded" },
      { label: "Web Players", value: "250,000+" }
    ],
    liveUrl: "https://example.com/nebuladrift",
    githubUrl: "https://github.com/example/nebula-drift",
    color: "#d8b4fe",
    glowColor: "rgba(216, 180, 254, 0.4)",
    modelType: "cartridge"
  }
];
