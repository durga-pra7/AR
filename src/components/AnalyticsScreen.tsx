import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  Award,
  Calendar,
  Flame,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { Achievement, AppScreen, UserProfile } from '../types';

interface AnalyticsScreenProps {
  user: UserProfile;
  onNavigate: (screen: AppScreen) => void;
}

const studyWeekData = [
  { day: 'Mon', hours: 2.5, percentage: 35, topic: 'TCP/IP Handshake' },
  { day: 'Tue', hours: 3.2, percentage: 45, topic: 'Binary Search Trees' },
  { day: 'Wed', hours: 1.5, percentage: 22, topic: 'SQL Optimizations' },
  { day: 'Thu', hours: 4.8, percentage: 68, topic: 'CPU Pipelining' },
  { day: 'Fri', hours: 6.5, percentage: 92, topic: 'Distributed Consensus' },
  { day: 'Sat', hours: 3.8, percentage: 54, topic: 'Graph Traversals' },
  { day: 'Sun', hours: 5.6, percentage: 80, topic: 'System Design Mock' },
];

const achievementsList: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Data Structures Pro',
    description: 'Solved 50+ recursive tree and graph optimization problems.',
    icon: 'account_tree',
    color: '#d2bbff',
    unlocked: true,
    unlockedAt: 'Aug 14, 2026',
  },
  {
    id: 'ach-2',
    title: 'Fast Learner',
    description: 'Completed 5 computer science modules in under 48 hours.',
    icon: 'bolt',
    color: '#4cd6ff',
    unlocked: true,
    unlockedAt: 'Aug 16, 2026',
  },
  {
    id: 'ach-3',
    title: 'Code Ninja',
    description: 'Executed 100+ Python and C++ automated test suites without compilation errors.',
    icon: 'terminal',
    color: '#b4c5ff',
    unlocked: true,
    unlockedAt: 'Aug 17, 2026',
  },
  {
    id: 'ach-4',
    title: 'Holographic Architect',
    description: 'Inspected 25 distinct AR hardware architectures in 3D mode.',
    icon: 'view_in_ar',
    color: '#f9a8d4',
    unlocked: false,
  },
];

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  user,
  onNavigate,
}) => {
  const [selectedDay, setSelectedDay] = useState<typeof studyWeekData[0] | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [timeFilter, setTimeFilter] = useState<'This Week' | 'Last Week' | 'Monthly'>('This Week');

  return (
    <div
      id="analytics-screen"
      className="bg-[#0b0f19] text-[#dfe2ef] min-h-screen pb-32 pt-16 relative overflow-x-hidden"
    >
      {/* Subtle Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            radial-gradient(circle at 70% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 60%),
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      />

      {/* Top Header */}
      <header className="fixed top-0 w-full z-40 backdrop-blur-xl bg-[#0e121e]/85 border-b border-white/10 flex justify-between items-center px-4 sm:px-8 h-16 max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt="User avatar"
            className="w-9 h-9 rounded-full border border-white/20 object-cover shadow-sm"
          />
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 size={17} className="text-cyan-400" />
              <span>Scholar Analytics</span>
            </h1>
            <p className="text-[11px] font-mono text-slate-400">
              Telemetry & Mastery Tracking
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('home')}
          title="Back to Dashboard"
          className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-mono"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Dashboard</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 flex flex-col gap-6 relative z-10">
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Academic Performance & Telemetry
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time analytics synced with Cloud Firestore.
          </p>
        </div>

        {/* Top Dual Metric Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Topic Completion Gauge */}
          <div className="bg-[#141824]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col items-center justify-between min-h-[260px] shadow-xl">
            <div className="flex justify-between items-center w-full mb-4">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                Topic Mastery
              </span>
              <span className="text-xs font-mono text-indigo-300">Target 80%</span>
            </div>

            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="transparent"
                  stroke="#232736"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="transparent"
                  stroke="#818cf8"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="301.6"
                  strokeDashoffset={301.6 - 301.6 * 0.75}
                  className="transition-all duration-1000"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-slate-100">75%</span>
                <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest mt-0.5">
                  Mastered
                </span>
              </div>
            </div>

            <div className="w-full text-center text-xs text-slate-400 pt-2 border-t border-white/5">
              18 of 24 curriculum modules completed
            </div>
          </div>

          {/* Quiz Performance Gauge */}
          <div className="bg-[#141824]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col items-center justify-between min-h-[260px] shadow-xl">
            <div className="flex justify-between items-center w-full mb-4">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                Quiz Evaluation Average
              </span>
              <span className="text-xs font-mono text-cyan-300">Top 5%</span>
            </div>

            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="transparent"
                  stroke="#232736"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="transparent"
                  stroke="#38bdf8"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="301.6"
                  strokeDashoffset={301.6 - 301.6 * 0.88}
                  className="transition-all duration-1000"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-slate-100">88%</span>
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest mt-0.5">
                  Avg Score
                </span>
              </div>
            </div>

            <div className="w-full text-center text-xs text-slate-400 pt-2 border-t border-white/5">
              Passed 32 algorithmic verification checks
            </div>
          </div>
        </div>

        {/* Weekly Study Hours Section */}
        <div className="bg-[#141824]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp size={18} className="text-cyan-400" />
                <span>Weekly Study Hours: {user.studyHoursThisWeek}h</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any day bar to view topic breakdown.
              </p>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex bg-[#0f131d] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
              {(['This Week', 'Last Week', 'Monthly'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    timeFilter === filter
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 h-44 items-end pt-4 border-b border-white/10 pb-2">
            {studyWeekData.map((d) => {
              const isSelected = selectedDay?.day === d.day;
              return (
                <div
                  key={d.day}
                  onClick={() => setSelectedDay(d)}
                  className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                >
                  <div
                    className="w-full rounded-t-lg transition-all duration-300 relative group-hover:brightness-125"
                    style={{
                      height: `${d.percentage}%`,
                      backgroundColor: isSelected ? '#38bdf8' : '#6366f1',
                    }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0b0e17] text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {d.hours}h
                    </div>
                  </div>
                  <span
                    className={`text-xs font-mono ${
                      isSelected ? 'text-cyan-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Day Toast Details */}
          {selectedDay && (
            <div className="mt-3 p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs font-mono flex items-center justify-between text-slate-200">
              <span>
                <strong>{selectedDay.day}</strong>: {selectedDay.hours} hours logged on "
                {selectedDay.topic}"
              </span>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-slate-400 hover:text-white ml-2 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award size={18} className="text-amber-400" />
              <span>Earned Achievements</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              3 of 4 Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievementsList.map((ach) => (
              <div
                key={ach.id}
                onClick={() => setSelectedAchievement(ach)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-md ${
                  ach.unlocked
                    ? 'bg-[#141824]/80 border-white/10 hover:border-indigo-400/40'
                    : 'bg-[#101420]/40 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: `${ach.color}25` }}
                  >
                    <Award size={20} style={{ color: ach.color }} />
                  </div>
                  {ach.unlocked ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : (
                    <Lock size={16} className="text-slate-500" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {ach.description}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-white/5">
                  {ach.unlocked ? `Unlocked: ${ach.unlockedAt}` : 'Locked Invariant'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#151926] border border-white/20 rounded-2xl p-5 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedAchievement.color}25` }}
                >
                  <Award size={24} style={{ color: selectedAchievement.color }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    {selectedAchievement.title}
                  </h3>
                  <span className="text-xs font-mono text-indigo-300">
                    {selectedAchievement.unlocked ? 'Unlocked Badge' : 'In Progress'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {selectedAchievement.description}
              </p>

              <button
                onClick={() => setSelectedAchievement(null)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
