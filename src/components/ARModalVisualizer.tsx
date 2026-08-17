import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scan,
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Cpu,
  GitFork,
  Activity,
  Layers,
} from 'lucide-react';
import { ARTopicTarget } from '../types';

interface ARModalVisualizerProps {
  target: ARTopicTarget;
  onClose: () => void;
  onAskAI: (question: string) => void;
}

export const ARModalVisualizer: React.FC<ARModalVisualizerProps> = ({
  target,
  onClose,
  onAskAI,
}) => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [clockCycle, setClockCycle] = useState(1);
  const [viewAngle, setViewAngle] = useState<'isometric' | 'top' | 'front'>('isometric');

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStageIndex((prev) => (prev + 1) % target.stages.length);
        setClockCycle((prev) => prev + 1);
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isPlaying, target.stages.length]);

  const activeStage = target.stages[activeStageIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0a0e17]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none"
    >
      {/* Top Hologram Control Bar */}
      <div className="flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
            <Scan size={22} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              3D AR Visualizer • {target.name}
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Clock Cycle #{clockCycle}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 capitalize">{viewAngle} Perspective</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Angle Switcher */}
          <div className="hidden sm:flex bg-[#141824] border border-white/10 rounded-xl p-1 gap-1">
            {(['isometric', 'top', 'front'] as const).map((angle) => (
              <button
                key={angle}
                onClick={() => setViewAngle(angle)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition-colors cursor-pointer ${
                  viewAngle === angle
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {angle}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            title="Exit AR Mode"
            className="w-10 h-10 rounded-full bg-[#141824] hover:bg-[#202534] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Holographic 3D Stage Simulation */}
      <div className="flex-1 relative flex items-center justify-center my-4">
        {/* Holographic Grid Surface */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(76,214,255,0.2) 0%, transparent 70%),
              linear-gradient(rgba(180,197,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(180,197,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 32px 32px, 32px 32px',
          }}
        />

        {/* 3D Hardware / Tree Interactive Nodes */}
        <div
          className={`relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl transition-all duration-700 ${
            viewAngle === 'top'
              ? 'scale-90 rotate-0'
              : viewAngle === 'front'
              ? 'scale-100 rotate-0'
              : 'scale-100 rotate-1'
          }`}
        >
          {target.stages.map((stage, idx) => {
            const isCurrent = idx === activeStageIndex;
            return (
              <motion.div
                key={stage.name}
                onClick={() => {
                  setActiveStageIndex(idx);
                  setIsPlaying(false);
                }}
                animate={{
                  scale: isCurrent ? 1.08 : 0.95,
                  y: isCurrent ? -8 : 0,
                  opacity: isCurrent ? 1 : 0.6,
                }}
                className={`w-28 sm:w-36 h-28 sm:h-36 rounded-2xl p-3 flex flex-col justify-between cursor-pointer border transition-all relative ${
                  isCurrent
                    ? 'bg-gradient-to-br from-indigo-900/60 to-[#1e2333]/90 border-cyan-400 shadow-[0_0_30px_rgba(76,214,255,0.4)]'
                    : 'bg-[#141824]/70 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400">0{idx + 1}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: stage.highlight }}
                  />
                </div>

                <div className="text-center my-auto">
                  <div className="text-xs sm:text-sm font-bold text-slate-100">
                    {stage.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {stage.name.split(' ').slice(1).join(' ')}
                  </div>
                </div>

                {isCurrent && (
                  <div className="w-full bg-cyan-400/20 text-cyan-300 text-[9px] font-mono text-center py-0.5 rounded uppercase">
                    ACTIVE
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Telemetry & Controls Box */}
      <div className="bg-[#141824]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 sm:p-5 max-w-3xl mx-auto w-full z-20 shadow-2xl flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="text-xs font-mono text-indigo-300 uppercase">
              Holographic Stage Invariant
            </span>
            <h4 className="text-lg font-bold text-slate-100">
              {activeStage.name}
            </h4>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveStageIndex((prev) => (prev > 0 ? prev - 1 : target.stages.length - 1));
                setIsPlaying(false);
              }}
              title="Previous Stage"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => {
                setActiveStageIndex((prev) => (prev + 1) % target.stages.length);
                setIsPlaying(false);
              }}
              title="Next Stage"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeStage.description}
        </p>

        {/* Live Hardware Register Telemetry */}
        <div className="bg-[#0b0e17] rounded-xl p-3 font-mono text-xs text-cyan-300 border border-white/10 flex items-center justify-between overflow-x-auto">
          <span>{activeStage.registers}</span>
          <span className="text-slate-500 text-[10px] uppercase ml-4 whitespace-nowrap">
            BUS: 64-BIT
          </span>
        </div>

        {/* Action Button: Query AI Tutor on this stage */}
        <button
          onClick={() =>
            onAskAI(
              `Explain stage '${activeStage.name}' of ${target.name} with assembly code and memory register traces.`
            )
          }
          className="w-full py-2.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-indigo-200 hover:text-white rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <Sparkles size={14} />
          <span>Explain "{activeStage.name}" with AI Tutor</span>
        </button>
      </div>
    </motion.div>
  );
};
