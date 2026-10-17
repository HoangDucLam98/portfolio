export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Stepped into Sproutling 3D Game Studio',
    icon: '🌱',
    unlocked: false,
  },
  {
    id: 'coffee_lover',
    title: 'Coffee Addict',
    description: 'Clicked the carved wooden coffee mug 3 times',
    icon: '☕',
    unlocked: false,
  },
  {
    id: 'handheld_gamer',
    title: 'Switch Enthusiast',
    description: 'Launched the 3D Mini-Game on Nintendo Switch',
    icon: '🎮',
    unlocked: false,
  },
  {
    id: 'star_collector',
    title: 'Star Hunter',
    description: 'Collected all 5 golden stars in the Mini-Game',
    icon: '⭐',
    unlocked: false,
  },
  {
    id: 'night_owl',
    title: 'Cozy Night Owl',
    description: 'Switched environment to Cozy Lo-Fi Night Mode',
    icon: '🌙',
    unlocked: false,
  },
  {
    id: 'terminal_hacker',
    title: 'Engine Hacker',
    description: 'Executed a custom command in the Game Engine CLI',
    icon: '💻',
    unlocked: false,
  },
  {
    id: 'game_explorer',
    title: 'Quest Master',
    description: 'Inspected all 4 featured 3D game project specs',
    icon: '📜',
    unlocked: false,
  },
  {
    id: 'carrier_pigeon',
    title: 'Carrier Pigeon',
    description: 'Dispatched a quest proposal at the Campfire Beacon',
    icon: '🔥',
    unlocked: false,
  },
];

type AchievementListener = (achievement: Achievement) => void;

const ACHIEVEMENTS_STORAGE_KEY = 'sproutling_achievements';
const META_STORAGE_KEY = 'sproutling_achievements_meta';

class AchievementsManager {
  private achievements: Achievement[] = [];
  private listeners: AchievementListener[] = [];
  private viewedProjects: Set<string> = new Set();
  private coffeeClicks: number = 0;

  constructor() {
    this.load();
  }

  private load() {
    try {
      const saved = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.achievements = INITIAL_ACHIEVEMENTS.map((item) => {
          const found = parsed.find((p: Achievement) => p.id === item.id);
          return found || item;
        });
      } else {
        this.achievements = [...INITIAL_ACHIEVEMENTS];
      }

      const savedMeta = localStorage.getItem(META_STORAGE_KEY);
      if (savedMeta) {
        const parsedMeta = JSON.parse(savedMeta);
        if (typeof parsedMeta.coffeeClicks === 'number') {
          this.coffeeClicks = parsedMeta.coffeeClicks;
        }
        if (Array.isArray(parsedMeta.viewedProjects)) {
          this.viewedProjects = new Set(
            parsedMeta.viewedProjects.filter((id: unknown): id is string => typeof id === 'string')
          );
        }
      }
    } catch {
      this.achievements = [...INITIAL_ACHIEVEMENTS];
    }
  }

  private save() {
    try {
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(this.achievements));
    } catch {
      // ignore
    }
  }

  private saveMeta() {
    try {
      localStorage.setItem(
        META_STORAGE_KEY,
        JSON.stringify({
          coffeeClicks: this.coffeeClicks,
          viewedProjects: [...this.viewedProjects],
        })
      );
    } catch {
      // ignore
    }
  }

  public getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  public getUnlockedCount(): number {
    return this.achievements.filter((a) => a.unlocked).length;
  }

  public subscribe(listener: AchievementListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public unlock(id: string) {
    const ach = this.achievements.find((a) => a.id === id);
    if (ach && !ach.unlocked) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.save();
      this.notify(ach);
    }
  }

  private notify(achievement: Achievement) {
    this.listeners.forEach((listener) => listener(achievement));
  }

  // Trigger Helpers
  public trackCoffeeClick() {
    this.coffeeClicks += 1;
    this.saveMeta();
    if (this.coffeeClicks >= 3) {
      this.unlock('coffee_lover');
    }
  }

  public trackProjectView(projectId: string) {
    this.viewedProjects.add(projectId);
    this.saveMeta();
    if (this.viewedProjects.size >= 4) {
      this.unlock('game_explorer');
    }
  }
}

export const achievementsManager = new AchievementsManager();
