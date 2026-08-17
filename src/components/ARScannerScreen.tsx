import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Zap,
  RotateCw,
  ZoomIn,
  Layers,
  Sparkles,
  Play,
  CheckCircle,
  Scan,
  Cpu,
  GitFork,
  Brain,
  Sliders,
} from 'lucide-react';
import { AppScreen, ARTopicTarget } from '../types';

interface ARScannerScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onLaunchAR: (target: ARTopicTarget) => void;
  onAskAI: (topic: string) => void;
}

const availableTargets: ARTopicTarget[] = [
  {
    id: 'cpu-pipeline',
    name: 'CPU 5-Stage Pipeline',
    category: 'Computer Architecture',
    description:
      'Interact with instruction fetch, decode, execute, memory access, and write-back stages in 3D holographic space.',
    tags: ['RISC-V', 'Hazards', 'ALU', 'Branch Prediction'],
    stages: [
      {
        name: 'IF (Instruction Fetch)',
        description: 'Fetches instruction from Instruction Cache at address in PC (Program Counter).',
        registers: 'PC = 0x00400000, IR = 0x00520820 (ADD $1, $2, $3)',
        highlight: '#4cd6ff',
      },
      {
        name: 'ID (Instruction Decode)',
        description: 'Decodes opcode, reads operands from Register File, sign-extends immediate value.',
        registers: 'Regs[$2] = 42, Regs[$3] = 18, ControlUnit = ALU_ADD',
        highlight: '#b4c5ff',
      },
      {
        name: 'EX (Execute / ALU)',
        description: 'Arithmetic Logic Unit performs computation or computes effective memory address.',
        registers: 'ALU Result = 42 + 18 = 60, ZeroFlag = 0',
        highlight: '#d2bbff',
      },
      {
        name: 'MEM (Memory Access)',
        description: 'Accesses Data Cache for Load/Store operations. Passed through for ALU operations.',
        registers: 'Data Memory = Bypass (No RAM read required)',
        highlight: '#2563eb',
      },
      {
        name: 'WB (Write Back)',
        description: 'Writes computed ALU result back into destination register in Register File.',
        registers: 'Regs[$1] <- 60. Cycle Latency = 1 CPI',
        highlight: '#6001d1',
      },
    ],
  },
  {
    id: 'bst-tree',
    name: 'Binary Search Tree & AVL',
    category: 'Data Structures',
    description:
      'Interactive 3D tree nodes demonstrating recursive search, AVL balance rotations, and heap invariants.',
    tags: ['O(log n)', 'Rotations', 'Binary Tree', 'Recursion'],
    stages: [
      {
        name: 'Root Node (Key 50)',
        description: 'Root comparator evaluated. Target key 65 is greater, branch right.',
        registers: 'Current = Node(50), Next = Node(75)',
        highlight: '#4cd6ff',
      },
      {
        name: 'Right Child (Key 75)',
        description: 'Evaluating right subtree. Target key 65 is lesser, branch left.',
        registers: 'Current = Node(75), Next = Node(65)',
        highlight: '#b4c5ff',
      },
      {
        name: 'Target Found (Key 65)',
        description: 'Found element in 3 steps. Inorder predecessor & balance factor maintained.',
        registers: 'Search Status: MATCH (Depth: 2, AVL Factor: 0)',
        highlight: '#d2bbff',
      },
    ],
  },
  {
    id: 'neural-layer',
    name: 'Transformer Attention Head',
    category: 'Machine Learning',
    description:
      'Inspect Query, Key, and Value matrix multiplications and softmax attention weights in 3D holographic tensors.',
    tags: ['Self-Attention', 'QKV Matrices', 'Softmax', 'Tensors'],
    stages: [
      {
        name: 'Q & K Projection',
        description: 'Projecting input embeddings through learned linear weight matrices Wq and Wk.',
        registers: 'Dim = 512, Heads = 8, Matmul(Q, K^T)',
        highlight: '#4cd6ff',
      },
      {
        name: 'Scaled Softmax',
        description: 'Softmax(QK^T / sqrt(dk)) generates attention affinity distribution matrix.',
        registers: 'Affinity Matrix = 8x8 normalized weights',
        highlight: '#b4c5ff',
      },
      {
        name: 'Value Aggregation',
        description: 'Weighted combination of Value vectors producing context-rich token representations.',
        registers: 'Output Tensor = [Batch, SeqLen, Dim]',
        highlight: '#d2bbff',
      },
    ],
  },
];

export const ARScannerScreen: React.FC<ARScannerScreenProps> = ({
  onNavigate,
  onLaunchAR,
  onAskAI,
}) => {
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [torchActive, setTorchActive] = useState(false);

  const currentTarget = availableTargets[currentTargetIndex];

  const handleRotate = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
  };

  const handleZoom = () => {
    setZoomLevel((prev) => (prev === 1.0 ? 1.3 : prev === 1.3 ? 1.6 : 1.0));
  };

  const handleNextTarget = () => {
    setCurrentTargetIndex((prev) => (prev + 1) % availableTargets.length);
  };

  return (
    <div
      id="ar-scanner-screen"
      className="bg-[#0b0e17] text-[#dfe2ef] min-h-screen w-full overflow-hidden relative select-none"
    >
      {/* Camera Feed Simulated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="bg-cover bg-center w-full h-full opacity-60 transition-transform duration-500"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBdlQK_ihoM_lWwFjxrhsx_p_h9dJNrBhpcLJcVw7LI6K5TDy2ny4TLrpZmu89pf6fmBoROIv1jvAYndXdQIcpvf1g8LNcz52JgNmPgUGRqgIs8YT9UnVT3qYfW-oMMFsm9cGqeT9tzl1MfxAwufpMIGw3DoV7YzyWUq-4u2J8UjvyJqXlS0mFH_UKXzSzGW5HGdr-uZICiFKvt-5uMo9_2vKLE4X5RnaIVGRGyBx0886_PMRpdbwVmqg')`,
            transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e17]/80 via-transparent to-[#0b0e17]/95 pointer-events-none" />
      </div>

      {/* Top HUD Header Bar */}
      <header className="absolute top-0 w-full z-20 flex justify-between items-center px-4 sm:px-6 py-3 bg-[#121622]/85 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <button
          onClick={() => onNavigate('home')}
          title="Back to Dashboard"
          className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-mono hidden sm:inline">Dashboard</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-sm sm:text-base font-bold text-indigo-300 tracking-wide flex items-center gap-2">
            <Scan size={16} className="text-cyan-400" />
            <span>Spatial AR Scanner</span>
          </h1>
          <span className="text-[10px] font-mono text-slate-400">
            Target {currentTargetIndex + 1} of {availableTargets.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setTorchActive(!torchActive)}
            title="Toggle Flashlight"
            className={`p-2 rounded-xl transition-colors active:scale-95 cursor-pointer ${
              torchActive
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap size={18} />
          </button>
          <button
            onClick={handleNextTarget}
            title="Switch Target Concept"
            className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <Layers size={18} />
          </button>
        </div>
      </header>

      {/* Floating Ask AI Button */}
      <button
        onClick={() => onAskAI(currentTarget.name)}
        title="Ask AI Tutor about this topic"
        className="absolute top-20 right-4 sm:right-6 z-30 flex items-center gap-2 bg-[#171b28]/90 hover:bg-indigo-600/80 backdrop-blur-md border border-indigo-400/30 text-indigo-200 hover:text-white px-3.5 py-2 rounded-full shadow-xl transition-all active:scale-95 cursor-pointer text-xs font-mono"
      >
        <Sparkles size={15} className="text-indigo-300" />
        <span>Ask AI Tutor</span>
      </button>

      {/* Scanner Reticle & HUD Overlay */}
      <main className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        {/* Status Lock Indicator */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-[#171b28]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-400/30 flex items-center gap-2 pointer-events-auto shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest font-semibold">
            Optical Target Locked
          </span>
        </div>

        {/* Reticle Box */}
        <div className="scanner-reticle relative">
          <div className="scanning-line" />

          {/* Corner Brackets */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-xl" />

          {/* Target Identification Badge */}
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white font-mono text-[11px] px-3 py-0.5 rounded-full border border-blue-400/40 whitespace-nowrap shadow-lg">
            {currentTarget.name}
          </div>
        </div>

        {/* Right HUD Controls (Rotate, Zoom, Switch) */}
        <div className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 pointer-events-auto z-20">
          <button
            onClick={handleRotate}
            title="Rotate View (90 deg)"
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-[#141824]/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-200 hover:text-cyan-300 hover:border-cyan-400/50 transition-all active:scale-95 shadow-xl">
              <RotateCw size={18} />
            </div>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">
              Rotate
            </span>
          </button>

          <button
            onClick={handleZoom}
            title={`Zoom (${zoomLevel}x)`}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-[#141824]/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-200 hover:text-cyan-300 hover:border-cyan-400/50 transition-all active:scale-95 shadow-xl">
              <ZoomIn size={18} />
            </div>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">
              {zoomLevel}x
            </span>
          </button>

          <button
            onClick={handleNextTarget}
            title="Switch Target Concept"
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-[#141824]/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-200 hover:text-indigo-300 hover:border-indigo-400/50 transition-all active:scale-95 shadow-xl">
              <Layers size={18} />
            </div>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-300">
              Next
            </span>
          </button>
        </div>
      </main>

      {/* Bottom Result Card */}
      <div className="absolute bottom-20 sm:bottom-4 left-0 w-full z-20 p-4 sm:p-6 pointer-events-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-[#141824]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 shadow-2xl max-w-xl mx-auto flex flex-col gap-3"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-mono text-indigo-300 uppercase tracking-wider block font-semibold">
                {currentTarget.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-0.5">
                {currentTarget.name}
              </h2>
            </div>
            <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-400/30 text-indigo-300">
              <Scan size={20} />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentTarget.description}
          </p>

          <div className="flex flex-wrap gap-1.5 py-0.5">
            {currentTarget.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-indigo-200"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Launch AR Modal Visualizer */}
          <button
            id="launch-ar-btn"
            onClick={() => onLaunchAR(currentTarget)}
            className="w-full py-3.5 mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm sm:text-base rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all active:scale-[0.98] flex justify-center items-center gap-2 cursor-pointer"
          >
            <span>Launch Interactive 3D AR Model</span>
            <Play size={16} className="fill-white" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
