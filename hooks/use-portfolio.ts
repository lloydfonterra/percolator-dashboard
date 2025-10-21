"use client"

import { useEffect, useState } from "react"
import { useWalletAuth } from "./use-wallet-auth"

export interface Position {
  id: string
  pair: string
  type: "long" | "short"
  size: number
  entryPrice: number
  currentPrice: number
  leverage: number
  pnl: number
  pnlPercent: number
  liquidationPrice: number
}

export interface PortfolioStats {
  totalBalance: number
  unrealizedPnL: number
  unrealizedPnLPercent: number
  totalVolume24h: number
  winRate: number
  openPositions: number
  liquidationRisk: "safe" | "warning" | "danger"
  liquidationPrice: number
}

export function usePortfolio() {
  const { isConnected, balance } = useWalletAuth()
  const [positions, setPositions] = useState<Position[]>([])
  const [stats, setStats] = useState<PortfolioStats>({
    totalBalance: 0,
    unrealizedPnL: 0,
    unrealizedPnLPercent: 0,
    totalVolume24h: 0,
    winRate: 0,
    openPositions: 0,
    liquidationRisk: "safe",
    liquidationPrice: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isConnected || !balance) return

    setIsLoading(true)

    // Simulate fetching portfolio data
    const mockPositions: Position[] = [
      {
        id: "1",
        pair: "SOL/USDC",
        type: "long",
        size: 10,
        entryPrice: 145.2,
        currentPrice: 148.5,
        leverage: 5,
        pnl: 330,
        pnlPercent: 2.27,
        liquidationPrice: 120.5,
      },
      {
        id: "2",
        pair: "BTC/USDC",
        type: "long",
        size: 0.5,
        entryPrice: 42500,
        currentPrice: 43200,
        leverage: 3,
        pnl: 350,
        pnlPercent: 1.64,
        liquidationPrice: 38200,
      },
      {
        id: "3",
        pair: "ETH/USDC",
        type: "short",
        size: 5,
        entryPrice: 2450,
        currentPrice: 2420,
        leverage: 4,
        pnl: 150,
        pnlPercent: 1.23,
        liquidationPrice: 2650,
      },
    ]

    const totalPnL = mockPositions.reduce((sum, pos) => sum + pos.pnl, 0)
    const totalPnLPercent = (totalPnL / (balance * 1000)) * 100

    setPositions(mockPositions)
    setStats({
      totalBalance: balance * 1000 + totalPnL,
      unrealizedPnL: totalPnL,
      unrealizedPnLPercent: totalPnLPercent,
      totalVolume24h: 125000,
      winRate: 72,
      openPositions: mockPositions.length,
      liquidationRisk: "safe",
      liquidationPrice: 8500,
    })

    setIsLoading(false)
  }, [isConnected, balance])

  return { positions, stats, isLoading }
}
