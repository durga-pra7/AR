import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, BookOpen, Scan, Bot } from 'lucide-react';
import { AppScreen } from '../types';

interface OnboardingScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

const slides = [
  {
    titlePrefix: 'Learn in',
    titleHighlight: '3D Space',
    description:
      'Visualize complex computer science concepts through immersive AR experiences. Understand hardware architectures from the inside out.',
    icon: Scan,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC64Dr_Ea0gXN3WzO1tRkevz6ZRRmS4RpX6x7ZrYEEQUZXftVXcTfdUeoeyzSuCUuB-OLhXd5uOO_mkC8GrpIUHbnMB5CBi60M2ECbcUgMkAJsoXZvEkPjlbSOFiiFwu9dtpED_dZISP0oltW4sKY-QiJnlU_kEklAlf1jh-GDv7dWzrQAfjMB7BNxEwSK6RXsmATwB87RIGLKS3KS_kxOJWP79EHfxbPF4WMf_8MVDHKH0-aq4nBqZUQ',
    alt: 'Student interacting with 3D CPU processor hologram',
  },
  {
    titlePrefix: 'Interactive',
    titleHighlight: 'AR Holograms',
    description:
      'Point your camera at diagrams or code to inspect CPU pipeline stages, memory caches, and binary search trees in real-time space.',
    icon: BookOpen,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC64Dr_Ea0gXN3WzO1tRkevz6ZRRmS4RpX6x7ZrYEEQUZXftVXcTfdUeoeyzSuCUuB-OLhXd5uOO_mkC8GrpIUHbnMB5CBi60M2ECbcUgMkAJsoXZvEkPjlbSOFiiFwu9dtpED_dZISP0oltW4sKY-QiJnlU_kEklAlf1jh-GDv7dWzrQAfjMB7BNxEwSK6RXsmATwB87RIGLKS3KS_kxOJWP79EHfxbPF4WMf_8MVDHKH0-aq4nBqZUQ',
    alt: 'Augmented Reality interface scanning computer science concepts',
  },
  {
    titlePrefix: 'Neural',
    titleHighlight: 'AI CodeMind Tutor',
    description:
      'Context-aware computer science AI answers your deepest theoretical questions, analyzes algorithms, and prepares you for real-world engineering.',
    icon: Bot,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC64Dr_Ea0gXN3WzO1tRkevz6ZRRmS4RpX6x7ZrYEEQUZXftVXcTfdUeoeyzSuCUuB-OLhXd5uOO_mkC8GrpIUHbnMB5CBi60M2ECbcUgMkAJsoXZvEkPjlbSOFiiFwu9dtpED_dZISP0oltW4sKY-QiJnlU_kEklAlf1jh-GDv7dWzrQAfjMB7BNxEwSK6RXsmATwB87RIGLKS3KS_kxOJWP79EHfxbPF4WMf_8MVDHKH0-aq4nBqZUQ',
    alt: 'AI Powered Computer Science Tutor assistant',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onNavigate('login');
    }
  };

  const current = slides[currentSlide];
  const CurrentIcon = current.icon;

  return (
    <div
      id="onboarding-screen"
      className="bg-[#0b0e17] text-[#dfe2ef] min-h-screen w-full flex flex-col justify-between overflow-hidden relative select-none"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-indigo-600/10 rounded-full blur-[140px] transform -translate-y-1/3 scale-150 pointer-events-none" />

      {/* Top Skip Bar */}
      <div className="w-full max-w-6xl mx-auto px-6 pt-6 flex justify-between items-center z-30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Academy Induction
          </span>
        </div>
        <button
          id="skip-onboarding-btn"
          onClick={() => onNavigate('login')}
          className="text-xs font-mono text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10 cursor-pointer"
        >
          Skip &gt;
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto px-6 py-4 z-10 gap-8">
        {/* Illustration Section */}
        <div className="flex-1 w-full max-w-md md:max-w-lg h-[40vh] md:h-[50vh] flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={current.image}
              alt={current.alt}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
            />
          </AnimatePresence>
        </div>

        {/* Content & Controls Section */}
        <div className="w-full max-w-md md:max-w-lg flex flex-col justify-end md:justify-center relative z-20 pb-8 md:pb-0">
          <div className="bg-[#141824]/85 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl">
            {/* Title & Description */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-2"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-1">
                  <CurrentIcon size={20} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                  {current.titlePrefix}{' '}
                  <span className="text-cyan-400">{current.titleHighlight}</span>
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mt-1">
                  {current.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Slide Pagination Dots & Next Button */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlide
                        ? 'w-8 bg-cyan-400'
                        : 'w-2 bg-[#2a3042] hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              <button
                id="next-onboarding-btn"
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-mono font-medium tracking-wide shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="h-4" />
    </div>
  );
};
