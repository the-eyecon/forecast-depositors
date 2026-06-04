"use client";

import React, { useState, useEffect, useRef } from "react";
import { RefreshCw, Activity, Terminal, Square } from "lucide-react";

interface HeaderProps {
  lastUpdated: string;
  onRefresh: (newData: any) => void;
}

export default function Header({ lastUpdated, onRefresh }: HeaderProps) {
  const REFRESH_INTERVAL = 1800; // 30 minutes in seconds

  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("");
  const [timeAgo, setTimeAgo] = useState("Just now");
  const [timeLeft, setTimeLeft] = useState(() => {
    // Initialize countdown from lastUpdated so it's always in sync
    const elapsed = Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 1000);
    return Math.max(0, REFRESH_INTERVAL - elapsed);
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Unified tick: update both "time ago" and "time left" every second from the same source
  useEffect(() => {
    const tick = () => {
      const elapsedMs = Date.now() - new Date(lastUpdated).getTime();
      const elapsedSec = Math.floor(elapsedMs / 1000);
      const elapsedMins = Math.floor(elapsedMs / 60000);

      // Update "Last Updated" display
      if (elapsedMins < 1) {
        setTimeAgo("Just now");
      } else if (elapsedMins === 1) {
        setTimeAgo("1m ago");
      } else {
        setTimeAgo(`${elapsedMins}m ago`);
      }

      // Update countdown (only if not currently scanning)
      if (!isScanning) {
        setTimeLeft(Math.max(0, REFRESH_INTERVAL - elapsedSec));
      }
    };

    tick(); // Run immediately on mount / lastUpdated change
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated, isScanning]);

  // Keep handleScan ref updated to prevent stale closures
  const handleScanRef = useRef<() => Promise<void>>(async () => {});
  useEffect(() => {
    handleScanRef.current = handleScan;
  });

  // Trigger auto-scan when countdown reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !isScanning) {
      handleScanRef.current();
    }
  }, [timeLeft, isScanning]);

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStatus("Contacting RPCs...");

    const controller = new AbortController();
    abortControllerRef.current = controller;

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
    const progressInterval = setInterval(() => {
      if (currentStep < statuses.length - 1) {
        currentStep++;
        setScanStatus(statuses[currentStep]);
      }
    }, 1500);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        signal: controller.signal,
      });
      const result = await response.json();
      
      clearInterval(progressInterval);

      if (result.success && result.data) {
        setScanStatus("Scan complete!");
        setTimeLeft(1800); // Reset timer to 30 minutes on successful scan
        setTimeout(() => {
          onRefresh(result.data);
          setIsScanning(false);
          setScanStatus("");
        }, 1000);
      } else {
        throw new Error(result.error || "Failed scan");
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      if (err.name === "AbortError") {
        setScanStatus("Scan aborted.");
        setTimeLeft((prev) => (prev <= 5 ? 1800 : prev)); // Retain previous countdown time on abort
        setTimeout(() => {
          setIsScanning(false);
          setScanStatus("");
        }, 1000);
      } else {
        console.error(err);
        setScanStatus("Scan failed! RPC rate-limit.");
        setTimeLeft(1800); // Reset timer even on failure to avoid loop
        setTimeout(() => {
          setIsScanning(false);
          setScanStatus("");
        }, 3000);
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleStopScan = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Helper to format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
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
              Deposit Status
            </span>
            <span className="text-xs font-mono text-zinc-400 font-medium">
              Last Updated: <span className="text-white font-semibold">{timeAgo}</span>
            </span>
            <span className="text-[10px] font-mono text-neon-cyan/70 mt-0.5">
              Next Auto Update: <span className="text-white font-bold">{formatTime(timeLeft)}</span>
            </span>
          </div>

          {/* Refresh/Scan Button */}
          <button
            onClick={isScanning ? handleStopScan : handleScan}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-space font-semibold text-sm transition-all duration-300 cursor-pointer
              ${
                isScanning
                  ? "bg-zinc-950 border border-red-500/35 text-red-400 hover:text-red-300 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                  : "bg-zinc-950 border border-zinc-800 hover:border-neon-cyan/40 text-white shadow-[0_0_20px_rgba(0,245,255,0.02)] hover:shadow-neon-cyan-hover hover:text-neon-cyan"
              }
            `}
          >
            {isScanning ? (
              <Square size={10} className="fill-red-400 stroke-red-400 animate-pulse" />
            ) : (
              <RefreshCw
                size={14}
                className="transition-transform duration-500"
              />
            )}
            {isScanning ? "Stop Scan" : "Refresh Scan"}
          </button>
        </div>
      </div>
    </header>
  );
}
