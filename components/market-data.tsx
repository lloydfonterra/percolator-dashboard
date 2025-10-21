"use client"

import { MarketChart } from "./market-chart"
import { MarketStats } from "./market-stats"
import { MarketMovers } from "./market-movers"

export function MarketData() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Market Data</h1>
        <p className="text-muted-foreground">Real-time market information and price charts</p>
      </div>

      <MarketChart />
      <MarketStats />
      <MarketMovers />
    </div>
  )
}
