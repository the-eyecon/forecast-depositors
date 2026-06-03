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
      type: "metric",
      title: "Total USDC Deposited",
      value: `$${totalUSDCDeposited.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      subtext: "Aggregated TVL metric",
      icon: Coins,
      glowColor: "rgba(163, 255, 18, 0.15)",
      hoverGlow: "shadow-neon-lime-hover",
      borderColor: "border-neon-lime/20",
      textColor: "text-neon-lime",
    },
    {
      type: "capacity",
      title: "Remaining Capacity",
      value: `$${remainingCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      subtext: "",
      icon: Database,
      glowColor: "rgba(0, 245, 255, 0.15)",
      hoverGlow: "shadow-neon-cyan-hover",
      borderColor: "border-neon-cyan/20",
      textColor: "text-neon-cyan",
    },
    {
      type: "metric",
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
      type: "metric",
      title: "Total Unique Depositors",
      value: totalUniqueDepositors.toLocaleString(),
      subtext: "Addresses across all chains",
      icon: Users,
      glowColor: "rgba(0, 245, 255, 0.15)",
      hoverGlow: "shadow-neon-cyan-hover",
      borderColor: "border-neon-cyan/20",
      textColor: "text-neon-cyan",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-12 py-6">
      {/* Dynamic Grid Fade-in */}
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        if (card.type === "capacity") {
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`
                relative rounded-xl bg-zinc-950/70 border ${card.borderColor} backdrop-blur-xl
                px-6 py-5 flex flex-col justify-between h-[135px] transition-all duration-300
                shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:${card.hoverGlow}
              `}
            >
              {/* Ambient Background Glow Spot */}
              <div
                className="absolute -right-4 -top-4 w-16 h-16 rounded-full blur-[25px] pointer-events-none animate-pulse"
                style={{ backgroundColor: card.glowColor }}
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-zinc-500">
                  {card.title}
                </span>
                <Icon size={18} className={card.textColor} />
              </div>

              <div className="mt-3 flex flex-col">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-mono font-bold text-white tracking-tight">
                    {card.value}
                  </span>
                  <span className={`text-xs font-mono font-bold ${card.textColor} text-glow-cyan`}>
                    {percentFilled.toFixed(1)}%
                  </span>
                </div>

                {/* Animated Custom Progress Bar */}
                <div className="w-full bg-zinc-900 h-2.5 rounded-full mt-2.5 overflow-hidden border border-zinc-800/80">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentFilled}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                    className="bg-gradient-to-r from-neon-cyan to-neon-purple h-full rounded-full relative"
                  >
                    <div className="absolute top-0 right-0 h-full w-2 bg-white blur-[2px] opacity-80" />
                  </motion.div>
                </div>

                {/* Premium Tooltip Container */}
                <div className="relative group self-end mt-1.5 z-20">
                  <span className="text-[10px] text-zinc-500 font-mono cursor-help hover:text-neon-cyan transition-colors duration-200">
                    Limit: 2,000,000 USDC
                  </span>
                  {/* Tooltip Popup */}
                  <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 w-64 bg-zinc-950/98 border border-neon-cyan/30 text-[10px] font-mono text-zinc-300 p-3 rounded-lg shadow-[0_0_20px_rgba(0,245,255,0.15)] backdrop-blur-xl">
                    <div className="text-neon-cyan font-bold mb-1 tracking-wider uppercase">Phase Capacity Limit</div>
                    Maximum protocol deposit capacity for this campaign phase is 2,000,000 USDC across all monitored chains.
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`
              relative rounded-xl bg-zinc-950/70 border ${card.borderColor} backdrop-blur-xl
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
    </div>
  );
}
