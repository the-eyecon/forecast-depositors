"use client";

import React from "react";
import { motion } from "framer-motion";
import { Crown, ArrowUpRight } from "lucide-react";
import { WalletData } from "../../types/dashboard";

interface LeaderboardProps {
  wallets: WalletData[];
  onSelectWallet: (wallet: WalletData) => void;
}

export default function Leaderboard({ wallets, onSelectWallet }: LeaderboardProps) {
  // Grab top 5 depositors
  const topDepositors = wallets.slice(0, 5);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 0:
        return "bg-gradient-to-r from-yellow-500 to-amber-600 text-black border-yellow-400";
      case 1:
        return "bg-gradient-to-r from-zinc-300 to-zinc-500 text-black border-zinc-200";
      case 2:
        return "bg-gradient-to-r from-amber-700 to-orange-800 text-white border-amber-600";
      default:
        return "bg-zinc-900 border-zinc-800 text-zinc-400";
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-zinc-950/70 border border-zinc-900 backdrop-blur-xl p-6 flex flex-col h-[340px] shadow-[0_0_30px_rgba(0,0,0,0.3)]">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/5 rounded-full blur-[25px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="font-space text-sm font-bold text-white tracking-wide uppercase font-mono text-zinc-500 flex items-center gap-2">
          <Crown size={14} className="text-neon-lime" />
          <span>Top Depositor Leaderboard</span>
        </h3>
      </div>

      {/* Leaderboard items */}
      <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 h-full">
        {topDepositors.map((wallet, index) => (
          <motion.div
            key={wallet.address}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onSelectWallet(wallet)}
            className="
              group flex items-center justify-between p-3 rounded-lg bg-zinc-950/40 border border-zinc-900/60
              hover:border-neon-cyan/20 hover:bg-zinc-900/20 cursor-pointer transition-all duration-300
            "
          >
            <div className="flex items-center gap-3">
              {/* Rank Badge */}
              <span
                className={`
                  w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-extrabold border
                  ${getRankBadge(index)}
                `}
              >
                {index + 1}
              </span>

              {/* Wallet Address */}
              <div className="flex flex-col">
                <span className="font-mono text-sm text-zinc-100 group-hover:text-neon-cyan transition-colors">
                  {truncateAddress(wallet.address)}
                </span>
                <span className="text-[10px] text-zinc-500 font-sans mt-0.5">
                  {wallet.totalDeposits} transaction{wallet.totalDeposits > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Total Deposited USDC */}
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-white text-glow-lime">
                ${wallet.totalUSDC.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </span>
              <ArrowUpRight
                size={14}
                className="text-zinc-600 group-hover:text-neon-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
              />
            </div>
          </motion.div>
        ))}

        {topDepositors.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono text-xs">
            No depositors tracked yet.
          </div>
        )}
      </div>
    </div>
  );
}
