import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { AppScreen } from '../types';
import {
  auth,
  signInWithEmailAndPassword,
} from '../lib/firebase';
import { syncUserProfile } from '../lib/databaseService';

interface LoginScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onLoginSuccess: (email: string, uid?: string, name?: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('scholar@codemind.io');
  const [password, setPassword] = useState('cybernetic2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let uid = 'guest-' + btoa(email).slice(0, 12);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        uid = userCredential.user.uid;
      } catch (authErr: any) {
        console.warn('Firebase Auth standard login fallback:', authErr.message);
      }

      const userProfile = await syncUserProfile(uid, {
        email,
        name: email.split('@')[0].replace('.', ' '),
      });

      onLoginSuccess(userProfile.email, uid, userProfile.name);
      onNavigate('home');
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    const demoEmail = `${provider.toLowerCase()}.scholar@codemind.io`;
    const uid = `${provider.toLowerCase()}-scholar-uid`;

    await syncUserProfile(uid, {
      email: demoEmail,
      name: `${provider} Scholar`,
    });

    onLoginSuccess(demoEmail, uid, `${provider} Scholar`);
    onNavigate('home');
    setIsLoading(false);
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    const guestEmail = 'alex.vance@codemind.io';
    const guestUid = 'scholar-alex-vance';

    const profile = await syncUserProfile(guestUid, {
      name: 'Alex Vance',
      email: guestEmail,
      role: 'Computer Systems Scholar',
      level: 4,
      streakDays: 12,
      studyHoursThisWeek: 27.9,
    });

    onLoginSuccess(guestEmail, guestUid, profile.name);
    onNavigate('home');
    setIsLoading(false);
  };

  return (
    <div
      id="login-screen"
      className="bg-[#0b0e17] text-[#dfe2ef] min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden select-none"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10 my-auto py-6"
      >
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-block p-1 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl mb-3 shadow-lg shadow-indigo-500/20">
            <div className="w-14 h-14 bg-[#141824] rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsp8NLNclW5eDEZ3TOmx2hmEHXSV9gYl80osiuGVpJSew5N4BBV3DZYgqFQwYqWRy0qWq0gHyxZHdJ0DpwgpWjME2b-qXWP_YGu74nPSvh9Z9G0opgz46tgStFsiQc_OxLIBlVZ4hA1X6SauutqCo0bjGACdqlPGIMfSFSxK1DXfSRuBh2PSmApyMYBkWZ3_idSPwjBtTRKsmXtqctqoTZHbYqIa3dArEK-nY9SJXoY5rqs6MV9QtN9w"
                alt="CodeMind Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Scholar Sign In
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Access your 3D spatial curriculum and AI tutor
          </p>
        </div>

        {/* Glass Card */}
        <div className="bg-[#141824]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold"
                htmlFor="email"
              >
                Scholar Email
              </label>
              <div className="flex items-center px-3.5 py-2.5 bg-[#0f131d] border border-white/10 rounded-xl focus-within:border-indigo-400 transition-all">
                <Mail size={16} className="text-slate-400 mr-2.5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="scholar@codemind.io"
                  required
                  className="w-full bg-transparent border-none text-slate-100 text-sm focus:outline-none focus:ring-0 p-0 placeholder-slate-500 font-sans"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="flex items-center px-3.5 py-2.5 bg-[#0f131d] border border-white/10 rounded-xl focus-within:border-indigo-400 transition-all">
                <Lock size={16} className="text-slate-400 mr-2.5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-none text-slate-100 text-sm focus:outline-none focus:ring-0 p-0 placeholder-slate-500 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer active:scale-98 mt-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Scholar Login */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-indigo-400/30 text-indigo-200 font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Zap size={14} className="text-amber-400" />
              <span>Instant Demo Access (Alex Vance)</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-white/10" />
            <span className="px-3 text-[10px] font-mono text-slate-500 tracking-wider uppercase">
              OR CONTINUE WITH
            </span>
            <div className="flex-grow h-px bg-white/10" />
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="bg-[#0f131d] hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center py-2.5 px-3 transition-all cursor-pointer active:scale-95 text-xs text-slate-300 gap-2"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBd-s2juJsHFysrBURCtDM9RsyENO46y2_M_-Ud4hlGey6RccIuM2lO4Q1wJAnYrvnpJbnZ41LTpsPADw2eqg3xPonj1pBgUPipcPXNs8M8mAnYyaD5ROUlE6ehdvr78CWppcVJieZyXjLT_kKCgqrMmlOXTd_bRiilQb1QFWxrYaohtCPIqKNLspJYVQ0LlMJdhXp0EaX1C4Q0s3CU-e1MEBHXGFaXTcB6jFhR73cY4MxXBEzj2U5cRA"
                alt="Google"
                className="w-4 h-4"
              />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('GitHub')}
              className="bg-[#0f131d] hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center py-2.5 px-3 transition-all cursor-pointer active:scale-95 text-xs text-slate-300 gap-2"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALM43fCud6Wg6o0o1sQY7FN6-EyWxU6ePr53Q6wjWUhfLuP02hjz7atAPiWv0CMP-6r-JrF0N8fR_4VHeS7zm9kx6nPltzCj3-wYrEPos2qdatGCXb9fNi_JGSG4e_RKpwbFKhKowShxaSuHJBt5mw43fy6_50BmIN6CJ91x472UZJbPr1BmgUdq8chG4r1Nj6JjaMjCLSHt7SE7TDxBxW0rmxNgDTkpacBDzOUco3I60D8EZn3ZTh0g"
                alt="GitHub"
                className="w-4 h-4"
              />
              <span>GitHub</span>
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-5 text-xs text-slate-400">
          New to CodeMind?{' '}
          <button
            id="go-to-register-btn"
            type="button"
            onClick={() => onNavigate('register')}
            className="text-indigo-300 font-semibold hover:text-white transition-colors ml-1 cursor-pointer"
          >
            Create an account
          </button>
        </p>
      </motion.main>
    </div>
  );
};
