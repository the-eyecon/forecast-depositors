"use client";

import React, { useRef, useEffect } from "react";
import { X, ExternalLink, Calendar, Layers, Layers2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WalletData } from "../../types/dashboard";
import { cn } from "../../lib/utils";

interface WalletDrawerProps {
  wallet: WalletData | null;
  onClose: () => void;
}

export default function WalletDrawer({ wallet, onClose }: WalletDrawerProps) {
  const [copied, setCopied] = React.useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (wallet && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Add small delay to avoid instant close during list trigger
    setTimeout(() => {
      window.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wallet, onClose]);

  if (!wallet) return null;

  // Calculate chain totals
  const baseUSDC = wallet.history
    .filter((tx) => tx.chain === "base")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const ethUSDC = wallet.history
    .filter((tx) => tx.chain === "ethereum")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const basePercent = wallet.totalUSDC > 0 ? (baseUSDC / wallet.totalUSDC) * 100 : 0;
  const ethPercent = wallet.totalUSDC > 0 ? (ethUSDC / wallet.totalUSDC) * 100 : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getChainUrl = (chain: string, txHash: string) => {
    return chain === "base"
      ? `https://basescan.org/tx/${txHash}`
      : `https://etherscan.io/tx/${txHash}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Transparent Blur Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          ref={drawerRef}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 180 }}
          className="
            relative w-full max-w-[460px] h-full bg-zinc-950 border-l border-zinc-900 backdrop-blur-2xl
            flex flex-col justify-between shadow-2xl p-6 overflow-y-auto
          "
        >
          {/* Neon Glow Spot */}
          <div className="absolute top-1/4 right-0 w-[200px] h-[200px] bg-neon-cyan/5 rounded-full blur-[70px] pointer-events-none" />

          <div className="flex flex-col h-full">
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                <h2 className="font-space text-base font-bold text-white uppercase tracking-wider">
                  Wallet Details
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg border border-zinc-900 hover:border-zinc-800 text-zinc-500 hover:text-white cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Wallet stats segment */}
            <div className="flex flex-col gap-5">
              {/* Address card */}
              <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-semibold">
                    Address
                  </span>
                  <span className="text-sm font-mono text-white mt-1 break-all pr-2">
                    {wallet.address}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 shrink-0 rounded-lg border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition-all duration-300"
                >
                  {copied ? <Check size={14} className="text-neon-lime" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Total USDC aggregate */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-semibold">
                    Total Deposited
                  </span>
                  <span className="text-2xl font-mono font-bold text-white mt-1 block text-glow-lime">
                    ${wallet.totalUSDC.toLocaleString()}
                  </span>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-semibold">
                    Total Deposits
                  </span>
                  <span className="text-2xl font-mono font-bold text-zinc-300 mt-1 block">
                    {wallet.totalDeposits} txs
                  </span>
                </div>
              </div>

              {/* Chain Specific breakdowns */}
              <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl flex flex-col gap-3.5">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-semibold">
                  Cross-chain allocation
                </span>

                <div className="flex flex-col gap-3">
                  {/* Base progress */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neon-cyan flex items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" /> Base
                      </span>
                      <span className="text-zinc-300 font-bold">
                        ${baseUSDC.toLocaleString()} ({basePercent.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-neon-cyan h-full rounded-full"
                        style={{ width: `${basePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Ethereum progress */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neon-purple flex items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" /> Ethereum
                      </span>
                      <span className="text-zinc-300 font-bold">
                        ${ethUSDC.toLocaleString()} ({ethPercent.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-neon-purple h-full rounded-full"
                        style={{ width: `${ethPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendric milestones */}
              <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl grid grid-cols-2 gap-4">
                <div className="flex gap-2.5 items-center">
                  <Calendar size={16} className="text-zinc-600" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider font-semibold">
                      First Deposit
                    </span>
                    <span className="text-xs font-mono text-zinc-300 font-medium mt-0.5">
                      {wallet.firstDeposit}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-center">
                  <Calendar size={16} className="text-zinc-600" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider font-semibold">
                      Latest Deposit
                    </span>
                    <span className="text-xs font-mono text-zinc-300 font-medium mt-0.5">
                      {wallet.lastDeposit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deposit History list */}
            <div className="mt-6 flex-1 flex flex-col min-h-0">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-semibold mb-3.5 block">
                Transaction History
              </span>

              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-[160px]">
                {wallet.history.map((tx) => (
                  <div
                    key={tx.txHash}
                    className="
                      flex items-center justify-between p-3 rounded-lg border border-zinc-900 bg-zinc-950/50
                      hover:bg-zinc-900/10 hover:border-zinc-800 transition-colors
                    "
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "text-[8px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border",
                          tx.chain === "base"
                            ? "bg-neon-cyan/5 border-neon-cyan/20 text-neon-cyan"
                            : "bg-neon-purple/5 border-neon-purple/20 text-neon-purple"
                        )}
                      >
                        {tx.chain}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-bold text-white">
                          ${tx.amount.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono mt-0.5">
                          Block: {tx.blockNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-zinc-500">{tx.date}</span>
                      <a
                        href={getChainUrl(tx.chain, tx.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-900/60 hover:border-zinc-800 transition-colors"
                      >
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
