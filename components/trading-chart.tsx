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

export function TradingChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const fetchAndRenderChart = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch real historical data from CoinGecko
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=30&interval=daily"
        )
        const data = await response.json()

        if (!data.prices || data.prices.length === 0) {
          throw new Error("No data received from API")
        }

        // Convert API data to candlestick format
        // CoinGecko returns [timestamp, price] so we'll group data into OHLC
        const prices = data.prices as [number, number][]
        const chartData: ChartDataPoint[] = []

        // Group prices into candlesticks (using daily data)
        for (let i = 0; i < prices.length; i++) {
          const [timestamp, price] = prices[i]
          const date = new Date(timestamp)
          const dateString = date.toISOString().split("T")[0]

          // For daily data, use the price as close and estimate OHLC
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

        // Add moving average (20-day SMA)
        const maPeriod = 20
        const maData = chartData
          .filter((_, i) => i >= maPeriod - 1)
          .map((_, i) => {
            const sum = chartData
              .slice(i - maPeriod + 1, i + 1)
              .reduce((acc, val) => acc + val.close, 0)
            return {
              time: chartData[i + maPeriod - 1].time,
              value: sum / maPeriod,
            }
          })

        const lineSeries = chart.addLineSeries({
          color: "#3b82f6",
          lineWidth: 2,
        })

        lineSeries.setData(maData)

        // Fit content
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
        console.error("Chart rendering error:", err)
        setError("Failed to load chart data")
        setLoading(false)
      }
    }

    const cleanup = fetchAndRenderChart()

    return () => {
      if (cleanup) {
        cleanup.then((fn) => fn && fn())
      }
    }
  }, [])

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">SOL/USDT - 30 Day Chart</CardTitle>
          <span className="text-xs text-slate-400">Real-time data from CoinGecko</span>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="w-full bg-slate-950 rounded-lg flex items-center justify-center" style={{ height: "400px" }}>
            <div className="text-slate-400 text-sm">Loading chart data...</div>
          </div>
        )}
        {error && (
          <div className="w-full bg-slate-950 rounded-lg flex items-center justify-center p-4" style={{ height: "400px" }}>
            <div className="text-red-400 text-sm text-center">{error}</div>
          </div>
        )}
        {!loading && !error && (
          <div
            ref={containerRef}
            className="w-full bg-slate-950 rounded-lg overflow-hidden"
            style={{ height: "400px" }}
          />
        )}
      </CardContent>
    </Card>
  )
}
