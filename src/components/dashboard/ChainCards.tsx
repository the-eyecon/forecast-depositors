"use client";

import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet, Landmark, TrendingUp } from "lucide-react";

interface ChainStats {
  uniqueDepositors: number;
  deposits: number;
  totalUSDC: number;
}

interface ChainCardsProps {
  base: ChainStats;
  ethereum: ChainStats;
}

export default function ChainCards({ base, ethereum }: ChainCardsProps) {
  const totalUSDC = base.totalUSDC + ethereum.totalUSDC;
  const basePercent = totalUSDC > 0 ? (base.totalUSDC / totalUSDC) * 100 : 0;
  const ethPercent = totalUSDC > 0 ? (ethereum.totalUSDC / totalUSDC) * 100 : 0;

  const data = [
    { name: "Base", value: base.totalUSDC, color: "#00F5FF", percent: basePercent },
    { name: "Ethereum", value: ethereum.totalUSDC, color: "#8B5CF6", percent: ethPercent },
  ];

  // Custom tooltips for Recharts Pie Chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg shadow-xl font-mono text-xs">
          <p className="text-white font-bold">{data.name}</p>
          <p className="text-zinc-400 mt-1">
            USDC: <span className="text-white">${data.value.toLocaleString()}</span>
          </p>
          <p className="text-zinc-400">
            Share: <span className="text-white">{data.percent.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 md:px-12 py-6">
      {/* 1. Base Chain Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="
          relative overflow-hidden rounded-xl bg-zinc-950/70 border border-neon-cyan/20 backdrop-blur-xl
          p-6 flex flex-col justify-between h-[230px] transition-all duration-300
          shadow-[0_0_40px_rgba(0,245,255,0.06)] hover:shadow-neon-cyan-hover
        "
      >
        {/* Glow behind cards */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-space text-lg font-bold text-white tracking-wide">Base</h3>
            <span className="bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full font-mono">
              Base Stats
            </span>
          </div>

          <div className="mt-5 flex flex-col">
            <span className="text-xs uppercase font-mono font-bold text-zinc-500 tracking-wider">
              Deposited Assets
            </span>
            <span className="text-4xl font-mono font-bold text-white tracking-tight text-glow-cyan">
              ${base.totalUSDC.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500 font-mono mt-0.5">USDC Token TVL</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-4 mt-4">
          <div className="flex items-center gap-2">
            <Wallet size={14} className="text-neon-cyan" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Depositors</span>
              <span className="text-sm font-mono font-bold text-white">{base.uniqueDepositors}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Landmark size={14} className="text-neon-cyan" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Deposits</span>
              <span className="text-sm font-mono font-bold text-white">{base.deposits} txs</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Ethereum Chain Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="
          relative overflow-hidden rounded-xl bg-zinc-950/70 border border-neon-purple/20 backdrop-blur-xl
          p-6 flex flex-col justify-between h-[230px] transition-all duration-300
          shadow-[0_0_40px_rgba(139,92,246,0.06)] hover:shadow-neon-purple-hover
        "
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-transparent opacity-60 pointer-events-none" />

        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-space text-lg font-bold text-white tracking-wide">Ethereum</h3>
            <span className="bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full font-mono">
              Ethereum Stats
            </span>
          </div>

          <div className="mt-5 flex flex-col">
            <span className="text-xs uppercase font-mono font-bold text-zinc-500 tracking-wider">
              Deposited Assets
            </span>
            <span className="text-4xl font-mono font-bold text-white tracking-tight text-glow-purple">
              ${ethereum.totalUSDC.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500 font-mono mt-0.5">USDC Token TVL</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-4 mt-4">
          <div className="flex items-center gap-2">
            <Wallet size={14} className="text-neon-purple" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Depositors</span>
              <span className="text-sm font-mono font-bold text-white">{ethereum.uniqueDepositors}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Landmark size={14} className="text-neon-purple" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Deposits</span>
              <span className="text-sm font-mono font-bold text-white">{ethereum.deposits} txs</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Distribution Pie Chart Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="
          relative overflow-hidden rounded-xl bg-zinc-950/70 border border-zinc-900 backdrop-blur-xl
          p-6 flex flex-col justify-between h-[230px] shadow-[0_0_30px_rgba(0,0,0,0.3)]
        "
      >
        <div className="flex items-center justify-between">
          <h3 className="font-space text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <TrendingUp size={16} className="text-neon-lime" />
            <span>Deposit Distribution</span>
          </h3>
        </div>

        <div className="flex items-center justify-between h-full gap-4 mt-2">
          {/* Recharts Pie Chart Container */}
          <div className="w-[120px] h-[120px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={52}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#050505" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Details Legend */}
          <div className="flex flex-col gap-3.5 w-full">
            {data.map((item) => (
              <div key={item.name} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-sans font-medium text-white">{item.name}</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-zinc-300">
                    {item.percent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-zinc-900/50 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
