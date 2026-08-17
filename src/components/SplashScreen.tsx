import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { AppScreen } from '../types';

interface SplashScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate }) => {
  // Allow auto-transition or manual tap to proceed to onboarding
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('onboarding');
    }, 4500);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <main
      id="splash-screen"
      onClick={() => onNavigate('onboarding')}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0053db] via-[#6001d1] to-[#0f131c] z-0 cursor-pointer select-none"
    >
      {/* Abstract atmospheric background elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#2563eb] blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#6001d1] blur-[100px] animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Glassmorphic Content Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center justify-center p-8 sm:p-12 rounded-[2rem] bg-[#0f131c]/25 backdrop-blur-2xl border border-white/15 shadow-2xl shimmer-effect overflow-hidden max-w-lg w-[90%] mx-4"
      >
        {/* Logo Area with float animation */}
        <div className="animate-float mb-8 relative flex items-center justify-center">
          {/* Inner glow behind logo */}
          <div className="absolute inset-0 rounded-full bg-[#b7eaff] blur-xl opacity-30"></div>
          {/* Logo Container */}
          <div className="relative w-32 h-32 rounded-2xl bg-[#262a34]/80 border border-white/15 overflow-hidden flex items-center justify-center shadow-inner">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsp8NLNclW5eDEZ3TOmx2hmEHXSV9gYl80osiuGVpJSew5N4BBV3DZYgqFQwYqWRy0qWq0gHyxZHdJ0DpwgpWjME2b-qXWP_YGu74nPSvh9Z9G0opgz46tgStFsiQc_OxLIBlVZ4hA1X6SauutqCo0bjGACdqlPGIMfSFSxK1DXfSRuBh2PSmApyMYBkWZ3_idSPwjBtTRKsmXtqctqoTZHbYqIa3dArEK-nY9SJXoY5rqs6MV9QtN9w"
              alt="Cybernetic Academy Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Typography */}
        <div className="text-center flex flex-col gap-2">
          <h1 className="font-display-lg text-4xl sm:text-5xl text-[#eeefff] tracking-tight drop-shadow-md font-bold">
            Cybernetic
            <br />
            Academy
          </h1>
          <p className="font-body-lg text-[#c3c6d7] mt-2 opacity-85 text-base sm:text-lg">
            Initializing protocol...
          </p>
        </div>

        {/* Subtle Loading Indicator */}
        <div className="mt-10 flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4cd6ff] animate-ping" />
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#4cd6ff] animate-ping"
            style={{ animationDelay: '0.2s' }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#4cd6ff] animate-ping"
            style={{ animationDelay: '0.4s' }}
          />
        </div>

        <p className="mt-8 text-xs text-[#c3c6d7]/60 font-mono">
          Tap anywhere to proceed
        </p>
      </motion.div>
    </main>
  );
};
