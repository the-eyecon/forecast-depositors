"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Activity, Terminal } from "lucide-react";

interface HeaderProps {
  lastUpdated: string;
  onRefresh: (newData: any) => void;
}

export default function Header({ lastUpdated, onRefresh }: HeaderProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("");
  const [timeAgo, setTimeAgo] = useState("Just now");

  // Calculate Time Ago for "Last Updated"
  useEffect(() => {
    const calculateTimeAgo = () => {
      const diffMs = Date.now() - new Date(lastUpdated).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) {
        setTimeAgo("Just now");
      } else if (diffMins === 1) {
        setTimeAgo("1m ago");
      } else {
        setTimeAgo(`${diffMins}m ago`);
      }
    };

    calculateTimeAgo();
    const interval = setInterval(calculateTimeAgo, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStatus("Contacting RPCs...");

    // Create fun progressive logs for realistic scanner experience
    const statuses = [
      "Contacting RPC providers...",
      "Crawling Base USDC transfers...",
      "Crawling Ethereum USDC transfers...",
      "Aggregating unique addresses...",
      "Compiling growth chart timelines...",
      "Saving telemetry to disk...",
      "Finalizing metrics...",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < statuses.length - 1) {
        currentStep++;
        setScanStatus(statuses[currentStep]);
      }
    }, 1500);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
      });
      const result = await response.json();
      
      clearInterval(interval);

      if (result.success && result.data) {
        setScanStatus("Scan complete!");
        setTimeout(() => {
          onRefresh(result.data);
          setIsScanning(false);
          setScanStatus("");
        }, 1000);
      } else {
        throw new Error(result.error || "Failed scan");
      }
    } catch (err: any) {
      console.error(err);
      clearInterval(interval);
      setScanStatus("Scan failed! RPC rate-limit.");
      setTimeout(() => {
        setIsScanning(false);
        setScanStatus("");
      }, 3000);
    }
  };

  return (
    <header className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-xl px-6 md:px-12">
      {/* Dynamic Background Glow Spot */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[350px] h-[150px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Title / Subtitle */}
      <div>
        <h1 className="font-space text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent">
            Forecast Analytics
          </span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan"></span>
          </span>
        </h1>
        <p className="text-zinc-500 text-sm mt-1 font-sans font-medium tracking-wide">
          Cross-chain deposit intelligence
        </p>
      </div>

      {/* Scanner Actions and Telemetry */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 self-stretch md:self-auto">
        {/* Active Scan Progress Terminal Log */}
        {isScanning && (
          <div className="flex items-center gap-2 bg-zinc-950/90 border border-neon-cyan/20 px-3 py-1.5 rounded-lg text-xs font-mono text-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.05)] animate-pulse">
            <Terminal size={12} className="text-neon-cyan animate-bounce" />
            <span>{scanStatus}</span>
          </div>
        )}

        <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
          {/* Last Updated telemetric tag */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-semibold text-zinc-600 tracking-widest font-mono">
              Telemetry Status
            </span>
            <span className="text-sm font-mono text-zinc-400 font-medium">
              Last Updated: <span className="text-white">{timeAgo}</span>
            </span>
          </div>

          {/* Refresh/Scan Button */}
          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-space font-semibold text-sm transition-all duration-300
              ${
                isScanning
                  ? "bg-zinc-900 border border-neon-cyan/30 text-neon-cyan shadow-neon-cyan"
                  : "bg-zinc-950 border border-zinc-800 hover:border-neon-cyan/40 text-white shadow-[0_0_20px_rgba(0,245,255,0.02)] hover:shadow-neon-cyan-hover hover:text-neon-cyan cursor-pointer"
              }
            `}
          >
            <RefreshCw
              size={14}
              className={`transition-transform duration-500 ${isScanning ? "animate-spin text-neon-cyan" : ""}`}
            />
            {isScanning ? "Scanning Chain..." : "Refresh Scan"}
          </button>
        </div>
      </div>
    </header>
  );
}
