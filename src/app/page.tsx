"use client";

import React, { useState } from "react";
import initialData from "../data/dashboard-data.json";
import { DashboardData, WalletData } from "../types/dashboard";

// Dashboard subcomponents
import Header from "../components/dashboard/Header";
import KPICards from "../components/dashboard/KPICards";
import ChainCards from "../components/dashboard/ChainCards";
import GrowthChart from "../components/dashboard/GrowthChart";
import CapacityWidget from "../components/dashboard/CapacityWidget";
import Leaderboard from "../components/dashboard/Leaderboard";
import WalletTable from "../components/dashboard/WalletTable";
import WalletDrawer from "../components/dashboard/WalletDrawer";

export default function DashboardHome() {
  const [data, setData] = useState<DashboardData>(initialData as DashboardData);
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null);

  // Triggered when scanner finishes a crawl
  const handleDataRefresh = (updatedData: DashboardData) => {
    setData(updatedData);
  };

  return (
    <div className="relative min-h-screen flex flex-col pb-16 bg-background text-foreground bg-grid-cyber selection:bg-neon-cyan/20 selection:text-neon-cyan overflow-hidden">
      
      {/* Ambient background glows for gorgeous cyberpunk vibe */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-neon-lime/3 rounded-full blur-[180px] pointer-events-none" />

      {/* Header section */}
      <Header lastUpdated={data.lastUpdated} onRefresh={handleDataRefresh} />

      {/* KPI summaries row */}
      <KPICards
        totalUniqueDepositors={data.totalUniqueDepositors}
        totalDeposits={data.totalDeposits}
        totalUSDCDeposited={data.totalUSDCDeposited}
        remainingCap={data.remainingCap}
      />

      {/* Chain stats row */}
      <ChainCards base={data.chains.base} ethereum={data.chains.ethereum} />

      {/* Growth Timeline & Capacity widget grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 md:px-12 py-3.5">
        <div className="lg:col-span-2">
          <GrowthChart data={data.growthData} />
        </div>
        <div className="lg:col-span-1">
          <CapacityWidget totalUSDCDeposited={data.totalUSDCDeposited} />
        </div>
      </div>

      {/* Explorer grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 md:px-12 py-3.5">
        <div className="lg:col-span-2">
          <WalletTable wallets={data.wallets} onSelectWallet={setSelectedWallet} />
        </div>
        <div className="lg:col-span-1">
          <Leaderboard wallets={data.wallets} onSelectWallet={setSelectedWallet} />
        </div>
      </div>

      {/* Slideout details drawer */}
      <WalletDrawer wallet={selectedWallet} onClose={() => setSelectedWallet(null)} />

      <footer className="mt-8 text-center text-xs text-zinc-500 pb-8">
        Made by{' '}
        <a
          href="https://x.com/CryptoEyeCon"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-neon-cyan hover:text-neon-cyan/80"
        >
          Eyecon
        </a>{' '}
        with ❤️
      </footer>
    </div>
  );
}
