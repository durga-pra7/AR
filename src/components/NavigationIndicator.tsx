import React from 'react';
import { AppScreen } from '../types';
import {
  Terminal,
  ChevronRight,
  Database,
  ArrowLeft,
  Sparkles,
  BookOpen,
  LogIn,
  UserPlus,
  Home,
  Scan,
  Bot,
  BarChart3,
} from 'lucide-react';

interface NavigationIndicatorProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  isDbConnected?: boolean;
}

const screenMeta: Record<
  AppScreen,
  {
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    breadcrumb: string[];
    color: string;
  }
> = {
  splash: {
    title: 'Cybernetic Academy',
    subtitle: 'System Initialization & Neural Link',
    icon: Sparkles,
    breadcrumb: ['System', 'Boot'],
    color: '#b4c5ff',
  },
  onboarding: {
    title: 'AR Discovery Hub',
    subtitle: 'Step-by-step Interactive 3D Guide',
    icon: BookOpen,
    breadcrumb: ['Intro', 'Learn in 3D'],
    color: '#4cd6ff',
  },
  login: {
    title: 'Scholar Authentication',
    subtitle: 'Cloud Firestore Sync & Security Gateway',
    icon: LogIn,
    breadcrumb: ['Auth', 'Sign In'],
    color: '#d2bbff',
  },
  register: {
    title: 'New Scholar Registration',
    subtitle: 'Profile Provisioning & Database Enrollment',
    icon: UserPlus,
    breadcrumb: ['Auth', 'Enroll'],
    color: '#d2bbff',
  },
  home: {
    title: 'Knowledge Command Center',
    subtitle: 'Real-time Curriculum & Mastery Dashboard',
    icon: Home,
    breadcrumb: ['Academic Hub', 'Dashboard'],
    color: '#b4c5ff',
  },
  scanner: {
    title: 'AR Spatial Scanner',
    subtitle: 'Live Laser Computer Vision & Micro-Hardware HUD',
    icon: Scan,
    breadcrumb: ['Spatial Engine', 'AR Target Scanner'],
    color: '#4cd6ff',
  },
  'ai-tutor': {
    title: 'Neural AI CodeMind Tutor',
    subtitle: 'Context-Aware CS Assistant & Code Analysis',
    icon: Bot,
    breadcrumb: ['Neural Tutor', 'Interactive Chat'],
    color: '#d2bbff',
  },
  analytics: {
    title: 'Performance & Telemetry',
    subtitle: 'Weekly Metrics, Streak & Mastery Telemetry',
    icon: BarChart3,
    breadcrumb: ['Intelligence', 'Mastery Analytics'],
    color: '#4cd6ff',
  },
};

export const NavigationIndicator: React.FC<NavigationIndicatorProps> = ({
  currentScreen,
  onNavigate,
  isDbConnected = true,
}) => {
  const current = screenMeta[currentScreen] || screenMeta.home;
  const CurrentIcon = current.icon;

  // Don't show on splash screen
  if (currentScreen === 'splash') return null;

  return (
    <div className="w-full bg-[#111520]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs z-30 sticky top-0">
      {/* Breadcrumb Navigation Track */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1 text-[#8d90a0] hover:text-[#b4c5ff] font-mono transition-colors cursor-pointer"
        >
          <Terminal size={14} className="text-[#b4c5ff]" />
          <span className="font-semibold">CODEMIND</span>
        </button>

        <ChevronRight size={13} className="text-white/20" />

        {current.breadcrumb.map((crumb, idx) => (
          <React.Fragment key={crumb}>
            <span
              className={`font-mono transition-colors ${
                idx === current.breadcrumb.length - 1
                  ? 'text-[#dfe2ef] font-semibold flex items-center gap-1.5'
                  : 'text-[#8d90a0]'
              }`}
            >
              {idx === current.breadcrumb.length - 1 && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: current.color }}
                />
              )}
              {crumb}
            </span>
            {idx < current.breadcrumb.length - 1 && (
              <ChevronRight size={13} className="text-white/20" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Screen Title & Live Database Indicator */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time DB Sync Badge */}
        <div
          title={isDbConnected ? 'Firebase Cloud Firestore: Live Connected' : 'Local Storage Mode'}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181d2a] border border-white/10 text-[11px] font-mono shadow-sm"
        >
          <Database size={12} className={isDbConnected ? 'text-emerald-400' : 'text-amber-400'} />
          <span className="text-[#c3c6d7]">
            {isDbConnected ? 'Firestore: Live' : 'Offline'}
          </span>
        </div>

        {/* Quick Back to Dashboard Button if not on home */}
        {currentScreen !== 'home' && (
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 text-[#b4c5ff] hover:text-white bg-blue-600/20 hover:bg-blue-600/35 border border-[#b4c5ff]/30 px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft size={13} />
            <span>Dashboard</span>
          </button>
        )}
      </div>
    </div>
  );
};
