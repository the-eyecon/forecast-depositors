"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { WalletData } from "../../types/dashboard";
import { cn } from "../../lib/utils";

interface WalletTableProps {
  wallets: WalletData[];
  onSelectWallet: (wallet: WalletData) => void;
}

export default function WalletTable({ wallets, onSelectWallet }: WalletTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter wallets based on address search
  const filteredWallets = useMemo(() => {
    return wallets.filter((wallet) =>
      wallet.address.toLowerCase().includes(search.toLowerCase())
    );
  }, [wallets, search]);

  // Reset pagination on search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredWallets.length / itemsPerPage));
  const paginatedWallets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredWallets.slice(start, start + itemsPerPage);
  }, [filteredWallets, currentPage]);

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 8)}`;
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-zinc-950/70 border border-zinc-900 backdrop-blur-xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="font-space text-lg font-bold text-white tracking-wide">
            Wallet Explorer Table
          </h3>
          <p className="text-xs text-zinc-500 font-sans mt-0.5 font-medium">
            Search and analyze individual depositor records
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search address..."
            value={search}
            onChange={handleSearchChange}
            className="
              w-full bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 focus:border-neon-cyan/40
              focus:ring-1 focus:ring-neon-cyan/20 rounded-lg py-2 pl-9 pr-4 text-xs font-mono text-white placeholder-zinc-600
              outline-none transition-all duration-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]
            "
          />
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto border border-zinc-900/60 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-950/50">
              <th className="p-4 text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-500">Wallet</th>
              <th className="p-4 text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-500">Chains</th>
              <th className="p-4 text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-500 text-center">Total Deposits</th>
              <th className="p-4 text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-500 text-right">Total USDC</th>
              <th className="p-4 text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-500 text-right">Last Deposit</th>
              <th className="p-4 text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-500 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/40">
            {paginatedWallets.map((wallet) => (
              <tr
                key={wallet.address}
                onClick={() => onSelectWallet(wallet)}
                className="
                  group hover:bg-zinc-900/20 cursor-pointer transition-colors duration-250
                "
              >
                {/* Address */}
                <td className="p-4 font-mono text-xs text-zinc-300 group-hover:text-neon-cyan transition-colors">
                  {truncateAddress(wallet.address)}
                </td>

                {/* Chains used */}
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    {wallet.chains.map((chain) => (
                      <span
                        key={chain}
                        className={cn(
                          "text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border",
                          chain === "base"
                            ? "bg-neon-cyan/5 border-neon-cyan/20 text-neon-cyan"
                            : "bg-neon-purple/5 border-neon-purple/20 text-neon-purple"
                        )}
                      >
                        {chain}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Deposit Count */}
                <td className="p-4 text-center font-mono text-xs text-zinc-300 font-medium">
                  {wallet.totalDeposits} txs
                </td>

                {/* Total Value */}
                <td className="p-4 text-right font-mono text-xs text-white font-bold text-glow-lime">
                  ${wallet.totalUSDC.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </td>

                {/* Last estimated timestamp */}
                <td className="p-4 text-right font-mono text-xs text-zinc-400">
                  {wallet.lastDeposit}
                </td>

                {/* Action button */}
                <td className="p-4 text-center">
                  <button className="p-1.5 rounded-md bg-zinc-900/40 group-hover:bg-neon-cyan/10 border border-zinc-900 group-hover:border-neon-cyan/35 text-zinc-500 group-hover:text-neon-cyan transition-all duration-300">
                    <Eye size={12} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredWallets.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-600 font-mono text-xs">
                  No records found matching search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredWallets.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-5 font-mono text-xs text-zinc-500">
          <span>
            Showing <span className="text-zinc-300">{Math.min(filteredWallets.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{" "}
            <span className="text-zinc-300">{Math.min(filteredWallets.length, currentPage * itemsPerPage)}</span> of{" "}
            <span className="text-zinc-300">{filteredWallets.length}</span> wallets
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="
                p-1.5 rounded bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40
                disabled:pointer-events-none cursor-pointer transition-colors
              "
            >
              <ChevronLeft size={14} />
            </button>
            <span>
              Page <span className="text-zinc-200">{currentPage}</span> of{" "}
              <span className="text-zinc-400">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="
                p-1.5 rounded bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40
                disabled:pointer-events-none cursor-pointer transition-colors
              "
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
