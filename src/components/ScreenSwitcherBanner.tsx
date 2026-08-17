import React, { useState } from 'react';
import { AppScreen } from '../types';
import {
  Layers,
  Sparkles,
  BookOpen,
  LogIn,
  UserPlus,
  Home,
  Scan,
  Bot,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Maximize2,
} from 'lucide-react';

interface ScreenSwitcherBannerProps {
  currentScreen: AppScreen;
  onSelectScreen: (screen: AppScreen) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

const screenOptions: { id: AppScreen; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'splash', label: '1. Splash Boot', icon: Sparkles },
  { id: 'onboarding', label: '2. AR Onboarding', icon: BookOpen },
  { id: 'login', label: '3. Scholar Login', icon: LogIn },
  { id: 'register', label: '4. Create Account', icon: UserPlus },
  { id: 'home', label: '5. Dashboard', icon: Home },
  { id: 'scanner', label: '6. AR Scanner', icon: Scan },
  { id: 'ai-tutor', label: '7. AI Tutor', icon: Bot },
  { id: 'analytics', label: '8. Telemetry', icon: BarChart3 },
];

export const ScreenSwitcherBanner: React.FC<ScreenSwitcherBannerProps> = ({
  currentScreen,
  onSelectScreen,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeOpt = screenOptions.find((s) => s.id === currentScreen) || screenOptions[4];
  const ActiveIcon = activeOpt.icon;

  return (
    <div className="fixed top-3 right-3 sm:right-5 z-50 flex items-center gap-2">
      {/* Quick Dropdown/Toggle for Screens */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Switch Prototype Screen"
          className="flex items-center gap-2 bg-[#171b26]/95 hover:bg-[#202534] text-[#b4c5ff] backdrop-blur-xl border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-mono shadow-xl transition-all active:scale-95 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <ActiveIcon size={14} className="text-cyan-300" />
          <span className="font-medium text-slate-200">
            {activeOpt.label.split('. ')[1]}
          </span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-[#161a26]/98 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-[10px] font-mono text-[#8d90a0] uppercase tracking-wider border-b border-white/10 flex items-center gap-1.5">
              <Layers size={12} />
              <span>Interactive Views</span>
            </div>
            {screenOptions.map((opt) => {
              const Icon = opt.icon;
              const isCurrent = currentScreen === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelectScreen(opt.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-sans text-left transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-600/30 text-blue-200 border border-blue-400/40 font-semibold'
                      : 'text-[#c3c6d7] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={16} className={isCurrent ? 'text-blue-300' : 'text-[#8d90a0]'} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Frame Mode Toggle (Mobile Mockup vs Fluid Fullscreen) */}
      <button
        onClick={onToggleMobileFrame}
        title={isMobileFrame ? 'Expand to Fullscreen' : 'Simulate Mobile Phone Frame'}
        className="hidden md:flex items-center justify-center bg-[#171b26]/95 hover:bg-[#202534] text-[#c3c6d7] hover:text-white backdrop-blur-xl border border-white/20 w-9 h-9 rounded-full transition-all active:scale-95 cursor-pointer shadow-lg"
      >
        {isMobileFrame ? <Maximize2 size={16} /> : <Smartphone size={16} />}
      </button>
    </div>
  );
};
