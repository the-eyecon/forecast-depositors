"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { GrowthDataPoint } from "../../types/dashboard";
import { TrendingUp } from "lucide-react";

interface GrowthChartProps {
  data: GrowthDataPoint[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
  // Custom styled Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950/90 border border-zinc-800 p-4 rounded-lg shadow-2xl font-mono text-xs backdrop-blur-xl">
          <p className="text-zinc-400 font-bold mb-2 uppercase tracking-wider">{payload[0].payload.date}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-6">
              <span className="text-neon-cyan font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded bg-neon-cyan" /> Base
              </span>
              <span className="text-white font-bold">${payload[0].payload.baseUSDC.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-neon-purple font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded bg-neon-purple" /> Ethereum
              </span>
              <span className="text-white font-bold">${payload[0].payload.ethUSDC.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-6 border-t border-zinc-900 pt-1.5 mt-1.5">
              <span className="text-neon-lime font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded bg-neon-lime" /> Total USDC
              </span>
              <span className="text-neon-lime font-bold">${payload[0].payload.totalUSDC.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-zinc-950/70 border border-zinc-900 backdrop-blur-xl p-6 flex flex-col justify-between h-[340px] shadow-[0_0_30px_rgba(0,0,0,0.3)]">
      {/* Title block */}
      <div className="flex items-center justify-between w-full mb-4">
        <div>
          <h3 className="font-space text-base font-bold text-white tracking-wide flex items-center gap-2">
            <TrendingUp size={16} className="text-neon-cyan" />
            <span>Deposit Growth Velocity</span>
          </h3>
          <p className="text-[11px] text-zinc-500 font-sans mt-0.5 font-medium">
            Cumulative USDC progression timeline
          </p>
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="baseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00F5FF" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="ethGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#121214" opacity={0.5} />

            <XAxis
              dataKey="date"
              stroke="#4b5563"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              fontFamily="var(--font-geist-mono)"
            />
            <YAxis
              stroke="#4b5563"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              fontFamily="var(--font-geist-mono)"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />

            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={8}
              fontFamily="var(--font-geist-sans)"
              wrapperStyle={{ fontSize: "11px", color: "#9ca3af" }}
            />

            <Area
              type="monotone"
              name="Base USDC"
              dataKey="baseUSDC"
              stroke="#00F5FF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#baseGradient)"
            />
            <Area
              type="monotone"
              name="Ethereum USDC"
              dataKey="ethUSDC"
              stroke="#8B5CF6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#ethGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
