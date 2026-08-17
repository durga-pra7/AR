/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppScreen, ARTopicTarget, UserProfile } from './types';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { HomeScreen } from './components/HomeScreen';
import { ARScannerScreen } from './components/ARScannerScreen';
import { AITutorScreen } from './components/AITutorScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { ARModalVisualizer } from './components/ARModalVisualizer';
import { BottomNavBar } from './components/BottomNavBar';
import { ScreenSwitcherBanner } from './components/ScreenSwitcherBanner';
import { NavigationIndicator } from './components/NavigationIndicator';
import { syncUserProfile } from './lib/databaseService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [activeARTarget, setActiveARTarget] = useState<ARTopicTarget | null>(null);
  const [tutorQueryTopic, setTutorQueryTopic] = useState<string | undefined>(undefined);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(true);

  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Vance',
    email: 'developer@codemind.io',
    role: 'Computer Science Scholar',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_gcUCb0rW-YDLGBO6hCnH2MhVxbqWu24ZkBR_fP5qKZBTgNuRUPoDwz1NhsO8ZiFyX0jj_U8Asru9TTyV4-hBCBPZ0h3YdpORHa0K6prJED4abUa1S8YrSkN2pFhAF0XDsyWb9PwZDIVJU-hDH4C8PI-MW5J5sGCXVI4AOHahzPFU8xhQvhveNqjXmHMA6oG9DbUrr0rJEBu6kmR2C8lKsCxvH4ranoVItM1L1LfRL1jWX_V7ykH1Hw',
    level: 4,
    streakDays: 14,
    studyHoursThisWeek: 28.5,
    dailyGoalProgress: 75,
  });

  // Initial load sync from Firestore
  useEffect(() => {
    async function loadData() {
      try {
        const synced = await syncUserProfile('scholar-alex-vance', {
          name: 'Alex Vance',
          email: 'developer@codemind.io',
        });
        setUser(synced);
        setIsDbConnected(true);
      } catch (err) {
        console.warn('Initial load Firestore notice:', err);
      }
    }
    loadData();
  }, []);

  const handleNavigate = (screen: AppScreen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTopicFromHome = (title: string, subtitle: string) => {
    setTutorQueryTopic(`${title} - ${subtitle}`);
    setCurrentScreen('ai-tutor');
  };

  const handleAskAIFromScanner = (topic: string) => {
    setTutorQueryTopic(topic);
    setCurrentScreen('ai-tutor');
  };

  const handleLaunchARModal = (target: ARTopicTarget) => {
    setActiveARTarget(target);
  };

  const handleLoginSuccess = (email: string, _uid?: string, name?: string) => {
    const namePart = name || email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    setUser((prev) => ({
      ...prev,
      name: formattedName,
      email: email,
    }));
  };

  const handleRegisterSuccess = (name: string, email: string, _uid?: string) => {
    setUser((prev) => ({
      ...prev,
      name: name || 'Ada Lovelace',
      email: email || 'student@university.edu',
    }));
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onNavigate={handleNavigate} />;
      case 'onboarding':
        return <OnboardingScreen onNavigate={handleNavigate} />;
      case 'login':
        return (
          <LoginScreen
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onNavigate={handleNavigate}
            onRegisterSuccess={handleRegisterSuccess}
          />
        );
      case 'home':
        return (
          <HomeScreen
            user={user}
            onNavigate={handleNavigate}
            onSelectTopic={handleSelectTopicFromHome}
          />
        );
      case 'scanner':
        return (
          <ARScannerScreen
            onNavigate={handleNavigate}
            onLaunchAR={handleLaunchARModal}
            onAskAI={handleAskAIFromScanner}
          />
        );
      case 'ai-tutor':
        return (
          <AITutorScreen
            user={user}
            initialTopic={tutorQueryTopic}
            onNavigate={handleNavigate}
          />
        );
      case 'analytics':
        return <AnalyticsScreen user={user} onNavigate={handleNavigate} />;
      default:
        return (
          <HomeScreen
            user={user}
            onNavigate={handleNavigate}
            onSelectTopic={handleSelectTopicFromHome}
          />
        );
    }
  };

  return (
    <div className="bg-[#0a0e17] min-h-screen text-[#dfe2ef] relative flex flex-col items-center justify-start">
      {/* Top Prototype Screen Switcher Toolbar */}
      <ScreenSwitcherBanner
        currentScreen={currentScreen}
        onSelectScreen={handleNavigate}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      {/* Main View Container (Supports mobile frame simulation or full responsive layout) */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[430px] my-6 min-h-[880px] rounded-[40px] border-[8px] border-[#262a34] shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden relative bg-[#0f131c]'
            : 'max-w-full min-h-screen'
        }`}
      >
        {/* Real-time Clear Navigation & Breadcrumb Header */}
        <NavigationIndicator
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          isDbConnected={isDbConnected}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="w-full min-h-full"
          >
            {renderCurrentScreen()}
          </motion.div>
        </AnimatePresence>

        {/* Global Bottom Navigation Bar */}
        <BottomNavBar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Interactive 3D AR Visualizer Modal */}
      <AnimatePresence>
        {activeARTarget && (
          <ARModalVisualizer
            target={activeARTarget}
            onClose={() => setActiveARTarget(null)}
            onAskAI={(q) => {
              setActiveARTarget(null);
              setTutorQueryTopic(q);
              setCurrentScreen('ai-tutor');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
