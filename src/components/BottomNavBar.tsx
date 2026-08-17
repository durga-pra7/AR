import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  Scan,
  Bot,
  BarChart3,
} from 'lucide-react';
import { AppScreen } from '../types';

interface BottomNavBarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

interface NavItem {
  id: AppScreen;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  activeBg: string;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: Home,
    color: 'text-indigo-300',
    activeBg: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200',
  },
  {
    id: 'scanner',
    label: 'AR Scanner',
    icon: Scan,
    color: 'text-cyan-300',
    activeBg: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200',
  },
  {
    id: 'ai-tutor',
    label: 'AI Tutor',
    icon: Bot,
    color: 'text-purple-300',
    activeBg: 'bg-purple-500/20 border-purple-400/40 text-purple-200',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    color: 'text-sky-300',
    activeBg: 'bg-sky-500/20 border-sky-400/40 text-sky-200',
  },
];

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  // Hide on auth & intro screens
  const hideOnScreens: AppScreen[] = ['splash', 'onboarding', 'login', 'register'];
  if (hideOnScreens.includes(currentScreen)) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none flex justify-center pb-3 px-4">
      <nav
        id="bottom-navigation-bar"
        className="pointer-events-auto w-full max-w-lg bg-[#121622]/95 backdrop-blur-2xl border border-white/15 rounded-2xl sm:rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.7)] px-2.5 sm:px-4 py-2 flex items-center justify-between gap-1 transition-all"
      >
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-full transition-all duration-200 select-none cursor-pointer flex-1 sm:flex-initial active:scale-95 ${
                isActive
                  ? `${item.activeBg} border shadow-[0_0_15px_rgba(180,197,255,0.15)]`
                  : 'text-[#9aa0b4] hover:text-[#dfe2ef] hover:bg-white/5 border border-transparent'
              }`}
            >
              {/* Icon */}
              <Icon
                size={20}
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
              />

              {/* Label (always visible or with smooth animation) */}
              <span
                className={`text-xs font-medium tracking-wide whitespace-nowrap ${
                  isActive ? 'font-semibold' : 'text-[#8d90a0]'
                }`}
              >
                {item.label}
              </span>

              {/* Active glow indicator pill */}
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 rounded-full bg-white/5 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
