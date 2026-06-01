"use client";

import React from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

interface CapacityWidgetProps {
  totalUSDCDeposited: number;
}

export default function CapacityWidget({ totalUSDCDeposited }: CapacityWidgetProps) {
  const CAPACITY = 2000000;
  const percentFilled = Math.min(100, (totalUSDCDeposited / CAPACITY) * 100);

  // SVG parameters for standard circle
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentFilled / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-xl bg-zinc-950/70 border border-zinc-900 backdrop-blur-xl p-6 flex flex-col items-center justify-between h-[340px] shadow-[0_0_30px_rgba(0,0,0,0.3)]">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-neon-cyan/5 rounded-full blur-[45px] pointer-events-none" />

      {/* Card title */}
      <div className="w-full flex items-center justify-between">
        <h3 className="font-space text-sm font-bold text-white tracking-wide uppercase font-mono text-zinc-500">
          Capacity Widget
        </h3>
        <Info size={14} className="text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors" />
      </div>

      {/* Large SVG Circular progress */}
      <div className="relative w-[180px] h-[180px] mt-2 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Gradients */}
          <defs>
            <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F5FF" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#121214"
            strokeWidth={strokeWidth}
          />

          {/* Foreground Glow (Behind main stroke) */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="url(#cyberGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            opacity={0.3}
            filter="url(#neonGlow)"
          />

          {/* Foreground Active Stroke */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="url(#cyberGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Text inside circle */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-mono font-bold text-white tracking-tighter text-glow-cyan">
            {percentFilled.toFixed(1)}%
          </span>
          <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest mt-0.5">
            Filled
          </span>
        </div>
      </div>

      {/* Metric Info below circle */}
      <div className="w-full grid grid-cols-2 gap-4 border-t border-zinc-900/80 pt-4 mt-2">
        <div className="flex flex-col items-center border-r border-zinc-900/80">
          <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-zinc-500">
            Total Filled
          </span>
          <span className="text-sm font-mono font-bold text-white mt-0.5">
            ${totalUSDCDeposited.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-zinc-500">
            Max Cap
          </span>
          <span className="text-sm font-mono font-bold text-zinc-400 mt-0.5">
            $2.0M USDC
          </span>
        </div>
      </div>
    </div>
  );
}
