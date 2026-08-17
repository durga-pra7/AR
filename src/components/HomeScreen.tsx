import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Network,
  GitFork,
  Database,
  Terminal,
  Cpu,
  Share2,
  Sparkles,
  Scan,
  BarChart3,
  HelpCircle,
  ArrowRight,
  Flame,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Zap,
  Play,
  X,
} from 'lucide-react';
import { AppScreen, RecentTopic, UserProfile } from '../types';

interface HomeScreenProps {
  user: UserProfile;
  onNavigate: (screen: AppScreen) => void;
  onSelectTopic: (topicTitle: string, topicSubtitle: string) => void;
}

interface TopicItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
  iconColor: string;
  category: string;
  progressPercent: number;
  details: string;
  keyPoints: string[];
}

const initialTopics: TopicItem[] = [
  {
    id: 'networking',
    title: 'Networking',
    subtitle: 'TCP/IP Stack',
    icon: Network,
    accentColor: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300',
    iconColor: 'bg-cyan-500/20 text-cyan-300',
    category: 'Networks',
    progressPercent: 70,
    details: 'Packet routing, OSI model, TCP 3-way handshake, and congestion window management.',
    keyPoints: ['SYN / SYN-ACK Handshake', 'Window Sizing & Congestion', 'IP Subnetting & CIDR'],
  },
  {
    id: 'algorithms',
    title: 'Algorithms',
    subtitle: 'Sorting O(n)',
    icon: GitFork,
    accentColor: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-300',
    iconColor: 'bg-indigo-500/20 text-indigo-300',
    category: 'Algorithms',
    progressPercent: 88,
    details: 'Radix sort, Counting sort, Quickselect, and average/worst case complexities.',
    keyPoints: ['Asymptotic Bounds', 'Bucket & Radix Linear Sorts', 'Recursion Tree Analysis'],
  },
  {
    id: 'databases',
    title: 'Databases',
    subtitle: 'SQL Joins & Indexing',
    icon: Database,
    accentColor: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300',
    iconColor: 'bg-purple-500/20 text-purple-300',
    category: 'Data Engineering',
    progressPercent: 64,
    details: 'Inner joins, Left/Right outer joins, Full outer joins, and B-tree indexing strategies.',
    keyPoints: ['B+ Tree Node Layout', 'Hash Join vs Nested Loop', 'ACID Transactions & WAL'],
  },
  {
    id: 'cli',
    title: 'CLI Tools',
    subtitle: 'Bash Scripting & Pipelines',
    icon: Terminal,
    accentColor: 'from-slate-500/20 to-blue-500/10 border-slate-500/30 text-slate-200',
    iconColor: 'bg-slate-500/20 text-slate-200',
    category: 'Systems',
    progressPercent: 92,
    details: 'Pipes, redirects, subshells, environment variables, and automated deployment scripts.',
    keyPoints: ['File Descriptors & Redirection', 'xargs & Process Substitution', 'Shell Trap Signals'],
  },
  {
    id: 'cpu-pipeline',
    title: 'CPU Architecture',
    subtitle: '5-Stage RISC-V Pipeline',
    icon: Cpu,
    accentColor: 'from-sky-500/20 to-teal-500/10 border-sky-500/30 text-sky-300',
    iconColor: 'bg-sky-500/20 text-sky-300',
    category: 'Hardware',
    progressPercent: 45,
    details: 'Instruction fetch, decode, execute, memory access, write-back and pipeline hazard resolution.',
    keyPoints: ['IF-ID-EX-MEM-WB Stages', 'Branch Prediction & Flushes', 'Data Forwarding Paths'],
  },
  {
    id: 'distributed',
    title: 'Distributed Systems',
    subtitle: 'Raft Consensus Protocol',
    icon: Share2,
    accentColor: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-300',
    iconColor: 'bg-blue-500/20 text-blue-300',
    category: 'Architecture',
    progressPercent: 55,
    details: 'Leader election, log replication, safety invariants, and fault tolerance in clustered environments.',
    keyPoints: ['Term Heartbeats & Elections', 'Log Compaction & Snapshots', 'Split-Brain Quorum Safety'],
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  onNavigate,
  onSelectTopic,
}) => {
  const [dailyProgress, setDailyProgress] = useState(user.dailyGoalProgress || 75);
  const [selectedModalTopic, setSelectedModalTopic] = useState<TopicItem | null>(null);

  const handleIncrementProgress = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDailyProgress((prev) => (prev >= 100 ? 65 : Math.min(100, prev + 10)));
  };

  return (
    <div
      id="home-screen"
      className="bg-[#0c1019] text-[#dfe2ef] min-h-screen pb-32 pt-16 relative overflow-x-hidden"
    >
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 60%),
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      />

      {/* Top Header Bar */}
      <header className="fixed top-0 w-full z-40 backdrop-blur-xl bg-[#0e121e]/85 border-b border-white/10 flex justify-between items-center px-4 sm:px-8 h-16 max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-sm sm:text-base text-slate-100 tracking-tight">
                CodeMind
              </h1>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Flame size={11} className="text-amber-400 fill-amber-400" />
                <span>{user.streakDays}d Streak</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Level {user.level} • {user.role.split(' ')[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('analytics')}
            title="Telemetry Analytics"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors active:scale-95 cursor-pointer"
          >
            <BarChart3 size={18} />
          </button>
          <button
            onClick={() => onNavigate('onboarding')}
            title="Interactive Tutorial"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors active:scale-95 cursor-pointer"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 flex flex-col gap-6 relative z-10">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pt-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Welcome back, {user.name}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-0.5">
              Select any core curriculum module to launch the AI interactive tutor.
            </p>
          </div>

          <button
            onClick={() => onNavigate('scanner')}
            className="self-start sm:self-auto flex items-center gap-2 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/50 hover:to-indigo-600/50 border border-indigo-400/40 text-indigo-200 px-4 py-2 rounded-xl text-xs font-mono font-medium tracking-wide transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <Scan size={15} />
            <span>Launch AR Scanner</span>
          </button>
        </div>

        {/* Bento Grid: Daily Goal & Continue Learning */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Daily Progress Gauge (5 cols) */}
          <div className="col-span-1 md:col-span-5 bg-[#141824]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between relative shadow-xl">
            <div className="flex justify-between items-center w-full mb-2">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                Daily Mastery Goal
              </span>
              <button
                onClick={handleIncrementProgress}
                className="text-[11px] font-mono text-indigo-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-all cursor-pointer border border-white/10 active:scale-95"
              >
                + Complete Task
              </button>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#232736"
                  strokeWidth="7"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="url(#progressGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * dailyProgress) / 100}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-slate-100">
                  {dailyProgress}
                  <span className="text-lg font-normal text-indigo-300">%</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  Target
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
              <span>{user.studyHoursThisWeek}h logged this week</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 size={13} />
                {dailyProgress >= 100 ? 'Goal Completed' : 'In Progress'}
              </span>
            </div>
          </div>

          {/* Continue Learning Featured Block (7 cols) */}
          <div
            onClick={() => onSelectTopic('Data Structures & Algorithms', 'Module 4: Advanced Tree Traversals')}
            className="col-span-1 md:col-span-7 bg-gradient-to-br from-[#181d2c]/90 to-[#121622]/90 backdrop-blur-xl border border-white/10 hover:border-indigo-400/40 rounded-2xl p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden shadow-xl transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  In Progress Course
                </span>
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-200 transition-colors">
                Data Structures & Algorithms
              </h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                Module 4: Binary Search Trees, AVL Self-Balancing Rotations, and O(log n) Inorder Traversals.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">MODULE 4 / 6</span>
                <span className="text-indigo-300 font-bold">82% Complete</span>
              </div>
              <div className="h-2 w-full bg-[#202534] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[82%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Core Curriculum Grid Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Core Topic Modules
              </h3>
              <p className="text-xs text-slate-400">
                Click any topic card to inspect its syllabus or start a tailored AI tutor session.
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-300 hidden sm:inline">
              6 Specialized Labs
            </span>
          </div>

          {/* Clean Topic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedModalTopic(topic)}
                  className="bg-[#141824]/70 hover:bg-[#181d2a] border border-white/10 hover:border-indigo-400/40 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all duration-200 cursor-pointer shadow-md group hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${topic.iconColor} border border-white/10 shadow-sm`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                      {topic.progressPercent}%
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-slate-100 group-hover:text-indigo-200 transition-colors">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      {topic.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {topic.details}
                  </p>

                  <div className="flex items-center justify-between text-xs text-indigo-300 pt-2 border-t border-white/5 font-mono">
                    <span className="text-slate-400">{topic.category}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-indigo-300 font-medium">
                      Inspect &gt;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Detail Modal for Selected Topic */}
      <AnimatePresence>
        {selectedModalTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-[#151926] border border-white/20 rounded-2xl p-6 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedModalTopic(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedModalTopic.iconColor} border border-white/10`}>
                  <selectedModalTopic.icon size={24} />
                </div>
                <div>
                  <span className="text-xs font-mono text-cyan-300 uppercase">
                    {selectedModalTopic.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-100">
                    {selectedModalTopic.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {selectedModalTopic.details}
              </p>

              {/* Key Concept Syllabus */}
              <div className="bg-[#0f131d] rounded-xl p-3.5 border border-white/10 mb-5">
                <h5 className="text-xs font-mono text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                  <BookOpen size={13} />
                  <span>Module Syllabus Invariants</span>
                </h5>
                <ul className="space-y-1.5">
                  {selectedModalTopic.keyPoints.map((pt, i) => (
                    <li key={i} className="text-xs text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const topic = selectedModalTopic;
                    setSelectedModalTopic(null);
                    onSelectTopic(topic.title, topic.subtitle);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
                >
                  <Sparkles size={16} />
                  <span>Ask AI Tutor</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedModalTopic(null);
                    onNavigate('scanner');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
                >
                  <Scan size={16} />
                  <span>AR Scan</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
