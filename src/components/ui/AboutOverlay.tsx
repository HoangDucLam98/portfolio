import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, Sparkles, BookOpen } from 'lucide-react';
import { personalInfo } from '../../data/portfolioData';
import { soundManager } from '../../audio/audioEngine';
import { achievementsManager } from '../../game/achievements';

interface AboutOverlayProps {
  onGoToProjects: () => void;
  onGoToContact: () => void;
}

interface TerminalHistoryItem {
  type: 'input' | 'output';
  text: string | React.ReactNode;
}

export function AboutOverlay({ onGoToProjects, onGoToContact }: AboutOverlayProps) {
  const [terminalInput, setTerminalInput] = useState('');
  const [history, setHistory] = useState<TerminalHistoryItem[]>([
    { type: 'output', text: '🎮 Sproutling Engine CLI v4.8 [Ready]' },
    { type: 'output', text: 'Type "help" or click suggestion pills to inspect game architecture & developer stats.' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    soundManager.playClick();
    achievementsManager.unlock('terminal_hacker');

    const newHistory: TerminalHistoryItem[] = [
      ...history,
      { type: 'input', text: `lam@game-studio:~$ ${cmd}` },
    ];

    switch (trimmed) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: 'Available Commands: lore, tech, games, quest, contact, clear',
        });
        break;
      case 'lore':
        newHistory.push({
          type: 'output',
          text: `[HOANG DUC LAM]: ${personalInfo.bio}`,
        });
        break;
      case 'tech':
        newHistory.push({
          type: 'output',
          text: '🍄 Primary Engine Stack: Unity 6 (C#), Unreal Engine 5 (C++), Godot 4, Custom HLSL Cel-Shaders, Blender 3D, FMOD Audio, Three.js WebGL',
        });
        break;
      case 'quest':
        newHistory.push({
          type: 'output',
          text: '⚔️ Current Main Quest: Directing core physics and custom stylized rendering for upcoming Steam indie releases.',
        });
        break;
      case 'games':
        newHistory.push({
          type: 'output',
          text: '🚀 Opening 3D Games Showcase Carousel...',
        });
        setTimeout(() => onGoToProjects(), 500);
        break;
      case 'contact':
        newHistory.push({
          type: 'output',
          text: '🔥 Traveling to the Campfire Beacon...',
        });
        setTimeout(() => onGoToContact(), 500);
        break;
      case 'clear':
        setHistory([]);
        setTerminalInput('');
        return;
      default:
        newHistory.push({
          type: 'output',
          text: `Command not recognized: "${cmd}". Type "help" for a list of valid commands.`,
        });
    }

    setHistory(newHistory);
    setTerminalInput('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <section
      id="about"
      className="relative min-h-screen w-full flex flex-col justify-center py-24 px-6 sm:px-12 max-w-7xl mx-auto pointer-events-none"
    >
      {/* Section Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white border-2 border-[#e6d8cb] text-xs font-heading font-bold text-[#526545] mb-3 shadow-sm">
          <BookOpen className="w-3.5 h-3.5" />
          <span>STATION 02 // GAME ENGINE & DEV LORE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#38271e] tracking-tight">
          LORE &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8da178] to-[#e76f51]">
            DEVELOPMENT
          </span>
        </h2>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Game Engine Debugger CLI (7 Cols) */}
        <div className="lg:col-span-7 w-full rounded-3xl glass-panel-glow border-2 border-[#8da178] shadow-xl overflow-hidden pointer-events-auto bg-white/95">
          {/* Title Bar */}
          <div className="bg-[#f4ebe1] px-5 py-3.5 border-b-2 border-[#e6d8cb] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#ff8a80]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffd166]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#8da178]" />
              <span className="text-xs font-heading font-bold text-[#38271e] ml-2">
                sproutling-engine://hoang-duc-lam
              </span>
            </div>
            <div className="text-[11px] font-heading font-bold text-[#a63e24] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              GAME ENGINE CLI
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-5 font-mono text-xs text-[#38271e] h-[290px] overflow-y-auto flex flex-col gap-2.5 bg-[#fffdfa]">
            {history.map((item, idx) => (
              <div key={`hist-${idx}`} className={item.type === 'input' ? 'text-[#a63e24] font-bold' : 'text-[#4a332d]'}>
                {item.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-5 py-3 bg-[#fbf4eb] border-t-2 border-[#e6d8cb] flex flex-wrap gap-2 items-center">
            <span className="text-[11px] font-heading font-bold text-[#786558]">HOTKEYS:</span>
            {['lore', 'tech', 'quest', 'games', 'contact', 'clear'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleCommand(cmd)}
                className="px-3 py-1 rounded-xl bg-white hover:bg-[#8da178]/20 text-[#38271e] hover:text-[#8da178] text-[11px] font-heading font-bold border border-[#e6d8cb] transition-colors cursor-pointer shadow-sm"
              >
                ${cmd}
              </button>
            ))}
          </div>

          {/* Command Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (terminalInput.trim()) {
                handleCommand(terminalInput);
              }
            }}
            className="p-3 bg-[#f4ebe1] border-t-2 border-[#e6d8cb] flex items-center gap-2"
          >
            <span className="text-[#526545] font-mono text-xs font-bold">alex@game-studio:~$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Type command ('help', 'lore', 'tech')..."
              className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-[#38271e] placeholder:text-[#9e8c7e]"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#4a332d] hover:bg-[#38271e] text-white font-heading font-bold text-xs cursor-pointer shadow-sm"
            >
              RUN
            </button>
          </form>
        </div>

        {/* Right Column: Quest Milestones Timeline (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 pointer-events-auto">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-2 border-[#e6d8cb] flex flex-col gap-5 bg-white/95 shadow-md">
            <div className="flex items-center gap-2 text-sm font-heading font-extrabold text-[#38271e]">
              <Gamepad2 className="w-5 h-5 text-[#8da178]" />
              QUEST MILESTONES & EXP
            </div>

            <div className="flex flex-col gap-4">
              {personalInfo.experience.map((exp) => (
                <div key={exp.company} className="relative pl-5 border-l-2 border-[#e6d8cb] hover:border-[#8da178] transition-colors group">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#c8b6a6] group-hover:bg-[#8da178] transition-colors" />
                  <div className="flex items-center justify-between text-xs font-mono text-[#786558] mb-1">
                    <span className="text-[#a63e24] font-bold">{exp.role}</span>
                    <span>{exp.period}</span>
                  </div>
                  <div className="text-sm font-heading font-bold text-[#38271e] mb-1">{exp.company}</div>
                  <p className="text-xs text-[#5c4a3f] leading-relaxed font-medium">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
