"use client"

import { useEffect, useRef } from "react"
import { createChart, ColorType } from "lightweight-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TradingChart() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

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
      upColor: "#4caf50",
      downColor: "#f44336",
      borderUpColor: "#4caf50",
      borderDownColor: "#f44336",
      wickUpColor: "#4caf50",
      wickDownColor: "#f44336",
    })

    // Sample data - in production, fetch from your API
    const sampleData = [
      { time: "2025-01-01", open: 100, high: 105, low: 95, close: 102 },
      { time: "2025-01-02", open: 102, high: 110, low: 100, close: 108 },
      { time: "2025-01-03", open: 108, high: 115, low: 105, close: 112 },
      { time: "2025-01-04", open: 112, high: 118, low: 110, close: 115 },
      { time: "2025-01-05", open: 115, high: 120, low: 112, close: 118 },
      { time: "2025-01-06", open: 118, high: 125, low: 115, close: 122 },
      { time: "2025-01-07", open: 122, high: 128, low: 120, close: 125 },
      { time: "2025-01-08", open: 125, high: 130, low: 123, close: 128 },
      { time: "2025-01-09", open: 128, high: 135, low: 126, close: 132 },
      { time: "2025-01-10", open: 132, high: 138, low: 130, close: 135 },
    ]

    candlestickSeries.setData(sampleData)

    // Add line series for moving average
    const lineSeries = chart.addLineSeries({
      color: "#1e88e5",
      lineWidth: 2,
    })

    const maData = sampleData.map((item) => ({
      time: item.time,
      value: (item.open + item.high + item.low + item.close) / 4,
    }))

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

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.remove()
    }
  }, [])

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">SOL/USDT Trading Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="w-full bg-slate-950 rounded-lg overflow-hidden"
          style={{ height: "400px" }}
        />
      </CardContent>
    </Card>
  )
}
