"use client"

import { useState, useEffect } from "react"

export interface MarketAsset {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  high24h: number
  low24h: number
  marketCap: number
  dominance: number
}

export interface ChartData {
  time: string
  price: number
}

export function useMarketData() {
  const [assets, setAssets] = useState<MarketAsset[]>([])
  const [selectedAsset, setSelectedAsset] = useState("SOL")
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d">("1h")
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    // Mock market data
    const mockAssets: MarketAsset[] = [
      {
        symbol: "SOL",
        name: "Solana",
        price: 149.2,
        change24h: 2.8,
        volume24h: 2.4e9,
        high24h: 150.5,
        low24h: 144.2,
        marketCap: 68e9,
        dominance: 2.1,
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        price: 43500,
        change24h: 1.2,
        volume24h: 28.5e9,
        high24h: 44200,
        low24h: 42100,
        marketCap: 850e9,
        dominance: 48.5,
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        price: 2520,
        change24h: 3.1,
        volume24h: 15.2e9,
        high24h: 2580,
        low24h: 2420,
        marketCap: 302e9,
        dominance: 17.2,
      },
      {
        symbol: "ORCA",
        name: "Orca",
        price: 0.85,
        change24h: -1.5,
        volume24h: 45e6,
        high24h: 0.88,
        low24h: 0.82,
        marketCap: 250e6,
        dominance: 0.01,
      },
    ]

    setAssets(mockAssets)

    // Generate mock chart data based on timeframe
    const generateChartData = () => {
      const data: ChartData[] = []
      const basePrice = mockAssets.find((a) => a.symbol === selectedAsset)?.price || 100
      const points = timeframe === "1m" ? 60 : timeframe === "5m" ? 60 : timeframe === "15m" ? 60 : 24

      for (let i = 0; i < points; i++) {
        const variation = (Math.random() - 0.5) * 2
        const price = basePrice * (1 + variation / 100)
        const timeLabel =
          timeframe === "1d"
            ? `${i}:00`
            : timeframe === "4h"
              ? `${i * 4}:00`
              : timeframe === "1h"
                ? `${i}:00`
                : `${i}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`

        data.push({ time: timeLabel, price })
      }
      return data
    }

    setChartData(generateChartData())
    setIsLoading(false)
  }, [selectedAsset, timeframe])

  const topGainers = assets.sort((a, b) => b.change24h - a.change24h).slice(0, 3)
  const topLosers = assets.sort((a, b) => a.change24h - b.change24h).slice(0, 3)

  return {
    assets,
    selectedAsset,
    setSelectedAsset,
    timeframe,
    setTimeframe,
    chartData,
    isLoading,
    topGainers,
    topLosers,
  }
}
