"use client"

import { useEffect, useRef, useState } from "react"
import { createChart, ColorType } from "lightweight-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartDataPoint {
  time: string
  open: number
  high: number
  low: number
  close: number
}

type TokenSymbol = "solana" | "bitcoin" | "ethereum"

export function TradingChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedToken, setSelectedToken] = useState<TokenSymbol>("solana")
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("30d")

  const tokenConfig = {
    solana: { name: "Solana (SOL)", color: "#a78bfa" },
    bitcoin: { name: "Bitcoin (BTC)", color: "#f97316" },
    ethereum: { name: "Ethereum (ETH)", color: "#3b82f6" },
  }

  useEffect(() => {
    if (!containerRef.current) return

    const fetchAndRenderChart = async () => {
      try {
        setLoading(true)
        setError(null)

        const days = timeRange === "7d" ? "7" : "30"
        
        // Try higher resolution data from Binance (more accurate)
        let chartData: ChartDataPoint[] = []
        
        try {
          const klineInterval = timeRange === "7d" ? "4h" : "1d" // 4 hourly for 7d, daily for 30d
          const symbol = 
            selectedToken === "solana" ? "SOLUSDT" : 
            selectedToken === "bitcoin" ? "BTCUSDT" : 
            "ETHUSDT"
          
          const limit = timeRange === "7d" ? 42 : 30 // Roughly covers the period
          
          const response = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${klineInterval}&limit=${limit}`,
            { signal: AbortSignal.timeout(5000) }
          )

          if (response.ok) {
            const data = await response.json()
            chartData = data.map((kline: any[]) => {
              const date = new Date(kline[0])
              const dateString = date.toISOString().split("T")[0]
              
              return {
                time: dateString,
                open: parseFloat(kline[1]),
                high: parseFloat(kline[2]),
                low: parseFloat(kline[3]),
                close: parseFloat(kline[4]),
              }
            })
          }
        } catch (binanceErr) {
          console.warn("Binance chart failed, falling back to CoinGecko:", binanceErr)
        }

        // Fallback to CoinGecko if Binance fails
        if (chartData.length === 0) {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${selectedToken}/market_chart?vs_currency=usd&days=${days}&interval=${timeRange === "7d" ? "daily" : "daily"}`,
            { signal: AbortSignal.timeout(5000) }
          )
          const data = await response.json()

          if (!data.prices || data.prices.length === 0) {
            throw new Error("No data received from API")
          }

          // Convert API data to candlestick format
          const prices = data.prices as [number, number][]
          
          for (let i = 0; i < prices.length; i++) {
            const [timestamp, price] = prices[i]
            const date = new Date(timestamp)
            const dateString = date.toISOString().split("T")[0]

            // Estimate OHLC from price movements
            const change = prices[i - 1] ? price - prices[i - 1][1] : 0
            const variation = Math.abs(change) * 0.5

            chartData.push({
              time: dateString,
              open: prices[i - 1] ? prices[i - 1][1] : price,
              high: Math.max(prices[i - 1] ? prices[i - 1][1] : price, price) + variation,
              low: Math.min(prices[i - 1] ? prices[i - 1][1] : price, price) - variation,
              close: price,
            })
          }
        }

        if (!containerRef.current) return

        // Create chart
        const chart = createChart(containerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: "#1a1a2e" },
            textColor: "#d1d5db",
          },
          width: containerRef.current.clientWidth,
          height: 400,
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
            fixLeftEdge: true,
          },
        })

        // Add candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
          upColor: "#10b981",
          downColor: "#ef4444",
          borderUpColor: "#10b981",
          borderDownColor: "#ef4444",
          wickUpColor: "#10b981",
          wickDownColor: "#ef4444",
        })

        candlestickSeries.setData(chartData)

        // Calculate and add Simple Moving Average (20-period)
        if (chartData.length > 20) {
          const sma20: ChartDataPoint[] = []
          
          for (let i = 19; i < chartData.length; i++) {
            let sum = 0
            for (let j = 0; j < 20; j++) {
              sum += chartData[i - j].close
            }
            const average = sum / 20
            sma20.push({
              ...chartData[i],
              close: average,
              open: average,
              high: average,
              low: average,
            })
          }

          const lineSeries = chart.addLineSeries({
            color: tokenConfig[selectedToken].color,
            lineWidth: 2,
            title: "SMA(20)",
          })

          lineSeries.setData(sma20)
        }

        // Set data range to show all candles
        chart.timeScale().fitContent()

        // Handle window resize
        const handleResize = () => {
          if (containerRef.current) {
            chart.applyOptions({ width: containerRef.current.clientWidth })
          }
        }

        window.addEventListener("resize", handleResize)

        setLoading(false)

        return () => {
          window.removeEventListener("resize", handleResize)
          chart.remove()
        }
      } catch (err) {
        console.error("Chart fetch error:", err)
        setError("Failed to load chart data. Please try again.")
        setLoading(false)
      }
    }

    fetchAndRenderChart()
  }, [selectedToken, timeRange])

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Market Chart</CardTitle>
            <p className="text-sm text-slate-400 mt-1">Real-time candlestick data</p>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              {(["7d", "30d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    timeRange === range
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {range === "7d" ? "7D" : "30D"}
                </button>
              ))}
            </div>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value as TokenSymbol)}
              className="px-3 py-1 rounded text-sm bg-slate-700 text-white border border-slate-600 cursor-pointer hover:bg-slate-600"
            >
              <option value="solana">Solana (SOL)</option>
              <option value="bitcoin">Bitcoin (BTC)</option>
              <option value="ethereum">Ethereum (ETH)</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400 text-sm mb-4">
            {error}
          </div>
        )}
        {loading && (
          <div className="h-96 bg-slate-800 rounded animate-pulse flex items-center justify-center">
            <p className="text-slate-400">Loading chart data...</p>
          </div>
        )}
        {!loading && !error && <div ref={containerRef} className="w-full" />}
        {!loading && !error && (
          <p className="text-xs text-slate-500 mt-4 text-center">
            Displaying {selectedToken.toUpperCase()} • Time Range: {timeRange} • SMA(20) included
          </p>
        )}
      </CardContent>
    </Card>
  )
}
