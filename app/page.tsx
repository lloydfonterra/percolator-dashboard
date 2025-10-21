"use client"

import { useState } from "react"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { WalletConnect } from "@/components/wallet-connect"
import { Dashboard } from "@/components/dashboard"
import { TradingInterface } from "@/components/trading-interface"
import { PositionManager } from "@/components/position-manager"
import { MarketData } from "@/components/market-data"
import { LiquidityPools } from "@/components/liquidity-pools"

export default function Home() {
  const { isConnected, disconnect, publicKey, balance, isHydrated } = useWalletAuth()
  const [activeTab, setActiveTab] = useState<"dashboard" | "trade" | "positions" | "market" | "liquidity">("dashboard")

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 rounded-lg bg-primary mx-auto"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return <WalletConnect onConnect={() => {}} />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary"></div>
            <h1 className="text-xl font-bold">Solana Perpetual DEX</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <p className="text-muted-foreground">Balance</p>
              <p className="font-semibold">{balance?.toFixed(4) || "0.0000"} SOL</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-muted-foreground">Wallet</p>
              <p className="font-mono text-xs">
                {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
              </p>
            </div>
            <button
              onClick={disconnect}
              className="rounded-lg bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="w-48 border-r border-border bg-sidebar">
          <div className="space-y-2 p-4">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "trade", label: "Trade" },
              { id: "positions", label: "Positions" },
              { id: "market", label: "Market Data" },
              { id: "liquidity", label: "Liquidity Pools" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <main className="flex-1 overflow-auto">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "trade" && <TradingInterface />}
          {activeTab === "positions" && <PositionManager />}
          {activeTab === "market" && <MarketData />}
          {activeTab === "liquidity" && <LiquidityPools />}
        </main>
      </div>
    </div>
  )
}
