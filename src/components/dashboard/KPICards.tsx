"use client";

import React from "react";
import { Users, BarChart3, Coins, Database } from "lucide-react";
import { motion } from "framer-motion";

interface KPICardsProps {
  totalUniqueDepositors: number;
  totalDeposits: number;
  totalUSDCDeposited: number;
  remainingCap: number;
}

export default function KPICards({
  totalUniqueDepositors,
  totalDeposits,
  totalUSDCDeposited,
  remainingCap,
}: KPICardsProps) {
  const CAPACITY = 2000000;
  const percentFilled = (totalUSDCDeposited / CAPACITY) * 100;

  const cards = [
    {
      title: "Total Unique Depositors",
      value: totalUniqueDepositors.toLocaleString(),
      subtext: "Addresses across all chains",
      icon: Users,
      glowColor: "rgba(0, 245, 255, 0.15)",
      hoverGlow: "shadow-neon-cyan-hover",
      borderColor: "border-neon-cyan/20",
      textColor: "text-neon-cyan",
    },
    {
      title: "Total Deposit Txns",
      value: `${totalDeposits.toLocaleString()} txs`,
      subtext: "Successful USDC transfers",
      icon: BarChart3,
      glowColor: "rgba(139, 92, 246, 0.15)",
      hoverGlow: "shadow-neon-purple-hover",
      borderColor: "border-neon-purple/20",
      textColor: "text-neon-purple",
    },
    {
      title: "Total USDC Deposited",
      value: `$${totalUSDCDeposited.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      subtext: "Aggregated TVL metric",
      icon: Coins,
      glowColor: "rgba(163, 255, 18, 0.15)",
      hoverGlow: "shadow-neon-lime-hover",
      borderColor: "border-neon-lime/20",
      textColor: "text-neon-lime",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-12 py-6">
      {/* Dynamic Grid Fade-in */}
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`
              relative overflow-hidden rounded-xl bg-zinc-950/70 border ${card.borderColor} backdrop-blur-xl
              px-6 py-5 flex flex-col justify-between h-[135px] transition-all duration-300
              shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:${card.hoverGlow}
            `}
          >
            {/* Ambient Background Glow Spot */}
            <div
              className="absolute -right-4 -top-4 w-16 h-16 rounded-full blur-[25px] pointer-events-none"
              style={{ backgroundColor: card.glowColor }}
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-zinc-500">
                {card.title}
              </span>
              <Icon size={18} className={card.textColor} />
            </div>

            <div className="mt-3 flex flex-col">
              <span className="text-3xl font-mono font-bold text-white tracking-tight">
                {card.value}
              </span>
              <span className="text-xs text-zinc-500 font-sans mt-0.5 font-medium">
                {card.subtext}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Capacity KPI Card with Inline Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="relative overflow-hidden rounded-xl bg-zinc-950/70 border border-neon-cyan/20 backdrop-blur-xl px-6 py-5 flex flex-col justify-between h-[135px] shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-neon-cyan-hover transition-all duration-300"
      >
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-neon-cyan/5 rounded-full blur-[25px] pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-zinc-500">
            Remaining Capacity
          </span>
          <Database size={18} className="text-neon-cyan" />
        </div>

        <div className="mt-3 flex flex-col">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-mono font-bold text-white tracking-tight">
              ${remainingCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs font-mono font-bold text-neon-cyan text-glow-cyan">
              {percentFilled.toFixed(1)}%
            </span>
          </div>

          {/* Animated Custom Progress Bar */}
          <div className="w-full bg-zinc-900 h-2.5 rounded-full mt-2.5 overflow-hidden border border-zinc-800/80">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentFilled}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-neon-cyan to-neon-purple h-full rounded-full relative"
            >
              <div className="absolute top-0 right-0 h-full w-2 bg-white blur-[2px] opacity-80" />
            </motion.div>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono mt-1.5 self-end">
            Limit: 2,000,000 USDC
          </span>
        </div>
      </motion.div>
    </div>
  );
}
