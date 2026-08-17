import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Check, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { AppScreen } from '../types';
import {
  auth,
  createUserWithEmailAndPassword,
} from '../lib/firebase';
import { syncUserProfile } from '../lib/databaseService';

interface RegisterScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onRegisterSuccess: (name: string, email: string, uid?: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigate,
  onRegisterSuccess,
}) => {
  const [fullName, setFullName] = useState('Ada Lovelace');
  const [email, setEmail] = useState('student@university.edu');
  const [password, setPassword] = useState('neuralPass2026');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setErrorMsg('Please agree to the Terms & Conditions.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      let uid = 'scholar-' + Date.now();
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
      } catch (authErr: any) {
        console.warn('Firebase register fallback:', authErr.message);
      }

      await syncUserProfile(uid, {
        name: fullName,
        email,
        level: 1,
        streakDays: 1,
        studyHoursThisWeek: 0,
        dailyGoalProgress: 20,
      });

      onRegisterSuccess(fullName, email, uid);
      onNavigate('home');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="register-screen"
      className="bg-[#0b0e17] text-[#dfe2ef] min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden select-none"
    >
      {/* Background glow */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10 my-auto py-6"
      >
        {/* Back Link */}
        <button
          onClick={() => onNavigate('login')}
          className="mb-4 text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </button>

        {/* Header Branding */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Create Scholar Account
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Enroll in the cybernetic computer science curriculum
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#141824]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold"
                htmlFor="reg-name"
              >
                Scholar Full Name
              </label>
              <div className="flex items-center px-3.5 py-2.5 bg-[#0f131d] border border-white/10 rounded-xl focus-within:border-indigo-400 transition-all">
                <User size={16} className="text-slate-400 mr-2.5" />
                <input
                  id="reg-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ada Lovelace"
                  required
                  className="w-full bg-transparent border-none text-slate-100 text-sm focus:outline-none focus:ring-0 p-0 placeholder-slate-500 font-sans"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold"
                htmlFor="reg-email"
              >
                Academic Email
              </label>
              <div className="flex items-center px-3.5 py-2.5 bg-[#0f131d] border border-white/10 rounded-xl focus-within:border-indigo-400 transition-all">
                <Mail size={16} className="text-slate-400 mr-2.5" />
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  required
                  className="w-full bg-transparent border-none text-slate-100 text-sm focus:outline-none focus:ring-0 p-0 placeholder-slate-500 font-sans"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold"
                htmlFor="reg-password"
              >
                Password
              </label>
              <div className="flex items-center px-3.5 py-2.5 bg-[#0f131d] border border-white/10 rounded-xl focus-within:border-indigo-400 transition-all">
                <Lock size={16} className="text-slate-400 mr-2.5" />
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-none text-slate-100 text-sm focus:outline-none focus:ring-0 p-0 placeholder-slate-500 font-sans"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setTermsAccepted(!termsAccepted)}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                  termsAccepted
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-[#0f131d] border-white/20 text-transparent'
                }`}
              >
                <Check size={13} />
              </button>
              <label
                onClick={() => setTermsAccepted(!termsAccepted)}
                className="text-xs text-slate-300 cursor-pointer"
              >
                I agree to the Academy Code of Conduct & Honor Code
              </label>
            </div>

            {/* Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer active:scale-98 mt-2"
            >
              {isSubmitting ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Account */}
        <p className="text-center mt-5 text-xs text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-indigo-300 font-semibold hover:text-white transition-colors ml-1 cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </motion.main>
    </div>
  );
};
